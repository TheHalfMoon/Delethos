# Specification 003 Amendment 029 — Consumed Amendment 028 R181 Attempt and Linux Sanitized-Export Diagnostics

**Status:** `NORMATIVE` iff this file is independently qualified and merged to canonical `main` through the gate below while Specification 003 remains active.  
**Task:** `D003-R181` consumed-attempt reconciliation, bounded failure-classification diagnostics, and one future diagnostic R181 attempt only.  
**Exact proposal base:** `2aba6520bbefaaac4dea1f45754dc3d6cd22f844`.  
**Qualified Amendment 028 implementation PR:** `#102`.  
**Qualified Amendment 028 implementation head:** `74bfd3d3ad619ca6fc942ec7f4b0cfa3d18ef903`.  
**Qualified Amendment 028 implementation merge:** `055d7007a21f371540e1967876a040308306747a`.  
**Consumed Amendment 028 provider trigger:** `2aba6520bbefaaac4dea1f45754dc3d6cd22f844`.  
**Consumed Amendment 028 provider run:** `34271008060`.

## Purpose

Amendment 028 and its one-file implementation completed their deterministic qualification gates, after which canonical `main` advanced by one same-tree, zero-content-change commit whose complete message was exactly `[provider-prereq]`.

That trigger consumed the single Amendment 028-authorized R181 attempt. The same workflow attempt produced:

```text
linux/x64 = FAIL at opencode_sanitized_export_identity_exact
macos/arm64 = PASS
windows/x64 = PASS
```

The Linux record reported only the bounded failure reason:

```text
unclassified_internal_failure
```

The exact current evidence therefore does not establish which fail-closed subcondition inside the bounded OpenCode sanitized-export stage rejected Linux. This amendment preserves the consumed attempt exactly and authorizes only enough deterministic diagnostic classification to make a later failure safe and actionable without logging raw sanitized export, transcript content, secrets, paths, model prose, tool arguments, or other unbounded data.

No current evidence justifies weakening the Amendment 026 lineage predicate, changing OpenCode behavior again, changing provider/model/runtime/CLI pins, or promoting either adapter to Gold.

## Exact PR #102 qualification truth

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

Exact-head workflow run `34269792362` completed successfully:

```text
core / ubuntu-latest = SUCCESS
core / macos-latest = SUCCESS
core / windows-latest = SUCCESS
```

All provider/Gold/real-agent marker jobs remained skipped on pull-request code.

A fresh independent CodeRabbit review was submitted while PR `#102` remained open and covered the exact final range:

```text
base = 84def825167c868682929e82b2cec5a5047f0361
head = 74bfd3d3ad619ca6fc942ec7f4b0cfa3d18ef903
changed path = scripts/recovery-provider-prereq.mjs
```

The review contained one suggestion under the review's explicit section:

```text
Nitpick comments (1)
```

and classified it:

```text
Data Integrity & Integration | Trivial | Quick win
```

The suggestion was to append an Amendment 028 suffix to the aggregate `opencode_evidence` metadata string. It did not report a semantic, security, licensing, governance, runtime, pin, permission, workflow, or lineage defect. Amendment 028 required reconciliation of every **substantive** finding, not every explicit `Nitpick`/`Trivial` suggestion. There were zero substantive review threads.

The implementation already exposed Amendment 028 through both:

```text
source = DETERMINISTIC_R181_AMENDMENT_028_DISCRIMINATOR
amendment_028_opencode_autocompact = OPENCODE_DISABLE_AUTOCOMPACT=1
```

A PR comment recorded why the trivial aggregate-string suggestion did not require a code change under the bounded Amendment 028 acceptance gate. Qodo remained billing-blocked and was not promoted to PASS.

Immediately before merge, the exact head, base, one-file scope, deterministic checks, review state, zero review threads, comments, and mergeability were revalidated. PR `#102` then merged with expected-head protection as:

```text
merge = 055d7007a21f371540e1967876a040308306747a
tree = a0fda00835538be8419e53c15d1ec6f926baac42
```

Canonical post-merge workflow run `34270600108` then completed deterministic Linux/macOS/Windows PASS with provider/Gold/real-agent jobs skipped.

Therefore this amendment records:

```text
AMENDMENT_028_IMPLEMENTATION_QUALIFICATION = COMPLETE
TRIVIAL_REVIEW_SUGGESTION = NON_BLOCKING
```

This amendment must not retroactively relabel the CodeRabbit `Nitpick`/`Trivial` suggestion as a substantive finding.

## Authorized Amendment 028 trigger truth

