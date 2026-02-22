## Dependency Upgrade - 2026-02-22

### Platform Packages Upgraded
| Package | From | To |
| ------- | ---- | -- |
| react | ^19.2.0 | ^19 |
| react-dom | ^19.2.0 | ^19 |
| @types/react | 19.2.2 | ^19 |
| @types/react-dom | 19.2.2 | ^19 |
| typescript | ^5 | 5.9.2 |
| eslint-config-next | 14.2.5 | ^16 |
| @types/node | 22.5.5 | ^22 |
| tailwindcss | ^3.4.1 | ^4.1.18 |
| @tailwindcss/postcss | - | ^4.1.18 (added) |
| next | 15.4.8 | ^16 |
| vaul | ^0.9.1 | ^1.1.2 |

### Config Changes
- `postcss.config.mjs`: switched Tailwind plugin from `tailwindcss` to `@tailwindcss/postcss`.
- `src/app/globals.css`: replaced v3 directives with `@import "tailwindcss";` and `@config "../../tailwind.config.ts";`.
- `tailwind.config.ts`: set `darkMode` to `"class"` (v4-compatible typing) and replaced `require("tailwindcss-animate")` with ESM import.
- `next.config.mjs`: removed webpack-only obfuscator hook so config stays bundler-agnostic for Turbopack-compatible flow.
- Source imports: replaced `/public/...` static asset imports with `@public/...` aliases to satisfy Turbopack server-relative import constraints.
- `package.json` scripts: `dev` -> `next dev` (Turbopack default), `build` -> `next build` (no forced `--webpack` and no custom obfuscation script), `lint` -> `eslint .` (Next.js 16 no longer supports `next lint`).
- Next codemod output: `src/middleware.ts` migrated to `src/proxy.ts` (`middleware-to-proxy`).
- Obfuscation strategy: removed legacy/custom obfuscator flow; rely on Next.js production minification defaults.

### App-Specific Packages Removed
| Package | Reason |
| ------- | ------ |
| babel-polyfill | Deprecated legacy polyfill; no source/config imports. |
| @shadcn/ui | Unused in source; no direct imports. |
| @tailwindcss/line-clamp | Redundant in Tailwind v4 (line-clamp utilities are built-in). |
| @types/papaparse (runtime dependency) | Type-only package removed from runtime deps; retained in devDependencies. |

### App-Specific Deferred Items
| Package | Version kept | Reason deferred | Plan |
| ------- | ------------ | --------------- | ---- |
| moment | ^2.30.1 | Broad usage across export/detail/list flows; replacement is cross-cutting. | Migrate to `date-fns`/`dayjs` adapters in Batch 10.5 and remove direct `moment` imports incrementally. |
| react-router-dom | ^6.26.0 | Still imported by user form components; App Router replacement requires coordinated refactor. | Replace with Next.js navigation/params APIs in Batch 10.5 and remove package. |
| draft-js | ^0.11.7 | Editor stack tightly coupled to current template form implementation. | Replace editor stack with maintained alternative (TipTap/Lexical or controlled HTML editor) in Batch 10.5. |
| react-draft-wysiwyg | ^1.15.0 | React 19 peer-range incompatibility warning; no stable React 19-compatible release in current stack. | Remove with editor migration in Batch 10.5; eliminate draft-js dependencies together. |

### Type Errors Fixed
- Tailwind v4 type mismatch in `tailwind.config.ts` (`darkMode` strategy).
- Dev runtime failure from CJS `require()` in `tailwind.config.ts` under Next.js 16 ESM loading.
- Turbopack compatibility issue resolved by removing webpack-only obfuscator hook from `next.config.mjs` and normalizing `@public/...` imports for route compilation.

### Peer Dep Warnings
- `react-draft-wysiwyg@1.15.0` expects React <=18 (deferred; tracked above).
- Workspace-level warning remains in `packages/ui`: `react-day-picker@8.10.1` peer range (`react` <=18, `date-fns` <=3). This is outside app-local package scope for Batch 0.5.

### Verification Gate
- check-types: PASS (`pnpm --filter admin-portal check-types`)
- lint: PASS (`pnpm --filter admin-portal lint`) with pre-existing warnings only, no lint errors
- build: PASS (`pnpm --filter admin-portal build`)
- dev smoke: PASS (`pnpm --filter admin-portal dev`) and route checks on:
  - `/dashboard/transaction`
  - `/dashboard/policy`
  - `/dashboard/claim`
  - `/transaction/list`
  - `/policy/list`
  - `/finance/billing`
  - `/masterdata/user`

Next-devtools MCP `get_errors` reported: `No errors detected in 1 browser session(s).`
Known pre-existing runtime behavior observed during smoke: `GET /api/cookie/token 404` (present across routes).

## Package Manager Normalization Check (Retroactive Recheck) - 2026-02-22

Reference updates:
- `078ce759781b04b21a5f01c89a9dcfc09567ffef` (`require pnpm-only lockfile cleanup before upgrades`)
- `3697b94bbf5f3891f2424433939770d944c6aa87` (`clarify pnpm lockfile cleanup scope and commit rules`)

Recheck result using updated scope rules:
- App scope (`apps/admin-portal`, excluding `node_modules` and `.next`) lockfile scan: none found.
- Workspace root lockfile scan (`./yarn.lock`, `./package-lock.json`): none found.
- Root package manager (`package.json`): `pnpm@10.27.0`.
- Root lockfile: `pnpm-lock.yaml` present.
- Cleanup action: no deletion and no cleanup commit required.
- Commit scoping rule noted: app-scoped commit message applies only when app-scope lockfiles are actually removed.

Batch 1 outputs remain valid; migration can continue from the next planned batch without rerunning Batch 1.
## Component Audit - Batch 1 - 2026-02-22

### Batch 1 Outputs
- `apps/admin-portal/docs/migration/component/_output/_audit-report.md`
- `apps/admin-portal/docs/migration/component/_output/_component-backlog.csv`
- `apps/admin-portal/docs/migration/component/_output/_parity-checklist.md`
- `apps/admin-portal/docs/migration/component/_output/_per-app-baseline-summary.md`
- `apps/admin-portal/docs/migration/component/_output/_spec-input.md`

### Classification Summary
- Total components audited: **269**
- ADOPT_NOW: **0**
- ADOPT_WITH_ADAPTER: **0**
- EXTEND_EXISTING: **0**
- NEW_SHARED_COMPONENT: **34**
- KEEP_APP_LOCAL: **235**

### Notes
- Current `@repo/ui` export surface on this branch is `Box` only (`packages/ui/src/index.ts`), so no direct ADOPT_* candidates were identified in Batch 1.
- Batch 1 scope was documentation/audit only; no app source code or `packages/ui` source code was modified.