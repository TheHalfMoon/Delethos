# Delethos Selective Source Adoption & Reuse Plan

**Status:** program-level planning refinement; non-authoritative for implementation  
**Canonical parent plan:** `docs/EXECUTION_MASTER_PLAN.md`  
**Active authority remains:** `specs/CURRENT.md` and the specification named there  
**Founder authorization:** `docs/research/FOUNDER_SOURCE_USE_AUTHORIZATION_2026-09-08.md`  
**Source matrix:** `docs/research/SOURCE_ADOPTION_MATRIX_2026-09-08.md`

## Purpose

Delethos has unusually broad access to useful source implementations across coding-agent delegation, harness/runtime infrastructure, security scanning, evaluation, skill packaging, workflow orchestration, and developer UX.

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

Every material reuse candidate should move through the following deterministic planning/execution stages.

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
    "specification": "specs/...","
    " "task": "...",
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

A traditional SBOM answers what packaged dependencies are present.

The Source BOM must additionally answer:

- what code was copied rather than installed as a dependency;
- which upstream revision it came from;
- how it was modified;
- which tests bind its retained behavior;
- whether Delethos intentionally diverges from upstream.

Both are useful and neither replaces the other.

---

# 3. Third-Party Notice and Attribution Gate

When copied code requires attribution/notice retention, Delethos should fail a release/conformance gate if the Source BOM and notice surface disagree.

Candidate future surfaces:

```text
THIRD_PARTY_NOTICES.md
.delethos/sources.json
scripts/verify-source-provenance.mjs
scripts/verify-third-party-notices.mjs
```

These paths are placeholders, not current implementation authority.

The gate should verify at minimum:

1. every material copied unit has a Source BOM record;
2. every required source notice is retained;
3. local paths referenced by the record exist;
4. source revision/path references are syntactically bounded;
5. declared adoption mode is valid;
6. no copied unit silently loses attribution during refactor/move;
7. release packaging includes required notices.

---

# 4. Copy-by-Value Rule

The smallest useful source unit should be preferred.

Preferred order:

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

Moving down the list requires stronger justification.

A full donor subsystem/framework should be copied only when measured integration cost is lower than extracting the necessary primitives and when doing so does not redefine Delethos's core product boundary.

---

# 5. Source-Derived Tests Travel with Behavior

Code reuse without semantic tests creates invisible debt.

For every copied/adapted unit, future implementation specs should require one or more of:

- donor tests copied verbatim where applicable;
- donor tests translated to the Delethos stack;
- source-derived fixtures that reproduce observed edge cases;
- mutation/falsifiability checks for critical guards;
- cross-platform cases when the source behavior is platform-sensitive;
- negative cases for removed donor assumptions.

## Important distinction

A copied donor test does not automatically prove Delethos behavior.

It must run against the local adapted implementation and be supplemented by Delethos contract tests where the local boundary is stronger or different.

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

Future source-adoption reviews should include an explicit `DONOR_ASSUMPTIONS_REMOVED_OR_ACCEPTED` evidence section.

---

# 7. Upstream Drift Policy

Copied code creates a maintenance relationship even when no package dependency exists.

Each adopted unit must declare one policy:

### `PINNED_NO_SYNC`

The copied unit is intentionally frozen. Security issues are still monitored where material, but upstream feature drift is ignored.

### `SECURITY_ONLY_RECONCILE`

Only security/correctness fixes relevant to the adopted behavior are considered.

### `PERIODIC_RECONCILE`

Review upstream on a bounded cadence or release boundary.

### `TRACK_UPSTREAM`

Maintain close semantic parity because Delethos depends on matching an unstable external protocol/CLI.

### `FORKED_INTENTIONALLY`

The copied unit is now Delethos-native and upstream is historical provenance only.

The default for most reusable primitives should be `SECURITY_ONLY_RECONCILE` or `FORKED_INTENTIONALLY`, not perpetual synchronization.

---

# 8. Capability Truth Model

Source research exposed a gap in Delethos's future capability model: `SUPPORTED`/`UNAVAILABLE` alone is insufficient for ecosystem routing.

