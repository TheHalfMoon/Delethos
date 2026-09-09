# Specification 003 Amendment 033 — D003-R190 Pi Gold Execution Harness

**Status:** `PROPOSED` until this file is independently qualified and merged to canonical `main` through the gate below while Specification 003 remains active.
**Task:** `D003-R190` shaping and execution authority only.
**Exact proposal base:** `fb137a6a634829a11fcf70cd4d8c0d1bb877fbe0`.

## Purpose

This amendment reconciles the genuine same-attempt `D003-R181` PASS and defines the smallest bounded implementation and execution surface needed to run the complete applicable Pi `v0.84.4` real-CLI Gold matrix without reusing provider-free recovery markers, weakening Gold cases, inventing provider evidence, or promoting Pi before machine results exist.

It does not execute Gold qualification itself, does not mark Pi `SUPPORTED` or `GOLD`, does not authorize OpenCode Gold work, and does not activate Specification 004.

## D003-R181 completion evidence

The Amendment 032-authorized trigger is:

```text
commit = fb137a6a634829a11fcf70cd4d8c0d1bb877fbe0
parent = 2495116e9e8912396b8205c4f8811c0168afef59
tree = 967da941462ce5437fe4b0974c2fd0c4d0ef0823
message = [provider-prereq]
changed_files = 0
```

The exact workflow attempt is:

```text
run = 34295859769
CI = #303
run_attempt = 1
head_sha = fb137a6a634829a11fcf70cd4d8c0d1bb877fbe0
```

Provider prerequisite jobs in that same attempt are:

```text
macos/arm64 = 102292237786 = PASS
linux/x64   = 102292237845 = PASS
windows/x64 = 102292237922 = PASS
```

Each emitted `delethos.spec003.r181-provider-prereq.v1` with:

```text
outcome = PASS
failed_at = null
failure_reason = null
```

and every required provider-prerequisite fact true.

Therefore, under Amendments 007, 008, and 032:

```text
D003-R181 = COMPLETE
D003-R190 = NEXT_AUTHORIZED_UNIT
D003-R200 = BLOCKED_ON_R190
D003-R210 = BLOCKED
D003-R211 = BLOCKED
D003-R212 = BLOCKED
PI_GOLD = NOT_QUALIFIED
OPENCODE_GOLD = NOT_QUALIFIED
SPEC_003_STATUS = ACTIVE_BLOCKED_REAL_GOLD
SPEC_004 = NOT_AUTHORIZED
```

Run `34295859769` and every earlier R181 attempt are consumed and MUST NOT be rerun, retried, selectively replayed, or substituted.

## Existing harness gap

Canonical `scripts/adapter-conformance.mjs` accepts only:

```text
--adapter <codex|claude>
```

It cannot execute Pi or OpenCode Gold qualification.

Canonical `[gold-recovery-probe]` authority from Amendment 005 is provider-free feasibility evidence only. It MUST NOT be reused, relabeled, or treated as provider-backed Pi Gold execution.

A new R190-specific harness and trigger are therefore required before any Pi Gold attempt can run.

## Exact selected Pi identity

The R190 candidate remains:

```text
adapter_id = pi-coding-agent
adapter_implementation_version = spec003-recovery.pi.3
cli_version = 0.84.4
candidate_status = SELECTED_GOLD_CANDIDATE
```

The provider/runtime/model identity must remain the exact canonical identity machine-qualified by R181. No floating version, alternate model, alternate runtime, fallback provider, or ambient provider may be substituted.

The R190 implementation MUST derive the exact current provider/runtime/model pins from canonical Specification 003 authority and MUST fail closed if they drift from the R181-qualified values.

## Applicable Gold case set

The complete mandatory Pi Gold case set for this unit is the canonical `BASELINE_GOLD_CASES` set:

```text
discovery-version
missing-binary
auth-failure
write-success
exact-cwd
provider-failure
timeout
stall
cancel
process-tree-cleanup
partial-diff
missing-final-response
large-output
special-paths
dirty-precondition
platform-launch
no-hidden-git-write
machine-result
config-isolation
```

Pi also claims explicit provider/model identity for the selected Gold strategy, so this R190 matrix MUST include:

```text
model-selection
malformed-model
```

The following optional claims remain outside R190 Gold eligibility because current canonical Pi product capability does not claim them:

```text
read-only
forbidden-write
resume
```

Excluding those optional claims does not promote them, mark them unsupported, or weaken a claimed capability. They remain `UNVERIFIED` unless a later separately authorized unit proves them.

## Authentication-case reconciliation

The selected provider path is a genuinely local no-auth provider only because R181 machine-observed that fact on Linux, macOS, and Windows.

For R190, `auth-failure` may PASS only as:

```text
NOT_APPLICABLE_PROVEN_LOCAL_NOAUTH
```

