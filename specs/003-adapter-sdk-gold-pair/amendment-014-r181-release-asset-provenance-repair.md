# Specification 003 Amendment 014 — R181 Release-Asset Provenance Repair and One New Bounded Attempt

**Status:** `PROPOSED` until this amendment is independently qualified and merged to canonical `main`.  
**Task:** `D003-R181` repair/re-execution authority only.  
**Exact proposal base:** `6725d06c2929f4386af7072972b76f1f2c7c19a8`.  
**Failed canonical execution:** workflow run `33872579060`, exact trigger commit `6725d06c2929f4386af7072972b76f1f2c7c19a8`.

## Purpose

Amendment 013 repaired the two defects observed in the prior canonical R181 attempt and authorized exactly one new same-tree canonical execution after full implementation qualification. That attempt was consumed by exact commit message `[provider-prereq]` at `6725d06c2929f4386af7072972b76f1f2c7c19a8`.

The Amendment 013 attempt did not reach runtime archive download, model download, local provider startup, Pi execution, or OpenCode execution on any required platform. Linux/x64, macOS/arm64, and Windows/x64 all failed at the same newly introduced public release-metadata proof:

```text
failed_at = runtime_release_asset_public_metadata_exact
failure_reason = runtime release asset public metadata digest did not match the pinned digest
runtime_tag_commit_exact = true
runtime_release_asset_public_metadata_exact = false
```

The deterministic core matrix on that same trigger revision passed on Linux, macOS, and Windows. The provider jobs nevertheless failed and the single Amendment 013 execution attempt is permanently consumed. Run `33872579060` and its jobs must not be rerun into PASS.

This amendment records that exact failure, distinguishes the failed metadata transport from the already pinned archive identities, and proposes only the narrow repair needed to make release membership and downloaded-byte integrity independently provable without depending on a digest string embedded in GitHub's `expanded_assets` HTML.

## Preserved canonical identities

This amendment does not change the selected runtime, runtime commit, platform assets, model, provider, CLI baselines, or any pinned digest.

```text
runtime_release = b10621
runtime_commit = c1d0e7a004015f23bc0233470b747b596f29b264

linux/x64
asset = llama-b10621-bin-ubuntu-x64.tar.gz
sha256 = 91d7b03ddae498a39f28fdb85d84d2b4a0fd3838d10b4f897e0ef8975bb9b583

macos/arm64
asset = llama-b10621-bin-macos-arm64.tar.gz
sha256 = 429c8270608600188035e5e92f7d78dffb7900904fe7dd7e6a84f48068cd13cf

windows/x64
asset = llama-b10621-bin-win-cpu-x64.zip
sha256 = 0e8b65e650e369f70f8307d890508886f171ef4fb00facccddd4a1b7ffdaca51

model_revision = 2ab9f8f42af02fc212effaef7c4850c885e965f4
model_file = qwen2.5-coder-1.5b-instruct-q4_k_m.gguf
model_sha256 = cc324af070c2ecbfd324a30884d2f951a7ff756aba85cb811a6ec436933bb046
provider_id = delethos-local-llama
model_id = delethos-qwen25-coder-1.5b-q4km
pi = 0.84.4
opencode = 1.18.26
```

Fresh public GitHub release metadata for `ggml-org/llama.cpp` release `b10621` still reports the same runtime target commit and the same SHA-256 values for all three selected assets above. The canonical pins therefore remain the selected identities; this amendment does not infer a pin change from the `expanded_assets` parsing failure.

## Failure interpretation

The canonical Amendment 013 execution proves only that the specific `expanded_assets`-HTML digest assertion was not satisfied by the live transport on any required platform. Because every platform stopped at that fact, the run provides no new PASS or FAIL evidence for:

- archive download integrity;
- executable containment or executable build/commit identity;
- model download integrity;
- local server loopback/no-auth behavior;
- anonymous model completion;
- Pi completion or durable tool-write evidence;
- OpenCode completion or bounded tool-write evidence;
- repository-fixture or hidden-Git invariants after provider execution.

Those later facts remain unverified by run `33872579060`; they must not be inferred from the early provenance failure.

