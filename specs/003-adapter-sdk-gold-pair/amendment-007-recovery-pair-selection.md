# Specification 003 Amendment 007 — Evidence-Based Recovery Pair Selection

**Status:** `NORMATIVE` iff this amendment is present on canonical `main` while Specification 003 is active.  
**Evidence date:** 2026-09-02  
**Scope:** replace the Specification 003 selected Gold-candidate pair from current canonical recovery evidence, authorize only the bounded product paths and execution order needed for the replacement candidates, and preserve the complete real-CLI Gold gate. This amendment does not promote any adapter to `SUPPORTED` or `GOLD`, does not authorize model/provider inference by itself, and does not activate Specification 004.

## Why this amendment exists

Specification 003 is correctly blocked at the real-Gold evidence frontier under the currently selected pair:

```text
openai-codex-cli
anthropic-claude-code
```

The blocker is operational and evidence-based rather than a preference change.

For Codex, canonical no-auth evidence proves the bounded discovery/version/platform/auth-failure subset, but the remaining Gold matrix requires provider-backed execution for which canonical Delethos evidence does not establish a usable credentialed environment. Amendment 005 also records that the current official/recommended local Codex path is materially centered on GPT-OSS models and large context requirements; no bounded cross-platform local model/runtime profile has been machine-qualified for the required hosted-execution Gold matrix.

For Claude Code, canonical evidence proves only the separately authorized missing-executable sentinel sub-fact. Actual hosted Claude installation/discovery/execution remains controlled by Amendment 003 and requires a genuine vendor-use/provenance authority chain that ordinary founder approval, technical installability, or public release availability cannot substitute for.

Specification 003 explicitly allows an evidence-based selection amendment when a selected candidate proves unsuitable for the available qualification path. Amendments 005 and 006 then created a narrower replacement gate and machine-observed two candidate/version surfaces specifically to determine whether such a replacement could preserve the original Gold rigor.

That prerequisite is now complete.

## Controlling recovery evidence

### Pi coding agent

Canonical Amendment 005 recovery evidence:

```text
candidate = pi-coding-agent
version = 0.84.4
revision = 916a1a580dd60ae621de187827fc6e58d552870c
workflow_run = 33624424220

linux/x64   = PASS / COMPLETED
macos/arm64 = PASS / COMPLETED
windows/x64 = PASS / COMPLETED
```

Each platform machine-observed the required provider-free programmatic, machine-readable, permission/control, provider/model-identity, and configuration-isolation surfaces while preserving:

```text
provider_request_made = false
authentication_attempted = false
secret_referenced = false
repository_mutated = false
```

The exact candidate/version is MIT-licensed at tag `v0.84.4`. Canonical Amendment 005 also records support for explicit provider/model selection and custom OpenAI-compatible provider configurations, including local-provider configurations. These are shaping facts only; no provider/model execution was qualified by that probe.

### OpenCode

Canonical Amendment 006 implementation merged at:

```text
revision = c14e3a240ec1f537d4b17a399e0444efe7132e51
workflow_run = 33634318642
candidate = opencode
version = 1.18.26
```

The marker-gated canonical-main provider-free observation completed successfully on the required matrix:

```text
linux/x64   job = 100261235001 = PASS / COMPLETED
macos/arm64 job = 100261234749 = PASS / COMPLETED
windows/x64 job = 100261234646 = PASS / COMPLETED
```

Each platform emitted a machine record with all required feasibility fields true:

```text
executable_present
version_exact
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

and all prohibited-action fields false:

```text
provider_request_made = false
authentication_attempted = false
secret_referenced = false
repository_mutated = false
```

The exact candidate/version is MIT-licensed at tag `v1.18.26`. The observation proved only the local CLI/configuration surface; it did not execute `opencode run <message>`, contact a provider, or qualify a model.

### Rejected recovery comparator

The exact GitHub Copilot CLI recovery candidate from Amendment 005 remains fail-closed at the observed version:

```text
github-copilot-cli v1.0.82
linux/x64   = FAIL / UNSUPPORTED_SURFACE(configuration isolation)
macos/arm64 = FAIL / UNSUPPORTED_SURFACE(configuration isolation)
windows/x64 = FAIL / UNSUPPORTED_SURFACE(configuration isolation)
```

It is therefore not selected by this amendment.

## Replacement-gate reconciliation

The Amendment 005/006 replacement conditions are satisfied for **candidate selection only** as follows.

1. **Real blocker, not preference.** The current pair depends on qualification conditions not established in canonical project evidence: provider-backed Codex execution and Claude vendor-use authority. Pi and OpenCode each have a machine-observed cross-platform provider-free automation surface and open-source invocation boundary suitable for a separately qualified local/no-secret provider strategy.
2. **Identity separation.** Pi exposes explicit provider/model selection. OpenCode exposes explicit composite `provider/model` selection. Delethos must continue to retain adapter id, requested provider/model, and observed provider/model as distinct facts.
3. **No reduced Gold rigor.** Every applicable Specification 003 real-CLI case remains required for the replacement candidates. Difficult cases are not deleted because the pair changed.
4. **Authentication remains conditional on the actual provider path.** If the selected qualification provider requires authentication, missing/invalid-auth and credentialed success remain required. A genuinely local no-auth provider may record authentication as not applicable only when machine evidence proves that exact provider path requires no credential; it must never be represented as credentialed evidence.
5. **Provider-free evidence remains provider-free.** The Amendment 005/006 probe records cannot satisfy provider success, write success, tool reliability, model selection, or Gold.
6. **Platform matrix is unchanged.** Linux, macOS, and Windows remain required for the claimed Gold surface.
7. **Specification 004 remains separately gated.** No independent-review or repair-loop behavior is authorized here.
8. **License/terms boundaries remain explicit.** The selected exact Pi and OpenCode versions are MIT-licensed. Any separately selected model/runtime/provider remains governed by its own license, service terms, distribution conditions, and credential requirements.

## Selected Gold candidates after canonicalization

If and only if this amendment becomes canonical, the Specification 003 selected first-pair candidates become:

```text
pi-coding-agent
opencode
```

The initial exact implementation baselines are:

```text
pi-coding-agent = 0.84.4
opencode = 1.18.26
```

A later canonical amendment may change an exact CLI baseline if fresh compatibility/security evidence requires it. Until then, implementation and conformance shaping must target these exact versions.

`Selected Gold candidate` still does not mean `GOLD`, `SUPPORTED`, authenticated, provider-ready, or production-ready.

## Effect on the former selected pair

The existing Codex and Claude adapter implementation and historical evidence remain canonical repository history. This amendment does not delete, rewrite, invalidate, or relabel those records.

Once this amendment is canonical:

```text
openai-codex-cli = IMPLEMENTED_LEGACY_NON_SELECTED / NOT_GOLD
anthropic-claude-code = IMPLEMENTED_LEGACY_NON_SELECTED / NOT_GOLD
```

The incomplete Codex/Claude Gold tasks are `SUPERSEDED_BY_AMENDMENT_007` for the Specification 003 two-Gold completion gate; they are not converted to PASS, FAIL, or COMPLETE. Their failures, unavailable environments, vendor gates, and residual limitations remain evidence that motivated the recovery selection.

No future Codex or Claude provider-backed qualification is required to close Specification 003 after this amendment becomes canonical. Future work on those adapters belongs to a separately authorized expansion/hardening specification unless a later Specification 003 amendment explicitly reselects them.

## Normative precedence

When canonical, this amendment supersedes only conflicting Specification 003 statements that:

- name Codex and Claude as the selected first Gold pair;
- describe Pi/OpenCode as non-authorized successor candidates;
- limit product implementation paths in a way that prevents the bounded Pi/OpenCode implementation below;
- require completion of the superseded Codex/Claude Gold task rows before the two-Gold terminal gate.

All other Specification 003 contracts, acceptance criteria, security boundaries, conformance rigor, exact-head qualification requirements, human-merge rule, and Specification 004 non-authority remain controlling.

Stale candidate names in `specs/CURRENT.md`, `spec.md`, `plan.md`, or `tasks.md` do not override this amendment once it is canonical. A later documentation-ledger reconciliation may update those files, but it may not widen the authority defined here.

## Authorized replacement implementation surface

After this amendment is canonical and canonical authority is re-read, one or more bounded implementation PRs may use the existing Specification 003 product surface plus only these new product paths:

```text
packages/adapters/src/pi.ts
packages/adapters/src/opencode.ts
packages/adapters/test/pi.test.ts
packages/adapters/test/opencode.test.ts
```

The already-authorized shared paths may be changed only as necessary to integrate the replacement candidates:

```text
package.json
pnpm-lock.yaml
tsconfig.json
.github/workflows/ci.yml
packages/adapters/package.json
packages/adapters/src/types.ts
packages/adapters/src/discovery.ts
packages/adapters/src/invocation.ts
packages/adapters/src/conformance.ts
packages/adapters/src/index.ts
packages/adapters/test/contract.test.ts
packages/adapters/test/discovery.test.ts
packages/adapters/test/invocation.test.ts
packages/adapters/test/conformance.test.ts
packages/adapters/test/fixtures/agent-fixture.ts
scripts/adapter-conformance.mjs
```

Existing `codex.ts`, `claude.ts`, and their tests may remain unchanged. Removing or materially refactoring the legacy adapters is not part of this recovery unit unless a later bounded amendment authorizes it.

No new external npm production dependency is authorized.

## Pi implementation boundary

The Pi adapter may implement only behavior derived from the exact `0.84.4` CLI surface and separately verified by deterministic tests or real conformance.

Initial shaping may cover:

- exact executable/version discovery;
- non-interactive print/text execution;
- machine-readable JSON mode;
- RPC mode only if needed by the bounded adapter contract and exact behavior is independently testable;
- explicit provider and model selection;
- fresh configuration/home isolation;
- exact Delethos worktree cwd through the supervised process cwd when the CLI itself does not provide a separately qualified cwd flag;
- direct shell-free executable/argv invocation through the canonical Specification 002 supervisor.

Every capability begins `UNVERIFIED` for Delethos until the applicable conformance evidence exists.

The adapter must not expose arbitrary raw Pi flags, silently inherit uncontrolled user/project configuration, or represent prompt cooperation as an enforced read-only boundary.

## OpenCode implementation boundary

The OpenCode adapter may implement only behavior derived from the exact `1.18.26` surface and separately verified by deterministic tests or real conformance.

Initial shaping may cover:

- exact executable/version discovery;
- non-interactive `run` execution;
- `--format json` machine-readable output;
- exact `--dir` cwd selection;
- `--model` only as explicit `provider/model` identity;
- explicit permission-policy representation;
- isolated config/home/data/cache/state roots;
- project-config disabling, external-plugin suppression, and auto-update disabling where the exact version proves those controls;
- direct shell-free executable/argv invocation through the canonical Specification 002 supervisor.

The adapter must never use these dangerous postures as a Delethos safety mechanism:

```text
--auto
--yolo
--dangerously-skip-permissions
```

OpenCode `READ_ONLY` begins `UNVERIFIED`; deny/permission configuration observed in the provider-free probe is not by itself proof that a provider-backed review run permits intended reads while blocking the forbidden write required by the read-only case.

## Provider/model strategy remains gated

This amendment deliberately does **not** select a provider/runtime/model for Gold execution.

```text
RECOVERY_PROVIDER_MODEL_STRATEGY = GATED_EXACT_STRATEGY_REQUIRED
PROVIDER_BACKED_INFERENCE_AUTHORITY = NOT_GRANTED_BY_AMENDMENT_007
```

This is required because provider-neutral CLI feasibility is not model/tool reliability evidence, and selecting an arbitrary local model before cross-platform feasibility would turn a recovery decision into preference rather than proof.

Before any provider-backed Pi/OpenCode Gold qualification, a later canonical Specification 003 amendment must choose an exact strategy and prove or pin at minimum:

- provider/runtime identity and exact version;
- model identity, immutable/reproducible version or digest where the distribution supports it, and license/redistribution boundary;
- Linux/macOS/Windows availability for the claimed qualification matrix;
- bounded resource requirements compatible with the actual qualification environments;
- exact API/protocol endpoint and authentication posture;
- configuration isolation from ambient credentials/providers;
- machine-observable provider/model identity in both adapters;
- real non-empty model completion;
- coding/tool behavior sufficient to exercise the required write, cwd, failure, cancellation, cleanup, partial-diff, output, and no-hidden-Git cases;
- explicit treatment of any authentication-required cases;
- no fake provider, scripted answer server, fixture model, replayed transcript, or simulation as Gold evidence.

A local/no-secret strategy is preferred when it genuinely satisfies these requirements because it removes the current inaccessible credential/vendor-authority blocker, but preference cannot replace machine feasibility.

## Replacement task order

When canonical, this amendment inserts the following bounded task order ahead of terminal Specification 003 closeout. These tasks supersede the incomplete selected-pair Gold tasks only for the completion path; historical task/evidence records remain intact.

```text
D003-R170  reconcile Amendment 007 canonicalization and exact selected pair
D003-R171  implement Pi 0.84.4 adapter candidate and deterministic fixtures
D003-R172  implement OpenCode 1.18.26 adapter candidate and deterministic fixtures
D003-R173  integrate both candidates into shared discovery/invocation/conformance/index surfaces
D003-R174  qualify replacement implementation exact head on Linux/macOS/Windows
D003-R175  obtain/reconcile required independent substantive review and all review threads
D003-R176  merge replacement implementation with expected-head protection
D003-R177  require canonical post-merge deterministic Linux/macOS/Windows CI and re-read authority
D003-R180  shape/qualify exact provider-runtime-model strategy amendment
D003-R181  machine-qualify the selected provider/runtime/model prerequisite without weakening Gold cases
D003-R190  execute/reconcile complete applicable Pi real-CLI Gold matrix
D003-R200  execute/reconcile complete applicable OpenCode real-CLI Gold matrix
D003-R210  preserve failures/unavailability/limitations and promote only machine-proven capability/platform facts
D003-R211  confirm both selected replacement candidates are genuinely GOLD
D003-R212  resume terminal Phase K closeout only after D003-R211 is machine-observed
```

The implementation may split the candidate adapters into separate PRs if that produces a smaller independently verifiable unit, but it may not reorder provider-backed Gold execution ahead of the canonical provider/runtime/model strategy gate.

## Gold conformance remains unchanged in rigor

For both replacement candidates, every applicable real-CLI Gold case from Specification 003 remains required, including:

```text
exact discovery/version
missing binary
invalid/missing authentication when applicable to the selected provider path
bounded real write success
exact cwd/worktree behavior
read-only + forbidden-write negative path if read-only is claimed
provider/model selection if claimed
malformed provider/model behavior
provider success and provider failure
timeout
stdio-stall behavior/recovery where applicable
cancel
process-tree cleanup
partial diff preservation
missing final response handling
large output
special/quoted paths
resume if claimed
dirty repository/worktree preconditions
platform launch
no hidden commit/push/merge
machine-readable result validity
configuration-isolation assumptions
```

Linux, macOS, and Windows remain separate qualification statuses. One platform cannot proxy another.

## Required qualification for Amendment 007

This amendment PR must itself:

- be based on the exact canonical revision observed when the branch is created;
- change only this amendment document unless a substantive review requires another Specification 003 documentation path;
- pass deterministic Linux/macOS/Windows CI at the exact PR head;
- receive/reconcile the strongest available independent substantive semantic review at the exact head;
- preserve skipped, unavailable, rate-limited, or billing-blocked review systems as non-PASS;
- resolve every substantive review conversation;
- verify exact base/head/scope/checks/reviews/threads/comments/mergeability immediately before merge;
- merge only with expected-head protection;
- require canonical post-merge deterministic Linux/macOS/Windows CI;
- re-read canonical Specification 003 authority before replacement implementation begins.

## Explicit non-authority

This amendment does not authorize:

- representing Pi or OpenCode as `SUPPORTED` or `GOLD`;
- model/provider inference before the separate exact provider/runtime/model strategy gate is canonical;
- creating, reading, enumerating, storing, or injecting vendor credentials merely to make qualification possible;
- consuming paid/vendor quota without a separately available authorized provider environment;
- fake/mock/scripted provider success as real conformance;
- weakening, deleting, or silently excluding required Gold cases or platforms;
- automatic commit, push, merge, publish, or release behavior in any adapter;
- Specification 004 independent implementer/reviewer orchestration or repair loops;
- terminal Specification 003 closeout before two genuine replacement Gold outcomes;
- public package release or stable external protocol claims.

## Completion effect

If this amendment qualifies and becomes canonical, the Specification 003 selected first Gold candidates change to:

```text
pi-coding-agent 0.84.4
opencode 1.18.26
```

and the bounded replacement implementation tasks become authorized.

Specification 003 nevertheless remains:

```text
ACTIVE_BLOCKED_REAL_GOLD
```

until both replacement candidates pass the complete applicable provider-backed Gold matrix on Linux, macOS, and Windows under a separately canonical exact provider/runtime/model strategy. Only then may terminal Specification 003 closeout resume. Specification 004 remains unauthorized until that closeout itself qualifies, merges canonically, passes post-closeout checks, and canonical governance is re-read.
