# Specification 002 — Worktree Isolation & Process Supervision

## Status

`ACTIVE` iff this specification is present on canonical `main` and `specs/CURRENT.md` names it as the active product specification. Otherwise this file is a shaping candidate only.

## Canonical prerequisite

Specification 001 is closed only after terminal closeout merge `6c8ac8b51e96099912631607218b00aa85492e38` is canonical, `specs/001-core-run-policy-evidence/closeout.md` is present, canonical authority is re-read, and post-closeout CI run `33501812656` succeeds on Linux, macOS, and Windows.

Specification 002 product implementation is not authorized until this shaping unit itself becomes canonical.

## Purpose

Implement the first impure Delethos runtime boundary: prepare mutable work against an exact Git commit in a Delethos-owned linked worktree, supervise a shell-free child process inside that worktree, distinguish completion/cancellation/timeout/stdio-inactivity stall, bound captured output, terminate an ordinary owned descendant tree as strongly as the declared platform path supports, and preserve failed/dirty work for recovery instead of deleting it.

## Outcome

A new private `@delethos/runtime` package can:

1. inspect a local non-bare Git worktree repository without running repository code;
2. resolve and validate an exact 40-hex base commit;
3. record volatile repository facts needed for execution;
4. create a detached linked worktree at that exact base;
5. lock the worktree at creation with a Delethos ownership reason;
6. verify exact `HEAD`, detached state, and ownership before use;
7. discover/inspect owned worktrees through Git's porcelain interface;
8. safely remove a clean owned worktree;
9. refuse destructive cleanup of a dirty owned worktree;
10. spawn an executable directly without a shell in an exact `cwd`;
11. require explicit environment-inheritance or exact-environment policy;
12. capture bounded stdout/stderr without persisting transcripts;
13. produce distinct process outcomes for natural exit, spawn failure, cancellation, timeout, stdio-inactivity stall, and output overflow;
14. use a first-terminal-cause latch so races cannot relabel a result;
15. perform bounded supervisor-initiated ordinary-descendant tree termination on Linux, macOS, and Windows;
16. report cleanup confidence/limitations honestly rather than claiming perfect containment.

## In scope

### Package/tooling surface

Authorized implementation paths:

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

A new runtime source/test path requires a canonical Specification 002 plan amendment before edit.

The runtime package must have **zero external npm production dependencies**. It may use Node standard-library primitives, the installed Git executable, and on Windows the operating-system `taskkill` command. It does not need a production dependency on `@delethos/core` for this bounded unit.

### Repository inspection contract

The repository inspection layer must fail closed when:

- Git is unavailable;
- the path is not inside a worktree repository;
- the repository is bare;
- the requested base is not exactly 40 lowercase/uppercase hexadecimal characters;
- the requested base does not resolve to a commit object.

It must record at minimum:

- repository top-level absolute path;
- Git common-directory absolute path;
- current `HEAD` SHA;
- requested/resolved base SHA;
- optional symbolic branch ref;
- primary-worktree dirty observation;
- observed Git version string.

These are live runtime facts. They must not be treated as durable project memory.

### Worktree contract

Worktree preparation must:

- allocate a fresh Delethos-owned temporary parent path;
- run Git with explicit argument arrays, not a shell;
- create the linked worktree detached at the exact base SHA;
- lock at creation with reason `delethos:<run-id>`;
- verify through `git worktree list --porcelain -z` that the exact worktree path exists, is detached, has the expected `HEAD`, and has the expected lock reason;
- never create/checkout a branch as a side effect;
- never modify or clean the user's primary worktree.

`run-id` must satisfy the same bounded identifier discipline used by the core: non-empty, length-bounded, and restricted to a portable character set.

### Worktree inspection/recovery contract

The runtime may report:

```text
CLEAN
DIRTY
MISSING
RECOVERY_REQUIRED
```

