# Current Execution State

**Repository:** `TheHalfMoon/Delethos`  
**Canonical branch:** `main`  
**Canonical bootstrap commit:** `3fab6947ab4b29ded821ec75e775119c270c7eac`  
**Canonical bootstrap state:** `FOUNDING_BOOTSTRAP`  
**Founding candidate branch:** `docs/founding-plan`  
**Candidate active specification after canonical merge:** `000-founding-governance`  
**Product runtime implementation:** not authorized

Live GitHub/repository truth overrides this file.

## Current authority

Canonical `main` currently contains only the bootstrap README. It does **not** yet canonically contain the founding constitution, architecture, evidence contract, adapter contract, security model, or Specification 000 authority.

This branch proposes those surfaces. They become canonical only if the exact founding candidate is reviewed/reconciled, merged, and canonical `main` is re-read successfully.

## Candidate post-merge state

If the founding candidate becomes canonical without material scope drift:

```text
PROGRAM_STATUS = SPEC_000_FOUNDING_GOVERNANCE_ACTIVE
ACTIVE_SPEC = specs/000-founding-governance/spec.md
PRODUCT_IMPLEMENTATION_AUTHORITY = NONE
NEXT_ALLOWED_WORK = SPEC_000_TASK_ORDER_ONLY
```

Specification 000 authorizes governance/planning/research/contract/security/contribution surfaces only. It does not authorize runtime packages, adapter implementation, CLI/TUI implementation, dependency installation, release publication, hosted services, benchmark execution, or vendor capability claims beyond recorded founding research.

## Founding candidate acceptance gate

Before treating Specification 000 as canonical active authority:

1. exact PR base is canonical `main` at the expected bootstrap lineage;
2. exact PR head and changed-path set are rechecked;
3. candidate content remains documentation/governance/planning only except the standard license and GitHub contribution templates explicitly named by Specification 000;
4. no product runtime code, package manager files, dependencies, releases, tags, benchmark results, or adapter support claims appear;
5. submitted reviews, review threads, substantive comments, and mergeability are reconciled;
6. unavailable/skipped review systems are recorded as unavailable/skipped, never PASS;
7. merge uses expected-head protection where the available GitHub surface supports it;
8. canonical `main` is re-read after merge;
9. the merged constitution, `AGENTS.md`, master plan, Specification 000, and current frontier agree on authority.

No CI status is invented for this currently documentation-only bootstrap. A later founding task may add deterministic repository-governance validation, but that is not present until machine-observed in canonical truth.

## Explicit non-authority

This founding candidate does not authorize:

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

If this candidate merges cleanly, continue Specification 000 in its task order. Close Specification 000 only after every founding acceptance criterion is machine-observed against canonical repository truth. Then shape Specification 001 from the canonical contracts and fresh implementation research; do not start runtime implementation from roadmap text alone.
