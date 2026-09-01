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
**State represented by this file when canonical:** `SPEC_003_ACTIVE_BLOCKED_REAL_GOLD`  
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
PROGRAM_STATUS = SPEC_003_ACTIVE_BLOCKED_REAL_GOLD
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

## Current Specification 003 evidence frontier

The deterministic implementation is canonical. The hosted Codex no-auth subset is canonically reconciled. A separately authorized hosted Claude sentinel missing-executable observation is now machine-observed but remains only a partial Phase I sub-fact and does not constitute vendor execution or Gold.

```text
SPEC_003_IMPLEMENTATION_REVISION = 05ab40fa224f046c6139d52ce4421579d94b5593
SPEC_003_IMPLEMENTATION_CI = 33529134266
CODEX_HOSTED_NOAUTH_SOURCE_REVISION = 6f60edc8b388eca0476050ee9a87536166348fac
CODEX_HOSTED_NOAUTH_RUN = 33560429571
CODEX_HOSTED_NOAUTH_EVIDENCE_RECONCILIATION_MERGE = 6889ecbf2dea719e990eef90c0fd1deb39f7b1f6
CODEX_HOSTED_NOAUTH_EVIDENCE_POST_MERGE_CI = 33561052426
CODEX_HOSTED_NOAUTH_CASES = missing-binary:PASS discovery-version:PASS platform-launch:PASS auth-failure:PASS
CODEX_HOSTED_NOAUTH_MATRIX = linux/x64:PASS macos/arm64:PASS windows/x64:PASS
D003_T101 = COMPLETE
CODEX_GOLD = NOT_QUALIFIED
CLAUDE_SENTINEL_MISSING_SOURCE_REVISION = f1513318f740d66ab10575d59a112717f60a5ae4
CLAUDE_SENTINEL_MISSING_RUN = 33566060117
CLAUDE_SENTINEL_MISSING_CASE = missing-binary:PASS
CLAUDE_SENTINEL_MISSING_MATRIX = linux/x64:PASS macos/arm64:PASS windows/x64:PASS
D003_T121 = OPEN_PARTIAL_MISSING_BINARY_SUBFACT_ONLY
CLAUDE_VENDOR_USE_AUTHORITY = NOT_ESTABLISHED_IN_CANONICAL_EVIDENCE
CLAUDE_HOSTED_NOAUTH_EXECUTION = PROHIBITED_WHILE_GATE_UNSATISFIED
CLAUDE_GOLD = NOT_QUALIFIED
TERMINAL_SPEC_003_CLOSEOUT = NOT_AUTHORIZED
SPEC_004 = NOT_AUTHORIZED
```

Run `33560429571` used exact `codex-cli 0.152.0`. Its `auth-failure` case was status-only in an isolated unauthenticated environment and did not dispatch an agent/model request. The subsequent evidence reconciliation merge `6889ecbf2dea719e990eef90c0fd1deb39f7b1f6` passed canonical post-merge deterministic CI run `33561052426` on Linux, macOS, and Windows; the marker-gated hosted Codex job was skipped on that documentation-only push as expected.

Only `D003-T101` is completed by the hosted Codex subset. `D003-T100` remains an ongoing exact-identity requirement for future qualified runs; the remaining Phase H tasks still require their applicable real credentialed/provider-backed evidence.

Canonical Amendment 004 authorized only the existing sentinel `missing-binary` conformance branch under the Claude candidate identity. Canonical run `33566060117` at exact revision `f1513318f740d66ab10575d59a112717f60a5ae4` completed successfully with Linux/x64, macOS/arm64, and Windows/x64 each observing PASS. Each platform first machine-verified that the bounded `missing-binary` branch retained the deliberate `delethos-definitely-missing-${process.pid}` sentinel and contained no `discoverAdapter`, `startAgent`, `runClaude`, or `authState` call before emitting the record. The records reported `adapterId = anthropic-claude-code`, `executablePath = null`, `cliVersion = null`, `detail = missing-state=NOT_INSTALLED`, and clean Git head/refs/worktree facts.

That result does **not** establish whether the actual Claude Code executable is installed on any runner. The case intentionally does not test that proposition and no Anthropic binary was discovered or executed. It establishes only the missing-executable conformance sub-fact for `D003-T121`; the task remains open because invalid/missing-auth behavior still requires actual Claude execution.

Canonical Amendment 003 remains fully controlling for any actual Claude Code installation, discovery, or execution. It requires genuine, bounded, non-secret project evidence establishing vendor-use authority before hosted Claude Code use. Ordinary founder approval, public release availability, repository ownership, technical installability, or the sentinel observation does not satisfy that vendor-use gate. Any future Claude execution must also revalidate the authority immediately before execution and freshly verify the official signing key fingerprint, detached manifest signature, artifact integrity, executable integrity, and exact CLI version.

All remaining Phase I executable-present/provider-backed work remains evidence-gated. Phase K remains blocked until both selected candidates genuinely satisfy the Gold gate.

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

Continue Specification 003 only in canonical task order and only from exact live evidence.

For Codex, the Amendment 001 no-auth subset is complete and reconciled, but the remaining Phase H Gold surface requires genuine credentialed/provider-backed execution environments and exact machine-observed results. Do not convert missing credentials, provider availability, or unexecuted cases into PASS.

For Claude Code, the Amendment 004 sentinel missing-executable sub-fact is machine-observed, but `D003-T121` remains open and no actual vendor executable behavior is qualified. Do not download, install, discover, unpack, or execute a hosted Claude binary while `CLAUDE_VENDOR_USE_AUTHORITY` remains unestablished or stale under Amendment 003. If genuine bounded authority evidence becomes canonical, revalidate it immediately before any separately authorized execution unit and follow the fresh signed-manifest/fingerprint provenance gate.

Do not produce terminal Specification 003 closeout or begin Specification 004 unless both selected candidates are genuinely `GOLD` under the complete applicable real-CLI evidence matrix and the resulting closeout is itself qualified and merged canonically.