Dirty means tracked or untracked repository-local work is present according to a NUL-delimited Git status command. Specification 002 does not calculate the final patch/evidence bundle.

Owned-worktree discovery uses lock-reason provenance from porcelain output. Unknown locked worktrees are not adopted merely because their path name resembles Delethos.

### Cleanup contract

Safe cleanup must:

- verify ownership immediately before mutation;
- refuse if the owned worktree is dirty;
- unlock then remove only a clean linked worktree;
- remove only the fresh temporary container it created after Git removal succeeds;
- never use `git worktree remove --force` for normal cleanup;
- surface cleanup/recovery failure rather than deleting evidence of partial work.

If unlock succeeds but removal fails, a bounded attempt to restore the Delethos lock is allowed and its result must be reported.

### Process request contract

A process request must validate at minimum:

- non-empty command;
- string argument vector;
- absolute existing `cwd`;
- explicit environment mode `INHERIT` or `EXACT`;
- exact environment values are strings;
- optional positive timeout milliseconds;
- optional positive stdio-stall milliseconds;
- bounded termination grace milliseconds;
- bounded positive output-byte limit.

The supervisor must set `shell: false` and must not interpolate arguments through a command shell.

### Output contract

Stdout and stderr are captured separately as bytes decoded as UTF-8 for the current candidate API. The total retained bytes are bounded by policy. If the configured limit would be exceeded, `OUTPUT_LIMIT` claims the terminal cause and the process tree is terminated.

Raw environment contents and raw output are returned to the immediate caller only; Specification 002 does not persist them to disk or claim they are safe evidence.

### Terminal-cause contract

Exactly one supervisor terminal cause may win:

```text
EXITED
FAILED_TO_START
CANCELLED
TIMED_OUT
STALLED
OUTPUT_LIMIT
```

Rules:

- natural root exit before another cause -> `EXITED` with exact exit code/signal observation;
- spawn error before a PID exists -> `FAILED_TO_START`;
- explicit `cancel()` first -> `CANCELLED`;
- total deadline first -> `TIMED_OUT`;
- supervised stdout/stderr inactivity deadline first -> `STALLED`;
- retained-output bound first -> `OUTPUT_LIMIT`.

Later events cannot rewrite the cause.

`STALLED` specifically means **stdio inactivity under this supervisor**, not proven deadlock.

### Tree termination contract

For supervisor-initiated termination:

- Linux/macOS: launch in a new process group/session, signal the owned group with `SIGTERM`, then use `SIGKILL` after bounded grace if the group still exists;
- Windows: use `taskkill /PID <pid> /T /F` without a command shell and record the tool result.

Tests must prove ordinary root + descendant fixtures stop on the declared paths. The contract does not claim containment of a descendant that deliberately escapes the process group/tree or creates external side effects.

### Cleanup/result facts

A process result must include enough mechanism-level facts to audit the outcome without pretending semantic correctness, including:

- terminal cause;
- PID when one existed;
- exit code/signal when observed;
- stdout/stderr retained content and byte counts;
- whether output was truncated/overflowed;
- platform termination strategy;
- whether a termination attempt was needed;
- termination/cleanup status;
- elapsed monotonic milliseconds.

Wall-clock timestamps are not required for Specification 002 identity.

## Out of scope

Specification 002 does **not** authorize:

- coding-agent discovery or provider adapters;
- model/provider selection;
- reviewer invocation or repair loops;
- final diff/patch digest or proof-carrying bundle;
- repository guard command execution as a product feature;
- CLI/TUI commands;
- routing/memory/bench;
- cloud/telemetry;
- automatic commit/branch push/merge/release;
- arbitrary shell-script execution APIs;
- privilege elevation;
- network restriction;
- a sandbox claim;
- perfect containment of deliberately detached/escaped descendants;
- a public package/release or stable `delethos.*.v1` claim.

## Security claims and non-claims

A linked worktree is operational mutation isolation from the primary worktree, **not a security sandbox**.

