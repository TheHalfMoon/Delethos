# Specification 003 Amendment 018 — R181 Pinned Qwen Template and Capability Attestation

**Status:** `PROPOSED` until this amendment is independently qualified and merged to canonical `main`.  
**Task:** `D003-R181` repair/re-execution authority only.  
**Exact proposal base:** `03acf268d396b94be33fd8ccde8013dcac94b6f4`.  
**Exact proposal-base tree:** `2d1183759effeb1b3717983a86e17abe634486d6`.  
**Consumed Amendment 017 execution:** workflow run `33963864733`, exact trigger commit `03acf268d396b94be33fd8ccde8013dcac94b6f4`.

## Purpose

Amendment 017 authorized exactly one new same-tree R181 execution after its one-file implementation repair qualified and merged. That attempt was consumed by exact commit message `[provider-prereq]` at `03acf268d396b94be33fd8ccde8013dcac94b6f4` and must never be rerun, retried, or selectively replayed.

Workflow run `33963864733` completed deterministic core CI successfully on Linux, macOS, and Windows, then independently failed the provider-prerequisite job on all three required platforms at the same earliest runtime boundary:

```text
failed_at = llama_forced_tool_stream_witness_exact
failure_reason = llama forced-tool stream terminal reason contradicted a tool call
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

The attempt failed before Pi or OpenCode execution. Their later facts therefore remained false without implying that those paths ran.

This amendment does not reinterpret that failure as PASS. It authorizes one narrow repair to eliminate an unqualified template-selection dependency in Layer A while preserving the exact runtime, model, provider, CLI, network, credential, and Gold boundaries.

## Preserved canonical identities

The following remain unchanged:

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

All platform runtime archive SHA-256 pins and exact download URLs remain unchanged.

## Exact source reconciliation after run 33963864733

The post-failure investigation used exact public source corresponding to the already pinned llama.cpp commit `c1d0e7a004015f23bc0233470b747b596f29b264`.

### Authoritative terminal semantics

The pinned server's final OpenAI-compatible streaming response computes the terminal reason from the server's final parsed chat message:

```text
if final parsed tool_calls is empty:
    finish_reason = stop
else:
    finish_reason = tool_calls