and only if the same R190 platform job independently re-observes the exact local provider posture required by canonical authority, including anonymous provider availability and no secret use.

The record MUST NOT call this credentialed success, invalid-credential success, or vendor authentication evidence.

If the R190 job cannot re-prove the local no-auth posture, `auth-failure` does not PASS.

## Missing-final-response real-CLI sentinel

The generic canonical conformance harness currently emits `UNVERIFIED` for `missing-final-response` because it has no independent real-CLI probe.

Pi `v0.84.4` provides a bounded real-CLI sentinel that may be used only for this Pi case. Its exact print-mode implementation sends a request only when `initialMessage` exists. A JSON-mode invocation with no initial message therefore provides a real Pi process path that can exit without producing an assistant final response and without contacting a provider merely to manufacture the condition.

The R190 implementation may add a conformance-only Pi no-prompt invocation path that:

1. launches the exact discovered Pi `v0.84.4` executable;
2. preserves the same configuration/home isolation and disabled extension/resource posture;
3. supplies no user prompt and no provider/model request;
4. uses the canonical Pi JSON parser and adapter result semantics rather than a synthetic transcript;
5. requires the resulting adapter status to represent missing/invalid final provider output rather than PASSing a fabricated message;
6. requires canonical fixture `HEAD`, refs, and worktree to remain unchanged;
7. records no provider success from this sentinel.

A mock provider, replayed transcript, scripted assistant response, or stdout text fixture MUST NOT satisfy this case.

## Case-specific tool posture

R190 MUST use the narrowest exact Pi tool allowlist needed by each case.

Allowed conformance-only tool postures are:

```text
NO_TOOLS
READ_ONLY_TOOL = read only
WRITE_ONLY_TOOL = write only
```

A separately named partial-diff write posture may use the same single `write` tool with a case-specific deterministic system prompt only to keep the real process active long enough for machine-observed cancellation after the first write. It MUST NOT add shell, edit, grep, find, ls, network, extension, or custom tools.

The `READ_ONLY_TOOL` posture is only a conformance tool allowlist for cases that need to read the fixture. It is NOT an enforced product `READ_ONLY` capability and MUST NOT promote Pi read-only support.

## Failure-path shaping

Provider success cases MUST use the exact real local llama.cpp + qualified model path.

Failure cases may use bounded transport fault injection only when no fake success is possible:

- `provider-failure`: an unreachable loopback endpoint or a deliberately stopped exact provider process may establish a real provider transport failure;
- `stall`: a loopback transport sink may accept the connection and deliberately provide no response so the canonical process supervisor can machine-observe the stall boundary.

Those fault endpoints MUST NOT emit model content, tool calls, success responses, or simulated provider identity. They are failure transport fixtures only.

Timeout and cancellation MUST be produced through the canonical process supervisor against a real Pi process. Process-tree cleanup MUST be independently observed from the termination result.

## Authorized implementation surface

Only after this amendment itself qualifies, merges, passes canonical post-merge deterministic CI, and canonical authority is re-read may an R190 implementation PR change only the minimum required subset of:

```text
packages/adapters/src/pi.ts
packages/adapters/test/pi.test.ts
scripts/recovery-pi-gold.mjs
.github/workflows/r190-pi-gold.yml
```

The implementation MAY add deterministic tests under existing Pi test infrastructure but MUST NOT change unrelated adapters, OpenCode behavior, shared Gold case definitions, package dependencies, lockfiles, runtime/model/provider pins, or Specification 004 surfaces.

No new external production dependency is authorized.

## Dedicated workflow and trigger

The new R190 workflow MUST be isolated from the existing provider-free recovery job.

Its execution predicate must require all of:

```text
event = push
target = canonical main
head commit complete message = [pi-gold]
```

The Gold workflow MUST use:

```text
permissions:
  contents: read
```

and MUST request, enumerate, inject, inspect, or persist no repository, environment, organization, vendor, or third-party secret.

The matrix is exactly:

```text
ubuntu-latest
macos-latest
windows-latest
```

with `fail-fast: false`.

The R190 Gold job MUST remain skipped on pull-request code and on ordinary canonical pushes.

## One future bounded Pi Gold attempt

After the R190 implementation PR independently qualifies, merges with expected-head protection, passes canonical post-merge deterministic Linux/macOS/Windows CI, and canonical authority is re-read, exactly one future R190 Gold attempt may be triggered.

The trigger MUST be a same-tree, zero-content-change canonical commit whose complete commit message is exactly:

```text
[pi-gold]
```

Before the push, the implementation merge tree and trigger tree MUST be identical and compare with zero changed files.

The attempt is consumed regardless of PASS, FAIL, UNAVAILABLE, UNVERIFIED, cancellation, infrastructure failure after job start, or mixed platform results. It MUST NOT be rerun, retried, selectively replayed, or supplemented with a second platform attempt unless a later independently qualified canonical amendment explicitly authorizes one from the resulting evidence.

