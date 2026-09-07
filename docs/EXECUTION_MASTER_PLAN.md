# Delethos Execution Master Plan

This document is the durable program-level continuation plan for Delethos. `specs/CURRENT.md` owns the active frontier. Live canonical GitHub/repository truth overrides stale text when they disagree.

## Canonical reading order

Before changing Delethos, read:

1. `AGENTS.md`
2. `specs/CURRENT.md`
3. `.specify/memory/constitution.md`
4. this file
5. the active `spec.md`, `plan.md`, and `tasks.md`
6. referenced ADRs, contracts, research, evidence, security documents, and implementation files

Program-level refinements that must be consulted when their surfaces are relevant:

- `docs/SECURITY_EVALUATION_EXPANSION_PLAN.md` — future security/content/evaluation proof spine;
- `docs/SOURCE_ADOPTION_AND_REUSE_PLAN.md` — selective code/source reuse, Source BOM, drift, and provenance strategy;
- `docs/research/FOUNDER_SOURCE_USE_AUTHORIZATION_2026-09-08.md` — Founder-provided source-use authorization and boundaries;
- `docs/research/SOURCE_ADOPTION_MATRIX_2026-09-08.md` — source-by-source copy/adapt/reference decisions.

These program-level documents do not expand the active specification by themselves.

## Product objective

> **Delegate code. Demand proof.**

Build the neutral local control plane that developers use to coordinate the coding agents they already have, while preserving repository truth, bounded authority, deterministic verification, independent review, and portable evidence.

The flagship workflow is intentionally narrow:

```text
user intent
  -> bounded execution unit
  -> eligible-agent discovery
  -> policy/risk compilation
  -> isolated implementation
  -> exact diff capture
  -> deterministic guards
  -> independent review when required
  -> bounded repair/escalation
  -> proof-carrying patch
  -> human decision by default
```

## Category thesis

Delethos should not compete by becoming another proprietary agent or another unbounded swarm framework. It should become the **verification and delegation layer between coding-agent vendors and the repository**.

The long-term category claim is:

> Every AI-written patch should be able to explain who/what changed it, against which base, under which policy, which checks actually ran, who independently reviewed it when required, and what remains unproven.

The strongest moat is therefore not a long adapter list. It is the combination of:

1. a portable adapter contract;
2. a deterministic execution/policy state machine;
3. independent-review semantics;
4. proof-carrying patches;
5. reproducible conformance and routing evaluation;
6. excellent one-command developer experience.

Broad access to donor/source code can accelerate these capabilities, but copied behavior must be rebound to Delethos contracts, provenance, tests, and authority rather than redefining the core.

## Founding product boundaries

Delethos is:

- local-first;
- vendor-neutral;
- terminal-first;
- worktree-first for mutable execution;
- evidence-first;
- human-merge-by-default;
- adapter-extensible;
- deterministic where correctness-sensitive;
- progressively refined by canonical specifications.

Delethos is not initially:

- a hosted SaaS requirement;
- an IDE replacement;
- a general project-management suite;
- a model provider;
- a secret manager;
- a generic autonomous company/office simulation;
- a mandatory vector database or memory platform;
- an automatic merge bot;
- a benchmark marketing site without reproducible methodology;
- a donor-source mirror or framework aggregation project.

## Canonical initial program sequence

The sequence below is program intent, not blanket implementation authority. Only the active specification in `specs/CURRENT.md` may authorize work.

```text
000 Founding governance, architecture, research, contracts
  -> 001 Core run + policy + evidence state machine
  -> 002 Worktree isolation + process supervision
  -> 003 Adapter SDK + first two gold adapters
  -> 004 Independent review + bounded repair loop
  -> 005 Deterministic guards + proof-carrying patch bundle
  -> 006 CLI/TUI onboarding + doctor + first useful run
  -> 007 Adaptive routing + persistent non-volatile project decisions
  -> 008 Gold adapter expansion + cross-platform conformance
  -> 009 Delethos Bench + transparent routing evidence
  -> 010 Agent Skill + native marketplace packaging
  -> 011 GitHub PR/check integration
  -> 012 Adapter/plugin ecosystem + conformance registry
  -> 013 Security/recovery hardening + stable v1 contracts
  -> 014 Adoption, independent validation, and category-launch readiness
```

