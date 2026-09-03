# Specification 003 Amendment 011: R181 Post-Merge Gate Hardening

Status: PROPOSED

## Context

Canonical `main` at `d5714b77e81856f01b9982cbff3e1c7fd6c4130f` contains the Amendment 010 bounded Pi natural-completion repair.

The first canonical push after that implementation merge exposed two independent deterministic-gate defects before D003-R181 could be reopened for a qualifying provider run.

### Accidental provider execution

The existing workflow guard matches the provider-prerequisite sentinel as a substring anywhere in the head commit message. The implementation merge intentionally stated that it omitted the sentinel, but the explanatory body contained the literal sentinel text. That substring was sufficient to start the provider-prerequisite jobs before canonical post-merge deterministic verification had completed.

That execution is non-qualifying. It must not be reused as D003-R181 evidence because the required post-merge deterministic gate had not yet passed.

### macOS deterministic-test startup race

In the same canonical push, Linux and Windows core CI passed while macOS failed only in:

`common invocation preserves partial output and reports descendant-tree cleanup`

The test currently gives the fixture 180 ms from process spawn to timeout. It requires the fixture process to start Node, spawn a descendant, and emit `child=<pid>` plus `partial-output` before that timeout. The exact PR qualification immediately before merge passed this same test on the same macOS runner family, while the canonical post-merge run timed out before retaining any fixture stdout. The production process-supervision behavior and the assertions are unchanged; the observed failure is a test-startup race, not evidence that descendant cleanup semantics changed.

## Decision

D003-R181 remains blocked until both post-merge gate defects below are repaired and canonically qualified.

### Provider-prerequisite sentinel hardening

The provider prerequisite may run only when all existing repository/event/ref guards pass **and** the canonical head commit message starts with the exact sentinel:

```text
[provider-prereq]
```

A mention of that text later in a commit subject or body must not trigger provider execution.

The implementation may replace the current substring predicate with an exact start-of-message predicate. No other provider-job condition, permission, platform matrix, runtime pin, provider pin, model pin, or execution behavior may change.

### Deterministic descendant-cleanup test stabilization

Only the timeout of the existing test:

```text
common invocation preserves partial output and reports descendant-tree cleanup
```

may be increased from `180` ms to `1000` ms.

The fixture mode, expected terminal cause (`TIMED_OUT`), expected partial-output assertions, descendant-cleanup assertions, termination grace, output limit, production supervisor implementation, and every other test must remain unchanged.

This change widens only test startup allowance. It does not widen any production timeout or runtime authority.

## Authorized paths

This amendment authorizes changes only to:

```text
.github/workflows/ci.yml
packages/adapters/test/invocation.test.ts
```

No other implementation or test path is authorized by this amendment.

## Qualification

Before this amendment can become canonical:

1. exact-head deterministic CI must pass on Linux, macOS, and Windows;
2. all provider/Gold/real-agent marker jobs must remain skipped on the pull request;
3. a fresh independent substantive semantic review must cover the exact head;
4. all substantive review findings and threads must be reconciled;
5. the PR must remain exactly within the two-path allowlist;
6. merge must use expected-head protection.

After merge, canonical post-merge deterministic CI must pass on Linux, macOS, and Windows with the provider prerequisite still skipped because the merge message does not begin with the sentinel.

Only after that successful post-merge verification may later canonical authority decide whether another D003-R181 provider execution is eligible.

## Evidence treatment

Workflow run `33790473303` is preserved as a non-qualifying diagnostic run:

- its macOS core failure blocks canonical post-merge deterministic qualification;
- its provider jobs started before the deterministic gate completed;
- provider results from that run must not be promoted, retried into PASS, or used to open D003-R190.

The observed provider failure at `pi_bounded_tool_write_smoke` remains a real diagnostic for subsequent bounded R181 shaping, but it is not a qualifying R181 record.

## Non-authority

This amendment does not authorize:

- changing `scripts/recovery-provider-prereq.mjs` or `scripts/recovery-provider-prereq-impl.mjs`;
- changing Pi, OpenCode, llama.cpp, model, provider, or credential behavior;
- executing a provider prerequisite before a later canonical post-merge deterministic PASS;
- treating the accidental provider run as PASS or qualification evidence;
- retrying a failed provider execution into PASS;
- promoting any capability or adapter to Gold;
- opening D003-R190, D003-R200, D003-R210, D003-R211, or D003-R212;
- authorizing Specification 004.
