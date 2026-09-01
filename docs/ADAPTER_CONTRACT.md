# Delethos Adapter Contract

**Status:** founding candidate  
**Target:** portable adapter semantics; concrete API requires later implementation authority.

## Purpose

Adapters are the boundary between Delethos and external coding-agent CLIs. Their job is to translate a bounded Delethos request into the real CLI's supported invocation model, observe execution, and normalize results without erasing safety-relevant provider differences.

An adapter is not allowed to redefine global Delethos policy, fabricate provider capability, or turn a prompt convention into an enforced sandbox claim.

## Design principles

1. **Capability before dispatch.** Delethos should know what an adapter can actually do before asking it to do it.
2. **Provider semantics remain visible.** Normalization creates interoperability, not fiction.
3. **Fail closed on unsupported configuration.** Unknown flags, impossible model values, contradictory policies, or missing required capability should block the run.
4. **No hidden commits/merges.** Adapter defaults must preserve Delethos authority boundaries.
5. **Cancellation is first-class.** A run that cannot be stopped/reconciled is not a gold adapter.
6. **Resume is optional capability.** It must never be inferred from provider persistence alone.
7. **Read-only is a real capability claim.** Prompting an agent "do not edit" is not equivalent to an enforced read-only posture.
8. **Platform support is evidence-backed.** macOS/Linux/Windows support is recorded independently.

## Candidate capability report

A future adapter capability report may include:

```json
{
  "adapter": "codex",
  "adapterVersion": "...",
  "installation": {
    "binary": "...",
    "cliVersion": "..."
  },
  "capabilities": {
    "headless": "SUPPORTED",
    "workspaceWrite": "SUPPORTED",
    "readOnly": "SUPPORTED",
    "resume": "SUPPORTED",
    "modelSelection": "SUPPORTED",
    "providerSelection": "PARTIAL",
    "machineReadableOutput": "SUPPORTED",
    "usageMetrics": "UNAVAILABLE",
    "nativeSandbox": "PARTIAL",
    "nativeApprovalPolicy": "SUPPORTED"
  },
  "platform": {
    "linux": "VERIFIED",
    "macos": "VERIFIED",
    "windows": "UNVERIFIED"
  }
}
```

Status vocabulary should distinguish at least:

- `SUPPORTED`
- `PARTIAL`
- `UNSUPPORTED`
- `UNAVAILABLE`
- `UNVERIFIED`

A capability can be supported by the CLI yet unverified by the current adapter version/platform; those facts should not be collapsed.

## Candidate interface semantics

Illustrative interface only:

```ts
interface AgentAdapter {
  discover(): Promise<AgentInstallation[]>;
  capabilities(target: AgentInstallation): Promise<CapabilityReport>;
  prepare?(request: RunRequest): Promise<PreparedRun>;
  run(request: RunRequest): AsyncIterable<AgentEvent>;
  resume?(request: ResumeRequest): AsyncIterable<AgentEvent>;
  cancel(run: RunIdentity): Promise<CancelResult>;
  health?(target: AgentInstallation): Promise<HealthReport>;
}
```

### `discover`

Must identify eligible local installations without mutating the repository or requiring untrusted project commands. Discovery should capture enough information to distinguish installations/versions where possible.

### `capabilities`

Must return qualified facts. Adapter code should prefer live CLI help/version/config surfaces and checked-in fixtures over hard-coded marketing assumptions.

### `prepare`

Optional provider-specific validation/translation step. Preparation must be pure with respect to repository mutation unless separately declared and authorized.

### `run`

Launches the real CLI using the selected working directory/isolation posture. Events should expose enough progress to supervise and recover the run without requiring Delethos to parse private reasoning text.

### `resume`

Available only when the provider exposes a tested session/run continuation mechanism. A fresh re-dispatch with previous context is not semantically the same as resume and must use a different path.

### `cancel`

Must attempt provider/process-appropriate termination and report what was actually observed. `cancelled` cannot be claimed if the process tree remains active and unowned.

## Run request requirements

A bounded run request is expected to include:

- task snapshot/digest;
- repository/worktree identity;
- allowed change surface;
- execution posture (`write`, `read-only`, or future policy values);
- model/provider/effort controls only when supported;
- environment allow/deny policy where implemented;
- timeout/stall policy;
- artifact/output limits;
- explicit forbidden operations relevant to the adapter.

Adapters must not silently reinterpret unsupported controls. They return a capability/configuration failure.

## Event requirements

The normalized event stream should not require every CLI to support token-level streaming. Minimum useful categories may include:

```text
started
progress
output
repository_activity
provider_warning
stalled
completed
failed
cancelled
```

Provider-specific metadata may be attached in a namespaced field if needed for recovery/diagnostics.

The event contract should avoid storing hidden chain-of-thought or sensitive provider internals as a requirement.

## Result requirements

A normalized result should preserve:

- adapter/CLI identity and versions;
- run/session identity if exposed;
- process exit observation;
- final provider message if available and safe;
- timeout/stall/cancel/failure distinction;
- usage/cost only when exposed or clearly marked estimated;
- diagnostic artifact references;
- provider-specific limitations needed to interpret the result.

Repository diff/evidence is captured by Delethos from repository truth rather than trusted from the agent result.

## Conformance suite

Before an adapter is presented as gold-supported, it should pass a versioned conformance suite covering applicable cases:

1. discovery and version reporting;
2. missing binary;
3. unauthenticated/invalid auth path;
4. bounded write run;
5. exact working-directory behavior;
6. read-only behavior where claimed;
7. forbidden write negative path where claimed;
8. model/provider selection where claimed;
9. malformed model/provider rejection;
10. normal completion;
11. non-zero/provider failure;
12. wall-clock timeout;
13. productive stall detection/recovery where feasible;
14. cancellation;
15. process-tree cleanup;
16. partial-diff preservation;
17. final-message absence;
18. large/bounded output behavior;
19. special-character/path quoting;
20. resume where claimed;
21. dirty-repository/worktree preconditions;
22. platform-specific launch semantics;
23. no hidden commit/merge side effect;
24. machine-readable result validity.

The final suite will be refined specification by specification.

## Adapter tiers

Candidate public tiers:

### `GOLD`

Passes the full applicable conformance suite on all publicly promised platforms and has maintained capability evidence.

### `SUPPORTED`

Passes core conformance on declared platforms but may not cover every optional capability.

### `EXPERIMENTAL`

Useful integration with explicit unqualified/unstable areas. It must not be shown as equivalent to gold support.

### `COMMUNITY`

External/community-maintained adapter using the open SDK; Delethos core does not imply maintainer endorsement beyond published conformance evidence.

## Adapter provenance

When an adapter is informed by another open-source relay/integration, Delethos must record whether it:

- studied behavior only;
- adapted documentation/contract ideas;
- copied code under license;
- imported fixtures;
- independently reimplemented behavior.

Material donor code requires license notice and attribution.

## Initial adapter selection

The master roadmap intentionally does not canonically lock the first two gold adapters by name. Specification 003 should select them from live evidence using criteria including:

- meaningful real-world adoption;
- distinct provider/execution identity for independent review;
- workable headless execution;
- inspectable repository mutation;
- deterministic launch/cancel behavior;
- licensing and integration feasibility;
- cross-platform relevance.

This prevents the founding plan from turning vendor preference into architectural authority.