```

The final result updates its chat message by re-parsing the completed generated text before serializing the terminal stream event. The incremental diff logic also fails if a previously parsed tool call disappears from a later parsed state.

Therefore the three-platform `finish_reason = stop` result is evidence that the authoritative final server parse contained no structured tool call. Amendment 018 does **not** authorize accepting `stop`, plain text, or a content-only response as a successful Layer A witness.

### Required-tool semantics

The same pinned source maps OpenAI `tool_choice = required` to `COMMON_CHAT_TOOL_CHOICE_REQUIRED`. Its grammar construction requires at least one tool call when tools are present under required choice. This preserves the technical validity of the Layer A discriminator; the observed `stop` indicates that the concrete template/parser path used by the exact GGUF must be made explicit rather than weakened.

### Pinned same-runtime Qwen template

The same exact llama.cpp runtime commit contains:

```text
path = models/templates/Qwen-Qwen2.5-7B-Instruct.jinja
source_commit = c1d0e7a004015f23bc0233470b747b596f29b264
git_blob = bdf7919a96cfe43d50914a007b9c0877bd0ec27e
```

That template explicitly renders OpenAI-style tool definitions into Qwen 2.5 `<tool_call>` instructions and parses the same Qwen 2.5 tool-call surface used by the selected Qwen2.5-Coder model family.

Using this exact template does not select a different runtime, model, provider, remote service, credential, or production adapter. It removes dependence on an otherwise unqualified embedded-GGUF template choice by binding the R181 qualification server to source already pinned by the canonical runtime commit.

### Capability reporting

The pinned server exposes `GET /props` on the existing loopback server. Its response includes `chat_template_caps`, produced by `common_chat_templates_get_caps(...)` from the selected template. The capability map includes at least:

```text
supports_tools
supports_tool_calls
supports_parallel_tool_calls
```

This endpoint requires no new network authority and no model inference. The R181 candidate may retain only normalized boolean facts from this endpoint; it must not persist the raw template or the full `/props` body.

## Amendment 018 repair principle

The repair is **same-runtime template pinning plus capability attestation and exact single-call request shaping**.

It is not a model change, runtime update, provider change, parser bypass, Gold relaxation, or new provider strategy.

After the runtime archive and model bytes have already passed their existing digest checks, the implementation may retrieve the exact Qwen template from the exact pinned llama.cpp commit over the existing public no-auth GitHub transport, verify the returned bytes against the exact canonical template identity, place it only in runner-temporary storage, and start the already authorized loopback `llama-server` with that exact template using `--chat-template-file` together with the existing `--jinja` posture.

The implementation must fail closed if the template bytes, source binding, path, or expected identity do not match.

The temporary template file must never be committed to the repository, persisted as an artifact, or treated as production configuration.

## Layer A capability attestation

After the loopback server becomes healthy and before any model completion witness, the candidate must query only the existing loopback `GET /props` endpoint and require:

```text
chat_template_caps.supports_tools = true
chat_template_caps.supports_tool_calls = true
```

The candidate may also record the normalized value of `supports_parallel_tool_calls` for diagnostics, but that value does not widen authority.

A successful normalized machine fact is:

```text
llama_pinned_template_capability_exact = true
```

Missing, malformed, non-boolean, contradictory, oversized, remote, or unavailable `/props` data is FAIL.

No raw `chat_template`, prompt text, model output, or complete `/props` body may enter the final machine record.

## Exact single-call Layer A request

The existing forced-tool Layer A request remains bound to:

```text
endpoint = existing canonical loopback /v1/chat/completions
model = delethos-qwen25-coder-1.5b-q4km
stream = true
tool_choice = required
tools = exactly one OpenAI function tool named write
```

Amendment 018 additionally requires:

```text
parallel_tool_calls = false
```

This is a narrowing, not a widening: the witness already requires exactly one complete `write` call and rejects duplicate calls.

The existing exact schema, path/content, model-identity checks, bounded response handling, mixed-content reconciliation from Amendment 017, and terminal requirements remain mandatory.

Successful Layer A still requires all of:

```text
exactly one complete canonical structured write tool call
exact canonical path/content arguments
finish_reason = tool_calls
exact terminal ordering
bounded response size
exact model identity
```

`finish_reason = stop`, missing tool calls, plain text, malformed SSE/JSON, wrong model, wrong tool, duplicate calls, malformed arguments, output overflow, timeout, or any non-loopback transport remains FAIL.

## Deterministic implementation self-tests

Before any new provider execution, deterministic self-tests must prove at minimum:

1. the exact template source commit/path/blob identity is pinned and cannot drift;
2. template retrieval is public, bounded, no-auth, runner-temporary only, and fail closed on byte/source mismatch;
3. the server launch contains exactly one `--chat-template-file` pointing to the verified temporary template and retains `--jinja`, loopback host, canonical model alias, existing context bounds, and zero-GPU posture;
4. no repository file, package, workflow, model, runtime archive, provider, Pi, or OpenCode pin changes;
5. `/props` capability validation accepts only exact normalized boolean capability facts and rejects malformed/missing/remote/oversized data;
6. the Layer A request includes `parallel_tool_calls = false` exactly once and still contains exact `stream = true`, `tool_choice = required`, canonical model identity, and exactly one `write` schema;
7. the Layer A parser still requires exactly one complete canonical structured write call and `finish_reason = tool_calls`;
8. mixed assistant content plus the exact structured call remains acceptable only under Amendment 017 semantics; plain-text-only/no-tool remains FAIL;
9. model identity and terminal-order hardening remain fail closed;
10. Amendment 015 first-request-only Pi shaping, Amendment 016 Layer B/C evidence, durable Pi ToolCall/ToolResult validation, and all OpenCode evidence remain unchanged;
11. every existing R181 deterministic self-test continues to pass.

These tests are shaping evidence only and do not complete R181.

## Exact implementation authority

Only after this amendment becomes canonical may one bounded implementation PR modify:

```text
scripts/recovery-provider-prereq.mjs
```

No other repository path is authorized unless a fresh independent substantive review finding proves the one-file wrapper repair impossible while preserving this amendment. Such a finding requires another docs-only canonical authority decision before implementation scope broadens.

The implementation may create the verified template only under runner-temporary storage at execution time. It may not add the template as a repository file.

The following remain unauthorized for modification under Amendment 018:

```text
scripts/recovery-provider-prereq-impl.mjs
.github/workflows/ci.yml
packages/adapters/src/pi.ts
packages/adapters/src/opencode.ts
packages/runtime/**
package.json
pnpm-lock.yaml
runtime/model URLs or pins
provider/model identities
Pi/OpenCode versions
production code
```

No new production dependency is authorized.

## Implementation qualification gate

The Amendment 018 implementation repair must, on one exact final head:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. preserve every exact canonical runtime/model/provider/CLI pin and all existing runtime/model download URLs except the newly authorized pinned same-runtime template retrieval;
3. preserve the exact `[provider-prereq]` workflow trigger predicate and `contents: read` boundary;
4. keep provider/Gold/real-agent execution skipped on pull-request code;
5. pass deterministic CI on Linux, macOS, and Windows;
6. pass all pre-install and post-install R181 deterministic self-tests on every required platform;
7. prove template pinning, capability attestation, explicit single-call shaping, and all fail-closed cases above;
8. receive a fresh independent substantive semantic/security review of that exact final head;
9. reconcile every substantive finding and leave zero unresolved substantive review threads;
10. verify exact base/head/tree/scope/checks/reviews/threads/mergeability immediately before merge;
11. merge only with expected-head protection;
12. pass canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
13. re-read canonical authority before creating any provider trigger commit.

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

Run `33963864733`, run `33960124086`, run `33926705106`, run `33877530134`, and every earlier R181 execution remain immutable historical evidence and must never be rerun, retried, or selectively replayed.

## Success and continuation boundary

`D003-R181` becomes complete only if the one Amendment 018-authorized execution independently emits PASS on Linux/x64, macOS/arm64, and Windows/x64 with every required canonical fact true, including:

```text
llama_pinned_template_capability_exact
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

- rerunning or retrying run `33963864733` or any earlier R181 run/job;
- accepting `finish_reason = stop` as successful tool-call evidence;
- accepting plain text or mixed content without exactly one complete canonical structured `write` call;
- persisting or exposing raw model output, prompts, transcripts, reasoning, raw chat templates, or complete `/props` responses;
- changing the runtime release/commit, runtime archive pins, model revision/file/digest, provider identity, Pi version, or OpenCode version;
- remote providers, proxies, relay services, secrets, tokens, credentials, stored authentication, or paid APIs;
- persistent model-level `tool_choice` or `samplingParams`;
- forcing the second or later Pi provider request;
- widening the Pi tool allowlist beyond the active exact case;
- weakening durable Pi ToolCall/ToolResult validation;
- widening OpenCode permissions;
- Gold promotion;
- `D003-R190`, `D003-R200`, `D003-R210`, `D003-R211`, or `D003-R212` before R181 passes;
- Specification 004 activation.

## Amendment 018 qualification gate

This docs-only amendment proposal must itself:

1. be based on exact canonical revision `03acf268d396b94be33fd8ccde8013dcac94b6f4` and tree `2d1183759effeb1b3717983a86e17abe634486d6`;
2. change only this amendment document unless a substantive independent review requires another Specification 003 documentation path;
3. execute no provider/model/runtime during the amendment PR;
4. pass deterministic Linux/macOS/Windows CI at the exact PR head with provider execution skipped;
5. receive a fresh independent substantive semantic/security review of the exact final head;
6. reconcile every substantive finding and leave zero unresolved substantive review threads;
7. preserve unavailable, skipped, billing-blocked, rate-limited, stale, or summary-only review output as non-PASS;
8. verify exact base/head/tree/scope/checks/reviews/threads/mergeability immediately before merge;
9. merge only with expected-head protection;
10. require canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
11. re-read canonical Amendment 018 authority before implementation begins.

## Resulting frontier if canonicalized

If Amendment 018 qualifies, merges, passes canonical post-merge deterministic CI, and authority is re-read:

```text
D003-R181 = ACTIVE_REPAIR_AUTHORIZED
AMENDMENT_017_ATTEMPT = CONSUMED_FAIL
AMENDMENT_018_IMPLEMENTATION = NEXT_AUTHORIZED_UNIT
D003-R190 = BLOCKED_ON_R181
D003-R200 = BLOCKED_ON_R190
D003-R210 = BLOCKED
D003-R211 = BLOCKED
D003-R212 = BLOCKED
SPEC_003_STATUS = ACTIVE_BLOCKED_REAL_GOLD
SPEC_004 = NOT_AUTHORIZED
```
