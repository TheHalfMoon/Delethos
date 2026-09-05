# Specification 003 Amendment 020 — R181 Pinned Tool-Aware Template and Capability Reconciliation

**Status:** `PROPOSED` until this amendment is independently qualified and merged to canonical `main`.  
**Task:** `D003-R181` bounded recovery authority only.  
**Exact proposal base:** `80c9c97a0561b26253c3fd904c1fed608c12033c`.  
**Consumed Amendment 019 execution:** workflow run `33984333240`, exact trigger commit `80c9c97a0561b26253c3fd904c1fed608c12033c`, exact tree `5b9e2ccf6d171122f06dd48635b1a7988cb7b1f4`.

## Purpose

Amendment 019 authorized exactly one same-tree canonical R181 execution after its Layer-A budget repair was independently qualified, merged, and post-merge verified. That attempt is consumed and must never be rerun or retried.

Workflow run `33984333240` completed deterministic core CI successfully on Linux, macOS, and Windows, then failed the provider-prerequisite job on all three required platforms at the same Layer-A fact:

```text
failed_at = llama_forced_tool_stream_witness_exact
```

The bounded normalized failure reasons were:

```text
Linux/x64   = terminal_length_before_exact_write
macOS/arm64 = request_timeout
Windows/x64 = request_timeout
```

Every platform independently proved all prerequisite facts through:

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

No platform reached Pi or OpenCode qualification. Linux exhausted the canonical Layer-A `max_tokens = 2048` ceiling without establishing the exact structured write. macOS and Windows remained inside the same Layer-A request until the canonical 120-second request timeout. The Amendment 019 attempt is consumed regardless of this result.

This amendment does not convert any failure into PASS. It authorizes one bounded reconciliation of the exact local chat-template/tool-capability boundary before any later R181 execution may be considered.

## Preserved canonical identities

This amendment changes no selected runtime, runtime release asset, model, provider, CLI version, digest, download URL, workflow trigger, credential posture, Gold criterion, or downstream task ordering.

```text
runtime_release = b10621
runtime_commit = c1d0e7a004015f23bc0233470b747b596f29b264
model_repository = Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF
model_revision = 2ab9f8f42af02fc212effaef7c4850c885e965f4
model_file = qwen2.5-coder-1.5b-instruct-q4_k_m.gguf
model_sha256 = cc324af070c2ecbfd324a30884d2f951a7ff756aba85cb811a6ec436933bb046
provider_id = delethos-local-llama
model_id = delethos-qwen25-coder-1.5b-q4km
pi = 0.84.4
opencode = 1.18.26
```

The consumed run `33984333240` and all earlier R181 runs remain immutable historical evidence.

## Exact source reconciliation

The post-failure investigation used exact public source corresponding to the already pinned llama.cpp runtime commit and established the following facts.

### Tool choice does not guarantee an immediate tool call

At the pinned runtime, OpenAI-compatible `tool_choice` is parsed as a string and supports the canonical values `auto`, `none`, and `required`. There is no separately qualified named-function object route in the current Delethos strategy.

For required tool choice, the pinned chat parser may still accept bounded assistant content before the required tool call. Therefore `tool_choice = required` does not itself prove that the model must emit the call before consuming the request token/time budget.

This source behavior is consistent with the fresh machine result: Linux reached the full `2048` Layer-A output ceiling before an exact write was established, while macOS and Windows timed out in the same request.

### Tool-aware Jinja is an explicit runtime surface

The pinned llama.cpp function-calling documentation states that OpenAI-style function calling is used by `llama-server` with `--jinja`, that Qwen 2.5 and Qwen 2.5 Coder are supported native tool-call families, and that a `--chat-template-file` override may be required when the model metadata does not expose the right tool-use-compatible Jinja template.

The same pinned runtime tree contains this tool-aware Qwen 2.5 template:

```text
source_repository = ggml-org/llama.cpp
source_commit = c1d0e7a004015f23bc0233470b747b596f29b264
source_path = models/templates/Qwen-Qwen2.5-7B-Instruct.jinja
git_blob = bdf7919a96cfe43d50914a007b9c0877bd0ec27e
```

