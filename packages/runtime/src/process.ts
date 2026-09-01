import { spawn, type ChildProcessByStdio } from 'node:child_process';
import { stat } from 'node:fs/promises';
import { isAbsolute } from 'node:path';
import { performance } from 'node:perf_hooks';
import type { Readable } from 'node:stream';

export type ProcessTerminalCause =
  | 'EXITED'
  | 'FAILED_TO_START'
  | 'CANCELLED'
  | 'TIMED_OUT'
  | 'STALLED'
  | 'OUTPUT_LIMIT';

export type ProcessEnvironment =
  | { readonly mode: 'INHERIT' }
  | { readonly mode: 'EXACT'; readonly values: Readonly<Record<string, string>> };

export interface ProcessRequest {
  readonly command: string;
  readonly args?: readonly string[];
  readonly cwd: string;
  readonly environment: ProcessEnvironment;
  readonly timeoutMs?: number;
  readonly stallMs?: number;
  readonly terminationGraceMs?: number;
  readonly outputLimitBytes?: number;
}

export type CleanupStatus = 'NOT_NEEDED' | 'SUCCEEDED' | 'FAILED';
export type TerminationStrategy = 'NONE' | 'POSIX_PROCESS_GROUP' | 'WINDOWS_TASKKILL_TREE';

export interface ProcessResult {
  readonly cause: ProcessTerminalCause;
  readonly pid: number | null;
  readonly exitCode: number | null;
  readonly signal: NodeJS.Signals | null;
  readonly stdout: string;
  readonly stderr: string;
  readonly stdoutBytes: number;
  readonly stderrBytes: number;
  readonly retainedBytes: number;
  readonly outputTruncated: boolean;
  readonly terminationStrategy: TerminationStrategy;
  readonly terminationAttempted: boolean;
  readonly cleanupStatus: CleanupStatus;
  readonly cleanupDetail: string | null;
  readonly elapsedMs: number;
}

export interface SupervisedProcess {
  readonly result: Promise<ProcessResult>;
  cancel(): void;
}

const DEFAULT_OUTPUT_LIMIT = 1024 * 1024;
const DEFAULT_GRACE_MS = 300;
const MAX_DELAY_MS = 24 * 60 * 60 * 1000;
const MAX_OUTPUT_LIMIT = 64 * 1024 * 1024;

function positiveInteger(name: string, value: number | undefined, fallback?: number): number | undefined {
  if (value === undefined) return fallback;
  if (!Number.isSafeInteger(value) || value <= 0) throw new TypeError(`${name} must be a positive safe integer`);
  if (value > MAX_DELAY_MS && name !== 'outputLimitBytes') throw new TypeError(`${name} exceeds the bounded maximum`);
  return value;
}

async function validateRequest(request: ProcessRequest): Promise<Required<Pick<ProcessRequest, 'command' | 'cwd' | 'environment'>> & {
  readonly args: readonly string[];
  readonly timeoutMs?: number;
  readonly stallMs?: number;
  readonly terminationGraceMs: number;
  readonly outputLimitBytes: number;
}> {
  if (typeof request.command !== 'string' || request.command.trim() === '') throw new TypeError('command must be non-empty');
  const args = request.args ?? [];
  if (!Array.isArray(args) || args.some((value) => typeof value !== 'string')) throw new TypeError('args must be a string array');
  if (!isAbsolute(request.cwd)) throw new TypeError('cwd must be absolute');
  const cwdStat = await stat(request.cwd);
  if (!cwdStat.isDirectory()) throw new TypeError('cwd must be an existing directory');

  if (request.environment.mode === 'EXACT') {
    for (const [key, value] of Object.entries(request.environment.values)) {
      if (typeof key !== 'string' || typeof value !== 'string') throw new TypeError('EXACT environment values must be strings');
    }
  } else if (request.environment.mode !== 'INHERIT') {
    throw new TypeError('environment mode must be INHERIT or EXACT');
  }

  const outputLimitBytes = positiveInteger('outputLimitBytes', request.outputLimitBytes, DEFAULT_OUTPUT_LIMIT)!;
  if (outputLimitBytes > MAX_OUTPUT_LIMIT) throw new TypeError('outputLimitBytes exceeds the bounded maximum');

  return {
    command: request.command,
    args,
    cwd: request.cwd,
    environment: request.environment,
    timeoutMs: positiveInteger('timeoutMs', request.timeoutMs),
    stallMs: positiveInteger('stallMs', request.stallMs),
    terminationGraceMs: positiveInteger('terminationGraceMs', request.terminationGraceMs, DEFAULT_GRACE_MS)!,
    outputLimitBytes,
  };
}

