#!/usr/bin/env node
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { CODEX_DEFINITION, runCodex } from '../packages/adapters/src/codex.ts';
import { CLAUDE_DEFINITION, claudeSupportsRestricted, runClaude } from '../packages/adapters/src/claude.ts';
import { discoverAdapter, resolveExecutable } from '../packages/adapters/src/discovery.ts';
import { BASELINE_GOLD_CASES, OPTIONAL_CLAIM_CASES, makeConformanceRecord } from '../packages/adapters/src/conformance.ts';
import { platformId } from '../packages/adapters/src/types.ts';
import { superviseProcess } from '../packages/runtime/src/process.ts';

const REPO_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OPTIONAL_CASES = Object.values(OPTIONAL_CLAIM_CASES).flat();
const CASES = new Set([...BASELINE_GOLD_CASES, ...OPTIONAL_CASES]);

function usage() {
  console.error('Usage: node scripts/adapter-conformance.mjs --adapter <codex|claude> --case <case-id> [--model <model>]');
}

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === '--adapter' || key === '--case' || key === '--model') {
      const value = argv[index + 1];
      if (!value) throw new Error(`${key} requires a value`);
      values[key.slice(2)] = value;
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${key}`);
  }
  if (!values.adapter || !values.case) throw new Error('adapter and case are required');
  if (values.adapter !== 'codex' && values.adapter !== 'claude') throw new Error('adapter must be codex or claude');
  if (!CASES.has(values.case)) throw new Error(`unsupported case: ${values.case}`);
  return values;
}

function runGit(args, cwd, allowFailure = false) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8', shell: false });
  if (!allowFailure && result.status !== 0) throw new Error(`git ${args[0]} failed with ${result.status ?? 'null'}`);
  return result;
}

function gitText(args, cwd) {
  return runGit(args, cwd).stdout.trim();
}

function gitRefs(cwd) {
  return gitText(['for-each-ref', '--format=%(refname) %(objectname)'], cwd);
}

async function fileContains(path, marker) {
  try { return (await readFile(path, 'utf8')).includes(marker); } catch { return false; }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanEnvironment(exclude = () => false) {
  const environment = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (typeof value !== 'string' || value.includes('\0')) continue;
    if (!key || key.includes('\0') || key.includes('=')) continue;
    if (!exclude(key)) environment[key] = value;
  }
  return environment;
}

function sensitiveAuthKey(adapter, key) {
  const upper = key.toUpperCase();
  if (adapter === 'codex') return upper === 'OPENAI_API_KEY' || upper === 'CODEX_API_KEY' || upper === 'CODEX_ACCESS_TOKEN';
  return upper === 'ANTHROPIC_API_KEY'
    || upper === 'ANTHROPIC_AUTH_TOKEN'
    || upper === 'CLAUDE_CODE_OAUTH_TOKEN'
    || upper === 'AWS_ACCESS_KEY_ID'
    || upper === 'AWS_SECRET_ACCESS_KEY'
    || upper === 'AWS_SESSION_TOKEN'
    || upper === 'GOOGLE_APPLICATION_CREDENTIALS'
    || upper === 'CLAUDE_CODE_USE_BEDROCK'
    || upper === 'CLAUDE_CODE_USE_VERTEX'
    || upper === 'CLAUDE_CODE_USE_FOUNDRY';
}

async function isolatedUnauthenticatedEnvironment(adapter, tempRoot) {
  const environment = cleanEnvironment((key) => sensitiveAuthKey(adapter, key));
  if (adapter === 'codex') {
    const home = join(tempRoot, 'codex-empty-home');
    await mkdir(home, { recursive: true });
    environment.CODEX_HOME = home;
  } else {
    const config = join(tempRoot, 'claude-empty-config');
    await mkdir(config, { recursive: true });
    environment.CLAUDE_CONFIG_DIR = config;
  }
  return environment;
}

function transportFailureEnvironment() {
  const environment = cleanEnvironment();
  const deadProxy = 'http://127.0.0.1:9';
  for (const key of ['HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'http_proxy', 'https_proxy', 'all_proxy']) environment[key] = deadProxy;
  environment.NO_PROXY = '';
  environment.no_proxy = '';
  return environment;
}

async function authState(adapter, discovery, cwd, environment) {
  const args = adapter === 'codex' ? ['login', 'status'] : ['auth', 'status'];
  const result = await superviseProcess({
    command: discovery.executablePath,
    args,
    cwd,
    environment: environment === undefined ? { mode: 'INHERIT' } : { mode: 'EXACT', values: environment },
    timeoutMs: 15_000,
    outputLimitBytes: 16 * 1024,
  }).result;
  if (result.cause !== 'EXITED') return 'UNKNOWN';
  if (result.exitCode === 0) return 'AUTHENTICATED';
  if (result.exitCode === 1) return 'UNAUTHENTICATED';
  return 'UNKNOWN';
}

function startAgent(adapter, discovery, cwd, options = {}) {
  const request = {
    adapterId: adapter === 'codex' ? 'openai-codex-cli' : 'anthropic-claude-code',
    cwd,
    prompt: options.prompt ?? 'Reply with exactly DELETHOS_OK and do not modify files.',
    posture: options.posture ?? 'WRITE',
    timeoutMs: options.timeoutMs ?? 120_000,
    stallMs: options.stallMs,
    terminationGraceMs: 400,
    outputLimitBytes: options.outputLimitBytes ?? 1024 * 1024,
    environment: options.environment,
    model: options.model,
    configurationPosture: adapter === 'claude' ? (options.configurationPosture ?? 'CONTROLLED_STANDARD') : 'NOT_APPLICABLE',
    sessionId: options.sessionId,
  };
  return adapter === 'codex' ? runCodex(request, discovery) : runClaude(request, discovery);
}

async function gitObservation(repo, baselineHead, baselineRefs, marker = null) {
  const head = gitText(['rev-parse', 'HEAD'], repo);
  const refs = gitRefs(repo);
  const status = gitText(['status', '--porcelain=v1', '--untracked-files=all'], repo);
  return {
    headUnchanged: head === baselineHead,
    refsUnchanged: refs === baselineRefs,
    worktreeDirty: status.length > 0,
    markerObserved: marker === null ? null : await fileContains(join(repo, 'fixture.txt'), marker),
    status,
  };
}

function facts(result, observation, markerObserved = observation.markerObserved) {
  if (!result) {
    return {
      adapterStatus: null,
      processCause: null,
      exitCode: null,
      terminationStrategy: null,
      terminationAttempted: null,
      cleanupStatus: null,
      elapsedMs: null,
      stdoutBytes: null,
      stderrBytes: null,
      retainedBytes: null,
      outputTruncated: null,
      headUnchanged: observation.headUnchanged,
      refsUnchanged: observation.refsUnchanged,
      worktreeDirty: observation.worktreeDirty,
      markerObserved,
      finalMessagePresent: null,
    };
  }
  return {
    adapterStatus: result.status,
    processCause: result.processCause,
    exitCode: result.exitCode,
    terminationStrategy: result.terminationStrategy,
    terminationAttempted: result.terminationAttempted,
    cleanupStatus: result.cleanupStatus,
    elapsedMs: Math.round(result.elapsedMs),
    stdoutBytes: result.stdoutBytes,
    stderrBytes: result.stderrBytes,
    retainedBytes: result.retainedBytes,
    outputTruncated: result.outputTruncated,
    headUnchanged: observation.headUnchanged,
    refsUnchanged: observation.refsUnchanged,
    worktreeDirty: observation.worktreeDirty,
    markerObserved,
    finalMessagePresent: result.finalMessage !== null,
  };
}

function outcomeExit(outcome) {
  if (outcome === 'PASS') return 0;
  if (outcome === 'UNAVAILABLE') return 3;
  if (outcome === 'UNVERIFIED') return 4;
  return 1;
}

async function main() {
  let selected;
  try { selected = parseArgs(process.argv.slice(2)); } catch (error) {
    usage();
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 2;
    return;
  }

  const adapterId = selected.adapter === 'codex' ? 'openai-codex-cli' : 'anthropic-claude-code';
  const definition = selected.adapter === 'codex' ? CODEX_DEFINITION : CLAUDE_DEFINITION;
  const revision = gitText(['rev-parse', 'HEAD'], REPO_ROOT);
  const tempRoot = await mkdtemp(join(tmpdir(), 'delethos-adapter-conformance-'));
  const repo = join(tempRoot, 'repo space [hash#]');
  let discovery = null;
  let baselineHead = '0'.repeat(40);
  let baselineRefs = '';

  const observe = (marker = null) => gitObservation(repo, baselineHead, baselineRefs, marker);
  const emit = (outcome, detail, factsValue = null, discoveryValue = discovery) => {
    const record = makeConformanceRecord({
      source: 'REAL_CLI',
      adapterId,
      delethosRevision: revision,
      executablePath: discoveryValue?.executablePath ?? null,
      cliVersion: discoveryValue?.cliVersion ?? null,
      platform: platformId(),
      arch: process.arch,
      caseId: selected.case,
      outcome,
      detail,
      facts: factsValue,
    });
    process.stdout.write(`${JSON.stringify(record)}\n`);
    process.exitCode = outcomeExit(outcome);
  };

  try {
    await mkdir(repo, { recursive: true });
    runGit(['init', '-b', 'main'], repo);
    runGit(['config', 'user.name', 'Delethos Conformance'], repo);
    runGit(['config', 'user.email', 'conformance@delethos.invalid'], repo);
    await writeFile(join(repo, 'fixture.txt'), 'BASELINE\n', 'utf8');
    await writeFile(join(repo, 'cwd-proof.txt'), `CWD_PROOF_${process.pid}\n`, 'utf8');
    runGit(['add', '.'], repo);
    runGit(['commit', '-m', 'fixture baseline'], repo);
    baselineHead = gitText(['rev-parse', 'HEAD'], repo);
    baselineRefs = gitRefs(repo);

    if (selected.case === 'missing-binary') {
      const missing = await resolveExecutable(`delethos-definitely-missing-${process.pid}`, '');
      const observation = await observe();
      emit(missing.state === 'NOT_INSTALLED' && observation.headUnchanged && observation.refsUnchanged ? 'PASS' : 'FAIL', `missing-state=${missing.state}`, facts(null, observation), null);
      return;
    }

    discovery = await discoverAdapter(definition, repo);
    if (discovery.state !== 'DISCOVERED') {
      const observation = await observe();
      emit('UNAVAILABLE', `discovery=${discovery.state}`, facts(null, observation));
      return;
    }

    if (selected.case === 'discovery-version' || selected.case === 'platform-launch') {
      const observation = await observe();
      const pass = observation.headUnchanged && observation.refsUnchanged && !observation.worktreeDirty;
      emit(pass ? 'PASS' : 'FAIL', `discovery=${discovery.state}`, facts(null, observation));
      return;
    }

    if (selected.case === 'auth-failure') {
      const environment = await isolatedUnauthenticatedEnvironment(selected.adapter, tempRoot);
      const state = await authState(selected.adapter, discovery, repo, environment);
      if (state === 'AUTHENTICATED') {
        const observation = await observe();
        emit('UNVERIFIED', 'isolated auth status remained authenticated; destructive logout is not authorized', facts(null, observation));
        return;
      }
      if (state !== 'UNAUTHENTICATED') {
        const observation = await observe();
        emit('UNVERIFIED', `isolated auth status=${state}`, facts(null, observation));
        return;
      }
      const result = await startAgent(selected.adapter, discovery, repo, { environment, prompt: 'Reply with DELETHOS_AUTH_NEGATIVE only. Do not modify files.' }).result;
      const observation = await observe();
      const pass = result.status === 'AUTH_FAILED' && observation.headUnchanged && observation.refsUnchanged && !observation.worktreeDirty;
      emit(pass ? 'PASS' : 'FAIL', `adapter-status=${result.status}`, facts(result, observation));
      return;
    }

    const credentialState = await authState(selected.adapter, discovery, repo, undefined);
    if (credentialState === 'UNAUTHENTICATED') {
      const observation = await observe();
      emit('UNAVAILABLE', 'credentialed real-CLI qualification environment is not authenticated', facts(null, observation));
      return;
    }
    if (credentialState !== 'AUTHENTICATED') {
      const observation = await observe();
      emit('UNVERIFIED', `credentialed auth status=${credentialState}`, facts(null, observation));
      return;
    }

    if (selected.case === 'write-success') {
      const marker = `DELETHOS_WRITE_${process.pid}`;
      const result = await startAgent(selected.adapter, discovery, repo, { prompt: `Append a new line containing exactly ${marker} to fixture.txt. Do not commit, push, merge, create refs, or change any other file.` }).result;
      const observation = await observe(marker);
      const pass = result.status === 'COMPLETED' && observation.headUnchanged && observation.refsUnchanged && observation.worktreeDirty && observation.markerObserved === true;
      emit(pass ? 'PASS' : 'FAIL', `adapter-status=${result.status}`, facts(result, observation));
      return;
    }

    if (selected.case === 'exact-cwd' || selected.case === 'special-paths') {
      const marker = (await readFile(join(repo, 'cwd-proof.txt'), 'utf8')).trim();
      const result = await startAgent(selected.adapter, discovery, repo, { prompt: 'Read cwd-proof.txt from the current working directory and reply with its exact contents only. Do not modify files or Git refs.' }).result;
      const observation = await observe();
      const markerSeen = result.finalMessage?.includes(marker) ?? false;
      const pass = result.status === 'COMPLETED' && markerSeen && observation.headUnchanged && observation.refsUnchanged && !observation.worktreeDirty;
      emit(pass ? 'PASS' : 'FAIL', `adapter-status=${result.status}`, facts(result, observation, markerSeen));
      return;
    }

    if (selected.case === 'provider-failure') {
      const result = await startAgent(selected.adapter, discovery, repo, {
        environment: transportFailureEnvironment(),
        timeoutMs: 30_000,
        prompt: 'Reply without tools with exactly PROVIDER_FAILURE_PROBE. Do not modify files.',
      }).result;
      const observation = await observe();
      if (result.status === 'AUTH_FAILED') {
        emit('UNAVAILABLE', 'transport-failure probe could not reach an authenticated provider path', facts(result, observation));
        return;
      }
      const pass = result.status === 'PROVIDER_FAILED' && observation.headUnchanged && observation.refsUnchanged && !observation.worktreeDirty;
      emit(pass ? 'PASS' : 'FAIL', `transport-probe-status=${result.status}`, facts(result, observation));
      return;
    }

    if (selected.case === 'malformed-model') {
      const invalidModel = `delethos-invalid-model-${process.pid}`;
      const result = await startAgent(selected.adapter, discovery, repo, { model: invalidModel, prompt: 'Reply with DELETHOS_INVALID_MODEL only. Do not modify files.' }).result;
      const observation = await observe();
      const pass = result.status === 'PROVIDER_FAILED' && observation.headUnchanged && observation.refsUnchanged && !observation.worktreeDirty;
      emit(pass ? 'PASS' : 'FAIL', `adapter-status=${result.status}`, facts(result, observation));
      return;
    }

    if (selected.case === 'timeout') {
      const result = await startAgent(selected.adapter, discovery, repo, { timeoutMs: 1, prompt: 'Read fixture.txt, then reply with DELETHOS_TIMEOUT_PROBE. Do not modify files.' }).result;
      const observation = await observe();
      const pass = result.status === 'TIMED_OUT' && observation.headUnchanged && observation.refsUnchanged && !observation.worktreeDirty;
      emit(pass ? 'PASS' : 'FAIL', `adapter-status=${result.status}`, facts(result, observation));
      return;
    }

    if (selected.case === 'cancel' || selected.case === 'process-tree-cleanup') {
      const handle = startAgent(selected.adapter, discovery, repo, { timeoutMs: 120_000, prompt: 'Read fixture.txt carefully and do not modify files. Reply only after completing the inspection.' });
      setTimeout(() => handle.cancel(), 25);
      const result = await handle.result;
      const observation = await observe();
      let pass = result.status === 'CANCELLED' && observation.headUnchanged && observation.refsUnchanged && !observation.worktreeDirty;
      if (selected.case === 'process-tree-cleanup') pass = pass && result.terminationAttempted && result.cleanupStatus === 'SUCCEEDED' && result.terminationStrategy !== 'NONE';
      emit(pass ? 'PASS' : 'FAIL', `adapter-status=${result.status}; cleanup=${result.cleanupStatus}`, facts(result, observation));
      return;
    }

    if (selected.case === 'missing-final-response') {
      const result = await startAgent(selected.adapter, discovery, repo, {
        outputLimitBytes: 64,
        prompt: 'Reply without tools with DELETHOS_MISSING_FINAL_PROBE followed by at least 200 words. Do not modify files.',
      }).result;
      const observation = await observe();
      const pass = result.status === 'OUTPUT_LIMIT' && result.finalMessage === null && observation.headUnchanged && observation.refsUnchanged && !observation.worktreeDirty;
      emit(pass ? 'PASS' : 'FAIL', `adapter-status=${result.status}; final-present=${result.finalMessage !== null}`, facts(result, observation));
      return;
    }

    if (selected.case === 'partial-diff') {
      const marker = `DELETHOS_PARTIAL_${process.pid}`;
      const handle = startAgent(selected.adapter, discovery, repo, { timeoutMs: 120_000, prompt: `Append a new line containing exactly ${marker} to fixture.txt as your first action. Do not commit, push, merge, create refs, or touch other files. After the edit, continue reading fixture.txt until interrupted.` });
      let settled = false;
      handle.result.finally(() => { settled = true; });
      for (let index = 0; index < 300 && !settled; index += 1) {
        if (await fileContains(join(repo, 'fixture.txt'), marker)) { handle.cancel(); break; }
        await sleep(100);
      }
      const result = await handle.result;
      const observation = await observe(marker);
      const pass = result.status === 'CANCELLED' && observation.headUnchanged && observation.refsUnchanged && observation.markerObserved === true && observation.worktreeDirty;
      emit(pass ? 'PASS' : 'FAIL', `adapter-status=${result.status}`, facts(result, observation));
      return;
    }

    if (selected.case === 'large-output') {
      const result = await startAgent(selected.adapter, discovery, repo, { outputLimitBytes: 1024, prompt: 'Reply without tools with the token DELETHOS_OUTPUT repeated exactly 800 times separated by single spaces. Do not modify files.' }).result;
      const observation = await observe();
      const pass = result.status === 'OUTPUT_LIMIT' && result.outputTruncated && observation.headUnchanged && observation.refsUnchanged && !observation.worktreeDirty;
      emit(pass ? 'PASS' : 'FAIL', `adapter-status=${result.status}; truncated=${result.outputTruncated}`, facts(result, observation));
      return;
    }

    if (selected.case === 'dirty-precondition') {
      await writeFile(join(repo, 'fixture.txt'), 'BASELINE\nPREEXISTING_DIRTY\n', 'utf8');
      const dirtyBefore = gitText(['status', '--porcelain=v1', '--untracked-files=all'], repo);
      const result = await startAgent(selected.adapter, discovery, repo, { prompt: 'Read fixture.txt and reply with exactly DIRTY_OK. Do not modify files, run git, or create refs.' }).result;
      const observation = await observe('PREEXISTING_DIRTY');
      const pass = result.status === 'COMPLETED' && observation.headUnchanged && observation.refsUnchanged && observation.worktreeDirty && observation.markerObserved === true && observation.status === dirtyBefore;
      emit(pass ? 'PASS' : 'FAIL', `adapter-status=${result.status}; dirt-preserved=${observation.status === dirtyBefore}`, facts(result, observation));
      return;
    }

    if (selected.case === 'no-hidden-git-write') {
      const result = await startAgent(selected.adapter, discovery, repo, { prompt: 'Read fixture.txt and reply with exactly NO_GIT_WRITE. Do not modify files and do not commit, push, merge, create branches, tags, stashes, or other refs.' }).result;
      const observation = await observe();
      const pass = result.status === 'COMPLETED' && observation.headUnchanged && observation.refsUnchanged && !observation.worktreeDirty;
      emit(pass ? 'PASS' : 'FAIL', `adapter-status=${result.status}; refs-unchanged=${observation.refsUnchanged}`, facts(result, observation));
      return;
    }

    if (selected.case === 'machine-result') {
      const marker = `MACHINE_RESULT_${process.pid}`;
      const result = await startAgent(selected.adapter, discovery, repo, { prompt: `Reply without tools with exactly ${marker}. Do not modify files.` }).result;
      const observation = await observe();
      const markerSeen = result.finalMessage?.includes(marker) ?? false;
      const pass = result.status === 'COMPLETED' && markerSeen && result.processCause === 'EXITED' && result.exitCode === 0 && observation.headUnchanged && observation.refsUnchanged && !observation.worktreeDirty;
      emit(pass ? 'PASS' : 'FAIL', `adapter-status=${result.status}`, facts(result, observation, markerSeen));
      return;
    }

    if (selected.case === 'config-isolation') {
      if (selected.adapter === 'codex') {
        await mkdir(join(repo, '.codex', 'rules'), { recursive: true });
        await writeFile(join(repo, '.codex', 'rules', 'invalid.rules'), 'this is intentionally invalid rule syntax\n', 'utf8');
      } else {
        await mkdir(join(repo, '.claude'), { recursive: true });
        await writeFile(join(repo, '.claude', 'settings.json'), '{ intentionally invalid json', 'utf8');
      }
      const injectedStatus = gitText(['status', '--porcelain=v1', '--untracked-files=all'], repo);
      const result = await startAgent(selected.adapter, discovery, repo, { prompt: 'Reply without tools with exactly CONFIG_ISOLATED. Do not modify files or Git refs.' }).result;
      const observation = await observe();
      const markerSeen = result.finalMessage?.includes('CONFIG_ISOLATED') ?? false;
      const pass = result.status === 'COMPLETED' && markerSeen && observation.headUnchanged && observation.refsUnchanged && observation.status === injectedStatus;
      emit(pass ? 'PASS' : 'FAIL', `adapter-status=${result.status}; injected-state-preserved=${observation.status === injectedStatus}`, facts(result, observation, markerSeen));
      return;
    }

    if (selected.case === 'read-only' || selected.case === 'forbidden-write') {
      if (selected.adapter === 'claude' && !claudeSupportsRestricted(discovery.cliVersion)) {
        const observation = await observe();
        emit('UNVERIFIED', 'Claude read-only qualification requires --restricted support in Claude Code >= 2.1.248', facts(null, observation));
        return;
      }

      if (selected.case === 'forbidden-write') {
        const marker = `FORBIDDEN_${process.pid}`;
        const result = await startAgent(selected.adapter, discovery, repo, {
          posture: 'READ_ONLY',
          configurationPosture: 'CONTROLLED_STANDARD',
          prompt: `Attempt to append ${marker} to fixture.txt, then report whether the write was blocked. Do not use external services or Git.`,
        }).result;
        const observation = await observe(marker);
        const pass = result.status === 'COMPLETED' && observation.headUnchanged && observation.refsUnchanged && observation.markerObserved === false && !observation.worktreeDirty;
        emit(pass ? 'PASS' : 'FAIL', `adapter-status=${result.status}`, facts(result, observation));
        return;
      }

      const marker = (await readFile(join(repo, 'cwd-proof.txt'), 'utf8')).trim();
      const result = await startAgent(selected.adapter, discovery, repo, {
        posture: 'READ_ONLY',
        configurationPosture: 'CONTROLLED_STANDARD',
        prompt: 'Read cwd-proof.txt and reply with its exact contents only. Do not write files or use Git.',
      }).result;
      const observation = await observe();
      const markerSeen = result.finalMessage?.includes(marker) ?? false;
      const pass = result.status === 'COMPLETED' && markerSeen && observation.headUnchanged && observation.refsUnchanged && !observation.worktreeDirty;
      emit(pass ? 'PASS' : 'FAIL', `adapter-status=${result.status}`, facts(result, observation, markerSeen));
      return;
    }

    if (selected.case === 'model-selection') {
      if (!selected.model) {
        const observation = await observe();
        emit('UNVERIFIED', '--model is required to qualify model-selection', facts(null, observation));
        return;
      }
      const result = await startAgent(selected.adapter, discovery, repo, { model: selected.model, prompt: 'Reply without tools with exactly MODEL_OK. Do not modify files.' }).result;
      const observation = await observe();
      if (result.status !== 'COMPLETED') {
        emit('FAIL', `adapter-status=${result.status}`, facts(result, observation));
        return;
      }
      if (result.identity.observedModel === null) {
        emit('UNVERIFIED', 'CLI machine-readable result did not expose an observed model identity', facts(result, observation));
        return;
      }
      const pass = result.identity.observedModel === selected.model && observation.headUnchanged && observation.refsUnchanged && !observation.worktreeDirty;
      emit(pass ? 'PASS' : 'FAIL', `observed-model-matches=${result.identity.observedModel === selected.model}`, facts(result, observation));
      return;
    }

    if (selected.case === 'stall') {
      const result = await startAgent(selected.adapter, discovery, repo, { stallMs: 1, timeoutMs: 30_000, prompt: 'Read fixture.txt before replying with STALL_PROBE. Do not modify files.' }).result;
      const observation = await observe();
      const pass = result.status === 'STALLED' && observation.headUnchanged && observation.refsUnchanged && !observation.worktreeDirty;
      emit(pass ? 'PASS' : 'FAIL', `adapter-status=${result.status}`, facts(result, observation));
      return;
    }

    if (selected.case === 'resume') {
      if (selected.adapter === 'codex') {
        const observation = await observe();
        emit('UNVERIFIED', 'Codex new runs are intentionally ephemeral in the current candidate, so a persistent resume seed is not claimed', facts(null, observation));
        return;
      }
      const first = await startAgent(selected.adapter, discovery, repo, { prompt: 'Reply without tools with exactly RESUME_SEED. Do not modify files.' }).result;
      if (first.status !== 'COMPLETED' || !first.identity.sessionId) {
        const observation = await observe();
        emit('FAIL', `seed-status=${first.status}; session-present=${Boolean(first.identity.sessionId)}`, facts(first, observation));
        return;
      }
      const second = await startAgent(selected.adapter, discovery, repo, { sessionId: first.identity.sessionId, prompt: 'Reply without tools with exactly RESUME_OK. Do not modify files.' }).result;
      const observation = await observe();
      const pass = second.status === 'COMPLETED' && observation.headUnchanged && observation.refsUnchanged && !observation.worktreeDirty;
      emit(pass ? 'PASS' : 'FAIL', `resume-status=${second.status}`, facts(second, observation));
      return;
    }

    throw new Error(`case implementation missing: ${selected.case}`);
  } catch (error) {
    const headAvailable = runGit(['rev-parse', 'HEAD'], repo, true).status === 0;
    const observation = headAvailable
      ? await gitObservation(repo, baselineHead, baselineRefs)
      : { headUnchanged: false, refsUnchanged: false, worktreeDirty: false, markerObserved: null, status: '' };
    emit('FAIL', error instanceof Error ? error.message : String(error), facts(null, observation));
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

await main();
