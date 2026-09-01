# Specification 000 — Plan

## Goal

Land Delethos's founding authority chain as a coherent, reviewable, documentation-first program unit without allowing product runtime implementation to slip into the bootstrap.

## Planning method

Specification 000 follows the same core discipline Delethos intends to apply to coding-agent work:

- bounded scope;
- explicit change surface;
- exact evidence expectations;
- repository truth over summaries;
- no hidden successor authority;
- progressive refinement rather than a giant implementation backlog.

## Phase A — Bootstrap and authority

### A1. Repository bootstrap

Create the minimum canonical repository state needed to support a bounded founding branch.

Evidence:

- canonical bootstrap commit exists;
- default branch is known;
- no product runtime code exists.

### A2. Constitution and repository rules

Create:

- `.specify/memory/constitution.md`;
- `AGENTS.md`;
- `specs/CURRENT.md`.

Acceptance:

- live truth precedence is explicit;
- product implementation is explicitly unauthorized during Specification 000;
- proof-before-done, independent review, deterministic control plane, vendor neutrality, and bounded autonomy are non-negotiable.

## Phase B — Product and trust architecture

### B1. Execution master plan

Define the durable product objective, program sequence, cross-spec rules, quality gates, strategic adoption boundary, and continuation rule.

### B2. Architecture

Separate:

- contracts;
- policy;
- adapters;
- run supervision;
- worktree/filesystem isolation;
- deterministic guards;
- independent review;
- evidence;
- bench/routing;
- CLI/TUI surfaces.

### B3. Security model

Document:

- trust boundaries;
- default authority posture;
- worktree vs sandbox distinction;
- secrets/data minimization;
- prompt/repository injection boundary;
- network/external side-effect limitations;
- supply-chain expectations;
- explicit security non-claims.

## Phase C — Portable proof and integration contracts

### C1. Evidence model

Define candidate proof-carrying-patch semantics without freezing an untested schema.

Must distinguish:

- integrity/binding;
- acceptance evidence;
- semantic correctness;
- deterministic guards;
- independent review;
- incomplete/unverified/invalid states.

### C2. Adapter contract

Define capability reporting, invocation semantics, cancellation, optional resume, event/result normalization, conformance expectations, support tiers, and provenance rules.

No concrete adapter may be claimed supported in Specification 000.

## Phase D — Research and durable decisions

### D1. Founding landscape

Record strengths/gaps from primary adjacent projects and internal methodological references. Identify Delethos-native differentiators and falsifiable product hypotheses.

### D2. Founding ADRs

Record only decisions that should survive individual specs:

- product boundary and human authority;
- proof-carrying-patch/evidence boundary;
- independent-review boundary;
- optional additional ADR only if a real durable decision is not already governed cleanly by the constitution/architecture.

Avoid ADR inflation.

## Phase E — Open-source operating surfaces

Create:

- `CONTRIBUTING.md`;
- `SECURITY.md`;
- `LICENSE`;
- `.github/PULL_REQUEST_TEMPLATE.md`;
- adoption/category leadership plan.

These documents must agree with the constitution and never promise tooling that does not yet exist.

## Phase F — Founding validation and closeout

### F1. Exact-scope audit

Confirm the complete Specification 000 diff contains only authorized founding surfaces.

### F2. Cross-document invariant audit

Verify at minimum that all relevant documents agree that:

- product code is not yet authorized;
- roadmap is not active-spec authority;
- human merge authority is default;
- independent review is policy-controlled;
- worktree isolation is not a sandbox claim;
- `STALLED` is distinct from `TIMED_OUT`;
- unavailable/not-run evidence is never PASS;
- adoption metrics do not weaken engineering gates.

### F3. PR reconciliation

Recheck exact head/base/scope, reviews, threads, comments, and mergeability. Record unavailable/skipped systems accurately.

### F4. Canonical merge and reread

Merge with expected-head protection where available, then re-read canonical `main` and update the frontier only through an authorized closeout unit if one is genuinely required.

## Allowed founding change surface

Specification 000 work is limited to:

```text
README.md
AGENTS.md
LICENSE
CONTRIBUTING.md
SECURITY.md
.specify/memory/constitution.md
.github/PULL_REQUEST_TEMPLATE.md
docs/**/*.md
specs/CURRENT.md
specs/000-founding-governance/*.md
```

Any additional path requires an explicit Specification 000 plan amendment with rationale before edit.

## Prohibited during this plan

- `package.json`, lockfiles, TypeScript config, workspace files;
- `src/`, `packages/`, `apps/`, or executable product code;
- adapter scripts;
- CI claims without actual configured workflows;
- benchmark outputs;
- release/tag assets;
- generated marketing metrics;
- provider credentials/configuration;
- copied donor code without separate provenance/license authorization.

## Verification approach

Because the initial unit is documentation/governance-only, verification is primarily exact repository inspection and cross-document consistency until deterministic governance tooling is separately added. The absence of CI must remain explicit; it is not silently interpreted as green.

## Terminal exit condition

The plan is complete only when Specification 000 acceptance criteria are reconciled against canonical repository truth. A merged founding-plan PR may activate Specification 000; it does not automatically complete Specification 000 unless every task and closeout condition is actually satisfied.
