# Specification 003 Amendment 026 — R181 OpenCode Sanitized-Export Lineage Reconciliation and One New Bounded Attempt

**Status:** `NORMATIVE` iff this file is present on canonical `main` while Specification 003 remains active.  
**Task:** `D003-R181` diagnostic repair/re-execution authority only.  
**Exact proposal base:** `e4396b528c5417296ecc72fe60f4d4d3aeeb12a6`.  
**Consumed Amendment 025 execution:** workflow run `34066908995`, trigger `e4396b528c5417296ecc72fe60f4d4d3aeeb12a6`, tree `98fdcb6ad5497075edda5e2285d765614a286082`.

## Purpose and preserved machine truth

Amendment 025 corrected the Pi request-2 ToolResult continuation validator, completed its exact-head implementation qualification, and authorized exactly one new same-tree R181 execution. That attempt was consumed by workflow run `34066908995` and must never be rerun, retried, selectively replayed, or reclassified.

The deterministic core matrix passed on Linux, macOS, and Windows. The provider-prerequisite results were:

```text
linux/x64:
  outcome = FAIL
  failed_at = opencode_sanitized_export_identity_exact
  failure_reason = unclassified_internal_failure

macos/arm64:
  outcome = FAIL
  failed_at = opencode_sanitized_export_identity_exact
  failure_reason = unclassified_internal_failure

windows/x64:
  outcome = PASS
  failed_at = null
  failure_reason = null
  all REQUIRED_FACTS = true
```

Linux and macOS independently proved every required fact through the full Pi path and these OpenCode facts before the sanitized-export boundary:

```text
opencode_cli_version_exact_1_18_26 = true
opencode_requested_identity_exact = true
opencode_nonempty_completion = true
opencode_permission_policy_exact_default_deny = true
```

They also independently proved:

```text
llama_forced_tool_stream_witness_exact = true
pi_first_request_shaper_witness_exact = true
pi_bounded_tool_write_smoke = true
pi_first_request_tool_choice_exact = true
```

Windows independently proved the entire R181 record, including:

```text
opencode_sanitized_export_identity_exact = true
opencode_bounded_tool_write_smoke = true
repository_fixture_only = true
no_secret_referenced = true
no_hidden_commit_push_merge = true
```

The Windows PASS is immutable evidence from the consumed attempt. It is not reusable as PASS evidence for any later attempt. A future R181 attempt must independently prove every required fact again on every required platform.

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

## Exact source reconciliation

The selected OpenCode executable remains:

```text
repository = anomalyco/opencode
version = 1.18.26
tag = v1.18.26
tag_commit = 774cc7c1914e4329eefde5a669f938b0cf566661
```

The pinned OpenCode `export --sanitize` implementation obtains the exact requested session and its messages, preserves every message `info` object, and redacts transcript/file/path content. For assistant messages it preserves structural metadata including:

```text
id
sessionID
role
parentID
providerID
modelID
mode
```

The pinned schema also preserves the canonical user-message model selection as:

```text
user.info.model.providerID
user.info.model.modelID
```

and defines assistant lineage explicitly through:

```text
assistant.info.parentID
```

The same pinned source permits assistant messages that are not the direct provider response lineage for the original user turn. For example, compaction creates an assistant record with its own parent user message and `mode = compaction`. This source fact does **not** prove that run `34066908995` contained compaction or any particular non-canonical assistant record. Raw transcript/export contents were intentionally not logged, and this amendment does not invent them.

## Current validator mismatch

The current R181 sanitized-export validator is structurally broader than the required identity claim. It currently:

1. validates the exported session ID;
2. selects every message whose role is `assistant`;
3. requires every selected assistant message to have the canonical provider/model identity.

That proves a stronger statement than R181 requires: it treats every assistant record anywhere in the session as though it were necessarily part of the canonical user turn whose provider/model execution is being qualified.

The actual R181 identity claim is narrower and stronger in the relevant dimension: the assistant messages that belong to the canonical non-compaction user turn must be bound by explicit session/message lineage and must all carry the canonical provider/model identity. Unrelated internal assistant lineages must not be mistaken for the provider response under test, but they also must not be silently ignored if their structure is malformed or orphaned.

The Linux/macOS failure and Windows PASS prove that the current all-assistant predicate is not a stable cross-platform qualification boundary for this exact run. They do not prove which extra assistant metadata caused the Unix failures.

## Repair principle

The repair is **sanitized-export lineage binding only**.

