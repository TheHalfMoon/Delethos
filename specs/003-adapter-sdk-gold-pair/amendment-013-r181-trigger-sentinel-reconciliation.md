# Specification 003 Amendment 013 — Review Reconciliation: Exact Provider-Prerequisite Trigger

**Status:** `PROPOSED` until merged together with the sibling Amendment 013 proposal on PR #65.  
**Task:** `D003-R181` bounded repair authority only.  
**Purpose:** reconcile the exact-head independent semantic review finding on PR #65 without weakening or broadening any provider, runtime, model, credential, workflow-permission, or successor-task boundary.

## Normative relationship

This file is part of the same Amendment 013 proposal as:

```text
specs/003-adapter-sdk-gold-pair/amendment-013-r181-durable-tool-evidence-and-public-provenance.md
```

The two files are atomic for PR #65. Neither file is independently canonical. If both merge together, this reconciliation supersedes only the conflicting implementation-authority and re-execution-trigger wording identified below. Every other requirement and non-authority clause in the sibling Amendment 013 file remains unchanged.

## Independent review finding being reconciled

The exact-head review of `22e30c64fb727f34abc0734918116901c53eba92` found one substantive control mismatch:

- the sibling Amendment 013 proposal requires an exact standalone `[provider-prereq]` sentinel;
- canonical `.github/workflows/ci.yml` currently gates the provider prerequisite with `startsWith(github.event.head_commit.message, '[provider-prereq]')`;
- that predicate also accepts malformed prefixes such as `[provider-prereq]unexpected`;
- the sibling proposal originally authorized implementation changes only in `scripts/recovery-provider-prereq.mjs`, so the workflow could not be hardened to enforce the stated trigger contract.

This reconciliation closes that mismatch fail-closed.

## Exact trigger contract

For the one later Amendment-013-authorized canonical R181 re-execution, the trigger commit message must be exactly:

```text
[provider-prereq]
```

No prefix, suffix, body, additional line, whitespace suffix, or alternate spelling is accepted.

The provider-prerequisite workflow predicate must therefore require exact full-string equality with `[provider-prereq]` for that sentinel. `startsWith`, `contains`, prefix matching, or any predicate that also admits `[provider-prereq]unexpected` is not sufficient.

The later re-execution remains a same-tree canonical `main` commit only. The commit changes no repository content and exists only to consume the one bounded execution attempt after all implementation qualification and canonical post-merge deterministic gates have passed.

## Narrow workflow implementation authority

The Amendment 013 implementation unit may modify only:

```text
scripts/recovery-provider-prereq.mjs
.github/workflows/ci.yml
```

The workflow path is authorized **only** for the provider-prerequisite sentinel predicate change necessary to enforce exact full-message equality.

The workflow repair must not change:

- `push` or `pull_request` event declarations;
- the `main` branch restriction;
- `github.repository == 'TheHalfMoon/Delethos'` or any equivalent canonical-repository boundary;
- job matrix platforms;
- runner images;
- checkout credential persistence posture;
- `permissions: contents: read`;
- any secret, token, credential, environment credential, or authenticated API behavior;
- any other marker-gated job predicate;
- provider/model/runtime pins;
- provider execution commands;
- artifact/transcript persistence behavior.

No workflow permission widening is authorized.

## Deterministic qualification additions

Before the implementation repair may merge, deterministic self-tests or an equivalently reviewable workflow assertion must prove that the provider-prerequisite predicate:

- accepts exactly `[provider-prereq]`;
- rejects `[provider-prereq]unexpected`;
- rejects `prefix [provider-prereq]`;
- rejects `[provider-prereq] suffix`;
- rejects `[provider-prereq]\nbody`;
- remains canonical-main-only and repository-exact;
- leaves `permissions: contents: read` unchanged.

The implementation PR must otherwise satisfy every qualification gate in the sibling Amendment 013 proposal: exact-head Linux/macOS/Windows deterministic CI, provider job skipped on PR code, fresh independent substantive semantic review of the exact head, zero unresolved substantive threads, unchanged canonical base, expected-head merge, and canonical post-merge deterministic PASS before any provider execution.

## Re-execution authority remains bounded

This reconciliation does not create an additional provider attempt. It only makes the already proposed Amendment 013 conditional one-attempt authority enforceable.

Exactly one later same-tree canonical execution may occur only after the fully qualified implementation repair is canonical and deterministic post-merge CI has passed on Linux/macOS/Windows. The attempt is consumed when the exact `[provider-prereq]` commit is pushed, regardless of PASS or FAIL.

No earlier failed workflow or job may be rerun into PASS.

## Non-authority

This reconciliation does not authorize:

- provider execution on PR code;
- secrets or credentials;
- workflow permission widening;
- changing any other marker predicate;
- changing Pi/OpenCode/runtime/model/provider pins or permissions;
- treating file existence alone as Pi execution evidence;
- weakening durable Pi ToolCall/ToolResult validation;
- Gold promotion;
- D003-R190/R200/R210/R211/R212 before R181 passes;
- Specification 004.

## Continuation boundary

If PR #65 is qualified and merged with this reconciliation, implementation may begin only within the two exact paths above. If the repaired canonical one-attempt R181 execution later passes on Linux/x64, macOS/arm64, and Windows/x64 with all required facts true, canonical authority may then be re-read for D003-R190. Otherwise R181 remains incomplete and any further execution requires new bounded canonical authority.
