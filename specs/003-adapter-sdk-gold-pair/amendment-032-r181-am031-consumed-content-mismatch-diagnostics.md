# Specification 003 Amendment 032 — Consumed Amendment 031 OpenCode Content-Mismatch Diagnostics

**Status:** `PROPOSED` until this file is independently qualified and merged to canonical `main` through the gate below while Specification 003 remains active.
**Task:** `D003-R181` consumed-attempt reconciliation and bounded diagnostic authority only.
**Exact proposal base:** `022a0605c9dd2899bde06ac8e080b73fc912c2dc`.
**Consumed Amendment 031 trigger:** `022a0605c9dd2899bde06ac8e080b73fc912c2dc`.
**Consumed Amendment 031 provider run:** `34291326937` (`CI #298`).

## Purpose

The single Amendment 031-authorized same-tree R181 attempt is complete and consumed.

Linux/x64 and Windows/x64 passed every required provider-prerequisite fact in the same attempt. macOS/arm64 failed at the first pre-mark OpenCode exact-smoke verification with fixed failure code:

```text
smoke_fixture_content_mismatch
```

That fixed code establishes only that the first pre-mark `verifyExactSmokeWithDiagnostics(opencodeRepo, opencodeBefore)` execution reached its final exact-content predicate and observed content not equal to canonical:

```text
DELETHOS_R181_OK\n
```

It does not reveal the mismatching bytes and does not identify a root cause.

This amendment therefore authorizes one narrower content-shape diagnostic layer. It does not repair, normalize, rewrite, trim, canonicalize, or newly accept any mismatching content.

## Exact consumed-attempt evidence

Exact trigger commit:

```text
022a0605c9dd2899bde06ac8e080b73fc912c2dc
```

Exact trigger tree:

```text
0d364df0d85926948ab262fd750755763ecc108b
```

The trigger changed zero repository files and its complete commit message was exactly:

```text
[provider-prereq]
```

Workflow run `34291326937` used `run_attempt = 1` and produced the following provider jobs in one attempt:

```text
windows/x64 = job 102278288889 = SUCCESS
linux/x64   = job 102278289080 = SUCCESS
macos/arm64 = job 102278289123 = FAILURE
```

Windows/x64 and Linux/x64 each emitted schema `delethos.spec003.r181-provider-prereq.v1`, `outcome = PASS`, `failed_at = null`, `failure_reason = null`, and every required fact `true`.

The macOS/arm64 machine record emitted:

```text
schema = delethos.spec003.r181-provider-prereq.v1
outcome = FAIL
failed_at = opencode_sanitized_export_identity_exact
failure_reason = smoke_fixture_content_mismatch
pi_first_request_shaper_witness_exact = true
pi_bounded_tool_write_smoke = true
pi_first_request_tool_choice_exact = true
opencode_cli_version_exact_1_18_26 = true
opencode_requested_identity_exact = true
opencode_nonempty_completion = true
opencode_permission_policy_exact_default_deny = true
opencode_bounded_tool_write_smoke = false
opencode_sanitized_export_identity_exact = false
```

`failed_at` remains the first false entry by `REQUIRED_FACTS` order, not an execution-stage trace. The fixed failure code is the stage-local evidence.

Because `smoke_fixture_content_mismatch` is emitted only after snapshot, repository identity, target existence, stat/type, worktree-status, and read checks have succeeded inside the authorized pre-mark helper, the attempt establishes that the exact-content comparison was reached and failed. It does not establish the later sanitized-export stage was reached.

Run `34291326937` is consumed and MUST NOT be rerun, retried, selectively replayed, or substituted. Its Linux and Windows PASS results are historical evidence only and cannot substitute for those platforms in a future same-attempt qualification.

## Canonical task conclusion

The consumed attempt did not satisfy the three-platform same-attempt completion rule.

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

## Bounded diagnostic decision

Only after this Amendment 032 qualifies and becomes canonical may one later implementation PR modify exactly:

```text
scripts/recovery-provider-prereq.mjs
```

