import { createHash } from "node:crypto";

import { canonicalize, type CanonicalizationError } from "./canonical.ts";

export type CanonicalDigestResult =
  | { readonly ok: true; readonly digest: string; readonly canonical: string }
  | { readonly ok: false; readonly error: CanonicalizationError };

export function sha256Utf8(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function digestCanonical(input: unknown): CanonicalDigestResult {
  const result = canonicalize(input);
  if (!result.ok) return result;
  return { ok: true, digest: sha256Utf8(result.value), canonical: result.value };
}

export function isSha256Digest(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{64}$/.test(value);
}
