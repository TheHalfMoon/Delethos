# Delethos Security & Evaluation Expansion Plan

**Status:** program-level planning refinement; non-authoritative for implementation  
**Canonical parent plan:** `docs/EXECUTION_MASTER_PLAN.md`  
**Active execution authority remains:** `specs/CURRENT.md` and the active specification named there  
**Research basis:** `docs/research/SECURITY_CONTENT_BENCHMARK_SOURCES_2026-09-08.md`

## Purpose

Strengthen Delethos's long-term plan with a coherent **security proof spine** derived from the evidence and threat-model lessons in Magika, AI-Infra-Guard, and AICGSecEval while preserving Delethos's category:

> Delethos is the vendor-neutral control plane for verified delegation across coding agents.

This plan does **not** turn Delethos into a generic malware scanner, vulnerability-management suite, hosted red-team platform, or benchmark-only product.

It extends the existing verified-delegation workflow so that security-relevant content, tools, findings, and benchmark claims can be represented with the same proof discipline already applied to repository state, process execution, adapters, review, and evidence.

## Non-authority

This document does not authorize:

- any change to active Specification 003 implementation;
- any new production dependency;
- importing Magika, AI-Infra-Guard, or AICGSecEval code/models/datasets/containers;
- executing untrusted Skill/MCP/plugin code during discovery;
- adding hosted APIs, API keys, telemetry, or cloud dependencies;
- running vulnerability PoCs on the developer host;
- provider/model poisoning claims without separately qualified evidence;
- public security, benchmark, or superiority claims.

Each future product change must be separately shaped, scoped, reviewed, and activated through canonical specification authority.

## Strategic objective

Delethos should eventually be able to answer, for an AI-generated patch:

```text
What content changed?
What did the repository claim the files were?
What did a bounded content detector observe?
Which agent/tool/skill surfaces were admitted?
Which deterministic and security guards ran?
Which findings were produced, by exactly which scanner/rules/model/config?
Which dynamic tests or vulnerability-specific checks actually executed?
Who independently reviewed the exact patch?
What remained unknown, unavailable, low-confidence, or untested?
Can another machine verify the evidence without trusting the original model?
```

## Security proof spine

The long-term workflow should refine toward:

```text
user intent
  -> bounded execution unit
  -> repository/base truth
  -> content admission observations
  -> adapter / skill / MCP / plugin admission
  -> policy and risk compilation
  -> isolated implementation
  -> exact diff capture
  -> content-aware deterministic guards
  -> normalized security findings
  -> dynamic security checks when explicitly required and contained
  -> independent review when required
  -> bounded repair / rebind / re-review
  -> proof-carrying patch
  -> human or explicitly authorized repository decision
```

The added stages must remain deterministic at correctness-sensitive state transitions even when one or more underlying detectors are probabilistic.

## Cross-cutting contract candidates

Names below are planning placeholders, not frozen schemas.

### 1. Content observation

Candidate semantic surface:

```text
delethos.content-observation.v1
```

Expected facts:

- path or bounded artifact reference;
- exact input digest;
- detector id/version;
- detector configuration/mode;
- detector-native prediction;
- confidence where available;
- accepted Delethos classification;
- decision state;
- limitations.

Candidate decision states:

```text
ACCEPTED_SPECIFIC
ACCEPTED_GENERIC
UNKNOWN
UNAVAILABLE
FAILED
```

Rules:

- filename extension is an observation, not content proof;
- detector-native prediction and Delethos-accepted classification remain separate;
- low confidence may degrade to a generic class or `UNKNOWN` according to policy;
- unknown content must never be silently upgraded to a specific type;
- content type does not imply safety.

### 2. Security finding

Candidate semantic surface:

```text
delethos.security-finding.v1
```

Expected facts:

- finding id;
- normalized category;
- severity;
- confidence/strength when relevant;
- affected path/range/artifact;
- scanner id/version;
- rule/rulepack/model/config identity;
- static/dynamic/advisory class;
- external taxonomy mappings where valid (`CWE`, `OWASP`, Skill/MCP risk classes, etc.);
- bounded evidence references;
- reproduction or validation reference where available;
- disposition and limitations.

No scanner text alone may set final run status. Policy compiles which findings/guards are required, advisory, blocking, or informational.

### 3. Security guard result

Candidate semantic surface:

```text
delethos.security-guard-result.v1
```

Expected classes:

