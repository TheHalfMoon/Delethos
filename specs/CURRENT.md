# Current Execution State

**Repository:** `TheHalfMoon/Delethos`  
**Canonical branch:** `main`  
**Specification 000 terminal closeout merge:** `6fdb0d5d007f7d87b97b4016677eea9480ba3521`  
**Specification 000 disposition:** `CLOSED_CANONICAL` after exact terminal closeout merge, canonical re-read, and no configured failing required post-merge status  
**State represented by this file when canonical:** `SPEC_001_ACTIVE`  
**Active product specification when canonical:** `specs/001-core-run-policy-evidence/spec.md`

Live GitHub/repository truth overrides this file.

## Specification 000 closure

Specification 000's terminal effectivity conditions were machine-observed:

```text
closeout_base = 7e44ab45be0b89af7d4fb6cb2ee2f13e6e69839b
closeout_head = b8b14dc52c6ac5f1f05636759b4c995ff4b6dd49
closeout_pr = 2
closeout_merge = 6fdb0d5d007f7d87b97b4016677eea9480ba3521
closeout_tree = 9f9072fb1e1a5392abad01a45973ef2568705aea
```

PR #2 merged by exact expected head. Canonical `main` was re-read afterward and resolved to the closeout merge. The merge is GitHub-signature-verified. No required post-merge commit status was configured or failing. No recursive closeout PR is authorized merely to record the realized condition.

Specification 000 is therefore `CLOSED_CANONICAL`.

## Specification 001 activation effectivity

This file activates Specification 001 only if this exact shaping authority chain itself becomes canonical after exact-head qualification and canonical re-read.

Before this shaping unit is canonical:

```text
PROGRAM_STATUS = POST_000_SHAPING
ACTIVE_PRODUCT_SPEC = NONE
PRODUCT_IMPLEMENTATION_AUTHORITY = NONE
NEXT_ALLOWED_WORK = BOUNDED_SPEC_001_SHAPING_ONLY
```

Once this shaping unit is canonical and re-read successfully:

```text
PROGRAM_STATUS = SPEC_001_ACTIVE
ACTIVE_PRODUCT_SPEC = specs/001-core-run-policy-evidence/spec.md
PRODUCT_IMPLEMENTATION_AUTHORITY = SPEC_001_BOUNDED_CORE_ONLY
NEXT_ALLOWED_WORK = SPEC_001_TASK_ORDER
```

## Specification 001 authorized product boundary

When active, Specification 001 authorizes only the deterministic pure-core implementation described by its spec/plan:

- canonical JSON-compatible value validation/serialization;
- SHA-256 canonical digests;
- bounded task snapshot validation/digest;
- bounded policy validation/compilation/digest;
- explicit run lifecycle and transition table;
- run logical revision;
- verification-fact binding;
- independent-review identity/result semantics;
- deterministic `VERIFIED` eligibility;
- minimal Node 24/TypeScript/pnpm workspace required to typecheck/test that core;
- first repository CI limited to cross-platform typecheck/test/runtime-dependency validation.

## Authorized product paths

After shaping activation, implementation is limited to the path surface explicitly listed in `specs/001-core-run-policy-evidence/plan.md`, including:

```text
package.json
pnpm-workspace.yaml
pnpm-lock.yaml
tsconfig.json
.gitignore                         # only if justified
.github/workflows/ci.yml
packages/core/package.json
packages/core/src/*.ts             # only the explicitly named Specification 001 source files
packages/core/test/*.test.ts       # only the explicitly named Specification 001 tests
specs/001-core-run-policy-evidence/**
specs/CURRENT.md                   # controlled frontier/evidence updates
```

Any path outside the exact plan requires a canonical Specification 001 plan amendment before edit.

## Explicit non-authority

Specification 001 does not authorize:

- filesystem/Git/worktree implementation;
- subprocess/process-supervision implementation;
- runtime timeout/stall measurement;
- coding-agent discovery/adapters/provider SDKs;
- actual independent reviewer invocation or repair loops;
- general command/CI guard execution as product behavior;
- CLI/TUI product commands;
- adaptive routing, memory, benchmarking, quotas, or cost logic;
- cloud/hosted scope or telemetry;
- automatic commit/merge/release authority;
- public package/release publication;
- stable `delethos.*.v1` external-standard claims;
- repository administration claims not reflected by live GitHub state.

## Current live administrative gaps

At the Specification 001 shaping base:

- canonical `main` is not branch-protected;
- no repository ruleset exists;
- repository description/homepage/topics remain unset/empty.

The current authenticated write surface does not expose supported mutation actions for those settings. They remain explicit external administrative follow-up and are not silently represented as completed.

## Continuation

Qualify and merge the exact Specification 001 shaping candidate. Re-read canonical `main`. Only after activation is machine-observed may a separate product implementation branch create the bounded Node/TypeScript core and CI surface. Product completion requires exact-head cross-platform CI, expected-head merge, canonical post-merge CI, and terminal evidence reconciliation.
