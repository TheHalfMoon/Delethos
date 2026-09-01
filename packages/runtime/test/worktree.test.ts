import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { access, chmod, mkdtemp, realpath, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  cleanupOwnedWorktree,
  discoverOwnedWorktrees,
  inspectWorktreeState,
  parseWorktreePorcelainZ,
  prepareWorktree,
  type PreparedWorktree,
} from '../src/worktree.ts';

function cleanEnv(extra: NodeJS.ProcessEnv = {}): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (!key.toUpperCase().startsWith('GIT_')) env[key] = value;
  }
  return { ...env, ...extra, GIT_TERMINAL_PROMPT: '0' };
}

function git(cwd: string, args: readonly string[], allowFailure = false): string {
  const result = spawnSync('git', [...args], { cwd, env: cleanEnv(), shell: false, encoding: 'utf8' });
  if (!allowFailure && result.status !== 0) throw new Error(`fixture git failed: git ${args.join(' ')}\n${result.stderr}`);
  return result.stdout.trim();
}

async function createRepo(): Promise<{ root: string; sha: string }> {
  const root = await mkdtemp(join(tmpdir(), 'delethos worktree fixture '));
  git(root, ['init', '-q']);
  git(root, ['config', 'user.name', 'Delethos Test']);
  git(root, ['config', 'user.email', 'delethos@example.invalid']);
  await writeFile(join(root, 'tracked.txt'), 'committed\n');
  git(root, ['add', 'tracked.txt']);
  git(root, ['commit', '-qm', 'fixture']);
  return { root, sha: git(root, ['rev-parse', 'HEAD']) };
}

async function cleanupFixture(root: string, prepared?: PreparedWorktree): Promise<void> {
  if (prepared) {
    git(root, ['worktree', 'unlock', prepared.path], true);
    git(root, ['worktree', 'remove', '--force', prepared.path], true);
    await rm(prepared.tempParent, { recursive: true, force: true });
  }
  await rm(root, { recursive: true, force: true });
}

function normalizeEol(value: string): string {
  return value.replaceAll('\r\n', '\n');
}

test('porcelain -z parser preserves paths with spaces and lock reasons', () => {
  const sha = 'a'.repeat(40);
  const input = Buffer.from(
    `worktree /tmp/primary\0HEAD ${sha}\0branch refs/heads/main\0\0` +
      `worktree /tmp/path with spaces\0HEAD ${sha}\0detached\0locked delethos:run-1\0\0`,
  );
  const entries = parseWorktreePorcelainZ(input);
  assert.equal(entries.length, 2);
  assert.equal(entries[1]?.path, '/tmp/path with spaces');
  assert.equal(entries[1]?.detached, true);
  assert.equal(entries[1]?.lockReason, 'delethos:run-1');
});

test('prepareWorktree creates an exact detached locked worktree without copying primary dirt', async () => {
  const fixture = await createRepo();
  let prepared: PreparedWorktree | undefined;
  try {
    await writeFile(join(fixture.root, 'tracked.txt'), 'primary dirty\n');
    await writeFile(join(fixture.root, 'untracked.txt'), 'primary only\n');
    prepared = await prepareWorktree({ repositoryPath: fixture.root, baseSha: fixture.sha, runId: 'run-primary-dirty' });
    assert.equal(prepared.repository.primaryDirty, true);
    assert.equal(prepared.headSha.toLowerCase(), fixture.sha.toLowerCase());
    assert.equal(git(prepared.path, ['rev-parse', 'HEAD']).toLowerCase(), fixture.sha.toLowerCase());
    assert.equal(git(prepared.path, ['symbolic-ref', '--quiet', 'HEAD'], true), '');
    assert.equal(await inspectWorktreeState(prepared.path), 'CLEAN');
    const preparedPath = prepared.path;
    await assert.rejects(() => access(join(preparedPath, 'untracked.txt')));
    const owned = await discoverOwnedWorktrees(fixture.root);
    const preparedRealPath = await realpath(prepared.path);
    const ownedRealPaths = await Promise.all(owned.map((entry) => realpath(entry.path)));
    assert.equal(ownedRealPaths.includes(preparedRealPath), true);
  } finally {
    await cleanupFixture(fixture.root, prepared);
  }
});

test('clean owned worktree cleanup succeeds without force removal', async () => {
  const fixture = await createRepo();
  let prepared: PreparedWorktree | undefined;
  try {
    prepared = await prepareWorktree({ repositoryPath: fixture.root, baseSha: fixture.sha, runId: 'run-clean' });
    const path = prepared.path;
    const result = await cleanupOwnedWorktree(prepared);
    assert.deepEqual(result, { state: 'CLEAN', removed: true, relocked: null, detail: null });
    prepared = undefined;
    await assert.rejects(() => access(path));
  } finally {
    await cleanupFixture(fixture.root, prepared);
  }
});

