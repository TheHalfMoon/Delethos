# Specification 003 Amendment 003 — Hosted Claude No-Auth Vendor-Authority Gate

**Status:** amendment candidate  
**Date:** 2026-09-01  
**Parent authority:** Specification 003  
**Scope:** vendor-use authority and hosted no-auth provenance gate only

## Decision

Public evidence establishes that Claude Code can technically support exact-version discovery and platform-launch qualification on the Specification 003 platform matrix. That technical feasibility does not itself authorize Delethos to install or execute proprietary Claude Code binaries in GitHub-hosted qualification infrastructure.

Current canonical gate:

```text
CLAUDE_VENDOR_USE_AUTHORITY = NOT_ESTABLISHED_IN_CANONICAL_EVIDENCE
CLAUDE_HOSTED_NOAUTH_EXECUTION = PROHIBITED_WHILE_GATE_UNSATISFIED
CLAUDE_GOLD = NOT_QUALIFIED
```

`NOT_ESTABLISHED_IN_CANONICAL_EVIDENCE` does not assert that the repository owner lacks an Anthropic account, subscription, contract, or vendor agreement. It means only that the project evidence available to this execution context does not establish authority to install and execute Claude Code in Delethos-hosted qualification infrastructure under the applicable vendor terms.

Ordinary founder approval, public release availability, repository ownership, and technical installability do not substitute for that vendor-use prerequisite.

## Existing proprietary-code boundary

The base Specification 003 boundary permits Delethos to invoke the user's Claude Code installation under the user's vendor agreement and prohibits Delethos from vendoring, redistributing, copying, or modifying proprietary Claude Code implementation code.

Anthropic's public Claude Code repository states that use is subject to Anthropic's Commercial Terms of Service. Installing and executing a proprietary Claude Code binary in GitHub-hosted CI is vendor use, not merely public-metadata inspection.

Therefore hosted installation or execution is prohibited until genuine project evidence establishes that this qualification context is covered by appropriate vendor-use authority.

## Public feasibility snapshot — not execution authority

Fresh public research on 2026-09-01 established the following technical facts only:

- Anthropic's current setup documentation supports Claude Code on Linux, macOS, and Windows and documents `claude --version` as a verification command.
- Current setup documentation supports installing a specific Claude Code version.
- Authenticated Claude Code use requires an eligible Anthropic account/subscription or an expressly supported third-party provider configuration.
- The latest public non-prerelease GitHub release observed during this amendment's shaping pass was `v2.1.257`, published on 2026-09-01.
- That release exposes native artifacts for the platform/architecture families relevant to Specification 003, plus checksum and signature artifacts.

Observed public release snapshot:

```text
release = v2.1.257
published_at = 2026-09-01T17:53:52Z
prerelease = false
immutable = false

claude-darwin-arm64.tar.gz = sha256:4ca35800ac8cf42e9c134b6bb9253edd65174379f46050c915af119fe15d8534
claude-darwin-x64.tar.gz   = sha256:70acd9af85bf96c75397e04024b343389ec256d261e054838e2ca853c4164873
claude-linux-arm64.tar.gz  = sha256:db8c858191bf9fb9f0e394aa72b591a15e51d13f2c86ae3f141a4c5820e3124f
claude-linux-x64.tar.gz    = sha256:d9e18dc3742ab9c65de0ece30d11b8721ed7c98748ecbf030a63e4d0a5f68a78
claude-win32-arm64.zip     = sha256:2ad0401c1a10cf71a3bbd15526e420c91f9e3e2cf66167e96c3489af7c57553a
claude-win32-x64.zip       = sha256:f7dfc45d7bd4f972006ab2eb88e384b907467fb986890e216048010b3dbc971e
SHASUMS256.txt             = sha256:15d4d6a2a4961208bfbe1852d0a190ccbcf8275ae98dfedb8bf46ec0e11da16a
SHASUMS256.txt.sig         = sha256:ae89ac6c393fe842756c54e8560fe236f652f10ae21edc2c446e5c5fa53395dc
```

This is a public provenance snapshot, not a selected executable qualification target. Because the release API reports `immutable = false` and because no execution is currently authorized, no Claude version or asset becomes a canonical execution target merely by appearing in this amendment.

Any future hosted Claude execution unit must re-read current upstream release/install truth immediately before selecting an exact target and must bind the selected artifacts to exact verified provenance. A stale handoff version must never be reused without fresh qualification.

