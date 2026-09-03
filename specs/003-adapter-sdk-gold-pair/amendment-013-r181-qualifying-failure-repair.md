# Specification 003 Amendment 013 — R181 Qualifying-Failure Repair Authority

**Status:** `NORMATIVE` iff this amendment is present on canonical `main` while Specification 003 remains active.  
**Task:** `D003-R181` repair shaping only.  
**Scope:** reconcile the two independent defects exposed by the single qualifying Amendment 012 provider-prerequisite execution. This amendment does not itself execute provider qualification, complete `D003-R181`, promote any capability or Gold status, open `D003-R190` or later tasks, or authorize Specification 004.

## Canonical failed qualification

Amendment 012 authorized exactly one fresh same-tree canonical-main provider-prerequisite execution. The authorized trigger is:

```text
revision = cc0928b93b1ae36e3fa22ba10d159daf9a887f71
workflow = 33804498028
```

Core deterministic CI passed on Linux, macOS, and Windows. The provider-prerequisite matrix failed and is preserved as the qualifying R181 result for that revision.

Machine-observed provider records:

```text
linux/x64
outcome = FAIL
failed_at = pi_bounded_tool_write_smoke
failure_reason = Pi write smoke required exactly one tool execution; observed starts=0 ends=0
preceding Pi facts through pi_tool_allowlist_exact_write_only = true

windows/x64
outcome = FAIL
failed_at = pi_bounded_tool_write_smoke
failure_reason = Pi write smoke required exactly one tool execution; observed starts=0 ends=0
preceding Pi facts through pi_tool_allowlist_exact_write_only = true

macos/arm64
outcome = FAIL
failed_at = runtime_tag_commit_exact
failure_reason = GET api.github.com returned HTTP 403
```

Therefore:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

Workflow `33804498028`, its failed jobs, and its records must not be rerun, retried, or reinterpreted into PASS.

## Defect A — Pi first-turn tool selection is not machine-reliable

The Amendment 010 repair correctly removed model-level:

```json
{"tool_choice":"required"}
```

because Pi `v0.84.4` reapplies `model.samplingParams` to post-tool model turns. That removal restored natural completion semantics, but the qualifying Linux and Windows records now show that a bounded `--tools write` allowlist plus prompt alone does not reliably cause the selected Qwen model to choose the write tool. The process may settle without any retained `tool_execution_start` or `tool_execution_end` event.

The required property is not “the model was asked to write.” The required property remains machine-observed execution of exactly one Pi `write` tool call.

### Authorized Pi request shim

A repair may introduce one runner-owned, in-memory, loopback-only HTTP request shim for the **Pi write-smoke subcase only**.

The shim must:

1. bind only to `127.0.0.1` on an ephemeral port;
2. forward only to the already-verified loopback llama.cpp OpenAI-compatible endpoint selected by Amendment 008;
3. accept only the Pi write-smoke `/v1/chat/completions` traffic needed for that subcase;
4. reject a request unless the exact canonical model is requested and the exposed tool set contains exactly one tool named `write` and no other tool;
5. on the first model request that has no prior tool-result message, set request-level `tool_choice = "required"` in memory before forwarding upstream;
6. on every post-tool request, omit the forcing override so Pi can naturally produce its final non-tool completion;
7. never persist request bodies, response bodies, messages, prompts, tool arguments, transcripts, or model output as repository files or workflow artifacts;
8. retain only bounded counters/booleans needed to prove that first-turn forcing was applied exactly once and was removed after the tool-result boundary;
9. use no credential, token, API key, external proxy, extension, plugin, shell interpolation, or non-loopback listener;
10. close successfully and fail closed on listener/forwarding/cleanup errors.

The shim does **not** broaden tool authority. Pi must still be launched through the conformance-only posture with exactly:

```text
--tools write
```

No `bash`, `powershell`, `read`, `edit`, `grep`, `find`, `ls`, extension, skill, prompt-template, or other tool authority may be added.

The Pi write-smoke remains PASS only if retained Pi JSONL proves exactly one matching successful:

```text
tool_execution_start name=write
tool_execution_end   name=write
```

with one matching tool-call id, no tool error, canonical provider/model identity, exact smoke bytes, exact one-untracked-file worktree status, and unchanged fixture HEAD/refs/remotes/local Git config/hooks.

Cancellation after the bounded natural-exit grace remains FAIL.

A new required machine fact must be added for the repaired R181 record:

```text
pi_first_turn_tool_choice_shim_exact = true
```

That fact may become true only after the shim proves all of the bounded policy above and cleans up successfully.

## Defect B — anonymous GitHub REST quota is not a reliable no-secret provenance transport

The qualifying macOS job failed before runtime download because the existing anonymous call to:

```text
https://api.github.com/repos/ggml-org/llama.cpp/git/ref/tags/b10621
```

returned HTTP 403. Linux and Windows reached later gates, so this is an execution-environment/public-service transport failure, not evidence that the pinned tag, commit, or release asset changed.

The no-secret strategy must not solve this by introducing `GITHUB_TOKEN`, PATs, credentials, or authenticated REST calls.

Public evidence currently available for the pinned release includes GitHub's published SLSA provenance attestation:

```text
https://github.com/ggml-org/llama.cpp/attestations/42818481
```

That public attestation identifies:

```text
source commit = c1d0e7a004015f23bc0233470b747b596f29b264
```

