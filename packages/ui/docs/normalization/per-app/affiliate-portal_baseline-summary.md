# Per-App Baseline Summary - affiliate-portal

## Audit Coverage

- Total components audited: 38
- Audited source sets: `src/components/**`, `src/views/**`, `src/app/**`
- Excluded from audit scope as non-component/static assets: `src/images/**`, `src/constants/**`, `src/context/**`, `src/helpers/**`, `src/lib/**`

## Classification Breakdown

- ADOPT_NOW: 0
- ADOPT_WITH_ADAPTER: 0
- EXTEND_EXISTING: 0
- NEW_SHARED_COMPONENT: 9
- KEEP_APP_LOCAL: 22
- MIGRATE_AFTER_SPLIT: 7

## Top 5 Highest-Parity-Risk Items

- Button (src/components/button.tsx): Disabled/hover/icon spacing parity required.
- DatePicker (src/components/datepicker.tsx): Validation and save/clear flow must match.
- Input (src/components/input.tsx): Currency formatting and Enter callback parity.
- Modal (src/components/modal.tsx): Close semantics + body lock + animations parity.
- Select (src/components/select.tsx): Open/close and option state behavior parity.

## EXTEND_EXISTING Components

- None in this app (current `@repo/ui` export surface is `Box` only).

## NEW_SHARED_COMPONENT Specs

### Button (`story_group: Buttons`)
- Props: variant, size, disabled, onClick, children, optional icon slot.
- States: default, hover, disabled, icon-aligned.

### Input (`story_group: Inputs`)
- Props: value, onChange, onEnter, placeholder, disabled, error, icon, clearable, currency mode.
- States: default, focus, disabled, error, clearable.

### TextArea (`story_group: Inputs`)
- Props: value, onChange, placeholder, disabled, maxLength/minLength, error, clearable.
- States: default, focus, disabled, error.

### Select (`story_group: Inputs`)
- Props: value, onValueChange, options, placeholder, disabled, icon, error.
- States: closed, open, selected, disabled, error.

### DatePicker (`story_group: Inputs`)
- Props: value, onChange, minDate, maxDate, onClear, onSave, disabled, error.
- States: closed/open, partial/complete selection, invalid date, disabled.

### Modal (`story_group: Overlays`)
- Props: open, onOpenChange, position, children, style overrides.
- States: entering/open/closing/closed.

### Pagination (`story_group: Navigation`)
- Props: currentPage, totalItems, pageSize, onPageChange, onPageSizeChange.
- States: first/prev disabled, next/last disabled.

### Tabs (`story_group: Navigation`)
- Props: tabs, activeIndex, onChange.
- States: inactive, active, switched.

### HeaderModalBottom (`story_group: Layout`)
- Props: title.
- States: static display.

## KEEP_APP_LOCAL Refactor Candidates

- Total KEEP_APP_LOCAL count: 22
- KEEP_APP_LOCAL with SoC potential HIGH or MEDIUM: 0
- Top 3 KEEP_APP_LOCAL refactor opportunities (all LOW, no Batch 1.5 requirement):
- LayoutView - strategy: none (framework-bound app shell). Shell candidate for `packages/ui`: NO.
- ProductsView - strategy: none (domain mutation workflow). Shell candidate for `packages/ui`: NO.
- AddSchemeView - strategy: none (domain create flow). Shell candidate for `packages/ui`: NO.

## SoC Evaluation Summary

- Batch 1.5 candidates total: 7
- HIGH: 5
- MEDIUM: 2
- LOW: 10
- NONE: 21
- Monolith count: 21
- Projected NEW_SHARED_COMPONENT from Batch 1.5 splits: 3-5 (pending split output quality).

## Batch 1.5 Queue (MIGRATE_AFTER_SPLIT)

- FilterMasterCertView (src/views/dashboard/filter/filter-master-cert.view.tsx) - HIGH - strategy: container-shell
- FilterSchemeView (src/views/dashboard/filter/filter-scheme.view.tsx) - HIGH - strategy: container-shell
- FilterStatisticView (src/views/dashboard/filter/filter-statistic.view.tsx) - HIGH - strategy: container-shell
- NotificationListView (src/views/dashboard/notification/notification-list.view.tsx) - MEDIUM - strategy: container-shell
- DetailHotLeadsView (src/views/dashboard/product/detail-hot-leads.view.tsx) - HIGH - strategy: container-shell
- DetailPlanView (src/views/dashboard/scheme/detail-plan.view.tsx) - HIGH - strategy: container-shell
- TransactionView (src/views/dashboard/transaction/transaction.view.tsx) - MEDIUM - strategy: container-shell

## Verification

- Backlog CSV row count: 45
- Post Batch 1.5 note: backlog tracks originals + shell rows; audit also includes container records.

## Batch 1.5 Amendment

- Components split: 7
- NEW_SHARED_COMPONENT candidates from splits: 0
- KEEP_APP_LOCAL-only Shells: 7
- Split components:
  - FilterMasterCertView
  - FilterSchemeView
  - FilterStatisticView
  - NotificationListView
  - DetailHotLeadsView
  - DetailPlanView
  - TransactionView
- KEEP_APP_LOCAL Shells:
  - FilterMasterCertShell
  - FilterSchemeShell
  - FilterStatisticShell
  - NotificationListShell
  - DetailHotLeadsShell
  - DetailPlanShell
  - TransactionViewShell

