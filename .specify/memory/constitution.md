# Delethos Constitution

**Version:** 0.1.0  
**Ratified:** pending canonical merge  
**Status:** founding candidate

## Preamble

Delethos exists to make delegation to coding agents inspectable, bounded, portable, and provable. The project treats delegation, execution isolation, independent review, verification, evidence binding, failure recovery, and authority boundaries as engineering concerns rather than prompt conventions.

The constitution borrows the evidence-first discipline proven useful in SpecGrain and Diffcipline while defining a distinct product: a vendor-neutral control plane for verified coding-agent work.

## Principle I — Proof before done

No workflow, adapter, agent, CLI, benchmark, documentation, badge, or release may represent a check as passed unless the exact check ran successfully against the exact change being claimed.

`VERIFIED` is a deterministic state, not an agent opinion.

## Principle II — Repository truth outranks narrative

Git state, repository policy, executable checks, immutable or reproducible artifacts, and machine-observed runtime facts are canonical evidence. Agent summaries, model reasoning, orchestration narratives, and human recollection are claims to verify.

Live canonical repository truth overrides stale plans, chat handoffs, cached context, or previous run summaries.

## Principle III — Independent review is a policy boundary

When policy requires independent review, the agent or execution identity that materially implemented a change MUST NOT be the sole final reviewer of that change.

A review is independent only when Delethos can identify a distinct reviewer execution identity and preserve the provenance necessary to audit that distinction. Independence does not imply infallibility; deterministic guards remain separate evidence.

## Principle IV — Deterministic control plane, probabilistic workers

Agents may classify work, propose plans, implement changes, challenge designs, or review diffs. They MUST NOT be the only authority for correctness-sensitive state transitions.

Run lifecycle, policy compilation, capability validation, retry limits, scope checks, evidence binding, provenance, guard evaluation, and final verification state MUST remain deterministic and testable.

## Principle V — Bounded work before execution

A task may enter delegated implementation only when its execution unit is sufficiently bounded to understand outcome, scope, acceptance, change surface, risk, recovery, review requirements, and evidence requirements.

When a task is too broad, the default remedy is refinement or explicit human escalation—not a larger prompt, more agents, or an unbounded context window.

## Principle VI — Bounded autonomy and explicit escalation

Retries, repair loops, debate rounds, timeouts, resource limits, and escalation paths MUST be finite and observable. Delethos MUST NOT create infinite autonomous loops.

`STALLED`, `TIMED_OUT`, `FAILED`, `CANCELLED`, `CHANGES_REQUIRED`, and `VERIFIED` are semantically distinct outcomes and MUST NOT be collapsed for convenience.

## Principle VII — Human merge authority by default

Delethos MUST NOT silently commit, merge, publish, release, or expand repository authority. The default workflow returns a patch and evidence for human acceptance or rejection.

Future automation may support repository-configured commit/merge authority only when explicitly opted in, bounded by policy, represented honestly, and separately authorized by specification.

## Principle VIII — Agent and vendor neutrality

No model vendor, coding agent, IDE, hosted service, marketplace, proprietary protocol, or operating system may become necessary for the core behavioral contract.

Integrations are adapters around versioned open contracts. Vendor-specific functionality may improve capability without redefining truth for the core.

## Principle IX — Honest capability and sandbox claims

Adapters MUST describe capabilities in the target CLI's real terms. Unsupported, unavailable, partial, unverified, platform-limited, or provider-dependent behavior MUST remain explicit.

Delethos MUST NOT advertise a sandbox, read-only boundary, resume feature, usage metric, cost estimate, or model control that the underlying execution surface does not actually enforce or expose.

## Principle X — Isolation and blast-radius control

Delegated implementation SHOULD execute in an isolated worktree by default when Git permits it. Higher-risk work requires proportionally stronger containment, negative-path checks, and recovery evidence.

A small diff is not automatically low risk. Security, authentication, data integrity, release, dependency, migration, and policy boundaries require stronger rigor even when line count is small.

## Principle XI — Proof-carrying patches

A verified Delethos run SHOULD produce a portable, versioned evidence bundle bound to the exact repository base, observed change, run identities, required guards, review result, and unresolved limitations.

Evidence integrity MUST be distinguishable from semantic correctness: proving that a record is authentic and bound to a revision does not prove the implementation is correct unless the required acceptance evidence also passes.

## Principle XII — Durable context must not impersonate live truth

Delethos may preserve durable project decisions, standing constraints, policy, and stable rationale. Volatile repository facts MUST be re-derived from live repository state when they affect execution.

Cached context MUST carry freshness/provenance metadata sufficient to prevent stale state from silently becoming authority.

## Principle XIII — Dependency restraint and portable core

The core SHOULD prefer platform primitives, the language standard library, and already-justified dependencies. A new runtime dependency requires a documented capability, security, maintenance, size, portability, and replacement-cost justification.

Protocol and evidence formats MUST remain accessible without requiring a hosted Delethos service.

## Principle XIV — Reproducible claims and benchmarks

Performance, quality, cost, routing, review, safety, or superiority claims require public methodology and enough artifacts for independent reproduction or challenge.

Missing runs are `NOT RUN`; unavailable systems are `UNAVAILABLE`; failed experiments remain visible. Selective reruns, hidden losing metrics, and popularity-as-quality claims are prohibited.

## Principle XV — Progressive refinement

Near-term authorized work should be precise. Distant roadmap units should remain intentionally coarse until live evidence and dependencies justify refinement.

The project MUST NOT manufacture detailed successor work solely to sustain activity. New specifications require a clear bounded outcome and canonical authority.

## Principle XVI — Open provenance

External ideas, code, schemas, prompts, documentation, and benchmarks MUST be used license-consciously and attributed when material. Donor projects are references, not undocumented code sources.

Competitive claims MUST be evidence-backed and must distinguish inspiration, interoperability, adaptation, and original implementation.

## Governance

1. This constitution is the highest project-level product-governance document.
2. `specs/CURRENT.md` owns the active execution frontier; live GitHub truth overrides stale text.
3. ADRs govern durable architectural decisions; specifications govern bounded product changes; tasks govern execution order.
4. A change that violates a constitutional principle requires a dedicated constitution amendment, not a hidden exception.
5. Constitution amendments MUST state motivation, compatibility impact, migration impact, security impact, and affected specifications/contracts.
6. Semantic versioning applies to the constitution: major for incompatible principle changes, minor for new or materially stronger principles, patch for clarification.
7. No PASS, VERIFIED, MERGED, RELEASED, COMPLETE_CANONICAL, or equivalent claim may be made without exact evidence appropriate to the claim.
