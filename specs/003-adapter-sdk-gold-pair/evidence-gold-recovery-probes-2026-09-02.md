# Specification 003 — Hosted Gold Recovery Probe Evidence

**Evidence date:** 2026-09-02  
**Evidence class:** provider-free hosted CLI feasibility only  
**Authority:** Specification 003 Amendment 005  
**Canonical revision observed:** `916a1a580dd60ae621de187827fc6e58d552870c`  
**Canonical workflow run:** `33624424220`

## Scope

This record reconciles the corrected canonical `main` execution of the Amendment 005 no-inference Gold-recovery probe.

It records only local CLI materialization, exact-version, help/command-surface, configuration-isolation, prohibited-action, and repository-integrity observations for the two Amendment 005 recovery candidates:

```text
github-copilot-cli = v1.0.82
pi-coding-agent = v0.84.4
```

No model prompt, provider request, authentication attempt, subscription/billing action, credential use, paid session, or Gold qualification occurred in this evidence run.

## Canonical execution identity

```text
EVIDENCE_REVISION = 916a1a580dd60ae621de187827fc6e58d552870c
WORKFLOW_RUN = 33624424220
CORE_LINUX_JOB = 100228725384
CORE_MACOS_JOB = 100228725419
CORE_WINDOWS_JOB = 100228725586
RECOVERY_LINUX_JOB = 100228725433
RECOVERY_MACOS_JOB = 100228725202
RECOVERY_WINDOWS_JOB = 100228725491
```

The merge commit carried the exact Amendment 005 trigger marker:

```text
[gold-recovery-probe]
```

The recovery jobs intentionally return a failing job conclusion when any selected candidate produces `FAIL` or `UNVERIFIED`. Therefore the job-level failure is not itself a per-candidate verdict; the bounded machine-readable candidate records below are the canonical evidence facts.

## Deterministic repository matrix

The normal deterministic repository matrix passed on all required platforms at the same canonical revision:

```text
linux/x64   = PASS
macos/arm64 = PASS
windows/x64 = PASS
```

No legacy Codex provider-backed qualification job and no Claude vendor-execution job was activated by this marker.

## Candidate matrix

### `pi-coding-agent v0.84.4`

Canonical provider-free feasibility result:

```text
linux/x64   = PASS / COMPLETED
macos/arm64 = PASS / COMPLETED
windows/x64 = PASS / COMPLETED
```

Each platform machine-observed:

```text
executable_present = true
version_exact = true
help_exit_code = 0
programmatic_surface_observed = true
machine_readable_surface_observed = true
cwd_control_surface_observed = NOT_APPLICABLE
permission_control_surface_observed = true
provider_model_identity_surface_observed = true
configuration_isolation_surface_observed = true
provider_request_made = false
authentication_attempted = false
secret_referenced = false
repository_mutated = false
```

The exact candidate executable was materialized from the Amendment 005 pinned official release asset for each platform and verified against its pinned SHA-256 digest before launch. Exact version was the first candidate executable observation. The only candidate invocations were the authorized provider-free version/help surfaces, with Pi explicitly offline.

This establishes only that `pi-coding-agent v0.84.4` exposes the observed cross-platform local CLI controls required for deeper recovery shaping. It does **not** establish provider/model execution, authentication readiness, model quality, write behavior, read-only enforcement, exact agent cwd behavior under inference, cancellation under provider execution, or Gold.

### `github-copilot-cli v1.0.82`

Canonical provider-free feasibility result:

```text
linux/x64   = FAIL / UNSUPPORTED_SURFACE
macos/arm64 = FAIL / UNSUPPORTED_SURFACE
windows/x64 = FAIL / UNSUPPORTED_SURFACE
```

The exact bounded failure on all three platforms was:

```text
required automation surface not observed: configuration_isolation_surface_observed
```

Each platform nevertheless machine-observed:

```text
executable_present = true
version_exact = true
help_exit_code = 0
programmatic_surface_observed = true
machine_readable_surface_observed = true
cwd_control_surface_observed = true
permission_control_surface_observed = true
provider_model_identity_surface_observed = true
configuration_isolation_surface_observed = false
provider_request_made = false
authentication_attempted = false
secret_referenced = false
repository_mutated = false
```

This is a fail-closed feasibility result. The candidate must not be represented as recovery-qualified merely because its other local automation controls were observed.

## Superseded preliminary run

The earlier canonical recovery run:

```text
revision = 285b85b4651ec4ba8bd5ba6dc1d616e9dfcdd950
run = 33623030612
```

exposed two probe-harness defects:

1. a missing required Copilot configuration-isolation surface could be under-reported as candidate `PASS`;
2. Windows ZIP materialization failed before either candidate could be launched.

Those harness defects were repaired in the exact-head-qualified PR that became canonical revision `916a1a580dd60ae621de187827fc6e58d552870c`. The repaired run `33624424220` is therefore the controlling Amendment 005 candidate-feasibility evidence. The preliminary run remains historical debugging evidence only and must not be used to upgrade a candidate.

## Evidence effect

The canonical evidence frontier created by Amendment 005 is:

```text
PI_RECOVERY_FEASIBILITY = PASS_CROSS_PLATFORM_PROVIDER_FREE
COPILOT_RECOVERY_FEASIBILITY = FAIL_UNSUPPORTED_CONFIGURATION_ISOLATION
CODEX_GOLD = NOT_QUALIFIED
CLAUDE_GOLD = NOT_QUALIFIED
SELECTED_GOLD_PAIR = openai-codex-cli + anthropic-claude-code
SPEC_003_STATUS = ACTIVE_BLOCKED_REAL_GOLD
SPEC_004 = NOT_AUTHORIZED
```

The Pi result satisfies only the Amendment 005 prerequisite for deeper evidence-based recovery shaping. It does not select Pi as a replacement and cannot by itself produce the required two-candidate Gold pair.

The Copilot result does not establish that future versions can never qualify. It establishes only that the exact pinned `v1.0.82` local CLI surface did not prove the required configuration-isolation control under the Amendment 005 probe contract.

## Explicit non-claims

This evidence does not establish or authorize:

- candidate replacement;
- a Pi adapter implementation;
- a GitHub Copilot adapter implementation;
- provider/model inference through either candidate;
- local-model or hosted-model qualification;
- authentication or credential availability;
- `SUPPORTED` or `GOLD` tier promotion;
- dropping any real-CLI Gold conformance case;
- dropping Linux, macOS, or Windows from the Gold matrix;
- Specification 003 terminal closeout;
- Specification 004 activation.

Any successor recovery decision must continue to satisfy the Amendment 005 replacement gate and canonical Specification 003 Gold rigor.