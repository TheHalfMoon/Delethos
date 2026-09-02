# Specification 003 Amendment 008 — Local Provider, Runtime, and Model Strategy

**Status:** `NORMATIVE` iff this amendment is present on canonical `main` while Specification 003 remains active.  
**Evidence date:** 2026-09-02  
**Canonical prerequisite:** Amendment 007 and the replacement adapter implementation merged at `b2cc1ce60ee5bc0f616ea0a18adbc6f757bdf01e`, with canonical post-merge CI run `33655973835` passing Linux, macOS, and Windows.  
**Scope:** satisfy `D003-R180` by selecting and pinning one exact local/no-secret provider-runtime-model strategy for machine prerequisite qualification of the selected Pi and OpenCode candidates. This amendment does not itself execute inference, qualify a Gold case, promote a capability, close Specification 003, or authorize Specification 004.

## Why this amendment exists

Amendment 007 selected the replacement Gold-candidate pair:

```text
pi-coding-agent = 0.84.4
opencode = 1.18.26
```

and deliberately left provider-backed execution gated:

```text
RECOVERY_PROVIDER_MODEL_STRATEGY = GATED_EXACT_STRATEGY_REQUIRED
PROVIDER_BACKED_INFERENCE_AUTHORITY = NOT_GRANTED_BY_AMENDMENT_007
```

The replacement implementation is now canonical and deterministically qualified. The next dependency-ordered task is therefore to choose an exact provider/runtime/model strategy that can be machine-qualified without vendor credentials, paid quota, or fake provider behavior.

This amendment selects such a strategy from exact public source, release, model, protocol, license, and cross-platform evidence. Machine feasibility remains a separate required step under `D003-R181`.

## Selected strategy

If and only if this amendment becomes canonical, the Specification 003 recovery qualification strategy becomes:

```text
provider_id = llama-cpp
provider_type = LOCAL_OPENAI_COMPATIBLE
provider_endpoint = http://127.0.0.1:<ephemeral-port>/v1
provider_authentication = NOT_APPLICABLE_IF_MACHINE_PROVEN

runtime_repository = ggml-org/llama.cpp
runtime_tag = b10621
runtime_commit = c1d0e7a004015f23bc0233470b747b596f29b264
runtime_license = MIT

model_repository = mistralai/Ministral-3-3B-Instruct-2512-GGUF
model_file = Ministral-3-3B-Instruct-2512-Q4_K_M.gguf
model_sha256 = 9ed150d4367e68df0ac8e1540f6ddc65b42d0ee26378329d1ecbca60f93fc5f8
model_xet_hash = b5357ca59705aaeeb013fa56ed7a72ad986b721768aa8d27846cb0f7fa0f5e75
model_size = 2.15 GB
model_license = Apache-2.0

server_model_alias = delethos-ministral-3b-q4km
```

`llama-cpp` is a Delethos qualification provider identifier. It identifies the isolated local llama.cpp endpoint and must be the explicit requested provider identity in both candidate adapters.

The server model alias is intentionally stable and independent of the artifact filename. The runner must configure llama.cpp with:

```text
--alias delethos-ministral-3b-q4km
```

and prove through the local server model-discovery surface that the running endpoint exposes the selected alias before either adapter is allowed to issue a provider-backed request.

## Runtime provenance

The selected runtime tag is a direct Git tag:

```text
refs/tags/b10621 -> c1d0e7a004015f23bc0233470b747b596f29b264
```

The exact tag is associated with the llama.cpp `v0.3.0` release commit and provides prebuilt artifacts for the required hosted matrix.

Only the following CPU-capable artifacts are authorized for `D003-R181`:

```text
linux/x64
artifact = llama-b10621-bin-ubuntu-x64.tar.gz
sha256   = 91d7b03ddae498a39f28fdb85d84d2b4a0fd3838d10b4f897e0ef8975bb9b583

macos/arm64
artifact = llama-b10621-bin-macos-arm64.tar.gz
sha256   = 429c8270608600188035e5e92f7d78dffb7900904fe7dd7e6a84f48068cd13cf

windows/x64
artifact = llama-b10621-bin-win-cpu-x64.zip
sha256   = 0e8b65e650e369f70f8307d890508886f171ef4fb00facccddd4a1b7ffdaca51
```

No CUDA, ROCm, Vulkan, SYCL, or other GPU-specific artifact is authorized for the prerequisite matrix. The selected runtime is MIT-licensed at the exact tag.

The runner must fail closed before extraction or execution if an artifact digest does not exactly match the value above.

