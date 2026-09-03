#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const IMPLEMENTATION_URL = new URL('./recovery-provider-prereq-impl.mjs', import.meta.url);
const IMPLEMENTATION_PATH = fileURLToPath(IMPLEMENTATION_URL);
const FLUSH_DELAY_BEFORE_MS = 25;
const FLUSH_DELAY_AFTER_MS = 250;
const FLUSH_CONSTANT = `const PI_TOOL_FLUSH_GRACE_MS = ${FLUSH_DELAY_BEFORE_MS};`;
const FLUSH_USE = 'setTimeout(resolveValue, PI_TOOL_FLUSH_GRACE_MS)';

const implementationSource = readFileSync(IMPLEMENTATION_PATH, 'utf8');
const constantMatches = implementationSource.split(FLUSH_CONSTANT).length - 1;
const useMatches = implementationSource.split(FLUSH_USE).length - 1;
if (constantMatches !== 1 || useMatches !== 1) {
  throw new Error(`R181 flush shim contract drifted: constants=${constantMatches} uses=${useMatches}`);
}

const nativeSetTimeout = globalThis.setTimeout;
let flushDelayApplied = false;
globalThis.setTimeout = function delethosR181BoundedSetTimeout(callback, delay, ...args) {
  if (!flushDelayApplied && delay === FLUSH_DELAY_BEFORE_MS) {
    const stack = new Error().stack ?? '';
    if (stack.includes('recovery-provider-prereq-impl.mjs')) {
      flushDelayApplied = true;
      return nativeSetTimeout(callback, FLUSH_DELAY_AFTER_MS, ...args);
    }
  }
  return nativeSetTimeout(callback, delay, ...args);
};

await import(IMPLEMENTATION_URL.href);
