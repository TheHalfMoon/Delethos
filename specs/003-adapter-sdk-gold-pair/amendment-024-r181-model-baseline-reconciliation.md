# Specification 003 Amendment 024 — R181 Model Baseline Reconciliation and One New Bounded Attempt

**Status:** `NORMATIVE` iff this file is present on canonical `main` while Specification 003 remains active.  
**Task:** `D003-R181` diagnostic repair/re-execution authority only.  
**Proposal base:** `48f188133cfe875ba0c8d40eb0bde7af9c281841`.  
**Consumed Amendment 023 execution:** run `34061956321`, trigger `48f188133cfe875ba0c8d40eb0bde7af9c281841`, tree `a803f475b3d404821765070a7bcae985d3ce99ba`.

## Purpose and preserved failure truth

Amendment 023 authorized exactly one new same-tree R181 execution after exact-head implementation qualification, independent substantive review, guarded merge, and canonical post-merge three-platform deterministic PASS. That attempt was consumed by canonical run `34061956321` and must never be rerun, retried, or selectively replayed.

The deterministic core matrix passed on Linux, macOS, and Windows. The provider prerequisite independently failed at the same earliest required boundary on every required platform:

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

Before the Layer-A failure, every required platform machine-observed all of the following as true:

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
```

Layer A remained false and Pi/OpenCode prerequisite execution was never reached. The downstream Pi/OpenCode, fixture-only, no-secret, and no-hidden-Git completion facts therefore remain false in the R181 record and are not promoted.

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

This amendment preserves run `34061956321` as immutable failure evidence. It does not reinterpret a failed job as PASS, infer raw model output that was not retained, or weaken the exact structured-write requirement.

## What Amendment 023 disproved

Amendment 023 changed only the direct Layer-A user message so that the model was explicitly instructed to emit no prose or reasoning before one exact structured `write` tool call. The request still used:

```text
stream = true
tool_choice = required
parallel_tool_calls = false
temperature = 0
max_tokens = 2048
request timeout = 300000 ms
one exact write tool
```

The same `terminal_length_before_exact_write` result on all three required platforms proves that prompt ambiguity was not sufficient to explain or repair the observed prerequisite failure. A second prompt-only repair is therefore not evidence-based.

## Exact pinned-runtime mechanics

The selected runtime remains llama.cpp release `b10621` at exact source commit:

```text
c1d0e7a004015f23bc0233470b747b596f29b264
```

At that source revision, `common_chat_tool_choice_parse_oaicompat` accepts `auto`, `none`, and `required`. More importantly, the tool grammar/parser path for required tool choice enforces at least one eventual tool call while permitting model content before the tool-call trigger. Relevant source structure is equivalent to:

```text
min_calls = required ? 1 : 0
...
reasoning + content-until-tool-trigger + tool_calls
```

The same pinned upstream test source explicitly records that its tiny-model required-tool test was disabled after content before tool calls became permitted for `tool_choice: required`, because the grammar alone can no longer force the tiny model directly into the tool call.

Pinned references:

```text
https://github.com/ggml-org/llama.cpp/blob/c1d0e7a004015f23bc0233470b747b596f29b264/common/chat.cpp
https://github.com/ggml-org/llama.cpp/blob/c1d0e7a004015f23bc0233470b747b596f29b264/tools/server/tests/unit/test_tool_call.py
https://github.com/ggml-org/llama.cpp/blob/c1d0e7a004015f23bc0233470b747b596f29b264/docs/function-calling.md
https://github.com/ggml-org/llama.cpp/blob/c1d0e7a004015f23bc0233470b747b596f29b264/scripts/tool_bench.py
```

This source evidence explains why `tool_choice = required` is not synonymous with “the first generated assistant content is a tool call.” It does **not** prove which exact tokens the failed model emitted; those tokens were intentionally not retained.

## Model-baseline diagnosis

The consumed R181 strategy used:

```text
provider_strategy_id = delethos-local-llama-qwen25-coder
Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF
qwen2.5-coder-1.5b-instruct-q4_k_m.gguf
```

The pinned llama.cpp real-model required-tool test matrix includes Qwen2.5 `1.5B-Instruct` and Qwen2.5-Coder `3B-Instruct` as real model targets. The pinned tool benchmark also includes Qwen2.5 `1.5B-Instruct` and larger Qwen2.5-Coder models. It does not establish the selected Coder-1.5B baseline as an equivalent required-tool target.

This difference is shaping evidence, not a claim that an upstream test run proves Delethos R181. Combined with the three-platform Delethos failure, it supports changing the selected model baseline before changing parser semantics, tool-choice semantics, runtime, or downstream adapter behavior.

A Coder-3B replacement is not selected here because the official Qwen2.5-Coder-3B model is distributed under the Qwen Research License, including a non-commercial restriction, rather than preserving the selected Apache-2.0 licensing posture. A 7B replacement would also materially increase the runner resource boundary without evidence that such an increase is necessary.

## Selected replacement model and strategy identity

The narrow replacement baseline is the official Qwen GGUF repository:

```text
provider_strategy_id = delethos-local-llama-qwen25-instruct
model_repository = Qwen/Qwen2.5-1.5B-Instruct-GGUF
model_revision = a615a81362316d7b9f5a7a9c4313adfdf9b54588
model_file = qwen2.5-1.5b-instruct-q4_k_m.gguf
model_sha256 = 6a1a2eb6d15622bf3c96857206351ba97e1af16c30d7a74ee38970e434e9407e
model_size_bytes = 1120000000 approximately
model_license = Apache-2.0
server_model_alias = delethos-qwen25-instruct-1.5b-q4km
```

The strategy identifier changes with the selected model family so that future machine evidence cannot label an Instruct-model execution as the retired Coder-model strategy. This is an identity correction coupled to the model-baseline replacement; it does not change the provider protocol, runtime, authentication posture, or tool semantics.

The exact file page at the pinned revision reports SHA-256:

```text
6a1a2eb6d15622bf3c96857206351ba97e1af16c30d7a74ee38970e434e9407e
```

and a remote size of approximately 1.12 GB, preserving the same practical model-size class as the consumed Coder-1.5B strategy.

Canonical shaping references:

```text
https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/blob/a615a81362316d7b9f5a7a9c4313adfdf9b54588/qwen2.5-1.5b-instruct-q4_k_m.gguf
https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/tree/main
https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct/blob/main/LICENSE
```

The qualification implementation must download only from the commit-specific `resolve` target for the pinned revision and independently verify the exact SHA-256 before the model is used. `main`, a floating tag, Xet identity alone, filename equality, successful parsing, or a cache hit is not model identity evidence.

## Preserved runtime and request semantics

This amendment changes the selected model baseline and its strategy/model identifiers only. It does **not** change the provider protocol, runtime, or Layer-A request semantics.

The following remain exact:

```text
provider_protocol = OpenAI-compatible HTTP API
provider_endpoint = loopback-only / ephemeral local port / /v1
provider_authentication = NONE
runtime = ggml-org/llama.cpp
runtime_release = b10621
runtime_commit = c1d0e7a004015f23bc0233470b747b596f29b264
stream = true
tool_choice = required
parallel_tool_calls = false
temperature = 0
max_tokens = 2048
request timeout = 300000 ms
bounded response bytes = unchanged
Layer A executes no tool
```

The complete Amendment 023 user message remains byte-for-byte unchanged:

```text
Emit no prose, reasoning, explanation, markdown, or other assistant text before the tool call. Your first emitted assistant content must be the structured write tool call. Call the write tool exactly once with path "delethos-r181-smoke.txt" and content "DELETHOS_R181_OK\n". Do not perform any other action.
```

The exact one-write schema remains unchanged. `finish_reason = length` remains FAIL before or after an exact write. Parser semantics, terminal discrimination, fixed failure codes, and fail-closed evidence ordering remain unchanged.

The pinned Amendment 020 chat template and its runtime `/props` capability attestation remain unchanged. The replacement belongs to the same Qwen2.5 Instruct family that the pinned llama.cpp function-calling documentation maps to the Hermes 2 Pro handler. R181 must still machine-prove exact active template identity plus `supports_tools = true` and `supports_tool_calls = true`; family similarity is not a substitute for that runtime attestation.

## Preserved downstream boundaries

Pi and OpenCode versions remain:

```text
pi = 0.84.4
opencode = 1.18.26
```

Their provider/model configuration must use the replacement canonical identities:

```text
provider_strategy_id = delethos-local-llama-qwen25-instruct
provider_id = delethos-local-llama
model_id = delethos-qwen25-instruct-1.5b-q4km
```

No Pi/OpenCode prompt, request-shaping rule, tool allowlist, permission policy, extension boundary, natural-exit rule, executable/version pin, or evidence parser changes under this amendment except the exact selected strategy/model identity propagated into the isolated provider configuration and expected requested/observed identity.

Pi/OpenCode remain genuine downstream evidence boundaries. A future failure after Layer A requires its own evidence-based reconciliation and may not be preemptively widened here.

## Why `tool_choice = auto` is not selected

Changing `required` to `auto` would alter the semantic forcing posture even though the pinned upstream real-model tests continue to exercise required-tool behavior. The new evidence shows that the consumed model failed to complete the required call; it does not prove that Delethos should weaken the request to optional tool use.

R181 still requires a real exact structured write. The narrower evidence-based next step is to use a same-size Apache-2.0 Qwen2.5 model family that upstream explicitly includes in its real required-tool test matrix while preserving Delethos's exact parser and request semantics.

## Deterministic implementation evidence

Before any new provider execution, self-tests must prove at minimum:

1. the replacement strategy identifier, repository, revision, filename, SHA-256, canonical alias, and commit-specific download URL are exact;
2. the old Coder-1.5B strategy identifier, model repository, filename, SHA-256, and model alias are absent from the generated Amendment 024 candidate where strategy/model identity is expected;
3. the runtime release/commit and every platform runtime archive pin remain unchanged;
4. the Amendment 020 pinned template bytes/blob and runtime-source normalization remain unchanged;
5. the complete Amendment 023 prompt remains exact by UTF-8 byte count and SHA-256;
6. `tool_choice = required`, `stream = true`, `parallel_tool_calls = false`, `temperature = 0`, `max_tokens = 2048`, and request timeout `= 300000 ms` remain exact;
7. the Layer-A request still has exactly one `write` tool with the existing exact path/content schema;
8. canonical exact-write `tool_calls` stream still passes;
9. exact-write-then-`stop` compatibility remains unchanged;
10. `terminal_length_before_exact_write` and `terminal_length_after_exact_write` remain FAIL;
11. malformed, duplicate, wrong, incomplete, malformed-SSE, malformed-JSON, overflow, and contradictory evidence remains FAIL;
12. Pi provider configuration contains only the replacement provider/model identity and preserves all isolation/tool boundaries;
13. OpenCode provider configuration contains only the replacement provider/model identity and preserves all default-deny/path/tool boundaries;
14. transformation discriminators prove that generated candidate changes are limited to replacement strategy/model identity/provenance and the deterministic tests necessary to prove that replacement;
15. workflow trigger, runner matrix, permissions, no-secret posture, runtime URLs, and all unrelated repository paths remain unchanged.

These are shaping tests only and do not complete R181.

## Exact implementation authority

Only after this amendment is canonical may one bounded implementation PR modify:

```text
scripts/recovery-provider-prereq.mjs
```

Within that wrapper it may only:

1. replace the selected provider-strategy identifier and model repository/revision/file/SHA-256/commit-specific download target with the Amendment 024 values;
2. replace the server model alias and corresponding Pi/OpenCode requested/observed model identity with `delethos-qwen25-instruct-1.5b-q4km`;
3. add deterministic model-identity/provenance/request-preservation self-tests;
4. add transformation discriminators proving no unrelated generated candidate section changed.

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
llama.cpp runtime release/commit
runtime archive pins
Amendment 020 pinned template
tool_choice semantics
Layer-A parser semantics
Pi/OpenCode versions
production code
```

