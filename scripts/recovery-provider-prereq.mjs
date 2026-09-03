#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = dirname(SCRIPT_DIR);
const IMPLEMENTATION_PATH = join(SCRIPT_DIR, 'recovery-provider-prereq-impl.mjs');
const EXPECTED_BASE_BLOB = '0027b883aa046b39ae06278ff623c3e346cd25d0';
const EXPECTED_CANDIDATE_BLOB = '587e2e2e8e3b2ce485e57e4e6f43934043ba6cb2';
const AMENDMENT_010_PATCH = "--- a/scripts/recovery-provider-prereq-impl.mjs\n+++ b/scripts/recovery-provider-prereq-impl.mjs\n@@ -45,7 +45,7 @@\n const RUNTIME_VERSION_TIMEOUT_MS = 120_000;\n const PI_TOOL_SMOKE_TIMEOUT_MS = 300_000;\n const PI_TOOL_POLL_MS = 20;\n-const PI_TOOL_FLUSH_GRACE_MS = 25;\n+const PI_TOOL_NATURAL_EXIT_GRACE_MS = 30_000;\n \n if (OPENCODE_R181_PROVIDER_ID !== CANONICAL_PROVIDER || OPENCODE_R181_MODEL_ID !== CANONICAL_MODEL) {\n   throw new Error('OpenCode R181 identity constants drifted from canonical Amendment 008');\n@@ -490,7 +490,7 @@\n   return { values, config };\n }\n \n-function buildPiR181Models(baseURL, forceFirstTool) {\n+function buildPiR181Models(baseURL) {\n   const model = {\n     id: CANONICAL_MODEL,\n     name: 'Delethos local Qwen2.5 Coder 1.5B Q4_K_M',\n@@ -500,7 +500,6 @@\n     maxTokens: 2048,\n     cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },\n   };\n-  if (forceFirstTool) model.samplingParams = { tool_choice: 'required' };\n   return {\n     providers: {\n       [CANONICAL_PROVIDER]: {\n@@ -515,15 +514,12 @@\n   };\n }\n \n-function exactPiConfig(config, baseURL, forceFirstTool) {\n+function exactPiConfig(config, baseURL) {\n   const provider = config?.providers?.[CANONICAL_PROVIDER];\n   const models = provider?.models;\n   if (!Array.isArray(models) || models.length !== 1) return false;\n   const model = models[0];\n-  const sampling = model?.samplingParams;\n-  const exactSampling = forceFirstTool\n-    ? sampling?.tool_choice === 'required' && Object.keys(sampling).length === 1\n-    : sampling === undefined;\n+  const exactSampling = model?.samplingParams === undefined;\n   return provider?.baseUrl === baseURL\n     && provider?.api === 'openai-completions'\n     && provider?.apiKey === 'delethos-local-no-secret'\n@@ -644,6 +640,10 @@\n   });\n }\n \n+function boundedNaturalExitDeadline(outerDeadline, smokeObservedAt) {\n+  return Math.min(outerDeadline, smokeObservedAt + PI_TOOL_NATURAL_EXIT_GRACE_MS);\n+}\n+\n async function waitForExactSmokeThenStop(repo, running, timeoutMs = PI_TOOL_SMOKE_TIMEOUT_MS) {\n   const smokePath = join(repo, SMOKE_FILE);\n   const deadline = Date.now() + timeoutMs;\n@@ -656,32 +656,41 @@\n     if (existsSync(smokePath)) {\n       const stat = lstatSync(smokePath);\n       if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('Pi smoke target became a non-regular file');\n+      let content = null;\n       try {\n-        const content = await readFile(smokePath, 'utf8');\n-        if (content === SMOKE_CONTENT) {\n-          await new Promise((resolveValue) => setTimeout(resolveValue, PI_TOOL_FLUSH_GRACE_MS));\n-          if (settled === null) running.cancel();\n-          return await running.result;\n-        }\n+        content = await readFile(smokePath, 'utf8');\n       } catch {\n         // The write may still be in progress. Continue bounded polling.\n       }\n+      if (content === SMOKE_CONTENT) {\n+        const naturalDeadline = boundedNaturalExitDeadline(deadline, Date.now());\n+        while (settled === null && Date.now() < naturalDeadline) {\n+          const remaining = naturalDeadline - Date.now();\n+          await new Promise((resolveValue) => setTimeout(resolveValue, Math.min(PI_TOOL_POLL_MS, Math.max(1, remaining))));\n+        }\n+        if (settled !== null) return settled;\n+        running.cancel();\n+        const cancelled = await running.result;\n+        throw new Error(`Pi write smoke did not settle naturally within bounded grace: cause=${cancelled.cause} exit=${cancelled.exitCode ?? 'null'} cleanup=${cancelled.cleanupStatus}`);\n+      }\n     }\n     if (settled !== null) return settled;\n-    await new Promise((resolveValue) => setTimeout(resolveValue, PI_TOOL_POLL_MS));\n+    const remaining = deadline - Date.now();\n+    if (remaining > 0) {\n+      await new Promise((resolveValue) => setTimeout(resolveValue, Math.min(PI_TOOL_POLL_MS, remaining)));\n+    }\n   }\n   if (settled === null) running.cancel();\n   const result = await running.result;\n-  throw new Error(`Pi write smoke did not produce exact file before deadline: cause=${result.cause} exit=${result.exitCode ?? 'null'}`);\n+  throw new Error(`Pi write smoke did not produce exact file before deadline: cause=${result.cause} exit=${result.exitCode ?? 'null'} cleanup=${result.cleanupStatus}`);\n }\n \n function validateForcedSmokeProcess(result) {\n   if (result.outputTruncated) throw new Error('Pi write-smoke output was truncated');\n+  if (result.cause === 'EXITED' && result.exitCode === 0) return;\n   if (result.cause === 'CANCELLED') {\n-    if (result.cleanupStatus !== 'SUCCEEDED') throw new Error(`Pi write-smoke cancellation cleanup failed: ${result.cleanupStatus}`);\n-    return;\n-  }\n-  if (result.cause === 'EXITED' && result.exitCode === 0) return;\n+    throw new Error(`Pi write-smoke cancellation is fail-closed: cleanup=${result.cleanupStatus}`);\n+  }\n   throw new Error(`Pi write-smoke process ended unexpectedly: cause=${result.cause} exit=${result.exitCode ?? 'null'} cleanup=${result.cleanupStatus}`);\n }\n \n@@ -695,10 +704,29 @@\n   }\n \n   const baseURL = 'http://127.0.0.1:12345/v1';\n-  const ordinaryPiConfig = buildPiR181Models(baseURL, false);\n-  const forcedPiConfig = buildPiR181Models(baseURL, true);\n-  if (!exactPiConfig(ordinaryPiConfig, baseURL, false)) throw new Error('Pi ordinary R181 config self-test failed');\n-  if (!exactPiConfig(forcedPiConfig, baseURL, true)) throw new Error('Pi forced-tool R181 config self-test failed');\n+  const piConfig = buildPiR181Models(baseURL);\n+  if (!exactPiConfig(piConfig, baseURL)) throw new Error('Pi canonical R181 config self-test failed');\n+  if (piConfig.providers[CANONICAL_PROVIDER].models[0].samplingParams !== undefined) {\n+    throw new Error('Pi R181 config unexpectedly contains model-level samplingParams');\n+  }\n+  if (PI_TOOL_NATURAL_EXIT_GRACE_MS > 30_000 || PI_TOOL_SMOKE_TIMEOUT_MS !== 300_000) {\n+    throw new Error('Pi R181 natural-exit timing bounds drifted from Amendment 010');\n+  }\n+  const timingOrigin = 1_000_000;\n+  if (boundedNaturalExitDeadline(timingOrigin + PI_TOOL_SMOKE_TIMEOUT_MS, timingOrigin) !== timingOrigin + PI_TOOL_NATURAL_EXIT_GRACE_MS) {\n+    throw new Error('Pi R181 natural-exit grace was not bounded to 30 seconds');\n+  }\n+  if (boundedNaturalExitDeadline(timingOrigin + 10_000, timingOrigin) !== timingOrigin + 10_000) {\n+    throw new Error('Pi R181 natural-exit grace extended the outer deadline');\n+  }\n+  validateForcedSmokeProcess({ outputTruncated: false, cause: 'EXITED', exitCode: 0, cleanupStatus: 'NOT_REQUIRED' });\n+  let cancellationRejected = false;\n+  try {\n+    validateForcedSmokeProcess({ outputTruncated: false, cause: 'CANCELLED', exitCode: null, cleanupStatus: 'SUCCEEDED' });\n+  } catch {\n+    cancellationRejected = true;\n+  }\n+  if (!cancellationRejected) throw new Error('Pi R181 cancellation fail-closed self-test failed');\n   const openCodeConfig = buildOpenCodeR181Config(baseURL, SMOKE_FILE);\n   if (!exactOpenCodePolicy(openCodeConfig, baseURL)) throw new Error('OpenCode R181 policy self-test failed');\n \n@@ -709,9 +737,13 @@\n   ].join('\\n');\n   requireExactPiWriteEvidence(syntheticWrite);\n   for (const invalid of [\n+    '',\n     syntheticWrite.replace('\"write\",\"args\"', '\"read\",\"args\"'),\n     `${syntheticWrite}\\n${JSON.stringify({ type: 'tool_execution_start', toolCallId: 'call-2', toolName: 'write', args: {} })}`,\n+    syntheticWrite.replace('\"toolCallId\":\"call-1\",\"toolName\":\"write\",\"result\"', '\"toolCallId\":\"call-2\",\"toolName\":\"write\",\"result\"'),\n     syntheticWrite.replace('\"isError\":false', '\"isError\":true'),\n+    `${syntheticWrite}\\nnot-json`,\n+    syntheticWrite.replace(`\"provider\":\"${CANONICAL_PROVIDER}\"`, '\"provider\":\"unexpected-provider\"'),\n   ]) {\n     let rejected = false;\n     try { requireExactPiWriteEvidence(invalid); } catch { rejected = true; }\n@@ -784,7 +816,9 @@\n     arch: selected.arch,\n     outcome: 'PASS',\n     pi_max_tokens: 2048,\n-    forced_tool_choice: 'required',\n+    model_tool_choice: 'omitted',\n+    pi_tool_natural_exit_grace_ms: PI_TOOL_NATURAL_EXIT_GRACE_MS,\n+    pi_tool_smoke_timeout_ms: PI_TOOL_SMOKE_TIMEOUT_MS,\n     runtime_version_timeout_ms: RUNTIME_VERSION_TIMEOUT_MS,\n   }));\n }\n@@ -939,8 +973,8 @@\n     const piCompletionEnvRoot = join(piRoot, 'completion-environment');\n     mkdirSync(piCompletionEnvRoot, { recursive: false });\n     const piCompletionEnv = piEnvironment(piCompletionEnvRoot);\n-    const piCompletionConfig = buildPiR181Models(baseURL, false);\n-    if (!exactPiConfig(piCompletionConfig, baseURL, false)) throw new Error('Pi completion provider config drifted from Amendment 008');\n+    const piCompletionConfig = buildPiR181Models(baseURL);\n+    if (!exactPiConfig(piCompletionConfig, baseURL)) throw new Error('Pi completion provider config drifted from Amendment 008');\n     writeFileSync(join(piCompletionEnv.config, 'models.json'), `${JSON.stringify(piCompletionConfig, null, 2)}\\n`, { flag: 'wx' });\n     const piCompletionRepo = createFixtureRepo(qualificationRoot, 'pi-completion-fixture');\n     const piCompletionBefore = snapshotRepository(piCompletionRepo);\n@@ -984,8 +1018,8 @@\n     const piSmokeEnvRoot = join(piRoot, 'smoke-environment');\n     mkdirSync(piSmokeEnvRoot, { recursive: false });\n     const piSmokeEnv = piEnvironment(piSmokeEnvRoot);\n-    const piSmokeConfig = buildPiR181Models(baseURL, true);\n-    if (!exactPiConfig(piSmokeConfig, baseURL, true)) throw new Error('Pi forced-tool provider config drifted from bounded R181 posture');\n+    const piSmokeConfig = buildPiR181Models(baseURL);\n+    if (!exactPiConfig(piSmokeConfig, baseURL)) throw new Error('Pi write-smoke provider config drifted from Amendment 010');\n     writeFileSync(join(piSmokeEnv.config, 'models.json'), `${JSON.stringify(piSmokeConfig, null, 2)}\\n`, { flag: 'wx' });\n     const piSmokeRepo = createFixtureRepo(qualificationRoot, 'pi-smoke-fixture');\n     const piSmokeBefore = snapshotRepository(piSmokeRepo);\n";

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
if (canonicalSource.includes('\r')) throw new Error('R181 canonical implementation contained unsupported carriage returns');
if (gitBlobSha(canonicalSource) !== EXPECTED_BASE_BLOB) {
  throw new Error('R181 canonical implementation blob drifted from Amendment 010 base');
}

const tempRoot = mkdtempSync(join(resolve(process.env.RUNNER_TEMP || tmpdir()), 'delethos-r181-am010-'));
const tempScripts = join(tempRoot, 'scripts');
mkdirSync(tempScripts, { recursive: false });
const tempImplementation = join(tempScripts, 'recovery-provider-prereq-impl.mjs');
const patchPath = join(tempRoot, 'amendment-010.patch');
writeFileSync(tempImplementation, canonicalSource, { flag: 'wx' });
writeFileSync(patchPath, AMENDMENT_010_PATCH, { flag: 'wx' });

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