That exact template renders the supplied tool signatures inside `<tools>` and directs assistant tool calls through `<tool_call>` records. It is part of the already pinned runtime source tree; selecting its exact bytes does not change the llama.cpp release or the Qwen model weights.

### `/props` exposes the active template surface

At the pinned runtime, `GET /props` exposes normalized server metadata including:

```text
chat_template
chat_template_caps
```

The pinned Jinja capability structure includes at least:

```text
supports_tools
supports_tool_calls
supports_parallel_tool_calls
```

The existing R181 record does not attest these template/capability facts, so run `33984333240` cannot establish which active template/capability surface governed the failed Layer-A generation.

### Single-call intent must be explicit

The existing Layer-A request already exposes exactly one `write` function, but it omits `parallel_tool_calls`. The pinned server derives the omitted value from the active template capabilities. Because the R181 witness requires exactly one write call, the next bounded request must state:

```text
parallel_tool_calls = false
```

This does not widen tool authority. It makes the already single-call requirement explicit and deterministic.

## Amendment 020 repair principle

The repair is **same-runtime template selection plus capability attestation**, not a new model/provider/runtime strategy and not a larger generation budget.

The future implementation may preserve the exact Amendment 019 `max_tokens = 2048` and 120-second Layer-A timeout. It must not increase either value under this amendment.

The implementation may create one runner-temporary Jinja file containing exactly the pinned template bytes identified above, verify the exact Git-blob identity of those bytes, and launch the already canonical `llama-server` with that file as the explicit chat-template override in addition to the already required `--jinja` surface.

The temporary template must exist only under runner-owned qualification storage and must be deleted with the existing qualification tree. It must not be committed as a second repository file and must not alter the downloaded runtime or model archive.

## Required server template/capability attestation

After the exact server starts and before anonymous completion or Layer-A forced-tool execution, the candidate must perform one bounded loopback-only `GET /props` request and validate the active template surface fail closed.

At minimum, the candidate must establish normalized facts equivalent to:

```text
server_chat_template_exact_pinned_qwen = true
server_chat_template_supports_tools = true
server_chat_template_supports_tool_calls = true
```

The exact active `chat_template` returned by `/props` must match the pinned template bytes selected by this amendment. Comparison may use a deterministic SHA-256 or Git-blob calculation over the returned UTF-8 template; raw template text must not be copied into the final machine record.

`chat_template_caps.supports_tools` and `chat_template_caps.supports_tool_calls` must both be exactly `true`. Missing, malformed, false, duplicated, redirected, non-loopback, oversized, or contradictory `/props` evidence is FAIL.

`supports_parallel_tool_calls` may be observed for diagnostics, but it must not widen the witness: the Layer-A request itself must explicitly set `parallel_tool_calls = false`.

No raw template body, arbitrary server text, headers, credential material, or filesystem paths may enter the final machine record.

## Layer-A request under Amendment 020

The direct forced-tool witness remains bound to the same canonical loopback endpoint and same exact write objective. Its body must preserve all Amendment 019 fields and add only:

```text
parallel_tool_calls = false
```

The following remain exact:

```text
model = delethos-qwen25-coder-1.5b-q4km
stream = true
tool_choice = required
tools = exactly one function named write
temperature = 0
max_tokens = 2048
```

The tool schema remains exactly the canonical `path`/`content` string object with `additionalProperties = false`.

The Layer-A parser and Amendment 019 fixed failure-code contract remain fail closed. Plain-text-only output, missing/incomplete/wrong/duplicate tool calls, malformed SSE/JSON, wrong model, wrong arguments, `length` before or after the exact write, timeout, transport failure, overflow, duplicate terminal, unknown terminal, and all pre-existing contradiction classes remain FAIL.

This amendment does not authorize accepting `length` or timeout as success.

## Layer B, Layer C, OpenCode, and repository evidence remain unchanged

No Amendment 020 implementation may weaken or bypass:

- the Amendment 015 first-request-only Pi extension;
- `pi_first_request_shaper_witness_exact`;
- durable Pi ToolCall/ToolResult evidence;
- exact smoke file bytes and natural process exit;
- the full two-request Pi tool-choice audit;
- OpenCode identity, completion, policy, and bounded write-smoke facts;
- repository fixture-only and Git invariants;
- no-secret/no-hidden-commit/no-push/no-merge evidence.

