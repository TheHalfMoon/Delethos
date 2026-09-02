#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  chmodSync,
  createWriteStream,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { readFile, rm } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { finished } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';
import {
  buildOpenCodeR181Config,
  OPENCODE_R181_MODEL_ID,
  OPENCODE_R181_PROVIDER_ID,
  runOpenCode,
} from '../packages/adapters/src/opencode.ts';
import { buildPiConformanceInvocation, runPi } from '../packages/adapters/src/pi.ts';
import { superviseProcess } from '../packages/runtime/src/process.ts';

const REPO_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const CANONICAL_PROVIDER = 'delethos-local-llama';
const CANONICAL_MODEL = 'delethos-qwen25-coder-1.5b-q4km';
const RUNTIME_RELEASE = 'b10621';
const RUNTIME_COMMIT = 'c1d0e7a004015f23bc0233470b747b596f29b264';
const MODEL_REVISION = '2ab9f8f42af02fc212effaef7c4850c885e965f4';
const MODEL_FILE = 'qwen2.5-coder-1.5b-instruct-q4_k_m.gguf';
const MODEL_SHA256 = 'cc324af070c2ecbfd324a30884d2f951a7ff756aba85cb811a6ec436933bb046';
const PI_VERSION = '0.84.4';
const OPENCODE_VERSION = '1.18.26';
const SMOKE_FILE = 'delethos-r181-smoke.txt';
const SMOKE_CONTENT = 'DELETHOS_R181_OK\n';
const MAX_JSON_BYTES = 1024 * 1024;

if (OPENCODE_R181_PROVIDER_ID !== CANONICAL_PROVIDER || OPENCODE_R181_MODEL_ID !== CANONICAL_MODEL) {
  throw new Error('OpenCode R181 identity constants drifted from canonical Amendment 008');
}

const PLATFORM = {
  'linux:x64': {
    platform: 'linux',
    arch: 'x64',
    runtimeAsset: 'llama-b10621-bin-ubuntu-x64.tar.gz',
    runtimeSha256: '91d7b03ddae498a39f28fdb85d84d2b4a0fd3838d10b4f897e0ef8975bb9b583',
    runtimeExecutable: 'llama-server',
    piAsset: 'pi-linux-x64.tar.gz',
    piSha256: 'c2f3c3e6a1850bd87654cc3ca8811013272397c3d042a4e2a64c43ee1b423972',
    piExecutable: 'pi',
    opencodeAsset: 'opencode-linux-x64.tar.gz',
    opencodeSha256: '7c20c1ffa91bcca0ac903752260bcc36307dff656833baead2f5ef3b224b16c6',
    opencodeExecutable: 'opencode',
  },
  'darwin:arm64': {
    platform: 'macos',
    arch: 'arm64',
    runtimeAsset: 'llama-b10621-bin-macos-arm64.tar.gz',
    runtimeSha256: '429c8270608600188035e5e92f7d78dffb7900904fe7dd7e6a84f48068cd13cf',
    runtimeExecutable: 'llama-server',
    piAsset: 'pi-darwin-arm64.tar.gz',
    piSha256: 'c68e3ac4d05b4e282aaab2e6c76f161d3e9e68f19a22e38913cbfaadb6c800f0',
    piExecutable: 'pi',
    opencodeAsset: 'opencode-darwin-arm64.zip',
    opencodeSha256: 'b05d383149a5a417140e8edebd83064142fa36e74fdfcd5f791919dcb12fd33a',
    opencodeExecutable: 'opencode',
  },
  'win32:x64': {
    platform: 'windows',
    arch: 'x64',
    runtimeAsset: 'llama-b10621-bin-win-cpu-x64.zip',
    runtimeSha256: '0e8b65e650e369f70f8307d890508886f171ef4fb00facccddd4a1b7ffdaca51',
    runtimeExecutable: 'llama-server.exe',
    piAsset: 'pi-windows-x64.zip',
    piSha256: '03b2318774f18721e959d9f8f3340a9f942e7aa516fb7030d3007a12a40a4a97',
    piExecutable: 'pi.exe',
    opencodeAsset: 'opencode-windows-x64.zip',
    opencodeSha256: 'c7af81e288dff3cf4378c9f3509208ef8bf060d7109589fee2cd943845d87786',
    opencodeExecutable: 'opencode.exe',
  },
};

const REQUIRED_FACTS = [
  'runtime_tag_commit_exact',
  'runtime_release_asset_digest_metadata_exact',
  'runtime_archive_digest_exact',
  'runtime_executable_contained_unique',
  'runtime_executable_identity_exact',
  'model_digest_exact',
  'server_loopback_only',
  'server_no_auth_required',
  'server_models_endpoint_contains_exact_alias',
  'anonymous_nonempty_model_completion',
  'pi_cli_version_exact_0_84_4',
  'pi_requested_identity_exact',
  'pi_observed_identity_exact',
  'pi_nonempty_completion',
  'pi_tool_allowlist_exact_write_only',
  'pi_bounded_tool_write_smoke',
  'opencode_cli_version_exact_1_18_26',
  'opencode_requested_identity_exact',
  'opencode_sanitized_export_identity_exact',
  'opencode_nonempty_completion',
  'opencode_permission_policy_exact_default_deny',
  'opencode_bounded_tool_write_smoke',
  'repository_fixture_only',
  'no_secret_referenced',
  'no_hidden_commit_push_merge',
];

