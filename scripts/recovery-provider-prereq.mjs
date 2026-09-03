#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gunzipSync } from 'node:zlib';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = dirname(SCRIPT_DIR);
const IMPLEMENTATION_PATH = join(SCRIPT_DIR, 'recovery-provider-prereq-impl.mjs');
const EXPECTED_BASE_BLOB = '0027b883aa046b39ae06278ff623c3e346cd25d0';
const EXPECTED_CANDIDATE_BLOB = '5de1500f25002dfc18ceedb15d4cd306830d5172';
const EXPECTED_PATCH_SHA256 = 'd678825e427e88df7146032cc77b934e038c22e2f93bb13779e74990329e89a0';
const AMENDMENT_010_PATCH_GZIP_B64 = "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";

function gitBlobSha(source) {
  const bytes = Buffer.from(source, 'utf8');
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
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
if (canonicalSource.includes('\r')) throw new Error('R181 canonical implementation contained unsupported carriage returns');
if (gitBlobSha(canonicalSource) !== EXPECTED_BASE_BLOB) {
  throw new Error('R181 canonical implementation blob drifted from Amendment 010 base');
}

const patchBytes = gunzipSync(Buffer.from(AMENDMENT_010_PATCH_GZIP_B64, 'base64'));
if (sha256(patchBytes) !== EXPECTED_PATCH_SHA256) throw new Error('R181 Amendment 010 embedded patch digest mismatch');

const tempRoot = mkdtempSync(join(resolve(process.env.RUNNER_TEMP || tmpdir()), 'delethos-r181-am010-'));
const tempScripts = join(tempRoot, 'scripts');
mkdirSync(tempScripts, { recursive: false });
const tempImplementation = join(tempScripts, 'recovery-provider-prereq-impl.mjs');
const patchPath = join(tempRoot, 'amendment-010.patch');
writeFileSync(tempImplementation, canonicalSource, { flag: 'wx' });
writeFileSync(patchPath, patchBytes, { flag: 'wx' });

try {
  const applied = spawnSync('git', ['apply', '--no-index', patchPath], { cwd: tempRoot, encoding: 'utf8', shell: false });
  if (applied.error || applied.status !== 0) {
    throw new Error(`R181 Amendment 010 patch failed: status=${applied.status ?? 'null'} error=${applied.error?.message ?? 'none'}`);
  }

  let candidateSource = readFileSync(tempImplementation, 'utf8').replace(/\r\n/g, '\n');
  if (candidateSource.includes('\r')) throw new Error('R181 patched implementation contained unsupported carriage returns');
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
