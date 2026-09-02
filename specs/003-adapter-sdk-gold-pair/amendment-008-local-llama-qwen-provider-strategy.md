# Specification 003 Amendment 008 — Local llama.cpp + Qwen Provider Strategy

**Status:** `NORMATIVE` iff this amendment is present on canonical `main` while Specification 003 is active.  
**Evidence date:** 2026-09-02  
**Task:** `D003-R180` only — shape and qualify the exact provider/runtime/model strategy required by Amendment 007 before any provider-backed Pi/OpenCode Gold qualification.  
**Scope:** select an exact local/no-secret runtime and model strategy, define its provenance and isolation gates, define the machine-observation requirements for `D003-R181`, and preserve the full Specification 003 Gold matrix. This amendment does not execute inference, does not mark either replacement adapter `SUPPORTED` or `GOLD`, and does not authorize Specification 004.

## Why this amendment exists

Canonical Amendment 007 selects these replacement Gold candidates:

```text
pi-coding-agent 0.84.4
opencode 1.18.26
```

but deliberately leaves provider-backed inference unauthorized until an exact provider/runtime/model strategy is canonical.

The strategy must remove the inaccessible credential/vendor-authority dependency that blocked the former pair without weakening real-CLI qualification. It must therefore be local, no-secret, cross-platform, bounded to the actual GitHub-hosted qualification environments, independently observable, and capable of real model completion plus coding/tool execution.

## Selected strategy

If and only if this amendment is canonical, the exact recovery provider/runtime/model strategy is:

```text
provider_strategy_id = delethos-local-llama-qwen25-coder
provider_protocol = OpenAI-compatible HTTP API
provider_endpoint = loopback-only / ephemeral local port / /v1
provider_authentication = NONE
runtime = ggml-org/llama.cpp
runtime_release = b10621
runtime_commit = c1d0e7a004015f23bc0233470b747b596f29b264
model_repository = Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF
model_revision = 2ab9f8f42af02fc212effaef7c4850c885e965f4
model_file = qwen2.5-coder-1.5b-instruct-q4_k_m.gguf
model_sha256 = cc324af070c2ecbfd324a30884d2f951a7ff756aba85cb811a6ec436933bb046
server_model_alias = delethos-qwen25-coder-1.5b-q4km
```

No floating tag, `latest`, unpinned model revision, mutable cache hit, or unverified preinstalled runtime may satisfy this strategy.

## Runtime provenance

The selected runtime is `ggml-org/llama.cpp` at release `b10621`, targeting source commit:

```text
c1d0e7a004015f23bc0233470b747b596f29b264
```

The exact source revision is MIT licensed. The runtime's server documentation at that revision establishes:

- OpenAI-compatible chat-completion routes;
- function/tool calling through the Jinja chat path;
- native tool-call handling for Qwen 2.5 and Qwen 2.5 Coder model families;
- explicit `--model`, `--alias`, `--host`, `--port`, `--api-key`, and `--jinja` surfaces;
- default server authentication of none when no API key is configured;
- loopback host support;
- CPU-only operation through `--n-gpu-layers 0`.

Source references:

```text
https://github.com/ggml-org/llama.cpp/releases/tag/b10621
https://github.com/ggml-org/llama.cpp/blob/c1d0e7a004015f23bc0233470b747b596f29b264/LICENSE
https://github.com/ggml-org/llama.cpp/blob/c1d0e7a004015f23bc0233470b747b596f29b264/tools/server/README.md
https://github.com/ggml-org/llama.cpp/blob/c1d0e7a004015f23bc0233470b747b596f29b264/docs/function-calling.md
```

### Exact platform archives

`D003-R181` must download only these exact release assets and verify the GitHub-published SHA-256 digest before extraction:

```text
linux/x64
asset = llama-b10621-bin-ubuntu-x64.tar.gz
sha256 = 91d7b03ddae498a39f28fdb85d84d2b4a0fd3838d10b4f897e0ef8975bb9b583

macos/arm64
asset = llama-b10621-bin-macos-arm64.tar.gz
sha256 = 429c8270608600188035e5e92f7d78dffb7900904fe7dd7e6a84f48068cd13cf

windows/x64
asset = llama-b10621-bin-win-cpu-x64.zip
sha256 = 0e8b65e650e369f70f8307d890508886f171ef4fb00facccddd4a1b7ffdaca51
```