function environmentFor(request: ProcessEnvironment): NodeJS.ProcessEnv {
  if (request.mode === 'INHERIT') return { ...process.env };
  return { ...request.values };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isNoSuchProcess(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && (error as { code?: unknown }).code === 'ESRCH';
}

async function terminatePosixGroup(pid: number, graceMs: number): Promise<{ status: CleanupStatus; detail: string | null }> {
  try {
    process.kill(-pid, 'SIGTERM');
  } catch (error) {
    if (isNoSuchProcess(error)) return { status: 'SUCCEEDED', detail: 'Process group already absent before SIGTERM' };
    return { status: 'FAILED', detail: `SIGTERM failed: ${error instanceof Error ? error.message : String(error)}` };
  }

  await delay(graceMs);
  try {
    process.kill(-pid, 0);
  } catch (error) {
    if (isNoSuchProcess(error)) return { status: 'SUCCEEDED', detail: null };
    return { status: 'FAILED', detail: `Process-group liveness check failed: ${error instanceof Error ? error.message : String(error)}` };
  }

  try {
    process.kill(-pid, 'SIGKILL');
    return { status: 'SUCCEEDED', detail: 'SIGKILL requested after grace period' };
  } catch (error) {
    if (isNoSuchProcess(error)) return { status: 'SUCCEEDED', detail: null };
    return { status: 'FAILED', detail: `SIGKILL failed: ${error instanceof Error ? error.message : String(error)}` };
  }
}

async function terminateWindowsTree(pid: number): Promise<{ status: CleanupStatus; detail: string | null }> {
  return await new Promise((resolve) => {
    const killer = spawn('taskkill', ['/PID', String(pid), '/T', '/F'], {
      shell: false,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env },
    });
    const stderr: Buffer[] = [];
    let spawnError: Error | null = null;
    killer.stderr.on('data', (chunk: Buffer) => stderr.push(chunk));
    killer.once('error', (error) => {
      spawnError = error;
    });
    killer.once('close', (code) => {
      if (spawnError) {
        resolve({ status: 'FAILED', detail: `taskkill failed to start: ${spawnError.message}` });
        return;
      }
      if (code === 0) resolve({ status: 'SUCCEEDED', detail: null });
      else resolve({ status: 'FAILED', detail: `taskkill exited ${code ?? 'null'}: ${Buffer.concat(stderr).toString('utf8').trim()}` });
    });
  });
}

function strategyForPlatform(): TerminationStrategy {
  return process.platform === 'win32' ? 'WINDOWS_TASKKILL_TREE' : 'POSIX_PROCESS_GROUP';
}

