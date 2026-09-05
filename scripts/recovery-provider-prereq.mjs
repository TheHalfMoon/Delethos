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
const EXPECTED_AMENDMENT_010_BLOB = '587e2e2e8e3b2ce485e57e4e6f43934043ba6cb2';
const AMENDMENT_010_PATCH = "--- a/scripts/recovery-provider-prereq-impl.mjs\n+++ b/scripts/recovery-provider-prereq-impl.mjs\n@@ -45,7 +45,7 @@\n const RUNTIME_VERSION_TIMEOUT_MS = 120_000;\n const PI_TOOL_SMOKE_TIMEOUT_MS = 300_000;\n const PI_TOOL_POLL_MS = 20;\n-const PI_TOOL_FLUSH_GRACE_MS = 25;\n+const PI_TOOL_NATURAL_EXIT_GRACE_MS = 30_000;\n \n if (OPENCODE_R181_PROVIDER_ID !== CANONICAL_PROVIDER || OPENCODE_R181_MODEL_ID !== CANONICAL_MODEL) {\n   throw new Error('OpenCode R181 identity constants drifted from canonical Amendment 008');\n@@ -490,7 +490,7 @@\n   return { values, config };\n }\n \n-function buildPiR181Models(baseURL, forceFirstTool) {\n+function buildPiR181Models(baseURL) {\n   const model = {\n     id: CANONICAL_MODEL,\n     name: 'Delethos local Qwen2.5 Coder 1.5B Q4_K_M',\n@@ -500,7 +500,6 @@\n     maxTokens: 2048,\n     cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },\n   };\n-  if (forceFirstTool) model.samplingParams = { tool_choice: 'required' };\n   return {\n     providers: {\n       [CANONICAL_PROVIDER]: {\n@@ -515,15 +514,12 @@\n   };\n }\n \n-function exactPiConfig(config, baseURL, forceFirstTool) {\n+function exactPiConfig(config, baseURL) {\n   const provider = config?.providers?.[CANONICAL_PROVIDER];\n   const models = provider?.models;\n   if (!Array.isArray(models) || models.length !== 1) return false;\n   const model = models[0];\n-  const sampling = model?.samplingParams;\n-  const exactSampling = forceFirstTool\n-    ? sampling?.tool_choice === 'required' && Object.keys(sampling).length === 1\n-    : sampling === undefined;\n+  const exactSampling = model?.samplingParams === undefined;\n   return provider?.baseUrl === baseURL\n     && provider?.api === 'openai-completions'\n     && provider?.apiKey === 'delethos-local-no-secret'\n@@ -644,6 +640,10 @@\n   });\n }\n \n+function boundedNaturalExitDeadline(outerDeadline, smokeObservedAt) {\n+  return Math.min(outerDeadline, smokeObservedAt + PI_TOOL_NATURAL_EXIT_GRACE_MS);\n+}\n+\n async function waitForExactSmokeThenStop(repo, running, timeoutMs = PI_TOOL_SMOKE_TIMEOUT_MS) {\n   const smokePath = join(repo, SMOKE_FILE);\n   const deadline = Date.now() + timeoutMs;\n@@ -656,32 +656,41 @@\n     if (existsSync(smokePath)) {\n       const stat = lstatSync(smokePath);\n       if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('Pi smoke target became a non-regular file');\n+      let content = null;\n       try {\n-        const content = await readFile(smokePath, 'utf8');\n-        if (content === SMOKE_CONTENT) {\n-          await new Promise((resolveValue) => setTimeout(resolveValue, PI_TOOL_FLUSH_GRACE_MS));\n-          if (settled === null) running.cancel();\n-          return await running.result;\n-        }\n+        content = await readFile(smokePath, 'utf8');\n       } catch {\n         // The write may still be in progress. Continue bounded polling.\n       }\n+      if (content === SMOKE_CONTENT) {\n+        const naturalDeadline = boundedNaturalExitDeadline(deadline, Date.now());\n+        while (settled === null && Date.now() < naturalDeadline) {\n+          const remaining = naturalDeadline - Date.now();\n+          await new Promise((resolveValue) => setTimeout(resolveValue, Math.min(PI_TOOL_POLL_MS, Math.max(1, remaining))));\n+        }\n+        if (settled !== null) return settled;\n+        running.cancel();\n+        const cancelled = await running.result;\n+        throw new Error(`Pi write smoke did not settle naturally within bounded grace: cause=${cancelled.cause} exit=${cancelled.exitCode ?? 'null'} cleanup=${cancelled.cleanupStatus}`);\n+      }\n     }\n     if (settled !== null) return settled;\n-    await new Promise((resolveValue) => setTimeout(resolveValue, PI_TOOL_POLL_MS));\n+    const remaining = deadline - Date.now();\n+    if (remaining > 0) {\n+      await new Promise((resolveValue) => setTimeout(resolveValue, Math.min(PI_TOOL_POLL_MS, remaining)));\n+    }\n   }\n   if (settled === null) running.cancel();\n   const result = await running.result;\n-  throw new Error(`Pi write smoke did not produce exact file before deadline: cause=${result.cause} exit=${result.exitCode ?? 'null'}`);\n+  throw new Error(`Pi write smoke did not produce exact file before deadline: cause=${result.cause} exit=${result.exitCode ?? 'null'} cleanup=${result.cleanupStatus}`);\n }\n \n function validateForcedSmokeProcess(result) {\n   if (result.outputTruncated) throw new Error('Pi write-smoke output was truncated');\n+  if (result.cause === 'EXITED' && result.exitCode === 0) return;\n   if (result.cause === 'CANCELLED') {\n-    if (result.cleanupStatus !== 'SUCCEEDED') throw new Error(`Pi write-smoke cancellation cleanup failed: ${result.cleanupStatus}`);\n-    return;\n-  }\n-  if (result.cause === 'EXITED' && result.exitCode === 0) return;\n+    throw new Error(`Pi write-smoke cancellation is fail-closed: cleanup=${result.cleanupStatus}`);\n+  }\n   throw new Error(`Pi write-smoke process ended unexpectedly: cause=${result.cause} exit=${result.exitCode ?? 'null'} cleanup=${result.cleanupStatus}`);\n }\n \n@@ -695,10 +704,29 @@\n   }\n \n   const baseURL = 'http://127.0.0.1:12345/v1';\n-  const ordinaryPiConfig = buildPiR181Models(baseURL, false);\n-  const forcedPiConfig = buildPiR181Models(baseURL, true);\n-  if (!exactPiConfig(ordinaryPiConfig, baseURL, false)) throw new Error('Pi ordinary R181 config self-test failed');\n-  if (!exactPiConfig(forcedPiConfig, baseURL, true)) throw new Error('Pi forced-tool R181 config self-test failed');\n+  const piConfig = buildPiR181Models(baseURL);\n+  if (!exactPiConfig(piConfig, baseURL)) throw new Error('Pi canonical R181 config self-test failed');\n+  if (piConfig.providers[CANONICAL_PROVIDER].models[0].samplingParams !== undefined) {\n+    throw new Error('Pi R181 config unexpectedly contains model-level samplingParams');\n+  }\n+  if (PI_TOOL_NATURAL_EXIT_GRACE_MS > 30_000 || PI_TOOL_SMOKE_TIMEOUT_MS !== 300_000) {\n+    throw new Error('Pi R181 natural-exit timing bounds drifted from Amendment 010');\n+  }\n+  const timingOrigin = 1_000_000;\n+  if (boundedNaturalExitDeadline(timingOrigin + PI_TOOL_SMOKE_TIMEOUT_MS, timingOrigin) !== timingOrigin + PI_TOOL_NATURAL_EXIT_GRACE_MS) {\n+    throw new Error('Pi R181 natural-exit grace was not bounded to 30 seconds');\n+  }\n+  if (boundedNaturalExitDeadline(timingOrigin + 10_000, timingOrigin) !== timingOrigin + 10_000) {\n+    throw new Error('Pi R181 natural-exit grace extended the outer deadline');\n+  }\n+  validateForcedSmokeProcess({ outputTruncated: false, cause: 'EXITED', exitCode: 0, cleanupStatus: 'NOT_REQUIRED' });\n+  let cancellationRejected = false;\n+  try {\n+    validateForcedSmokeProcess({ outputTruncated: false, cause: 'CANCELLED', exitCode: null, cleanupStatus: 'SUCCEEDED' });\n+  } catch {\n+    cancellationRejected = true;\n+  }\n+  if (!cancellationRejected) throw new Error('Pi R181 cancellation fail-closed self-test failed');\n   const openCodeConfig = buildOpenCodeR181Config(baseURL, SMOKE_FILE);\n   if (!exactOpenCodePolicy(openCodeConfig, baseURL)) throw new Error('OpenCode R181 policy self-test failed');\n \n@@ -709,9 +737,13 @@\n   ].join('\\n');\n   requireExactPiWriteEvidence(syntheticWrite);\n   for (const invalid of [\n+    '',\n     syntheticWrite.replace('\"write\",\"args\"', '\"read\",\"args\"'),\n     `${syntheticWrite}\\n${JSON.stringify({ type: 'tool_execution_start', toolCallId: 'call-2', toolName: 'write', args: {} })}`,\n+    syntheticWrite.replace('\"toolCallId\":\"call-1\",\"toolName\":\"write\",\"result\"', '\"toolCallId\":\"call-2\",\"toolName\":\"write\",\"result\"'),\n     syntheticWrite.replace('\"isError\":false', '\"isError\":true'),\n+    `${syntheticWrite}\\nnot-json`,\n+    syntheticWrite.replace(`\"provider\":\"${CANONICAL_PROVIDER}\"`, '\"provider\":\"unexpected-provider\"'),\n   ]) {\n     let rejected = false;\n     try { requireExactPiWriteEvidence(invalid); } catch { rejected = true; }\n@@ -784,7 +816,9 @@\n     arch: selected.arch,\n     outcome: 'PASS',\n     pi_max_tokens: 2048,\n-    forced_tool_choice: 'required',\n+    model_tool_choice: 'omitted',\n+    pi_tool_natural_exit_grace_ms: PI_TOOL_NATURAL_EXIT_GRACE_MS,\n+    pi_tool_smoke_timeout_ms: PI_TOOL_SMOKE_TIMEOUT_MS,\n     runtime_version_timeout_ms: RUNTIME_VERSION_TIMEOUT_MS,\n   }));\n }\n@@ -939,8 +973,8 @@\n     const piCompletionEnvRoot = join(piRoot, 'completion-environment');\n     mkdirSync(piCompletionEnvRoot, { recursive: false });\n     const piCompletionEnv = piEnvironment(piCompletionEnvRoot);\n-    const piCompletionConfig = buildPiR181Models(baseURL, false);\n-    if (!exactPiConfig(piCompletionConfig, baseURL, false)) throw new Error('Pi completion provider config drifted from Amendment 008');\n+    const piCompletionConfig = buildPiR181Models(baseURL);\n+    if (!exactPiConfig(piCompletionConfig, baseURL)) throw new Error('Pi completion provider config drifted from Amendment 008');\n     writeFileSync(join(piCompletionEnv.config, 'models.json'), `${JSON.stringify(piCompletionConfig, null, 2)}\\n`, { flag: 'wx' });\n     const piCompletionRepo = createFixtureRepo(qualificationRoot, 'pi-completion-fixture');\n     const piCompletionBefore = snapshotRepository(piCompletionRepo);\n@@ -984,8 +1018,8 @@\n     const piSmokeEnvRoot = join(piRoot, 'smoke-environment');\n     mkdirSync(piSmokeEnvRoot, { recursive: false });\n     const piSmokeEnv = piEnvironment(piSmokeEnvRoot);\n-    const piSmokeConfig = buildPiR181Models(baseURL, true);\n-    if (!exactPiConfig(piSmokeConfig, baseURL, true)) throw new Error('Pi forced-tool provider config drifted from bounded R181 posture');\n+    const piSmokeConfig = buildPiR181Models(baseURL);\n+    if (!exactPiConfig(piSmokeConfig, baseURL)) throw new Error('Pi write-smoke provider config drifted from Amendment 010');\n     writeFileSync(join(piSmokeEnv.config, 'models.json'), `${JSON.stringify(piSmokeConfig, null, 2)}\\n`, { flag: 'wx' });\n     const piSmokeRepo = createFixtureRepo(qualificationRoot, 'pi-smoke-fixture');\n     const piSmokeBefore = snapshotRepository(piSmokeRepo);\n";

function gitBlobSha(source) {
  const bytes = Buffer.from(source, 'utf8');
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}
function replaceOnce(source, before, after, label) {
  const first = source.indexOf(before);
  if (first < 0 || source.indexOf(before, first + before.length) >= 0) throw new Error(`R181 candidate rewrite contract drifted at ${label}`);
  return source.slice(0, first) + after + source.slice(first + before.length);
}
function replaceSection(source, startMarker, endMarker, replacement, label) {
  const start = source.indexOf(startMarker);
  if (start < 0 || source.indexOf(startMarker, start + startMarker.length) >= 0) throw new Error(`R181 Amendment 013 section start drifted at ${label}`);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (end < 0) throw new Error(`R181 Amendment 013 section end drifted at ${label}`);
  return source.slice(0, start) + replacement + source.slice(end);
}
const lines = (values) => `${values.join('\n')}\n`;

