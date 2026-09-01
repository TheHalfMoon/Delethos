# Current Execution State

**Repository:** `TheHalfMoon/Delethos`  
**Canonical branch:** `main`  
**Specification 000 disposition:** `CLOSED_CANONICAL`  
**Specification 001 disposition:** `CLOSED_CANONICAL`  
**Specification 001 shaping merge:** `32843fb1495fd792dceddc0536a7fef6d90edf4e`  
**Specification 001 implementation merge:** `9bdba350458fe2e7832658e3214d9a500dd7153e`  
**Specification 001 terminal closeout merge:** `6c8ac8b51e96099912631607218b00aa85492e38`  
**Specification 001 post-closeout CI:** `33501812656` — `SUCCESS` on Linux/macOS/Windows  
**State represented by this file when canonical:** `SPEC_002_ACTIVE`  
**Active product specification when canonical:** `specs/002-worktree-process-supervision/spec.md`

Live GitHub/repository truth overrides this file.

## Closed Specification 001 truth

Specification 001 closure is machine-observed because:

- terminal closeout is canonical at `6c8ac8b51e96099912631607218b00aa85492e38`;
- `specs/001-core-run-policy-evidence/closeout.md` is present on canonical `main`;
- the closeout PR used exact-head protection;
- its exact two-path scope was reconciled;
- Qodo remained billing-blocked and CodeRabbit automatic review remained skipped rather than being counted as approval;
- canonical post-closeout CI run `33501812656` completed successfully on Linux, macOS, and Windows;
- canonical authority was re-read after the merge.

## Specification 002 authority

When this file and `specs/002-worktree-process-supervision/` are canonical together, Specification 002 is the sole active product implementation authority.

```text
PROGRAM_STATUS = SPEC_002_ACTIVE
ACTIVE_PRODUCT_SPEC = specs/002-worktree-process-supervision/spec.md
PRODUCT_IMPLEMENTATION_AUTHORITY = SPEC_002_BOUNDED_RUNTIME_ONLY
NEXT_ALLOWED_WORK = SPEC_002_TASK_ORDER_ONLY
```

Specification 002 authorizes only the exact-base Git worktree and shell-free process-supervision surface named by its specification/plan.

## Specification 002 implementation surface

Authorized product paths are limited to:

```text
package.json
pnpm-lock.yaml
tsconfig.json
.github/workflows/ci.yml
packages/runtime/package.json
packages/runtime/src/git.ts
packages/runtime/src/worktree.ts
packages/runtime/src/process.ts
packages/runtime/src/index.ts
packages/runtime/test/git.test.ts
packages/runtime/test/worktree.test.ts
packages/runtime/test/process.test.ts
```

Any additional product path requires a prior canonical Specification 002 plan amendment.

## Required Specification 002 invariants

- worktrees are detached at an exact commit and locked with Delethos ownership provenance;
- worktree isolation is never represented as a security sandbox;
- dirty owned worktrees are preserved rather than force-removed;
- repository discovery executes no repository code;
- child execution uses direct executable/argument vectors with `shell: false`;
- environment inheritance is explicit rather than accidental;
- `CANCELLED`, `TIMED_OUT`, and stdio-inactivity `STALLED` remain distinct;
- output is bounded;
- first terminal cause is immutable;
- platform process-tree cleanup claims are limited to what exact CI proves;
- no adapter/provider/reviewer/guard/CLI/routing/release behavior enters this unit.

## Explicit non-authority

Specification 002 does not authorize:

- coding-agent adapters/provider SDKs;
- actual independent-review invocation or repair loops;
- final patch/evidence bundle or verifier;
- product guard-command execution;
- CLI/TUI;
- routing/memory/bench;
- cloud/telemetry;
- automatic commit/push/merge/release;
- a sandbox or perfect process-containment claim;
- public package/release publication;
- stable external `delethos.*.v1` claims.

## Administrative repository truth

At activation shaping time, `main` is not branch-protected and no repository ruleset is configured. Repository description/homepage/topics remain external administrative follow-up unless changed through an explicitly supported repository-admin surface. These gaps do not silently become PASS.

## Continuation

Implement Specification 002 in task order only after this shaping unit qualifies, merges with expected-head protection, and canonical `main` is re-read. Do not begin Specification 003 from the roadmap until Specification 002 is closed canonically and fresh successor shaping is justified.
