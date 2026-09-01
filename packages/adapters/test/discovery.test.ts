import test from 'node:test';
import assert from 'node:assert/strict';
import { chmod, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
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

test('PATH ambiguity fails closed when distinct executables exist', async () => {
  const root = await mkdtemp(join(tmpdir(), 'delethos-discovery-'));
  try {
    const a = join(root, 'a');
    const b = join(root, 'b');
    await Promise.all([mkdir(a), mkdir(b)]);
    const command = 'delethos-ambiguous';
    const filename = process.platform === 'win32' ? `${command}.exe` : command;
    const first = join(a, filename);
    const second = join(b, filename);
    const contents = process.platform === 'win32' ? '' : '#!/bin/sh\nexit 0\n';
    await Promise.all([writeFile(first, contents), writeFile(second, contents)]);
    if (process.platform !== 'win32') await Promise.all([chmod(first, 0o755), chmod(second, 0o755)]);

    const result = await resolveExecutable(command, [a, b].join(delimiter));
    assert.equal(result.state, 'AMBIGUOUS');
    assert.equal(result.paths.length, 2);
    assert.notEqual(result.paths[0], result.paths[1]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
