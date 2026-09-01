# ADR 0002 — Independent Review as a First-Class Policy Boundary

**Status:** Proposed under Specification 000  
**Date:** 2026-09-01

## Context

A core Delethos differentiator is that coding agents should not be the sole final reviewers of their own material changes when policy requires independent review. Treating review as a prompt convention would be too weak: the same execution identity could effectively self-approve while the UI claims independence.

## Decision

Independent review is a first-class policy and evidence condition.

When a compiled Delethos policy requires independent review:

1. the material implementer execution identity cannot be the sole final reviewer;
2. the reviewer must be represented by a distinct execution identity and retained provenance;
3. the exact candidate patch/digest reviewed must be bound in evidence;
4. a repaired patch invalidates an earlier PASS unless policy explicitly defines and proves an equivalent review path;
5. `ABSTAIN`, `UNAVAILABLE`, `FAILED`, or missing review cannot satisfy an independent-review requirement;
6. reviewer opinion remains distinct from deterministic repository guards.

The policy may allow the same underlying vendor family only if execution identity and the intended independence condition are explicit; stronger cross-vendor requirements may be configured later.

## Consequences

Positive:

- review independence is auditable rather than rhetorical;
- Delethos can explain why a patch is or is not eligible for VERIFIED;
- repair loops remain correctly bound to the current candidate;
- creates a durable category-level distinction from single-agent self-review.

Costs:

- additional latency and potential provider usage;
- reviewer availability becomes a real failure mode;
- not every user/task will want independent review, so policy must remain configurable.

## Alternatives rejected

### Always require two vendors

Rejected for founding scope because it would make vendor availability a core requirement and could exclude local/single-vendor environments. Cross-vendor review may be a policy profile, not the only core mode.

### Prompt the implementer to self-review

Useful as an implementation technique but rejected as satisfying independent review.

### Treat passing tests as review

Rejected because deterministic guards and independent semantic review provide different evidence.

## Policy implication

Convenience presets may compile to different review requirements. A future `safe` preset is expected to require independent review, while a `fast` preset may omit it for low-risk work if repository/user policy permits. The preset must compile to explicit machine-readable requirements; the word `safe` itself proves nothing.
