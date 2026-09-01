import { spawn } from 'node:child_process';
import { access, stat } from 'node:fs/promises';
import { isAbsolute, resolve } from 'node:path';

const DEFAULT_GIT_OUTPUT_LIMIT = 1024 * 1024;
const EXACT_SHA = /^[0-9a-fA-F]{40}$/;

export class GitCommandError extends Error {
  readonly args: readonly string[];
  readonly code: number | null;
  readonly stderr: string;

  constructor(message: string, args: readonly string[], code: number | null, stderr: string) {
    super(message);
    this.name = 'GitCommandError';
    this.args = args;
    this.code = code;
    this.stderr = stderr;
  }
}

export interface GitResult {
  readonly stdout: Buffer;
  readonly stderr: Buffer;
  readonly code: number;
}

export interface RepositoryFacts {
  readonly repositoryTopLevel: string;
  readonly commonDirectory: string;
  readonly headSha: string;
  readonly requestedBaseSha: string;
  readonly resolvedBaseSha: string;
  readonly branchRef: string | null;
  readonly primaryDirty: boolean;
  readonly gitVersion: string;
  readonly suppressedFilterDrivers: readonly string[];
}

function gitEnvironment(): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (key.toUpperCase().startsWith('GIT_')) continue;
    env[key] = value;
  }
  env.GIT_TERMINAL_PROMPT = '0';
  return env;
}

function commandConfigArgs(config: Readonly<Record<string, string>>): string[] {
  const args = ['-c', 'core.fsmonitor=false'];
  for (const key of Object.keys(config).sort()) {
    args.push('-c', `${key}=${config[key]}`);
  }
  return args;
}

