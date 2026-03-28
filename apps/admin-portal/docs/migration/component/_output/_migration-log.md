## Dependency Upgrade - 2026-02-22

### Platform Packages Upgraded

| Package              | From    | To              |
| -------------------- | ------- | --------------- |
| react                | ^19.2.0 | ^19             |
| react-dom            | ^19.2.0 | ^19             |
| @types/react         | 19.2.2  | ^19             |
| @types/react-dom     | 19.2.2  | ^19             |
| typescript           | ^5      | 5.9.2           |
| eslint-config-next   | 14.2.5  | ^16             |
| @types/node          | 22.5.5  | ^22             |
| tailwindcss          | ^3.4.1  | ^4.1.18         |
| @tailwindcss/postcss | -       | ^4.1.18 (added) |
| next                 | 15.4.8  | ^16             |
| vaul                 | ^0.9.1  | ^1.1.2          |

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

| Package                               | Reason                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------- |
| babel-polyfill                        | Deprecated legacy polyfill; no source/config imports.                     |
| @shadcn/ui                            | Unused in source; no direct imports.                                      |
| @tailwindcss/line-clamp               | Redundant in Tailwind v4 (line-clamp utilities are built-in).             |
| @types/papaparse (runtime dependency) | Type-only package removed from runtime deps; retained in devDependencies. |

### App-Specific Deferred Items

| Package             | Version kept | Reason deferred                                                                                      | Plan                                                                                                       |
| ------------------- | ------------ | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| moment              | ^2.30.1      | Broad usage across export/detail/list flows; replacement is cross-cutting.                           | Migrate to `date-fns`/`dayjs` adapters in Batch 10.5 and remove direct `moment` imports incrementally.     |
| react-router-dom    | ^6.26.0      | Still imported by user form components; App Router replacement requires coordinated refactor.        | Replace with Next.js navigation/params APIs in Batch 10.5 and remove package.                              |
| draft-js            | ^0.11.7      | Editor stack tightly coupled to current template form implementation.                                | Replace editor stack with maintained alternative (TipTap/Lexical or controlled HTML editor) in Batch 10.5. |
| react-draft-wysiwyg | ^1.15.0      | React 19 peer-range incompatibility warning; no stable React 19-compatible release in current stack. | Remove with editor migration in Batch 10.5; eliminate draft-js dependencies together.                      |

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

- Current `@repo/ui` export surface on this branch is `Box` only (`packages/ui/src/index.ts`), so no direct ADOPT\_\* candidates were identified in Batch 1.
- Batch 1 scope was documentation/audit only; no app source code or `packages/ui` source code was modified.

## Batch 1.5 - SoC Pre-Migration Refactor

### AssignPlan - 2026-02-23

- Strategy: render-prop
- Status: SKIPPED - skipped - tightly coupled to route/service context; defer to Phase 05A
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### BenefitList - 2026-02-23

- Strategy: render-prop
- Status: SKIPPED - skipped - tightly coupled to route/service context; defer to Phase 05A
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### ChannelList - 2026-02-23

- Strategy: render-prop
- Status: SKIPPED - skipped - tightly coupled to route/service context; defer to Phase 05A
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### DetailList - 2026-02-23

- Strategy: render-prop
- Status: SKIPPED - skipped - tightly coupled to route/service context; defer to Phase 05A
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### ExtendedSidemenu - 2026-02-23

- Strategy: render-prop
- Container: src/components/extended-sidemenu.tsx - frozen export, KEEP_APP_LOCAL
- Shell: src/components/ExtendedSidemenuShell.tsx - classification: KEEP_APP_LOCAL
- Domain logic removed from Shell: router push + collapse state retained in container; shell receives callbacks and state
- Box pass: 0 elements replaced
- Gate result: types ✅ | lint ✅ | build ✅ | smoke ? (10 smoke routes executed; no runtime crash; known /api/cookie/token 404)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### Image - 2026-02-23

- Strategy: render-prop
- Container: src/components/image.tsx - frozen export, KEEP_APP_LOCAL
- Shell: src/components/OptimizeImageShell.tsx - classification: NEW_SHARED_COMPONENT
- Domain logic removed from Shell: next/image rendering moved to renderImage prop in shell
- Box pass: 0 elements replaced
- Gate result: types ✅ | lint ✅ | build ✅ | smoke ? (10 smoke routes executed; no runtime crash; known /api/cookie/token 404)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: YES (OptimizeImageShell, queued for Phase 04)

### Image - 2026-02-23

- Strategy: render-prop
- Container: src/components/ui/image.tsx - frozen export, KEEP_APP_LOCAL
- Shell: src/components/ui/OptimizeImageShell.tsx - classification: NEW_SHARED_COMPONENT
- Domain logic removed from Shell: next/image rendering moved to renderImage prop in shell
- Box pass: 0 elements replaced
- Gate result: types ✅ | lint ✅ | build ✅ | smoke ? (10 smoke routes executed; no runtime crash; known /api/cookie/token 404)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: YES (OptimizeImageShell, queued for Phase 04)

### InsuranceSelectionModal - 2026-02-23

- Strategy: render-prop
- Status: SKIPPED - skipped - tightly coupled to route/service context; defer to Phase 05A
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### PackageList - 2026-02-23

- Strategy: render-prop
- Status: SKIPPED - skipped - tightly coupled to route/service context; defer to Phase 05A
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### PageHeader - 2026-02-23

- Strategy: render-prop
- Container: src/components/ui/PageHeader/index.tsx - frozen export, KEEP_APP_LOCAL
- Shell: src/components/ui/PageHeader/PageHeaderShell.tsx - classification: KEEP_APP_LOCAL
- Domain logic removed from Shell: next/navigation router logic retained in container via onBackClick injection
- Box pass: 0 elements replaced
- Gate result: types ✅ | lint ✅ | build ✅ | smoke ? (10 smoke routes executed; no runtime crash; known /api/cookie/token 404)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO
- Shared UI guidance: retain any PageHeader wrapper locally; do not migrate toward an `@repo/ui` PageHeader. Compose equivalent header UX from existing app-agnostic `@repo/ui` primitives inside the app to preserve behavior parity.

