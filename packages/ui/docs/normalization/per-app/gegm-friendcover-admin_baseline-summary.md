# Batch 1 Per-App Baseline Summary - gegm-friendcover-admin

## App overview
- Framework: Next.js App Router (Next.js 16)
- Language: TypeScript + React 19
- Local UI footprint: app-local primitives under `src/components/ui`, feature views under `src/views`, route wrappers under `src/app`
- Current `@repo/ui` usage baseline: `Box` is available and used in Batch 1.5 shells

## Component count summary
- Total components audited: **178**
- ADOPT_NOW: 0 | ADOPT_WITH_ADAPTER: 0 | EXTEND_EXISTING: 0 | NEW_SHARED_COMPONENT: 15 | KEEP_APP_LOCAL: 114 | MIGRATE_AFTER_SPLIT: 34 | SPLIT: 15

## Top 5 highest-parity-risk items
- `src/components/ui/custom/CustomFilterDate.tsx` (MIGRATE_AFTER_SPLIT) - preserve exact interaction/state/render behavior
- `src/components/ui/custom/CustomMultipleSelect.tsx` (MIGRATE_AFTER_SPLIT) - preserve exact interaction/state/render behavior
- `src/components/ui/custom/CustomNestedSelect.tsx` (MIGRATE_AFTER_SPLIT) - preserve exact interaction/state/render behavior
- `src/components/ui/form/Checkbox.tsx` (NEW_SHARED_COMPONENT) - preserve exact interaction/state/render behavior
- `src/components/ui/form/DatePicker/DayPicker.tsx` (NEW_SHARED_COMPONENT) - preserve exact interaction/state/render behavior

## Components that EXTEND_EXISTING
- None

## Components that are NEW_SHARED_COMPONENT (visual spec handoff)
- UiBadgeBadge (`src/components/ui/badge/Badge.tsx`)
- UiButtonButton (`src/components/ui/button/Button.tsx`)
- UiDropdownDropdown (`src/components/ui/dropdown/Dropdown.tsx`)
- UiFormCheckbox (`src/components/ui/form/Checkbox.tsx`)
- UiFormDatePickerDayPicker (`src/components/ui/form/DatePicker/DayPicker.tsx`)
- UiFormDatePickerView (`src/components/ui/form/DatePicker/index.tsx`)
- UiFormDatePickerYearPicker (`src/components/ui/form/DatePicker/YearPicker.tsx`)
- UiFormInput (`src/components/ui/form/Input.tsx`)
- UiFormLabel (`src/components/ui/form/Label.tsx`)
- UiFormSwitch (`src/components/ui/form/Switch.tsx`)
- UiModalModal (`src/components/ui/modal/Modal.tsx`)
- UiNotificationNotification (`src/components/ui/notification/Notification.tsx`)
- UiSkeletonSkeleton (`src/components/ui/skeleton/Skeleton.tsx`)
- UiTableRetry (`src/components/ui/table/Retry.tsx`)
- UiTableTable (`src/components/ui/table/Table.tsx`)

## KEEP_APP_LOCAL refactor candidates
- Total KEEP_APP_LOCAL count: 114
- KEEP_APP_LOCAL with SoC potential HIGH or MEDIUM: 7
- LayoutsAppMenu: strategy=prop-injection; Shell as packages/ui candidate: NO
- LayoutsAppSidebar: strategy=render-prop; Shell as packages/ui candidate: NO
- LayoutsAppUnauthorized: strategy=render-prop; Shell as packages/ui candidate: NO

## SoC Evaluation Summary
- Total Batch 1.5 candidates processed: 15
- SoC breakdown: HIGH=0, MEDIUM=41, LOW=2, NONE=135
- Monolith count: 43
- Projected NEW_SHARED_COMPONENT from splits: 0

## Backlog CSV row count
- Rows (excluding header): 178

## Batch 1.5 Amendment
- Components split: 15
- NEW_SHARED_COMPONENT candidates from splits: 0
- KEEP_APP_LOCAL-only Shells: 15
- Batch 1.5 skipped MEDIUM candidates: 41 (documented in migration log)
## Legacy Update Amendment - 2026-03-04 11:38 (+07)

- Legacy update integrated via `integrate-app/gegm-friendcover-admin` -> `migrate-app/gegm-friendcover-admin`.
- Delta only touched existing dashboard files (type + card + hook), without adding new component files.
- No shared-component intake candidate introduced (`L5` not required).
- Baseline counters unchanged:
  - Total components audited: 178
  - NEW_SHARED_COMPONENT: 15
  - KEEP_APP_LOCAL: 114
  - MIGRATE_AFTER_SPLIT: 34
  - SPLIT: 15