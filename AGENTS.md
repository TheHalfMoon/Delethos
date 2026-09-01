# Delethos Repository Instructions

This file defines repository-level operating rules for humans and AI coding agents.

## 1. Mission

Delethos is a local-first, vendor-neutral control plane for verified delegation across coding agents. It routes bounded work, isolates execution, evaluates deterministic guards, coordinates independent review when policy requires it, and returns a proof-carrying patch for a human or explicitly authorized repository policy to decide upon.

Delethos is not a generic project manager, not a model provider, not an IDE, not a prompt collection, and not an excuse for unbounded autonomous swarms.

## 2. Canonical reading order

Before changing the repository, read in this order:

1. `AGENTS.md`
2. `specs/CURRENT.md`
3. `.specify/memory/constitution.md`
4. `docs/EXECUTION_MASTER_PLAN.md`
5. the active `spec.md`
6. the active `plan.md`
7. the active `tasks.md`
8. referenced ADRs, contracts, research, evidence, security documents, and source files

Live canonical repository and GitHub state overrides stale chat handoffs, cached plans, or external notes.

## 3. Language

Repository technical content MUST be written in English, including code, comments, commit messages, pull-request text, reports, specifications, evidence, and reviewer responses.

## 4. Non-negotiable engineering rules

1. Understand before editing. Trace the real flow and name material assumptions.
2. Work only inside active canonical authority. Roadmap ideas are not implementation authorization.
3. Prefer the smallest coherent change that can be independently verified.
4. No drive-by refactors, speculative abstractions, or dependency additions unrelated to the active unit.
5. Correctness, security, accessibility, data integrity, compatibility, and explicit requirements outrank diff size.
6. Risk changes rigor. High-risk surfaces require stronger negative-path/adversarial evidence even for small diffs.
7. Do not claim PASS or VERIFIED without exact machine-observed evidence from the exact change under review.
8. Agent self-report is not authority. Repository truth and required evidence own the claim.
9. Do not force-push, rebase shared history, or rewrite published history.
10. Do not silently commit, merge, publish, release, elevate privileges, or weaken a required review/sandbox boundary.
11. External donor code or text requires license-aware provenance.
12. Missing or unavailable checks remain `NOT RUN`/`UNAVAILABLE`; never convert absence of evidence into PASS.

## 5. Specification discipline

A product change requires an active specification with:

- one independently understandable outcome;
- explicit in-scope and out-of-scope boundaries;
- acceptance conditions;
- dependencies and preconditions;
- risk and recovery expectations;
- allowed change surface or justified exception;
- evidence requirements;
- reviewer/independence requirements where applicable.

If a unit is too broad, refine it before implementation rather than increasing prompt size or agent count.

## 6. Status vocabulary

Specification/program states:

- `DRAFT`
- `SHAPED`
- `REFINING`
- `GRAIN`
- `READY`
- `RUNNING`
- `VERIFYING`
- `VERIFIED`
- `CONTROLLED`
- `CLOSED_CANONICAL`
- exceptional: `BLOCKED`, `FAILED`, `SUPERSEDED`, `CANCELLED`, `STALE`

Runtime states are separate and MUST NOT be confused with specification states:

- `QUEUED`
- `PREPARING`
- `RUNNING`
- `WAITING`
- `STALLED`
- `TIMED_OUT`
- `FAILED`
- `CANCELLED`
- `REVIEW_REQUIRED`
- `CHANGES_REQUIRED`
- `VERIFIED`

## 7. Exact-head pull-request discipline

Before merging a repository-controlled unit:

- re-read canonical `main`;
- verify exact PR base and head;
- verify the exact changed-path set is authorized;
- require all mandatory checks on the exact head;
- inspect reviews, review threads, substantive comments, and mergeability;
- record unavailable/skipped review systems honestly;
- merge with expected-head protection where the surface supports it;
- require canonical post-merge checks appropriate to the touched surface;
- re-read canonical authority before beginning the next unit.

A green CI result is necessary where configured but is not sufficient evidence of spec compliance by itself.

## 8. Adapter discipline

Every adapter must:

- expose only capabilities verified against the real external CLI surface;
- distinguish support from inference;
- normalize execution without erasing provider-specific semantics that matter for safety or recovery;
- pass the repository's conformance suite before being presented as supported;
- preserve platform qualification status;
- fail closed on malformed, contradictory, or unsupported configuration.

## 9. Review independence

When a policy requires independent review, the material implementer may not be the sole final reviewer. Reviewer identity and execution provenance must be retained in the evidence bundle. A reviewer opinion does not replace deterministic tests or guards.

## 10. Context discipline

Durable decisions and standing constraints may be persisted. Volatile repository state must be re-derived from live truth. Cached context must not silently override current files, refs, policies, checks, or release state.

## 11. Benchmark discipline

Benchmarks and comparative evaluations must publish task definitions, configuration, environment facts, raw outputs where safe/licensed, scoring logic, exclusions, failures, and limitations. Do not hide losing results or claim superiority from an invalidated or partial run.

## 12. Founding restriction

While `specs/CURRENT.md` names Specification 000 as active, no product runtime implementation is authorized. Founding work is limited to the governance, architecture, research, contract, security, roadmap, contribution, and evidence surfaces named by Specification 000.
