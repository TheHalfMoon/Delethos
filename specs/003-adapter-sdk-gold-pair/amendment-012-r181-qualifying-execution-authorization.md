# Specification 003 Amendment 012: R181 Qualifying Execution Authorization

Status: NORMATIVE iff present on canonical `main` while Specification 003 is active.

## Task and scope

This amendment authorizes exactly one fresh qualifying `D003-R181` provider-prerequisite execution after the canonical post-merge gate hardening established by Amendment 011.

It does not change provider/runtime/model behavior, workflow permissions, adapter capabilities, Gold requirements, or successor-task implementation authority.

## Canonical prerequisite truth

Canonical Amendment 010 implementation merge:

```text
d5714b77e81856f01b9982cbff3e1c7fd6c4130f
```

The first push after that merge, workflow run `33790473303`, is permanently non-qualifying under Amendment 011 because provider jobs started before the required deterministic post-merge gate completed and macOS core CI failed the bounded descendant-cleanup test startup race. No provider result from that run may be reused as `D003-R181` evidence.

Canonical Amendment 011 governance merge:

```text
954635f4ec00ac4dc39a6e72e2d7d896256e3720
```

Canonical Amendment 011 implementation merge:

```text
a59dac1ea1265b6142d02e008cb4638c8b381bad
```

Canonical post-Amendment-011-implementation deterministic run:

```text
33802019653
```

That run completed successfully on Linux, macOS, and Windows. The `recovery provider prerequisite` job and every other provider/Gold/real-agent marker job remained skipped. The merge message mentioned the provider-prerequisite concept later in its body but did not begin with the exact sentinel, and the hardened `startsWith(...)` guard correctly kept provider execution skipped. Therefore Amendment 011's required post-merge deterministic gate is satisfied.

## Authorized execution

After this amendment itself is merged canonically with expected-head protection and its own post-merge deterministic Linux/macOS/Windows CI succeeds with the provider prerequisite skipped, one and only one qualifying R181 execution may be triggered.

The trigger must be an empty fast-forward commit directly on canonical `main` whose tree is byte-identical to its parent and whose commit message begins exactly with:

```text
[provider-prereq]
```

The recommended complete message is:

```text
[provider-prereq]

spec(003): execute qualifying R181 prerequisite
```

Immediately before creating that marker commit, automation must reverify:

- canonical `main` still equals the exact post-Amendment-012 commit whose deterministic CI was qualified;
- no implementation or governance change has landed since that qualification;
- the marker commit reuses the exact parent tree and changes no repository path;
- the hardened workflow requires `push`, `refs/heads/main`, repository `TheHalfMoon/Delethos`, and an exact start-of-message `[provider-prereq]` sentinel;
- no credential or secret is introduced by the marker commit.

The marker commit itself is transport authorization only. It does not constitute R181 evidence.

## Qualifying machine evidence

The resulting canonical-main workflow run is the only R181 execution authorized by this amendment.

For each required platform:

```text
linux/x64
macos/arm64
windows/x64
```

the `recovery provider prerequisite` job must complete successfully and its machine-readable record must report:

```text
outcome = PASS
```

with every `REQUIRED_FACTS` field true.

The evidence must remain tied to the exact canonical marker SHA and exact canonical implementation/runtime/model/provider identities.

A green workflow color without the complete machine record is insufficient. A successful result on fewer than all three required platforms is insufficient.

## Failure treatment

If any required platform returns `FAIL`, `UNAVAILABLE`, times out, is cancelled, emits malformed/incomplete evidence, or does not execute, then:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
D003-R200 = BLOCKED
D003-R210 = BLOCKED
D003-R211 = BLOCKED
D003-R212 = BLOCKED
Specification 004 = UNAUTHORIZED
```

The failure must be preserved exactly. This amendment does not authorize rerunning the failed execution into PASS.

A deterministic implementation defect discovered by the qualifying run requires a new bounded canonical repair authority, exact-head deterministic CI, fresh independent substantive review, expected-head merge, canonical post-merge deterministic verification, and fresh execution authority before another provider run.

## Success boundary

Only if all three required R181 platform records pass every required fact may canonical reconciliation record:

```text
D003-R181 = COMPLETE
D003-R190 = NEXT_AUTHORIZED_UNIT
```

R181 success does not itself make Pi or OpenCode `GOLD` and does not complete Specification 003.

`D003-R190` must still execute and reconcile the complete applicable Pi real-CLI Gold matrix. `D003-R200` remains dependency-blocked until R190 completes, followed by R210, R211, and R212 in canonical order.

## Amendment qualification

Before this amendment becomes canonical:

1. its PR must contain exactly this one documentation path;
2. exact-head deterministic CI must pass on Linux, macOS, and Windows;
3. provider/Gold/real-agent marker jobs must remain skipped on PR code;
4. a fresh independent substantive semantic review must cover the exact head;
5. all substantive findings and review threads must be reconciled;
6. merge must use expected-head protection and must not start with the provider sentinel;
7. canonical post-merge deterministic CI must pass on Linux, macOS, and Windows while the provider prerequisite remains skipped.

## Non-authority

This amendment does not authorize:

- modifying `.github/workflows/ci.yml` or any implementation/test path;
- changing Pi, OpenCode, llama.cpp, Qwen, provider, model, runtime, or credential behavior;
- storing or introducing secrets;
- weakening any R181 required fact;
- using workflow run `33790473303` as qualification evidence;
- retrying a failed qualifying provider run;
- promoting Pi or OpenCode to Gold without their complete subsequent matrices;
- opening `D003-R200` before `D003-R190` completes;
- closing Specification 003 before R190/R200/R210/R211/R212 complete canonically;
- authorizing Specification 004.