function boundedReason(error) {
  const text = error instanceof Error ? error.message : String(error);
  return text.replace(/[\r\n]+/g, ' ').slice(0, 300);
}

function exactPlatform() {
  const selected = PLATFORM[`${process.platform}:${process.arch}`];
  if (!selected) throw new Error(`unsupported R181 platform ${process.platform}/${process.arch}`);
  return selected;
}

function baseRecord(selected) {
  return {
    schema: 'delethos.spec003.r181-provider-prereq.v1',
    source: 'CANONICAL_MAIN_PROVIDER_PREREQUISITE',
    provider_strategy_id: 'delethos-local-llama-qwen25-coder',
    runtime_release: RUNTIME_RELEASE,
    runtime_commit: RUNTIME_COMMIT,
    model_revision: MODEL_REVISION,
    model_file: MODEL_FILE,
    model_sha256: MODEL_SHA256,
    provider_id: CANONICAL_PROVIDER,
    model_id: CANONICAL_MODEL,
    platform: selected.platform,
    arch: selected.arch,
    outcome: 'UNVERIFIED',
    failed_at: null,
    failure_reason: null,
    ...Object.fromEntries(REQUIRED_FACTS.map((fact) => [fact, false])),
  };
}

function mark(record, fact) {
  if (!REQUIRED_FACTS.includes(fact)) throw new Error(`unknown R181 fact ${fact}`);
  record[fact] = true;
}

function pathEnvironment(extra = {}) {
  const values = {
    PATH: process.env.PATH ?? process.env.Path ?? '',
    ...extra,
  };
  if (process.platform === 'win32') {
    for (const key of ['SystemRoot', 'WINDIR', 'COMSPEC', 'PATHEXT']) {
      if (process.env[key] !== undefined) values[key] = process.env[key];
    }
  }
  return values;
}

function runSync(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: 'utf8',
    shell: false,
    timeout: options.timeoutMs ?? 120_000,
    env: options.environment ?? pathEnvironment(),
  });
  if (result.error || result.status !== 0) {
    throw new Error(`${options.label ?? basename(command)} failed: status=${result.status ?? 'null'} error=${result.error?.message ?? 'none'}`);
  }
  return `${result.stdout ?? ''}${result.stderr ?? ''}`;
}

function git(args, cwd) {
  return runSync('git', args, { cwd, timeoutMs: 30_000, label: `git ${args[0]}` }).replace(/\r\n/g, '\n').trimEnd();
}

function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function snapshotHooks(gitDir) {
  const hooksRoot = join(gitDir, 'hooks');
  if (!existsSync(hooksRoot)) return '';
  const entries = [];
  const pending = [hooksRoot];
  while (pending.length > 0) {
    const current = pending.pop();
    const children = readdirSync(current, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of children) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) {
        pending.push(path);
        continue;
      }
      const stat = lstatSync(path);
      if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('fixture Git hooks must contain only regular files');
      entries.push(`${relative(hooksRoot, path).split(sep).join('/')}\0${stat.mode & 0o777}\0${sha256File(path)}`);
    }
  }
  return entries.sort().join('\n');
}

function snapshotRepository(cwd) {
  const gitDir = git(['rev-parse', '--absolute-git-dir'], cwd);
  const configPath = join(gitDir, 'config');
  return {
    head: git(['rev-parse', 'HEAD'], cwd),
    refs: git(['for-each-ref', '--format=%(refname) %(objectname)'], cwd),
    status: git(['status', '--porcelain=v1', '--untracked-files=all'], cwd),
    remotes: git(['remote'], cwd),
    gitConfigSha256: existsSync(configPath) ? sha256File(configPath) : null,
    hooks: snapshotHooks(gitDir),
  };
}

function repositoryIdentityUnchanged(before, after) {
  return before.head === after.head
    && before.refs === after.refs
    && before.remotes === after.remotes
    && before.gitConfigSha256 === after.gitConfigSha256
    && before.hooks === after.hooks;
}

function assertInside(root, candidate, label) {
  const rootReal = realpathSync(root);
  const candidateReal = realpathSync(candidate);
  const rel = relative(rootReal, candidateReal);
  if (rel === '' || rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
    if (candidateReal === rootReal) return;
    throw new Error(`${label} escaped its verified root`);
  }
}

function findUniqueContainedExecutable(root, filename) {
  const matches = [];
  const pending = [root];
  while (pending.length > 0) {
    const current = pending.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) {
        pending.push(path);
        continue;
      }
      if (entry.name.toLowerCase() !== filename.toLowerCase()) continue;
      const stat = lstatSync(path);
      if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`${filename} is not a contained regular file`);
      assertInside(root, path, filename);
      matches.push(path);
    }
  }
  if (matches.length !== 1) throw new Error(`expected exactly one contained ${filename}; observed ${matches.length}`);
  return matches[0];
}

async function fetchJson(url, timeoutMs = 30_000) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'delethos-r181' },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`GET ${new URL(url).hostname} returned HTTP ${response.status}`);
  const text = await response.text();
  if (Buffer.byteLength(text, 'utf8') > MAX_JSON_BYTES) throw new Error('JSON response exceeded bounded size');
  try { return JSON.parse(text); } catch { throw new Error('JSON response was malformed'); }
}

