# Specification 003 Amendment 029 — Amendment 028 Qualification and Out-of-Order Trigger Reconciliation

**Status:** `NORMATIVE` iff this file is independently qualified and merged to canonical `main` through the gate below while Specification 003 remains active.  
**Task:** `D003-R181` governance reconciliation, bounded metadata repair authority, and future execution re-authorization only.  
**Exact proposal base:** `2aba6520bbefaaac4dea1f45754dc3d6cd22f844`.  
**Unqualified Amendment 028 implementation PR:** `#102`.  
**Unqualified Amendment 028 implementation head:** `74bfd3d3ad619ca6fc942ec7f4b0cfa3d18ef903`.  
**Unqualified Amendment 028 implementation merge:** `055d7007a21f371540e1967876a040308306747a`.  
**Out-of-order provider trigger:** `2aba6520bbefaaac4dea1f45754dc3d6cd22f844`.  
**Consumed out-of-order provider run:** `34271008060`.

## Purpose

This amendment reconciles two sequential governance defects without rewriting canonical history:

1. PR `#102` merged the Amendment 028 implementation after exact-head deterministic CI and an exact-head independent substantive review, but before reconciling that review's substantive finding on a new final head;
2. canonical `main` then advanced to a same-tree commit whose complete message was `[provider-prereq]`, triggering provider run `34271008060` before Amendment 028 implementation qualification had become valid.

Both events are canonical history. Neither event may be hidden, reverted solely to erase evidence, retroactively relabeled as qualified, or used to bypass the qualification order that Amendment 028 required.

This amendment performs a forward-only repair. It preserves real deterministic and runtime evidence exactly, suspends any provider re-execution authority derived from the unqualified merge, classifies run `34271008060` as consumed out-of-order evidence, and authorizes only the smallest later metadata repair needed to reconcile the exact independent-review finding before one new bounded R181 attempt may be considered.

## Canonical implementation history

PR `#102` implemented Amendment 028 on exact final head:

```text
74bfd3d3ad619ca6fc942ec7f4b0cfa3d18ef903
```

against exact PR base:

```text
84def825167c868682929e82b2cec5a5047f0361
```

with exactly one changed repository path:

```text
scripts/recovery-provider-prereq.mjs
```

The implementation head tree was:

```text
a0fda00835538be8419e53c15d1ec6f926baac42
```

The implementation added a distinct `applyAmendment028(...)` transformation after Amendment 026 that adds exactly one generated OpenCode R181 environment source entry:

```text
OPENCODE_DISABLE_AUTOCOMPACT: '1'
```

It also added deterministic controls that prove:

- the pre-Amendment-028 generated candidate lacked `OPENCODE_DISABLE_AUTOCOMPACT`;
- the generated candidate contains exactly one source entry with exact string value `1`;
- the effective environment returned through the same `openCodeEnvironment(...)` path contains exact value `1`;
- missing, renamed, changed-value, and duplicate variants fail closed;
- the complete Amendment 026 `extractOpenCodeIdentity(...)` validator byte range is preserved;
- reverse transformation restores the complete pre-Amendment-028 generated candidate byte-for-byte;
- the wrapper self-test discriminator identifies Amendment 028;
- bounded metadata includes:

  ```text
  amendment_028_opencode_autocompact = OPENCODE_DISABLE_AUTOCOMPACT=1
  ```

No evidence in this amendment reclassifies those machine-tested deterministic facts as false.

## PR #102 exact-head deterministic CI

Workflow run `34269792362` executed against exact head `74bfd3d3ad619ca6fc942ec7f4b0cfa3d18ef903` and completed successfully.

The deterministic matrix was:

```text
core / ubuntu-latest = SUCCESS
core / macos-latest = SUCCESS
core / windows-latest = SUCCESS
```

Each core job passed the pre-install R181 wrapper self-test, frozen install, typecheck, tests, harness syntax validation, post-install R181 safety-shaping self-test, and zero-production-dependency verification.