### Specification 000 — Founding governance, architecture, research, contracts

**Outcome:** establish a coherent project constitution, authority chain, architecture boundary, security model, evidence model, adapter contract, research provenance, execution roadmap, and contribution discipline before product code.

**No runtime implementation is authorized.**

### Specification 001 — Core run + policy + evidence state machine

Expected bounded outcome after separate activation: implement versioned deterministic primitives for run identity, task snapshot, policy compilation, lifecycle transitions, result categories, and evidence binding without provider-specific execution.

Distant details remain deliberately coarse until live evidence shapes them.

### Specification 002 — Worktree isolation + process supervision

Expected category: exact repository base capture, worktree lifecycle, child process ownership, cancellation, timeout/stall distinction, orphan cleanup, and recovery behavior.

### Specification 003 — Adapter SDK + first two gold adapters

Expected category: one portable adapter contract and a deliberately small first pair of independently qualified real coding-agent CLIs. Selection and qualification require live CLI/source capability research.

The Founder source-use authorization does not expand the current Specification 003 surface. Source-derived fixtures or copied parser/protocol logic require a canonical Specification 003 amendment when the active spec does not already authorize the exact path and behavior.

### Specification 004 — Independent review + bounded repair loop

Expected category: distinct implementer/reviewer identity, read-only review posture where the target adapter can truly support it, durable review/repair jobs, bounded changes-required loops, exact candidate rebinding, escalation, and provenance.

### Specification 005 — Deterministic guards + proof-carrying patch bundle

Expected category: guard jobs, changed-path/scope evidence, acceptance evidence, hashes/digests, source/provenance verification candidates, content observations, normalized security findings, portable `delethos.evidence.v1` candidate, and verifier behavior.

### Specification 006 — CLI/TUI onboarding + first useful run

Expected category: `doctor`, agent discovery, guided setup, `run`, `verify`, event-derived high-signal TUI projections, bounded live job output, readable failure/unknown/capability states, evidence cards, and a first-run path that demonstrates value without requiring cloud signup.

### Specification 007 — Adaptive routing + durable project decisions

Expected category: explainable routing based on eligibility, task/risk policy, observed local outcomes, explicit user preference, and separately observed capability states such as discovery/configuration/reachability/health/authorization/qualification; durable decisions remain separate from volatile repository facts and rebuildable projections.

### Specification 008 — Gold adapter expansion + cross-platform conformance

Expected category: expand support only through conformance evidence across declared platforms; use source-derived compatibility corpora where valuable; prefer canonical definitions plus generated harness/package surfaces over manually duplicated adapter metadata.

### Specification 009 — Delethos Bench

Expected category: reproducible engineering workflow evaluations for execution reliability, recovery, review defect detection, latency, routing, and repository-level security; retain exact task/source/data/environment provenance and do not hide losing/failed cases.

### Specification 010 — Agent Skill + marketplace packaging

Expected category: invoke Delethos as a first-class skill/plugin from compatible coding-agent environments using one canonical Delethos-owned definition, deterministic harness-specific generation, and pre-activation security/provenance admission while keeping the open local CLI/core independently usable.

### Specification 011 — GitHub integration

Expected category: PR review/check surfaces, evidence summaries/cards, security-finding/SARIF interoperability, verification badges, and repository policy integration without making GitHub the only supported forge/workflow.

### Specification 012 — Ecosystem + conformance registry

Expected category: community adapter scaffolding, conformance fixtures, compatibility/capability matrix, signed provenance, extension contracts, generated-surface drift gates, install-versus-activation semantics, and source/maintenance rules.

### Specification 013 — Stable v1 security/recovery contracts