export async function runGit(
  cwd: string,
  args: readonly string[],
  options: {
    readonly config?: Readonly<Record<string, string>>;
    readonly allowExitCodes?: readonly number[];
    readonly outputLimitBytes?: number;
  } = {},
): Promise<GitResult> {
  if (!isAbsolute(cwd)) throw new TypeError('Git cwd must be absolute');
  const config = options.config ?? {};
  const fullArgs = [...commandConfigArgs(config), ...args];
  const outputLimitBytes = options.outputLimitBytes ?? DEFAULT_GIT_OUTPUT_LIMIT;
  if (!Number.isSafeInteger(outputLimitBytes) || outputLimitBytes <= 0) {
    throw new TypeError('Git output limit must be a positive safe integer');
  }

  return await new Promise<GitResult>((resolvePromise, reject) => {
    const child = spawn('git', fullArgs, {
      cwd,
      env: gitEnvironment(),
      shell: false,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    let retained = 0;
    let spawnError: Error | null = null;

    const retain = (target: Buffer[], chunk: Buffer) => {
      retained += chunk.length;
      if (retained > outputLimitBytes) {
        child.kill();
        reject(new GitCommandError(`Git output exceeded ${outputLimitBytes} bytes`, fullArgs, null, ''));
        return false;
      }
      target.push(chunk);
      return true;
    };

    child.stdout.on('data', (chunk: Buffer) => retain(stdout, chunk));
    child.stderr.on('data', (chunk: Buffer) => retain(stderr, chunk));
    child.once('error', (error) => {
      spawnError = error;
    });
    child.once('close', (code) => {
      if (spawnError) {
        reject(new GitCommandError(`Failed to start Git: ${spawnError.message}`, fullArgs, null, ''));
        return;
      }
      const exitCode = code ?? -1;
      const stderrBuffer = Buffer.concat(stderr);
      const allowed = new Set(options.allowExitCodes ?? [0]);
      if (!allowed.has(exitCode)) {
        reject(
          new GitCommandError(
            `Git command failed with exit code ${exitCode}`,
            fullArgs,
            exitCode,
            stderrBuffer.toString('utf8'),
          ),
        );
        return;
      }
      resolvePromise({ stdout: Buffer.concat(stdout), stderr: stderrBuffer, code: exitCode });
    });
  });
}

export async function discoverFilterDrivers(cwd: string): Promise<readonly string[]> {
  const result = await runGit(
    cwd,
    ['config', '--null', '--get-regexp', '^filter\\..*\\.(clean|smudge|process|required)$'],
    { allowExitCodes: [0, 1] },
  );
  if (result.code === 1 || result.stdout.length === 0) return [];
  const drivers = new Set<string>();
  for (const record of result.stdout.toString('utf8').split('\0')) {
    if (!record) continue;
    const key = record.split('\n', 1)[0] ?? '';
    const match = /^filter\.(.+)\.(clean|smudge|process|required)$/i.exec(key);
    if (match?.[1]) drivers.add(match[1]);
  }
  return [...drivers].sort();
}

export function filterSuppressionConfig(drivers: readonly string[]): Readonly<Record<string, string>> {
  const config: Record<string, string> = {};
  for (const driver of [...new Set(drivers)].sort()) {
    config[`filter.${driver}.clean`] = '';
    config[`filter.${driver}.smudge`] = '';
    config[`filter.${driver}.process`] = '';
    config[`filter.${driver}.required`] = 'false';
  }
  return config;
}

async function requireDirectory(path: string): Promise<void> {
  await access(path);
  const info = await stat(path);
  if (!info.isDirectory()) throw new TypeError(`Repository path is not a directory: ${path}`);
}

function trim(buffer: Buffer): string {
  return buffer.toString('utf8').trim();
}

export async function inspectRepository(repositoryPath: string, baseSha: string): Promise<RepositoryFacts> {
  if (!isAbsolute(repositoryPath)) throw new TypeError('Repository path must be absolute');
  await requireDirectory(repositoryPath);
  if (!EXACT_SHA.test(baseSha)) throw new TypeError('Base SHA must be exactly 40 hexadecimal characters');

  const inside = trim((await runGit(repositoryPath, ['rev-parse', '--is-inside-work-tree'])).stdout);
  if (inside !== 'true') throw new GitCommandError('Path is not inside a Git worktree', [], 1, '');
  const bare = trim((await runGit(repositoryPath, ['rev-parse', '--is-bare-repository'])).stdout);
  if (bare !== 'false') throw new GitCommandError('Bare repositories are not supported', [], 1, '');

  const repositoryTopLevel = resolve(trim((await runGit(repositoryPath, ['rev-parse', '--show-toplevel'])).stdout));
  const commonDirectoryRaw = trim(
    (await runGit(repositoryPath, ['rev-parse', '--path-format=absolute', '--git-common-dir'])).stdout,
  );
  const commonDirectory = resolve(commonDirectoryRaw);
  const headSha = trim((await runGit(repositoryPath, ['rev-parse', 'HEAD'])).stdout);
  const resolvedBaseSha = trim((await runGit(repositoryPath, ['rev-parse', '--verify', `${baseSha}^{commit}`])).stdout);
  if (!EXACT_SHA.test(resolvedBaseSha)) throw new GitCommandError('Resolved base is not a commit SHA', [], 1, '');

  const branchResult = await runGit(repositoryPath, ['symbolic-ref', '--quiet', 'HEAD'], { allowExitCodes: [0, 1] });
  const branchRef = branchResult.code === 0 ? trim(branchResult.stdout) : null;

  const suppressedFilterDrivers = await discoverFilterDrivers(repositoryTopLevel);
  const status = await runGit(repositoryTopLevel, ['status', '--porcelain=v1', '-z', '--untracked-files=all'], {
    config: filterSuppressionConfig(suppressedFilterDrivers),
  });
  const gitVersion = trim((await runGit(repositoryTopLevel, ['--version'])).stdout);

  return {
    repositoryTopLevel,
    commonDirectory,
    headSha,
    requestedBaseSha: baseSha,
    resolvedBaseSha,
    branchRef,
    primaryDirty: status.stdout.length > 0,
    gitVersion,
    suppressedFilterDrivers,
  };
}
