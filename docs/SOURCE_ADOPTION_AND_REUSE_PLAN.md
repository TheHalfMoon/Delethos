# Delethos Selective Source Adoption & Reuse Plan

**Status:** program-level planning refinement; non-authoritative for implementation  
**Canonical parent plan:** `docs/EXECUTION_MASTER_PLAN.md`  
**Active authority remains:** `specs/CURRENT.md` and the specification named there  
**Founder authorization:** `docs/research/FOUNDER_SOURCE_USE_AUTHORIZATION_2026-09-08.md`  
**Source matrix:** `docs/research/SOURCE_ADOPTION_MATRIX_2026-09-08.md`

## Purpose

Delethos has access to useful source implementations across coding-agent delegation, harness/runtime infrastructure, security scanning, evaluation, skill packaging, workflow orchestration, and developer UX.

The project should use that advantage aggressively **without becoming an incoherent fork collection**.

The governing strategy is:

> **Copy proven behavior when it reduces risk; keep Delethos truth and contracts native.**

This plan defines how future specifications should turn donor/source permission into maintainable Delethos code.

## Strategic outcome

The desired architecture is not:

```text
Delethos = delegate-skills + harness + swarm + scanner + benchmark + UI
```

It is:

```text
source-qualified primitives / fixtures / algorithms
                 |
                 v
      Delethos adaptation boundary
                 |
                 v
  deterministic Delethos contracts
                 |
                 v
conformance + security + provenance
                 |
                 v
         proof-carrying behavior
```

A copied implementation becomes Delethos behavior only after it is rebound to Delethos's authority, state, evidence, and verification contracts.

---

# 1. Source Adoption Pipeline

Every material reuse candidate should move through these bounded stages:

```text
SOURCE_DISCOVERED
  -> SOURCE_SNAPSHOTTED
  -> RIGHTS_RECORDED
  -> UNIT_SELECTED
  -> DEPENDENCY_CLOSURE_ANALYZED
  -> SECURITY_REVIEWED
  -> ADOPTION_MODE_SELECTED
  -> SPEC_AUTHORIZED
  -> IMPORTED_OR_ADAPTED
  -> SOURCE_DERIVED_TESTS_BOUND
  -> DELETHOS_CONFORMANCE_PASSED
  -> NOTICE_PROVENANCE_VERIFIED
  -> UPSTREAM_POLICY_RECORDED
  -> ADOPTED
```

Failure/exit states remain explicit:

```text
REJECTED
DEFERRED
RIGHTS_UNRESOLVED
DEPENDENCY_TOO_LARGE
SECURITY_REJECTED
PORTABILITY_REJECTED
SUPERSEDED
```

The pipeline itself is program intent until a future active specification implements machine-readable support.

---

# 2. Mandatory Source BOM

Before the first substantial copied-code adoption reaches a stable release, Delethos should have a machine-readable **Source BOM** separate from the package-manager SBOM.

Candidate record:

```json
{
  "schema": "delethos.source-adoption.v1",
  "id": "source-unit-id",
  "source": {
    "repository": "owner/repo",
    "commit": "<exact-sha>",
    "paths": ["path/to/source.ts"],
    "license": "MIT",
    "licenseEvidence": "<source-ref>",
    "authorization": "docs/research/FOUNDER_SOURCE_USE_AUTHORIZATION_2026-09-08.md"
  },
  "adoption": {
    "mode": "ADAPTED",
    "localPaths": ["packages/..."],
    "specification": "specs/...",
    "task": "...",
    "modifications": "bounded summary"
  },
  "verification": {
    "sourceDerivedTests": [],
    "delethosConformance": [],
    "securityChecks": []
  },
  "upstream": {
    "policy": "SECURITY_ONLY_RECONCILE",
    "lastReviewedCommit": "<sha>"
  }
}
```

The final schema must be shaped by its owning active specification.

## Source BOM is not dependency SBOM

A dependency SBOM answers what packaged dependencies are present. The Source BOM additionally answers:

- what code was copied rather than installed as a dependency;
- which exact upstream revision/path it came from;
- how it was modified;
- which tests bind its retained behavior;
- what notice/authorization evidence applies;
- whether Delethos intentionally diverges from upstream.

Both are useful and neither replaces the other.

---

# 3. Notice and Attribution Gate

When copied code requires attribution or notice retention, Delethos should fail a release/conformance gate if the Source BOM and notice surface disagree.

Candidate future surfaces:

```text
THIRD_PARTY_NOTICES.md
.delethos/sources.json
scripts/verify-source-provenance.mjs
scripts/verify-third-party-notices.mjs
```

These paths are placeholders, not current implementation authority.

A future gate should verify at minimum:

