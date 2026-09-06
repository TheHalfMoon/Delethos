# Specification 003 Amendment 023 — R181 Tool-Call-First Prompt Reconciliation and One New Bounded Attempt

**Status:** `NORMATIVE` iff this file is present on canonical `main` while Specification 003 remains active.  
**Task:** `D003-R181` diagnostic repair/re-execution authority only.  
**Proposal base:** `714db730f1f8b94a84a1c981502cdf6302362b45`.  
**Consumed Amendment 022 execution:** run `34054303223`, trigger `714db730f1f8b94a84a1c981502cdf6302362b45`, tree `9e30007a80b1f37f11ef625fcc5d36fddb13b7ba`.

## Purpose and preserved failure truth

Amendment 022 authorized exactly one new same-tree R181 execution after qualification. That attempt was consumed by the canonical `[provider-prereq]` trigger and must never be rerun, retried, or selectively replayed.

Run `34054303223` completed deterministic core qualification, then independently failed the provider prerequisite at the same earliest required boundary on every required platform:

```text
linux/x64:
  failed_at = llama_forced_tool_stream_witness_exact
  failure_reason = terminal_length_before_exact_write

macos/arm64:
  failed_at = llama_forced_tool_stream_witness_exact
  failure_reason = terminal_length_before_exact_write

windows/x64:
  failed_at = llama_forced_tool_stream_witness_exact
  failure_reason = terminal_length_before_exact_write
```

Each machine record proved the required runtime/model provenance, loopback/no-auth posture, exact server model alias, exact pinned chat-template/tool-capability checks, and anonymous non-empty model completion before Layer A failed. Pi and OpenCode prerequisite execution was not reached, so no downstream fact is promoted.

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

Amendment 019 explicitly requires another bounded canonical amendment if the 2048-token Layer-A witness still terminates with `length`. This amendment is that reconciliation. It does not reinterpret the failed run as PASS and does not weaken the structured-tool requirement.

## Exact source reconciliation

The current Layer-A request uses one `write` function, `tool_choice = required`, `parallel_tool_calls = false`, `temperature = 0`, and `max_tokens = 2048`. Its message requests the exact write and prohibits other actions, but it does not explicitly require that the first emitted assistant content be the structured tool call or prohibit all pre-tool prose/reasoning.

The selected runtime remains:

```text
runtime_release = b10621
runtime_commit = c1d0e7a004015f23bc0233470b747b596f29b264
```

At that exact pinned llama.cpp source, `common_chat_tool_choice_parse_oaicompat` accepts `auto`, `none`, and `required`. The pinned chat grammar requires at least one tool call for `required`, while relevant grammar paths can still admit content before the required tool call. Therefore `required` alone does not prove first-output tool invocation.

Pinned references:

```text
https://github.com/ggml-org/llama.cpp/blob/c1d0e7a004015f23bc0233470b747b596f29b264/common/chat.cpp
https://github.com/ggml-org/llama.cpp/blob/c1d0e7a004015f23bc0233470b747b596f29b264/docs/function-calling.md
```

The failed jobs did not preserve raw model text. This amendment does not infer or reconstruct it. The only machine-observed terminal fact is that the 2048-token output budget ended before one exact structured write completed.

The narrowest evidence-based next diagnostic is therefore to remove ambiguity from the direct witness objective while preserving the selected strategy and every downstream evidence boundary.

## Authorized repair

Only the direct Layer-A witness user-message content may change. Its one deterministic literal prompt must require all of the following:

```text
- emit no prose, reasoning, explanation, markdown, or other assistant text before the tool call;
- the first emitted assistant content must be the structured write tool call;
- call write exactly once;
- path must equal the existing canonical smoke path;
- content must equal the existing canonical smoke content;
- perform no other action.
```

The following remain unchanged:

```text
endpoint = existing canonical loopback /v1/chat/completions
model = delethos-qwen25-coder-1.5b-q4km
stream = true
tool_choice = required
tools = exactly one write function
write schema = exactly path:string + content:string
max_tokens = 2048
temperature = 0
parallel_tool_calls = false
request timeout = 300000 ms
bounded response bytes = unchanged
Layer A executes no tool
```

`finish_reason = length` remains FAIL whether observed before or after an exact write. Parser semantics, terminal discrimination, fixed failure codes, and fail-closed ordering remain unchanged.

This amendment does **not** modify Pi or OpenCode prompts, request shaping, permissions, tool allowlists, model configuration, or Gold criteria. Those paths were not reached in run `34054303223` and must remain genuine downstream evidence boundaries. A later Pi/OpenCode failure requires its own evidence-based reconciliation rather than preemptive widening here.

