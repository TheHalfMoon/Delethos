# Source Adoption Matrix — 2026-09-08

**Status:** program-level source-selection research; non-authoritative for product implementation  
**Canonical Delethos base:** `340f25358e88044960960fd9ab0468f0b826458b`  
**Founder authorization:** `docs/research/FOUNDER_SOURCE_USE_AUTHORIZATION_2026-09-08.md`  
**Purpose:** convert Delethos's broad donor/source landscape into explicit selective-adoption decisions.

## Decision model

The Founder-provided source-use authorization removes an unnecessary clean-room constraint, but it does not make every donor architecture desirable.

Every source is classified using these actions:

- **COPY** — substantial source/fixtures may be copied when an active specification authorizes the destination;
- **ADAPT** — copy/port a bounded implementation pattern but reshape it around Delethos contracts;
- **DERIVE FIXTURES** — turn observed source behavior into conformance tests/fixtures rather than importing runtime code;
- **REFERENCE** — preserve as design guidance only;
- **DEFER** — potentially useful, but current dependency/product cost is higher than value;
- **REJECT** — explicitly avoid the pattern because it conflicts with Delethos's product/trust model.

No row below activates implementation.

---

## Priority 0 — Delethos-native invariants that donors must not replace

These remain Delethos-owned even when donor code is reused:

1. canonical repository truth;
2. deterministic run/spec state transitions;
3. bounded authority compilation;
4. exact-base/exact-diff binding;
5. independent-review identity semantics;
6. `STALLED != TIMED_OUT != FAILED`;
7. human merge authority by default;
8. proof-bundle verification semantics;
9. missing/unavailable evidence never becoming PASS;
10. live truth remaining distinct from durable context;
11. adapter capability claims requiring Delethos conformance;
12. active-spec execution authority.

A donor implementation may supply a primitive under these invariants. It may not redefine them.

---

# A. Delegation and coding-agent adapter sources

## `amElnagdy/delegate-skills`

**Snapshot inspected:** `b781ee2e23089630e2fbee1cfd6174afe4edeb76`  
**Observed license:** MIT  
**Primary decision:** **COPY + DERIVE FIXTURES**

### High-value copy candidates

1. **CLI-specific relay edge cases** from the individual delegate skills.
2. **Argument compilation patterns** for real coding-agent CLIs where they match Delethos's shell-free/security contract.
3. **Session/resume fixtures** and provider-output parsing fixtures.
4. **Full stderr run-artifact capture** patterns; the inspected head explicitly fixes persistent full stderr capture for Codex runs.
5. **Run-directory artifact layout ideas** such as bounded events/stderr/result separation.
6. **Agent-specific installation/discovery notes** as source-derived conformance fixtures.
7. **Broad adapter corpus** as research input for Specification 008 expansion.
8. **Skill packaging examples** for Specification 010.

### Do not copy wholesale

- the relay's full orchestration semantics;
- any `shell: true` compatibility workaround without a Delethos-specific security decision;
- prompt-level safety assumptions as enforcement;
- per-agent duplicated logic when Delethos can normalize it behind one contract.

### Why

This repository is most valuable as a **real-world compatibility corpus**, not as the Delethos state machine.

### Target specifications

- Spec 003: source-derived fixtures only when a canonical amendment explicitly authorizes them;
- Spec 008: major adapter expansion;
- Spec 010: skill packaging;
- Spec 012: community adapter conformance.

---

## `openai/codex`

**Current Delethos relationship:** active Specification 003 source-of-truth reference for the Codex adapter candidate.  
**Primary decision:** **DERIVE FIXTURES + ADAPT narrow source logic**

### High-value adoption candidates

- exact CLI option/schema behavior;
- JSONL/event parsing fixtures;
- package/platform-resolution behavior;
- sandbox/config-isolation behavior tests;
- provider session/result schemas when public source makes them deterministic;
- source-derived negative cases that protect against upstream behavior drift.

### Boundary

Do not vendor the Codex runtime or replace Delethos with Codex internals. The adapter boundary exists specifically so Codex remains an external execution domain.

### Target

Specs 003 and 008.

---

## `earendil-works/pi`

**Pinned source already used by Specification 003 amendments:** `b79e4cc834970cca69daebffab7df1da7d1e52c4` in current source references.  
**Primary decision:** **DERIVE FIXTURES + ADAPT parser/protocol logic**

### High-value candidates

- tool-call continuation semantics;
- structured event/output parsing;
- source-derived ToolResult lineage fixtures;
- model/provider request shaping behavior;
- print/JSON mode protocol fixtures.

### Boundary