No new dependency is authorized.

## Amendment 024 qualification gate

This docs-only amendment PR must itself:

1. be based on exact canonical revision `48f188133cfe875ba0c8d40eb0bde7af9c281841` unless live canonical truth changes before branch creation;
2. change only this amendment document unless a substantive independent review requires another Specification 003 documentation path;
3. pass deterministic Linux/macOS/Windows CI at the exact PR head;
4. keep provider/Gold/real-agent execution skipped on pull-request code;
5. receive fresh independent substantive semantic/security/governance review on the exact final head;
6. reconcile every substantive finding and leave zero unresolved substantive review threads;
7. preserve skipped, unavailable, rate-limited, billing-blocked, summary-only, stale-head, or self-review output as non-PASS;
8. reverify exact base/head/tree/scope/checks/reviews/threads/comments/mergeability immediately before merge;
9. merge only with expected-head protection;
10. require canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
11. re-read canonical authority before Amendment 024 implementation begins.

## Implementation qualification gate

The later one-file implementation must, on one exact final head:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. preserve exact runtime identities, platform pins, template identity, prompt, request semantics, workflow predicate, and `contents: read` permission;
3. keep provider/Gold/real-agent execution skipped on pull-request code;
4. pass deterministic CI on Linux, macOS, and Windows;
5. pass pre-install and post-install R181 self-tests on all required platforms;
6. prove exact replacement strategy/model identity, SHA-256, download target, and propagated provider/model identities;
7. receive fresh independent substantive semantic/security/governance review on that exact head;
8. reconcile all substantive findings and leave zero unresolved substantive review threads;
9. reverify exact base/head/tree/scope/checks/reviews/threads/mergeability immediately before merge;
10. merge only with expected-head protection;
11. pass canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
12. re-read canonical authority before any provider trigger.