function applyAmendment013(source) {
  source = replaceOnce(source, "  'runtime_release_asset_digest_metadata_exact',", "  'runtime_release_asset_public_metadata_exact',", 'public release metadata fact name');
  source = replaceOnce(source, lines(['    runtime_release: RUNTIME_RELEASE,', '    runtime_commit: RUNTIME_COMMIT,', '    model_revision: MODEL_REVISION,']), lines(['    runtime_release: RUNTIME_RELEASE,', '    runtime_commit: RUNTIME_COMMIT,', "    runtime_tag_provenance_transport: 'git-ls-remote-public-no-auth',", "    runtime_release_asset_provenance_transport: 'github-expanded-assets-public-no-auth',", '    model_revision: MODEL_REVISION,']), 'public provenance transport record');

  source = replaceSection(source, 'async function fetchJson(url, timeoutMs = 30_000) {', 'async function downloadVerified(url, destination, expectedSha256, timeoutMs) {', lines([
    'function parseRuntimeTagRef(output) {', "  const expectedRef = 'refs/tags/' + RUNTIME_RELEASE;", "  const values = output.replace(/\\r\\n/g, '\\n').split('\\n').filter((line) => line !== '');", "  if (values.length !== 1) throw new Error('runtime tag ref required exactly one line; observed ' + values.length);", "  const fields = values[0].split('\\t');", "  if (fields.length !== 2 || fields[0] !== RUNTIME_COMMIT || fields[1] !== expectedRef) throw new Error('runtime tag ref did not match the exact pinned commit/ref');", '  return fields[0];', '}', '',
    'function resolveRuntimeTagCommit() {', '  const output = runSync(', "    'git',", "    ['ls-remote', '--refs', 'https://github.com/ggml-org/llama.cpp', 'refs/tags/' + RUNTIME_RELEASE],", "    { cwd: REPO_ROOT, timeoutMs: 30_000, label: 'public runtime tag provenance' },", '  );', '  return parseRuntimeTagRef(output);', '}', '',
    'function assetEntryForName(html, assetName) {', '  const rows = new Map();', '  let cursor = 0;', '  while (true) {', '    const index = html.indexOf(assetName, cursor);', '    if (index < 0) break;', "    const start = html.lastIndexOf('<li', index);", "    const endMarker = html.indexOf('</li>', index);", '    if (start >= 0 && endMarker >= 0) {', "      const end = endMarker + '</li>'.length;", "      rows.set(String(start) + ':' + String(end), html.slice(start, end));", '    }', '    cursor = index + assetName.length;', '  }', "  if (rows.size !== 1) throw new Error('runtime release metadata required exactly one asset entry; observed ' + rows.size);", '  return [...rows.values()][0];', '}', '',
    'function parseReleaseAssetDigestHtml(html, assetName, expectedSha256) {', "  if (typeof html !== 'string' || Buffer.byteLength(html, 'utf8') > MAX_JSON_BYTES) throw new Error('runtime release metadata HTML exceeded bounded size or was invalid');", '  const entry = assetEntryForName(html, assetName);', "  const expectedPath = '/ggml-org/llama.cpp/releases/download/' + RUNTIME_RELEASE + '/' + assetName;", "  const expectedHref = 'href=\"' + expectedPath + '\"';", "  if (entry.split(expectedHref).length !== 2) throw new Error('runtime release asset entry was not bound to exactly one exact release/tag filename href');", '  const digests = [...entry.matchAll(/sha256:([0-9a-fA-F]{64})/g)].map((match) => match[1].toLowerCase());', "  if (digests.length !== 1 || digests[0] !== expectedSha256) throw new Error('runtime release asset public metadata digest did not match the pinned digest');", '  return digests[0];', '}', '',
    'async function fetchPublicReleaseAssetDigest(assetName, expectedSha256, timeoutMs = 30_000) {', "  const url = 'https://github.com/ggml-org/llama.cpp/releases/expanded_assets/' + RUNTIME_RELEASE;", '  const response = await fetch(url, {', "    redirect: 'follow',", "    headers: { Accept: 'text/html', 'User-Agent': 'delethos-r181' },", '    signal: AbortSignal.timeout(timeoutMs),', '  });', '  const finalURL = new URL(response.url || url);', "  if (finalURL.protocol !== 'https:' || finalURL.hostname !== 'github.com') throw new Error('runtime release metadata redirected outside github.com');", "  if (!response.ok) throw new Error('GET github.com returned HTTP ' + response.status);", '  const text = await response.text();', '  return parseReleaseAssetDigestHtml(text, assetName, expectedSha256);', '}', '',
  ]), 'public no-secret runtime provenance');

  source = replaceSection(source, 'function parsePiToolEvidence(stdout) {', 'function supervisePiPlan(plan) {', lines([
    'function parsePiToolEvidence(stdout) {', '  const toolCalls = [];', '  const toolResults = [];', '  const starts = [];', '  const ends = [];', '  const assistantIdentities = [];', '  let invalid = false;', "  for (const line of stdout.split(/\\r?\\n/).filter((value) => value.trim() !== '')) {", '    let event;', '    try { event = JSON.parse(line); } catch { invalid = true; continue; }', "    if (!event || typeof event !== 'object' || Array.isArray(event)) { invalid = true; continue; }", "    if (event.type === 'message_end') {", '      const message = event.message;', "      if (!message || typeof message !== 'object' || Array.isArray(message) || typeof message.role !== 'string') { invalid = true; continue; }", "      if (message.role === 'assistant') {", '        assistantIdentities.push({', "          provider: typeof message.provider === 'string' ? message.provider : null,", "          model: typeof message.model === 'string' ? message.model : null,", '        });', '        if (!Array.isArray(message.content)) { invalid = true; continue; }', '        for (const item of message.content) {', "          if (!item || typeof item !== 'object' || Array.isArray(item) || item.type !== 'toolCall') continue;", "          const plainArguments = item.arguments && typeof item.arguments === 'object' && !Array.isArray(item.arguments) && Object.getPrototypeOf(item.arguments) === Object.prototype;", "          if (typeof item.id !== 'string' || item.id.length === 0 || typeof item.name !== 'string' || item.name.length === 0 || !plainArguments) { invalid = true; continue; }", '          toolCalls.push({ id: item.id, name: item.name, arguments: item.arguments });', '        }', '      }', "      if (message.role === 'toolResult') {", "        if (typeof message.toolCallId !== 'string' || message.toolCallId.length === 0 || typeof message.toolName !== 'string' || message.toolName.length === 0 || typeof message.isError !== 'boolean') { invalid = true; continue; }", '        toolResults.push({ id: message.toolCallId, name: message.toolName, isError: message.isError });', '      }', '    }', "    if (event.type === 'tool_execution_start') {", "      if (typeof event.toolCallId !== 'string' || event.toolCallId.length === 0 || typeof event.toolName !== 'string' || event.toolName.length === 0) invalid = true;", '      else starts.push({ id: event.toolCallId, name: event.toolName });', '    }', "    if (event.type === 'tool_execution_end') {", "      if (typeof event.toolCallId !== 'string' || event.toolCallId.length === 0 || typeof event.toolName !== 'string' || event.toolName.length === 0 || typeof event.isError !== 'boolean') invalid = true;", '      else ends.push({ id: event.toolCallId, name: event.toolName, isError: event.isError });', '    }', '  }', '  return { invalid, toolCalls, toolResults, starts, ends, assistantIdentities };', '}', '',
    'function requireExactPiWriteEvidence(stdout) {', '  const evidence = parsePiToolEvidence(stdout);', "  if (evidence.invalid) throw new Error('Pi write-smoke JSONL contained malformed evidence');", "  if (evidence.toolCalls.length !== 1 || evidence.toolResults.length !== 1) throw new Error('Pi write smoke required exactly one durable tool call/result; observed calls=' + evidence.toolCalls.length + ' results=' + evidence.toolResults.length);", '  const call = evidence.toolCalls[0];', '  const result = evidence.toolResults[0];', "  if (call.name !== 'write') throw new Error('Pi durable tool call was not write');", '  const argumentKeys = Object.keys(call.arguments).sort();', "  if (argumentKeys.length !== 2 || argumentKeys[0] !== 'content' || argumentKeys[1] !== 'path') throw new Error('Pi durable write arguments did not contain exactly path/content');", "  if (call.arguments.path !== SMOKE_FILE || call.arguments.content !== SMOKE_CONTENT) throw new Error('Pi durable write arguments did not match the exact smoke target/content');", "  if (result.id !== call.id || result.name !== 'write' || result.isError !== false) throw new Error('Pi durable tool result did not match the successful write call');", "  if (evidence.assistantIdentities.length === 0) throw new Error('Pi write smoke exposed no assistant provider/model identity');", "  if (evidence.assistantIdentities.some((identity) => identity.provider !== CANONICAL_PROVIDER || identity.model !== CANONICAL_MODEL)) throw new Error('Pi write-smoke observed provider/model identity drifted');", "  if (evidence.starts.length > 1 || evidence.ends.length > 1) throw new Error('Pi optional execution events exceeded the single durable write action');", "  for (const start of evidence.starts) if (start.id !== call.id || start.name !== 'write') throw new Error('Pi optional tool start contradicted the durable write proof');", "  for (const end of evidence.ends) if (end.id !== call.id || end.name !== 'write' || end.isError) throw new Error('Pi optional tool end contradicted the durable write proof');", '  return evidence;', '}', '',
  ]), 'durable Pi message lifecycle proof');

  source = replaceSection(source, '  const syntheticWrite = [', "  const temp = mkdtempSync(join(tmpdir(), 'delethos-r181-selftest-'));", lines([
    "  const serializePiEvents = (events) => events.map((event) => typeof event === 'string' ? event : JSON.stringify(event)).join('\\n');", '  const durableAssistant = {', "    type: 'message_end',", '    message: {', "      role: 'assistant', provider: CANONICAL_PROVIDER, model: CANONICAL_MODEL,", "      content: [{ type: 'toolCall', id: 'call-1', name: 'write', arguments: { path: SMOKE_FILE, content: SMOKE_CONTENT } }],", '    },', '  };', "  const durableResult = { type: 'message_end', message: { role: 'toolResult', toolCallId: 'call-1', toolName: 'write', content: [{ type: 'text', text: 'ok' }], isError: false, timestamp: 1 } };", '  const syntheticWrite = serializePiEvents([durableAssistant, durableResult]);', '  requireExactPiWriteEvidence(syntheticWrite);', "  requireExactPiWriteEvidence(serializePiEvents([durableAssistant, { type: 'tool_execution_start', toolCallId: 'call-1', toolName: 'write', args: { path: SMOKE_FILE, content: SMOKE_CONTENT } }, { type: 'tool_execution_end', toolCallId: 'call-1', toolName: 'write', result: {}, isError: false }, durableResult]));", "  const badAssistantName = structuredClone(durableAssistant); badAssistantName.message.content[0].name = 'read';", "  const badPath = structuredClone(durableAssistant); badPath.message.content[0].arguments.path = 'wrong.txt';", "  const badContent = structuredClone(durableAssistant); badContent.message.content[0].arguments.content = 'WRONG\\n';", "  const extraArgument = structuredClone(durableAssistant); extraArgument.message.content[0].arguments.extra = 'x';", "  const missingId = structuredClone(durableAssistant); delete missingId.message.content[0].id;", "  const emptyId = structuredClone(durableAssistant); emptyId.message.content[0].id = '';", "  const badResultId = structuredClone(durableResult); badResultId.message.toolCallId = 'call-2';", "  const badResultName = structuredClone(durableResult); badResultName.message.toolName = 'read';", '  const errorResult = structuredClone(durableResult); errorResult.message.isError = true;', '  const missingResultError = structuredClone(durableResult); delete missingResultError.message.isError;', "  const providerDrift = structuredClone(durableAssistant); providerDrift.message.provider = 'unexpected-provider';", "  const modelDrift = structuredClone(durableAssistant); modelDrift.message.model = 'unexpected-model';", '  const invalidPiEvidence = [', '    serializePiEvents([durableResult]),', '    serializePiEvents([durableAssistant, durableAssistant, durableResult]),', '    serializePiEvents([badAssistantName, durableResult]),', '    serializePiEvents([badPath, durableResult]),', '    serializePiEvents([badContent, durableResult]),', '    serializePiEvents([extraArgument, durableResult]),', '    serializePiEvents([missingId, durableResult]),', '    serializePiEvents([emptyId, durableResult]),', '    serializePiEvents([durableAssistant, badResultId]),', '    serializePiEvents([durableAssistant, badResultName]),', '    serializePiEvents([durableAssistant, errorResult]),', '    serializePiEvents([durableAssistant, missingResultError]),', '    serializePiEvents([durableAssistant, durableResult, durableResult]),', "    syntheticWrite + '\\nnot-json',", '    serializePiEvents([providerDrift, durableResult]),', '    serializePiEvents([modelDrift, durableResult]),', "    serializePiEvents([durableAssistant, { type: 'tool_execution_start', toolCallId: 'call-2', toolName: 'write', args: {} }, durableResult]),", "    serializePiEvents([durableAssistant, { type: 'tool_execution_end', toolCallId: 'call-1', toolName: 'write', result: {}, isError: true }, durableResult]),", '  ];', '  for (const invalid of invalidPiEvidence) {', '    let rejected = false;', '    try { requireExactPiWriteEvidence(invalid); } catch { rejected = true; }', "    if (!rejected) throw new Error('Pi durable tool-evidence fail-closed self-test failed');", '  }', '', "  const canonicalTagLine = RUNTIME_COMMIT + '\\trefs/tags/' + RUNTIME_RELEASE + '\\n';", "  if (parseRuntimeTagRef(canonicalTagLine) !== RUNTIME_COMMIT) throw new Error('runtime tag parser positive self-test failed');", "  for (const invalid of ['', canonicalTagLine + canonicalTagLine, canonicalTagLine.replace(RUNTIME_COMMIT, '0'.repeat(40)), canonicalTagLine.replace('refs/tags/' + RUNTIME_RELEASE, 'refs/tags/' + RUNTIME_RELEASE + '-wrong'), canonicalTagLine.replace('\\t', ' ')]) {", '    let rejected = false;', '    try { parseRuntimeTagRef(invalid); } catch { rejected = true; }', "    if (!rejected) throw new Error('runtime tag parser fail-closed self-test failed');", '  }', "  const canonicalAssetEntry = '<li><a href=\"/ggml-org/llama.cpp/releases/download/' + RUNTIME_RELEASE + '/' + selected.runtimeAsset + '\">' + selected.runtimeAsset + '</a><span>sha256:' + selected.runtimeSha256 + '</span></li>';", "  if (parseReleaseAssetDigestHtml(canonicalAssetEntry, selected.runtimeAsset, selected.runtimeSha256) !== selected.runtimeSha256) throw new Error('runtime release metadata parser positive self-test failed');", "  const wrongDigest = '0'.repeat(64) === selected.runtimeSha256 ? '1'.repeat(64) : '0'.repeat(64);", "  for (const invalid of ['', canonicalAssetEntry + canonicalAssetEntry, canonicalAssetEntry.replace(selected.runtimeSha256, wrongDigest), canonicalAssetEntry.replace(selected.runtimeAsset, selected.runtimeAsset + '.wrong'), canonicalAssetEntry.replace('sha256:' + selected.runtimeSha256, ''), canonicalAssetEntry.replace('</span>', ' sha256:' + selected.runtimeSha256 + '</span>')]) {", '    let rejected = false;', '    try { parseReleaseAssetDigestHtml(invalid, selected.runtimeAsset, selected.runtimeSha256); } catch { rejected = true; }', "    if (!rejected) throw new Error('runtime release metadata parser fail-closed self-test failed');", '  }', '',
  ]), 'Amendment 013 deterministic parser self-tests');

  source = replaceSection(source, '    const tag = await fetchJson(', "    const runtimeRoot = join(qualificationRoot, 'runtime');", lines(['    if (resolveRuntimeTagCommit() !== RUNTIME_COMMIT) throw new Error(\'runtime public tag provenance did not resolve to the pinned commit\');', "    mark(record, 'runtime_tag_commit_exact');", '', '    const publicAssetDigest = await fetchPublicReleaseAssetDigest(selected.runtimeAsset, selected.runtimeSha256);', '    if (publicAssetDigest !== selected.runtimeSha256) throw new Error(\'runtime public release-asset metadata digest did not match the pinned digest\');', "    mark(record, 'runtime_release_asset_public_metadata_exact');", '']), 'canonical public provenance execution');
  return source;
}