Pi source can strengthen provider-path qualification but must not become a hidden dependency of the core Delethos adapter contract unless separately justified.

---

## `anomalyco/opencode`

**Pinned active-spec source:** version `1.18.26`, tag commit `774cc7c1914e4329eefde5a669f938b0cf566661`.  
**Primary decision:** **DERIVE FIXTURES + ADAPT schema validation logic**

### High-value candidates

- sanitized-export structural schemas;
- user/assistant lineage semantics;
- provider/model identity fields;
- session/export fixtures;
- compaction/internal-message negative cases;
- exact configuration-isolation behavior.

### Boundary

Do not copy broad OpenCode orchestration/session architecture into Delethos merely because it is available. Its session model is useful evidence for the OpenCode adapter; Delethos's own run/evidence model remains separate.

---

# B. Harness and runtime architecture sources

## `deepseek-ai/deepseek-harness`

**Snapshot inspected:** `c389f96bf3a9b6807cb71ed6bdad5849be0df6d8`  
**Observed license:** MIT  
**Primary decision:** **ADAPT + COPY selected primitives**

### Highest-value candidates

1. **Durable long-running job abstraction**
   - separate job identity from final agent result;
   - bounded output reads;
   - explicit wait/timeout behavior;
   - status appended to output rather than inferred from text.
2. **Command/event log versus projections**
   - immutable/durable events as factual history;
   - UI/session projections derived from those events;
   - projections are replaceable views, not canonical evidence.
3. **Tool execution contracts**
   - stable call IDs;
   - execution input/output typing;
   - owner/session association.
4. **Hook execution containment**
   - bounded hook timeouts;
   - detached-run semantics where appropriate;
   - bounded stderr summaries.
5. **Workflow-run event records**
   - run-start / agent-start / tool/result lifecycle separation.
6. **Plugin boundary lessons**
   - capability surfaces can remain modular without making every core invariant a plugin.

### Copy candidates

Only small dependency-light primitives whose dependency graph can be severed cleanly from the donor framework.

### Explicit rejects

- adopting the entire harness/plugin runtime as a Delethos dependency;
- making Cordis/plugin-container semantics part of Delethos's public core contract;
- transferring model/provider truth from harness internals into Delethos evidence without qualification.

### Target specifications

- Spec 004: review/repair jobs and durable lifecycle;
- Spec 005: guard jobs and evidence events;
- Spec 006: event-driven UX;
- Spec 007: projections/history;
- Spec 012: plugin ecosystem.

---

## `chaitanyagiri/munder-difflin`

**Snapshot inspected:** `3e4f9f62a0f219b45f6428fd62f1a8a546d0f607`  
**Observed license:** MIT  
**Primary decision:** **ADAPT**

### High-value candidates

- append-oriented event-log UX;
- stable machine identity separated from human-facing display names;
- terminal/process visibility patterns;
- worktree status/reclamation UX;
- mailbox/message concepts for future bounded inter-agent communication;
- plain-file local observability;
- visible active/retired agent state;
- evidence-rich onboarding and state presentation.

### Strong lesson

The source demonstrates that orchestration becomes understandable when live state is visible. Delethos should copy **observability patterns**, not the fictional-office product metaphor.

### Explicit rejects

- Electron/desktop as a core requirement;
- perpetual "forever-running team" semantics;
- a god-agent becoming correctness authority;
- shared memory/mailbox state overriding live repository truth;
- agent persona/theater as a prerequisite for the first useful run.

### Target

Specs 006, 007, 011, 014.

---

## `ruvnet/ruflo`

**Snapshot observed by current source search:** `384b92398673a0f4db8c517a0f1447db52577514`  
**Primary decision:** **ADAPT selected governance/registry primitives; DEFER swarm breadth**

### Highest-value candidates

1. **Capability-state vocabulary**

A capability should not be one boolean. Distinguish states such as:

```text
registered
configured
reachable
healthy
authorized
qualified
```

Delethos should adapt this into its own deterministic capability-state model rather than treating discovery as support.

2. **Live capability registry**

A machine-readable registry of commands/adapters/skills/plugins/risk/authority can power doctor, routing, and explainability.

3. **Plugin supply-chain integrity**

Ruflo documents detached signature verification over plugin manifests. Delethos should shape an equivalent open signature/provenance layer for its future registry rather than trusting registry presence.

4. **Cross-platform verification manifests**

The donor maintains Linux/macOS/Windows verification surfaces. Delethos can borrow the manifest discipline for adapter/plugin qualification.

### Explicit rejects/defer

