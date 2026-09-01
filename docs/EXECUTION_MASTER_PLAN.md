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
- a benchmark marketing site without reproducible methodology.

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

Distant details remain deliberately coarse until Spec 000 closes and live evidence shapes Spec 001.

### Specification 002 — Worktree isolation + process supervision

Expected category: exact repository base capture, worktree lifecycle, child process ownership, cancellation, timeout/stall distinction, orphan cleanup, and recovery behavior.

### Specification 003 — Adapter SDK + first two gold adapters

Expected category: one portable adapter contract and a deliberately small first pair of independently qualified real coding-agent CLIs. Selection requires live CLI capability research; names are not canonically committed by this roadmap.

### Specification 004 — Independent review + bounded repair loop

Expected category: distinct implementer/reviewer identity, read-only review posture where the target adapter can truly support it, bounded changes-required loops, escalation, and provenance.

### Specification 005 — Deterministic guards + proof-carrying patch bundle

Expected category: guard execution, changed-path/scope evidence, acceptance evidence, hashes/digests, portable `delethos.evidence.v1` candidate, and verifier behavior.

### Specification 006 — CLI/TUI onboarding + first useful run

Expected category: `doctor`, agent discovery, guided setup, `run`, `verify`, high-signal TUI, readable failure states, and a first-run path that demonstrates value without requiring cloud signup.

### Specification 007 — Adaptive routing + durable project decisions

Expected category: explainable routing based on eligibility, task/risk policy, observed local outcomes, explicit user preference, and available capability; durable decisions remain separate from volatile repository facts.

### Specification 008 — Gold adapter expansion + cross-platform conformance

Expected category: expand support only through conformance evidence across declared platforms. Unsupported or unverified surfaces remain explicit.

### Specification 009 — Delethos Bench

Expected category: reproducible engineering workflow evaluations for execution reliability, recovery, review defect detection, latency, and routing—not a hidden leaderboard optimized for marketing.

### Specification 010 — Agent Skill + marketplace packaging

Expected category: invoke Delethos as a first-class skill/plugin from compatible coding-agent environments while keeping the open local CLI/core independently usable.

### Specification 011 — GitHub integration

Expected category: PR review/check surfaces, evidence summaries, verification badges, and repository policy integration without making GitHub the only supported forge/workflow.

### Specification 012 — Ecosystem + conformance registry

Expected category: community adapter scaffolding, conformance fixtures, compatibility matrix, extension contracts, and provenance/maintenance rules.

### Specification 013 — Stable v1 security/recovery contracts

Expected category: adversarial hardening, stable contract versioning, migration policy, release reproducibility, signed/published evidence where appropriate, and recovery guarantees.

### Specification 014 — Adoption and category-launch readiness

Expected category: validated quickstarts, executable examples, independent validation protocol, launch artifacts, public comparison methodology, discoverability surfaces, and community contribution loops. Popularity metrics remain observational and cannot weaken proof semantics.

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

## Founding technology direction

The preferred initial implementation direction is a TypeScript/Node monorepo because the surrounding coding-agent/plugin ecosystem is heavily CLI/Node-oriented and TypeScript provides a low-friction path to adapters, terminal UI, JSON-schema-compatible contracts, and cross-platform execution.

This is a founding architectural direction, not permission to add a dependency-heavy framework stack. Core runtime dependencies require explicit justification. A later native/Rust component is justified only by measured security, portability, process-control, packaging, or performance needs that cannot reasonably be met by the selected core stack.

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
- release artifact verification;
- upgrade/migration behavior;
- public security policy;
- reproducible quickstart;
- independent validation instructions;
- no known mismatch between README claims and machine-observed capabilities.

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
- escaped verification defects.

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
9. Do not invent evidence, benchmark output, adoption, endorsement, or provider capability.
10. Preserve residual risks and known limitations.
11. External ideas/code require license-aware provenance.
12. Do not create successor specs solely to maintain momentum; activate bounded work when canonical authority and evidence justify it.

## Continuation rule

Complete Specification 000 exactly. After its candidate qualifies, reconciles, merges, and canonical post-merge truth is re-read, shape Specification 001 from the founding contracts and fresh implementation research. Do not begin runtime code from this master plan alone.
