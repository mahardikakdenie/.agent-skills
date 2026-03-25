# Per-App Baseline Summary - teman-affiliate-portal

## 1) App Overview
- Framework: Next.js 16 (App Router), React 19, TypeScript 5.9.2
- Styling: Tailwind CSS v4 (app-level custom tokens)
- Data/access: local service layer (`@/services/api.service`), context providers, i18n
- Shared UI baseline available now: `@repo/ui` exports `Box` only

## 2) Component Count Summary
- Total audited: 59
- ADOPT_WITH_ADAPTER: 1
- KEEP_APP_LOCAL: 20
- MIGRATE_AFTER_SPLIT: 20
- NEW_SHARED_COMPONENT: 18

## 3) P0 Critical Needs
- Core primitives required early for migration velocity: `Button`, `Input`, `Select`, `Textarea`, `Modal`, and `PageContainer` adapter over `Box`.
- Batch 1.5 split blockers on critical smoke routes: None.

## 4) New Shared Components Needed
- **Button** (`src/components/button.tsx`): props=normalized shared API; variants=size/intent as applicable; states=default/hover/focus/disabled/loading/error.
- **CardStatistic** (`src/components/card-statistic.tsx`): props=normalized shared API; variants=size/intent as applicable; states=default/hover/focus/disabled/loading/error.
- **Datepicker** (`src/components/datepicker.tsx`): props=normalized shared API; variants=size/intent as applicable; states=default/hover/focus/disabled/loading/error.
- **HeaderModalBottom** (`src/components/header-modal-bottom.tsx`): props=normalized shared API; variants=size/intent as applicable; states=default/hover/focus/disabled/loading/error.
- **HeaderModalFull** (`src/components/header-modal-full.tsx`): props=normalized shared API; variants=size/intent as applicable; states=default/hover/focus/disabled/loading/error.
- **Image** (`src/components/image.tsx`): props=normalized shared API; variants=size/intent as applicable; states=default/hover/focus/disabled/loading/error.
- **ImageOrDefault** (`src/components/image-or-default.tsx`): props=normalized shared API; variants=size/intent as applicable; states=default/hover/focus/disabled/loading/error.
- **Input** (`src/components/input.tsx`): props=normalized shared API; variants=size/intent as applicable; states=default/hover/focus/disabled/loading/error.
- **Loader** (`src/components/loader.tsx`): props=normalized shared API; variants=size/intent as applicable; states=default/hover/focus/disabled/loading/error.
- **Modal** (`src/components/modal.tsx`): props=normalized shared API; variants=size/intent as applicable; states=default/hover/focus/disabled/loading/error.
- **NotFound** (`src/components/not-found.tsx`): props=normalized shared API; variants=size/intent as applicable; states=default/hover/focus/disabled/loading/error.
- **Pagination** (`src/components/pagination.tsx`): props=normalized shared API; variants=size/intent as applicable; states=default/hover/focus/disabled/loading/error.
- **Select** (`src/components/select.tsx`): props=normalized shared API; variants=size/intent as applicable; states=default/hover/focus/disabled/loading/error.
- **SelectDate** (`src/components/select-date.tsx`): props=normalized shared API; variants=size/intent as applicable; states=default/hover/focus/disabled/loading/error.
- **StatisticList** (`src/components/statistic-list.tsx`): props=normalized shared API; variants=size/intent as applicable; states=default/hover/focus/disabled/loading/error.
- **Tabs** (`src/components/tabs.tsx`): props=normalized shared API; variants=size/intent as applicable; states=default/hover/focus/disabled/loading/error.
- **Textarea** (`src/components/textarea.tsx`): props=normalized shared API; variants=size/intent as applicable; states=default/hover/focus/disabled/loading/error.
- **ToggleSwitch** (`src/components/toggle-switch.tsx`): props=normalized shared API; variants=size/intent as applicable; states=default/hover/focus/disabled/loading/error.

## 5) Extend Existing Needed
- None in this app baseline (no `EXTEND_EXISTING` candidates with current @repo/ui surface).

## 6) Normalization Deltas
- Local components use mixed prop naming and ad-hoc variants that must be normalized to shared conventions.
- Many components rely on hardcoded utility values and app helper classes instead of tokenized shared primitives.
- Significant bare native element usage remains; Box pass is required during migration.
- Some reusable shells directly import `next/*`; split/abstraction needed before sharing.

