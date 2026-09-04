# Specification 003 Amendment 015 — R181 Pi First-Request Tool Choice and One New Bounded Attempt

**Status:** `PROPOSED` until this amendment is independently qualified and merged to canonical `main`.  
**Task:** `D003-R181` repair/re-execution authority only.  
**Exact proposal base:** `b8776ddab2a92256ca98ab6a6cf53e732e36815e`.  
**Consumed Amendment 014 execution:** workflow run `33877530134`, exact trigger commit `b8776ddab2a92256ca98ab6a6cf53e732e36815e`.

## Purpose

Amendment 014 repaired release-asset provenance and authorized exactly one new same-tree canonical R181 execution after full implementation qualification. That attempt was consumed by exact commit message `[provider-prereq]` at `b8776ddab2a92256ca98ab6a6cf53e732e36815e` and must never be rerun into PASS.

The Amendment 014 attempt advanced substantially farther than every prior R181 attempt. Linux/x64, macOS/arm64, and Windows/x64 all independently passed the same prerequisite chain through Pi completion identity and exact write-only tool availability, then failed at the same Pi write-smoke fact:

```text
failed_at = pi_bounded_tool_write_smoke
failure_reason = Pi write smoke required exactly one durable tool call/result; observed calls=0 results=0
```

Before that failure, all three platform jobs independently reported PASS for:

```text
runtime_tag_commit_exact
runtime_release_asset_public_binding_exact
runtime_archive_digest_exact
runtime_version_exact
model_manifest_sha_exact
model_blob_digest_exact
model_blob_magic_exact
server_started_loopback_only
pi_version_exact
pi_provider_config_exact
pi_completion_requested_identity_exact
pi_completion_observed_identity_exact
pi_completion_nonempty
pi_tool_allowlist_exact_write_only
```

The provider execution stopped at Pi write-smoke on every platform. OpenCode execution and the later final repository-invariant facts were not reached, so their absent/false terminal record values are not independent OpenCode or repository-integrity failures.

This amendment records that exact cross-platform behavioral failure and authorizes only a narrow Pi write-smoke request-shaping repair. It does not mark R181 complete, does not authorize R190, and does not authorize a rerun of workflow `33877530134`.

## Failure interpretation

The canonical machine evidence establishes all of the following:

1. The pinned Pi executable `0.84.4` starts and reports the exact expected identity on every required platform.
2. The canonical local provider/model selection is requested and observed correctly.
3. Anonymous ordinary completion succeeds.
4. The Pi write-smoke invocation exposes exactly the `write` tool and no other tool.
5. The write-smoke prompt and allowlist alone do not compel this local model to emit a tool call: all three platforms observed zero durable ToolCall/ToolResult pairs.
6. Because the same failure occurred on Linux/x64, macOS/arm64, and Windows/x64 after the same preceding PASS facts, this is treated as a reproducible bounded behavioral gap, not as a platform-specific infrastructure error.

The Amendment 014 attempt is consumed regardless of this diagnosis. No rerun, retry, matrix subset retry, or job retry is authorized.

## Preserved canonical identities

This amendment changes no selected runtime, runtime asset, model, provider, CLI version, digest, URL, permission, or Gold criterion.

```text
runtime_release = b10621
runtime_commit = c1d0e7a004015f23bc0233470b747b596f29b264
model_revision = 2ab9f8f42af02fc212effaef7c4850c885e965f4
model_file = qwen2.5-coder-1.5b-instruct-q4_k_m.gguf
model_sha256 = cc324af070c2ecbfd324a30884d2f951a7ff756aba85cb811a6ec436933bb046
provider_id = delethos-local-llama
model_id = delethos-qwen25-coder-1.5b-q4km
pi = 0.84.4
opencode = 1.18.26
```

All canonical platform runtime archive SHA-256 pins from Amendments 014 and earlier remain unchanged.

## Why persistent model-level forcing remains prohibited

Amendment 010 already machine-observed that persistent model-level `samplingParams: { tool_choice: 'required' }` is not a valid solution. It remains active after the write ToolResult and can force another tool call instead of allowing the agent to terminate naturally, producing a repeated-tool lifecycle/timeout failure.

