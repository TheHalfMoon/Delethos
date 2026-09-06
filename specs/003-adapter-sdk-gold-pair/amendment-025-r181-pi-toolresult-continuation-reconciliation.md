# Specification 003 Amendment 025 — R181 Pi Canonical ToolResult Continuation Reconciliation and One New Bounded Attempt

**Status:** `PROPOSED` until independently qualified and merged to canonical `main`.  
**Task:** `D003-R181` repair/re-execution authority only.  
**Exact proposal base:** `cb5b173616e03820e1c9226504abaf7cd76b0090`.  
**Consumed Amendment 024 execution:** workflow run `34065206452`, exact trigger commit `cb5b173616e03820e1c9226504abaf7cd76b0090`, exact tree `6411ac838e7b9a047219dcc842958fc0051e5a54`.

## Purpose

Amendment 024 replaced the retired R181 model baseline with the bounded Qwen2.5 1.5B Instruct baseline, completed exact-head implementation qualification, and authorized exactly one new same-tree canonical R181 execution. That execution was consumed by complete commit message `[provider-prereq]` at `cb5b173616e03820e1c9226504abaf7cd76b0090` and must never be rerun, retried, or selectively replayed.

Workflow run `34065206452` kept deterministic core CI green on Linux, macOS, and Windows, while the provider-prerequisite matrix failed on all three required platforms at the same exact fact:

```text
outcome = FAIL
failed_at = pi_first_request_tool_choice_exact
failure_reason = unclassified_internal_failure
```

Exact provider jobs:

```text
linux/x64   = 101572644602
macos/arm64 = 101572644538
windows/x64 = 101572644623
```

Every platform independently proved the canonical runtime/model/server chain, the Amendment 016 direct forced-tool witness, the real Pi first-request shaper witness, and the durable Pi write smoke before the full two-record continuation audit failed:

```text
runtime_tag_commit_exact = true
runtime_release_asset_public_binding_exact = true
runtime_archive_digest_exact = true
runtime_executable_contained_unique = true
runtime_executable_identity_exact = true
model_digest_exact = true
server_loopback_only = true
server_no_auth_required = true
server_models_endpoint_contains_exact_alias = true
server_chat_template_exact_pinned_qwen = true
server_chat_template_supports_tools = true
server_chat_template_supports_tool_calls = true
anonymous_nonempty_model_completion = true
llama_forced_tool_stream_witness_exact = true
pi_cli_version_exact_0_84_4 = true
pi_requested_identity_exact = true
pi_observed_identity_exact = true
pi_nonempty_completion = true
pi_tool_allowlist_exact_write_only = true
pi_first_request_shaper_witness_exact = true
pi_bounded_tool_write_smoke = true
pi_first_request_tool_choice_exact = false
```

OpenCode and the final repository-invariant facts were not reached and are not independently interpreted as OpenCode or repository-integrity failures.

This amendment records the exact source-confirmed continuation-validator mismatch that explains the new boundary. It authorizes only the narrow wrapper repair required to recognize the canonical successful Pi `write` ToolResult on request 2 while preserving every existing first-request-only forcing, durable-write, natural-exit, fail-closed, provider, permission, and Gold requirement.

It does not convert run `34065206452` into PASS, does not authorize `D003-R190`, and does not authorize a rerun of any consumed R181 workflow.

## Preserved canonical identities

No runtime, provider, model, CLI, archive, digest, URL, prompt, template, timeout, permission, workflow, or Gold identity changes under this amendment.

```text
provider_strategy_id = delethos-local-llama-qwen25-instruct
runtime_release = b10621
runtime_commit = c1d0e7a004015f23bc0233470b747b596f29b264
model_repository = Qwen/Qwen2.5-1.5B-Instruct-GGUF
model_revision = a615a81362316d7b9f5a7a9c4313adfdf9b54588
model_file = qwen2.5-1.5b-instruct-q4_k_m.gguf
model_sha256 = 6a1a2eb6d15622bf3c96857206351ba97e1af16c30d7a74ee38970e434e9407e
provider_id = delethos-local-llama
model_id = delethos-qwen25-instruct-1.5b-q4km
pi = 0.84.4
opencode = 1.18.26
smoke_file = delethos-r181-smoke.txt
smoke_content = DELETHOS_R181_OK\n
```