## Model provenance and license boundary

The selected model is the official Mistral AI GGUF distribution:

```text
mistralai/Ministral-3-3B-Instruct-2512-GGUF
```

The exact selected file is:

```text
Ministral-3-3B-Instruct-2512-Q4_K_M.gguf
```

with the exact published content identity:

```text
sha256 = 9ed150d4367e68df0ac8e1540f6ddc65b42d0ee26378329d1ecbca60f93fc5f8
xet    = b5357ca59705aaeeb013fa56ed7a72ad986b721768aa8d27846cb0f7fa0f5e75
size   = 2.15 GB
```

The model repository identifies the model as Apache-2.0 licensed and documents local llama.cpp use. Mistral's model documentation identifies Ministral 3 3B as an edge/local model and documents function calling and structured output support.

The model repository branch itself is not treated as immutable authority. The downloaded model artifact is usable for qualification only if its bytes match the exact SHA-256 above. A changed upstream `main` that produces different bytes is a prerequisite failure, not an implicit model update.

No multimodal projector is required or authorized for the text-only Specification 003 qualification path.

## Exact llama.cpp server posture

`D003-R181` may launch only the verified `llama-server` from the selected runtime artifact and only against the verified local model file.

The prerequisite server posture is:

```text
--model <verified-local-model-file>
--alias delethos-ministral-3b-q4km
--host 127.0.0.1
--port <runner-selected-available-loopback-port>
--ctx-size 4096
--parallel 1
--n-gpu-layers 0
```

The exact `b10621` source exposes the `--model`, `--alias`, `--host`, `--port`, `--ctx-size`, `--parallel`, and `--n-gpu-layers` controls used above. `--n-gpu-layers 0` is required for the prerequisite matrix so qualification does not depend on GPU presence or vendor-specific acceleration.

The runner may add only narrowly operational, non-semantic server flags when necessary to suppress UI/log noise or make readiness machine-observable. It must not change the model, provider protocol, context bound, parallelism, host binding, authentication posture, or CPU-only requirement without a later canonical amendment.

The server must bind only to loopback. Binding to `0.0.0.0`, `::`, a LAN address, a public interface, or a remote endpoint is prohibited.

## Resource boundary

Public metadata establishes a 2.15 GB quantized model artifact and small prebuilt runtime archives, but public metadata is not sufficient to prove hosted-runner feasibility.

Therefore this amendment does not claim a memory, latency, or completion-time PASS.

`D003-R181` must machine-record, separately for Linux/x64, macOS/arm64, and Windows/x64:

```text
runtime_download_bytes
runtime_extract_success
model_download_bytes
model_sha256_verified
server_start_success
server_ready_elapsed_ms
server_process_peak_rss_bytes_or_best_available_platform_equivalent
adapter_completion_elapsed_ms
server_exit_success
process_tree_cleanup_success
```

If a required hosted environment cannot load the exact model, cannot complete within the bounded job budget, or cannot cleanly terminate the runtime, the platform is `FAIL` or `UNAVAILABLE` as actually observed. Resource pressure must not be hidden by silently changing model, quantization, context size, platform, or runtime.

## Endpoint and authentication posture

The qualification endpoint is local loopback only:

```text
http://127.0.0.1:<ephemeral-port>/v1
```

The runner must prove the local endpoint responds and exposes the exact selected model alias before adapter execution.

No vendor credential, bearer token, OAuth session, cloud account, subscription, paid quota, or remote inference provider is authorized or required by this strategy.

If llama.cpp accepts the selected local requests without authentication, machine evidence may record:

```text
provider_authentication = NOT_APPLICABLE
credentialed_success_case = NOT_APPLICABLE_FOR_THIS_LOCAL_PROVIDER_PATH
missing_invalid_auth_case = NOT_APPLICABLE_FOR_THIS_LOCAL_PROVIDER_PATH
```

only for this exact local provider strategy.

This must not be represented as credentialed evidence.

If machine evidence shows that the exact selected local runtime unexpectedly requires authentication, `D003-R181` fails closed and no credential may be invented, discovered, injected, or purchased to continue.

## Pi exact provider configuration

Pi `0.84.4` supports custom OpenAI-compatible provider definitions through the isolated `models.json` under its configured agent directory.

For `D003-R181`, the runner may create an ephemeral isolated Pi model configuration equivalent to:

```json
{
  "providers": {
    "llama-cpp": {
      "baseUrl": "http://127.0.0.1:<ephemeral-port>/v1",
      "api": "openai-completions",
      "apiKey": "none",
      "compat": {
        "supportsDeveloperRole": false,
        "supportsReasoningEffort": false
      },
      "models": [
        {
          "id": "delethos-ministral-3b-q4km",
          "reasoning": false,
          "input": ["text"],
          "contextWindow": 4096,
          "maxTokens": 512,
          "cost": {
            "input": 0,
            "output": 0,
            "cacheRead": 0,
            "cacheWrite": 0
          }
        }
      ]
    }
  }
}
```

The literal string `"none"` exists only because Pi's custom-model registry treats local keyless providers as requiring a configured auth-presence marker before model selection. It is a fixed non-secret placeholder for a loopback server that ignores authentication.

Normatively:

```text
PI_LOCAL_APIKEY_PLACEHOLDER = NON_SECRET_CONFIGURATION_MARKER
PI_LOCAL_APIKEY_PLACEHOLDER_IS_CREDENTIAL = false
```

It must never be recorded as secret discovery, credential injection, authenticated provider success, or vendor authority.

Pi must continue to run under its canonical exact isolated environment and must not inherit a user's Pi configuration, auth file, provider configuration, or ambient vendor credentials.

The existing adapter prohibition on generated `--api-key` remains controlling.

## OpenCode exact provider configuration

OpenCode `1.18.26` documents custom local llama.cpp providers through `@ai-sdk/openai-compatible`.

