import { superviseProcess, type ProcessResult, type SupervisedProcess } from '../../runtime/src/process.ts';
import type { AdapterResultStatus, InvocationPlan } from './types.ts';

export function superviseInvocation(plan: InvocationPlan): SupervisedProcess {
  if (!plan.executablePath) throw new TypeError('executablePath is required');
  if (plan.args.some((value) => typeof value !== 'string' || value.includes('\0'))) throw new TypeError('invocation args must be strings without NUL');
  return superviseProcess({
    command: plan.executablePath,
    args: plan.args,
    cwd: plan.cwd,
    environment: plan.environment,
    timeoutMs: plan.timeoutMs,
    stallMs: plan.stallMs,
    terminationGraceMs: plan.terminationGraceMs,
    outputLimitBytes: plan.outputLimitBytes,
  });
}

export function statusFromProcess(result: ProcessResult): AdapterResultStatus | null {
  switch (result.cause) {
    case 'CANCELLED': return 'CANCELLED';
    case 'TIMED_OUT': return 'TIMED_OUT';
    case 'STALLED': return 'STALLED';
    case 'OUTPUT_LIMIT': return 'OUTPUT_LIMIT';
    case 'FAILED_TO_START': return 'PROCESS_FAILED';
    case 'EXITED': return null;
  }
}

export function authFailureText(text: string): boolean {
  const normalized = text.toLowerCase();
  return [
    'authentication',
    'unauthorized',
    'not logged in',
    'login required',
    'api key',
    'invalid token',
    '401',
  ].some((marker) => normalized.includes(marker));
}