Provider/Gold/real-agent marker jobs remained skipped on pull-request code:

```text
recovery provider prerequisite = SKIPPED
opencode recovery probe = SKIPPED
gold recovery probe = SKIPPED
claude sentinel missing-binary real = SKIPPED
codex no-auth real = SKIPPED
```

These are real exact-head deterministic PASS and SKIPPED facts. They are necessary but not sufficient for Amendment 028 implementation qualification.

## PR #102 exact independent-review truth

A fresh CodeRabbit review covered the exact final range:

```text
base = 84def825167c868682929e82b2cec5a5047f0361
head = 74bfd3d3ad619ca6fc942ec7f4b0cfa3d18ef903
changed path = scripts/recovery-provider-prereq.mjs
```

while PR `#102` remained open.

The review found one substantive issue:

> The recovery prerequisite now disables OpenCode autocompaction, but the established OpenCode evidence string does not record that change. Update the discriminator suffix so consumers can observe the applied isolation control before merge.

The exact implementation left the aggregate self-test metadata discriminator:

```text
temporary-qualification-config-model-identity-only+sanitized-export-canonical-lineage-bound-identity
```

unchanged even though Amendment 028 added the new autocompaction-isolation control and a separate bounded Amendment 028 metadata field.

That is an evidence-observability/discriminator defect, not evidence that the environment control itself was absent. The exact deterministic implementation tests had already machine-proved the environment source and effective value.

A generic CodeRabbit docstring-coverage warning is not part of Specification 003 acceptance and does not expand this amendment's repair authority. Qodo was billing-blocked and remains non-PASS. Unavailable, generic, summary-only, stale-head, self-review, rate-limited, billing-blocked, or failed review output must not be promoted to substantive PASS.

## PR #102 qualification defect

Amendment 028 required every substantive exact-head review finding to be reconciled, zero substantive review threads to remain unresolved, and the final exact base/head/tree/scope/check/review/comment/mergeability state to be revalidated before expected-head-protected merge.

The substantive aggregate-discriminator finding was published before PR `#102` merged. No later PR head reconciled that finding before merge.

PR `#102` then merged as:

```text
merge = 055d7007a21f371540e1967876a040308306747a
tree = a0fda00835538be8419e53c15d1ec6f926baac42
```

Therefore:

```text
AMENDMENT_028_IMPLEMENTATION_HISTORY = CANONICAL
AMENDMENT_028_DETERMINISTIC_IMPLEMENTATION_EVIDENCE = PASS
AMENDMENT_028_IMPLEMENTATION_QUALIFICATION = INCOMPLETE_UNRECONCILED_SUBSTANTIVE_REVIEW_FINDING
```

The merge itself does not cure the missing review-finding reconciliation.

## Canonical post-merge deterministic truth

Canonical post-merge workflow run `34270600108` executed on merge `055d7007a21f371540e1967876a040308306747a` and completed successfully.

```text
core / ubuntu-latest = SUCCESS
core / macos-latest = SUCCESS
core / windows-latest = SUCCESS
```

Provider/Gold/real-agent marker jobs remained skipped.

This confirms canonical deterministic health of the merged implementation tree. It does not retroactively satisfy the pre-merge review-finding reconciliation gate.

## Out-of-order `[provider-prereq]` trigger

Before the Amendment 028 qualification defect was reconciled through a new canonical amendment and a separately qualified repair, canonical `main` advanced from merge `055d7007a21f371540e1967876a040308306747a` to:

```text
trigger = 2aba6520bbefaaac4dea1f45754dc3d6cd22f844
parent = 055d7007a21f371540e1967876a040308306747a
tree = a0fda00835538be8419e53c15d1ec6f926baac42
complete commit message = [provider-prereq]
```

The trigger changed no repository content and reused the same implementation tree, but it was created before Amendment 028 implementation qualification had validly completed.