```text
DETERMINISTIC_STATIC
DETERMINISTIC_DYNAMIC
PROBABILISTIC_ADVISORY
EXTERNAL_TOOL
MANUAL_OR_INDEPENDENT_REVIEW
```

The evidence model must preserve evidence-strength distinctions instead of collapsing every successful command into the same quality of proof.

### 4. Scanner provenance

Security evidence should bind at least:

- executable/package identity;
- exact version/revision;
- rulepack/database/model identity and digest when available;
- configuration digest;
- platform/runtime facts;
- scan scope;
- input/candidate digest;
- output/artifact digest;
- execution status;
- unavailable features and exclusions.

An LLM-backed scanner also records the exact model/provider facts that are actually observable. Requested model identity and observed identity remain distinct.

### 5. SARIF bridge

SARIF 2.1.0 is a useful interoperability surface for GitHub and external scanners.

Planning rules:

- Delethos may import/export bounded SARIF findings;
- SARIF remains an interchange view, not the canonical internal evidence truth;
- imported SARIF retains producing-tool provenance and source artifact digest;
- malformed or ambiguous SARIF fails closed when required by policy;
- GitHub rendering must not imply `VERIFIED` merely because annotations exist.

## Threat taxonomy refinement

The future security model and tests should explicitly include at least these families.

### Instruction and state threats

- repository prompt injection;
- Skill instruction hijacking;
- malicious instructions embedded in documentation/data;
- durable memory poisoning;
- stale policy/context masquerading as live repository truth.

### Code execution threats

- remote payload retrieval and execution;
- embedded malicious scripts;
- command injection;
- unsafe shell construction;
- untrusted install/build hooks;
- bytecode or generated-code hiding;
- encoding/charset smuggling.

### Privilege and persistence threats

- excessive ambient authority;
- privilege escalation;
- credential/SSH/cloud-token access;
- startup/scheduled-task persistence;
- unauthorized writes outside the worktree;
- external side effects not represented by the Git diff.

### Toolchain threats

- tool hijacking/spoofing;
- MCP tool poisoning;
- malicious or substituted executables;
- dependency confusion/typosquatting;
- insecure dependencies;
- untrusted plugin/skill lifecycle hooks.

### Provider integrity threats

- requested model differs from actual model;
- API relay/provider substitution;
- hidden fallback provider;
- model/API poisoning/backdoor behavior;
- stale or mutable provider configuration undermines reproducibility.

These threats become implementation requirements only when a future active specification explicitly selects them.

## Specification refinement map

The existing numbering remains stable. This plan strengthens later outcomes without changing the current Specification 003 frontier.

### Specification 003 — Adapter SDK + first Gold candidates

**No scope change from this plan.**

Preserve the current work. Requested/observed provider/model distinctions and exact execution identity are important prerequisites for later provider-integrity work, but this plan does not add new Spec 003 tasks.

### Specification 004 — Independent review + bounded repair loop

Keep the existing outcome.

Security refinement to shape later:

- review policy may require a security-capable independent reviewer for high-risk diffs;
- reviewer findings must normalize without replacing deterministic guards;
- repaired security findings rebind to the new patch digest and require re-evaluation/re-review according to policy.

### Specification 005 — Deterministic guards + content admission + proof-carrying patch bundle

Refine the future outcome to include:

1. deterministic guard orchestration;
2. confidence-aware content observations for changed artifacts where useful;
3. extension/content mismatch evidence;
4. generic/unknown content routing rather than unsafe guessing;
5. normalized security finding contract;
6. scanner provenance binding;
7. static security guard integration boundary;
8. bounded external scanner integration without mandatory hosted services;
9. evidence-strength classes;
10. proof bundle/verifier semantics that preserve findings, exclusions, abstentions, and unavailable checks.

Minimum shaping requirements before activation should include:

- no mandatory ML classifier dependency without measured justification;
- at least one deterministic content-observation fixture path;
- explicit behavior for `UNKNOWN` and detector failure;
- static scanner failures cannot be converted to PASS;
- LLM-only scanner output cannot become deterministic authority;
- guard results bind exact candidate digest and scanner provenance;
- security findings are privacy-minimized and do not serialize secrets by default.

### Specification 006 — CLI/TUI onboarding + first useful run

The UX should make the security proof spine understandable without overwhelming the user.

Candidate presentation:

```text
Content       14 specific / 2 generic / 1 unknown
Guards        9 required / 9 passed
Security      3 advisory findings / 0 blocking
Dynamic       NOT REQUIRED
Review        independent PASS
Limitations   2 explicit
```

