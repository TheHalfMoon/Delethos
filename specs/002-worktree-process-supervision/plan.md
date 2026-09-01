# Specification 002 — Implementation Plan

## Objective

Add the smallest cross-platform impure runtime layer required to prepare exact-base Git worktrees and supervise bounded child execution without entering adapter, review, guard, CLI, routing, or release scope.

## Authorized implementation surface

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

Specification/evidence documents may be changed only in separately bounded shaping/closeout units.

## Sequence

### Phase A — Repository facts

Implement a shell-free Git command helper private to `git.ts` and the public repository inspection contract. Resolve non-bare repository root, common directory, exact current HEAD, optional branch ref, dirty observation, exact base commit, and Git version.

Do not execute hooks, builds, package managers, or repository code.

### Phase B — Owned detached worktrees

Implement `worktree.ts` around exact Git argument vectors:

- allocate fresh temporary parent;
- `worktree add --detach --lock --reason ...` at exact base;
- parse `worktree list --porcelain -z`;
- verify detached/HEAD/lock reason;
- inspect clean/dirty state;
- discover owned worktrees;
- clean-only unlock/remove;
- bounded re-lock attempt on cleanup failure.

No force cleanup path is authorized.

### Phase C — Process supervisor

Implement validated shell-free spawn requests with:

- explicit environment mode;
- exact cwd;
- bounded stdout/stderr;
- monotonic elapsed time;
- cancellation;
- total timeout;
- resettable stdio-inactivity stall timer;
- output-limit termination;
- single first-terminal-cause latch.

### Phase D — Platform termination

Implement a small private platform branch inside `process.ts`:

- POSIX process-group TERM -> bounded grace -> KILL;
- Windows `taskkill /PID <pid> /T /F`.

Do not represent these mechanisms as a sandbox or as arbitrary-descendant containment.

### Phase E — Tests

Use only temporary fixture repositories/processes created by the test suite.

Git/worktree integration tests must include:

- non-repo/bare/malformed base negative paths;
- exact detached base;
- ownership lock reason;
- path with spaces;
- dirty primary isolation;
- owned discovery;
- clean cleanup;
- dirty cleanup refusal/preservation.

Process tests must include:

- zero/nonzero natural exit;
- spawn failure;
- exact cwd;
- environment modes;
- bounded stdout/stderr;
- cancel;
- timeout;
- stall reset by output then stall;
- output overflow;
- race/first-cause behavior;
- ordinary child-descendant termination verified by PID liveness checks.

Tests must use bounded polling and timeouts so a defect cannot hang CI indefinitely.

### Phase F — CI

Extend repository CI rather than creating an independent truth path.

Each OS cell must record:

```text
node --version
pnpm --version
git --version
```

Then run frozen install, full TypeScript check, all core + runtime tests, and dependency checks. The workflow must retain `contents: read` only and perform no publish/deploy/release action.

## Dependency plan

No new npm runtime or development dependency is planned. Existing Node 24, TypeScript 7, Node typings, pnpm, Git, and Windows `taskkill` are sufficient for the candidate.

If implementation evidence disproves that assumption, stop and amend this plan before adding dependencies or a Rust/native helper.

## Failure handling

- Git ambiguity -> fail closed before mutation.
- Failed worktree verification -> bounded cleanup only if the worktree is proven owned and clean; otherwise preserve and report.
- Dirty worktree cleanup request -> refuse.
- Process spawn failure -> `FAILED_TO_START`.
- Supervisor termination failure -> preserve the original terminal cause plus cleanup-failure facts; do not relabel it as successful cleanup.
- CI platform failure -> no merge; diagnose on exact head.

## Merge discipline

Implementation must use a bounded branch/PR. Before merge, re-check canonical base, exact head, allowed paths, all required CI, reviews, threads, substantive comments, bot availability, and mergeability. Merge only with expected-head protection. Require canonical push CI afterward before closeout.
