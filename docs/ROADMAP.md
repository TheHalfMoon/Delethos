# Delethos Roadmap

This is a milestone-level view. It does **not** authorize implementation. `specs/CURRENT.md` and the active specification own execution authority.

Program-level security/evaluation refinement is described in `docs/SECURITY_EVALUATION_EXPANSION_PLAN.md`. Its source qualification is recorded in `docs/research/SECURITY_CONTENT_BENCHMARK_SOURCES_2026-09-08.md`.

Program-level selective code reuse is described in `docs/SOURCE_ADOPTION_AND_REUSE_PLAN.md`, with the Founder authorization in `docs/research/FOUNDER_SOURCE_USE_AUTHORIZATION_2026-09-08.md` and source-by-source decisions in `docs/research/SOURCE_ADOPTION_MATRIX_2026-09-08.md`.

These documents refine future milestones only; they do not expand the active specification.

## North star

> Make verified cross-agent delegation feel as normal as running tests before merge.

A second long-term design objective complements that north star:

> Make security-relevant claims about AI-written patches carry explicit content, scanner, finding, dynamic-test, and benchmark provenance instead of relying on extension names, scanner summaries, or model opinion.

A third engineering objective governs source reuse:

> Reuse proven source aggressively when it reduces risk, while keeping Delethos contracts, authority, conformance, and evidence native and auditable.

## Program sequence

| Spec | Milestone | Intended outcome |
|---|---|---|
| 000 | Founding governance | Constitution, architecture, trust/evidence/adapter contracts, research, roadmap, contribution discipline |
| 001 | Core state | Deterministic task/policy/run/evidence primitives |
| 002 | Isolation & supervision | Worktree lifecycle, process ownership, cancel/timeout/stall/recovery |
| 003 | First gold adapters | Adapter SDK plus first independently qualified real CLIs; unchanged by the source-adoption/security planning refinements |
| 004 | Independent review | Distinct reviewer identity, bounded repair/escalation, durable review/repair jobs, exact patch rebinding |
| 005 | Guards + proof bundle | Deterministic guards, Source BOM/provenance candidates, content observations, normalized security findings, portable verifier candidate |
| 006 | First-class UX | `doctor`, discovery, event-derived TUI/projections, bounded live job output, reproducible evidence cards |
| 007 | Explainable routing | Eligibility/risk/outcome routing plus explicit discovered/configured/reachable/healthy/authorized/qualified capability facts and durable decisions |
| 008 | Adapter expansion | Cross-platform gold-support matrix, source-derived compatibility corpus, canonical adapter definitions and drift-gated generated surfaces where applicable |
| 009 | Delethos Bench | Reproducible reliability/review/routing evaluation plus repository-level security evaluation and source/data provenance |
| 010 | Agent Skill | Canonical Skill/plugin source, generated multi-harness packaging, pre-activation security admission |
| 011 | GitHub integration | PR/check/evidence surfaces, bounded SARIF/security-finding interoperability, reproducible evidence-card artifacts |
| 012 | Ecosystem | Adapter/plugin/MCP/Skill SDK, signed provenance/conformance registry, generated-surface drift gates, install != activation |
| 013 | Stable v1 hardening | Adversarial security/recovery hardening, copied-code/source audit, notice/SBOM verification, provider-integrity evaluation |
| 014 | Category launch | Validated quickstarts, independent security/evidence/source validation, artifact-freshness gates and launch/discoverability readiness |

## Phase 1 — Prove the wedge

The project should not expand until it can reliably demonstrate:

```text
one bounded task
  -> one real external coding agent implements
  -> exact diff is captured
  -> deterministic guards run
  -> a distinct agent reviews when policy requires it
  -> a repaired candidate is rebound/re-reviewed as required
  -> a portable evidence bundle verifies
  -> human sees exactly what is and is not proven
```

This phase spans the early product specs and is the prerequisite for credible marketing.

Security/source refinement in this phase remains narrow: donor code or source-derived fixtures may strengthen the active wedge only when the active specification explicitly authorizes the exact destination and behavior. Broad source availability must not delay or bypass proving the core verified-delegation loop.

## Phase 2 — Make it delightful

After the proof semantics are real:

- one-command install/doctor;
- fast local agent discovery;
- high-signal TUI derived from durable events/state rather than independent UI truth;
- readable failure/recovery states;
- readable `UNKNOWN`, `UNAVAILABLE`, `ABSTAIN`, and `NOT RUN` security/content states;
- readable capability states that separate discovery, configuration, health, authorization, and qualification;
- bounded live output for review/guard/security jobs;
- shareable evidence summaries/cards;
- straightforward adapter contribution path.

A visual product layer must display real states generated by the core; it must not become a second truth system.

## Phase 3 — Make it adaptive

Only after enough reliable local evidence exists:

- explainable routing;
- capability/risk-aware policy;
- measured local outcome history;
- content/risk-aware guard and reviewer eligibility where evidence exists;
- adaptive model/effort where provider capability is real;
- quota/cost awareness only when observable or clearly estimated;
- persistent durable project decisions with freshness boundaries;
- optional bounded declarative workflow compilation only when it compiles into the deterministic state/policy model.

No opaque "AI chooses the best AI" claim without reproducible evidence. No scanner, model, registry, or donor source may self-promote into a trusted route solely from its own output or presence.