Expected category: adversarial hardening, copied-code/source-adoption audit, dependency/security review, third-party notice/Source-BOM verification, provider-integrity evaluation where evidence permits, stable contract versioning, migration policy, release reproducibility, signed/published evidence where appropriate, and recovery guarantees.

### Specification 014 — Adoption and category-launch readiness

Expected category: validated quickstarts, executable examples, independent validation protocol, source/provenance audit instructions, reproducible launch artifacts with freshness checks, public comparison methodology, discoverability surfaces, and community contribution loops. Popularity metrics remain observational and cannot weaken proof semantics.

## Architecture program rules

1. **Contracts before breadth.** One excellent adapter contract with a conformance suite is more valuable than ten ad hoc wrappers.
2. **Two gold adapters before fleet routing.** Prove independent implementation/review across real distinct CLIs before expanding provider count.
3. **Verification before visualization.** A beautiful TUI must display real state; product theater cannot invent certainty.
4. **Evidence before badge.** `Delethos Verified` cannot ship until the evidence model and verifier semantics are stable enough to defend the claim.
5. **No cloud dependency in core.** Hosted collaboration may be considered later as an optional layer.
6. **No hidden capability assumptions.** Provider/CLI behavior is qualified experimentally and versioned where instability matters.
7. **Stall is not timeout.** Process liveness, productive activity, and wall-clock exhaustion are separate observables.
8. **Context is provenance-bound.** Persist decisions, not stale repository state.
9. **Human authority is explicit.** Commit/merge/release authority is never inferred from a request to delegate implementation.
10. **Copy by value, not by volume.** Broad source-use permission should favor the smallest proven primitive/fixture/module that improves Delethos rather than wholesale framework imports.
11. **Copied behavior is unverified until rebound.** Donor tests/claims are inputs; Delethos conformance and policy own local truth.
12. **Generated packaging has one canonical source.** Harness-specific Skill/plugin/adapter outputs should be generated and drift-checked where duplication would otherwise occur.
13. **Event facts and projections are separate.** Durable events/state may drive multiple UI/integration projections; a projection cannot redefine evidence truth.

## Founding technology direction

The preferred initial implementation direction is a TypeScript/Node monorepo because the surrounding coding-agent/plugin ecosystem is heavily CLI/Node-oriented and TypeScript provides a low-friction path to adapters, terminal UI, JSON-schema-compatible contracts, and cross-platform execution.

This is a founding architectural direction, not permission to add a dependency-heavy framework stack. Core runtime dependencies require explicit justification. Source copying must also undergo dependency-closure analysis: a small upstream file is not small if it silently requires a large donor runtime.

A later native/Rust component is justified only by measured security, portability, process-control, packaging, or performance needs that cannot reasonably be met by the selected core stack.

## Quality gates by maturity

### Foundation gate

Before product code:

- constitution and canonical reading order exist;
- product/non-product boundary is explicit;
- architecture, security, evidence, and adapter contracts are reviewable;
- founding research records donor/license/capability distinctions;
- active spec and task order are canonical.

### Core gate

Before calling a run engine usable:

- deterministic lifecycle tests;
- malformed-input/fail-closed tests;
- worktree safety tests;
- process cancellation/cleanup tests;
- evidence binding tests;
- no self-review path under an independent-review policy.

### Source-adoption gate

Before material copied/adapted code is treated as ordinary Delethos implementation:

- exact source repository/commit/path recorded;
- permission/license/notice basis recorded;
- adoption mode recorded (`VERBATIM`, `ADAPTED`, `TRANSLATED`, `FIXTURE_DERIVED`, `SCHEMA_DERIVED`, `ALGORITHM_DERIVED`, or `REFERENCE_ONLY`);
- dependency closure understood;
- donor-specific assumptions reviewed;
- local destination authorized by the active specification;
- source-derived tests/fixtures retained where they materially define behavior;
- Delethos conformance/security gates pass;
- upstream drift policy and maintenance owner are explicit;
- required notice/Source-BOM surfaces remain consistent.

### Adapter support gate

Before an adapter is called `SUPPORTED`:

