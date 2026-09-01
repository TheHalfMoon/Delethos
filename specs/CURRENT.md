# Current Execution State

**Repository:** `TheHalfMoon/Delethos`  
**Canonical branch:** `main`  
**Founding bootstrap commit:** `3fab6947ab4b29ded821ec75e775119c270c7eac`  
**State represented by this file when canonical:** `SPEC_000_FOUNDING_GOVERNANCE_ACTIVE`  
**Active specification when canonical:** `specs/000-founding-governance/spec.md`  
**Product runtime implementation:** not authorized

Live GitHub/repository truth overrides this file.

## Effectivity rule

This file is authoritative only when read from canonical `main` at the current canonical revision.

- Before the founding authority chain is merged, canonical `main` remains the bootstrap state and this file is only a candidate.
- Once this exact authority chain is canonical, Specification 000 is active under the conditions below.
- If later canonical work supersedes this frontier, the newer canonical authority controls even if an old checkout still contains this text.

## Active founding authority

When canonical, Specification 000 authorizes governance/planning/research/contract/security/contribution surfaces only. It does not authorize runtime packages, adapter implementation, CLI/TUI implementation, dependency installation, release publication, hosted services, benchmark execution, or vendor capability claims beyond recorded founding research.

```text
PROGRAM_STATUS = SPEC_000_FOUNDING_GOVERNANCE_ACTIVE
ACTIVE_SPEC = specs/000-founding-governance/spec.md
PRODUCT_IMPLEMENTATION_AUTHORITY = NONE
NEXT_ALLOWED_WORK = SPEC_000_TASK_ORDER_ONLY
```

## Founding activation gate

Before treating this state as canonical active authority, verify:

1. the founding authority chain itself is present on canonical `main`;
2. its merge lineage includes the intended founding candidate without material scope drift;
3. the changed-path set is limited to Specification 000's authorized founding surface;
4. no product runtime code, package manager files, dependencies, releases, tags, benchmark results, or adapter support claims entered through the founding activation;
5. reviews, review threads, substantive comments, and mergeability were reconciled on the exact qualified head;
6. unavailable/skipped review systems were recorded honestly rather than treated as PASS;
7. expected-head protection was used where the available GitHub surface supported it;
8. canonical `main` was re-read after merge;
9. the constitution, `AGENTS.md`, master plan, Specification 000, and this frontier agree on authority.

CI/check status must be reported from live machine-observed truth. The founding repository must not infer a green status from the absence of configured workflows.

## Explicit non-authority

Specification 000 does not authorize:

- product source code;
- a Node/TypeScript scaffold merely because the architecture prefers that direction;
- Codex, Claude Code, Cursor, OpenCode, Gemini, Copilot, or any other adapter implementation;
- automatic agent routing;
- automatic commits/merges;
- a cloud control plane;
- persistent telemetry;
- a public benchmark result;
- `Delethos Verified` badges on real changes;
- stable `delethos.*.v1` schema claims;
- release publication;
- claims of superiority, safety, speed, cost, or defect-detection advantage;
- successor specifications solely to maintain activity.

## Continuation

Complete Specification 000 in its canonical task order. Close it only after every founding acceptance criterion is machine-observed against canonical repository truth. Then shape Specification 001 from the canonical contracts and fresh implementation research; do not start runtime implementation from roadmap text alone.
