# Per-App Baseline Summary - agent-admin

## 1. App overview
- Framework: Next.js 16.1.6 (App Router), React 19.2.4, TypeScript 5.9.2
- Styling: Tailwind CSS v4 + app-local utility classes
- Current shared UI surface: `@repo/ui` exports `Box` only
- Data orchestration pattern: route/view containers with service hooks and API service calls

## 2. Component count summary
- Total components audited: 127
- MIGRATE_AFTER_SPLIT: 0
- SPLIT: 19
- NEW_SHARED_COMPONENT: 16
- EXTEND_EXISTING: 0
- ADOPT_NOW: 0
- ADOPT_WITH_ADAPTER: 0
- KEEP_APP_LOCAL: 92

## 3. P0 critical needs
- Batch 1.5 route-level SoC splits are complete; proceed with shared UI migration phases.
- Shared primitives needed in `@repo/ui`: Button, Input, Select, Modal, Table, Pagination, Notification.
- Date interaction model must be standardized (`DatePickerV2`) before replacing route-level filters.

## 4. New shared components needed
- `Button`: Props `variant` (`primary|danger|warning`), `disabled`, `withIcon`; states `default|hover|disabled`.
- `Input`: Props `value`, `type`, `icon`, `showClear`, `isCurrency`; states `default|focus|disabled|error`.
- `Select`: Props `options`, `value`, `placeholderSelect`, `disabled`, `withBorder`; states `default|open|disabled|error`.
- `CustomSelect`: hierarchical options + inline search + child panel + staged submit; states `default|open|search|disabled|error`.
- `MultiSelect`: checkbox list + summary label + submit action; states `default|open|selected|disabled|error`.
- `DatePickerV2`: popover calendar/year picker with min/max date constraints; states `default|open|disabled`.
- `Table`: generic column renderers, expandable rows, search slot, pagination integration, loading/error/empty states.
- `Pagination`: page size selector + first/prev/next/last controls with disabled edge states.
- `Modal`: controlled open/close, backdrop click close, body scroll lock.
- `BreadcrumbsShell`: router-agnostic breadcrumb shell with `renderLink` slot and chevron slot.
- `Checkbox`, `RadioButton`, `Switch`, `TextArea`, `Skeleton`, `Notification`: foundational input/feedback primitives.

## 5. Extend existing needed
- None in Batch 1 (current `@repo/ui` public export surface only contains `Box`).

## 6. Normalization deltas
- Hardcoded color values and inline style objects in local components must migrate to token-driven styles.
- Inconsistent prop naming (`withBorder`, `additionalClassName`, `placeholderSelect`) should normalize to shared naming conventions.
- Legacy date components rely on `moment`; shared implementation should expose date-agnostic props and formatting boundaries.
- `Breadcrumbs` currently imports `next/link` directly; needs render-prop shell boundary for package portability.

## 7. High-risk parity items (Top 5)
- None pending. Previous Batch 1.5 high-risk route monoliths were split and gate-validated.

## 8. Backlog CSV row count
- 127 rows (updated after Batch 1.5 splits).

## 9. SoC Evaluation Summary
- Remaining Batch 1.5 candidates: 0
- SoC potential breakdown: HIGH=15, MEDIUM=4, LOW=9, NONE=99
- Monolith count: 28
- Projected NEW_SHARED_COMPONENT candidates from splits: 5
  - BreadcrumbsShell (from Breadcrumbs split)
  - AgentListShell
  - AgentDetailShell
  - TransactionTableShell
  - DashboardShell

## 10. KEEP_APP_LOCAL refactor candidates
- Total KEEP_APP_LOCAL components: 92
- KEEP_APP_LOCAL with HIGH/MEDIUM SoC potential: 0
- Top candidates: none (no remaining `MIGRATE_AFTER_SPLIT` components).

## Batch 1.5 Amendment

- Components split: 19
- NEW_SHARED_COMPONENT candidates from splits: 1 (`BreadcrumbsShell`)
- KEEP_APP_LOCAL-only Shells: 18 (`DaSchemeListShell`, `GetRevSchemeListShell`, `LayoutShell`, `DaSchemeDetailShell`, `GetRevSchemeDetailShell`, `DaAgentListShell`, `GetRevAgentListShell`, `DaTransactionsUploadShell`, `DaAgentNewShell`, `GetRevAgentNewShell`, `DaAgentDetailShell`, `GetRevAgentDetailShell`, `DaDropoffShell`, `GetRevTransactionsExportShell`, `GetRevTransactionsShell`, `DaTransactionsShell`, `DaDashboardShell`, `GetRevDashboardShell`)
- Completed splits:
  - `Breadcrumbs` -> `BreadcrumbsContainer` + `BreadcrumbsShell`
  - `DaView` (scheme da) -> `DaSchemeListContainer` + `DaSchemeListShell`
  - `GetRevView` (scheme getrev) -> `GetRevSchemeListContainer` + `GetRevSchemeListShell`
  - `LayoutView` -> `LayoutContainer` + `LayoutShell`
  - `DaDetailView` (scheme da) -> `DaSchemeDetailContainer` + `DaSchemeDetailShell`
  - `GetRevDetailView` (scheme getrev) -> `GetRevSchemeDetailContainer` + `GetRevSchemeDetailShell`
  - `DaView` (agent da) -> `DaAgentListContainer` + `DaAgentListShell`
  - `GetRevView` (agent getrev) -> `GetRevAgentListContainer` + `GetRevAgentListShell`
  - `DaView` (transactions da upload) -> `DaTransactionsUploadContainer` + `DaTransactionsUploadShell`
  - `DaNewView` (agent da) -> `DaAgentNewContainer` + `DaAgentNewShell`
  - `GetRevNewView` (agent getrev) -> `GetRevAgentNewContainer` + `GetRevAgentNewShell`
  - `DaDetailView` (agent da) -> `DaAgentDetailContainer` + `DaAgentDetailShell`
  - `GetRevDetailView` (agent getrev) -> `GetRevAgentDetailContainer` + `GetRevAgentDetailShell`
  - `DaView` (dropoff da) -> `DaDropoffContainer` + `DaDropoffShell`
  - `GetRevView` (transactions getrev export) -> `GetRevTransactionsExportContainer` + `GetRevTransactionsExportShell`
  - `GetRevView` (transactions getrev) -> `GetRevTransactionsContainer` + `GetRevTransactionsShell`
  - `DaView` (transactions da) -> `DaTransactionsContainer` + `DaTransactionsShell`
  - `DaView` (dashboard da) -> `DaDashboardContainer` + `DaDashboardShell`
  - `GetRevView` (dashboard getrev) -> `GetRevDashboardContainer` + `GetRevDashboardShell`
- Deferred candidates from this run: none.

## Legacy Update - 2026-03-04 10:34 (+07)
- Source: subtree pull from agent-admin/stage into integrate-app/agent-admin, then merge to migrate-app/agent-admin.
- Net changed files from this legacy sync: 2.
- Changed files:
  - src/views/dashboard/da/dashboard.view.tsx
  - src/@types/dashboard.d.ts
- New component introduced by legacy: none.
- packages/ui intake queue impact:
  - NEW_SHARED_COMPONENT: none
  - EXTEND_EXISTING: none
- Verification after merge:
  - pnpm --filter agent-admin check-types -> PASS
  - pnpm --filter agent-admin lint -> PASS (warnings only)
  - pnpm --filter agent-admin build -> PASS