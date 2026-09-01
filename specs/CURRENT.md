# Current Execution State

**Repository:** `TheHalfMoon/Delethos`  
**Canonical branch:** `main`  
**Specification 000 disposition:** `CLOSED_CANONICAL`  
**Specification 001 disposition:** `CLOSED_CANONICAL`  
**Specification 002 disposition:** `CLOSED_CANONICAL`  
**Specification 002 activation merge:** `39b10c6585f6201bb22ab2620013f6e1b76396ab`  
**Specification 002 Amendment 001 merge:** `08c7067c02395a541e9036c4a3767c9134c413c3`  
**Specification 002 implementation merge:** `3a4f7cd7f308cf6535b54601d57ed5fd77dd6a91`  
**Specification 002 canonical implementation CI:** `33506061231` — `SUCCESS` on Linux/macOS/Windows  
**Specification 002 terminal closeout merge:** `fbeac74feb846d4ed63cdcc8f366eb435481057e`  
**Specification 002 post-closeout CI:** `33507203048` — `SUCCESS` on Linux/macOS/Windows  
**State represented by this file when canonical:** `SPEC_003_ACTIVE`  
**Active product specification when canonical:** `specs/003-adapter-sdk-gold-pair/spec.md`

Live GitHub/repository truth overrides this file.

## Closed Specification 002 truth

Specification 002 closure is machine-observed because:

- terminal closeout merge `fbeac74feb846d4ed63cdcc8f366eb435481057e` is canonical;
- `specs/002-worktree-process-supervision/closeout.md` is present on canonical `main`;
- the exact closeout candidate was bounded to two documentation paths and qualified against canonical implementation revision `3a4f7cd7f308cf6535b54601d57ed5fd77dd6a91`;
- reviews, review threads, comments, mergeability, and check truth were reconciled without treating Qodo billing failure, CodeRabbit skip, or Cubic descriptive automation as independent PASS;
- the closeout merged using expected-head protection against exact head `fa0d2e8ea5871fc546e53fea35ce573abcab4bb5`;
- canonical post-closeout CI run `33507203048` completed successfully on Linux, macOS, and Windows;
- canonical authority was re-read after the merge.

Canonical post-closeout jobs:

```text
ubuntu_job = 99853980513 = SUCCESS
macos_job = 99853980434 = SUCCESS
windows_job = 99853980271 = SUCCESS
```

## Specification 003 authority

When this file and `specs/003-adapter-sdk-gold-pair/` are canonical together, Specification 003 is the sole active product implementation authority.

```text
PROGRAM_STATUS = SPEC_003_ACTIVE
ACTIVE_PRODUCT_SPEC = specs/003-adapter-sdk-gold-pair/spec.md
PRODUCT_IMPLEMENTATION_AUTHORITY = SPEC_003_ADAPTER_SDK_AND_TWO_GOLD_CANDIDATES_ONLY
NEXT_ALLOWED_WORK = SPEC_003_TASK_ORDER_ONLY
```

Specification 003 authorizes only the private adapter SDK, shared discovery/invocation/conformance boundary, and the selected first two Gold candidates:

```text
openai-codex-cli
anthropic-claude-code
```

`Gold candidate` is not the public `GOLD` tier. Neither candidate may be represented as `GOLD` before the exact applicable real-CLI conformance required by Specification 003 is machine-observed.

Gemini CLI and OpenCode remain researched successor candidates only; they are not Specification 003 implementation authority unless a later canonical amendment changes the selected pair from evidence.

## Specification 003 implementation surface

Authorized product paths are limited to:

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

Any additional product path requires a prior canonical Specification 003 plan amendment.

## Required Specification 003 invariants

- adapters expose only capabilities supported by exact evidence;
- every capability starts unverified for the Delethos adapter and is promoted only by conformance evidence;
- provider documentation/release metadata informs shaping but does not itself qualify the adapter;
- external coding-agent execution uses direct executable/argument vectors and exact worktree cwd;
- adapter processes are supervised through the canonical Specification 002 runtime;
- `CANCELLED`, `TIMED_OUT`, `STALLED`, and `OUTPUT_LIMIT` remain distinct;
- repository base/diff/changed-path truth comes from Delethos/Git, never from provider self-report;
- requested provider/model facts remain distinct from observed facts;
- unsupported controls fail closed before launch;
- prompt-only write restraint is not represented as enforced read-only behavior;
- dangerous vendor sandbox/approval bypasses are not a normal adapter path;
- synthetic fixtures qualify Delethos code paths only and cannot produce `GOLD`;
- missing binaries, credentials, platforms, or live qualification remain `UNAVAILABLE`/`UNVERIFIED`, never PASS;
- Claude Code integration is invocation-only; no proprietary vendor code/binary copying or redistribution is authorized;
- no adapter provides commit/push/merge/release authority.

## Gold qualification boundary

The roadmap outcome for Specification 003 is not complete merely because both adapter implementations exist.

Both selected candidates must satisfy their applicable real-CLI conformance on the publicly claimed platform/capability set before terminal Specification 003 closeout may represent the "first two gold adapters" outcome.

If credentialed success, required platforms, or other real qualification environments are unavailable, Specification 003 remains open/blocked at the evidence gate. Ordinary founder approval does not substitute for credentials, vendor access, executable availability, or machine-observed runtime evidence.

## Explicit non-authority

Specification 003 does not authorize:

- actual independent implementer/reviewer orchestration;
- bounded review repair loops;
- automatic reviewer choice;
- deterministic repository guard engine as a product feature;
- final portable proof-carrying patch/evidence bundle and verifier;
- CLI/TUI product surfaces;
- routing/memory/bench;
- cloud/telemetry;
- automatic commit/push/merge/release;
- automatic vendor account provisioning or credential persistence;
- secret-bearing untrusted PR workflows;
- a general security sandbox or network-isolation claim;
- Gemini CLI or OpenCode adapter implementation;
- public package/release publication;
- stable external `delethos.*.v1` claims.

## Administrative repository truth

At Specification 003 shaping time, `main` remains unprotected and no repository ruleset is configured unless live GitHub truth changes separately. Repository description/homepage/topics remain external administrative follow-up. These are not represented as PASS.

## Continuation

Qualify and merge the exact Specification 003 shaping candidate. Re-read canonical `main`. Only if this specification is active canonically may implementation begin, in `tasks.md` order and strictly inside the authorized product surface. Do not begin Specification 004 from roadmap text, and do not represent either selected adapter as `GOLD` before real conformance proves it.
