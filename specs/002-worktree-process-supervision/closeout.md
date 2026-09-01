# Specification 002 — Terminal Closeout Evidence

**Specification:** `002-worktree-process-supervision`  
**Closeout status represented by this file when canonical:** `CLOSED_CANONICAL` iff the closeout effectivity conditions below are machine-observed  
**Terminal product revision:** `3a4f7cd7f308cf6535b54601d57ed5fd77dd6a91`  
**Terminal product tree:** `481e543bf4a8f7e057cce70f81e3b03e55744a20`

Live GitHub/repository truth overrides this ledger.

## 1. Bounded outcome

Specification 002 established the first impure Delethos runtime boundary for exact-base Git worktree isolation and shell-free process supervision. The canonical implementation provides:

- non-bare repository inspection and exact 40-hex commit resolution;
- command-scoped Git execution hardening required by Amendment 001;
- detached exact-base linked worktrees locked with `delethos:<run-id>` ownership provenance;
- filesystem-canonical worktree identity across symlink/path-alias forms observed in qualification;
- clean-only ordinary worktree removal with dirty work preserved for recovery;
- explicit `INHERIT` and `EXACT` child-process environments;
- bounded stdout/stderr retention and byte accounting;
- immutable first-terminal-cause semantics;
- distinct `EXITED`, `FAILED_TO_START`, `CANCELLED`, `TIMED_OUT`, `STALLED`, and `OUTPUT_LIMIT` outcomes;
- POSIX owned process-group termination and Windows `taskkill /T /F` ordinary descendant termination;
- zero external npm production dependencies in `@delethos/runtime`.

This does not establish coding-agent adapters, reviewer execution, guard orchestration, final evidence bundles, CLI/TUI, routing, benchmarks, cloud behavior, automatic merge authority, or public package/release publication.

## 2. Authority chain

```text
spec_002_shaping_pr = 6
spec_002_shaping_merge = 39b10c6585f6201bb22ab2620013f6e1b76396ab
spec_002_shaping_push_ci = 33502613669

amendment_001_pr = 7
amendment_001_qualified_head = f8a7ce6af884a5950050528cc7a46c05dd362969
amendment_001_merge = 08c7067c02395a541e9036c4a3767c9134c413c3
amendment_001_push_ci = 33504280592

implementation_pr = 8
implementation_base = 08c7067c02395a541e9036c4a3767c9134c413c3
implementation_qualified_head = 99abd28b0329c26ccafdd3e997ef5c669dac6c4f
implementation_merge = 3a4f7cd7f308cf6535b54601d57ed5fd77dd6a91
implementation_tree = 481e543bf4a8f7e057cce70f81e3b03e55744a20
implementation_changed_paths = 12
```

Amendment 001 is normative for Specification 002 and supersedes any conflicting earlier statement that ordinary Git worktree/status preparation cannot execute repository-configured execution surfaces.

## 3. Exact implementation scope

The final implementation compare was bounded to exactly:

```text
.github/workflows/ci.yml
package.json
pnpm-lock.yaml
tsconfig.json
packages/runtime/package.json
packages/runtime/src/git.ts
packages/runtime/src/worktree.ts
packages/runtime/src/process.ts
packages/runtime/src/index.ts
packages/runtime/test/git.test.ts
packages/runtime/test/worktree.test.ts
packages/runtime/test/process.test.ts
```

No Specification 003+ product path entered the implementation candidate.

## 4. Invalidated qualification attempts

### 4.1 Run 33505484328 — invalidated

Head:

```text
1ef17811b86a3fb7b568ddbb7efd91e7fcc6172f
```

Frozen installation and TypeScript checking succeeded, but the test matrix failed. The run proved two classes of defect/incorrect assumption:

1. Effective Git configuration on hosted runners contained a global `filter.lfs` driver, while fixtures incorrectly asserted exact local-only driver lists. The product behavior was correct to discover the effective driver; the fixture was corrected to require hostile drivers as a subset while preserving additional effective drivers.
2. Worktree identity comparison was lexical. Qualification exposed real path aliases on macOS (`/var` vs `/private/var`) and Windows short/long path forms (`RUNNER~1` vs the long path). This was a product defect. The runtime was changed to filesystem-canonical identity using native realpath semantics with platform case handling.

This run is retained as failure evidence and does not qualify any revision.

### 4.2 Run 33505740671 — invalidated

Head:

```text
4d856cb1f7e248611ec46d0bf681c8ae08b2e849
```

Linux and macOS completed successfully. Windows reached 56/57 tests and failed only because a hostile-filter fixture asserted LF bytes while Git for Windows checked out the committed text with CRLF normalization. Hook/filter marker assertions and Windows descendant termination had already succeeded. The final fixture normalizes CRLF to LF for the committed-representation comparison without changing runtime behavior or weakening execution-suppression evidence.

This run is retained as partial failure evidence and does not qualify the revision.

## 5. Exact-head PR qualification

Final qualifying run:

```text
run = 33505876910
head = 99abd28b0329c26ccafdd3e997ef5c669dac6c4f
ubuntu_job = 99849663593 = SUCCESS
macos_job = 99849663740 = SUCCESS
windows_job = 99849663797 = SUCCESS
```

Every cell passed:

