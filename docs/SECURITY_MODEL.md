# Delethos Security Model

**Status:** founding candidate  
**Scope:** trust boundaries and security requirements; not a claim that unimplemented mechanisms are already enforced.

## Security objective

Delethos coordinates external coding agents that may execute commands and modify repositories. Its primary security responsibility is therefore to make authority, isolation, capability, provenance, and failure visible and bounded rather than to pretend every external agent is safe.

## Trust model

Delethos should assume:

- the local user controls the machine and repository;
- the repository may contain untrusted or surprising content;
- external coding-agent CLIs are separate trust domains with their own permissions, network behavior, authentication, telemetry, and sandbox semantics;
- model output is untrusted input until validated by the relevant deterministic boundary;
- a Git worktree provides change isolation, not a security sandbox;
- environment variables, credentials, SSH agents, cloud CLIs, package managers, and developer tooling may expose powerful ambient authority;
- a successful process exit does not prove a correct or safe patch.

## Default authority posture

Delethos defaults should trend toward least surprise:

- no silent `git commit`;
- no silent merge;
- no silent release/publish;
- no hidden privilege escalation;
- no destructive repository cleanup to hide a failed run;
- no mandatory cloud account;
- telemetry off by default unless a later spec explicitly defines a privacy-preserving opt-in surface;
- worktree-scoped mutable execution when supported;
- human decision after a verified candidate by default.

## Security boundaries

### 1. Adapter boundary

An adapter converts Delethos intent into external CLI invocation. It must not invent sandbox or approval semantics.

Security-relevant adapter capabilities include:

- writable workspace boundary;
- read-only mode if actually enforced;
- network availability/control if exposed;
- approval/prompt behavior in headless mode;
- model/provider selection;
- environment propagation;
- resume/session behavior;
- command/tool restrictions;
- child process behavior.

Unknown capability is not permission.

### 2. Process boundary

The run supervisor must own the launched process tree as precisely as supported by the platform. Cancellation and timeout handling should avoid leaving descendants behind.

A provider that launches detached/background descendants requires explicit qualification; otherwise the adapter cannot claim complete cleanup semantics.

### 3. Filesystem boundary

A Git worktree isolates ordinary repository mutations from the user's primary worktree but does not prevent reads/writes elsewhere on the machine unless the external CLI or an additional sandbox enforces that restriction.

The UI/docs must never label worktree isolation as a security sandbox.

### 4. Repository boundary

Before mutable execution, Delethos should capture the exact repository/base identity and relevant cleanliness/precondition facts. After execution it should capture the actual changed-path set and diff digest.

Policy may restrict allowed paths. A change outside the allowed surface is a verification failure even when tests pass.

### 5. Evidence boundary

Evidence files are security-sensitive because they may be used to justify trust. The evidence verifier must fail closed on malformed schema, missing required fields, digest mismatch, impossible review identity, or absent required guards.

Sensitive content should not be copied into evidence merely because it appeared in process output.

## Secrets

Founding policy:

- Delethos does not become a secret store.
- It should avoid serializing environment variables, access tokens, cookies, credentials, full prompts containing secrets, or raw provider transcripts into evidence by default.
- Adapter diagnostics should redact known credential patterns where technically reliable, but redaction is not a substitute for minimizing collection.
- Future hosted sync must be separately threat-modeled and opt-in.

## Prompt and repository injection

Repository files may attempt to instruct an agent to ignore Delethos policy or exfiltrate information. Delethos cannot guarantee that a model will ignore malicious instructions; it must instead enforce deterministic boundaries outside the model where possible.

Examples:

- allowed change paths are checked after execution;
- merge authority is outside the agent;
- retry count is controlled by the core;
- required review identity is checked by the core;
- evidence verification is outside the agent;
- sandbox claims come from qualified adapter/runtime configuration, not from a prompt saying "do not write".

## Network and external side effects

Network access can produce side effects beyond the Git diff: issue changes, deployments, API writes, database mutations, purchases, messages, or external file writes.

Until specifically authorized by a later spec, Delethos policies should treat repository-local code work as the primary supported mutable surface and should not advertise safe handling of arbitrary external side effects.

Adapters must preserve provider approval behavior honestly. A headless mode that cannot answer approvals may fail closed or may run with a provider-specific automatic policy; Delethos must distinguish those cases.

## Supply chain

The project should:

- keep runtime dependencies minimal;
- lock dependencies in released builds;
- run dependency/security auditing appropriate to the stack;
- verify release artifacts and provenance before stable release claims;
- document adapter dependence on external CLI versions;
- avoid executing untrusted repository install/build commands merely to discover repository metadata.

## Threat-driven rigor

Higher-risk surfaces require stronger evidence. Examples include:

- auth/identity/authorization;
- secrets/credential handling;
- database migrations/destructive data operations;
- package/release publishing;
- CI/workflow permission changes;
- dependency/install-script changes;
- sandbox/approval policy changes;
- code that launches processes or shells;
- evidence/provenance/verifier changes.

A tiny diff in these surfaces is not low risk by default.

## Reporting and vulnerability handling

The public repository should maintain a `SECURITY.md` with private-reporting guidance supported by the actual GitHub surface. Security issues should not be publicly disclosed before maintainers can assess them when private reporting is available.

## Security non-claims during founding

Until implemented and qualified, Delethos makes no claim that it:

- securely sandboxes arbitrary coding agents;
- prevents all prompt injection;
- prevents all data exfiltration;
- controls provider telemetry;
- fully contains child processes across every platform;
- safely handles arbitrary external side effects;
- guarantees reviewer correctness;
- makes AI-generated code safe merely because an evidence bundle exists.

The purpose of the security model is to make these boundaries explicit before implementation.