A future capability registry should distinguish facts across separate dimensions.

Candidate lifecycle:

```text
REGISTERED
DISCOVERED
CONFIGURED
REACHABLE
HEALTHY
AUTHORIZED
QUALIFIED
```

These are not interchangeable.

Examples:

- a Codex binary may be `DISCOVERED` but not `AUTHORIZED` for a requested repository policy;
- a Skill may be `REGISTERED` but not `SECURITY_ADMITTED`;
- an MCP server may be `REACHABLE` but fail health/conformance;
- an adapter can be `QUALIFIED` on Linux while `UNVERIFIED` on Windows;
- a model/provider can be requested without being observed.

## Registry truth rule

The capability registry may aggregate evidence, but it must not become a narrative authority.

Every state transition must point to the observation/policy that justifies it.

---

# 9. Canonical Source + Generated Harness Packaging

Multi-harness skills/plugins should have one Delethos-owned canonical definition.

Target architecture:

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

## Why this matters

Without generation:

- safety instructions drift;
- capabilities diverge;
- fixes land in one harness and not another;
- provenance becomes ambiguous;
- review cost multiplies.

Generated files must be treated as products of the canonical source, not independently hand-maintained truth.

## Source inspiration

This direction is strongly supported by the architecture observed in `wshobson/agents` and the packaging/install surfaces in `anthropics/skills`, `vercel-labs/skills`, `delegate-skills`, and `obra/superpowers`.

---

# 10. Durable Job Model

Future review/repair/guard/security operations need a first-class job abstraction distinct from an agent session or transcript.

Candidate contract:

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

Likely job kinds:

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

## Why

A long-running security scan, reviewer, or benchmark case may:

- outlive one model response;
- stream output incrementally;
- stall independently;
- be cancelled independently;
- produce multiple artifacts;
- fail while preserving useful partial evidence.

The job abstraction should be deterministic core state even if an agent/tool performs the work.

## Source inspiration

DeepSeek Harness's generic long-running tool runtime demonstrates the value of explicit job output/status separation. Delethos should adapt the primitive, not adopt the whole harness.

---

# 11. Event Ledger and Projection Boundary

Delethos already plans an `events.ndjson` evidence timeline. Future work should strengthen the distinction between **event facts** and **derived views**.

Target model:

```text
commands/actions
  -> validated deterministic transition
  -> append-oriented event
  -> durable run/job state
  -> one or more projections
       TUI
       CLI summary
       GitHub check
       evidence card
       routing history
```

A projection may be rebuilt or replaced. It cannot retroactively redefine event truth.

## Benefits

- crash/restart recovery;
- debuggable orchestration;
- reproducible UI state;
- easier external integration;
- less stale-memory confusion;
- better auditability of repair/review loops.

Munder Difflin and DeepSeek Harness both reinforce this direction from different product angles.

---

# 12. Skill / Plugin / MCP Admission Pipeline

A future ecosystem must distinguish **discovery** from **activation**.

Target pipeline:

```text
source discovered
  -> source identity pinned
  -> manifest parsed without execution
  -> content types observed
  -> provenance/license checked
  -> permissions/capabilities extracted
  -> deterministic pre-scan
  -> probabilistic advisory scan (optional)
  -> user/policy decision
  -> installation
  -> qualified activation
```

Untrusted Skill/MCP/plugin code must not be executed merely to discover its metadata.

## Security taxonomy

Future threat fixtures should include at least:

- instruction hijacking;
- persistent memory poisoning;
- remote payload retrieval/execution;
- embedded malicious scripts;
- unauthorized access/privilege escalation;
- system persistence;
- tool hijacking/spoofing;
- insecure dependencies;
- command injection/hardcoded secrets/unsafe temporary files;
- charset/bytecode smuggling;
- credential exfiltration;
- malicious tool descriptions/metadata.

AI-Infra-Guard is a major source for this fixture/taxonomy work.

---

# 13. Content Observation Provider Contract

Do not couple Delethos policy directly to Magika or any one detector.

Shape a future provider-neutral contract first:

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