### BillingDetailActions - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - tightly coupled to route/service context; defer to Phase 05A
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### BillingDetailInfo - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - tightly coupled to route/service context; defer to Phase 05A
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### Button - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - existing component already presentation-focused; no safe split found
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### ButtonCalendar - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - existing component already presentation-focused; no safe split found
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### Calendar - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - existing component already presentation-focused; no safe split found
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### ChannelAddModal - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - tightly coupled to route/service context; defer to Phase 05A
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### ChannelSelectionModal - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - tightly coupled to route/service context; defer to Phase 05A
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### Chart - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - existing component already presentation-focused; no safe split found
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### Datepicker - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - existing component already presentation-focused; no safe split found
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### DateRangePicker - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - existing component already presentation-focused; no safe split found
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### DragDropExcel - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - existing component already presentation-focused; no safe split found
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### ImageOrDefault - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - existing component already presentation-focused; no safe split found
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### Input - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - existing component already presentation-focused; no safe split found
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### Loader - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - existing component already presentation-focused; no safe split found
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### Modal - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - existing component already presentation-focused; no safe split found
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### MultipleSelect - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - existing component already presentation-focused; no safe split found
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### NoRecentData - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - existing component already presentation-focused; no safe split found
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### NotFoundPage - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - route boundary component; defer to Phase 05A route-focused refactor
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### NotFoundPage - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - existing component already presentation-focused; no safe split found
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### Pagination - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - existing component already presentation-focused; no safe split found
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### PlanSelectionModal - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - tightly coupled to route/service context; defer to Phase 05A
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### Popover - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - existing component already presentation-focused; no safe split found
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### ProductDetailTab - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - tightly coupled to route/service context; defer to Phase 05A
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### ProductSelectionModal - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - tightly coupled to route/service context; defer to Phase 05A
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### RootLayout - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - route boundary component; defer to Phase 05A route-focused refactor
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### Select - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - existing component already presentation-focused; no safe split found
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### Textarea - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - existing component already presentation-focused; no safe split found
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### Tooltip - 2026-02-23

- Strategy: container-shell
- Status: SKIPPED - skipped - existing component already presentation-focused; no safe split found
- Container: n/a
- Shell: n/a
- Domain logic removed from Shell: n/a
- Box pass: 0 elements replaced
- Gate result: n/a (no code change for this candidate)
- Caller grep: ✅ zero caller files changed
- packages/ui candidate: NO

### Batch 1.5 Completion Snapshot - 2026-02-23

- Candidates from Batch 1 audit: 38
- Processed (split completed): 4
- Explicitly skipped with reason: 34
- Remaining `Batch 1.5 candidate: YES`: 0
- Verification gate (app-level): check-types ? | lint ? (warnings only) | build ?
- Caller file integrity: ? only container files + new shell files changed in `src/`

### Batch 1.5 Smoke Route Verification - 2026-02-23

- Smoke routes executed (10): /dashboard/transaction, /dashboard/policy, /dashboard/claim, /transaction/list, /policy/list, /policy/endorsement/list, /claim/list, /membership/list, /finance/billing, /masterdata/user
- Result: all routes returned HTTP 200 and rendered successfully.
- Runtime error text detected: none.
- Console errors: repeated `GET /api/cookie/token 404` observed on each route (pre-existing and already known).
- Screenshots: `apps/admin-portal/docs/migration/component/_artifacts/smoke-routes/*.png`

### Batch 1.5 Smoke Route Verification (Authenticated) - 2026-02-23

- Login executed before route checks using the provided test account (session established as `Hi, Rendra R`).
- Screenshot root: `apps/admin-portal/docs/migration/component/_artifacts/smoke-routes/`
- Route outcomes:
  - `/dashboard/transaction` - PASS (rendered dashboard); one aborted external request observed: `https://transaction-service.stg.friendsure.io/...` (`net::ERR_ABORTED`).
  - `/dashboard/policy` - PASS
  - `/dashboard/claim` - PASS
  - `/transaction/list` - PASS
  - `/policy/list` - PASS
  - `/policy/endorsement/list` - PASS
  - `/claim/list` - PASS (redirected internally to querystring variant)
  - `/membership/list` - PASS route load; page displays `403 - Forbidden` (permission-gated)
  - `/finance/billing` - PASS route load; page displays `403 - Forbidden` (permission-gated)
  - `/masterdata/user` - PASS
- Console/runtime summary: no crash/exception page observed; known pre-existing `GET /api/cookie/token 404` still appears.

### Legacy Update Snapshot - 2026-03-04 09:50 (+07)

- Source branch: integrate-app/admin-portal (legacy remote admin-portal, branch stage)
- Integrate update SHA: 09c6e6707ef9e9edc3fc301c542446ce3e290bfc
- Migrate merge commit: 66ae178d2eee76bd49e79c0b641185ee497d2cbb
- L1 result: subtree pull succeeded on integrate worktree and merge to migrate worktree completed.
- L2 conflicts resolved:
  - src/context/auth.context.tsx - non-migrated component context -> accepted legacy (--theirs)
  - src/views/layout/layout.view.tsx - non-migrated layout shell -> accepted legacy (--theirs) with follow-up import compatibility fix for Next.js build
  - src/services/api.service.ts - restored from legacy tree to satisfy merged OAuth/auth imports
- L3 classification summary:
  - Config/dependency: package.json, src/constants/app-common.const.tsx, src/constants/api-url.const.tsx
  - Existing non-migrated updates: src/context/auth.context.tsx, src/views/layout/layout.view.tsx, src/app/claim/list/detail/[id]/page.tsx
  - New app-local files: src/app/oauth/\*, src/config/msal.config.ts, src/services/api.service.ts, src/services/auth.service.ts, src/views/oauth/msal-callback.view.tsx
  - New component: src/components/microsoft-login-button.tsx -> KEEP_APP_LOCAL
  - Shared candidate (NEW_SHARED_COMPONENT/EXTEND_EXISTING): none
- Path taken: L4
- L6 gate: check-types PASS, lint PASS (warnings only), build PASS
- Resume point: ready to continue Batch 2 on migrate-app/admin-portal.

## Pause Record

- Current batch: Batch 2
- Component in progress: none - between batch boundaries
- Last completed step: legacy update intake completed through L6
- Status: [RESUME] Resumed after legacy update
- Legacy update integrated: 2026-03-17 10:39:21 +07:00
- Affected components: src/app/policy/list/page.tsx, src/components/tableConfig/policyTableConfig.tsx, src/components/ui/spinner.tsx, src/hooks/usePolicies.hooks.tsx
- New packages/ui intake items: none

### Legacy Update Snapshot - 2026-03-17 10:39 (+07)

- Source branch: integrate-app/admin-portal (legacy remote admin-portal, branch stage)
- Legacy commits pulled: f314f66e6, 1cb475264, 8fb3d87c9
- Integrate update SHA: a4038ad96
- Migrate merge/conflict-resolution commit: 54edf83ab
- L1 result: subtree pull succeeded on integrate worktree and merge to migrate worktree completed with one conflict.
- L2 conflicts resolved:
  - src/hooks/usePolicies.hooks.tsx - in-progress batch item -> manual merge; kept migrated query-hook structure and applied legacy export state/date-range additions narrowly
- L3 classification summary:
  - Existing non-migrated updates: src/app/policy/list/page.tsx, src/components/tableConfig/policyTableConfig.tsx, src/components/ui/spinner.tsx
  - Other app-level operational changes: src/hooks/usePolicies.hooks.tsx, src/types/policy.d.ts
  - New component files: none
  - Shared candidate (NEW_SHARED_COMPONENT/EXTEND_EXISTING): none
- Path taken: L4
- L6 gate: check-types PASS, lint PASS (warnings only), build PASS
- Migrated component integrity: N/A - no component-track DONE entries yet
- Batch 1.5 split integrity: PASS - existing Container/Shell files remain intact
- Resume point: ready to continue Batch 2 on migrate-app/admin-portal.