The existing ordering remains Layer A → Pi Layer B/C → OpenCode → repository invariants.

## Deterministic implementation self-tests

Before any new provider execution, deterministic self-tests must prove at minimum:

1. the pinned template source text is exact and its Git blob is `bdf7919a96cfe43d50914a007b9c0877bd0ec27e`;
2. the runner-temporary template path is contained by qualification storage and cannot escape by symlink/reparse traversal;
3. the generated server command preserves every canonical argument and adds exactly one `--chat-template-file <runner-temporary-path>` pair;
4. the Layer-A request preserves every Amendment 019 field and adds exactly `parallel_tool_calls = false`;
5. `/props` validation accepts an exact synthetic pinned-template/capability record and rejects missing, wrong-template, malformed, false-tool-capability, false-tool-call-capability, oversized, redirected, or non-loopback cases;
6. raw template text cannot enter normalized machine evidence;
7. the Amendment 019 Layer-A parser/fixed failure-code self-tests remain unchanged in meaning and continue to pass;
8. `max_tokens` remains exactly `2048` and request timeout remains exactly 120 seconds;
9. every runtime/model/provider/Pi/OpenCode version, digest, URL, workflow trigger, runner matrix, checkout credential posture, and permission remains unchanged;
10. all existing R181 deterministic self-tests continue to pass before and after dependency installation.

These tests are shaping evidence only and do not complete R181.

## Exact implementation authority

Only after this amendment becomes canonical may one bounded implementation PR modify:

```text
scripts/recovery-provider-prereq.mjs
```

No other repository path is authorized. In particular, this amendment does not authorize modification of:

```text
scripts/recovery-provider-prereq-impl.mjs
.github/workflows/ci.yml
packages/**
package.json
pnpm-lock.yaml
runtime/model pins or URLs
production code
```

No new repository dependency is authorized.

## Implementation qualification gate

The Amendment 020 implementation must, on one exact final head:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. preserve all exact canonical runtime/model/provider/CLI pins and URLs;
3. preserve the exact workflow and `[provider-prereq]` trigger predicate;
4. keep provider/Gold/real-agent execution skipped on pull-request code;
5. pass deterministic Linux/macOS/Windows CI;
6. pass all pre-install and post-install R181 deterministic self-tests on every required platform;
7. prove the pinned-template, `/props`, explicit single-call, containment, and fixed failure-code boundaries fail closed;
8. receive a fresh independent substantive semantic/security review of that exact final head;
9. reconcile every substantive finding and leave zero unresolved substantive review threads;
10. verify exact base/head/tree/scope/checks/reviews/threads/mergeability immediately before merge;
11. merge only with expected-head protection;
12. pass canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
13. re-read canonical authority before creating any provider trigger commit.

Unavailable, skipped, stale-head, rate-limited, billing-blocked, summary-only, or self-review output is not independent substantive review PASS.

## One new bounded R181 execution authority

If and only if this amendment is canonical and every implementation qualification gate above is proven on canonical `main`, Amendment 020 authorizes exactly one new same-tree canonical R181 execution.

The trigger commit must:

- have exactly the already-qualified canonical implementation tree;
- change no repository content;
- have complete commit message exactly `[provider-prereq]` and nothing else;
- be created only after canonical post-merge deterministic Linux/macOS/Windows PASS;
- preserve canonical-main/repository/no-secret/`contents: read` workflow boundaries.

The Amendment 020 attempt is consumed when triggered regardless of PASS, FAIL, infrastructure error, cancellation, timeout, or unavailable result. It may not be rerun or retried.

## Success and continuation boundary

`D003-R181` becomes complete only if the one Amendment 020-authorized execution independently emits PASS on Linux/x64, macOS/arm64, and Windows/x64 with every canonical required fact true, including the new pinned-template/capability facts, Layer A, Pi Layer B/C, OpenCode, and repository invariants.

If any required platform fails or any required fact is false/missing:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

and no retry is authorized by this amendment.

Only a genuine three-platform R181 PASS opens canonical `D003-R190`. This amendment does not itself authorize `D003-R190`, `D003-R200`, `D003-R210`, `D003-R211`, `D003-R212`, Specification 003 closeout, or Specification 004.
