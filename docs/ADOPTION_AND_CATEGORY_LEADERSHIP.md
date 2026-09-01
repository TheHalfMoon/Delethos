# Delethos Adoption & Category Leadership Plan

**Status:** founding candidate  
**Authority:** strategic plan only. Adoption goals never override the active specification or engineering proof gates.

## Objective

Build Delethos into the default neutral layer developers think of when they use more than one coding agent and want a bounded, independently reviewed, verifiable change.

The project aspires to exceptional GitHub adoption and category leadership. That ambition is real, but the repository must not game stars, manufacture endorsements, fake benchmarks, or weaken verification to chase launch timing.

## Category definition

Delethos should own a simple category phrase:

> **Verified delegation for coding agents.**

Primary promise:

> **Delegate code. Demand proof.**

Primary problem statement:

> **Coding agents should not review their own homework.**

Secondary explanation:

> Delethos routes bounded work to eligible coding agents, isolates the change, runs deterministic checks, requires independent review when policy says so, and returns a proof-carrying patch.

## Why this wedge can spread

The product can sit above competing vendors rather than compete with them. Every new coding-agent CLI can become a potential adapter/distribution channel.

The desired flywheel:

```text
new coding-agent ecosystem
  -> adapter/conformance demand
  -> Delethos support contribution
  -> more cross-agent combinations
  -> more verified runs
  -> more public examples/evidence
  -> more developers install Delethos
  -> more adapter contributors
```

This only works if adapter support is truthful and contribution friction is low.

## First-screen product experience

The README and demo should show real behavior before architecture prose.

Target launch demonstration, using only actually qualified adapters:

```text
$ npx delethos

Agents
✓ <implementer>
✓ <reviewer>

> Fix the flaky checkout test

Policy       safe
Implementer  <agent A>
Reviewer     <agent B>
Isolation    worktree

IMPLEMENT    done
GUARDS       184/184 passed
REVIEW       PASS
EVIDENCE     VERIFIED

2 files changed
Review the patch?
```

The demo must be reproducible from a checked-in fixture or public sample repository. It cannot be a hand-edited video that implies reliability the product has not earned.

## Launch assets

Before a category launch, Delethos should have:

- a world-class README with a short real terminal recording;
- a one-command install/first-run path;
- documentation site or high-quality repository docs;
- a public adapter compatibility matrix generated from qualified evidence;
- at least one reproducible end-to-end example;
- evidence bundle viewer/summary that communicates proof clearly;
- security and contribution entry points;
- a benchmark/validation methodology if comparative claims are used;
- concise architecture diagram;
- changelog/release notes;
- issue templates and community contribution path;
- clear statement of what Delethos does **not** prove.

## Launch narrative

Potential title:

> **We made coding agents review each other — and kept the proof.**

Supporting narrative:

1. Developers already have several coding agents.
2. Manual handoff is fragile and provider subagents are not neutral.
3. Self-review is useful but not independent review.
4. A green agent summary is not repository proof.
5. Delethos coordinates distinct agents around Git truth and produces a verifiable evidence bundle.

Avoid generic "AI swarm" language unless a future feature genuinely needs it.

## Distribution surfaces

Planned channels, only after the core is reproducible:

- GitHub launch;
- Hacker News with a technical post and reproducible demo;
- X/LinkedIn terminal video/result card;
- relevant coding-agent communities;
- Reddit communities where self-promotion rules permit it;
- official/third-party agent plugin/skill marketplaces where accepted;
- Product Hunt only if the product UX is polished enough to convert attention;
- conference/blog/podcast demonstrations grounded in real evidence;
- adapter maintainers and provider communities through conformance contributions.

## Shareable artifact loop

A verified run may eventually render a privacy-minimized shareable card:

```text
DELETHOS VERIFIED
Implemented   <agent>
Reviewed      <independent agent>
Guards        7/7 passed
Patch         sha256:<digest>
Limitations   0 blocking
```

The card must be generated from the evidence bundle. It must not expose source code, prompts, secrets, private repository names, or provider data by default.

The card is a growth surface because useful proof is worth sharing; it is not a substitute for the underlying evidence.

