# Specification 003 Amendment 022 — R181 Layer-A Timeout-Budget Reconciliation

**Status:** `PROPOSED` until this amendment is independently qualified and merged to canonical `main`.  
**Task:** `D003-R181` bounded recovery authority only.  
**Exact proposal base:** `301b829719aa8bc04a5a7bbd947ab647c5f9a0a3`.  
**Consumed Amendment 021 execution:** workflow run `34047490114`, exact trigger commit `301b829719aa8bc04a5a7bbd947ab647c5f9a0a3`, exact tree `ae3e49837f73cd705f6615415d56793f80488650`.

## Purpose

Amendment 021 authorized exactly one same-tree canonical R181 execution after its Jinja source-normalization repair was independently qualified, merged, and post-merge verified. That attempt is consumed and must never be rerun or retried.

Workflow run `34047490114` completed deterministic core CI successfully on Linux, macOS, and Windows. The provider-prerequisite matrix then independently failed on all three required platforms at the same Layer-A fact:

```text
failed_at = llama_forced_tool_stream_witness_exact
failure_reason = request_timeout
```

The exact machine records were:

```text
Linux/x64   = FAIL / llama_forced_tool_stream_witness_exact / request_timeout
macOS/arm64 = FAIL / llama_forced_tool_stream_witness_exact / request_timeout
Windows/x64 = FAIL / llama_forced_tool_stream_witness_exact / request_timeout
```

Every platform independently established all prerequisite facts through the corrected active-template boundary and ordinary model completion:

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
server_chat_template_exact_pinned_qwen = true
server_chat_template_supports_tools = true
server_chat_template_supports_tool_calls = true
anonymous_nonempty_model_completion = true
```

Each platform then emitted:

```text
llama_forced_tool_stream_witness_exact = false
```

No platform reached Pi or OpenCode qualification. The remaining Pi, OpenCode, and final repository-invariant fields therefore remain false because execution stopped at Layer A; they are not negative provider findings about those later layers.

This amendment does not convert the consumed timeout into PASS. It reconciles only the wall-clock budget of the direct Layer-A witness so that the already-canonical `max_tokens = 2048` diagnostic can reach a machine-observable terminal result on the same bounded horizon already used by the downstream Pi write smoke.

## Evidence reconciliation

### Amendment 019 aligned output budget but retained the earlier request timeout

Amendment 019 changed only the direct Layer-A witness output ceiling from:

```text
max_tokens = 256
```

to:

```text
max_tokens = 2048
```

because `2048` is the already-canonical Pi model output ceiling. It deliberately retained:

```text
Layer-A request timeout = 120_000 ms
```

The consumed Amendment 019 run `33984333240` then observed:

```text
Linux/x64   = terminal_length_before_exact_write
macOS/arm64 = request_timeout
Windows/x64 = request_timeout
```

That run proved that a 2048-token Layer-A request can already outlive the 120-second request budget on required hosted qualification platforms.

### Amendments 020 and 021 repaired the active template boundary

Amendment 020 selected and verified the exact pinned tool-aware Qwen Jinja template and required runtime tool-capability attestation. Amendment 021 reconciled the raw pinned file with the exact pinned-runtime normalized `/props.chat_template` source.

The fresh consumed run `34047490114` is the first run to machine-prove, on every required platform, all of the following before Layer A:

```text
server_chat_template_exact_pinned_qwen = true
server_chat_template_supports_tools = true
server_chat_template_supports_tool_calls = true
anonymous_nonempty_model_completion = true
```

Therefore the Amendment 020/021 template repair is no longer the failing boundary. The first failing fact is now uniformly the Layer-A request timeout itself.

### The downstream Pi smoke already uses a 300-second bounded horizon

The already-canonical R181 Pi write-smoke contract uses:

```text
PI_TOOL_SMOKE_TIMEOUT_MS = 300_000
PI_TOOL_NATURAL_EXIT_GRACE_MS = 30_000
```

The direct Layer-A witness is a prerequisite diagnostic for the same pinned provider/model path. It proves only that the exact local server/model can emit one exact structured `write` call; it does not execute the tool. Keeping Layer A at a shorter 120-second horizon after its output budget was aligned to Pi's 2048-token model budget can cause the prerequisite diagnostic to terminate before the downstream canonical tool path's existing bounded horizon is exhausted.

This amendment therefore aligns only the Layer-A request timeout with the already-canonical Pi smoke timeout:

```text
120_000 ms -> 300_000 ms
```

This is a bounded timeout reconciliation, not an unbounded wait and not a relaxation of any semantic acceptance criterion.

## Preserved canonical identities

This amendment changes no selected runtime, runtime archive, runtime commit, model, provider, CLI version, digest, download URL, template bytes, template normalization rule, tool schema, prompt objective, output ceiling, permission boundary, credential posture, workflow trigger, runner matrix, Gold criterion, or downstream task ordering.

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
raw_template_git_blob = bdf7919a96cfe43d50914a007b9c0877bd0ec27e
Layer-A max_tokens = 2048
Layer-A stream = true
Layer-A tool_choice = required
Layer-A parallel_tool_calls = false
Layer-A temperature = 0
Pi tool smoke timeout = 300_000 ms
```