export function superviseProcess(request: ProcessRequest): SupervisedProcess {
  let cancelRequested = false;
  let cancelAction: (() => void) | null = null;

  const result = (async (): Promise<ProcessResult> => {
    const validated = await validateRequest(request);
    const start = performance.now();
    let child: ChildProcessByStdio<null, Readable, Readable>;
    let cause: ProcessTerminalCause | null = null;
    let exitCode: number | null = null;
    let exitSignal: NodeJS.Signals | null = null;
    let stdoutBytes = 0;
    let stderrBytes = 0;
    let retainedBytes = 0;
    let outputTruncated = false;
    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];
    let timeoutTimer: NodeJS.Timeout | null = null;
    let stallTimer: NodeJS.Timeout | null = null;
    let hardFinalizeTimer: NodeJS.Timeout | null = null;
    let terminationAttempted = false;
    let cleanupStatus: CleanupStatus = 'NOT_NEEDED';
    let cleanupDetail: string | null = null;
    let terminationPromise: Promise<void> | null = null;
    let finalized = false;

    let resolveFinal!: (value: ProcessResult) => void;
    const finalPromise = new Promise<ProcessResult>((resolve) => {
      resolveFinal = resolve;
    });

    const clearTimers = () => {
      if (timeoutTimer) clearTimeout(timeoutTimer);
      if (stallTimer) clearTimeout(stallTimer);
      if (hardFinalizeTimer) clearTimeout(hardFinalizeTimer);
      timeoutTimer = null;
      stallTimer = null;
      hardFinalizeTimer = null;
    };

    const finalize = () => {
      if (finalized || cause === null) return;
      finalized = true;
      clearTimers();
      resolveFinal({
        cause,
        pid: child.pid ?? null,
        exitCode,
        signal: exitSignal,
        stdout: Buffer.concat(stdoutChunks).toString('utf8'),
        stderr: Buffer.concat(stderrChunks).toString('utf8'),
        stdoutBytes,
        stderrBytes,
        retainedBytes,
        outputTruncated,
        terminationStrategy: terminationAttempted ? strategyForPlatform() : 'NONE',
        terminationAttempted,
        cleanupStatus,
        cleanupDetail,
        elapsedMs: performance.now() - start,
      });
    };

    const terminate = (pid: number) => {
      if (terminationPromise) return terminationPromise;
      terminationAttempted = true;
      cleanupStatus = 'FAILED';
      terminationPromise = (async () => {
        const outcome = process.platform === 'win32'
          ? await terminateWindowsTree(pid)
          : await terminatePosixGroup(pid, validated.terminationGraceMs);
        cleanupStatus = outcome.status;
        cleanupDetail = outcome.detail;
      })();
      return terminationPromise;
    };

    const claim = (next: ProcessTerminalCause) => {
      if (cause !== null) return false;
      cause = next;
      if (next !== 'EXITED' && next !== 'FAILED_TO_START' && child.pid !== undefined) {
        void terminate(child.pid);
        hardFinalizeTimer = setTimeout(() => {
          cleanupStatus = 'FAILED';
          cleanupDetail ??= 'Process did not close within bounded termination window';
          finalize();
        }, validated.terminationGraceMs + 4000);
        hardFinalizeTimer.unref?.();
      }
      return true;
    };

    const resetStall = () => {
      if (validated.stallMs === undefined || cause !== null) return;
      if (stallTimer) clearTimeout(stallTimer);
      stallTimer = setTimeout(() => claim('STALLED'), validated.stallMs);
      stallTimer.unref?.();
    };

    const retain = (stream: 'stdout' | 'stderr', chunk: Buffer) => {
      if (stream === 'stdout') stdoutBytes += chunk.length;
      else stderrBytes += chunk.length;
      resetStall();

      const available = Math.max(0, validated.outputLimitBytes - retainedBytes);
      if (available > 0) {
        const kept = chunk.length <= available ? chunk : chunk.subarray(0, available);
        if (stream === 'stdout') stdoutChunks.push(kept);
        else stderrChunks.push(kept);
        retainedBytes += kept.length;
      }
      if (chunk.length > available) {
        outputTruncated = true;
        claim('OUTPUT_LIMIT');
      }
    };

    try {
      child = spawn(validated.command, [...validated.args], {
        cwd: validated.cwd,
        env: environmentFor(validated.environment),
        shell: false,
        windowsHide: true,
        detached: process.platform !== 'win32',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch (error) {
      const elapsedMs = performance.now() - start;
      return {
        cause: cancelRequested ? 'CANCELLED' : 'FAILED_TO_START',
        pid: null,
        exitCode: null,
        signal: null,
        stdout: '',
        stderr: '',
        stdoutBytes: 0,
        stderrBytes: 0,
        retainedBytes: 0,
        outputTruncated: false,
        terminationStrategy: 'NONE',
        terminationAttempted: false,
        cleanupStatus: 'NOT_NEEDED',
        cleanupDetail: error instanceof Error ? error.message : String(error),
        elapsedMs,
      };
    }

    cancelAction = () => {
      cancelRequested = true;
      claim('CANCELLED');
    };
    if (cancelRequested) cancelAction();

    child.stdout.on('data', (chunk: Buffer) => retain('stdout', chunk));
    child.stderr.on('data', (chunk: Buffer) => retain('stderr', chunk));

    child.once('spawn', () => {
      if (cause !== null && cause !== 'EXITED' && cause !== 'FAILED_TO_START' && child.pid !== undefined && !terminationAttempted) {
        void terminate(child.pid);
      }
      if (validated.timeoutMs !== undefined && cause === null) {
        timeoutTimer = setTimeout(() => claim('TIMED_OUT'), validated.timeoutMs);
        timeoutTimer.unref?.();
      }
      resetStall();
    });

    child.once('error', (error) => {
      if (child.pid === undefined) {
        if (cause === null) cause = cancelRequested ? 'CANCELLED' : 'FAILED_TO_START';
        cleanupStatus = 'NOT_NEEDED';
        cleanupDetail = error.message;
        queueMicrotask(finalize);
      } else if (cause === null) {
        cause = 'FAILED_TO_START';
        cleanupDetail = error.message;
        queueMicrotask(finalize);
      }
    });

    child.once('close', (code, signal) => {
      exitCode = code;
      exitSignal = signal;
      if (cause === null) cause = 'EXITED';
      void (async () => {
        if (terminationPromise) await terminationPromise;
        finalize();
      })();
    });

    return await finalPromise;
  })();

  return {
    result,
    cancel() {
      cancelRequested = true;
      cancelAction?.();
    },
  };
}
