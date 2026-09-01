import assert from "node:assert/strict";
import test from "node:test";

import { canonicalize, digestCanonical, sha256Utf8 } from "../src/index.ts";

test("canonicalizes nested objects with sorted keys", () => {
  const left = canonicalize({ z: 1, a: { y: 2, x: 3 } });
  const right = canonicalize({ a: { x: 3, y: 2 }, z: 1 });
  assert.deepEqual(left, { ok: true, value: '{"a":{"x":3,"y":2},"z":1}' });
  assert.deepEqual(right, left);
});

test("preserves array order and JSON string escaping", () => {
  assert.deepEqual(canonicalize(["a\n", 2, false, null]), { ok: true, value: '["a\\n",2,false,null]' });
});

test("normalizes negative zero to zero", () => {
  assert.deepEqual(canonicalize(-0), { ok: true, value: "0" });
});

test("rejects non-finite numbers", () => {
  for (const value of [Number.NaN, Infinity, -Infinity]) {
    const result = canonicalize(value);
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.error.code, "NON_FINITE_NUMBER");
  }
});

test("rejects unsupported primitive types", () => {
  for (const value of [undefined, 1n, Symbol("x"), () => 1]) {
    const result = canonicalize(value);
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.error.code, "UNSUPPORTED_TYPE");
  }
});

test("rejects cycles", () => {
  const cyclic: { self?: unknown } = {};
  cyclic.self = cyclic;
  const result = canonicalize(cyclic);
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.error.code, "CYCLIC_REFERENCE");
});

test("rejects class instances and accessor properties without invoking the getter", () => {
  class Example { value = 1; }
  assert.equal(canonicalize(new Example()).ok, false);

  let invoked = false;
  const record: Record<string, unknown> = {};
  Object.defineProperty(record, "secret", { enumerable: true, get() { invoked = true; return 42; } });
  const result = canonicalize(record);
  assert.equal(result.ok, false);
  assert.equal(invoked, false);
});

test("rejects sparse arrays and custom enumerable array properties", () => {
  const sparse = new Array(2);
  sparse[1] = "x";
  assert.equal(canonicalize(sparse).ok, false);

  const array = [1] as number[] & { extra?: string };
  array.extra = "x";
  assert.equal(canonicalize(array).ok, false);
});

test("produces a known SHA-256 vector", () => {
  assert.equal(sha256Utf8("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
});

test("digest is stable for logically equivalent canonical objects", () => {
  const a = digestCanonical({ b: 2, a: 1 });
  const b = digestCanonical({ a: 1, b: 2 });
  assert.equal(a.ok, true);
  assert.equal(b.ok, true);
  if (a.ok && b.ok) {
    assert.equal(a.digest, b.digest);
    assert.match(a.digest, /^[0-9a-f]{64}$/);
  }
});

test("digest changes when canonical value changes", () => {
  const a = digestCanonical({ a: 1 });
  const b = digestCanonical({ a: 2 });
  assert.equal(a.ok && b.ok && a.digest !== b.digest, true);
});