1. every material copied unit has a Source BOM record;
2. every required source notice is retained;
3. referenced local paths exist;
4. source revision/path references are bounded;
5. the adoption mode is valid;
6. refactors/moves do not silently lose attribution;
7. release packaging includes required notices.

---

# 4. Copy-by-Value Rule

Prefer the smallest coherent source unit that materially improves Delethos.

```text
fixture/test case
  > pure helper
  > small algorithm/parser
  > isolated contract/schema
  > dependency-light module
  > package
  > subsystem
  > framework
```

Moving down this list requires stronger justification. A full subsystem/framework should be copied only when measured integration/maintenance cost is lower than extracting the necessary primitive and when it does not redefine Delethos's core product boundary.

---

# 5. Source-Derived Tests Travel with Behavior

Code reuse without semantic tests creates invisible debt.

For every copied/adapted unit, future implementation specs should require one or more of:

- donor tests copied verbatim where applicable;
- donor tests translated to the Delethos stack;
- source-derived fixtures reproducing observed edge cases;
- mutation/falsifiability checks for critical guards;
- cross-platform cases for platform-sensitive behavior;
- negative cases proving removed donor assumptions stay removed.

A donor test does not automatically prove Delethos behavior. It must run against the local adapted implementation and be supplemented by Delethos contract/security tests when the local boundary is stronger or different.

---

# 6. Donor Assumption Stripping

Every imported unit should be checked for hidden assumptions including:

```text
telemetry
cloud endpoints
home-directory state
ambient config
ambient credentials
default network access
shell invocation
platform-specific shims
implicit package managers
hooks/plugins auto-discovery
provider defaults
unbounded retries
background processes
process detachment
automatic updates
implicit persistence
hidden logging/transcript retention
branding/product-specific paths
```

A source-use permission does not authorize hidden behavior.

Future adoption evidence should state which donor assumptions were retained, removed, or made explicit.

---

# 7. Upstream Drift Policy

Each adopted unit must declare one maintenance policy:

- `PINNED_NO_SYNC` — intentionally frozen;
- `SECURITY_ONLY_RECONCILE` — review only relevant security/correctness fixes;
- `PERIODIC_RECONCILE` — review upstream at a bounded cadence/release boundary;
- `TRACK_UPSTREAM` — maintain close semantic parity because an unstable external protocol requires it;
- `FORKED_INTENTIONALLY` — Delethos now owns the behavior and upstream is historical provenance only.

The default for most reusable primitives should be `SECURITY_ONLY_RECONCILE` or `FORKED_INTENTIONALLY`, not perpetual synchronization.

---

# 8. Capability Truth Model

Future ecosystem routing needs more precision than one availability/support boolean.

Candidate facts:

```text
REGISTERED
DISCOVERED
CONFIGURED
REACHABLE
HEALTHY
AUTHORIZED
QUALIFIED
```

These are separate observations, not a linear promise that every integration must reach every state.

Examples:

- a CLI can be `DISCOVERED` but not `AUTHORIZED` for the requested policy;
- a Skill can be `REGISTERED` but not security-admitted;
- an MCP server can be `REACHABLE` but fail health/conformance;
- an adapter can be qualified on Linux while unverified on Windows;
- a requested provider/model does not become an observed provider/model.

The registry may aggregate evidence but cannot become narrative authority. Every claimed state must point to the observation/policy that supports it.

---

# 9. Canonical Source + Generated Harness Packaging

Multi-harness skills/plugins should have one Delethos-owned canonical definition.

```text
canonical source
  -> schema validation
  -> harness adapter
      -> Claude package
      -> Codex package
      -> Cursor package
      -> OpenCode package
      -> other qualified harness package
  -> generated-surface drift check
```

This avoids safety/capability drift across hand-edited copies. Generated files are outputs of the canonical source, not independent truth.

Source inspiration includes `wshobson/agents`, `anthropics/skills`, `vercel-labs/skills`, `delegate-skills`, and `obra/superpowers`.

---

# 10. Durable Job Model

Review, repair, guard, security, benchmark, and artifact operations need a first-class job abstraction distinct from one agent session/transcript.

Candidate fields:

```text
jobId
jobKind
ownerRunId
attempt
startedAt observation
terminalState
cancel/timeout/stall state
bounded output cursor
artifact references
producer identity
input digest
output/result digest
```

Candidate kinds:

```text
IMPLEMENTATION
REVIEW
REPAIR
GUARD
SECURITY_SCAN
CONTENT_SCAN
BENCHMARK_CASE
ARTIFACT_RENDER
```

A job can outlive one model response, stream output incrementally, stall/cancel independently, preserve partial evidence, and produce multiple artifacts. Deterministic core state owns the job lifecycle even when an external agent/tool performs the work.

