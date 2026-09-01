import { mkdtemp, mkdir, readdir, rmdir, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, isAbsolute, join, resolve } from 'node:path';
import {
  discoverFilterDrivers,
  filterSuppressionConfig,
  inspectRepository,
  runGit,
  type RepositoryFacts,
} from './git.ts';

const RUN_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

export interface WorktreeEntry {
  readonly path: string;
  readonly headSha: string | null;
  readonly branchRef: string | null;
  readonly detached: boolean;
  readonly locked: boolean;
  readonly lockReason: string | null;
}

export interface PreparedWorktree {
  readonly runId: string;
  readonly ownershipReason: string;
  readonly repository: RepositoryFacts;
  readonly tempParent: string;
  readonly path: string;
  readonly headSha: string;
  readonly suppressedFilterDrivers: readonly string[];
}

export type WorktreeState = 'CLEAN' | 'DIRTY' | 'MISSING' | 'RECOVERY_REQUIRED';

export interface CleanupResult {
  readonly state: WorktreeState;
  readonly removed: boolean;
  readonly relocked: boolean | null;
  readonly detail: string | null;
}

export class WorktreeRecoveryError extends Error {
  readonly worktreePath: string | null;

  constructor(message: string, worktreePath: string | null = null) {
    super(message);
    this.name = 'WorktreeRecoveryError';
    this.worktreePath = worktreePath;
  }
}

function samePath(a: string, b: string): boolean {
  const left = resolve(a);
  const right = resolve(b);
  return process.platform === 'win32' ? left.toLowerCase() === right.toLowerCase() : left === right;
}

function ownershipReason(runId: string): string {
  if (!RUN_ID.test(runId)) {
    throw new TypeError('runId must be 1-128 portable characters and start with an alphanumeric character');
  }
  return `delethos:${runId}`;
}

export function parseWorktreePorcelainZ(buffer: Buffer): readonly WorktreeEntry[] {
  const records = buffer.toString('utf8').split('\0');
  const entries: WorktreeEntry[] = [];
  let fields: string[] = [];

  const flush = () => {
    if (fields.length === 0) return;
    const worktreeField = fields.find((field) => field.startsWith('worktree '));
    if (!worktreeField) throw new TypeError('Malformed worktree porcelain: missing worktree path');
    const headField = fields.find((field) => field.startsWith('HEAD '));
    const branchField = fields.find((field) => field.startsWith('branch '));
    const lockedField = fields.find((field) => field === 'locked' || field.startsWith('locked '));
    entries.push({
      path: worktreeField.slice('worktree '.length),
      headSha: headField ? headField.slice('HEAD '.length) : null,
      branchRef: branchField ? branchField.slice('branch '.length) : null,
      detached: fields.includes('detached'),
      locked: Boolean(lockedField),
      lockReason: lockedField && lockedField.length > 'locked'.length ? lockedField.slice('locked '.length) : null,
    });
    fields = [];
  };

  for (const record of records) {
    if (record === '') flush();
    else fields.push(record);
  }
  flush();
  return entries;
}

export async function listWorktrees(repositoryPath: string): Promise<readonly WorktreeEntry[]> {
  const result = await runGit(repositoryPath, ['worktree', 'list', '--porcelain', '-z']);
  return parseWorktreePorcelainZ(result.stdout);
}

export async function discoverOwnedWorktrees(repositoryPath: string): Promise<readonly WorktreeEntry[]> {
  return (await listWorktrees(repositoryPath)).filter(
    (entry) => entry.locked && entry.lockReason?.startsWith('delethos:') === true,
  );
}

async function removeEmptyDirectoryOrRecover(path: string, worktreePath: string | null): Promise<void> {
  try {
    await rmdir(path);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new WorktreeRecoveryError(`Expected Delethos-owned directory to be empty: ${message}`, worktreePath);
  }
}

