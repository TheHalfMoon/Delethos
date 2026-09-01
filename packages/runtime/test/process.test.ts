import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { superviseProcess } from '../src/process.ts';

async function withCwd<T>(fn: (cwd: string) => Promise<T>): Promise<T> {
  const cwd = await mkdtemp(join(tmpdir(), 'delethos process cwd '));
  try {
    return await fn(cwd);
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
}

function nodeRequest(cwd: string, source: string, extra: Record<string, unknown> = {}) {
  return {
    command: process.execPath,
    args: ['-e', source],
    cwd,
    environment: { mode: 'INHERIT' as const },
    terminationGraceMs: 100,
    outputLimitBytes: 1024 * 1024,
    ...extra,
  };
}

async function pidAlive(pid: number): Promise<boolean> {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return !(typeof error === 'object' && error !== null && 'code' in error && (error as { code?: unknown }).code === 'ESRCH');
  }
}

async function waitForPidDeath(pid: number, timeoutMs = 4000): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (!(await pidAlive(pid))) return true;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return !(await pidAlive(pid));
}

test('natural zero and nonzero exits remain EXITED with exact exit codes', async () => {
  await withCwd(async (cwd) => {
    const zero = await superviseProcess(nodeRequest(cwd, "process.stdout.write('ok');")).result;
    assert.equal(zero.cause, 'EXITED');
    assert.equal(zero.exitCode, 0);
    assert.equal(zero.stdout, 'ok');
    assert.equal(zero.terminationAttempted, false);

    const nonzero = await superviseProcess(nodeRequest(cwd, "process.stderr.write('bad'); process.exit(7);")).result;
    assert.equal(nonzero.cause, 'EXITED');
    assert.equal(nonzero.exitCode, 7);
    assert.equal(nonzero.stderr, 'bad');
  });
});

test('spawn failure is FAILED_TO_START and does not masquerade as timeout', async () => {
  await withCwd(async (cwd) => {
    const result = await superviseProcess({
      command: join(cwd, 'definitely-missing-executable'),
      args: [],
      cwd,
      environment: { mode: 'INHERIT' },
      timeoutMs: 100,
      terminationGraceMs: 50,
      outputLimitBytes: 1024,
    }).result;
    assert.equal(result.cause, 'FAILED_TO_START');
    assert.equal(result.pid, null);
    assert.equal(result.terminationAttempted, false);
  });
});

test('exact cwd and explicit environment modes are honored', async () => {
  await withCwd(async (cwd) => {
    const exact = await superviseProcess({
      command: process.execPath,
      args: ['-e', "process.stdout.write(JSON.stringify({cwd:process.cwd(), keys:Object.keys(process.env).sort(), value:process.env.DELETHOS_ONLY}))"],
      cwd,
      environment: { mode: 'EXACT', values: { DELETHOS_ONLY: 'yes' } },
      terminationGraceMs: 50,
      outputLimitBytes: 8192,
    }).result;
    assert.equal(exact.cause, 'EXITED');
    const parsed = JSON.parse(exact.stdout) as { cwd: string; keys: string[]; value: string };
    assert.equal(parsed.cwd, cwd);
    assert.equal(parsed.value, 'yes');
    assert.equal(parsed.keys.includes('DELETHOS_ONLY'), true);

    process.env.DELETHOS_INHERITED_TEST = 'present';
    try {
      const inherited = await superviseProcess(nodeRequest(cwd, "process.stdout.write(process.env.DELETHOS_INHERITED_TEST || 'missing');")).result;
      assert.equal(inherited.stdout, 'present');
    } finally {
      delete process.env.DELETHOS_INHERITED_TEST;
    }
  });
});

test('stdout and stderr are separately retained with exact byte accounting', async () => {
  await withCwd(async (cwd) => {
    const result = await superviseProcess(nodeRequest(cwd, "process.stdout.write('alpha'); process.stderr.write('beta');")).result;
    assert.equal(result.cause, 'EXITED');
    assert.equal(result.stdout, 'alpha');
    assert.equal(result.stderr, 'beta');
    assert.equal(result.stdoutBytes, 5);
    assert.equal(result.stderrBytes, 4);
    assert.equal(result.retainedBytes, 9);
    assert.equal(result.outputTruncated, false);
  });
});