Therefore this amendment does **not** authorize restoring persistent model-level `samplingParams`, changing the canonical Pi model config, or applying `tool_choice = required` to every provider request.

The only newly authorized forcing is request-local and first-request-only for the isolated Pi write-smoke process described below.

## Exact pinned Pi source basis

The repair design is based on the already attested Pi source for the canonical executable:

```text
package = @mariozechner/pi-coding-agent@0.84.4
source repository = earendil-works/pi
source commit = b79e4cc834970cca69daebffab7df1da7d1e52c4
source archive sha256 = c690630392508f0da5220b22e3b1ee4c4d6d9b17fa28b1a6f6b367c618c04cc8
package sha256 = f3330b620ced8225461000610b07b2b018faa377894ec6ab9b206a5f45165a17
```

At that exact source commit:

- `packages/coding-agent/src/core/extensions/types.ts` defines `before_provider_request` as an extension event fired before a provider request and allows the handler to return a replacement payload;
- `packages/coding-agent/src/core/extensions/runner.ts` chains `before_provider_request` handlers and uses any non-`undefined` handler return as the new current payload;
- `packages/ai/src/api/openai-completions.ts` builds the OpenAI-compatible request params, then invokes `options.onPayload(params, model)` immediately before the provider request and uses the returned replacement payload;
- the same OpenAI-completions implementation supports top-level `tool_choice` in the provider request;
- `packages/coding-agent/src/cli/args.ts` supports explicit temporary extension loading with `--extension` / `-e`;
- `packages/coding-agent/src/core/resource-loader.ts` preserves explicit CLI extension paths even when `--no-extensions` is set, so auto-discovered extensions can remain disabled while exactly one explicitly supplied temporary extension is loaded.

These source facts provide a native Pi request-shaping route. A new loopback proxy, provider URL, provider registration, package patch, or forked Pi binary is not authorized or necessary under this amendment.

## Revised Pi write-smoke contract

The existing isolated write-smoke invocation remains the canonical basis:

```text
mode = json
no_session = true
no_extensions = true for auto-discovery
no_skills = true
no_prompt_templates = true
no_themes = true
no_context_files = true
no_approve = true
tools = exactly [write]
provider = delethos-local-llama
model = delethos-qwen25-coder-1.5b-q4km
```

For the Pi write-smoke process only, the repair may additionally create one runner-temporary extension file and pass it with exactly one explicit `--extension <absolute-temp-path>` argument while retaining `--no-extensions`. The explicit extension is allowed only because the pinned Pi resource loader treats CLI extension paths as the only extension set when `noExtensions` is true.

The temporary extension must register only `before_provider_request`. It must not register tools, providers, commands, shortcuts, flags, UI behavior, message transforms, filesystem tools, network clients, or any other extension behavior.

### First provider request

For request index 1, and only after exact payload validation, the extension may return a copy of the canonical OpenAI-compatible payload with:

```text
tool_choice = required
```

Before applying that field, the handler must prove at minimum:

- payload is a plain object;
- `model` equals `delethos-qwen25-coder-1.5b-q4km`;
- the payload contains exactly one available tool;
- that tool is the canonical `write` function and no other tool is present;
- no incoming `tool_choice` is already present;
- request state is exactly the first provider request for this isolated write-smoke process.

The extension may not alter messages, model, temperature, token limits, provider URL, headers, API key posture, tool schema, tool arguments, or any other payload field.

### Provider request after the successful write ToolResult

For request index 2, the extension must be pass-through only. It must prove that no incoming `tool_choice` is present and must return the payload unchanged. This preserves the Amendment 010 natural-exit posture: the second assistant response is not forced to call any tool.

The extension must also verify that the second request is a continuation after exactly one write tool result in the conversation context. It must not silently remove an unexpected persistent `tool_choice`; observing one is a fail-closed drift condition.

### Unexpected request state

A third provider request, a malformed payload, wrong model, missing/extra/wrong tool, pre-existing `tool_choice`, missing expected write-tool-result continuation, or any other sequence/shape contradiction is a fail-closed R181 failure.

Because Pi's extension runner records handler exceptions rather than treating an exception alone as a guaranteed provider-request block, the implementation must not rely on an uncaught extension exception as its sole safety mechanism. An invalid state must synchronously request agent abort through the extension context and must ensure no widened or credential-bearing request is created. Deterministic tests must exercise this fail-closed path.