The GitHub release currently reports `immutable = false`. Therefore the tag or filename alone is insufficient provenance. Qualification must fail closed unless the downloaded archive digest matches the exact value above and the extracted executable reports the expected `b10621`/source identity. Any changed upstream asset with a different digest requires a later canonical amendment rather than silent acceptance.

## Model provenance

The selected model is the official Qwen GGUF repository:

```text
Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF
```

Pinned revision:

```text
2ab9f8f42af02fc212effaef7c4850c885e965f4
```

Pinned file:

```text
qwen2.5-coder-1.5b-instruct-q4_k_m.gguf
```

Pinned file SHA-256:

```text
cc324af070c2ecbfd324a30884d2f951a7ff756aba85cb811a6ec436933bb046
```

The Hugging Face file record reports approximately 1.12 GB and Apache-2.0 licensing for the repository. It also documents direct llama.cpp use and Pi configuration against a local OpenAI-compatible llama.cpp endpoint.

Source reference:

```text
https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF/blob/2ab9f8f42af02fc212effaef7c4850c885e965f4/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf
```

Qualification must use the commit-specific download target and verify the exact SHA-256 after download. A model downloaded from `main`, a mutable alias, a different quantization, or a digest mismatch is not this strategy.

## Resource-boundary rationale

Current GitHub documentation for standard runners in public repositories reports:

```text
ubuntu-latest  = x64 / 4 CPU / 16 GB RAM / 14 GB SSD
windows-latest = x64 / 4 CPU / 16 GB RAM / 14 GB SSD
macos-latest   = arm64 M1 / 3 CPU / 7 GB RAM / 14 GB SSD
```

The selected ~1.12 GB Q4_K_M model plus the small CPU runtime archives is intentionally bounded for the lowest-memory required platform rather than selecting a larger local model by preference.

This sizing argument is shaping evidence only. It does not prove that model loading, context allocation, tool use, or the two real CLIs will succeed. `D003-R181` must machine-observe those facts on all three platforms before any Gold execution proceeds.

Current runner reference:

```text
https://docs.github.com/en/actions/reference/runners/github-hosted-runners
```

## Exact server posture

`D003-R181` and later Gold runs must start the verified `llama-server` directly, without a shell interpolation boundary, using an ephemeral verified model path and equivalent bounded arguments:

```text
--model <verified-model-path>
--alias delethos-qwen25-coder-1.5b-q4km
--host 127.0.0.1
--port <ephemeral-loopback-port>
--jinja
--ctx-size 16384
--n-gpu-layers 0
--threads 2
--threads-batch 2
--no-webui
```

The exact selected API base URL is therefore:

```text
http://127.0.0.1:<ephemeral-loopback-port>/v1
```

The server must not be started with:

```text
--api-key
--api-key-file
--tools
--agent
--mcp-servers-config
--mcp-servers-json
```

Delethos relies on Pi/OpenCode tool boundaries, not llama.cpp's experimental built-in tool executor. The model server itself receives model/tool schemas over the OpenAI-compatible API but receives no authority to access the repository filesystem.

The server must be reachable only over loopback. A wildcard/public bind such as `0.0.0.0` is outside this strategy.

## Authentication posture

The selected local provider requires no credential.

This does **not** mean an unexecuted auth case is automatically PASS. `D003-R181` must machine-prove all of the following on each required platform:

1. the server was launched without `--api-key` and without an API-key environment variable;
2. an anonymous `GET /v1/models` succeeds;
3. an anonymous non-empty chat completion succeeds;
4. no credential-bearing environment variable was read, created, injected, or persisted by the Delethos qualification path;
5. the Pi literal placeholder required by Pi's local-provider availability model is non-secret and is not accepted by the server as an authentication requirement;
6. OpenCode reaches the same endpoint without stored auth material.

Only after those observations may the replacement-pair authentication case be represented as:

```text
NOT_APPLICABLE_PROVEN_LOCAL_NOAUTH
```

It must never be called credentialed success.

## Pi 0.84.4 provider configuration

Pi `v0.84.4` documents custom local OpenAI-compatible providers through an isolated `models.json` with `baseUrl`, `api`, a literal placeholder `apiKey`, and explicit model entries. Its documentation explicitly notes that local keyless servers may use a dummy value because Pi uses configured auth presence for model availability.

The R181 isolated Pi provider must therefore use a strategy-specific configuration equivalent to:

```json
{
  "providers": {
    "delethos-local-llama": {
      "baseUrl": "http://127.0.0.1:<port>/v1",
      "api": "openai-completions",
      "apiKey": "delethos-local-no-secret",
      "compat": {
        "supportsDeveloperRole": false,
        "supportsReasoningEffort": false
      },
      "models": [
        {
          "id": "delethos-qwen25-coder-1.5b-q4km",
          "name": "Delethos local Qwen2.5 Coder 1.5B Q4_K_M",
          "reasoning": false,
          "input": ["text"],
          "contextWindow": 16384,
          "maxTokens": 2048,
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

The literal placeholder is not a secret, vendor credential, account token, or paid-access key. It must not be sourced from a secret store or environment variable.

Pi must remain in the Amendment 007 exact isolated environment posture, including its dedicated `PI_CODING_AGENT_DIR` and home isolation. Ambient user/project model configuration is prohibited.

Source reference:

```text
https://github.com/earendil-works/pi/blob/v0.84.4/packages/coding-agent/docs/models.md
```

## OpenCode 1.18.26 provider configuration

OpenCode `v1.18.26` documents local OpenAI-compatible custom providers through `@ai-sdk/openai-compatible` and a `baseURL` without requiring a stored API key. The same version documents granular `permission` rules and explicitly distinguishes `allow`, `ask`, and `deny`.

The R181 isolated OpenCode configuration must use a strategy-specific provider equivalent to:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "delethos-local-llama": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Delethos local llama.cpp",
      "options": {
        "baseURL": "http://127.0.0.1:<port>/v1"
      },
      "models": {
        "delethos-qwen25-coder-1.5b-q4km": {
          "name": "Delethos local Qwen2.5 Coder 1.5B Q4_K_M"
        }
      }
    }
  }
}
```

R181 may add only the bounded permission rules needed for its temporary fixture worktree. It must not use:

```text
--auto
--yolo
--dangerously-skip-permissions
```

and must explicitly deny or omit unrelated shell/network/external-directory authority. Later Gold read-only and write cases must use case-specific permission postures rather than treating one broad configuration as proof of both.

Source references:

```text
https://github.com/anomalyco/opencode/blob/v1.18.26/packages/web/src/content/docs/providers.mdx
https://github.com/anomalyco/opencode/blob/v1.18.26/packages/web/src/content/docs/permissions.mdx
```

## Machine-observable provider/model identity

Requested and observed identity remain separate facts.

### Pi

The Pi adapter already parses the authoritative machine-readable assistant message identity into observed provider/model facts. R181 must require:

```text
requested_provider = delethos-local-llama
requested_model = delethos-qwen25-coder-1.5b-q4km
observed_provider = delethos-local-llama
observed_model = delethos-qwen25-coder-1.5b-q4km
```

Any mismatch, missing identity, malformed stream, or fallback to another model/provider fails the prerequisite.

### OpenCode

The `opencode run --format json` stream at `v1.18.26` does not itself prove provider/model identity, so the current adapter correctly keeps observed identity `null` during ordinary run parsing.

The exact same OpenCode version provides:

```text
opencode export <sessionID> --sanitize
```

The sanitized export obtains messages from the session service and redacts transcript/file content while preserving assistant metadata. The `v1.18.26` assistant-message schema contains explicit:

```text
providerID
modelID
```

R181 may therefore perform a bounded post-run identity attestation against the just-created isolated session and require the exported assistant identity to equal:

```text
providerID = delethos-local-llama
modelID = delethos-qwen25-coder-1.5b-q4km
```

