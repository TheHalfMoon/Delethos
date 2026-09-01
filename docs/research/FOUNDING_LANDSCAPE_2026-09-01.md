# Founding Landscape — 2026-09-01

**Status:** bounded founding research snapshot  
**Purpose:** shape Delethos from observable strengths/gaps in adjacent projects without copying undocumented code or turning popularity into proof.

## Research rules

- Repository metadata and checked-in documentation are treated as claims to inspect, not automatic proof of every feature.
- Stars/forks are distribution signals only.
- Donor code is not authorized by this research note. Material copying requires separate license/provenance review.
- This snapshot may become stale; implementation specs must reverify live integration surfaces before relying on them.

## Primary references

### `amElnagdy/delegate-skills`

Observed strengths:

- a practical cross-CLI delegation model;
- separate coding CLI edits the working tree;
- normalized relay/result behavior;
- review-first philosophy;
- explicit capability/sandbox language per CLI;
- no need to invent a new coding model/provider.

Observed/open design gaps relevant to Delethos, based on public issue discussions at the founding date:

- optional orchestration policy above fleet/lane mapping;
- independent implementer/reviewer assignment;
- bounded debate/repair/escalation;
- persistent project context that cannot silently become stale repository truth;
- stall detection distinct from a pure wall-clock timeout.

Delethos direction:

- retain the portability/review-first lesson;
- move orchestration policy, evidence binding, independent review, stall semantics, and durable-context freshness into first-class core contracts;
- do not simply fork or rename the relay design.

Repository: https://github.com/amElnagdy/delegate-skills

### `chaitanyagiri/munder-difflin`

Observed strengths:

- strong product theater and memorable multi-agent mental model;
- real terminal-agent CLI processes;
- visible coordination and task state;
- worktree isolation option;
- memory/mailbox/control concepts;
- compelling README/demo surface.

Delethos direction:

- learn from clarity, visualization, and live operational feedback;
- remain terminal-first and avoid making an Electron/desktop environment a founding requirement;
- prioritize proof and one-command utility before a rich virtual-office metaphor.

Repository: https://github.com/chaitanyagiri/munder-difflin

### `obra/superpowers`

Observed strength:

- a clear agentic software-development methodology that becomes default behavior across multiple coding-agent environments;
- strong cross-harness distribution and simple user promise.

Delethos direction:

- make the verified-delegation method opinionated enough to be memorable;
- package a first-class Agent Skill/plugin only after the local core is real;
- keep deterministic proof outside the prompt/methodology layer.

Repository: https://github.com/obra/superpowers

### `anthropics/skills`

Observed strength:

- validates Agent Skills as a meaningful public interoperability/distribution convention.

Delethos direction:

- keep the core behavioral contract portable through open skill/plugin conventions;
- do not make a single marketplace the only install path.

Repository: https://github.com/anthropics/skills

### `vercel-labs/skills`

Observed strength:

- low-friction `npx`-style skill discovery/installation and strong developer ergonomics.

Delethos direction:

- treat install/first-run friction as a product metric;
- target a one-command path after the core is implemented and packaged.

Repository: https://github.com/vercel-labs/skills

### `deepseek-ai/deepseek-harness`

Observed strength:

- plugin-first agent harness architecture with a concise category claim;
- demonstrates current demand for extensible agent infrastructure.

Delethos direction:

- use open extension boundaries but avoid a generic "everything is a plugin" clone;
- Delethos differentiates on verified delegation, independent review, proof bundles, and neutral adapters.

Repository: https://github.com/deepseek-ai/deepseek-harness

### `ruvnet/ruflo`

Observed strength:

- broad multi-agent orchestration, memory, and ecosystem ambition.

Delethos direction:

- resist breadth-first swarm features until the verified engineering loop is proven;
- prefer a narrow correctness-oriented wedge to a large feature surface.

Repository: https://github.com/ruvnet/ruflo

### `wshobson/agents`

Observed strength:

- multi-harness plugin/agent marketplace positioning and ecosystem reach.

