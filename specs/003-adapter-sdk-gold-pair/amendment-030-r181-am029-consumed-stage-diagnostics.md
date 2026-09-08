# Specification 003 Amendment 030 — Consumed Amendment 029 Attempt and Pre-Mark Stage Diagnostics

**Status:** `NORMATIVE` iff this file is independently qualified and merged to canonical `main` through the gate below while Specification 003 remains active.  
**Task:** `D003-R181` consumed-attempt reconciliation, bounded pre-mark failure classification, and one future diagnostic R181 attempt only.  
**Exact proposal base:** `0869a2b1811de948e6547a0def4792d42792c23b`.  
**Qualified Amendment 029 implementation PR:** `#107`.  
**Qualified Amendment 029 implementation head:** `6839bb9a85ab1442e58e26f73ea67c4d6463a0b6`.  
**Qualified Amendment 029 implementation merge:** `af8f9f1f97567bfab5a60c8f4aa7cef8c5e39ebb`.  
**Qualified Amendment 029 implementation tree:** `e848bbd626db9229dde89721fd77b0cd7111a0a4`.  
**Canonical Amendment 029 post-merge CI:** `34284994078` — `SUCCESS`.  
**Consumed Amendment 029 provider trigger:** `0869a2b1811de948e6547a0def4792d42792c23b`.  
**Consumed Amendment 029 provider run:** `34285338508`.

## Purpose

Amendment 029 added fixed, content-free diagnostics for the sanitized-export JSON parse and Amendment 026 OpenCode identity-validator rejection boundaries. Its qualified implementation merged, passed canonical post-merge deterministic CI, and was followed by the single authorized same-tree `[provider-prereq]` trigger.

That attempt is now consumed. It did not qualify `D003-R181`:

```text
linux/x64   = FAIL
macos/arm64 = FAIL
windows/x64 = PASS
```

The two failures remained `unclassified_internal_failure`, but their surrounding machine facts and the exact execution order now bound them more narrowly than the `failed_at` labels alone suggest.

This amendment authorizes only fixed-code classification for the existing generic rejection boundaries inside those two proven pre-mark intervals. It does not authorize runtime repair, changed acceptance semantics, fact reordering, new provider behavior, or another provider attempt until both this amendment and its later one-file implementation fully qualify.

## Amendment 029 implementation qualification truth

PR `#107` changed exactly:

```text
scripts/recovery-provider-prereq.mjs
```

The exact final implementation head was:

```text
6839bb9a85ab1442e58e26f73ea67c4d6463a0b6
```

against exact base:

```text
0b5acfd0753e795193b1417401063c74e792c831
```

The first exact-head CI exposed an EOL-sensitive wrapper discriminator on Windows. That failed run remains historical evidence and was not rerun. A forward-only correction canonicalized only the source-text hash input from CRLF to LF before hashing and rejected any remaining carriage return. The exact final head then passed deterministic Linux/macOS/Windows CI with provider/Gold/real-agent marker jobs skipped.

A fresh independent CodeRabbit substantive review on the exact final head checked the one-file scope, EOL correction, unchanged Amendment 028 transformation, all 16 Amendment 029 fixed codes, unchanged acceptance predicates, no-leak behavior, reverse restoration, and governance boundary. It reported no substantive findings. Qodo remained billing-blocked and was not treated as PASS.

PR `#107` merged as:

```text
merge = af8f9f1f97567bfab5a60c8f4aa7cef8c5e39ebb
tree  = e848bbd626db9229dde89721fd77b0cd7111a0a4
```

Canonical post-merge run:

```text
34284994078 = SUCCESS
```

completed the required deterministic post-merge gate before the Amendment 029 trigger.

## Consumed Amendment 029 trigger truth

Canonical `main` then advanced by one zero-content-change commit:

```text
trigger = 0869a2b1811de948e6547a0def4792d42792c23b
parent  = af8f9f1f97567bfab5a60c8f4aa7cef8c5e39ebb
tree    = e848bbd626db9229dde89721fd77b0cd7111a0a4
complete commit message = [provider-prereq]
```

The trigger reused the already-qualified implementation tree exactly. Run `34285338508`, attempt `1`, is therefore the single consumed Amendment 029 R181 attempt. It must never be rerun, retried, selectively replayed, or partially substituted into a later attempt.

## Run 34285338508 exact machine truth

The workflow completed:

```text
head_sha = 0869a2b1811de948e6547a0def4792d42792c23b
run_attempt = 1
overall conclusion = FAILURE
core linux = PASS
core macos = PASS
core windows = PASS
```

Other real-agent/Gold marker jobs remained skipped except for the specifically authorized provider-prerequisite matrix.

### Linux/x64

```text
job = 102259494894
outcome = FAIL
failed_at = pi_bounded_tool_write_smoke
failure_reason = unclassified_internal_failure
```

