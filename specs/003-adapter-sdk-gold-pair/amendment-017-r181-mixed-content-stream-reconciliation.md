# Specification 003 Amendment 017 — R181 Mixed-Content Forced-Tool Stream Reconciliation

**Status:** `PROPOSED` until this amendment is independently qualified and merged to canonical `main`.  
**Task:** `D003-R181` diagnostic repair/re-execution authority only.  
**Exact proposal base:** `5af2857d387560cca87938d95f3a8fd9975480a9`.  
**Consumed Amendment 016 execution:** workflow run `33960124086`, exact trigger commit `5af2857d387560cca87938d95f3a8fd9975480a9`, exact tree `3264c5d430d84b95fb26e93b8f4dc9e6fe228b86`.

## Purpose

Amendment 016 authorized exactly one new R181 execution after its implementation qualification gates were satisfied. That attempt was consumed by the exact canonical trigger commit:

```text
[provider-prereq]
```

at `5af2857d387560cca87938d95f3a8fd9975480a9` and must never be rerun, retried, or selectively replayed.

Workflow run `33960124086` completed deterministic core CI successfully on Linux, macOS, and Windows. The provider-prerequisite jobs then failed independently on all three required platforms at the same earliest diagnostic boundary:

```text
failed_at = llama_forced_tool_stream_witness_exact
failure_reason = llama forced-tool stream emitted non-empty assistant content before the exact tool-call witness was completed
```

The exact platform records were:

```text
linux/x64   = FAIL at llama_forced_tool_stream_witness_exact
macos/arm64 = FAIL at llama_forced_tool_stream_witness_exact
windows/x64 = FAIL at llama_forced_tool_stream_witness_exact
```