function applyAmendment014(source) {
  source = replaceOnce(source, "  'runtime_release_asset_public_metadata_exact',", "  'runtime_release_asset_public_binding_exact',", 'Amendment 014 release binding fact name');
  source = replaceOnce(source, "    runtime_release_asset_provenance_transport: 'github-expanded-assets-public-no-auth',", "    runtime_release_asset_provenance_transport: 'github-expanded-assets-exact-href-public-no-auth',", 'Amendment 014 release binding transport');

  source = replaceSection(source, 'function parseReleaseAssetDigestHtml(html, assetName, expectedSha256) {', 'async function downloadVerified(url, destination, expectedSha256, timeoutMs) {', lines([
    'function parseReleaseAssetBindingHtml(html, assetName) {',
    "  if (typeof html !== 'string' || Buffer.byteLength(html, 'utf8') > MAX_JSON_BYTES) throw new Error('runtime release metadata HTML exceeded bounded size or was invalid');",
    '  const entry = assetEntryForName(html, assetName);',
    "  const expectedPath = '/ggml-org/llama.cpp/releases/download/' + RUNTIME_RELEASE + '/' + assetName;",
    "  const expectedHref = 'href=\"' + expectedPath + '\"';",
    "  if (entry.split(expectedHref).length !== 2) throw new Error('runtime release asset entry was not bound to exactly one exact release/tag filename href');",
    '  return expectedPath;',
    '}',
    '',
    'async function fetchPublicReleaseAssetBinding(assetName, timeoutMs = 30_000) {',
    "  const url = 'https://github.com/ggml-org/llama.cpp/releases/expanded_assets/' + RUNTIME_RELEASE;",
    '  const response = await fetch(url, {',
    "    redirect: 'follow',",
    "    headers: { Accept: 'text/html', 'User-Agent': 'delethos-r181' },",
    '    signal: AbortSignal.timeout(timeoutMs),',
    '  });',
    '  const finalURL = new URL(response.url || url);',
    "  if (finalURL.protocol !== 'https:' || finalURL.hostname !== 'github.com') throw new Error('runtime release metadata redirected outside github.com');",
    "  if (!response.ok) throw new Error('GET github.com returned HTTP ' + response.status);",
    '  const text = await response.text();',
    '  return parseReleaseAssetBindingHtml(text, assetName);',
    '}',
    '',
  ]), 'Amendment 014 exact-href release binding parser');

  source = replaceSection(source, "  const canonicalAssetEntry = '<li><a href=\"/ggml-org/llama.cpp/releases/download/' + RUNTIME_RELEASE + '/' + selected.runtimeAsset + '\">' + selected.runtimeAsset + '</a><span>sha256:' + selected.runtimeSha256 + '</span></li>';", "  const temp = mkdtempSync(join(tmpdir(), 'delethos-r181-selftest-'));", lines([
    "  const expectedAssetPath = '/ggml-org/llama.cpp/releases/download/' + RUNTIME_RELEASE + '/' + selected.runtimeAsset;",
    "  const canonicalAssetEntry = '<li><a href=\"' + expectedAssetPath + '\">' + selected.runtimeAsset + '</a></li>';",
    "  if (parseReleaseAssetBindingHtml(canonicalAssetEntry, selected.runtimeAsset) !== expectedAssetPath) throw new Error('runtime release binding parser positive self-test failed');",
    "  const diagnosticDigestEntry = canonicalAssetEntry.replace('</li>', '<span>sha256:' + '0'.repeat(64) + '</span></li>');",
    "  if (parseReleaseAssetBindingHtml(diagnosticDigestEntry, selected.runtimeAsset) !== expectedAssetPath) throw new Error('runtime release binding parser treated diagnostic digest text as authoritative');",
    "  const wrongRepositoryEntry = canonicalAssetEntry.replace('/ggml-org/llama.cpp/', '/wrong-org/llama.cpp/');",
    "  const wrongTagEntry = canonicalAssetEntry.replace('/releases/download/' + RUNTIME_RELEASE + '/', '/releases/download/' + RUNTIME_RELEASE + '-wrong/');",
    "  const wrongFilenameEntry = canonicalAssetEntry.replace('/' + selected.runtimeAsset + '\"', '/' + selected.runtimeAsset + '.wrong\"');",
    "  const suffixLookalikeEntry = canonicalAssetEntry.replace('/' + selected.runtimeAsset + '\"', '/' + selected.runtimeAsset + '.sig\"');",
    "  const prefixLookalikeEntry = canonicalAssetEntry.replace('/' + selected.runtimeAsset + '\"', '/prefix-' + selected.runtimeAsset + '\"');",
    "  const digestOnlyEntry = '<li>' + selected.runtimeAsset + '<span>sha256:' + selected.runtimeSha256 + '</span></li>';",
    "  for (const invalid of ['', canonicalAssetEntry + canonicalAssetEntry, wrongRepositoryEntry, wrongTagEntry, wrongFilenameEntry, suffixLookalikeEntry, prefixLookalikeEntry, digestOnlyEntry, canonicalAssetEntry.replace('</li>', '')]) {",
    '    let rejected = false;',
    '    try { parseReleaseAssetBindingHtml(invalid, selected.runtimeAsset); } catch { rejected = true; }',
    "    if (!rejected) throw new Error('runtime release binding parser fail-closed self-test failed');",
    '  }',
    '',
  ]), 'Amendment 014 deterministic release binding self-tests');

  source = replaceOnce(source, "  try {\n    const envRoot = join(temp, 'pi');", lines([
    '  try {',
    "    const wrongArchiveBytes = Buffer.from('delethos-r181-wrong-archive', 'utf8');",
    "    const wrongArchiveSha = createHash('sha256').update(wrongArchiveBytes).digest('hex');",
    "    const wrongExpectedSha = (wrongArchiveSha[0] === '0' ? '1' : '0') + wrongArchiveSha.slice(1);",
    "    const wrongArchivePath = join(temp, 'wrong-runtime-archive.bin');",
    "    const wrongExtractRoot = join(temp, 'wrong-runtime-extract');",
    '    let wrongArchiveRejected = false;',
    '    try {',
    "      await downloadVerified('data:application/octet-stream;base64,' + wrongArchiveBytes.toString('base64'), wrongArchivePath, wrongExpectedSha, 5_000);",
    '      extractArchive(wrongArchivePath, wrongExtractRoot);',
    '    } catch (error) {',
    "      wrongArchiveRejected = error instanceof Error && error.message.includes('SHA-256 mismatch');",
    '    }',
    "    if (!wrongArchiveRejected || existsSync(wrongExtractRoot)) throw new Error('runtime archive wrong-byte pre-extraction self-test failed');",
    '',
    "    const envRoot = join(temp, 'pi');",
  ]), 'Amendment 014 downloaded-byte integrity self-test');

  source = replaceSection(source, '    const publicAssetDigest = await fetchPublicReleaseAssetDigest(selected.runtimeAsset, selected.runtimeSha256);', "    const runtimeRoot = join(qualificationRoot, 'runtime');", lines([
    "    const expectedPublicAssetPath = '/ggml-org/llama.cpp/releases/download/' + RUNTIME_RELEASE + '/' + selected.runtimeAsset;",
    '    const publicAssetBinding = await fetchPublicReleaseAssetBinding(selected.runtimeAsset);',
    "    if (publicAssetBinding !== expectedPublicAssetPath) throw new Error('runtime public release-asset binding did not match the pinned release/tag/filename');",
    "    mark(record, 'runtime_release_asset_public_binding_exact');",
    '',
  ]), 'Amendment 014 canonical release binding execution');
  return source;
}