The implementation may refine only the existing `smoke_fixture_content_mismatch` result at the first pre-mark OpenCode exact-smoke execution.

It MUST NOT change the accepted content. Canonical acceptance remains exactly:

```text
SMOKE_CONTENT = 'DELETHOS_R181_OK\n'
```

The implementation may classify a non-matching UTF-8 string into exactly one of the following five content-free fixed codes:

```text
opencode_smoke_content_missing_final_lf
opencode_smoke_content_crlf
opencode_smoke_content_extra_final_lf
opencode_smoke_content_utf8_bom
opencode_smoke_content_other_mismatch
```

Their meanings are strictly bounded:

```text
opencode_smoke_content_missing_final_lf
  content is exactly DELETHOS_R181_OK with no terminal LF

opencode_smoke_content_crlf
  content is exactly DELETHOS_R181_OK followed by CRLF

opencode_smoke_content_extra_final_lf
  content is exactly DELETHOS_R181_OK followed by two LF bytes

opencode_smoke_content_utf8_bom
  decoded content is exactly U+FEFF followed by canonical SMOKE_CONTENT

opencode_smoke_content_other_mismatch
  content differs from canonical SMOKE_CONTENT and from all four named variants
```

No code above asserts that any named variant occurred in run `34291326937`.

## Required implementation shape

The later one-file implementation must preserve the Amendment 031 behavior everywhere except the final mismatch classification at the first pre-mark OpenCode exact-smoke call.

It must:

1. preserve complete `applyAmendment028(...)` byte-for-byte at canonical LF SHA-256 `fd65eb23631cdef54dc23b2dffb7f12b5748841fa60915b22a27f80dbff4ef03`;
2. preserve complete `applyAmendment029(...)` byte-for-byte at canonical LF SHA-256 `480535c7a90761fd94313b09e54d78481279600a73d01fd286c8d793288b73af`;
3. preserve complete `applyAmendment031(...)` byte-for-byte at canonical LF SHA-256 `a3764097e624cdcbfff873c13d8f89f7f78e2e5aa39df1847330cd4928f4069f`;
4. require the exact pre-Amendment-032 generated candidate blob `eae49312e18bca2d572119f09ff7519296427727`;
5. require that none of the five Amendment 032 codes already exists in the pre-Amendment-032 candidate;
6. add exactly the five codes above once each to the bounded failure vocabulary;
7. preserve all Amendment 029 and Amendment 031 fixed codes and mappings unchanged;
8. preserve `SMOKE_CONTENT` byte-for-byte and preserve the exact equality acceptance predicate `content !== SMOKE_CONTENT`;
9. classify only after that predicate proves content is noncanonical;
10. use only exact constant comparisons for the four named variants;
11. map every other noncanonical content value to `opencode_smoke_content_other_mismatch`;
12. never include the observed content, a substring, length, digest, encoding dump, escaped representation, path, repository status, transcript, session/message id, credential, header, prompt, model prose, or tool argument in normalized evidence;
13. keep the Linux Pi call behavior exactly equivalent to Amendment 031, including its existing generic `smoke_fixture_content_mismatch` code;
14. keep every self-test-only `verifyExactSmoke(...)` call behavior unchanged;
15. keep the later post-export macOS `verifyExactSmoke(...)` execution behaviorally and textually unchanged;
16. keep snapshot, repository-identity, existence, stat/type, status, read, and content-check ordering unchanged;
17. preserve fail-closed behavior and the existing failure stop point;
18. never rewrite, trim, normalize, or repair the file before comparison;
19. add deterministic positive/negative fixtures for canonical content, all four named variants, and the generic fallback;
20. prove canonical content still passes rather than being classified;
21. prove arbitrary unknown exception text still serializes only as `unclassified_internal_failure`;
22. prove fixed-code machine records do not leak hostile content sentinels;
23. preserve `REQUIRED_FACTS`, their order, schema, and `failed_at` derivation unchanged;
24. preserve all runtime/provider/model/CLI pins, bytes, digests, URLs, prompts, templates, timeouts, tools, permissions, environment semantics, and workflow semantics;
25. add no dependency;
26. reverse-transform exactly to the pre-Amendment-032 generated candidate byte-for-byte.

