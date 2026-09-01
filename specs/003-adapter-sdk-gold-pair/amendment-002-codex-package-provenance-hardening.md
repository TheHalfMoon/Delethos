# Specification 003 Amendment 002 — Codex Package Provenance Hardening

**Status:** amendment candidate  
**Date:** 2026-09-01  
**Parent authority:** Specification 003 and Amendment 001  
**Scope:** provenance and runner-integrity hardening only

## Decision

Keep the hosted OpenAI Codex no-auth qualification target at exactly:

```text
@openai/codex@0.152.0
observed_cli_version = codex-cli 0.152.0
```

Do not downgrade the target version and do not reinterpret package-manager layout as vendor package identity.

For hosted qualification, Delethos must treat the platform-native executable as an artifact selected by exact target triple and exact observed CLI version, not by an assumed physical `node_modules` hoisting layout.

## Evidence that required this amendment

Amendment 001 authorized a narrow, no-secret, canonical-main hosted qualification path for real Codex discovery/platform evidence. Subsequent machine-observed Windows runs exposed two runner-integrity defects caused by package-layout assumptions, not by Codex version instability or adapter behavior.

Observed canonical sequence:

```text
main_before_repairs = dc9d9c3b32c06ff51cda7036c1a1a43b335bd225
failed_run_1 = 33535489680
repair_1_merge = 944a706c3a0fd53017e4263711e6082126832d03
failed_run_2 = 33553439476
repair_2_merge = 10f3086c68fcb629413ad2acc4351e72c2901eee
successful_run = 33553753394
```

In both failed Windows runs, installation of exact `@openai/codex@0.152.0` succeeded before conformance. The failure occurred while resolving the platform-native executable from an assumed alias location. Linux and macOS qualification already succeeded at the same pinned Codex version.

The second repair removed the physical-layout assumption. The Windows runner now searches only the ephemeral pinned install tree for the native executable ending in:

```text
vendor/<exact-target-triple>/bin/codex.exe
```

It requires exactly one match and independently verifies that the copied executable reports `codex-cli 0.152.0` before any conformance case runs.

Canonical run `33553753394` then completed successfully on all three hosted platforms for the Amendment 001 case set:

```text
linux/x64:
  missing-binary = PASS
  discovery-version = PASS
  platform-launch = PASS

macos/arm64:
  missing-binary = PASS
  discovery-version = PASS
  platform-launch = PASS

windows/x64:
  missing-binary = PASS
  discovery-version = PASS
  platform-launch = PASS
```

Every emitted record identified:

```text
source = REAL_CLI
adapterImplementationVersion = spec003-candidate.2
adapterId = openai-codex-cli
delethosRevision = 10f3086c68fcb629413ad2acc4351e72c2901eee
cliVersion = codex-cli 0.152.0   # discovery/platform cases
outcome = PASS
headUnchanged = true
refsUnchanged = true
worktreeDirty = false
```

## Upstream package provenance

OpenAI's exact public source tag `rust-v0.152.0` defines the npm packaging relationship used by the hosted qualification target.

Primary upstream source:

- `https://github.com/openai/codex/blob/rust-v0.152.0/codex-cli/scripts/build_npm_package.py`
- `https://github.com/openai/codex/blob/rust-v0.152.0/codex-cli/package.json`

The release packaging script defines platform-specific local optional-dependency aliases such as:

```text
@openai/codex-linux-x64
@openai/codex-linux-arm64
@openai/codex-darwin-x64
@openai/codex-darwin-arm64
@openai/codex-win32-x64
@openai/codex-win32-arm64
```

while documenting that the underlying package published to npm is `@openai/codex`. The generated platform package versions use the release version plus platform suffix, for example the `0.152.0-<platform-tag>` family.

Therefore the alias name, underlying package name/version, target triple, and on-disk package-manager layout are distinct facts. A runner must not infer one from a hard-coded location for another.

## Canonical runner-integrity requirements

For any Specification 003 hosted Codex qualification that materializes the exact pinned npm release:

1. The requested top-level package remains exactly `@openai/codex@0.152.0` unless a future canonical amendment changes it.
2. The platform/architecture must map to an explicit supported target triple.
3. The native executable must be resolved only inside the ephemeral qualification install root.
4. Resolution must not depend on npm/pnpm hoisting, symlink, virtual-store, or alias placement details.
5. Resolution must fail closed if zero or more than one executable matches the exact target-native suffix.
6. The resolved executable must be copied or invoked from a runner-temporary location only.
7. Before conformance, the resolved executable must successfully report an observed version containing exact release `0.152.0`.
8. No resolved path, package alias, or package-manager layout may itself be promoted into a public adapter capability claim.
9. Package-manager warnings or layout changes are runner-integrity observations, not adapter qualification failures, unless they prevent exact executable identity from being established.
10. Any future packaging/provenance ambiguity must stop the affected hosted qualification and be reconciled before recording PASS.

## What this amendment does not authorize

This amendment does **not** authorize:

- a Codex version downgrade or upgrade;
- additional hosted conformance cases beyond separately existing authority;
- vendor credentials or secret-bearing CI;
- paid/provider-backed Codex sessions;
- authentication success evidence;
- automatic Gold promotion;
- any Claude Code installation or execution;
- copying, vendoring, or redistributing vendor binaries into the repository;
- new runtime dependencies;
- Specification 004;
- terminal Specification 003 closeout.

## Qualification consequence

Canonical hosted Codex no-auth evidence at run `33553753394` may be reconciled only for the exact cases that actually ran and emitted PASS records.

It does not satisfy the full Specification 003 Gold matrix. In particular, credential-dependent success/write/model/resume behavior and all other required real cases remain governed by the base specification and remain `UNAVAILABLE`, `UNVERIFIED`, or otherwise unqualified until genuine machine-observed evidence exists.

The Codex candidate therefore remains:

```text
CODEX_GOLD = NOT_QUALIFIED
```

until all applicable Gold requirements are satisfied without weakening the gate.

## Relationship to Amendment 001

Amendment 001 remains the execution authority for the currently implemented hosted Codex no-auth job. This amendment only hardens how exact package provenance and native executable identity are interpreted and maintained.

If this amendment conflicts with an implementation assumption about physical npm/pnpm layout, this amendment wins and the implementation must fail closed or be repaired through a bounded runner-integrity PR.
