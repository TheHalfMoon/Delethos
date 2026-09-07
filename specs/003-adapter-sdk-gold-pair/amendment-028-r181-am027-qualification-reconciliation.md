# Specification 003 Amendment 028 — Amendment 027 Qualification-Order Reconciliation

**Status:** `NORMATIVE` iff this file is independently qualified and merged to canonical `main` through the gate below while Specification 003 remains active.  
**Task:** `D003-R181` governance reconciliation and bounded repair authority only.  
**Exact proposal base:** `8c2b5df4eaa1c29226fc33418abbefe19b7d0d42`.  
**Unqualified Amendment 027 merge:** PR `#100`, merge `8c2b5df4eaa1c29226fc33418abbefe19b7d0d42`.  
**Consumed Amendment 026 execution:** workflow run `34154593508`, trigger `4862147343becc53ccd54b4b515b58bd08570b07`.

## Purpose

Canonical `main` contains Amendment 027 after PR `#100` merged at `2026-09-07T19:50:26Z`.

The Amendment 027 document required, before merge:

1. exact-head Linux/macOS/Windows deterministic CI PASS;
2. provider/Gold/real-agent jobs skipped on pull-request code;
3. a fresh independent substantive semantic/security/licensing/governance review on the exact final head;
4. reconciliation of every substantive finding with zero unresolved substantive review threads;
5. exact base/head/tree/scope/check/review/comment/mergeability revalidation;
6. expected-head-protected merge;
7. canonical post-merge deterministic Linux/macOS/Windows PASS with provider execution skipped.

The merge occurred before item 3 was satisfied. This amendment records that defect exactly and prevents mere presence of Amendment 027 on canonical `main` from being misclassified as qualified implementation or provider-execution authority.

This is a forward-only governance repair. It does not rewrite, delete, revert, hide, or retroactively reclassify canonical history.

## Exact PR #100 evidence

PR `#100` had exact final head:

```text
40a93637582a8ad18a27a2d1535811ec2ee39857
```

against exact canonical base:

```text
4862147343becc53ccd54b4b515b58bd08570b07
```

with exactly one changed path:

```text
specs/003-adapter-sdk-gold-pair/amendment-027-r181-opencode-autocompact-isolation.md
```

Exact-head workflow run `34156568994` (`CI #266`) completed successfully with:

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

Review-system truth before and around merge was not PASS:

```text
Qodo = BILLING_BLOCKED
Cubic substantive review = MONTHLY_LIMIT_BLOCKED
CodeRabbit earlier requests = CHAT_RATE_LIMITED
CodeRabbit exact-range review attempt = FAILED_AFTER_PR_CLOSED
submitted fresh independent substantive review = NONE
```

CodeRabbit's later review attempt identified the correct exact range and one changed file but reported:

```text
Review failed
The pull request is closed.
```

That failure is not a substantive review and must not be promoted to PASS.

PR `#100` then merged as:

```text
8c2b5df4eaa1c29226fc33418abbefe19b7d0d42
```

with tree:

```text
f60b28f0edf4514967af47616e3b8782fe6de5a0
```

Canonical post-merge workflow run `34157112195` (`CI #267`) completed successfully with Linux/macOS/Windows core PASS and all provider/Gold/real-agent marker jobs skipped.

Therefore deterministic CI and post-merge CI succeeded, but the mandatory independent-review-before-merge condition did not.

## Governance conclusion

Amendment 027 is canonical history but did **not** complete its own qualification gate.

Until this Amendment 028 itself qualifies and becomes canonical, the following Amendment 027 effects are suspended and must not be exercised:

```text
AMENDMENT_027_IMPLEMENTATION_AUTHORITY = SUSPENDED_UNQUALIFIED_MERGE
AMENDMENT_027_PROVIDER_REEXECUTION_AUTHORITY = SUSPENDED_UNQUALIFIED_MERGE
```

The status sentence inside Amendment 027 that makes it normative based only on presence on canonical `main` is insufficient to overcome its later explicit qualification gate. Amendment 028 supersedes that ambiguity: presence after an out-of-order merge is historical truth, not qualification proof.

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

No provider attempt is authorized by the accidental/out-of-order Amendment 027 merge.

## Preserved R181 machine truth

Workflow run `34154593508` remains the consumed Amendment 026 attempt and must never be rerun, retried, selectively replayed, or reclassified.

Its provider results remain:

```text
linux/x64 = PASS
windows/x64 = PASS
macos/arm64 = FAIL at opencode_sanitized_export_identity_exact
```