function applyAmendment015(source) {
  source = replaceOnce(source, "import { fileURLToPath } from 'node:url';", "import { fileURLToPath, pathToFileURL } from 'node:url';", 'Amendment 015 temporary extension import');
  source = replaceOnce(source, lines(["  'pi_tool_allowlist_exact_write_only',", "  'pi_bounded_tool_write_smoke',"]), lines(["  'pi_tool_allowlist_exact_write_only',", "  'pi_first_request_tool_choice_exact',", "  'pi_bounded_tool_write_smoke',"]), 'Amendment 015 required fact');

  source = replaceOnce(source, 'function supervisePiPlan(plan) {', lines([
    'function requireExactPiToolChoiceAudit(text) {',
    "  if (typeof text !== 'string' || Buffer.byteLength(text, 'utf8') > 16 * 1024) throw new Error('Pi first-request audit was invalid or oversized');",
    "  const rows = text.split(/\\r?\\n/).filter((line) => line !== '');",
    "  if (rows.length !== 2) throw new Error('Pi first-request audit required exactly two records');",
    '  let first; let second;',
    '  try { [first, second] = rows.map((line) => JSON.parse(line)); } catch { throw new Error(\'Pi first-request audit was not valid JSONL\'); }',
    "  const plain = (value) => value && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;",
    "  if (!plain(first) || !plain(second)) throw new Error('Pi first-request audit records were not plain objects');",
    "  const exactKeys = (value, expected) => JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...expected].sort());",
    "  if (!exactKeys(first, ['request','model','tool_count','tool_name','incoming_tool_choice','outgoing_tool_choice'])) throw new Error('Pi first-request audit record 1 shape drifted');",
    "  if (!exactKeys(second, ['request','model','tool_count','tool_name','incoming_tool_choice','outgoing_tool_choice','follows_successful_write_result'])) throw new Error('Pi first-request audit record 2 shape drifted');",
    "  if (first.request !== 1 || first.model !== CANONICAL_MODEL || first.tool_count !== 1 || first.tool_name !== 'write' || first.incoming_tool_choice !== 'absent' || first.outgoing_tool_choice !== 'required') throw new Error('Pi first-request audit record 1 values drifted');",
    "  if (second.request !== 2 || second.model !== CANONICAL_MODEL || second.tool_count !== 1 || second.tool_name !== 'write' || second.incoming_tool_choice !== 'absent' || second.outgoing_tool_choice !== 'absent' || second.follows_successful_write_result !== true) throw new Error('Pi first-request audit record 2 values drifted');",
    '  return [first, second];',
    '}',
    '',
    'function buildPiFirstRequestToolChoiceExtensionSource(auditPath) {',
    "  if (!isAbsolute(auditPath)) throw new Error('Pi request-shaping audit path must be absolute');",
    '  const modelLiteral = JSON.stringify(CANONICAL_MODEL);',
    '  const auditLiteral = JSON.stringify(auditPath);',
    '  const successLiteral = JSON.stringify(`Successfully wrote to ${SMOKE_FILE}`);',
    '  return [',
    "    \"import { appendFileSync } from 'node:fs';\" ,",
    "    'const CANONICAL_MODEL = ' + modelLiteral + ';',",
    "    'const AUDIT_PATH = ' + auditLiteral + ';',",
    "    'const SUCCESS_TEXT = ' + successLiteral + ';',",
    "    \"const plain = (value) => value && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;\" ,",
    "    \"const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);\" ,",
    "    \"function exactWriteTool(payload) { if (!Array.isArray(payload.tools) || payload.tools.length !== 1) return false; const tool = payload.tools[0]; return plain(tool) && tool.type === 'function' && plain(tool.function) && tool.function.name === 'write'; }\" ,",
    "    \"function noPriorToolContinuation(payload) { if (!Array.isArray(payload.messages)) return false; return payload.messages.every((message) => !plain(message) || (message.role !== 'tool' && !(message.role === 'assistant' && Array.isArray(message.tool_calls) && message.tool_calls.length > 0))); }\" ,",
    "    \"function followsSuccessfulWriteResult(payload) { if (!Array.isArray(payload.messages)) return false; const assistants = []; const results = []; payload.messages.forEach((message, index) => { if (!plain(message)) return; if (message.role === 'assistant' && Array.isArray(message.tool_calls)) { for (const call of message.tool_calls) { if (plain(call) && typeof call.id === 'string' && call.id.length > 0 && call.type === 'function' && plain(call.function) && call.function.name === 'write') assistants.push({ id: call.id, index }); else if (plain(call)) assistants.push({ id: null, index }); } } if (message.role === 'tool') results.push({ id: message.tool_call_id, content: message.content, index }); }); return assistants.length === 1 && results.length === 1 && assistants[0].id !== null && results[0].id === assistants[0].id && results[0].index > assistants[0].index && results[0].content === SUCCESS_TEXT; }\" ,",
    "    \"function record(value) { appendFileSync(AUDIT_PATH, JSON.stringify(value) + '\\\\n', { encoding: 'utf8' }); }\" ,",
    "    \"export default function (pi) { let requestIndex = 0; pi.on('before_provider_request', (event, ctx) => { requestIndex += 1; const payload = event.payload; const fail = () => { ctx.abort(); return payload; }; if (!plain(payload) || payload.model !== CANONICAL_MODEL || !exactWriteTool(payload) || own(payload, 'tool_choice')) return fail(); if (requestIndex === 1) { if (!noPriorToolContinuation(payload)) return fail(); record({ request: 1, model: CANONICAL_MODEL, tool_count: 1, tool_name: 'write', incoming_tool_choice: 'absent', outgoing_tool_choice: 'required' }); return { ...payload, tool_choice: 'required' }; } if (requestIndex === 2) { if (!followsSuccessfulWriteResult(payload)) return fail(); record({ request: 2, model: CANONICAL_MODEL, tool_count: 1, tool_name: 'write', incoming_tool_choice: 'absent', outgoing_tool_choice: 'absent', follows_successful_write_result: true }); return payload; } return fail(); }); }\" ,",
    "  ].join('\\n') + '\\n';",
    '}',
    '',
    'function shapePiSmokePlanWithExtension(plan, extensionPath) {',
    "  if (!isAbsolute(extensionPath)) throw new Error('Pi request-shaping extension path must be absolute');",
    "  const separators = plan.args.flatMap((value, index) => value === '--' ? [index] : []);",
    "  if (separators.length !== 1) throw new Error('Pi write-smoke plan required exactly one prompt separator');",
    "  if (plan.args.includes('--extension') || plan.args.includes('-e')) throw new Error('Pi write-smoke plan already contained an extension');",
    '  const separator = separators[0];',
    "  return { ...plan, args: [...plan.args.slice(0, separator), '--extension', extensionPath, ...plan.args.slice(separator)] };",
    '}',
    '',
    'function supervisePiPlan(plan) {',
  ]), 'Amendment 015 Pi request-shaping helpers');

  source = replaceOnce(source,
    "function noPriorToolContinuation(payload) { if (!Array.isArray(payload.messages)) return false; return payload.messages.every((message) => !plain(message) || (message.role !== 'tool' && !(message.role === 'assistant' && Array.isArray(message.tool_calls) && message.tool_calls.length > 0))); }",
    "function noPriorToolContinuation(payload) { if (!Array.isArray(payload.messages)) return false; for (const message of payload.messages) { if (!plain(message)) return false; if (message.role === 'tool') return false; if (message.role === 'assistant' && message.tool_calls !== undefined) { if (!Array.isArray(message.tool_calls)) return false; for (const call of message.tool_calls) if (!plain(call)) return false; if (message.tool_calls.length > 0) return false; } } return true; }",
    'Amendment 015 reject malformed first-request messages');
  source = replaceOnce(source,
    "function followsSuccessfulWriteResult(payload) { if (!Array.isArray(payload.messages)) return false; const assistants = []; const results = []; payload.messages.forEach((message, index) => { if (!plain(message)) return; if (message.role === 'assistant' && Array.isArray(message.tool_calls)) { for (const call of message.tool_calls) { if (plain(call) && typeof call.id === 'string' && call.id.length > 0 && call.type === 'function' && plain(call.function) && call.function.name === 'write') assistants.push({ id: call.id, index }); else if (plain(call)) assistants.push({ id: null, index }); } } if (message.role === 'tool') results.push({ id: message.tool_call_id, content: message.content, index }); }); return assistants.length === 1 && results.length === 1 && assistants[0].id !== null && results[0].id === assistants[0].id && results[0].index > assistants[0].index && results[0].content === SUCCESS_TEXT; }",
    "function followsSuccessfulWriteResult(payload) { if (!Array.isArray(payload.messages)) return false; const assistants = []; const results = []; for (let index = 0; index < payload.messages.length; index += 1) { const message = payload.messages[index]; if (!plain(message)) return false; if (message.role === 'assistant' && message.tool_calls !== undefined) { if (!Array.isArray(message.tool_calls)) return false; for (const call of message.tool_calls) { if (!plain(call)) return false; if (typeof call.id !== 'string' || call.id.length === 0 || call.type !== 'function' || !plain(call.function) || call.function.name !== 'write') return false; assistants.push({ id: call.id, index }); } } if (message.role === 'tool') results.push({ id: message.tool_call_id, content: message.content, index }); } return assistants.length === 1 && results.length === 1 && results[0].id === assistants[0].id && results[0].index > assistants[0].index && results[0].content === SUCCESS_TEXT; }",
    'Amendment 015 reject malformed second-request messages and tool calls');

  source = replaceOnce(source, "    const noToolsPlan = buildPiConformanceInvocation({ ...baseRequest, prerequisiteToolMode: 'NO_TOOLS' }, discovery);", lines([
    "    const noToolsPlan = buildPiConformanceInvocation({ ...baseRequest, prerequisiteToolMode: 'NO_TOOLS' }, discovery);",
    "    if (noToolsPlan.args.includes('--extension') || noToolsPlan.args.includes('-e')) throw new Error('Pi R181 completion self-test unexpectedly loaded an extension');",
  ]), 'Amendment 015 completion extension-free self-test');

  source = replaceOnce(source, "    if (writePlan.args.some((value) => ['bash', 'powershell', 'read', 'edit', 'grep', 'find', 'ls'].includes(value))) {\n      throw new Error('Pi R181 write allowlist widened in self-test');\n    }", lines([
    "    if (writePlan.args.some((value) => ['bash', 'powershell', 'read', 'edit', 'grep', 'find', 'ls'].includes(value))) {",
    "      throw new Error('Pi R181 write allowlist widened in self-test');",
    '    }',
    "    if (writePlan.args.filter((value) => value === '--no-extensions').length !== 1 || writePlan.args.includes('--extension') || writePlan.args.includes('-e')) throw new Error('Pi R181 base write plan extension boundary drifted');",
    "    const loadShaper = async (label) => {",
    "      const auditPath = join(temp, 'pi-tool-choice-' + label + '.jsonl');",
    "      const extensionPath = join(temp, 'pi-tool-choice-' + label + '.mjs');",
    '      const extensionSource = buildPiFirstRequestToolChoiceExtensionSource(auditPath);',
    "      if ((extensionSource.match(/pi\\.on\\(/g) ?? []).length !== 1 || !extensionSource.includes(\"pi.on('before_provider_request'\")) throw new Error('Pi request-shaping extension registered unexpected behavior');",
    "      writeFileSync(extensionPath, extensionSource, { flag: 'wx' });",
    "      const module = await import(pathToFileURL(extensionPath).href + '?case=' + encodeURIComponent(label));",
    '      const registrations = []; let handler = null;',
    "      module.default({ on(name, value) { registrations.push(name); if (name === 'before_provider_request') handler = value; } });",
    "      if (registrations.length !== 1 || registrations[0] !== 'before_provider_request' || typeof handler !== 'function') throw new Error('Pi request-shaping extension registration self-test failed');",
    '      return { auditPath, extensionPath, handler };',
    '    };',
    "    const writeTool = { type: 'function', function: { name: 'write', description: 'write', parameters: { type: 'object' } } };",
    "    const firstPayload = { model: CANONICAL_MODEL, messages: [{ role: 'system', content: 'system' }, { role: 'user', content: 'user' }], tools: [writeTool], stream: true };",
    "    const positive = await loadShaper('positive'); let positiveAborts = 0;",
    '    const firstOutput = await positive.handler({ payload: firstPayload }, { abort() { positiveAborts += 1; } });',
    "    if (positiveAborts !== 0 || firstOutput === firstPayload || firstOutput.tool_choice !== 'required') throw new Error('Pi first request was not forced exactly once');",
    '    const firstWithoutChoice = { ...firstOutput }; delete firstWithoutChoice.tool_choice;',
    "    if (JSON.stringify(firstWithoutChoice) !== JSON.stringify(firstPayload)) throw new Error('Pi first request shaper changed a non-tool-choice field');",
    "    const secondPayload = { model: CANONICAL_MODEL, messages: [...firstPayload.messages, { role: 'assistant', content: null, tool_calls: [{ id: 'call-1', type: 'function', function: { name: 'write', arguments: '{}' } }] }, { role: 'tool', tool_call_id: 'call-1', content: 'Successfully wrote to ' + SMOKE_FILE }], tools: [writeTool], stream: true };",
    '    const secondOutput = await positive.handler({ payload: secondPayload }, { abort() { positiveAborts += 1; } });',
    "    if (positiveAborts !== 0 || secondOutput !== secondPayload || Object.prototype.hasOwnProperty.call(secondOutput, 'tool_choice')) throw new Error('Pi second request was not exact unforced pass-through');",
    "    requireExactPiToolChoiceAudit(readFileSync(positive.auditPath, 'utf8'));",
    "    const invalidFirstPayloads = [null, [], { ...firstPayload, model: 'wrong-model' }, { ...firstPayload, tools: [] }, { ...firstPayload, tools: [writeTool, writeTool] }, { ...firstPayload, tools: [{ type: 'function', function: { name: 'read' } }] }, { ...firstPayload, tool_choice: 'required' }, secondPayload];",
    '    for (let index = 0; index < invalidFirstPayloads.length; index += 1) {',
    "      const invalid = await loadShaper('invalid-first-' + index); let aborts = 0; const payload = invalidFirstPayloads[index];",
    '      const output = await invalid.handler({ payload }, { abort() { aborts += 1; } });',
    "      if (aborts !== 1 || output !== payload) throw new Error('Pi invalid first-request state did not fail closed with abort');",
    '    }',
    "    const badContinuation = await loadShaper('bad-continuation'); let badContinuationAborts = 0;",
    '    await badContinuation.handler({ payload: firstPayload }, { abort() { badContinuationAborts += 1; } });',
    "    const badSecond = { ...secondPayload, messages: firstPayload.messages };",
    '    const badSecondOutput = await badContinuation.handler({ payload: badSecond }, { abort() { badContinuationAborts += 1; } });',
    "    if (badContinuationAborts !== 1 || badSecondOutput !== badSecond) throw new Error('Pi wrong second-request continuation did not fail closed');",
    "    const thirdRequest = await loadShaper('third-request'); let thirdAborts = 0;",
    '    await thirdRequest.handler({ payload: firstPayload }, { abort() { thirdAborts += 1; } });',
    '    await thirdRequest.handler({ payload: secondPayload }, { abort() { thirdAborts += 1; } });',
    '    const thirdOutput = await thirdRequest.handler({ payload: secondPayload }, { abort() { thirdAborts += 1; } });',
    "    if (thirdAborts !== 1 || thirdOutput !== secondPayload) throw new Error('Pi third provider request did not fail closed');",
    "    requireExactPiToolChoiceAudit(readFileSync(thirdRequest.auditPath, 'utf8'));",
    "    const shapedWritePlan = shapePiSmokePlanWithExtension(writePlan, positive.extensionPath);",
    "    const extensionIndexes = shapedWritePlan.args.flatMap((value, index) => value === '--extension' ? [index] : []);",
    "    if (extensionIndexes.length !== 1 || shapedWritePlan.args[extensionIndexes[0] + 1] !== positive.extensionPath || shapedWritePlan.args.filter((value) => value === '--no-extensions').length !== 1) throw new Error('Pi explicit-only extension plan self-test failed');",
    "    const shapedToolIndexes = shapedWritePlan.args.flatMap((value, index) => value === '--tools' ? [index] : []);",
    "    if (shapedToolIndexes.length !== 1 || shapedWritePlan.args[shapedToolIndexes[0] + 1] !== 'write') throw new Error('Pi shaped plan widened the write-only tool boundary');",
  ]), 'Amendment 015 deterministic shaper self-tests');

  source = replaceOnce(source,
    "    const invalidFirstPayloads = [null, [], { ...firstPayload, model: 'wrong-model' }, { ...firstPayload, tools: [] }, { ...firstPayload, tools: [writeTool, writeTool] }, { ...firstPayload, tools: [{ type: 'function', function: { name: 'read' } }] }, { ...firstPayload, tool_choice: 'required' }, secondPayload];",
    "    const invalidFirstPayloads = [null, [], { ...firstPayload, model: 'wrong-model' }, { ...firstPayload, tools: [] }, { ...firstPayload, tools: [writeTool, writeTool] }, { ...firstPayload, tools: [{ type: 'function', function: { name: 'read' } }] }, { ...firstPayload, tool_choice: 'required' }, secondPayload, { ...firstPayload, messages: [...firstPayload.messages, null] }];",
    'Amendment 015 malformed first-request message self-test');
  source = replaceOnce(source,
    "    if (badContinuationAborts !== 1 || badSecondOutput !== badSecond) throw new Error('Pi wrong second-request continuation did not fail closed');",
    lines([
      "    if (badContinuationAborts !== 1 || badSecondOutput !== badSecond) throw new Error('Pi wrong second-request continuation did not fail closed');",
      "    const malformedSecondPayloads = [",
      "      { ...secondPayload, messages: [...secondPayload.messages, null] },",
      "      { ...secondPayload, messages: secondPayload.messages.map((message) => message?.role === 'assistant' ? { ...message, tool_calls: [...message.tool_calls, null] } : message) },",
      "    ];",
      "    for (let index = 0; index < malformedSecondPayloads.length; index += 1) {",
      "      const malformed = await loadShaper('malformed-second-' + index); let malformedAborts = 0;",
      "      await malformed.handler({ payload: firstPayload }, { abort() { malformedAborts += 1; } });",
      "      const payload = malformedSecondPayloads[index];",
      "      const output = await malformed.handler({ payload }, { abort() { malformedAborts += 1; } });",
      "      if (malformedAborts !== 1 || output !== payload) throw new Error('Pi malformed second-request state did not fail closed with abort');",
      "    }",
    ]),
    'Amendment 015 malformed second-request message and tool-call self-tests');

  source = replaceOnce(source, "    if (completionPlan.args.filter((value) => value === '--no-tools').length !== 1 || completionPlan.args.includes('--tools')) {\n      throw new Error('Pi completion subcase was not exact no-tools');\n    }", lines([
    "    if (completionPlan.args.filter((value) => value === '--no-tools').length !== 1 || completionPlan.args.includes('--tools')) {",
    "      throw new Error('Pi completion subcase was not exact no-tools');",
    '    }',
    "    if (completionPlan.args.includes('--extension') || completionPlan.args.includes('-e')) throw new Error('Pi completion subcase unexpectedly loaded a request-shaping extension');",
  ]), 'Amendment 015 runtime completion extension-free boundary');

  source = replaceOnce(source, "    mark(record, 'pi_tool_allowlist_exact_write_only');\n    if (piSmokePlan.requestedProvider !== CANONICAL_PROVIDER || piSmokePlan.requestedModel !== CANONICAL_MODEL) {", lines([
    "    mark(record, 'pi_tool_allowlist_exact_write_only');",
    "    if (piSmokePlan.args.filter((value) => value === '--no-extensions').length !== 1 || piSmokePlan.args.includes('--extension') || piSmokePlan.args.includes('-e')) throw new Error('Pi base write-smoke extension boundary drifted');",
    "    const piSmokeAuditPath = join(piSmokeEnvRoot, 'first-request-tool-choice-audit.jsonl');",
    "    const piSmokeExtensionPath = join(piSmokeEnvRoot, 'first-request-tool-choice.mjs');",
    '    writeFileSync(piSmokeExtensionPath, buildPiFirstRequestToolChoiceExtensionSource(piSmokeAuditPath), { flag: \'wx\' });',
    '    const shapedPiSmokePlan = shapePiSmokePlanWithExtension(piSmokePlan, piSmokeExtensionPath);',
    "    const extensionIndexes = shapedPiSmokePlan.args.flatMap((value, index) => value === '--extension' ? [index] : []);",
    "    if (extensionIndexes.length !== 1 || shapedPiSmokePlan.args[extensionIndexes[0] + 1] !== piSmokeExtensionPath || shapedPiSmokePlan.args.filter((value) => value === '--no-extensions').length !== 1) throw new Error('Pi write-smoke explicit extension boundary was not exact');",
    "    if (piSmokePlan.requestedProvider !== CANONICAL_PROVIDER || piSmokePlan.requestedModel !== CANONICAL_MODEL) {",
  ]), 'Amendment 015 runtime explicit extension plan');

  source = replaceOnce(source, '    const piSmokeProcess = supervisePiPlan(piSmokePlan);', '    const piSmokeProcess = supervisePiPlan(shapedPiSmokePlan);', 'Amendment 015 shaped Pi smoke execution');
  source = replaceOnce(source, "    requireExactPiWriteEvidence(piSmokeProcessResult.stdout);\n    await verifyExactSmoke(piSmokeRepo, piSmokeBefore);\n    mark(record, 'pi_bounded_tool_write_smoke');", lines([
    '    requireExactPiWriteEvidence(piSmokeProcessResult.stdout);',
    "    requireExactPiToolChoiceAudit(readFileSync(piSmokeAuditPath, 'utf8'));",
    "    mark(record, 'pi_first_request_tool_choice_exact');",
    '    await verifyExactSmoke(piSmokeRepo, piSmokeBefore);',
    "    mark(record, 'pi_bounded_tool_write_smoke');",
  ]), 'Amendment 015 runtime audit evidence');
  return source;
}