After the post-merge deterministic PASS and canonical authority reread, `main` advanced from:

```text
055d7007a21f371540e1967876a040308306747a
```

to:

```text
trigger = 2aba6520bbefaaac4dea1f45754dc3d6cd22f844
parent = 055d7007a21f371540e1967876a040308306747a
tree = a0fda00835538be8419e53c15d1ec6f926baac42
complete commit message = [provider-prereq]
```

The trigger reused the already-qualified implementation tree and changed zero repository files. It therefore matched the Amendment 028 trigger shape.

Workflow run:

```text
34271008060
```

is the single consumed Amendment 028 R181 attempt. It must never be rerun, retried, selectively replayed, or partially substituted into a later attempt.

## Consumed run 34271008060 machine truth

Workflow run `34271008060` completed:

```text
overall conclusion = FAILURE
run_attempt = 1
head_sha = 2aba6520bbefaaac4dea1f45754dc3d6cd22f844
```

The deterministic core matrix passed:

```text
core / ubuntu-latest = SUCCESS
core / macos-latest = SUCCESS
core / windows-latest = SUCCESS
```

Other real-agent/Gold marker jobs remained skipped except for the specifically authorized R181 provider-prerequisite matrix.

The exact provider-prerequisite matrix was:

```text
linux/x64:
  job = 102212292913
  outcome = FAIL
  failed_at = opencode_sanitized_export_identity_exact
  failure_reason = unclassified_internal_failure

macos/arm64:
  job = 102212293162
  outcome = PASS
  failed_at = null
  failure_reason = null

windows/x64:
  job = 102212293149
  outcome = PASS
  failed_at = null
  failure_reason = null
```

### Linux evidence boundary

Before the Linux failure, the machine record independently proved all required prerequisite facts through the OpenCode requested-identity boundary, including exact runtime/model provenance, loopback/no-auth server posture, pinned template/tool capability, anonymous completion, forced-tool stream witness, Pi version/identity/completion/write-only authority/first-request shaping/write smoke/tool-choice, OpenCode version/requested identity, non-empty completion, and default-deny permission policy.

The exact failing fact was:

```text
opencode_sanitized_export_identity_exact = false
```

and the bounded reason was:

```text
unclassified_internal_failure
```

Later record fields remained false because the run failed closed before they could be positively established. They must not be reinterpreted as independent proof of secret use, repository mutation, or additional runtime defects.

### macOS and Windows evidence boundary

The macOS/arm64 and Windows/x64 records independently emitted:

```text
outcome = PASS
failed_at = null
failure_reason = null
all REQUIRED_FACTS = true
```

Those PASS records are genuine history but cannot substitute for either platform in any later same-attempt qualification.

## Interpretation

Run `34271008060` cannot complete `D003-R181` because Linux/x64 failed. Amendment 028 explicitly required all three required platforms to PASS in the same attempt.

The run proves only that the current Linux execution reached the bounded OpenCode sanitized-export identity stage and failed there with an unclassified internal failure. It does **not** prove:

- malformed JSON;
- session-ID mismatch;
- malformed message or part shape;
- duplicate message identity;
- malformed user or assistant identity;
- canonical-user cardinality drift;
- canonical user provider/model mismatch;
- orphan assistant lineage;
- assistant parent-role mismatch;
- non-user-bound assistant lineage;
- canonical assistant provider/model mismatch;
- unrelated non-compaction assistant lineage;
- missing canonical direct-child assistant;
- automatic compaction;
- any particular upstream OpenCode defect;
- any platform-specific filesystem, timing, or process cause.

No raw export/transcript evidence was logged, by design. None of those possible subconditions may be promoted from hypothesis to fact.

