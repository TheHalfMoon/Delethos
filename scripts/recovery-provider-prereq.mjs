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

function gitBlobSha(source) {
  const bytes = Buffer.from(source, 'utf8');
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

function replaceOnce(source, before, after, label) {
  const first = source.indexOf(before);
  if (first < 0 || source.indexOf(before, first + before.length) >= 0) {
    throw new Error(`R181 Amendment 013 rewrite contract drifted at ${label}`);
  }
  return source.slice(0, first) + after + source.slice(first + before.length);
}

function replaceSection(source, startMarker, endMarker, replacement, label) {
  const start = source.indexOf(startMarker);
  if (start < 0 || source.indexOf(startMarker, start + startMarker.length) >= 0) {
    throw new Error(`R181 Amendment 013 section start drifted at ${label}`);
  }
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (end < 0 || source.indexOf(endMarker, end + endMarker.length) >= 0) {
    throw new Error(`R181 Amendment 013 section end drifted at ${label}`);
  }
  return source.slice(0, start) + replacement + source.slice(end);
}

function applyAmendment010(source) {
  source = replaceOnce(
    source,
    'const PI_TOOL_FLUSH_GRACE_MS = 25;',
    'const PI_TOOL_NATURAL_EXIT_GRACE_MS = 30_000;',
    'Amendment 010 natural-exit constant',
  );

  source = replaceSection(
    source,
    'function buildPiR181Models(baseURL, forceFirstTool) {',
    'function exactPiConfig(config, baseURL, forceFirstTool) {',
    `function buildPiR181Models(baseURL) {
  const model = {
    id: CANONICAL_MODEL,
    name: 'Delethos local Qwen2.5 Coder 1.5B Q4_K_M',
    reasoning: false,
    input: ['text'],
    contextWindow: 16384,
    maxTokens: 2048,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
  };
  return {
    providers: {
      [CANONICAL_PROVIDER]: {
        baseUrl: baseURL,
        api: 'openai-completions',
        apiKey: 'delethos-local-no-secret',
        authHeader: false,
        compat: { supportsDeveloperRole: false, supportsReasoningEffort: false },
        models: [model],
      },
    },
  };
}

`,
    'Amendment 010 Pi model shape',
  );

  source = replaceSection(
    source,
    'function exactPiConfig(config, baseURL, forceFirstTool) {',
    'function exactOpenCodePolicy(config, baseURL) {',
    `function exactPiConfig(config, baseURL) {
  const provider = config?.providers?.[CANONICAL_PROVIDER];
  const models = provider?.models;
  if (!Array.isArray(models) || models.length !== 1) return false;
  const model = models[0];
  return provider?.baseUrl === baseURL
    && provider?.api === 'openai-completions'
    && provider?.apiKey === 'delethos-local-no-secret'
    && provider?.authHeader === false
    && provider?.compat?.supportsDeveloperRole === false
    && provider?.compat?.supportsReasoningEffort === false
    && model?.id === CANONICAL_MODEL
    && model?.reasoning === false
    && Array.isArray(model?.input)
    && model.input.length === 1
    && model.input[0] === 'text'
    && model?.contextWindow === 16384
    && model?.maxTokens === 2048
    && model?.samplingParams === undefined;
}

`,
    'Amendment 010 Pi config validation',
  );

  source = replaceSection(
    source,
    'async function waitForExactSmokeThenStop(repo, running, timeoutMs = PI_TOOL_SMOKE_TIMEOUT_MS) {',
    'function validateForcedSmokeProcess(result) {',
    `function boundedNaturalExitDeadline(outerDeadline, smokeObservedAt) {
  return Math.min(outerDeadline, smokeObservedAt + PI_TOOL_NATURAL_EXIT_GRACE_MS);
}

async function waitForExactSmokeThenStop(repo, running, timeoutMs = PI_TOOL_SMOKE_TIMEOUT_MS) {
  const smokePath = join(repo, SMOKE_FILE);
  const deadline = Date.now() + timeoutMs;
  let settled = null;
  running.result.then(
    (result) => { settled = result; },
    () => { /* the awaited result below reports the failure */ },
  );
  while (Date.now() < deadline) {
    if (existsSync(smokePath)) {
      const stat = lstatSync(smokePath);
      if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('Pi smoke target became a non-regular file');
      let content = null;
      try {
        content = await readFile(smokePath, 'utf8');
      } catch {
        // The write may still be in progress. Continue bounded polling.
      }
      if (content === SMOKE_CONTENT) {
        const naturalDeadline = boundedNaturalExitDeadline(deadline, Date.now());
        while (settled === null && Date.now() < naturalDeadline) {
          const remaining = naturalDeadline - Date.now();
          await new Promise((resolveValue) => setTimeout(resolveValue, Math.min(PI_TOOL_POLL_MS, Math.max(1, remaining))));
        }
        if (settled !== null) return settled;
        running.cancel();
        const cancelled = await running.result;
        throw new Error(`Pi write smoke did not settle naturally within bounded grace: cause=${cancelled.cause} exit=${cancelled.exitCode ?? 'null'} cleanup=${cancelled.cleanupStatus}`);
      }
    }
    if (settled !== null) return settled;
    const remaining = deadline - Date.now();
    if (remaining > 0) {
      await new Promise((resolveValue) => setTimeout(resolveValue, Math.min(PI_TOOL_POLL_MS, remaining)));
    }
  }
  if (settled === null) running.cancel();
  const result = await running.result;
  throw new Error(`Pi write smoke did not produce exact file before deadline: cause=${result.cause} exit=${result.exitCode ?? 'null'} cleanup=${result.cleanupStatus}`);
}

`,
    'Amendment 010 natural settlement',
  );

  source = replaceSection(
    source,
    'function validateForcedSmokeProcess(result) {',
    'async function selfTest() {',
    `function validateForcedSmokeProcess(result) {
  if (result.outputTruncated) throw new Error('Pi write-smoke output was truncated');
  if (result.cause === 'EXITED' && result.exitCode === 0) return;
  if (result.cause === 'CANCELLED') {
    throw new Error(`Pi write-smoke cancellation is fail-closed: cleanup=${result.cleanupStatus}`);
  }
  throw new Error(`Pi write-smoke process ended unexpectedly: cause=${result.cause} exit=${result.exitCode ?? 'null'} cleanup=${result.cleanupStatus}`);
}

`,
    'Amendment 010 cancellation fail-closed',
  );

  source = replaceOnce(
    source,
    `  const baseURL = 'http://127.0.0.1:12345/v1';
  const ordinaryPiConfig = buildPiR181Models(baseURL, false);
  const forcedPiConfig = buildPiR181Models(baseURL, true);
  if (!exactPiConfig(ordinaryPiConfig, baseURL, false)) throw new Error('Pi ordinary R181 config self-test failed');
  if (!exactPiConfig(forcedPiConfig, baseURL, true)) throw new Error('Pi forced-tool R181 config self-test failed');
  const openCodeConfig = buildOpenCodeR181Config(baseURL, SMOKE_FILE);
  if (!exactOpenCodePolicy(openCodeConfig, baseURL)) throw new Error('OpenCode R181 policy self-test failed');
`,
    `  const baseURL = 'http://127.0.0.1:12345/v1';
  const piConfig = buildPiR181Models(baseURL);
  if (!exactPiConfig(piConfig, baseURL)) throw new Error('Pi canonical R181 config self-test failed');
  if (piConfig.providers[CANONICAL_PROVIDER].models[0].samplingParams !== undefined) {
    throw new Error('Pi R181 config unexpectedly contains model-level samplingParams');
  }
  if (PI_TOOL_NATURAL_EXIT_GRACE_MS > 30_000 || PI_TOOL_SMOKE_TIMEOUT_MS !== 300_000) {
    throw new Error('Pi R181 natural-exit timing bounds drifted from Amendment 010');
  }
  const timingOrigin = 1_000_000;
  if (boundedNaturalExitDeadline(timingOrigin + PI_TOOL_SMOKE_TIMEOUT_MS, timingOrigin) !== timingOrigin + PI_TOOL_NATURAL_EXIT_GRACE_MS) {
    throw new Error('Pi R181 natural-exit grace was not bounded to 30 seconds');
  }
  if (boundedNaturalExitDeadline(timingOrigin + 10_000, timingOrigin) !== timingOrigin + 10_000) {
    throw new Error('Pi R181 natural-exit grace extended the outer deadline');
  }
  validateForcedSmokeProcess({ outputTruncated: false, cause: 'EXITED', exitCode: 0, cleanupStatus: 'NOT_REQUIRED' });
  let cancellationRejected = false;
  try {
    validateForcedSmokeProcess({ outputTruncated: false, cause: 'CANCELLED', exitCode: null, cleanupStatus: 'SUCCEEDED' });
  } catch {
    cancellationRejected = true;
  }
  if (!cancellationRejected) throw new Error('Pi R181 cancellation fail-closed self-test failed');
  const openCodeConfig = buildOpenCodeR181Config(baseURL, SMOKE_FILE);
  if (!exactOpenCodePolicy(openCodeConfig, baseURL)) throw new Error('OpenCode R181 policy self-test failed');
`,
    'Amendment 010 self-test config and timing',
  );

  source = replaceOnce(
    source,
    `    pi_max_tokens: 2048,
    forced_tool_choice: 'required',
    runtime_version_timeout_ms: RUNTIME_VERSION_TIMEOUT_MS,
`,
    `    pi_max_tokens: 2048,
    model_tool_choice: 'omitted',
    pi_tool_natural_exit_grace_ms: PI_TOOL_NATURAL_EXIT_GRACE_MS,
    pi_tool_smoke_timeout_ms: PI_TOOL_SMOKE_TIMEOUT_MS,
    runtime_version_timeout_ms: RUNTIME_VERSION_TIMEOUT_MS,
`,
    'Amendment 010 self-test summary',
  );

  source = replaceOnce(
    source,
    `    const piCompletionConfig = buildPiR181Models(baseURL, false);
    if (!exactPiConfig(piCompletionConfig, baseURL, false)) throw new Error('Pi completion provider config drifted from Amendment 008');
`,
    `    const piCompletionConfig = buildPiR181Models(baseURL);
    if (!exactPiConfig(piCompletionConfig, baseURL)) throw new Error('Pi completion provider config drifted from Amendment 008');
`,
    'Amendment 010 completion config',
  );

  source = replaceOnce(
    source,
    `    const piSmokeConfig = buildPiR181Models(baseURL, true);
    if (!exactPiConfig(piSmokeConfig, baseURL, true)) throw new Error('Pi forced-tool provider config drifted from bounded R181 posture');
`,
    `    const piSmokeConfig = buildPiR181Models(baseURL);
    if (!exactPiConfig(piSmokeConfig, baseURL)) throw new Error('Pi write-smoke provider config drifted from Amendment 010');
`,
    'Amendment 010 smoke config',
  );

  return source;
}

function applyAmendment013(source) {
  source = replaceOnce(
    source,
    "  'runtime_release_asset_digest_metadata_exact',",
    "  'runtime_release_asset_public_metadata_exact',",
    'public release metadata fact name',
  );

  source = replaceOnce(
    source,
    `    runtime_release: RUNTIME_RELEASE,
    runtime_commit: RUNTIME_COMMIT,
    model_revision: MODEL_REVISION,
`,
    `    runtime_release: RUNTIME_RELEASE,
    runtime_commit: RUNTIME_COMMIT,
    runtime_tag_provenance_transport: 'git-ls-remote-public-no-auth',
    runtime_release_asset_provenance_transport: 'github-expanded-assets-public-no-auth',
    model_revision: MODEL_REVISION,
`,
    'public provenance transport record',
  );

  source = replaceSection(
    source,
    'async function fetchJson(url, timeoutMs = 30_000) {',
    'async function downloadVerified(url, destination, expectedSha256, timeoutMs) {',
    `function parseRuntimeTagRef(output) {
  const expectedRef = ` + "`refs/tags/${RUNTIME_RELEASE}`" + `;
  const lines = output.replace(/\\r\\n/g, '\\n').split('\\n').filter((line) => line !== '');
  if (lines.length !== 1) throw new Error(` + "`runtime tag ref required exactly one line; observed ${lines.length}`" + `);
  const fields = lines[0].split('\\t');
  if (fields.length !== 2 || fields[0] !== RUNTIME_COMMIT || fields[1] !== expectedRef) {
    throw new Error('runtime tag ref did not match the exact pinned commit/ref');
  }
  return fields[0];
}

function resolveRuntimeTagCommit() {
  const output = runSync(
    'git',
    ['ls-remote', '--refs', 'https://github.com/ggml-org/llama.cpp', ` + "`refs/tags/${RUNTIME_RELEASE}`" + `],
    { cwd: REPO_ROOT, timeoutMs: 30_000, label: 'public runtime tag provenance' },
  );
  return parseRuntimeTagRef(output);
}

function assetEntryForName(html, assetName) {
  const rows = new Map();
  let cursor = 0;
  while (true) {
    const index = html.indexOf(assetName, cursor);
    if (index < 0) break;
    const start = html.lastIndexOf('<li', index);
    const endMarker = html.indexOf('</li>', index);
    if (start >= 0 && endMarker >= 0) {
      const end = endMarker + '</li>'.length;
      rows.set(` + "`${start}:${end}`" + `, html.slice(start, end));
    }
    cursor = index + assetName.length;
  }
  if (rows.size !== 1) {
    throw new Error(` + "`runtime release metadata required exactly one asset entry; observed ${rows.size}`" + `);
  }
  return [...rows.values()][0];
}

function parseReleaseAssetDigestHtml(html, assetName, expectedSha256) {
  if (typeof html !== 'string' || Buffer.byteLength(html, 'utf8') > MAX_JSON_BYTES) {
    throw new Error('runtime release metadata HTML exceeded bounded size or was invalid');
  }
  const entry = assetEntryForName(html, assetName);
  const expectedPath = ` + "`/releases/download/${RUNTIME_RELEASE}/${assetName}`" + `;
  if (!entry.includes(expectedPath)) {
    throw new Error('runtime release asset entry was not bound to the exact release/tag filename');
  }
  const digests = [...entry.matchAll(/sha256:([0-9a-fA-F]{64})/g)].map((match) => match[1].toLowerCase());
  const uniqueDigests = [...new Set(digests)];
  if (uniqueDigests.length !== 1 || uniqueDigests[0] !== expectedSha256) {
    throw new Error('runtime release asset public metadata digest did not match the pinned digest');
  }
  return uniqueDigests[0];
}

async function fetchPublicReleaseAssetDigest(assetName, expectedSha256, timeoutMs = 30_000) {
  const url = ` + "`https://github.com/ggml-org/llama.cpp/releases/expanded_assets/${RUNTIME_RELEASE}`" + `;
  const response = await fetch(url, {
    redirect: 'follow',
    headers: { Accept: 'text/html', 'User-Agent': 'delethos-r181' },
    signal: AbortSignal.timeout(timeoutMs),
  });
  const finalURL = new URL(response.url || url);
  if (finalURL.protocol !== 'https:' || finalURL.hostname !== 'github.com') {
    throw new Error('runtime release metadata redirected outside github.com');
  }
  if (!response.ok) throw new Error(` + "`GET github.com returned HTTP ${response.status}`" + `);
  const text = await response.text();
  return parseReleaseAssetDigestHtml(text, assetName, expectedSha256);
}

`,
    'public no-secret runtime provenance',
  );

  source = replaceSection(
    source,
    'function parsePiToolEvidence(stdout) {',
    'function supervisePiPlan(plan) {',
    `function parsePiToolEvidence(stdout) {
  const toolCalls = [];
  const toolResults = [];
  const starts = [];
  const ends = [];
  const assistantIdentities = [];
  let invalid = false;

  const nonEmptyLines = stdout.split(/\\r?\\n/).filter((value) => value.trim() !== '');
  for (const line of nonEmptyLines) {
    let event;
    try { event = JSON.parse(line); } catch {
      invalid = true;
      continue;
    }
    if (!event || typeof event !== 'object' || Array.isArray(event)) {
      invalid = true;
      continue;
    }

    if (event.type === 'message_end') {
      const message = event.message;
      if (!message || typeof message !== 'object' || Array.isArray(message) || typeof message.role !== 'string') {
        invalid = true;
        continue;
      }

      if (message.role === 'assistant') {
        assistantIdentities.push({
          provider: typeof message.provider === 'string' ? message.provider : null,
          model: typeof message.model === 'string' ? message.model : null,
        });
        if (!Array.isArray(message.content)) {
          invalid = true;
          continue;
        }
        for (const item of message.content) {
          if (!item || typeof item !== 'object' || Array.isArray(item) || item.type !== 'toolCall') continue;
          const plainArguments = item.arguments
            && typeof item.arguments === 'object'
            && !Array.isArray(item.arguments)
            && Object.getPrototypeOf(item.arguments) === Object.prototype;
          if (typeof item.id !== 'string' || item.id.length === 0
            || typeof item.name !== 'string' || item.name.length === 0
            || !plainArguments) {
            invalid = true;
            continue;
          }
          toolCalls.push({ id: item.id, name: item.name, arguments: item.arguments });
        }
      }

      if (message.role === 'toolResult') {
        if (typeof message.toolCallId !== 'string' || message.toolCallId.length === 0
          || typeof message.toolName !== 'string' || message.toolName.length === 0
          || typeof message.isError !== 'boolean') {
          invalid = true;
          continue;
        }
        toolResults.push({
          id: message.toolCallId,
          name: message.toolName,
          isError: message.isError,
        });
      }
    }

    if (event.type === 'tool_execution_start') {
      if (typeof event.toolCallId !== 'string' || event.toolCallId.length === 0
        || typeof event.toolName !== 'string' || event.toolName.length === 0) {
        invalid = true;
      } else {
        starts.push({ id: event.toolCallId, name: event.toolName });
      }
    }

    if (event.type === 'tool_execution_end') {
      if (typeof event.toolCallId !== 'string' || event.toolCallId.length === 0
        || typeof event.toolName !== 'string' || event.toolName.length === 0
        || typeof event.isError !== 'boolean') {
        invalid = true;
      } else {
        ends.push({ id: event.toolCallId, name: event.toolName, isError: event.isError });
      }
    }
  }

  return { invalid, toolCalls, toolResults, starts, ends, assistantIdentities };
}

function requireExactPiWriteEvidence(stdout) {
  const evidence = parsePiToolEvidence(stdout);
  if (evidence.invalid) throw new Error('Pi write-smoke JSONL contained malformed evidence');

  if (evidence.toolCalls.length !== 1 || evidence.toolResults.length !== 1) {
    throw new Error(` + "`Pi write smoke required exactly one durable tool call/result; observed calls=${evidence.toolCalls.length} results=${evidence.toolResults.length}`" + `);
  }

  const call = evidence.toolCalls[0];
  const result = evidence.toolResults[0];
  if (call.name !== 'write') throw new Error('Pi durable tool call was not write');
  const argumentKeys = Object.keys(call.arguments).sort();
  if (argumentKeys.length !== 2 || argumentKeys[0] !== 'content' || argumentKeys[1] !== 'path') {
    throw new Error('Pi durable write arguments did not contain exactly path/content');
  }
  if (call.arguments.path !== SMOKE_FILE || call.arguments.content !== SMOKE_CONTENT) {
    throw new Error('Pi durable write arguments did not match the exact smoke target/content');
  }
  if (result.id !== call.id || result.name !== 'write' || result.isError !== false) {
    throw new Error('Pi durable tool result did not match the successful write call');
  }

  if (evidence.assistantIdentities.length === 0) {
    throw new Error('Pi write smoke exposed no assistant provider/model identity');
  }
  if (evidence.assistantIdentities.some((identity) => identity.provider !== CANONICAL_PROVIDER || identity.model !== CANONICAL_MODEL)) {
    throw new Error('Pi write-smoke observed provider/model identity drifted');
  }

  if (evidence.starts.length > 1 || evidence.ends.length > 1) {
    throw new Error('Pi optional execution events exceeded the single durable write action');
  }
  for (const start of evidence.starts) {
    if (start.id !== call.id || start.name !== 'write') {
      throw new Error('Pi optional tool start contradicted the durable write proof');
    }
  }
  for (const end of evidence.ends) {
    if (end.id !== call.id || end.name !== 'write' || end.isError) {
      throw new Error('Pi optional tool end contradicted the durable write proof');
    }
  }

  return evidence;
}

`,
    'durable Pi message lifecycle proof',
  );

  source = replaceSection(
    source,
    `  const syntheticWrite = [
    JSON.stringify({ type: 'message_end', message: { role: 'assistant', provider: CANONICAL_PROVIDER, model: CANONICAL_MODEL, content: [{ type: 'toolCall', name: 'write' }] } }),
    JSON.stringify({ type: 'tool_execution_start', toolCallId: 'call-1', toolName: 'write', args: { path: SMOKE_FILE } }),
    JSON.stringify({ type: 'tool_execution_end', toolCallId: 'call-1', toolName: 'write', result: {}, isError: false }),
  ].join('\\n');
`,
    `  const temp = mkdtempSync(join(tmpdir(), 'delethos-r181-selftest-'));`,
    `  const syntheticAssistant = JSON.stringify({
    type: 'message_end',
    message: {
      role: 'assistant',
      provider: CANONICAL_PROVIDER,
      model: CANONICAL_MODEL,
      content: [{
        type: 'toolCall',
        id: 'call-1',
        name: 'write',
        arguments: { path: SMOKE_FILE, content: SMOKE_CONTENT },
      }],
    },
  });
  const syntheticResult = JSON.stringify({
    type: 'message_end',
    message: {
      role: 'toolResult',
      toolCallId: 'call-1',
      toolName: 'write',
      content: [{ type: 'text', text: 'ok' }],
      isError: false,
      timestamp: 1,
    },
  });
  const syntheticWrite = [syntheticAssistant, syntheticResult].join('\\n');
  requireExactPiWriteEvidence(syntheticWrite);
  requireExactPiWriteEvidence([
    syntheticAssistant,
    JSON.stringify({ type: 'tool_execution_start', toolCallId: 'call-1', toolName: 'write', args: { path: SMOKE_FILE, content: SMOKE_CONTENT } }),
    JSON.stringify({ type: 'tool_execution_end', toolCallId: 'call-1', toolName: 'write', result: {}, isError: false }),
    syntheticResult,
  ].join('\\n'));

  const invalidPiEvidence = [
    '',
    `${syntheticAssistant}\\n${syntheticAssistant}\\n${syntheticResult}`,
    syntheticWrite.replace('"name":"write"', '"name":"read"'),
    syntheticWrite.replace(`"path":"${SMOKE_FILE}"`, '"path":"wrong.txt"'),
    syntheticWrite.replace('DELETHOS_R181_OK\\\\n', 'WRONG\\\\n'),
    syntheticWrite.replace('"content":"DELETHOS_R181_OK\\\\n"', '"content":"DELETHOS_R181_OK\\\\n","extra":"x"'),
    syntheticWrite.replace('"toolCallId":"call-1"', '"toolCallId":"call-2"'),
    syntheticWrite.replace('"toolName":"write"', '"toolName":"read"'),
    syntheticWrite.replace('"isError":false', '"isError":true'),
    `${syntheticWrite}\\n${syntheticResult}`,
    `${syntheticWrite}\\nnot-json`,
    syntheticWrite.replace(`"provider":"${CANONICAL_PROVIDER}"`, '"provider":"unexpected-provider"'),
    `${syntheticWrite}\\n${JSON.stringify({ type: 'tool_execution_start', toolCallId: 'call-2', toolName: 'write', args: {} })}`,
    `${syntheticWrite}\\n${JSON.stringify({ type: 'tool_execution_end', toolCallId: 'call-1', toolName: 'write', result: {}, isError: true })}`,
  ];
  for (const invalid of invalidPiEvidence) {
    let rejected = false;
    try { requireExactPiWriteEvidence(invalid); } catch { rejected = true; }
    if (!rejected) throw new Error('Pi durable tool-evidence fail-closed self-test failed');
  }

  const canonicalTagLine = `${RUNTIME_COMMIT}\\trefs/tags/${RUNTIME_RELEASE}\\n`;
  if (parseRuntimeTagRef(canonicalTagLine) !== RUNTIME_COMMIT) throw new Error('runtime tag parser positive self-test failed');
  for (const invalid of [
    '',
    canonicalTagLine + canonicalTagLine,
    canonicalTagLine.replace(RUNTIME_COMMIT, '0'.repeat(40)),
    canonicalTagLine.replace(`refs/tags/${RUNTIME_RELEASE}`, `refs/tags/${RUNTIME_RELEASE}-wrong`),
    canonicalTagLine.replace('\\t', ' '),
  ]) {
    let rejected = false;
    try { parseRuntimeTagRef(invalid); } catch { rejected = true; }
    if (!rejected) throw new Error('runtime tag parser fail-closed self-test failed');
  }

  const canonicalAssetEntry = `<li><a href="/ggml-org/llama.cpp/releases/download/${RUNTIME_RELEASE}/${selected.runtimeAsset}">${selected.runtimeAsset}</a><span>sha256:${selected.runtimeSha256}</span></li>`;
  if (parseReleaseAssetDigestHtml(canonicalAssetEntry, selected.runtimeAsset, selected.runtimeSha256) !== selected.runtimeSha256) {
    throw new Error('runtime release metadata parser positive self-test failed');
  }
  const wrongDigest = '0'.repeat(64) === selected.runtimeSha256 ? '1'.repeat(64) : '0'.repeat(64);
  for (const invalid of [
    '',
    canonicalAssetEntry + canonicalAssetEntry,
    canonicalAssetEntry.replace(selected.runtimeSha256, wrongDigest),
    canonicalAssetEntry.replace(selected.runtimeAsset, `${selected.runtimeAsset}.wrong`),
    canonicalAssetEntry.replace(`sha256:${selected.runtimeSha256}`, ''),
  ]) {
    let rejected = false;
    try { parseReleaseAssetDigestHtml(invalid, selected.runtimeAsset, selected.runtimeSha256); } catch { rejected = true; }
    if (!rejected) throw new Error('runtime release metadata parser fail-closed self-test failed');
  }

  const temp = mkdtempSync(join(tmpdir(), 'delethos-r181-selftest-'));`,
    'Amendment 013 deterministic parser self-tests',
  );

  source = replaceOnce(
    source,
    `    const tag = await fetchJson(` + "`https://api.github.com/repos/ggml-org/llama.cpp/git/ref/tags/${RUNTIME_RELEASE}`" + `);
    if (tag?.object?.type !== 'commit' || tag?.object?.sha !== RUNTIME_COMMIT) {
      throw new Error('runtime tag did not resolve directly to the pinned commit');
    }
    mark(record, 'runtime_tag_commit_exact');

    const release = await fetchJson(` + "`https://api.github.com/repos/ggml-org/llama.cpp/releases/tags/${RUNTIME_RELEASE}`" + `);
    const runtimeAssets = Array.isArray(release?.assets) ? release.assets.filter((asset) => asset?.name === selected.runtimeAsset) : [];
    if (runtimeAssets.length !== 1 || runtimeAssets[0]?.digest !== ` + "`sha256:${selected.runtimeSha256}`" + `) {
      throw new Error('runtime release asset metadata digest did not match the pinned digest');
    }
    mark(record, 'runtime_release_asset_digest_metadata_exact');
`,
    `    if (resolveRuntimeTagCommit() !== RUNTIME_COMMIT) {
      throw new Error('runtime public tag provenance did not resolve to the pinned commit');
    }
    mark(record, 'runtime_tag_commit_exact');

    const publicAssetDigest = await fetchPublicReleaseAssetDigest(selected.runtimeAsset, selected.runtimeSha256);
    if (publicAssetDigest !== selected.runtimeSha256) {
      throw new Error('runtime public release-asset metadata digest did not match the pinned digest');
    }
    mark(record, 'runtime_release_asset_public_metadata_exact');
`,
    'Amendment 013 canonical provenance execution',
  );

  return source;
}

const checkoutSource = readFileSync(IMPLEMENTATION_PATH, 'utf8');
const canonicalSource = checkoutSource.replace(/\r\n/g, '\n');
if (canonicalSource.includes('\r')) throw new Error('R181 canonical implementation contained unsupported carriage returns');
if (gitBlobSha(canonicalSource) !== EXPECTED_BASE_BLOB) {
  throw new Error('R181 canonical implementation blob drifted from the Amendment 013 base');
}

let candidateSource = applyAmendment010(canonicalSource);
candidateSource = applyAmendment013(candidateSource);
const candidateBlob = gitBlobSha(candidateSource);

const tempRoot = mkdtempSync(join(resolve(process.env.RUNNER_TEMP || tmpdir()), 'delethos-r181-am013-'));
const tempScripts = join(tempRoot, 'scripts');
mkdirSync(tempScripts, { recursive: false });
const tempImplementation = join(tempScripts, 'recovery-provider-prereq-impl.mjs');

try {
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
  writeFileSync(tempImplementation, candidateSource, { flag: 'wx' });

  if (process.argv.length === 3 && process.argv[2] === '--self-test') {
    console.log(JSON.stringify({
      source: 'DETERMINISTIC_R181_AMENDMENT_013_SHAPING',
      outcome: 'PASS',
      base_blob: EXPECTED_BASE_BLOB,
      candidate_blob: candidateBlob,
      runtime_provenance: 'git-ls-remote+github-expanded-assets',
      pi_evidence: 'durable-message-end',
    }));
  }

  const child = spawnSync(process.execPath, [tempImplementation, ...process.argv.slice(2)], {
    cwd: REPO_ROOT,
    env: process.env,
    stdio: 'inherit',
    shell: false,
  });
  if (child.error) throw child.error;
  if (child.status !== 0) process.exitCode = child.status ?? 1;
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
