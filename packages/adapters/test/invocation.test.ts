import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { processEvidence, superviseInvocation } from '../src/index.ts';

const fixture = resolve(dirname(fileURLToPath(import.meta.url)), 'fixtures/agent-fixture.ts');

function git(args: readonly string[], cwd: string): string {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8', shell: false });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

test('common invocation preserves exact cwd and argv without a shell', async () => {
  const cwd = resolve('.');
  const supervised = superviseInvocation({
    adapterId: 'openai-codex-cli',
    executablePath: process.execPath,
    args: ['-e', 'process.stdout.write(JSON.stringify({cwd:process.cwd(),arg:process.argv[1]}))', 'space value ; $HOME'],
    cwd,
    environment: { mode: 'INHERIT' },
    timeoutMs: 5000,
    outputLimitBytes: 32 * 1024,
    requestedModel: null,
    requestedProvider: null,
    configurationPosture: 'NOT_APPLICABLE',
  });
  const result = await supervised.result;
  assert.equal(result.cause, 'EXITED');
  assert.equal(result.exitCode, 0);
  const parsed = JSON.parse(result.stdout) as { cwd: string; arg: string };
  assert.equal(resolve(parsed.cwd), cwd);
  assert.equal(parsed.arg, 'space value ; $HOME');
  assert.deepEqual(processEvidence(result), {
    processCause: 'EXITED',
    exitCode: 0,
    terminationStrategy: 'NONE',
    terminationAttempted: false,
    cleanupStatus: 'NOT_NEEDED',
    cleanupDetail: null,
    elapsedMs: result.elapsedMs,
    stdoutBytes: result.stdoutBytes,
    stderrBytes: result.stderrBytes,
    retainedBytes: result.retainedBytes,
    outputTruncated: false,
  });
});

test('common invocation keeps timeout distinct', async () => {
  const supervised = superviseInvocation({
    adapterId: 'openai-codex-cli', executablePath: process.execPath,
    args: ['-e', 'setTimeout(()=>{},60000)'], cwd: resolve('.'), environment: { mode: 'INHERIT' },
    timeoutMs: 80, terminationGraceMs: 50, outputLimitBytes: 1024,
    requestedModel: null, requestedProvider: null, configurationPosture: 'NOT_APPLICABLE',
  });
  const result = await supervised.result;
  assert.equal(result.cause, 'TIMED_OUT');
  assert.equal(processEvidence(result).terminationAttempted, true);
});

test('common invocation keeps cancellation distinct', async () => {
  const supervised = superviseInvocation({
    adapterId: 'openai-codex-cli', executablePath: process.execPath,
    args: ['-e', 'setTimeout(()=>{},60000)'], cwd: resolve('.'), environment: { mode: 'INHERIT' },
    timeoutMs: 5000, terminationGraceMs: 50, outputLimitBytes: 1024,
    requestedModel: null, requestedProvider: null, configurationPosture: 'NOT_APPLICABLE',
  });
  setTimeout(() => supervised.cancel(), 30);
  const result = await supervised.result;
  assert.equal(result.cause, 'CANCELLED');
});

test('common invocation keeps stdio stall distinct', async () => {
  const supervised = superviseInvocation({
    adapterId: 'openai-codex-cli', executablePath: process.execPath,
    args: ['-e', "process.stdout.write('pulse');setTimeout(()=>{},60000)"], cwd: resolve('.'), environment: { mode: 'INHERIT' },
    stallMs: 100, terminationGraceMs: 50, outputLimitBytes: 1024,
    requestedModel: null, requestedProvider: null, configurationPosture: 'NOT_APPLICABLE',
  });
  const result = await supervised.result;
  assert.equal(result.cause, 'STALLED');
});

test('common invocation preserves OUTPUT_LIMIT and bounded retained output', async () => {
  const supervised = superviseInvocation({
    adapterId: 'openai-codex-cli', executablePath: process.execPath,
    args: [fixture, 'large'], cwd: resolve('.'), environment: { mode: 'INHERIT' },
    timeoutMs: 5000, terminationGraceMs: 50, outputLimitBytes: 1024,
    requestedModel: null, requestedProvider: null, configurationPosture: 'NOT_APPLICABLE',
  });
  const result = await supervised.result;
  assert.equal(result.cause, 'OUTPUT_LIMIT');
  assert.equal(result.outputTruncated, true);
  assert.ok(result.retainedBytes <= 1024);
  assert.ok(result.stdoutBytes > result.retainedBytes);
});

test('common invocation preserves partial output and reports descendant-tree cleanup', async () => {
  const supervised = superviseInvocation({
    adapterId: 'openai-codex-cli', executablePath: process.execPath,
    args: [fixture, 'spawn-child-then-stall'], cwd: resolve('.'), environment: { mode: 'INHERIT' },
    timeoutMs: 1000, terminationGraceMs: 80, outputLimitBytes: 16 * 1024,
    requestedModel: null, requestedProvider: null, configurationPosture: 'NOT_APPLICABLE',
  });
  const result = await supervised.result;
  assert.equal(result.cause, 'TIMED_OUT');
  assert.match(result.stdout, /child=\d+/);
  assert.match(result.stdout, /partial-output/);
  assert.equal(result.terminationAttempted, true);
  assert.equal(result.cleanupStatus, 'SUCCEEDED');
  assert.notEqual(result.terminationStrategy, 'NONE');
});

test('common invocation preserves a partial Git diff when an interrupted fixture edits first', async () => {
  const root = await mkdtemp(join(tmpdir(), 'delethos-adapter-partial-diff-'));
  const repo = join(root, 'repo space [hash#]');
  try {
    await mkdir(repo, { recursive: true });
    git(['init', '-b', 'main'], repo);
    git(['config', 'user.name', 'Delethos Fixture'], repo);
    git(['config', 'user.email', 'fixture@delethos.invalid'], repo);
    await writeFile(join(repo, 'fixture.txt'), 'BASELINE\n', 'utf8');
    git(['add', 'fixture.txt'], repo);
    git(['commit', '-m', 'baseline'], repo);
    const baseline = git(['rev-parse', 'HEAD'], repo);

    const supervised = superviseInvocation({
      adapterId: 'openai-codex-cli', executablePath: process.execPath,
      args: [fixture, 'edit-then-stall', 'fixture.txt', 'PARTIAL_DIFF_MARKER\n'], cwd: repo,
      environment: { mode: 'INHERIT' }, timeoutMs: 180, terminationGraceMs: 80, outputLimitBytes: 16 * 1024,
      requestedModel: null, requestedProvider: null, configurationPosture: 'NOT_APPLICABLE',
    });
    const result = await supervised.result;
    assert.equal(result.cause, 'TIMED_OUT');
    assert.match(result.stdout, /edit-complete/);
    assert.equal(git(['rev-parse', 'HEAD'], repo), baseline);
    const diff = git(['diff', '--', 'fixture.txt'], repo);
    assert.match(diff, /PARTIAL_DIFF_MARKER/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
