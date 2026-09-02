# Specification 003 Amendment 006 — OpenCode Recovery Feasibility Probe

**Status:** `NORMATIVE` iff this amendment is present on canonical `main` while Specification 003 is active.  
**Evidence date:** 2026-09-02  
**Scope:** reconcile the completed Amendment 005 recovery frontier and authorize one additional no-secret, no-model-inference, provider-free hosted feasibility observation for OpenCode. This amendment does not replace a selected Gold candidate, does not authorize a new adapter implementation, and does not promote any capability or tier.

## Why this amendment exists

Specification 003 remains honestly blocked at the real-Gold gate.

The canonical selected pair is still:

```text
openai-codex-cli
anthropic-claude-code
```

The remaining Codex Gold cases require authenticated/provider-backed execution that canonical evidence does not currently possess. Actual hosted Claude execution remains governed by the separate vendor-use/provenance gate and is not authorized by ordinary founder approval alone.

Amendment 005 therefore authorized a bounded provider-free recovery-feasibility probe before any candidate-replacement decision. The corrected canonical run:

```text
revision = 916a1a580dd60ae621de187827fc6e58d552870c
run = 33624424220
```

established:

```text
pi-coding-agent v0.84.4
  linux/x64   = PASS
  macos/arm64 = PASS
  windows/x64 = PASS

github-copilot-cli v1.0.82
  linux/x64   = FAIL / UNSUPPORTED_SURFACE(configuration isolation)
  macos/arm64 = FAIL / UNSUPPORTED_SURFACE(configuration isolation)
  windows/x64 = FAIL / UNSUPPORTED_SURFACE(configuration isolation)
```

The exact evidence is recorded in `evidence-gold-recovery-probes-2026-09-02.md`.

Pi therefore satisfies only the Amendment 005 prerequisite for deeper recovery shaping. It does not become selected or Gold. A viable Specification 003 recovery still needs evidence for a second candidate because the specification requires a two-candidate Gold pair.

## Why OpenCode is the next bounded candidate

Specification 003 research originally deferred OpenCode primarily because a provider-neutral agent creates a composite execution-identity problem: `OpenCode` alone is not sufficient identity when the actual provider/model can vary.

That is no longer an unresolved contract-level reason to avoid feasibility observation. The canonical Specification 003 identity contract already requires adapter, provider, and model facts to remain distinct and explicitly prohibits collapsing requested identity into observed identity.

Fresh public evidence on 2026-09-02 also shows that current OpenCode retains a strong automation surface while exposing provider/model identity explicitly.

The current repository is:

```text
anomalyco/opencode
```

and the current immutable release observed for this amendment is:

```text
v1.18.26
published = 2026-09-01
```

Current source for `opencode run` establishes:

- non-interactive execution as the default `run` behavior;
- raw JSON event streaming through `--format json`;
- exact directory selection through `--dir`;
- model selection through `--model` / `-m` using the explicit `provider/model` format;
- session continuation/fork surfaces;
- an explicit permission system whose actions are `ask`, `allow`, and `deny`;
- a dangerous `--auto` posture and hidden dangerous skip-permission aliases that must **not** be treated as positive safety controls by Delethos.

Current configuration source/documentation establishes local isolation controls including:

```text
OPENCODE_CONFIG_DIR
OPENCODE_DISABLE_PROJECT_CONFIG
OPENCODE_PURE
OPENCODE_DISABLE_AUTOUPDATE
```

The project itself uses `OPENCODE_PURE` to suppress external plugin discovery/install in isolated CLI testing, and documents `opencode debug config` as a command that shows resolved configuration.

These facts justify a provider-free machine observation. They do not establish a Delethos adapter, provider success, local-model quality, write safety, Gold, or candidate replacement.

## Pinned public release assets

Only these exact immutable official release assets may be used by the hosted probe authorized below:

```text
linux/x64
  asset = opencode-linux-x64.tar.gz
  sha256 = 7c20c1ffa91bcca0ac903752260bcc36307dff656833baead2f5ef3b224b16c6

macos/arm64
  asset = opencode-darwin-arm64.zip
  sha256 = b05d383149a5a417140e8edebd83064142fa36e74fdfcd5f791919dcb12fd33a

windows/x64
  asset = opencode-windows-x64.zip
  sha256 = c7af81e288dff3cf4378c9f3509208ef8bf060d7109589fee2cd943845d87786
```

No latest-version indirection may substitute for these exact release/version/digest facts in the qualification run.

## Normative precedence

This amendment does not weaken or supersede any existing Gold, credential, vendor-use, process-supervision, review, merge, or closeout gate.

Amendments 001–005 remain controlling for their existing evidence surfaces.

This amendment creates only a narrow evidence-collection exception allowing the already-authorized workflow path:

```text
.github/workflows/ci.yml
```

to perform the provider-free OpenCode feasibility observation defined here after this amendment itself becomes canonical.

The current selected Gold pair does not change because this amendment is shaped, merged, or executed.