No external endpoint is authorized by this extension. All provider traffic remains bound to the existing canonical loopback llama.cpp server.

## Request-shaping audit evidence

The temporary extension may write one bounded audit file under the existing runner-temporary qualification root. The audit is conformance evidence only and must contain no prompt text, model output, headers, secrets, paths outside the qualification root, or arbitrary provider payloads.

The accepted successful audit shape is exactly two ordered request records:

```text
request 1:
  model = canonical model
  tool_count = 1
  tool_name = write
  incoming_tool_choice = absent
  outgoing_tool_choice = required

request 2:
  model = canonical model
  tool_count = 1
  tool_name = write
  incoming_tool_choice = absent
  outgoing_tool_choice = absent
  follows_successful_write_result = true
```

Any missing record, duplicate record, third record, contradictory field, widened tool list, or noncanonical model is FAIL.

The machine record may add a narrowly named required fact such as:

```text
pi_first_request_tool_choice_exact = true
```

only after the actual write-smoke process and audit prove the exact first-request-only sequence. Deterministic shaping tests alone must not mark this runtime fact true.

## Durable write evidence remains mandatory

The Amendment 013 durable Pi evidence contract is unchanged. R181 PASS still requires exactly one durable assistant ToolCall and exactly one matching successful ToolResult for `write`, with exact smoke path/content, canonical provider/model identity, no contradictory execution events, and exact fixture integrity.

The temporary request-shaping extension is not itself proof that a write happened. A request audit without the durable ToolCall/ToolResult pair is FAIL.

The existing natural-exit requirement also remains unchanged: after the exact write succeeds, Pi must settle normally within the bounded grace. Cancellation, repeated tool use, timeout, malformed JSONL, or provider failure remains FAIL.

## Deterministic repair self-tests

Before any new provider execution, deterministic self-tests must prove at minimum:

- the request shaper accepts a canonical first payload with exactly the write tool and injects exactly `tool_choice = required`;
- it changes no other first-request field;
- the canonical second payload after exactly one successful write ToolResult is returned unchanged with `tool_choice` absent;
- first-request forcing cannot persist into the second request;
- missing, malformed, array, wrong-model, no-tool, multiple-tool, wrong-tool, pre-forced, wrong-continuation, and third-request cases fail closed;
- the fail-closed runtime handler requests abort rather than relying only on an exception swallowed by the extension runner;
- the generated extension registers only `before_provider_request`;
- the Pi write-smoke plan retains `--no-extensions` and adds exactly one explicit `--extension` absolute path;
- completion-only Pi conformance remains extension-free and behaviorally unchanged;
- the write-smoke plan still contains exactly `--tools write` and no bash, PowerShell, read, edit, grep, find, ls, or other tool;
- the extension path and audit path are runner-temporary and not repository paths;
- persistent model-level `samplingParams` remains absent;
- all Amendment 013/014 public provenance, archive integrity, executable identity, model integrity, loopback/no-auth, Pi durable evidence, natural-exit, OpenCode policy, and repository-invariant deterministic tests remain passing;
- workflow trigger, runner matrix, permissions, repository/ref guard, and credential posture remain unchanged.

These self-tests are shaping evidence only and do not complete R181.

## Exact implementation authority

Only after this amendment becomes canonical may one bounded implementation repair PR modify:

```text
scripts/recovery-provider-prereq.mjs
```

No other repository path is authorized by Amendment 015 unless an independent substantive review finding proves that the one-file repair is impossible while preserving the contract; such a finding would require a new docs-only authority decision before broadening scope.

The wrapper may generate the temporary Pi extension and audit file under runner temporary storage and may shape only the Pi write-smoke invocation as described above. `packages/adapters/src/pi.ts`, `scripts/recovery-provider-prereq-impl.mjs`, `.github/workflows/ci.yml`, package manifests/lockfiles, runtime/model URLs, provider configuration, Pi/OpenCode pins, and production code remain unchanged.

No new production dependency is authorized.

## Implementation qualification gate