## Revised public provenance contract

The next repair must keep release membership and byte integrity as separate, fail-closed facts.

### Exact tag-to-commit proof

Retain the Amendment 013 public no-auth tag proof unchanged:

```text
git ls-remote --refs https://github.com/ggml-org/llama.cpp refs/tags/b10621
```

It must return exactly one tab-separated ref line binding `refs/tags/b10621` to `c1d0e7a004015f23bc0233470b747b596f29b264`.

### Exact release-asset membership proof

The public `https://github.com/ggml-org/llama.cpp/releases/expanded_assets/b10621` response may be used only to prove exact release/tag/filename membership. The repair must require exactly one asset entry whose exact `href` is:

```text
/ggml-org/llama.cpp/releases/download/b10621/<selected-platform-asset>
```

The membership parser must fail closed on a missing entry, duplicate matching entry, wrong repository, wrong tag, wrong filename, non-HTTPS redirect outside `github.com`, malformed response, or bounded-size/timeout violation.

A digest string embedded in `expanded_assets` HTML is not a required integrity fact after this amendment. If present, it may be treated only as non-authoritative diagnostic material and must not override or substitute for the canonical pinned archive digest.

### Exact downloaded-byte integrity proof

The authoritative runtime-asset integrity fact remains an independent SHA-256 over the actual downloaded release archive bytes before extraction:

```text
sha256(downloaded archive bytes) == canonical platform runtimeSha256
```

A mismatch is `FAIL` and extraction must not occur. This direct archive hash is mandatory and cannot be replaced by HTML text, a redirect URL, filename matching, release-body text, or executable version output.

### Executable identity proof

After the downloaded archive passes its canonical SHA-256 check, retain the existing unique executable containment and exact runtime build/commit identity attestation. No executable may be launched before archive integrity and extraction constraints pass.

## Machine-record reconciliation

The repaired machine record must stop claiming the failed Amendment 013 fact name as though a GitHub HTML digest were authoritative.

Replace:

```text
runtime_release_asset_public_metadata_exact
```

with a narrowly accurate release-membership fact such as:

```text
runtime_release_asset_public_binding_exact
```

The existing independent byte-integrity fact remains separate:

```text
runtime_archive_digest_exact
```

The record must continue to distinguish the provenance transports explicitly. A recommended shape is:

```text
runtime_tag_provenance_transport = git-ls-remote-public-no-auth
runtime_release_asset_provenance_transport = github-expanded-assets-exact-href-public-no-auth
```

No field may imply that an HTML digest was validated when it was not.

## Deterministic repair self-tests

Before any new provider execution, deterministic self-tests must prove at minimum:

- exact one-line tag/ref/commit parsing still accepts only the canonical tag binding;
- release membership accepts exactly one canonical exact href for each selected platform asset;
- release membership rejects missing, duplicate, wrong-repository, wrong-tag, wrong-filename, suffix/prefix-lookalike, and malformed entries;
- a digest-like string in the HTML cannot replace the exact href membership check;
- downloaded archive hashing still compares the actual byte buffer against the unchanged canonical platform SHA-256 before extraction;
- wrong downloaded bytes fail before extraction;
- executable containment/build/commit checks remain after archive integrity;
- all Amendment 013 Pi durable evidence, contradiction handling, natural-exit, timeout, provider/model identity, and OpenCode permission-policy self-tests remain unchanged and passing;
- `permissions: contents: read`, canonical-main-only execution, exact `[provider-prereq]` trigger equality, and no-secret boundaries remain unchanged.

These deterministic tests are shaping evidence only and do not complete R181.

## Exact implementation authority

Only after this amendment becomes canonical may one bounded repair PR modify:

```text
scripts/recovery-provider-prereq.mjs
```

No workflow change is authorized by Amendment 014. The canonical exact-equality `[provider-prereq]` workflow predicate from Amendment 013 must remain unchanged.

The repair may change only the Amendment 013 public release-asset provenance shaping necessary to implement the revised contract above and the corresponding deterministic self-tests/machine-record fact name. It may not change runtime/model/provider/CLI pins, runtime/model download URLs, permissions, provider commands, Pi/OpenCode behavior, timeout budgets, credential posture, or any Gold criterion.

