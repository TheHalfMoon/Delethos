import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { superviseInvocation } from '../src/index.ts';

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