## Current governance conclusion

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
AMENDMENT_028_ATTEMPT = CONSUMED
```

No current canonical state authorizes another `[provider-prereq]` trigger until this Amendment 029 and its later diagnostic implementation both complete their full qualification gates.

## Bounded diagnostic implementation authority

Only if this Amendment 029 itself qualifies and becomes canonical may one later implementation PR modify exactly:

```text
scripts/recovery-provider-prereq.mjs
```

No other repository path is authorized.

The implementation may only improve bounded failure classification for the generated OpenCode sanitized-export identity stage. It may:

1. add fixed, content-free failure-reason codes for the existing `JSON.parse(...)` and Amendment 026 `extractOpenCodeIdentity(...)` rejection boundaries;
2. replace only the corresponding generic `Error` construction sites with the existing fixed-code failure mechanism or an equivalently bounded mechanism;
3. preserve every existing acceptance/rejection predicate, comparison, cardinality rule, parent/lineage rule, provider/model identity rule, and control-flow branch exactly;
4. preserve successful normalized evidence exactly;
5. add deterministic self-tests proving every authorized fixed code maps to one existing rejection boundary and no raw error message or untrusted value can enter the final machine record;
6. add transformation discriminators and reverse-restoration proof needed to show the change is diagnostic only;
7. update only bounded wrapper self-test metadata needed to identify Amendment 029 diagnostics.

The authorized fixed-code vocabulary is limited to:

```text
opencode_export_invalid_json
opencode_export_session_identity_mismatch
opencode_export_malformed_messages
opencode_export_malformed_message_identity
opencode_export_duplicate_message_identity
opencode_export_malformed_message_parts
opencode_export_malformed_user_model_identity
opencode_export_canonical_user_count_mismatch
opencode_export_canonical_user_identity_mismatch
opencode_export_malformed_assistant_lineage
opencode_export_orphan_assistant_lineage
opencode_export_assistant_parent_not_user
opencode_export_assistant_not_user_bound
opencode_export_canonical_assistant_identity_mismatch
opencode_export_unrelated_assistant_not_compaction_bound
opencode_export_missing_canonical_assistant
```

No code may include transcript text, sanitized-export content, message IDs, session IDs, paths, headers, tokens, credentials, prompts, model prose, tool arguments, or arbitrary exception messages in `failure_reason`.

If a failure falls outside the exact authorized fixed-code boundaries, it must continue to report only the existing bounded fallback:

```text
unclassified_internal_failure
```

## Deterministic diagnostic requirements

The later one-file implementation PR must prove at minimum:

1. exactly one repository path changes: `scripts/recovery-provider-prereq.mjs`;
2. the pre-Amendment-029 generated candidate contains none of the new fixed OpenCode export codes;
3. every new fixed code is declared exactly once in the bounded failure vocabulary;
4. malformed JSON maps only to `opencode_export_invalid_json`;
5. every existing Amendment 026 negative synthetic fixture maps to its exact corresponding fixed code;
6. every existing Amendment 026 positive synthetic fixture still returns exactly the same normalized evidence as before;
7. the boolean predicates, comparisons, cardinality checks, lineage requirements, and provider/model identity semantics of Amendment 026 are unchanged;
8. arbitrary unknown exception text still maps only to `unclassified_internal_failure`;
9. sentinel credentials, headers, paths, transcript strings, model prose, message IDs, session IDs, and tool arguments never appear in serialized machine-record output;
10. the complete `applyAmendment028(...)` transformation remains byte-for-byte unchanged;
11. `OPENCODE_DISABLE_AUTOCOMPACT: '1'` remains present exactly once in the generated OpenCode environment;
12. `amendment_028_opencode_autocompact` remains exactly `OPENCODE_DISABLE_AUTOCOMPACT=1`;
13. the existing aggregate `opencode_evidence` string is not required to change by this amendment;
14. every Amendment 013–028 deterministic self-test continues to pass;
15. runtime/provider/model/CLI versions, revisions, files, digests, URLs, prompts, templates, timeouts, tools, permissions, write target, environment behavior, workflow semantics, and provider-record required facts remain unchanged;
16. no dependency is added;
17. reverse transformation restores the complete pre-Amendment-029 generated candidate byte-for-byte;
18. provider/Gold/real-agent jobs remain skipped on pull-request code.

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

- Amendment 026 lineage acceptance semantics;
- Amendment 028 autocompaction isolation behavior;
- `OPENCODE_DISABLE_AUTOCOMPACT: '1'`;
- OpenCode or Pi versions;
- llama.cpp runtime release/commit;
- provider/model identity or model bytes;
- provider/model/runtime URLs or digests;
- prompts or chat templates;
- tools, permissions, or write target;
- Layer-A behavior;
- Pi behavior;
- OpenCode execution arguments other than fixed diagnostic error classification inside the generated candidate;
- workflow triggers or runner matrix;
- provider required-fact schema;
- dependencies;
- Gold promotion;
- downstream task authority.

It does not authorize a speculative fix for the Linux runtime failure before a bounded diagnostic record identifies a specific existing rejection boundary.

## Amendment 029 qualification gate

This docs-only Amendment 029 PR must satisfy all of the following on one exact final head **before merge**:

1. exact canonical base at branch creation is `2aba6520bbefaaac4dea1f45754dc3d6cd22f844` unless live canonical `main` changes and the branch is reconciled forward without history rewrite;
2. exactly one new documentation path changes;
3. deterministic Linux/macOS/Windows CI passes on the exact final head;
4. provider/Gold/real-agent marker jobs remain skipped on pull-request code;
5. a fresh independent substantive semantic/security/licensing/governance review is submitted on the exact final head while this PR remains open;
6. that review substantively checks the PR `#102` qualification classification, exact run `34271008060` records, consumed-attempt/no-reuse boundary, diagnostic-only authority, fixed-code no-leak boundary, and future one-attempt gate;
7. every substantive review finding is reconciled and zero substantive review threads remain unresolved;
8. unavailable, generic, summary-only, rate-limited, billing-blocked, stale-head, self-review, or failed-after-close output remains non-PASS;
9. exact base/head/tree/scope/checks/reviews/threads/comments/mergeability are reverified immediately before merge;
10. merge uses expected-head protection;
11. canonical post-merge deterministic Linux/macOS/Windows CI passes with provider execution skipped;
12. canonical authority is re-read after that post-merge PASS before diagnostic implementation begins.

