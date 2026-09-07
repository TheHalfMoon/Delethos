# Founder Source-Use Authorization — 2026-09-08

**Status:** founder decision record; planning authority only unless a later active specification authorizes implementation  
**Canonical base when recorded:** `340f25358e88044960960fd9ab0468f0b826458b`  
**Purpose:** preserve the Founder-provided source-use authorization that materially changes Delethos's future implementation options without weakening repository governance, provenance, or verification rules.

## Founder decision

The Founder states that Delethos has permission to copy, adapt, modify, merge, and otherwise reuse source code from the source repositories already recorded in Delethos's canonical research/specification surfaces, including the additional sources qualified on 2026-09-08.

This decision means future Delethos specifications may consider **direct code adoption** where it is technically superior to clean-room reimplementation.

It is not necessary to avoid code reuse merely because an idea originated in a donor repository when all of the following are true:

1. the source is within the Founder-authorized source set;
2. the exact source revision and path are recorded;
3. public license/notice obligations and any additional permission terms are preserved;
4. the active Delethos specification explicitly authorizes the local destination and behavior;
5. the imported unit passes Delethos security, portability, dependency, and conformance gates;
6. the imported behavior is rebound to Delethos's own contracts and evidence semantics.

## Important boundary

This record preserves a **Founder-provided authorization statement**. It is not an independent legal verification of third-party ownership, contributor agreements, patent rights, trademark rights, dataset rights, model-weight rights, or every transitive dependency.

Accordingly:

- public license obligations remain applicable;
- copyright/license notices required by the source remain preserved;
- source/data/model/container components with separate terms remain separately qualified;
- unavailable or proprietary implementation code does not become available merely because an integration or service is referenced by Delethos;
- vendor terms for installed external CLIs remain separate from permission to reuse source code that is actually available and authorized;
- contributor provenance remains material when copying substantial code.

## Authorization is not implementation authority

This decision does **not** change `specs/CURRENT.md`.

It does not activate a future specification, expand Specification 003's current allowed implementation surface, authorize a dependency, consume a provider attempt, alter a Gold qualification rule, or permit an implementation PR to cross an active specification boundary.

The authority chain remains:

```text
Founder source-use authorization
  -> source qualification
  -> future specification shaping
  -> explicit active-spec implementation authority
  -> exact-path implementation
  -> deterministic tests / security checks
  -> required review
  -> merge qualification
  -> post-merge verification
```

## Source classes covered by the decision

The authorization applies to source repositories already recorded in canonical Delethos research/specification documents where actual source code is available and the Founder states permission exists.

Current examples include:

### Delegation, harness, workflow, and skill ecosystem references

- `amElnagdy/delegate-skills`
- `chaitanyagiri/munder-difflin`
- `obra/superpowers`
- `anthropics/skills`
- `vercel-labs/skills`
- `deepseek-ai/deepseek-harness`
- `ruvnet/ruflo`
- `wshobson/agents`
- `nrslib/takt`
- `cathrynlavery/diagram-design`
- `tt-a1i/archify`

### Security, content, and evaluation references

- `google/magika`
- `Tencent/AI-Infra-Guard`
- `Tencent/AICGSecEval`

### Runtime/provider/conformance source references already used by Specification 003 research and amendments

- `openai/codex`
- `earendil-works/pi`
- `anomalyco/opencode`
- `ggml-org/llama.cpp`

### Internal methodological references

- `TheHalfMoon/SpecGrain`
- `TheHalfMoon/Diffcipline`

This list is a durable planning inventory, not a blanket assertion that every file, dependency, asset, model, dataset, container, brand, or embedded third-party component inside those repositories has identical rights.

## Mandatory provenance for copied code

Every material copied/adapted unit must eventually retain enough metadata to answer:

```text
source repository
source commit/tag
source path(s)
source license/notice basis
Founder authorization record
local destination
copy mode: verbatim | adapted | translated | fixture-derived | schema-derived
material modifications
Delethos specification/task authority
behavioral tests binding the adopted semantics
security review result
upstream drift owner/policy
```

A future stable implementation should make this machine-readable rather than relying only on comments.

## Copy modes

The following vocabulary should be used in future source-adoption records:

- `VERBATIM` — substantial source copied without semantic rewrite;
- `ADAPTED` — source structure/logic retained but modified for Delethos contracts;
- `TRANSLATED` — implementation ported between languages/runtimes while preserving behavior;
- `FIXTURE_DERIVED` — source behavior converted into tests/fixtures rather than runtime code;
- `SCHEMA_DERIVED` — data/contract shape adapted from source material;
- `ALGORITHM_DERIVED` — algorithmic approach reused with a new implementation;
- `REFERENCE_ONLY` — source informs design but no material source code is copied.

## Non-negotiable reuse rules

Founder permission does not weaken these rules:

1. **Copy by value, not by volume.** Import the smallest coherent unit that improves Delethos.
2. **Delethos contracts remain authoritative.** Donor state machines, capability claims, telemetry, security posture, or provider assumptions do not silently become Delethos truth.
3. **No hidden dependency import.** A copied file that relies on a donor framework/dependency graph must either have that dependency explicitly authorized or be adapted to the existing Delethos stack.
4. **No copied capability claim without qualification.** Donor behavior becomes `UNVERIFIED` until Delethos observes it under its own tests.
5. **No copied security claim without Delethos evidence.** A donor scanner result or sandbox statement cannot self-certify the adopted code.
6. **Preserve notices.** Required copyright/license notices follow substantial copied code.
7. **Track drift.** A copied implementation must have an explicit stance: pin forever, periodically reconcile, or intentionally diverge.
8. **Tests travel with behavior.** Prefer importing or translating donor tests/fixtures together with runtime logic where they materially define semantics.
9. **Delete donor-specific branding and assumptions only when legally/technically appropriate, never to erase provenance.**
10. **Do not copy a framework merely because permission exists.** Reuse must reduce implementation risk, maintenance cost, or time-to-proof.

## Relationship to open provenance

This decision strengthens rather than replaces Constitution Principle XVI — Open provenance.

The strategic benefit of broad source-use permission is not that Delethos can hide where code came from. The benefit is that Delethos can select proven primitives more aggressively while preserving an auditable chain from upstream source to Delethos behavior.
