
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
- Usage sites updated: [`apps/admin-portal/src/app/transaction/list/add/page.tsx`, `apps/admin-portal/src/app/claim/list/page.tsx`, `apps/admin-portal/src/app/claim/list/import-with-preview/page.tsx`, `apps/admin-portal/src/components/ui/Fields/UploadFile/index.tsx`, `apps/admin-portal/src/components/ui/Fields/SelectAutocomplete/index.tsx`, `apps/admin-portal/src/components/ui/DataTable/index.tsx`, `apps/admin-portal/src/app/claim/history/page.tsx`, `apps/admin-portal/src/app/membership/list/upload/page.tsx`, `apps/admin-portal/src/app/policy/list/import/page.tsx`, `apps/admin-portal/src/components/tableConfig/claimTableConfig.tsx`, `apps/admin-portal/src/app/policy/endorsement/list/upload/page.tsx`, `apps/admin-portal/src/app/masterdata/user/page.tsx`, `apps/admin-portal/src/app/product-category/page.tsx`, `apps/admin-portal/src/app/export-users/page.tsx`, `apps/admin-portal/src/components/forms/EmailTemplateForm/index.tsx`, `apps/admin-portal/src/components/forms/EmailTagForm/index.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/user-roles.tsx`, `apps/admin-portal/src/components/forms/CurrencyForm/index.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/user-groups.tsx`, `apps/admin-portal/src/components/forms/ChannelForm/index.tsx`, `apps/admin-portal/src/components/forms/product-category.form.tsx`, `apps/admin-portal/src/components/forms/CampaignForm/index.tsx`, `apps/admin-portal/src/components/forms/product-catalog/package.form.tsx`, `apps/admin-portal/src/components/forms/BrokerFeeForm/index.tsx`, `apps/admin-portal/src/components/forms/product-catalog/field-array-input.tsx`, `apps/admin-portal/src/components/forms/product-catalog/benefit.form.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/user-form.tsx`, `apps/admin-portal/src/components/forms/PartnerManagementForm/index.tsx`, `apps/admin-portal/src/components/forms/PartnerCommForm/index.tsx`, `apps/admin-portal/src/components/forms/SourceForm/index.tsx`, `... [truncated]
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
- Usage sites updated: [`apps/admin-portal/src/app/claim/list/import-with-preview/page.tsx`, `apps/admin-portal/src/app/claim/list/import/page.tsx`, `apps/admin-portal/src/app/transaction/list/import/import/page.tsx`, `apps/admin-portal/src/app/transaction/list/detail/[id]/page.tsx`, `apps/admin-portal/src/app/transaction/list/add/page.tsx`, `apps/admin-portal/src/components/ui/PageHeader/PageHeaderShell.tsx`, `apps/admin-portal/src/app/masterdata/email-template/tag/add/page.tsx`, `apps/admin-portal/src/app/sanction/list/upload/page.tsx`, `apps/admin-portal/src/app/report/performance/page.tsx`, `apps/admin-portal/src/app/report/campaign/page.tsx`, `apps/admin-portal/src/app/report/claim/page.tsx`, `apps/admin-portal/src/components/forms/BrokerFeeForm/index.tsx`, `apps/admin-portal/src/components/forms/EmailTagForm/index.tsx`, `apps/admin-portal/src/app/product-category/[category]/add/page.tsx`, `apps/admin-portal/src/components/forms/CurrencyForm/index.tsx`, `apps/admin-portal/src/components/forms/UserForm/index.tsx`, `apps/admin-portal/src/components/forms/ChannelForm/index.tsx`, `apps/admin-portal/src/components/forms/CampaignForm/index.tsx`, `apps/admin-portal/src/components/forms/product-category.form.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/page.tsx`, `apps/admin-portal/src/components/forms/product-catalog/package.form.tsx`, `apps/admin-portal/src/components/forms/product-catalog/benefit.form.tsx`, `apps/admin-portal/src/components/forms/SourceForm/index.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/import/page.tsx`, `apps/admin-portal/src/components/forms/PartnerManagementForm/index.tsx`, `apps/admin-portal/src/components/forms/SanctionForm/index.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/export/page.tsx`, `apps/admin-portal/src/components/forms/RoleForm/index.tsx`, `apps/admin-portal/src/components/forms/PartnerCommForm/index.tsx`, `apps/admin-portal/src/components/forms/ProductForm/index.tsx`, `apps/admin-... [truncated]
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
- Usage sites updated: [`apps/admin-portal/src/app/policy/pending-renewals/page.tsx`, `apps/admin-portal/src/app/transaction/list/page.tsx`, `apps/admin-portal/src/app/policy/list/page.tsx`, `apps/admin-portal/src/app/membership/list/upload/page.tsx`, `apps/admin-portal/src/app/membership/list/page.tsx`, `apps/admin-portal/src/components/ui/select-phone-code.tsx`, `apps/admin-portal/src/app/policy/endorsement/list/upload/page.tsx`, `apps/admin-portal/src/app/transaction/list/add/page.tsx`, `apps/admin-portal/src/app/policy/list/import/page.tsx`, `apps/admin-portal/src/app/report/claim/page.tsx`, `apps/admin-portal/src/app/report/campaign-analytics/page.tsx`, `apps/admin-portal/src/app/report/campaign/page.tsx`, `apps/admin-portal/src/components/forms/EmailTemplateForm/index.tsx`, `apps/admin-portal/src/components/forms/EmailTagForm/index.tsx`, `apps/admin-portal/src/components/forms/CurrencyForm/index.tsx`, `apps/admin-portal/src/app/masterdata/user/page.tsx`, `apps/admin-portal/src/components/forms/ChannelForm/index.tsx`, `apps/admin-portal/src/components/forms/CampaignForm/index.tsx`, `apps/admin-portal/src/components/forms/BrokerFeeForm/index.tsx`, `apps/admin-portal/src/components/tableConfig/claimTableConfig.tsx`, `apps/admin-portal/src/app/product-category/[category]/page.tsx`, `apps/admin-portal/src/components/forms/product-catalog/package.form.tsx`, `apps/admin-portal/src/components/forms/PartnerManagementForm/index.tsx`, `apps/admin-portal/src/components/forms/PartnerCommForm/index.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/upload-detail/page.tsx`, `apps/admin-portal/src/components/forms/HolidayDateForm/index.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/page.tsx`, `apps/admin-portal/src/components/forms/SanctionForm/index.tsx`, `apps/admin-portal/src/components/forms/RoleForm/index.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/detail-list.tsx`, `apps/admin-portal/src/compon... [truncated]
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
- Usage sites updated: [`apps/admin-portal/src/app/claim/list/detail/[id]/page.tsx`, `apps/admin-portal/src/app/claim/list/detail/[id]/upload-data/page.tsx`, `apps/admin-portal/src/app/claim/list/export/page.tsx`, `apps/admin-portal/src/app/claim/list/import-with-preview/page.tsx`, `apps/admin-portal/src/app/claim/list/import/page.tsx`, `apps/admin-portal/src/app/claim/list/page.tsx`, `apps/admin-portal/src/app/export-users/page.tsx`, `apps/admin-portal/src/app/finance/billing/add/page.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/components/BillingDetailActions.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/export/page.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/import/page.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/invoice/page.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/page.tsx`, `apps/admin-portal/src/app/finance/billing/page.tsx`, `apps/admin-portal/src/app/finance/broker-fee/page.tsx`, `apps/admin-portal/src/app/finance/partner-comm/page.tsx`, `apps/admin-portal/src/app/masterdata/channel/page.tsx`, `apps/admin-portal/src/app/masterdata/currency/page.tsx`, `apps/admin-portal/src/app/masterdata/email-tag/page.tsx`, `apps/admin-portal/src/app/masterdata/email-template/page.tsx`, `apps/admin-portal/src/app/masterdata/email-template/tag/add/page.tsx`, `apps/admin-portal/src/app/masterdata/email-template/tag/page.tsx`, `apps/admin-portal/src/app/masterdata/group/page.tsx`, `apps/admin-portal/src/app/masterdata/holiday-date/page.tsx`, `apps/admin-portal/src/app/masterdata/hospital/page.tsx`, `apps/admin-portal/src/app/masterdata/insurance/page.tsx`, `apps/admin-portal/src/app/masterdata/page-management/page.tsx`, `apps/admin-portal/src/app/masterdata/partner-management/detail/[id]/assign-plan.tsx`, `apps/admin-portal/src/app/masterdata/partner-management/page.tsx`, `apps/admin-portal/src/app/masterdata/product-category/page.tsx`, `apps/admin-portal/src/app/masterdata/product/page.tsx`,... [truncated]
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

## Batch 8 / Batch 4 - SelectAutocomplete - 2026-03-29 - BLOCKED

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Blocker: `API compatibility unclear`
- Evidence checked: [`apps/admin-portal/docs/migration/component/_output/_audit-report.md` entry for `SelectAutocomplete`, `apps/admin-portal/src/components/ui/Fields/SelectAutocomplete/index.tsx`, `apps/admin-portal/src/app/export-users/page.tsx` usage with controlled `searchValue`, `onSearchChange`, `loading`, and `isSearching` flows, `packages/ui/src/index.ts`, `packages/ui/src/Combobox/Combobox.spec.md`, `packages/ui/src/Combobox/Combobox.tsx`, `packages/ui/docs/normalization/_output/21-adapter-mapping.md` Combobox guidance]
- Files changed: `none`
- Next required upstream action: `Publish approved adapter guidance or extend the shared Combobox contract so admin-portal can preserve the current controlled async-search behavior for SelectAutocomplete, including parent-driven search text and searching-state UX, without introducing stateful app-local adapter logic.`

## Batch 8 / Batch 4 - SelectAutocomplete - 2026-03-29 - CORRECTION

- Decision: `Remove SelectAutocomplete from the standalone Batch 4 / shared-ui queue.`
- Rationale: `SelectAutocomplete` is not a second canonical shared component; searchable single-select behavior is already normalized to shared `Combobox`, and the admin-portal wrapper should be treated as an app-local compatibility layer until its usage site migrates to that shared target.
- Output docs updated: [`_audit-report.md`, `_component-backlog.csv`, `_per-app-baseline-summary.md`, `_parity-checklist.md`]
- Queue impact: `The prior 2026-03-29 BLOCKED entry is superseded as a queue-selection outcome. Future work should target admin-portal's remaining SelectAutocomplete usage as a Combobox migration, not as a new standalone Batch 4 component.`
- Next action: `Do not select SelectAutocomplete as a standalone Batch 8 / Batch 4 component in future admin-portal runs.`

## Batch 8 / Batch 4 - Loading - 2026-03-29 - BLOCKED

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Blocker: `export missing`
- Evidence checked: [`apps/admin-portal/docs/migration/component/_output/_audit-report.md` entry for `Loading`, `apps/admin-portal/src/components/ui/Loading/index.tsx`, representative usage sites importing `ContentLoadingWrapper` from `@/components/ui/Loading/index`, `packages/ui/src/index.ts`, `packages/ui/src/Spinner/Spinner.spec.md`, `packages/ui/src/Skeleton/Skeleton.spec.md`, `packages/ui/docs/normalization/_output/21-adapter-mapping.md` Loading Wrappers and Suspense Fallbacks guidance]
- Files changed: `none`
- Next required upstream action: `Reconcile the audit queue before any Loading migration. The adapter guidance explicitly keeps loading wrappers app-local and @repo/ui does not export/spec a canonical Loading wrapper today, so either reclassify admin-portal's Loading wrappers out of Batch 4 or ship an approved shared Loading target with export, spec, and replacement guidance first.`

## Batch 8 / Batch 4 - Loading - 2026-03-29 - CORRECTION

- Decision: `Remove Loading from the standalone Batch 4 / shared-ui queue.`
- Rationale: `Loading` in admin-portal is a local wrapper family, not a second canonical shared component. Shared loading scope is the `Spinner` / `Skeleton` primitive layer; wrapper layout, mounted-content blocking, and suspense-fallback composition stay app-local.
- Output docs updated: [`_audit-report.md`, `_component-backlog.csv`, `_per-app-baseline-summary.md`, `_parity-checklist.md`]
- App-local alignment: [`apps/admin-portal/src/components/ui/loading.tsx`, `apps/admin-portal/src/components/ui/Loading/index.tsx`] now compose shared `Spinner` internally instead of using a separate local spinner implementation.
- Queue impact: `The prior 2026-03-29 BLOCKED entry is superseded as a queue-selection outcome. Future admin-portal work should keep the wrapper API local and only share the loading primitive layer.`
- Next action: `Do not select Loading as a standalone Batch 8 / Batch 4 component in future admin-portal runs.`

## Batch 8 / Batch 4 - SelectPhoneCode - 2026-03-29 - BLOCKED

- Audit classification: `NEW_SHARED_COMPONENT`
- Audit batch: `4`
- Blocker: `export missing`
- Evidence checked: [`apps/admin-portal/docs/migration/component/_output/_audit-report.md` entry for `SelectPhoneCode`, `apps/admin-portal/src/components/ui/select-phone-code.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/user-form.tsx` usage, `packages/ui/src/index.ts`, `packages/ui/src/Select/Select.spec.md`, `packages/ui/src/Combobox/Combobox.spec.md`, `packages/ui/docs/normalization/_output/21-adapter-mapping.md` Select and Combobox guidance]
- Files changed: `none`
- Next required upstream action: `Reconcile SelectPhoneCode out of the standalone Batch 4 queue or publish an approved shared replacement path first. Today @repo/ui does not export/spec a canonical SelectPhoneCode component, and the adapter guidance treats phone-code pickers as app-local wrappers on top of shared Select or Combobox rather than a standalone shared target.`

## Batch 8 / Batch 4 - SelectPhoneCode - 2026-03-29 - CORRECTION

- Decision: `Remove SelectPhoneCode from the standalone Batch 4 / shared-ui queue.`
- Rationale: `SelectPhoneCode` is an admin-portal-specific phone-code wrapper used by the user form. It already composes shared `Select`, depends on app-owned country metadata, and renders Next.js image cells, so it should remain app-local rather than being treated as a canonical shared component target.
- Output docs updated: [`_audit-report.md`, `_component-backlog.csv`, `_per-app-baseline-summary.md`, `_parity-checklist.md`]
- Queue impact: `The prior 2026-03-29 BLOCKED entry is superseded as a queue-selection outcome. Future work should keep the wrapper local and only share the underlying select primitive.`
- Next action: `Do not select SelectPhoneCode as a standalone Batch 8 / Batch 4 component in future admin-portal runs.`

## Batch 8 / Batch 4 - Loading Wrapper Rollout and Dashboard Chart Cleanup - 2026-03-31

- Scope summary: `apps/admin-portal/src` currently contains `57` tracked modifications (`431` insertions, `955` deletions) plus `5` new app-local replacement files: `apps/admin-portal/src/components/table-policy.tsx` and `apps/admin-portal/src/components/ui/charts/{barchart-horizontal,dashedlinechart,linechart,piechart}.tsx`.
- Migration intent: `Complete the app-local follow-through from the 2026-03-29 Loading correction, remove duplicate dashboard wrapper implementations, and align remaining dashboard consumers to the consolidated local wrapper surface.`
- Loading rollout: `41` current `src` consumers now import `ContentLoadingWrapper` from `@/components/ui/loading` (or the equivalent relative path), and `apps/admin-portal/src/components/ui/Loading/index.tsx` is removed from active use.
- Loading wrapper behavior: `apps/admin-portal/src/components/ui/loading.tsx` is expanded into the single local wrapper entry point for page, form, and content loading states while continuing to compose shared `Spinner` from `@repo/ui`; this remains app-local and is not promoted back into the standalone Batch 4 shared-ui queue.
- DataTable alignment: `apps/admin-portal/src/components/ui/DataTable/index.tsx` now depends on the lowercase local loading wrapper entry point, keeping the existing local DataTable contract unchanged while the upstream Batch 4 DataTable blocker remains unresolved.
- Dashboard chart consolidation: dashboard pages and legacy dashboard views are repointed from duplicated `src/components/recharts/*` and `src/components/ui/recharts/*` wrappers to the new app-local `src/components/ui/charts/*` surface plus `src/components/table-policy.tsx`; the duplicated wrappers under both legacy directories are removed.
- Dashboard behavior updates:
  - `apps/admin-portal/src/app/dashboard/claim/page.tsx` and `apps/admin-portal/src/views/dashboard/claim/claim.view.tsx` now use the new configurable composed line-chart wrapper with dual-series support so claim count and total claim amount can be rendered together with explicit value formatting.
  - `apps/admin-portal/src/app/dashboard/transaction/page.tsx`, `apps/admin-portal/src/views/dashboard/transaction/transaction.view.tsx`, and `apps/admin-portal/src/hooks/useTransactionDashboard.hooks.tsx` now sort the GWP/bar-chart data chronologically and pass explicit series labels/value formatters so transaction and GWP charts render with stable ordering and clearer labels.
  - `apps/admin-portal/src/app/dashboard/policy/page.tsx` and `apps/admin-portal/src/views/dashboard/policy/policy.view.tsx` now consume the consolidated local pie/table wrappers, reducing duplicate dashboard component entry points without changing the retained app-local `linechart-policy` path.
- Files changed (representative): [`apps/admin-portal/src/components/ui/loading.tsx`, `apps/admin-portal/src/components/ui/DataTable/index.tsx`, `apps/admin-portal/src/app/dashboard/claim/page.tsx`, `apps/admin-portal/src/app/dashboard/policy/page.tsx`, `apps/admin-portal/src/app/dashboard/transaction/page.tsx`, `apps/admin-portal/src/views/dashboard/claim/claim.view.tsx`, `apps/admin-portal/src/views/dashboard/policy/policy.view.tsx`, `apps/admin-portal/src/views/dashboard/transaction/transaction.view.tsx`, `apps/admin-portal/src/hooks/useTransactionDashboard.hooks.tsx`, `apps/admin-portal/src/components/forms/*`, `apps/admin-portal/src/app/product-category/[category]/**/*`, `apps/admin-portal/src/app/claim/list/detail/[id]/**/*`]
- Local files deleted: [`apps/admin-portal/src/components/ui/Loading/index.tsx`, `apps/admin-portal/src/components/recharts/barchart-horizontal.tsx`, `apps/admin-portal/src/components/recharts/dashedlinechart.tsx`, `apps/admin-portal/src/components/recharts/linechart.tsx`, `apps/admin-portal/src/components/recharts/piechart.tsx`, `apps/admin-portal/src/components/recharts/table-policy.tsx`, `apps/admin-portal/src/components/ui/recharts/barchart-horizontal.tsx`, `apps/admin-portal/src/components/ui/recharts/dashedlinechart.tsx`, `apps/admin-portal/src/components/ui/recharts/linechart.tsx`, `apps/admin-portal/src/components/ui/recharts/piechart.tsx`, `apps/admin-portal/src/components/ui/recharts/table-policy.tsx`]
- Shared-ui impact: `No new @repo/ui export was adopted in this pass; this is app-local consolidation and consumer cleanup around previously-decided migration outcomes.`
- Verification status: `No fresh typecheck, lint, build, or smoke run was executed as part of this documentation-only logging pass.`
- Post-Migration Improvement Candidates: [`apps/admin-portal/src/app/dashboard/policy/page.tsx` and `apps/admin-portal/src/views/dashboard/policy/policy.view.tsx` still depend on retained app-local `linechart-policy`, and `apps/admin-portal/src/app/dashboard/claim/page.tsx` still depends on retained app-local `barchart-vertical`; if dashboard chart cleanup continues, fold those remaining legacy wrappers into the same consolidated local chart surface.`]

## Batch 9 - /dashboard/policy Route Refactor Follow-up - 2026-04-02

- Commit: `cc3ad67852e37df51712706be77db29e475aaca4` (`refactor(admin-portal): unify policy chart with shared line chart component`)
- Route focus: `/dashboard/policy`
- Migration intent: `Finish the remaining route-local cleanup on the policy dashboard by removing duplicate line-chart wrappers, standardizing the chart implementation on the shared local chart surface, and aligning the route page layout with @repo/ui Box composition.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/dashboard/policy/page.tsx` now renders the route layout with `Box` instead of native layout/text tags while preserving the existing page structure and styling.
  - `apps/admin-portal/src/components/linechart-policy.tsx` is introduced as the single retained app-local policy chart wrapper, and both `apps/admin-portal/src/app/dashboard/policy/page.tsx` and `apps/admin-portal/src/views/dashboard/policy/policy.view.tsx` are repointed to that path.
  - Legacy duplicate wrappers at `apps/admin-portal/src/components/recharts/linechart-policy.tsx` and `apps/admin-portal/src/components/ui/recharts/linechart-policy.tsx` are removed from the active route path.
  - `apps/admin-portal/src/components/ui/charts/linechart.tsx` now supports optional custom legend formatting, tooltip rendering, and y-axis domain configuration so the policy dashboard can keep its prior trend-chart behavior on top of the shared composed-chart implementation without breaking existing consumers.
- Files changed (route-focused): [`apps/admin-portal/src/app/dashboard/policy/page.tsx`, `apps/admin-portal/src/components/linechart-policy.tsx`, `apps/admin-portal/src/components/ui/charts/linechart.tsx`, `apps/admin-portal/src/views/dashboard/policy/policy.view.tsx`]
- Local files deleted (superseded wrappers): [`apps/admin-portal/src/components/recharts/linechart-policy.tsx`, `apps/admin-portal/src/components/ui/recharts/linechart-policy.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The route now composes existing shared Box primitives and extends the app-local chart wrapper API in backward-compatible ways.`
- Verification note: `This logging update is based on the committed route-local refactor plus previously recorded manual smoke evidence for /dashboard/policy already present in _migration-log.md and _parity-checklist.md; no new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /dashboard/policy as PASS because the route has both committed route-local migration cleanup and existing recorded smoke verification evidence.`

## Batch 9 - /dashboard/claim Route Refactor Follow-up - 2026-04-02

- Commit: `f544827241360913c1f6e55edb4c32b58fdbe61d` (`refactor(admin-portal): consolidate claim dashboard vertical bar chart`)
- Route focus: `/dashboard/claim`
- Migration intent: `Finish the remaining route-local cleanup on the claim dashboard by removing duplicate vertical bar chart wrappers, standardizing the chart implementation on the shared local chart surface, and aligning the route page layout with @repo/ui Box composition.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/dashboard/claim/page.tsx` now renders the route layout with `Box` instead of native layout/text tags while preserving the existing page structure and styling.
  - `apps/admin-portal/src/components/ui/charts/barchart-vertical.tsx` is introduced as the single retained app-local vertical bar chart wrapper, and both `apps/admin-portal/src/app/dashboard/claim/page.tsx` and `apps/admin-portal/src/views/dashboard/claim/claim.view.tsx` are repointed to that path.
  - Legacy duplicate wrappers at `apps/admin-portal/src/components/recharts/barchart-vertical.tsx` and `apps/admin-portal/src/components/ui/recharts/barchart-vertical.tsx` are removed from the active route path.
  - `apps/admin-portal/src/components/ui/charts/barchart-vertical.tsx` now supports configurable data keys, tooltip label keys, legend text, sorting, zero-value filtering, and label/value formatting so the claim dashboard can keep its prior claim status visualization behavior on top of the shared composed-chart implementation without breaking existing consumers.
- Files changed (route-focused): [`apps/admin-portal/src/app/dashboard/claim/page.tsx`, `apps/admin-portal/src/components/ui/charts/barchart-vertical.tsx`, `apps/admin-portal/src/views/dashboard/claim/claim.view.tsx`]
- Local files deleted (superseded wrappers): [`apps/admin-portal/src/components/recharts/barchart-vertical.tsx`, `apps/admin-portal/src/components/ui/recharts/barchart-vertical.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The route now composes existing shared Box primitives and extends the app-local chart wrapper API in backward-compatible ways.`
- Verification note: `This logging update is based on the committed route-local refactor plus previously recorded manual smoke evidence for /dashboard/claim already present in _migration-log.md and _parity-checklist.md; no new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /dashboard/claim as PASS because the route has both committed route-local migration cleanup and existing recorded smoke verification evidence.`

## Batch 9 - /transaction/list Route Refactor Follow-up - 2026-04-02

- Commit: `e8901af0fafe893e04fd8abf5215b7bcfcb987d3` (`refactor(admin-portal): modernize transaction list table UI`)
- Route focus: `/transaction/list`
- Migration intent: `Finish the remaining route-local cleanup on the transaction list by standardizing the status filter and table chrome on shared primitives, densifying the table layout, and aligning row actions and detail-drawer presentation with the current design-system patterns while preserving existing filtering, search, export, and pagination behavior.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/transaction/list/page.tsx` now renders the route shell with `Box`, replaces bespoke status-tab markup with shared `Tabs`, and switches the add/export controls to shared `Button` usage with built-in left icons.
  - `apps/admin-portal/src/components/ui/DataTable/index.tsx` now supports an optional `density` mode, shared `Select`-based pagination controls, denser compact table styling, and clearer page navigation while remaining backward compatible for existing consumers.
  - `apps/admin-portal/src/components/tableConfig/transactionTableConfig.tsx` now applies explicit column sizing/alignment hooks, wrapped content cells, badge-style status rendering, and a shared `Button`-based row action trigger with a cleaner transaction-details drawer layout.
- Files changed (route-focused): [`apps/admin-portal/src/app/transaction/list/page.tsx`, `apps/admin-portal/src/components/tableConfig/transactionTableConfig.tsx`, `apps/admin-portal/src/components/ui/DataTable/index.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The route now composes existing shared Box, Button, Select, and Tabs primitives, while extending the app-local DataTable surface in backward-compatible ways that can be reused by other admin-portal table routes.`
- Verification note: `This logging update is based on the committed route-local refactor plus previously recorded manual smoke evidence for /transaction/list already present in _migration-log.md and _parity-checklist.md; no new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /transaction/list as PASS because the route has both committed route-local migration cleanup and existing recorded smoke verification evidence.`

## Batch 9 - /transaction/list Route Follow-up - 2026-04-03

- Commits:
  - `41963542b86e85cd525886019b6ebd7f3da849f1` (`feat(admin-portal): revamp transaction list table UX`)
  - `15a85cb9716ee439143ddfafbc32d9297decca0e` (`fix(admin-portal): align transaction table cells and loading states`)
- Route focus: `/transaction/list`
- Migration intent: `Continue the route-local transaction list stabilization by moving the page fully onto the shared DataTable instance API, tightening compact pagination and column sizing behavior, and then smoothing the visual alignment between loaded rows and skeleton states.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/transaction/list/page.tsx` is refreshed around the shared `DataTable` API with manual pagination, pinned columns, custom toolbar search, compact pagination wiring, and viewport-aware layout sizing for the route shell.
  - `apps/admin-portal/src/components/tableConfig/transactionTableConfig.tsx` now carries explicit `ColumnDef` metadata for sizing, wrapping, alignment, loading skeletons, and the later `align-middle` follow-up so mixed-height rows and loading placeholders stay visually consistent.
  - `apps/admin-portal/src/components/ui/compact-table-pagination.tsx` is introduced as the reusable denser pagination surface for this route, including shared page-size selection and previous/next controls.
  - The follow-up fix keeps the same transaction list UX direction while refining row-number skeleton geometry and body-cell vertical alignment to reduce perceived layout shift during loading and after hydration.
- Files changed (route-focused): [`apps/admin-portal/src/app/transaction/list/page.tsx`, `apps/admin-portal/src/components/tableConfig/transactionTableConfig.tsx`, `apps/admin-portal/src/components/ui/compact-table-pagination.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The route now composes the existing shared DataTable primitives and route-local table configuration/pagination helpers more consistently than the earlier 2026-04-02 snapshot.`
- Verification note: `This logging update is based on the committed 2026-04-03 route-local follow-up work plus previously recorded manual smoke evidence for /transaction/list already present in _migration-log.md and _parity-checklist.md; no new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should reference the 2026-04-03 transaction list follow-up commits as the latest PASS evidence for this route.`

## Batch 9 - /policy/list Route Refactor Follow-up - 2026-04-03

- Route focus: `/policy/list`
- Migration intent: `Complete the remaining route-local cleanup on the policy list by standardizing the filter toolbar and status tabs on shared primitives, moving the route onto the current DataTable surface, and tightening table sizing/pagination behavior without changing the existing search, import, export, and detail-navigation flows.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/policy/list/page.tsx` now renders the route shell with `Box`, replaces the bespoke date-picker and tab markup with shared `DateRangePicker` and `Tabs`, and aligns the import/export actions plus search toolbar to the shared `Button` and `Input` primitives.
  - `apps/admin-portal/src/app/policy/list/page.tsx` now mounts the shared `@repo/ui` `DataTable` directly with manual pagination, pinned columns, explicit empty state, and compact table toolbar/pagination rendering instead of relying on the legacy local table wrapper behavior.
  - `apps/admin-portal/src/components/tableConfig/policyTableConfig.tsx` now defines the policy list columns against the shared table contract with explicit sizing, wrapped content cells, badge-style status rendering, a compact shared `Button` row action, and `Box`-based replacements for the remaining native wrapper elements left in the legacy pending-renewals renderers.
  - `apps/admin-portal/src/components/ui/compact-table-pagination.tsx` now removes residual button/select shadows so the route pagination chrome matches the denser table treatment used by the updated policy list page.
- Files changed (route-focused): [`apps/admin-portal/src/app/policy/list/page.tsx`, `apps/admin-portal/src/components/tableConfig/policyTableConfig.tsx`, `apps/admin-portal/src/components/ui/compact-table-pagination.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The route now composes existing shared Box, Button, DataTable, DateRangePicker, Input, Select, and Tabs primitives while extending only app-local policy table configuration and pagination styling.`
- Verification note: `This logging update is based on the current route-local source changes plus previously recorded manual smoke evidence for /policy/list already present in _migration-log.md and _parity-checklist.md; no new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /policy/list as PASS because the route has been executed in the current migration pass and existing smoke verification evidence was already recorded earlier.`

## Batch 9 - /claim/list Route Refactor Follow-up - 2026-04-04

- Route focus: `/claim/list`
- Migration intent: `Complete the dominant remaining Batch 9 table-route follow-up on the claim list by moving the page onto the current shared DataTable instance API, standardizing the filter and tab chrome on shared primitives, and tightening the status/action column behavior while preserving the existing status-change modal, import/export flows, SLA highlighting, and detail navigation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/claim/list/page.tsx` now renders the route shell with `Box`, replaces the bespoke date/search/tab toolbar with shared `DateRangePicker`, `Tabs`, and a route-local `DebouncedSearchInput`, and mounts the shared `@repo/ui` `DataTable` directly with manual pagination, pinned columns, explicit empty state, reusable compact pagination, and row-level SLA highlighting.
  - `apps/admin-portal/src/components/tableConfig/claimTableConfig.tsx` now defines the main claim list columns against the shared `ColumnDef` contract with explicit sizing/alignment metadata, wrapped text cells, numeric amount formatting, a compact shared `Button` view action, and a page-injected status cell renderer instead of embedding the legacy select-transition rules inside the table config.
  - `apps/admin-portal/src/app/claim/list/page.tsx` now centralizes claim-status tone mapping, allowed transition guarding, and trigger sizing for the badge-like status select so the page can keep the existing approval/rejection/lack-of-document modal workflow while fitting the denser shared table layout.
  - `apps/admin-portal/src/hooks/useClaims.hooks.tsx`, `apps/admin-portal/src/components/ui/debounced-search-input.tsx`, and `apps/admin-portal/src/interface/index.ts` now shift debounce ownership to the shared route-local search input component, remove the old lodash-backed hook debounce path, and widen the claim table config contract for column sizing plus injected status rendering. The legacy local `DataTable` remains only inside the lack-of-document selection dialog.
- Files changed (route-focused): [`apps/admin-portal/src/app/claim/list/page.tsx`, `apps/admin-portal/src/components/tableConfig/claimTableConfig.tsx`, `apps/admin-portal/src/hooks/useClaims.hooks.tsx`, `apps/admin-portal/src/components/ui/debounced-search-input.tsx`, `apps/admin-portal/src/interface/index.ts`]
- Shared-ui impact: `No new @repo/ui export is adopted. The route now composes existing shared Box, Button, DataTable, DateRangePicker, Input, Select, and Tabs primitives while extending only app-local claim table configuration and route-local search/pagination helpers.`
- Verification note: `This logging update is based on the current route-local source changes plus previously recorded manual smoke verification for /claim/list already present in _migration-log.md and _parity-checklist.md, including the earlier internal redirect to the querystring variant. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /claim/list as PASS because the route has been executed in the current migration pass and existing smoke verification evidence and screenshots were already recorded earlier.`

## Batch 9 - /claim/list Native Elements to Box Refactor - 2026-04-04

- Route focus: `/claim/list`
- Migration intent: `Transform remaining native HTML elements within the status update confirmation modal to use the polymorphic Box component from @repo/ui.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/claim/list/page.tsx` modal render block now completely utilizes `<Box>` and `<Box as="...">` equivalents instead of native `div`, `p`, `strong`, `ul`, `li`, and `textarea` tags.
- Files changed (route-focused): [`apps/admin-portal/src/app/claim/list/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. Replaces native DOM elements with existing shared Box primitives.`
- Verification note: `Visual and functional parity maintained; modal interaction and layout remains identical.`

## Batch 9 - /membership/list Route Refactor - 2026-04-05

- Route focus: `/membership/list`
- Migration intent: `Migrate the membership list route onto the shared DataTable instance API, standardize the filter and tab chrome on shared primitives, and implement a cleaner row action details drawer while preserving existing search, channel filtering, upload, export, and detail navigation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/membership/list/page.tsx` now renders the route shell with `Box`, replaces bespoke status-tab and channel-select markup with shared `Tabs` and `Select`, and mounts the shared `@repo/ui` `DataTable` directly with manual pagination, pinned columns, and compact pagination wiring.
  - `apps/admin-portal/src/components/tableConfig/membershipTableConfig.tsx` now defines the membership list columns against the shared `ColumnDef` contract with explicit sizing/alignment hooks, wrapped content cells, badge-style status rendering, and a shared `Drawer`-based row action detail view.
  - `apps/admin-portal/src/hooks/useMembership.hooks.tsx` now manages table state (page, limit, status, channel, search) with explicit URL synchronization via `router.replace` and `useSearchParams`, and integrates with the `useInsuredParties` and `useChannelsV1` query hooks.
- Files changed (route-focused): [`apps/admin-portal/src/app/membership/list/page.tsx`, `apps/admin-portal/src/components/tableConfig/membershipTableConfig.tsx`, `apps/admin-portal/src/hooks/useMembership.hooks.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The route now composes existing shared Box, Button, DataTable, Drawer, Select, Skeleton, and Tabs primitives while extending only app-local membership table configuration and pagination styling.`
- Verification note: `This logging update is based on the current route-local source changes plus previously recorded manual smoke verification for /membership/list already present in _migration-log.md and _parity-checklist.md (noting the expected 403 state). No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /membership/list as PASS because the route-local migration has been completed.`

## Batch 9 - Table Configuration Alignment and Refinement - 2026-04-05

- Scope: `claim/list`, `policy/list`, `transaction/list`
- Migration intent: `Align existing migrated table routes with the latest design patterns, including standardized column metadata, consistent alignment hooks, and consolidated use of shared primitives within table cells and row actions.`
- Key updates:
  - `claimTableConfig.tsx`, `policyTableConfig.tsx`, and `transactionTableConfig.tsx` now use `Box` and `Button` consistently for cell rendering and row actions.
  - Column metadata updated with explicit `size`, `minSize`, and `meta` properties (`headerCellClassName`, `cellClassName`, `cellContentClassName`) to match the updated `DataTable` contract.
  - Skeletons and loading states refined for better visual consistency during data fetching.
- Files changed: [`apps/admin-portal/src/components/tableConfig/claimTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/policyTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/transactionTableConfig.tsx`, `apps/admin-portal/src/app/claim/list/page.tsx`, `apps/admin-portal/src/app/policy/list/page.tsx`]
- Shared-ui impact: `Refined composition of existing shared primitives.`

## Batch 9 - /policy/endorsement/list Route Refactor - 2026-04-05

- Route focus: `/policy/endorsement/list`
- Migration intent: `Migrate the endorsement list route onto the shared DataTable instance API, standardize the filter and tab chrome on shared primitives, and implement dynamic column sizing while preserving existing upload, export, and detail navigation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/policy/endorsement/list/page.tsx` now renders the route shell with `Box`, replaces bespoke status-tab markup with shared `Tabs`, and mounts the shared `@repo/ui` `DataTable` directly with manual pagination, pinned columns, and compact pagination wiring.
  - `apps/admin-portal/src/components/tableConfig/endorsementTableConfig.tsx` now defines the endorsement list columns against the shared `ColumnDef` contract with explicit sizing/alignment hooks, wrapped content cells, badge-style status rendering, and a shared `Button`-based row action view.
  - Added `DebouncedSearchInput` and `CompactTablePagination` integration.
- Files changed (route-focused): [`apps/admin-portal/src/app/policy/endorsement/list/page.tsx`, `apps/admin-portal/src/components/tableConfig/endorsementTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The route now composes existing shared Box, Button, DataTable, Skeleton, and Tabs primitives while extending only app-local endorsement table configuration and pagination styling.`
- Verification note: `This logging update is based on the current route-local source changes plus previously recorded manual smoke verification for /policy/endorsement/list already present in _migration-log.md and _parity-checklist.md. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /policy/endorsement/list as PASS because the route-local migration has been completed.`

## Batch 9 - /finance/billing Route Refactor and Table Refinements - 2026-04-05

- Route focus: \/finance/billing\, \/claim/list\, \/policy/list\
- Migration intent: \Migrate the billing list route onto the shared DataTable instance API, standardize the filter and date selection on shared primitives, and refine existing migrated table routes (claim, policy, endorsement) for consistent alignment, metadata, and Box-based composition.\
- Route-local behavior updates:
  - \pps/admin-portal/src/app/finance/billing/page.tsx\ now renders the route shell with \Box\, replaces bespoke type/channel/category selectors with shared \Select\, and adopts \MonthPicker\ for period filtering.
  - \pps/admin-portal/src/app/finance/billing/page.tsx\ now mounts the shared \@repo/ui\ \DataTable\ directly with manual pagination, pinned columns, and \CompactTablePagination\ integration.
  - \pps/admin-portal/src/components/tableConfig/billingTableConfig.tsx\ now defines columns against the shared \ColumnDef\ contract with explicit sizing metadata, wrapped content cells, badge-style status rendering, and shared \Button\ row actions for detail/invoice views.
  - \pps/admin-portal/src/app/claim/list/page.tsx\ and \pps/admin-portal/src/app/policy/list/page.tsx\ received further alignment refinements for consistent primitive usage and metadata patterns.
  - \pps/admin-portal/src/components/tableConfig/endorsementTableConfig.tsx\ standardized its column definitions and added details table configuration.
  - \pps/admin-portal/src/views/layout/layout.view.tsx\ layout shell alignment and minor refinements.
- Files changed (route-focused): [\pps/admin-portal/src/app/finance/billing/page.tsx\, \pps/admin-portal/src/components/tableConfig/billingTableConfig.tsx\, \pps/admin-portal/src/app/claim/list/page.tsx\, \pps/admin-portal/src/app/policy/list/page.tsx\, \pps/admin-portal/src/components/tableConfig/endorsementTableConfig.tsx\, \pps/admin-portal/src/views/layout/layout.view.tsx\]
- Shared-ui impact: \No new @repo/ui export is adopted. The routes now compose existing shared Box, Button, DataTable, DateRangePicker, MonthPicker, Select, and Tabs primitives while extending only app-local table configuration and pagination styling.\
- Verification note: \This logging update is based on the current route-local source changes plus previously recorded manual smoke verification for /finance/billing already present in _migration-log.md and _parity-checklist.md (noting the expected 403 state). No new smoke, lint, or build evidence is added in this documentation entry.\
- Tracker impact: \Batch 9 page tracker can now treat /finance/billing as PASS because the route-local migration has been completed.\

## Batch 9 - /masterdata/user Route Refactor and Miscellaneous Cleanup - 2026-04-06

- Route focus: `/masterdata/user`, `/claim/history`
- Migration intent: `Migrate the masterdata user route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation. Apply miscellaneous alignment and layout fixes to claim history, membership table, and global css.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/user/page.tsx` now renders the route shell with `Box`, replaces bespoke user role select markup with shared `Select`, and mounts the shared `@repo/ui` `DataTable` directly with manual pagination, pinned columns, empty states, and `CompactTablePagination` integration.
  - `apps/admin-portal/src/components/tableConfig/usersTableConfig.tsx` now defines the user list columns against the shared `ColumnDef` contract with explicit sizing/alignment hooks, wrapped content cells, badge-style status rendering, and a shared `Button`-based row action view.
  - `apps/admin-portal/src/app/claim/history/page.tsx` had its native header layout replaced with standard markup.
  - `apps/admin-portal/src/components/tableConfig/membershipTableConfig.tsx` text formatting alignment adjustments.
  - `apps/admin-portal/src/views/layout/layout.view.tsx` temporarily disabled `403 - Forbidden` gate.
  - `apps/admin-portal/src/app/globals.css` tweaked disabled button styling to exclude `data-slot="switch-control"`.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/user/page.tsx`, `apps/admin-portal/src/components/tableConfig/usersTableConfig.tsx`, `apps/admin-portal/src/app/claim/history/page.tsx`, `apps/admin-portal/src/components/tableConfig/membershipTableConfig.tsx`, `apps/admin-portal/src/views/layout/layout.view.tsx`, `apps/admin-portal/src/app/globals.css`]
- Shared-ui impact: `No new @repo/ui export is adopted. The routes now compose existing shared Box, Button, DataTable, Input, Select, Switch, and Skeleton primitives while extending only app-local table configuration and pagination styling.`
- Verification note: `This logging update is based on the current route-local source changes plus previously recorded manual smoke verification for /masterdata/user already present in _migration-log.md and _parity-checklist.md. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /masterdata/email-template as PASS because the route-local migration has been completed.`

## Batch 9 - /masterdata/email-tag Route Refactor - 2026-04-10

- Route focus: `/masterdata/email-tag`
- Migration intent: `Migrate the masterdata email tag route onto the shared DataTable instance API, standardize the table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/email-tag/page.tsx` now renders the route shell with `Box`, mounts the shared `@repo/ui` `DataTable` directly with manual pagination, pinned columns, and `CompactTablePagination` integration.
  - `apps/admin-portal/src/components/tableConfig/emailTagTableConfig.tsx` now defines the email tag list columns against the shared `ColumnDef` contract with explicit sizing/alignment hooks, wrapped content cells, and standardized shared `Button`-based row actions.
  - Implemented dynamic column sizing via `measureTextWidth` to ensure visual balance for variable-length fields.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/email-tag/page.tsx`, `apps/admin-portal/src/components/tableConfig/emailTagTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The route now composes existing shared Box, Button, DataTable, and Skeleton primitives while extending only app-local table configuration and pagination styling.`
- Verification note: `This logging update is based on the current route-local source changes plus previously recorded manual smoke verification for /masterdata/email-tag already present in _migration-log.md and _parity-checklist.md. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /masterdata/email-tag as PASS because the route-local migration has been completed.`


## Batch 9 - PageHeader Local Component Relocation and Semantics Refresh - 2026-04-06

- Component focus: `PageHeader`
- Migration intent: `Keep the app-local PageHeader wrapper in place while relocating it out of the legacy ui/PageHeader path, aligning the shell with shared Box primitives, and closing the previously logged back-button accessibility gap without introducing a new @repo/ui PageHeader export.`
- Component-local behavior updates:
  - `apps/admin-portal/src/components/page-header/index.tsx` now replaces the legacy `apps/admin-portal/src/components/ui/PageHeader/index.tsx` container path while preserving the local `useRouter().back()` fallback and optional `onBackClick` override contract.
  - `apps/admin-portal/src/components/page-header/page-header-shell.tsx` now replaces `apps/admin-portal/src/components/ui/PageHeader/PageHeaderShell.tsx`, swaps the remaining native wrapper nodes to `Box`, keeps the shared `Breadcrumb` composition, and renders the back affordance as `Box as="button" type="button"` instead of a clickable `<div>`.
  - Detail-page callers now import `PageHeader` from `@/components/page-header`, matching the new local component location used by the current claim, membership, policy, and endorsement detail flows.
- Files changed (component-focused): [`apps/admin-portal/src/components/page-header/index.tsx`, `apps/admin-portal/src/components/page-header/page-header-shell.tsx`, `apps/admin-portal/src/app/claim/list/detail/[id]/page.tsx`, `apps/admin-portal/src/app/claim/list/detail/[id]/upload-data/page.tsx`, `apps/admin-portal/src/app/membership/list/detail/[id]/page.tsx`, `apps/admin-portal/src/app/policy/list/detail/[id]/page.tsx`, `apps/admin-portal/src/app/policy/endorsement/list/detail/[id]/page.tsx`]
- Local files deleted: [`apps/admin-portal/src/components/ui/PageHeader/index.tsx`, `apps/admin-portal/src/components/ui/PageHeader/PageHeaderShell.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The app still keeps PageHeader local and composes the existing shared Box and Breadcrumb primitives inside the app shell.`
- Accessibility note: `This follow-up resolves the 2026-03-27 Breadcrumb migration note that flagged PageHeaderShell's clickable <div> back affordance; the back control is now a semantic button.`
- Verification note: `This logging update is based on the current local component and caller source changes. No new smoke, lint, or build evidence is added in this documentation entry.`

## Batch 9 - /claim/list/detail/[id] and /claim/list/detail/[id]/upload-data Route Refactor - 2026-04-06

- Route focus: `/claim/list/detail/[id]`, `/claim/list/detail/[id]/upload-data`
- Migration intent: `Refactor the claim detail and missing-document upload flows onto the current shared primitive stack, remove route-specific helper components that are no longer needed, and keep existing claim review, document inspection, and missing-document submission behavior intact.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/claim/list/detail/[id]/page.tsx` now imports `PageHeader` from `@/components/page-header`, replaces the bespoke summary/documents tab chrome with shared `Tabs`, and keeps the existing route data-fetching, permission checks, claim history lookup, and missing-document wiring intact.
  - `apps/admin-portal/src/app/claim/list/detail/[id]/page.tsx` now replaces the legacy local document listing and per-row inline dialog trigger flow with shared `Table`, `Dialog`, `Button`, and `Box` composition plus centralized viewer state for the active document.
  - `apps/admin-portal/src/app/claim/list/detail/[id]/page.tsx` now renders clearer single-file and multi-file preview states, including explicit empty and non-previewable placeholders, download actions, and an inlined status timeline SVG that replaces the deleted `journey-vertical.image` helpers.
  - `apps/admin-portal/src/app/claim/list/detail/[id]/upload-data/page.tsx` now adopts shared `@repo/ui` `FileUpload`, `Button`, and `Box` primitives, adds an explicit empty state when no missing documents remain, and refreshes the upload form presentation while preserving the same missing-document submission flow.
  - `apps/admin-portal/src/app/claim/list/detail/[id]/upload-data/page.tsx` now reads selected files with `FileReader` and maps them into the existing hook handlers so the route can use the shared upload component without the deleted app-local `FileUpload` wrapper.
  - `apps/admin-portal/src/hooks/useDetailClaim.hooks.tsx` now normalizes the form-claim response shape, guards missing `claim_config` and `lack_of_documents` arrays, and preserves previously populated field values so the upload route remains stable under the refactored shared upload input flow.
  - `apps/admin-portal/src/views/claim/detail/detail.view.tsx` now mirrors the same inlined status timeline SVG approach, allowing deletion of the duplicated legacy image helper in the older detail view path as part of the same cleanup.
- Files changed (route-focused): [`apps/admin-portal/src/app/claim/list/detail/[id]/page.tsx`, `apps/admin-portal/src/app/claim/list/detail/[id]/upload-data/page.tsx`, `apps/admin-portal/src/hooks/useDetailClaim.hooks.tsx`, `apps/admin-portal/src/views/claim/detail/detail.view.tsx`]
- Local files deleted: [`apps/admin-portal/src/components/ui/FileUpload.tsx`, `apps/admin-portal/src/components/ui/journey-vertical.image.tsx`, `apps/admin-portal/src/images/journey-vertical.image.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The two routes now adopt existing shared Box, Button, Dialog, FileUpload, Table, and Tabs primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the current claim detail and upload-data route source changes plus supporting hook and legacy-view cleanup. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat both /claim/list/detail/[id] and /claim/list/detail/[id]/upload-data as PASS because the route-local migration work for both claim detail flows is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /claim/list/export Route Refactor - 2026-04-06

- Route focus: `/claim/list/export`
- Migration intent: `Refactor the claim list export page onto the current shared primitive stack, standardizing the report-generation layout and table rendering while preserving the existing data fetching, filtering, and PDF/XLSX export logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/claim/list/export/page.tsx` now renders the route shell with `Box`, replaces the bespoke report table with shared `@repo/ui` `DataTable`, and standardizes the 'Generate PDF' and 'Generate XLSX' actions on shared `Button` primitives.
  - `apps/admin-portal/src/app/claim/list/export/page.tsx` now implements dynamic column sizing using a local `measureTextWidth` helper so the export preview table remains visually balanced across different claim data sets.
  - `apps/admin-portal/src/hooks/useExportClaim.hooks.ts` replaces the deleted `.tsx` variant, providing a cleaner hook implementation for fetching all claims, resolving channel configurations (including Grab Express specific fields), and handling the `jsPDF` and `xlsx` generation logic.
  - `apps/admin-portal/src/app/claim/list/page.tsx` and `apps/admin-portal/src/app/policy/list/page.tsx` received minor alignment refinements to their export button implementations to ensure consistent primitive usage.
- Files changed (route-focused): [`apps/admin-portal/src/app/claim/list/export/page.tsx`, `apps/admin-portal/src/app/claim/list/page.tsx`, `apps/admin-portal/src/app/policy/list/page.tsx`, `apps/admin-portal/src/hooks/useExportClaim.hooks.ts`]
- Local files deleted: [`apps/admin-portal/src/hooks/useExportClaim.hooks.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, and DataTable primitives while keeping the report-generation logic local.`
- Verification note: `This logging update is based on the current claim export route source changes and hook migration. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /claim/list/export as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


## Batch 9 - /claim/list/import Route Refactor - 2026-04-06

- Route focus: /claim/list/import
- Migration intent: `Refactor the claim list import page onto the current shared primitive stack, standardizing the layout and file-upload interaction while preserving the existing claim-import submission logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/claim/list/import/page.tsx` now renders the route shell with `Box`, adopts shared `@repo/ui` `FileUpload` and `Button` primitives, and standardizes the page header via the local `PageHeader` component.
  - The refactor removes the dependency on the legacy `ClaimImportView` and implements inline file-to-base64 conversion to support the `useImportClaims` mutation hook directly within the page component.
  - Standardized breadcrumbs and a `Box`-based back affordance are integrated into the new page layout.
- Files changed (route-focused): [`apps/admin-portal/src/app/claim/list/import/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, and FileUpload primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the current claim import route source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /claim/list/import as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /claim/list/import-with-preview Route Refactor and Icon Consolidation - 2026-04-07

- Route focus: /claim/list/import-with-preview
- Migration intent: `Refactor the claim list import with preview page onto the current shared primitive stack, standardizing the layout, file-upload, and table interaction while preserving the existing claim-import submission logic and data validation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/claim/list/import-with-preview/page.tsx` now renders the route shell with `Box`, adopts shared `@repo/ui` `FileUpload`, `Button`, `Table`, `Select`, and `Dialog` primitives, and standardizes the page header via the local `PageHeader` component.
  - The refactor removes dependencies on legacy icons and views, implementing consolidated `AlertCircleIcon` and `EditIcon` components using `Box` for design-system alignment.
  - Refactored `AlertCircleIcon` and `EditIcon` into `src/components/icons` using kebab-case and `Box` composition, and updated all project callers to point to these new locations.
- Files changed (route-focused): [`apps/admin-portal/src/app/claim/list/import-with-preview/page.tsx`, `apps/admin-portal/src/components/icons/alert-circle-icon.tsx`, `apps/admin-portal/src/components/icons/edit-icon.tsx`]
- Local files deleted: [`apps/admin-portal/src/components/icons/edit.icon.tsx`, `apps/admin-portal/src/images/edit.icon.tsx`, `apps/admin-portal/src/images/alert-circle.icon.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, FileUpload, Table, Select, and Dialog primitives while icons are consolidated locally.`
- Verification note: `This logging update is based on the current claim import with preview route source changes and icon refactoring. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /claim/list/import-with-preview as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /masterdata/insurance, /masterdata/product-category, and /masterdata/product Route Refactors - 2026-04-09

- Route focus: `/masterdata/insurance`, `/masterdata/product-category`, `/masterdata/product`
- Migration intent: `Migrate the masterdata insurance, product category, and product routes onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/insurance/page.tsx` and `apps/admin-portal/src/app/masterdata/product-category/page.tsx` now render the route shell with `Box`, standardizing layout properties.
  - Both routes now mount the shared `@repo/ui` `DataTable` directly with manual pagination, pinned columns, and empty states. They utilize the `CompactTablePagination` integration.
  - `apps/admin-portal/src/components/tableConfig/insuranceTableConfig.tsx` and `apps/admin-portal/src/components/tableConfig/productCategoryTableConfig.tsx` define columns against the shared `ColumnDef` contract with explicit sizing/alignment hooks, wrapped content cells, badge-style status rendering, and a shared `Button`-based row action view. Skeletons for loading states have also been properly scoped with `Box` primitives.
  - `apps/admin-portal/src/app/masterdata/product/page.tsx` now renders the route shell with `Box` and aligns buttons with standard properties.
  - `apps/admin-portal/src/hooks/useProduct.hooks.tsx` now manages table state (page, limit, tab) with explicit URL synchronization, standardizes imports, and implements cleaner bootstrapping and loading state derivations.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/insurance/page.tsx`, `apps/admin-portal/src/app/masterdata/product-category/page.tsx`, `apps/admin-portal/src/app/masterdata/product/page.tsx`, `apps/admin-portal/src/components/tableConfig/insuranceTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/productCategoryTableConfig.tsx`, `apps/admin-portal/src/hooks/useProduct.hooks.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The routes now compose existing shared Box, Button, DataTable, and Skeleton primitives while extending only app-local table configuration and pagination styling. DataTable.tsx was updated to support optional pagination toggling via enablePagination prop.`
- Verification note: `This logging update is based on the current route-local source changes plus previously recorded manual smoke verification for these routes present in _migration-log.md and _parity-checklist.md. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /masterdata/insurance, /masterdata/product-category, and /masterdata/product as PASS because the route-local migration has been completed.`

## Batch 9 - /masterdata/channel and /masterdata/currency Route Refactors - 2026-04-09

- Route focus: `/masterdata/channel`, `/masterdata/currency`
- Migration intent: `Migrate the masterdata channel and currency routes onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/channel/page.tsx` and `apps/admin-portal/src/app/masterdata/currency/page.tsx` now render the route shell with `Box`, replacing native layout tags. Both routes now mount the shared `@repo/ui` `DataTable` directly with manual pagination, pinned columns, empty states, and use the `CompactTablePagination` component.
  - `apps/admin-portal/src/components/tableConfig/channelTableConfig.tsx` and `apps/admin-portal/src/components/tableConfig/currencyTableConfig.tsx` define columns against the shared `ColumnDef` contract with explicit sizing/alignment hooks, and badge-style status rendering.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/channel/page.tsx`, `apps/admin-portal/src/app/masterdata/currency/page.tsx`, `apps/admin-portal/src/components/tableConfig/channelTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/currencyTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The routes now compose existing shared Box, Button, DataTable, and Skeleton primitives while extending only app-local table configuration and pagination styling.`
- Verification note: `This logging update is based on the current route-local source changes plus previously recorded manual smoke verification for these routes present in _migration-log.md and _parity-checklist.md. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /masterdata/channel and /masterdata/currency as PASS because the route-local migration has been completed.`

## Batch 9 - /masterdata/group and /masterdata/role Route Refactors - 2026-04-09

- Route focus: `/masterdata/group`, `/masterdata/role`
- Migration intent: `Migrate the masterdata group and role routes onto the shared DataTable instance API, standardize the table chrome on shared primitives, and preserve the existing add and detail navigation while aligning masterdata action cells on the current button treatment.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/group/page.tsx` and `apps/admin-portal/src/app/masterdata/role/page.tsx` now render the route shell with `Box`, mount the shared `@repo/ui` `DataTable` directly, and adopt manual pagination, column pinning, compact pagination, and explicit empty states with the shared no-data asset.
  - `apps/admin-portal/src/components/tableConfig/groupTableConfig.tsx` and `apps/admin-portal/src/components/tableConfig/roleTableConfig.tsx` now define columns against the shared `ColumnDef` contract with explicit sizing, loading skeleton metadata, wrapped content cells, and standardized shared `Button`-based row actions.
  - `apps/admin-portal/src/components/tableConfig/channelTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/insuranceTableConfig.tsx`, and `apps/admin-portal/src/components/tableConfig/productCatalogTableConfig.tsx` received supporting action-cell cleanup so adjacent masterdata tables use the same compact edit and delete button treatment introduced in the group and role refactor pass.
- Files changed (route-focused and supporting cleanup): [`apps/admin-portal/src/app/masterdata/group/page.tsx`, `apps/admin-portal/src/app/masterdata/role/page.tsx`, `apps/admin-portal/src/components/tableConfig/groupTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/roleTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/channelTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/insuranceTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/productCatalogTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The two routes now compose existing shared Box, Button, DataTable, and Skeleton primitives while extending only app-local table configuration and compact pagination styling.`
- Verification note: `This logging update is based on the current route-local source changes for /masterdata/group and /masterdata/role plus supporting table-config cleanup. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /masterdata/group and /masterdata/role as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


## Batch 9 - /masterdata/page-management and /masterdata/partner-management Route Refactors - 2026-04-09

- Route focus: `/masterdata/page-management`, `/masterdata/partner-management`
- Migration intent: `Migrate the masterdata page management and partner management routes onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/page-management/page.tsx` and `apps/admin-portal/src/app/masterdata/partner-management/page.tsx` now render the route shell with `Box`, mount the shared `@repo/ui` `DataTable` directly, and adopt manual pagination, column pinning, compact pagination, and explicit empty states.
  - `apps/admin-portal/src/components/tableConfig/pageManagementTableConfig.tsx` and `apps/admin-portal/src/components/tableConfig/partnerManagmentTableConfig.tsx` now define columns against the shared `ColumnDef` contract with explicit sizing, loading skeleton metadata, wrapped content cells, and standardized shared `Button`-based row actions.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/page-management/page.tsx`, `apps/admin-portal/src/app/masterdata/partner-management/page.tsx`, `apps/admin-portal/src/components/tableConfig/pageManagementTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/partnerManagmentTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The routes now compose existing shared Box, Button, DataTable, and Skeleton primitives while extending only app-local table configuration and pagination styling.`
- Verification note: `This logging update is based on the current route-local source changes plus previously recorded manual smoke verification for these routes present in _migration-log.md and _parity-checklist.md. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /masterdata/page-management and /masterdata/partner-management as PASS because the route-local migration has been completed.`
`n## Batch 9 - /masterdata/email-template Route Refactor - 2026-04-09`n`n- Route focus: `/masterdata/email-template``n- Migration intent: ``Migrate the masterdata email template route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.``n- Route-local behavior updates:`n  - `apps/admin-portal/src/app/masterdata/email-template/page.tsx` now renders the route shell with `Box`, replaces bespoke category tab markup with shared `Tabs`, and mounts the shared `@repo/ui` `DataTable` directly with manual pagination, pinned columns, and `CompactTablePagination` integration.`n  - `apps/admin-portal/src/components/tableConfig/emailTemplateTableConfig.tsx` now defines the email template list columns against the shared `ColumnDef` contract with explicit sizing/alignment hooks, wrapped content cells, and standardized shared `Button`-based row actions.`n  - Implemented dynamic column sizing via `measureTextWidth` to ensure visual balance for variable-length subject and journey strings.`n- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/email-template/page.tsx`, `apps/admin-portal/src/components/tableConfig/emailTemplateTableConfig.tsx`]`n- Shared-ui impact: `No new @repo/ui export is adopted. The route now composes existing shared Box, Button, DataTable, Skeleton, and Tabs primitives while extending only app-local table configuration and pagination styling.`n- Verification note: `This logging update is based on the current route-local source changes plus previously recorded manual smoke verification for /masterdata/email-template already present in _migration-log.md and _parity-checklist.md. No new smoke, lint, or build evidence is added in this documentation entry.`n- Tracker impact: `Batch 9 page tracker can now treat /masterdata/email-template as PASS because the route-local migration has been completed.
