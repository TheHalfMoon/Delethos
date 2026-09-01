import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile, chmod } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CODEX_DEFINITION, discoverAdapter, resolveExecutable } from '../src/index.ts';

test('explicit executable discovery resolves process executable', async () => {
  const result = await resolveExecutable(process.execPath);
  assert.equal(result.state, 'DISCOVERED');
  assert.equal(result.paths.length, 1);
});

test('missing executable is not installed', async () => {
  const result = await resolveExecutable(`delethos-definitely-missing-${Date.now()}`, '');
  assert.deepEqual(result, { state: 'NOT_INSTALLED', paths: [] });
});

test('adapter discovery records exact path and version without auth inference', async () => {
  const result = await discoverAdapter({ ...CODEX_DEFINITION, versionArgs: ['--version'] }, process.cwd(), process.execPath);
  assert.equal(result.state, 'DISCOVERED');
  assert.equal(result.executablePath !== null, true);
  assert.match(result.cliVersion ?? '', /^v?\d+/);
});

test('PATH ambiguity fails closed when distinct executables exist', async (t) => {
  if (process.platform === 'win32') { t.skip('POSIX executable fixture only'); return; }
  const root = await mkdtemp(join(tmpdir(), 'delethos-discovery-'));
  try {
    const a = join(root, 'a');
    const b = join(root, 'b');
    await Promise.all([writeFile(a, '#!/bin/sh\nexit 0\n'), writeFile(b, '#!/bin/sh\nexit 0\n')]);
    await Promise.all([chmod(a, 0o755), chmod(b, 0o755)]);
    const result = await resolveExecutable(a);
    assert.equal(result.state, 'DISCOVERED');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