On every required platform the following facts were already machine-observed true before the failure:

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
anonymous_nonempty_model_completion
```

Pi and OpenCode were not reached, which is the correct fail-closed ordering after a Layer A failure.

The Amendment 016 attempt is consumed regardless of this result. This amendment does not convert run `33960124086` into PASS and does not authorize reusing any failed job as successful evidence.

## Exact diagnostic ambiguity exposed by run 33960124086

The current Layer A parser rejects a non-empty `choice.delta.content` immediately:

```text
if content is a non-empty string => FAIL immediately
```

That rejection occurs while iterating the stream and therefore can terminate parsing before later SSE events or later fields establish whether the response also contains the exact required structured tool call.

Consequently the normalized failure record proves this bounded fact only:

```text
at least one accepted canonical-model SSE event exposed non-empty assistant content before the parser had completed the exact tool-call witness
```

It does **not** prove from the persisted machine record that the final response was plain-text-only. It also does not prove that a complete canonical tool call existed, because the parser intentionally did not persist the raw transcript and failed before completing the structural parse.

No raw model text, prompt text, or unbounded transcript is needed or authorized to resolve this ambiguity.

## Exact pinned llama.cpp source reconciliation

The selected runtime remains unchanged:

```text
runtime_release = b10621
runtime_commit = c1d0e7a004015f23bc0233470b747b596f29b264
```

The exact pinned llama.cpp source at that commit contains chat-parser tests in `tests/test-chat.cpp` where `COMMON_CHAT_TOOL_CHOICE_REQUIRED` is used and the expected assistant message contains both:

```text
non-empty content
structured tool_calls
```

The exact pinned source therefore does not establish that `tool_choice = required` implies an empty assistant `content` field. It establishes that mixed assistant content plus a structured tool call is a supported parsed message shape under required tool choice.

Exact source reference:

```text
https://github.com/ggml-org/llama.cpp/blob/c1d0e7a004015f23bc0233470b747b596f29b264/tests/test-chat.cpp
```

This source fact is shaping evidence only. It does not prove that run `33960124086` contained a valid tool call. It proves that the current immediate non-empty-content rejection is too early to distinguish a valid mixed-content tool-call response from a true plain-text-only failure.

## Amendment 017 repair principle

The repair is **deferred structural classification**, not relaxation of the required tool call.

Layer A must continue to require all Amendment 016 properties:

```text
exact loopback /v1/chat/completions endpoint
exact canonical model identity
stream = true
tool_choice = required
exactly one write function schema
exactly one complete structured write tool call
exact smoke path
exact smoke content
finish_reason = tool_calls
exact terminal ordering
bounded response size
no tool execution
```

The parser may no longer fail merely because a valid string `choice.delta.content` is non-empty before the structural tool-call parse is complete.

Instead it must:

1. validate that every present `choice.delta.content` value is `null` or a string;
2. keep the entire response under the existing bounded byte limit;
3. never persist, log, return, or include the assistant content text in the final machine record;
4. continue parsing the stream to determine whether the exact required structured tool call exists;
5. PASS Layer A only if the complete final stream contains exactly one valid canonical `write` call with exact arguments and every other Amendment 016 invariant passes;
6. FAIL a plain-text-only response because it contains no complete required tool call;
7. FAIL malformed, duplicate, wrong-model, wrong-tool, wrong-argument, contradictory-terminal, post-terminal-data, missing-DONE, or overflow responses exactly as before.

A mixed-content response is therefore not accepted because of its prose. The prose is semantically irrelevant and discarded. The only success authority remains the exact structured tool call.

## Deterministic parser requirements

The bounded implementation must add or preserve deterministic self-tests proving at minimum:

1. the canonical empty-content synthetic tool-call stream remains PASS;
2. a synthetic stream containing bounded non-empty string content plus exactly one canonical structured `write` call is PASS;
3. the same mixed-content stream is still subject to exact model identity, tool name, call index, arguments, finish reason, DONE ordering, and output bounds;
4. a plain-text-only stream remains FAIL;
5. a stream with non-empty content and no complete tool call remains FAIL;
6. a stream with non-empty content plus a wrong tool remains FAIL;
7. a stream with non-empty content plus wrong path/content arguments remains FAIL;
8. missing-model and wrong-model streams remain FAIL;
9. data after terminal `finish_reason = tool_calls` remains FAIL;
10. data after `[DONE]` remains FAIL;
11. malformed JSON/SSE remains FAIL;
12. duplicate or non-zero-index tool calls remain FAIL;
13. no assistant content text enters the normalized success/failure machine record;
14. every Amendment 015/016 Pi and OpenCode self-test remains unchanged and passing.

These deterministic tests are shaping evidence only and do not complete R181.

## Preserved identities and non-changes

This amendment changes no selected runtime, runtime asset, model, provider, CLI version, digest, URL, permission policy, tool allowlist, credential posture, workflow trigger, platform matrix, or Gold criterion.

The canonical identities remain:

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

All platform archive SHA-256 pins and exact download URLs remain unchanged.

## Exact implementation authority

Only after this amendment becomes canonical may one bounded implementation PR modify:

```text
scripts/recovery-provider-prereq.mjs
```

No other repository path is authorized by Amendment 017 unless an independent substantive review finding proves that the one-file parser repair is impossible while preserving this amendment. Such a finding requires another docs-only canonical authority decision before implementation scope broadens.

The implementation must preserve the Amendment 016 Layer A request builder, Layer B first-request shaper witness, Layer C durable Pi evidence, all existing OpenCode evidence, and every exact runtime/model/provider/CLI pin.

The following remain unauthorized for modification under Amendment 017:

```text
scripts/recovery-provider-prereq-impl.mjs
.github/workflows/ci.yml
packages/adapters/src/pi.ts
packages/adapters/src/opencode.ts
packages/runtime/**
package.json
pnpm-lock.yaml
runtime/model URLs or pins
provider/model configuration
Pi/OpenCode versions
production code
```

No new production dependency is authorized.

## Implementation qualification gate

The Amendment 017 implementation repair must, on one exact final head:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. preserve every exact canonical runtime/model/provider/CLI pin and download URL;
3. preserve the exact `[provider-prereq]` workflow trigger predicate and `contents: read` boundary;
4. keep provider/Gold/real-agent execution skipped on pull-request code;
5. pass deterministic CI on Linux, macOS, and Windows;
6. pass all pre-install and post-install R181 deterministic self-tests on every required platform;
7. prove mixed-content-plus-exact-tool PASS and plain-text-only/no-tool FAIL behavior deterministically;
8. prove model identity and terminal-order hardening from Amendment 016 remain fail closed;
9. prove all Amendment 015 explicit-extension and first-request-only semantics remain intact;
10. receive a fresh independent substantive semantic review of that exact final head;
11. reconcile every substantive finding and leave zero unresolved substantive review threads;
12. verify exact base/head/tree/scope/checks/reviews/threads/mergeability immediately before merge;
13. merge only with expected-head protection;
14. pass canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
15. re-read canonical authority before creating any new provider trigger commit.

Unavailable, skipped, stale-head, rate-limited, billing-blocked, summary-only, or self-review output is not independent substantive review PASS.

## One new bounded R181 execution authority

If and only if this amendment is canonical and every implementation qualification gate above is proven on canonical `main`, Amendment 017 authorizes exactly one new same-tree canonical R181 execution.

The trigger commit must:

- have exactly the already-qualified canonical implementation tree;
- change no repository content;
- have complete commit message exactly `[provider-prereq]` and nothing else;
- be created only after canonical post-merge deterministic Linux/macOS/Windows PASS;
- preserve canonical-main/repository/no-secret/`contents: read` workflow boundaries.

The Amendment 017 attempt is consumed when triggered regardless of PASS, FAIL, infrastructure error, cancellation, timeout, or unavailable result.

Run `33960124086`, run `33926705106`, run `33877530134`, and every earlier R181 execution remain immutable historical evidence and must never be rerun, retried, or selectively replayed.

## Success and continuation boundary

`D003-R181` becomes complete only if the one Amendment 017-authorized execution independently emits PASS on Linux/x64, macOS/arm64, and Windows/x64 with every required canonical fact true, including:

```text
llama_forced_tool_stream_witness_exact
pi_first_request_shaper_witness_exact
pi_first_request_tool_choice_exact
pi_bounded_tool_write_smoke
all pre-existing runtime/model/Pi/OpenCode/repository facts
```

If any required platform fails or any required fact is missing, false, malformed, contradictory, or unavailable:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

and no additional R181 attempt is authorized without another new bounded canonical amendment based on that new evidence.

Only after full three-platform R181 PASS may canonical authority be re-read for `D003-R190` in task order.

## Explicit non-authority

This amendment does not authorize:

- rerunning or retrying run `33960124086` or any earlier R181 run/job;
- treating mixed assistant prose as success evidence;
- accepting a response without exactly one complete canonical structured `write` tool call;
- persisting or exposing raw model output, prompts, transcripts, reasoning, or assistant content;
- changing runtime, release asset, archive SHA-256, model, model SHA-256, provider, Pi, or OpenCode pins;
- changing runtime/model download URLs;
- remote providers, proxies, relay services, secrets, tokens, credentials, stored authentication, or paid APIs;
- a new loopback proxy or provider re-registration;
- persistent model-level `tool_choice` or `samplingParams`;
- forcing the second or later Pi provider request;
- widening the Pi tool allowlist beyond the active exact case;
- weakening durable Pi ToolCall/ToolResult validation;
- widening OpenCode permissions;
- Gold promotion;
- `D003-R190`, `D003-R200`, `D003-R210`, `D003-R211`, or `D003-R212` before R181 passes;
- Specification 004 activation.

## Amendment 017 qualification gate

This docs-only amendment proposal must itself:

1. be based on exact canonical revision `5af2857d387560cca87938d95f3a8fd9975480a9`;
2. change only this amendment document unless a substantive independent review requires another Specification 003 documentation path;
3. execute no provider/model/runtime during the amendment PR;
4. pass deterministic Linux/macOS/Windows CI at the exact PR head with provider execution skipped;
5. receive a fresh independent substantive semantic review of the exact final head;
6. reconcile every substantive finding and leave zero unresolved substantive review threads;
7. preserve unavailable, skipped, billing-blocked, rate-limited, stale, or summary-only review output as non-PASS;
8. verify exact base/head/tree/scope/checks/reviews/threads/mergeability immediately before merge;
9. merge only with expected-head protection;
10. require canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
11. re-read canonical Amendment 017 authority before implementation begins.

## Resulting frontier if canonicalized

If Amendment 017 qualifies, merges, passes canonical post-merge deterministic CI, and authority is re-read:

```text
D003-R181 = ACTIVE_REPAIR_AUTHORIZED
AMENDMENT_016_ATTEMPT = CONSUMED_FAIL
AMENDMENT_017_IMPLEMENTATION = NEXT_AUTHORIZED_UNIT
D003-R190 = BLOCKED_ON_R181
D003-R200 = BLOCKED_ON_R190
D003-R210 = BLOCKED
D003-R211 = BLOCKED
D003-R212 = BLOCKED
SPEC_003_STATUS = ACTIVE_BLOCKED_REAL_GOLD
TERMINAL_SPEC_003_CLOSEOUT = NOT_AUTHORIZED
SPEC_004 = NOT_AUTHORIZED
```
