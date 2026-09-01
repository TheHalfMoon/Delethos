import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmod, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { GitCommandError, discoverFilterDrivers, inspectRepository, runGit } from '../src/git.ts';

function cleanEnv(extra: NodeJS.ProcessEnv = {}): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (!key.toUpperCase().startsWith('GIT_')) env[key] = value;
  }
  return { ...env, ...extra, GIT_TERMINAL_PROMPT: '0' };
}

function git(cwd: string, args: readonly string[]): string {
  const result = spawnSync('git', [...args], { cwd, env: cleanEnv(), shell: false, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`fixture git failed: git ${args.join(' ')}\n${result.stderr}`);
  return result.stdout.trim();
}

async function createRepo(prefix = 'delethos git '): Promise<{ root: string; sha: string }> {
  const root = await mkdtemp(join(tmpdir(), prefix));
  git(root, ['init', '-q']);
  git(root, ['config', 'user.name', 'Delethos Test']);
  git(root, ['config', 'user.email', 'delethos@example.invalid']);
  await writeFile(join(root, 'tracked.txt'), 'committed\n');
  git(root, ['add', 'tracked.txt']);
  git(root, ['commit', '-qm', 'fixture']);
  return { root, sha: git(root, ['rev-parse', 'HEAD']) };
}

test('runGit rejects non-repository Git metadata commands cleanly', async () => {
  const root = await mkdtemp(join(tmpdir(), 'delethos nonrepo '));
  try {
    await assert.rejects(() => runGit(root, ['rev-parse', '--show-toplevel']), GitCommandError);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('inspectRepository records exact repository/base facts and dirty state', async () => {
  const fixture = await createRepo();
  try {
    await writeFile(join(fixture.root, 'untracked.txt'), 'dirty\n');
    const facts = await inspectRepository(fixture.root, fixture.sha);
    assert.equal(facts.repositoryTopLevel, resolve(fixture.root));
    assert.match(facts.commonDirectory, /\.git$/i);
    assert.equal(facts.headSha.toLowerCase(), fixture.sha.toLowerCase());
    assert.equal(facts.resolvedBaseSha.toLowerCase(), fixture.sha.toLowerCase());
    assert.equal(facts.primaryDirty, true);
    assert.match(facts.gitVersion, /^git version /);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test('inspectRepository fails closed on malformed and non-commit bases', async () => {
  const fixture = await createRepo();
  try {
    await assert.rejects(() => inspectRepository(fixture.root, 'abc'), /40 hexadecimal/);
    const blob = git(fixture.root, ['hash-object', 'tracked.txt']);
    assert.match(blob, /^[0-9a-f]{40}$/);
    await assert.rejects(() => inspectRepository(fixture.root, blob), GitCommandError);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test('inspectRepository fails closed on bare repositories', async () => {
  const root = await mkdtemp(join(tmpdir(), 'delethos bare '));
  try {
    git(root, ['init', '--bare', '-q']);
    await assert.rejects(() => inspectRepository(root, '0'.repeat(40)), GitCommandError);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('filter discovery reports configured external driver names without executing them', async () => {
  const fixture = await createRepo();
  try {
    git(fixture.root, ['config', 'filter.beta.process', 'definitely-not-a-command']);
    git(fixture.root, ['config', 'filter.alpha.smudge', 'definitely-not-a-command']);
    git(fixture.root, ['config', 'filter.alpha.required', 'true']);
    assert.deepEqual(await discoverFilterDrivers(fixture.root), ['alpha', 'beta']);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test('runtime Git scrubs inherited GIT control variables and suppresses external fsmonitor hook', async () => {
  const fixture = await createRepo();
  const alternate = await mkdtemp(join(tmpdir(), 'delethos alternate gitdir '));
  const marker = join(fixture.root, 'fsmonitor-marker');
  try {
    git(alternate, ['init', '--bare', '-q']);
    const hook = join(fixture.root, '.git', 'fsmonitor-hostile');
    await writeFile(hook, '#!/bin/sh\nprintf executed > "$DELETHOS_FSMONITOR_MARKER"\nexit 0\n');
    await chmod(hook, 0o755);
    git(fixture.root, ['config', 'core.fsmonitor', hook.replaceAll('\\', '/')]);

    const oldGitDir = process.env.GIT_DIR;
    const oldMarker = process.env.DELETHOS_FSMONITOR_MARKER;
    process.env.GIT_DIR = alternate;
    process.env.DELETHOS_FSMONITOR_MARKER = marker;
    try {
      const facts = await inspectRepository(fixture.root, fixture.sha);
      assert.equal(facts.repositoryTopLevel, resolve(fixture.root));
      await assert.rejects(() => import('node:fs/promises').then(({ access }) => access(marker)));
    } finally {
      if (oldGitDir === undefined) delete process.env.GIT_DIR;
      else process.env.GIT_DIR = oldGitDir;
      if (oldMarker === undefined) delete process.env.DELETHOS_FSMONITOR_MARKER;
      else process.env.DELETHOS_FSMONITOR_MARKER = oldMarker;
    }
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
    await rm(alternate, { recursive: true, force: true });
  }
});