- swarm breadth as an early differentiator;
- centralized "brain" becoming hidden authority;
- memory systems that blur durable decisions with live repository facts;
- IPFS or a specific registry transport becoming mandatory.

### Target

Specs 006–009 and 012–013.

---

# C. Skill/plugin ecosystem and distribution sources

## `wshobson/agents`

**Snapshot observed:** `a30778f8c4e6b0a87567941b7cca4f534bf642b6`  
**Primary decision:** **COPY/ADAPT generation architecture**

### Highest-value candidate: single-source authoring

The donor's architecture keeps canonical plugin content under one source location and generates harness-specific artifacts through adapters, with CI gates against registry drift.

Delethos should adopt the same principle:

```text
canonical Delethos skill/plugin definition
  -> deterministic harness adapters
  -> generated Claude/Codex/Cursor/OpenCode/etc packaging
  -> drift check
```

This is materially better than maintaining multiple hand-edited copies.

### Additional candidates

- namespace rules;
- generated registry discipline;
- cross-harness capability documentation;
- adapter-specific manifest emitters;
- contribution validation/generation commands.

### Boundary

Generated harness files are packaging outputs, not independent truth.

### Target

Specs 008, 010, 012.

---

## `anthropics/skills`

**Snapshot observed:** `41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f`  
**Primary decision:** **REFERENCE + COPY compatible fixtures/examples**

### Candidates

- `SKILL.md` interoperability fixtures;
- frontmatter/metadata examples;
- progressive-reference loading patterns;
- model/tool compatibility documentation patterns;
- harness-native skill organization.

### Boundary

Anthropic-specific behavior must remain an adapter/packaging concern; the Delethos skill contract must stay vendor-neutral.

---

## `vercel-labs/skills`

**Snapshot observed:** `1682051d48c34f5eb135e6475c1a965dce05e820`  
**Primary decision:** **ADAPT installer/discovery UX**

### Candidates

- `skills init`-style scaffolding;
- low-friction install/update UX;
- plugin-manifest discovery;
- validation of `SKILL.md` name/description metadata;
- multiple source/registry discovery patterns.

### Security correction Delethos must add

Discovery/install convenience must be preceded by source identity, content/security admission, permission presentation, and explicit activation. Remote discovery is not execution authority.

### Target

Specs 010 and 012.

---

## `obra/superpowers`

**Snapshot inspected:** `b36e0829c6d0140e93cfef2ca599b1b07d4a7797`  
**Primary decision:** **COPY/ADAPT methodology skills and pressure tests; do not move truth into prompts**

### High-value candidates

- verification-before-completion discipline;
- requesting/receiving code review workflows;
- systematic debugging;
- worktree workflow pressure handling;
- falsifiable test discipline;
- behavioral rather than grep/text-presence tests for skills/prompts;
- rationalization/pressure-test fixtures;
- cross-harness packaging lessons.

### Very important adoption rule

Delethos can copy pressure-tested instructions as **methodology**, but any condition that controls `VERIFIED`, authority, scope, review identity, or evidence must also exist in deterministic core policy.

### Target

Specs 004–006 and 010.

---

## `nrslib/takt`

**Snapshot observed:** `8d1274cd841f546433f9d3d1d002f4583f15b88d`  
**Primary decision:** **ADAPT bounded declarative workflow syntax**

### Candidates

- reusable step definitions;
- roles/phases/judgments/feedback-loop vocabulary;
- explicit human intervention points;
- persisted reports/logs/context/task state;
- workflow fragment expansion before validation.

### Delethos adaptation

A future convenience workflow format should compile into the deterministic Delethos run/policy state machine. User-authored workflow syntax must never bypass policy validation or create arbitrary authority.

### Target

Specs 007 and 012; possibly later than initial v1 if complexity is not justified.

---

# D. Security, content, and benchmark sources

## `google/magika`

**Snapshot inspected:** `26b6a9ba7e92f2b0a3745970a9190ec0dde9bf83`  
**Observed license:** Apache-2.0  
**Primary decision:** **ADAPT confidence/abstention semantics; DEFER mandatory model dependency**

### Candidates

- confidence-threshold logic;
- predicted-type versus accepted-type distinction;
- generic/unknown fallback behavior;
- content-type fixtures;
- optional local detector adapter;
- threshold calibration tests.

### Preferred architecture

Define a Delethos content-observation contract first. Magika can later be one implementation of that contract, not the contract itself.

### Reject

- extension-based truth;
- forcing low-confidence predictions into specific labels;
- a mandatory ML/model dependency in the core before measured value justifies it.

### Target

Specs 005, 009, 013.

---

## `Tencent/AI-Infra-Guard`

