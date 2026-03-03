# Per-App Baseline Summary - agent-portal

- Date: 2026-02-24
- App: apps/agent-portal
- Scope: Batch 1 component audit

## Component Totals
- Total components audited: 44
- KEEP_APP_LOCAL: 29
- MIGRATE_AFTER_SPLIT: 15

## Top 5 Highest Parity Risk Items
- ArrangeView (src/views/dashboard/arrange/arrange.view.tsx): Service calls and dashboard rendering are coupled in one view
- CustomerView (src/views/dashboard/customer/customer.view.tsx): Customer data fetch and UI composition are tightly coupled
- DashboardView (src/views/dashboard/dashboard.view.tsx): Core dashboard orchestration mixes domain and presentation logic
- FilterMasterCertView (src/views/dashboard/filter/filter-master-cert.view.tsx): Filter fetch logic and modal rendering are combined
- FilterSchemeView (src/views/dashboard/filter/filter-scheme.view.tsx): Scheme query logic is mixed directly with filter UI

## Components that EXTEND_EXISTING
- None in this app at current @repo/ui surface (only Box export exists).

## Components that are NEW_SHARED_COMPONENT
- None identified in Batch 1 for this app branch.

## KEEP_APP_LOCAL Refactor Candidates
- Total KEEP_APP_LOCAL components: 29
- KEEP_APP_LOCAL with SoC HIGH or MEDIUM: 0
- Top 3 KEEP_APP_LOCAL refactor candidates by local complexity:
- Input: strategy prop-injection for future shell extraction if shared demand appears.
- Select: strategy prop-injection for future shell extraction if shared demand appears.
- Modal: strategy prop-injection for future shell extraction if shared demand appears.
- Shell candidate in packages/ui from KEEP_APP_LOCAL set today: no confirmed candidate (all SoC rated NONE).

## SoC Evaluation Summary
- Total Batch 1.5 candidates: 15
- SoC breakdown: HIGH=15, MEDIUM=0, LOW=0, NONE=29
- Monolith count: 15
- Projected NEW_SHARED_COMPONENT from splits: 6 (expected shell outcomes from dashboard filter and detail shells after Batch 1.5).

## Notes for Phase 02
- All non-local migration work is gated behind Batch 1.5 splits for monolith components.
- @repo/ui parity comparison is currently constrained by export surface (Box only).

## Batch 1.5 Amendment

- Components split: 15
  - FilterMasterCertView
  - FilterSchemeView
  - FilterStatisticView
  - DetailPlanView
  - DetailHotLeadsView
  - SupportView
  - ArrangeView
  - CustomerView
  - DashboardView
  - DetailContributionCommisionView
  - DetailProductView
  - ProductsView
  - ReportDetailsView
  - AddSchemeView
  - TransactionView
- NEW_SHARED_COMPONENT candidates from splits: 0
- KEEP_APP_LOCAL-only Shells: 15
  - FilterMasterCertShell
  - FilterSchemeShell
  - FilterStatisticShell
  - DetailPlanShell
  - DetailHotLeadsShell
  - SupportShell
  - ArrangeShell
  - CustomerShell
  - DashboardShell
  - DetailContributionCommisionShell
  - DetailProductShell
  - ProductsShell
  - ReportDetailsShell
  - AddSchemeShell
  - TransactionShell
- Deferred Batch 1.5 candidates remaining: 0
- Smoke artifact comparison log: `apps/agent-portal/docs/migration/component/_artifacts/smoke-routes/comparison-log.md`
- Environment note: local auth redirect (`/api/cookie/token` missing) was identical before/after migration, so parity was validated under constrained but equivalent runtime conditions.