The exported transcript text must not be persisted as evidence. Only bounded identity/status fields may enter the Delethos machine record.

Source references:

```text
https://github.com/anomalyco/opencode/blob/v1.18.26/packages/opencode/src/cli/cmd/export.ts
https://github.com/anomalyco/opencode/blob/v1.18.26/packages/schema/src/v1/session.ts
```

A post-run export failure, session mismatch, multiple candidate sessions, missing provider/model, or identity drift fails closed.

## D003-R181 prerequisite matrix

After this amendment is canonical and authority is re-read, `D003-R181` may execute the selected provider/runtime/model only in fresh temporary qualification worktrees and ephemeral local runtime/configuration roots.

Each required platform must machine-observe all of these prerequisite facts:

```text
runtime_archive_digest_exact
runtime_executable_identity_exact
model_digest_exact
server_loopback_only
server_no_auth_required
server_models_endpoint_contains_exact_alias
anonymous_nonempty_model_completion
pi_cli_version_exact_0_84_4
pi_requested_identity_exact
pi_observed_identity_exact
pi_nonempty_completion
pi_bounded_tool_write_smoke
opencode_cli_version_exact_1_18_26
opencode_requested_identity_exact
opencode_sanitized_export_identity_exact
opencode_nonempty_completion
opencode_bounded_tool_write_smoke
repository_fixture_only
no_secret_referenced
no_hidden_commit_push_merge
```

Required platforms remain:

```text
linux/x64
macos/arm64
windows/x64
```

### Bounded tool-write smoke

For prerequisite feasibility only, each adapter may receive a deterministic instruction in a fresh disposable Git worktree to create one exact file with one exact content payload. Delethos must independently verify:

- the expected file exists with exact bytes;
- no unexpected path changed;
- Git base/head/refs were not changed by the adapter;
- no commit, push, merge, publish, or release occurred;
- the model generated a real provider response and a real agent tool action rather than a scripted fixture answer.

This smoke proves only that the chosen local model/runtime can exercise the adapter's coding/tool path. It does not substitute for the complete R190/R200 Gold matrix.

## D003-R181 implementation authority

Only after this amendment is canonical may `D003-R181` modify the minimal strategy-qualification surface below:

```text
.github/workflows/ci.yml
scripts/recovery-provider-prereq.mjs
packages/adapters/src/opencode.ts
packages/adapters/test/opencode.test.ts
packages/adapters/src/pi.ts
packages/adapters/test/pi.test.ts
packages/adapters/src/conformance.ts
packages/adapters/test/conformance.test.ts
scripts/adapter-conformance.mjs
```

A new script is authorized only if it is dedicated to the bounded local provider prerequisite and carries no general execution/orchestration authority beyond this specification.

Documentation/evidence reconciliation may update only Specification 003 documentation and issue #16.

No new external npm production dependency is authorized.

## R181 workflow trigger and safety boundary

The provider prerequisite must remain marker-gated and must not run on untrusted pull-request code merely because a PR exists.

A canonical-main workflow trigger may be added only after its implementation PR itself has completed exact-head deterministic qualification and review. The provider prerequisite job must:

- use `contents: read` only;
- use no repository or vendor secrets;
- install exact Pi/OpenCode versions from the already-canonical Amendment 007 baselines;
- download only the pinned runtime/model artifacts described above;
- verify every digest before execution;
- run only against generated temporary fixture repositories;
- emit bounded machine-readable records without raw prompts, transcripts, environment dumps, or hidden reasoning;
- preserve failure/unavailability rather than retrying into an invented PASS;
- kill the local model server and descendants after each job;
- verify the canonical Delethos checkout remains head/refs/worktree clean.

## Relationship to the Gold matrix

If R181 passes on all three platforms, the next authorized unit is `D003-R190`, not Gold promotion.

R181 may establish that the selected local provider path is feasible and no-auth, but the full Amendment 007 real-CLI Gold cases remain mandatory for both replacement adapters, including:

```text
exact discovery/version
missing binary
local-noauth applicability proof
bounded real write success
exact cwd/worktree behavior
read-only + forbidden-write negative path if read-only is claimed
provider/model selection
malformed provider/model behavior
provider success and provider failure
timeout
stdio-stall behavior/recovery where applicable
cancel
process-tree cleanup
partial diff preservation
missing final response handling
large output
special/quoted paths
resume if claimed
dirty repository/worktree preconditions
platform launch
no hidden commit/push/merge
machine-readable result validity
configuration-isolation assumptions
```

No R181 smoke fact may silently delete, collapse, or pre-mark an R190/R200 Gold case. Reuse of an exact machine observation is permitted only when the later Gold case explicitly identifies the same revision, platform, semantics, and evidence record; otherwise the case must be executed again.

## Failure and recovery

Any of these outcomes keeps the strategy unqualified and blocks provider-backed Gold work:

```text
archive digest mismatch
model digest mismatch
runtime identity mismatch
server bind outside loopback
server requires unexpected auth
model load failure
non-empty completion failure
tool-call incompatibility
Pi provider/model identity mismatch
OpenCode sanitized export identity unavailable or mismatched
resource exhaustion on any required platform
uncontrolled ambient configuration
unexpected repository mutation
hidden Git ref/head mutation
secret or paid-provider dependency
```

A failure is evidence. It must be preserved and reconciled. Changing runtime release, model revision, quantization, model size, provider protocol, platform scope, or authentication posture requires a later canonical amendment rather than an in-place fallback.

## Required qualification for Amendment 008

This amendment PR itself must:

- be based on exact canonical `main` after `D003-R177`;
- change only this amendment document unless a substantive review requires another Specification 003 documentation path;
- execute no provider/model/runtime during the amendment PR;
- pass deterministic Linux/macOS/Windows CI at the exact PR head;
- receive/reconcile the strongest available independent substantive semantic review on the exact head;
- preserve unavailable, skipped, billing-blocked, or rate-limited reviewers as non-PASS;
- resolve every substantive review conversation;
- verify exact base/head/scope/checks/reviews/threads/comments/mergeability immediately before merge;
- merge only with expected-head protection;
- require canonical post-merge deterministic Linux/macOS/Windows CI;
- re-read canonical authority before R181 implementation or execution.

## Explicit non-authority

This amendment does not authorize:

- running the selected model/runtime before Amendment 008 is canonical and reread;
- treating public documentation or artifact availability as provider qualification;
- using a fake model, scripted response server, replayed transcript, fixture provider, or mocked tool call as real evidence;
- accepting a digest mismatch or floating upstream version;
- reading, enumerating, creating, injecting, or persisting vendor credentials;
- consuming paid provider quota;
- exposing the local inference server beyond loopback;
- enabling llama.cpp built-in filesystem/shell tools;
- using OpenCode auto/yolo/dangerous approval bypass modes;
- widening Pi/OpenCode permissions beyond the active fixture case;
- persisting raw provider transcripts or hidden reasoning as evidence;
- representing either adapter as `SUPPORTED` or `GOLD`;
- terminal Specification 003 closeout;
- Specification 004 activation;
- automatic commit, push, merge, publish, deploy, or release behavior.

## Resulting task frontier

If this amendment is canonical, qualified, merged, and followed by successful canonical post-merge deterministic CI:

```text
D003-R170 = COMPLETE
D003-R171 = COMPLETE
D003-R172 = COMPLETE
D003-R173 = COMPLETE
D003-R174 = COMPLETE
D003-R175 = COMPLETE
D003-R176 = COMPLETE
D003-R177 = COMPLETE
D003-R180 = COMPLETE
D003-R181 = NEXT_AUTHORIZED_UNIT
D003-R190 = BLOCKED_ON_R181
D003-R200 = BLOCKED_ON_R190
D003-R210 = BLOCKED
D003-R211 = BLOCKED
D003-R212 = BLOCKED
SPEC_003_STATUS = ACTIVE_BLOCKED_REAL_GOLD
TERMINAL_SPEC_003_CLOSEOUT = NOT_AUTHORIZED
SPEC_004 = NOT_AUTHORIZED
```