async function downloadVerified(url, destination, expectedSha256, timeoutMs) {
  if (existsSync(destination)) throw new Error(`download destination already exists: ${basename(destination)}`);
  const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(timeoutMs) });
  if (!response.ok || !response.body) throw new Error(`download ${new URL(url).hostname} returned HTTP ${response.status}`);
  const hash = createHash('sha256');
  const output = createWriteStream(destination, { flags: 'wx' });
  try {
    for await (const chunk of response.body) {
      const buffer = Buffer.from(chunk);
      hash.update(buffer);
      if (!output.write(buffer)) await new Promise((resolveValue) => output.once('drain', resolveValue));
    }
    output.end();
    await finished(output);
  } catch (error) {
    output.destroy();
    throw error;
  }
  const observed = hash.digest('hex');
  if (observed !== expectedSha256) throw new Error(`SHA-256 mismatch for ${basename(destination)}`);
  return observed;
}

function extractArchive(archivePath, extractRoot) {
  if (existsSync(extractRoot)) throw new Error('extract root already exists');
  mkdirSync(extractRoot, { recursive: false });
  if (process.platform === 'win32') {
    const environment = pathEnvironment({
      DELETHOS_ARCHIVE: archivePath,
      DELETHOS_EXTRACT: extractRoot,
      TEMP: dirname(extractRoot),
      TMP: dirname(extractRoot),
    });
    runSync('pwsh.exe', [
      '-NoLogo', '-NoProfile', '-NonInteractive', '-Command',
      "$ErrorActionPreference='Stop'; Expand-Archive -LiteralPath $env:DELETHOS_ARCHIVE -DestinationPath $env:DELETHOS_EXTRACT -Force",
    ], { cwd: dirname(extractRoot), environment, label: 'verified archive extraction' });
  } else {
    runSync('tar', ['-xf', archivePath, '-C', extractRoot], { cwd: dirname(extractRoot), label: 'verified archive extraction' });
  }
}

async function runBounded(command, args, cwd, environment, timeoutMs = 120_000, outputLimitBytes = 1024 * 1024) {
  const result = await superviseProcess({
    command,
    args,
    cwd,
    environment: { mode: 'EXACT', values: environment },
    timeoutMs,
    terminationGraceMs: 1_000,
    outputLimitBytes,
  }).result;
  if (result.cause !== 'EXITED' || result.exitCode !== 0 || result.outputTruncated) {
    throw new Error(`${basename(command)} failed: cause=${result.cause} exit=${result.exitCode ?? 'null'} cleanup=${result.cleanupStatus} truncated=${result.outputTruncated}`);
  }
  return result;
}

function exactVersionObserved(text, version) {
  const escaped = version.replace(/\./g, '\\.');
  return new RegExp(`(^|\\D)${escaped}(\\D|$)`).test(text);
}

async function allocateLoopbackPort() {
  const server = createServer();
  await new Promise((resolveValue, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolveValue);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('failed to allocate loopback port');
  const port = address.port;
  await new Promise((resolveValue, reject) => server.close((error) => error ? reject(error) : resolveValue()));
  return port;
}

async function waitForModels(baseURL, runningServer, timeoutMs = 180_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const exited = await Promise.race([
      runningServer.result.then((result) => ({ result })),
      new Promise((resolveValue) => setTimeout(() => resolveValue(null), 750)),
    ]);
    if (exited?.result) throw new Error(`llama-server exited before readiness: ${exited.result.cause}/${exited.result.exitCode ?? 'null'}`);
    try {
      const response = await fetch(`${baseURL}/models`, { signal: AbortSignal.timeout(2_500) });
      if (response.ok) {
        const text = await response.text();
        if (Buffer.byteLength(text, 'utf8') > MAX_JSON_BYTES) throw new Error('models response exceeded bounded size');
        return JSON.parse(text);
      }
    } catch {
      // The server is still loading. Readiness polling is bounded and never converts an exited server into PASS.
    }
  }
  throw new Error('llama-server did not become ready within the bounded startup window');
}

async function anonymousCompletion(baseURL) {
  const response = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: CANONICAL_MODEL,
      messages: [{ role: 'user', content: 'Reply with a short non-empty confirmation.' }],
      temperature: 0,
      max_tokens: 32,
    }),
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok) throw new Error(`anonymous completion returned HTTP ${response.status}`);
  const text = await response.text();
  if (Buffer.byteLength(text, 'utf8') > MAX_JSON_BYTES) throw new Error('anonymous completion exceeded bounded size');
  let value;
  try { value = JSON.parse(text); } catch { throw new Error('anonymous completion returned malformed JSON'); }
  const content = value?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || content.trim() === '') throw new Error('anonymous completion was empty');
}

function createFixtureRepo(root, name) {
  const repo = join(root, name);
  mkdirSync(repo, { recursive: false });
  git(['init'], repo);
  git(['config', 'user.name', 'Delethos R181 Fixture'], repo);
  git(['config', 'user.email', 'r181-fixture@invalid.example'], repo);
  writeFileSync(join(repo, 'README.md'), 'R181 disposable fixture\n', { flag: 'wx' });
  git(['add', 'README.md'], repo);
  git(['commit', '-m', 'fixture: initialize R181 repository'], repo);
  if (git(['remote'], repo) !== '') throw new Error('fixture repository unexpectedly has a remote');
  return repo;
}

