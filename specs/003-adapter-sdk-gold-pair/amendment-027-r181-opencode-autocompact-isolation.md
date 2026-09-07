# Specification 003 Amendment 027 — R181 OpenCode Auto-Compaction Isolation and One New Bounded Attempt

**Status:** `NORMATIVE` iff this file is present on canonical `main` while Specification 003 remains active.  
**Task:** `D003-R181` diagnostic repair/re-execution authority only.  
**Exact proposal base:** `4862147343becc53ccd54b4b515b58bd08570b07`.  
**Consumed Amendment 026 execution:** workflow run `34154593508`, trigger `4862147343becc53ccd54b4b515b58bd08570b07`, tree `e0daec64985396b87e0151f243ed7bcc038b9f4f`.

## Purpose and preserved machine truth

Amendment 026 replaced the broad all-assistant OpenCode sanitized-export identity predicate with an explicit lineage-bound validator and, after exact-head implementation qualification and canonical post-merge deterministic qualification, authorized exactly one new same-tree R181 execution.

That attempt was consumed by workflow run `34154593508` and must never be rerun, retried, selectively replayed, or reclassified.

The deterministic core matrix in that run passed on Linux, macOS, and Windows. The provider-prerequisite records were:

```text
linux/x64:
  schema = delethos.spec003.r181-provider-prereq.v1
  outcome = PASS
  failed_at = null
  failure_reason = null
  all REQUIRED_FACTS = true

macos/arm64:
  schema = delethos.spec003.r181-provider-prereq.v1
  outcome = FAIL
  failed_at = opencode_sanitized_export_identity_exact
  failure_reason = unclassified_internal_failure
  opencode_sanitized_export_identity_exact = false

windows/x64:
  schema = delethos.spec003.r181-provider-prereq.v1
  outcome = PASS
  failed_at = null
  failure_reason = null
  all REQUIRED_FACTS = true
```

The macOS record independently proved all prerequisite runtime/model/Pi facts and the following OpenCode facts before the sanitized-export identity boundary:

```text
opencode_cli_version_exact_1_18_26 = true
opencode_requested_identity_exact = true
opencode_nonempty_completion = true
opencode_permission_policy_exact_default_deny = true
```

The Linux and Windows PASS records are immutable evidence from the consumed attempt. They are not reusable as PASS evidence for any later attempt. A later qualifying R181 attempt must independently prove every required fact again on Linux/x64, macOS/arm64, and Windows/x64 in the same fresh attempt.