No new production dependency is authorized.

## Repair qualification gate

The Amendment 014 implementation repair must, on one exact head:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. preserve the exact canonical runtime/model/provider/CLI pins;
3. keep provider execution skipped on pull-request code;
4. pass deterministic CI on Linux, macOS, and Windows;
5. pass all R181 pre-install and post-install deterministic self-tests on every required platform;
6. receive a fresh independent substantive semantic review of that exact head;
7. reconcile every substantive finding and leave zero unresolved substantive review threads;
8. remain based on the exact canonical `main` used for qualification;
9. merge only with expected-head protection;
10. pass canonical post-merge deterministic CI on Linux, macOS, and Windows with provider execution still skipped.

Unavailable, skipped, stale-head, rate-limited, billing-blocked, summary-only, or self-review results are not independent review PASS.

## One new bounded re-execution authority

If and only if this amendment is canonical and every implementation qualification gate above is proven on canonical `main`, Amendment 014 authorizes exactly one new same-tree canonical R181 execution.

The new trigger commit must:

- have the exact already-qualified canonical implementation tree;
- change no repository content;
- have the complete commit message exactly `[provider-prereq]` and nothing else;
- be created only after canonical post-merge deterministic Linux/macOS/Windows PASS;
- preserve the existing canonical-main/repository/no-secret/`contents: read` workflow boundaries.

The new Amendment 014 attempt is consumed when triggered regardless of PASS, FAIL, infrastructure error, or unavailable result. Run `33872579060` and all earlier failed R181 runs remain immutable failure evidence and must not be rerun.

## Success and continuation boundary

D003-R181 becomes complete only if the one Amendment 014-authorized execution independently emits, on Linux/x64, macOS/arm64, and Windows/x64:

```text
schema = delethos.spec003.r181-provider-prereq.v1
outcome = PASS
all REQUIRED_FACTS = true
```

with the revised release-membership fact and unchanged direct archive integrity/executable/model/provider/Pi/OpenCode/Git invariants all true.

If any required platform fails or any required fact is missing/false/malformed/unavailable, then:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

and no additional R181 attempt is authorized without another new bounded canonical amendment.

Only after R181 passes on all three platforms may canonical authority be re-read for `D003-R190` exactly as ordered by Amendments 007 and 008.

## Non-authority

This amendment does not authorize:

- rerunning workflow `33872579060` or any earlier R181 job;
- changing any canonical runtime, asset, archive SHA-256, model, model SHA-256, provider, Pi, or OpenCode pin;
- treating exact href/filename membership alone as archive integrity;
- extracting or launching an archive before its actual downloaded bytes match the canonical SHA-256;
- reintroducing anonymous GitHub REST API dependency into the runtime execution path;
- secrets, tokens, credentials, paid APIs, or stored authentication;
- workflow permission/event/ref/repository/matrix/runner changes;
- changing Pi write-only or natural-exit semantics;
- weakening durable Pi ToolCall/ToolResult evidence;
- changing OpenCode permissions or provider policy;
- Gold promotion;
- D003-R190/R200/R210/R211/R212 execution before R181 passes;
- Specification 003 closeout;
- Specification 004.

## Governance qualification for this amendment

This docs-only amendment PR must itself:

- be based on exact canonical `main` `6725d06c2929f4386af7072972b76f1f2c7c19a8` unless canonical `main` moves before qualification, in which case authority must be re-read before merge;
- change only this amendment document unless an independent substantive finding requires a bounded Specification 003 documentation correction;
- pass deterministic Linux/macOS/Windows CI on its exact final head;
- receive a fresh independent substantive semantic review on that exact final head;
- reconcile every substantive finding and leave zero unresolved substantive review threads;
- verify exact base/head/scope/checks/reviews/threads/mergeability immediately before merge;
- merge only with expected-head protection;
- pass canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
- re-read canonical authority before any implementation repair begins.

No provider execution is authorized by this proposal or by its merge alone.