The canonical llama.cpp release assets/platform SHA-256 pins, Amendment 020 pinned chat template, Amendment 023 Layer-A prompt and prompt SHA-256, `stream = true`, first-request `tool_choice = required`, later-request unforced semantics, `parallel_tool_calls = false`, `temperature = 0`, `max_tokens = 2048`, and Layer-A request timeout `300000 ms` remain unchanged.

## Exact pinned Pi source reconciliation

The canonical Pi source basis remains the already-attested source used by Amendments 015 and 016:

```text
package = @mariozechner/pi-coding-agent@0.84.4
source_repository = earendil-works/pi
source_commit = b79e4cc834970cca69daebffab7df1da7d1e52c4
source_archive_sha256 = c690630392508f0da5220b22e3b1ee4c4d6d9b17fa28b1a6f6b367c618c04cc8
package_sha256 = f3330b620ced8225461000610b07b2b018faa377894ec6ab9b206a5f45165a17
```

At that exact source commit, `packages/coding-agent/src/core/tools/write.ts` implements a successful `write` result as one text block:

```text
Successfully wrote ${content.length} bytes to ${path}
```

For the exact R181 smoke content:

```text
DELETHOS_R181_OK\n
```

UTF-8 byte length is exactly:

```text
17
```

Therefore the canonical successful Pi write ToolResult text for this fixture is exactly:

```text
Successfully wrote 17 bytes to delethos-r181-smoke.txt
```

At the same pinned source commit, `packages/ai/src/api/openai-completions.ts` transforms a canonical internal `toolResult` message into an OpenAI-compatible `role = tool` message by concatenating its text content blocks and assigning that resulting text to `content`, preserving the matching `tool_call_id`.

The current Amendment 015-generated request shaper, however, defines its second-request success literal as:

```text
Successfully wrote to delethos-r181-smoke.txt
```

and `followsSuccessfulWriteResult(...)` requires exact equality against that literal before it records request 2 and returns the second provider payload unchanged.

The current literal therefore cannot equal the exact canonical successful Pi `write` output for the R181 fixture. The validator correctly fails closed, but it fails closed on the valid canonical continuation. This is a conformance-harness mismatch, not evidence that the durable write failed: run `34065206452` independently proved `pi_bounded_tool_write_smoke = true` on all three required platforms.

## Repair principle

The repair is **exact canonical ToolResult continuation binding only**.

The existing request-2 validator must continue to require:

- a plain canonical provider payload;
- exact canonical model identity;
- exactly one available `write` tool and no other tool;
- no incoming `tool_choice`;
- exactly one prior assistant `write` tool call with a non-empty call ID;
- exactly one matching `role = tool` result after that assistant call;
- exact matching `tool_call_id`;
- exact canonical successful write-result text;
- no malformed message/tool-call state;
- request index exactly 2;
- unchanged second-request payload returned without adding or removing any field.

Only the exact canonical success-text expectation is repaired.

The wrapper should derive the expected result from the already-canonical smoke constants rather than introduce a second independent numeric source of truth:

```text
expected_write_result =
  "Successfully wrote "
  + Buffer.byteLength(SMOKE_CONTENT, "utf8")
  + " bytes to "
  + SMOKE_FILE
```

For the canonical constants this must deterministically equal:

```text
Successfully wrote 17 bytes to delethos-r181-smoke.txt
```

The old value without the byte count must be rejected.

## First-request and second-request semantics remain unchanged

Amendment 015 first-request-only forcing remains fully active and unchanged.

Request 1 may add exactly:

```text
tool_choice = required
```

only after the existing exact payload/model/write-only validations pass.

Request 2 remains strictly unforced pass-through. This amendment does not authorize setting `tool_choice` on request 2, persistent model-level `samplingParams`, removal of `tool_choice`, message rewriting, tool-result rewriting, or synthesizing any continuation record.

The successful request-shaping audit remains exactly two ordered runtime records. The existing meanings remain unchanged:

```text
pi_first_request_shaper_witness_exact = true
```

proves only the exact real first-request shaper record.

```text
pi_first_request_tool_choice_exact = true
```

may be marked only after the actual canonical request-2 continuation is observed and the full exact two-record audit validates.

The durable Pi ToolCall/ToolResult and smoke-file evidence remain independent mandatory facts and must not be inferred from the request-shaping audit.

## Fail-closed requirements

The repaired continuation validator must reject at minimum:

- the legacy incorrect text `Successfully wrote to delethos-r181-smoke.txt`;
- wrong byte count;
- wrong path;
- wrong tool-call ID;
- missing or extra assistant tool calls;
- missing or extra tool results;
- wrong tool name;
- malformed assistant/tool messages;
- result before assistant tool call;
- pre-existing incoming `tool_choice`;
- multiple tools or any non-`write` tool;
- third or later provider request;
- widened model/provider/tool authority.

Failure must continue to request Pi abort through the existing extension context. The repair must not rely on an exception alone when the extension runner may record and continue after handler exceptions.

## Deterministic implementation self-tests

Before any new provider execution, deterministic self-tests must prove at minimum:

1. canonical `SMOKE_CONTENT` is exactly 17 UTF-8 bytes;
2. the generated exact continuation success text is exactly `Successfully wrote 17 bytes to delethos-r181-smoke.txt`;
3. the canonical second payload containing that exact ToolResult is accepted and returned by identity with `tool_choice` absent;
4. the legacy incorrect continuation text is rejected fail closed;
5. wrong byte count, wrong path, wrong call ID, missing/extra result, malformed message/tool call, wrong ordering, and third-request cases are rejected fail closed;
6. request 1 still changes only `tool_choice` from absent to `required`;
7. request 2 remains unchanged and unforced;
8. the full two-record audit remains mandatory for `pi_first_request_tool_choice_exact`;
9. the first-record-only diagnostic cannot satisfy the full audit;
10. exactly one durable Pi write ToolCall/ToolResult remains mandatory and unchanged;
11. exact smoke file/content and repository/Git invariant checks remain unchanged;
12. completion-only Pi conformance remains extension-free;
13. the write-smoke invocation remains `--tools write` only and explicit-extension-only under `--no-extensions`;
14. persistent model-level `samplingParams` remains absent;
15. the Amendment 016 Layer-A forced-tool streaming witness and Layer-B shaper witness remain unchanged;
16. the Amendment 024 model identity and temporary OpenCode qualification bridge remain unchanged;
17. provider/Gold/real-agent jobs remain skipped on pull-request code;
18. all existing deterministic R181 safety-shaping tests continue to pass.

These deterministic tests are qualification evidence only and do not complete R181.

## Exact implementation authority

Only after this amendment becomes canonical may one bounded implementation repair PR modify:

```text
scripts/recovery-provider-prereq.mjs
```

No other repository path is authorized by Amendment 025 unless a fresh independent substantive review finding proves the one-file wrapper repair impossible while preserving this contract. Such a finding would require another docs-only canonical authority decision before scope broadens.

The implementation may only repair the generated Pi request-2 successful ToolResult expectation and the deterministic self-tests needed to bind that expectation to the pinned Pi source semantics.

The following remain unauthorized for modification under Amendment 025:

```text
scripts/recovery-provider-prereq-impl.mjs
.github/workflows/ci.yml
packages/adapters/src/pi.ts
packages/adapters/src/opencode.ts
packages/runtime/**
package.json
pnpm-lock.yaml
runtime/model/provider URLs or pins
Pi/OpenCode versions
production adapters
Gold criteria
```

No production dependency is authorized.

## Implementation qualification gate

