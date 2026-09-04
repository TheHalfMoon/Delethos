# Specification 003 Amendment 016 — R181 Runtime Discriminator and One New Bounded Attempt

**Status:** `PROPOSED` until this amendment is independently qualified and merged to canonical `main`.  
**Task:** `D003-R181` diagnostic repair/re-execution authority only.  
**Exact proposal base:** `46cd9574b07b0c3a1de69dd33099965ec3fe1f9d`.  
**Consumed Amendment 015 execution:** workflow run `33926705106`, exact trigger commit `46cd9574b07b0c3a1de69dd33099965ec3fe1f9d`, exact tree `4c748c48b0db9810e8f363826d21ba1867b37bff`.

## Purpose

Amendment 015 authorized one first-request-only Pi request-shaping repair and exactly one new same-tree canonical R181 execution after full implementation qualification. That attempt was consumed by exact commit message `[provider-prereq]` at `46cd9574b07b0c3a1de69dd33099965ec3fe1f9d` and must never be rerun.

Workflow run `33926705106` completed deterministic core CI successfully on Linux, macOS, and Windows, then independently failed the provider-prerequisite job on all three required platforms at the same boundary:

```text
failed_at = pi_first_request_tool_choice_exact
failure_reason = Pi write smoke required exactly one durable tool call/result; observed calls=0 results=0
```