The Linux and Windows PASS records remain historical evidence only and cannot substitute for any platform result in a later attempt.

`D003-R181` remains incomplete.

## Re-adopted bounded diagnostic decision

Amendment 028 independently re-adopts the narrow technical decision proposed by Amendment 027 without expanding it.

Pinned OpenCode remains:

```text
repository = anomalyco/opencode
version = 1.18.26
tag = v1.18.26
tag_commit = 774cc7c1914e4329eefde5a669f938b0cf566661
```

Pinned source establishes:

1. automatic compaction is enabled unless explicitly disabled;
2. `OPENCODE_DISABLE_AUTOCOMPACT` is a recognized process flag;
3. when enabled, OpenCode forces effective `compaction.auto = false`;
4. successful automatic compaction can create internal continuation user lineage;
5. the current canonical R181 OpenCode isolation environment does not set `OPENCODE_DISABLE_AUTOCOMPACT=1`;
6. `export --sanitize` preserves structural identity/lineage while redacting content-bearing fields and cannot safely justify treating arbitrary extra non-compaction user turns as trusted internal continuation evidence.

Run `34154593508` does **not** prove automatic compaction occurred on macOS or any other platform. Amendment 028 does not invent that fact.

The proven qualification-boundary defect is narrower:

- Amendment 026 intentionally requires exactly one canonical non-compaction user turn for the bounded R181 smoke;
- the current isolated OpenCode environment still permits a pinned internal mechanism that can create additional non-compaction user lineage;
- that session-topology mutation is outside the provider/model identity claim being qualified;
- sanitized output does not expose a sufficiently strong content-free discriminator to broaden the lineage validator safely.

The fail-closed repair is to disable automatic compaction in the bounded R181 OpenCode environment rather than weaken Amendment 026 lineage validation.

## Exact implementation authority after Amendment 028 qualification

Only if this Amendment 028 becomes canonical through the qualification gate below may one bounded implementation PR modify exactly:

```text
scripts/recovery-provider-prereq.mjs
```

No other repository path is authorized by this unit.

Within that wrapper, the implementation may only:

1. transform the generated R181 OpenCode environment to add exactly:

   ```text
   OPENCODE_DISABLE_AUTOCOMPACT = 1
   ```

2. add deterministic self-tests proving the exact key/value and rejecting missing, renamed, or changed-value variants;
3. add source-level transformation discriminators proving exactly one generated environment entry is added and the pre-Amendment-028 candidate lacked that control;
4. prove the complete Amendment 026 `extractOpenCodeIdentity(...)` validator is byte-for-byte unchanged by the Amendment 028 transformation;
5. prove reverse transformation restores the complete pre-Amendment-028 generated candidate byte-for-byte;
6. preserve every existing Amendment 013–026 deterministic self-test and generated-candidate invariant;
7. update only bounded deterministic wrapper-discriminator metadata needed to identify the Amendment 028 transformation.

The actual OpenCode execution must use the same `openCodeEnvironment(...)` function that the deterministic self-test verifies.

## Deterministic implementation requirements

Before any later provider execution, exact-head implementation evidence must prove at minimum:

1. the generated OpenCode R181 environment contains exactly one source entry `OPENCODE_DISABLE_AUTOCOMPACT: '1'`;
2. the effective environment returned by `openCodeEnvironment(...)` contains that exact string value;
3. missing-key, renamed-key, and changed-value controls fail closed;
4. duplicate generated environment entries are rejected by the transformation discriminator;
5. the pre-Amendment-028 generated candidate contains no `OPENCODE_DISABLE_AUTOCOMPACT` control;
6. the complete Amendment 026 lineage-validator byte range is identical before and after the Amendment 028 transformation;
7. every Amendment 026 lineage positive/negative self-test passes unchanged;
8. every Amendment 025 Pi continuation self-test passes unchanged;
9. every prior Layer-A/runtime/model/template/provenance self-test passes unchanged;
10. OpenCode requested identity, sanitized export, non-empty completion, default-deny permission policy, exact write target, smoke-file verification, repository-fixture-only behavior, no-secret posture, and no-hidden-Git behavior remain unchanged except for disabling automatic compaction;
11. all runtime/provider/model/CLI pins, versions, revisions, files, digests, URLs, prompts, templates, timeouts, tools, permissions, and workflow semantics remain unchanged;
12. no new dependency is added;
13. provider/Gold/real-agent jobs remain skipped on pull-request code;
14. reverse transformation restores the exact pre-Amendment-028 generated candidate byte-for-byte.

These tests are shaping evidence only. They do not complete R181.