## Community flywheel

### Adapter SDK

Make a new adapter contribution feel bounded:

```text
create adapter
  -> fill capability mapping
  -> run conformance fixtures
  -> publish qualification matrix
  -> maintainer review
```

A future scaffolder may reduce setup further, but the conformance contract must exist first.

### Contributor recognition

Public adapter pages may credit maintainers and show exact qualification status. Recognition should reward maintenance and reproducibility, not raw PR count.

### Good-first contributions

Reserve bounded contribution surfaces such as:

- adapter fixture additions;
- platform qualification;
- docs/quickstart improvements;
- failure reproduction fixtures;
- evidence viewer accessibility;
- example repositories;
- translation only when product strings/docs are stable enough to maintain.

## Benchmark/content engine

`Delethos Bench` can become an ongoing technical content surface, but it must resist leaderboard theater.

Useful dimensions include:

- task completion;
- scope accuracy;
- guard outcome;
- independent reviewer defect detection;
- repair success;
- stall/timeout behavior;
- latency;
- platform reliability.

Publish failures and limitations. Separate provider/model capability from Delethos routing quality.

Content examples:

- "Codex and Claude reviewing each other on the same fixture";
- "What a stalled coding-agent run looks like versus a timeout";
- "Why worktrees are not sandboxes";
- "What `Delethos Verified` actually means";
- "How adapter conformance prevents fake feature parity".

## Growth milestones

These are strategic observations, not gates.

### 0 -> 1k stars

Earn initial trust through:

- real product wedge;
- excellent README/demo;
- two genuinely independent gold adapters;
- reliable end-to-end safe workflow;
- transparent evidence.

### 1k -> 10k

Expand through:

- more qualified adapters;
- marketplace packaging;
- public examples;
- contributor-friendly adapter SDK;
- technical launch content;
- fast issue response.

### 10k -> 50k

Expand the standard surface:

- GitHub checks/evidence summaries;
- portable verifier;
- conformance registry;
- public benchmark methodology;
- community extensions;
- stable releases and migration guarantees.

### 50k -> 100k+

The project must become useful beyond its own CLI:

- `delethos.evidence.*` becomes a neutral artifact others can produce/consume;
- coding-agent vendors or third-party tools can implement the adapter/evidence contracts;
- Delethos becomes infrastructure vocabulary, not merely a popular repository.

No milestone is promised. The product earns adoption through utility and trust.

## Repo-of-the-month readiness

A strong launch window should not begin until:

- install -> first useful run is short and reproducible;
- demo reliability is measured;
- README first screen communicates the wedge immediately;
- launch adapters are actually qualified;
- no known critical security/recovery flaw is hidden;
- the project can handle an influx of issues/PRs;
- contributor docs and issue templates are ready;
- release artifacts are easy to install;
- launch claims are backed by the exact release being promoted.

Do not launch a half-working category promise merely to hit a calendar date.

## Metrics

### Product/quality

- time to first useful run;
- successful verified-run rate;
- first-pass verification rate;
- repair success rate;
- orphan process rate;
- adapter conformance rate;
- evidence-verifier reproducibility;
- support-claim defect rate;
- cross-platform parity.

### Adoption

- stars/forks/watchers;
- repeat contributors;
- adapter contributions;
- independent reproductions;
- marketplace installs where visible;
- documentation/example usage;
- external technical references;
- issue response/close quality.

### Guardrail

No adoption metric can:

- mark a failed engineering gate as PASS;
- justify a fake benchmark;
- justify hidden telemetry;
- justify unsupported vendor endorsement;
- weaken review/evidence semantics;
- authorize scope outside the active specification.

## Brand discipline

Brand name: **Delethos**  
Preferred pronunciation: **DEL-eth-os**  
Tagline: **Delegate code. Demand proof.**

The name should be treated as a coined brand, not marketed with an unverified linguistic/Greek etymology.

Visual direction should avoid generic AI gradients/robots/brains. Favor a premium developer-tool identity based on routing nodes converging into a verified artifact. Visual design work is deferred until a later authorized launch/UI specification.
