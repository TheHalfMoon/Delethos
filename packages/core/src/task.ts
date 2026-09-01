import { digestCanonical } from "./digest.ts";

export const TASK_SCHEMA_V0 = "delethos.task.experimental.v0" as const;

export interface TaskSnapshotV0 {
  readonly schema: typeof TASK_SCHEMA_V0;
  readonly id: string;
  readonly summary: string;
  readonly scope: {
    readonly allow: readonly string[];
    readonly deny: readonly string[];
  };
  readonly acceptance: readonly string[];
  readonly constraints: readonly string[];
}

export type TaskValidationErrorCode =
  | "INVALID_INPUT"
  | "UNKNOWN_FIELD"
  | "INVALID_SCHEMA"
  | "INVALID_TASK_FIELD"
  | "DUPLICATE_PATH_RULE"
  | "CONTRADICTORY_PATH_RULE"
  | "INVALID_CANONICAL_VALUE";

export interface TaskValidationError {
  readonly code: TaskValidationErrorCode;
  readonly path: string;
  readonly message: string;
}

export type TaskValidationResult =
  | { readonly ok: true; readonly task: TaskSnapshotV0; readonly digest: string }
  | { readonly ok: false; readonly error: TaskValidationError };

function fail(code: TaskValidationErrorCode, path: string, message: string): TaskValidationResult {
  return { ok: false, error: { code, path, message } };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
}

function rejectUnknownKeys(
  record: Record<string, unknown>,
  allowed: readonly string[],
  path: string,
): TaskValidationResult | null {
  const allowedSet = new Set(allowed);
  for (const key of Object.keys(record)) {
    if (!allowedSet.has(key)) return fail("UNKNOWN_FIELD", `${path}.${key}`, `Unknown field: ${key}.`);
  }
  return null;
}

function validateText(value: unknown, path: string): string | TaskValidationResult {
  if (typeof value !== "string" || value.trim().length === 0) {
    return fail("INVALID_TASK_FIELD", path, "Expected a non-empty string.");
  }
  return value;
}

function validateStringList(
  value: unknown,
  path: string,
  requireNonEmpty: boolean,
): string[] | TaskValidationResult {
  if (!Array.isArray(value) || (requireNonEmpty && value.length === 0)) {
    return fail("INVALID_TASK_FIELD", path, requireNonEmpty ? "Expected a non-empty string array." : "Expected a string array.");
  }
  const output: string[] = [];
  for (let index = 0; index < value.length; index += 1) {
    const checked = validateText(value[index], `${path}[${index}]`);
    if (typeof checked !== "string") return checked;
    output.push(checked);
  }
  return output;
}

function validatePathList(value: unknown, path: string): string[] | TaskValidationResult {
  const checked = validateStringList(value, path, false);
  if (!Array.isArray(checked)) return checked;
  const seen = new Set<string>();
  for (let index = 0; index < checked.length; index += 1) {
    const entry = checked[index];
    if (seen.has(entry)) return fail("DUPLICATE_PATH_RULE", `${path}[${index}]`, `Duplicate path rule: ${entry}.`);
    seen.add(entry);
  }
  return checked;
}

function freezeTask(task: TaskSnapshotV0): TaskSnapshotV0 {
  Object.freeze(task.scope.allow);
  Object.freeze(task.scope.deny);
  Object.freeze(task.scope);
  Object.freeze(task.acceptance);
  Object.freeze(task.constraints);
  return Object.freeze(task);
}

export function validateTaskSnapshot(input: unknown): TaskValidationResult {
  if (!isRecord(input)) return fail("INVALID_INPUT", "$", "Task snapshot must be a plain object.");
  const unknown = rejectUnknownKeys(input, ["schema", "id", "summary", "scope", "acceptance", "constraints"], "$");
  if (unknown) return unknown;
  if (input.schema !== TASK_SCHEMA_V0) return fail("INVALID_SCHEMA", "$.schema", `Expected ${TASK_SCHEMA_V0}.`);

  const id = validateText(input.id, "$.id");
  if (typeof id !== "string") return id;
  const summary = validateText(input.summary, "$.summary");
  if (typeof summary !== "string") return summary;

  if (!isRecord(input.scope)) return fail("INVALID_TASK_FIELD", "$.scope", "Scope must be a plain object.");
  const scopeUnknown = rejectUnknownKeys(input.scope, ["allow", "deny"], "$.scope");
  if (scopeUnknown) return scopeUnknown;
  const allow = validatePathList(input.scope.allow, "$.scope.allow");
  if (!Array.isArray(allow)) return allow;
  const deny = validatePathList(input.scope.deny, "$.scope.deny");
  if (!Array.isArray(deny)) return deny;

  const allowSet = new Set(allow);
  for (let index = 0; index < deny.length; index += 1) {
    if (allowSet.has(deny[index])) {
      return fail("CONTRADICTORY_PATH_RULE", `$.scope.deny[${index}]`, `Path rule appears in both allow and deny: ${deny[index]}.`);
    }
  }

  const acceptance = validateStringList(input.acceptance, "$.acceptance", true);
  if (!Array.isArray(acceptance)) return acceptance;
  const constraints = validateStringList(input.constraints, "$.constraints", false);
  if (!Array.isArray(constraints)) return constraints;

  const task = freezeTask({
    schema: TASK_SCHEMA_V0,
    id,
    summary,
    scope: { allow: [...allow], deny: [...deny] },
    acceptance: [...acceptance],
    constraints: [...constraints],
  });
  const digest = digestCanonical(task);
  if (!digest.ok) return fail("INVALID_CANONICAL_VALUE", "$", digest.error.message);
  return { ok: true, task, digest: digest.digest };
}