The record independently established all required runtime/model/Layer-A facts and these Pi facts:

```text
pi_cli_version_exact_0_84_4 = true
pi_requested_identity_exact = true
pi_observed_identity_exact = true
pi_nonempty_completion = true
pi_tool_allowlist_exact_write_only = true
pi_first_request_shaper_witness_exact = true
pi_bounded_tool_write_smoke = false
pi_first_request_tool_choice_exact = false
```

The exact generated execution order after the shaper witness is:

```text
mark(record, 'pi_first_request_shaper_witness_exact')
requireExactPiWriteEvidence(piSmokeProcessResult.stdout)
await verifyExactSmoke(piSmokeRepo, piSmokeBefore)
mark(record, 'pi_bounded_tool_write_smoke')
```

Therefore the Linux failure is bounded to an existing rejection or exception reached by `requireExactPiWriteEvidence(...)` or `verifyExactSmoke(...)` after the shaper-witness mark and before the bounded-smoke mark. The evidence does not establish which subcondition rejected.

Earlier Pi process waiting, process-result validation, and first-request shaper-audit parsing completed before the already-true shaper-witness fact. They are not authorized diagnostic targets by this amendment.

### macOS/arm64

```text
job = 102259494607
outcome = FAIL
failed_at = opencode_sanitized_export_identity_exact
failure_reason = unclassified_internal_failure
```

The record independently established all required runtime/model/Layer-A facts, all required Pi facts, and these OpenCode facts:

```text
opencode_cli_version_exact_1_18_26 = true
opencode_requested_identity_exact = true
opencode_nonempty_completion = true
opencode_permission_policy_exact_default_deny = true
opencode_bounded_tool_write_smoke = false
opencode_sanitized_export_identity_exact = false
```

The exact generated execution order after non-empty OpenCode completion is:

```text
if (!opencodeResult.identity.sessionId) throw ...
await verifyExactSmoke(opencodeRepo, opencodeBefore)
mark(record, 'opencode_bounded_tool_write_smoke')
const exported = await runBounded(... export ...)
JSON.parse(exported.stdout)
extractOpenCodeIdentity(...)
await verifyExactSmoke(...)
mark(record, 'opencode_sanitized_export_identity_exact')
```

`opencode_bounded_tool_write_smoke` remained false. Because `mark(...)` is monotonic and is executed before the export command, the macOS failure occurred before that bounded-smoke mark. The run therefore did not establish that the sanitized-export command, JSON parse, or Amendment 026 validator was reached.

The already-true `opencode_requested_identity_exact` fact is established only after the generated candidate dereferences `opencodeResult.identity.requestedProvider` and `opencodeResult.identity.requestedModel` and verifies both against the canonical strategy. `opencodeResult` and its `identity` object are not reassigned before the later `sessionId` predicate. Therefore an absent or null `identity` object is outside the proven macOS interval. Amendment 030 does not authorize adding a new identity-object guard or mapping an earlier missing-identity failure to `opencode_missing_session_id`; that fixed code may apply only to the existing falsy `sessionId` predicate on the already-established identity object.

The `failed_at` value is derived from the first false entry in `REQUIRED_FACTS`, not from an execution-stage trace. `opencode_sanitized_export_identity_exact` precedes later OpenCode facts in that array even where execution order differs. This amendment records that distinction without changing the required-fact schema or order.

The macOS failure is therefore bounded to either the existing missing-session-id rejection or an exception/rejection inside the first `verifyExactSmoke(opencodeRepo, opencodeBefore)` call. The evidence does not establish which subcondition rejected.

### Windows/x64

```text
job = 102259494391
outcome = PASS
failed_at = null
failure_reason = null
all REQUIRED_FACTS = true
```

This PASS is genuine historical evidence but cannot substitute for Windows in any later same-attempt qualification.

## Current governance conclusion

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

No current canonical state authorizes another `[provider-prereq]` trigger until this Amendment 030 and its later diagnostic implementation both complete their full qualification gates.

## Bounded diagnostic implementation authority

Only if this Amendment 030 qualifies and becomes canonical may one later implementation PR modify exactly:

```text
scripts/recovery-provider-prereq.mjs
```

No other repository path is authorized.

The later implementation may only classify existing generic failure boundaries inside:

1. `requireExactPiWriteEvidence(...)` as reached after `pi_first_request_shaper_witness_exact` and before `pi_bounded_tool_write_smoke`;
2. exactly two `verifyExactSmoke(...)` executions: the Linux `verifyExactSmoke(piSmokeRepo, piSmokeBefore)` call between `pi_first_request_shaper_witness_exact` and `pi_bounded_tool_write_smoke`, and the first macOS `verifyExactSmoke(opencodeRepo, opencodeBefore)` call before `opencode_bounded_tool_write_smoke`; the later macOS call after export/parse/identity validation and every other `verifyExactSmoke(...)` call are outside Amendment 030 authority;
3. the existing OpenCode falsy-`sessionId` rejection immediately before the first OpenCode `verifyExactSmoke(...)` call, on the already-established `opencodeResult.identity` object.

