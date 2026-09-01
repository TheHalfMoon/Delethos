# Delethos Evidence Model

**Status:** founding candidate  
**Target:** candidate `delethos.evidence.v1` semantics; final schema requires a later product specification and tests.

## Purpose

Delethos should return more than a diff and more than an agent-written summary. A successful verified run should be able to produce a **proof-carrying patch**: the exact candidate change plus machine-readable evidence that describes the run, required checks, review condition, provenance, and unresolved limitations.

Evidence is not a certificate that code is universally correct. It is a bounded statement about which required conditions were actually observed for an exact candidate.

## Core distinction

Delethos must separate:

1. **Evidence integrity** — is this record well-formed and correctly bound to the referenced task/run/repository/diff/check outputs?
2. **Acceptance evidence** — did the required tests/guards/review conditions for this policy actually pass?
3. **Semantic correctness** — does the change satisfy the intended real-world outcome? Delethos can strengthen evidence for this claim but cannot prove arbitrary software correctness in general.

No layer may silently substitute for another.

## Candidate bundle layout

```text
.delethos/runs/<run-id>/
  manifest.json
  task.json
  policy.json
  events.ndjson
  patch.diff
  result.json
  guards.json
  review.json          # when review is required/attempted
  provenance.json
  evidence.json
  artifacts/           # bounded optional retained outputs
```

The exact persistent location and retention policy are not yet authorized. The important design is that a bundle can be exported without relying on a Delethos cloud service.

## Candidate manifest fields

A future `delethos.evidence.v1` is expected to bind at least:

```json
{
  "version": "delethos.evidence.v1",
  "runId": "...",
  "repository": {
    "identity": "...",
    "baseRevision": "...",
    "baseTree": "..."
  },
  "task": {
    "digest": "..."
  },
  "policy": {
    "digest": "..."
  },
  "change": {
    "patchDigest": "...",
    "changedPaths": []
  },
  "implementer": {
    "adapter": "...",
    "adapterVersion": "...",
    "cliVersion": "...",
    "executionId": "..."
  },
  "guards": [],
  "review": {},
  "status": "VERIFIED",
  "limitations": []
}
```

This is illustrative, not a frozen schema.

## Binding rules

A verifier should fail closed if required binding material is absent or contradictory.

Candidate bindings:

- task digest -> exact task snapshot used for dispatch;
- policy digest -> exact compiled policy;
- repository base -> exact revision/tree from which mutable execution began;
- patch digest -> exact normalized patch/candidate change;
- changed-path set -> observed paths from repository diff, not agent self-report;
- guard definitions -> exact command/check identity or deterministic rule revision;
- guard results -> exit/result plus retained evidence reference;
- review -> exact candidate change reviewed and reviewer execution identity;
- adapter/provider observations -> qualified version/capability facts where relevant.

## Evidence status model

Candidate status terms:

- `INCOMPLETE` — run ended before required evidence could be evaluated;
- `FAILED` — a required guard/policy condition failed;
- `CHANGES_REQUIRED` — independent review requires repair;
- `UNVERIFIED` — candidate exists but required proof is missing/unavailable;
- `VERIFIED` — all policy-required deterministic evidence and required review conditions passed for the exact candidate;
- `INVALID` — evidence structure/binding itself is malformed or inconsistent.

`UNAVAILABLE` or `NOT RUN` components cannot be promoted to PASS.

## Guard evidence

Each deterministic guard should retain enough information to understand:

- guard identifier/version;
- command or rule identity;
- working directory/scope where material;
- start/end observation;
- exit/result;
- bounded stdout/stderr/artifact references where safe;
- whether the guard is required or advisory;
- digest or immutable reference when result files matter.

The evidence format should avoid copying secrets or unlimited process logs into portable bundles.

## Review evidence

When independent review is required, evidence should capture:

- reviewer adapter/execution identity;
- reviewer posture/capability facts relevant to independence/read-only behavior;
- exact patch digest reviewed;
- bounded review findings;
- result: `PASS`, `CHANGES_REQUIRED`, `ABSTAIN`, `UNAVAILABLE`, or `FAILED`;
- whether repair occurred after the review;
- if repaired, a new review/verification must bind to the new patch digest as required by policy.

A review of an old patch cannot approve a later repaired patch without explicit policy and evidence.

## Provenance

Provenance should identify actions and observations without overclaiming person/model identity. The core should prefer stable execution IDs, adapter versions, CLI versions, selected model/provider values where actually observable, and repository revisions.

If a CLI does not expose a session ID, model ID, usage count, or cost, evidence records `null`/`UNAVAILABLE` rather than inventing values.

## Event stream

`events.ndjson` is intended as an append-oriented observable timeline, separate from final truth. Events may include:

```text
run.created
policy.compiled
worktree.created
adapter.started
adapter.output
repository.changed
adapter.stalled
adapter.completed
guard.started
guard.completed
review.started
review.completed
repair.started
evidence.verified
run.completed
```

Final state must be derived by deterministic rules; the existence of a `run.completed` event alone is not proof of `VERIFIED`.

## Hashing and normalization

Before a stable schema, Delethos must define canonical serialization/normalization for any object whose digest participates in proof. Platform-dependent path separators, line endings, timestamps, and map ordering must not accidentally create unverifiable evidence.

Timestamps may be included as observations but should not be the sole trust anchor for ordering or identity.

## Privacy and minimization

Portable evidence should default to metadata and bounded outputs necessary to reproduce the claim. It should avoid:

- raw secrets/environment variables;
- full private prompts unless explicitly requested;
- full provider transcripts by default;
- unrelated repository content;
- provider credentials/tokens;
- personal data not needed for verification.

## Proof-carrying patch UX

A human-facing summary may render:

```text
DELETHOS VERIFIED

Base          <commit>
Patch         sha256:<digest>
Implemented   <adapter/cli version>
Guards        7 required / 7 passed
Reviewed      independent reviewer PASS
Limitations   1 advisory note

This summary is a view over the evidence bundle, not an independent source of truth.
```

## Verification rule

`delethos verify <bundle>` should eventually be able to evaluate the portable evidence contract without invoking the original model/provider. It may need the repository or retained artifacts to reproduce stronger semantic checks, but schema/binding/required-evidence verification should remain local and deterministic.

## Non-goals

The evidence model does not claim to:

- cryptographically prove an agent's internal reasoning;
- prove absence of all malicious behavior;
- prove arbitrary software correctness;
- make model review equivalent to human review;
- certify a sandbox that was not independently enforced;
- replace repository CI or code-owner policy.
