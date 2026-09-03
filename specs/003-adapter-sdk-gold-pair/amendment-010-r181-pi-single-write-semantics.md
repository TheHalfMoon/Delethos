# Specification 003 Amendment 010 — R181 Pi Single-Write Completion Semantics

**Status:** `NORMATIVE` iff this amendment is present on canonical `main` while Specification 003 is active.  
**Task:** `D003-R181` repair only.  
**Scope:** reconcile Pi `v0.84.4` model-level sampling semantics with the already-canonical Amendment 008 one-file write posture and Amendment 009 natural-exit lifecycle. This amendment does not execute provider qualification, promote any capability or Gold status, open `D003-R190` or later tasks, or authorize Specification 004.

## Canonical evidence and defect

Canonical R181 run `33766314536` at `87f14659b90740b9f526d9911be53adf7c190e99` failed identically on Linux/x64, macOS/arm64, and Windows/x64 at:

```text
pi_bounded_tool_write_smoke
Pi write smoke required exactly one tool execution; observed starts=0 ends=0
```

Every preceding Pi prerequisite fact was true, including exact `0.84.4`, requested and observed canonical provider/model identity, non-empty completion, and exact `--tools write` exposure. Amendment 009 subsequently authorized a bounded natural-exit wait because Pi print mode flushes retained JSONL on its natural completion path rather than the forced termination path.

Further exact-source inspection shows a second lifecycle interaction that must be reconciled before implementing that wait.

At exact Pi `v0.84.4` source commit:

```text
b79e4cc834970cca69daebffab7df1da7d1e52c4
```

`packages/ai/src/api/simple-options.ts` merges `model.samplingParams` into stream options for each model invocation. `packages/ai/src/api/openai-completions.ts` then copies `options.samplingParams` into the final request parameters last, so custom sampling keys override named request fields. `packages/agent/src/agent-loop.ts` adds tool-result messages to context and invokes the same `config.model` again while tool calls remain, until a completed turn contains no further tool call or an explicit stop hook terminates the loop.

Therefore the current R181 implementation-only setting:

```json
"samplingParams": {
  "tool_choice": "required"
}
```

is not a first-turn-only constraint. It is reapplied to the post-tool model turn as well. A natural-exit wait cannot reliably settle while the same model-level configuration continues to require another tool call.

Exact upstream source references:

```text
https://github.com/earendil-works/pi/blob/b79e4cc834970cca69daebffab7df1da7d1e52c4/packages/ai/src/api/simple-options.ts
https://github.com/earendil-works/pi/blob/b79e4cc834970cca69daebffab7df1da7d1e52c4/packages/ai/src/api/openai-completions.ts
https://github.com/earendil-works/pi/blob/b79e4cc834970cca69daebffab7df1da7d1e52c4/packages/agent/src/agent-loop.ts
```

## Canonical reconciliation

Amendment 008 already defines the normative isolated Pi model entry without any `samplingParams.tool_choice` field. Its bounded write authority is expressed by the exact CLI tool allowlist:

```text
--tools write
```

and by machine evidence, not by a provider-level forced-tool setting.

Accordingly, after this amendment is canonical, the R181 Pi write-smoke repair must:

1. remove the implementation-only model-level `samplingParams.tool_choice = required` override from the R181 Pi model configuration;
2. keep the exact `--tools write` conformance-only allowlist unchanged;
3. keep the prompt bounded to creation of exactly `delethos-r181-smoke.txt` with exact bytes `DELETHOS_R181_OK\n` and no other file mutation;
4. require the retained Pi JSONL to contain exactly one matching `tool_execution_start` and `tool_execution_end`, both named `write`, with no tool error;
5. require canonical assistant provider/model identity in the retained JSONL;
6. retain the exact fixture HEAD/refs/remotes/local-Git-config/hooks and exact one-untracked-file checks;
7. implement Amendment 009's natural-exit lifecycle: after observing exact smoke bytes, allow no more than 30 seconds, bounded by the original 300-second outer deadline, for natural process settlement and stdout flush; cancel only if that grace expires;
8. fail closed if Pi does not choose the write tool, chooses it zero times or more than once, produces malformed/truncated JSONL, mutates any unauthorized repository surface, or fails to settle within the bounded lifecycle.

The write is therefore still proved by actual machine-observed tool execution. Removing `tool_choice = required` does not convert the case into prompt-only proof and does not broaden tool authority; it removes a non-normative model-level forcing mechanism that conflicts with natural post-tool completion.

## Authorized implementation paths

For this repair only, authority remains limited to:

```text
scripts/recovery-provider-prereq-impl.mjs
scripts/recovery-provider-prereq.mjs
```

No adapter capability table, Gold evidence surface, workflow trigger, provider/model pin, runtime pin, tool permission, credential boundary, or successor task may be changed by this repair.

## Required deterministic qualification before canonical provider execution

The implementation PR must prove on Linux, macOS, and Windows that:

- the canonical Pi model config contains no `samplingParams.tool_choice` override;
- the write-smoke invocation still exposes exactly `--tools write` and no broader tool set;
- deterministic parser tests still reject zero, duplicate, mismatched, non-write, errored, malformed, or identity-drifted tool evidence;
- the natural-exit grace is at most 30 seconds and never extends the 300-second outer deadline;
- cancellation remains fail-closed when natural settlement does not occur;
- the provider prerequisite job is skipped on pull-request code.

After exact-head deterministic CI, fresh independent substantive review, zero unresolved substantive threads, expected-head merge, and canonical post-merge deterministic verification, R181 may be executed again only through the existing canonical-main `[provider-prereq]` gate.

## Non-claims and continuation boundary

Until a fresh canonical-main R181 run returns `outcome=PASS` with every required fact true on all three required platforms:

```text
D003-R181 = NOT COMPLETE
D003-R190 = BLOCKED
D003-R200 = BLOCKED
D003-R210 = BLOCKED
D003-R211 = BLOCKED
D003-R212 = BLOCKED
Specification 004 = UNAUTHORIZED
```

A successful deterministic implementation PR is not provider evidence. A successfully created smoke file without exact retained tool JSONL is not tool proof. No retry may be reinterpreted as PASS unless the exact canonical machine record proves the full prerequisite matrix.