## Authorized hosted OpenCode probe

After this amendment is canonical, one separate bounded implementation PR may extend `.github/workflows/ci.yml` with a marker-gated OpenCode recovery observation job.

The job may run only when all of the following are true:

1. the workflow event is a push to canonical `main`;
2. the pushed head commit message contains the exact marker `[opencode-recovery-probe]`;
3. repository permissions remain `contents: read` only;
4. checkout uses `persist-credentials: false`;
5. no repository, environment, organization, provider, vendor, or third-party secret is requested, referenced, injected, enumerated, or inspected;
6. no `id-token: write`, Copilot inference permission, federation permission, or other provider-access permission is granted;
7. no prompt/message is supplied to `opencode run` or any provider-facing command;
8. no provider/model inference, authentication, subscription, billing, OAuth, PAT, API-key, cloud-service, or paid-session request is made;
9. no selected Codex or Claude executable is invoked by this job;
10. the job does not modify the repository, create Git refs, upload evidence artifacts, publish packages, create releases, or call repository mutation APIs;
11. candidate stdout/stderr remains bounded and only the required machine-readable facts are emitted into the trusted workflow log;
12. every unexpected network/provider/auth interaction, integrity failure, launch failure, timeout, cleanup failure, unsupported required surface, or repository mutation becomes `FAIL` or `UNVERIFIED`, never PASS.

## Authorized candidate and matrix

The probe may observe only:

```text
candidate_id = opencode
candidate_version = 1.18.26
```

on:

```text
linux/x64
macos/arm64
windows/x64
```

No other OpenCode version, build, desktop package, nightly artifact, or third-party package is authorized by this unit.

## Materialization and integrity

For each platform, the implementation must:

1. create a fresh candidate-specific temporary root outside the repository;
2. download only the exact official pinned asset above;
3. bound the public release download duration;
4. verify the exact pinned SHA-256 digest before extraction or executable launch;
5. extract according to the actual archive format using a platform-appropriate non-interactive system extractor;
6. resolve exactly one expected OpenCode CLI executable and reject ambiguity;
7. establish exact `1.18.26` as the first candidate executable observation;
8. use the canonical Specification 002 supervisor for every candidate executable observation so stdin is closed, output is bounded, a hard timeout of at most 15 seconds is enforced, and descendant cleanup follows the qualified cross-platform semantics.

A timeout with unproven complete cleanup is `UNVERIFIED`, never PASS.

## Required isolated environment

Every OpenCode executable observation must run from a newly created temporary working directory that is not the Delethos repository and must use an explicit allowlisted environment.

The isolation posture must include fresh temporary home/config/data/cache/state roots and must set the current exact OpenCode controls needed to suppress ambient project/plugin/update behavior, including at minimum:

```text
OPENCODE_CONFIG_DIR = <fresh temporary config root>
OPENCODE_DISABLE_PROJECT_CONFIG = 1
OPENCODE_PURE = 1
OPENCODE_DISABLE_AUTOUPDATE = 1
```

The implementation may additionally set current documented no-background-work controls when they are needed to prevent nonessential pruning/model metadata/update behavior, but it may not add any provider credential or provider endpoint.

The probe must place a harmless deterministic OpenCode configuration in the isolated config root with at least:

```json
{
  "autoupdate": false,
  "permission": {
    "*": "deny"
  }
}
```

This sentinel configuration exists only to prove local configuration resolution and fail-closed permission-policy representation. It does not authorize model execution.

## Authorized executable observations

The exact version observation must occur first.

After version succeeds, the job may execute only local provider-free inspection surfaces required to establish the fields below, such as:

```text
opencode --help
opencode run --help
opencode debug config
```

with the isolated environment and non-repository cwd defined above.

The job must **not** execute:

```text
opencode run <message>
opencode --mini
opencode serve
opencode web
opencode attach
```

or any equivalent command capable of starting a provider session or interactive agent execution.

The job must never use:

```text
--auto
--yolo
--dangerously-skip-permissions
```

as a Delethos safety or qualification mechanism.

## Required feasibility observations

The implementation may establish only local CLI/configuration facts needed for later recovery shaping:

```text
headless_run_surface_observed
machine_readable_json_surface_observed
cwd_control_surface_observed
composite_provider_model_surface_observed
permission_policy_surface_observed
configuration_isolation_surface_observed
project_config_disable_surface_observed
plugin_install_suppression_surface_observed
auto_update_disable_surface_observed
```

`composite_provider_model_surface_observed = true` requires machine-observed evidence that the exact candidate surface represents model selection in a provider/model form or another equally explicit composite identity. It does not prove that any requested provider/model actually executed.

`permission_policy_surface_observed = true` requires the isolated resolved configuration to preserve the explicit deny policy. The dangerous auto-approval flags are negative evidence only and cannot satisfy this field.

`configuration_isolation_surface_observed = true` requires machine-observed evidence from the exact candidate that the isolated sentinel configuration is the resolved configuration used by the local inspection path. Merely setting an environment variable without observing its effect is insufficient.