Delethos direction:

- community adapter/extension ecosystem can become a distribution flywheel, but compatibility must be conformance-backed.

Repository: https://github.com/wshobson/agents

### `nrslib/takt`

Observed strength:

- declarative definition of agent coordination and human intervention.

Delethos direction:

- do not become merely another workflow DSL;
- convenience policies should compile to explicit behavior, while Delethos differentiates through execution evidence and verified patches.

Repository: https://github.com/nrslib/takt

### `cathrynlavery/diagram-design` and `tt-a1i/archify`

Observed strengths:

- immediately visible output;
- opinionated quality promise;
- highly demonstrable README/launch experience;
- cross-agent skill packaging.

Delethos direction:

- the first screen should show a real verified delegation flow rather than lead with architecture prose;
- shareable evidence/result cards can create a truthful visual growth loop.

Repositories:

- https://github.com/cathrynlavery/diagram-design
- https://github.com/tt-a1i/archify

## Internal methodological references

### `TheHalfMoon/SpecGrain`

Founding lessons intentionally adopted:

- constitution as highest product-governance layer;
- canonical reading order and current frontier;
- grain/bounded-work discipline before execution;
- evidence over assertion;
- deterministic correctness-sensitive state transitions;
- agent/vendor neutrality;
- progressive refinement;
- exact scope/evidence/provenance binding;
- no successor work invented merely to continue activity.

Delethos is not a fork of SpecGrain. The method is reused to govern Delethos's own development.

Repository: https://github.com/TheHalfMoon/SpecGrain

### `TheHalfMoon/Diffcipline`

Founding lessons intentionally adopted:

- proof before done;
- repository truth outranks narrative;
- minimality subordinate to correctness;
- risk-scaled rigor;
- missing/unavailable checks are never PASS;
- exact-head PR qualification and post-merge verification;
- reproducible public claims;
- adoption work cannot weaken proof semantics;
- popularity/discovery metrics remain observational.

Delethos is not a fork of Diffcipline. Diffcipline's discipline informs Delethos's verification culture and repository process.

Repository: https://github.com/TheHalfMoon/Diffcipline

## Founding synthesis

The opportunity is not "more agents." The opportunity is a trustworthy seam between agents and repository authority.

```text
portable delegation                  <- delegate-skills lesson
opinionated methodology              <- Superpowers lesson
extension ecosystem                  <- skills/harness lesson
operational visibility               <- Munder Difflin lesson
instant demonstrable value           <- visual-skill lesson
proof-before-done discipline         <- Diffcipline lesson
bounded/evidence-driven execution    <- SpecGrain lesson

                         +

Delethos-native differentiators:
- independent reviewer semantics
- deterministic policy/run state
- stall != timeout
- live truth != durable memory
- proof-carrying patches
- adapter conformance
- reproducible routing/bench evidence
```

## Product hypotheses to validate, not assume

1. Developers with multiple coding agents value neutral cross-agent routing enough to install another local control plane.
2. Independent cross-agent review catches meaningful defects beyond deterministic tests at acceptable latency/cost.
3. Proof bundles increase trust/usefulness without creating excessive ceremony.
4. Worktree-first isolation is sufficient for the common initial use case while stronger sandbox modes can remain optional.
5. TypeScript/Node provides adequate cross-platform process supervision for the first stable product; if not, measured failures can justify a native component.
6. A one-command TUI experience materially improves adoption without requiring a desktop app.
7. Local outcome history can improve routing without creating misleading pseudo-benchmark precision.

Each hypothesis requires later reproducible evidence before it becomes a strong product or comparative claim.

## Competitive claim policy

Until a dedicated comparison protocol exists, Delethos documentation should avoid statements such as:

- "best agent orchestrator";
- "safest coding agent harness";
- "faster than X";
- "catches more bugs than Y";
- "world's first" or "world's best";
- guaranteed star/ranking outcomes.

The project may state its design choices and observable capabilities exactly. Stronger comparative claims require a reproducible methodology and retained evidence.
