# Delethos Architecture

**Status:** founding candidate  
**Authority:** descriptive architecture under Specification 000; implementation requires a later active product specification.

## 1. Architectural goal

Delethos must make a multi-agent coding workflow more trustworthy without becoming the repository's new source of truth. Git remains the authoritative change substrate; Delethos coordinates execution around it and emits evidence about what happened.

The architecture separates five concerns that must not collapse into one opaque orchestrator:

1. **Intent and policy** — what is allowed, required, bounded, and escalated.
2. **Execution** — how an external coding agent is discovered and invoked.
3. **Isolation and supervision** — where the process runs and how it is stopped/recovered.
4. **Verification and review** — what deterministic checks and independent judgments are required.
5. **Evidence** — how observations are bound to exact repository/run state.

## 2. High-level system

```text
                         user / calling agent
                                |
                                v
                    +------------------------+
                    |   CLI / TUI / Skill    |
                    +-----------+------------+
                                |
                                v
                    +------------------------+
                    |  Intent + Policy Core  |
                    | risk / eligibility /   |
                    | bounds / review rules  |
                    +---+----------------+---+
                        |                |
                dispatch|                |guard plan
                        v                v
              +----------------+  +----------------+
              | Adapter Layer  |  | Guard Engine   |
              +-------+--------+  +--------+-------+
                      |                    |
                      v                    |
              +----------------+           |
              | Run Supervisor |<----------+
              | process/state  |
              +-------+--------+
                      |
                      v
              +----------------+
              | Worktree/FS    |
              | isolation      |
              +-------+--------+
                      |
          +-----------+-----------+
          |                       |
          v                       v
  +----------------+      +----------------+
  | Implementer    |      | Independent    |
  | execution      |      | reviewer run   |
  +--------+-------+      +--------+-------+
           |                       |
           +-----------+-----------+
                       v
              +----------------+
              | Evidence Core  |
              | bind + verify  |
              +-------+--------+
                      |
                      v
              proof-carrying patch
```

## 3. Architectural layers

### 3.1 Contracts

Versioned data contracts are the most stable boundary. Candidate namespaces:

```text
delethos.task.v1
delethos.policy.v1
delethos.adapter-capabilities.v1
delethos.run.v1
delethos.event.v1
delethos.review.v1
delethos.guard-result.v1
delethos.evidence.v1
```

A versioned contract is not considered stable merely because a type exists. Stability requires fixtures, compatibility tests, documented semantics, and migration policy.

### 3.2 Core state machine

The core owns deterministic transitions and rejects impossible or unauthorized transitions.

Runtime states:

```text
QUEUED
  -> PREPARING
  -> RUNNING
  -> WAITING
  -> REVIEW_REQUIRED
  -> CHANGES_REQUIRED
  -> VERIFIED

Exceptional terminal/side states:
STALLED | TIMED_OUT | FAILED | CANCELLED
```

Transitions must carry reason/evidence references. `STALLED` is not inferred solely from wall-clock age; it requires a provider/runtime-specific or generic productive-activity signal defined by the supervisor contract.

### 3.3 Policy engine

Policies compile user intent and repository configuration into deterministic requirements such as:

- eligible adapter capabilities;
- writable/read-only execution posture;
- allowed change paths;
- required guards;
- independent-review requirement;
- retry/repair limits;
- timeout/stall thresholds;
- human approval points;
- forbidden operations.

Convenience presets (`fast`, `safe`, `deep`, later `ui`) are user experience aliases that compile to explicit policy. The preset name itself is never evidence.

### 3.4 Adapter layer

Adapters translate Delethos run requests into real external CLI invocations and normalize observations back into Delethos events/results.

Adapters do not own global policy and must not silently widen authority.

Candidate interface shape:

```ts
interface AgentAdapter {
  discover(): Promise<AgentInstallation[]>;
  capabilities(target: AgentInstallation): Promise<CapabilityReport>;
  run(request: RunRequest): AsyncIterable<AgentEvent>;
  resume?(request: ResumeRequest): AsyncIterable<AgentEvent>;
  cancel(run: RunIdentity): Promise<CancelResult>;
  health?(target: AgentInstallation): Promise<HealthReport>;
}
```

The final interface is not authorized by this document; the semantics are the important boundary.

### 3.5 Run supervisor

The supervisor owns process lifecycle, output capture, cancellation, timeout, stall detection, child-process cleanup, and final process/result observations.

Key requirements:

- explicit child process ownership;
- no orphan processes after controlled termination;
- provider-specific signals may augment generic supervision but must be version/format aware;
- timeout and stall are distinct;
- partial working-tree changes survive as inspectable evidence unless policy explicitly requires rollback;
- a lost agent summary does not erase an observable diff.

### 3.6 Worktree and filesystem isolation