The UI must preserve `UNKNOWN`, `UNAVAILABLE`, `ABSTAIN`, and `NOT RUN` rather than hiding them behind a green summary.

### Specification 007 — Explainable routing + durable decisions

Security policy may later influence eligibility/routing using reproducible facts such as:

- risk class;
- content class;
- required read-only capability;
- required security-review capability;
- platform containment availability;
- observed historical outcome quality.

A model should not route itself solely from unverified self-reported security capability.

### Specification 008 — Adapter expansion + cross-platform conformance

Later adapters should expose security-relevant capabilities honestly, including where observable:

- sandbox/read-only posture;
- tool restrictions;
- network posture;
- environment/config isolation;
- external-side-effect risk;
- provider/model identity observability.

Security conformance remains version/platform specific.

### Specification 009 — Delethos Bench + repository-level security evaluation

Refine Delethos Bench into multiple transparent tracks rather than a single aggregate leaderboard.

Candidate tracks:

```text
workflow reliability
process/recovery correctness
independent-review defect detection
routing quality
repository-level security patching
security guard/scanner quality
```

The repository-level security track should use versioned task manifests with fields such as:

```text
task id
repository + exact base
vulnerability source
CWE/category/severity
relevant paths/ranges
allowed change surface
functional test command/fixture
security validation command/fixture
PoC or exploit oracle when legally/safely distributable
contained environment identity
expected vulnerable/fixed behavior
license/provenance
known contamination risks
exclusions
```

Evaluation rules:

- functional correctness and security correctness are separate scores;
- static findings and dynamic oracle results are separate evidence;
- vulnerability-specific dynamic evidence should run only in disposable contained environments;
- benchmark failures, timeouts, unavailable cases, exclusions, and invalid tasks remain visible;
- checkpoint/resume may improve operational reliability but must not alter scoring truth;
- security scanner claims should publish precision, recall, false-positive rate, false-negative observations where a labeled corpus supports them;
- generation agents and evaluator identities/configurations are independently recorded;
- benchmark contamination and task exposure are documented.

No benchmark may imply Delethos makes arbitrary AI-generated code secure.

### Specification 010 — Agent Skill + marketplace packaging + security admission

Before a third-party skill/plugin package is activated by Delethos, a future specification should define a non-executing admission phase.

Candidate checks:

- manifest and source inventory;
- content-type anomalies;
- instruction-hijacking indicators;
- memory/state write intent;
- remote payload retrieval/execute patterns;
- embedded executable/script inventory;
- privilege/persistence indicators;
- tool spoofing/hijacking indicators;
- dependency provenance;
- insecure coding/secret patterns.

Discovery/admission must not execute the skill/plugin merely to learn what it contains.

A probabilistic audit may add findings but cannot independently authorize execution.

### Specification 011 — GitHub integration + security interoperability

Refine the future GitHub surface to include:

- bounded security finding annotations;
- SARIF import/export where useful;
- evidence summaries linked to exact patch/check digests;
- explicit distinction between advisory finding, blocking guard, and verified policy state;
- no automatic claim that a GitHub check name such as "security" implies complete security validation.

### Specification 012 — Adapter/plugin/MCP/skill ecosystem + conformance/security registry

The registry should eventually distinguish:

```text
compatibility status
maintenance/provenance status
security conformance status
platform qualification
rule/schema version
last qualified revision
known limitations
```

Plugin/skill/MCP contributions require supply-chain and provenance rules separate from adapter capability conformance.

Community artifacts must not become trusted merely because they are listed in a registry.

### Specification 013 — Adversarial security/recovery hardening + stable v1 contracts

Expand the existing security/recovery hardening milestone to include a dedicated adversarial corpus and stable security evidence semantics.

Candidate adversarial families:

- prompt/instruction injection;
- memory poisoning;
- remote payload execution;
- embedded malicious code;
- privilege escalation;
- persistence;
- tool hijacking/spoofing;
- MCP tool poisoning;
- dependency confusion/typosquatting;
- command injection;
- secret/credential exfiltration;
- unsafe temporary files;
- bytecode/generated-code bypass;
- charset/encoding smuggling;
- provider/model/relay substitution;
- malformed security evidence/SARIF;
- scanner/rulepack drift;
- dynamic-test containment failure.

Stable v1 security contracts require migration rules and verifier compatibility tests.

