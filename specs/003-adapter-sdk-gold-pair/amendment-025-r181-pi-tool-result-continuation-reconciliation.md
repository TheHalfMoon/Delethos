# Specification 003 Amendment 025 — R181 Pi Tool-Result Continuation Reconciliation and One New Bounded Attempt

**Status:** `NORMATIVE` iff this file is present on canonical `main` while Specification 003 remains active.  
**Task:** `D003-R181` diagnostic repair/re-execution authority only.  
**Proposal base:** `cb5b173616e03820e1c9226504abaf7cd76b0090`.  
**Consumed Amendment 024 execution:** run `34065206452`, trigger `cb5b173616e03820e1c9226504abaf7cd76b0090`, tree `6411ac838e7b9a047219dcc842958fc0051e5a54`.

## Purpose and preserved failure truth

Amendment 024 changed only the selected local model baseline and propagated the corresponding strategy/model identity. After exact-head implementation qualification, independent substantive review, guarded merge, and canonical post-merge three-platform deterministic PASS, Amendment 024 authorized exactly one new same-tree canonical R181 execution.

That attempt was consumed by canonical workflow run `34065206452` and must never be rerun, retried, selectively replayed, or reclassified into PASS.

The deterministic core matrix passed on Linux, macOS, and Windows. The provider-prerequisite job independently failed on every required platform at the same earliest remaining required fact:

```text
linux/x64:
  failed_at = pi_first_request_tool_choice_exact
  failure_reason = unclassified_internal_failure

macos/arm64:
  failed_at = pi_first_request_tool_choice_exact
  failure_reason = unclassified_internal_failure

windows/x64:
  failed_at = pi_first_request_tool_choice_exact
  failure_reason = unclassified_internal_failure
```

Before that failure, every required platform independently machine-observed all of the following as true:

```text
runtime_tag_commit_exact
runtime_release_asset_public_binding_exact
runtime_archive_digest_exact
runtime_executable_contained_unique
runtime_executable_identity_exact
model_digest_exact
server_loopback_only
server_no_auth_required
server_models_endpoint_contains_exact_alias
server_chat_template_exact_pinned_qwen
server_chat_template_supports_tools
server_chat_template_supports_tool_calls
anonymous_nonempty_model_completion
llama_forced_tool_stream_witness_exact
pi_cli_version_exact_0_84_4
pi_requested_identity_exact
pi_observed_identity_exact
pi_nonempty_completion
pi_tool_allowlist_exact_write_only
pi_first_request_shaper_witness_exact
pi_bounded_tool_write_smoke
```

The following remained false because execution stopped at the full two-request Pi audit boundary before OpenCode and final repository completion facts:

```text
pi_first_request_tool_choice_exact
opencode_cli_version_exact_1_18_26
opencode_requested_identity_exact
opencode_sanitized_export_identity_exact
opencode_nonempty_completion
opencode_permission_policy_exact_default_deny
opencode_bounded_tool_write_smoke
repository_fixture_only
no_secret_referenced
no_hidden_commit_push_merge
```

The false OpenCode/final fields are not independently interpreted as OpenCode, secret, or repository-integrity failures because those stages were not reached.