All prior R181 runs remain immutable historical evidence.

## Amendment 022 repair principle

The repair is **Layer-A timeout-budget alignment only**.

The generated R181 candidate must change exactly the direct `llamaForcedToolStreamWitness(...)` request timeout from:

```text
AbortSignal.timeout(120_000)
```

to:

```text
AbortSignal.timeout(300_000)
```

No other request field may change.

The value `300_000` is not newly invented execution latitude. It is the existing canonical `PI_TOOL_SMOKE_TIMEOUT_MS` used by the downstream R181 Pi tool-write smoke. The Layer-A diagnostic remains bounded and may still fail with the fixed code:

```text
request_timeout
```

if it does not reach a qualifying terminal result within that horizon.

## Semantic acceptance remains unchanged

Increasing the wall-clock horizon does not make any previously failing semantic result acceptable.

Layer A still requires exactly one complete structured `write` call with the canonical path and content under the existing parser contract. In particular:

- `finish_reason = tool_calls` remains the canonical successful terminal path;
- `finish_reason = stop` remains acceptable only under the existing Amendment 018 compatibility rule after one already-complete exact structured write;
- `finish_reason = length` remains FAIL;
- plain assistant text without the exact write remains FAIL;
- incomplete, malformed, wrong-name, wrong-path, wrong-content, duplicate, or contradictory tool calls remain FAIL;
- malformed SSE/JSON, overflow, wrong model identity, duplicate terminal events, missing/duplicate DONE, transport failure, and timeout remain FAIL;
- the Layer-A witness still does not execute the returned tool call.

No raw assistant text, SSE transcript, prompt, response body, header, credential, environment value, or stack trace may enter machine evidence.

## Layers B/C, OpenCode, and repository invariants remain unchanged

Amendment 022 does not alter any Pi or OpenCode behavior.

If and only if Layer A passes within the aligned timeout, the existing R181 candidate must continue through the unchanged required facts, including:

```text
pi_cli_version_exact_0_84_4
pi_requested_identity_exact
pi_observed_identity_exact
pi_nonempty_completion
pi_tool_allowlist_exact_write_only
pi_first_request_shaper_witness_exact
pi_bounded_tool_write_smoke
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

No later-layer fact may be inferred from the consumed Amendment 021 failure.

## Deterministic implementation self-tests

Before any new provider execution, deterministic self-tests must prove at minimum:

1. the direct Layer-A witness output ceiling remains exactly `max_tokens = 2048`;
2. all other Layer-A request keys and values remain exactly those established by Amendments 019-021;
3. the direct Layer-A witness contains exactly one request timeout and it is exactly `300_000` ms;
4. the direct Layer-A witness no longer contains the historical `120_000` ms request timeout;
5. the aligned Layer-A timeout equals the existing canonical `PI_TOOL_SMOKE_TIMEOUT_MS = 300_000`;
6. `PI_TOOL_NATURAL_EXIT_GRACE_MS = 30_000` remains unchanged;
7. canonical `tool_calls` exact-write streams still PASS;
8. canonical complete exact write followed by compatible `stop` still PASS;
9. every Amendment 019 fixed terminal/failure classification remains unchanged and fail-closed;
10. `request_timeout` remains an allowlisted FAIL code and never becomes PASS;
11. every Amendment 020 exact template/capability/server-argv/request-field self-test remains unchanged in meaning;
12. every Amendment 021 raw-template/runtime-normalization positive and negative test remains unchanged in meaning;
13. Pi request shaping, natural-exit grace, timeout, durable evidence, and tool-choice tests remain unchanged;
14. OpenCode permission/identity/write-smoke shaping remains unchanged;
15. runtime/model/provider/CLI pins, URLs, digests, workflow trigger, runner matrix, permissions, and no-secret posture remain unchanged;
16. normalized machine evidence remains bounded and contains no raw model/template/transcript text;
17. all existing repository tests and both pre-install and post-install R181 self-tests continue to PASS on Linux/macOS/Windows.

These are deterministic shaping tests only and do not complete R181.

## Exact implementation authority

Only after this amendment becomes canonical may one bounded implementation PR modify:

```text
scripts/recovery-provider-prereq.mjs
```

The implementation must preserve historical `applyAmendment019(...)`, `applyAmendment020(...)`, and `applyAmendment021(...)` transformations unchanged and add a distinct later:

```text
applyAmendment022(...)
```

The Amendment 022 transformation may only:

- change the generated Layer-A request timeout from exactly `120_000` to exactly `300_000` ms;
- add/update deterministic self-tests required to prove that exact timeout alignment and non-widening;
- add Amendment 022 discriminator/blob bookkeeping proving the transformation is present exactly once.

No other repository path is authorized. In particular, Amendment 022 does not authorize modification of:

```text
scripts/recovery-provider-prereq-impl.mjs
.github/workflows/ci.yml
packages/**
package.json
pnpm-lock.yaml
runtime/model/template/provider/CLI pins or URLs
production adapter code
```

No new dependency is authorized.

## Implementation qualification gate

The Amendment 022 implementation must, on one exact final head:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. preserve all exact runtime/model/template/provider/CLI pins, digests, and URLs;
3. preserve the exact workflow and exact `[provider-prereq]` trigger predicate;
4. keep provider/Gold/real-agent execution skipped on pull-request code;
5. pass deterministic Linux/macOS/Windows CI;
6. pass all pre-install and post-install R181 deterministic self-tests on every required platform;
7. prove only the Layer-A timeout changes and that it changes exactly `120_000 -> 300_000`;
8. prove Layer-A request semantics, parser semantics, output ceiling, template boundary, Pi/OpenCode behavior, and failure codes are otherwise unchanged;
9. receive a fresh independent substantive semantic/security review of the exact final head;
10. reconcile every substantive finding and leave zero unresolved substantive review threads;
11. verify exact base/head/tree/scope/checks/reviews/threads/mergeability immediately before merge;
12. merge only with expected-head protection;
13. pass canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
14. re-read canonical authority before creating any new provider trigger commit.

Unavailable, skipped, stale-head, rate-limited, billing-blocked, summary-only, or self-review output is not independent substantive review PASS.

## One new bounded R181 execution authority

If and only if this amendment is canonical and every Amendment 022 implementation qualification gate above is proven on canonical `main`, Amendment 022 authorizes exactly one new same-tree canonical R181 execution.

The trigger commit must:

- have exactly the already-qualified canonical implementation tree;
- change no repository content;
- have complete commit message exactly `[provider-prereq]` and nothing else;
- be created only after canonical post-merge deterministic Linux/macOS/Windows PASS;
- preserve canonical-main/repository/no-secret/`contents: read` workflow boundaries.

The Amendment 022 attempt is consumed when triggered regardless of PASS, FAIL, infrastructure error, cancellation, timeout, or unavailable result. It may not be rerun or retried.

Run `34047490114` and every earlier R181 execution remain immutable historical evidence and must not be rerun, retried, or selectively replayed.

## Success and continuation boundary

`D003-R181` becomes complete only if the one Amendment 022-authorized execution independently emits PASS on Linux/x64, macOS/arm64, and Windows/x64 with every canonical required fact true, including Layer A, Pi Layer B/C, OpenCode, and final repository invariants.

If any required platform fails or any required fact is false or missing:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

and no retry is authorized by this amendment.

Only a genuine three-platform R181 PASS opens canonical `D003-R190`.

This amendment does not itself authorize `D003-R190`, `D003-R200`, `D003-R210`, `D003-R211`, `D003-R212`, terminal Specification 003 closeout, or Specification 004.

## Non-claims

This amendment does not claim that 300 seconds will make R181 pass. It establishes only that the current direct Layer-A witness uses a 120-second horizon that is shorter than the already-canonical downstream Pi tool-smoke horizon after the Layer-A output budget was aligned to Pi's 2048-token model budget, and it defines one narrow bounded reconciliation without changing semantic acceptance or provider/model strategy.