test('dirty owned worktree cleanup refuses destruction and preserves content', async () => {
  const fixture = await createRepo();
  let prepared: PreparedWorktree | undefined;
  try {
    prepared = await prepareWorktree({ repositoryPath: fixture.root, baseSha: fixture.sha, runId: 'run-dirty' });
    const dirtyPath = join(prepared.path, 'partial.txt');
    await writeFile(dirtyPath, 'preserve me\n');
    const result = await cleanupOwnedWorktree(prepared);
    assert.equal(result.state, 'DIRTY');
    assert.equal(result.removed, false);
    await access(dirtyPath);
    assert.equal(await inspectWorktreeState(prepared.path), 'DIRTY');
  } finally {
    await cleanupFixture(fixture.root, prepared);
  }
});

test('worktree preparation suppresses post-checkout hooks and external filter drivers', async () => {
  const fixture = await createRepo();
  let prepared: PreparedWorktree | undefined;
  const hookMarker = join(fixture.root, 'hook-marker');
  const filterMarker = join(fixture.root, 'filter-marker');
  const oldHookMarker = process.env.DELETHOS_HOOK_MARKER;
  const oldFilterMarker = process.env.DELETHOS_FILTER_MARKER;
  const oldGitDir = process.env.GIT_DIR;
  try {
    await writeFile(
      join(fixture.root, '.gitattributes'),
      'smudge.txt filter=smudge\nclean.txt filter=clean\nprocess.txt filter=process\n',
    );
    await writeFile(join(fixture.root, 'smudge.txt'), 'committed-smudge\n');
    await writeFile(join(fixture.root, 'clean.txt'), 'committed-clean\n');
    await writeFile(join(fixture.root, 'process.txt'), 'committed-process\n');
    git(fixture.root, ['add', '.gitattributes', 'smudge.txt', 'clean.txt', 'process.txt']);
    git(fixture.root, ['commit', '-qm', 'filtered fixture']);
    fixture.sha = git(fixture.root, ['rev-parse', 'HEAD']);

    const markerScript = join(fixture.root, 'hostile-filter.cjs');
    await writeFile(
      markerScript,
      "const fs=require('node:fs'); fs.appendFileSync(process.env.DELETHOS_FILTER_MARKER, process.argv[2]+'\\n'); process.stdin.pipe(process.stdout);\n",
    );
    const node = process.execPath.replaceAll('\\', '/');
    const script = markerScript.replaceAll('\\', '/');
    git(fixture.root, ['config', 'filter.smudge.smudge', `\"${node}\" \"${script}\" smudge`]);
    git(fixture.root, ['config', 'filter.smudge.required', 'true']);
    git(fixture.root, ['config', 'filter.clean.clean', `\"${node}\" \"${script}\" clean`]);
    git(fixture.root, ['config', 'filter.clean.required', 'true']);
    git(fixture.root, ['config', 'filter.process.process', `\"${node}\" \"${script}\" process`]);
    git(fixture.root, ['config', 'filter.process.required', 'true']);

    const hook = join(fixture.root, '.git', 'hooks', 'post-checkout');
    await writeFile(hook, '#!/bin/sh\nprintf executed > "$DELETHOS_HOOK_MARKER"\nexit 0\n');
    await chmod(hook, 0o755);

    process.env.DELETHOS_HOOK_MARKER = hookMarker;
    process.env.DELETHOS_FILTER_MARKER = filterMarker;
    process.env.GIT_DIR = join(fixture.root, 'hostile-nonexistent-git-dir');
    prepared = await prepareWorktree({ repositoryPath: fixture.root, baseSha: fixture.sha, runId: 'run-hostile-git' });

    assert.equal(prepared.suppressedFilterDrivers.includes('clean'), true);
    assert.equal(prepared.suppressedFilterDrivers.includes('process'), true);
    assert.equal(prepared.suppressedFilterDrivers.includes('smudge'), true);
    await assert.rejects(() => access(hookMarker));
    await assert.rejects(() => access(filterMarker));
    const { readFile } = await import('node:fs/promises');
    assert.equal(normalizeEol(await readFile(join(prepared.path, 'smudge.txt'), 'utf8')), 'committed-smudge\n');
    assert.equal(normalizeEol(await readFile(join(prepared.path, 'process.txt'), 'utf8')), 'committed-process\n');

    await writeFile(join(prepared.path, 'clean.txt'), 'changed\n');
    assert.equal(await inspectWorktreeState(prepared.path), 'DIRTY');
    await assert.rejects(() => access(filterMarker));
  } finally {
    if (oldHookMarker === undefined) delete process.env.DELETHOS_HOOK_MARKER;
    else process.env.DELETHOS_HOOK_MARKER = oldHookMarker;
    if (oldFilterMarker === undefined) delete process.env.DELETHOS_FILTER_MARKER;
    else process.env.DELETHOS_FILTER_MARKER = oldFilterMarker;
    if (oldGitDir === undefined) delete process.env.GIT_DIR;
    else process.env.GIT_DIR = oldGitDir;
    await cleanupFixture(fixture.root, prepared);
  }
});