Therefore the trigger was out of qualification order and was not authorized by the complete Amendment 028 gate.

The resulting workflow run:

```text
34271008060
```

is historical machine evidence only. It is consumed and must never be rerun, retried, selectively replayed, or treated as an authorized Amendment 028 qualification attempt.

## Consumed run 34271008060 machine truth

Workflow run `34271008060` completed with overall conclusion:

```text
FAILURE
```

The deterministic core matrix still passed:

```text
core / ubuntu-latest = SUCCESS
core / macos-latest = SUCCESS
core / windows-latest = SUCCESS
```

The provider-prerequisite jobs produced:

```text
linux/x64 = FAIL
macos/arm64 = PASS
windows/x64 = PASS
```

Other marker jobs remained skipped:

```text
opencode recovery probe = SKIPPED
gold recovery probe = SKIPPED
claude sentinel missing-binary real = SKIPPED
codex no-auth real = SKIPPED
```

### Linux/x64 record

The Linux provider-prerequisite machine record reported:

```text
schema = delethos.spec003.r181-provider-prereq.v1
source = CANONICAL_MAIN_PROVIDER_PREREQUISITE
platform = linux
arch = x64
outcome = FAIL
failed_at = opencode_sanitized_export_identity_exact
failure_reason = unclassified_internal_failure
```

Before that failure, the record machine-observed the exact runtime/model/Layer-A/Pi prerequisites and these OpenCode facts as true:

```text
opencode_cli_version_exact_1_18_26 = true
opencode_requested_identity_exact = true
opencode_nonempty_completion = true
opencode_permission_policy_exact_default_deny = true
```

The failing boundary and downstream facts were:

```text
opencode_sanitized_export_identity_exact = false
opencode_bounded_tool_write_smoke = false
repository_fixture_only = false
no_secret_referenced = false
no_hidden_commit_push_merge = false
```

Those downstream false values are preserved exactly as emitted after the earlier fail-closed boundary. This amendment does not reinterpret them as independent proof of secret use or hidden Git mutation.

### macOS/arm64 record

The macOS provider-prerequisite machine record reported:

```text
schema = delethos.spec003.r181-provider-prereq.v1
platform = macos
arch = arm64
outcome = PASS
failed_at = null
failure_reason = null
```

All required facts in that record were true, including:

```text
opencode_sanitized_export_identity_exact = true
opencode_bounded_tool_write_smoke = true
repository_fixture_only = true
no_secret_referenced = true
no_hidden_commit_push_merge = true
```

### Windows/x64 record

The Windows provider-prerequisite machine record reported:

```text
schema = delethos.spec003.r181-provider-prereq.v1
platform = windows
arch = x64
outcome = PASS
failed_at = null
failure_reason = null
```

All required facts in that record were true, including:

```text
opencode_sanitized_export_identity_exact = true
opencode_bounded_tool_write_smoke = true
repository_fixture_only = true
no_secret_referenced = true
no_hidden_commit_push_merge = true
```

## Interpretation boundary for run 34271008060

Run `34271008060` cannot complete `D003-R181` for two independent reasons:

1. it was triggered before the complete Amendment 028 implementation qualification gate had validly completed;
2. even if the trigger had been authorized, Linux/x64 emitted `FAIL`, so the required same-attempt three-platform PASS condition was not satisfied.

The macOS and Windows PASS records remain real historical machine evidence from that consumed run, but they cannot substitute for either platform in any future attempt.

The Linux failure also proves that disabling automatic compaction did not make the sanitized-export identity boundary universally PASS on this consumed tree. It does **not** prove why Linux failed. No raw sanitized export or transcript content is available in this amendment, and `failure_reason = unclassified_internal_failure` must not be inflated into a more specific diagnosis.

The aggregate-discriminator review finding is separate from the runtime Linux failure. The metadata defect must be repaired because the independent review required it; the runtime failure must not be claimed fixed merely by repairing metadata.

