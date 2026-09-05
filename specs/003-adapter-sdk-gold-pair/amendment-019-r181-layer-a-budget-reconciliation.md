# Specification 003 Amendment 019 — R181 Layer-A Budget Reconciliation and One New Bounded Attempt

**Status:** `PROPOSED` until this amendment is independently qualified and merged to canonical `main`.  
**Task:** `D003-R181` diagnostic repair/re-execution authority only.  
**Exact proposal base:** `65284247604d05ab914ca2ae11442a30740b65e1`.  
**Consumed Amendment 018 execution:** workflow run `33970697387`, exact trigger commit `65284247604d05ab914ca2ae11442a30740b65e1`, exact tree `459efca35262a9ab901b3ddcd8ea24c12c9f4a8e`.

## Purpose

Amendment 018 authorized one stream-terminal reconciliation and exactly one new same-tree canonical R181 execution after full implementation qualification. That attempt was consumed by exact commit message `[provider-prereq]` at `65284247604d05ab914ca2ae11442a30740b65e1` and must never be rerun.

Workflow run `33970697387` completed deterministic core CI successfully on Linux, macOS, and Windows, then independently failed the provider-prerequisite job on all three required platforms at the same boundary:

```text
failed_at = llama_forced_tool_stream_witness_exact
failure_reason = llama forced-tool stream terminal_state_contradiction
```