and publishes subject SHA-256 digests including the exact pinned R181 assets:

```text
llama-b10621-bin-ubuntu-x64.tar.gz
sha256:91d7b03ddae498a39f28fdb85d84d2b4a0fd3838d10b4f897e0ef8975bb9b583

llama-b10621-bin-macos-arm64.tar.gz
sha256:429c8270608600188035e5e92f7d78dffb7900904fe7dd7e6a84f48068cd13cf

llama-b10621-bin-win-cpu-x64.zip
sha256:0e8b65e650e369f70f8307d890508886f171ef4fb00facccddd4a1b7ffdaca51
```

### Authorized public provenance transport

The repair may replace only the two anonymous GitHub REST metadata lookups used for runtime tag/release metadata with no-secret public transports:

1. verify `refs/tags/b10621` by a bounded, non-interactive public `git ls-remote --refs` request against the official `https://github.com/ggml-org/llama.cpp.git` repository and require exactly the pinned commit `c1d0e7a004015f23bc0233470b747b596f29b264`;
2. verify the selected release asset name, pinned source commit, and pinned SHA-256 using the public GitHub release/SLSA attestation surface for the pinned release, without authentication.

The implementation may use the pinned public attestation above and may use the public GitHub expanded release-assets HTML as a no-secret fallback only if both transports are bounded and the selected source is machine-recorded. Either source must expose the exact selected asset name and exact pinned digest; the attestation path must also expose the exact pinned source commit. A mismatch is FAIL.

The direct release archive download and independent streaming SHA-256 calculation remain mandatory and unchanged. The executable-contained/unique and executable build/commit identity gates also remain mandatory and unchanged.

The existing facts remain semantically required:

```text
runtime_tag_commit_exact
runtime_release_asset_digest_metadata_exact
runtime_archive_digest_exact
runtime_executable_contained_unique
runtime_executable_identity_exact
```

No authenticated GitHub API call may be introduced to satisfy them.

## Authorized implementation paths

For this repair only, implementation authority is limited to:

```text
scripts/recovery-provider-prereq.mjs
scripts/recovery-provider-prereq-impl.mjs
```

If the current canonical launcher continues to apply an exact verified temporary implementation patch, the repair may remain launcher-contained provided it fail-closes on exact canonical source identities and produces exactly the authorized effective implementation. No temporary repair file may be added to the repository.

No workflow trigger, adapter capability table, Gold evidence surface, provider/model/runtime pin, selected CLI version, credential boundary, or product path may change under this amendment.

## Required deterministic qualification

Before any repair becomes canonical, its exact PR head must prove on Linux, macOS, and Windows that:

1. syntax/type/tests and zero-production-dependency gates pass;
2. the provider-prerequisite job and every other real/provider/Gold marker job remain skipped on PR code;
3. Pi write-smoke still exposes exactly `--tools write` and no broader tool set;
4. the first-turn shim is loopback-only, accepts only the bounded write-smoke route/model/tool shape, forces request-level tool choice exactly once before a tool result, and does not force the post-tool request;
5. zero, duplicate, mismatched, non-write, errored, malformed, identity-drifted, truncated, or absent Pi tool evidence still fails closed;
6. natural-exit grace remains at most 30 seconds and never extends the original 300-second outer deadline;
7. cancellation remains fail-closed;
8. the public provenance parser rejects wrong repository/tag/commit/asset/digest/attestation values and uses no credential-shaped environment or request header;
9. the original direct archive digest, executable identity, no-secret, fixture-only, and no-hidden-Git invariants remain intact;
10. a fresh independent substantive semantic review covers the exact final head;
11. every substantive review finding/thread is reconciled;
12. merge uses expected-head protection.

After merge, canonical post-merge deterministic CI must again pass on Linux, macOS, and Windows with provider execution skipped.

A deterministic implementation PASS is not provider evidence.

## Later execution eligibility

This amendment **does not authorize another provider execution by itself**.

After the repaired implementation is canonical and its post-merge deterministic gate passes, a separate later canonical execution-eligibility amendment must explicitly authorize one new same-tree `[provider-prereq]` trigger. That later amendment must identify the exact repaired canonical revision and post-merge CI and must preserve run `33804498028` as failed historical evidence.

Only that separately authorized fresh trigger may produce another qualifying R181 record.

## Non-authority

This amendment does not authorize:

- rerunning or retrying workflow `33804498028` or any of its failed jobs;
- introducing GitHub credentials, API tokens, provider secrets, PATs, or authenticated metadata requests;
- weakening runtime provenance, archive digest, executable identity, model digest, loopback, no-auth, cleanup, or Git-integrity gates;
- persisting Pi request/response bodies or transcripts;
- broadening Pi tools beyond exact `write` for the smoke subcase;
- treating a smoke file without exact retained tool JSONL as PASS;
- changing OpenCode policy or promoting Pi/OpenCode to Gold;
- opening `D003-R190`, `D003-R200`, `D003-R210`, `D003-R211`, or `D003-R212` before a later fresh R181 qualification passes on all required platforms;
- authorizing Specification 004.

Until a later separately authorized canonical execution returns `outcome=PASS` with every required fact true on Linux/x64, macOS/arm64, and Windows/x64:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
D003-R200 = BLOCKED
D003-R210 = BLOCKED
D003-R211 = BLOCKED
D003-R212 = BLOCKED
Specification 004 = UNAUTHORIZED
```