## Required record shape

The implementation must emit one bounded record per platform with at least:

```text
source = HOSTED_CLI_FEASIBILITY
candidate_id = opencode
candidate_version = 1.18.26
platform
arch
observation_status = PASS | FAIL | UNVERIFIED
observation_result = COMPLETED | TIMEOUT | LAUNCH_FAILED | INTEGRITY_FAILED | VERSION_MISMATCH | UNSUPPORTED_SURFACE | OTHER_FAILURE
failure_reason = null | <bounded reason>
executable_present
version_exact
help_exit_code
headless_run_surface_observed
machine_readable_json_surface_observed
cwd_control_surface_observed
composite_provider_model_surface_observed
permission_policy_surface_observed
configuration_isolation_surface_observed
project_config_disable_surface_observed
plugin_install_suppression_surface_observed
auto_update_disable_surface_observed
provider_request_made = false | true | UNKNOWN
authentication_attempted = false | true | UNKNOWN
secret_referenced = false | true | UNKNOWN
repository_mutated = false | true | UNKNOWN
```

For `observation_status = PASS`:

- `observation_result` must be `COMPLETED`;
- `failure_reason` must be `null`;
- all required applicable surface fields must be exactly `true`;
- `provider_request_made`, `authentication_attempted`, `secret_referenced`, and `repository_mutated` must be exactly `false`.

If the implementation cannot establish one of the prohibited-action facts without crossing the no-secret/no-provider boundary, it must record `UNKNOWN` and the candidate cannot PASS.

## Evidence effect

A complete PASS matrix may establish only:

```text
OPENCODE_RECOVERY_FEASIBILITY = PASS_CROSS_PLATFORM_PROVIDER_FREE
```

It may make a later evidence-based candidate-replacement amendment eligible for shaping together with the already-canonical Pi feasibility result.

It does not establish:

- OpenCode authentication readiness;
- a usable provider/model;
- local-provider quality;
- provider success or provider failure;
- model/tool reliability;
- bounded write success;
- read-only enforcement;
- forbidden-write behavior;
- provider-run cwd behavior;
- timeout/cancel/stall/tree-cleanup behavior during provider execution;
- Git side-effect safety during provider execution;
- a complete OpenCode adapter contract;
- candidate replacement;
- `SUPPORTED` or `GOLD` status.

## Replacement gate remains separate

Even if OpenCode passes this probe, neither selected Gold candidate changes automatically.

A later replacement amendment must reconcile Pi and OpenCode evidence and independently prove that the proposed pair satisfies every Amendment 005 replacement condition, including:

1. solving the current real blocker rather than expressing preference;
2. preserving adapter/provider/model identity separation;
3. preserving the full real-CLI Gold rigor;
4. retaining authentication-required evidence whenever the chosen provider path requires authentication;
5. never misrepresenting local/provider-free execution as credentialed evidence;
6. retaining Linux/macOS/Windows qualification for the claimed Gold surface;
7. preserving Specification 004 as separately gated;
8. preserving actual license/terms boundaries.

The later amendment must also choose an exact provider/model qualification strategy or explicitly leave that selection gated. Provider neutrality alone is not Gold evidence.

## Required qualification before use

The Amendment 006 shaping PR must:

- change only this amendment document and `evidence-gold-recovery-probes-2026-09-02.md`, unless review-driven correction requires another Specification 003 documentation path;
- pass deterministic Linux/macOS/Windows CI at its exact head;
- reconcile exact base/head/scope, checks, comments, independent reviews, threads, and mergeability;
- preserve unavailable/skipped/rate-limited review systems as non-PASS;
- merge only with expected-head protection;
- require canonical post-merge deterministic Linux/macOS/Windows CI.

Only after those conditions succeed may a separate bounded implementation PR modify `.github/workflows/ci.yml` to add the OpenCode probe.

## Explicit non-authority

This amendment does not authorize:

- candidate replacement;
- an OpenCode or Pi product adapter implementation;
- model inference through OpenCode, Pi, Codex, Claude, GitHub Copilot, Gemini, Ollama, or any other provider;
- creating or accepting a provider subscription;
- creating, reading, enumerating, injecting, or using PATs, API keys, OAuth credentials, cloud identities, repository/environment/organization secrets, or vendor tokens;
- paid usage or consumption of user/vendor quota;
- provider endpoint discovery through ambient credentials;
- dangerous permission bypass flags;
- weakening or deleting any existing real-CLI Gold case;
- Gold promotion;
- terminal Specification 003 closeout;
- Specification 004 activation.

## Completion effect

This amendment can complete only the OpenCode provider-free recovery-feasibility evidence unit.

Specification 003 remains:

```text
ACTIVE_BLOCKED_REAL_GOLD
```

until the selected pair genuinely qualifies, or a later evidence-based canonical replacement amendment changes the pair and the resulting candidates genuinely pass the complete applicable Gold matrix.