# Specification 001 — Research

**Observation date:** 2026-09-01  
**Scope:** implementation-stack and deterministic-core shaping research only.

This research records current external platform facts that materially affect Specification 001. These observations must be rechecked before a future release or compatibility claim if the ecosystem moves materially.

## Node.js runtime

Official Node.js release documentation currently identifies Node.js 24 (`Krypton`) as the LTS line. The latest observed Node 24 archive release during shaping was `v24.20.0`.

Relevant official sources:

- https://nodejs.org/en/about/previous-releases
- https://nodejs.org/en/blog/release/v24.20.0
- https://nodejs.org/download/release/latest-v24.x/

### Decision implication

Specification 001 should qualify only Node 24 initially rather than claim broad Node-version compatibility without evidence.

Node 26 may be current/newer, but using an LTS line gives the first deterministic core a narrower stability target.

## Native TypeScript execution in Node 24

Node's TypeScript documentation states that built-in type stripping is stable from Node `v24.12.0`.

Official source:

- https://nodejs.org/docs/latest-v24.x/api/typescript.html

Material behavior:

- `.ts` files using erasable TypeScript syntax can run directly under Node;
- Node strips types but does not perform static type checking;
- `.tsx` is not supported by the built-in path;
- TypeScript constructs that require JavaScript generation are not accepted under the plain type-stripping path unless experimental transformation is used;
- Node runtime behavior does not use `tsconfig.json` as a transpilation pipeline;
- TypeScript import paths should be explicit and compatible with Node's runtime module rules.

Node documentation recommends compiler settings compatible with this model, including `module: nodenext`, `rewriteRelativeImportExtensions`, `erasableSyntaxOnly`, and `verbatimModuleSyntax`.

### Decision implication

Delethos can avoid a runtime TypeScript loader such as `tsx` during Specification 001. This reduces dependencies and keeps the first core closer to platform primitives.

The project must deliberately avoid enums, parameter properties, and other non-erasable syntax in the directly executed source/test path unless the active plan is amended.

## Test runner

Node's built-in `node:test` runner is stable and Node 24 supports TypeScript test files through the same stable type-stripping runtime path when the files use the supported syntax subset.

Official sources:

- https://nodejs.org/docs/latest-v24.x/api/test.html
- https://nodejs.org/docs/latest-v24.x/api/typescript.html

### Decision implication

No third-party test framework is justified for Specification 001 unless a reproducible missing capability appears.

## TypeScript compiler

The current stable TypeScript version observed during shaping is `7.0.2`.

Sources:

- https://www.npmjs.com/package/typescript
- https://devblogs.microsoft.com/typescript/announcing-typescript-7/

TypeScript remains useful even though Node can execute the supported `.ts` subset directly: Node's type stripping does not typecheck.

### Decision implication

Use TypeScript as a development-only static checker, not a runtime dependency or transpilation requirement for Specification 001.

## pnpm

The current npm `latest` pnpm version observed during shaping is `11.24.0`.

Sources:

- https://www.npmjs.com/package/pnpm
- https://pnpm.io/

### Decision implication

A pnpm workspace is appropriate for the future multi-package repository while remaining small enough for one package initially. The exact package-manager version should be declared and the real lockfile committed.

The package manager is tooling, not product runtime authority.

## Node type declarations

The global `@types/node` latest line may track newer Node releases. A Node 24-compatible declaration line should be preferred so static declarations do not silently imply APIs newer than the qualified runtime.

The observed 24.x release available during shaping includes `@types/node@24.13.3`.

Source:

- https://www.npmjs.com/package/@types/node?activeTab=versions

### Decision implication

If `@types/node` is required for static checking, keep it on a compatible 24.x line and record the exact implementation version in the lockfile/evidence.

## GitHub Actions

Current official action major versions observed during shaping:

- `actions/checkout@v7`
- `actions/setup-node@v7`

Sources:

- https://github.com/actions/checkout
- https://github.com/actions/setup-node

`setup-node` documentation strongly recommends committing package-manager lockfiles for reproducible dependency installation.

### Decision implication

Specification 001 may use those current majors in the first CI workflow, subject to exact implementation review. A future security-hardening specification may pin immutable action commit SHAs if the repository chooses that policy.

## Dependency evaluation

### Runtime schema library

Candidates such as Zod are intentionally **not selected** for Specification 001.

Reason:

- the first contract surface is small;
- explicit hand-written validation is directly testable;
- zero production dependencies is a stronger founding constraint;
- a schema library can be reconsidered when contract breadth or external interchange makes the maintenance trade-off materially favorable.

### Test framework

Vitest/Jest are intentionally **not selected**.

Reason:

- `node:test` is sufficient for the current pure-core acceptance surface;
- cross-platform test execution is available without another runtime/toolchain layer.

### TypeScript runtime loader/transpiler

`tsx`, `ts-node`, Babel, SWC, and esbuild are intentionally **not selected** for Specification 001 runtime/test execution.

Reason:

- stable Node 24 native type stripping covers the intended erasable TypeScript subset;
- static type checking remains separate through the TypeScript compiler.

## Architecture implications

The research supports a deliberately small first product stack:

```text
Node 24 LTS
TypeScript source with erasable syntax only
node:test
node:crypto
pnpm workspace
TypeScript compiler (dev only)
@types/node 24.x (dev only, if needed)
zero production dependencies
```

This is a bounded optimization for Specification 001, not a constitutional ban on future dependencies.

## Unresolved implementation questions

The implementation unit must resolve through tests/evidence rather than assumptions:

1. exact treatment of JavaScript `-0` under canonical number semantics;
2. whether to reject all objects with a non-`Object.prototype`/null prototype or normalize null-prototype records;
3. final hard upper bound for `maxRepairAttempts`;
4. whether `STALLED` is terminal in the initial semantic kernel or has a separately modeled recovery transition;
5. exact internal pre-v1 schema/version labels;
6. exact Node 24 patch version used by CI and whether CI pins the patch or the LTS major;
7. exact action version/pinning policy for the first CI implementation.

These questions are small enough to resolve within Specification 001 without expanding into later product layers.

## Research non-claims

This research does not establish:

- that Node/TypeScript is faster or safer than Rust/Go;
- that native TypeScript stripping is suitable for every future Delethos package;
- that pnpm is superior to npm/yarn for all projects;
- that zero runtime dependencies will remain possible for every future specification;
- any coding-agent provider capability;
- any cross-agent review benefit;
- any benchmark or product superiority claim.
