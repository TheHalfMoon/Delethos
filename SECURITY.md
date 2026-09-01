# Security Policy

Delethos coordinates external coding-agent CLIs and may eventually supervise processes that can modify repositories. Security reports are therefore taken seriously even while the project is in founding design.

## Current project status

Delethos is currently in Specification 000 founding governance. Product runtime implementation and stable releases are not yet authorized. Security claims in planning documents are design requirements, not assertions that unimplemented controls already exist.

## Reporting a vulnerability

Use GitHub's private vulnerability reporting for this repository when that surface is enabled and available. If private reporting is unavailable, contact the repository owner through a non-public channel rather than publishing exploitable details in a public issue.

Please include, when safe and relevant:

- affected revision/version;
- platform and external agent/CLI version;
- minimal reproduction;
- expected vs observed behavior;
- impact;
- whether secrets, arbitrary code execution, sandbox escape, repository corruption, or external side effects are involved;
- any temporary mitigation you have verified.

Do not include real credentials, tokens, private repository content, or unnecessary personal data.

## Security-sensitive areas

Once implementation begins, the following areas will receive elevated review/verification rigor:

- process launching, cancellation, and child cleanup;
- worktree/filesystem handling;
- sandbox/approval policy translation;
- environment/secret propagation;
- command construction and shell quoting;
- adapter capability detection;
- network/external side-effect controls;
- evidence canonicalization, hashing, provenance, and verification;
- independent-review identity and policy compilation;
- dependency/update/release pipelines;
- automatic commit/merge/publish authority if ever introduced.

## Security principles

- no silent privilege escalation;
- no silent commit/merge/release authority;
- worktree isolation is not represented as a security sandbox;
- provider-specific sandbox/read-only claims require real qualification;
- missing security evidence is not PASS;
- evidence bundles should minimize secrets and unrelated private content;
- external agent output is untrusted until validated at the appropriate deterministic boundary;
- higher-risk surfaces require stronger negative-path/adversarial evidence.

See `docs/SECURITY_MODEL.md` for the founding threat/trust model.

## Supported versions

There is no stable supported product version yet. This section will be updated only after a release becomes canonical and actually supported.

## Disclosure

Please allow maintainers a reasonable opportunity to investigate and prepare remediation before public disclosure when a report could expose users. Delethos will not claim a vulnerability fixed until the exact fix and required verification have been observed on the relevant revision/release.
