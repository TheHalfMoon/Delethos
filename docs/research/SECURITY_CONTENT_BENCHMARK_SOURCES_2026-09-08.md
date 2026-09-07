# Security, Content, and Benchmark Source Qualification — 2026-09-08

**Status:** bounded planning research snapshot; non-authoritative for product implementation  
**Canonical Delethos base:** `1724961da8f31018e9dd69c552d2711558f1315a`  
**Purpose:** evaluate `google/magika`, `Tencent/AI-Infra-Guard`, and `Tencent/AICGSecEval` as architectural and evaluation references for future Delethos specifications without changing the active Specification 003 execution frontier.

## Research rules

- Live repository state and checked-in documentation are treated as source claims to inspect, not blanket proof of every capability.
- This document records architectural lessons and candidate plan refinements only.
- It does not authorize product code, dependencies, new runtime behavior, provider execution, or changes to Specification 003.
- Donor code is not copied by this note. Any later code adaptation requires path-level provenance and license review.
- External datasets, CVE reproductions, containers, and benchmark repositories may carry their own upstream licenses and redistribution conditions even when the framework repository is permissively licensed.
- LLM-generated security findings are never deterministic authority by themselves.
- Missing, uncertain, low-confidence, unavailable, or unexecuted evidence remains explicit and cannot become PASS.

## Exact source snapshot

| Source | Ref inspected | License snapshot | Primary relevance to Delethos |
|---|---|---|---|
| `google/magika` | `26b6a9ba7e92f2b0a3745970a9190ec0dde9bf83` | Apache-2.0 | content identification, confidence thresholds, abstention/generic fallback, local fast classification |
| `Tencent/AI-Infra-Guard` | `e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c` | Apache-2.0 | agent/skill/MCP security taxonomy, security scanning, SARIF output, tool-risk controls, AI-infrastructure threat research |
| `Tencent/AICGSecEval` | `94428ebf45141bf4ecd365a51d596dcd51caa690` | Apache-2.0 framework with bundled third-party notices | repository-level security benchmark methodology, CVE-derived tasks, static + dynamic evaluation, agent evaluation |

Repositories:

- https://github.com/google/magika
- https://github.com/Tencent/AI-Infra-Guard
- https://github.com/Tencent/AICGSecEval

## Source 1 — `google/magika`

### Observed strengths

Magika separates the model's predicted content type from the tool's accepted output. It uses per-content-type confidence thresholds and can fall back to generic text or unknown binary labels when confidence is insufficient. It also exposes multiple prediction modes rather than forcing every prediction into a high-confidence claim.

The important Delethos lesson is not "add an ML file classifier dependency." The important lesson is **confidence-aware content admission**:

```text
raw bytes
  -> detector observation
  -> confidence / detector provenance
  -> accepted specific type OR generic class OR unknown
  -> content-appropriate guard routing
```

This is superior to relying only on filename extensions when security policy, parser selection, or evidence retention depends on the actual content class.

### Candidate Delethos adoption

Adopt as concepts:

- detector output and accepted policy classification are distinct facts;
- content confidence is explicit;
- low-confidence observations may degrade to a generic class rather than becoming a false specific claim;
- `UNKNOWN` is a valid result;
- content detection should be local and bounded when possible;
- classification provenance should include detector id/version/config and input digest.

Adapt rather than copy:

- define a vendor-neutral Delethos content-observation contract;
- allow future optional detector implementations, including but not limited to Magika-compatible integration;
- keep the core able to operate without a mandatory ML model or hosted API;
- let policy decide whether unknown content is accepted, routed to generic guards, or blocks a high-risk workflow.

Do not adopt:

- a mandatory Magika runtime dependency before a specification proves the dependency cost is justified;
- model confidence as proof that a file is safe;
- content type as a substitute for security scanning.

## Source 2 — `Tencent/AI-Infra-Guard`

### Observed strengths

AI-Infra-Guard exposes a broad AI-security surface including Agent Scan, MCP/Skill scanning, infrastructure vulnerability scanning, jailbreak evaluation, model/API relay checking, and standalone CI-oriented scanning tools.

Its documented SkillTrustBench-aligned taxonomy provides a useful threat decomposition:

```text
T01 Skill Instruction Hijacking
T02 Agent Memory Poisoning
T03 Remote Payload Retrieval and Execution
T04 Embedded Malicious Code
T05 Unauthorized Access and Privilege Escalation
T06 System Persistence
T07 Tool Hijacking and Spoofing
T08 Insecure Dependencies
T09 Insecure Skill Coding Practices
```