export async function prepareWorktree(input: {
  readonly repositoryPath: string;
  readonly baseSha: string;
  readonly runId: string;
}): Promise<PreparedWorktree> {
  const reason = ownershipReason(input.runId);
  const repository = await inspectRepository(input.repositoryPath, input.baseSha);
  const tempParent = await mkdtemp(join(tmpdir(), 'delethos runtime '));
  const hooksPath = join(tempParent, 'empty-hooks');
  const worktreePath = join(tempParent, 'worktree');
  await mkdir(hooksPath, { mode: 0o700 });

  let added = false;
  try {
    const suppressedFilterDrivers = await discoverFilterDrivers(repository.repositoryTopLevel);
    const config: Record<string, string> = {
      ...filterSuppressionConfig(suppressedFilterDrivers),
      'core.hooksPath': hooksPath,
    };
    await runGit(
      repository.repositoryTopLevel,
      ['worktree', 'add', '--detach', '--lock', '--reason', reason, worktreePath, repository.resolvedBaseSha],
      { config },
    );
    added = true;

    await removeEmptyDirectoryOrRecover(hooksPath, worktreePath);

    const entries = await listWorktrees(repository.repositoryTopLevel);
    const entry = entries.find((candidate) => samePath(candidate.path, worktreePath));
    if (
      !entry ||
      !entry.detached ||
      entry.branchRef !== null ||
      entry.headSha?.toLowerCase() !== repository.resolvedBaseSha.toLowerCase() ||
      !entry.locked ||
      entry.lockReason !== reason
    ) {
      throw new WorktreeRecoveryError('Prepared worktree failed exact ownership/base verification', worktreePath);
    }

    return {
      runId: input.runId,
      ownershipReason: reason,
      repository,
      tempParent,
      path: worktreePath,
      headSha: repository.resolvedBaseSha,
      suppressedFilterDrivers,
    };
  } catch (error) {
    if (!added) {
      try {
        const entries = await readdir(tempParent);
        if (entries.length === 1 && entries[0] === basename(hooksPath)) {
          await rmdir(hooksPath);
        }
        await rmdir(tempParent);
      } catch {
        // Preparation errors preserve unexpected residual state rather than force-cleaning it.
      }
    }
    throw error;
  }
}

export async function inspectWorktreeState(worktreePath: string): Promise<Exclude<WorktreeState, 'RECOVERY_REQUIRED'>> {
  if (!isAbsolute(worktreePath)) throw new TypeError('Worktree path must be absolute');
  try {
    const info = await stat(worktreePath);
    if (!info.isDirectory()) return 'MISSING';
  } catch {
    return 'MISSING';
  }
  const drivers = await discoverFilterDrivers(worktreePath);
  const result = await runGit(worktreePath, ['status', '--porcelain=v1', '-z', '--untracked-files=all'], {
    config: filterSuppressionConfig(drivers),
  });
  return result.stdout.length === 0 ? 'CLEAN' : 'DIRTY';
}

export async function cleanupOwnedWorktree(prepared: PreparedWorktree): Promise<CleanupResult> {
  const entries = await listWorktrees(prepared.repository.repositoryTopLevel);
  const entry = entries.find((candidate) => samePath(candidate.path, prepared.path));
  if (!entry) return { state: 'MISSING', removed: false, relocked: null, detail: 'Worktree is not registered' };
  if (!entry.locked || entry.lockReason !== prepared.ownershipReason || entry.headSha?.toLowerCase() !== prepared.headSha.toLowerCase()) {
    return {
      state: 'RECOVERY_REQUIRED',
      removed: false,
      relocked: null,
      detail: 'Worktree ownership/base verification failed before cleanup',
    };
  }

  const state = await inspectWorktreeState(prepared.path);
  if (state === 'DIRTY') {
    return { state: 'DIRTY', removed: false, relocked: null, detail: 'Dirty worktree preserved for recovery' };
  }
  if (state === 'MISSING') {
    return { state: 'RECOVERY_REQUIRED', removed: false, relocked: null, detail: 'Registered worktree path is missing' };
  }

  await runGit(prepared.repository.repositoryTopLevel, ['worktree', 'unlock', prepared.path]);
  try {
    const drivers = await discoverFilterDrivers(prepared.repository.repositoryTopLevel);
    await runGit(prepared.repository.repositoryTopLevel, ['worktree', 'remove', prepared.path], {
      config: filterSuppressionConfig(drivers),
    });
  } catch (error) {
    let relocked = false;
    try {
      await runGit(prepared.repository.repositoryTopLevel, [
        'worktree',
        'lock',
        '--reason',
        prepared.ownershipReason,
        prepared.path,
      ]);
      relocked = true;
    } catch {
      relocked = false;
    }
    return {
      state: 'RECOVERY_REQUIRED',
      removed: false,
      relocked,
      detail: error instanceof Error ? error.message : String(error),
    };
  }

  try {
    const remaining = await readdir(prepared.tempParent);
    if (remaining.length !== 0) {
      return {
        state: 'RECOVERY_REQUIRED',
        removed: true,
        relocked: null,
        detail: `Temporary parent contains unexpected entries: ${remaining.join(', ')}`,
      };
    }
    await removeEmptyDirectoryOrRecover(prepared.tempParent, null);
  } catch (error) {
    return {
      state: 'RECOVERY_REQUIRED',
      removed: true,
      relocked: null,
      detail: error instanceof Error ? error.message : String(error),
    };
  }

  return { state: 'CLEAN', removed: true, relocked: null, detail: null };
}
