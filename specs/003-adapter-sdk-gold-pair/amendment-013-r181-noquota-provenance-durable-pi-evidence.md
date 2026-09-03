# Specification 003 Amendment 013 — R181 No-Quota Provenance and Durable Pi Tool Evidence

Status: PROPOSED

This amendment is normative only if it is merged to canonical `main` while Specification 003 remains active.

## Purpose

Authorize a bounded repair of two independently observed D003-R181 defects from the single canonical execution authorized by Amendment 012.

This amendment does **not** authorize another provider execution. Amendment 012's one execution was consumed by canonical run `33804498028` at commit `cc0928b93b1ae36e3fa22ba10d159daf9a887f71` and failed. A later provider execution requires separate canonical re-execution authority after this repair is implemented, qualified, merged, and post-merge verified.

## Canonical failed execution

Canonical execution commit:

```text
cc0928b93b1ae36e3fa22ba10d159daf9a887f71
```

Workflow run:

```text
33804498028
```

Deterministic core jobs in that run:

```text
ubuntu = PASS
macos = PASS
windows = PASS
```

Provider prerequisite results:

### Linux x64

The machine record reached the Pi bounded-write fact after successfully proving every preceding runtime, model, server, and Pi identity fact.

```text
outcome = FAIL
failed_at = pi_bounded_tool_write_smoke
failure_reason = Pi write smoke required exactly one tool execution; observed starts=0 ends=0
```

The exact smoke file had already been observed with the required bytes and Pi settled through the bounded Amendment 010 path before the retained JSONL evidence parser rejected the run.

### Windows x64

Windows reproduced the Linux failure at the same fact with the same bounded reason:

```text
outcome = FAIL
failed_at = pi_bounded_tool_write_smoke
failure_reason = Pi write smoke required exactly one tool execution; observed starts=0 ends=0
```

All preceding runtime/model/server/Pi identity and write-only allowlist facts were true.

### macOS arm64

macOS failed before provider/runtime execution because the first unauthenticated GitHub REST provenance query hit a shared public API quota boundary:

```text
outcome = FAIL
failed_at = runtime_tag_commit_exact
failure_reason = GET api.github.com returned HTTP 403
```

No fact after that request was evaluated on macOS.

These results remain canonical failures. They are not transiently retriable evidence and must not be rerun into PASS.

## Exact upstream Pi evidence

The Pi binary pinned by Amendment 008 is `v0.84.4`. The public tag resolves directly to exact source commit:

```text
b79e4cc834970cca69daebffab7df1da7d1e52c4
```

At that exact source:

- `packages/coding-agent/docs/json.md` defines JSON mode as all session events written as JSON Lines to stdout;
- `tool_execution_start` and `tool_execution_end` are documented top-level events;
- assistant `message_end` is the final authoritative assistant message;
- `turn_end` includes its `toolResults` array;
- an assistant tool call contains an id, name, and arguments;
- a tool-result message contains the matching `toolCallId`, `toolName`, and error state;
- `packages/coding-agent/src/modes/print-mode.ts` flushes raw stdout on natural print-mode completion;
- `packages/coding-agent/src/modes/json-event.ts` passes non-`message_update` session events through unchanged.

Therefore top-level lifecycle events are one machine-readable execution signal, but they are not the only durable machine-readable execution evidence emitted by the exact pinned protocol.

## Defect A — shared anonymous GitHub REST quota is not a deterministic provenance gate

Amendment 008 currently proves the llama.cpp release through anonymous `api.github.com` requests before downloading the pinned archive. The macOS canonical failure shows that a shared hosted-runner IP can exhaust that public quota independently of Delethos code, credentials, provider behavior, archive identity, or source identity.

A prerequisite intended to qualify the same exact bytes on Linux/macOS/Windows must not depend on an unauthenticated shared REST quota when an equivalent no-secret integrity path exists.

### A013-PROVENANCE decision

For the llama.cpp runtime only, the R181 repair may replace anonymous GitHub REST provenance requests with a no-secret public transport that proves the following independently:

1. the exact public Git tag ref `refs/tags/b10621` resolves to commit `c1d0e7a004015f23bc0233470b747b596f29b264` using public Git smart-HTTP (`git ls-remote`) or an equivalently direct public Git ref transport;
2. the runtime download URL is constructed exactly from the canonical tuple:
   - repository `ggml-org/llama.cpp`;
   - release/tag `b10621`;
   - platform-specific canonical asset filename from Amendment 008;
3. the downloaded archive SHA-256 equals the exact platform digest already canonicalized by Amendment 008;
4. the extracted executable remains unique, contained, regular, and has the exact build/commit identity already required by R181.

The unauthenticated REST-only fact `runtime_release_asset_digest_metadata_exact` is superseded for future R181 executions by a fact that proves the exact direct release asset identity plus archive digest without public REST quota dependence. The implementation must not mark the old REST metadata fact true without performing the old check.

The updated machine schema must make this distinction explicit. It may either:

- replace the old fact with `runtime_release_asset_identity_and_digest_exact`; or
- advance the machine schema version and define an equivalently explicit fact name.

The repair must not silently reinterpret the old fact name.

No GitHub token, secret, credential, authenticated API request, credential helper, or persisted auth material is authorized.

No retry loop is authorized as a substitute for deterministic provenance.

## Defect B — require durable machine proof of one Pi write, not a single redundant event representation

Linux and Windows prove that the exact file can be created under the exact `--tools write` boundary and the process can settle while the current parser observes zero top-level `tool_execution_start`/`tool_execution_end` records. Because the exact Pi protocol also emits authoritative assistant messages and turn tool results, R181 may use a strict redundant-evidence rule rather than treating one event representation as the sole proof source.

### A013-PI-EVIDENCE decision

The Pi write smoke remains PASS only if **all non-negotiable boundaries** below hold:

1. Pi exact version remains `0.84.4`.
2. requested and observed provider/model identities remain the canonical Amendment 008 identities.
3. the CLI exposes exactly `--tools write`; no other tool is exposed.
4. the smoke request requires exactly one `write` operation creating only `delethos-r181-smoke.txt` with exact bytes:

```text
DELETHOS_R181_OK\n
```

5. the Pi process exits naturally with exit code `0` within Amendment 010's bounded natural-settlement rule; cancellation remains FAIL.
6. the disposable fixture preserves HEAD, refs, remotes, local Git config, hooks, and every worktree path except the exact untracked smoke file.
7. retained stdout is valid bounded JSONL and exposes the canonical provider/model identity.
8. exactly one successful `write` execution is proved by one of the following two machine-equivalent evidence forms.

#### Primary lifecycle evidence

Exactly one matching pair:

```text
tool_execution_start
  toolCallId = <non-empty id>
  toolName = write

tool_execution_end
  toolCallId = same id
  toolName = write
  isError = false
```

There must be no second lifecycle tool execution and no lifecycle event for a different tool.

#### Durable message/result evidence

If and only if the primary lifecycle pair is absent, retained JSONL must instead contain all of the following:

- exactly one assistant `message_end` tool-call content item across the run with:
  - `type = toolCall`;
  - non-empty `id`;
  - `name = write`;
- no other assistant tool-call content item;
- exactly one corresponding successful tool-result record observable through `turn_end.toolResults`, `message_end` with role `toolResult`, or an equivalently authoritative Pi v0.84.4 session event;
- that result must have the same `toolCallId`, `toolName = write`, and `isError = false`;
- no second tool result and no result for another tool.

Before cardinality or correspondence checks, every JSON record that structurally presents itself as durable Pi tool evidence must be validated fail-closed. In particular:

- every assistant content item with `type = toolCall` must have a non-empty string `id`, a non-empty string `name`, and an object-valued arguments field when the exact Pi event shape carries arguments;
- every candidate tool-result record must have a non-empty string `toolCallId`, a non-empty string `toolName`, and a boolean `isError` field;
- a missing, null, empty, non-string, wrong-typed, or otherwise structurally invalid required field is a hard failure, not an ignorable record;
- structural validation happens before counting tool calls/results and before matching ids/names.

An implementation must not skip malformed candidate records and then accept a separate well-formed matching pair.

