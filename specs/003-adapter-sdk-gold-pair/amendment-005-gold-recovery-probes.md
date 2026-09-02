# Specification 003 Amendment 005 — No-Inference Gold Recovery Probes

**Status:** `NORMATIVE` iff this amendment is present on canonical `main` while Specification 003 is active.  
**Evidence date:** 2026-09-02  
**Scope:** bounded, no-secret, no-model-inference, no-provider-session GitHub-hosted feasibility observations for potential Specification 003 recovery paths. This amendment does not replace either selected Gold candidate, does not authorize paid/provider-backed work, and does not promote any capability or candidate tier.

## Why this amendment exists

Specification 003 remains correctly blocked at the real-Gold evidence gate. The canonical OpenAI Codex candidate has the four-case hosted no-auth subset reconciled, but its remaining current conformance path enters authenticated/provider-backed execution. The canonical Anthropic Claude Code candidate has only the separately authorized sentinel `missing-binary` sub-fact; Amendment 003 still prohibits actual hosted Claude installation, discovery, or execution while exact-purpose vendor-use authority remains unestablished.

The Specification 003 recovery rule explicitly permits replacement of a selected Gold candidate only through an evidence-based canonical amendment, never by preference. Replacement therefore must not be selected merely because the current pair is externally blocked. Before any replacement decision, the project needs machine-observed evidence that plausible recovery candidates have a current, cross-platform, automation-suitable CLI surface that can be integrated without weakening the existing conformance contract.

Fresh public evidence on 2026-09-02 identifies two recovery candidates worth a bounded feasibility observation:

```text
github-copilot-cli
pi-coding-agent
```

They are recovery candidates only. The selected Specification 003 pair remains:

```text
openai-codex-cli
anthropic-claude-code
```

## Fresh public evidence

### GitHub Copilot CLI

GitHub's current public repository and documentation establish:

- a current public release `v1.0.82`, published 2026-08-29;
- Linux, macOS, and Windows release assets;
- programmatic prompt execution through `copilot -p` / `--prompt`;
- exact working-directory selection through `-C`;
- current-session tool allow/deny controls including `--deny-tool`;
- available-tool restriction through `--available-tools`;
- non-interactive controls including `--no-ask-user`;
- environment-isolation controls including `COPILOT_HOME` and `COPILOT_AUTO_UPDATE`;
- a license that expressly grants installation and execution of the CLI while separately stating that access to GitHub services remains subject to the applicable GitHub/Copilot terms.

Current GitHub documentation also describes Copilot-backed GitHub Actions inference, but authentication/billing guidance differs by repository ownership and workflow mode. GitHub Agentic Workflows documentation says personal repositories normally use a fine-grained `COPILOT_GITHUB_TOKEN`, while separate Copilot CLI documentation describes built-in `GITHUB_TOKEN` use in Actions. Delethos must treat that difference as unresolved for this personal repository and must not infer that a usable Copilot inference credential exists.

### Pi coding agent

The current Pi project is `earendil-works/pi`, an MIT-licensed coding-agent project. Fresh release metadata establishes current release `v0.84.4`, published 2026-08-28. Its coding-agent package is:

```text
@earendil-works/pi-coding-agent@0.84.4
```

Current source/documentation establishes:

- terminal coding-agent operation with read/write/edit/bash tools;
- print/text, JSON, and RPC process-integration modes;
- explicit provider/model selection;
- custom OpenAI-compatible providers including Ollama, LM Studio, and vLLM;
- local-provider configurations whose declared cost is zero and whose local server may ignore the configured placeholder API-key field;
- provider/model identity that can be represented explicitly rather than collapsed into the adapter name.

These facts make Pi relevant to the existing recovery rule, but documentation is shaping evidence only. They do not establish a Delethos adapter, real provider success, cross-platform qualification, or Gold.

## Codex recovery observation

Fresh Codex source and Ollama integration evidence continues to establish a real `--oss` / local-provider mode. The current official/recommended Codex local path is materially centered on GPT-OSS models and large context requirements. Delethos therefore does not authorize a hosted local-model Gold run through this amendment. A local-provider Codex Gold path may be reconsidered only after separate machine evidence establishes a bounded model/runtime profile suitable for the required Linux/macOS/Windows matrix without silently changing the claimed Gold surface.

GitHub Agentic Workflows also documents a Codex mode using GitHub-hosted Copilot inference via a `copilot/` model prefix. For personal repositories, current gh-aw authentication guidance requires a separately configured fine-grained Copilot token when organization billing is unavailable. No such credential is established by canonical Delethos evidence. This amendment therefore authorizes no Codex provider request and no Copilot-backed Codex inference.

## Normative precedence

This amendment supersedes no existing Gold, credential, vendor-use, or closeout gate.

It creates only a narrow evidence-collection exception allowing the already-authorized workflow path:

```text
.github/workflows/ci.yml
```

to perform provider-free CLI feasibility observations after this amendment itself is canonical.

Amendment 003 remains fully controlling for Claude Code. Amendments 001, 002, and 004 remain fully controlling for their existing hosted evidence surfaces.

## Authorized hosted recovery probe

After this amendment is canonical, a separate bounded implementation PR may extend `.github/workflows/ci.yml` with one marker-gated recovery observation job.

The job may run only when all of the following are true:

1. the workflow event is a push to canonical `main`;
2. the pushed head commit message contains the exact marker `[gold-recovery-probe]`;
3. repository permissions remain `contents: read` only;
4. no repository, environment, organization, vendor, or third-party secret is requested, referenced, injected, enumerated, or inspected;
5. no `copilot-requests: write`, `id-token: write`, or other inference/federation permission is granted;
6. no model, provider, inference, authentication, subscription, billing, paid-session, OAuth, PAT, API-key, or cloud-provider request is made;
7. no Claude Code executable is downloaded, installed, discovered, or executed;
8. no Codex provider/model request is made;
9. the job does not write to the repository, create Git refs, upload an evidence artifact, publish a package, create a release, or call a repository mutation API;
10. bounded output appears only in the trusted GitHub Actions job log;
11. every unexpected network/auth/provider interaction, CLI launch failure, version mismatch, or unsupported automation surface is preserved as FAIL/UNVERIFIED and is never relabeled as PASS.

## Authorized candidate observations

The recovery job may observe only the following candidate/version pair:

```text
github-copilot-cli = v1.0.82
pi-coding-agent = v0.84.4
```

on the existing hosted matrix:

```text
linux/x64
macos/arm64
windows/x64
```

For each platform, the job may:

1. materialize only the exact public release/package identified above from its official GitHub/npm distribution path;
2. verify the exact version before any other executable observation;
3. use an isolated temporary configuration/home directory;
4. disable automatic update behavior where the CLI exposes such a control;
5. execute only local, provider-free version/help/command-surface observations;
6. inspect whether the help surface exposes the automation controls required for later conformance shaping;
7. record bounded machine-readable facts in the job log.

For GitHub Copilot CLI, the bounded control observations may cover only local CLI help/version evidence for:

```text
programmatic prompt flag
working-directory control
tool allow/deny control
available-tool restriction
non-interactive no-question behavior
configuration/home isolation control
```

For Pi, the bounded control observations may cover only local CLI help/version evidence for:

```text
print/text mode
JSON mode
RPC mode
provider selection
model selection
configuration-directory isolation
```

No prompt may be sent to a model in this probe.

## Required record shape

The implementation must emit one bounded record per candidate/platform with at least:

```text
source = HOSTED_CLI_FEASIBILITY
candidate_id
candidate_version
platform
arch
executable_present
version_exact
help_exit_code
programmatic_surface_observed
machine_readable_surface_observed
cwd_control_surface_observed
permission_control_surface_observed
provider_model_identity_surface_observed
provider_request_made = false
authentication_attempted = false
secret_referenced = false
repository_mutated = false
```

A field that is not applicable to a candidate must be `NOT_APPLICABLE`, not fabricated as PASS.

## Evidence effect

A successful matrix may establish only that the observed candidate/version exposes a cross-platform local CLI surface suitable for deeper recovery shaping.

It does not establish:

- authentication readiness;
- vendor/service access authority;
- provider success or failure;
- model quality or tool-call reliability;
- write success;
- exact Delethos cwd behavior under model execution;
- read-only enforcement;
- cancellation/timeout/stall/process-tree behavior under provider execution;
- Git side-effect safety under provider execution;
- complete adapter design;
- candidate replacement;
- `SUPPORTED` or `GOLD` tier status.

## Replacement gate

Neither selected Gold candidate changes because this probe passes.

A later candidate-replacement amendment is eligible for shaping only if canonical evidence then demonstrates all of the following:

1. the replacement solves a real blocker rather than merely changing preference;
2. its execution identity can be represented without conflating adapter, provider, and model;
3. the existing real-CLI Gold rigor can be preserved without dropping required cases merely because they are difficult;
4. any authentication-required case remains required when the selected provider path requires authentication;
5. provider-free/local operation is not misrepresented as credentialed evidence;
6. the Linux/macOS/Windows matrix remains required for the claimed Gold surface;
7. the replacement does not auto-authorize Specification 004 behavior;
8. any proprietary CLI remains invocation-only and is handled under its actual license/terms boundary.

If these conditions are not established, the current pair remains selected and Specification 003 remains blocked honestly.

## Required qualification before use

The Amendment 005 PR must itself:

- change only this amendment document unless a review-driven correction requires another Specification 003 documentation path;
- pass deterministic Linux/macOS/Windows CI at its exact head;
- reconcile exact base/head/scope, checks, comments, reviews, threads, and mergeability;
- preserve unavailable/skipped review systems as non-PASS;
- merge only with expected-head protection;
- require canonical post-merge deterministic Linux/macOS/Windows CI.

Only after those conditions succeed may a separate bounded implementation PR modify `.github/workflows/ci.yml` to add the recovery probe.

## Explicit non-authority

This amendment does not authorize:

- creating or accepting a GitHub Copilot subscription;
- creating a PAT, API key, OAuth credential, cloud identity, federation rule, or vendor account;
- reading or enumerating repository/environment/organization secret values or secret names;
- referencing `COPILOT_GITHUB_TOKEN`, `OPENAI_API_KEY`, `CODEX_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, or any equivalent credential in the probe;
- model inference through GitHub Copilot, OpenAI, Anthropic, Google, Ollama, Pi, OpenCode, or any other provider;
- paid usage or consumption of a user/vendor subscription quota;
- `copilot-requests: write` or OIDC federation permissions;
- hosted Claude Code download or execution;
- candidate replacement;
- new adapter product implementation;
- Gold promotion;
- terminal Specification 003 closeout;
- Specification 004 activation.

## Completion effect

This amendment can complete only a provider-free recovery-feasibility evidence unit.

Specification 003 remains `ACTIVE_BLOCKED_REAL_GOLD` until the selected pair is genuinely qualified or a later evidence-based canonical replacement amendment changes the pair and the resulting candidates genuinely pass the complete applicable Gold matrix. No terminal closeout or Specification 004 authority follows from this amendment or its probe alone.
