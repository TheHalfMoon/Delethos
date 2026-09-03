# Specification 003 Amendment 013 — Durable Pi Tool Evidence + Public Runtime Provenance

**Status:** `PROPOSED` until this amendment is qualified, independently reviewed, merged with expected-head protection, and verified on canonical `main`.  
**Evidence date:** 2026-09-04  
**Task:** `D003-R181` bounded repair authority only.  
**Scope:** reconcile the two distinct failures machine-observed by the single canonical Amendment 012 re-execution, define a no-secret public provenance path that does not depend on anonymous GitHub REST quota, define a durable Pi write-execution proof using Pi's authoritative JSON message lifecycle, and conditionally authorize exactly one later canonical R181 re-execution after the repair itself is fully qualified and canonically verified. This amendment does not mark R181 complete, does not open R190, does not promote any adapter/capability to Gold, and does not authorize Specification 004.

## Canonical failed attempt being reconciled

Amendment 012 authorized one fresh same-tree canonical `[provider-prereq]` execution. That attempt is consumed.

```text
canonical_head = cc0928b93b1ae36e3fa22ba10d159daf9a887f71
workflow_run = 33804498028
workflow_run_number = 152
```

Deterministic core CI passed on Linux, macOS, and Windows. The provider prerequisite matrix failed and must not be rerun into PASS.

### Linux / x64

```text
job = 100811605981
outcome = FAIL
failed_at = pi_bounded_tool_write_smoke
failure_reason = Pi write smoke required exactly one tool execution; observed starts=0 ends=0
```

The Linux record had already proven every R181 fact through:

```text
pi_tool_allowlist_exact_write_only = true
```

including exact runtime/model provenance, loopback/no-auth inference, Pi 0.84.4 identity, requested/observed provider/model identity, and a non-empty Pi completion.

### macOS / arm64

```text
job = 100811605785
outcome = FAIL
failed_at = runtime_tag_commit_exact
failure_reason = GET api.github.com returned HTTP 403
```

No provider/runtime inference claim after that point is inferred or promoted. This is a public-provenance transport failure, not a model or adapter PASS/FAIL observation.

### Windows / x64

```text
job = 100811605579
outcome = FAIL
failed_at = pi_bounded_tool_write_smoke
failure_reason = Pi write smoke required exactly one tool execution; observed starts=0 ends=0
```

The Windows record likewise had already proven every R181 fact through:

```text
pi_tool_allowlist_exact_write_only = true
```

No failed job from run `33804498028` may be rerun or retried into PASS.

## Source reconciliation — Pi 0.84.4

The exact Pi tag remains:

```text
v0.84.4 -> b79e4cc834970cca69daebffab7df1da7d1e52c4
```

The `v0.84.4` binary release workflow checks out its `SOURCE_REF` at the release tag, creates a source archive from that checked-out source, and builds the platform binaries from that archive. The exact published release asset digests used by Delethos remain unchanged.

At exact source commit `b79e4cc834970cca69daebffab7df1da7d1e52c4`:

- JSON mode documents `message_end` as the final authoritative message;
- `AgentSession` subscribes to agent-core events and forwards them to JSON-mode listeners;
- agent-core emits `tool_execution_start` and `tool_execution_end` around tool execution;
- assistant messages contain structured `ToolCall` entries with `id`, `name`, and `arguments`;
- tool-result messages contain `toolCallId`, `toolName`, and `isError`;
- the built-in `write` tool accepts exactly `path` and `content` strings.

Source references:

```text
https://github.com/earendil-works/pi/blob/b79e4cc834970cca69daebffab7df1da7d1e52c4/packages/coding-agent/docs/json.md
https://github.com/earendil-works/pi/blob/b79e4cc834970cca69daebffab7df1da7d1e52c4/packages/coding-agent/src/modes/print-mode.ts
https://github.com/earendil-works/pi/blob/b79e4cc834970cca69daebffab7df1da7d1e52c4/packages/coding-agent/src/modes/json-event.ts
https://github.com/earendil-works/pi/blob/b79e4cc834970cca69daebffab7df1da7d1e52c4/packages/coding-agent/src/core/agent-session.ts
https://github.com/earendil-works/pi/blob/b79e4cc834970cca69daebffab7df1da7d1e52c4/packages/agent/src/agent-loop.ts
https://github.com/earendil-works/pi/blob/b79e4cc834970cca69daebffab7df1da7d1e52c4/packages/ai/src/types.ts
https://github.com/earendil-works/pi/blob/b79e4cc834970cca69daebffab7df1da7d1e52c4/packages/coding-agent/src/core/tools/write.ts
https://github.com/earendil-works/pi/blob/b79e4cc834970cca69daebffab7df1da7d1e52c4/.github/workflows/build-binaries.yml
```