## Current governance conclusion

Canonical task truth is:

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

And authority truth is:

```text
AMENDMENT_028_IMPLEMENTATION_QUALIFICATION = INCOMPLETE_UNRECONCILED_SUBSTANTIVE_REVIEW_FINDING
OUT_OF_ORDER_TRIGGER_2ABA6520 = CONSUMED_NONQUALIFYING_HISTORY
RUN_34271008060 = CONSUMED_NONQUALIFYING_HISTORY
AMENDMENT_028_PROVIDER_REEXECUTION_AUTHORITY = SUSPENDED
```

No current canonical state authorizes another `[provider-prereq]` trigger.

## Bounded repair authority after Amendment 029 qualification

Only if this Amendment 029 itself satisfies its complete qualification gate and becomes canonical may one later bounded implementation PR modify exactly:

```text
scripts/recovery-provider-prereq.mjs
```

That implementation PR may change only the existing aggregate `opencode_evidence` self-test discriminator metadata required by the exact PR `#102` substantive review finding.

The pre-repair value is:

```text
temporary-qualification-config-model-identity-only+sanitized-export-canonical-lineage-bound-identity
```

The required repaired value is:

```text
temporary-qualification-config-model-identity-only+sanitized-export-canonical-lineage-bound-identity+autocompact-disabled
```

The existing separate Amendment 028 field must remain exactly:

```text
amendment_028_opencode_autocompact = OPENCODE_DISABLE_AUTOCOMPACT=1
```

No runtime behavior change is authorized by this repair.

## Deterministic repair requirements

The later repair PR must prove at minimum:

1. exactly one repository path changes: `scripts/recovery-provider-prereq.mjs`;
2. the pre-repair aggregate `opencode_evidence` value occurs exactly once;
3. the post-repair aggregate value occurs exactly once and appends exactly `+autocompact-disabled`;
4. the complete pre-repair discriminator prefix is preserved byte-for-byte;
5. `amendment_028_opencode_autocompact` remains exactly `OPENCODE_DISABLE_AUTOCOMPACT=1`;
6. the complete `applyAmendment028(...)` transformation remains byte-for-byte unchanged;
7. the complete Amendment 026 `extractOpenCodeIdentity(...)` validator remains byte-for-byte unchanged;
8. the generated OpenCode environment still contains exactly one `OPENCODE_DISABLE_AUTOCOMPACT: '1'` source entry;
9. the effective `openCodeEnvironment(...)` self-test still proves exact value `1`;
10. every Amendment 013–028 deterministic self-test remains passing;
11. provider/model/runtime/CLI pins, revisions, files, digests, URLs, prompts, templates, timeouts, tools, permissions, write target, workflow semantics, and provider-record semantics remain unchanged;
12. no dependency is added;
13. provider/Gold/real-agent jobs remain skipped on pull-request code.

A direct bounded metadata replacement is preferred. Generic docstrings, abstractions, cleanup, dependency changes, workflow changes, or unrelated refactors are not authorized.

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

- Amendment 028 OpenCode environment behavior;
- `OPENCODE_DISABLE_AUTOCOMPACT: '1'`;
- Amendment 026 lineage semantics;
- runtime/model/provider/CLI identity or pins;
- Layer-A behavior;
- Pi behavior;
- OpenCode prompt, provider, model, tools, permissions, write target, export command, or parser/validator semantics;
- provider result schema or failure classification;
- workflow triggers or runner matrix;
- dependencies;
- Gold promotion;
- downstream task authority.

The Linux runtime failure from run `34271008060` is not authorized for speculative implementation repair by this amendment.

## Amendment 029 qualification gate

This docs-only Amendment 029 PR must satisfy all of the following on one exact final head **before merge**:

1. exact canonical base at branch creation is `2aba6520bbefaaac4dea1f45754dc3d6cd22f844` unless live canonical `main` changes and the branch is reconciled forward without history rewrite;
2. exactly one new documentation path changes;
3. deterministic Linux/macOS/Windows CI passes on the exact final head;
4. provider/Gold/real-agent marker jobs remain skipped on pull-request code;
5. a fresh independent substantive semantic/security/licensing/governance review is submitted on the exact final head while the PR remains open;
6. that review substantively checks the PR `#102` qualification defect, the out-of-order trigger classification, the exact run `34271008060` records, the no-reuse boundary, the bounded metadata repair authority, and the continued prohibition on provider execution;
7. every substantive review finding is reconciled and zero substantive review threads remain unresolved;
8. unavailable, generic, summary-only, rate-limited, billing-blocked, stale-head, self-review, or failed-after-close output remains non-PASS;
9. exact base/head/tree/scope/checks/reviews/threads/comments/mergeability are reverified immediately before merge;
10. merge uses expected-head protection;
11. canonical post-merge deterministic Linux/macOS/Windows CI passes with provider execution skipped;
12. canonical authority is re-read after that post-merge PASS before the bounded metadata repair begins.

This amendment must not be merged merely because CI is green.

## Repair implementation qualification gate

The later one-file metadata repair PR must, on one exact final head before merge:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. change only the bounded aggregate `opencode_evidence` discriminator required above;
3. satisfy every deterministic repair requirement above;
4. pass deterministic Linux/macOS/Windows CI;
5. pass all wrapper pre-install and post-install R181 self-tests on Linux/macOS/Windows;
6. keep provider/Gold/real-agent jobs skipped on pull-request code;
7. receive a fresh independent substantive semantic/security/licensing/governance review on the exact final head while the PR remains open;
8. explicitly verify reconciliation of the original PR `#102` aggregate-discriminator finding;
9. reconcile every substantive finding and leave zero unresolved substantive review threads;
10. preserve unavailable/skipped/blocked/generic-warning systems as non-PASS;
11. reverify exact base/head/tree/scope/checks/reviews/threads/comments/mergeability immediately before merge;
12. merge with expected-head protection;
13. pass canonical post-merge Linux/macOS/Windows deterministic CI with provider execution skipped;
14. re-read canonical authority before any future provider trigger.

## Future R181 execution boundary

Only after Amendment 029 and its bounded metadata repair both satisfy their complete qualification gates may a later canonical amendment decide whether one new R181 provider attempt is justified.

Amendment 029 does **not** itself authorize that new attempt because the consumed out-of-order run `34271008060` exposed a real Linux/x64 runtime failure at `opencode_sanitized_export_identity_exact` whose cause is not established by current durable evidence.

Any future re-execution authority must therefore be separately shaped from exact canonical truth after the metadata repair qualifies. It must preserve run `34271008060` as consumed and non-retriable, and it must not reuse its macOS or Windows PASS records as future same-attempt evidence.

## Non-authority

Amendment 029 does not authorize:

- treating PR `#102` as fully qualified;
- treating its deterministic or post-merge CI as a substitute for review-finding reconciliation;
- treating trigger `2aba6520bbefaaac4dea1f45754dc3d6cd22f844` as authorized after the fact;
- treating run `34271008060` as a qualifying Amendment 028 attempt;
- rerunning, retrying, selectively replaying, or substituting any platform result from run `34271008060`;
- inventing a specific cause for the Linux `unclassified_internal_failure`;
- using the metadata discriminator repair to claim the Linux runtime defect is fixed;
- creating another `[provider-prereq]` trigger directly after this amendment or its repair;
- weakening Amendment 026 lineage semantics;
- changing provider/model/runtime/CLI pins, prompts, tools, permissions, or write target;
- adding dependencies or workflow changes;
- Gold promotion;
- `D003-R190`, `D003-R200`, `D003-R210`, `D003-R211`, or `D003-R212` execution before genuine future same-attempt R181 qualification;
- terminal Specification 003 closeout;
- Specification 004 activation.