Low confidence should produce generic/unknown rather than a fabricated precise classification.

Magika is the leading optional provider candidate because its existing threshold/abstention behavior fits this contract well.

---

# 14. Security Finding Strength Model

Security findings from different mechanisms must not be flattened.

Candidate evidence-strength classes:

```text
DETERMINISTIC_STATIC
DETERMINISTIC_DYNAMIC
REPRODUCED_EXPLOIT
PROBABILISTIC_ADVISORY
EXTERNAL_ATTESTATION
```

A normalized finding should preserve:

```text
findingId
rule/taxonomy id
severity
affected path/range
producer
producer version/model
configuration digest
evidence strength
reproduction artifact
status
limitations
```

SARIF can be imported/exported as an interoperability layer, but Delethos's internal evidence model owns the proof semantics.

---

# 15. Security Benchmark Adoption

AICGSecEval provides a useful starting point for task shape. Delethos should eventually support benchmark cases that bind:

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

## Mandatory isolation rule

PoCs and intentionally vulnerable code must run only in a future specification-authorized disposable environment with bounded network/filesystem/credential exposure.

Never run arbitrary vulnerability PoCs against the developer host merely because a benchmark framework supports the command.

---

# 16. Visual Proof Freshness

Public Delethos screenshots and evidence cards should become reproducible artifacts rather than manually refreshed marketing images.

Future launch/docs gates should be able to bind:

```text
example source
canonical revision
render command
render environment
image dimensions
artifact digest
README/docs reference
```

When the authoritative example changes, stale screenshots should fail a freshness check.

Diagram Design and Archify provide strong practical examples of visual/output verification discipline.

---

# 17. Spec-by-Spec Integration

This section refines program intent only. It does not activate any specification.

## Specification 003 — current Gold adapters

**No scope expansion from this plan.**

Possible use only through a separate canonical Amendment 003 authority:

- source-derived conformance fixtures from delegate-skills/upstream CLI source;
- parser/protocol tests from Pi/OpenCode/Codex source;
- narrow robustness fixes where exact live evidence selects them.

The current R181/provider frontier remains unchanged by this plan.

## Specification 004 — Independent review + repair

Add during shaping:

- durable `REVIEW`/`REPAIR` jobs;
- append-oriented review events;
- reviewer output cursors/artifacts;
- Superpowers-derived review pressure tests;
- exact patch-digest rebinding after repair;
- distinct reviewer execution provenance.

## Specification 005 — Guards + proof bundle

Add during shaping:

- generic `GUARD` job contract;
- Source BOM/provenance verification candidate;
- content-observation contract;
- normalized security finding contract;
- security evidence-strength classes;
- source-derived test provenance in evidence;
- notice/SBOM consistency checks.

## Specification 006 — First-class UX

Add during shaping:

- event/projection architecture for TUI;
- capability states beyond binary discovery;
- bounded live job output;
- clear `UNKNOWN/UNAVAILABLE/UNQUALIFIED` rendering;
- reproducible evidence cards;
- low-friction onboarding lessons from skill ecosystems without remote execution-by-discovery.

## Specification 007 — Routing + durable decisions

Add during shaping:

- capability registry with separate discovered/configured/reachable/healthy/authorized/qualified facts;
- event-derived routing history;
- durable decisions separate from projections/live repository state;
- optional bounded declarative workflow compilation only if evidence justifies it.

## Specification 008 — Adapter expansion

Add during shaping:

- delegate-skills as a source-derived compatibility corpus;
- single canonical adapter/capability definitions;
- generated harness/package surfaces where applicable;
- registry drift gates;
- source-specific conformance fixtures;
- cross-platform verification manifests.

## Specification 009 — Delethos Bench

Add during shaping:

- AICGSecEval-inspired security task schema;
- source rights at artifact granularity;
- exact base/patch/task provenance;
- isolated functional + security execution;
- source/provider contamination notes;
- security benchmark track alongside reliability/review/routing tracks.

## Specification 010 — Agent Skill

Add during shaping:

- canonical-source `SKILL.md`/plugin definition;
- generated harness adapters;
- Vercel/Anthropic/Superpowers/delegate-skills packaging fixtures;
- pre-activation security admission;
- generated-output drift checks.

## Specification 011 — GitHub integration

Add during shaping:

- security finding/SARIF bridge;
- evidence-card attachment/rendering;
- event-derived check summaries;
- source/provenance summary where copied code affects a patch.

## Specification 012 — Ecosystem registry

Add during shaping:

- signed artifact/manifest provenance;
- source BOM for community extensions;
- capability-state registry;
- generated harness surfaces;
- registry drift/conformance gates;
- install != activate distinction;
- adapter/Skill/MCP security status.

## Specification 013 — Stable v1 hardening

Add during shaping:

- copied-code/source-adoption audit;
- third-party notice verification;
- upstream security reconciliation;
- signed registry policy;
- provider integrity/model-substitution tests where evidence permits;
- adversarial source/plugin/skill/MCP supply-chain tests;
- dependency-closure and install-script hardening.

## Specification 014 — Category launch

Add during shaping:

- visual artifact freshness gates;
- independent source/provenance audit instructions;
- independently reproducible security benchmark examples;
- public source-reuse transparency;
- launch claims bound to canonical examples and evidence bundles.

---

# 18. Adoption Decision Gate

A future implementation unit that proposes copying code should answer all of these before edit:

```text
1. What exact problem does this source unit solve?
2. Why copy/adapt instead of writing a smaller Delethos-native unit?
3. What is the exact source commit and path?
4. What permission/license/notice basis applies?
5. What is the dependency closure?
6. What hidden donor assumptions were found?
7. What local contract will own the adopted behavior?
8. What source tests/fixtures travel with it?
9. What Delethos tests make the behavior falsifiable?
10. What security review applies?
11. What platforms are affected?
12. How will provenance be machine-recorded?
13. What upstream-drift policy applies?
14. What is the maintenance owner/cost?
15. What is explicitly not being copied?
```

If these questions cannot be answered, the adoption unit is not ready.

---

# 19. Highest-Priority Engineering Improvements Found

After re-evaluating the full source set, the most important additions to the existing Delethos plan are:

1. **Source BOM + notice gate before substantial code copying.**
2. **Source-derived conformance corpus** from delegate-skills and upstream CLI source.
3. **Durable job abstraction** for review/repair/guard/security work.
4. **Append-oriented event ledger + rebuildable projections.**
5. **Capability-state registry** separating discovery, health, authority, and qualification.
6. **Single canonical Skill/plugin source + generated harness adapters.**
7. **Plugin/Skill/MCP security admission before activation.**
8. **Content observation with confidence/abstention.**
9. **Security evidence-strength separation and SARIF bridge.**
10. **Repository-level security benchmark with isolated dynamic evidence.**
11. **Signed ecosystem artifact provenance.**
12. **Visual/public artifact freshness verification.**
13. **Explicit upstream drift ownership for every copied unit.**
14. **Donor-assumption stripping and dependency-closure checks.**
15. **Pressure-tested verification/review methodology translated into deterministic policy tests.**

These improvements strengthen the existing wedge rather than creating a second product.

---

# 20. What Not to Build

Even with broad reuse permission, Delethos should not become:

- a donor-source mirror;
- a generic swarm platform;
- an Electron-first virtual office;
- a mandatory cloud orchestration service;
- a generic malware/vulnerability scanner;
- an LLM-security-opinion product;
- an IPFS-dependent plugin marketplace;
- a generic workflow DSL before the verified delegation loop is excellent;
- a fork of Codex/OpenCode/Pi/DeepSeek Harness;
- a repository containing huge copied subsystems with no source BOM or owner.

---

# 21. Completion Condition for This Planning Refinement

This program-level refinement is complete when canonical repository truth contains:

1. the Founder source-use authorization record;
2. the source adoption matrix;
3. this selective source adoption plan;
4. parent-plan/roadmap links that make the plan discoverable;
5. no change to active Specification 003 execution authority;
6. qualified documentation-only merge and appropriate post-merge CI.

Future code adoption remains separately authorized work.
