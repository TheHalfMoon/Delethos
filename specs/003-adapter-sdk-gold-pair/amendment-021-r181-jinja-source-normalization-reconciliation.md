# Specification 003 Amendment 021 — R181 Jinja Source-Normalization Reconciliation

**Status:** `PROPOSED` until this amendment is independently qualified and merged to canonical `main`.  
**Task:** `D003-R181` bounded recovery authority only.  
**Exact proposal base:** `034f5ab2dbba83183cf635115609118de34ad120`.  
**Consumed Amendment 020 execution:** workflow run `34042730137`, exact trigger commit `034f5ab2dbba83183cf635115609118de34ad120`, exact tree `99b3c17b55e66b42e582b56cbdda103b271d7411`.

## Purpose

Amendment 020 authorized exactly one same-tree canonical R181 execution after its implementation was independently qualified, merged, and post-merge verified. That attempt is consumed and must never be rerun or retried.

Workflow run `34042730137` completed deterministic core CI successfully on Linux, macOS, and Windows. The provider-prerequisite job then failed on all three required platforms at the same first post-model server-template fact:

```text
failed_at = server_chat_template_exact_pinned_qwen
failure_reason = unclassified_internal_failure
```

Each platform independently established the following facts before that failure:

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
```

The following facts were not established because execution stopped at the template-attestation boundary:

```text
server_chat_template_exact_pinned_qwen = false
server_chat_template_supports_tools = false
server_chat_template_supports_tool_calls = false
anonymous_nonempty_model_completion = false
llama_forced_tool_stream_witness_exact = false
```

No platform reached Pi or OpenCode qualification. The Amendment 020 attempt is consumed regardless of this result.

This amendment does not convert that failure into PASS. It reconciles a specific mismatch between the raw pinned template-file identity and the runtime-normalized Jinja source that the already-pinned llama.cpp server exposes through `/props`.

## Preserved canonical identities

This amendment changes no runtime, runtime release asset, model, provider, CLI version, digest, download URL, workflow trigger, runner matrix, credential posture, Gold criterion, or downstream task ordering.

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

The exact raw Qwen tool-aware template remains:

```text
source_repository = ggml-org/llama.cpp
source_commit = c1d0e7a004015f23bc0233470b747b596f29b264
source_path = models/templates/Qwen-Qwen2.5-7B-Instruct.jinja
git_blob = bdf7919a96cfe43d50914a007b9c0877bd0ec27e
```

Its repository bytes remain the only authorized bytes for the runner-temporary `--chat-template-file`.

## Exact pinned-source reconciliation

The post-failure investigation used exact source from the already-pinned llama.cpp commit. It establishes four separate boundaries that Amendment 020 incorrectly treated as one byte-identical surface.

### 1. `--chat-template-file` reads the exact file into the chat-template override

At the pinned runtime, the `--chat-template-file` argument handler reads the supplied file and assigns the resulting string to `params.chat_template`.

Therefore the runner-temporary file remains a real runtime input, and its raw file bytes remain independently verifiable before server launch.

### 2. The pinned Jinja lexer normalizes the source before storing the active template source

At the pinned runtime, `common_chat_template` constructs a Jinja lexer result and stores `lexer_res.source` as the template source returned by `source()`.

The exact pinned lexer performs deterministic source normalization before returning that value. In particular:

- CRLF is normalized to LF;
- remaining CR is normalized to LF;
- if the original source ends in LF, exactly one trailing LF is removed.

The pinned Qwen template identified above uses LF line endings and ends in one trailing LF. Consequently, the active Jinja source stored by the pinned runtime is the exact raw pinned template with that one final LF removed.

### 3. `/props.chat_template` exposes the stored Jinja source, not the raw file bytes

At the pinned runtime, the server obtains the default template through `common_chat_templates_source(...)`, which returns the stored `template_default->source()` value. `/props` serializes that value as:

```text
chat_template
```

Therefore `/props.chat_template` is expected to expose the lexer-normalized active source, not the original file byte sequence.

### 4. `/props.chat_template_caps` remains an independent runtime capability fact

The server separately exposes `chat_template_caps`, derived from the initialized active chat templates. The existing Amendment 020 requirements remain correct for:

```text
supports_tools = true
supports_tool_calls = true
```

No template-source normalization may weaken either capability requirement.

## Amendment 020 mismatch

The Amendment 020 implementation correctly verified the runner-temporary template file against both:

```text
raw_text == exact pinned repository template
raw_git_blob == bdf7919a96cfe43d50914a007b9c0877bd0ec27e
```

That raw-file boundary remains valid and must not change.

However, its `/props` parser also required the runtime-returned `chat_template` itself to satisfy both the raw text equality and raw Git-blob identity. The pinned runtime cannot satisfy that comparison for this pinned template because its Jinja lexer removes the template's one final LF before `source()` is exposed through `/props`.

The three-platform failure is therefore consistent with the exact pinned source contract. This amendment repairs only that attestation mismatch.

## Amendment 021 repair principle

The repair is **raw-file identity plus exact pinned-runtime source normalization**, not relaxed template matching.

Two distinct identities must remain explicit:

```text
raw_template_file_identity
runtime_active_template_source_identity
```

The raw template file must continue to match the exact pinned repository bytes and Git blob before server launch.

The expected runtime-active template source must be derived deterministically from those already-verified raw bytes using only the normalization that the exact pinned Jinja lexer applies to this exact pinned template.

No fuzzy matching, whitespace trimming, generic canonicalization, Unicode normalization, parser round-trip, prefix/suffix acceptance, or semantic-equivalence test is authorized.

## Exact normalization contract

For the exact pinned Qwen template under this amendment, the implementation must establish all of the following before deriving the runtime-active source:

1. the raw embedded template is still exactly the Amendment 020 pinned template;
2. its Git blob remains exactly `bdf7919a96cfe43d50914a007b9c0877bd0ec27e`;
3. it contains no carriage-return byte;
4. it ends in exactly one LF;
5. it does not end in two or more consecutive LF bytes.

Only after those facts hold may the expected runtime-active source be computed as:

```text
expected_runtime_source = raw_pinned_template_without_exactly_one_final_LF
```

The implementation must prove that appending exactly one LF to `expected_runtime_source` reconstructs the exact raw pinned template.

This bounded transformation is not a general Jinja normalizer and must not be represented as one.

## Required `/props` attestation under Amendment 021

After server startup and before anonymous completion or Layer-A forced-tool execution, the existing bounded loopback-only `GET /props` request remains mandatory.

The candidate must establish normalized facts equivalent to:

```text
server_chat_template_exact_pinned_qwen = true
server_chat_template_supports_tools = true
server_chat_template_supports_tool_calls = true
```

For `server_chat_template_exact_pinned_qwen`, the returned `chat_template` must match `expected_runtime_source` exactly.

It must not be accepted when it equals the raw unnormalized template, because that would contradict the exact pinned runtime behavior used by this qualification contract.

`chat_template_caps.supports_tools` and `chat_template_caps.supports_tool_calls` must each remain exactly `true`.

Missing, malformed, false, duplicated, redirected, non-loopback, oversized, raw-unnormalized, differently-normalized, or contradictory `/props` evidence remains FAIL.

No raw template body, normalized template body, arbitrary server text, headers, credential material, or filesystem paths may enter the final machine record.

## Preserved Layer-A and downstream semantics

Amendment 021 changes no Layer-A generation request or parser semantics.

The direct forced-tool witness remains exactly:

```text
model = delethos-qwen25-coder-1.5b-q4km
stream = true
tool_choice = required
parallel_tool_calls = false
tools = exactly one function named write
temperature = 0
max_tokens = 2048
request_timeout = 120 seconds
```

The Amendment 019 fixed failure-code contract and the Amendment 020 bounded response-reader repair remain fail closed.

No Amendment 021 implementation may weaken or bypass:

- raw pinned-template file/blob verification;
- runner-temporary template containment;
- the exact one-pair `--chat-template-file` server-argument boundary;
- the Amendment 015 first-request-only Pi extension;
- `pi_first_request_shaper_witness_exact`;
- durable Pi ToolCall/ToolResult evidence;
- exact smoke file bytes and natural process exit;
- the full two-request Pi tool-choice audit;
- OpenCode identity, completion, policy, and bounded write-smoke facts;
- repository fixture-only and Git invariants;
- no-secret/no-hidden-commit/no-push/no-merge evidence.

The existing execution ordering remains:

```text
server provenance and template attestation
-> anonymous completion
-> Layer A
-> Pi Layer B/C
-> OpenCode
-> repository invariants
```

## Deterministic implementation self-tests

Before any new provider execution, deterministic self-tests must prove at minimum:

1. the raw embedded template remains exact and its Git blob remains `bdf7919a96cfe43d50914a007b9c0877bd0ec27e`;
2. the runner-temporary template file remains byte-exact to the raw pinned template;
3. the Amendment 021 normalization helper accepts the exact raw pinned template and returns exactly the same bytes minus one final LF;
4. appending one LF to the derived runtime source reconstructs the exact raw template;
5. the normalization helper rejects a raw source with no trailing LF;
6. the normalization helper rejects a raw source with two trailing LF bytes;
7. the normalization helper rejects carriage-return mutation;
8. the normalization helper rejects arbitrary body mutation through the preserved raw blob/text boundary;
9. `/props` validation accepts an exact synthetic record whose `chat_template` is the derived runtime source and whose required capabilities are exactly true;
10. `/props` validation rejects the raw unnormalized template as the active runtime source;
11. `/props` validation rejects any other source mutation;
12. missing/duplicated/malformed/false-capability/oversized/redirected/non-loopback cases remain rejected;
13. bounded `/props` incremental reading and overflow early-stop self-tests remain effective;
14. normalized machine evidence contains only bounded boolean/fixed-schema facts and cannot contain either raw or normalized template text;
15. every Amendment 019/020 Layer-A parser, failure-code, request-field, timeout, server-argument, containment, version, digest, URL, workflow-trigger, runner-matrix, permission, and no-secret self-test remains unchanged in meaning and passes.

These tests are shaping evidence only and do not complete R181.

## Exact implementation authority

Only after this amendment becomes canonical may one bounded implementation PR modify:

```text
scripts/recovery-provider-prereq.mjs
```

The implementation must add a distinct `applyAmendment021(...)` transformation after Amendment 020 rather than silently rewriting Amendment 020's historical transformation definition.

The Amendment 021 transformation may only:

- add the exact pinned-runtime-source normalization helper and its deterministic guards;
- replace Amendment 020's runtime `/props.chat_template` raw-byte/blob equality with exact equality to the derived runtime-active source;
- update/add deterministic synthetic self-tests required by this amendment;
- add Amendment 021 discriminator/bookkeeping needed to prove the new transformation is present exactly once.

No other repository path is authorized. In particular, this amendment does not authorize modification of:

```text
scripts/recovery-provider-prereq-impl.mjs
.github/workflows/ci.yml
packages/**
package.json
pnpm-lock.yaml
runtime/model pins or URLs
production adapter code
```

No new repository dependency is authorized.

## Implementation qualification gate

The Amendment 021 implementation must, on one exact final head:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. preserve all exact canonical runtime/model/provider/CLI pins and URLs;
3. preserve the exact workflow and `[provider-prereq]` trigger predicate;
4. keep provider/Gold/real-agent execution skipped on pull-request code;
5. pass deterministic Linux/macOS/Windows CI;
6. pass all pre-install and post-install R181 deterministic self-tests on every required platform;
7. prove raw-file identity and runtime-source identity remain separate and fail closed;
8. prove the only accepted source transformation is the exact one-final-LF removal defined above;
9. receive a fresh independent substantive semantic/security review of that exact final head;
10. reconcile every substantive finding and leave zero unresolved substantive review threads;
11. verify exact base/head/tree/scope/checks/reviews/threads/mergeability immediately before merge;
12. merge only with expected-head protection;
13. pass canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
14. re-read canonical authority before creating any provider trigger commit.

Unavailable, skipped, stale-head, rate-limited, billing-blocked, summary-only, or self-review output is not independent substantive review PASS.

## One new bounded R181 execution authority

If and only if this amendment is canonical and every Amendment 021 implementation qualification gate above is proven on canonical `main`, Amendment 021 authorizes exactly one new same-tree canonical R181 execution.

The trigger commit must:

- have exactly the already-qualified canonical implementation tree;
- change no repository content;
- have complete commit message exactly `[provider-prereq]` and nothing else;
- be created only after canonical post-merge deterministic Linux/macOS/Windows PASS;
- preserve canonical-main/repository/no-secret/`contents: read` workflow boundaries.

The Amendment 021 attempt is consumed when triggered regardless of PASS, FAIL, infrastructure error, cancellation, timeout, or unavailable result. It may not be rerun or retried.

## Success and continuation boundary

`D003-R181` becomes complete only if the one Amendment 021-authorized execution independently emits PASS on Linux/x64, macOS/arm64, and Windows/x64 with every canonical required fact true, including:

- exact raw pinned-template file identity;
- exact runtime-normalized active template identity;
- required template capabilities;
- Layer A;
- Pi Layer B/C;
- OpenCode;
- repository invariants.

If any required platform fails or any required fact is false or missing:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

and no retry is authorized by this amendment.

Only a genuine three-platform R181 PASS opens canonical `D003-R190`.

This amendment does not itself authorize `D003-R190`, `D003-R200`, `D003-R210`, `D003-R211`, `D003-R212`, terminal Specification 003 closeout, or Specification 004.

## Non-claims

This amendment does not claim that Amendment 021 will make R181 pass. It establishes only that the Amendment 020 template-attestation comparison was inconsistent with the exact pinned runtime's source-normalization behavior and defines one narrow, deterministic correction without weakening any provider, capability, Gold, repository, or security boundary.
