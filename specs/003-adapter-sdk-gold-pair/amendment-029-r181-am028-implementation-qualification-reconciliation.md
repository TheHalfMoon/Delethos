# Specification 003 Amendment 029 — Amendment 028 Implementation Qualification-Order Reconciliation

**Status:** `NORMATIVE` iff this file is independently qualified and merged to canonical `main` through the gate below while Specification 003 remains active.  
**Task:** `D003-R181` governance reconciliation and bounded repair authority only.  
**Exact proposal base:** `055d7007a21f371540e1967876a040308306747a`.  
**Unqualified Amendment 028 implementation merge:** PR `#102`, merge `055d7007a21f371540e1967876a040308306747a`.  
**Exact implementation head:** `74bfd3d3ad619ca6fc942ec7f4b0cfa3d18ef903`.  
**Exact implementation tree:** `a0fda00835538be8419e53c15d1ec6f926baac42`.  
**Exact-head deterministic CI:** workflow run `34269792362`.  
**Canonical post-merge deterministic CI:** workflow run `34270600108`.

## Purpose

Canonical `main` contains the Amendment 028 implementation after PR `#102` merged at `2026-09-08T19:43:12Z`.

The Amendment 028 implementation qualification gate required, before merge:

1. exactly one changed repository path: `scripts/recovery-provider-prereq.mjs`;
2. deterministic Linux/macOS/Windows CI PASS on one exact final head;
3. all wrapper pre-install and post-install R181 self-tests PASS;
4. provider/Gold/real-agent jobs skipped on pull-request code;
5. a fresh independent substantive semantic/security/licensing/governance review on the exact final head while the PR remained open;
6. reconciliation of every substantive finding with zero unresolved substantive review threads;
7. exact base/head/tree/scope/check/review/comment/mergeability revalidation immediately before merge;
8. expected-head-protected merge;
9. canonical post-merge Linux/macOS/Windows deterministic PASS with provider execution skipped;
10. canonical authority re-read before any provider trigger.

PR `#102` satisfied the deterministic implementation and CI portions, and a fresh CodeRabbit review covered the exact final range from canonical base `84def825167c868682929e82b2cec5a5047f0361` through exact head `74bfd3d3ad619ca6fc942ec7f4b0cfa3d18ef903` while the PR remained open.

That exact-head review identified one substantive finding before merge:

> The established `opencode_evidence` discriminator did not record the new OpenCode autocompaction isolation and should be updated so consumers can observe the applied isolation control.

The finding was not reconciled on a new exact final head before PR `#102` merged. The PR therefore merged out of qualification order.

This amendment records that defect exactly and performs a forward-only governance repair. It does not rewrite, revert, hide, or retroactively relabel canonical history.

## Exact PR #102 evidence

PR `#102` exact final base and head were:

```text
base = 84def825167c868682929e82b2cec5a5047f0361
head = 74bfd3d3ad619ca6fc942ec7f4b0cfa3d18ef903
```

The exact implementation head changed exactly one path:

```text
scripts/recovery-provider-prereq.mjs
```

with:

```text
additions = 73
deletions = 1
```

The exact-head implementation added a distinct `applyAmendment028(...)` transformation after Amendment 026. It added the generated OpenCode environment control:

```text
OPENCODE_DISABLE_AUTOCOMPACT: '1'
```

and deterministic evidence for:

- pre-Amendment-028 absence of the control;
- exact source entry/value;
- effective `openCodeEnvironment(...)` value;
- missing, renamed, changed-value, and duplicate source rejection;
- complete Amendment 026 lineage-validator byte-range preservation;
- byte-for-byte reverse restoration to the complete pre-Amendment-028 generated candidate;
- a new `amendment_028_blob` discriminator field;
- a bounded `amendment_028_opencode_autocompact = OPENCODE_DISABLE_AUTOCOMPACT=1` self-test metadata field.

The implementation left the previously established `opencode_evidence` discriminator value unchanged:

```text
temporary-qualification-config-model-identity-only+sanitized-export-canonical-lineage-bound-identity
```

That stale discriminator string is the exact substantive review finding reconciled by this amendment. The separate new metadata field does not erase the finding: the existing aggregate evidence discriminator remained stale on the exact head that merged.

## Exact-head CI truth

Workflow run `34269792362` on exact head `74bfd3d3ad619ca6fc942ec7f4b0cfa3d18ef903` completed successfully.

The required deterministic matrix was:

```text
core / ubuntu-latest = SUCCESS
core / macos-latest = SUCCESS
core / windows-latest = SUCCESS
```

Each core job completed the bounded pre-install R181 self-test, frozen install, typecheck, tests, harness syntax validation, post-install R181 safety-shaping self-test, and zero-production-dependency verification successfully.

Provider/Gold/real-agent marker jobs were skipped:

```text
recovery provider prerequisite = SKIPPED
opencode recovery probe = SKIPPED
gold recovery probe = SKIPPED
claude sentinel missing-binary real = SKIPPED
codex no-auth real = SKIPPED
```

CI PASS is preserved as real deterministic evidence. It does not override the unreconciled substantive-review finding.

## Exact independent-review truth

CodeRabbit's fresh review explicitly covered exact head:

```text
74bfd3d3ad619ca6fc942ec7f4b0cfa3d18ef903
```

and exactly the one changed file:

```text
scripts/recovery-provider-prereq.mjs
```

The review characterized merge risk as low but identified the substantive evidence-discriminator finding quoted above. That finding was published before the merge and was not repaired on a later exact head before merge.

A generic CodeRabbit docstring-coverage warning is not adopted as a Specification 003 requirement by this amendment and does not expand the authorized repair surface. Amendment 029 authorizes only the substantive evidence-discriminator repair required to reconcile Amendment 028 qualification.

Unavailable or non-substantive systems remain non-PASS, including the Qodo billing-blocked state. No unavailable, billing-blocked, summary-only, stale-head, self-review, or generic quality warning may be promoted to independent substantive PASS.

## Merge and post-merge truth

PR `#102` merged as:

```text
merge = 055d7007a21f371540e1967876a040308306747a
tree = a0fda00835538be8419e53c15d1ec6f926baac42
```

Canonical post-merge workflow run `34270600108` completed successfully with:

```text
core / ubuntu-latest = SUCCESS
core / macos-latest = SUCCESS
core / windows-latest = SUCCESS
```

and all provider/Gold/real-agent marker jobs skipped.

Therefore the canonical implementation is deterministic-CI-clean, but PR `#102` did **not** complete its own mandatory review-finding-reconciliation gate before merge.

## Governance conclusion

The Amendment 028 implementation is canonical history but is not a qualified implementation under Amendment 028's complete gate.

Until this Amendment 029 itself qualifies and becomes canonical, and the bounded repair it authorizes separately qualifies and becomes canonical, the following are suspended:

```text
AMENDMENT_028_IMPLEMENTATION_QUALIFICATION = INCOMPLETE_UNRECONCILED_REVIEW_FINDING
AMENDMENT_028_PROVIDER_REEXECUTION_AUTHORITY = SUSPENDED_UNQUALIFIED_IMPLEMENTATION_MERGE
```

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
```

No `[provider-prereq]` trigger is authorized by PR `#102`, its merge, or its successful post-merge deterministic CI.

## Preserved implementation truth

Amendment 029 does not invalidate deterministic implementation behavior that was actually machine-tested. It preserves the canonical Amendment 028 code and its successful deterministic CI as historical evidence.

The required bounded OpenCode isolation remains exactly:

```text
OPENCODE_DISABLE_AUTOCOMPACT = 1
```

The complete Amendment 026 `extractOpenCodeIdentity(...)` validator remains required byte-for-byte. No weakening or reinterpretation of lineage semantics is authorized.