### Specification 014 — Independent validation + category launch

Category-launch readiness should require independent reproduction of the security proof semantics, not security marketing language.

Public claims should include:

- exact test/benchmark methodology;
- supported and unsupported security surfaces;
- known false-positive/false-negative limitations;
- untested threat classes;
- benchmark provenance/exclusions;
- external validation where available;
- no "safest agent orchestrator" claim without a reproducible comparison protocol.

## Priority order

### P0 — Design before Specification 005 activation

These gaps should be shaped before guard/evidence implementation becomes stable:

1. content observation and abstention semantics;
2. normalized security finding contract;
3. scanner provenance requirements;
4. evidence-strength distinction for static/dynamic/probabilistic results;
5. dynamic-security containment policy;
6. benchmark task licensing/provenance/contamination rules.

### P1 — Implement only in their future authorized specifications

1. content-aware guard routing;
2. security finding evidence binding;
3. SARIF bridge;
4. repository-level security benchmark track;
5. pre-activation Skill/MCP/plugin admission;
6. provider/model integrity evaluation where technically observable.

### P2 — Ecosystem/hardening expansion after core proof semantics are real

1. optional Magika-compatible detector integration;
2. third-party scanner adapters;
3. security conformance registry;
4. adversarial evasion corpus;
5. community rulepack lifecycle and signing/provenance;
6. richer provider-integrity probes.

## Dependency strategy

The source study does not justify immediate dependencies.

Future dependency rules:

- prefer subprocess/plugin adapters for large external security tools over embedding them into the core;
- record exact tool availability rather than auto-install silently;
- optional content detection must degrade honestly when unavailable;
- no hosted scanner/model API is required for core verification;
- a new in-process runtime dependency requires measured portability, security, size, maintenance, and replacement-cost justification;
- benchmark-only dependencies must not leak into the ordinary runtime dependency graph.

## Dynamic execution safety

Security testing is particularly prone to unsafe "verification" behavior.

Future dynamic security checks must default to:

```text
explicitly selected task
  -> immutable/verified task definition
  -> disposable environment
  -> no developer credentials
  -> bounded network policy
  -> bounded tool/command allowlist
  -> resource/time limits
  -> test/PoC execution
  -> result/artifact capture
  -> environment disposal
```

A benchmark PoC, MCP tool, Skill script, or untrusted repository test command must not run on the developer host merely because it is useful evidence.

## Security quality measurements

In addition to existing north-star metrics, later security specifications/benchmarks should measure where appropriate:

- blocking security guard false-positive rate;
- security defect recall on labeled tasks;
- false-negative observations;
- content-classification abstention rate;
- extension/content mismatch frequency;
- security finding reproducibility;
- scanner/rulepack drift rate;
- dynamic oracle reproducibility;
- security review defect-detection yield;
- high-risk escaped verification defects;
- time/cost added by required security policy;
- percentage of findings with complete provenance.

No metric may convert an unavailable or failed security evaluation into PASS.

## Explicitly rejected breadth

This plan intentionally rejects or defers:

- becoming a CVE database product;
- building a general SOC/SIEM platform;
- mandatory malware classification for every file;
- a hosted red-team dashboard as core architecture;
- mandatory Docker for ordinary runs;
- automatic execution of every test/PoC discovered in a repository;
- LLM-only security certification;
- security scoring based mainly on GitHub stars, scanner count, or vulnerability count;
- automatic tool/skill marketplace trust;
- hidden cloud telemetry for security analytics.

## Activation discipline

Before any future specification implements a capability described here, its shaping unit must state at minimum:

- exact bounded outcome;
- threat model;
- authorized paths;
- dependency decision;
- data/provenance policy;
- deterministic and probabilistic evidence boundaries;
- positive and negative acceptance tests;
- platform/environment matrix;
- privacy/secret handling;
- dynamic containment requirements where applicable;
- reviewer independence requirements;
- migration/compatibility impact;
- explicit non-claims.

## Conclusion

The durable improvement is not "add Magika + add AI-Infra-Guard + add AICGSecEval."

The improvement is to make Delethos's existing proof discipline security-aware:

```text
content-aware
supply-chain-aware
agent/tool-aware
provider-integrity-aware
security-finding-aware
dynamic-evidence-aware
benchmark-provenance-aware
```

while preserving the core invariant:

> Probabilistic workers may propose observations. Deterministic policy and exact evidence own correctness-sensitive state transitions.
