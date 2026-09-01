# Specification 003 — Adapter SDK & Gold-Candidate Research

**Research date:** 2026-09-01  
**Authority:** bounded successor shaping only until this specification is canonical  
**Code provenance:** no donor code copied; this document records current public CLI/documentation/repository behavior and selection rationale.

## Question

Which first two real coding-agent CLIs best prove Delethos's verified-delegation wedge, and what is the smallest adapter contract/conformance boundary that can integrate them without inventing capabilities, weakening execution identity, or treating an agent's self-report as repository truth?

## Canonical prerequisite observed before research

Specification 002 terminal closeout is canonical at:

```text
closeout_merge = fbeac74feb846d4ed63cdcc8f366eb435481057e
post_closeout_ci = 33507203048
ubuntu_job = 99853980513 = SUCCESS
macos_job = 99853980434 = SUCCESS
windows_job = 99853980271 = SUCCESS
```

Canonical authority therefore permits bounded Specification 003 shaping only. No adapter implementation was authorized while this research was performed.

## Selection principles

The first pair is selected to maximize proof of Delethos's product thesis rather than maximize adapter count or popularity.

Required considerations:

- meaningful real-world adoption;
- distinct execution/provider identity suitable for later independent-review policy;
- non-interactive/headless execution;
- exact working-directory control;
- inspectable repository mutation;
- process cancellation and cleanup compatibility;
- machine-readable or reliably parseable completion;
- model/provider control only where the CLI actually exposes it;
- observable authentication failure;
- license/integration feasibility;
- Linux/macOS/Windows relevance;
- ability to fail closed on unsupported or ambiguous controls.

Repository stars below are a volatile adoption observation only. They are not a quality score and are not a qualification gate.

## Current candidate snapshot

| Candidate | Current public evidence | License/integration posture | Initial shaping conclusion |
| --- | --- | --- | --- |
| OpenAI Codex CLI | `codex exec` non-interactive path; JSONL events; exact `--cd`; model selection; explicit sandbox modes; resume/review surfaces; Linux/macOS/Windows artifacts | Apache-2.0 repository; invocation of user-installed CLI | **SELECTED_GOLD_CANDIDATE** |
| Anthropic Claude Code | `-p` headless mode; text/JSON/stream-JSON output; model selection; bounded turns/budget; permission controls; session resume; macOS/Linux/Windows artifacts | proprietary CLI; use subject to Anthropic terms; invocation-only integration, no copying/redistribution | **SELECTED_GOLD_CANDIDATE** |
| Google Gemini CLI | headless mode; JSON/JSONL; documented exit codes; sandbox/policy controls; API-key/Vertex authentication; Apache-2.0 | Apache-2.0 repository; strong future candidate | `DEFERRED_CANDIDATE` |
| OpenCode | headless `run`; JSON output; `--dir`; provider/model selection; broad provider ecosystem; MIT | MIT; very broad provider surface | `DEFERRED_CANDIDATE` pending composite execution-identity refinement |

Observed repository adoption at research time was approximately:

```text
OpenCode   = 202,967 stars
Claude Code = 143,643 stars
Codex       = 120,615 stars
Gemini CLI  = 106,758 stars
```

These counts are intentionally not persisted as a product claim beyond this dated research record.

## Selected pair

The first two **Gold candidates** are:

```text
openai-codex-cli
anthropic-claude-code
```

`Gold candidate` is a shaping term only. Neither adapter may be presented publicly as `GOLD`, `SUPPORTED`, or platform-qualified until the exact implementation and applicable real-CLI conformance evidence satisfy the specification.

### Why Codex

Current Codex source and release evidence exposes a particularly strong automation boundary:

- `codex exec` runs a new non-interactive session when no exec subcommand is supplied;
- `--json` emits JSONL events to stdout;
- `--output-schema` can constrain final response shape;
- `--output-last-message` separates the final message artifact;
- `--ephemeral` disables persisted session files for the invocation;
- `--ignore-user-config` and `--ignore-rules` reduce ambient local configuration influence;
- `--model` selects a model;
- `--cd` selects the working root;
- sandbox modes include `read-only`, `workspace-write`, and dangerous full-access behavior;
- resume/fork/review execution surfaces exist;
- current packaging/release paths include Windows as well as Linux/macOS.

Delethos must never use Codex's dangerous approval/sandbox-bypass option as a convenience path.

Provider selection is not treated as generally supported. Codex exposes OpenAI-default operation plus an OSS/local-provider path; the adapter will report only the exact provider controls proven against the selected CLI version.

### Why Claude Code

Current Claude Code documentation and releases expose a distinct vendor/execution identity with a strong non-interactive contract:

