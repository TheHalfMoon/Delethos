# Specification 003 — Adapter SDK & First Gold Candidates

## Status

`ACTIVE` iff this specification is present on canonical `main` and `specs/CURRENT.md` names it as the active product specification. Otherwise this file is a shaping candidate only.

## Canonical prerequisite

Specification 002 is closed only after terminal closeout merge `fbeac74feb846d4ed63cdcc8f366eb435481057e` is canonical, `specs/002-worktree-process-supervision/closeout.md` is present, canonical authority is re-read, and post-closeout CI run `33507203048` succeeds on Linux, macOS, and Windows.

Specification 003 product implementation is not authorized until this shaping unit itself qualifies, merges with expected-head protection, and canonical authority is re-read.

## Purpose

Implement the first real coding-agent integration boundary for Delethos: a deterministic private adapter SDK, process-backed invocation normalization, and two independently identified real coding-agent adapter candidates—OpenAI Codex CLI and Anthropic Claude Code—without yet implementing the Specification 004 independent-review/repair workflow.

The implementation must expose real capability and execution-identity facts, fail closed on unsupported controls, delegate process ownership to the already-qualified Specification 002 supervisor, preserve repository truth outside the agent result, and provide a versioned conformance harness that can distinguish deterministic fixture qualification from credentialed real-CLI qualification.

## Outcome

A private `@delethos/adapters` package can:

1. discover a named coding-agent executable without mutating the repository;
2. record the exact discovered executable path and observed CLI version;
3. represent adapter/capability/platform status using bounded explicit vocabularies;
4. validate a bounded adapter run request before process launch;
5. reject unsupported model/provider/read-only/resume controls before dispatch;
6. compile a shell-free exact executable/argument invocation plan;
7. run the external CLI through `@delethos/runtime` process supervision in an exact Delethos worktree `cwd`;
8. normalize provider output without treating provider text as repository truth;
9. retain execution identity/provenance needed by later independent-review policy;
10. distinguish adapter mechanism failure from process terminal cause and provider-reported failure;
11. implement a Codex adapter candidate against the current documented public CLI surface;
12. implement a Claude Code adapter candidate against the current documented public CLI surface;
13. test deterministic adapter behavior with synthetic fixtures without representing fixtures as vendor qualification;
14. expose a real-CLI conformance runner that records exact CLI version/platform/capability outcomes;
15. refuse `GOLD` promotion when required real-CLI evidence is missing, unavailable, failed, or stale;
16. preserve human merge authority and provide no commit/push/merge/release function.

## Selected Gold candidates

The only first-pair candidates authorized by Specification 003 are:

```text
openai-codex-cli
anthropic-claude-code
```

The term `Gold candidate` does not itself grant the public adapter tier `GOLD`.

A candidate reaches `GOLD` only after all applicable conformance requirements in this specification are machine-observed against the exact adapter/CLI revisions and required platform matrix. Until then, public capability/tier status must remain honest.

Gemini CLI and OpenCode are researched successor candidates only. They are not authorized implementation targets in Specification 003 without a canonical plan amendment.

## Capability vocabulary

Adapter capability status:

```text
SUPPORTED
PARTIAL
UNSUPPORTED
UNAVAILABLE
UNVERIFIED
```

Adapter tier:

```text
GOLD
SUPPORTED
EXPERIMENTAL
COMMUNITY
```

The implementation may also use internal candidate/qualification states, but it must not overload `GOLD` to mean selected, implemented, compiled, or fixture-tested.

## Authorized implementation surface

Product implementation is limited to:

```text
package.json
pnpm-lock.yaml
tsconfig.json
.github/workflows/ci.yml
packages/adapters/package.json
packages/adapters/src/types.ts
packages/adapters/src/discovery.ts
packages/adapters/src/invocation.ts
packages/adapters/src/codex.ts
packages/adapters/src/claude.ts
packages/adapters/src/conformance.ts
packages/adapters/src/index.ts
packages/adapters/test/contract.test.ts
packages/adapters/test/discovery.test.ts
packages/adapters/test/invocation.test.ts
packages/adapters/test/codex.test.ts
packages/adapters/test/claude.test.ts
packages/adapters/test/conformance.test.ts
packages/adapters/test/fixtures/agent-fixture.ts
scripts/adapter-conformance.mjs
```