**Snapshot inspected:** `e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c`  
**Observed license:** Apache-2.0  
**Primary decision:** **COPY/ADAPT deterministic pre-scan/taxonomy/SARIF components; REFERENCE probabilistic scanner authority**

### High-value candidates

- SkillTrustBench T01–T09 risk taxonomy;
- deterministic pre-scan rules where dependency-light and auditable;
- bytecode/charset-smuggling fixture ideas;
- MCP tool-risk controls;
- tool hijacking/spoofing fixtures;
- command-injection / credential-exfiltration / remote-payload fixtures;
- SARIF formatting/interoperability logic;
- CI-compatible local scan patterns.

### Boundary

LLM-driven findings remain probabilistic advisory evidence unless independently confirmed by deterministic/dynamic guards. The chosen LLM must never self-certify a security PASS.

### Target

Specs 005, 009–013.

---

## `Tencent/AICGSecEval`

**Snapshot inspected:** `94428ebf45141bf4ecd365a51d596dcd51caa690`  
**Framework license snapshot:** Apache-2.0 with bundled third-party notices  
**Primary decision:** **COPY/ADAPT benchmark harness/schema; separately qualify datasets/images**

### High-value candidates

- CVE task metadata schema:
  - repository;
  - vulnerable base commit;
  - patch commit;
  - vulnerable file/lines;
  - CWE;
  - severity;
  - container image;
  - status/test/PoC commands;
- static + dynamic evaluation separation;
- exact repository-base checkout discipline;
- containerized test execution patterns;
- agent benchmark invocation/evaluation structure;
- result aggregation and failure visibility.

### Critical boundary

Framework permission does not automatically authorize every embedded CVE dataset, upstream repository snapshot, container image, test fixture, or model output for redistribution. Import them only through a per-artifact rights/provenance gate.

### Target

Specs 009 and 013–014.

---

# E. Visual proof and launch-quality sources

## `cathrynlavery/diagram-design`

**Snapshot observed:** `d0a0f46424e0880a52ddcf7833f7485b1e7f720a`  
**Primary decision:** **ADAPT artifact-quality gates**

### Candidates

- visual artifact generation gates;
- screenshot freshness verification;
- accessibility linting;
- source-to-preview digest binding;
- deterministic docs/routing sync checks;
- explicit quality budgets.

### Delethos use

Apply these ideas to evidence cards, README demonstrations, workflow diagrams, and launch screenshots so public visual claims remain bound to real canonical examples.

---

## `tt-a1i/archify`

**Snapshot observed:** `920543baa1c6137803c5b45a69d8977152773d35`  
**Primary decision:** **ADAPT real-render verification discipline**

### Candidates

- real-browser validation for visual artifacts when static checks are insufficient;
- generated-output restraint;
- authoritative-input versus generated-artifact separation;
- export fidelity checks.

### Target

Specs 006, 011, 014.

---

# F. Internal governance sources

## `TheHalfMoon/SpecGrain`

**Primary decision:** **COPY freely where it strengthens bounded planning/provenance**, while keeping Delethos vocabulary product-specific.

Candidates:

- source qualification ledgers;
- bounded task shaping;
- authority/reconciliation patterns;
- evidence-first planning templates;
- progressive refinement.

---

## `TheHalfMoon/Diffcipline`

**Primary decision:** **COPY freely where it strengthens verification/review/merge discipline**.

Candidates:

- exact-head qualification;
- risk-scaled review;
- proof-before-done checks;
- claim/evidence separation;
- residual-risk reporting;
- public comparison methodology.

---

# G. Explicit source-adoption gaps found in Delethos

The existing Delethos plan is strong on runtime authority and evidence but was missing a durable code-reuse operating model. The following gaps should be closed through later authorized specifications.

## G1 — No machine-readable source BOM

Need a repository-owned source provenance manifest that can map copied units to exact upstream revisions and local paths.

## G2 — No automatic third-party notice synthesis/check

Material copied code needs a deterministic notice/attribution gate.

## G3 — No upstream drift policy per copied unit

Every adopted unit needs one of:

```text
PINNED_NO_SYNC
PERIODIC_RECONCILE
SECURITY_ONLY_RECONCILE
TRACK_UPSTREAM
FORKED_INTENTIONALLY
```

## G4 — No source-derived regression corpus

Behavior learned from donor code should become executable fixtures so future Delethos changes cannot silently regress it.

## G5 — No capability-state ontology beyond support status

Discovery, configuration, reachability, health, authorization, qualification, and tier are distinct facts.

## G6 — No canonical-source/generated-harness split for skills/plugins

Multi-harness packaging would otherwise create drift-prone duplicate files.

