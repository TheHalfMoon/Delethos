# Specification 000 — Founding Governance & Architecture

## Status

`CLOSED_CANONICAL` **iff the terminal effectivity conditions in `closeout.md` are realized on canonical `main`; otherwise this specification remains active for bounded closeout only.**

Completion is determined by machine-observed repository truth, not by this status text alone.

## Purpose

Establish Delethos as a governed, evidence-first open-source project before product implementation begins.

The founding unit defines the product boundary, constitution, repository operating rules, architecture, security model, evidence semantics, adapter semantics, research provenance, execution roadmap, contribution discipline, license direction, and the exact conditions under which runtime implementation may later begin.

## Problem

Delethos starts from a high-ambition product thesis: become a neutral control plane for verified delegation across coding agents. Without founding constraints, the project could easily devolve into one of the failure modes it is meant to solve:

- ad hoc vendor wrappers with inconsistent semantics;
- a large autonomous orchestration surface before verification works;
- marketing claims stronger than evidence;
- stale project memory treated as live truth;
- model reviews treated as deterministic proof;
- hidden commits/merges or unclear authority;
- premature dependency/framework sprawl;
- benchmark theater optimized for stars rather than reproducibility.

Specification 000 prevents those failure modes by making governance and proof semantics explicit before runtime code.

## Outcome

A maintainer or coding agent can enter the repository, follow one canonical reading order, identify the active authority and non-authority, understand the intended architecture and trust boundaries, trace the founding research/provenance, and know exactly what must happen before any product code is authorized.

## In scope

- `README.md` founding product positioning;
- `AGENTS.md` canonical operating rules;
- `.specify/memory/constitution.md`;
- `specs/CURRENT.md`;
- Specification 000 `spec.md`, `plan.md`, `tasks.md`, and `closeout.md`;
- `docs/EXECUTION_MASTER_PLAN.md`;
- `docs/ARCHITECTURE.md`;
- `docs/SECURITY_MODEL.md`;
- `docs/EVIDENCE_MODEL.md`;
- `docs/ADAPTER_CONTRACT.md`;
- bounded founding research/provenance note;
- founding ADRs needed to lock durable boundaries;
- adoption/category leadership plan that cannot weaken engineering gates;
- contribution/security/license/PR-process surfaces;
- deterministic governance checks only if separately added by an explicit Specification 000 task.

## Out of scope

- runtime product implementation;
- package-manager/workspace scaffolding solely for future convenience;
- coding-agent adapter code;
- CLI/TUI implementation;
- worktree/process supervisor implementation;
- benchmark execution or score publication;
- cloud/hosted services;
- telemetry implementation;
- automatic commits/merges/releases;
- stable v1 product schema claims;
- production security/sandbox claims;
- release/tag publication;
- GitHub popularity claims or guaranteed ranking outcomes.

## Founding principles

1. **Proof before done.** Claims are bound to exact evidence.
2. **Repository truth over narrative.** Live Git and repository policy outrank agent summaries.
3. **Bounded work before execution.** Large ambiguous tasks are refined, not handed to larger swarms.
4. **Independent review is explicit policy.** Material implementers cannot be their own sole final reviewers when independent review is required.
5. **Deterministic control plane.** Probabilistic workers cannot unilaterally set correctness-sensitive state.
6. **Vendor neutrality.** Providers are adapters, never canonical truth.
7. **Honest capability.** Unsupported/unverified/partial/unavailable behavior remains visible.
8. **Bounded autonomy.** Retry, repair, debate, timeout, stall, and escalation are finite.
9. **Evidence integrity is not semantic correctness.** Proof layers remain distinct.
10. **Adoption never weakens rigor.** Stars, rankings, installs, or launch timing are not engineering gates.

## Founding architectural decisions

The founding architecture establishes these durable boundaries:

- Git/repository state is the authoritative change substrate.
- Delethos coordinates external CLIs through adapters.
- Mutable runs are expected to be worktree-first where Git permits it; worktrees are not advertised as security sandboxes.
- Deterministic guards and model/agent reviews are separate evidence types.
- A successful run may emit a proof-carrying patch/evidence bundle.
- Durable project decisions must remain separate from volatile repository facts.
- Runtime `STALLED` and `TIMED_OUT` states are distinct.
- Human merge authority is the default.
- The open local core does not depend on a hosted Delethos service.
- TypeScript/Node is the preferred initial implementation direction, subject to a later product spec and evidence; no framework/dependency stack is authorized by this founding choice.

## Research inputs

Founding research considers, without treating them as implementation authority:

- `amElnagdy/delegate-skills` — portable delegation and relay lessons;
- `chaitanyagiri/munder-difflin` — operational visualization/product-theater lessons;
- `obra/superpowers` — opinionated methodology and multi-harness distribution;
- `anthropics/skills` / `vercel-labs/skills` — skill distribution conventions;
- `deepseek-ai/deepseek-harness`, `ruvnet/ruflo`, `wshobson/agents`, `nrslib/takt` — harness/orchestration/ecosystem lessons;
- `cathrynlavery/diagram-design`, `tt-a1i/archify` — immediate visual value and launch clarity;
- `TheHalfMoon/SpecGrain` — grain/evidence/canonical-frontier governance method;
- `TheHalfMoon/Diffcipline` — proof-before-done and exact-change verification discipline.

Detailed distinctions live in `docs/research/FOUNDING_LANDSCAPE_2026-09-01.md`.

## Acceptance criteria

Specification 000 may close only when canonical repository truth proves all of the following:

1. one authoritative canonical reading order exists and all governing docs agree on it;
2. the constitution is canonical and no founding document contradicts its core invariants;
3. active frontier and explicit non-authority are canonical;
4. architecture separates policy, adapter execution, supervision/isolation, deterministic guards, independent review, and evidence;
5. security documentation states real trust boundaries and preserves non-claims;
6. evidence documentation distinguishes integrity, acceptance evidence, and semantic correctness;
7. adapter documentation defines honest capability and conformance expectations without fabricating CLI support;
8. research provenance records material external influences and does not authorize donor code copying;
9. roadmap is progressively refined and explicitly non-authoritative outside the active spec;
10. category/adoption strategy keeps popularity separate from engineering PASS conditions;
11. contribution, security reporting, license, and PR templates exist in the repository;
12. every Specification 000 task is reconciled against the exact canonical diff and no runtime product code entered through founding work;
13. the founding closeout records residual risks, unresolved hypotheses, and the exact next shaping rule;
14. canonical `main` is re-read after the final Specification 000 merge before Specification 001 is shaped.

## Evidence requirements

The terminal evidence is recorded in `closeout.md` and binds:

- founding bootstrap and activation revisions;
- exact 22-path founding activation surface;
- exact PR #1 head/base/merge/review/thread/comment truth;
- absence of configured founding CI/statuses;
- canonical hashes/references for the authority chain;
- explicit no-runtime-product confirmation;
- residual repository administration gaps;
- unresolved product hypotheses;
- the post-closeout shaping rule.

## Risks preserved after closeout

- **Over-governance before value:** Specification 001 should remain a small deterministic core-state unit.
- **Architecture fiction:** interface/schema examples remain candidates until implementation/tests exist.
- **Vendor bias:** first adapters remain unselected until a later evidence-backed spec.
- **Security overclaim:** sandbox/read-only/provider controls remain unclaimed until qualified.
- **Growth pressure:** adoption metrics remain observational.
- **Repository administration:** branch protection/rulesets and metadata are live external gaps and must not be represented as applied.

## Recovery

If the terminal closeout candidate materially expands into product implementation or contradicts founding authority:

1. do not merge it as-is;
2. reduce it to the authorized documentation/evidence surface;
3. preserve accurate historical evidence;
4. re-run exact-head review/reconciliation on the repaired candidate;
5. do not carry accidental product code forward as implied authority.

## Completion rule

Specification 000 becomes `CLOSED_CANONICAL` only when all terminal conditions in `closeout.md` are machine-observed against canonical repository truth.

After closure, shape Specification 001 from the canonical founding contracts plus fresh implementation research. Do not start runtime implementation from roadmap text or from Specification 000 closure alone.
