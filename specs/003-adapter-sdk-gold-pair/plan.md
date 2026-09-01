# Specification 003 — Implementation Plan

## Objective

Implement the smallest vendor-neutral adapter layer that can normalize two real coding-agent CLIs—OpenAI Codex CLI and Anthropic Claude Code—while preserving external CLI semantics, exact execution identity, fail-closed capability checks, Specification 002 process supervision, and a strict separation between deterministic fixture tests and real credentialed Gold conformance.

## Authorized implementation surface

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

Specification/evidence documents require separate bounded shaping/amendment/closeout units.

## Phase A — Adapter contract primitives

Create private `@delethos/adapters` with zero external production dependencies and an explicit private workspace dependency on `@delethos/runtime` if needed.

Implement bounded types for:

- adapter id;
- installation/discovery result;
- capability status;
- platform qualification status;
- adapter tier/candidate state;
- execution posture;
- normalized run request;
- exact invocation plan;
- execution identity;
- normalized provider/result categories;
- conformance case/result.

Validation must reject unknown enum values, contradictory posture/capability requests, unbounded identifiers, relative/nonexistent cwd, malformed limits, and unsupported provider/model/session controls.

Do not publish a stable public protocol version in this specification.

## Phase B — Discovery and invocation boundary

Implement deterministic executable discovery and safe version observation.

Requirements:

- no shell;
- no repository mutation;
- bounded output/time;
- deterministic ambiguity handling;
- binary presence separate from auth readiness;
- selected executable path + observed version retained.

Implement a common invocation runner that:

- accepts only a validated invocation plan;
- uses the exact worktree cwd;
- delegates execution to `superviseProcess` from Specification 002;
- maps process terminal causes without erasing `CANCELLED`, `TIMED_OUT`, `STALLED`, or `OUTPUT_LIMIT`;
- never trusts provider output for Git diff/base/change truth.

## Phase C — Codex candidate

Implement the Codex adapter around non-interactive `codex exec`.

### Initial controlled posture

Prefer:

```text
exec
--json
--cd <exact-worktree>
--ignore-user-config
--ignore-rules
--ephemeral      # only for non-resume path
--sandbox <safe-supported-mode>
--model <model>  # only if explicitly requested/supported
```

The exact argv must be derived from current real CLI behavior rather than copied blindly from this illustrative list.

Never emit dangerous bypass flags.

### Parser

Parse JSONL incrementally or from bounded retained output, depending on the runtime integration chosen. Preserve unknown provider event types only as namespaced diagnostics if safe; do not fail merely because a new non-critical event exists unless it makes final completion ambiguous.

Require an unambiguous final completion/failure fact. Missing/malformed final completion must not become success.

### Codex capability gating

Start all capabilities `UNVERIFIED` in code/evidence. Promote only through conformance evidence.

In particular:

- read-only requires a write-negative real fixture;
- provider selection remains partial/narrow unless exact behavior is proven;
- resume requires real session continuation evidence;
- model selection requires malformed-model negative evidence as well as success evidence.

## Phase D — Claude Code candidate

Implement Claude Code around non-interactive `claude -p` and machine-readable output.

### Configuration postures

Support at most:

```text
CONTROLLED_BARE
CONTROLLED_STANDARD
```

Choose posture deterministically from explicit request/discovery/auth facts; do not silently fall back from bare to standard if doing so changes the claimed isolation/capability semantics.

`CONTROLLED_BARE` requires compatible authentication and version behavior.

`CONTROLLED_STANDARD` must explicitly set/configure the available settings/MCP/tool/permission controls necessary to bound ambient behavior. Managed policy remains visible authority and is never bypassed.

### Bounded provider controls

Where supported and explicitly requested, map:

- model;
- max turns;
- max budget;
- tool allow/deny posture;
- permission mode;
- resume/session id.

Do not expose broad passthrough CLI flags. Provider-specific adapter options must be typed/bounded.

### Parser

Prefer JSON or stream-JSON. Preserve session id/final result/provider errors when exposed. Missing/malformed completion must fail closed.

Claude read-only remains unverified until real negative-path evidence proves the exact permission/tool posture.

## Phase E — Deterministic fixture suite

Use a Delethos-owned fixture executable that can emulate process/output behavior without pretending to be Codex or Claude.

The fixture may emit protocol-shaped synthetic JSON/JSONL solely to test Delethos parser/normalization logic.

Required deterministic tests:

- bounded type validation;
- missing binary;
- discovery version parsing;
- deterministic path selection/ambiguity;
- exact cwd;
- path spaces/special characters;
- exact argv with no shell interpolation;
- unsupported capability rejection before launch;
- malformed model/provider/session configuration;
- parser success;
- provider-declared failure;
- malformed structured output;
- missing final response;
- large output/output limit;
- cancel;
- timeout;
- stdio inactivity stall;
- partial output preservation;
- ordinary descendant cleanup through runtime;
- no commit/push/merge/release API or argv generation;
- no dangerous Codex bypass flags;
- Claude configuration posture cannot silently downgrade;
- secrets are not included in normalized evidence serialization.

Tests must be bounded and not require network/vendor credentials.

## Phase F — Repository CI