## Batch 5.5 - App Consumer Bootstrap - 2026-03-25

- Files changed: `apps/admin-portal/src/app/globals.css`, `apps/admin-portal/docs/migration/component/_output/_migration-log.md`, `apps/admin-portal/docs/migration/component/_output/_migration-plan.md`, `apps/admin-portal/docs/migration/component/_output/_parity-checklist.md`
- Shared preset import: added `@import "@repo/config/semantic-tokens.css"`
- Local app-brand overrides retained: `--primary`, `--primary-foreground`, `--primary-light-foreground`, `--warning`, `--ring`, `--radius`
- Full token contract check: PASS
- `--radius` explicitly set: PASS
- Dark-mode strategy: temporary compatibility bridge
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: PASS
- Notes: No transition `@import "@repo/config/tailwind.css"` was kept because no legacy shared utility usage was found in app source. Required semantic tokens resolved in-browser from the shared preset while app-brand overrides remained local. `/membership/list` and `/finance/billing` still render the expected permission-gated `403 - Forbidden` state. Playwright recorded 0 console errors and Next.js MCP `get_errors` reported no runtime errors after the bootstrap change.

## Batch 6/7 Reconciliation After Batch 5.5 - 2026-03-25

- Batch 6 status after bootstrap: PASS
- Batch 7 status after bootstrap: PASS
- Revalidated routes: `/dashboard/transaction`, `/dashboard/policy`, `/dashboard/claim`, `/transaction/list`, `/policy/list`, `/policy/endorsement/list`, `/claim/list`, `/membership/list`, `/finance/billing`, `/masterdata/user`
- Regressions found: None
- Follow-up needed before next batch: None

## Batch 6 / Batch 1 - NO-OP - 2026-03-25

- Audit source reviewed: `apps/admin-portal/docs/migration/component/_output/_audit-report.md`
- ADOPT_NOW count: `0`
- `@repo/ui` export check: reviewed `packages/ui/src/index.ts`; shared exports exist on this branch, but `_audit-report.md` assigns no admin-portal component to `ADOPT_NOW` or Batch 1.
- Import swaps performed: none
- Local component files deleted: none
- Batch 6 disposition: closed as `NO-OP / COMPLETE` because the audit report is the source of truth for Batch 6 and it contains zero verified `ADOPT_NOW` components for `apps/admin-portal`.
- Audit vs parity note: `_parity-checklist.md` still lists generic shared-component headings (for example `Button`, `Calendar`, `Input`, `Pagination`, `Popover`, `Select`, `Spinner`, `Tooltip`), but that checklist does not override `_audit-report.md`. No source-code migration was forced from checklist-only evidence.
- `_migration-plan.md` status update: not applied; file does not exist at `apps/admin-portal/docs/migration/component/_output/_migration-plan.md`.
- Next likely actionable stage: Batch 8/9 work only after Phase 04 shared-component delivery creates real `NEW_SHARED_COMPONENT` migration targets on this branch; there is no verified Batch 6 `ADOPT_NOW` work to execute in `admin-portal`.
- Post-Migration Improvement Candidates: None

## Batch 7 / Batch 2 - NO-OP - 2026-03-25

- Audit source reviewed: `apps/admin-portal/docs/migration/component/_output/_audit-report.md`
- ADOPT_WITH_ADAPTER count: `0`
- Adapter mapping reviewed: `packages/ui/docs/normalization/_output/21-adapter-mapping.md`
- `@repo/ui` export check: reviewed `packages/ui/src/index.ts`; shared exports exist on this branch, but `_audit-report.md` contains no components classified `ADOPT_WITH_ADAPTER` and no components assigned to Batch 2.
- Adapters created: none
- Import swaps performed: none
- Local legacy files deleted: none
- Batch 7 disposition: closed as `NO-OP / COMPLETE` because the audit report is the source of truth for Batch 7 and it yields an empty verified adapter list for `apps/admin-portal`.
- Audit vs adapter note: adapter-mapping guidance does not create app work by itself. Existing shared exports also do not justify Batch 2 changes when admin-portal components are classified elsewhere.
- Audit vs parity note: `_parity-checklist.md` still lists generic shared-component headings, but checklist entries do not override `_audit-report.md`; no adapter migration was forced from checklist-only evidence.
- `_migration-plan.md` status update: not applied; file does not exist at `apps/admin-portal/docs/migration/component/_output/_migration-plan.md`.
- Next likely actionable stage: Batch 8/9 work only after Phase 04 shared-component delivery creates real per-app migration targets for admin-portal; there is no verified Batch 7 `ADOPT_WITH_ADAPTER` work to execute on this branch.
- Post-Migration Improvement Candidates: None

