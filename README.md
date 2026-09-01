# Delethos

<div align="center">

**Delegate code. Demand proof.**

*One task. The right agent. Independent review. Verifiable evidence.*

</div>

---

Delethos is a local-first, vendor-neutral control plane for verified delegation across coding agents. It is designed to let developers use the agents they already trust—without surrendering repository truth, review independence, or human merge authority.

> **Coding agents should not be the sole final reviewers of their own material changes.**

## The product thesis

Today, multi-agent coding usually means manual copy/paste between tools, provider-specific subagents, or a large autonomous harness that is difficult to verify. Delethos takes a narrower and more defensible position:

```text
bounded task
  -> route to an eligible implementer
  -> isolate execution
  -> observe the exact change
  -> run deterministic guards
  -> obtain independent review when required
  -> repair within bounded retries
  -> produce a proof-carrying patch
  -> human accepts, rejects, or continues
```

The deliverable is not an agent's summary. The deliverable is the exact repository change plus evidence bound to the exact run and revision.

## Founding invariants

- **Proof before done.** No PASS/VERIFIED claim without exact machine-observed evidence.
- **Repository truth over narrative.** Git state, policy, checks, and reproducible artifacts outrank agent summaries.
- **Independent review for material changes.** The material implementer cannot be the sole final reviewer under policies that require independent review.
- **Deterministic control plane.** Probabilistic agents may propose, implement, and review; correctness-sensitive state transitions remain deterministic.
- **Local-first and vendor-neutral.** No mandatory hosted service, model vendor, IDE, or proprietary protocol.
- **No silent authority expansion.** No silent commits, merges, privilege escalation, or hidden weakening of sandbox/review requirements.
- **Bounded autonomy.** Retries, debate, repair loops, timeouts, and escalation are explicit and finite.
- **Honest adapter capability.** Unsupported, partial, unavailable, stalled, timed-out, or not-run states remain distinct.
- **Proof-carrying patches.** A successful run can emit a portable evidence bundle that explains what changed, who/what acted, what ran, and what remains uncertain.

## Status

`FOUNDING_CANDIDATE`

Canonical `main` currently contains only the initial bootstrap. The `docs/founding-plan` branch proposes Specification 000 and the founding authority chain. Product runtime implementation is **not yet authorized**.

Read in this order before changing the repository:

1. [`AGENTS.md`](AGENTS.md)
2. [`specs/CURRENT.md`](specs/CURRENT.md)
3. [`.specify/memory/constitution.md`](.specify/memory/constitution.md)
4. [`docs/EXECUTION_MASTER_PLAN.md`](docs/EXECUTION_MASTER_PLAN.md)
5. the active spec, plan, and tasks
6. referenced ADRs, contracts, security docs, research, and source

## Planned first-class surfaces

The architecture is planned around a small set of durable primitives:

- **Agent adapters** — discover and invoke external coding agents without making any one vendor canonical.
- **Run state machine** — explicit lifecycle including `STALLED` distinct from `TIMED_OUT`.
- **Isolation** — worktree-first execution with stronger sandbox/container modes only where evidence justifies them.
- **Policies** — convenience strategies compiled into explicit implement/review/guard requirements.
- **Guards** — deterministic repository checks and policy verification.
- **Evidence** — versioned proof bundles bound to exact repository and run state.
- **Bench** — reproducible, non-marketing evaluation of adapter and routing behavior.
- **TUI/CLI** — one-command onboarding and a high-signal view of agents, tasks, diffs, checks, review, and evidence.

The exact product surface will be authorized specification by specification; this list is a roadmap, not blanket implementation authority.

## Strategic objective

Delethos is being designed to become the neutral verification and delegation layer developers reach for when they have more than one coding agent installed. Category leadership, GitHub growth, and public adoption are strategic goals, but popularity is never an engineering PASS condition.

The launch standard is simple: a developer should be able to install Delethos, discover eligible local agents, delegate one bounded task, and understand the returned patch and proof without reading the internals first.

## Founding documents

- [`docs/EXECUTION_MASTER_PLAN.md`](docs/EXECUTION_MASTER_PLAN.md)
- [`docs/ROADMAP.md`](docs/ROADMAP.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/SECURITY_MODEL.md`](docs/SECURITY_MODEL.md)
- [`docs/EVIDENCE_MODEL.md`](docs/EVIDENCE_MODEL.md)
- [`docs/ADAPTER_CONTRACT.md`](docs/ADAPTER_CONTRACT.md)
- [`docs/ADOPTION_AND_CATEGORY_LEADERSHIP.md`](docs/ADOPTION_AND_CATEGORY_LEADERSHIP.md)
- [`docs/research/FOUNDING_LANDSCAPE_2026-09-01.md`](docs/research/FOUNDING_LANDSCAPE_2026-09-01.md)

## License

MIT.