## Phase 4 — Make it an ecosystem

- adapter SDK;
- conformance fixtures, including source-derived compatibility cases;
- compatibility matrix;
- one canonical Agent Skill/plugin source with deterministic harness-specific generation;
- static pre-activation admission for third-party Skill/plugin/MCP artifacts when a future spec authorizes it;
- GitHub integration;
- bounded SARIF import/export for security finding interoperability;
- community adapters/extensions;
- signed security/conformance/source-provenance registry;
- generated-registry and generated-harness drift gates;
- public verifier consumption/production by third-party tools.

The ecosystem succeeds when external tools can participate in Delethos contracts without adopting a Delethos cloud and without becoming trusted merely because they are installed, listed, copied from a known source, or present in a registry.

## Phase 5 — Make it a standard

Long-term success means the evidence/adapter/source vocabulary becomes useful outside the repository itself.

Candidate stable surfaces:

```text
delethos.adapter-capabilities.v1
delethos.run.v1
delethos.job.v1
delethos.guard-result.v1
delethos.review.v1
delethos.evidence.v1
delethos.source-adoption.v1
delethos.content-observation.v1
delethos.security-finding.v1
delethos.security-guard-result.v1
```

Version names are placeholders until tested/stabilized by active specifications.

Security-related stable surfaces must preserve evidence-strength and abstention semantics. A probabilistic detector result cannot silently become deterministic proof during serialization or interoperability export.

Source-related stable surfaces must preserve exact upstream revision/path, adoption mode, local destination, modifications, verification, notice basis, and upstream-drift policy.

## Source adoption spine

The roadmap now reserves an explicit future code-reuse pipeline:

```text
source discovered
  -> exact source snapshot
  -> rights/license/provenance record
  -> smallest useful unit selected
  -> dependency closure + donor-assumption review
  -> active specification authority
  -> copy/adapt/translate/fixture derivation
  -> source-derived tests + Delethos conformance
  -> notice/Source-BOM verification
  -> upstream drift policy
  -> adopted Delethos behavior
```

The strongest current reuse candidates are deliberately bounded:

- delegate-skills: real CLI fixtures, relay edge cases, run/stderr artifacts;
- DeepSeek Harness: durable jobs, event/projection/tool contracts;
- Superpowers: pressure-tested verification/review methodology and fixtures;
- wshobson/agents: single-source authoring plus generated harness adapters and drift gates;
- Ruflo: capability-state registry and signed plugin-provenance ideas;
- AI-Infra-Guard: deterministic security fixtures, taxonomy and SARIF interoperability;
- AICGSecEval: benchmark schema and isolated static/dynamic evaluation;
- Magika: confidence/abstention semantics and optional content detector;
- Munder Difflin: observable event/worktree/run UX;
- Diagram Design/Archify: public artifact freshness and real-render verification.

Broad source permission is not permission to import a framework without a maintenance/dependency/provenance case.

## Security and evaluation proof spine

The roadmap reserves explicit future shaping space for:

```text
changed artifact bytes
  -> content observation / abstention
  -> content-appropriate guards
  -> normalized security findings + scanner provenance
  -> contained dynamic validation when explicitly required
  -> independent review
  -> proof bundle
  -> repository-level security benchmark / independent reproduction
```

The preferred lessons from the 2026-09-08 source study are:

- confidence-aware/generic/unknown content handling rather than extension-only certainty;
- agent/Skill/MCP threat taxonomy and supply-chain admission;
- SARIF interoperability without making SARIF the canonical evidence model;
- repository-level CVE-like benchmark tasks with exact bases and reproducible static + dynamic evaluation;
- explicit false-positive/false-negative and contamination/provenance reporting for security claims.

The roadmap does **not** promise a specific donor dependency or wholesale code import.

## Deferred until evidence justifies them

- hosted team/fleet control plane;
- desktop application;
- remote agent workers;
- enterprise policy distribution;
- centralized analytics;
- shared cloud memory;
- automatic merge/release authority;
- complex workflow DSL;
- distributed task graph/swarms;
- marketplace billing;
- provider-agnostic external side-effect orchestration;
- generic CVE/vulnerability-management platform;
- hosted red-team dashboard as a core requirement;
- mandatory ML content classifier;
- mandatory Docker/security-lab environment for ordinary Delethos runs;
- automatic execution of repository PoCs or untrusted Skill/MCP tools;
- LLM-only security certification;
- mandatory donor plugin/harness runtime;
- framework-scale copying merely because source-use permission exists.

These are not promised features.

## Roadmap hygiene

- Near-term active work becomes precise through a specification.
- Distant work remains coarse.
- A completed spec does not automatically activate the next number.
- New evidence may reorder, split, replace, or remove roadmap units.
- No roadmap unit exists merely to sustain visible activity.
- Security/source breadth must not bypass the verified-delegation wedge or active task order.
- Founder-authorized donor repositories are eligible source inputs, but an active specification must still authorize every material implementation destination.
- Every material copied unit should eventually retain exact source revision/path, adoption mode, local destination, verification, notice basis, dependency closure, donor-assumption review, and upstream-drift policy.
- A future security specification must define deterministic/probabilistic evidence boundaries, dynamic containment, privacy/secrets, provenance, negative tests, and explicit non-claims before implementation.