## Preserved identities and provenance

No selected runtime, model, provider, CLI version, digest, URL, permission, or Gold criterion changes:

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

All platform archive SHA-256 pins, download URLs, llama.cpp launch flags, context size, CPU-only posture, loopback-only posture, and no-secret posture remain unchanged.

## Deterministic implementation evidence

Before any new provider execution, self-tests must prove at minimum:

1. exactly one deterministic Layer-A user message exists and equals the Amendment 023 literal prompt;
2. it explicitly prohibits pre-tool prose/reasoning/text and requires the structured `write` call as first assistant output;
3. the request still has exactly one `write` tool with the existing exact schema;
4. every request field other than user-message content is structurally unchanged from the Amendment 022 candidate;
5. `max_tokens = 2048`, timeout `= 300000`, `temperature = 0`, and `parallel_tool_calls = false` remain exact;
6. canonical exact-write `tool_calls` stream still passes;
7. Amendment 018 exact-write-then-`stop` compatibility remains unchanged;
8. `terminal_length_before_exact_write` and `terminal_length_after_exact_write` remain FAIL;
9. malformed, duplicate, wrong, incomplete, malformed-SSE, and malformed-JSON evidence remains FAIL;
10. fixed failure-code serialization remains allowlisted and fail-closed;
11. all Amendment 015-022 deterministic self-tests still pass;
12. Pi/OpenCode generated prompts and configuration are unchanged by the Amendment 023 transform;
13. workflow trigger, runner matrix, permissions, runtime/model pins, digests, URLs, and credential posture are unchanged.

These are shaping tests only and do not complete R181.

## Exact implementation authority

Only after this amendment is canonical may one bounded implementation PR modify:

```text
scripts/recovery-provider-prereq.mjs
```

Within that wrapper it may only:

1. replace the direct Layer-A witness user-message content with the exact Amendment 023 prompt;
2. add the deterministic prompt/request-preservation self-tests above;
3. add transformation discriminators proving no other generated candidate section changed.

No other repository path is authorized. If independent substantive review proves the one-file repair impossible while preserving this amendment, a new docs-only authority decision is required before expanding scope.

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
Pi/OpenCode versions
production code
```

No new dependency is authorized.

## Implementation qualification gate

The implementation must, on one exact final head:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. preserve exact identities, pins, URLs, workflow predicate, and `contents: read` permission;
3. keep provider/Gold/real-agent execution skipped on pull-request code;
4. pass deterministic CI on Linux, macOS, and Windows;
5. pass pre-install and post-install R181 self-tests on all required platforms;
6. prove the exact prompt and request-preservation contract;
7. receive fresh independent substantive semantic/security/governance review on that exact head;
8. reconcile all substantive findings and leave zero unresolved substantive review threads;
9. reverify exact base/head/tree/scope/checks/reviews/threads/mergeability immediately before merge;
10. merge only with expected-head protection;
11. pass canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
12. re-read canonical authority before any provider trigger.

Unavailable, skipped, stale-head, rate-limited, billing-blocked, summary-only, or self-review output is not independent substantive review PASS.

## One new bounded R181 execution

If and only if this amendment is canonical and the implementation qualification gate is proven on canonical `main`, Amendment 023 authorizes exactly one new same-tree R181 execution.

The trigger commit must:

- use exactly the already-qualified canonical implementation tree;
- change no repository content;
- have complete commit message exactly `[provider-prereq]`;
- be created only after canonical post-merge three-platform deterministic PASS;
- preserve canonical-main, repository, no-secret, and `contents: read` workflow boundaries.

The Amendment 023 attempt is consumed when triggered regardless of PASS, FAIL, infrastructure error, cancellation, timeout, or unavailable result. Run `34054303223` and every earlier R181 execution remain immutable historical evidence and must never be rerun or retried.

## Success and continuation boundary

`D003-R181` completes only if the one Amendment 023-authorized execution independently emits PASS on Linux/x64, macOS/arm64, and Windows/x64 with every required canonical fact true, including the exact Layer-A witness and all downstream Pi/OpenCode facts.

If any required platform fails or any required fact is missing/false:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

No retry is authorized by this amendment. Any later repair requires another bounded canonical amendment based on the new machine evidence.

Only a genuine three-platform R181 PASS may unlock the next canonical unit, `D003-R190`. This amendment grants no direct authority for R190, R200, R210, R211, R212, Gold promotion, Specification 003 closeout, or Specification 004.