- real CLI version recorded;
- discovery/launch behavior verified;
- write behavior verified;
- read-only/sandbox semantics verified or explicitly unsupported;
- timeout/cancel/failure behavior verified;
- resume/model/usage claims verified or omitted;
- platform matrix qualified;
- conformance suite passes on the exact adapter revision.

### Release gate

Before stable public release:

- cross-platform CI for promised platforms;
- dependency/security review;
- copied-code/source provenance audit;
- required third-party notices present;
- Source BOM/package SBOM consistency where applicable;
- release artifact verification;
- upgrade/migration behavior;
- public security policy;
- reproducible quickstart;
- independent validation instructions;
- no known mismatch between README claims and machine-observed capabilities;
- reproducible public screenshots/evidence-card artifacts where they support product claims.

## Category leadership strategy

The project seeks exceptional GitHub adoption, but it will earn attention through useful proof rather than optimize the repository for vanity metrics.

The distribution flywheel should be:

```text
one-command useful demo
  -> shareable verified result
  -> public adapter/conformance artifacts
  -> community adapter contribution
  -> more eligible agent ecosystems
  -> reproducible benchmark/comparison discussion
  -> more users and contributors
```

Broad source-use permission accelerates the engineering flywheel by allowing Delethos to import proven fixtures/primitives instead of repeatedly rediscovering edge cases, but provenance transparency should become a strength rather than something hidden.

### Launch narrative

Primary message:

> **Coding agents should not review their own homework.**

Supporting message:

> **Your agents write it. Delethos proves what actually happened.**

The README/launch experience should demonstrate, not merely describe:

```text
Codex (or another eligible agent) -> implementation
another independent agent          -> review
repository checks                  -> deterministic evidence
Delethos                           -> proof bundle
human                              -> decision
```

The exact vendor names used in launch media must reflect adapters that are genuinely qualified at launch time.

## North-star measurements

Engineering/product measurements:

- time to first useful verified run;
- first-pass verification rate;
- repair-loop rate;
- orphan-process rate;
- adapter conformance pass rate;
- false support-claim defects;
- evidence-verifier reproducibility;
- routing explanation completeness;
- cross-platform parity;
- escaped verification defects;
- copied-unit provenance coverage;
- generated-surface drift defects;
- source-derived fixture coverage for supported adapters;
- upstream security reconciliation latency for adopted units.

Adoption measurements, tracked separately from quality gates:

- qualified installs/first runs where measurable without invasive telemetry;
- repeat use;
- adapter contributors;
- independent reproductions;
- GitHub stars/forks/watchers;
- external references and marketplace placement;
- community support load.

No adoption metric is allowed to convert an engineering FAIL into PASS.

## Cross-spec execution rules

1. Live GitHub/repository truth overrides chat handoffs.
2. No force-push, rebase shared history, or destructive published-history rewrite.
3. Use bounded branches and pull requests for repository-controlled units.
4. Verify exact head/base/scope/checks/reviews/threads/comments/mergeability before merge.
5. Merge with expected-head protection where available.
6. Require canonical post-merge checks appropriate to the touched surface.
7. Re-read canonical `main` after every merge before starting another unit.
8. Never treat unavailable/skipped/neutral review systems as PASS.
9. Do not invent evidence, benchmark output, adoption, endorsement, provider capability, source rights, or provenance.
10. Preserve residual risks and known limitations.
11. External ideas/code require license-aware provenance even when Founder source-use authorization permits copying.
12. Material copied code requires an active-spec destination plus source/adoption evidence; permission alone is not an implementation surface.
13. Prefer donor tests/fixtures to travel with adopted behavior, then add Delethos-specific conformance/security tests.
14. Do not create successor specs solely to maintain momentum; activate bounded work when canonical authority and evidence justify it.

## Continuation rule

Always continue from the exact active frontier in `specs/CURRENT.md` after re-reading canonical `main` and the active specification's plan/tasks.

A program-level roadmap or source-adoption opportunity does not activate successor work. Complete only genuinely authorized dependency-ordered units. After each merge, reconcile live canonical authority again before selecting the next unit.