Canonical task truth remains:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
D003-R200 = BLOCKED
D003-R210 = BLOCKED
D003-R211 = BLOCKED
D003-R212 = BLOCKED
PI_GOLD = NOT_QUALIFIED
OPENCODE_GOLD = NOT_QUALIFIED
SPEC_003_STATUS = ACTIVE_BLOCKED_REAL_GOLD
SPEC_004 = NOT_AUTHORIZED
```

## Exact post-failure diagnosis

The Amendment 024 execution is the first preserved R181 run in which all required platforms independently proved both:

```text
pi_first_request_shaper_witness_exact = true
pi_bounded_tool_write_smoke = true
```

before failing the stronger full two-request audit:

```text
pi_first_request_tool_choice_exact = false
```

This matters because the current audit contract is intentionally ordered as:

1. prove the real first Pi provider request reached the temporary extension and was shaped with first-request-only `tool_choice = required`;
2. prove exactly one durable Pi `write` ToolCall/ToolResult and exact smoke file content;
3. only then require the full two-record audit proving that the second provider request followed the successful write result and remained unforced.

The Amendment 024 machine evidence therefore proves that the first request was shaped and the durable write completed before the stronger continuation audit failed. It does not prove the second request was valid, and the missing second audit record is not inferred into PASS.

Exact source reconciliation identifies one narrow contradiction in the current temporary extension continuation predicate.

### Current canonical continuation literal

The generated Pi request-shaping extension currently defines its successful write-result text as:

```text
Successfully wrote to delethos-r181-smoke.txt
```

and accepts the second provider request only when the serialized OpenAI-compatible `tool` message content equals that exact string.

### Pinned Pi 0.84.4 write-tool result

The canonical Pi executable remains:

```text
package = @mariozechner/pi-coding-agent@0.84.4
source repository = earendil-works/pi
source commit = b79e4cc834970cca69daebffab7df1da7d1e52c4
```

At that exact source commit, the built-in `write` tool returns successful text in the exact form:

```text
Successfully wrote ${content.length} bytes to ${path}
```

The canonical R181 smoke constants remain:

```text
SMOKE_FILE = delethos-r181-smoke.txt
SMOKE_CONTENT = DELETHOS_R181_OK\n
SMOKE_CONTENT.length = 17
```

Therefore the exact successful Pi tool-result text for the canonical smoke is:

```text
Successfully wrote 17 bytes to delethos-r181-smoke.txt
```

The same pinned Pi OpenAI-completions adapter serializes a successful `ToolResultMessage` into an OpenAI-compatible message with:

```text
role = tool
content = the tool-result text
tool_call_id = the matching tool call id
```

No source evidence supports the current shorter literal.

Pinned source references:

```text
https://github.com/earendil-works/pi/blob/b79e4cc834970cca69daebffab7df1da7d1e52c4/packages/coding-agent/src/core/tools/write.ts
https://github.com/earendil-works/pi/blob/b79e4cc834970cca69daebffab7df1da7d1e52c4/packages/ai/src/providers/openai-completions.ts
```

This source reconciliation does not itself complete R181. It explains a deterministic validator mismatch that is consistent with the machine-observed sequence in run `34065206452`.

## Repair principle

The repair is a continuation-literal correction only.

The canonical extension must continue to require all of the existing second-request structural facts:

```text
exactly one prior assistant tool call
prior tool call id is non-empty
prior tool call type = function
prior tool call function name = write
exactly one subsequent tool-result message
result.tool_call_id matches the prior assistant tool call id
result appears after the prior assistant tool call
second request contains exactly the canonical write tool and no other tool
second request model is the canonical model
second request has no incoming tool_choice
```

The only changed value is the expected successful result text.

The generated extension must use the exact canonical expected result derived from the existing smoke constants, equivalent to:

```text
Successfully wrote ${SMOKE_CONTENT.length} bytes to ${SMOKE_FILE}
```

which currently evaluates exactly to:

```text
Successfully wrote 17 bytes to delethos-r181-smoke.txt
```

A prefix match, substring match, regular expression, numeric wildcard, path-only match, case-insensitive match, whitespace normalization, or arbitrary successful-text acceptance is not authorized.

If Pi changes the exact result text, the smoke constants drift, the content length differs, the path differs, the tool call/result ids disagree, the request contains malformed messages, or any other structural contradiction exists, R181 must continue to fail closed.

## Preserved first-request shaping semantics

Amendments 015 and 016 remain authoritative for the Pi first-request shaper.

The temporary extension must still:

- be runner-temporary and outside canonical mutable repository work;
- be loaded explicitly while ambient extension discovery remains disabled;
- register only `before_provider_request`;
- expose exactly the canonical `write` tool and no other tool;
- require the canonical provider/model identity;
- require no incoming `tool_choice`;
- add only `tool_choice = required` to request 1;
- change no other request-1 field;
- leave request 2 unchanged and unforced after the exact successful write result;
- abort fail-closed on malformed, widened, third-request, contradictory, or otherwise unexpected state.

Persistent model-level `samplingParams`, persistent `tool_choice`, second-request forcing, tool-list widening, package patches, Pi binary patches, proxying, or provider re-registration remain prohibited.

## Preserved Layer-A success

Amendment 024 changed the model baseline. Run `34065206452` then independently proved on Linux/x64, macOS/arm64, and Windows/x64:

```text
llama_forced_tool_stream_witness_exact = true
```

No Layer-A parser, prompt, template, timeout, token budget, runtime, model, or tool-schema change is authorized by this amendment.

The exact selected provider strategy remains:

```text
provider_strategy_id = delethos-local-llama-qwen25-instruct
provider_id = delethos-local-llama
model_id = delethos-qwen25-instruct-1.5b-q4km
model_repository = Qwen/Qwen2.5-1.5B-Instruct-GGUF
model_revision = a615a81362316d7b9f5a7a9c4313adfdf9b54588
model_file = qwen2.5-1.5b-instruct-q4_k_m.gguf
model_sha256 = 6a1a2eb6d15622bf3c96857206351ba97e1af16c30d7a74ee38970e434e9407e
```

The exact llama.cpp runtime remains:

```text
runtime_release = b10621
runtime_commit = c1d0e7a004015f23bc0233470b747b596f29b264
```

Pi and OpenCode remain:

```text
pi = 0.84.4
opencode = 1.18.26
```

## Deterministic implementation evidence

Before any new provider execution, deterministic self-tests must prove at minimum:

1. the generated extension success literal is exactly derived from `SMOKE_CONTENT.length` and `SMOKE_FILE`;
2. for the current canonical smoke constants, the exact literal is `Successfully wrote 17 bytes to delethos-r181-smoke.txt`;
3. the previously incorrect literal `Successfully wrote to delethos-r181-smoke.txt` is rejected by the second-request continuation predicate;
4. a canonical second request containing the exact matching assistant `write` tool call and exact successful tool-result text is accepted and passed through byte-for-byte/object-identity unchanged;
5. the second request still has no `tool_choice` before or after the extension handler;
6. wrong byte count, wrong path, wrong tool name, wrong tool-call id, multiple tool calls, multiple tool results, missing result, reordered result, malformed assistant/tool messages, pre-existing `tool_choice`, wrong model, widened tool list, and third request all fail closed;
7. the first-request shaper still adds only `tool_choice = required` and changes no other request field;
8. the first-record-only audit still proves only `pi_first_request_shaper_witness_exact` and cannot satisfy the stronger two-record validator;
9. the full two-record audit still requires exact first-request forcing plus exact second-request unforced continuation;
10. durable Pi ToolCall/ToolResult validation remains unchanged;
11. exact smoke-file verification remains unchanged;
12. Pi natural-exit timing and cancellation fail-closed semantics remain unchanged;
13. completion-only Pi conformance remains extension-free;
14. Pi write-smoke remains exactly `--tools write` with no additional tool;
15. OpenCode configuration, permission policy, prompt, executable/version pin, and write-smoke contract remain unchanged;
16. runtime/model/provider/template identities, URLs, archive/model digests, Layer-A request/parser, workflow trigger, runner matrix, permissions, and no-secret posture remain unchanged;
17. transformation discriminators prove that the generated candidate changes only the exact continuation-success literal and deterministic tests required to prove that correction.

These are shaping tests only and do not complete R181.

## Exact implementation authority

Only after this amendment is canonical may one bounded implementation PR modify:

```text
scripts/recovery-provider-prereq.mjs
```

Within that wrapper it may only:

1. replace the generated Pi extension success-result literal with the exact canonical result derived from `SMOKE_CONTENT.length` and `SMOKE_FILE`;
2. add deterministic tests for the exact corrected literal and fail-closed negative cases;
3. add transformation discriminators proving no unrelated generated candidate section changed.

No other repository path is authorized.

Explicitly unauthorized here:

```text
scripts/recovery-provider-prereq-impl.mjs
.github/workflows/ci.yml
packages/adapters/src/pi.ts
packages/adapters/src/opencode.ts
packages/runtime/**
package.json
pnpm-lock.yaml
runtime/model/provider identities or pins
runtime/model download URLs
Amendment 020 pinned template
Amendment 023 Layer-A prompt
Layer-A parser or terminal semantics
Pi/OpenCode versions
Pi tool allowlist
Pi second-request forcing
OpenCode policy
production code
```

No new dependency is authorized.

If an independent substantive review proves the one-file repair impossible while preserving this contract, a new docs-only authority decision is required before any scope broadening.

## Amendment 025 qualification gate

This docs-only amendment PR must itself:

1. be based on exact canonical revision `cb5b173616e03820e1c9226504abaf7cd76b0090` unless live canonical truth changes before branch creation;
2. change only this amendment document unless a substantive independent review requires another Specification 003 documentation path;
3. pass deterministic Linux/macOS/Windows CI at the exact PR head;
4. keep provider/Gold/real-agent execution skipped on pull-request code;
5. receive fresh independent substantive semantic/security/governance review on the exact final head;
6. reconcile every substantive finding and leave zero unresolved substantive review threads;
7. preserve skipped, unavailable, rate-limited, billing-blocked, summary-only, stale-head, or self-review output as non-PASS;
8. reverify exact base/head/tree/scope/checks/reviews/threads/comments/mergeability immediately before merge;
9. merge only with expected-head protection;
10. require canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
11. re-read canonical authority before Amendment 025 implementation begins.

## Implementation qualification gate

The later one-file implementation must, on one exact final head:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. preserve exact runtime/model/provider/Pi/OpenCode identities and pins;
3. preserve Layer-A request/parser/template/prompt semantics;
4. preserve exact workflow predicate, runner matrix, `contents: read` permission, and no-secret posture;
5. keep provider/Gold/real-agent execution skipped on pull-request code;
6. pass deterministic CI on Linux, macOS, and Windows;
7. pass all pre-install and post-install R181 deterministic self-tests on every required platform;
8. prove the exact success-literal correction and all fail-closed negative cases above;
9. prove no unrelated generated candidate section changed;
10. receive fresh independent substantive semantic/security/governance review on the exact final head;
11. reconcile every substantive finding and leave zero unresolved substantive review threads;
12. reverify exact base/head/tree/scope/checks/reviews/threads/comments/mergeability immediately before merge;
13. merge only with expected-head protection;
14. pass canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
15. re-read canonical authority before any provider trigger.

## One new bounded R181 execution authority

If and only if this amendment is canonical and every implementation qualification gate above is proven on canonical `main`, Amendment 025 authorizes exactly one new same-tree canonical R181 execution.

The trigger commit must:

- have exactly the already-qualified canonical implementation tree;
- change no repository content;
- have complete commit message exactly `[provider-prereq]` and nothing else;
- be created only after canonical post-merge deterministic Linux/macOS/Windows PASS;
- preserve canonical-main/repository/no-secret/`contents: read` workflow boundaries.

The Amendment 025 attempt is consumed when triggered regardless of PASS, FAIL, infrastructure error, cancellation, timeout, or unavailable result.

Run `34065206452` and every earlier R181 execution remain immutable historical evidence and must not be rerun, retried, or selectively replayed.

## Success and continuation boundary

`D003-R181` becomes complete only if the one Amendment 025-authorized execution independently emits on Linux/x64, macOS/arm64, and Windows/x64:

```text
schema = delethos.spec003.r181-provider-prereq.v1
outcome = PASS
all REQUIRED_FACTS = true
```

including:

```text
llama_forced_tool_stream_witness_exact = true
pi_first_request_shaper_witness_exact = true
pi_bounded_tool_write_smoke = true
pi_first_request_tool_choice_exact = true
all OpenCode required facts = true
repository_fixture_only = true
no_secret_referenced = true
no_hidden_commit_push_merge = true
```

If any required platform fails or any required fact is missing, false, malformed, contradictory, or unavailable:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

and no additional R181 attempt is authorized without another new bounded canonical amendment.

Only after full three-platform R181 PASS may canonical authority be re-read for `D003-R190` in task order.

## Non-authority

This amendment does not authorize:

- rerunning workflow `34065206452` or any earlier R181 execution;
- interpreting the successful smoke write from run `34065206452` as a full Pi continuation PASS;
- relaxing exact second-request continuation structure;
- prefix/substring/regex/wildcard matching of tool-result content;
- changing runtime, model, provider, Pi, or OpenCode identity/version/pins;
- changing Layer-A prompt, parser, template, timeout, token budget, or tool schema;
- changing the Pi tool allowlist;
- forcing the second Pi request or restoring persistent model-level `tool_choice`;
- changing OpenCode policy or evidence requirements;
- modifying workflow trigger semantics, permissions, or runner matrix;
- adding credentials, secrets, remote provider sessions, paid execution, or hidden Git writes;
- Gold promotion;
- `D003-R190`, `D003-R200`, `D003-R210`, `D003-R211`, or `D003-R212` execution before their dependency authority becomes satisfied;
- Specification 003 closeout;
- Specification 004 implementation.

Ordinary founder approval does not substitute for missing machine evidence, independent review, exact-head qualification, or canonical successor authority.