For Linux/x64, macOS/arm64, and Windows/x64, the emitted records independently proved all prerequisite facts through:

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
pi_cli_version_exact_0_84_4 = true
pi_requested_identity_exact = true
pi_observed_identity_exact = true
pi_nonempty_completion = true
pi_tool_allowlist_exact_write_only = true
```

Every platform then observed zero durable Pi write ToolCall/ToolResult pairs. OpenCode execution was not reached. The Amendment 015 attempt is consumed regardless of this outcome.

This amendment does not convert that failure into PASS. It exists because the current wrapper verifies durable Pi write evidence before it reads the request-shaping audit. Consequently run `33926705106` does **not** establish whether:

1. the explicit Pi extension ran, validated the first real provider payload, and returned `tool_choice = required`, after which the llama.cpp/model/streaming path produced no durable Pi tool call; or
2. the explicit extension was loaded but failed closed on an unexpected real payload shape and requested abort before the provider request; or
3. another contradiction occurred between first-request shaping and durable Pi event parsing.

The next attempt must not repeat this ambiguity.

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

## Exact source reconciliation after run 33926705106

The post-failure investigation used exact public source corresponding to the already pinned components and found no authority to infer a PASS from source inspection alone.

### Pi `0.84.4`

The exact Pi source establishes:

- `Agent.createLoopConfig()` forwards `onPayload` but does not synthesize a default `toolChoice`; absent tool choice therefore remains absent before the Amendment 015 extension runs.
- the OpenAI-compatible completions adapter constructs `model`, `messages`, and `tools`, invokes `options.onPayload(params, model)` immediately before the HTTP request, and replaces the request params when the callback returns a non-`undefined` payload;
- ordinary JSON-schema tools are serialized as OpenAI `type = function` tools with the original tool name;
- the built-in `write` tool is named exactly `write` and has exactly the required string parameters `path` and `content`;
- `DefaultResourceLoader` retains explicitly supplied CLI extension paths when `noExtensions = true`; `--no-extensions` disables ambient/discovered extensions but does not suppress an explicit temporary `--extension <path>`;
- `before_provider_request` handler returns are chained into the provider payload.

Therefore removing `--no-extensions`, widening extension discovery, changing Pi packages, or patching the Pi binary is not justified by the available evidence and remains unauthorized.

### llama.cpp `b10621`

The exact pinned llama.cpp source establishes:

- `/v1/chat/completions` accepts OpenAI-compatible tools when `--jinja` is enabled;
- `tool_choice = required` maps to `COMMON_CHAT_TOOL_CHOICE_REQUIRED`;
- when tools are present and tool choice is not `none`, server request processing enables tool-call parsing;
- the native/generic chat machinery supports Qwen 2.5 and Qwen 2.5 Coder function calling;
- required tool choice uses non-optional tool-call grammar semantics rather than the lazy `auto` path.

These source facts make a bounded loopback server witness technically meaningful, but they are not runtime evidence that the exact pinned GGUF and exact release binary emitted a tool call in run `33926705106`.

## Amendment 016 repair principle

The repair is **evidence ordering plus bounded runtime discrimination**, not a new provider strategy.

The next implementation must preserve the Amendment 015 first-request-only shaper and add enough bounded evidence to distinguish these layers before the durable Pi write assertion can erase the distinction:

```text
layer A = exact local llama.cpp forced-tool streaming witness
layer B = exact real Pi first-request shaper witness
layer C = exact durable Pi ToolCall/ToolResult write evidence
```

A PASS still requires all three layers plus every pre-existing R181 fact. A failure at any layer remains FAIL, but its machine record must identify the earliest failed layer without pretending that later layers ran.

## Layer A — direct loopback forced-tool streaming witness

After the exact runtime/model/server identity and ordinary anonymous completion facts pass, and before the Pi write-smoke process begins, the R181 candidate may perform one bounded direct request to the already running canonical loopback llama.cpp server.

The request must:

```text
endpoint = existing canonical http://127.0.0.1:<ephemeral-port>/v1/chat/completions
model = delethos-qwen25-coder-1.5b-q4km
stream = true
tool_choice = required
tools = exactly one OpenAI function tool named write
```

The `write` function schema must contain only the canonical Pi write input surface required for this witness:

```text
path: string
content: string
required: [path, content]
```

The prompt must request exactly one `write` call for the existing R181 smoke filename/content and must not authorize any other action. The direct witness does **not** execute the returned tool call and therefore must not modify any repository or fixture file.

The witness must parse the bounded streaming response fail closed and require exactly one structured tool call for `write` with JSON arguments that resolve to the exact smoke path/content. Plain-text-only completion, malformed SSE/JSON, missing or multiple tool calls, wrong tool name, wrong model identity, contradictory finish state, output overflow, timeout, or any non-loopback transport is FAIL.

The successful machine fact is:

```text
llama_forced_tool_stream_witness_exact = true
```

No prompt text, model prose, arbitrary response body, headers, or raw transcript may be emitted into the final machine record. Only bounded normalized facts may be retained.

This witness uses no secret, no credential, no remote provider, and no additional model/runtime download. It is a local prerequisite observation against the exact server already required by R181.

## Layer B — real Pi first-request shaper witness

The Amendment 015 temporary extension contract remains unchanged:

- exactly one explicit runner-temporary extension;
- ambient extensions remain disabled with `--no-extensions`;
- exactly one `before_provider_request` handler;
- exactly the `write` tool is available;
- request 1 may add only `tool_choice = required` after exact validation;
- request 2, if reached after exactly one successful write ToolResult, is unchanged and unforced;
- malformed, contradictory, third-request, or widened state fails closed via `ctx.abort()`.

The implementation must change the **evidence ordering** so that the real Pi request-shaping audit is inspected before `requireExactPiWriteEvidence(...)` can terminate the candidate.

A new bounded validator may accept an audit prefix containing the exact first record only:

```text
request = 1
model = delethos-qwen25-coder-1.5b-q4km
tool_count = 1
tool_name = write
incoming_tool_choice = absent
outgoing_tool_choice = required
```

Only after this exact record is read from the audit generated by the **real Pi write-smoke process** may the candidate mark:

```text
pi_first_request_shaper_witness_exact = true
```

This diagnostic fact proves only that the real Pi first request reached the extension and was shaped as authorized. It does not prove a provider response, a Pi ToolCall, a tool execution, or R181 completion.

If the first record is absent, malformed, duplicated, contradictory, or accompanied by an unauthorized record, the run must fail at the shaper layer. It must not report `pi_first_request_shaper_witness_exact = true`.

The existing Amendment 015 full two-record validator and existing required fact remain stronger and unchanged in meaning:

```text
pi_first_request_tool_choice_exact = true
```

That fact may become true only after the successful write causes the canonical second unforced provider request and both exact audit records validate.

## Layer C — durable Pi evidence remains mandatory

After Layer B proves the first real request was shaped, the existing durable Pi evidence contract still requires exactly one matching write ToolCall/ToolResult pair and exact fixture content/integrity.

The implementation must not weaken, bypass, infer, or synthesize:

- Pi JSONL ToolCall/ToolResult evidence;
- exact `write` tool name and arguments;
- exact smoke file content;
- natural process exit;
- provider/model identity;
- malformed-event rejection;
- repository/Git invariants.

If Layer A and Layer B pass but durable Pi evidence still reports zero tool calls/results, the run is an exact Pi integration/response-consumption failure. It remains:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

and the Amendment 016 attempt is consumed. Any subsequent repair would require another bounded canonical amendment based on that new evidence.

## Machine failure discrimination

The candidate must produce a bounded failure classification without raw model or prompt data. At minimum:

```text
failed_at = llama_forced_tool_stream_witness_exact
```

means the exact local server/model forced-tool streaming witness failed before Pi write-smoke.

```text
failed_at = pi_first_request_shaper_witness_exact
```

means the direct server witness passed but the real Pi first request did not produce the exact authorized shaper audit record.

```text
failed_at = pi_bounded_tool_write_smoke
```

with both diagnostic facts true means the exact local server/model can emit the required streaming tool call and the real Pi outgoing request was shaped correctly, but Pi did not produce the exact durable write ToolCall/ToolResult evidence.

Later failures retain their existing exact fact names.

No failure class is permission to retry.

## Deterministic implementation self-tests

Before any new provider execution, deterministic self-tests must prove at minimum:

1. the Layer A request builder is bound only to an explicit loopback base URL and rejects non-loopback URLs;
2. the Layer A request contains exact canonical model identity, `stream = true`, `tool_choice = required`, and exactly one `write` function schema;
3. the Layer A streaming parser accepts one canonical synthetic tool-call stream and rejects plain-text-only, malformed, wrong-tool, duplicate-tool, malformed-arguments, wrong-path/content, overflow, and contradictory terminal cases;
4. the existing Amendment 015 request shaper still changes only request-1 `tool_choice` and still passes request 2 unchanged;
5. malformed messages/tool calls and unexpected request counts still fail closed with abort;
6. a first-record-only audit prefix can prove only `pi_first_request_shaper_witness_exact` and cannot satisfy the existing full two-record validator;
7. the existing full two-record audit still proves `pi_first_request_tool_choice_exact` only after the exact successful write continuation;
8. durable Pi ToolCall/ToolResult validation remains unchanged and executes after the real first-record audit witness;
9. completion-only Pi conformance remains extension-free;
10. the Pi write-smoke plan remains exactly write-only and explicit-extension-only under `--no-extensions`;
11. persistent model-level `samplingParams` remains absent;
12. exact runtime/model/provider/Pi/OpenCode pins, URLs, archive/model digests, workflow trigger, runner matrix, permissions, and credential posture remain unchanged;
13. all existing R181 deterministic self-tests continue to pass.

These tests are shaping evidence only and do not complete R181.

## Exact implementation authority

Only after this amendment becomes canonical may one bounded implementation PR modify:

```text
scripts/recovery-provider-prereq.mjs
```

No other repository path is authorized unless an independent substantive review finding proves that the one-file wrapper repair is impossible while preserving this amendment. Such a finding requires another docs-only canonical authority decision before scope broadens.

The wrapper may continue generating temporary candidate code, extension files, and audit files under runner-temporary storage. It may add the Layer A loopback witness and the Layer B audit-prefix validator described above.

The following remain unchanged and unauthorized for modification under Amendment 016:

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

The Amendment 016 implementation repair must, on one exact final head:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. preserve every exact canonical runtime/model/provider/CLI pin and download URL;
3. preserve the exact workflow and provider trigger predicate;
4. keep provider/Gold/real-agent execution skipped on pull-request code;
5. pass deterministic CI on Linux, macOS, and Windows;
6. pass all pre-install and post-install R181 deterministic self-tests on every required platform;
7. prove the new Layer A parser/request and Layer B audit-prefix behaviors fail closed;
8. prove all Amendment 015 explicit-extension and first-request-only semantics remain intact;
9. receive a fresh independent substantive semantic review of that exact final head;
10. reconcile every substantive finding and leave zero unresolved substantive review threads;
11. verify exact base/head/tree/scope/checks/reviews/threads/mergeability immediately before merge;
12. merge only with expected-head protection;
13. pass canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
14. re-read canonical authority before creating any provider trigger commit.

Unavailable, skipped, stale-head, rate-limited, billing-blocked, summary-only, or self-review output is not independent substantive review PASS.

## One new bounded R181 execution authority

If and only if this amendment is canonical and every implementation qualification gate above is proven on canonical `main`, Amendment 016 authorizes exactly one new same-tree canonical R181 execution.

The trigger commit must:

- have exactly the already-qualified canonical implementation tree;
- change no repository content;
- have complete commit message exactly `[provider-prereq]` and nothing else;
- be created only after canonical post-merge deterministic Linux/macOS/Windows PASS;
- preserve canonical-main/repository/no-secret/`contents: read` workflow boundaries.

The Amendment 016 attempt is consumed when triggered regardless of PASS, FAIL, infrastructure error, cancellation, timeout, or unavailable result.

Run `33926705106`, run `33877530134`, and every earlier R181 execution remain immutable historical evidence and must not be rerun, retried, or selectively replayed.

## Success and continuation boundary

`D003-R181` becomes complete only if the one Amendment 016-authorized execution independently emits PASS on Linux/x64, macOS/arm64, and Windows/x64 with every required canonical fact true, including:

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

and no additional R181 attempt is authorized without another new bounded canonical amendment.

Only after full three-platform R181 PASS may canonical authority be re-read for `D003-R190` in task order.

## Non-authority

This amendment does not authorize:

- rerunning or retrying workflow `33926705106`, `33877530134`, or any earlier R181 run/job;
- changing runtime, release asset, archive SHA-256, model, model SHA-256, provider, Pi, or OpenCode pins;
- changing runtime/model download URLs;
- remote providers, proxies, relay services, secrets, tokens, credentials, stored authentication, or paid APIs;
- a new loopback proxy or provider re-registration;
- restoring persistent model-level `tool_choice` or `samplingParams`;
- forcing the second or later Pi provider request;
- widening the Pi tool allowlist beyond exactly `write`;
- executing the Layer A returned tool call;
- changing the Pi smoke path/content;
- changing OpenCode permissions/provider policy;
- weakening durable Pi or natural-exit evidence;
- workflow permission/event/ref/repository/matrix/runner changes;
- package patches, forked Pi/llama binaries, alternate packages, or new dependencies;
- Gold promotion;
- D003-R190/R200/R210/R211/R212 execution before R181 passes;
- Specification 003 closeout;
- Specification 004.

## Governance qualification for this amendment

This docs-only amendment PR must itself:

- be based on exact canonical `main` `46cd9574b07b0c3a1de69dd33099965ec3fe1f9d` unless canonical `main` moves before qualification, in which case authority must be re-read before merge;
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