The Amendment 015 implementation repair must, on one exact head:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. preserve exact canonical runtime/model/provider/CLI pins and download URLs;
3. preserve the exact workflow and provider trigger predicate;
4. keep all provider/Gold/real-agent execution skipped on pull-request code;
5. pass deterministic CI on Linux, macOS, and Windows;
6. pass all pre-install and post-install R181 deterministic self-tests on every required platform;
7. prove the generated extension is explicit-only under `--no-extensions` and first-request-only in its forcing semantics;
8. receive a fresh independent substantive semantic review of that exact final head;
9. reconcile every substantive finding and leave zero unresolved substantive review threads;
10. verify exact base/head/tree/scope/checks/reviews/threads/mergeability immediately before merge;
11. merge only with expected-head protection;
12. pass canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped.

Unavailable, skipped, stale-head, rate-limited, billing-blocked, summary-only, or self-review output is not independent review PASS.

## One new bounded re-execution authority

If and only if this amendment is canonical and every implementation qualification gate above is proven on canonical `main`, Amendment 015 authorizes exactly one new same-tree canonical R181 execution.

The new trigger commit must:

- have exactly the already-qualified canonical implementation tree;
- change no repository content;
- have complete commit message exactly `[provider-prereq]` and nothing else;
- be created only after canonical post-merge deterministic Linux/macOS/Windows PASS;
- preserve canonical-main/repository/no-secret/`contents: read` workflow boundaries.

The Amendment 015 attempt is consumed when triggered regardless of PASS, FAIL, infrastructure error, cancellation, or unavailable result. Run `33877530134` and every earlier R181 run remain immutable historical evidence and must not be rerun.

## Success and continuation boundary

`D003-R181` becomes complete only if the one Amendment 015-authorized execution independently emits, on Linux/x64, macOS/arm64, and Windows/x64:

```text
schema = delethos.spec003.r181-provider-prereq.v1
outcome = PASS
all REQUIRED_FACTS = true
```

including exact first-request-only Pi forcing evidence, exactly one durable Pi write ToolCall/ToolResult, natural exit, OpenCode facts, and all final repository/Git invariants.

If any required platform fails or any required fact is missing, false, malformed, contradictory, or unavailable:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

and no additional R181 attempt is authorized without another new bounded canonical amendment.

Only after full three-platform R181 PASS may canonical authority be re-read for `D003-R190` in task order.

## Non-authority

This amendment does not authorize:

- rerunning workflow `33877530134` or any earlier R181 job;
- changing any canonical runtime, asset, archive SHA-256, model, model SHA-256, provider, Pi, or OpenCode pin;
- changing runtime/model download URLs;
- restoring persistent model-level `tool_choice = required` or model `samplingParams`;
- forcing the second or any later Pi provider request;
- widening the Pi tool allowlist beyond exactly `write`;
- changing the Pi write target/content;
- changing Pi completion semantics outside the isolated write-smoke process;
- a loopback proxy, remote proxy, provider re-registration, forked Pi binary, package patch, or alternate Pi package;
- secrets, tokens, credentials, paid APIs, or stored authentication;
- workflow permission/event/ref/repository/matrix/runner changes;
- changing OpenCode permissions/provider policy;
- weakening durable Pi ToolCall/ToolResult or natural-exit evidence;
- Gold promotion;
- D003-R190/R200/R210/R211/R212 execution before R181 passes;
- Specification 003 closeout;
- Specification 004.

## Governance qualification for this amendment

This docs-only amendment PR must itself:

- be based on exact canonical `main` `b8776ddab2a92256ca98ab6a6cf53e732e36815e` unless canonical `main` moves before qualification, in which case authority must be re-read before merge;
- change only this amendment document unless an independent substantive finding requires a bounded Specification 003 documentation correction;
- pass deterministic Linux/macOS/Windows CI on its exact final head;
- keep provider/Gold/real-agent execution skipped;
- receive a fresh independent substantive semantic review on that exact final head;
- reconcile every substantive finding and leave zero unresolved substantive review threads;
- verify exact base/head/scope/checks/reviews/threads/mergeability immediately before merge;
- merge only with expected-head protection;
- pass canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
- re-read canonical authority before any implementation repair begins.

No provider execution is authorized by this proposal or by its merge alone.
