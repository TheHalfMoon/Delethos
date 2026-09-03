# Specification 003 Amendment 009 — D003-R181 Pi natural-exit lifecycle repair

## Status

`CANONICAL` only when this amendment is merged onto canonical `main` through the normal exact-head qualification and expected-head merge discipline. Until then it grants no implementation authority.

This amendment is subordinate to the repository constitution, `AGENTS.md`, Specification 003, Amendments 007 and 008, and live canonical GitHub/repository truth. It narrows a deterministic D003-R181 repair only; it does not widen product scope or successor authority.

## Triggering canonical evidence

Canonical provider-prerequisite run `33766314536` at exact canonical revision `87f14659b90740b9f526d9911be53adf7c190e99` executed D003-R181 on Linux/x64, macOS/arm64, and Windows/x64.

All three platforms produced the same machine outcome:

```text
outcome = FAIL
failed_at = pi_bounded_tool_write_smoke
failure_reason = Pi write smoke required exactly one tool execution; observed starts=0 ends=0
```

Before that failure, all three records proved the same prerequisite facts through:

```text
runtime_tag_commit_exact = true
runtime_release_asset_digest_metadata_exact = true
runtime_archive_digest_exact = true
runtime_executable_contained_unique = true
runtime_executable_identity_exact = true
model_digest_exact = true
server_loopback_only = true
server_no_auth_required = true
server_models_endpoint_contains_exact_alias = true
anonymous_nonempty_model_completion = true
pi_cli_version_exact_0_84_4 = true
pi_requested_identity_exact = true
pi_observed_identity_exact = true
pi_nonempty_completion = true
pi_tool_allowlist_exact_write_only = true
```

The exact smoke file was created successfully, but the retained Pi JSONL contained zero `tool_execution_start` and zero `tool_execution_end` events. Extending the existing post-smoke launcher delay from 250 ms to 30 seconds did not alter that result on any platform. No retry may reinterpret these failures as PASS.

## Exact upstream lifecycle evidence

Pi tag `v0.84.4` resolves to exact commit:

```text
b79e4cc834970cca69daebffab7df1da7d1e52c4
```

At that exact revision, `packages/coding-agent/src/modes/print-mode.ts` writes JSON session events through `writeRawStdout(...)` and performs `await flushRawStdout()` in the natural `finally` path after `session.prompt(...)` completes.

The same exact source handles `SIGTERM` by disposing runtime state and then calling `process.exit(143)` without executing that natural `flushRawStdout()` path.

Canonical D003-R181 helper `waitForExactSmokeThenStop()` currently observes the exact smoke file, waits the configured post-smoke delay, and then calls `running.cancel()` when Pi has not already settled. Specification 002 process supervision therefore terminates Pi after the write has occurred but before Pi necessarily reaches its own natural stdout flush. The three-platform machine failure is consistent with this exact lifecycle behavior.

## Decision

D003-R181 must test the real Pi machine-readable tool evidence through Pi's bounded natural completion path before using cancellation as cleanup.

The repair must change the smoke lifecycle to the following fail-closed sequence:

1. launch the same exact Pi `0.84.4` invocation under the already-qualified Specification 002 supervisor;
2. retain the existing 300-second outer smoke deadline;
3. continue requiring the exact regular fixture file and exact bytes `DELETHOS_R181_OK\n`;
4. after those bytes are first observed, allow at most 30 seconds for the supervised Pi process to settle naturally;
5. if Pi settles naturally, consume the ordinary supervised process result without sending cancellation;
6. if the 30-second natural-exit grace expires first, invoke the existing supervisor cancellation path and preserve its exact cleanup/result semantics;
7. in either case, continue requiring the existing exact JSONL proof of exactly one matching `tool_execution_start` and `tool_execution_end`, both for tool `write`, with no tool error and canonical provider/model identity;
8. continue independently verifying the fixture Git repository, exact smoke bytes, unchanged HEAD/refs/remotes/config/hooks, and absence of any other mutation;
9. never convert timeout, cancellation, malformed/missing JSONL, extra tool execution, cleanup failure, or missing exact fixture evidence into PASS.

The 30-second natural-exit grace is not a retry and is not permission to issue another model request. It is one bounded lifecycle window inside the existing single Pi write-smoke execution.

## Narrow repair authority

After this amendment is canonical and its canonical post-merge deterministic checks pass, D003-R181 repair may modify only:

```text
scripts/recovery-provider-prereq-impl.mjs
scripts/recovery-provider-prereq.mjs
```

within this lifecycle defect.

This path authorization exists because `scripts/recovery-provider-prereq-impl.mjs` contains `waitForExactSmokeThenStop()` but was not named in Amendment 008's original implementation allowlist. No other new product path is authorized by this amendment.

The repair should remove the launcher timing shim when the lifecycle behavior is represented directly in the implementation. The launcher must not retain a hidden timing override after the implementation owns the canonical lifecycle constant/logic.

Deterministic self-test coverage may be added inside the same authorized implementation file only where necessary to prove the lifecycle helper remains bounded and fail closed. No external npm production dependency is authorized.

## Preserved D003-R181 boundaries

This amendment does not change any of the following:

- provider strategy, runtime release/commit, model revision/file/digest, provider ID, or model alias;
- Pi `0.84.4` or OpenCode `1.18.26` pins;
- loopback-only and no-auth provider requirements;
- Pi exact `--tools write` allowlist and product-dispatch exclusion;
- OpenCode default-deny permission policy and exact fixture target;
- exact requested/observed provider/model identity requirements;
- canonical-main-only `[provider-prereq]` execution gating;
- read-only GitHub workflow permission posture;
- disposable no-remote fixture repositories;
- no-secret, no-hidden-commit/push/merge, no-transcript-artifact, and descendant-cleanup requirements;
- all required D003-R181 machine facts;
- the Linux/macOS/Windows required platform matrix;
- the prohibition on retrying a failed canonical run into PASS without a qualified implementation repair.

## Qualification order

This amendment unit must itself satisfy:

1. exact base/head/scope verification;
2. deterministic repository CI on Linux, macOS, and Windows;
3. fresh independent substantive semantic review on the exact head;
4. zero unresolved substantive review threads;
5. expected-head merge only while canonical base remains unchanged;
6. canonical post-merge deterministic verification and authority re-read.

Only then may the two-path implementation repair be opened.

The implementation repair must then satisfy the same exact-head deterministic qualification and independent-review discipline before expected-head merge. Provider execution must remain skipped on the repair PR. Only the resulting canonical-main commit carrying `[provider-prereq]` may execute D003-R181 again.

## Non-authority

This amendment does **not**:

- make D003-R181 PASS;
- authorize D003-R190, D003-R200, D003-R210, D003-R211, or D003-R212 before their evidence prerequisites are satisfied;
- promote Pi or OpenCode capability status or Gold tier;
- weaken any real Gold conformance case;
- authorize Specification 004;
- authorize credentials, paid services, secret persistence, remote transcript artifacts, or untrusted-PR provider execution;
- authorize broad refactors of the provider prerequisite harness.

D003-R181 remains `FAIL` until a later canonical-main provider-prerequisite run proves every required fact on Linux, macOS, and Windows.