The standalone skill scanner can emit SARIF 2.1.0, which is relevant to Delethos's future GitHub/check and evidence interoperability.

Recent documented work also highlights classes that should inform Delethos adversarial testing, including bytecode/encoding bypasses, tool whitelisting for dynamic MCP execution, credential exfiltration, command injection, model/API relay substitution, and backdoor/poisoning probes.

### Candidate Delethos adoption

Adopt as concepts:

- explicit agent/skill/toolchain risk taxonomy;
- pre-activation scanning of untrusted skills/plugins/MCP definitions;
- security findings that can map to standard ecosystems such as CWE/OWASP and export to SARIF;
- dynamic tool execution must use an explicit allowlist and disposable containment if later authorized;
- scanner findings need provenance and limitations;
- provider/model identity deserves integrity checks when a relay or configurable API can substitute the requested backend.

Adapt rather than copy:

- Delethos should normalize findings into its own vendor-neutral evidence model rather than make AI-Infra-Guard the security authority;
- the T01–T09 taxonomy should inform a Delethos-native taxonomy, not become an unversioned hard dependency;
- LLM-assisted scans may be advisory or one evidence source, while deterministic policy/guard state remains outside the model;
- SARIF should be an interchange surface, not the canonical internal truth format.

Do not adopt:

- a mandatory central red-team service;
- model/API keys as a core prerequisite for local verification;
- unauthenticated public service deployment patterns;
- dynamic execution of untrusted MCP tools or skills during discovery;
- any claim that an AI-only scan proves absence of vulnerabilities.

## Source 3 — `Tencent/AICGSecEval`

### Observed strengths

AICGSecEval is directly relevant to Delethos Bench because it evaluates AI-generated code at repository level rather than isolated snippets. Its public task records bind concrete vulnerability context to repository state.

A representative task includes fields such as:

```text
instance_id
repo
base_commit
patch_commit
vuln_file
vuln_lines
language
vuln_source
cwe_id
vuln_type
severity
container image
functional status check command
test case command
PoC command
```

This is valuable because security evaluation is not reduced to "a scanner found no warning." The benchmark can combine repository context, static analysis, functional tests, and vulnerability-specific dynamic evidence.

The framework also supports agent-oriented evaluation and long-running evaluation workflows with recovery/checkpoint behavior.

### Candidate Delethos adoption

Adopt as concepts:

- repository-level security tasks with exact base revision and reproducible environment facts;
- security task manifests that record CWE/type/severity and expected vulnerable/fixed state;
- static + dynamic hybrid evaluation;
- functional correctness and vulnerability behavior are separate dimensions;
- vulnerability PoCs/tests can provide stronger evidence than a scanner score alone;
- benchmark execution should preserve failures and support resumable long-running evaluation without changing scoring truth.

Adapt rather than copy:

- create a Delethos Bench security track that evaluates coding-agent patches under the same proof discipline as normal runs;
- bind each task to exact repository provenance, task license, environment digest, evaluation commands, expected outputs, and exclusions;
- separate generation/implementation identity from evaluator identity;
- retain raw result evidence where legally and safely distributable;
- use container/disposable environments only when a future benchmark specification authorizes them.

Do not adopt blindly:

- benchmark datasets without per-task upstream license/provenance validation;
- arbitrary CVE PoCs on the developer host;
- benchmark task commands as trusted merely because they are in a dataset;
- leaderboard claims without contamination, exclusions, failure, and reproducibility disclosure;
- a mandatory 100GB+ Docker-oriented setup for ordinary Delethos product use.

## Gap analysis against the current Delethos plan

The current Delethos design is strong in authority, worktree isolation, process supervision, adapter truth, independent review, evidence binding, and fail-closed state transitions. The three sources expose additional gaps that are not yet explicit enough in the roadmap.