Specification/evidence documents may change only in separately bounded shaping/amendment/closeout units.

A new product path requires a canonical Specification 003 plan amendment before edit.

## Dependency contract

`@delethos/adapters` must have zero external npm production dependencies.

It may depend on private workspace packages already canonical in the repository, including `@delethos/runtime`, through explicit `workspace:*` package references. Such internal workspace dependencies are not external production dependencies and must be distinguished by the dependency verification gate.

Node standard-library primitives and the external user-installed coding-agent executables are not npm production dependencies of the package.

No vendor SDK is required or authorized by this specification.

## Adapter identity contract

Every adapter implementation must expose a stable adapter identifier and adapter implementation version/fingerprint sufficient for exact-run evidence.

Discovery and run evidence must retain at minimum:

- adapter id;
- adapter implementation revision or package version/fingerprint;
- executable path selected for launch;
- observed CLI version string;
- platform/architecture facts relevant to qualification;
- requested model when a model selector is used;
- observed model/provider only when the CLI exposes a trustworthy machine-readable fact;
- provider family/configuration classification when relevant and actually known;
- provider-native session/run identifier when exposed;
- normalized process/result status;
- capability claims applied to the run.

A requested model/provider value is not the same fact as an observed provider result. The adapter must not collapse those fields.

Specification 004 may later define the exact independent-review identity-comparison rule. Specification 003 only preserves the facts necessary for that decision.

## Discovery contract

Discovery must:

- accept a bounded adapter id;
- resolve the intended executable without invoking a command shell;
- avoid executing repository hooks/builds/package managers/project code;
- invoke only the target CLI's safe version/help/status surface needed for discovery;
- capture the selected executable path and exact observed version output;
- distinguish `NOT_INSTALLED`, `DISCOVERY_FAILED`, and discovered installation;
- bound discovery output/time;
- never infer authentication readiness from binary presence alone.

If multiple installations are discovered, the adapter must apply deterministic selection or return ambiguity rather than silently choosing by unstable filesystem order.

## Run request contract

A normalized adapter request must validate at minimum:

- adapter id;
- exact absolute existing Delethos worktree `cwd`;
- bounded non-empty prompt/instruction input;
- execution posture (`WRITE` or `READ_ONLY` only where supported);
- optional model/provider selection only where capability permits;
- optional resume/session id only where capability permits;
- explicit environment policy suitable for the runtime supervisor;
- positive bounded timeout/stall/output limits;
- provider-specific bounded controls only when represented in the adapter capability contract.

Unsupported or contradictory controls fail before launch.

No adapter may silently downgrade requested `READ_ONLY` to prompt-only cooperation or writable execution.

## Invocation contract

Every invocation plan must contain a direct executable and argument vector suitable for `shell: false` execution.

The invocation layer must:

- use the exact selected executable;
- use the exact requested worktree as process `cwd`;
- avoid shell interpolation;
- preserve special-character/path arguments as distinct argv entries;
- reject dangerous vendor bypass flags not authorized by this specification;
- make ambient configuration posture explicit where the CLI permits;
- never add commit/push/merge/release commands;
- use the Specification 002 process supervisor for cancellation, timeout, stdio-stall, output-limit, and ordinary descendant cleanup.

## Result contract

A normalized adapter result must preserve mechanism and provider facts separately.

At minimum it must support:

```text
COMPLETED
PROVIDER_FAILED
INVALID_PROVIDER_OUTPUT
AUTH_FAILED
CONFIGURATION_FAILED
UNSUPPORTED_CAPABILITY
PROCESS_FAILED
CANCELLED
TIMED_OUT
STALLED
OUTPUT_LIMIT
```

The exact implementation may refine names through a canonical plan amendment if evidence requires it, but it must not collapse cancellation/timeout/stall or convert malformed output into success.

The result must retain:

- process terminal cause and exit facts from Specification 002;
- structured provider completion/failure facts where parseable;
- final provider message only when actually present;
- raw-output retention only within the bounded immediate runtime result; no new persistent transcript store is authorized;
- session id where exposed;
- requested/observed identity facts;
- parser/normalization warnings and limitations.

Repository diff, changed paths, base revision, and dirty state are not trusted from this result. They remain Delethos/Git observations.

## Codex adapter contract

The Codex candidate is shaped around `codex exec`.

The implementation must prefer a controlled automation posture using only proven current CLI flags, including where applicable:

- non-interactive `exec`;
- `--json` JSONL event mode;
- exact `--cd` bound to the Delethos worktree;
- `--model` only when requested and capability-valid;
- `--output-schema`/structured result controls where they improve deterministic parsing without imposing a provider-incompatible schema;
- `--ephemeral` for non-resume runs where provider session persistence is unnecessary;
- `--ignore-user-config` and `--ignore-rules` when compatible with the exact qualified version/posture;
- a safe explicit sandbox mode.

The adapter must never use:

```text
--dangerously-bypass-approvals-and-sandbox
--dangerously-bypass-hook-trust
```

as a normal Delethos automation mechanism.

`READ_ONLY` may be marked `SUPPORTED` only after real conformance proves the exact claimed sandbox posture blocks the required write-negative fixture while allowing the intended review/read activity.

Codex provider selection remains `PARTIAL`, `UNVERIFIED`, or narrower unless exact conformance proves the specific selector semantics claimed by the adapter.

## Claude Code adapter contract

The Claude candidate is shaped around non-interactive `claude -p` execution.

The implementation must use machine-readable output (`json` or `stream-json`) when the exact version supports the required normalized result.

It may use only proven CLI controls such as:

- `--model`;
- `--max-turns`;
- `--max-budget-usd` where a bounded cost control is explicitly requested and supported;
- tool allow/deny controls;
- permission modes;
- session resume/continue controls;
- `--bare` or constrained standard settings posture as qualification proves appropriate.

Two configuration postures are recognized:

```text
CONTROLLED_BARE
CONTROLLED_STANDARD
```

`CONTROLLED_BARE` is eligible only when the available authentication mode is compatible with bare execution and the exact CLI version proves the intended suppression behavior.

`CONTROLLED_STANDARD` must explicitly constrain user/project/local settings, MCP/plugin/hook behavior, and other ambient sources as far as the CLI exposes controls. Managed organizational policy remains external authority and must be preserved/reported rather than bypassed.

Claude `READ_ONLY` begins `UNVERIFIED`. A planning or prompt convention is insufficient evidence. It may become `SUPPORTED` only if the exact qualified permission/tool posture passes the forbidden-write negative path.

Claude Code is proprietary. Delethos may invoke the user's installation under the user's vendor agreement but must not vendor, redistribute, modify, or copy Claude Code implementation code under this specification.

## Authentication contract

Adapters must distinguish:

- binary available;
- authentication configured/usable;
- authentication failed;
- authentication mechanism unsupported by the selected automation posture.

The implementation must not persist access tokens/API keys into repository files or evidence artifacts.

Credentials are inherited/supplied only through explicit runtime environment policy and are never echoed by Delethos.

A missing credentialed-success environment blocks real conformance; it does not block deterministic fixture/unit implementation, and it does not become PASS.

## Conformance contract

The conformance system has two evidence classes.

### Deterministic fixture qualification

Repository CI must qualify Delethos-owned behavior without vendor credentials, including:

- type/config validation;
- exact argv compilation;
- shell-free launch integration;
- missing executable;
- bounded version discovery;
- malformed model/provider rejection before launch where locally decidable;
- structured parser success/failure with synthetic outputs;
- missing final response;
- large output/output-limit;
- path spaces/special characters;
- cancellation/timeout/stdio-stall through controlled fixture processes;
- ordinary descendant cleanup through the qualified runtime;
- no adapter API for commit/push/merge/release;
- zero external production dependencies;
- unchanged prior Specification 001/002 regression suite.

Passing fixture qualification means only that the Delethos implementation contract behaves correctly under controlled fixtures.

### Real-CLI qualification

`GOLD` requires real machine-observed conformance for each selected candidate and each publicly promised platform.