function applyAmendment016(source) {
  source = replaceOnce(source,
    lines(["  'anonymous_nonempty_model_completion',", "  'pi_cli_version_exact_0_84_4',"]),
    lines(["  'anonymous_nonempty_model_completion',", "  'llama_forced_tool_stream_witness_exact',", "  'pi_cli_version_exact_0_84_4',"]),
    'Amendment 016 llama forced-tool witness fact');
  source = replaceOnce(source,
    lines(["  'pi_tool_allowlist_exact_write_only',", "  'pi_first_request_tool_choice_exact',", "  'pi_bounded_tool_write_smoke',"]),
    lines(["  'pi_tool_allowlist_exact_write_only',", "  'pi_first_request_shaper_witness_exact',", "  'pi_bounded_tool_write_smoke',", "  'pi_first_request_tool_choice_exact',"]),
    'Amendment 016 Pi diagnostic fact ordering');

  source = replaceOnce(source, 'async function anonymousCompletion(baseURL) {', lines([
    'function exactLoopbackV1BaseURL(baseURL) {',
    "  if (typeof baseURL !== 'string') throw new Error('llama forced-tool witness base URL must be a string');",
    '  let url;',
    "  try { url = new URL(baseURL); } catch { throw new Error('llama forced-tool witness base URL was invalid'); }",
    '  const port = Number(url.port);',
    "  if (url.protocol !== 'http:' || url.hostname !== '127.0.0.1' || url.username !== '' || url.password !== '' || url.pathname !== '/v1' || url.search !== '' || url.hash !== '' || !Number.isInteger(port) || port < 1 || port > 65535 || url.href !== url.origin + '/v1') throw new Error('llama forced-tool witness requires an exact loopback /v1 base URL');",
    "  return url.origin + '/v1';",
    '}',
    '',
    'function buildLlamaForcedToolWitnessRequest(baseURL) {',
    '  const normalizedBaseURL = exactLoopbackV1BaseURL(baseURL);',
    '  return {',
    "    endpoint: normalizedBaseURL + '/chat/completions',",
    '    body: {',
    '      model: CANONICAL_MODEL,',
    "      messages: [{ role: 'user', content: 'Call the write tool exactly once with path ' + JSON.stringify(SMOKE_FILE) + ' and content ' + JSON.stringify(SMOKE_CONTENT) + '. Do not perform any other action.' }],",
    '      stream: true,',
    "      tool_choice: 'required',",
    '      tools: [{',
    "        type: 'function',",
    '        function: {',
    "          name: 'write',",
    "          description: 'Create or overwrite the exact requested file.',",
    '          parameters: {',
    "            type: 'object',",
    "            properties: { path: { type: 'string' }, content: { type: 'string' } },",
    "            required: ['path', 'content'],",
    '            additionalProperties: false,',
    '          },',
    '        },',
    '      }],',
    '      temperature: 0,',
    '      max_tokens: 256,',
    '    },',
    '  };',
    '}',
    '',
    'function parseLlamaForcedToolStream(text, maxBytes = MAX_JSON_BYTES) {',
    "  if (typeof text !== 'string' || !Number.isInteger(maxBytes) || maxBytes < 1 || Buffer.byteLength(text, 'utf8') > maxBytes) throw new Error('llama forced-tool stream was invalid or oversized');",
    "  const rows = text.replace(/\\r\\n/g, '\\n').split('\\n');",
    '  let done = false;',
    '  let sawData = false;',
    '  let finishReason = null;',
    '  let call = null;',
    "  const plain = (value) => value && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;",
    '  for (const row of rows) {',
    "    if (row === '') continue;",
    "    if (!row.startsWith('data:')) throw new Error('llama forced-tool stream contained a non-data SSE row');",
    "    const payloadText = row.slice('data:'.length).trimStart();",
    "    if (payloadText === '[DONE]') { if (done) throw new Error('llama forced-tool stream contained duplicate DONE markers'); done = true; continue; }",
    "    if (done) throw new Error('llama forced-tool stream contained data after DONE');",
    "    if (finishReason !== null) throw new Error('llama forced-tool stream contained data after its terminal reason');",
    '    let event;',
    "    try { event = JSON.parse(payloadText); } catch { throw new Error('llama forced-tool stream contained malformed JSON'); }",
    "    if (!plain(event) || !Array.isArray(event.choices) || event.choices.length !== 1) throw new Error('llama forced-tool stream choice envelope drifted');",
    "    if (event.model !== CANONICAL_MODEL) throw new Error('llama forced-tool stream model identity drifted');",
    '    const choice = event.choices[0];',
    "    if (!plain(choice) || !plain(choice.delta)) throw new Error('llama forced-tool stream choice delta drifted');",
    '    sawData = true;',
    '    if (choice.finish_reason !== undefined && choice.finish_reason !== null) {',
    "      if (choice.finish_reason !== 'tool_calls' || finishReason !== null) throw new Error('llama forced-tool stream terminal reason contradicted a tool call');",
    '      finishReason = choice.finish_reason;',
    '    }',
    '    const content = choice.delta.content;',
    "    if (content !== undefined && content !== null && typeof content !== 'string') throw new Error('llama forced-tool stream content delta was malformed');",
    "    if (typeof content === 'string' && content.length > 0) throw new Error('llama forced-tool stream emitted plain text alongside the required tool call');",
    '    const fragments = choice.delta.tool_calls;',
    '    if (fragments === undefined) continue;',
    "    if (!Array.isArray(fragments) || fragments.length === 0) throw new Error('llama forced-tool stream tool-call delta was malformed');",
    '    for (const fragment of fragments) {',
    "      if (!plain(fragment) || fragment.index !== 0) throw new Error('llama forced-tool stream required exactly one indexed tool call');",
    "      if (fragment.type !== undefined && fragment.type !== 'function') throw new Error('llama forced-tool stream tool-call type drifted');",
    "      if (call === null) call = { id: null, name: '', arguments: '' };",
    '      if (fragment.id !== undefined && fragment.id !== null) {',
    "        if (typeof fragment.id !== 'string' || fragment.id.length === 0 || (call.id !== null && call.id !== fragment.id)) throw new Error('llama forced-tool stream tool-call id contradicted itself');",
    '        call.id = fragment.id;',
    '      }',
    '      if (fragment.function !== undefined && fragment.function !== null) {',
    "        if (!plain(fragment.function)) throw new Error('llama forced-tool stream function delta was malformed');",
    '        if (fragment.function.name !== undefined && fragment.function.name !== null) {',
    "          if (typeof fragment.function.name !== 'string' || fragment.function.name.length === 0 || (call.name !== '' && call.name !== fragment.function.name)) throw new Error('llama forced-tool stream function name contradicted itself');",
    '          call.name = fragment.function.name;',
    '        }',
    '        if (fragment.function.arguments !== undefined && fragment.function.arguments !== null) {',
    "          if (typeof fragment.function.arguments !== 'string') throw new Error('llama forced-tool stream function arguments delta was malformed');",
    '          call.arguments += fragment.function.arguments;',
    '        }',
    '      }',
    '    }',
    '  }',
    "  if (!sawData || !done || finishReason !== 'tool_calls' || call === null || call.name !== 'write') throw new Error('llama forced-tool stream did not contain one complete write tool call');",
    '  let args;',
    "  try { args = JSON.parse(call.arguments); } catch { throw new Error('llama forced-tool stream write arguments were malformed JSON'); }",
    "  if (!plain(args)) throw new Error('llama forced-tool stream write arguments were not a plain object');",
    '  const keys = Object.keys(args).sort();',
    "  if (keys.length !== 2 || keys[0] !== 'content' || keys[1] !== 'path' || args.path !== SMOKE_FILE || args.content !== SMOKE_CONTENT) throw new Error('llama forced-tool stream write arguments did not match the exact smoke target/content');",
    "  return { tool_name: 'write', path: SMOKE_FILE, content_sha256: createHash('sha256').update(SMOKE_CONTENT).digest('hex') };",
    '}',
    '',
    'async function readBoundedLlamaForcedToolStream(response) {',
    "  if (!response.body) throw new Error('llama forced-tool stream response body was unavailable');",
    '  const chunks = []; let bytes = 0;',
    '  for await (const chunk of response.body) {',
    '    const buffer = Buffer.from(chunk); bytes += buffer.length;',
    "    if (bytes > MAX_JSON_BYTES) throw new Error('llama forced-tool stream exceeded bounded size');",
    '    chunks.push(buffer);',
    '  }',
    "  return Buffer.concat(chunks).toString('utf8');",
    '}',
    '',
    'async function llamaForcedToolStreamWitness(baseURL) {',
    '  const request = buildLlamaForcedToolWitnessRequest(baseURL);',
    '  const response = await fetch(request.endpoint, {',
    "    method: 'POST',",
    "    headers: { 'content-type': 'application/json' },",
    '    body: JSON.stringify(request.body),',
    '    signal: AbortSignal.timeout(120_000),',
    '  });',
    "  if (!response.ok) throw new Error('llama forced-tool stream returned HTTP ' + response.status);",
    '  const text = await readBoundedLlamaForcedToolStream(response);',
    '  return parseLlamaForcedToolStream(text);',
    '}',
    '',
    'async function anonymousCompletion(baseURL) {',
  ]), 'Amendment 016 Layer A forced-tool witness helpers');

  source = replaceSection(source, 'function requireExactPiToolChoiceAudit(text) {', 'function buildPiFirstRequestToolChoiceExtensionSource(auditPath) {', lines([
    'function parsePiToolChoiceAuditRows(text) {',
    "  if (typeof text !== 'string' || Buffer.byteLength(text, 'utf8') > 16 * 1024) throw new Error('Pi first-request audit was invalid or oversized');",
    "  const rows = text.split(/\\r?\\n/).filter((line) => line !== '');",
    "  if (rows.length < 1 || rows.length > 2) throw new Error('Pi first-request audit required one or two bounded records');",
    '  let records;',
    "  try { records = rows.map((line) => JSON.parse(line)); } catch { throw new Error('Pi first-request audit was not valid JSONL'); }",
    "  const plain = (value) => value && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;",
    "  const exactKeys = (value, expected) => JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...expected].sort());",
    '  const first = records[0];',
    "  if (!plain(first) || !exactKeys(first, ['request','model','tool_count','tool_name','incoming_tool_choice','outgoing_tool_choice'])) throw new Error('Pi first-request audit record 1 shape drifted');",
    "  if (first.request !== 1 || first.model !== CANONICAL_MODEL || first.tool_count !== 1 || first.tool_name !== 'write' || first.incoming_tool_choice !== 'absent' || first.outgoing_tool_choice !== 'required') throw new Error('Pi first-request audit record 1 values drifted');",
    '  if (records.length === 2) {',
    '    const second = records[1];',
    "    if (!plain(second) || !exactKeys(second, ['request','model','tool_count','tool_name','incoming_tool_choice','outgoing_tool_choice','follows_successful_write_result'])) throw new Error('Pi first-request audit record 2 shape drifted');",
    "    if (second.request !== 2 || second.model !== CANONICAL_MODEL || second.tool_count !== 1 || second.tool_name !== 'write' || second.incoming_tool_choice !== 'absent' || second.outgoing_tool_choice !== 'absent' || second.follows_successful_write_result !== true) throw new Error('Pi first-request audit record 2 values drifted');",
    '  }',
    '  return records;',
    '}',
    '',
    'function requireExactPiFirstRequestShaperAudit(text) {',
    '  return parsePiToolChoiceAuditRows(text)[0];',
    '}',
    '',
    'function requireExactPiToolChoiceAudit(text) {',
    '  const records = parsePiToolChoiceAuditRows(text);',
    "  if (records.length !== 2) throw new Error('Pi first-request audit required exactly two records');",
    '  return records;',
    '}',
    '',
    '',
  ]), 'Amendment 016 Layer B audit prefix validator');

  source = replaceOnce(source, "  const baseURL = 'http://127.0.0.1:12345/v1';", lines([
    "  const baseURL = 'http://127.0.0.1:12345/v1';",
    '  const witnessRequest = buildLlamaForcedToolWitnessRequest(baseURL);',
    "  if (witnessRequest.endpoint !== baseURL + '/chat/completions' || witnessRequest.body.model !== CANONICAL_MODEL || witnessRequest.body.stream !== true || witnessRequest.body.tool_choice !== 'required' || !Array.isArray(witnessRequest.body.tools) || witnessRequest.body.tools.length !== 1) throw new Error('llama forced-tool witness request self-test failed');",
    '  const witnessTool = witnessRequest.body.tools[0];',
    '  const witnessSchema = witnessTool?.function?.parameters;',
    "  if (witnessTool?.type !== 'function' || witnessTool?.function?.name !== 'write' || witnessSchema?.type !== 'object' || witnessSchema?.additionalProperties !== false || JSON.stringify(Object.keys(witnessSchema?.properties ?? {}).sort()) !== JSON.stringify(['content','path']) || JSON.stringify([...(witnessSchema?.required ?? [])].sort()) !== JSON.stringify(['content','path'])) throw new Error('llama forced-tool witness write schema self-test failed');",
    "  for (const invalidURL of ['https://127.0.0.1:12345/v1', 'http://localhost:12345/v1', 'http://127.0.0.1/v1', 'http://127.0.0.1:12345/', 'http://127.0.0.1:12345/v1/', 'http://user@127.0.0.1:12345/v1', 'http://127.0.0.1:12345/v1?x=1']) {",
    '    let rejected = false; try { buildLlamaForcedToolWitnessRequest(invalidURL); } catch { rejected = true; }',
    "    if (!rejected) throw new Error('llama forced-tool witness accepted a non-canonical loopback URL');",
    '  }',
    "  const exactWitnessArguments = JSON.stringify({ path: SMOKE_FILE, content: SMOKE_CONTENT });",
    '  const witnessSplit = Math.max(1, Math.floor(exactWitnessArguments.length / 2));',
    "  const makeSse = (events, includeDone = true) => events.map((event) => 'data: ' + (typeof event === 'string' ? event : JSON.stringify(event))).concat(includeDone ? ['data: [DONE]'] : []).join('\\n') + '\\n';",
    "  const witnessStart = { model: CANONICAL_MODEL, choices: [{ delta: { tool_calls: [{ index: 0, id: 'call-1', type: 'function', function: { name: 'write', arguments: exactWitnessArguments.slice(0, witnessSplit) } }] }, finish_reason: null }] };",
    "  const witnessContinue = { model: CANONICAL_MODEL, choices: [{ delta: { tool_calls: [{ index: 0, function: { arguments: exactWitnessArguments.slice(witnessSplit) } }] }, finish_reason: null }] };",
    "  const witnessFinish = { model: CANONICAL_MODEL, choices: [{ delta: {}, finish_reason: 'tool_calls' }] };",
    '  const canonicalWitnessStream = makeSse([witnessStart, witnessContinue, witnessFinish]);',
    '  parseLlamaForcedToolStream(canonicalWitnessStream);',
    "  const wrongToolStart = structuredClone(witnessStart); wrongToolStart.choices[0].delta.tool_calls[0].function.name = 'read';",
    "  const duplicateToolStart = structuredClone(witnessStart); duplicateToolStart.choices[0].delta.tool_calls.push({ index: 1, id: 'call-2', type: 'function', function: { name: 'write', arguments: exactWitnessArguments } });",
    "  const malformedArgumentsStart = structuredClone(witnessStart); malformedArgumentsStart.choices[0].delta.tool_calls[0].function.arguments = '{';",
    "  const wrongPathArguments = JSON.stringify({ path: 'wrong.txt', content: SMOKE_CONTENT });",
    "  const wrongPathStart = structuredClone(witnessStart); wrongPathStart.choices[0].delta.tool_calls[0].function.arguments = wrongPathArguments;",
    "  const wrongPathContinue = structuredClone(witnessContinue); wrongPathContinue.choices[0].delta.tool_calls[0].function.arguments = '';",
    "  const wrongContentArguments = JSON.stringify({ path: SMOKE_FILE, content: 'WRONG\\n' });",
    '  const wrongContentStart = structuredClone(witnessStart); wrongContentStart.choices[0].delta.tool_calls[0].function.arguments = wrongContentArguments;',
    "  const wrongContentContinue = structuredClone(witnessContinue); wrongContentContinue.choices[0].delta.tool_calls[0].function.arguments = '';",
    '  const missingModelStart = structuredClone(witnessStart); delete missingModelStart.model;',
    "  const wrongModelStart = structuredClone(witnessStart); wrongModelStart.model = 'unexpected-model';",
    "  const plainTextStream = makeSse([{ model: CANONICAL_MODEL, choices: [{ delta: { content: 'not a tool call' }, finish_reason: 'stop' }] }]);",
    "  const contradictoryFinish = { model: CANONICAL_MODEL, choices: [{ delta: {}, finish_reason: 'stop' }] };",
    '  const invalidWitnessStreams = [',
    '    plainTextStream,',
    "    'data: {not-json}\\ndata: [DONE]\\n',",
    '    makeSse([missingModelStart, witnessContinue, witnessFinish]),',
    '    makeSse([wrongModelStart, witnessContinue, witnessFinish]),',
    '    makeSse([wrongToolStart, witnessContinue, witnessFinish]),',
    '    makeSse([duplicateToolStart, witnessContinue, witnessFinish]),',
    '    makeSse([malformedArgumentsStart, witnessFinish]),',
    '    makeSse([wrongPathStart, wrongPathContinue, witnessFinish]),',
    '    makeSse([wrongContentStart, wrongContentContinue, witnessFinish]),',
    '    makeSse([witnessStart, witnessContinue, contradictoryFinish]),',
    '    makeSse([witnessStart, witnessContinue, witnessFinish, witnessStart]),',
    '    makeSse([witnessStart, witnessContinue, witnessFinish], false),',
    '  ];',
    '  for (const invalid of invalidWitnessStreams) {',
    '    let rejected = false; try { parseLlamaForcedToolStream(invalid); } catch { rejected = true; }',
    "    if (!rejected) throw new Error('llama forced-tool stream parser fail-closed self-test failed');",
    '  }',
    "  let overflowRejected = false; try { parseLlamaForcedToolStream(canonicalWitnessStream, Buffer.byteLength(canonicalWitnessStream, 'utf8') - 1); } catch { overflowRejected = true; }",
    "  if (!overflowRejected) throw new Error('llama forced-tool stream overflow self-test failed');",
  ]), 'Amendment 016 Layer A deterministic self-tests');

  source = replaceOnce(source, "    requireExactPiToolChoiceAudit(readFileSync(positive.auditPath, 'utf8'));", lines([
    "    const positiveAudit = readFileSync(positive.auditPath, 'utf8');",
    '    requireExactPiFirstRequestShaperAudit(positiveAudit);',
    '    requireExactPiToolChoiceAudit(positiveAudit);',
    "    const firstAuditOnly = positiveAudit.split(/\\r?\\n/).filter((line) => line !== '')[0] + '\\n';",
    '    requireExactPiFirstRequestShaperAudit(firstAuditOnly);',
    '    let firstAuditRejectedAsFull = false; try { requireExactPiToolChoiceAudit(firstAuditOnly); } catch { firstAuditRejectedAsFull = true; }',
    "    if (!firstAuditRejectedAsFull) throw new Error('Pi first-record audit incorrectly satisfied the full two-record validator');",
    "    const wrongFirstAudit = firstAuditOnly.replace('\"outgoing_tool_choice\":\"required\"', '\"outgoing_tool_choice\":\"auto\"');",
    "    for (const invalidAudit of ['', wrongFirstAudit, firstAuditOnly + firstAuditOnly, positiveAudit + firstAuditOnly]) {",
    '      let rejected = false; try { requireExactPiFirstRequestShaperAudit(invalidAudit); } catch { rejected = true; }',
    "      if (!rejected) throw new Error('Pi first-record audit prefix fail-closed self-test failed');",
    '    }',
  ]), 'Amendment 016 Layer B deterministic audit-prefix self-tests');

  source = replaceOnce(source, "    await anonymousCompletion(baseURL);\n    mark(record, 'anonymous_nonempty_model_completion');", lines([
    '    await anonymousCompletion(baseURL);',
    "    mark(record, 'anonymous_nonempty_model_completion');",
    '    await llamaForcedToolStreamWitness(baseURL);',
    "    mark(record, 'llama_forced_tool_stream_witness_exact');",
  ]), 'Amendment 016 Layer A runtime witness');

  source = replaceOnce(source, lines([
    '    requireExactPiWriteEvidence(piSmokeProcessResult.stdout);',
    "    requireExactPiToolChoiceAudit(readFileSync(piSmokeAuditPath, 'utf8'));",
    "    mark(record, 'pi_first_request_tool_choice_exact');",
    '    await verifyExactSmoke(piSmokeRepo, piSmokeBefore);',
    "    mark(record, 'pi_bounded_tool_write_smoke');",
  ]), lines([
    "    const piSmokeAudit = readFileSync(piSmokeAuditPath, 'utf8');",
    '    requireExactPiFirstRequestShaperAudit(piSmokeAudit);',
    "    mark(record, 'pi_first_request_shaper_witness_exact');",
    '    requireExactPiWriteEvidence(piSmokeProcessResult.stdout);',
    '    await verifyExactSmoke(piSmokeRepo, piSmokeBefore);',
    "    mark(record, 'pi_bounded_tool_write_smoke');",
    '    requireExactPiToolChoiceAudit(piSmokeAudit);',
    "    mark(record, 'pi_first_request_tool_choice_exact');",
  ]), 'Amendment 016 Layer B/C runtime evidence ordering');

  return source;
}

