# Per-App Baseline Summary - affiliate-admin

## Totals
- Total components audited: 88
- Count per classification:
- ADOPT_NOW: 0
- ADOPT_WITH_ADAPTER: 0
- EXTEND_EXISTING: 0
- NEW_SHARED_COMPONENT: 11
- KEEP_APP_LOCAL: 54
- MIGRATE_AFTER_SPLIT: 23

## Top 5 Highest-Parity-Risk Items
- `src/views/transaction/export/export.view.tsx` - HIGH: High behavior surface (async data, filters/actions, and route transitions).
- `src/views/plan/detail/detail.view.tsx` - HIGH: High behavior surface (async data, filters/actions, and route transitions).
- `src/views/home/home.view.tsx` - HIGH: High behavior surface (async data, filters/actions, and route transitions).
- `src/views/claim/list/list.view.tsx` - HIGH: High behavior surface (async data, filters/actions, and route transitions).
- `src/views/claim/detail/detail.view.tsx` - HIGH: High behavior surface (async data, filters/actions, and route transitions).

## EXTEND_EXISTING Gaps
- No EXTEND_EXISTING components in this app for Batch 1 baseline.

## NEW_SHARED_COMPONENT Visual Specs
- `src/components/button.tsx` (Buttons): Props: `onClick`, `children`, `variant`, `disabled`, `withIcon`, `additionalClassName`. Variants: default, destructive, warning. States: default, hover, disabled, icon-leading.
- `src/components/chart.tsx` (Data Display): Props: type, data, options, width/height/minSize. Variants: stacked-bar, curve-line, doughnut, pie. States: empty data, normal render, responsive container resize.
- `src/components/datepicker.tsx` (Inputs): Props: label/title, min/max date, disabled, shadow/border/background controls, error, callbacks. Variants: inline trigger style with popover selector. States: closed/open, invalid date, min-date blocked, cleared, saved.
- `src/components/form-input.tsx` (Inputs): Props: name, label, inputType, initialValue, options, disable flags, callbacks. Variants: text, number, date, select, multiple-select. States: value change, disabled, forced date clear.
- `src/components/image-or-default.tsx` (Data Display): Props: src, alt, width/height, click handler, class overrides, fallback text, priority. Variants: image-present vs fallback text tile. States: image available/unavailable, clickable/non-clickable.
- `src/components/input.tsx` (Inputs): Props: value, type, onChange, onEnter, disabled, currency options, file upload hooks, error message. Variants: bordered/shadow, text/number/file, currency mode. States: empty, focused, disabled, error, clearable.
- `src/components/modal.tsx` (Overlays): Props: isOpen, onClose, children, width/height class overrides, backdrop/content colors, style override. Variants: fullscreen constrained width, custom backdrop. States: closed/open with body scroll lock.
- `src/components/multiple-select.tsx` (Inputs): Props: list, listValue, onChange, modal title, label overrides, disable flag. Variants: list with optional secondary column. States: modal closed/open, selected items, disabled remove/add.
- `src/components/pagination.tsx` (Navigation): Props: totalData, currentPage, onPageChange, onItemsPerPageChange, options. Variants: responsive stacked/inline controls. States: first/last-page disabled arrows, page-size changed.
- `src/components/select.tsx` (Inputs): Props: value, onChange, options/allOptions, disabled, placeholder, icon, visual overrides. Variants: bordered/borderless, placeholder-priority mode. States: closed/open, selected, disabled, error, drop-up.
- `src/components/textarea.tsx` (Inputs): Props: value, onChange, disabled, max/min length, placeholder, clear action, error. Variants: bordered/shadow, custom height. States: empty, typing, disabled, error, clearable.

## KEEP_APP_LOCAL Refactor Candidates
- Total KEEP_APP_LOCAL count: 54
- KEEP_APP_LOCAL with SoC potential HIGH or MEDIUM: 0
- Top 3 candidates: none (all HIGH/MEDIUM SoC items are flagged as MIGRATE_AFTER_SPLIT).

## SoC Evaluation Summary
- Total Batch 1.5 candidates: 23
- HIGH: 8
- MEDIUM: 15
- LOW: 3
- NONE: 62
- Projected NEW_SHARED_COMPONENT from splits:
- `DashboardMetricCardsShell` (from dashboard/summary views after container-shell split).
- `ReportTableShell` (from list/export route views with shared table/header/pagination shell).
- `DetailPageSectionShell` (from detail views after domain mapping extraction).
- `AuthAwareAppShell` (from layout view once auth/session logic is extracted from presentational nav shell).

## Batch 1.5 Amendment
- Components split: 23
- NEW_SHARED_COMPONENT candidates from splits: 1
- `OptimizeImageShell` (`src/components/optimize-image-shell.tsx`)
- KEEP_APP_LOCAL-only Shells: 22
- `ConfigurationCommissionRateViewShell` (`src/views/configuration/commission-rate/ConfigurationCommissionRateViewShell.tsx`)
- `AddPlanViewShell` (`src/views/plan/add/AddPlanViewShell.tsx`)
- `RevenueViewShell` (`src/views/transaction/revenue/RevenueViewShell.tsx`)
- `CampaignAddViewShell` (`src/views/campaign/add/CampaignAddViewShell.tsx`)
- `CampaignDetailViewShell` (`src/views/campaign/detail/CampaignDetailViewShell.tsx`)
- `CampaignListViewShell` (`src/views/campaign/list/CampaignListViewShell.tsx`)
- `ClaimDetailViewShell` (`src/views/claim/detail/ClaimDetailViewShell.tsx`)
- `ClaimExportViewShell` (`src/views/claim/export/ClaimExportViewShell.tsx`)
- `ClaimListViewShell` (`src/views/claim/list/ClaimListViewShell.tsx`)
- `ConfigurationCommissionRateDetailViewShell` (`src/views/configuration/commission-rate/detail/ConfigurationCommissionRateDetailViewShell.tsx`)
- `HomeViewShell` (`src/views/home/HomeViewShell.tsx`)
- `LayoutViewShell` (`src/views/layout/LayoutViewShell.tsx`)
- `MasterdataProductViewShell` (`src/views/masterdata/product/MasterdataProductViewShell.tsx`)
- `PlanDetailViewShell` (`src/views/plan/detail/PlanDetailViewShell.tsx`)
- `PlanListViewShell` (`src/views/plan/list/PlanListViewShell.tsx`)
- `UploadPlanViewShell` (`src/views/plan/upload/UploadPlanViewShell.tsx`)
- `PolicyDetailViewShell` (`src/views/policy/detail/PolicyDetailViewShell.tsx`)
- `PolicyExportViewShell` (`src/views/policy/export/PolicyExportViewShell.tsx`)
- `PolicyListViewShell` (`src/views/policy/list/PolicyListViewShell.tsx`)
- `CountriesViewShell` (`src/views/transaction/countries/CountriesViewShell.tsx`)
- `TransactionExportViewShell` (`src/views/transaction/export/TransactionExportViewShell.tsx`)
- `TransactionListViewShell` (`src/views/transaction/list/TransactionListViewShell.tsx`)
- Explicitly skipped this run (0): none.