- `claude -p` provides non-interactive execution;
- output formats include text, JSON, and stream-JSON;
- JSON results expose a session identifier and structured result metadata;
- `--model` selects a model;
- `--max-turns` and `--max-budget-usd` bound provider-side agent activity/cost when supported by the current version;
- tool/permission controls can allow, deny, or limit execution surfaces;
- `--continue` and `--resume` expose provider-native session continuation;
- `--bare` intentionally suppresses several ambient extension/configuration sources for scripting, with an important authentication tradeoff;
- current releases include native macOS, Linux, and Windows assets.

Claude Code's repository license file states that the software is proprietary and use is subject to Anthropic's commercial terms. Delethos therefore integrates by invoking a user-installed CLI through documented public behavior. Specification 003 does not authorize copying, vendoring, modifying, or redistributing Claude Code binaries/source.

`--bare` cannot be treated as universally available automation posture because it intentionally changes authentication behavior. The adapter must distinguish a controlled bare path from a controlled standard path and prove whichever path it claims during conformance.

## Why not make Gemini CLI one of the first two

Gemini CLI is a strong candidate and is not rejected. Current official evidence includes headless operation, JSON/stream-JSON output, explicit exit-code semantics, authentication surfaces, and sandbox/policy controls under an Apache-2.0 repository.

The first pair instead prioritizes the simplest demonstration of Delethos's independent-review wedge across two highly distinct vendor CLIs while keeping the initial normalized contract small. Gemini should be reconsidered immediately after the first pair has proven the SDK/conformance model.

## Why not make OpenCode one of the first two

OpenCode is also a strong candidate and currently has the broadest observed repository adoption of this candidate set. Its provider-neutrality is valuable later, but it creates a harder first execution-identity problem: `OpenCode` alone is not sufficient reviewer identity when the underlying provider/model may vary across many providers and authentication modes.

A later adapter should model the composite identity explicitly rather than collapse it into one adapter name. Deferring this complexity protects the first conformance contract from prematurely encoding ambiguous provider identity.

## Initial capability posture

Every capability starts `UNVERIFIED` for the Delethos adapter regardless of vendor documentation. Documentation supports shaping and test design; real adapter qualification owns public support status.

Allowed capability states remain:

```text
SUPPORTED
PARTIAL
UNSUPPORTED
UNAVAILABLE
UNVERIFIED
```

Candidate expectations to prove or downgrade:

| Capability | Codex expectation | Claude expectation |
| --- | --- | --- |
| discovery/version | expected supported | expected supported |
| headless execution | expected supported | expected supported |
| exact cwd | expected supported | process cwd + CLI behavior must be proven |
| workspace write | expected supported | expected supported |
| enforced read-only | expected supported through sandbox mode | `PARTIAL/UNVERIFIED` until permission behavior is proven; prompt-only restraint is insufficient |
| machine-readable output | expected JSONL | expected JSON/stream-JSON |
| model selection | expected supported | expected supported |
| provider selection | partial | partial |
| resume | expected supported | expected supported |
| bounded provider-side turns/cost | unverified/provider-specific | expected partial/supported where current CLI exposes controls |
| native sandbox | provider-specific, never upgraded into a Delethos sandbox claim | provider-specific/permission behavior, never upgraded into a Delethos sandbox claim |
| cancellation | Delethos process supervisor path must be proven | Delethos process supervisor path must be proven |

## Deterministic adapter contract direction

Specification 003 should introduce a private adapter package with a normalized contract that separates:

1. **discovery facts** — binary path, observed CLI version, availability;
2. **capability facts** — exact capability state with evidence/provenance;
3. **execution request** — bounded cwd, posture, prompt, model/provider controls only when supported, environment policy, timeout/stall/output policy;
4. **invocation plan** — exact executable and argument vector with no shell interpolation;
5. **process observation** — delegated to the already-qualified Specification 002 supervisor;
6. **provider result normalization** — structured final/provider events without trusting them for repository mutation truth;
7. **execution identity** — adapter id/version, CLI version/path, requested/observed provider/model facts where available, session id where exposed, and platform qualification facts.

Repository base, diff, dirty state, and changed-path truth continue to come from Delethos/Git, not from the coding agent.

## Configuration-isolation requirements

### Codex

The candidate should prefer an automation posture that minimizes ambient behavior:

- direct executable invocation;
- exact `--cd` equal to the Delethos worktree;
- `--ignore-user-config` unless a separately proven required control cannot be expressed otherwise;
- `--ignore-rules` unless explicitly authorized by a future policy surface;
- `--ephemeral` for non-resume runs where session persistence is unnecessary;
- explicit safe sandbox mode;
- no dangerous approval/sandbox bypass;
- no dangerous hook-trust bypass.

Conformance must still prove which hooks/config/extensions can affect the exact qualified CLI version. Source/documentation expectations are not enough.

### Claude Code

Two possible automation postures require explicit evidence:

```text
CONTROLLED_BARE
CONTROLLED_STANDARD
```

`CONTROLLED_BARE` may be used only when compatible non-interactive authentication is actually available and the exact version proves the intended suppression behavior.