## Gate satisfaction requirements

The vendor-use gate may be considered satisfied only when genuine canonical project evidence establishes that the relevant operator or organization has authority under applicable Anthropic terms to install and execute Claude Code in the intended hosted qualification context.

That evidence must be bounded and privacy-preserving. It must not publish credentials, tokens, account secrets, billing details, contract contents, or other sensitive vendor data.

A canonical evidence statement may record only the minimum necessary facts, for example:

```text
CLAUDE_VENDOR_USE_AUTHORITY = ESTABLISHED
scope = hosted Specification 003 qualification
provenance_category = user_or_organization_vendor_authority
recorded_date = <date>
```

The project must not infer this state from ordinary approval. The project must not automatically accept vendor terms, create an account, purchase a subscription, initiate billing, or manufacture a vendor-agreement assertion.

If the authority cannot be established, the gate remains blocked and no hosted Claude binary may be installed or executed by Delethos qualification automation.

## Conditional future hosted no-auth unit

Only after `CLAUDE_VENDOR_USE_AUTHORITY = ESTABLISHED` is genuinely recorded may a separate bounded execution amendment/implementation unit be considered.

That future unit must, at minimum:

1. re-read the latest official Claude Code installation, release, platform, license/terms, and version-verification facts;
2. select and record one exact Claude Code version rather than an unbounded latest channel;
3. bind every platform-native artifact used for qualification to exact provenance and integrity evidence;
4. use only official vendor distribution surfaces permitted by the established authority;
5. materialize the executable only into runner-temporary qualification storage;
6. avoid repository vendoring, redistribution, persistent installation, or automatic updater behavior;
7. fail closed on unsupported platform/architecture, provenance ambiguity, integrity mismatch, version mismatch, or unexpected executable identity;
8. verify the observed CLI version before conformance;
9. preserve `contents: read` and no-secret behavior for a no-auth qualification job;
10. run only separately authorized no-auth cases on trusted canonical `main`;
11. preserve unavailable/failed cases as `UNAVAILABLE`/`FAIL`/`UNVERIFIED`, never PASS;
12. keep all provider-backed, credentialed, billing-bearing, and Gold behavior outside that no-auth authority.

A future no-auth case set may shape narrowly around real executable absence, discovery/version, and platform launch. Invalid/missing-auth behavior must not be assumed equivalent to platform launch and must remain separately authorized and machine-observed if it can initiate vendor/provider behavior.

No workflow implementation is authorized by this amendment while the vendor-use gate is unsatisfied.

## What this amendment does not authorize

This amendment does **not** authorize or perform:

- downloading, installing, unpacking, or executing Claude Code;
- accepting Anthropic terms or asserting that they are accepted;
- account creation, subscription purchase, billing, or spend;
- credentials, secrets, authentication, login, or token use;
- provider-backed prompts, completions, sessions, or model requests;
- credentialed repository-writing work;
- a Claude hosted GitHub Actions job;
- any exact Claude executable target version;
- automatic use of `v2.1.257` or any later release;
- copying, vendoring, redistributing, modifying, or publishing proprietary Claude Code implementation/binaries;
- new runtime dependencies or product-source changes;
- Claude capability promotion;
- Claude `GOLD` promotion;
- Codex authority changes;
- terminal Specification 003 closeout;
- Specification 004 or later roadmap authority.

## Relationship to prior amendments

Specification 003 Amendment 001 remains the narrow hosted Codex no-auth execution authority.

Specification 003 Amendment 002 remains the Codex package/native-executable provenance hardening authority.

Neither Amendment 001 nor Amendment 002 authorizes Claude Code installation or execution. This amendment makes that boundary explicit and defines the evidence prerequisite for any future hosted Claude no-auth execution unit.

## Current qualification state

```text
CODEX_GOLD = NOT_QUALIFIED
CLAUDE_VENDOR_USE_AUTHORITY = NOT_ESTABLISHED_IN_CANONICAL_EVIDENCE
CLAUDE_HOSTED_NOAUTH_EXECUTION = PROHIBITED_WHILE_GATE_UNSATISFIED
CLAUDE_GOLD = NOT_QUALIFIED
SPEC_003_STATUS = ACTIVE_BLOCKED_REAL_GOLD
SPEC_004 = NOT_AUTHORIZED
TERMINAL_SPEC_003_CLOSEOUT = NOT_AUTHORIZED
```

No successor authority follows from this amendment.