Canonical task truth remains:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
D003-R200 = BLOCKED
D003-R210 = BLOCKED
D003-R211 = BLOCKED
D003-R212 = BLOCKED
PI_GOLD = NOT_QUALIFIED
OPENCODE_GOLD = NOT_QUALIFIED
SPEC_003_STATUS = ACTIVE_BLOCKED_REAL_GOLD
SPEC_004 = NOT_AUTHORIZED
```

## Exact OpenCode source reconciliation

The selected OpenCode executable remains:

```text
repository = anomalyco/opencode
version = 1.18.26
tag = v1.18.26
tag_commit = 774cc7c1914e4329eefde5a669f938b0cf566661
```

Pinned source at that exact commit establishes all of the following structural facts.

### Automatic compaction is enabled unless explicitly disabled

`packages/core/src/v1/config/config.ts` defines:

```text
compaction.auto
```

as an optional boolean whose documented default is `true`.

`packages/core/src/flag/flag.ts` defines the public process flag:

```text
OPENCODE_DISABLE_AUTOCOMPACT
```

and `packages/opencode/src/config/config.ts` applies that flag by forcing the effective configuration to:

```text
compaction.auto = false
```

when the flag is enabled.

The current canonical R181 OpenCode environment already fixes other ambient behavior, including:

```text
OPENCODE_PURE = 1
OPENCODE_DISABLE_AUTOUPDATE = 1
OPENCODE_DISABLE_MODELS_FETCH = 1
OPENCODE_DISABLE_PRUNE = 1
OPENCODE_DISABLE_CLAUDE_CODE = 1
OPENCODE_DISABLE_CLAUDE_CODE_PROMPT = 1
OPENCODE_DISABLE_CLAUDE_CODE_SKILLS = 1
```

but it does **not** currently set:

```text
OPENCODE_DISABLE_AUTOCOMPACT = 1
```

and the R181 OpenCode configuration does not otherwise set `compaction.auto = false`.

Therefore the current R181 isolation contract permits automatic compaction even though the bounded R181 smoke is intended to prove one explicit user invocation lineage.

### Auto-compaction can add internal user lineage

Pinned `packages/opencode/src/session/compaction.ts` creates a compaction user message carrying a `compaction` part when compaction is requested. After successful automatic compaction, that same source can create an additional internal user message to continue execution. The continuation user message is a normal user message with the prior model identity and a synthetic text part; it does not itself carry a `compaction` part.

Pinned `packages/opencode/src/cli/cmd/export.ts` obtains the requested session and messages and preserves message structural metadata in `export --sanitize`. Sanitization redacts content-bearing fields and non-empty metadata rather than turning arbitrary internal metadata into a stable semantic discriminator.

Consequently, a sanitized export cannot safely justify treating every additional non-compaction user message as canonical external input, nor can Amendment 027 weaken the Amendment 026 validator to accept an arbitrary second non-compaction user merely because the run otherwise looks plausible.

## Exact diagnostic conclusion

Run `34154593508` does **not** prove that automatic compaction occurred on macOS, Linux, or Windows. Raw transcript/export content was intentionally not logged, and this amendment does not invent it.

The machine run and pinned source prove a narrower but sufficient defect in the qualification boundary:

1. Amendment 026 intentionally requires exactly one canonical non-compaction user turn for the bounded R181 smoke;
2. the current R181 OpenCode environment permits a pinned OpenCode internal mechanism that can create an additional non-compaction continuation user turn;
3. that mechanism is outside the provider/model identity claim being qualified;
4. `export --sanitize` does not provide a sufficiently strong content-free discriminator to broaden the validator safely after the fact;
5. the consumed attempt produced a platform-specific identity-boundary failure even though the exact CLI, requested identity, non-empty completion, and default-deny policy facts had already passed on macOS.

The correct fail-closed repair is therefore to remove automatic compaction from this bounded provider-prerequisite environment rather than weaken lineage validation.

This amendment does not claim that auto-compaction caused the macOS failure. It removes a source-proven, currently unbounded session-topology mutator that is incompatible with the one-explicit-turn R181 qualification contract.

## Repair principle

The Amendment 027 repair is **OpenCode R181 auto-compaction isolation only**.

The generated R181 OpenCode environment must add exactly:

```text
OPENCODE_DISABLE_AUTOCOMPACT = 1
```

The effective R181 isolation self-tests must prove that exact key/value is present before OpenCode execution.

The Amendment 026 `extractOpenCodeIdentity(...)` lineage validator must remain byte-for-byte unchanged by the Amendment 027 transformation. In particular, Amendment 027 must not:

- accept two arbitrary non-compaction user turns;
- recognize an internal turn from redacted content or metadata guesses;
- reduce identity checking to an `any(...)` assistant predicate;
- ignore orphan/non-user-parent assistant lineage;
- accept a missing or mismatched canonical provider/model identity;
- log or persist raw sanitized exports, transcript content, file content, reasoning, tool arguments, secrets, or arbitrary identity text.

## Preserved runtime/provider/model/CLI semantics

No runtime, provider, model, CLI, archive, digest, URL, prompt, template, timeout, permission, workflow trigger, runner matrix, or Gold identity changes under this amendment.

The exact provider strategy remains:

```text
provider_strategy_id = delethos-local-llama-qwen25-instruct
provider_id = delethos-local-llama
model_id = delethos-qwen25-instruct-1.5b-q4km
model_repository = Qwen/Qwen2.5-1.5B-Instruct-GGUF
model_revision = a615a81362316d7b9f5a7a9c4313adfdf9b54588
model_file = qwen2.5-1.5b-instruct-q4_k_m.gguf
model_sha256 = 6a1a2eb6d15622bf3c96857206351ba97e1af16c30d7a74ee38970e434e9407e
```

The exact runtime remains:

```text
runtime_release = b10621
runtime_commit = c1d0e7a004015f23bc0233470b747b596f29b264
```

The exact CLIs remain:

```text
pi = 0.84.4
opencode = 1.18.26
```

Amendments 020, 023, 024, 025, and 026 remain authoritative for the pinned template, Layer-A prompt, model baseline, Pi continuation semantics, and OpenCode sanitized-export lineage validation.

The current OpenCode default-deny permission map and one-file write target remain unchanged.

## Deterministic implementation evidence

Before any later provider execution, the Amendment 027 implementation must prove at minimum:

1. the generated OpenCode R181 environment contains exactly one `OPENCODE_DISABLE_AUTOCOMPACT` entry;
2. that entry is exactly the string value `1`;
3. removing, renaming, duplicating, or changing that value fails the Amendment 027 self-test/discriminator;
4. the pre-Amendment-027 generated candidate lacks the new control, proving that the transformation actually adds the intended isolation boundary;
5. reversing the Amendment 027 transformation restores the complete pre-Amendment-027 generated candidate byte-for-byte;
6. the complete Amendment 026 lineage validator is unchanged by Amendment 027;
7. every Amendment 026 positive and negative lineage self-test continues to pass unchanged;
8. every Amendment 025 Pi continuation self-test continues to pass unchanged;
9. every Layer-A/runtime/model/template self-test continues to pass unchanged;
10. OpenCode requested identity, non-empty completion, default-deny permission, exact write target, session export, smoke-file verification, and no-hidden-Git behavior remain unchanged;
11. the provider/runtime/model/CLI pins and digests remain unchanged;
12. no provider/Gold/real-agent job executes on pull-request code;
13. no new dependency is added;
14. the transformation discriminator proves no unrelated generated candidate section changed.

These deterministic tests are shaping/implementation evidence only. They do not complete R181.

## Exact implementation authority

Only after this amendment becomes canonical may one bounded implementation PR modify:

```text
scripts/recovery-provider-prereq.mjs
```

Within that wrapper it may only:

1. transform the generated R181 OpenCode environment to add exactly `OPENCODE_DISABLE_AUTOCOMPACT: '1'`;
2. add deterministic self-tests proving the exact control and fail-closed drift rejection;
3. add transformation/discriminator bookkeeping proving the Amendment 026 validator and all unrelated generated candidate sections remain unchanged;
4. add reverse-transformation bookkeeping proving byte-for-byte restoration to the pre-Amendment-027 generated candidate.

No other repository path is authorized by this implementation unit.

Explicitly unauthorized here:

```text
scripts/recovery-provider-prereq-impl.mjs
.github/workflows/ci.yml
packages/adapters/src/opencode.ts
packages/adapters/test/opencode.test.ts
packages/adapters/src/pi.ts
packages/runtime/**
package.json
pnpm-lock.yaml
OpenCode/Pi binaries or packages
runtime/model/provider identities or pins
runtime/model/provider URLs or digests
OpenCode permission policy
OpenCode prompt or tool contract
Pi behavior
Layer-A behavior
Amendment 026 lineage predicate
production adapter capability promotion
```

No new dependency is authorized.

## Amendment 027 qualification gate

This docs-only amendment PR must:

1. be based on exact canonical revision `4862147343becc53ccd54b4b515b58bd08570b07` unless live canonical truth changes before branch creation;
2. change only this amendment document unless an independent substantive review requires another Specification 003 documentation path;
3. pass deterministic Linux/macOS/Windows CI at the exact final head;
4. keep provider/Gold/real-agent execution skipped on pull-request code;
5. receive fresh independent substantive semantic/security/licensing/governance review on the exact final head;
6. reconcile every substantive finding and leave zero unresolved substantive review threads;
7. preserve skipped, unavailable, rate-limited, billing-blocked, summary-only, stale-head, or self-review output as non-PASS;
8. reverify exact base/head/tree/scope/checks/reviews/threads/comments/mergeability immediately before merge;
9. merge only with expected-head protection;
10. require canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
11. re-read canonical authority before Amendment 027 implementation begins.

## Implementation qualification gate

The later one-file implementation must, on one exact final head:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. preserve every runtime/model/provider/Pi/OpenCode pin and digest;
3. preserve Layer-A, Pi, OpenCode prompt/tool/permission behavior, workflow semantics, runner matrix, permissions, and no-secret posture;
4. preserve the complete Amendment 026 lineage validator semantics unchanged;
5. keep provider/Gold/real-agent execution skipped on pull-request code;
6. pass deterministic CI on Linux, macOS, and Windows;
7. pass all pre-install and post-install R181 deterministic self-tests on every required platform;
8. prove the exact auto-compaction-disable isolation control and all drift-negative cases above;
9. prove no unrelated generated candidate section changed;
10. receive fresh independent substantive semantic/security/licensing/governance review on the exact final head;
11. reconcile every substantive finding and leave zero unresolved substantive review threads;
12. immediately revalidate exact base/head/tree/scope/checks/reviews/threads/comments/mergeability before merge;
13. merge only with expected-head protection;
14. pass canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
15. re-read canonical authority before any provider trigger.

## One new bounded R181 execution authority

If and only if this amendment is canonical and every implementation qualification gate above is proven on canonical `main`, Amendment 027 authorizes exactly one new same-tree canonical R181 execution.

The trigger commit must:

- have exactly the already-qualified canonical implementation tree;
- change no repository content;
- have complete commit message exactly `[provider-prereq]` and nothing else;
- be created only after canonical post-merge deterministic Linux/macOS/Windows PASS;
- preserve canonical-main/repository/no-secret/`contents: read` workflow boundaries.

The Amendment 027 attempt is consumed when triggered regardless of PASS, FAIL, infrastructure error, cancellation, timeout, or unavailable result.

Run `34154593508`, run `34066908995`, and every earlier R181 execution remain immutable historical evidence and must never be rerun, retried, selectively replayed, or used to substitute a missing platform result in the later attempt.

## Success and continuation boundary

`D003-R181` becomes complete only if the single Amendment 027-authorized execution independently emits on Linux/x64, macOS/arm64, and Windows/x64:

```text
schema = delethos.spec003.r181-provider-prereq.v1
outcome = PASS
all REQUIRED_FACTS = true
```

No PASS fact from any consumed earlier attempt may be reused as runtime PASS evidence for the Amendment 027 attempt.

If any required platform fails or any required fact is missing, false, malformed, contradictory, or unavailable:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

and no additional R181 attempt is authorized without another new bounded canonical amendment.

Only after genuine same-attempt three-platform R181 PASS may canonical task authority be re-read for `D003-R190` in dependency order.

## Non-authority

This amendment does not authorize:

- rerunning, retrying, or selectively replaying workflow run `34154593508` or any earlier R181 run/job;
- reusing the Linux/Windows PASS from run `34154593508` as future runtime PASS evidence;
- claiming that auto-compaction actually occurred in the consumed macOS run;
- weakening the Amendment 026 canonical-turn provider/model identity predicate;
- accepting arbitrary additional non-compaction user turns;
- classifying redacted content/metadata as trusted internal-lineage proof;
- logging raw sanitized exports or transcript/file/reasoning/tool-argument content;
- changing OpenCode/Pi versions, provider/model/runtime pins, prompts, tools, permissions, or write target;
- changing the provider record schema solely to hide or relabel a failure;
- Gold promotion;
- `D003-R190`, `D003-R200`, `D003-R210`, `D003-R211`, or `D003-R212` execution before genuine R181 PASS;
- terminal Specification 003 closeout;
- Specification 004 activation.