Required applicable cases:

1. exact discovery/version;
2. missing binary;
3. invalid/missing authentication;
4. bounded credentialed write success;
5. exact worktree/cwd behavior;
6. real read-only posture if claimed;
7. forbidden-write negative path if read-only is claimed;
8. model/provider selection if claimed;
9. malformed model/provider behavior;
10. provider success and provider failure;
11. timeout;
12. stdio-stall behavior/recovery where applicable;
13. cancel;
14. process-tree cleanup;
15. partial diff preservation;
16. missing final response handling;
17. large output;
18. quoting/special paths;
19. resume if claimed;
20. dirty repository/worktree preconditions;
21. platform launch;
22. no hidden commit/push/merge;
23. machine-readable result validity;
24. configuration-isolation assumptions used by the adapter.

A capability unsupported by the underlying CLI may be marked `UNSUPPORTED` and excluded from the applicable-positive case, but the adapter must pass the corresponding fail-closed behavior.

## Platform qualification

Platform status is recorded independently.

The initial target qualification matrix is:

```text
linux
macos
windows
```

A candidate may remain `EXPERIMENTAL`/non-Gold if one platform is unavailable or unqualified. Specification 003 must not silently drop a platform promised by the public tier.

Vendor documentation/release artifacts establish shaping relevance only; Delethos platform qualification requires exact adapter conformance evidence.

## Real-conformance runner

`scripts/adapter-conformance.mjs` may provide a manually invoked real-CLI qualification entry point.

It must:

- require an explicit adapter/case selection;
- detect/report unavailable binaries or credentials rather than skipping them as pass;
- avoid printing secrets;
- use a temporary fixture Git repository/worktree owned by the conformance run;
- never run against canonical Delethos mutable work by default;
- emit machine-readable result/evidence suitable for later closeout reconciliation;
- identify the exact adapter implementation revision, CLI version, platform, and case;
- make destructive/external-side-effect cases impossible unless separately authorized;
- return non-zero when a required selected case fails.

Specification 003 does not authorize publishing these results to a remote service or uploading credentials/artifacts automatically.

## CI contract

Canonical repository CI remains the mandatory deterministic truth path for Delethos-owned implementation.

CI must continue to run on Linux/macOS/Windows and must add the adapter package's typecheck/tests/dependency checks to the existing matrix without adding publish/deploy/release behavior or write repository permissions.

Credentialed real-agent conformance is not required to run on untrusted pull-request events and must never expose secrets to fork code.

If a future GitHub Actions qualification workflow is necessary, it requires a prior canonical Specification 003 plan amendment unless it is already inside the authorized path list. This specification intentionally does **not** authorize a secret-bearing workflow file in the initial implementation surface.

## Out of scope

Specification 003 does **not** authorize:

- Specification 004 independent implementer/reviewer orchestration;
- bounded repair loops;
- choosing a reviewer automatically;
- final repository guard orchestration;
- final proof-carrying patch/evidence bundle or verifier;
- CLI/TUI product commands;
- adaptive routing/memory/bench;
- cloud orchestration/telemetry;
- automatic commit/push/merge/release;
- installing vendor binaries automatically during normal product execution;
- copying/vendorizing proprietary CLI code;
- provider account provisioning;
- storing vendor credentials;
- sandbox/network-containment claims beyond exact external CLI facts;
- Gemini/OpenCode adapter implementation;
- stable public `delethos.adapter.v1` compatibility promises;
- public npm release.

## Security and authority claims

A coding-agent CLI is an external executable with the user's effective authority subject to its own sandbox/permission model. Delethos worktree isolation and process supervision reduce blast radius and improve observation but do not become a general security sandbox merely because an adapter uses a vendor sandbox flag.

Provider prompts and final messages are not correctness authority.

The adapter SDK must preserve Delethos's human-merge-by-default rule and expose no path that silently commits, pushes, merges, publishes, or expands repository authority.

## Acceptance criteria

Specification 003 implementation is accepted only if exact evidence proves:

1. `@delethos/adapters` exists with zero external production dependencies;
2. capability/tier/platform vocabularies are bounded and fail closed;
3. discovery distinguishes installed/missing/failure and records exact version/path;
4. multiple-installation ambiguity is deterministic or rejected;
5. adapter requests reject unsupported/contradictory controls before launch;
6. invocation plans use direct executable/argv vectors and exact cwd;
7. adapter processes run through the canonical Specification 002 supervisor;
8. cancellation, timeout, stall, and output-limit remain distinct;
9. provider output parsing cannot convert malformed/missing completion into success;
10. repository truth is not trusted from provider output;
11. execution identity preserves adapter/CLI/provider/model/session facts without conflation;
12. Codex invocation uses only authorized safe controls and never dangerous bypass flags;
13. Codex JSONL success/failure parsing is deterministic under fixtures;
14. Claude invocation uses a declared controlled configuration posture;
15. Claude JSON/stream-JSON success/failure parsing is deterministic under fixtures;
16. Claude proprietary code/binary is not copied or redistributed;
17. missing/invalid auth paths are represented honestly;
18. deterministic conformance fixtures cannot set `GOLD` by themselves;
19. real conformance runner emits machine-readable exact-version/platform/case results;
20. absent binary/credential/platform evidence remains `UNAVAILABLE`/`UNVERIFIED`;
21. no adapter exposes commit/push/merge/release authority;
22. all prior core/runtime tests remain passing;
23. TypeScript static checking passes;
24. dependency verification passes;
25. exact PR-head CI succeeds on Linux/macOS/Windows;
26. exact changed paths remain inside the authorized surface;
27. reviews/threads/comments/checks/mergeability are reconciled honestly;
28. implementation merges with expected-head protection;
29. canonical post-merge CI succeeds on Linux/macOS/Windows;
30. real-CLI Gold promotion occurs only for candidates/capabilities/platforms with complete exact evidence;
31. no Specification 004+ product behavior enters this unit.

## Gold completion rule

The specification may implement both adapter candidates before both qualify as `GOLD`, but Specification 003 cannot close as the roadmap's "first two gold adapters" outcome unless both selected candidates have complete applicable real-CLI conformance for the publicly claimed platform/capability set.

If credentials, platform runners, vendor access, or real CLI behavior prevent that evidence, the specification remains `BLOCKED`/`VERIFYING` as appropriate. Do not weaken the contract or rename partial evidence to close the specification.

## Evidence requirements

Closeout must retain:

- shaping merge SHA;
- implementation base/head/merge/tree;
- exact changed-path set;
- actual Node/pnpm/TypeScript versions and Git versions observed by CI;
- exact PR/post-merge workflow and job IDs;
- exact deterministic test counts/results per required OS;
- zero-external-production-dependency result;
- exact Codex/Claude adapter revision and CLI versions used for real conformance;
- real-conformance case/platform results, including failures/unavailable cases;
- authentication-mode facts without secrets;
- configuration-isolation posture and residual influences;
- read-only negative-path evidence where claimed;
- cancellation/timeout/stall/process-tree/partial-diff evidence;
- no-hidden-commit/push/merge evidence;
- PR review/thread/comment/mergeability truth;
- unavailable/skipped review systems as non-PASS;
- licensing/provenance result;
- residual vendor/platform/security limitations.

## Recovery

If live Codex or Claude behavior contradicts shaping assumptions:

1. retain the failed exact evidence;
2. downgrade the capability or candidate status honestly;
3. do not weaken a negative-path test to preserve selection;
4. amend the plan/spec canonically before materially changing invocation posture or implementation surface;
5. replace a selected Gold candidate only through evidence-based canonical amendment, not preference.

If real-agent qualification requires credentials/platform infrastructure that is not available, record the exact missing authority/environment as `UNAVAILABLE` and stop at that gate rather than inventing runtime proof.

## Completion rule

Specification 003 becomes `CLOSED_CANONICAL` only after shaping is canonical, both selected adapter candidates satisfy the required deterministic and real-CLI conformance gates for their claimed Gold surfaces, expected-head product merge succeeds, canonical post-merge CI succeeds on all required repository CI platforms, terminal evidence is reconciled, and canonical authority is re-read.
