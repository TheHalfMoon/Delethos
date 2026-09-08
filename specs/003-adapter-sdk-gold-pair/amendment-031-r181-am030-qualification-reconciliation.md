# Specification 003 Amendment 031 — Amendment 030 Qualification-Order Reconciliation

**Status:** `NORMATIVE` iff this file is independently qualified and merged to canonical `main` through the gate below while Specification 003 remains active.  
**Task:** `D003-R181` governance reconciliation and bounded diagnostic authority only.  
**Exact proposal base:** `e95d79e4787eee3b920e6459d8d1e689eadb39c0`.  
**Unqualified Amendment 030 merge:** PR `#108`, merge `e95d79e4787eee3b920e6459d8d1e689eadb39c0`.  
**Consumed Amendment 029 provider trigger:** `0869a2b1811de948e6547a0def4792d42792c23b`.  
**Consumed Amendment 029 provider run:** `34285338508`.

## Purpose

Canonical `main` contains Amendment 030 after PR `#108` merged at `2026-09-08T22:42:40Z`.

Amendment 030 required, before merge:

1. exact-head deterministic Linux/macOS/Windows CI PASS;
2. provider/Gold/real-agent jobs skipped on pull-request code;
3. a fresh independent substantive semantic/security/licensing/governance review on the exact final head while the PR remained open;
4. that review to cover the exact consumed run, platform records, `failed_at` versus execution-order distinction, Linux and macOS interval derivations, fixed-code/no-leak scope, and no-repair/no-authority-widening boundary;
5. reconciliation of every substantive finding with zero unresolved substantive review threads;
6. exact base/head/tree/scope/check/review/thread/comment/mergeability revalidation;
7. expected-head-protected merge;
8. canonical post-merge deterministic Linux/macOS/Windows PASS with provider execution skipped.

The merge occurred before items 3 and 4 were satisfied on the exact final head.

This amendment records that defect exactly. It does not rewrite, revert, hide, or retroactively qualify PR `#108` or Amendment 030.

This is a forward-only governance repair modeled on the canonical Amendment 028 qualification-order reconciliation pattern.

## Exact PR #108 evidence

PR `#108` had exact final head:

```text
3c27cb422ecfcec4d19e8d7699805e7f4e2a7cae
```

against exact canonical base:

```text
0869a2b1811de948e6547a0def4792d42792c23b
```

with tree:

```text
3a4bfcc4456e1d652e5ac3e4609858edc489de3f
```

and exactly one changed path:

```text
specs/003-adapter-sdk-gold-pair/amendment-030-r181-am029-consumed-stage-diagnostics.md
```

Exact-head workflow run `34286972411` (`CI #290`) completed successfully with:

```text
core / ubuntu-latest = SUCCESS
core / macos-latest = SUCCESS
core / windows-latest = SUCCESS
recovery provider prerequisite = SKIPPED
opencode recovery probe = SKIPPED
gold recovery probe = SKIPPED
claude sentinel missing-binary real = SKIPPED
codex no-auth real = SKIPPED
```

An earlier CodeRabbit substantive review was submitted on stale head `431368ea2d1af7a25cb970b367d34343215d34c0` and reported three Major findings. The branch was corrected forward to final head `3c27cb422ecfcec4d19e8d7699805e7f4e2a7cae`.

CodeRabbit then independently verified the individual finding reconciliations on the new head and the associated review threads were resolved. Those follow-up thread checks are useful reconciliation evidence, but they are not the fresh exact-final-head review required by Amendment 030 items 5 and 6 because they did not perform the complete enumerated review scope over the final head.

A fresh full CodeRabbit review request on the exact final head was rate-limited before merge. Amendment 030 explicitly classifies rate-limited review systems as non-PASS.

Other review-system truth before merge was also non-PASS:

```text
Qodo = BILLING_BLOCKED
Cubic GitHub substantive review = MONTHLY_LINE_LIMIT_BLOCKED
Cubic CLI substantive review = NOT_RUN_NO_AI_PROVIDER_CONFIGURED
CodeRabbit exact-final-head full review = RATE_LIMITED
submitted fresh complete independent substantive review on final head = NONE
```

PR `#108` then merged as:

```text
e95d79e4787eee3b920e6459d8d1e689eadb39c0
```

with tree:

```text
3a4bfcc4456e1d652e5ac3e4609858edc489de3f
```

Canonical post-merge workflow run `34287258544` (`CI #291`) completed successfully with Linux/macOS/Windows core PASS and all provider/Gold/real-agent marker jobs skipped.

Therefore exact-head deterministic CI and post-merge deterministic CI succeeded, and the three earlier substantive findings were reconciled, but the mandatory fresh complete independent review on the exact final head did not occur before merge.