| Gap | Current weakness | Plan implication | Priority |
|---|---|---|---|
| Content admission | path/extension truth can be insufficient for parser/guard choice | add confidence-aware content observation before content-specific guards | P0 design |
| Abstention semantics for classifiers/scanners | `UNAVAILABLE` exists, but low-confidence security/classification output is not modeled explicitly | add `UNKNOWN`/`ABSTAIN` semantics where classification is probabilistic | P0 design |
| Security finding contract | guards are generic; no normalized vulnerability finding schema is planned | define versioned finding/provenance contract before broad security integrations | P0 design |
| Scanner provenance | tool/rule/model/config identity is not yet first-class for security scans | evidence must bind scanner version, rulepack/model/config, scope, and artifacts | P0 design |
| Static + dynamic security composition | future guards are not explicitly split by evidence strength | define deterministic/advisory/static/dynamic guard classes | P0 design |
| Dynamic security containment | security model notes side effects but benchmark/PoC containment is not explicit | require disposable execution, allowlists, no-host-default for adversarial tests | P0 design |
| Agent Skill/MCP admission | Spec 010/012 focus distribution/ecosystem but not pre-activation security | add static admission and threat taxonomy before loading third-party skills/tools | P1 |
| SARIF interoperability | GitHub integration lacks planned standard security finding bridge | add bounded SARIF import/export/rendering without making SARIF canonical truth | P1 |
| Provider/model integrity | requested vs observed identity exists, but substitution/relay poisoning probes are not planned | add future integrity-probe shaping for configurable relays/providers | P1 |
| Repository-level security benchmark | Spec 009 focuses reliability/review/routing | add security patch track with CVE-like manifests and hybrid evaluation | P1 |
| Security quality metrics | plan lacks precision/recall/FPR methodology for scanner or guard claims | require false-positive/false-negative reporting for security benchmark claims | P1 |
| Benchmark provenance/contamination | reproducibility is required broadly but security-dataset contamination is not explicit | add per-task license/provenance, split integrity, exclusions, contamination notes | P0 design |
| Evasion classes | bytecode/encoding/smuggling/tool spoofing are not named | add adversarial fixtures to later security-hardening specification | P2 |
| Ecosystem security conformance | adapter registry is planned, but plugin/skill/MCP security posture is not | registry should expose conformance/provenance/security status separately | P2 |

## Recommended plan refinement

The roadmap should preserve its numbering and current active frontier but strengthen later specifications as follows:

```text
003 Adapter SDK + first gold candidates
  -> unchanged current authority
004 Independent review + bounded repair
  -> unchanged
005 Deterministic guards + content admission + normalized security findings + proof bundle
006 CLI/TUI onboarding
007 Explainable routing + durable decisions
008 Adapter expansion
009 Delethos Bench + repository-level security evaluation track
010 Agent Skill packaging + pre-activation skill security admission
011 GitHub PR/check integration + SARIF security interoperability
012 Adapter/plugin/MCP/skill ecosystem + conformance/security registry
013 Adversarial security/recovery hardening + provider-integrity evaluation + stable v1
014 Independent validation + category launch
```

No future specification receives implementation authority from this research document. Each capability still requires a separately shaped and canonically activated specification.

## Cross-cutting design principles to carry forward

1. **Content truth is observed, not inferred from extension alone.**
2. **A probabilistic detector may abstain.** Low confidence must not become a strong claim.
3. **Security scanners are evidence producers, not final authority.**
4. **Static and dynamic evidence remain distinct.** A clean static result does not imply a dynamic PoC would fail.
5. **Security findings require provenance.** Exact scanner/rule/model/config/scope identity matters.
6. **Dynamic adversarial execution is disposable by default.** No PoC or untrusted tool runs on the developer host merely for convenience.
7. **Skills, plugins, and MCP definitions are untrusted supply-chain inputs.** Discovery must not execute them.
8. **Requested provider/model identity is not observed identity.** Integrity probes may strengthen this later but cannot be inferred.
9. **SARIF is an interoperability format, not the sole Delethos evidence contract.**
10. **Benchmark security claims publish failures, exclusions, contamination controls, and false-positive/false-negative metrics.**
11. **No donor becomes a mandatory runtime dependency merely because it is a useful reference.**
12. **Security breadth must not dilute Delethos's category.** The product remains a verified delegation and proof layer, not a generic vulnerability-management platform.

## Source-use decision

### Recommended now

Use all three repositories as planning references and benchmark/security architecture inputs.

### Not recommended now

Do not import donor code, models, datasets, containers, dependencies, workflows, or services into active Specification 003.

### Candidate future direct integration

A later specification may independently evaluate:

- optional Magika-compatible local content detection;
- external scanner adapters that normalize AI-Infra-Guard/SARIF output;
- AICGSecEval-inspired repository-level security task manifests.

Each requires fresh source/licensing/security verification at the time of implementation.

## Conclusion

These sources strengthen Delethos most when they are used to improve **proof quality**, not feature count.

The resulting product direction is:

```text
verified delegation
  + content-aware admission
  + security-aware agent/tool admission
  + hybrid deterministic security guards
  + normalized provenance-bound findings
  + proof-carrying patches
  + reproducible repository-level security evaluation
```

That combination remains consistent with Delethos's existing thesis: agents may propose and execute, but correctness-sensitive trust transitions remain deterministic, bounded, inspectable, and evidence-backed.