## One new bounded R181 execution

If and only if this amendment and its implementation are canonical and every qualification gate above is proven on canonical `main`, Amendment 024 authorizes exactly one new same-tree R181 execution.

The trigger commit must:

- use exactly the already-qualified canonical implementation tree;
- change no repository content;
- have complete commit message exactly `[provider-prereq]`;
- be created only after canonical post-merge three-platform deterministic PASS;
- preserve canonical-main, repository, no-secret, and `contents: read` workflow boundaries.

The Amendment 024 attempt is consumed when triggered regardless of PASS, FAIL, infrastructure error, cancellation, timeout, or unavailable result. Run `34061956321` and every earlier R181 execution remain immutable historical evidence and must never be rerun or retried.

## Success and continuation boundary

`D003-R181` completes only if the one Amendment 024-authorized execution independently emits PASS on Linux/x64, macOS/arm64, and Windows/x64 with every required canonical fact true, including the exact Layer-A witness and all downstream Pi/OpenCode facts.

If any required platform fails or any required fact is missing/false:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

No retry is authorized by this amendment. Any later repair requires another bounded canonical amendment based on the new machine evidence.

Only a genuine three-platform R181 PASS may unlock the next canonical unit, `D003-R190`. This amendment grants no direct authority for R190, R200, R210, R211, R212, Gold promotion, Specification 003 closeout, or Specification 004.