## G7 — Event history versus derived projections is not yet explicit enough

A future event ledger should be append-oriented; TUI/dashboard projections should be rebuildable from canonical evidence/events.

## G8 — Long-running review/guard/tool jobs lack a dedicated future contract

Repair/review/security scans may outlive one adapter response and need explicit job IDs, bounded output, cancellation, timeout, and evidence binding.

## G9 — Plugin/Skill/MCP discovery does not yet have a full admission pipeline

Need identity -> content observation -> provenance -> permission request -> security findings -> activation decision.

## G10 — Benchmark data rights are not modeled at artifact granularity

Framework license is insufficient for mixed-origin datasets, containers, CVE repositories, or model artifacts.

## G11 — No copied-code security review gate

Permission to copy does not prove the copied unit is safe. Imported code requires the same or stronger security review as new code.

## G12 — No dependency-closure check for copied files

A seemingly small copied module may drag a framework. Adoption planning must measure dependency closure before approving the unit.

## G13 — No donor-assumption stripping test

Copied code may contain telemetry, paths, environment variables, user-home assumptions, cloud endpoints, provider defaults, or shell behavior inconsistent with Delethos.

## G14 — No provenance-preserving code transformation report

When copied source is adapted, reviewers need to see what was retained, changed, and intentionally dropped.

## G15 — No visual-evidence freshness gate

README/demo screenshots can become stale and silently overstate current behavior.

## G16 — No plugin/registry signature policy

A future ecosystem needs artifact identity and signing/provenance before installation can be treated as trusted.

## G17 — No generated-registry drift gate

A future adapter/skill registry must fail CI when generated surfaces diverge from canonical definitions.

## G18 — No source reuse maintenance budget

Every copied unit creates future ownership. The plan needs an explicit maintenance owner and reconciliation cost before adoption.

---

# H. Ranked adoption sequence

The best use of the Founder's permission is **not** to import the most code. It is to import the highest-leverage tested behavior in dependency order.

## Wave 1 — strengthen the current wedge

When active specs authorize it:

1. source-derived CLI/adaptor fixtures from delegate-skills and upstream CLI source;
2. stderr/run-artifact robustness patterns;
3. Superpowers verification/review pressure-test fixtures;
4. durable review/guard job and event/projection primitives inspired by DeepSeek Harness;
5. source BOM + provenance/notice gate before substantial copying begins.

## Wave 2 — eliminate ecosystem duplication

1. single-source skill/plugin definitions;
2. deterministic harness-specific generation;
3. registry drift checks;
4. richer capability-state ontology;
5. low-friction installer/scaffolding UX with security admission.

## Wave 3 — security proof spine

1. content observation/abstention contract;
2. optional Magika provider;
3. AI-Infra-Guard-derived deterministic/security fixtures;
4. normalized finding + SARIF bridge;
5. signed plugin/skill provenance.

## Wave 4 — reproducible security benchmark

1. AICGSecEval-style task schema;
2. disposable container/VM execution;
3. exact base/patch/CWE/PoC provenance;
4. static + dynamic + probabilistic evidence separation;
5. public benchmark reproduction bundles.

## Wave 5 — launch-quality proof

1. real event-driven TUI views;
2. shareable evidence cards;
3. screenshot/preview freshness gates;
4. independently reproducible launch examples.

---

# I. Bottom-line decisions

The Founder's broad source-use permission should make Delethos **faster and more battle-tested**, not less coherent.

The strongest direct-reuse opportunities are:

```text
delegate-skills      -> CLI fixtures + relay edge cases + run artifacts
DeepSeek Harness     -> durable jobs + event/projection/tool contracts
Superpowers          -> pressure-tested verification/review methodology
wshobson/agents      -> canonical-source + generated harness adapters
Ruflo                -> capability-state registry + signed plugin ideas
AI-Infra-Guard       -> deterministic security fixtures + taxonomy + SARIF
AICGSecEval           -> benchmark schema + isolated static/dynamic evaluation
Magika                -> confidence/abstention semantics + optional detector
Munder Difflin        -> observable run/worktree/event UX
diagram-design/archify-> public artifact freshness + real-render verification
```

The strongest explicit non-adoptions are:

```text
full donor orchestrator state machines
unbounded swarm/forever-running-team semantics
mandatory desktop/Electron core
mandatory donor plugin framework
LLM scanner as security authority
registry presence as trust
copied capability claims without Delethos qualification
remote code/skill execution during discovery
framework-wide copying merely because permission exists
```

This matrix should be revalidated against live donor heads at the moment a future implementation specification selects a concrete copied unit.