For `D003-R181`, the runner may create an ephemeral isolated OpenCode configuration equivalent to:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "llama-cpp": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Delethos local llama.cpp",
      "options": {
        "baseURL": "http://127.0.0.1:<ephemeral-port>/v1"
      },
      "models": {
        "delethos-ministral-3b-q4km": {
          "name": "Delethos Ministral 3B Q4_K_M"
        }
      }
    }
  }
}
```

The configuration must live only inside the canonical OpenCode isolation roots already enforced by the candidate adapter. Project configuration, ambient OpenCode config/auth state, external plugins, Claude Code integration, model fetching, and auto-update remain disabled by the canonical adapter isolation posture.

No `/connect` action and no OpenCode auth-file mutation is authorized.

## Machine-observable identity — Pi

Pi's exact JSON stream includes authoritative assistant-message provider/model identity. The canonical Pi adapter already separates:

```text
requestedProvider
requestedModel
observedProvider
observedModel
```

`D003-R181` must require:

```text
requestedProvider = llama-cpp
requestedModel = delethos-ministral-3b-q4km
observedProvider = llama-cpp
observedModel = delethos-ministral-3b-q4km
```

for a successful prerequisite record.

A missing, different, ambiguous, or malformed observed identity is a prerequisite failure even if non-empty text is returned.

## Machine-observable identity — OpenCode

The current `opencode run --format json` stream does not itself emit authoritative assistant provider/model identity into the text/tool JSON events consumed by the canonical adapter. This amendment does not authorize inference from the requested `--model` argument.

OpenCode `1.18.26` provides an exact read-only session export surface:

```text
opencode export <sessionID> --sanitize
```

The exact implementation loads the session and its messages through `Session.Service` and writes JSON. The sanitizer redacts transcript/file/path content while preserving assistant metadata. The exact `v1.18.26` assistant message schema contains:

```text
providerID
modelID
```

`D003-R181` is authorized to invoke `opencode export <sessionID> --sanitize` after the bounded run completes, under the same isolated OpenCode environment, solely to obtain machine-readable session identity evidence.

A successful prerequisite record must prove:

```text
run_requested_provider = llama-cpp
run_requested_model = delethos-ministral-3b-q4km
export_assistant_providerID = llama-cpp
export_assistant_modelID = delethos-ministral-3b-q4km
```

The exported transcript body must not be published as evidence. The qualification runner should retain only the minimum identity/status facts necessary for the machine record.

If export is unavailable, malformed, points to a different session, exposes a different provider/model identity, or cannot be reconciled to the run's exact session ID, the OpenCode prerequisite fails closed.

## Server-side model identity cross-check

Before either adapter is invoked, `D003-R181` must query the local llama.cpp OpenAI-compatible model-discovery surface and machine-observe that the selected server exposes:

```text
delethos-ministral-3b-q4km
```

The runner must reconcile three distinct identity layers:

```text
artifact_identity
server_loaded_model_identity
adapter_requested_and_observed_identity
```

No layer may be substituted for another.

## Ambient credential and provider isolation

The qualification environment must be designed so that success cannot silently fall through to an unrelated installed provider or user's credentials.

At minimum:

- Pi uses its canonical exact isolated environment and fresh agent directory;
- OpenCode uses its canonical isolated HOME/XDG/OpenCode roots and disables project config, plugins/integrations, model fetching, and auto-update as already required by the canonical adapter;
- local provider configurations list only `llama-cpp` and the selected model alias;
- the runner must not enumerate, copy, log, or persist ambient vendor credentials;
- no provider credential may be passed to either adapter;
- no remote inference endpoint may be configured;
- the local server binds only to loopback;
- runner evidence must record that no credential was intentionally referenced or injected.

This amendment does not claim the host contains no credentials. It requires the Delethos-controlled execution path not to discover, read, inject, or depend on them.

## `D003-R181` prerequisite qualification cases

After this amendment is canonical and canonical authority is re-read, `D003-R181` may implement and execute only the prerequisite needed to determine whether the selected exact strategy is viable for later Gold work.

For each required platform:

```text
linux/x64
macos/arm64
windows/x64
```

machine evidence must cover at least:

1. exact runtime artifact download and SHA-256 verification;
2. exact model artifact download and SHA-256 verification;
3. verified runtime extraction and version/build identity;
4. loopback-only llama.cpp server start with the normative bounded posture;
5. server readiness and selected model-alias observation;
6. Pi exact-version discovery and isolated local-provider configuration;
7. Pi real provider-backed non-empty completion;
8. Pi requested/observed provider+model identity equality;
9. OpenCode exact-version discovery and isolated local-provider configuration;
10. OpenCode real provider-backed non-empty completion;
11. OpenCode sanitized export identity reconciliation for the exact run session;
12. no credential reference/injection and no remote inference provider configuration;
13. bounded timeout/output/process-tree cleanup behavior for the prerequisite harness itself;
14. repository-head/ref/worktree invariants before and after the prerequisite run.

The prerequisite prompt must be deterministic in intent and require a small non-empty text response. It must not be a scripted-answer server, replayed transcript, fixture provider, or model-bypass path.

`D003-R181` does not need to prove the complete Gold coding/tool matrix. It exists to prove that the selected exact runtime/model/provider is real, portable enough to proceed, identity-observable, no-secret, and operationally bounded.

## R181 success gate

Only if all required platforms machine-observe the prerequisite facts may the project record:

```text
RECOVERY_PROVIDER_MODEL_STRATEGY = MACHINE_QUALIFIED_PREREQUISITE
PI_PROVIDER_BACKED_GOLD_EXECUTION = AUTHORIZED_NEXT
OPENCODE_PROVIDER_BACKED_GOLD_EXECUTION = AUTHORIZED_NEXT
```

This is not Gold promotion.

If one or more required platforms fail or are unavailable, the exact failure is canonical evidence. A new strategy or bounded amendment is required before provider-backed Gold execution can proceed.

## Authorized implementation surface after canonicalization

After Amendment 008 becomes canonical and canonical authority is re-read, `D003-R181` may change only the minimum existing Specification 003 paths necessary to implement the exact prerequisite harness and evidence collection:

```text
.github/workflows/ci.yml
scripts/adapter-conformance.mjs
packages/adapters/src/opencode.ts
packages/adapters/test/opencode.test.ts
packages/adapters/src/pi.ts
packages/adapters/test/pi.test.ts
packages/adapters/src/conformance.ts
packages/adapters/test/conformance.test.ts
specs/003-adapter-sdk-gold-pair/tasks.md
specs/CURRENT.md
specs/003-adapter-sdk-gold-pair/evidence-*.md
```

A new repository-local script under `scripts/` may be added only if the existing conformance script cannot keep the local runtime lifecycle and evidence logic bounded and auditable. Any such new script must be dedicated to Specification 003 recovery qualification, have deterministic machine-readable output, and remain dependency-free beyond the repository's existing runtime/toolchain.

No new external npm production dependency is authorized.

The adapter implementation may be changed only where machine identity observation or exact local-provider execution requires it. Public capability status must remain `UNVERIFIED` until later Gold evidence separately justifies promotion.

## Evidence requirements

Every R181 machine record must include at least:

```text
schema_version
source = REAL_LOCAL_MODEL
adapter_id
adapter_implementation_version
adapter_cli_version
delethos_revision
platform
arch
runtime_tag
runtime_commit
runtime_artifact
runtime_artifact_sha256_expected
runtime_artifact_sha256_observed
model_repository
model_file
model_sha256_expected
model_sha256_observed
server_bind_host
server_port
server_model_alias
server_model_alias_observed
requested_provider
requested_model
observed_provider
observed_model
session_id
final_response_nonempty
provider_request_made
authentication_required
authentication_attempted
credential_referenced
remote_inference_endpoint_configured
repository_head_unchanged
repository_refs_unchanged
repository_worktree_clean
process_tree_cleanup_success
outcome
```

Platform-specific facts may add fields but may not omit the common identity, provenance, isolation, repository-integrity, and outcome facts.

All failures, unavailable environments, digest mismatches, startup failures, model errors, cleanup failures, and identity mismatches must remain recorded as failures or unavailability. They must not be normalized into PASS.

## Gold rigor remains unchanged

A successful `D003-R181` proves only the prerequisite strategy. It cannot satisfy the complete real-CLI Gold matrix.

After a successful prerequisite, the dependency order remains:

```text
D003-R190  complete applicable Pi real-CLI Gold matrix
D003-R200  complete applicable OpenCode real-CLI Gold matrix
D003-R210  reconcile limitations and promote only machine-proven facts
D003-R211  confirm both selected candidates are genuinely GOLD
D003-R212  resume terminal Specification 003 closeout only after D003-R211
```

The complete Gold cases from Amendment 007 remain unchanged, including write behavior, exact cwd, negative permission/read-only claims where applicable, provider failure, timeout, cancellation, process-tree cleanup, partial diff preservation, missing final response, large output, special paths, dirty-worktree preconditions, platform launch, machine-readable validity, configuration isolation, and no hidden commit/push/merge.

A model that can answer a simple R181 prerequisite but cannot reliably exercise the later Gold cases does not qualify either adapter as Gold.

## Required qualification for Amendment 008

This amendment PR must itself:

- be based on exact canonical `b2cc1ce60ee5bc0f616ea0a18adbc6f757bdf01e` unless canonical `main` advances and the branch is explicitly reconciled;
- change only this amendment document unless substantive review requires another Specification 003 governance document;
- pass deterministic Linux/macOS/Windows CI at the exact PR head;
- receive and reconcile the strongest available independent substantive semantic review at the exact head;
- preserve skipped, unavailable, billing-blocked, rate-limited, or quota-limited review systems as non-PASS;
- resolve every substantive review conversation;
- reverify exact base/head/scope/checks/reviews/threads/comments/mergeability immediately before merge;
- merge only with expected-head protection;
- require canonical post-merge deterministic Linux/macOS/Windows CI;
- re-read canonical Specification 003 authority before implementing or executing `D003-R181`.

## Explicit non-authority

This amendment does not authorize:

- claiming Pi or OpenCode is `SUPPORTED` or `GOLD`;
- executing the provider/runtime/model before this amendment is canonical and post-merge qualified;
- using any runtime build, model file, quantization, provider ID, model alias, remote endpoint, context size, or platform not explicitly selected here;
- using fake providers, scripted answers, replayed transcripts, fixture models, mocked model success, or a remote service masquerading as localhost;
- discovering, enumerating, copying, logging, injecting, purchasing, or creating vendor credentials;
- consuming paid provider quota;
- binding the local inference server to a non-loopback interface;
- accepting a digest mismatch;
- silently switching to a smaller model, different quantization, GPU-only runtime, remote inference service, or different platform because of resource pressure;
- treating Pi's literal local placeholder `apiKey` as a credential or authenticated success;
- publishing unsanitized OpenCode session transcripts as evidence;
- weakening or deleting later Gold cases because the selected local model is small;
- automatic commit, push, merge, publish, or release behavior in either adapter;
- terminal Specification 003 closeout before both selected candidates are genuinely Gold;
- Specification 004 activation.

## Canonical state after merge

If and only if this amendment is canonical and its post-merge deterministic matrix is green:

```text
SPEC_003 = ACTIVE
SELECTED_GOLD_PAIR = pi-coding-agent@0.84.4 + opencode@1.18.26
PI_GOLD = NOT_QUALIFIED
OPENCODE_GOLD = NOT_QUALIFIED
RECOVERY_PROVIDER_MODEL_STRATEGY = CANONICAL_PENDING_MACHINE_QUALIFICATION
D003_R181 = AUTHORIZED_NEXT
D003_R190 = BLOCKED_ON_D003_R181
D003_R200 = BLOCKED_ON_D003_R181
D003_R211 = NOT_SATISFIED
D003_R212 = NOT_AUTHORIZED
SPEC_004 = NOT_AUTHORIZED
```