The canonical run nevertheless showed that the release binary's retained JSON stdout did not expose the ephemeral top-level `tool_execution_start` / `tool_execution_end` records in the two platforms that reached the Pi smoke, even though the exact target file was created and the process naturally completed. R181 therefore must not pretend those absent ephemeral records were observed.

The durable message lifecycle is independently machine-observable in the same JSON stream and can prove the same bounded action without inventing an event that is absent.

## Normative Pi durable single-write proof

`pi_bounded_tool_write_smoke` retains the same fact name and security meaning. The proof surface is changed from an exclusive dependency on ephemeral top-level execution events to the authoritative durable JSON message lifecycle plus independent filesystem/Git checks.

The Pi write smoke must continue to satisfy all existing restrictions, including:

```text
Pi version = 0.84.4
provider = delethos-local-llama
model = delethos-qwen25-coder-1.5b-q4km
conformance-only mode = WRITE_ONLY
exact CLI allowlist = --tools write
no bash/powershell/read/edit/grep/find/ls
no extensions/skills/prompt templates/themes/context files
no approval bypass
fresh disposable no-remote Git fixture
smoke target = delethos-r181-smoke.txt
smoke bytes = DELETHOS_R181_OK\n
```

The JSON evidence parser must fail closed on malformed non-empty JSON lines.

For the write smoke, it must machine-observe all of the following from authoritative `message_end` records:

1. exactly one assistant `ToolCall` across the smoke run;
2. that tool call has a non-empty id;
3. `name = write`;
4. its arguments contain exactly the expected `path` and `content` values for the smoke target, with no alternate target or payload;
5. exactly one tool-result message exists for that call;
6. `toolResult.toolCallId` exactly equals the assistant tool-call id;
7. `toolResult.toolName = write`;
8. `toolResult.isError = false`;
9. every assistant identity exposed by the smoke stream remains the canonical provider/model pair;
10. there is no second assistant tool call or second tool-result call.

After the process completes naturally, Delethos must still independently prove:

```text
expected file exists as a regular non-symlink file
exact bytes match
worktree status is exactly the one expected untracked smoke file
HEAD/refs/remotes/local Git config/hooks are unchanged
no other fixture path changed
```

Because the CLI exposes only the `write` tool, the authoritative assistant message requests exactly one `write` with exact arguments, a matching non-error tool-result message is present, and the independent filesystem/Git observation proves the exact effect, this is machine evidence of a real provider-generated agent tool action rather than a scripted fixture answer.

### Ephemeral execution events

If top-level `tool_execution_start` / `tool_execution_end` events are present, the parser must treat them as additional consistency evidence:

- their count must not exceed the single durable write action;
- ids/names must match the durable message proof;
- an end event must not report an error.

Their absence alone must not fail the smoke when the complete durable proof above passes. Their presence with contradictory or additional tool execution must fail closed.

No transcript, prompt, tool payload, or raw JSON stream may be persisted as evidence. The emitted R181 record remains bounded to facts/status/identity/count summaries and failure reason.

## Public no-secret runtime provenance repair

The macOS failure proves that a shared anonymous `api.github.com` quota is not a reliable prerequisite transport. The source/artifact identity requirements from Amendment 008 remain unchanged; only their public transport is repaired.

R181 must not add a GitHub token, repository secret, personal credential, vendor credential, or credential-shaped environment value.

### Tag-to-source proof

Instead of requiring the anonymous REST tag-ref endpoint, the repair may invoke Git directly without shell interpolation:

```text
git ls-remote --refs https://github.com/ggml-org/llama.cpp refs/tags/b10621
```

It must require exactly one matching ref and exactly:

```text
c1d0e7a004015f23bc0233470b747b596f29b264 refs/tags/b10621
```

Redirect ambiguity, multiple refs, peeled/floating substitutions, missing output, or any different SHA fails closed.

### Public release-asset metadata proof

The repair may fetch the public GitHub release asset listing over the ordinary web surface rather than REST quota:

```text
https://github.com/ggml-org/llama.cpp/releases/expanded_assets/b10621
```

It must use a bounded single public HTTP retrieval with no authentication and require exactly one selected platform asset entry. The returned document must contain both:

- the exact selected asset filename; and
- the exact pinned `sha256:<digest>` for that asset.

The parser must not accept a digest associated with another asset, duplicate matching asset entries, a different tag, missing digest, malformed response, HTTP error, or redirected host outside `github.com`.