For Linux/x64, macOS/arm64, and Windows/x64, the emitted records independently proved every prerequisite fact through:

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
anonymous_nonempty_model_completion = true
```

Layer A then failed before Pi or OpenCode execution. The Amendment 018 attempt is consumed regardless of this outcome.

This amendment does not convert that failure into PASS. It narrows the next repair to the direct Layer-A witness budget, terminal discrimination, and bounded machine-failure serialization while preserving every provider/runtime/model identity and every downstream R181 requirement.

## Exact source reconciliation after run 33970697387

The exact pinned llama.cpp runtime is:

```text
runtime_release = b10621
runtime_commit = c1d0e7a004015f23bc0233470b747b596f29b264
```

At that exact commit, OpenAI-compatible streaming chat serialization has these relevant properties:

1. partial message/tool-call deltas are serialized with `finish_reason = null`;
2. the final result serializes any remaining parsed message/tool-call diffs before one terminal choice;
3. the terminal reason initializes to `length`;
4. only `STOP_TYPE_WORD` or `STOP_TYPE_EOS` changes that terminal reason, to `stop` when no parsed tool call exists or `tool_calls` when parsed tool calls exist;
5. the canonical request is a single completion, so the source-defined normal path does not require multiple terminal choices for one completion.

Amendment 018 already accepts `tool_calls` as canonical success and conditionally accepts `stop` only after one already-complete exact structured `write` call. Its `terminal_state_contradiction` bucket therefore still hides the source-defined single-completion `length` state as well as defensive duplicate/unsupported-terminal cases.

The Layer-A direct witness currently uses:

```text
max_tokens = 256
```

while the already-canonical Pi model configuration uses the bounded model output limit:

```text
maxTokens = 2048
```

The direct witness exists only to prove that the exact local canonical server/model can emit the required structured write call. A lower witness-only token ceiling must not create a prerequisite boundary that the canonical Pi path itself would not impose.

This source reconciliation does not assert that run `33970697387` machine-observed the literal terminal string `length`; the preserved record did not retain that normalized discriminator. The next implementation must make that distinction machine-observable without raw response data.

This source reconciliation does not authorize changing the model, runtime, provider, prompt objective, tool schema, Pi configuration, or Gold criteria. It authorizes only aligning the local diagnostic witness output ceiling with the already-canonical Pi model output ceiling, making terminal diagnostics exact, and preventing arbitrary error text from entering machine evidence.

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

All platform archive SHA-256 pins and all exact download URLs remain unchanged.

## Amendment 019 repair principle

The repair is **Layer-A witness budget alignment plus exact terminal classification plus fixed machine-failure codes**, not a new provider strategy.

The next implementation must preserve the entire Amendment 018 parser contract except for the bounded changes explicitly authorized below.

### 1. Align only the direct Layer-A witness output ceiling

The exact direct loopback witness request must change only:

```text
max_tokens: 256 -> 2048
```

The value `2048` is already the canonical Pi model output ceiling. It applies only to the direct Layer-A witness request.

The following remain unchanged:

```text
endpoint = existing canonical loopback /v1/chat/completions
model = delethos-qwen25-coder-1.5b-q4km
stream = true
tool_choice = required
tools = exactly one write function
write schema = exactly path:string + content:string
prompt objective = exactly one canonical smoke write
no tool execution in Layer A
temperature = 0
bounded timeout
bounded response bytes
```

The repair must not change Pi's model configuration, OpenCode configuration, runtime launch flags, runtime/model pins, or provider identity.

### 2. Replace generic terminal-state ambiguity with exact bounded diagnostics

The Layer-A parser must preserve all existing fail-closed behavior while distinguishing terminal failures without raw model text.

At minimum, normalized terminal classification must distinguish:

```text
duplicate_terminal_event
terminal_length_before_exact_write
terminal_length_after_exact_write
unknown_terminal_reason
```

`finish_reason = length` remains FAIL. Increasing the witness ceiling does not make `length` acceptable.

If the 2048-token witness still terminates with `length`, the run remains:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

and the Amendment 019 attempt is consumed. Any later repair requires another bounded canonical amendment based on the new machine evidence.

`finish_reason = tool_calls` remains canonical success. Amendment 018 `stop` compatibility remains valid only after one already-complete canonical structured `write` call and exact terminal/DONE ordering.

### 3. Fixed machine-failure-code serialization

The current immutable base implementation contains a generic `boundedReason(error)` path that can copy arbitrary `Error.message` text into `failure_reason`. That is incompatible with this amendment's bounded-evidence requirement.

The authorized wrapper **must** transform the runner-temporary generated candidate so that no caught arbitrary `Error.message` is serialized into the final machine record. The canonical file `scripts/recovery-provider-prereq-impl.mjs` remains unchanged on disk.

The generated candidate must implement a fixed-code failure contract:

```text
failed_at = exact required-fact boundary
failure_reason = fixed allowlisted code only
```

For Layer A, the allowlist must include at minimum:

```text
duplicate_terminal_event
terminal_length_before_exact_write
terminal_length_after_exact_write
unknown_terminal_reason
malformed_sse
malformed_json
response_overflow
request_timeout
loopback_transport_failure
no_complete_tool_call_before_terminal
incomplete_tool_call_before_terminal
structured_tool_call_contradiction
```

Known failures outside Layer A may use deterministic fixed codes defined by the generated candidate. Any caught error without an explicitly allowlisted code must serialize only:

```text
unclassified_internal_failure
```

It must never fall back to `error.message`, `String(error)`, raw response text, URL text derived from a response, headers, prompt text, model prose, tool arguments outside already-normalized booleans/enums, tokens, credentials, environment values, filesystem contents, or stack traces.

The wrapper may accomplish this by adding typed/code-bearing errors in the generated candidate and replacing the generated candidate's legacy `boundedReason`/failure serialization after Amendments 013-018 are applied. This is an authorized **runner-temporary candidate transformation inside `scripts/recovery-provider-prereq.mjs`**; it does not authorize modifying `scripts/recovery-provider-prereq-impl.mjs` itself.

### 4. Evidence-consumer contract

For Amendment 019 and later R181 evidence derived from this candidate:

- `failed_at` identifies the earliest failed required fact;
- `failure_reason` is an opaque fixed enum value, never prose;
- consumers must reject missing or non-allowlisted `failure_reason` on `outcome = FAIL`;
- consumers must not infer PASS from a failure code;
- terminal labels describe only normalized terminal state and whether an exact structured write was already complete;
- no consumer may require or reconstruct raw model text from the record;
- prior historical records remain immutable and are not rewritten to the new enum contract.

The parser and final record must not include assistant prose, raw SSE, raw response bodies, prompts, headers, tokens, arbitrary model text, credentials, or arbitrary caught error strings.

## Layers B and C remain unchanged

Amendment 019 does not alter the Pi request-shaping or durable evidence contracts established by Amendments 015 and 016.

Layer B still requires:

```text
pi_first_request_shaper_witness_exact = true
```

Layer C still requires:

```text
pi_bounded_tool_write_smoke = true
pi_first_request_tool_choice_exact = true
```

OpenCode and every repository-integrity fact remain unchanged and mandatory.

## Deterministic implementation self-tests

Before any new provider execution, deterministic self-tests must prove at minimum:

1. the direct Layer-A request builder uses exactly `max_tokens = 2048` and no other request field changes from Amendment 018;
2. `2048` equals the already-canonical Pi model output ceiling used by the R181 model configuration;
3. the canonical `finish_reason = tool_calls` exact-write stream still passes;
4. the Amendment 018 complete exact write followed by `stop` compatibility stream still passes;
5. plain-text-only, zero/incomplete/wrong/duplicate/malformed tool calls remain FAIL;
6. a first terminal `length` with no complete exact write is classified as `terminal_length_before_exact_write`;
7. a first terminal `length` after one complete exact write is classified as `terminal_length_after_exact_write` and remains FAIL;
8. an unsupported terminal value is classified as `unknown_terminal_reason` and remains FAIL;
9. a second terminal event after any terminal is classified as `duplicate_terminal_event` and remains FAIL;
10. any non-`[DONE]` event after terminal remains FAIL;
11. missing/duplicate `[DONE]`, malformed SSE/JSON, wrong/missing model identity, overflow, timeout, and non-loopback transport remain FAIL;
12. malformed SSE and JSON map only to fixed codes `malformed_sse` / `malformed_json`;
13. output overflow, timeout, and loopback transport failures map only to `response_overflow`, `request_timeout`, and `loopback_transport_failure` respectively;
14. an arbitrary unknown `Error.message` containing sentinel assistant prose maps only to `unclassified_internal_failure`;
15. sentinel strings shaped like HTTP headers, bearer credentials, access tokens, filesystem text, model prose, and tool arguments never appear in serialized `failure_reason` or any other final machine-record field;
16. every `outcome = FAIL` self-test record uses an allowlisted fixed `failure_reason` and rejects a missing/non-allowlisted value;
17. normalized evidence contains no assistant prose or raw transcript;
18. all Amendment 017 mixed-content positive/negative cases remain unchanged;
19. all Amendment 018 stop-terminal compatibility positive/negative cases remain unchanged except for the more precise failure labels;
20. all Amendment 016 Layer B/C audit ordering and durable Pi evidence tests remain unchanged;
21. all runtime/model/provider/Pi/OpenCode pins, URLs, archive/model digests, workflow trigger, runner matrix, permissions, and credential posture remain unchanged;
22. all existing R181 deterministic self-tests continue to pass.

These tests are shaping evidence only and do not complete R181.

## Exact implementation authority

Only after this amendment becomes canonical may one bounded implementation PR modify:

```text
scripts/recovery-provider-prereq.mjs
```

Within that wrapper, the implementation may transform the runner-temporary generated candidate after Amendments 013-018 to:

1. align only the Layer-A witness `max_tokens` to `2048`;
2. emit the exact terminal classifications above;
3. replace legacy generated-candidate `boundedReason`/arbitrary-message serialization with the fixed allowlisted failure-code contract;
4. add deterministic self-tests and machine-record validation required by this amendment.

No other repository path is authorized unless a fresh independent substantive review finding proves that the one-file wrapper repair is impossible while preserving this amendment. Any scope expansion requires another docs-only canonical authority decision before code changes.

The following remain explicitly unauthorized for repository modification under Amendment 019:

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

The Amendment 019 implementation repair must, on one exact final head:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. preserve every exact canonical runtime/model/provider/CLI pin and download URL;
3. preserve the exact workflow and provider trigger predicate;
4. keep provider/Gold/real-agent execution skipped on pull-request code;
5. pass deterministic CI on Linux, macOS, and Windows;
6. pass all pre-install and post-install R181 deterministic self-tests on every required platform;
7. prove exact 2048 witness-budget shaping and the new terminal diagnostics fail closed;
8. prove every serialized FAIL record uses the fixed allowlisted failure-code contract and never arbitrary `Error.message` text;
9. prove sentinel prose/header/token/credential/tool-argument strings cannot reach final machine evidence;
10. prove Amendments 015-018 semantics remain intact;
11. receive a fresh independent substantive semantic/security review of that exact final head;
12. reconcile every substantive finding and leave zero unresolved substantive review threads;
13. verify exact base/head/tree/scope/checks/reviews/threads/mergeability immediately before merge;
14. merge only with expected-head protection;
15. pass canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
16. re-read canonical authority before creating any provider trigger commit.

Unavailable, skipped, stale-head, rate-limited, billing-blocked, summary-only, or self-review output is not independent substantive review PASS.

## One new bounded R181 execution authority

If and only if this amendment is canonical and every implementation qualification gate above is proven on canonical `main`, Amendment 019 authorizes exactly one new same-tree canonical R181 execution.

The trigger commit must:

- have exactly the already-qualified canonical implementation tree;
- change no repository content;
- have complete commit message exactly `[provider-prereq]` and nothing else;
- be created only after canonical post-merge deterministic Linux/macOS/Windows PASS;
- preserve canonical-main/repository/no-secret/`contents: read` workflow boundaries.

The Amendment 019 attempt is consumed when triggered regardless of PASS, FAIL, infrastructure error, cancellation, timeout, or unavailable result.

Run `33970697387`, run `33963864733`, and every earlier R181 execution remain immutable historical evidence and must not be rerun, retried, or selectively replayed.

## Success and continuation boundary

`D003-R181` becomes complete only if the one Amendment 019-authorized execution independently emits PASS on Linux/x64, macOS/arm64, and Windows/x64 with every required canonical fact true, including:

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