## 7) High-Risk Parity Items (Top 5)
- **BenefitDialog** (`src/components/benefit-dialog.tsx`): High interaction/data-state complexity; smoke-route parity and async state transitions are regression sensitive.
- **FilterProduct** (`src/components/filter-product.tsx`): High interaction/data-state complexity; smoke-route parity and async state transitions are regression sensitive.
- **CustomerView** (`src/views/dashboard/customer/customer.view.tsx`): High interaction/data-state complexity; smoke-route parity and async state transitions are regression sensitive.
- **DashboardView** (`src/views/dashboard/dashboard.view.tsx`): High interaction/data-state complexity; smoke-route parity and async state transitions are regression sensitive.
- **GwpView** (`src/views/dashboard/gwp/gwp.view.tsx`): High interaction/data-state complexity; smoke-route parity and async state transitions are regression sensitive.

## 8) Backlog CSV Row Count
- `_component-backlog.csv` rows: 91

## 9) SoC Evaluation Summary
- Batch 1.5 candidates: 20
- SoC HIGH: 12
- SoC LOW: 13
- SoC MEDIUM: 8
- SoC NONE: 26
- Monolith count: 33
- Projected NEW_SHARED_COMPONENT from Batch 1.5 splits: 8-10 shell candidates (table/list/filter/panel wrappers) after container extraction.

## 10) KEEP_APP_LOCAL Refactor Candidates
- Total KEEP_APP_LOCAL: 20
- KEEP_APP_LOCAL with HIGH/MEDIUM SoC potential: 0
- Top 3 (strategy + shell candidacy):
- `ProductSummaryCard` - strategy: prop-injection; shell candidate: NO (domain type and nested product semantics remain app-specific).
- `PlanCard` - strategy: prop-injection; shell candidate: NO (insurance package contract tightly bound to affiliate product flow).
- `TransactionDetailCard` - strategy: prop-injection; shell candidate: NO (transaction-specific data schema and formatting assumptions).


## Batch 1.5 Amendment

- Components split: 20
- Split components:
  - BenefitDialog -> BenefitDialogContainer + BenefitDialogShell
  - FilterProduct -> FilterProductContainer + FilterProductShell
  - FilterStatisticProduct -> FilterStatisticProductContainer + FilterStatisticProductShell
  - LayoutView -> LayoutViewContainer + LayoutViewShell
  - TransactionDetailView -> TransactionDetailViewContainer + TransactionDetailViewShell
  - SupportView -> SupportViewContainer + SupportViewShell
  - ContributionDetailView -> ContributionDetailViewContainer + ContributionDetailViewShell
  - ArrangeView -> ArrangeViewContainer + ArrangeViewShell
  - AffiliateFeeView -> AffiliateFeeViewContainer + AffiliateFeeViewShell
  - GwpView -> GwpViewContainer + GwpViewShell
  - ProductsView -> ProductsViewContainer + ProductsViewShell
  - TransactionView -> TransactionViewContainer + TransactionViewShell
  - ProductDetailView -> ProductDetailViewContainer + ProductDetailViewShell
  - ReportDetailView -> ReportDetailViewContainer + ReportDetailViewShell
  - FilterPlansView -> FilterPlansViewContainer + FilterPlansViewShell
  - DashboardLayoutRoute -> DashboardLayoutRouteContainer + DashboardLayoutRouteShell
  - CustomerView -> CustomerViewContainer + CustomerViewShell
  - AffiliatorView -> AffiliatorViewContainer + AffiliatorViewShell
  - MyTeamView -> MyTeamViewContainer + MyTeamViewShell
  - DashboardView -> DashboardViewContainer + DashboardViewShell
- NEW_SHARED_COMPONENT candidates from splits: 0
- KEEP_APP_LOCAL-only Shells: 20 (`BenefitDialogShell`, `FilterProductShell`, `FilterStatisticProductShell`, `LayoutViewShell`, `TransactionDetailViewShell`, `SupportViewShell`, `ContributionDetailViewShell`, `ArrangeViewShell`, `AffiliateFeeViewShell`, `GwpViewShell`, `ProductsViewShell`, `TransactionViewShell`, `ProductDetailViewShell`, `ReportDetailViewShell`, `FilterPlansViewShell`, `DashboardLayoutRouteShell`, `CustomerViewShell`, `AffiliatorViewShell`, `MyTeamViewShell`, `DashboardViewShell`)
- Remaining Batch 1.5 candidates explicitly skipped with reason: 0













