# Contributing to Delethos

Thank you for helping build Delethos. The project values small, reproducible, evidence-backed changes over large speculative contributions.

## Start with repository truth

Before editing, read:

1. `AGENTS.md`
2. `specs/CURRENT.md`
3. `.specify/memory/constitution.md`
4. `docs/EXECUTION_MASTER_PLAN.md`
5. the active specification/plan/tasks
6. referenced ADRs, contracts, research, security docs, and source

A roadmap item is not implementation authorization. Work must fit active canonical authority.

## Contribution principles

- Keep the change bounded and explain why every changed file is necessary.
- Do not add drive-by refactors or speculative abstractions.
- Prefer existing platform/language primitives before dependencies.
- Never claim a check passed if it was not run successfully on the exact change.
- Record `NOT RUN`, `UNAVAILABLE`, `PARTIAL`, or residual risk honestly.
- Higher-risk changes require stronger verification and negative-path evidence.
- Do not hide failing benchmark results or cherry-pick only favorable runs.
- External ideas/code require license-aware provenance.
- Do not force-push/rebase shared contribution branches after review has begun unless maintainers explicitly direct a safe replacement workflow.

## Before opening a pull request

A product change should map to an active spec/task. In your PR, include:

- active spec/task IDs;
- outcome;
- exact changed-path scope;
- why the change is the smallest coherent unit;
- checks/tests actually run and their results;
- acceptance evidence;
- review/independence evidence when required;
- known limitations/residual risk;
- external provenance/adapted material;
- any check that could not run.

## Adapter contributions

Adapters are high-trust integration code. A new adapter should not be proposed as `SUPPORTED` merely because the target CLI can be launched.

Expect qualification of applicable behavior including:

- discovery/version;
- headless invocation;
- working-directory behavior;
- writable and read-only semantics where claimed;
- model/provider controls where claimed;
- timeout, stall, cancellation, and cleanup;
- failure handling;
- partial diff preservation;
- resume where claimed;
- platform-specific quoting/process behavior;
- no hidden commit/merge side effect;
- normalized result validity.

Provider-specific limitations are welcome when documented truthfully.

## Evidence/verification changes

Changes to evidence schema, canonicalization, digests, verifier logic, policy compilation, review independence, or `VERIFIED` semantics have elevated blast radius. They require explicit negative-path/adversarial tests and compatibility reasoning.

A verifier change must never silently make historical evidence appear stronger than the rules under which it was produced.

## Benchmark contributions

Benchmarks must preserve:

- task definition;
- fixture/repository revision;
- environment/configuration;
- exact commands;
- raw/bounded outputs where safe;
- scoring logic;
- exclusions;
- failures;
- limitations.

Missing executions are `NOT RUN`, never zero-cost PASS. Comparative claims belong in reproducible evidence, not README enthusiasm.

## Documentation and adoption work

README, quickstart, demo, launch, and discoverability improvements are first-class contributions, but they may not overstate product support. Visual examples should be generated from real qualified behavior when they imply execution evidence.

Stars, rankings, installs, and mentions are observational adoption metrics, not correctness gates.

## Security

Do not open a public issue for a vulnerability that could put users at risk before maintainers can assess it. Follow `SECURITY.md` and GitHub private vulnerability reporting when the repository exposes that capability.

## Pull-request completion

A PR is not complete merely because CI is green. Maintainers must reconcile exact head/base, authorized scope, required checks, reviews/threads/comments, mergeability, and post-merge conditions defined by the active specification.