All provider/model/runtime/CLI pins, digests, URLs, prompts, tools, permissions, exact write target, workflow semantics, no-secret posture, and Gold criteria remain unchanged.

## Re-adopted bounded repair decision

Amendment 029 independently adopts only the unresolved exact-head review finding.

After this amendment itself qualifies and becomes canonical, one bounded implementation PR may modify exactly:

```text
scripts/recovery-provider-prereq.mjs
```

Within that file, the repair may only update the existing bounded aggregate `opencode_evidence` discriminator metadata so that it explicitly records the Amendment 028 autocompaction isolation.

The resulting discriminator must preserve the complete existing evidence lineage and append one bounded, unambiguous Amendment 028 suffix. The required value is:

```text
temporary-qualification-config-model-identity-only+sanitized-export-canonical-lineage-bound-identity+autocompact-disabled
```

The repair must preserve the existing separate field:

```text
amendment_028_opencode_autocompact = OPENCODE_DISABLE_AUTOCOMPACT=1
```

No other generated-candidate, self-test, provider-record, runtime, adapter, workflow, package, dependency, prompt, tool, permission, identity, pin, digest, URL, timeout, or Gold semantics may change.

## Deterministic repair requirements

The bounded repair must prove at minimum:

1. the exact existing aggregate `opencode_evidence` value is present once before transformation;
2. the exact repaired value is present once after transformation;
3. the repaired value ends with exactly `+autocompact-disabled`;
4. the preserved prefix remains byte-for-byte equal to the pre-repair aggregate evidence value;
5. the separate `amendment_028_opencode_autocompact` field remains exactly `OPENCODE_DISABLE_AUTOCOMPACT=1`;
6. the complete `applyAmendment028(...)` implementation remains byte-for-byte unchanged;
7. the complete Amendment 026 `extractOpenCodeIdentity(...)` validator remains byte-for-byte unchanged;
8. the generated OpenCode environment still contains exactly one `OPENCODE_DISABLE_AUTOCOMPACT: '1'` source entry;
9. the effective `openCodeEnvironment(...)` self-test still proves exact string value `1`;
10. every Amendment 013–028 deterministic self-test remains passing;
11. no dependency or workflow change occurs;
12. provider/Gold/real-agent jobs remain skipped on pull-request code.

A direct one-line metadata edit is sufficient if the existing wrapper self-tests and exact diff independently prove these invariants. Do not add docstrings, comments, abstractions, dependencies, or unrelated cleanup solely to satisfy third-party generic quality heuristics.

## Explicitly unauthorized changes

Amendment 029 does not authorize changes to:

```text
scripts/recovery-provider-prereq-impl.mjs
.github/workflows/ci.yml
packages/**
package.json
pnpm-lock.yaml
tsconfig.json
```

It does not authorize changing:

- `applyAmendment028(...)` behavior;
- `OPENCODE_DISABLE_AUTOCOMPACT: '1'` semantics;
- the Amendment 026 lineage validator;
- runtime/model/provider/CLI pins or digests;
- Layer-A or Pi behavior;
- OpenCode prompt, model, provider, tool, permission, export, or write-target behavior;
- provider record success/failure schema;
- workflow trigger or runner matrix;
- dependencies;
- Gold promotion;
- any downstream task authority.

## Amendment 029 qualification gate

This docs-only Amendment 029 PR must satisfy all of the following on one exact final head before merge:

1. exact canonical base at branch creation is `055d7007a21f371540e1967876a040308306747a` unless live canonical `main` changes and the unit is explicitly reconciled forward;
2. exactly one new documentation path is changed;
3. deterministic Linux/macOS/Windows CI passes on the exact final head;
4. provider/Gold/real-agent marker jobs remain skipped on pull-request code;
5. a fresh independent substantive semantic/security/licensing/governance review is submitted on the exact final head while the PR remains open;
6. the review verifies the recorded PR `#102` evidence, the suspension boundary, the one-line repair authority, and the continued prohibition on provider execution;
7. every substantive finding is reconciled and zero substantive review threads remain unresolved;
8. unavailable, rate-limited, billing-blocked, summary-only, stale-head, failed-after-close, or self-review output remains non-PASS;
9. exact base/head/tree/scope/checks/reviews/threads/comments/mergeability are reverified immediately before merge;
10. merge uses expected-head protection;
11. canonical post-merge deterministic Linux/macOS/Windows CI passes with provider execution skipped;
12. canonical authority is re-read after that post-merge PASS before the one-line repair begins.

## Repair implementation qualification gate

The later one-file repair PR must, on one exact final head before merge:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. change only the bounded aggregate `opencode_evidence` discriminator metadata required above;
3. satisfy every deterministic repair requirement above;
4. pass deterministic Linux/macOS/Windows CI;
5. pass all wrapper pre-install and post-install R181 self-tests on Linux/macOS/Windows;
6. keep provider/Gold/real-agent jobs skipped on pull-request code;
7. receive a fresh independent substantive semantic/security/licensing/governance review on the exact final head while the PR remains open;
8. explicitly reconcile the original PR `#102` discriminator finding;
9. reconcile every new substantive finding and leave zero unresolved substantive review threads;
10. preserve unavailable/skipped/blocked/generic-warning systems as non-PASS;
11. reverify exact base/head/tree/scope/checks/reviews/threads/comments/mergeability immediately before merge;
12. merge with expected-head protection;
13. pass canonical post-merge Linux/macOS/Windows deterministic CI with provider execution skipped;
14. re-read canonical authority before any provider trigger.

## One new bounded R181 attempt

Only after Amendment 029 and its bounded one-file repair both satisfy their complete qualification gates may the previously intended Amendment 028 R181 execution authority be reopened as exactly one fresh same-tree canonical attempt.

The trigger commit must:

- use exactly the already-qualified canonical repaired implementation tree;
- change no repository content;
- have complete commit message exactly `[provider-prereq]` and nothing else;
- be created only after repair post-merge deterministic Linux/macOS/Windows PASS;
- preserve canonical-main/repository/no-secret/`contents: read` workflow boundaries.

The attempt is consumed when triggered regardless of PASS, FAIL, infrastructure error, cancellation, timeout, or unavailable result.

No previous R181 platform result may substitute into the new attempt.

## Success boundary

`D003-R181` becomes complete only if the single Amendment-029-reopened attempt independently emits on Linux/x64, macOS/arm64, and Windows/x64:

```text
schema = delethos.spec003.r181-provider-prereq.v1
outcome = PASS
all REQUIRED_FACTS = true
```

If any required platform fails or any required fact is missing, false, malformed, contradictory, unavailable, cancelled, or timed out:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

and no additional R181 attempt is authorized without another separately qualified bounded canonical amendment.

Only after genuine same-attempt three-platform R181 PASS may canonical authority be re-read for `D003-R190`.

## Non-authority

Amendment 029 does not authorize:

- treating PR `#102` as fully qualified despite its unreconciled exact-head finding;
- treating deterministic CI or post-merge CI as a substitute for substantive review reconciliation;
- retroactively changing PR `#102` review or merge history;
- reverting or rewriting canonical history to conceal the out-of-order merge;
- provider execution before Amendment 029 and its repair both qualify and pass canonical post-merge CI;
- rerunning or retrying any consumed R181 attempt;
- reusing historical platform PASS as future same-attempt evidence;
- changing Amendment 028 implementation behavior beyond the bounded aggregate evidence discriminator;
- adding generic docstrings or unrelated cleanup as part of the repair;
- Gold promotion;
- `D003-R190`, `D003-R200`, `D003-R210`, `D003-R211`, or `D003-R212` execution before genuine R181 PASS;
- terminal Specification 003 closeout;
- Specification 004 activation.