The process supervisor owns only the process relationship it actually creates and qualifies. It must expose limitations instead of upgrading best-effort cleanup into a guarantee.

No repository hook, build, package manager, test command, or user code is executed during repository discovery/worktree preparation. Only Git metadata/worktree commands needed by this specification are permitted.

## Acceptance criteria

Specification 002 is accepted only if exact candidate evidence proves:

1. non-repositories and bare repositories fail closed;
2. malformed/non-commit base values fail closed;
3. repository inspection resolves exact root/common-dir/HEAD/base facts;
4. primary dirty state is observed without being copied into the linked worktree;
5. linked worktree is detached at exact requested base;
6. linked worktree is locked at creation with exact ownership reason;
7. porcelain `-z` parser handles spaces/unusual safe path characters without line-splitting assumptions;
8. no branch is created by worktree preparation;
9. owned-worktree discovery distinguishes Delethos lock provenance;
10. clean owned worktree cleanup succeeds;
11. dirty owned worktree cleanup fails closed and leaves content present;
12. cleanup never force-removes dirty work;
13. command execution is shell-free and uses exact `cwd`;
14. environment inheritance occurs only when explicitly selected;
15. exact environment mode passes only supplied string values;
16. stdout/stderr capture is bounded;
17. natural zero exit is represented faithfully;
18. natural non-zero exit remains mechanism-level `EXITED` with actual code;
19. spawn failure is distinct;
20. explicit cancellation is distinct;
21. total timeout is distinct;
22. stdio-inactivity stall is distinct and is reset by observed output;
23. output overflow is distinct;
24. first terminal cause cannot be overwritten by later timers/exit events;
25. supervisor-initiated ordinary descendant tree cleanup is proven on Linux;
26. the same ordinary-descendant cleanup is proven on macOS;
27. the same ordinary-descendant cleanup is proven on Windows using the declared Windows strategy;
28. no raw environment or output transcript is persisted by the runtime package;
29. runtime package has zero external npm production dependencies;
30. all pre-existing Specification 001 tests remain passing;
31. TypeScript static checking passes;
32. required CI passes on the exact implementation PR head on Linux/macOS/Windows;
33. exact changed paths remain inside the authorized surface;
34. reviews/threads/comments/checks/mergeability are reconciled honestly;
35. implementation merges with expected-head protection;
36. canonical post-merge CI succeeds on Linux/macOS/Windows;
37. no Specification 003+ behavior enters the runtime.

## Evidence requirements

Closeout must retain:

- shaping merge SHA;
- implementation base/head/merge/tree;
- exact changed-path set;
- actual Node/pnpm/TypeScript/Git versions observed;
- exact PR and post-merge workflow/job IDs;
- exact test count/results per required platform;
- worktree lifecycle integration evidence;
- dirty cleanup refusal evidence;
- process terminal-cause coverage;
- ordinary descendant cleanup evidence per OS;
- external production dependency result;
- PR review/thread/comment/mergeability truth;
- unavailable/skipped review systems as non-PASS;
- residual process-containment and worktree-security limitations.

## Recovery

If Node/system primitives cannot reliably terminate the ordinary descendant fixture on any required platform:

1. do not weaken the test or claim;
2. retain the failing exact-head evidence;
3. do not silently drop that platform;
4. shape a bounded recovery amendment before introducing a native/Rust helper or additional dependency;
5. preserve the distinction between ordinary-tree qualification and arbitrary-process containment.

If Git worktree cleanup encounters dirty or ambiguous ownership state, preserve the worktree and return recovery-required rather than force removal.

## Completion rule

Specification 002 becomes `CLOSED_CANONICAL` only after shaping is canonical, the exact product candidate satisfies all required acceptance/evidence gates, expected-head merge succeeds, canonical post-merge CI succeeds on all required platforms, terminal evidence is reconciled, and canonical authority is re-read.