Extend root TypeScript/test/dependency checks to cover `packages/adapters` and the conformance runner's static/runtime validation where appropriate.

Keep the existing Linux/macOS/Windows CI matrix.

CI remains:

- read-only repository permissions;
- no publish/deploy/release;
- no vendor credentials required;
- no automatic installation/execution of paid coding-agent sessions.

Dependency checking must permit only explicitly named internal `workspace:*` dependencies and reject external production dependencies.

## Phase G — Real-CLI conformance runner

Implement `scripts/adapter-conformance.mjs` as a local/manual qualification surface, not as marketing theater.

### Invocation

Require explicit:

- adapter candidate;
- conformance case or bounded case set;
- output path or stdout machine-readable mode;
- acknowledgement for any case that intentionally permits write behavior inside the temporary fixture repository.

### Fixture repository

Each real run must use a fresh temporary Git repository/worktree with known base/content and no connection to canonical Delethos mutable work.

The runner records before/after Git facts itself.

### Evidence record

Each case result must include at minimum:

```text
schema/version candidate
Delethos revision
adapter implementation identity
adapter id
CLI executable path
CLI version
OS/arch
case id
requested capability/posture
requested model/provider if any
session id if exposed
process terminal cause/exit facts
provider normalized result
Git base before
Git status/diff observation after
PASS/FAIL/UNAVAILABLE/UNVERIFIED
limitations
```

Do not include secrets, raw environment, hidden reasoning, or unbounded transcripts.

### Required Gold cases

Run every applicable case enumerated by `spec.md`. A selected subset may be useful during development but does not qualify Gold.

## Phase H — Real qualification strategy

Qualification availability is an operational fact.

Preferred order:

1. discover locally available exact CLI binaries/versions;
2. run no-auth and invalid-auth cases first without consuming provider work;
3. only if valid authentication is available, run bounded success/write/read-only/model/resume cases in disposable fixture repositories;
4. qualify Linux/macOS/Windows using genuinely available environments;
5. preserve unavailable platform/auth cases as gaps.

Do not request or store credentials in repository files. Do not manufacture API access from ordinary project approval.

If the environment available to the project cannot perform required credentialed cross-platform real conformance, implementation may still merge if its own acceptance/evidence gates allow a non-Gold candidate state, but terminal Specification 003 closure remains blocked until both Gold outcomes are real.

## Phase I — Exact-head implementation qualification

Before product merge:

- re-read canonical authority;
- verify exact base/head;
- verify exact changed-path set against the authorized surface;
- run full deterministic repository CI on the exact head;
- reconcile reviews, review threads, substantive comments, bot availability, mergeability;
- preserve unavailable/skipped review systems as non-PASS;
- verify no secret-bearing or unauthorized workflow entered the diff;
- verify no vendor binary/code was copied;
- merge only with expected-head protection.

Require canonical post-merge Linux/macOS/Windows deterministic CI before any closeout work.

## Phase J — Gold qualification and closeout

After canonical implementation:

1. re-read canonical authority and exact implementation revision;
2. execute real conformance only where binaries/auth/platforms are actually available;
3. record exact successes, failures, unavailability, and limitations;
4. repair implementation defects through bounded PRs without weakening cases;
5. do not change candidate selection merely to avoid a failing vendor behavior;
6. if a candidate proves fundamentally unsuitable, shape a canonical Specification 003 selection amendment with evidence;
7. when and only when both candidates genuinely satisfy the Gold gate, create terminal closeout evidence;
8. qualify/merge closeout with expected-head protection;
9. require post-closeout canonical checks;
10. re-read canonical governance before shaping Specification 004.

## Failure handling

- unknown CLI version behavior -> `UNVERIFIED`; fail closed for affected capability;
- missing binary -> `UNAVAILABLE`/not installed; no fake fixture substitution for Gold;
- missing credential -> `UNAVAILABLE`; no credential fabrication;
- invalid auth -> record expected/auth failure behavior;
- malformed provider output -> `INVALID_PROVIDER_OUTPUT` or equivalent;
- unsupported requested capability -> reject before launch;
- runtime cancel/timeout/stall/output limit -> preserve exact Specification 002 terminal cause;
- attempted external/forbidden write during read-only qualification -> read-only qualification FAIL;
- hidden commit/push/merge -> candidate qualification FAIL and preserve repository state/evidence;
- platform-specific failure -> platform remains unqualified; do not silently drop it;
- license/provenance ambiguity -> stop relevant integration work and reconcile before copying/using material;
- inability to complete two real Gold qualifications -> Specification 003 remains open/blocked rather than weakening the outcome.

## Dependency plan

No new external npm runtime dependency is planned.

Use Node 24, existing TypeScript tooling, existing Git/runtime primitives, and target CLIs installed independently by the operator.

If a new external dependency or native helper becomes necessary, stop and amend the plan canonically before adding it.

## Merge discipline

Shaping, implementation, amendments, and closeout each use bounded branch/PR units. Before every merge, re-check canonical base, exact head, authorized paths, configured CI, reviews, threads, substantive comments, bot availability, and mergeability. Use expected-head protection. Require appropriate canonical post-merge CI and re-read authority before the next unit.