function applyAmendment017(source) {
  source = replaceOnce(
    source,
    "    if (typeof content === 'string' && content.length > 0) throw new Error('llama forced-tool stream emitted plain text alongside the required tool call');\n",
    '',
    'Amendment 017 defer mixed-content classification');

  source = replaceOnce(source, '  parseLlamaForcedToolStream(canonicalWitnessStream);', lines([
    '  const canonicalWitnessResult = parseLlamaForcedToolStream(canonicalWitnessStream);',
    "  if (JSON.stringify(Object.keys(canonicalWitnessResult).sort()) !== JSON.stringify(['content_sha256','path','tool_name'])) throw new Error('llama canonical witness normalized evidence shape drifted');",
    "  const mixedContentSentinel = 'amendment-017-assistant-content-must-not-escape';",
    '  const mixedContentEvent = { model: CANONICAL_MODEL, choices: [{ delta: { content: mixedContentSentinel }, finish_reason: null }] };',
    '  const mixedContentStream = makeSse([mixedContentEvent, witnessStart, witnessContinue, witnessFinish]);',
    '  const mixedContentResult = parseLlamaForcedToolStream(mixedContentStream);',
    "  if (JSON.stringify(Object.keys(mixedContentResult).sort()) !== JSON.stringify(['content_sha256','path','tool_name']) || JSON.stringify(mixedContentResult).includes(mixedContentSentinel)) throw new Error('llama mixed-content witness leaked assistant content into normalized evidence');",
  ]), 'Amendment 017 mixed-content positive self-test');

  source = replaceOnce(source, "  const wrongModelStart = structuredClone(witnessStart); wrongModelStart.model = 'unexpected-model';", lines([
    "  const wrongModelStart = structuredClone(witnessStart); wrongModelStart.model = 'unexpected-model';",
    "  const malformedContentEvent = structuredClone(mixedContentEvent); malformedContentEvent.choices[0].delta.content = { invalid: true };",
    '  const mixedContentNoToolStream = makeSse([mixedContentEvent, witnessFinish]);',
    '  const mixedContentWrongModelStream = makeSse([mixedContentEvent, wrongModelStart, witnessContinue, witnessFinish]);',
    '  const mixedContentWrongToolStream = makeSse([mixedContentEvent, wrongToolStart, witnessContinue, witnessFinish]);',
    '  const mixedContentDuplicateToolStream = makeSse([mixedContentEvent, duplicateToolStart, witnessContinue, witnessFinish]);',
    '  const mixedContentWrongPathStream = makeSse([mixedContentEvent, wrongPathStart, wrongPathContinue, witnessFinish]);',
    '  const mixedContentWrongContentStream = makeSse([mixedContentEvent, wrongContentStart, wrongContentContinue, witnessFinish]);',
    '  const mixedContentMalformedContentStream = makeSse([malformedContentEvent, witnessStart, witnessContinue, witnessFinish]);',
    '  const mixedContentPostTerminalStream = makeSse([mixedContentEvent, witnessStart, witnessContinue, witnessFinish, witnessStart]);',
    '  const mixedContentMissingDoneStream = makeSse([mixedContentEvent, witnessStart, witnessContinue, witnessFinish], false);',
    "  const dataAfterDoneStream = canonicalWitnessStream + 'data: ' + JSON.stringify(witnessStart) + '\\n';",
  ]), 'Amendment 017 mixed-content negative fixtures');

  source = replaceOnce(source, '    plainTextStream,', lines([
    '    plainTextStream,',
    '    mixedContentNoToolStream,',
    '    mixedContentWrongModelStream,',
    '    mixedContentWrongToolStream,',
    '    mixedContentDuplicateToolStream,',
    '    mixedContentWrongPathStream,',
    '    mixedContentWrongContentStream,',
    '    mixedContentMalformedContentStream,',
    '    mixedContentPostTerminalStream,',
    '    mixedContentMissingDoneStream,',
    '    dataAfterDoneStream,',
  ]), 'Amendment 017 mixed-content fail-closed self-tests');

  source = replaceOnce(source, "  if (!overflowRejected) throw new Error('llama forced-tool stream overflow self-test failed');", lines([
    "  if (!overflowRejected) throw new Error('llama forced-tool stream overflow self-test failed');",
    '  let mixedContentOverflowRejected = false; try { parseLlamaForcedToolStream(mixedContentStream, Buffer.byteLength(mixedContentStream, \'utf8\') - 1); } catch { mixedContentOverflowRejected = true; }',
    "  if (!mixedContentOverflowRejected) throw new Error('llama mixed-content forced-tool stream overflow self-test failed');",
  ]), 'Amendment 017 mixed-content bounded-size self-test');

  return source;
}

