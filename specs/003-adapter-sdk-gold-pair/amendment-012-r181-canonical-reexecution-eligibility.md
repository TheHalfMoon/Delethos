# Specification 003 Amendment 012 — R181 Canonical Re-execution Eligibility

**Status:** `NORMATIVE` iff this amendment is present on canonical `main` while Specification 003 remains active.  
**Task:** `D003-R181` execution eligibility only.  
**Scope:** authorize one fresh canonical-main execution of the already-qualified Amendment 008–011 provider prerequisite after the post-merge deterministic gate is proven. This amendment does not change provider/runtime/model behavior, does not promote either adapter or capability, does not itself complete `D003-R181`, and does not authorize Specification 004.

## Canonical prerequisite state

The Amendment 010 Pi single-write completion repair became canonical before the Amendment 011 post-merge gate hardening. Amendment 011 then required the provider-prerequisite sentinel to match only at the start of the canonical head commit message and stabilized only the observed deterministic descendant-cleanup test startup allowance.

The exact Amendment 011 implementation merge is:

```text
a59dac1ea1265b6142d02e008cb4638c8b381bad
```

Its canonical post-merge deterministic workflow run is:

```text
33802019653
```

Machine-observed result:

```text
linux/x64   = PASS
macos/arm64 = PASS
windows/x64 = PASS
recovery provider prerequisite = SKIPPED
all other real/provider/Gold marker jobs = SKIPPED
```

The current canonical head before this amendment is:

```text
3ce1d41d3f4773ec9859bc9de39353b1a6e82226
```

It has the exact same repository tree as the Amendment 011 implementation merge:

```text
cc970816b1456dcbadb1e43c176733061dd8d98d
```

and canonical workflow run:

```text
33803740226
```

again machine-observed deterministic PASS on Linux, macOS, and Windows with every provider/Gold marker job skipped. The intervening content-neutral commits are not provider qualification evidence and do not alter provider/runtime/model semantics.

The non-qualifying diagnostic provider run `33790473303` remains preserved as FAIL/non-qualifying evidence and must never be reused as a qualifying R181 record.

## Decision

The post-merge deterministic gate required by Amendment 011 is satisfied. After this amendment itself is canonically qualified and merged, exactly one fresh `D003-R181` provider-prerequisite execution is eligible under the following bounded procedure.

### Canonical execution transport

The execution trigger must be a single fast-forward, same-tree commit on canonical `main` whose commit message begins exactly with:

```text
[provider-prereq]
```

The trigger commit:

1. must have the then-current canonical `main` commit as its sole parent;
2. must point to exactly the same tree as that parent;
3. must contain no file, tree, submodule, ref, or workflow-content change;
4. must be created only after this amendment's canonical post-merge deterministic Linux/macOS/Windows CI passes with the provider prerequisite skipped;
5. must not contain any other real-agent/Gold marker prefix;
6. must not bypass branch protection, rulesets, credential boundaries, or repository permissions if any become applicable before execution.

This same-tree trigger is execution authority only. It is not implementation evidence, Gold evidence, or a task-completion record.

### Qualifying R181 result

The fresh trigger qualifies `D003-R181` only if the canonical push workflow executes the provider-prerequisite matrix on all required platforms and every platform emits one bounded machine-readable R181 record with:

```text
outcome = PASS
```

and every `REQUIRED_FACTS` field true, including runtime provenance/identity, model digest, loopback/no-auth boundaries, exact Pi/OpenCode versions and identities, bounded write-tool evidence, fixture-only repository mutation, no-secret posture, no hidden commit/push/merge, and successful required cleanup.

Linux/x64, macOS/arm64, and Windows/x64 must all qualify against the same exact trigger revision. A green core job is not a provider PASS. A created smoke file without retained exact Pi tool JSONL is not PASS. A skipped, cancelled, unavailable, neutral, or incomplete provider job is not PASS.

### Failure treatment

If any required platform or fact fails:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

The failed canonical record must be preserved exactly. The failed provider job or workflow must not be rerun or retried into PASS. Any newly discovered defect must receive new bounded canonical repair authority, exact-head deterministic qualification, fresh independent substantive review, expected-head merge, and post-merge deterministic verification before a later execution can become eligible.

### Success continuation

Only if all three required platform records satisfy the full qualifying condition above:

```text
D003-R181 = COMPLETE
D003-R190 = OPEN
```

At that point continuation must follow Amendment 007 dependency order:

```text
D003-R190  execute/reconcile complete applicable Pi real-CLI Gold matrix
D003-R200  execute/reconcile complete applicable OpenCode real-CLI Gold matrix
D003-R210  reconcile evidence and promote only machine-proven facts
D003-R211  require genuine dual-Gold confirmation
D003-R212  terminal Specification 003 closeout
```

No later task may be treated as complete from the R181 prerequisite alone.

## Authorized paths for this amendment

This amendment PR may add only:

```text
specs/003-adapter-sdk-gold-pair/amendment-012-r181-canonical-reexecution-eligibility.md
```

No implementation, workflow, adapter, test, evidence, capability, provider/runtime/model pin, credential boundary, or task ledger path may change in this amendment PR.

## Qualification before effectivity

Before this amendment becomes effective:

1. exact-head deterministic CI must pass on Linux, macOS, and Windows;
2. the provider prerequisite and all other real/provider/Gold marker jobs must remain skipped on the PR;
3. a fresh independent substantive semantic review must cover the exact current head;
4. every substantive review finding/thread must be reconciled;
5. the PR must remain exact one-file scope;
6. merge must use expected-head protection;
7. canonical post-merge deterministic CI must again pass on Linux, macOS, and Windows with provider execution skipped.

Only after all seven gates are proven may the one same-tree `[provider-prereq]` trigger commit be created.

## Non-authority

This amendment does not authorize:

- changing Pi, OpenCode, llama.cpp, provider/model/runtime pins, permissions, credentials, or the R181 implementation;
- treating diagnostic run `33790473303` as qualification evidence;
- re-running a failed qualifying provider execution;
- promoting any adapter or capability to `GOLD` before its complete applicable real matrix passes;
- opening `D003-R200` before `D003-R190` completes;
- closing Specification 003 before `D003-R212` completes canonically;
- starting Specification 004 from roadmap order alone.