Diagnostics must preserve fail-closed control flow exactly. An existing rejection may be changed only to throw its authorized fixed code, and a direct snapshot/stat/read exception at one of the two authorized `verifyExactSmoke(...)` executions may be caught only to immediately throw the corresponding fixed code. No diagnostic catch may suppress a failure, continue execution, return success, alter a return value, or move the stop point. The implementation must preserve every existing rejection/exception outcome, call order, fact order, process behavior, timeout, provider/model identity, prompt, tool, permission, filesystem target, workflow, and dependency boundary.

## Authorized fixed-code vocabulary

The only new failure codes authorized by this amendment are:

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

Every code is content-free. No dynamic count, status text, path, process result, repository path, session ID, message ID, transcript, model prose, tool argument, header, token, credential, environment value, or arbitrary exception message may enter `failure_reason`.

Any failure outside these exact boundaries must continue to report only:

```text
unclassified_internal_failure
```

## Deterministic implementation requirements

The later one-file implementation PR must prove at minimum:

1. exactly one repository path changes: `scripts/recovery-provider-prereq.mjs`;
2. the complete `applyAmendment028(...)` transformation remains byte-for-byte unchanged and retains canonical LF SHA-256 `fd65eb23631cdef54dc23b2dffb7f12b5748841fa60915b22a27f80dbff4ef03`;
3. the complete `applyAmendment029(...)` transformation remains byte-for-byte unchanged and retains canonical LF SHA-256 `480535c7a90761fd94313b09e54d78481279600a73d01fd286c8d793288b73af`;
4. the pre-Amendment-030 generated candidate remains exactly Amendment 029 candidate blob `879729a6b995bb4fef7112183fc2393cd233591a`;
5. the pre-Amendment-030 candidate contains none of the new Amendment 030 fixed codes;
6. every new fixed code is declared exactly once in the bounded failure vocabulary;
7. every existing `requireExactPiWriteEvidence(...)` predicate is unchanged and maps to the exact corresponding fixed code above;
8. direct `snapshotRepository(...)`, `lstatSync(...)`, and `readFile(...)` exceptions map to fixed content-free diagnostic codes only when reached through the two specifically authorized `verifyExactSmoke(...)` executions; those exceptions at every other call site retain exact pre-Amendment-030 behavior;
9. every existing explicit `verifyExactSmoke(...)` predicate remains byte-for-byte semantically unchanged, maps to the corresponding fixed code only at those two authorized executions, and remains unmodified in effect at the later post-export macOS call and all other call sites;
10. the existing OpenCode falsy-`sessionId` predicate remains unchanged and maps only to `opencode_missing_session_id`; the already-established identity-object invariant is preserved and no new broader identity guard is authorized;
11. every diagnostic mapping preserves the original rejection or exception outcome and exact stop point; no catch suppresses, continues past, or converts a failure into a success or partial continuation;
12. all prior Amendment 013–029 positive self-tests retain their exact normalized evidence behavior;
13. deterministic negative fixtures cover every new fixed code, including every direct snapshot/stat/read exception path at the two authorized `verifyExactSmoke(...)` executions and the falsy-`sessionId` path;
14. sentinel credentials, headers, paths, repository status strings, process-result strings, transcript content, session/message IDs, model prose, and tool arguments never appear in serialized machine-record output;
15. arbitrary unknown exception text still maps only to `unclassified_internal_failure`;
16. `REQUIRED_FACTS`, their order, the schema `delethos.spec003.r181-provider-prereq.v1`, and `failed_at` derivation remain unchanged;
17. Pi/OpenCode runtime versions, provider/model pins, llama.cpp release/commit, model bytes/digests/URLs, prompts, templates, timeout values, tools, permissions, write target, environment behavior, process supervision, workflow semantics, and provider required facts remain unchanged;
18. `OPENCODE_DISABLE_AUTOCOMPACT: '1'`, `amendment_028_opencode_autocompact`, Amendment 029 fixed-code mappings, and aggregate evidence metadata remain unchanged;
19. no dependency is added;
20. reverse transformation restores the complete pre-Amendment-030 generated candidate byte-for-byte;
21. provider/Gold/real-agent jobs remain skipped on pull-request code.

## Explicitly unauthorized changes

Amendment 030 does not authorize changes to:

```text
scripts/recovery-provider-prereq-impl.mjs
.github/workflows/ci.yml
packages/**
package.json
pnpm-lock.yaml
tsconfig.json
```

It does not authorize:

- rerunning, retrying, or selectively replaying run `34285338508`;
- reusing its Windows PASS in a later attempt;
- changing Pi or OpenCode acceptance semantics;
- changing `REQUIRED_FACTS` or using `failed_at` as a new execution-stage trace;
- changing provider/model/runtime/CLI pins;
- changing prompts, templates, timeouts, tools, permissions, environment policy, or write target;
- exposing raw stdout/stderr, transcript, export content, repository status, filesystem paths, session/message IDs, credentials, headers, or arbitrary exception strings;
- changing the Amendment 029 sanitized-export fixed-code mappings;
- classifying the later post-export macOS `verifyExactSmoke(...)` call or any `verifyExactSmoke(...)` execution outside the two proven pre-mark intervals;
- catching, suppressing, continuing past, or otherwise changing the stop point or outcome of an existing failure while adding diagnostics;
- adding a broader `opencodeResult.identity` guard or reclassifying a pre-identity failure as `opencode_missing_session_id`;
- speculative repair of Linux Pi behavior or macOS OpenCode behavior;
- workflow changes or dependencies;
- Gold promotion;
- downstream task execution before same-attempt R181 qualification;
- Specification 004 activation.

## Amendment 030 qualification gate

This docs-only Amendment 030 PR must, on one exact final head before merge:

1. be based on exact canonical proposal base `0869a2b1811de948e6547a0def4792d42792c23b` unless live `main` changes and the branch is reconciled forward without history rewrite;
2. change exactly one new documentation path;
3. pass deterministic Linux/macOS/Windows CI on the exact final head;
4. keep provider/Gold/real-agent marker jobs skipped on pull-request code;
5. receive a fresh independent substantive semantic/security/licensing/governance review on the exact final head while open;
6. require that review to check the exact run `34285338508` platform records, consumed-attempt boundary, `failed_at` versus execution-order distinction, Linux interval derivation, macOS interval derivation, fixed-code/no-leak scope, and no-repair/no-authority-widening boundary;
7. reconcile every substantive finding and leave zero unresolved substantive review threads;
8. keep unavailable, blocked, rate-limited, generic, summary-only, stale-head, and self-review systems as non-PASS;
9. reverify exact base/head/tree/scope/checks/reviews/threads/comments/mergeability immediately before merge;
10. merge using expected-head protection;
11. pass canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
12. re-read canonical authority after that post-merge PASS before diagnostic implementation begins.

## Diagnostic implementation qualification gate

The later one-file implementation PR must, on one exact final head before merge:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. satisfy every deterministic implementation requirement above;
3. pass deterministic Linux/macOS/Windows CI;
4. pass all wrapper pre-install and post-install R181 self-tests on Linux/macOS/Windows;
5. keep provider/Gold/real-agent jobs skipped on pull-request code;
6. receive a fresh independent substantive semantic/security/licensing/governance review on the exact final head while open;
7. reconcile every substantive finding and leave zero unresolved substantive review threads;
8. preserve unavailable/skipped/blocked/generic-warning review systems as non-PASS;
9. reverify exact base/head/tree/scope/checks/reviews/threads/comments/mergeability immediately before merge;
10. merge using expected-head protection;
11. pass canonical post-merge Linux/macOS/Windows deterministic CI with provider execution skipped;
12. re-read canonical authority before any provider trigger.

## One future bounded diagnostic R181 attempt

Only after Amendment 030 and its one-file diagnostic implementation both satisfy their complete qualification gates may exactly one new same-tree canonical R181 attempt be created.

The trigger commit must:

- reuse exactly the already-qualified canonical Amendment 030 diagnostic implementation tree;
- change zero repository content;
- have complete commit message exactly `[provider-prereq]` and nothing else;
- be created only after implementation post-merge deterministic Linux/macOS/Windows PASS;
- preserve canonical-main/repository/no-secret/`contents: read` workflow boundaries.

The attempt is consumed when triggered regardless of PASS, FAIL, infrastructure error, cancellation, timeout, or unavailable result.

Run `34285338508`, run `34271008060`, and every earlier R181 run remain consumed and may not be rerun, retried, selectively replayed, or substituted.

If Linux/x64, macOS/arm64, and Windows/x64 all emit `outcome = PASS` with every required fact true in that one same attempt, `D003-R181` may become complete and canonical authority must be re-read before `D003-R190`.

If any required platform fails, the result is diagnostic evidence only. A fixed Amendment 030 failure code may shape a later separately qualified bounded repair amendment; it is not repair authority itself. If a failure remains `unclassified_internal_failure`, no specific cause may be invented.

## Non-authority

This amendment does not complete `D003-R181`, qualify Pi or OpenCode as Gold, authorize `D003-R190` or later tasks, authorize terminal Specification 003 closeout, or activate Specification 004.