## Batch 8 / Batch 4 - Alert - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Alert`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: [`apps/admin-portal/src/app/finance/billing/add/page.tsx`]
- Local file deleted: [`apps/admin-portal/src/components/ui/alert.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: [`apps/admin-portal/src/app/finance/billing/add/page.tsx` - replace the clickable Back `<div>` with button/link semantics in a later pass]

## Batch 8 / Batch 4 - Card - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Card`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: [`apps/admin-portal/src/components/forms/product-catalog/benefit.form.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/product-detail-tab.tsx`]
- Local file deleted: [`apps/admin-portal/src/components/ui/card.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: `None`

## Batch 8 / Batch 4 - Label - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Label`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: [`apps/admin-portal/src/components/ui/form.tsx`]
- Local file deleted: [`apps/admin-portal/src/components/ui/label.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: `None`

## Batch 8 / Batch 4 - Badge - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Badge`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: `[]`
- Local file deleted: [`apps/admin-portal/src/components/ui/badge.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: FAIL
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `none`
- Post-Migration Improvement Candidates: `None`

## Batch 8 / Batch 4 - Spinner - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Spinner`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: [`apps/admin-portal/src/components/forms/UserForm/components/add-insurer-modal.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/add-channel-modal.tsx`, `apps/admin-portal/src/app/transaction/list/export/page.tsx`, `apps/admin-portal/src/app/membership/list/export/page.tsx`, `apps/admin-portal/src/app/claim/list/export/page.tsx`, `apps/admin-portal/src/app/policy/list/page.tsx`, `apps/admin-portal/src/app/policy/list/export/page.tsx`, `apps/admin-portal/src/app/policy/endorsement/list/export/page.tsx`]
- Local file deleted: [`apps/admin-portal/src/components/ui/spinner.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: `None`

## Batch 8 / Batch 4 - Command - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Command`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: [`apps/admin-portal/src/components/ui/combobox.tsx`]
- Local file deleted: [`apps/admin-portal/src/components/ui/command.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: [`apps/admin-portal/src/components/ui/combobox.tsx` - the add-new option row is still a clickable `<div>` and should be revisited for button/keyboard semantics in a later pass]

## Batch 8 / Batch 4 - RadioGroup - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `RadioGroup`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: [`apps/admin-portal/src/components/forms/EmailTemplateForm/index.tsx`]
- Local file deleted: [`apps/admin-portal/src/components/ui/radio-group.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: `None`

## Batch 8 / Batch 4 - Switch - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Switch`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: [`apps/admin-portal/src/components/tableConfig/usersTableConfig.tsx`]
- Local file deleted: [`apps/admin-portal/src/components/ui/switch.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: [`apps/admin-portal/src/components/tableConfig/usersTableConfig.tsx` - add an explicit accessible name for the table-row status switch in a later accessibility pass]

## Batch 8 / Batch 4 - Tabs - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Tabs`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: [`apps/admin-portal/src/app/product-category/[category]/detail/[id]/product-detail-tab.tsx`, `apps/admin-portal/src/app/masterdata/partner-management/detail/[id]/assign-plan.tsx`]
- Local file deleted: [`apps/admin-portal/src/components/ui/tabs.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: `None`

## Batch 8 / Batch 4 - Checkbox - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Checkbox`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: `[]`
- Local file deleted: [`apps/admin-portal/src/components/ui/checkbox.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `none`
- Post-Migration Improvement Candidates: `None`

## Batch 8 / Batch 4 - Pagination - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Pagination`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: `[]`
- Local file deleted: [`apps/admin-portal/src/components/ui/pagination.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `none`
- Post-Migration Improvement Candidates: `None`

## Batch 8 / Batch 4 - Menubar - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Menubar`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: `[]`
- Local file deleted: [`apps/admin-portal/src/components/ui/menubar.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `none`
- Post-Migration Improvement Candidates: `None`

## Batch 8 / Batch 4 - Popover - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Popover`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: [`apps/admin-portal/src/components/ui/combobox.tsx`, `apps/admin-portal/src/app/claim/list/page.tsx`, `apps/admin-portal/src/app/report/claim/page.tsx`, `apps/admin-portal/src/app/finance/billing/page.tsx`, `apps/admin-portal/src/app/report/campaign/page.tsx`, `apps/admin-portal/src/app/policy/list/page.tsx`]
- Local file deleted: [`apps/admin-portal/src/components/ui/popover.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: `None`

## Batch 8 / Batch 4 - Textarea - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Textarea`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: [`apps/admin-portal/src/app/transaction/list/add/page.tsx`, `apps/admin-portal/src/components/forms/RoleForm/index.tsx`]
- Local file deleted: [`apps/admin-portal/src/components/ui/textarea.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: `None`

## Batch 8 / Batch 4 - NavigationMenu - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `NavigationMenu`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: `[]`
- Local file deleted: [`apps/admin-portal/src/components/ui/navigation-menu.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `none`
- Post-Migration Improvement Candidates: `None`

## Batch 8 / Batch 4 - Tooltip - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Tooltip`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: [`apps/admin-portal/src/components/tableConfig/packageTableConfig.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/benefit-list.tsx`, `apps/admin-portal/src/app/claim/list/import-with-preview/page.tsx`]
- Local file deleted: [`apps/admin-portal/src/components/ui/tooltip.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: [`apps/admin-portal/src/components/tableConfig/packageTableConfig.tsx` - add an explicit accessible name to the icon-only destructive action button in a later accessibility pass, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/benefit-list.tsx` - add an explicit accessible name to the icon-only destructive action button in a later accessibility pass]

## Batch 8 / Batch 4 - Calendar - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Calendar`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: [`apps/admin-portal/src/app/policy/list/page.tsx`, `apps/admin-portal/src/app/report/claim/page.tsx`, `apps/admin-portal/src/app/report/campaign/page.tsx`, `apps/admin-portal/src/app/claim/list/page.tsx`]
- Local file deleted: [`apps/admin-portal/src/components/ui/calendar.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: `None`

## Batch 8 / Batch 4 - Table - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Table`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: [`apps/admin-portal/src/app/transaction/list/import/import/page.tsx`, `apps/admin-portal/src/components/ui/DataTable/index.tsx`, `apps/admin-portal/src/app/transaction/list/add/page.tsx`, `apps/admin-portal/src/app/membership/list/upload/page.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/user-roles.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/user-insurers.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/user-groups.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/user-channels.tsx`, `apps/admin-portal/src/app/masterdata/partner-management/detail/[id]/assign-plan.tsx`, `apps/admin-portal/src/app/product-category/[category]/page.tsx`, `apps/admin-portal/src/components/forms/RoleForm/index.tsx`, `apps/admin-portal/src/app/claim/list/import-with-preview/page.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/upload-detail/page.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/upload-benefit/page.tsx`, `apps/admin-portal/src/components/forms/PageManagementForm/index.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/upload/page.tsx`, `apps/admin-portal/src/app/masterdata/email-template/tag/page.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/detail-list.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/channel-list.tsx`, `apps/admin-portal/src/components/forms/GroupForm/index.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/benefit-list.tsx`, `apps/admin-portal/src/components/forms/CurrencyForm/index.tsx`, `apps/admin-portal/src/app/policy/list/import/page.tsx`, `apps/admin-portal/src/app/policy/list/detail/[id]/page.tsx`, `apps/admin-portal/src/app/policy/endorsement/list/upload/page.tsx`, `apps/admin-portal/src/app/policy/endorsement/list/detail/[id]/upload/page.tsx`]
- Local file deleted: [`apps/admin-portal/src/components/ui/table.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: `None`

## Batch 8 / Batch 4 - Drewer - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Drawer`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: [`apps/admin-portal/src/app/source/list/page.tsx`, `apps/admin-portal/src/app/sanction/list/page.tsx`, `apps/admin-portal/src/app/promotion/campaign/page.tsx`, `apps/admin-portal/src/components/tableConfig/sourceTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/sanctionTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/campaignTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/transactionTableConfig.tsx`]
- Local file deleted: [`apps/admin-portal/src/components/ui/drewer.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: `None`

## Batch 8 / Batch 4 - DropdownMenu - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `DropdownMenu`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: `[]`
- Local file deleted: [`apps/admin-portal/src/components/ui/dropdown-menu.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `none`
- Post-Migration Improvement Candidates: `None`

## Batch 8 / Batch 4 - Form - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Form`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: `[]`
- Local file deleted: [`apps/admin-portal/src/components/ui/form.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: `None`

## Batch 8 / Batch 4 - Dialog - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Dialog`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: [`apps/admin-portal/src/app/claim/list/page.tsx`, `apps/admin-portal/src/app/claim/list/detail/[id]/page.tsx`, `apps/admin-portal/src/app/claim/list/import-with-preview/page.tsx`, `apps/admin-portal/src/app/export-users/page.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/components/BillingDetailActions.tsx`, `apps/admin-portal/src/app/masterdata/partner-management/detail/[id]/assign-plan.tsx`, `apps/admin-portal/src/app/masterdata/user/page.tsx`, `apps/admin-portal/src/app/policy/endorsement/list/detail/[id]/page.tsx`, `apps/admin-portal/src/app/policy/list/detail/[id]/page.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/channel-add-modal.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/channel-list.tsx`, `apps/admin-portal/src/components/forms/EmailTemplateForm/index.tsx`, `apps/admin-portal/src/components/forms/GroupForm/index.tsx`, `apps/admin-portal/src/components/forms/UserForm/index.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/add-channel-modal.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/add-insurer-modal.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/user-groups.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/user-roles.tsx`, `apps/admin-portal/src/components/tableConfig/claimTableConfig.tsx`]
- Local file deleted: [`apps/admin-portal/src/components/ui/dialog.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: `None`

## Batch 8 / Batch 4 - Input - 2026-03-26

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Input`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: [`apps/admin-portal/src/app/transaction/list/add/page.tsx`, `apps/admin-portal/src/app/claim/list/page.tsx`, `apps/admin-portal/src/app/claim/list/import-with-preview/page.tsx`, `apps/admin-portal/src/components/ui/Fields/UploadFile/index.tsx`, `apps/admin-portal/src/components/ui/Fields/SelectAutocomplete/index.tsx`, `apps/admin-portal/src/components/ui/DataTable/index.tsx`, `apps/admin-portal/src/app/claim/history/page.tsx`, `apps/admin-portal/src/app/membership/list/upload/page.tsx`, `apps/admin-portal/src/app/policy/list/import/page.tsx`, `apps/admin-portal/src/components/tableConfig/claimTableConfig.tsx`, `apps/admin-portal/src/app/policy/endorsement/list/upload/page.tsx`, `apps/admin-portal/src/app/masterdata/user/page.tsx`, `apps/admin-portal/src/app/product-category/page.tsx`, `apps/admin-portal/src/app/export-users/page.tsx`, `apps/admin-portal/src/components/forms/EmailTemplateForm/index.tsx`, `apps/admin-portal/src/components/forms/EmailTagForm/index.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/user-roles.tsx`, `apps/admin-portal/src/components/forms/CurrencyForm/index.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/user-groups.tsx`, `apps/admin-portal/src/components/forms/ChannelForm/index.tsx`, `apps/admin-portal/src/components/forms/product-category.form.tsx`, `apps/admin-portal/src/components/forms/CampaignForm/index.tsx`, `apps/admin-portal/src/components/forms/product-catalog/package.form.tsx`, `apps/admin-portal/src/components/forms/BrokerFeeForm/index.tsx`, `apps/admin-portal/src/components/forms/product-catalog/field-array-input.tsx`, `apps/admin-portal/src/components/forms/product-catalog/benefit.form.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/user-form.tsx`, `apps/admin-portal/src/components/forms/PartnerManagementForm/index.tsx`, `apps/admin-portal/src/components/forms/PartnerCommForm/index.tsx`, `apps/admin-portal/src/components/forms/SourceForm/index.tsx`, `apps/admin-portal/src/components/forms/PageManagementForm/index.tsx`, `apps/admin-portal/src/components/forms/SanctionForm/index.tsx`, `apps/admin-portal/src/components/forms/InsuranceForm/index.tsx`, `apps/admin-portal/src/components/forms/RoleForm/index.tsx`, `apps/admin-portal/src/components/forms/ProductForm/index.tsx`, `apps/admin-portal/src/components/forms/ProductCategoryForm/index.tsx`, `apps/admin-portal/src/components/forms/HolidayDateForm/index.tsx`, `apps/admin-portal/src/components/forms/GroupForm/index.tsx`, `apps/admin-portal/src/app/masterdata/partner-management/page.tsx`]
- Local file deleted: [`apps/admin-portal/src/components/ui/input.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: [`packages/ui/src/Input/Input.types.ts` - consider accepting the native `inputMode="numeric"` alias in the shared Input contract to reduce consumer migration friction]

## Batch 8 / Batch 4 - Combobox - 2026-03-26 - BLOCKED

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Blocker: `API compatibility unclear`
- Evidence checked: [`packages/ui/src/index.ts` export for `Combobox`, `packages/ui/src/Combobox/Combobox.spec.md`, `packages/ui/docs/normalization/_output/21-adapter-mapping.md` Combobox guidance, `apps/admin-portal/src/components/ui/combobox.tsx`, `apps/admin-portal/src/app/transaction/list/add/page.tsx` usage with `onSearch`, `newOptionText`, and create-on-enter behavior]
- Files changed: `none`
- Next required upstream action: `Either extend @repo/ui Combobox with an approved external-search/create-option contract, or publish explicit adapter guidance for the admin-portal remote-search/create-on-enter variant before app-side migration resumes.`

## Batch 8 / Batch 4 - Combobox - 2026-03-27

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Combobox`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: [`apps/admin-portal/src/app/transaction/list/add/page.tsx`]
- Local file deleted: `apps/admin-portal/src/components/ui/combobox.tsx`
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: `None`

## Batch 8 / Batch 4 - Breadcrumb - 2026-03-27 - BLOCKED

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Blocker: `API compatibility unclear`
- Evidence checked: [`packages/ui/src/index.ts` export for `Breadcrumb`, `packages/ui/src/Breadcrumb/Breadcrumb.spec.md`, `packages/ui/docs/normalization/_output/21-adapter-mapping.md` Breadcrumb guidance, `apps/admin-portal/src/components/ui/breadcrumb.tsx`, representative admin-portal usage sites importing `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, and `BreadcrumbSeparator` from `@/components/ui/breadcrumb`]
- Files changed: `apps/admin-portal/docs/migration/component/_output/_migration-log.md`
- Next required upstream action: `Publish approved adapter guidance or align the shared Breadcrumb contract with the app's legacy compound export surface; the current shared implementation only exposes a flat items[] API, so the replacement path for the existing compound usage is not yet clear.`

## Batch 8 / Batch 4 - Breadcrumb - 2026-03-27

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Breadcrumb`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: [`apps/admin-portal/src/app/claim/list/import-with-preview/page.tsx`, `apps/admin-portal/src/app/claim/list/import/page.tsx`, `apps/admin-portal/src/app/transaction/list/import/import/page.tsx`, `apps/admin-portal/src/app/transaction/list/detail/[id]/page.tsx`, `apps/admin-portal/src/app/transaction/list/add/page.tsx`, `apps/admin-portal/src/components/ui/PageHeader/PageHeaderShell.tsx`, `apps/admin-portal/src/app/masterdata/email-template/tag/add/page.tsx`, `apps/admin-portal/src/app/sanction/list/upload/page.tsx`, `apps/admin-portal/src/app/report/performance/page.tsx`, `apps/admin-portal/src/app/report/campaign/page.tsx`, `apps/admin-portal/src/app/report/claim/page.tsx`, `apps/admin-portal/src/components/forms/BrokerFeeForm/index.tsx`, `apps/admin-portal/src/components/forms/EmailTagForm/index.tsx`, `apps/admin-portal/src/app/product-category/[category]/add/page.tsx`, `apps/admin-portal/src/components/forms/CurrencyForm/index.tsx`, `apps/admin-portal/src/components/forms/UserForm/index.tsx`, `apps/admin-portal/src/components/forms/ChannelForm/index.tsx`, `apps/admin-portal/src/components/forms/CampaignForm/index.tsx`, `apps/admin-portal/src/components/forms/product-category.form.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/page.tsx`, `apps/admin-portal/src/components/forms/product-catalog/package.form.tsx`, `apps/admin-portal/src/components/forms/product-catalog/benefit.form.tsx`, `apps/admin-portal/src/components/forms/SourceForm/index.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/import/page.tsx`, `apps/admin-portal/src/components/forms/PartnerManagementForm/index.tsx`, `apps/admin-portal/src/components/forms/SanctionForm/index.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/export/page.tsx`, `apps/admin-portal/src/components/forms/RoleForm/index.tsx`, `apps/admin-portal/src/components/forms/PartnerCommForm/index.tsx`, `apps/admin-portal/src/components/forms/ProductForm/index.tsx`, `apps/admin-portal/src/app/finance/billing/add/page.tsx`, `apps/admin-portal/src/components/forms/HolidayDateForm/index.tsx`, `apps/admin-portal/src/components/forms/PageManagementForm/index.tsx`, `apps/admin-portal/src/components/forms/ProductCategoryForm/index.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/page.tsx`, `apps/admin-portal/src/components/forms/GroupForm/index.tsx`, `apps/admin-portal/src/components/forms/InsuranceForm/index.tsx`, `apps/admin-portal/src/components/forms/EmailTemplateForm/index.tsx`, `apps/admin-portal/src/components/forms/HospitalUploadForm/index.tsx`]
- Local file deleted: [`apps/admin-portal/src/components/ui/breadcrumb.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: [`apps/admin-portal/src/components/ui/PageHeader/PageHeaderShell.tsx` - the back affordance still uses a clickable `<div>` without button semantics or keyboard support; revisit in a later accessibility pass]

## Batch 8 / Batch 4 - Breadcrumb - 2026-03-27 - FOLLOW-UP

- Reason: `Internal breadcrumb navigation normalized to Next.js client navigation by replacing shared `BreadcrumbLink href=...` usage with `BreadcrumbLink asChild` + `<Link href=...>` at app usage sites.`
- Usage sites updated: [`apps/admin-portal/src/components/ui/PageHeader/PageHeaderShell.tsx`, `apps/admin-portal/src/app/transaction/list/import/import/page.tsx`, `apps/admin-portal/src/app/sanction/list/upload/page.tsx`, `apps/admin-portal/src/app/transaction/list/detail/[id]/page.tsx`, `apps/admin-portal/src/app/transaction/list/add/page.tsx`, `apps/admin-portal/src/components/forms/SourceForm/index.tsx`, `apps/admin-portal/src/components/forms/SanctionForm/index.tsx`, `apps/admin-portal/src/components/forms/ProductCategoryForm/index.tsx`, `apps/admin-portal/src/components/forms/BrokerFeeForm/index.tsx`, `apps/admin-portal/src/components/forms/PartnerCommForm/index.tsx`, `apps/admin-portal/src/components/forms/InsuranceForm/index.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/page.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/import/page.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/export/page.tsx`, `apps/admin-portal/src/app/finance/billing/add/page.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`

## Batch 8 / Batch 4 - DateRangePicker - 2026-03-27 - BLOCKED

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Blocker: `API compatibility unclear`
- Evidence checked: [`packages/ui/src/index.ts` export for `DateRangePicker`, `packages/ui/src/DateRangePicker/DateRangePicker.spec.md`, `packages/ui/docs/normalization/_output/21-adapter-mapping.md` DateRangePicker guidance, `packages/ui/src/DateRangePicker/DateRangePicker.tsx` controlled `value` / `onChange` behavior, `apps/admin-portal/src/components/ui/date-range-picker.tsx`, `apps/admin-portal/src/app/dashboard/transaction/page.tsx`, `apps/admin-portal/src/app/dashboard/policy/page.tsx`, `apps/admin-portal/src/app/dashboard/claim/page.tsx`, `apps/admin-portal/src/hooks/useTransactionDashboard.hooks.tsx`, `apps/admin-portal/src/hooks/usePolicyDashboard.hooks.tsx`, `apps/admin-portal/src/hooks/useClaimDashboard.hooks.tsx`]
- Files changed: `none`
- Next required upstream action: `Publish approved adapter guidance or extend the shared DateRangePicker contract so the admin-portal dashboard picker can preserve its current initial rendered range and completed-range-only commit behavior without introducing stateful app-local adapter logic.`

## Batch 8 / Batch 4 - DateRangePicker - 2026-03-27

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `DateRangePicker`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: [`apps/admin-portal/src/app/dashboard/transaction/page.tsx`, `apps/admin-portal/src/app/dashboard/policy/page.tsx`, `apps/admin-portal/src/app/dashboard/claim/page.tsx`]
- Local file deleted: [`apps/admin-portal/src/components/ui/date-range-picker.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: `None`

## Batch 8 / Batch 4 - Select - 2026-03-27 - BLOCKED

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Blocker: `API compatibility unclear`
- Evidence checked: [`packages/ui/src/index.ts` export for `Select`, `packages/ui/src/Select/Select.spec.md`, `packages/ui/docs/normalization/_output/21-adapter-mapping.md` Select guidance, `packages/ui/src/Select/Select.tsx`, `apps/admin-portal/src/components/ui/select.tsx`, representative admin-portal usage sites importing `Select`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectTrigger`, and `SelectValue` from `@/components/ui/select`]
- Files changed: `none`
- Next required upstream action: `Publish approved adapter guidance or align the shared Select contract with the app's legacy compound export surface; the current shared implementation is a flat prop-driven API, so the replacement path for existing compound Select usage is not yet clear.`

## Batch 8 / Batch 4 - Select - 2026-03-27

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Select`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: [`apps/admin-portal/src/app/policy/pending-renewals/page.tsx`, `apps/admin-portal/src/app/transaction/list/page.tsx`, `apps/admin-portal/src/app/policy/list/page.tsx`, `apps/admin-portal/src/app/membership/list/upload/page.tsx`, `apps/admin-portal/src/app/membership/list/page.tsx`, `apps/admin-portal/src/components/ui/select-phone-code.tsx`, `apps/admin-portal/src/app/policy/endorsement/list/upload/page.tsx`, `apps/admin-portal/src/app/transaction/list/add/page.tsx`, `apps/admin-portal/src/app/policy/list/import/page.tsx`, `apps/admin-portal/src/app/report/claim/page.tsx`, `apps/admin-portal/src/app/report/campaign-analytics/page.tsx`, `apps/admin-portal/src/app/report/campaign/page.tsx`, `apps/admin-portal/src/components/forms/EmailTemplateForm/index.tsx`, `apps/admin-portal/src/components/forms/EmailTagForm/index.tsx`, `apps/admin-portal/src/components/forms/CurrencyForm/index.tsx`, `apps/admin-portal/src/app/masterdata/user/page.tsx`, `apps/admin-portal/src/components/forms/ChannelForm/index.tsx`, `apps/admin-portal/src/components/forms/CampaignForm/index.tsx`, `apps/admin-portal/src/components/forms/BrokerFeeForm/index.tsx`, `apps/admin-portal/src/components/tableConfig/claimTableConfig.tsx`, `apps/admin-portal/src/app/product-category/[category]/page.tsx`, `apps/admin-portal/src/components/forms/product-catalog/package.form.tsx`, `apps/admin-portal/src/components/forms/PartnerManagementForm/index.tsx`, `apps/admin-portal/src/components/forms/PartnerCommForm/index.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/upload-detail/page.tsx`, `apps/admin-portal/src/components/forms/HolidayDateForm/index.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/page.tsx`, `apps/admin-portal/src/components/forms/SanctionForm/index.tsx`, `apps/admin-portal/src/components/forms/RoleForm/index.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/detail-list.tsx`, `apps/admin-portal/src/components/forms/ProductForm/index.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/channel-add-modal.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/add-channel-modal.tsx`, `apps/admin-portal/src/components/forms/SourceForm/index.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/add-insurer-modal.tsx`, `apps/admin-portal/src/app/product-category/[category]/add/page.tsx`, `apps/admin-portal/src/app/product-category/page.tsx`, `apps/admin-portal/src/app/masterdata/holiday-date/page.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/user-form.tsx`, `apps/admin-portal/src/app/finance/partner-comm/page.tsx`, `apps/admin-portal/src/app/export-users/page.tsx`, `apps/admin-portal/src/app/dashboard/transaction/page.tsx`, `apps/admin-portal/src/app/finance/billing/page.tsx`, `apps/admin-portal/src/app/dashboard/policy/page.tsx`, `apps/admin-portal/src/app/dashboard/claim/page.tsx`, `apps/admin-portal/src/app/claim/list/page.tsx`, `apps/admin-portal/src/app/finance/billing/add/page.tsx`, `apps/admin-portal/src/app/claim/list/import-with-preview/page.tsx`, `apps/admin-portal/src/app/claim/history/page.tsx`]
- Local file deleted: [`apps/admin-portal/src/components/ui/select.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: `None`

## Batch 8 / Batch 4 - UploadFile - 2026-03-27 - BLOCKED

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Blocker: `API compatibility unclear`
- Evidence checked: [`packages/ui/src/index.ts` export for `FileUpload`, `packages/ui/src/FileUpload/FileUpload.spec.md`, `packages/ui/docs/normalization/_output/21-adapter-mapping.md` FileUpload guidance, `packages/ui/src/FileUpload/FileUpload.tsx`, `apps/admin-portal/src/components/ui/Fields/UploadFile/index.tsx`, `apps/admin-portal/src/app/claim/list/detail/[id]/upload-data/page.tsx` usage with filename-string `value` data and `onFileChange({ file, base64, fileName })` callbacks]
- Files changed: `none`
- Next required upstream action: `Publish approved adapter guidance or extend the shared FileUpload contract so admin-portal can preserve existing filename-string display state and the current file/base64/fileName callback behavior without introducing non-trivial app-local adapter logic.`

## Batch 8 / Batch 4 - UploadFile - 2026-03-28

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `FileUpload`
- Migration mode: `adapter`
- Adapter file: `apps/admin-portal/src/components/ui/FileUpload.tsx`
- Usage sites updated: [`apps/admin-portal/src/app/claim/list/detail/[id]/upload-data/page.tsx`]
- Local file deleted: [`apps/admin-portal/src/components/ui/Fields/UploadFile/index.tsx`]
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: [`packages/ui/src/FileUpload/FileUpload.tsx` - if manual parity review flags the shared dropzone copy as too different from the legacy placeholder-only affordance, consider an upstream idle-copy customization hook that keeps the shared accessibility contract intact without reintroducing app-local file-input shells`]

## Batch 8 / Batch 4 - Button - 2026-03-28

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Shared export used: `Button`
- Migration mode: `direct`
- Adapter file: `none`
- Usage sites updated: [`apps/admin-portal/src/app/claim/list/detail/[id]/page.tsx`, `apps/admin-portal/src/app/claim/list/detail/[id]/upload-data/page.tsx`, `apps/admin-portal/src/app/claim/list/export/page.tsx`, `apps/admin-portal/src/app/claim/list/import-with-preview/page.tsx`, `apps/admin-portal/src/app/claim/list/import/page.tsx`, `apps/admin-portal/src/app/claim/list/page.tsx`, `apps/admin-portal/src/app/export-users/page.tsx`, `apps/admin-portal/src/app/finance/billing/add/page.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/components/BillingDetailActions.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/export/page.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/import/page.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/invoice/page.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/page.tsx`, `apps/admin-portal/src/app/finance/billing/page.tsx`, `apps/admin-portal/src/app/finance/broker-fee/page.tsx`, `apps/admin-portal/src/app/finance/partner-comm/page.tsx`, `apps/admin-portal/src/app/masterdata/channel/page.tsx`, `apps/admin-portal/src/app/masterdata/currency/page.tsx`, `apps/admin-portal/src/app/masterdata/email-tag/page.tsx`, `apps/admin-portal/src/app/masterdata/email-template/page.tsx`, `apps/admin-portal/src/app/masterdata/email-template/tag/add/page.tsx`, `apps/admin-portal/src/app/masterdata/email-template/tag/page.tsx`, `apps/admin-portal/src/app/masterdata/group/page.tsx`, `apps/admin-portal/src/app/masterdata/holiday-date/page.tsx`, `apps/admin-portal/src/app/masterdata/hospital/page.tsx`, `apps/admin-portal/src/app/masterdata/insurance/page.tsx`, `apps/admin-portal/src/app/masterdata/page-management/page.tsx`, `apps/admin-portal/src/app/masterdata/partner-management/detail/[id]/assign-plan.tsx`, `apps/admin-portal/src/app/masterdata/partner-management/page.tsx`, `apps/admin-portal/src/app/masterdata/product-category/page.tsx`, `apps/admin-portal/src/app/masterdata/product/page.tsx`, `apps/admin-portal/src/app/masterdata/role/page.tsx`, `apps/admin-portal/src/app/masterdata/user/page.tsx`, `apps/admin-portal/src/app/membership/list/export/page.tsx`, `apps/admin-portal/src/app/membership/list/page.tsx`, `apps/admin-portal/src/app/membership/list/upload/page.tsx`, `apps/admin-portal/src/app/policy/endorsement/list/detail/[id]/page.tsx`, `apps/admin-portal/src/app/policy/endorsement/list/detail/[id]/upload/page.tsx`, `apps/admin-portal/src/app/policy/endorsement/list/export/page.tsx`, `apps/admin-portal/src/app/policy/endorsement/list/page.tsx`, `apps/admin-portal/src/app/policy/endorsement/list/upload/page.tsx`, `apps/admin-portal/src/app/policy/list/detail/[id]/page.tsx`, `apps/admin-portal/src/app/policy/list/export/page.tsx`, `apps/admin-portal/src/app/policy/list/import/page.tsx`, `apps/admin-portal/src/app/policy/list/page.tsx`, `apps/admin-portal/src/app/product-category/[category]/add/page.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/benefit-list.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/channel-add-modal.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/channel-list.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/detail-list.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/package-list.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/upload-benefit/page.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/upload-detail/page.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/upload/page.tsx`, `apps/admin-portal/src/app/product-category/[category]/page.tsx`, `apps/admin-portal/src/app/product-category/page.tsx`, `apps/admin-portal/src/app/promotion/campaign/page.tsx`, `apps/admin-portal/src/app/report/campaign-analytics/page.tsx`, `apps/admin-portal/src/app/report/campaign/page.tsx`, `apps/admin-portal/src/app/report/claim/page.tsx`, `apps/admin-portal/src/app/sanction/list/page.tsx`, `apps/admin-portal/src/app/source/list/page.tsx`, `apps/admin-portal/src/app/transaction/list/add/page.tsx`, `apps/admin-portal/src/app/transaction/list/detail/[id]/page.tsx`, `apps/admin-portal/src/app/transaction/list/export/page.tsx`, `apps/admin-portal/src/app/transaction/list/import/import/page.tsx`, `apps/admin-portal/src/app/transaction/list/page.tsx`, `apps/admin-portal/src/components/forms/ChannelForm/index.tsx`, `apps/admin-portal/src/components/forms/CurrencyForm/index.tsx`, `apps/admin-portal/src/components/forms/EmailTagForm/index.tsx`, `apps/admin-portal/src/components/forms/EmailTemplateForm/index.tsx`, `apps/admin-portal/src/components/forms/GroupForm/index.tsx`, `apps/admin-portal/src/components/forms/HolidayDateForm/index.tsx`, `apps/admin-portal/src/components/forms/HospitalUploadForm/index.tsx`, `apps/admin-portal/src/components/forms/InsuranceForm/index.tsx`, `apps/admin-portal/src/components/forms/PageManagementForm/index.tsx`, `apps/admin-portal/src/components/forms/PartnerManagementForm/index.tsx`, `apps/admin-portal/src/components/forms/ProductForm/index.tsx`, `apps/admin-portal/src/components/forms/RoleForm/index.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/add-channel-modal.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/add-insurer-modal.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/user-channels.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/user-form.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/user-groups.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/user-insurers.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/user-roles.tsx`, `apps/admin-portal/src/components/forms/UserForm/index.tsx`, `apps/admin-portal/src/components/forms/product-catalog/benefit.form.tsx`, `apps/admin-portal/src/components/forms/product-catalog/field-array-input.tsx`, `apps/admin-portal/src/components/forms/product-catalog/package.form.tsx`, `apps/admin-portal/src/components/forms/product-category.form.tsx`, `apps/admin-portal/src/components/tableConfig/billingTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/brokerFeeTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/campaignTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/channelTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/claimHistoryTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/claimTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/currencyTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/emailTagTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/emailTemplateTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/endorsementTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/groupTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/holidayDateTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/insuranceTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/membershipTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/packageTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/pageManagementTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/partnerCommTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/partnerManagmentTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/policyTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/productCatalogTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/productCategoryTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/productTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/roleTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/sanctionTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/sourceTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/transactionTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/usersTableConfig.tsx`, `apps/admin-portal/src/components/ui/DataTable/index.tsx`]
- Local file deleted: `apps/admin-portal/src/components/ui/button.tsx`
- Typecheck: PASS
- Lint: PASS
- Build: PASS
- Smoke routes: `SKIPPED - manual verification pending`
- Parity notes: `manual verification pending`
- Post-Migration Improvement Candidates: [`packages/ui/src/Button/Button.types.ts` - consider adding a documented icon-only shared sizing recipe so dense action-table consumers do not need local square-width normalization during future Button migrations`]

## Batch 8 / Batch 4 - DataTable - 2026-03-28 - BLOCKED

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Blocker: `API compatibility unclear`
- Evidence checked: [`packages/ui/src/index.ts` export for `DataTable`, `packages/ui/src/DataTable/DataTable.spec.md`, `packages/ui/docs/normalization/_output/21-adapter-mapping.md` DataTable guidance, `packages/ui/src/DataTable/DataTable.tsx`, `packages/ui/src/DataTable/DataTable.renderers.tsx`, `apps/admin-portal/src/components/ui/DataTable/index.tsx`, `apps/admin-portal/src/app/claim/list/page.tsx` usage of `getRowClassName`, `apps/admin-portal/src/app/finance/unmatch-billing/page.tsx` usage of `classNameHeading`, representative admin-portal table config files using `className` / `classNameHeading` cell and header styling hooks]
- Files changed: `none`
- Next required upstream action: `Publish approved adapter guidance or extend the shared DataTable contract with documented row-level and column header/cell class hooks that a thin adapter can target; without those surfaces, admin-portal cannot preserve existing row state highlighting and header/cell styling parity safely.`

## Batch 8 / Batch 4 - OptimizeImageShell - 2026-03-29 - BLOCKED

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Blocker: `export missing`
- Evidence checked: [`apps/admin-portal/docs/migration/component/_output/_audit-report.md` entry for `OptimizeImageShell`, `apps/admin-portal/src/components/ui/OptimizeImageShell.tsx`, `apps/admin-portal/src/components/ui/image.tsx`, `packages/ui/src/index.ts`, `packages/ui/src/Image/Image.spec.md`, `packages/ui/src/Image/Image.tsx`, `packages/ui/docs/normalization/_output/21-adapter-mapping.md` Image guidance]
- Files changed: `none`
- Next required upstream action: `Publish an approved shared replacement path for the audit-named OptimizeImageShell component. Either export/spec an app-agnostic shared shell that preserves the current render-prop + next/image container split, or reconcile the audit target to shared Image with explicit adapter guidance for keeping next/image optimization local without changing the admin-portal Image container contract.`

## Batch 8 / Batch 4 - OptimizeImageShell - 2026-03-29 - CORRECTION

- Decision: `Remove OptimizeImageShell from the Batch 4 / shared-ui queue.`
- Rationale: `OptimizeImageShell` is not intended to be a standalone shared-ui target; it is a thin app-local render-prop shell that exists only to preserve the local `next/image` container split and optimization concerns.
- Output docs updated: [`_audit-report.md`, `_component-backlog.csv`, `_per-app-baseline-summary.md`, `_parity-checklist.md`]
- Queue impact: `Both OptimizeImageShell entries are reclassified to KEEP_APP_LOCAL (Batch 1.5), and the prior 2026-03-29 BLOCKED entry should be treated as superseded by this queue correction rather than as an upstream dependency.`
- Next action: `Do not select OptimizeImageShell for future Batch 8 / Batch 4 runs in admin-portal.`