The implementation must fail if lifecycle evidence is present but malformed, duplicated, mismatched, wrong-tool, or errored. It must not fall back to durable message/result evidence to excuse malformed primary evidence.

The implementation must fail if both evidence forms are absent.

The exact smoke file and Git invariants are corroborating postconditions; **file existence alone is never sufficient proof of tool execution**.

No transcript, reasoning text, provider payload, or session export may be persisted as an artifact. Machine records may include only bounded aggregate diagnostics such as observed event-type counts, tool-call/result counts, and selected evidence form.

## Authorized implementation scope

Only these repository paths may be modified by the implementation unit opened by this amendment:

```text
scripts/recovery-provider-prereq.mjs
scripts/recovery-provider-prereq-impl.mjs
```

If the canonical launcher continues to apply a verified transformation to the implementation, the repair may update the launcher patch/digest contract rather than rewriting the implementation file directly, provided the executed transformed source is exact-digest verified and the PR makes the effective semantic delta independently reviewable.

No adapter capability surface, public product dispatch path, model/runtime/provider pin, OpenCode policy, fixture write boundary, workflow trigger, or unrelated test is authorized by this amendment.

## Deterministic implementation qualification

Before implementation can merge:

1. the repair PR must be based on the exact then-current canonical `main`;
2. changed files must be a subset of the two authorized implementation paths above;
3. Linux/macOS/Windows deterministic core CI must PASS on the exact head;
4. the real provider prerequisite job must remain SKIPPED on pull-request code;
5. deterministic self-tests must prove:
   - no authenticated GitHub/API credential is referenced;
   - exact public tag-ref parsing rejects missing, multiple, peeled-only, or wrong SHA observations;
   - exact release asset URL construction is bounded to the canonical repository/tag/asset tuple;
   - archive SHA-256 remains mandatory;
   - old REST metadata fact is not silently asserted;
   - Pi primary lifecycle proof accepts exactly one correct pair and rejects zero/multiple/mismatch/wrong-tool/error when lifecycle events are present;
   - Pi durable proof accepts exactly one matching assistant tool call + successful tool result only when lifecycle evidence is absent;
   - every candidate durable tool-call/tool-result record is structurally validated before cardinality/correspondence checks;
   - durable proof rejects candidate records with missing/null/empty/non-string ids or names, missing/non-boolean `isError`, wrong-typed required fields, zero/multiple/mismatch/wrong-tool/error, and malformed JSONL;
   - malformed candidate durable records cannot be ignored in favor of a later well-formed pair;
   - cancellation remains FAIL;
   - natural-settlement and original outer timeout bounds remain unchanged from Amendment 010;
6. a fresh independent substantive semantic review must cover the exact head;
7. all substantive review threads must be resolved;
8. merge must use expected-head protection with unchanged canonical base;
9. canonical post-merge deterministic Linux/macOS/Windows CI must PASS with provider execution still SKIPPED.

## Re-execution remains separately gated

Merging and qualifying this repair does **not** execute R181 and does not make R181 complete.

Because Amendment 012 authorized exactly one execution and that execution failed, a new canonical amendment is required after repair post-merge qualification to authorize one new same-tree canonical-main `[provider-prereq]` execution.

That later authority must cite the exact repair merge SHA and exact post-merge deterministic run.

## Success condition for the later R181 execution

A later authorized R181 execution completes D003-R181 only if Linux, macOS, and Windows each produce a machine record with:

```text
outcome = PASS
```

and every then-current required fact is explicitly `true`.

Any failure remains canonical failure evidence. No retry-into-PASS is authorized.

## Non-authority

This amendment does not authorize:

- another provider execution;
- secrets, tokens, authenticated GitHub API access, or paid services;
- weakening archive/model/CLI identity pins;
- accepting file existence alone as Pi tool evidence;
- accepting malformed, missing, duplicated, mismatched, wrong-tool, or errored Pi evidence;
- changing OpenCode qualification policy;
- promoting Pi or OpenCode to Gold;
- opening D003-R190, R200, R210, R211, or R212;
- starting Specification 004.

D003-R181 remains `NOT COMPLETE` until a later separately authorized canonical execution proves the full cross-platform prerequisite matrix.