function applyAmendment018(source) {
  source = replaceOnce(source,
    lines([
      "      if (choice.finish_reason !== 'tool_calls' || finishReason !== null) throw new Error('llama forced-tool stream terminal reason contradicted a tool call');",
      '      finishReason = choice.finish_reason;',
    ]),
    lines([
      "      if (finishReason !== null) throw new Error('llama forced-tool stream terminal_state_contradiction');",
      "      if (choice.finish_reason !== 'tool_calls' && choice.finish_reason !== 'stop') throw new Error('llama forced-tool stream terminal_state_contradiction');",
      "      if (choice.finish_reason === 'stop') {",
      "        if (call === null) throw new Error('llama forced-tool stream no_complete_tool_call_before_terminal');",
      "        if (call.id === null || call.type !== 'function' || call.name !== 'write') throw new Error('llama forced-tool stream structured_tool_call_contradiction');",
      '        let terminalArgs;',
      "        try { terminalArgs = JSON.parse(call.arguments); } catch { throw new Error('llama forced-tool stream incomplete_tool_call_before_terminal'); }",
      "        if (!plain(terminalArgs)) throw new Error('llama forced-tool stream structured_tool_call_contradiction');",
      '        const terminalKeys = Object.keys(terminalArgs).sort();',
      "        if (terminalKeys.length !== 2 || terminalKeys[0] !== 'content' || terminalKeys[1] !== 'path' || terminalArgs.path !== SMOKE_FILE || terminalArgs.content !== SMOKE_CONTENT) throw new Error('llama forced-tool stream structured_tool_call_contradiction');",
      '      }',
      '      finishReason = choice.finish_reason;',
    ]),
    'Amendment 018 reconcile stop only after exact write');

  source = replaceOnce(source,
    lines([
      "      if (fragment.type !== undefined && fragment.type !== 'function') throw new Error('llama forced-tool stream tool-call type drifted');",
      "      if (call === null) call = { id: null, name: '', arguments: '' };",
    ]),
    lines([
      "      if (fragment.type !== undefined && fragment.type !== null && fragment.type !== 'function') throw new Error('llama forced-tool stream tool-call type drifted');",
      "      if (call === null) call = { id: null, type: null, name: '', arguments: '' };",
      "      if (fragment.type === 'function') call.type = 'function';",
    ]),
    'Amendment 018 require observed function type');

  source = replaceOnce(source,
    "  if (!sawData || !done || finishReason !== 'tool_calls' || call === null || call.name !== 'write') throw new Error('llama forced-tool stream did not contain one complete write tool call');",
    "  if (!sawData || !done || (finishReason !== 'tool_calls' && finishReason !== 'stop') || call === null || call.id === null || call.type !== 'function' || call.name !== 'write') throw new Error('llama forced-tool stream did not contain one complete write tool call');",
    'Amendment 018 final structured write and terminal validation');

  source = replaceOnce(source,
    "  const witnessFinish = { model: CANONICAL_MODEL, choices: [{ delta: {}, finish_reason: 'tool_calls' }] };",
    lines([
      "  const witnessFinish = { model: CANONICAL_MODEL, choices: [{ delta: {}, finish_reason: 'tool_calls' }] };",
      "  const stopFinish = { model: CANONICAL_MODEL, choices: [{ delta: {}, finish_reason: 'stop' }] };",
      "  const unknownFinish = { model: CANONICAL_MODEL, choices: [{ delta: {}, finish_reason: 'unexpected' }] };",
    ]),
    'Amendment 018 early terminal fixtures');

  source = replaceOnce(source,
    "  const contradictoryFinish = { model: CANONICAL_MODEL, choices: [{ delta: {}, finish_reason: 'stop' }] };",
    lines([
      "  const contradictoryFinish = { model: CANONICAL_MODEL, choices: [{ delta: {}, finish_reason: 'length' }] };",
    ]),
    'Amendment 018 terminal fixtures');

  source = replaceOnce(source,
    "  if (JSON.stringify(Object.keys(canonicalWitnessResult).sort()) !== JSON.stringify(['content_sha256','path','tool_name'])) throw new Error('llama canonical witness normalized evidence shape drifted');",
    lines([
      "  if (JSON.stringify(Object.keys(canonicalWitnessResult).sort()) !== JSON.stringify(['content_sha256','path','tool_name'])) throw new Error('llama canonical witness normalized evidence shape drifted');",
      '  const stopWitnessStream = makeSse([witnessStart, witnessContinue, stopFinish]);',
      '  const stopWitnessResult = parseLlamaForcedToolStream(stopWitnessStream);',
      "  if (JSON.stringify(Object.keys(stopWitnessResult).sort()) !== JSON.stringify(['content_sha256','path','tool_name'])) throw new Error('llama stop-after-exact-write normalized evidence shape drifted');",
    ]),
    'Amendment 018 stop-after-exact-write positive self-test');

  source = replaceOnce(source,
    "  if (JSON.stringify(Object.keys(mixedContentResult).sort()) !== JSON.stringify(['content_sha256','path','tool_name']) || JSON.stringify(mixedContentResult).includes(mixedContentSentinel)) throw new Error('llama mixed-content witness leaked assistant content into normalized evidence');",
    lines([
      "  if (JSON.stringify(Object.keys(mixedContentResult).sort()) !== JSON.stringify(['content_sha256','path','tool_name']) || JSON.stringify(mixedContentResult).includes(mixedContentSentinel)) throw new Error('llama mixed-content witness leaked assistant content into normalized evidence');",
      '  const mixedContentStopStream = makeSse([mixedContentEvent, witnessStart, witnessContinue, stopFinish]);',
      '  const mixedContentStopResult = parseLlamaForcedToolStream(mixedContentStopStream);',
      "  if (JSON.stringify(Object.keys(mixedContentStopResult).sort()) !== JSON.stringify(['content_sha256','path','tool_name']) || JSON.stringify(mixedContentStopResult).includes(mixedContentSentinel)) throw new Error('llama mixed-content stop witness leaked assistant content into normalized evidence');",
    ]),
    'Amendment 018 mixed-content stop positive self-test');

  source = replaceOnce(source,
    "  const dataAfterDoneStream = canonicalWitnessStream + 'data: ' + JSON.stringify(witnessStart) + '\\n';",
    lines([
      "  const dataAfterDoneStream = canonicalWitnessStream + 'data: ' + JSON.stringify(witnessStart) + '\\n';",
      '  const stopNoToolStream = makeSse([stopFinish]);',
      '  const stopIncompleteStream = makeSse([witnessStart, stopFinish]);',
      '  const stopWrongToolStream = makeSse([wrongToolStart, witnessContinue, stopFinish]);',
      '  const stopWrongPathStream = makeSse([wrongPathStart, wrongPathContinue, stopFinish]);',
      '  const stopWrongContentStream = makeSse([wrongContentStart, wrongContentContinue, stopFinish]);',
      '  const stopDuplicateToolStream = makeSse([duplicateToolStart, witnessContinue, stopFinish]);',
      '  const stopMalformedArgumentsStream = makeSse([malformedArgumentsStart, stopFinish]);',
      '  const stopMissingModelStream = makeSse([missingModelStart, witnessContinue, stopFinish]);',
      '  const stopWrongModelStream = makeSse([wrongModelStart, witnessContinue, stopFinish]);',
      '  const completeUnknownTerminalStream = makeSse([witnessStart, witnessContinue, unknownFinish]);',
      '  const duplicateTerminalStream = makeSse([witnessStart, witnessContinue, witnessFinish, stopFinish]);',
      "  const duplicateDoneStream = canonicalWitnessStream + 'data: [DONE]\\n';",
    ]),
    'Amendment 018 terminal negative fixtures');

  source = replaceOnce(source,
    '    dataAfterDoneStream,',
    lines([
      '    dataAfterDoneStream,',
      '    stopNoToolStream,',
      '    stopIncompleteStream,',
      '    stopWrongToolStream,',
      '    stopWrongPathStream,',
      '    stopWrongContentStream,',
      '    stopDuplicateToolStream,',
      '    stopMalformedArgumentsStream,',
      '    stopMissingModelStream,',
      '    stopWrongModelStream,',
      '    completeUnknownTerminalStream,',
      '    duplicateTerminalStream,',
      '    duplicateDoneStream,',
    ]),
    'Amendment 018 terminal fail-closed self-tests');

  return source;
}