## Explicitly unauthorized implementation changes

Amendment 028 does not authorize changes to:

```text
scripts/recovery-provider-prereq-impl.mjs
.github/workflows/ci.yml
packages/adapters/src/opencode.ts
packages/adapters/test/opencode.test.ts
packages/adapters/src/pi.ts
packages/runtime/**
package.json
pnpm-lock.yaml
```

It does not authorize changing:

- OpenCode/Pi versions;
- llama.cpp runtime release/commit;
- provider/model identity or model bytes;
- provider/model/runtime URLs or digests;
- Layer-A prompt/tool semantics;
- Pi behavior;
- OpenCode prompt, model, provider, tool, or permission policy;
- Amendment 026 lineage acceptance semantics;
- provider record schema to hide/relabel failure;
- workflow trigger or runner matrix;
- production adapter capability promotion;
- dependencies.

## Amendment 028 qualification gate

This docs-only Amendment 028 PR must satisfy all of the following on one exact final head **before merge**:

1. exact canonical base at branch creation is recorded and unchanged or explicitly reconciled;
2. exactly one new documentation path is changed;
3. deterministic Linux/macOS/Windows CI passes on the exact final head;
4. provider/Gold/real-agent marker jobs remain skipped on pull-request code;
5. a fresh independent substantive semantic/security/licensing/governance review is submitted on the exact final head while the PR remains open;
6. unavailable, rate-limited, billing-blocked, summary-only, failed-after-close, stale-head, or self-review output remains non-PASS;
7. every substantive review finding is reconciled and zero substantive review threads remain unresolved;
8. exact base/head/tree/scope/checks/reviews/threads/comments/mergeability are reverified immediately before merge;
9. merge uses expected-head protection;
10. canonical post-merge deterministic Linux/macOS/Windows CI passes with provider execution skipped;
11. canonical authority is re-read after that post-merge PASS before implementation begins.

This amendment must **not** be merged merely because CI is green. Independent review is a mandatory gate and cannot be retroactively inferred.

## Implementation qualification gate

The later one-file implementation PR must, on one exact final head before merge:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. pass deterministic Linux/macOS/Windows CI;
3. keep provider/Gold/real-agent jobs skipped on pull-request code;
4. satisfy every deterministic implementation requirement above;
5. receive a fresh independent substantive semantic/security/licensing/governance review on the exact final head while the PR remains open;
6. reconcile every substantive finding and leave zero unresolved substantive review threads;
7. preserve unavailable/skipped/blocked review systems as non-PASS;
8. reverify exact base/head/tree/scope/checks/reviews/threads/comments/mergeability immediately before merge;
9. merge with expected-head protection;
10. pass canonical post-merge Linux/macOS/Windows deterministic CI with provider execution skipped;
11. re-read canonical authority before any provider trigger.

## One new bounded R181 attempt

Only after Amendment 028 and its one-file implementation both satisfy their complete qualification gates may exactly one new same-tree canonical R181 execution be created.

The trigger commit must:

- use exactly the already-qualified canonical implementation tree;
- change no repository content;
- have complete commit message exactly `[provider-prereq]` and nothing else;
- be created only after implementation post-merge deterministic Linux/macOS/Windows PASS;
- preserve canonical-main/repository/no-secret/`contents: read` workflow boundaries.

The attempt is consumed when triggered regardless of PASS, FAIL, infrastructure error, cancellation, timeout, or unavailable result.

No prior R181 run or platform result may be rerun, retried, selectively replayed, or substituted into this attempt.

## Success boundary

`D003-R181` becomes complete only if the single Amendment 028-authorized attempt independently emits on Linux/x64, macOS/arm64, and Windows/x64:

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

Amendment 028 does not authorize:

- treating PR `#100` as independently reviewed;
- treating CodeRabbit's failed-after-close review attempt as PASS;
- retroactively changing the qualification state of PR `#100`;
- reverting or rewriting canonical history to conceal the out-of-order merge;
- implementation before Amendment 028 qualification and post-merge verification;
- provider execution before implementation qualification and post-merge verification;
- rerunning/retrying any consumed R181 attempt;
- reusing historical Linux/Windows PASS as future same-attempt evidence;
- claiming automatic compaction caused the consumed macOS failure;
- weakening Amendment 026 lineage semantics;
- Gold promotion;
- `D003-R190`, `D003-R200`, `D003-R210`, `D003-R211`, or `D003-R212` execution before genuine R181 PASS;
- terminal Specification 003 closeout;
- Specification 004 activation.