Default mutable execution should use a dedicated Git worktree when the repository supports it.

A worktree boundary prevents ordinary branch collisions but is not a security sandbox. Documentation and UI must preserve that distinction.

Future stronger modes may include OS sandboxing or containers, but only after explicit threat-model and platform evidence. Delethos must not promise containment stronger than the selected mechanism actually enforces.

### 3.7 Guard engine

Guards are deterministic checks. Examples may include:

- allowed-path/change-surface verification;
- repository cleanliness/preconditions;
- format/lint/type/test commands declared by repository policy;
- generated-file or lockfile restrictions;
- security/policy checks;
- evidence schema verification.

Agent reviews are not deterministic guards and should be stored separately.

### 3.8 Independent review

Review receives a snapshot of the exact candidate diff and relevant bounded context. A review policy may require a distinct adapter/execution identity from the material implementer.

Possible result vocabulary:

```text
PASS
CHANGES_REQUIRED
ABSTAIN
UNAVAILABLE
FAILED
```

`UNAVAILABLE` and `ABSTAIN` are never PASS.

### 3.9 Evidence core

Evidence binds observations to:

- repository identity;
- base revision;
- observed change/diff digest;
- task/policy revision;
- implementer execution identity;
- reviewer execution identity where required;
- guard definitions/results;
- timestamps/durations as observations, not ordering authority;
- result status;
- unresolved risks/limitations.

The evidence verifier must distinguish:

- structural/schema validity;
- digest/provenance binding;
- required guard completeness;
- independent-review condition;
- final verification status.

### 3.10 Bench and routing

Routing initially should be policy/eligibility driven, not pseudo-intelligent. Adaptive routing becomes authorized only after Delethos can collect reproducible local outcome data without turning noise into false precision.

Bench should evaluate dimensions separately rather than collapse everything into one secret score. Candidate dimensions:

- successful bounded completion;
- change-surface accuracy;
- guard pass rate;
- reviewer defect discovery;
- repair success;
- stall/timeout rate;
- latency;
- platform reliability.

Cost/usage dimensions are included only when providers expose trustworthy machine-readable data or the methodology clearly labels estimates.

## 4. Proposed repository structure

The future product repository is expected to evolve toward a structure similar to:

```text
apps/
  cli/
  tui/
packages/
  contracts/
  core/
  policy/
  runtime/
  worktree/
  guards/
  evidence/
  adapter-sdk/
  adapters/
  bench/
skills/
  delethos/
specs/
docs/
  adr/
  research/
  evidence/
fixtures/
tests/
```

This is a directional boundary, not permission to scaffold every directory during Specification 000.

## 5. Data and state separation

Delethos must distinguish:

### Durable project decisions

Examples:

- public API compatibility is mandatory;
- generated files must not be manually edited;
- preferred default guard command;
- security-sensitive directories require stronger review.

### Volatile repository truth

Examples:

- current branch/head;
- current file content;
- current CI status;
- current dependency version;
- current open PR state.

Volatile facts must be re-derived at execution time. Persisted state may reference the revision at which it was observed but cannot silently masquerade as current truth.

## 6. Failure model

Delethos treats failure as structured state, not an exception to hide.

Representative failure classes:

- adapter missing/auth failure;
- unsupported capability;
- precondition violation;
- dirty/conflicting worktree;
- process launch failure;
- productive execution stall;
- wall-clock timeout;
- agent-reported failure;
- guard failure;
- scope/change-surface violation;
- reviewer changes required;
- reviewer unavailable;
- repair budget exhausted;
- evidence binding failure;
- cleanup/recovery failure.

A failure may leave a useful candidate diff. The system should preserve inspectability and recovery instructions rather than delete evidence automatically.

## 7. Portability boundary

The open contracts and verifier must remain usable without a Delethos cloud service. Optional hosted services may later provide collaboration, fleet dashboards, shared policy distribution, or aggregate analytics, but they must not redefine local proof semantics.

## 8. Technology direction

Preferred initial direction:

- Node.js 24+ runtime target;
- TypeScript;
- pnpm workspace/monorepo only when product scaffolding is authorized;
- Vitest or equivalent test tooling only after dependency justification;
- JSON-compatible versioned contracts;
- terminal-first CLI/TUI;
- minimal core runtime dependency surface.

The project should resist premature Electron/Desktop scope. A web dashboard may later be generated from the same run/evidence model if user evidence justifies it.

## 9. Architecture acceptance questions

Every product spec should answer:

1. Which layer owns the behavior?
2. Is the behavior deterministic or probabilistic?
3. What exact authority does it need?
4. What is the failure/recovery boundary?
5. What evidence proves the acceptance condition?
6. Does it widen adapter or provider trust?
7. Does it add a dependency or platform assumption?
8. Can the behavior be independently reproduced or verified?
