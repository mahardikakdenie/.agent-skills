# Per-App Baseline Summary - teman-affiliate-admin

- Total components audited: 387
- Count per classification:
  - ADOPT_NOW: 0
  - ADOPT_WITH_ADAPTER: 0
  - EXTEND_EXISTING: 0
  - NEW_SHARED_COMPONENT: 61
  - KEEP_APP_LOCAL: 304
  - MIGRATE_AFTER_SPLIT: 22

## Top 5 Highest-Parity-Risk Items
- `src/app/(admin)/affiliate/affiliate-fee/[id]/page.tsx` - HIGH: High behavior risk due to domain state, table/filtering, or workflow conditions
- `src/app/(admin)/affiliate/affiliate-fee/page.tsx` - HIGH: High behavior risk due to domain state, table/filtering, or workflow conditions
- `src/app/(admin)/affiliate/affiliate-manager/[id]/page.tsx` - HIGH: High behavior risk due to domain state, table/filtering, or workflow conditions
- `src/app/(admin)/affiliate/affiliate-manager/add/page.tsx` - HIGH: High behavior risk due to domain state, table/filtering, or workflow conditions
- `src/app/(admin)/affiliate/affiliate-manager/page.tsx` - HIGH: High behavior risk due to domain state, table/filtering, or workflow conditions

## Components That EXTEND_EXISTING
- None in this app at current `@repo/ui` export surface (only `Box` exported).

## Components That Are NEW_SHARED_COMPONENT
- Buttons:
  - Button (`src/components/ui/button/Button.tsx`) - props/state audit required in Phase 02
- Data Display:
  - Avatar (`src/components/ui/avatar/Avatar.tsx`) - props/state audit required in Phase 02
  - NotAvailable (`src/components/ui/table/NotAvailable.tsx`) - props/state audit required in Phase 02
  - Retry (`src/components/ui/table/Retry.tsx`) - props/state audit required in Phase 02
  - Table (`src/components/ui/table/Table.tsx`) - props/state audit required in Phase 02
- Feedback:
  - Badge (`src/components/ui/badge/Badge.tsx`) - props/state audit required in Phase 02
  - Notification (`src/components/ui/notification/Notification.tsx`) - props/state audit required in Phase 02
  - Skeleton (`src/components/ui/skeleton/Skeleton.tsx`) - props/state audit required in Phase 02
- Inputs:
  - Checkbox (`src/components/ui/form/Checkbox.tsx`) - props/state audit required in Phase 02
  - DayPicker (`src/components/ui/form/DatePicker/DayPicker.tsx`) - props/state audit required in Phase 02
  - DatePicker (`src/components/ui/form/DatePicker/index.tsx`) - props/state audit required in Phase 02
  - YearPicker (`src/components/ui/form/DatePicker/YearPicker.tsx`) - props/state audit required in Phase 02
  - DateTimePicker (`src/components/ui/form/DateTimePicker.tsx`) - props/state audit required in Phase 02
  - Input (`src/components/ui/form/Input.tsx`) - props/state audit required in Phase 02
  - Label (`src/components/ui/form/Label.tsx`) - props/state audit required in Phase 02
  - Switch (`src/components/ui/form/Switch.tsx`) - props/state audit required in Phase 02
  - Textarea (`src/components/ui/form/Textarea.tsx`) - props/state audit required in Phase 02
  - Upload (`src/components/ui/form/upload.tsx`) - props/state audit required in Phase 02
