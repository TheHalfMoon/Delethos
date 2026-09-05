# Specification 003 Amendment 018 — R181 Stream Terminal Reconciliation and One New Bounded Attempt

**Status:** `PROPOSED` until this amendment is independently qualified and merged to canonical `main`.  
**Task:** `D003-R181` stream-terminal repair/re-execution authority only.  
**Exact proposal base:** `03acf268d396b94be33fd8ccde8013dcac94b6f4`.  
**Consumed Amendment 017 execution:** workflow run `33963864733`, exact trigger commit `03acf268d396b94be33fd8ccde8013dcac94b6f4`, exact tree `2d1183759effeb1b3717983a86e17abe634486d6`.

## Purpose

Amendment 017 authorized one mixed-content stream reconciliation repair and exactly one new same-tree canonical R181 execution after full implementation qualification. That attempt was consumed by the exact commit message `[provider-prereq]` at `03acf268d396b94be33fd8ccde8013dcac94b6f4` and must never be rerun, retried, or selectively replayed.

Workflow run `33963864733` completed deterministic core CI successfully on Linux/x64, macOS/arm64, and Windows/x64, then independently failed the provider-prerequisite job on all three required platforms at the same earliest machine boundary:

```text
failed_at = llama_forced_tool_stream_witness_exact
failure_reason = llama forced-tool stream terminal reason contradicted a tool call
```

For all three required platforms, runtime/model/server prerequisite facts before Layer A remained true. Pi and OpenCode execution were not reached. Therefore:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

The Amendment 017 attempt is consumed regardless of this result.

This amendment does not convert the failed run into PASS. It reconciles the streaming terminal contract with the exact pinned llama.cpp implementation so that the next attempt can distinguish a complete structured tool call that was actually emitted to the streaming client from a terminal label derived by the server's final full-message reparse.

## Preserved canonical identities

This amendment changes no selected runtime, runtime asset, model, provider, CLI version, digest, URL, workflow trigger, permission, or Gold criterion.

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

## Exact source reconciliation after run 33963864733

The post-failure investigation used exact public source at the already pinned llama.cpp commit `c1d0e7a004015f23bc0233470b747b596f29b264`.

The exact source establishes all of the following:

1. `llama-server` is already launched by the canonical R181 path with `--jinja` and the exact model alias required by Amendment 008.
2. OpenAI-compatible `tool_choice = required` maps to `COMMON_CHAT_TOOL_CHOICE_REQUIRED`.
3. Required-tool grammar generation uses a minimum tool-call count of one for supported parser/template paths.
4. Qwen 2.5 and Qwen 2.5 Coder are supported function-calling families under the pinned runtime's documented `--jinja` path.
5. Streaming partial responses are produced from incremental `common_chat_msg_diff` state created by partial parsing.
6. At finalization, the runtime reparses the accumulated generated text with `is_partial = false` into `oaicompat_msg`.
7. The final OpenAI-compatible streaming `finish_reason` is then computed from that final reparsed `oaicompat_msg`: for EOS/word stop it is `tool_calls` only when final `oaicompat_msg.tool_calls` is non-empty; otherwise it is `stop`.
8. Therefore the terminal `finish_reason` and the structured tool-call deltas previously emitted to a streaming client come from related but not identical parser states: incremental partial state versus final full-message reparse.

These facts do **not** prove that run `33963864733` contained a complete valid tool call before its terminal event, because the current Delethos parser throws as soon as it sees a terminal reason other than `tool_calls`. The failed run therefore does not retain a bounded normalized fact that distinguishes:

```text
A. no valid structured tool call was emitted before terminal stop;
B. only incomplete or malformed tool-call fragments were emitted before terminal stop;
C. exactly one complete canonical write call was emitted in structured streaming deltas, but the final llama.cpp reparse still emitted finish_reason = stop;
D. duplicate or otherwise contradictory terminal state occurred.
```

No one of A-D may be guessed from the existing machine record.

## Amendment 018 repair principle

The repair is **terminal-state reconciliation after complete structured-stream validation**, not a provider/model/runtime replacement and not a blanket relaxation of `finish_reason`.

