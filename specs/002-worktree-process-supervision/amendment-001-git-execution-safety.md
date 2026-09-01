# Specification 002 Amendment 001 — Git Execution Safety

**Status:** `NORMATIVE` iff this amendment is present on canonical `main` while Specification 002 is active.  
**Research date:** 2026-09-01  
**Scope:** correction to Git discovery/worktree execution semantics only; no Specification 003+ authority.

## Why this amendment exists

Fresh primary-source verification after Specification 002 activation found that the original shaping text made one claim too broadly.

Git's current hook documentation states that `post-checkout` is invoked by `git worktree add` unless `--no-checkout` is used. Git attributes also allow configured `smudge` and long-running `process` filter commands to execute while content is checked out. In addition, current Git configuration documentation states that `core.fsmonitor` may name an external hook command used by commands such as `git status`.

Therefore the original sentence that worktree preparation executes only inert Git metadata/worktree behavior is unsafe if Delethos simply runs the user's configured Git checkout path.

Primary references:

- https://git-scm.com/docs/githooks — `post-checkout`, including `git worktree add` behavior.
- https://git-scm.com/docs/gitattributes — external clean/smudge/process filter drivers.
- https://git-scm.com/docs/git-config — `core.fsmonitor` may be a hook pathname.
- https://git-scm.com/docs/git-worktree — `worktree add`, `--no-checkout`, lock/remove semantics.

No donor code was copied.

## Normative precedence

This amendment **supersedes any conflicting Specification 002 wording** about Git commands being inherently non-executing.

The corrected invariant is:

> Delethos must not intentionally execute repository-configured hooks, external checkout/status filter commands, or external fsmonitor hooks during Specification 002 repository inspection, worktree preparation, inspection, or cleanup. The runtime must apply explicit command-scoped suppression and prove the bounded suppression path with hostile fixtures.

This is not a claim that Git as a whole is a security sandbox or that concurrent adversarial mutation of repository configuration is impossible.

## Required Git environment hygiene

The Git execution helper must construct its Git child environment deliberately rather than forwarding Git control variables unchanged.

Before spawning Git, remove inherited environment keys whose names begin with `GIT_`, then set:

```text
GIT_TERMINAL_PROMPT=0
```

The ordinary non-Git process environment remains available for locating the Git executable and operating-system runtime. Specification 002 performs local repository operations only; it does not need credential, SSH, remote, or alternate-object environment authority.

Every runtime Git command must use direct argument vectors with `shell: false`.

## Required fsmonitor suppression

Every Git command issued through the Specification 002 runtime helper must include the command-scoped configuration override:

```text
-c core.fsmonitor=false
```

This prevents a configured external fsmonitor hook pathname from being invoked by status/index-refresh paths. It may disable a user's performance optimization for the bounded Delethos command; correctness and non-execution outrank that optimization.

## Required checkout-hook suppression

`git worktree add` normally invokes `post-checkout` after checkout. Before creation, Delethos must create a fresh empty hooks directory inside the Delethos-owned temporary parent and invoke worktree creation with:

```text
-c core.hooksPath=<fresh-empty-Delethos-hooks-directory>
```

The empty hooks directory must be removed after the Git add operation completes. If its clean removal fails, preparation must surface recovery-required rather than hiding unexpected content.

The runtime must not point `core.hooksPath` at an existing user/repository directory for this operation.

## Required external filter suppression

Git checkout and status paths may execute configured filter driver commands.

Immediately before a Git operation that can materialize or compare worktree content, Delethos must discover configured filter-driver names through a non-checkout Git configuration query. The query must cover configured `clean`, `smudge`, `process`, and `required` keys across the effective local Git configuration view.

For every observed driver `<driver>`, the relevant Git operation must carry command-scoped overrides equivalent to:

```text
-c filter.<driver>.clean=
-c filter.<driver>.smudge=
-c filter.<driver>.process=
-c filter.<driver>.required=false
```

The implementation must not execute a replacement shell command such as `cat`; an empty filter command is used so Git performs no external driver process for that configured driver.

Filter-driver discovery must be repeated at the mutation/inspection boundary instead of trusting durable memory from an earlier run.

### Content implication

When an external smudge/process filter would normally hydrate content (for example an LFS-style pointer workflow), Specification 002 intentionally suppresses that external materialization. The prepared worktree may therefore contain the committed representation rather than provider-hydrated content.

Delethos must expose the set of filter-driver names it suppressed for the prepared worktree. It must not claim that such a worktree is semantically equivalent to the user's normal filtered checkout.

Supporting/authorizing hydrated filter execution is a separate future policy/security problem and is not silently enabled here.

## Concurrency limitation

Command-scoped overrides bind drivers discovered immediately before the operation. Specification 002 does not claim protection against a separate malicious process racing to introduce a previously unseen filter-driver name between discovery and Git execution.

The runtime must record this as a residual limitation rather than upgrading bounded suppression into an adversarial repository-config containment guarantee.

## Additional mandatory tests

The exact Specification 002 product candidate must add hostile fixture coverage proving at minimum:

1. a repository-local executable `post-checkout` hook that would write a marker is **not executed** by Delethos worktree preparation;
2. a configured external `smudge` filter that would write a marker is **not executed** during worktree creation;
3. a configured external `clean` filter that would write a marker is **not executed** during dirty/clean inspection or clean removal;
4. a configured external `process` filter is suppressed through the same driver override path;
5. `filter.<driver>.required=true` does not force execution when Delethos has explicitly suppressed that driver;
6. the resulting worktree exposes the suppressed driver names and the committed representation is present;
7. Git-control environment variables supplied to the parent process cannot redirect the runtime away from the explicit repository/worktree inputs covered by the test fixture;
8. all hostile fixtures remain bounded and leave no executed marker on Linux, macOS, or Windows.

If any required platform demonstrates that the documented suppression design is not reliable, do not weaken the hostile fixture. Amend Specification 002 again before introducing a different materialization mechanism or native helper.

## Product-path effect

No new product path is authorized. The correction is implemented inside the already-authorized Specification 002 files, primarily:

```text
packages/runtime/src/git.ts
packages/runtime/src/worktree.ts
packages/runtime/test/git.test.ts
packages/runtime/test/worktree.test.ts
```

## Non-authority

This amendment does not authorize:

- arbitrary Git hook execution;
- Git filter hydration;
- Git LFS/network downloads;
- repository build/install/test execution;
- adapters or model/provider execution;
- a sandbox claim;
- protection against concurrent hostile repository-config mutation;
- any Specification 003+ behavior.