- Misc:
  - Bars3 (`src/components/icons/Bars3.tsx`) - props/state audit required in Phase 02
  - Bars3CenterLeft (`src/components/icons/Bars3CenterLeft.tsx`) - props/state audit required in Phase 02
  - Calendar (`src/components/icons/Calendar.tsx`) - props/state audit required in Phase 02
  - Check (`src/components/icons/Check.tsx`) - props/state audit required in Phase 02
  - CheckCircle (`src/components/icons/CheckCircle.tsx`) - props/state audit required in Phase 02
  - ChevronDoubleLeft (`src/components/icons/ChevronDoubleLeft.tsx`) - props/state audit required in Phase 02
  - ChevronDoubleRight (`src/components/icons/ChevronDoubleRight.tsx`) - props/state audit required in Phase 02
  - ChevronDown (`src/components/icons/ChevronDown.tsx`) - props/state audit required in Phase 02
  - ChevronLeft (`src/components/icons/ChevronLeft.tsx`) - props/state audit required in Phase 02
  - ChevronRight (`src/components/icons/ChevronRight.tsx`) - props/state audit required in Phase 02
  - ChevronUp (`src/components/icons/ChevronUp.tsx`) - props/state audit required in Phase 02
  - Dashboard1 (`src/components/icons/dashboard/Dashboard1.tsx`) - props/state audit required in Phase 02
  - Dashboard2 (`src/components/icons/dashboard/Dashboard2.tsx`) - props/state audit required in Phase 02
  - Dashboard3 (`src/components/icons/dashboard/Dashboard3.tsx`) - props/state audit required in Phase 02
  - Dashboard4 (`src/components/icons/dashboard/Dashboard4.tsx`) - props/state audit required in Phase 02
  - Metrics1 (`src/components/icons/dashboard/Metrics1.tsx`) - props/state audit required in Phase 02
  - Metrics2 (`src/components/icons/dashboard/Metrics2.tsx`) - props/state audit required in Phase 02
  - Metrics3 (`src/components/icons/dashboard/Metrics3.tsx`) - props/state audit required in Phase 02
  - Document (`src/components/icons/Document.tsx`) - props/state audit required in Phase 02
  - Download (`src/components/icons/Download.tsx`) - props/state audit required in Phase 02
  - EllipsisHorizontal (`src/components/icons/EllipsisHorizontal.tsx`) - props/state audit required in Phase 02
  - ExclamationTriangle (`src/components/icons/ExclamationTriangle.tsx`) - props/state audit required in Phase 02
  - Eye (`src/components/icons/Eye.tsx`) - props/state audit required in Phase 02
  - Filter (`src/components/icons/Filter.tsx`) - props/state audit required in Phase 02
  - Import (`src/components/icons/Import.tsx`) - props/state audit required in Phase 02
  - InfoCircle (`src/components/icons/InfoCircle.tsx`) - props/state audit required in Phase 02
  - Loading (`src/components/icons/Loading.tsx`) - props/state audit required in Phase 02
  - Minus (`src/components/icons/Minus.tsx`) - props/state audit required in Phase 02
  - PencilSquare (`src/components/icons/PencilSquare.tsx`) - props/state audit required in Phase 02
  - Plus (`src/components/icons/Plus.tsx`) - props/state audit required in Phase 02
  - Power (`src/components/icons/Power.tsx`) - props/state audit required in Phase 02
  - Refresh (`src/components/icons/Refresh.tsx`) - props/state audit required in Phase 02
  - Search (`src/components/icons/Search.tsx`) - props/state audit required in Phase 02
  - Setting (`src/components/icons/Setting.tsx`) - props/state audit required in Phase 02
  - Default (`src/components/icons/sidebar/Default.tsx`) - props/state audit required in Phase 02
  - Trash (`src/components/icons/Trash.tsx`) - props/state audit required in Phase 02
  - XMark (`src/components/icons/XMark.tsx`) - props/state audit required in Phase 02
  - Timeline (`src/components/ui/timeline/Timeline.tsx`) - props/state audit required in Phase 02
- Overlays:
  - Drawer (`src/components/ui/drawer/Drawer.tsx`) - props/state audit required in Phase 02
  - Auth (`src/components/ui/modal/Auth.tsx`) - props/state audit required in Phase 02
  - Confirmation (`src/components/ui/modal/Confirmation.tsx`) - props/state audit required in Phase 02
  - Date (`src/components/ui/modal/Date.tsx`) - props/state audit required in Phase 02
  - Modal (`src/components/ui/modal/Modal.tsx`) - props/state audit required in Phase 02

## KEEP_APP_LOCAL Refactor Candidates
- Total KEEP_APP_LOCAL count: 304
- KEEP_APP_LOCAL with SoC HIGH/MEDIUM: 0
- Top 3 candidates:
  - None

## SoC Evaluation Summary
- Total Batch 1.5 candidates: 22
- Breakdown: HIGH 0 | MEDIUM 22 | LOW 298 | NONE 67
- Projected NEW_SHARED_COMPONENT from splits: 8 (estimate based on container-shell candidates)

## Notes
- `packages/ui/src/index.ts` currently exports only `Box`, so no direct ADOPT_NOW classifications were available in this audit pass.
- Hook-only files and non-UI utility/service/type files were excluded per Batch 1 rules.

## Batch 1.5 Amendment

- Components split: 22
- NEW_SHARED_COMPONENT candidates from splits: 8
  - BreadcrumbsShell
  - DropdownShell
  - DropdownItemShell
  - AutocompleteShell
  - InputMultipleShell
  - MultiSelectShell
  - SelectShell
  - PaginationShell
- KEEP_APP_LOCAL-only Shells: 14