A small context parameter or dedicated OpenCode-only classifier/helper is permitted only if deterministic source discriminators prove Pi and every excluded call site retain Amendment 031 behavior.

## Explicitly unauthorized changes

This amendment does not authorize changes to:

```text
scripts/recovery-provider-prereq-impl.mjs
.github/workflows/ci.yml
packages/adapters/**
packages/runtime/**
package.json
pnpm-lock.yaml
```

It does not authorize:

- accepting CRLF, missing LF, extra LF, BOM-prefixed content, or any other mismatch;
- changing `SMOKE_CONTENT`;
- changing the OpenCode prompt;
- trimming or line-ending normalization;
- changing OpenCode version, provider, model, permissions, or environment posture;
- changing Pi behavior;
- changing the later post-export verification;
- logging raw content or any dynamic content-derived value;
- changing `REQUIRED_FACTS` or `failed_at` semantics;
- workflow or runner-matrix changes;
- dependencies;
- Gold promotion;
- downstream R190+ execution;
- Specification 004 activation.

## Amendment 032 qualification gate

This docs-only amendment must satisfy all of the following on one exact final head before merge:

1. exact canonical proposal base is `022a0605c9dd2899bde06ac8e080b73fc912c2dc` unless live `main` changes and the branch is explicitly reconciled forward without history rewrite;
2. exactly one new documentation path changes;
3. deterministic Linux/macOS/Windows CI passes on the exact final head;
4. provider/Gold/real-agent jobs remain skipped on pull-request code;
5. a fresh independent substantive semantic/security/licensing/governance review is completed on the exact final head while the PR remains open;
6. that review explicitly checks consumed run `34291326937`, all three provider records, `failed_at` versus fixed-code semantics, the exact-content non-repair boundary, the five-code vocabulary, no-leak rules, call-site restriction, and downstream non-authority;
7. every substantive finding is reconciled and zero substantive review threads remain unresolved;
8. blocked, unavailable, skipped, rate-limited, generic, summary-only, stale-head, and self-review systems remain non-PASS;
9. exact base/head/tree/scope/checks/reviews/threads/comments/mergeability are reverified immediately before merge;
10. merge uses expected-head protection;
11. canonical post-merge deterministic Linux/macOS/Windows CI passes with provider execution skipped;
12. canonical authority is re-read after post-merge PASS before diagnostic implementation begins.

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
10. merge with expected-head protection;
11. pass canonical post-merge Linux/macOS/Windows deterministic CI with provider execution skipped;
12. re-read canonical authority before any provider trigger.

## One future bounded diagnostic attempt

Only after Amendment 032 and its one-file implementation both satisfy their complete qualification gates may exactly one new same-tree canonical R181 attempt be created.

The trigger commit must reuse the exact qualified implementation tree, change zero repository content, and have complete commit message exactly:

```text
[provider-prereq]
```

That future attempt is consumed when triggered regardless of PASS, FAIL, infrastructure error, cancellation, timeout, or unavailable result.

Run `34291326937` and every earlier R181 attempt remain consumed and may not be rerun, retried, selectively replayed, or substituted.

If Linux/x64, macOS/arm64, and Windows/x64 all emit `outcome = PASS` with every required fact true in the same future attempt, `D003-R181` may become complete and canonical authority must be re-read before `D003-R190`.

If macOS or any other platform fails with one of the new fixed codes, that result is diagnostic evidence only. A separately qualified repair amendment is required before any behavior change. If the result is `opencode_smoke_content_other_mismatch`, no more specific content or cause may be invented.

## Non-authority

This amendment does not complete `D003-R181`, qualify Pi or OpenCode as Gold, authorize downstream R190+ work, authorize terminal Specification 003 closeout, or activate Specification 004.

Until every gate above is satisfied by live evidence, the project remains at the existing Specification 003 R181 evidence frontier.
