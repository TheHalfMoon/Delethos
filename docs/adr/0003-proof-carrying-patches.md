# ADR 0003 — Proof-Carrying Patches as the Primary Verification Artifact

**Status:** Proposed under Specification 000  
**Date:** 2026-09-01

## Context

Agent orchestration tools commonly return a final message and leave the user to reconstruct what actually changed, which tests ran, whether the reviewer saw the final patch, or whether a failure left useful partial work. Delethos needs a portable artifact that preserves the exact evidence required to interpret a delegated change.

## Decision

Delethos will design toward **proof-carrying patches**: a candidate patch/change accompanied by a versioned evidence bundle bound to exact repository/run state.

The bundle should be locally verifiable and should not require a hosted Delethos service for core schema/binding verification.

The evidence model must distinguish:

- structural/evidence integrity;
- repository/task/policy/change binding;
- deterministic guard results;
- independent-review condition where required;
- final verified/unverified/failure state;
- residual limitations;
- semantic correctness, which remains broader than integrity alone.

A human-readable `Delethos Verified` summary is only a rendering of valid underlying evidence. The badge/phrase must not precede stable verifier semantics.

## Consequences

Positive:

- runs become auditable and shareable without copying full provider transcripts;
- failures can preserve partial changes and diagnostics;
- GitHub/CI integrations can consume a neutral evidence format;
- provider-specific execution can remain separate from portable verification;
- creates a potential de facto standard surface larger than the CLI itself.

Costs:

- canonical serialization, privacy, retention, and migration become real engineering concerns;
- evidence bundles can become noisy if not aggressively minimized;
- users may misunderstand evidence as a universal correctness certificate unless UX is precise.

## Alternatives rejected

### Final agent message as the artifact

Rejected because it is narrative, provider-specific, frequently missing on timeout/stall, and not independently bound to repository truth.

### Git diff only

Necessary but insufficient; a diff does not explain which policy/guards/review conditions were satisfied.

### Provider transcript as canonical evidence

Rejected because transcripts can contain sensitive data, proprietary formats, hidden reasoning, or provider-specific noise and may not exist uniformly.

## Compatibility rule

Stable evidence versions require explicit migration/compatibility policy. Future schema versions must not silently reinterpret an old `VERIFIED` state under weaker requirements.
