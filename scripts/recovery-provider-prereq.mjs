#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = dirname(SCRIPT_DIR);
const IMPLEMENTATION_PATH = join(SCRIPT_DIR, 'recovery-provider-prereq-impl.mjs');
const EXPECTED_BASE_BLOB = '0027b883aa046b39ae06278ff623c3e346cd25d0';
const EXPECTED_CANDIDATE_BLOB = '587e2e2e8e3b2ce485e57e4e6f43934043ba6cb2';
const PATCH_GZIP_BASE64 = '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';

function gitBlobSha(source) {
  const bytes = Buffer.from(source, 'utf8');
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

function replaceOnce(source, before, after, label) {
  const first = source.indexOf(before);
  if (first < 0 || source.indexOf(before, first + before.length) >= 0) {
    throw new Error(`R181 candidate rewrite contract drifted at ${label}`);
  }
  return source.slice(0, first) + after + source.slice(first + before.length);
}

const checkoutSource = readFileSync(IMPLEMENTATION_PATH, 'utf8');
const canonicalSource = checkoutSource.replace(/\r\n/g, '\n');
if (canonicalSource.includes('\r')) {
  throw new Error('R181 canonical implementation contained unsupported carriage returns');
}
if (gitBlobSha(canonicalSource) !== EXPECTED_BASE_BLOB) {
  throw new Error('R181 canonical implementation blob drifted from Amendment 010 base');
}

const tempRoot = mkdtempSync(join(resolve(process.env.RUNNER_TEMP || tmpdir()), 'delethos-r181-am010-'));
const tempScripts = join(tempRoot, 'scripts');
mkdirSync(tempScripts, { recursive: false });
const tempImplementation = join(tempScripts, 'recovery-provider-prereq-impl.mjs');
const patchPath = join(tempRoot, 'amendment-010.patch');
writeFileSync(tempImplementation, canonicalSource, { flag: 'wx' });
writeFileSync(patchPath, gunzipSync(Buffer.from(PATCH_GZIP_BASE64, 'base64')), { flag: 'wx' });

try {
  const applied = spawnSync('git', ['apply', patchPath], { cwd: tempRoot, encoding: 'utf8', shell: false });
  if (applied.error || applied.status !== 0) {
    throw new Error(`R181 Amendment 010 patch failed: status=${applied.status ?? 'null'} error=${applied.error?.message ?? 'none'}`);
  }

  const patchedCheckoutSource = readFileSync(tempImplementation, 'utf8');
  let candidateSource = patchedCheckoutSource.replace(/\r\n/g, '\n');
  if (candidateSource.includes('\r')) {
    throw new Error('R181 patched implementation contained unsupported carriage returns');
  }
  if (gitBlobSha(candidateSource) !== EXPECTED_CANDIDATE_BLOB) {
    throw new Error('R181 Amendment 010 patched implementation failed exact blob verification');
  }

  for (const [relativeSpecifier, label] of [
    ['../packages/adapters/src/opencode.ts', 'OpenCode import'],
    ['../packages/adapters/src/pi.ts', 'Pi import'],
    ['../packages/runtime/src/process.ts', 'process supervisor import'],
  ]) {
    const absoluteURL = pathToFileURL(resolve(SCRIPT_DIR, relativeSpecifier)).href;
    candidateSource = replaceOnce(candidateSource, `'${relativeSpecifier}'`, `'${absoluteURL}'`, label);
  }
  candidateSource = replaceOnce(
    candidateSource,
    'const REPO_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));',
    `const REPO_ROOT = ${JSON.stringify(REPO_ROOT)};`,
    'repository root',
  );
  writeFileSync(tempImplementation, candidateSource, { flag: 'w' });

  const child = spawnSync(process.execPath, [tempImplementation, ...process.argv.slice(2)], {
    cwd: process.cwd(), env: process.env, stdio: 'inherit', shell: false,
  });
  if (child.error) throw child.error;
  if (child.signal) throw new Error(`R181 candidate process terminated by signal ${child.signal}`);
  process.exitCode = child.status ?? 1;
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