function applyAmendment019(source) {
  source = replaceOnce(source, '      max_tokens: 256,', '      max_tokens: 2048,', 'Amendment 019 align Layer-A witness output ceiling');

  source = replaceSection(source, 'function boundedReason(error) {', 'function exactPlatform() {', lines([
    "const FAILURE_REASON_CODES = new Set([",
    "  'duplicate_terminal_event',",
    "  'terminal_length_before_exact_write',",
    "  'terminal_length_after_exact_write',",
    "  'unknown_terminal_reason',",
    "  'malformed_sse',",
    "  'malformed_json',",
    "  'response_overflow',",
    "  'request_timeout',",
    "  'loopback_transport_failure',",
    "  'no_complete_tool_call_before_terminal',",
    "  'incomplete_tool_call_before_terminal',",
    "  'structured_tool_call_contradiction',",
    "  'server_cleanup_failure',",
    "  'canonical_repository_cleanup_failure',",
    "  'unclassified_internal_failure',",
    "]);",
    "",
    "function codedFailure(code) {",
    "  if (!FAILURE_REASON_CODES.has(code)) throw new Error('unknown fixed R181 failure code');",
    "  const error = new Error('R181 fixed failure');",
    "  Object.defineProperty(error, 'failureCode', { value: code, enumerable: false, configurable: false, writable: false });",
    "  return error;",
    "}",
    "",
    "function failureCode(error) {",
    "  if (error && typeof error === 'object' && typeof error.failureCode === 'string' && FAILURE_REASON_CODES.has(error.failureCode)) return error.failureCode;",
    "  if (error && typeof error === 'object' && (error.name === 'TimeoutError' || error.name === 'AbortError')) return 'request_timeout';",
    "  return 'unclassified_internal_failure';",
    "}",
    "",
    "function validateFailureRecord(record) {",
    "  if (record.outcome !== 'FAIL') return;",
    "  if (typeof record.failed_at !== 'string' || record.failed_at.length === 0) throw new Error('R181 FAIL record missing fixed failure boundary');",
    "  if (typeof record.failure_reason !== 'string' || !FAILURE_REASON_CODES.has(record.failure_reason)) throw new Error('R181 FAIL record contained a non-allowlisted failure code');",
    "}",
    "",
    "function expectFixedFailure(fn, expected) {",
    "  let observed = null;",
    "  try { fn(); } catch (error) { observed = failureCode(error); }",
    "  if (observed !== expected) throw new Error('R181 fixed failure-code self-test mismatch');",
    "}",
    "",
  ]), 'Amendment 019 fixed machine-failure-code helpers');

  source = replaceSection(source, 'function parseLlamaForcedToolStream(text, maxBytes = MAX_JSON_BYTES) {', 'async function readBoundedLlamaForcedToolStream(response) {', lines([
    "function parseLlamaForcedToolStream(text, maxBytes = MAX_JSON_BYTES) {",
    "  if (typeof text !== 'string' || !Number.isInteger(maxBytes) || maxBytes < 1) throw codedFailure('malformed_sse');",
    "  if (Buffer.byteLength(text, 'utf8') > maxBytes) throw codedFailure('response_overflow');",
    "  const rows = text.replace(/\\r\\n/g, '\\n').split('\\n');",
    "  let done = false;",
    "  let sawData = false;",
    "  let finishReason = null;",
    "  let call = null;",
    "  const plain = (value) => value && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;",
    "  const callState = () => {",
    "    if (call === null) return 'missing';",
    "    if (call.id === null || call.type !== 'function' || call.name !== 'write') return 'contradiction';",
    "    let args;",
    "    try { args = JSON.parse(call.arguments); } catch { return 'incomplete'; }",
    "    if (!plain(args)) return 'contradiction';",
    "    const keys = Object.keys(args).sort();",
    "    if (keys.length !== 2 || keys[0] !== 'content' || keys[1] !== 'path' || args.path !== SMOKE_FILE || args.content !== SMOKE_CONTENT) return 'contradiction';",
    "    return 'exact';",
    "  };",
    "  const requireExactTerminalCall = () => {",
    "    const state = callState();",
    "    if (state === 'missing') throw codedFailure('no_complete_tool_call_before_terminal');",
    "    if (state === 'incomplete') throw codedFailure('incomplete_tool_call_before_terminal');",
    "    if (state !== 'exact') throw codedFailure('structured_tool_call_contradiction');",
    "  };",
    "  for (const row of rows) {",
    "    if (row === '') continue;",
    "    if (!row.startsWith('data:')) throw codedFailure('malformed_sse');",
    "    const payloadText = row.slice('data:'.length).trimStart();",
    "    if (payloadText === '[DONE]') { if (done) throw codedFailure('duplicate_terminal_event'); done = true; continue; }",
    "    if (done) throw codedFailure('malformed_sse');",
    "    if (finishReason !== null) throw codedFailure('duplicate_terminal_event');",
    "    let event;",
    "    try { event = JSON.parse(payloadText); } catch { throw codedFailure('malformed_json'); }",
    "    if (!plain(event) || !Array.isArray(event.choices) || event.choices.length !== 1 || event.model !== CANONICAL_MODEL) throw codedFailure('structured_tool_call_contradiction');",
    "    const choice = event.choices[0];",
    "    if (!plain(choice) || !plain(choice.delta)) throw codedFailure('structured_tool_call_contradiction');",
    "    sawData = true;",
    "    if (choice.finish_reason !== undefined && choice.finish_reason !== null) {",
    "      if (finishReason !== null) throw codedFailure('duplicate_terminal_event');",
    "      if (choice.finish_reason === 'length') {",
    "        throw codedFailure(callState() === 'exact' ? 'terminal_length_after_exact_write' : 'terminal_length_before_exact_write');",
    "      }",
    "      if (choice.finish_reason !== 'tool_calls' && choice.finish_reason !== 'stop') throw codedFailure('unknown_terminal_reason');",
    "      requireExactTerminalCall();",
    "      finishReason = choice.finish_reason;",
    "    }",
    "    const content = choice.delta.content;",
    "    if (content !== undefined && content !== null && typeof content !== 'string') throw codedFailure('structured_tool_call_contradiction');",
    "    const fragments = choice.delta.tool_calls;",
    "    if (fragments === undefined) continue;",
    "    if (!Array.isArray(fragments) || fragments.length === 0) throw codedFailure('structured_tool_call_contradiction');",
    "    for (const fragment of fragments) {",
    "      if (!plain(fragment) || fragment.index !== 0) throw codedFailure('structured_tool_call_contradiction');",
    "      if (fragment.type !== undefined && fragment.type !== null && fragment.type !== 'function') throw codedFailure('structured_tool_call_contradiction');",
    "      if (call === null) call = { id: null, type: null, name: '', arguments: '' };",
    "      if (fragment.type === 'function') call.type = 'function';",
    "      if (fragment.id !== undefined && fragment.id !== null) {",
    "        if (typeof fragment.id !== 'string' || fragment.id.length === 0 || (call.id !== null && call.id !== fragment.id)) throw codedFailure('structured_tool_call_contradiction');",
    "        call.id = fragment.id;",
    "      }",
    "      if (fragment.function !== undefined && fragment.function !== null) {",
    "        if (!plain(fragment.function)) throw codedFailure('structured_tool_call_contradiction');",
    "        if (fragment.function.name !== undefined && fragment.function.name !== null) {",
    "          if (typeof fragment.function.name !== 'string' || fragment.function.name.length === 0 || (call.name !== '' && call.name !== fragment.function.name)) throw codedFailure('structured_tool_call_contradiction');",
    "          call.name = fragment.function.name;",
    "        }",
    "        if (fragment.function.arguments !== undefined && fragment.function.arguments !== null) {",
    "          if (typeof fragment.function.arguments !== 'string') throw codedFailure('structured_tool_call_contradiction');",
    "          call.arguments += fragment.function.arguments;",
    "        }",
    "      }",
    "    }",
    "  }",
    "  if (!sawData || !done || finishReason === null) throw codedFailure('no_complete_tool_call_before_terminal');",
    "  requireExactTerminalCall();",
    "  return { tool_name: 'write', path: SMOKE_FILE, content_sha256: createHash('sha256').update(SMOKE_CONTENT).digest('hex') };",
    "}",
    "",
  ]), 'Amendment 019 fixed-code Layer-A parser');

  source = replaceSection(source, 'async function readBoundedLlamaForcedToolStream(response) {', 'async function llamaForcedToolStreamWitness(baseURL) {', lines([
    "async function readBoundedLlamaForcedToolStream(response) {",
    "  if (!response.body) throw codedFailure('loopback_transport_failure');",
    "  const chunks = []; let bytes = 0;",
    "  try {",
    "    for await (const chunk of response.body) {",
    "      const buffer = Buffer.from(chunk); bytes += buffer.length;",
    "      if (bytes > MAX_JSON_BYTES) throw codedFailure('response_overflow');",
    "      chunks.push(buffer);",
    "    }",
    "  } catch (error) {",
    "    const code = failureCode(error);",
    "    if (code === 'response_overflow' || code === 'request_timeout') throw codedFailure(code);",
    "    throw codedFailure('loopback_transport_failure');",
    "  }",
    "  return Buffer.concat(chunks).toString('utf8');",
    "}",
    "",
  ]), 'Amendment 019 fixed-code bounded stream reader');

  source = replaceSection(source, 'async function llamaForcedToolStreamWitness(baseURL) {', 'async function anonymousCompletion(baseURL) {', lines([
    "async function llamaForcedToolStreamWitness(baseURL) {",
    "  const request = buildLlamaForcedToolWitnessRequest(baseURL);",
    "  let response;",
    "  try {",
    "    response = await fetch(request.endpoint, {",
    "      method: 'POST',",
    "      headers: { 'content-type': 'application/json' },",
    "      body: JSON.stringify(request.body),",
    "      signal: AbortSignal.timeout(120_000),",
    "    });",
    "  } catch (error) {",
    "    if (failureCode(error) === 'request_timeout') throw codedFailure('request_timeout');",
    "    throw codedFailure('loopback_transport_failure');",
    "  }",
    "  if (!response.ok) throw codedFailure('loopback_transport_failure');",
    "  const text = await readBoundedLlamaForcedToolStream(response);",
    "  return parseLlamaForcedToolStream(text);",
    "}",
    "",
  ]), 'Amendment 019 fixed-code loopback transport');

  source = replaceOnce(source, "  const witnessRequest = buildLlamaForcedToolWitnessRequest(baseURL);", lines([
    "  const witnessRequest = buildLlamaForcedToolWitnessRequest(baseURL);",
    "  if (witnessRequest.body.max_tokens !== 2048) throw new Error('Amendment 019 Layer-A witness max_tokens self-test failed');",
  ]), 'Amendment 019 Layer-A output ceiling self-test');

  source = replaceOnce(source, "  const duplicateTerminalStream = makeSse([witnessStart, witnessContinue, witnessFinish, stopFinish]);", lines([
    "  const duplicateTerminalStream = makeSse([witnessStart, witnessContinue, witnessFinish, stopFinish]);",
    "  const lengthBeforeExactWriteStream = makeSse([contradictoryFinish]);",
    "  const lengthAfterExactWriteStream = makeSse([witnessStart, witnessContinue, contradictoryFinish]);",
  ]), 'Amendment 019 terminal classification fixtures');

  source = replaceOnce(source, '  const invalidWitnessStreams = [', lines([
    "  expectFixedFailure(() => parseLlamaForcedToolStream(lengthBeforeExactWriteStream), 'terminal_length_before_exact_write');",
    "  expectFixedFailure(() => parseLlamaForcedToolStream(lengthAfterExactWriteStream), 'terminal_length_after_exact_write');",
    "  expectFixedFailure(() => parseLlamaForcedToolStream(completeUnknownTerminalStream), 'unknown_terminal_reason');",
    "  expectFixedFailure(() => parseLlamaForcedToolStream(duplicateTerminalStream), 'duplicate_terminal_event');",
    "  expectFixedFailure(() => parseLlamaForcedToolStream('event: message\\n'), 'malformed_sse');",
    "  expectFixedFailure(() => parseLlamaForcedToolStream('data: {not-json}\\ndata: [DONE]\\n'), 'malformed_json');",
    "  expectFixedFailure(() => parseLlamaForcedToolStream(canonicalWitnessStream, Buffer.byteLength(canonicalWitnessStream, 'utf8') - 1), 'response_overflow');",
    "  const timeoutSentinel = new Error('amendment-019-timeout-sentinel'); timeoutSentinel.name = 'TimeoutError';",
    "  if (failureCode(timeoutSentinel) !== 'request_timeout') throw new Error('Amendment 019 timeout fixed-code self-test failed');",
    "  if (failureCode(codedFailure('loopback_transport_failure')) !== 'loopback_transport_failure') throw new Error('Amendment 019 transport fixed-code self-test failed');",
    "  const failureSentinels = ['assistant-prose-sentinel', 'Authorization: Bearer credential-sentinel', 'token-sentinel', '/tmp/filesystem-sentinel', 'model-prose-sentinel', '{tool-argument-sentinel}'];",
    "  for (const sentinel of failureSentinels) {",
    "    const arbitrary = new Error(sentinel);",
    "    const probe = { outcome: 'FAIL', failed_at: 'harness', failure_reason: failureCode(arbitrary) };",
    "    validateFailureRecord(probe);",
    "    if (probe.failure_reason !== 'unclassified_internal_failure' || JSON.stringify(probe).includes(sentinel)) throw new Error('Amendment 019 failure sentinel escaped fixed-code serialization');",
    "  }",
    "  let invalidFailureRecordRejected = false; try { validateFailureRecord({ outcome: 'FAIL', failed_at: 'harness', failure_reason: 'not-allowlisted' }); } catch { invalidFailureRecordRejected = true; }",
    "  if (!invalidFailureRecordRejected) throw new Error('Amendment 019 evidence-consumer allowlist self-test failed');",
    "  const invalidWitnessStreams = [",
  ]), 'Amendment 019 deterministic fixed-code self-tests');

  source = replaceOnce(source, "  const piConfig = buildPiR181Models(baseURL);", lines([
    "  const piConfig = buildPiR181Models(baseURL);",
    "  if (witnessRequest.body.max_tokens !== piConfig.providers[CANONICAL_PROVIDER].models[0].maxTokens || piConfig.providers[CANONICAL_PROVIDER].models[0].maxTokens !== 2048) throw new Error('Amendment 019 witness/Pi output ceilings diverged');",
  ]), 'Amendment 019 witness and Pi ceiling equality self-test');

  source = replaceOnce(source, "    record.failure_reason = boundedReason(error);", "    record.failure_reason = failureCode(error);", 'Amendment 019 fixed-code main failure serialization');
  source = replaceOnce(source, "          record.failure_reason = `llama-server cleanup was ${result.cause}/${result.cleanupStatus}`;", "          record.failure_reason = 'server_cleanup_failure';", 'Amendment 019 fixed server cleanup code');
  source = replaceOnce(source, "      record.failure_reason = 'canonical checkout changed during R181 qualification';", "      record.failure_reason = 'canonical_repository_cleanup_failure';", 'Amendment 019 fixed canonical cleanup code');
  source = replaceOnce(source, "    console.log(JSON.stringify(record));", lines([
    "    validateFailureRecord(record);",
    "    console.log(JSON.stringify(record));",
  ]), 'Amendment 019 final record evidence-consumer validation');

  source = replaceSection(source, 'main().catch((error) => {', '', '', 'unused');

  return source;
}

const checkoutSource = readFileSync(IMPLEMENTATION_PATH, 'utf8');
const canonicalSource = checkoutSource.replace(/\r\n/g, '\n');
if (canonicalSource.includes('\r')) throw new Error('R181 canonical implementation contained unsupported carriage returns');
if (gitBlobSha(canonicalSource) !== EXPECTED_BASE_BLOB) throw new Error('R181 canonical implementation blob drifted from Amendment 013 base');
const tempRoot = mkdtempSync(join(resolve(process.env.RUNNER_TEMP || tmpdir()), 'delethos-r181-am019-'));
const tempScripts = join(tempRoot, 'scripts');
mkdirSync(tempScripts, { recursive: false });
const tempImplementation = join(tempScripts, 'recovery-provider-prereq-impl.mjs');
const patchPath = join(tempRoot, 'amendment-010.patch');
writeFileSync(tempImplementation, canonicalSource, { flag: 'wx' });
writeFileSync(patchPath, AMENDMENT_010_PATCH, { flag: 'wx' });
try {
  const applied = spawnSync('git', ['apply', '--no-index', patchPath], { cwd: tempRoot, encoding: 'utf8', shell: false });
  if (applied.error || applied.status !== 0) throw new Error(`R181 Amendment 010 patch failed: status=${applied.status ?? 'null'} error=${applied.error?.message ?? 'none'}`);
  let candidateSource = readFileSync(tempImplementation, 'utf8').replace(/\r\n/g, '\n');
  if (candidateSource.includes('\r')) throw new Error('R181 Amendment 010 implementation contained unsupported carriage returns');
  if (gitBlobSha(candidateSource) !== EXPECTED_AMENDMENT_010_BLOB) throw new Error('R181 Amendment 010 implementation failed exact blob verification');
  candidateSource = applyAmendment013(candidateSource);
  const amendment013Blob = gitBlobSha(candidateSource);
  candidateSource = applyAmendment014(candidateSource);
  const amendment014Blob = gitBlobSha(candidateSource);
  candidateSource = applyAmendment015(candidateSource);
  const amendment015Blob = gitBlobSha(candidateSource);
  candidateSource = applyAmendment016(candidateSource);
  const amendment016Blob = gitBlobSha(candidateSource);
  candidateSource = applyAmendment017(candidateSource);
  const amendment017Blob = gitBlobSha(candidateSource);
  candidateSource = applyAmendment018(candidateSource);
  const amendment018Blob = gitBlobSha(candidateSource);
  candidateSource = applyAmendment019(candidateSource);
  const amendment019Blob = gitBlobSha(candidateSource);
  for (const [relativeSpecifier, label] of [['../packages/adapters/src/opencode.ts', 'OpenCode import'], ['../packages/adapters/src/pi.ts', 'Pi import'], ['../packages/runtime/src/process.ts', 'process supervisor import']]) {
    const absoluteURL = pathToFileURL(resolve(SCRIPT_DIR, relativeSpecifier)).href;
    candidateSource = replaceOnce(candidateSource, `'${relativeSpecifier}'`, `'${absoluteURL}'`, label);
  }
  candidateSource = replaceOnce(candidateSource, 'const REPO_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));', `const REPO_ROOT = ${JSON.stringify(REPO_ROOT)};`, 'repository root');
  writeFileSync(tempImplementation, candidateSource, { flag: 'w' });
  if (process.argv.length === 3 && process.argv[2] === '--self-test') console.log(JSON.stringify({ source: 'DETERMINISTIC_R181_AMENDMENT_019_DISCRIMINATOR', outcome: 'PASS', base_blob: EXPECTED_BASE_BLOB, amendment_010_blob: EXPECTED_AMENDMENT_010_BLOB, amendment_013_blob: amendment013Blob, amendment_014_blob: amendment014Blob, amendment_015_blob: amendment015Blob, amendment_016_blob: amendment016Blob, amendment_017_blob: amendment017Blob, amendment_018_blob: amendment018Blob, amendment_019_blob: amendment019Blob, runtime_provenance: 'git-ls-remote+github-expanded-assets-exact-href+downloaded-byte-sha256', pi_evidence: 'durable-message-end+first-request-only-tool-choice+runtime-discriminator+stream-terminal-reconciliation+layer-a-budget+fixed-failure-codes' }));
  const child = spawnSync(process.execPath, [tempImplementation, ...process.argv.slice(2)], { cwd: process.cwd(), env: process.env, stdio: 'inherit', shell: false });
  if (child.error) throw child.error;
  if (child.signal) throw new Error(`R181 candidate process terminated by signal ${child.signal}`);
  process.exitCode = child.status ?? 1;
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