- frozen pnpm installation and lockfile supply-chain verification;
- TypeScript 7 static checking;
- all 57 Specification 001 + 002 tests;
- hostile Git hook/fsmonitor/filter suppression fixtures;
- exact-base detached/locked worktree fixtures;
- dirty-work preservation fixtures;
- explicit cancellation/timeout/stdio-stall/output-limit process fixtures;
- ordinary descendant termination, including Windows `taskkill` tree handling;
- zero external production dependency verification.

The PR was mergeable on the final head. Submitted reviews and review threads were empty. Qodo remained billing-blocked, CodeRabbit automatic review remained skipped because of repository threshold behavior, and Cubic output was descriptive automation only. None was represented as independent approval.

The implementation merged using expected-head protection against exact head `99abd28b0329c26ccafdd3e997ef5c669dac6c4f`.

## 6. Canonical post-merge qualification

Canonical push CI:

```text
run = 33506061231
revision = 3a4f7cd7f308cf6535b54601d57ed5fd77dd6a91
ubuntu_job = 99850268879 = SUCCESS
macos_job = 99850269255 = SUCCESS
windows_job = 99850269051 = SUCCESS
```

All three cells again passed frozen install, TypeScript checking, all 57 tests, and zero-production-dependency verification against the canonical merge revision itself.

Observed canonical toolchains:

```text
Node = 24.20.0
pnpm = 11.22.0
TypeScript = 7.0.2
@types/node = 24.13.3
Git Ubuntu = 2.55.0
Git macOS = 2.55.0
Git Windows = 2.55.0.windows.5
actions/checkout@v7 = 3d3c42e5aac5ba805825da76410c181273ba90b1
pnpm/setup@v2 = 84cb39b217b10273981911c288cd62326dc7c6d2
```

Canonical Ubuntu observed `57/57` tests, `0` failures, `0` skipped, and lockfile supply-chain verification over 23 entries. Canonical macOS and Windows independently observed the same 57-test pass count and zero-production-dependency gate.

## 7. Security and recovery result

Amendment 001 is implemented by the qualified runtime:

- inherited `GIT_*` control variables are removed from runtime Git child environments;
- `GIT_TERMINAL_PROMPT=0` is set;
- Git uses direct argument vectors with `shell: false`;
- `core.fsmonitor=false` is applied command-scoped;
- `worktree add` uses a fresh empty Delethos-owned `core.hooksPath`;
- configured effective clean/smudge/process filter driver names are discovered immediately before relevant operations and disabled command-scoped with `required=false`;
- suppressed driver names remain observable runtime facts rather than assumed configuration;
- dirty owned worktrees are not force-removed by ordinary cleanup;
- a failed clean remove triggers only a bounded re-lock attempt rather than destructive recovery.

The hostile integration fixtures proved the bounded claims on the exact qualified cross-platform revision. They do not prove a general-purpose sandbox.

## 8. Explicit residual limitations

The following remain true after Specification 002:

- a Git worktree is mutation isolation, not a security sandbox;
- Delethos does not claim perfect containment of descendants that intentionally escape the qualified ordinary process-tree relationship;
- arbitrary network or external side effects remain outside this unit;
- a separate actor can race to change Git configuration after filter discovery and before the protected command; the concurrent-config race is not claimed solved;
- external clean/smudge/process filters are suppressed, so Delethos does not claim equivalence with repository-specific hydrated/filtered checkout representations;
- Git LFS/network hydration is not established by this spec;
- no provider CLI or coding-agent behavior has been qualified yet;
- independent review execution and repair loops remain unimplemented;
- deterministic guard execution and the final portable proof-carrying patch bundle remain later work;
- `main` remains unprotected and no repository ruleset is configured unless live GitHub administrative truth changes separately;
- repository description/homepage/topics remain external administrative follow-up unless changed through a supported repository-admin surface.

## 9. Specification 003+ non-authority

No adapter/provider SDK, real coding-agent invocation, reviewer loop, product guard engine, CLI/TUI, routing, benchmark, cloud surface, publishing path, stable external `delethos.*.v1` contract, automatic commit/merge/release authority, or public release entered Specification 002.

Roadmap order alone does not activate Specification 003.

## 10. Closeout effectivity

Specification 002 becomes `CLOSED_CANONICAL` only when all of the following are machine-observed:

1. this `closeout.md` is present on canonical `main`;
2. the exact closeout candidate is qualified against canonical product revision `3a4f7cd7f308cf6535b54601d57ed5fd77dd6a91`;
3. its changed paths remain bounded to Specification 002 evidence/frontier documentation;
4. reviews, threads, substantive comments, configured checks, and mergeability are reconciled honestly;
5. the exact closeout head merges using expected-head protection;
6. canonical `main` is re-read after the closeout merge;
7. no configured required CI/check on the resulting canonical closeout revision is failing.

When those conditions are realized:

```text
SPEC_002_DISPOSITION = CLOSED_CANONICAL
PROGRAM_STATUS = POST_002_SHAPING
ACTIVE_PRODUCT_SPEC = NONE
PRODUCT_IMPLEMENTATION_AUTHORITY = NONE
NEXT_ALLOWED_WORK = BOUNDED_SPEC_003_SHAPING_ONLY
```

No recursive closeout PR is required merely to record the closeout merge SHA after those conditions are machine-observed.
