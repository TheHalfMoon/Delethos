# Specification 002 — Worktree & Process Supervision Research

**Research date:** 2026-09-01  
**Authority:** bounded shaping only until Specification 002 is canonical  
**Code provenance:** no donor code copied; this document records behavior and design constraints from primary documentation.

## Question

What is the smallest cross-platform runtime boundary Delethos can implement after Specification 001 so that mutable work occurs against an exact Git base in a Delethos-owned worktree and child execution has bounded, observable termination semantics without falsely claiming a security sandbox or perfect process containment?

## Primary sources

1. Git `git-worktree` documentation: https://git-scm.com/docs/git-worktree.html
2. Node.js 24 child process documentation: https://nodejs.org/docs/latest-v24.x/api/child_process.html
3. Node.js 24 process/signal documentation: https://nodejs.org/docs/latest-v24.x/api/process.html
4. Microsoft `taskkill` documentation: https://learn.microsoft.com/windows-server/administration/windows-commands/taskkill

The implementation must re-record the actual Git/Node/pnpm versions observed in exact-head CI; these source URLs are shaping evidence, not compatibility promises.

## Git worktree observations

Current Git documents:

- `git worktree add --detach --lock --reason <reason> <path> <commit-ish>`;
- `git worktree list --porcelain -z` as the script-oriented stable format;
- a lock reason is represented in porcelain output and can identify Delethos-owned worktrees without placing an untracked ownership marker inside the worktree;
- `--lock` on `add` avoids the race between creation and a later separate lock command;
- `worktree remove` removes clean linked worktrees by default;
- unclean worktrees require `--force`;
- a Git worktree is linked repository state, not a filesystem/security sandbox.

### Shaping decision

Delethos-owned mutable execution will use a **detached, locked linked worktree at an exact 40-hex commit SHA**. Specification 002 will not create a branch and will not commit.

Ownership is represented by a bounded lock reason prefix:

```text
delethos:<run-id>
```

The runtime will verify the resulting worktree through porcelain output and exact `HEAD` equality before returning it as prepared.

### Cleanup decision

Specification 002 will **not force-remove a dirty worktree**. If tracked or untracked changes exist, cleanup returns a recovery-required result and leaves the worktree intact. This preserves partial work and avoids turning cleanup into destructive patch deletion.

A clean Delethos-owned worktree may be unlocked and removed. If removal fails after unlock, the runtime should make a bounded best effort to re-lock the owned worktree and surface recovery information rather than hide the failure.

### Recovery decision

The runtime may discover Delethos-owned linked worktrees through `git worktree list --porcelain -z`. Existing owned worktrees can be inspected. Missing/corrupt/prunable entries are surfaced as recovery-required; Specification 002 will not silently prune/repair repository administrative state.

## Repository-base observations

Mutable execution must not infer its base from free-form text. Before worktree creation, the runtime should resolve:

- repository top-level;
- Git common directory;
- current `HEAD` SHA;
- optional symbolic branch ref;
- primary-worktree dirty/clean observation;
- the caller-supplied exact base SHA as a commit object.

A dirty primary worktree does not automatically contaminate a detached worktree created from an exact commit. Specification 002 therefore records primary cleanliness but does not reject it merely for being dirty. The new worktree's exact `HEAD` remains the execution base.

## Node child-process observations

Node 24 `child_process.spawn()` supports direct executable/argument invocation without a shell, explicit `cwd`, explicit environment, piped stdio, timeout/abort primitives, and platform-specific detached behavior.

Important limits from Node documentation:

- `subprocess.killed` indicates a signal was sent successfully; it does not prove process termination;
- on non-Windows systems, `detached: true` makes the child leader of a new process group/session;
- on Windows, POSIX process groups/signals do not exist in the same sense;
- Node emulates several signals on Windows as abrupt termination;
- negative PID process-group signaling is not a portable Windows mechanism.

### Shaping decision — no shell

The generic supervisor will use `spawn(command, args, { shell: false, ... })`. Shell execution is not part of Specification 002. Adapters in a later specification must provide executable/argument vectors explicitly.

### Shaping decision — environment authority is explicit

Process requests must choose one of two environment modes:

```text
INHERIT
EXACT
```

`INHERIT` is an explicit request to inherit `process.env`; `EXACT` supplies a string map. The runtime will not serialize environment contents into result evidence.

### Shaping decision — bounded output

The supervisor will capture stdout/stderr in memory only up to a bounded configured byte limit. Overflow becomes a distinct supervisor termination reason. Specification 002 does not persist raw transcripts.

## Cancellation and tree termination

### POSIX path

For Linux/macOS, the supervised process will be launched as a new process-group/session leader. Supervisor-initiated cancellation/timeout/stall/output-limit termination will target the owned process group, first with `SIGTERM`, then after a bounded grace period with `SIGKILL` if the group still exists.

This does not guarantee containment of descendants that deliberately detach into another session/process group.

### Windows path

For Windows, the generic Node supervisor will not claim POSIX-style group ownership. Microsoft documents `taskkill /PID <pid> /T /F` as ending the target process and child processes started by it. Specification 002 will use this Windows system primitive for supervisor-initiated tree termination and qualify it with a real ordinary-descendant fixture in Windows CI.

This is a bounded managed-tree claim, **not** a guarantee against deliberately escaped/detached descendants or arbitrary external side effects.

### Native/Rust decision

A Rust/native job-object helper is **not yet justified as mandatory** for Specification 002. The current bounded Node + operating-system primitive design is testable on all three CI platforms and keeps the runtime dependency surface minimal. If exact runtime evidence later shows process-tree leakage or packaging/security requirements that Node/system primitives cannot satisfy, the failure becomes evidence for a separately authorized native helper rather than a speculative rewrite.

## `STALLED` versus `TIMED_OUT`

Specification 001 requires the states to remain distinct. Specification 002 gives them concrete but deliberately narrow runtime meaning:

- `TIMED_OUT`: the configured total wall-clock deadline expired before a prior terminal cause won.
- `STALLED`: the configured **supervised stdio inactivity** threshold expired while the root process had not terminated and no prior terminal cause won.

`STALLED` does not mean the process is deadlocked or consuming zero CPU. A quiet but healthy process can trigger stdio-inactivity stall detection. The result must name this observation model honestly.

If both deadlines could fire near the same time, a single first-terminal-cause latch decides the result. Later timers cannot relabel an already claimed terminal cause.

## Output/runtime termination categories

Candidate Specification 002 supervisor outcomes:

```text
EXITED
FAILED_TO_START
CANCELLED
TIMED_OUT
STALLED
OUTPUT_LIMIT
```

A non-zero process exit remains `EXITED` with its actual exit code; an adapter/orchestrator may later map it to a higher-level run failure. Runtime mechanism and semantic run state remain separate.

## Security non-claims

Specification 002 will not claim that:

- a worktree is a sandbox;
- child processes cannot read/write outside the worktree;
- provider network or telemetry is controlled;
- arbitrary descendants can never escape cleanup;
- external API/database/deployment side effects are contained;
- a successful exit proves a correct patch;
- stdout/stderr are safe to persist as evidence.

## Resulting bounded outcome

The evidence supports a coherent Specification 002 with two tightly coupled runtime primitives:

1. exact-base, detached, locked, recoverable Git worktree lifecycle;
2. shell-free child process supervision with bounded output and distinct cancel/timeout/stdio-stall semantics plus qualified ordinary-descendant cleanup.

Adapters, reviewer invocation, patch verification, guards, CLI, routing, release, and stable public protocol claims remain later work.