## Required machine evidence

Each platform job MUST emit bounded machine-readable records for all 21 applicable/claimed cases using canonical conformance semantics and exact trigger revision.

Every PASS record used for Gold assessment MUST have:

```text
source = REAL_CLI
adapterId = pi-coding-agent
adapterImplementationVersion = exact implementation version under test
delethosRevision = exact [pi-gold] trigger SHA
platform = exact job platform
outcome = PASS
facts.headUnchanged = true
facts.refsUnchanged = true
```

Non-`missing-binary` PASS records MUST also bind one exact Pi CLI version, and that version MUST be consistent within the platform.

The final platform summary MUST evaluate canonical `assessGold(...)` semantics over:

```text
BASELINE_GOLD_CASES + model-selection + malformed-model
```

No fixture-only record may qualify Gold.

## Repository and evidence safety

Every case runs against a fresh temporary fixture repository or a fresh resettable case fixture under a temporary root, never the canonical Delethos worktree.

The R190 harness MUST prove after each case that no hidden commit, push, merge, branch, tag, stash, or other ref mutation occurred where the case requires unchanged refs.

Write and partial-diff cases may mutate only their temporary fixture worktree as explicitly required by the case.

The harness MUST clean up the local model server, Pi process tree, fault-injection transport, temporary model/runtime/configuration roots, and fixture repositories after each platform job.

Normalized evidence MUST NOT contain secrets, Authorization headers, ambient credential values, raw model transcripts, reasoning text, raw tool arguments, arbitrary filesystem paths, or unbounded exception strings.

## R190 implementation qualification gate

The implementation PR MUST NOT merge until one exact final head has all of:

1. only authorized R190 implementation paths changed;
2. deterministic Linux/macOS/Windows core CI PASS;
3. R190 provider-backed Gold workflow skipped on PR code;
4. all existing provider prerequisite, provider-free recovery, legacy real-agent, and unrelated Gold jobs retain their canonical trigger semantics;
5. deterministic self-tests prove all 21 case identifiers, optional-claim exclusions, no-secret behavior, trigger exactness, no broad Pi tools, machine-record validation, exact-head assessment, cleanup, and fail-closed behavior;
6. a fresh independent substantive semantic/security/licensing/governance review on the exact final head while the PR remains open;
7. that review explicitly checks no Gold-case weakening, no `[gold-recovery-probe]` reuse, no mock/scripted provider success, exact R181 pin reuse, missing-final-response real-CLI sentinel semantics, authentication N/A semantics, case-specific tool bounds, fault-fixture non-success semantics, and one-attempt consumption;
8. every substantive finding reconciled and zero unresolved substantive review threads;
9. exact base/head/tree/scope/checks/reviews/threads/comments/mergeability reverified immediately before expected-head merge;
10. canonical post-merge deterministic Linux/macOS/Windows CI PASS and canonical authority reread before `[pi-gold]` becomes eligible.

## Result handling

If all three platform jobs genuinely PASS all 21 required/claimed cases in the same R190 attempt and the exact-revision Gold assessment is eligible, `D003-R190` may become complete. Pi MUST still remain unpromoted until the evidence-reconciliation unit `D003-R210` and the two-candidate Gold confirmation unit `D003-R211` permit promotion.

If any required case or platform is FAIL, UNAVAILABLE, or UNVERIFIED, preserve that exact evidence. Do not rerun the consumed attempt. Shape any repair or diagnostic authority in a later bounded amendment based only on the observed machine evidence.

After genuine R190 completion, continuation is:

```text
D003-R200 = NEXT_AUTHORIZED_UNIT
D003-R210 = BLOCKED_ON_R200
D003-R211 = BLOCKED_ON_R210
D003-R212 = BLOCKED_ON_R211
```

## Explicit non-authority

This amendment does not authorize:

- Gold promotion by itself;
- reusing `[gold-recovery-probe]` as Pi Gold evidence;
- a second R190 attempt after the one authorized attempt is consumed;
- dropping or silently marking any baseline Gold case PASS;
- claiming Pi read-only or resume capability;
- fake, mock, scripted, replayed, or fixture provider success;
- ambient provider credentials or vendor secrets;
- arbitrary Pi flags or broad tool access;
- shell, edit, grep, find, ls, extension, custom, or network-capable Pi tools in the bounded file-read/write cases;
- changing the selected runtime/model/provider strategy without another qualified amendment;
- OpenCode R200 execution before R190 completes;
- D003-R210/R211/R212 before their evidence prerequisites;
- Specification 003 closeout;
- Specification 004 activation;
- force-push, rebase, history rewrite, hidden merge, or automatic merge.
