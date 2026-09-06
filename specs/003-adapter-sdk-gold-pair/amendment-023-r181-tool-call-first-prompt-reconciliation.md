# Specification 003 Amendment 023 — R181 Tool-Call-First Prompt Reconciliation and One New Bounded Attempt

**Status:** `PROPOSED` until independently qualified and merged to canonical `main`.  
**Task:** `D003-R181` diagnostic repair/re-execution authority only.  
**Exact proposal base:** `714db730f1f8b94a84a1c981502cdf6302362b45`.  
**Consumed Amendment 022 execution:** workflow run `34054303223`, exact trigger commit `714db730f1f8b94a84a1c981502cdf6302362b45`, exact tree `9e30007a80b1f37f11ef625fcc5d36fddb13b7ba`.

## Purpose

Amendment 022 authorized one Layer-A timeout-budget reconciliation and exactly one new same-tree canonical R181 execution after full implementation qualification. That attempt was consumed by the exact canonical `[provider-prereq]` trigger at `714db730f1f8b94a84a1c981502cdf6302362b45` and must never be rerun, retried, or selectively replayed.

Workflow run `34054303223` completed the deterministic core qualification successfully, then independently failed the provider-prerequisite job on every required platform at the same boundary:

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

On all three platforms the machine records independently proved every prerequisite through the anonymous non-empty completion and exact server chat-template/tool-capability checks. No Pi or OpenCode prerequisite fact was reached or promoted. The failure therefore does not qualify R181 and does not unlock R190.

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

Amendment 019 explicitly requires a later bounded canonical amendment if the 2048-token Layer-A witness still terminates with `length`. This amendment is that bounded reconciliation. It does not convert run `34054303223` into PASS and does not weaken the structured-tool requirement.

## Exact source reconciliation

The canonical direct Layer-A request currently uses exactly one `write` function, `tool_choice = required`, `parallel_tool_calls = false`, `temperature = 0`, and `max_tokens = 2048`. Its user message asks for the exact write and says not to perform another action, but it does not normatively require that the first emitted assistant content be the structured tool call or explicitly prohibit pre-tool prose/reasoning.

At the exact pinned llama.cpp runtime source commit:

```text
runtime_release = b10621
runtime_commit = c1d0e7a004015f23bc0233470b747b596f29b264
```

`common_chat_tool_choice_parse_oaicompat` accepts `auto`, `none`, and `required`. The pinned chat grammar uses `required` to require at least one tool call, but relevant grammar paths can still admit content before the required tool call. Therefore `required` does not by itself prove that the first generated content is a tool call.

Pinned source references:

```text
https://github.com/ggml-org/llama.cpp/blob/c1d0e7a004015f23bc0233470b747b596f29b264/common/chat.cpp
https://github.com/ggml-org/llama.cpp/blob/c1d0e7a004015f23bc0233470b747b596f29b264/docs/function-calling.md
```

The three machine records do not preserve raw model text and this amendment does not infer or reconstruct it. The only machine-observed terminal fact is that the request exhausted its 2048-token output budget before one exact structured write call completed.

The narrowest evidence-based next test is therefore to remove ambiguity in the direct diagnostic objective: require the structured `write` call to be the first assistant output and explicitly prohibit prose/reasoning/text before it, while preserving the exact model, runtime, schema, output ceiling, timeout, and all downstream Pi/OpenCode behavior.

## Amendment 023 repair principle

The repair is **Layer-A prompt-semantics tightening only**.

The direct Layer-A witness message must be replaced with one exact canonical message whose semantics are all of the following:

```text
- emit no prose, reasoning, explanation, markdown, or other assistant text before the tool call;
- the first emitted assistant content must be the structured write tool call;
- call write exactly once;
- path must equal the existing canonical smoke path;
- content must equal the existing canonical smoke content;
- perform no other action.
```

The implementation must use one literal deterministic prompt string and self-test exact equality. No platform-specific prompt variant is permitted.