## Governance conclusion

Amendment 030 is canonical history but did **not** complete its own qualification gate.

Until this Amendment 031 itself qualifies and becomes canonical, the following Amendment 030 effects are suspended and must not be exercised:

```text
AMENDMENT_030_DIAGNOSTIC_IMPLEMENTATION_AUTHORITY = SUSPENDED_UNQUALIFIED_MERGE
AMENDMENT_030_PROVIDER_REEXECUTION_AUTHORITY = SUSPENDED_UNQUALIFIED_MERGE
```

Presence of Amendment 030 on canonical `main` is historical truth, not qualification proof.

Canonical task truth remains:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
D003-R200 = BLOCKED
D003-R210 = BLOCKED
D003-R211 = BLOCKED
D003-R212 = BLOCKED
PI_GOLD = NOT_QUALIFIED
OPENCODE_GOLD = NOT_QUALIFIED
SPEC_003_STATUS = ACTIVE_BLOCKED_REAL_GOLD
SPEC_004 = NOT_AUTHORIZED
AMENDMENT_029_ATTEMPT = CONSUMED
```

No provider attempt is authorized by the out-of-order Amendment 030 merge.

## Preserved Amendment 029 machine truth

Workflow run `34285338508` remains the single consumed Amendment 029 attempt and must never be rerun, retried, selectively replayed, or reclassified.

Its provider results remain:

```text
linux/x64 = FAIL at pi_bounded_tool_write_smoke / unclassified_internal_failure
macos/arm64 = FAIL with first false required fact opencode_sanitized_export_identity_exact / unclassified_internal_failure
windows/x64 = PASS
```

The Windows PASS is historical evidence only and cannot substitute for Windows in any later same-attempt qualification.

The macOS `failed_at` field remains the first false entry by `REQUIRED_FACTS` order, not an execution-stage trace. Because `opencode_bounded_tool_write_smoke = false` and its mark executes before sanitized export, the macOS attempt did not establish that export, JSON parsing, or the Amendment 026 lineage validator was reached.

The Linux attempt established `pi_first_request_shaper_witness_exact = true` and failed before `pi_bounded_tool_write_smoke` was marked. The unresolved Linux interval remains bounded to the existing `requireExactPiWriteEvidence(...)` call and the immediately following `verifyExactSmoke(piSmokeRepo, piSmokeBefore)` call.

`D003-R181` remains incomplete.

## Re-adopted bounded diagnostic decision

Amendment 031 independently re-adopts the corrected Amendment 030 diagnostic decision without expanding it.

Only if Amendment 031 qualifies and becomes canonical may one later implementation PR modify exactly:

```text
scripts/recovery-provider-prereq.mjs
```

No other repository path is authorized.

The implementation may classify existing generic failure boundaries only at:

1. `requireExactPiWriteEvidence(...)` in the Linux interval after `pi_first_request_shaper_witness_exact` and before `pi_bounded_tool_write_smoke`;
2. the Linux `verifyExactSmoke(piSmokeRepo, piSmokeBefore)` execution in that same interval;
3. the first macOS `verifyExactSmoke(opencodeRepo, opencodeBefore)` execution before `opencode_bounded_tool_write_smoke`;
4. the existing falsy-`opencodeResult.identity.sessionId` rejection on the already-established `opencodeResult.identity` object.

The later post-export macOS `verifyExactSmoke(...)` execution and every other `verifyExactSmoke(...)` call site remain outside this authority.

The already-true `opencode_requested_identity_exact` fact establishes that `opencodeResult.identity` existed and its requested provider/model fields matched the canonical strategy before the later `sessionId` predicate. Neither `opencodeResult` nor its `identity` object is reassigned in that interval. Amendment 031 does not authorize a broader identity-object guard or reclassification of any earlier missing-identity failure.

Diagnostic classification must preserve fail-closed control flow exactly. An existing rejection may be changed only to throw an authorized fixed code. A direct snapshot/stat/read exception at either authorized `verifyExactSmoke(...)` execution may be caught only to immediately throw its authorized fixed code.

No diagnostic catch may:

- suppress an existing failure;
- continue after an existing failure;
- convert a failure into success or partial continuation;
- change a return value;
- move the existing stop point;
- reorder calls or required facts;
- change process behavior.

## Re-adopted fixed-code vocabulary

The only new failure codes authorized by Amendment 031 are the following twenty content-free identifiers:

```text
pi_smoke_evidence_malformed
pi_smoke_evidence_cardinality_mismatch
pi_smoke_tool_name_mismatch
pi_smoke_argument_shape_mismatch
pi_smoke_target_content_mismatch
pi_smoke_tool_result_mismatch
pi_smoke_missing_assistant_identity
pi_smoke_assistant_identity_mismatch
pi_smoke_optional_event_cardinality_mismatch
pi_smoke_optional_start_mismatch
pi_smoke_optional_end_mismatch
smoke_fixture_snapshot_failure
smoke_fixture_repository_identity_changed
smoke_fixture_missing_target
smoke_fixture_stat_failure
smoke_fixture_nonregular_target
smoke_fixture_status_mismatch
smoke_fixture_read_failure
smoke_fixture_content_mismatch
opencode_missing_session_id
```

Every failure outside these exact authorized boundaries must continue to serialize as:

```text
unclassified_internal_failure
```

No raw exception message, stdout/stderr, repository status, filesystem path, process-result string, transcript content, session/message identifier, credential, header, prompt, model prose, or tool argument may become a `failure_reason` value or otherwise enter the normalized machine record.

## Deterministic implementation requirements

The later one-file implementation PR must prove at minimum:

1. exactly one repository path changes: `scripts/recovery-provider-prereq.mjs`;
2. the pre-Amendment-031 generated candidate is exactly Amendment 029 blob `879729a6b995bb4fef7112183fc2393cd233591a`;
3. the complete `applyAmendment028(...)` transformation remains byte-for-byte unchanged;
4. the complete `applyAmendment029(...)` transformation remains byte-for-byte unchanged;
5. the existing Amendment 029 sixteen-code vocabulary and every existing sanitized-export diagnostic mapping remain unchanged;
6. the twenty Amendment 031 codes are declared once each in the bounded fixed-code vocabulary;
7. every existing `requireExactPiWriteEvidence(...)` acceptance/rejection predicate remains semantically unchanged and each existing generic rejection maps only to its corresponding fixed Pi code;
8. diagnostics for `verifyExactSmoke(...)` apply only at the two specifically authorized executions and not through a global semantic change to every call site;
9. direct `snapshotRepository(...)`, `lstatSync(...)`, and `readFile(...)` exceptions at those two executions map only to the corresponding fixed content-free code and immediately rethrow as a coded failure;
10. every explicit repository-identity, missing-target, target-type, worktree-status, and content predicate at those two executions remains semantically unchanged and maps only to its corresponding fixed code;
11. the later post-export macOS `verifyExactSmoke(...)` execution remains behaviorally identical to the pre-Amendment-031 candidate;
12. the existing falsy-`sessionId` predicate remains semantically unchanged and maps only to `opencode_missing_session_id`;
13. no broader `opencodeResult.identity` guard is introduced;
14. every diagnostic mapping preserves the original failure outcome, call order, return behavior, and stop point;
15. deterministic negative fixtures cover every new code, including direct snapshot/stat/read exception paths at both authorized `verifyExactSmoke(...)` executions and the falsy-`sessionId` path;
16. all prior Amendment 013–029 positive and negative self-tests pass unchanged except where this amendment explicitly adds fixed-code assertions around previously generic boundaries;
17. sentinel credentials, headers, paths, repository status strings, process-result strings, transcript content, session/message IDs, model prose, and tool arguments never appear in serialized machine-record output;
18. arbitrary unknown exception text still maps only to `unclassified_internal_failure`;
19. `REQUIRED_FACTS`, their order, schema `delethos.spec003.r181-provider-prereq.v1`, and `failed_at` derivation remain unchanged;
20. all runtime/provider/model/CLI pins, files, digests, URLs, prompts, templates, timeouts, tools, permissions, environment semantics, and workflow semantics remain unchanged;
21. no dependency is added and provider/Gold/real-agent jobs remain skipped on pull-request code;
22. reverse transformation restores the exact pre-Amendment-031 generated candidate byte-for-byte.

## Explicitly unauthorized implementation changes

Amendment 031 does not authorize changes to:

```text
scripts/recovery-provider-prereq-impl.mjs
.github/workflows/ci.yml
packages/adapters/**
packages/runtime/**
package.json
pnpm-lock.yaml
```

It does not authorize changing:

- Pi or OpenCode versions;
- llama.cpp runtime release or commit;
- provider/model identity, model bytes, digests, or download targets;
- Layer-A prompt/tool semantics;
- Pi or OpenCode prompts;
- tool allowlists or permission policy;
- template source or capability semantics;
- timeout budgets or process-supervision semantics;
- `REQUIRED_FACTS`, their ordering, or `failed_at` derivation;
- Amendment 026 lineage acceptance semantics;
- Amendment 028 autocompact isolation;
- Amendment 029 sanitized-export diagnostic semantics;
- any `verifyExactSmoke(...)` execution outside the two proven pre-mark intervals;
- a broader OpenCode identity guard or reclassification of a pre-identity failure;
- catching, suppressing, continuing past, or otherwise changing an existing failure stop point;
- raw or dynamic failure strings in normalized evidence;
- workflow trigger or runner-matrix changes;
- production adapter capability promotion;
- Gold promotion or downstream task execution;
- Specification 004 activation;
- dependencies.

## Amendment 031 qualification gate

This docs-only Amendment 031 PR must satisfy all of the following on one exact final head **before merge**:

1. exact canonical proposal base is `e95d79e4787eee3b920e6459d8d1e689eadb39c0` unless live `main` changes and the branch is explicitly reconciled forward without history rewrite;
2. exactly one new documentation path is changed;
3. deterministic Linux/macOS/Windows CI passes on the exact final head;
4. provider/Gold/real-agent marker jobs remain skipped on pull-request code;
5. a fresh independent substantive semantic/security/licensing/governance review is submitted on the exact final head while the PR remains open;
6. that review explicitly checks the PR `#108` qualification-order defect, the non-retroactive treatment of its stale-head and thread-reconciliation evidence, exact run `34285338508`, consumed-attempt boundaries, Linux/macOS interval derivation, exact four authorized diagnostic locations, twenty-code/no-leak scope, fail-closed control-flow preservation, and no-repair/no-authority-widening boundary;
7. every substantive finding is reconciled and zero substantive review threads remain unresolved;
8. unavailable, blocked, rate-limited, generic, summary-only, stale-head, and self-review systems remain non-PASS;
9. exact base/head/tree/scope/checks/reviews/threads/comments/mergeability are reverified immediately before merge;
10. merge uses expected-head protection;
11. canonical post-merge deterministic Linux/macOS/Windows CI passes with provider execution skipped;
12. canonical authority is re-read after that post-merge PASS before diagnostic implementation begins.

## Diagnostic implementation qualification gate

The later one-file implementation PR must, on one exact final head before merge:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. satisfy every deterministic implementation requirement above;
3. pass deterministic Linux/macOS/Windows CI;
4. pass all wrapper pre-install and post-install R181 self-tests on Linux/macOS/Windows;
5. keep provider/Gold/real-agent jobs skipped on pull-request code;
6. receive a fresh independent substantive semantic/security/licensing/governance review on the exact final head while open;
7. reconcile every substantive finding and leave zero unresolved substantive review threads;
8. preserve unavailable, skipped, blocked, rate-limited, generic, summary-only, stale-head, and self-review systems as non-PASS;
9. reverify exact base/head/tree/scope/checks/reviews/threads/comments/mergeability immediately before merge;
10. merge using expected-head protection;
11. pass canonical post-merge Linux/macOS/Windows deterministic CI with provider execution skipped;
12. re-read canonical authority before any provider trigger.

## One future bounded diagnostic R181 attempt

Only after Amendment 031 and its one-file diagnostic implementation both satisfy their complete qualification gates may exactly one new same-tree canonical R181 attempt be created.

The trigger commit must:

- reuse exactly the already-qualified canonical Amendment 031 diagnostic implementation tree;
- change zero repository content;
- have complete commit message exactly `[provider-prereq]` and nothing else;
- be created only after implementation post-merge deterministic Linux/macOS/Windows PASS;
- preserve canonical-main, repository, no-secret, and `contents: read` workflow boundaries.

The attempt is consumed when triggered regardless of PASS, FAIL, infrastructure error, cancellation, timeout, or unavailable result.

Runs `34285338508`, `34271008060`, and every earlier R181 provider attempt remain consumed and may not be rerun, retried, selectively replayed, or substituted.

If Linux/x64, macOS/arm64, and Windows/x64 all emit `outcome = PASS` with every required fact true in that one same attempt, `D003-R181` may become complete and canonical authority must be re-read before `D003-R190`.

If any required platform fails, the result is diagnostic evidence only. A fixed Amendment 031 failure code may shape a later separately qualified bounded repair amendment; it is not repair authority itself. If a failure remains `unclassified_internal_failure`, no specific cause may be invented.

## Non-authority

This amendment does not:

- retroactively qualify Amendment 030 or PR `#108`;
- complete `D003-R181`;
- qualify Pi or OpenCode as Gold;
- authorize `D003-R190`, `D003-R200`, `D003-R210`, `D003-R211`, or `D003-R212`;
- authorize terminal Specification 003 closeout;
- activate Specification 004;
- authorize any provider execution before the separately qualified one-file implementation and its post-merge authority reread.

Until every gate above is genuinely satisfied from live evidence, the project remains at the existing Specification 003 R181 evidence frontier.