The Layer A witness must continue to parse the bounded SSE stream fail closed and must still require exactly one complete canonical structured `write` call with exact path/content before Layer A can pass.

The parser may defer terminal classification until after it has accumulated all prior structured deltas and may accept either:

```text
finish_reason = tool_calls
```

or, only under the narrowly defined compatibility case below:

```text
finish_reason = stop
```

The compatibility case is valid **only if every stronger structured condition already passed before terminal classification**:

```text
exactly one tool-call index observed
exactly one tool-call id lineage observed
exact tool type = function
exact function name = write
arguments assemble into one valid JSON object
argument keys = exactly path and content
path = exact canonical R181 smoke path
content = exact canonical R181 smoke content
no second/duplicate tool call
no malformed SSE/JSON event
no wrong model identity
no output overflow
a single terminal event occurs before [DONE]
[DONE] is present exactly once and is final
```

Under this narrow case, `finish_reason = stop` is treated as a **pinned-runtime stream-terminal compatibility label**, not as evidence by itself. The structured deltas remain the evidence. No plain assistant text, raw transcript, headers, or arbitrary model output may be retained in the final machine record.

The parser must continue to reject:

- `stop` when zero complete canonical tool calls were accumulated;
- `stop` when only partial/incomplete tool-call fragments were accumulated;
- `stop` with a wrong tool name, wrong path/content, duplicate call, malformed arguments, wrong model, or any other structured contradiction;
- `length`, unknown terminal reasons, multiple terminal events, post-terminal non-`[DONE]` data, missing `[DONE]`, duplicate `[DONE]`, or any malformed SSE/JSON;
- plain-text-only completion regardless of terminal reason.

This amendment therefore does not weaken the requirement that the exact pinned server/model emit a complete canonical structured `write` call to the streaming client.

## Normalized Layer A evidence

The successful Layer A machine fact remains:

```text
llama_forced_tool_stream_witness_exact = true
```

The implementation may additionally retain only bounded normalized compatibility metadata such as:

```text
llama_forced_tool_stream_terminal = tool_calls | stop_after_exact_write
```

No raw prompt, model prose, tool-call transcript, headers, or response body may be persisted in the machine record.

A failure before the exact structured write is complete remains:

```text
failed_at = llama_forced_tool_stream_witness_exact
```

with a bounded reason that distinguishes at least:

```text
no_complete_tool_call_before_terminal
incomplete_tool_call_before_terminal
structured_tool_call_contradiction
terminal_state_contradiction
```

without exposing raw model text.

## Layers B and C remain unchanged

Amendment 018 does not alter the Pi request-shaping or durable evidence contracts established by Amendments 015 and 016.

Layer B still requires the exact real Pi first-request shaper witness:

```text
pi_first_request_shaper_witness_exact = true
```

with request 1 shaped only from absent tool choice to `required`, exactly one `write` tool, exact canonical model identity, ambient extensions disabled, and no widening of the provider payload beyond the already authorized Amendment 015 behavior.

Layer C still requires the exact durable Pi ToolCall/ToolResult write evidence, exact fixture mutation, exact natural process exit, and the full two-record audit before:

```text
pi_bounded_tool_write_smoke = true
pi_first_request_tool_choice_exact = true
```

OpenCode and every repository-integrity fact remain unchanged and mandatory.

## Deterministic implementation self-tests

Before any new provider execution, deterministic self-tests must prove at minimum:

1. the canonical `finish_reason = tool_calls` synthetic exact-write stream still passes;
2. a synthetic stream with one complete canonical structured `write` call followed by `finish_reason = stop` and exact final `[DONE]` passes;
3. the normalized evidence for that compatibility stream contains no assistant prose or raw transcript;
4. plain-text-only plus `stop` fails;
5. zero tool calls plus `stop` fails;
6. incomplete tool-call fragments plus `stop` fails;
7. wrong tool name plus `stop` fails;
8. wrong path/content plus `stop` fails;
9. duplicate tool calls plus `stop` fails;
10. malformed arguments plus `stop` fails;
11. wrong/missing model identity plus `stop` fails;
12. `length` or unknown terminal reason after a complete tool call fails;
13. duplicate terminal events fail;
14. any non-`[DONE]` event after terminal fails;
15. missing or duplicate `[DONE]` fails;
16. overflow and timeout behavior remain fail closed;
17. all Amendment 017 mixed-content positive/negative cases continue to pass/fail exactly as previously authorized;
18. all Amendment 016 Layer B/C audit ordering and durable Pi evidence tests remain unchanged;
19. all runtime/model/provider/Pi/OpenCode pins, URLs, archive/model digests, workflow trigger, runner matrix, permissions, and credential posture remain unchanged;
20. all existing R181 deterministic self-tests continue to pass.

These tests are shaping evidence only and do not complete R181.

## Exact implementation authority

Only after this amendment becomes canonical may one bounded implementation PR modify:

```text
scripts/recovery-provider-prereq.mjs
```

No other repository path is authorized unless a fresh independent substantive review finding proves that the one-file wrapper repair is impossible while preserving this amendment. Any scope expansion requires another docs-only canonical authority decision before code changes.

The following remain explicitly unauthorized under Amendment 018:

```text
scripts/recovery-provider-prereq-impl.mjs
.github/workflows/ci.yml
packages/adapters/src/pi.ts
packages/adapters/src/opencode.ts
packages/runtime/**
package.json
pnpm-lock.yaml
runtime/model URLs or pins
runtime/model digests
provider/model configuration
Pi/OpenCode versions
production code
```

No new dependency is authorized.

## Implementation qualification gate

The Amendment 018 implementation repair must, on one exact final head:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. preserve every exact canonical runtime/model/provider/CLI pin and download URL;
3. preserve the exact workflow and provider trigger predicate;
4. keep provider/Gold/real-agent execution skipped on pull-request code;
5. pass deterministic CI on Linux, macOS, and Windows;
6. pass all pre-install and post-install R181 deterministic self-tests on every required platform;
7. prove the new terminal-compatibility behavior and all negative cases fail closed;
8. prove Amendments 015-017 semantics remain intact;
9. receive a fresh independent substantive semantic review of that exact final head;
10. reconcile every substantive finding and leave zero unresolved substantive review threads;
11. verify exact base/head/tree/scope/checks/reviews/threads/mergeability immediately before merge;
12. merge only with expected-head protection;
13. pass canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
14. re-read canonical authority before creating any provider trigger commit.

Unavailable, skipped, stale-head, rate-limited, billing-blocked, summary-only, or self-review output is not independent substantive review PASS.

## One new bounded R181 execution authority

If and only if this amendment is canonical and every implementation qualification gate above is proven on canonical `main`, Amendment 018 authorizes exactly one new same-tree canonical R181 execution.

The trigger commit must:

- have exactly the already-qualified canonical implementation tree;
- change no repository content;
- have complete commit message exactly `[provider-prereq]` and nothing else;
- be created only after canonical post-merge deterministic Linux/macOS/Windows PASS;
- preserve canonical-main/repository/no-secret/`contents: read` workflow boundaries.

The Amendment 018 attempt is consumed when triggered regardless of PASS, FAIL, infrastructure error, cancellation, timeout, or unavailable result.

Run `33963864733` and every earlier R181 execution remain immutable historical evidence and must not be rerun, retried, or selectively replayed.

## Success and continuation boundary

`D003-R181` becomes complete only if the one Amendment 018-authorized execution independently emits PASS on Linux/x64, macOS/arm64, and Windows/x64 with every required canonical fact true, including:

```text
llama_forced_tool_stream_witness_exact
pi_first_request_shaper_witness_exact
pi_first_request_tool_choice_exact
pi_bounded_tool_write_smoke
all pre-existing runtime/model/Pi/OpenCode/repository facts
```

If any required platform fails or any required fact is missing/false:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

and no retry is authorized by this amendment.

Only a genuine three-platform R181 PASS may unlock the next canonical unit, `D003-R190`. This amendment grants no direct authority for R190, R200, R210, R211, R212, Gold promotion, Specification 003 closeout, or Specification 004.