Only the direct Layer-A witness user-message content may change. The following request fields and semantics remain unchanged:

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
no tool execution in Layer A
```

`finish_reason = length` remains FAIL whether it occurs before or after an exact structured write. The parser, fixed failure-code contract, exact terminal discrimination, and all fail-closed ordering rules remain unchanged.

## Downstream behavior remains genuinely unmodified

This amendment does **not** preemptively modify Pi or OpenCode prompts, model configuration, request shaping, permissions, tool allowlists, or Gold criteria. Those paths were not reached in run `34054303223` and must remain genuine downstream evidence boundaries.

If the amended Layer-A witness passes but Pi or OpenCode subsequently fails, that new failure is evidence for a later reconciliation; it must not be hidden by widening this repair in advance.

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

All platform archive SHA-256 pins, exact download URLs, llama.cpp launch flags, context size, CPU-only posture, loopback-only posture, and no-secret posture remain unchanged.

## Deterministic implementation self-tests

Before any new provider execution, deterministic self-tests must prove at minimum:

1. the direct Layer-A witness contains exactly one deterministic user message;
2. that message is exactly the Amendment 023 literal string;
3. the message explicitly requires no pre-tool prose/reasoning/text and requires the structured `write` call as the first assistant output;
4. the request still contains exactly one `write` tool with the exact existing schema;
5. every request field other than the user-message content is byte-for-byte/structurally unchanged from the Amendment 022 candidate;
6. `max_tokens` remains exactly `2048`;
7. request timeout remains exactly `300000` ms;
8. `parallel_tool_calls` remains exactly `false`;
9. `temperature` remains exactly `0`;
10. canonical exact-write `tool_calls` stream still passes;
11. Amendment 018 exact-write-then-`stop` compatibility remains unchanged;
12. `terminal_length_before_exact_write` and `terminal_length_after_exact_write` remain FAIL;
13. malformed/duplicate/wrong/incomplete tool calls and malformed SSE/JSON remain FAIL;
14. fixed failure-code serialization remains allowlisted and fail-closed;
15. all Amendment 015-022 deterministic self-tests continue to pass;
16. Pi and OpenCode generated prompts/configuration are unchanged by the Amendment 023 transformation;
17. workflow trigger, runner matrix, permissions, runtime/model pins, archive/model digests, URLs, and credential posture are unchanged.

These tests are shaping evidence only and do not complete R181.

## Exact implementation authority

Only after this amendment becomes canonical may one bounded implementation PR modify:

```text
scripts/recovery-provider-prereq.mjs
```

Within that wrapper, the implementation may transform the runner-temporary generated candidate after Amendments 013-022 only to:

1. replace the direct Layer-A witness user-message content with the exact Amendment 023 literal prompt;
2. add the deterministic prompt/request-preservation self-tests required above;
3. add transformation discriminators proving no other generated candidate section changed.

No other repository path is authorized unless a fresh independent substantive review finding proves the one-file wrapper repair impossible while preserving this amendment. Any scope expansion requires another docs-only canonical authority decision before code changes.

The following remain explicitly unauthorized for modification under this amendment:

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

The Amendment 023 implementation repair must, on one exact final head:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. preserve every exact canonical runtime/model/provider/CLI pin and download URL;
3. preserve the exact workflow/provider trigger predicate and `contents: read` permission;
4. keep provider/Gold/real-agent execution skipped on pull-request code;
5. pass deterministic CI on Linux, macOS, and Windows;
6. pass all pre-install and post-install R181 deterministic self-tests on every required platform;
7. prove the exact tool-call-first prompt and request-preservation contract;
8. receive a fresh independent substantive semantic/security/governance review of that exact final head;
9. reconcile every substantive finding and leave zero unresolved substantive review threads;
10. verify exact base/head/tree/scope/checks/reviews/threads/mergeability immediately before merge;
11. merge only with expected-head protection;
12. pass canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
13. re-read canonical authority before creating any provider trigger commit.

Unavailable, skipped, stale-head, rate-limited, billing-blocked, summary-only, or self-review output is not independent substantive review PASS.

## One new bounded R181 execution authority

If and only if this amendment is canonical and every implementation qualification gate above is proven on canonical `main`, Amendment 023 authorizes exactly one new same-tree canonical R181 execution.

The trigger commit must:

- have exactly the already-qualified canonical implementation tree;
- change no repository content;
- have complete commit message exactly `[provider-prereq]` and nothing else;
- be created only after canonical post-merge deterministic Linux/macOS/Windows PASS;
- preserve canonical-main/repository/no-secret/`contents: read` workflow boundaries.

The Amendment 023 attempt is consumed when triggered regardless of PASS, FAIL, infrastructure error, cancellation, timeout, or unavailable result.

Run `34054303223` and every earlier R181 execution remain immutable historical evidence and must never be rerun, retried, or selectively replayed.

## Success and continuation boundary

`D003-R181` becomes complete only if the one Amendment 023-authorized execution independently emits PASS on Linux/x64, macOS/arm64, and Windows/x64 with every required canonical fact true, including the exact Layer-A structured-write witness and all downstream Pi/OpenCode facts.

If any required platform fails or any required fact is missing/false:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

and no retry is authorized by this amendment. Any later repair requires another bounded canonical amendment based on the new machine evidence.

Only a genuine three-platform R181 PASS may unlock the next canonical unit, `D003-R190`. This amendment grants no direct authority for R190, R200, R210, R211, R212, Gold promotion, Specification 003 terminal closeout, or Specification 004.