test('output overflow is a distinct first terminal cause and retained output stays bounded', async () => {
  await withCwd(async (cwd) => {
    const result = await superviseProcess(
      nodeRequest(cwd, "process.stdout.write('x'.repeat(10000)); setInterval(()=>{},1000);", { outputLimitBytes: 128 }),
    ).result;
    assert.equal(result.cause, 'OUTPUT_LIMIT');
    assert.equal(result.retainedBytes, 128);
    assert.equal(Buffer.byteLength(result.stdout), 128);
    assert.equal(result.outputTruncated, true);
    assert.equal(result.terminationAttempted, true);
  });
});

test('explicit cancellation is distinct from timeout and stall', async () => {
  await withCwd(async (cwd) => {
    const supervised = superviseProcess(
      nodeRequest(cwd, 'setInterval(()=>{},1000);', { timeoutMs: 2000, stallMs: 2000 }),
    );
    setTimeout(() => supervised.cancel(), 60);
    const result = await supervised.result;
    assert.equal(result.cause, 'CANCELLED');
    assert.equal(result.terminationAttempted, true);
  });
});

test('wall-clock timeout is distinct', async () => {
  await withCwd(async (cwd) => {
    const result = await superviseProcess(nodeRequest(cwd, 'setInterval(()=>{},1000);', { timeoutMs: 80, stallMs: 1000 })).result;
    assert.equal(result.cause, 'TIMED_OUT');
    assert.equal(result.terminationAttempted, true);
  });
});

test('stdio activity resets stall deadline and later inactivity produces STALLED', async () => {
  await withCwd(async (cwd) => {
    const result = await superviseProcess(
      nodeRequest(
        cwd,
        "process.stdout.write('a'); setTimeout(()=>process.stdout.write('b'),60); setInterval(()=>{},1000);",
        { stallMs: 100, timeoutMs: 1500 },
      ),
    ).result;
    assert.equal(result.cause, 'STALLED');
    assert.equal(result.stdout, 'ab');
    assert.ok(result.elapsedMs >= 130, `stall fired too early: ${result.elapsedMs}`);
  });
});

test('first terminal cause is immutable under later cancel/timer events', async () => {
  await withCwd(async (cwd) => {
    const supervised = superviseProcess(
      nodeRequest(cwd, 'setInterval(()=>{},1000);', { timeoutMs: 70, stallMs: 1000 }),
    );
    setTimeout(() => supervised.cancel(), 140);
    const result = await supervised.result;
    assert.equal(result.cause, 'TIMED_OUT');
  });
});

test('ordinary root plus descendant are terminated by the declared platform tree strategy', async () => {
  await withCwd(async (cwd) => {
    const source = `
      const { spawn } = require('node:child_process');
      const child = spawn(process.execPath, ['-e', 'setInterval(()=>{},1000)'], { stdio: 'ignore' });
      process.stdout.write(String(child.pid) + '\\n');
      setInterval(()=>{},1000);
    `;
    const result = await superviseProcess(nodeRequest(cwd, source, { timeoutMs: 120, stallMs: 2000 })).result;
    assert.equal(result.cause, 'TIMED_OUT');
    assert.equal(result.cleanupStatus, 'SUCCEEDED');
    assert.equal(result.terminationStrategy, process.platform === 'win32' ? 'WINDOWS_TASKKILL_TREE' : 'POSIX_PROCESS_GROUP');
    const descendantPid = Number(result.stdout.trim());
    assert.ok(Number.isInteger(descendantPid) && descendantPid > 0, `invalid descendant pid: ${result.stdout}`);
    assert.equal(await waitForPidDeath(descendantPid), true, `descendant pid ${descendantPid} remained alive`);
  });
});
