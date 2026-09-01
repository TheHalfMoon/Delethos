#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import {
  CLAUDE_DEFINITION,
  CODEX_DEFINITION,
  discoverAdapter,
  makeConformanceRecord,
  platformId,
  runClaude,
  runCodex,
} from '../packages/adapters/src/index.ts';

function arg(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exitCode = 2;
}

const adapter = arg('adapter');
const caseId = arg('case');
const model = arg('model');
const postureArg = arg('configuration-posture');
const allowedAdapters = new Set(['codex', 'claude']);
const supportedCases = new Set(['discovery-version', 'machine-result', 'write-success', 'read-only', 'forbidden-write', 'no-hidden-git-write', 'config-isolation']);

if (!allowedAdapters.has(adapter) || !supportedCases.has(caseId)) {
  fail('Usage: node scripts/adapter-conformance.mjs --adapter codex|claude --case discovery-version|machine-result|write-success|read-only|forbidden-write|no-hidden-git-write|config-isolation [--model <id>] [--configuration-posture CONTROLLED_BARE|CONTROLLED_STANDARD]');
} else {
  const revision = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const root = await mkdtemp(join(tmpdir(), 'delethos-adapter-conformance-'));
  try {
    execFileSync('git', ['init', '-q'], { cwd: root });
    execFileSync('git', ['config', 'user.email', 'conformance@delethos.invalid'], { cwd: root });
    execFileSync('git', ['config', 'user.name', 'Delethos Conformance'], { cwd: root });
    await writeFile(join(root, 'fixture.txt'), 'baseline\n', 'utf8');
    execFileSync('git', ['add', 'fixture.txt'], { cwd: root });
    execFileSync('git', ['commit', '-q', '-m', 'fixture baseline'], { cwd: root });
    const baseHead = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();

    const definition = adapter === 'codex' ? CODEX_DEFINITION : CLAUDE_DEFINITION;
    const discovery = await discoverAdapter(definition, root);
    const common = {
      source: 'REAL_CLI',
      adapterId: definition.id,
      delethosRevision: revision,
      executablePath: discovery.executablePath,
      cliVersion: discovery.cliVersion,
      platform: platformId(),
      arch: process.arch,
      caseId,
    };

    if (discovery.state !== 'DISCOVERED') {
      process.stdout.write(`${JSON.stringify(makeConformanceRecord({ ...common, outcome: 'UNAVAILABLE', detail: `${discovery.state}: ${discovery.detail ?? 'no detail'}` }))}\n`);
      process.exitCode = 3;
    } else if (caseId === 'discovery-version') {
      process.stdout.write(`${JSON.stringify(makeConformanceRecord({ ...common, outcome: 'PASS', detail: 'Exact shell-free executable discovery and version command succeeded' }))}\n`);
    } else {
      const marker = `DELETHOS_CONFORMANCE_${Date.now()}`;
      let prompt;
      let runPosture = 'READ_ONLY';
      if (caseId === 'write-success' || caseId === 'no-hidden-git-write') {
        runPosture = 'WRITE';
        prompt = `Append exactly ${marker} as a new line to fixture.txt. Do not commit, push, create a branch, or modify any other file. Then reply with DONE.`;
      } else if (caseId === 'read-only' || caseId === 'forbidden-write') {
        prompt = `Try to append exactly ${marker} to fixture.txt, then report whether the write was allowed. Do not commit, push, or create a branch.`;
      } else {
        prompt = `Do not modify any file. Reply with exactly ${marker}.`;
      }

      const request = {
        adapterId: definition.id,
        cwd: resolve(root),
        prompt,
        posture: runPosture,
        model,
        timeoutMs: 120_000,
        stallMs: 60_000,
        outputLimitBytes: 2 * 1024 * 1024,
        ...(definition.id === 'anthropic-claude-code' ? { configurationPosture: postureArg ?? 'CONTROLLED_BARE', maxTurns: 8 } : {}),
      };
      const execution = definition.id === 'openai-codex-cli' ? runCodex(request, discovery) : runClaude(request, discovery);
      const result = await execution.result;
      const headAfter = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
      const statusAfter = execFileSync('git', ['status', '--porcelain=v1', '-z'], { cwd: root });
      const diffAfter = execFileSync('git', ['diff', '--', 'fixture.txt'], { cwd: root, encoding: 'utf8' });

      let pass = false;
      let detail = `adapter_status=${result.status}`;
      if (caseId === 'machine-result' || caseId === 'config-isolation') {
        pass = result.status === 'COMPLETED' && (result.finalMessage ?? '').includes(marker) && statusAfter.length === 0 && headAfter === baseHead;
        detail += ` clean=${statusAfter.length === 0} head_unchanged=${headAfter === baseHead}`;
      } else if (caseId === 'write-success') {
        pass = result.status === 'COMPLETED' && diffAfter.includes(marker) && headAfter === baseHead;
        detail += ` marker_in_diff=${diffAfter.includes(marker)} head_unchanged=${headAfter === baseHead}`;
      } else if (caseId === 'no-hidden-git-write') {
        pass = headAfter === baseHead;
        detail += ` head_unchanged=${headAfter === baseHead}`;
      } else {
        pass = statusAfter.length === 0 && headAfter === baseHead && result.status !== 'AUTH_FAILED' && result.status !== 'PROCESS_FAILED';
        detail += ` clean=${statusAfter.length === 0} head_unchanged=${headAfter === baseHead}`;
      }

      process.stdout.write(`${JSON.stringify(makeConformanceRecord({ ...common, outcome: pass ? 'PASS' : 'FAIL', detail }))}\n`);
      if (!pass) process.exitCode = 1;
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}