async function verifyExactSmoke(repo, before) {
  const after = snapshotRepository(repo);
  if (!repositoryIdentityUnchanged(before, after)) throw new Error('adapter changed fixture HEAD, refs, remotes, local Git config, or hooks');
  const smokePath = join(repo, SMOKE_FILE);
  if (!existsSync(smokePath)) throw new Error('adapter smoke file was not created');
  const smokeStat = lstatSync(smokePath);
  if (!smokeStat.isFile() || smokeStat.isSymbolicLink()) throw new Error('adapter smoke target was not a regular file');
  if (after.status !== `?? ${SMOKE_FILE}`) throw new Error(`unexpected fixture worktree status: ${after.status || '<clean>'}`);
  const content = await readFile(smokePath, 'utf8');
  if (content !== SMOKE_CONTENT) throw new Error('adapter smoke file bytes were not exact');
}

function piEnvironment(root) {
  const home = join(root, 'home');
  const config = join(root, 'agent');
  const sessions = join(root, 'sessions');
  const temp = join(root, 'tmp');
  for (const path of [home, config, sessions, temp]) mkdirSync(path, { recursive: true });
  const values = pathEnvironment({
    CI: 'true', NO_COLOR: '1', TERM: 'dumb', HOME: home, TMP: temp, TEMP: temp,
    PI_CODING_AGENT_DIR: config,
    PI_CODING_AGENT_SESSION_DIR: sessions,
  });
  if (process.platform === 'win32') {
    values.USERPROFILE = home;
    values.APPDATA = join(home, 'AppData', 'Roaming');
    values.LOCALAPPDATA = join(home, 'AppData', 'Local');
  }
  return { values, config };
}

function openCodeEnvironment(root) {
  const home = join(root, 'home');
  const config = join(root, 'config');
  const data = join(root, 'data');
  const cache = join(root, 'cache');
  const state = join(root, 'state');
  const temp = join(root, 'tmp');
  for (const path of [home, config, data, cache, state, temp]) mkdirSync(path, { recursive: true });
  const values = pathEnvironment({
    CI: 'true', NO_COLOR: '1', TERM: 'dumb', HOME: home, TMP: temp, TEMP: temp,
    XDG_CONFIG_HOME: config,
    XDG_DATA_HOME: data,
    XDG_CACHE_HOME: cache,
    XDG_STATE_HOME: state,
    OPENCODE_CONFIG_DIR: config,
    OPENCODE_DISABLE_PROJECT_CONFIG: '1',
    OPENCODE_PURE: '1',
    OPENCODE_DISABLE_AUTOUPDATE: '1',
    OPENCODE_DISABLE_MODELS_FETCH: '1',
    OPENCODE_DISABLE_PRUNE: '1',
    OPENCODE_DISABLE_CLAUDE_CODE: '1',
    OPENCODE_DISABLE_CLAUDE_CODE_PROMPT: '1',
    OPENCODE_DISABLE_CLAUDE_CODE_SKILLS: '1',
  });
  if (process.platform === 'win32') {
    values.USERPROFILE = home;
    values.APPDATA = join(home, 'AppData', 'Roaming');
    values.LOCALAPPDATA = join(home, 'AppData', 'Local');
  }
  return { values, config };
}

function exactOpenCodePolicy(config, baseURL) {
  const provider = config?.provider?.[CANONICAL_PROVIDER];
  const edit = config?.permission?.edit;
  return config?.autoupdate === false
    && provider?.npm === '@ai-sdk/openai-compatible'
    && provider?.options?.baseURL === baseURL
    && provider?.models?.[CANONICAL_MODEL] !== undefined
    && config?.permission?.['*'] === 'deny'
    && edit?.['*'] === 'deny'
    && edit?.[SMOKE_FILE] === 'allow'
    && Object.keys(edit ?? {}).length === 2
    && config?.permission?.bash === 'deny'
    && config?.permission?.external_directory === 'deny'
    && config?.permission?.webfetch === 'deny'
    && config?.permission?.websearch === 'deny'
    && config?.permission?.task === 'deny';
}

function extractOpenCodeIdentity(exportValue, sessionID) {
  if (exportValue?.info?.id !== sessionID || !Array.isArray(exportValue?.messages)) {
    throw new Error('OpenCode sanitized export session identity mismatch');
  }
  const assistant = exportValue.messages
    .map((message) => message?.info)
    .filter((info) => info?.role === 'assistant');
  if (assistant.length === 0) throw new Error('OpenCode sanitized export contained no assistant identity');
  if (assistant.some((info) => info.providerID !== CANONICAL_PROVIDER || info.modelID !== CANONICAL_MODEL)) {
    throw new Error('OpenCode sanitized export provider/model identity mismatch');
  }
  return { providerID: CANONICAL_PROVIDER, modelID: CANONICAL_MODEL, assistantMessages: assistant.length };
}