DeepSeek Harness is a strong implementation reference for this primitive; Delethos should adapt the useful bounded behavior rather than adopt the entire harness.

---

# 11. Event Ledger and Projection Boundary

Delethos already plans an append-oriented evidence timeline. Future work should make the event/projection separation explicit:

```text
commands/actions
  -> validated deterministic transition
  -> append-oriented event
  -> durable run/job state
  -> rebuildable projections
       TUI
       CLI summary
       GitHub check
       evidence card
       routing history
```

A projection can be rebuilt or replaced. It cannot retroactively redefine event/evidence truth.

Benefits include crash recovery, debuggability, reproducible UI state, clearer integrations, and less stale-memory confusion. DeepSeek Harness and Munder Difflin reinforce this direction from different product angles.

---

# 12. Skill / Plugin / MCP Admission Pipeline

Discovery is not activation.

```text
source discovered
  -> source identity pinned
  -> manifest parsed without execution
  -> content types observed
  -> provenance/license checked
  -> requested permissions/capabilities extracted
  -> deterministic pre-scan
  -> optional probabilistic advisory scan
  -> user/policy decision
  -> installation
  -> qualified activation
```

Untrusted Skill/MCP/plugin code must not execute merely to discover metadata.

Future threat fixtures should include instruction hijacking, memory poisoning, remote payload execution, malicious embedded scripts, privilege escalation, persistence, tool spoofing, insecure dependencies, command injection, hardcoded secrets, unsafe temporary files, charset/bytecode smuggling, credential exfiltration, and malicious tool metadata.

AI-Infra-Guard is a major source for this taxonomy/fixture work.

---

# 13. Content Observation Provider Contract

Do not couple Delethos policy directly to Magika or another detector. Shape a provider-neutral contract first.

```text
contentObservation = {
  detectorId,
  detectorVersion,
  inputDigest,
  predictedType,
  acceptedType,
  confidence,
  confidenceClass,
  status,
  limitations
}
```

Candidate statuses:

```text
SPECIFIC
GENERIC
UNKNOWN
UNAVAILABLE
FAILED
```

Low confidence should yield generic/unknown rather than fabricated precision. Magika is the leading optional provider candidate because its threshold/abstention behavior already fits this direction.

---

# 14. Security Finding Strength Model

Security outputs from different mechanisms must not be flattened.

Candidate evidence-strength classes:

```text
DETERMINISTIC_STATIC
DETERMINISTIC_DYNAMIC
REPRODUCED_EXPLOIT
PROBABILISTIC_ADVISORY
EXTERNAL_ATTESTATION
```

A normalized finding should preserve finding/rule ID, severity, affected path/range, producer/version/model, configuration digest, evidence strength, reproduction artifact, status, and limitations.

SARIF can be an interoperability layer, but Delethos's evidence model owns proof semantics. An LLM/security scanner cannot self-certify a PASS.

---

# 15. Security Benchmark Adoption

AICGSecEval provides a useful starting shape for security benchmark tasks. Future Delethos cases should bind:

```text
upstream repository
vulnerable base revision
expected patch/security property
CWE/vulnerability class
functional test
security test
PoC/reproduction command
isolated image/environment
agent/adapter configuration
raw outcome
score derivation
```

PoCs and intentionally vulnerable code must run only in a specification-authorized disposable environment with bounded network/filesystem/credential exposure. Framework permission does not automatically establish redistribution rights for every embedded dataset, repository snapshot, container image, or model artifact.

---

# 16. Visual Proof Freshness

Public screenshots/evidence cards should become reproducible artifacts rather than manually refreshed marketing images.

Future gates should bind:

```text
example source
canonical revision
render command
render environment
image dimensions
artifact digest
README/docs reference
```

When the authoritative example changes, stale screenshots should fail a freshness check. Diagram Design and Archify provide strong practical references for real-output verification.

---

# 17. Spec-by-Spec Integration

This section refines program intent only. It does not activate any specification.

## Specification 003 — current Gold adapters

**No scope expansion from this plan.**

Potential reuse requires current active authority or a separate canonical Spec 003 amendment and may include only evidence-selected items such as source-derived conformance fixtures or narrow parser/protocol logic from qualified upstream sources.

The current R181/provider/Gold frontier remains unchanged.

## Specification 004 — Independent review + repair

Shape durable `REVIEW`/`REPAIR` jobs, append-oriented review events, bounded reviewer artifacts/output, Superpowers-derived review pressure tests, exact patch-digest rebinding after repair, and distinct reviewer execution provenance.

## Specification 005 — Guards + proof bundle

Shape a generic `GUARD` job contract, Source BOM/provenance verification, content observations, normalized security findings, security evidence-strength classes, source-derived test provenance, and notice/SBOM consistency checks.

## Specification 006 — First-class UX