The independently streamed archive download and locally computed SHA-256 remain mandatory exactly as in Amendment 008. The exact extracted executable containment check and `llama-server --version` build/commit-prefix attestation also remain mandatory.

This repair changes only the no-secret public metadata transport. It does not reduce the four independent runtime identity claims defined by Amendment 008.

## Deterministic self-test requirements

Before any provider execution, deterministic self-tests must prove at minimum:

- the public tag-ref parser accepts exactly the canonical one-line ref and rejects zero/multiple/wrong ref/wrong SHA/malformed forms;
- the release-asset HTML parser binds the digest to the exact selected filename and rejects duplicate/missing/wrong digest/wrong filename fixtures;
- the Pi durable parser accepts one exact assistant write ToolCall plus one exact matching successful ToolResult;
- it rejects no tool call, duplicate tool calls, non-write calls, wrong path, wrong content, unknown extra argument keys, mismatched ids, wrong tool-result name, tool-result error, duplicate tool results, malformed JSON, and provider/model identity drift;
- contradictory optional top-level execution events fail closed;
- absence of optional top-level execution events does not by itself fail an otherwise complete durable proof;
- Amendment 010 natural-completion and 300-second outer-bound semantics remain unchanged.

These are deterministic parser/policy tests only. They do not count as provider PASS.

## Exact implementation authority

Only after this amendment is canonical may the bounded repair modify:

```text
scripts/recovery-provider-prereq.mjs
```

The existing digest-pinned temporary implementation shaping may be extended only as necessary to apply this amendment to the already canonical R181 harness. No additional repository file is authorized for implementation by this amendment.

No production dependency is authorized. No workflow permission change is authorized. No GitHub/API credential is authorized. No adapter capability definition may change.

Documentation/evidence reconciliation may update only Specification 003 documentation and issue #16.

## Qualification gate for the repair

The implementation PR must, on one exact head:

1. change only the authorized implementation path;
2. keep provider execution skipped on pull-request code;
3. pass deterministic CI on Linux, macOS, and Windows;
4. pass both pre-install and post-install R181 deterministic self-tests on every required platform;
5. receive a fresh independent substantive semantic review of that exact head;
6. resolve every substantive review thread;
7. remain based on the exact canonical main used for qualification;
8. merge only with expected-head protection;
9. pass canonical post-merge deterministic CI on Linux, macOS, and Windows with provider execution still skipped.

Unavailable, rate-limited, billing-blocked, skipped, stale-head, or self-review is not independent review PASS.

## Conditional one-attempt re-execution authority

This amendment authorizes exactly one new same-tree canonical `[provider-prereq]` execution **only if** all repair qualification gates above are proven on canonical `main` first.

The execution trigger must:

- use the exact already-qualified canonical implementation tree;
- contain no code/content change;
- begin its commit message with exact standalone sentinel `[provider-prereq]`;
- occur only after deterministic post-merge Linux/macOS/Windows PASS;
- preserve `contents: read`, no-secret, canonical-main-only workflow boundaries;
- not rerun any earlier failed workflow/job.

The single attempt is consumed once triggered regardless of PASS/FAIL.

## Re-execution success condition

D003-R181 becomes complete only if the one authorized fresh canonical execution produces, independently on:

```text
linux/x64
macos/arm64
windows/x64
```

one `delethos.spec003.r181-provider-prereq.v1` record with:

```text
outcome = PASS
all REQUIRED_FACTS = true
```

A platform failure, missing fact, unavailable result, malformed record, infrastructure error, provenance mismatch, or inconsistent Pi durable proof keeps:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

and consumes the attempt. A later attempt would require new bounded canonical authority.

## Non-authority

This amendment does not authorize:

- retrying run `33804498028` or any failed job from it;
- treating macOS HTTP 403 as a provider/model failure or PASS;
- treating file existence alone as tool-execution evidence;
- accepting prompt compliance without durable machine evidence;
- accepting contradictory tool-event/message evidence;
- broadening Pi beyond exact `--tools write` for R181;
- secrets, GitHub tokens, credentials, paid APIs, or stored auth;
- changing OpenCode permissions/provider policy;
- changing runtime/model/provider pins;
- changing public capability status;
- Gold promotion;
- R190/R200/R210/R211/R212 execution before R181 passes;
- Specification 004.

## Continuation boundary

If the one authorized re-execution passes on all three required platforms, canonical authority may be re-read and D003-R190 may open exactly as ordered by Amendments 007/008.

If it fails, stop at the exact observed failure and create no new execution attempt without new canonical repair/re-execution authority.