async function selfTest() {
  const selected = exactPlatform();
  for (const digest of [selected.runtimeSha256, selected.piSha256, selected.opencodeSha256, MODEL_SHA256]) {
    if (!/^[0-9a-f]{64}$/.test(digest)) throw new Error('pinned SHA-256 format is invalid');
  }
  if (!/^[0-9a-f]{40}$/.test(RUNTIME_COMMIT) || !/^[0-9a-f]{40}$/.test(MODEL_REVISION)) throw new Error('pinned revision format is invalid');
  const baseURL = 'http://127.0.0.1:12345/v1';
  const config = buildOpenCodeR181Config(baseURL, SMOKE_FILE);
  if (!exactOpenCodePolicy(config, baseURL)) throw new Error('OpenCode R181 policy self-test failed');
  const temp = mkdtempSync(join(tmpdir(), 'delethos-r181-selftest-'));
  try {
    const envRoot = join(temp, 'pi');
    mkdirSync(envRoot, { recursive: false });
    const env = piEnvironment(envRoot);
    const fakeExecutable = join(temp, process.platform === 'win32' ? 'pi-fixture.exe' : 'pi-fixture');
    writeFileSync(fakeExecutable, '', { flag: 'wx' });
    const plan = buildPiConformanceInvocation({
      adapterId: 'pi-coding-agent',
      cwd: temp,
      prompt: 'self-test',
      posture: 'WRITE',
      environmentPolicy: { mode: 'EXACT', values: env.values },
      provider: CANONICAL_PROVIDER,
      model: CANONICAL_MODEL,
      prerequisiteToolMode: 'WRITE_ONLY',
    }, {
      adapterId: 'pi-coding-agent', state: 'DISCOVERED', executablePath: fakeExecutable,
      cliVersion: `pi-coding-agent v${PI_VERSION}`, detail: null,
    });
    const toolIndexes = plan.args.flatMap((value, index) => value === '--tools' ? [index] : []);
    if (toolIndexes.length !== 1 || plan.args[toolIndexes[0] + 1] !== 'write') throw new Error('Pi R181 tool allowlist self-test failed');

    const hookRepo = createFixtureRepo(temp, 'hook-integrity-fixture');
    const hookBefore = snapshotRepository(hookRepo);
    writeFileSync(join(hookRepo, SMOKE_FILE), SMOKE_CONTENT, { flag: 'wx' });
    await verifyExactSmoke(hookRepo, hookBefore);
    const hookGitDir = git(['rev-parse', '--absolute-git-dir'], hookRepo);
    writeFileSync(join(hookGitDir, 'hooks', 'delethos-r181-selftest-hook'), '#!/bin/sh\nexit 0\n', { flag: 'wx' });
    let hookMutationRejected = false;
    try { await verifyExactSmoke(hookRepo, hookBefore); } catch { hookMutationRejected = true; }
    if (!hookMutationRejected) throw new Error('R181 fixture hook mutation self-test failed');

    const configRepo = createFixtureRepo(temp, 'config-integrity-fixture');
    const configBefore = snapshotRepository(configRepo);
    writeFileSync(join(configRepo, SMOKE_FILE), SMOKE_CONTENT, { flag: 'wx' });
    git(['config', 'delethos.r181-mutated', 'true'], configRepo);
    let configMutationRejected = false;
    try { await verifyExactSmoke(configRepo, configBefore); } catch { configMutationRejected = true; }
    if (!configMutationRejected) throw new Error('R181 fixture local-config mutation self-test failed');

    const typeRepo = createFixtureRepo(temp, 'target-type-fixture');
    const typeBefore = snapshotRepository(typeRepo);
    mkdirSync(join(typeRepo, SMOKE_FILE), { recursive: false });
    let nonFileRejected = false;
    try { await verifyExactSmoke(typeRepo, typeBefore); } catch { nonFileRejected = true; }
    if (!nonFileRejected) throw new Error('R181 non-file smoke target self-test failed');
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
  console.log(JSON.stringify({ source: 'DETERMINISTIC_R181_SELF_TEST', platform: selected.platform, arch: selected.arch, outcome: 'PASS' }));
}

async function main() {
  if (process.argv.length === 3 && process.argv[2] === '--self-test') {
    await selfTest();
    return;
  }
  if (process.argv.length !== 2) throw new Error('Usage: node scripts/recovery-provider-prereq.mjs [--self-test]');

  const selected = exactPlatform();
  const record = baseRecord(selected);
  const qualificationRoot = mkdtempSync(join(resolve(process.env.RUNNER_TEMP || tmpdir()), 'delethos-r181-'));
  const canonicalBefore = snapshotRepository(REPO_ROOT);
  let server = null;

  try {
    if (canonicalBefore.status !== '') throw new Error('canonical checkout must start clean');

    const tag = await fetchJson(`https://api.github.com/repos/ggml-org/llama.cpp/git/ref/tags/${RUNTIME_RELEASE}`);
    if (tag?.object?.type !== 'commit' || tag?.object?.sha !== RUNTIME_COMMIT) throw new Error('runtime tag did not resolve directly to the pinned commit');
    mark(record, 'runtime_tag_commit_exact');

    const release = await fetchJson(`https://api.github.com/repos/ggml-org/llama.cpp/releases/tags/${RUNTIME_RELEASE}`);
    const runtimeAssets = Array.isArray(release?.assets) ? release.assets.filter((asset) => asset?.name === selected.runtimeAsset) : [];
    if (runtimeAssets.length !== 1 || runtimeAssets[0]?.digest !== `sha256:${selected.runtimeSha256}`) {
      throw new Error('runtime release asset metadata digest did not match the pinned digest');
    }
    mark(record, 'runtime_release_asset_digest_metadata_exact');

    const runtimeRoot = join(qualificationRoot, 'runtime');
    mkdirSync(runtimeRoot, { recursive: false });
    const runtimeArchive = join(runtimeRoot, selected.runtimeAsset);
    await downloadVerified(
      `https://github.com/ggml-org/llama.cpp/releases/download/${RUNTIME_RELEASE}/${selected.runtimeAsset}`,
      runtimeArchive,
      selected.runtimeSha256,
      300_000,
    );
    mark(record, 'runtime_archive_digest_exact');

    const runtimeExtract = join(runtimeRoot, 'extract');
    extractArchive(runtimeArchive, runtimeExtract);
    const serverExecutable = findUniqueContainedExecutable(runtimeExtract, selected.runtimeExecutable);
    if (process.platform !== 'win32') chmodSync(serverExecutable, 0o755);
    if (!statSync(serverExecutable).isFile()) throw new Error('runtime executable is not a regular file');
    mark(record, 'runtime_executable_contained_unique');

    const version = await runBounded(serverExecutable, ['--version'], dirname(serverExecutable), pathEnvironment(), 30_000, 64 * 1024);
    const versionText = `${version.stdout}\n${version.stderr}`;
    const identityMatch = versionText.match(/version:\s*[^\r\n]*\(build\s+(\d+),\s*commit\s+([0-9a-fA-F]{7,40})\)/);
    if (!identityMatch || Number(identityMatch[1]) !== 10621 || !RUNTIME_COMMIT.startsWith(identityMatch[2].toLowerCase())) {
      throw new Error('runtime executable build/commit identity did not match the pinned source commit');
    }
    mark(record, 'runtime_executable_identity_exact');

    const modelRoot = join(qualificationRoot, 'model');
    mkdirSync(modelRoot, { recursive: false });
    const modelPath = join(modelRoot, MODEL_FILE);
    await downloadVerified(
      `https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/${MODEL_REVISION}/${MODEL_FILE}?download=true`,
      modelPath,
      MODEL_SHA256,
      900_000,
    );
    mark(record, 'model_digest_exact');

    const port = await allocateLoopbackPort();
    const baseURL = `http://127.0.0.1:${port}/v1`;
    const serverArgs = [
      '--model', modelPath,
      '--alias', CANONICAL_MODEL,
      '--host', '127.0.0.1',
      '--port', String(port),
      '--jinja',
      '--ctx-size', '16384',
      '--n-gpu-layers', '0',
      '--threads', '2',
      '--threads-batch', '2',
      '--no-webui',
    ];
    if (serverArgs.includes('--api-key') || serverArgs.includes('--api-key-file') || serverArgs.includes('--tools') || serverArgs.includes('--agent')) {
      throw new Error('runtime server argv widened beyond Amendment 008');
    }
    if (serverArgs[serverArgs.indexOf('--host') + 1] !== '127.0.0.1') throw new Error('runtime server was not loopback-bound');
    mark(record, 'server_loopback_only');

    server = superviseProcess({
      command: serverExecutable,
      args: serverArgs,
      cwd: dirname(serverExecutable),
      environment: { mode: 'EXACT', values: pathEnvironment({ NO_COLOR: '1' }) },
      timeoutMs: 30 * 60 * 1000,
      terminationGraceMs: 2_000,
      outputLimitBytes: 4 * 1024 * 1024,
    });

    const models = await waitForModels(baseURL, server);
    mark(record, 'server_no_auth_required');
    if (!Array.isArray(models?.data) || !models.data.some((model) => model?.id === CANONICAL_MODEL)) {
      throw new Error('server models endpoint did not contain the exact canonical alias');
    }
    mark(record, 'server_models_endpoint_contains_exact_alias');
    await anonymousCompletion(baseURL);
    mark(record, 'anonymous_nonempty_model_completion');

    const cliRoot = join(qualificationRoot, 'cli');
    mkdirSync(cliRoot, { recursive: false });

    const piRoot = join(cliRoot, 'pi');
    mkdirSync(piRoot, { recursive: false });
    const piArchive = join(piRoot, selected.piAsset);
    await downloadVerified(`https://github.com/earendil-works/pi/releases/download/v${PI_VERSION}/${selected.piAsset}`, piArchive, selected.piSha256, 300_000);
    const piExtract = join(piRoot, 'extract');
    extractArchive(piArchive, piExtract);
    const piExecutable = findUniqueContainedExecutable(piExtract, selected.piExecutable);
    if (process.platform !== 'win32') chmodSync(piExecutable, 0o755);
    const piEnvRoot = join(piRoot, 'environment');
    mkdirSync(piEnvRoot, { recursive: false });
    const piEnv = piEnvironment(piEnvRoot);
    const piVersion = await runBounded(piExecutable, ['--version'], piRoot, piEnv.values, 30_000, 64 * 1024);
    if (!exactVersionObserved(`${piVersion.stdout}\n${piVersion.stderr}`, PI_VERSION)) throw new Error('Pi exact 0.84.4 version was not observed');
    mark(record, 'pi_cli_version_exact_0_84_4');

    const piModels = {
      providers: {
        [CANONICAL_PROVIDER]: {
          baseUrl: baseURL,
          api: 'openai-completions',
          apiKey: 'delethos-local-no-secret',
          authHeader: false,
          compat: { supportsDeveloperRole: false, supportsReasoningEffort: false },
          models: [{
            id: CANONICAL_MODEL,
            name: 'Delethos local Qwen2.5 Coder 1.5B Q4_K_M',
            reasoning: false,
            input: ['text'],
            contextWindow: 16384,
            maxTokens: 1024,
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
          }],
        },
      },
    };
    writeFileSync(join(piEnv.config, 'models.json'), `${JSON.stringify(piModels, null, 2)}\n`, { flag: 'wx' });

    const piRepo = createFixtureRepo(qualificationRoot, 'pi-fixture');
    const piBefore = snapshotRepository(piRepo);
    const piDiscovery = {
      adapterId: 'pi-coding-agent', state: 'DISCOVERED', executablePath: piExecutable,
      cliVersion: `pi-coding-agent v${PI_VERSION}`, detail: null,
    };
    const piRequest = {
      adapterId: 'pi-coding-agent',
      cwd: piRepo,
      prompt: `Use the write tool exactly once to create ${SMOKE_FILE} in the current working directory with the exact UTF-8 content DELETHOS_R181_OK followed by one newline. Do not modify any other file. Then reply with a short confirmation.`,
      posture: 'WRITE',
      environmentPolicy: { mode: 'EXACT', values: piEnv.values },
      provider: CANONICAL_PROVIDER,
      model: CANONICAL_MODEL,
      prerequisiteToolMode: 'WRITE_ONLY',
      timeoutMs: 300_000,
      terminationGraceMs: 2_000,
      outputLimitBytes: 2 * 1024 * 1024,
    };
    const piPlan = buildPiConformanceInvocation(piRequest, piDiscovery);
    const toolIndexes = piPlan.args.flatMap((value, index) => value === '--tools' ? [index] : []);
    if (toolIndexes.length !== 1 || piPlan.args[toolIndexes[0] + 1] !== 'write') throw new Error('Pi tool allowlist was not exactly write-only');
    if (piPlan.args.some((value) => ['bash', 'powershell', 'read', 'edit', 'grep', 'find', 'ls'].includes(value))) throw new Error('Pi tool allowlist contained an unauthorized tool');
    mark(record, 'pi_tool_allowlist_exact_write_only');
    if (piPlan.requestedProvider !== CANONICAL_PROVIDER || piPlan.requestedModel !== CANONICAL_MODEL) throw new Error('Pi requested identity did not match the canonical strategy');
    mark(record, 'pi_requested_identity_exact');
    const piResult = await runPi(piRequest, piDiscovery).result;
    if (piResult.status !== 'COMPLETED') throw new Error(`Pi provider run did not complete: ${piResult.status}`);
    if (piResult.identity.requestedProvider !== CANONICAL_PROVIDER || piResult.identity.requestedModel !== CANONICAL_MODEL) throw new Error('Pi result requested identity drifted');
    if (piResult.identity.observedProvider !== CANONICAL_PROVIDER || piResult.identity.observedModel !== CANONICAL_MODEL) throw new Error('Pi observed provider/model identity did not match');
    mark(record, 'pi_observed_identity_exact');
    if (typeof piResult.finalMessage !== 'string' || piResult.finalMessage.trim() === '') throw new Error('Pi final completion was empty');
    mark(record, 'pi_nonempty_completion');
    await verifyExactSmoke(piRepo, piBefore);
    mark(record, 'pi_bounded_tool_write_smoke');

    const opencodeRoot = join(cliRoot, 'opencode');
    mkdirSync(opencodeRoot, { recursive: false });
    const opencodeArchive = join(opencodeRoot, selected.opencodeAsset);
    await downloadVerified(`https://github.com/anomalyco/opencode/releases/download/v${OPENCODE_VERSION}/${selected.opencodeAsset}`, opencodeArchive, selected.opencodeSha256, 300_000);
    const opencodeExtract = join(opencodeRoot, 'extract');
    extractArchive(opencodeArchive, opencodeExtract);
    const opencodeExecutable = findUniqueContainedExecutable(opencodeExtract, selected.opencodeExecutable);
    if (process.platform !== 'win32') chmodSync(opencodeExecutable, 0o755);
    const opencodeEnvRoot = join(opencodeRoot, 'environment');
    mkdirSync(opencodeEnvRoot, { recursive: false });
    const opencodeEnv = openCodeEnvironment(opencodeEnvRoot);
    const opencodeVersion = await runBounded(opencodeExecutable, ['--version'], opencodeRoot, opencodeEnv.values, 30_000, 64 * 1024);
    if (!exactVersionObserved(`${opencodeVersion.stdout}\n${opencodeVersion.stderr}`, OPENCODE_VERSION)) throw new Error('OpenCode exact 1.18.26 version was not observed');
    mark(record, 'opencode_cli_version_exact_1_18_26');

    const opencodeConfig = buildOpenCodeR181Config(baseURL, SMOKE_FILE);
    writeFileSync(join(opencodeEnv.config, 'opencode.json'), `${JSON.stringify(opencodeConfig, null, 2)}\n`, { flag: 'wx' });
    const opencodeRepo = createFixtureRepo(qualificationRoot, 'opencode-fixture');
    const debugConfig = await runBounded(opencodeExecutable, ['debug', 'config'], opencodeRepo, opencodeEnv.values, 60_000, 512 * 1024);
    let resolvedConfig;
    try { resolvedConfig = JSON.parse(debugConfig.stdout); } catch { throw new Error('OpenCode debug config was not valid JSON'); }
    if (!exactOpenCodePolicy(resolvedConfig, baseURL)) throw new Error('OpenCode resolved permission/provider policy was not the exact default-deny R181 policy');
    mark(record, 'opencode_permission_policy_exact_default_deny');

    const opencodeBefore = snapshotRepository(opencodeRepo);
    const opencodeDiscovery = {
      adapterId: 'opencode', state: 'DISCOVERED', executablePath: opencodeExecutable,
      cliVersion: OPENCODE_VERSION, detail: null,
    };
    const opencodeRequest = {
      adapterId: 'opencode',
      cwd: opencodeRepo,
      prompt: `Use the write tool exactly once to create ${SMOKE_FILE} in the current working directory with the exact UTF-8 content DELETHOS_R181_OK followed by one newline. Do not modify any other file. Then reply with a short confirmation.`,
      posture: 'WRITE',
      environmentPolicy: { mode: 'EXACT', values: opencodeEnv.values },
      provider: CANONICAL_PROVIDER,
      model: CANONICAL_MODEL,
      timeoutMs: 300_000,
      terminationGraceMs: 2_000,
      outputLimitBytes: 2 * 1024 * 1024,
    };
    const opencodeRun = runOpenCode(opencodeRequest, opencodeDiscovery);
    const opencodeResult = await opencodeRun.result;
    if (opencodeResult.status !== 'COMPLETED') throw new Error(`OpenCode provider run did not complete: ${opencodeResult.status}`);
    if (opencodeResult.identity.requestedProvider !== CANONICAL_PROVIDER || opencodeResult.identity.requestedModel !== CANONICAL_MODEL) throw new Error('OpenCode requested identity did not match the canonical strategy');
    mark(record, 'opencode_requested_identity_exact');
    if (typeof opencodeResult.finalMessage !== 'string' || opencodeResult.finalMessage.trim() === '') throw new Error('OpenCode final completion was empty');
    mark(record, 'opencode_nonempty_completion');
    if (!opencodeResult.identity.sessionId) throw new Error('OpenCode run did not expose a session id for identity attestation');
    await verifyExactSmoke(opencodeRepo, opencodeBefore);
    mark(record, 'opencode_bounded_tool_write_smoke');

    const exported = await runBounded(
      opencodeExecutable,
      ['export', opencodeResult.identity.sessionId, '--sanitize'],
      opencodeRepo,
      opencodeEnv.values,
      60_000,
      2 * 1024 * 1024,
    );
    let exportValue;
    try { exportValue = JSON.parse(exported.stdout); } catch { throw new Error('OpenCode sanitized export was not valid JSON'); }
    extractOpenCodeIdentity(exportValue, opencodeResult.identity.sessionId);
    exportValue = null;
    await verifyExactSmoke(opencodeRepo, opencodeBefore);
    mark(record, 'opencode_sanitized_export_identity_exact');

    const canonicalAfter = snapshotRepository(REPO_ROOT);
    if (canonicalAfter.status !== '' || !repositoryIdentityUnchanged(canonicalBefore, canonicalAfter)) {
      throw new Error('R181 qualification changed canonical checkout HEAD, refs, remotes, local Git config, hooks, or worktree state');
    }
    for (const root of [runtimeRoot, modelRoot, cliRoot, piRepo, opencodeRepo]) assertInside(qualificationRoot, root, 'R181 qualification path');
    mark(record, 'repository_fixture_only');
    mark(record, 'no_secret_referenced');
    mark(record, 'no_hidden_commit_push_merge');

    const missing = REQUIRED_FACTS.filter((fact) => record[fact] !== true);
    if (missing.length > 0) throw new Error(`R181 prerequisite facts incomplete: ${missing.join(',')}`);
    record.outcome = 'PASS';
  } catch (error) {
    record.outcome = 'FAIL';
    record.failed_at = REQUIRED_FACTS.find((fact) => record[fact] !== true) ?? 'postcondition';
    record.failure_reason = boundedReason(error);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.cancel();
      const result = await server.result;
      if (result.cause !== 'CANCELLED' || result.cleanupStatus !== 'SUCCEEDED') {
        if (record.outcome === 'PASS') {
          record.outcome = 'FAIL';
          record.failed_at = 'server_cleanup';
          record.failure_reason = `llama-server cleanup was ${result.cause}/${result.cleanupStatus}`;
          process.exitCode = 1;
        }
      }
    }
    const canonicalFinal = snapshotRepository(REPO_ROOT);
    if (canonicalFinal.status !== '' || !repositoryIdentityUnchanged(canonicalBefore, canonicalFinal)) {
      record.outcome = 'FAIL';
      record.failed_at = 'canonical_repository_cleanup';
      record.failure_reason = 'canonical checkout changed during R181 qualification';
      record.repository_fixture_only = false;
      record.no_hidden_commit_push_merge = false;
      process.exitCode = 1;
    }
    console.log(JSON.stringify(record));
    await rm(qualificationRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.log(JSON.stringify({
    schema: 'delethos.spec003.r181-provider-prereq.v1',
    source: 'CANONICAL_MAIN_PROVIDER_PREREQUISITE',
    outcome: 'FAIL',
    failed_at: 'harness',
    failure_reason: boundedReason(error),
  }));
  process.exitCode = 1;
});