The Amendment 025 implementation repair must, on one exact final head:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. preserve all canonical runtime/model/provider/Pi/OpenCode identities, digests, URLs, prompt/template and timeout bounds;
3. preserve exact workflow trigger semantics, runner matrix, permissions, repository/ref guards, and no-secret posture;
4. keep provider/Gold/real-agent execution skipped on pull-request code;
5. pass deterministic CI on Linux, macOS, and Windows;
6. pass pre-install and post-install R181 deterministic self-tests on every required platform;
7. prove the old result text is rejected and the exact canonical byte-counted Pi result is accepted only in the exact request-2 continuation state;
8. preserve first-request-only forcing and second-request unforced pass-through;
9. preserve every Amendment 016/020/021/022/023/024 fail-closed discriminator and invariant;
10. receive a fresh independent substantive semantic, security, licensing, and governance review of that exact final head;
11. reconcile every substantive finding and leave zero unresolved substantive review threads;
12. immediately revalidate exact base/head/tree/scope/checks/reviews/threads/mergeability before merge;
13. merge only with expected-head protection;
14. pass canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
15. re-read canonical authority before creating any provider trigger commit.

Unavailable, skipped, stale-head, rate-limited, billing-blocked, summary-only, or self-review output is not independent substantive review PASS.

## One new bounded R181 execution authority

If and only if this amendment is canonical and every implementation qualification gate above is proven on canonical `main`, Amendment 025 authorizes exactly one new same-tree canonical R181 execution.

The trigger commit must:

- have exactly the already-qualified canonical implementation tree;
- change no repository content;
- have complete commit message exactly `[provider-prereq]` and nothing else;
- be created only after canonical post-merge deterministic Linux/macOS/Windows PASS;
- preserve canonical-main/repository/no-secret/`contents: read` workflow boundaries.

The Amendment 025 attempt is consumed when triggered regardless of PASS, FAIL, infrastructure error, cancellation, timeout, or unavailable result.

Run `34065206452` and every earlier R181 execution remain immutable historical evidence and must never be rerun, retried, or selectively replayed.

## Success and continuation boundary

`D003-R181` becomes complete only if the single Amendment 025-authorized execution independently emits on Linux/x64, macOS/arm64, and Windows/x64:

```text
schema = delethos.spec003.r181-provider-prereq.v1
outcome = PASS
all REQUIRED_FACTS = true
```

including, without inference or reuse:

- exact runtime/model/server/template provenance;
- the direct forced-tool streaming witness;
- Pi identity and completion;
- exact write-only tool allowlist;
- exact first-request shaper witness;
- exactly one durable successful Pi write ToolCall/ToolResult;
- exact smoke bytes and natural process exit;
- exact full two-record first-request-only tool-choice audit;
- all OpenCode identity, permission, completion, and bounded write facts;
- all final fixture/repository/Git/no-secret invariants.

If any required platform fails or any required fact is missing, false, malformed, contradictory, or unavailable:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

and no additional R181 attempt is authorized without another new bounded canonical amendment.

Only after genuine three-platform R181 PASS may canonical task authority be re-read for `D003-R190` in dependency order.

## Non-authority

This amendment does not authorize:

- rerunning run `34065206452` or any earlier R181 workflow/job;
- treating any Amendment 024 PASS fact as reusable runtime PASS evidence for a later attempt;
- changing the selected runtime, provider, model, Pi, or OpenCode baseline;
- changing any runtime/model/archive SHA-256 or download URL;
- changing Amendment 020 template, Amendment 023 prompt, Layer-A token/timeout/request semantics, or streaming parser semantics;
- persistent model-level `tool_choice = required`;
- forcing request 2 or any later Pi provider request;
- widening Pi tools beyond exactly `write`;
- weakening or removing the full two-record audit;
- inferring request-2 success from the durable write fact alone;
- rewriting actual Pi ToolResult content to fit the old validator;
- changing production adapters or permissions;
- executing provider inference from pull-request code;
- `D003-R190`, `D003-R200`, `D003-R210`, `D003-R211`, or `D003-R212`;
- Gold promotion or Specification 003 closeout;
- Specification 004 authority.

## Canonical state while proposed

Until this amendment is independently qualified and merged:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
PI_GOLD = NOT_QUALIFIED
OPENCODE_GOLD = NOT_QUALIFIED
SPEC_003_STATUS = ACTIVE_BLOCKED_REAL_GOLD
SPEC_004 = NOT_AUTHORIZED
AMENDMENT_024_R181_ATTEMPT = CONSUMED
AMENDMENT_025 = PROPOSED_ONLY
```