Shape event/projection TUI architecture, capability-state rendering, bounded live job output, explicit unknown/unavailable/unqualified states, reproducible evidence cards, and low-friction onboarding without remote execution-by-discovery.

## Specification 007 — Routing + durable decisions

Shape a capability registry with separate discovered/configured/reachable/healthy/authorized/qualified facts, event-derived routing history, durable decisions separated from live repository/projection state, and only evidence-justified declarative workflow conveniences.

## Specification 008 — Adapter expansion

Use delegate-skills and upstream CLI sources as compatibility corpora; prefer canonical definitions plus generated harness/package surfaces; add source-derived fixtures, registry drift checks, and cross-platform verification manifests.

## Specification 009 — Delethos Bench

Shape an AICGSecEval-inspired security task schema, rights/provenance at artifact granularity, exact base/patch/task identity, isolated functional/security execution, contamination notes, and a security track alongside reliability/review/routing evaluation.

## Specification 010 — Agent Skill

Shape one canonical Skill/plugin definition, deterministic harness generation, packaging fixtures from the qualified skill ecosystem, pre-activation security admission, and generated-output drift checks.

## Specification 011 — GitHub integration

Shape security-finding/SARIF bridges, evidence cards, event-derived check summaries, and source/provenance summaries where material copied code affects a patch.

## Specification 012 — Ecosystem registry

Shape signed artifact/manifest provenance, source records for community extensions, capability states, generated harness surfaces, registry drift/conformance gates, install-not-activation semantics, and adapter/Skill/MCP security status.

## Specification 013 — Stable v1 hardening

Shape copied-code/source audits, notice verification, upstream security reconciliation, signed registry policy, provider-integrity tests where evidence permits, adversarial supply-chain tests, dependency-closure checks, and install-script hardening.

## Specification 014 — Category launch

Shape visual artifact freshness, independent source/provenance audit instructions, reproducible security benchmark examples, public source-reuse transparency, and launch claims bound to canonical examples/evidence.

---

# 18. Adoption Decision Gate

A future implementation unit proposing copied/adapted code should answer before edit:

```text
1. What exact problem does this source unit solve?
2. Why copy/adapt instead of writing a smaller Delethos-native unit?
3. What is the exact source repository, commit, and path?
4. What permission/license/notice basis applies?
5. What is the dependency closure?
6. What hidden donor assumptions were found?
7. What local Delethos contract owns the behavior?
8. What donor/source tests or fixtures travel with it?
9. What Delethos tests make the behavior falsifiable?
10. What security review applies?
11. What platforms are affected?
12. How will provenance be machine-recorded?
13. What upstream-drift policy applies?
14. What is the maintenance owner/cost?
15. What is explicitly not being copied?
```

If these cannot be answered, the adoption unit is not ready.

---

# 19. Highest-Priority Improvements Found

The full source study adds these priorities to the existing program:

1. Source BOM + notice gate before substantial copied-code adoption.
2. Source-derived conformance corpus for coding-agent CLI edge cases.
3. Durable jobs for review/repair/guard/security work.
4. Append-oriented event ledger + rebuildable projections.
5. Capability-state registry separating discovery, health, authority, and qualification.
6. One canonical Skill/plugin source + generated harness adapters.
7. Skill/plugin/MCP security admission before activation.
8. Content observation with confidence/abstention.
9. Security evidence-strength separation and SARIF bridge.
10. Repository-level security benchmark with contained dynamic evidence.
11. Signed ecosystem artifact provenance.
12. Visual/public artifact freshness verification.
13. Explicit upstream drift ownership for every copied unit.
14. Donor-assumption stripping and dependency-closure checks.
15. Pressure-tested verification/review methodology translated into deterministic policy/conformance tests.

These strengthen the existing verified-delegation wedge rather than creating a second product.

---

# 20. What Not to Build

Even with broad reuse permission, Delethos should not become:

- a donor-source mirror;
- a generic swarm platform;
- an Electron-first virtual office;
- a mandatory cloud orchestration service;
- a generic malware/vulnerability-management suite;
- an LLM-security-opinion product;
- an IPFS-dependent marketplace;
- a generic workflow DSL before the verified delegation loop is excellent;
- a fork of Codex/OpenCode/Pi/DeepSeek Harness;
- a repository of huge copied subsystems with no Source BOM, tests, or owner.

---

# 21. Completion Condition for This Planning Refinement

This refinement is complete when canonical repository truth contains:

1. the Founder source-use authorization record;
2. the source adoption matrix;
3. this selective source adoption plan;
4. parent-plan/roadmap links making it discoverable;
5. no change to active Specification 003 execution authority;
6. a qualified documentation-only merge and appropriate post-merge CI.

Future code adoption remains separately authorized work.