A repaired validator must fail closed unless all of the following are true:

1. `export.info.id` exactly equals the OpenCode session ID observed from the same bounded run;
2. `export.messages` is an array of structurally valid message objects;
3. every message `info.sessionID` equals the exact exported session ID;
4. every assistant message has a non-empty `parentID` that resolves to a user message in the same export;
5. the export contains exactly one canonical non-compaction user turn for the R181 invocation;
6. that user turn has exact canonical model identity:

```text
providerID = delethos-local-llama
modelID = delethos-qwen25-instruct-1.5b-q4km
```

7. the canonical turn is not a compaction user turn and contains no compaction part;
8. at least one assistant message is a direct child of that canonical user turn;
9. every direct-child assistant message for that canonical turn has exact canonical provider/model identity;
10. no direct-child assistant is missing provider/model identity;
11. no assistant message is orphaned or points to a non-user parent;
12. any assistant message outside the canonical direct-turn lineage may be accepted only when it is attached to a distinct structurally valid internal user lineage in the same export; it must not be counted as evidence for `opencode_sanitized_export_identity_exact`;
13. the validator must not accept a session that contains a second non-compaction user turn, an ambiguous canonical turn, an unmatched assistant, or a canonical-turn identity mismatch.

The repair must not reduce the required canonical-turn identity check to an `any(...)` predicate. One matching assistant is insufficient when another assistant in the same canonical direct-turn lineage has missing or mismatched identity.

## Explicit non-inference

This amendment does not claim that compaction, title generation, subagents, filesystem differences, runtime scheduling, or any other specific OpenCode behavior caused the Linux/macOS failure.

It relies only on:

- the machine-observed platform outcomes from run `34066908995`;
- the exact current R181 validator semantics;
- the pinned OpenCode sanitized-export behavior;
- the pinned user/assistant message schemas and explicit `parentID` lineage.

No raw prompt, transcript, reasoning text, tool arguments, file contents, secrets, or arbitrary exported identity values need to be logged or persisted to implement this reconciliation.

## Preserved boundaries

No runtime, provider, model, CLI, archive, digest, URL, prompt, template, timeout, permission, workflow, or Gold identity changes under this amendment.

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

Amendments 020, 023, 024, and 025 remain authoritative for the pinned template, Layer-A prompt, model baseline, and Pi continuation semantics.

## Deterministic implementation evidence

Before any new provider execution, deterministic self-tests must prove at minimum:

1. one canonical non-compaction user message with exact model identity plus one exact direct-child assistant is accepted;
2. multiple direct-child assistants are accepted only when every one has exact canonical provider/model identity;
3. one canonical direct child plus one mismatched direct child fails closed;
4. a missing provider/model field on a canonical direct child fails closed;
5. no canonical direct child fails closed;
6. a canonical user model mismatch fails closed;
7. two non-compaction user turns fail closed as ambiguous for the bounded one-turn R181 smoke;
8. a canonical user containing a compaction part cannot be selected as the R181 turn;
9. an internal compaction user plus its structurally linked assistant does not become canonical-turn identity evidence;
10. an orphan assistant fails closed;
11. an assistant whose parent resolves to another assistant rather than a user fails closed;
12. any message with wrong session ID fails closed;
13. wrong exported session ID fails closed;
14. malformed or non-array messages fail closed;
15. the normalized identity evidence contains only bounded structural counts and canonical identity constants, never transcript, file, reasoning, tool-argument, secret, or arbitrary identity text;
16. all Amendment 025 Pi continuation tests continue to pass unchanged;
17. all Layer-A/runtime/model/template tests continue to pass unchanged;
18. OpenCode requested identity, completion, default-deny permission, exact write target, isolation environment, and smoke-file verification remain unchanged;
19. transformation discriminators prove no unrelated generated candidate section changed.

These are deterministic shaping tests only. They do not complete R181.

## Exact implementation authority

Only after this amendment becomes canonical may one bounded implementation PR modify:

```text
scripts/recovery-provider-prereq.mjs
```

Within that wrapper it may only:

1. transform the generated `extractOpenCodeIdentity(...)` validator from the all-assistant predicate to the exact lineage-bound predicate defined above;
2. add deterministic positive/negative self-tests for that predicate;
3. add bounded structural discriminator evidence needed to prove the transformation and preserve fail-closed behavior;
4. add transformation bookkeeping proving byte-for-byte restoration to the pre-Amendment-026 generated candidate when the Amendment 026 transformation is reversed.

