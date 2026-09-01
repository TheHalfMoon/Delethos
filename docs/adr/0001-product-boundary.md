# ADR 0001 — Product Boundary and Default Human Authority

**Status:** Proposed under Specification 000  
**Date:** 2026-09-01

## Context

Delethos coordinates coding agents that can modify repositories and potentially invoke powerful developer tooling. A broad "autonomous agent manager" boundary would make it easy to conflate implementation authority with commit, merge, publish, release, or external side-effect authority.

The founding product needs a narrow trustable wedge.

## Decision

Delethos is a **local-first verified-delegation control plane**. Its default completed artifact is a candidate patch/change plus evidence for a human to accept, reject, or continue.

By default Delethos does not silently:

- commit;
- merge;
- publish/release;
- mutate external services;
- expand privileges;
- weaken repository policy.

Future repository-configured automation may be added only through a separate specification that defines explicit opt-in authority, policy boundaries, evidence, recovery, and audit behavior.

The open local core must remain usable without a mandatory hosted Delethos service.

## Consequences

Positive:

- simple, defensible authority boundary;
- easier recovery and audit;
- compatible with many repositories and coding-agent vendors;
- avoids making Delethos a hidden repository governor before trust is earned.

Costs:

- less "fully autonomous" marketing appeal initially;
- some workflows retain a final human action;
- later automation needs explicit design rather than being assumed.

## Alternatives rejected

### Automatic commit/merge by default

Rejected because it couples delegated implementation with repository authority before proof, review, and policy semantics are mature.

### Hosted control plane as canonical truth

Rejected because it would weaken local-first portability and make open evidence dependent on service availability.

### IDE/desktop application as primary product boundary

Rejected for founding scope because it adds product surface before the verified delegation loop is proven.

## Compatibility rule

Any future feature that makes automatic repository/external mutation the default requires revisiting this ADR and the constitution's authority principles.