`CONTROLLED_STANDARD` must explicitly constrain configurable sources as far as the CLI permits, including settings/MCP/plugin/hook behavior. Managed organization policy may still apply and must remain visible rather than being treated as bypassable.

If ambient behavior cannot be bounded enough for a claimed capability, the capability is downgraded or the adapter is ineligible for `GOLD`.

## Conformance evidence model

Specification 003 needs two distinct evidence layers.

### Layer 1 — deterministic repository CI

Runs without vendor credentials and proves:

- SDK type/config validation;
- exact executable/argument construction;
- missing-binary behavior;
- malformed configuration rejection;
- structured-output parser behavior using checked-in synthetic fixtures;
- timeout/stall/cancel/output-limit integration with the Specification 002 supervisor;
- path/quoting behavior using controlled fixture executables;
- no shell invocation by adapter code;
- no adapter-side commit/push/merge implementation;
- zero or explicitly justified external production dependencies.

Synthetic fixtures qualify Delethos code paths only. They do **not** qualify a real vendor CLI.

### Layer 2 — real-CLI conformance

A candidate cannot become `GOLD` without machine-observed runs against the real target CLI/version covering every applicable required behavior. This includes credentialed success where authentication is required.

At minimum, real conformance must cover:

1. discovery/version;
2. missing binary;
3. unauthenticated/invalid-auth behavior;
4. bounded write run;
5. exact working-directory behavior;
6. real read-only behavior if claimed;
7. forbidden-write negative path if read-only is claimed;
8. model/provider selection if claimed;
9. malformed model/provider rejection;
10. success and provider failure;
11. wall-clock timeout;
12. stdio-stall observation where applicable;
13. cancellation;
14. ordinary process-tree cleanup;
15. partial-diff preservation;
16. missing final response;
17. large/bounded output;
18. special-character/path quoting;
19. resume if claimed;
20. dirty repository/worktree preconditions;
21. platform launch semantics;
22. no hidden commit/push/merge side effect;
23. machine-readable result validity;
24. configuration-isolation assumptions relevant to that adapter.

If credentials, paid access, target binaries, or required platforms are unavailable, the corresponding evidence is `UNAVAILABLE` or `UNVERIFIED`. General founder approval is not authentication evidence and does not convert missing qualification into PASS.

## Credential and CI boundary

Specification 003 must not add credentials to the repository, print secrets, accept untrusted pull-request code into a secret-bearing workflow, or require public CI to possess vendor credentials.

A later implementation may provide a manually invoked conformance mechanism whose execution is explicitly credential-dependent and read-only with respect to GitHub repository administration. Whether GitHub-hosted secrets exist is a live operational fact to check later, not an assumption in this shaping unit.

## Security and authority non-claims

Specification 003 does not establish:

- a general security sandbox;
- network isolation;
- protection from arbitrary external side effects caused by a coding agent;
- independent reviewer orchestration or repair loops;
- semantic correctness of a provider response;
- a final proof-carrying patch bundle;
- automatic commit, push, merge, release, or deployment;
- support for every Codex/Claude feature;
- `GOLD` status merely because an adapter compiles or a synthetic fixture passes.

## Primary references

### Delethos

- `docs/ADAPTER_CONTRACT.md`
- `.specify/memory/constitution.md`
- `docs/EXECUTION_MASTER_PLAN.md`
- `specs/002-worktree-process-supervision/closeout.md`

### Codex

- https://github.com/openai/codex
- https://github.com/openai/codex/blob/main/codex-rs/exec/src/cli.rs
- https://github.com/openai/codex/blob/main/codex-rs/utils/cli/src/shared_options.rs
- https://github.com/openai/codex/releases

### Claude Code

- https://code.claude.com/docs/en/headless
- https://code.claude.com/docs/en/cli-reference
- https://code.claude.com/docs/en/settings
- https://code.claude.com/docs/en/permissions
- https://code.claude.com/docs/en/authentication
- https://github.com/anthropics/claude-code
- https://github.com/anthropics/claude-code/blob/main/LICENSE.md
- https://github.com/anthropics/claude-code/releases

### Gemini CLI

- https://geminicli.com/docs/cli/headless/
- https://geminicli.com/docs/get-started/authentication/
- https://geminicli.com/docs/cli/sandbox/
- https://github.com/google-gemini/gemini-cli

### OpenCode

- https://opencode.ai/docs/cli/
- https://opencode.ai/docs/permissions/
- https://opencode.ai/docs/providers/
- https://github.com/anomalyco/opencode

## Resulting shaping decision

Fresh evidence justifies one bounded Specification 003 outcome:

> Implement a vendor-neutral private adapter SDK and two real adapter candidates—OpenAI Codex CLI and Anthropic Claude Code—then promote either candidate to `GOLD` only after exact real-CLI conformance proves every claimed capability/platform. Keep Gemini CLI and OpenCode as researched successor candidates rather than expanding breadth before the contract is proven.