No other repository path is authorized.

Explicitly unauthorized here:

```text
scripts/recovery-provider-prereq-impl.mjs
.github/workflows/ci.yml
packages/adapters/src/opencode.ts
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
production code
```

No new dependency is authorized.

## Amendment 026 qualification gate

This docs-only amendment PR must:

1. be based on exact canonical revision `e4396b528c5417296ecc72fe60f4d4d3aeeb12a6` unless live canonical truth changes before branch creation;
2. change only this amendment document unless an independent substantive review requires another Specification 003 documentation path;
3. pass deterministic Linux/macOS/Windows CI at the exact final head;
4. keep provider/Gold/real-agent execution skipped on pull-request code;
5. receive fresh independent substantive semantic/security/licensing/governance review on the exact final head;
6. reconcile every substantive finding and leave zero unresolved substantive review threads;
7. preserve skipped, unavailable, rate-limited, billing-blocked, summary-only, stale-head, or self-review output as non-PASS;
8. reverify exact base/head/tree/scope/checks/reviews/threads/comments/mergeability immediately before merge;
9. merge only with expected-head protection;
10. require canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
11. re-read canonical authority before Amendment 026 implementation begins.

## Implementation qualification gate

The later one-file implementation must, on one exact final head:

1. change only `scripts/recovery-provider-prereq.mjs`;
2. preserve every runtime/model/provider/Pi/OpenCode pin and digest;
3. preserve Layer-A, Pi, OpenCode prompt/tool/permission behavior, workflow semantics, runner matrix, permissions, and no-secret posture;
4. keep provider/Gold/real-agent execution skipped on pull-request code;
5. pass deterministic CI on Linux, macOS, and Windows;
6. pass all pre-install and post-install R181 deterministic self-tests on every required platform;
7. prove every lineage positive/negative case above;
8. prove no unrelated generated candidate section changed;
9. receive fresh independent substantive semantic/security/licensing/governance review on the exact final head;
10. reconcile every substantive finding and leave zero unresolved substantive review threads;
11. immediately revalidate exact base/head/tree/scope/checks/reviews/threads/comments/mergeability before merge;
12. merge only with expected-head protection;
13. pass canonical post-merge deterministic Linux/macOS/Windows CI with provider execution skipped;
14. re-read canonical authority before any provider trigger.

## One new bounded R181 execution authority

If and only if this amendment is canonical and every implementation qualification gate above is proven on canonical `main`, Amendment 026 authorizes exactly one new same-tree canonical R181 execution.

The trigger commit must:

- have exactly the already-qualified canonical implementation tree;
- change no repository content;
- have complete commit message exactly `[provider-prereq]` and nothing else;
- be created only after canonical post-merge deterministic Linux/macOS/Windows PASS;
- preserve canonical-main/repository/no-secret/`contents: read` workflow boundaries.

The Amendment 026 attempt is consumed when triggered regardless of PASS, FAIL, infrastructure error, cancellation, timeout, or unavailable result.

Run `34066908995` and every earlier R181 execution remain immutable historical evidence and must never be rerun, retried, or selectively replayed.

## Success and continuation boundary

`D003-R181` becomes complete only if the single Amendment 026-authorized execution independently emits on Linux/x64, macOS/arm64, and Windows/x64:

```text
schema = delethos.spec003.r181-provider-prereq.v1
outcome = PASS
all REQUIRED_FACTS = true
```

No fact from the Windows PASS in run `34066908995` may be reused as runtime PASS evidence for the later attempt.

If any required platform fails or any required fact is missing, false, malformed, contradictory, or unavailable:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
```

and no additional R181 attempt is authorized without another new bounded canonical amendment.

Only after genuine three-platform R181 PASS may canonical task authority be re-read for `D003-R190` in dependency order.

## Non-authority

This amendment does not authorize:

- rerunning run `34066908995` or any earlier R181 workflow/job;
- treating the Windows PASS from that run as reusable future PASS evidence;
- weakening canonical-turn provider/model identity checking;
- accepting `any` matching assistant while ignoring a direct-turn mismatch;
- logging raw sanitized exports or transcript content;
- changing OpenCode/Pi versions, provider/model/runtime pins, prompts, tools, permissions, or isolation posture;
- Gold promotion;
- `D003-R190`, `D003-R200`, `D003-R210`, `D003-R211`, or `D003-R212` execution;
- terminal Specification 003 closeout;
- Specification 004 activation.