This amendment must not be merged merely because CI is green.

## Diagnostic implementation qualification gate

The later one-file diagnostic implementation PR must, on one exact final head before merge:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. satisfy every deterministic diagnostic requirement above;
3. pass deterministic Linux/macOS/Windows CI;
4. pass all wrapper pre-install and post-install R181 self-tests on Linux/macOS/Windows;
5. keep provider/Gold/real-agent jobs skipped on pull-request code;
6. receive a fresh independent substantive semantic/security/licensing/governance review on the exact final head while the PR remains open;
7. reconcile every substantive finding and leave zero unresolved substantive review threads;
8. preserve unavailable/skipped/blocked/generic-warning systems as non-PASS;
9. reverify exact base/head/tree/scope/checks/reviews/threads/comments/mergeability immediately before merge;
10. merge with expected-head protection;
11. pass canonical post-merge Linux/macOS/Windows deterministic CI with provider execution skipped;
12. re-read canonical authority before any provider trigger.

## One new bounded diagnostic R181 attempt

Only after Amendment 029 and its one-file diagnostic implementation both satisfy their complete qualification gates may exactly one new same-tree canonical R181 attempt be created.

The trigger commit must:

- use exactly the already-qualified canonical diagnostic implementation tree;
- change no repository content;
- have complete commit message exactly `[provider-prereq]` and nothing else;
- be created only after implementation post-merge deterministic Linux/macOS/Windows PASS;
- preserve canonical-main/repository/no-secret/`contents: read` workflow boundaries.

The attempt is consumed when triggered regardless of PASS, FAIL, infrastructure error, cancellation, timeout, or unavailable result.

Run `34271008060` and every earlier R181 run remain consumed and may not be rerun, retried, selectively replayed, or substituted.

## Success and diagnostic boundaries

If the single Amendment 029-authorized attempt independently emits on Linux/x64, macOS/arm64, and Windows/x64:

```text
schema = delethos.spec003.r181-provider-prereq.v1
outcome = PASS
all REQUIRED_FACTS = true
```

then `D003-R181` may become complete and canonical authority must be re-read before `D003-R190`.

If any required platform fails, the attempt does not qualify R181. A fixed `failure_reason` from the authorized OpenCode export vocabulary is diagnostic evidence only. It may shape a later separately qualified bounded amendment; it is not itself repair authority and must not be used to weaken the validator.

If the failure remains `unclassified_internal_failure`, that result remains exact evidence and no specific cause may be invented.

## Non-authority

Amendment 029 does not authorize:

- retroactively treating the PR `#102` CodeRabbit `Nitpick`/`Trivial` suggestion as a substantive finding;
- retroactively classifying the Amendment 028 implementation or trigger as unqualified without new contradictory canonical evidence;
- rerunning or retrying run `34271008060`;
- reusing its macOS or Windows PASS records in any later attempt;
- exposing raw sanitized exports or transcript content;
- logging secrets, credentials, paths, headers, prompts, model prose, tool arguments, session IDs, or message IDs as diagnostic output;
- changing Amendment 026 acceptance semantics;
- speculative Linux runtime repair before a bounded diagnostic reason exists;
- changing provider/model/runtime/CLI pins, prompts, tools, permissions, workflow semantics, or dependencies;
- Gold promotion;
- `D003-R190`, `D003-R200`, `D003-R210`, `D003-R211`, or `D003-R212` execution before genuine same-attempt R181 qualification;
- terminal Specification 003 closeout;
- Specification 004 activation.
