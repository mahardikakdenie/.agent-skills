# Per-App Baseline Summary - ticket-portal

## App Overview
- Framework: Next.js App Router (upgraded to Next.js 16)
- Runtime: React 19 + TypeScript 5.9.2
- Styling/UI foundations: Tailwind CSS v4, Headless UI, local UI wrappers, @repo/ui (currently Box export only)

## Component Count Summary
- Total components audited: 158
- ADOPT_NOW: 0
- ADOPT_WITH_ADAPTER: 0
- EXTEND_EXISTING: 0
- NEW_SHARED_COMPONENT: 19
- KEEP_APP_LOCAL: 94
- MIGRATE_AFTER_SPLIT: 45

## Top 5 Highest-Parity-Risk Items
- KanbanPage (`src/app/(admin)/kanban/page.tsx`): Complex workflow states and status transitions are regression-sensitive.
- IdPage (`src/app/(admin)/tickets/detail/[id]/page.tsx`): Complex stateful behavior and interaction flow require strict parity checks.
- BoardColumn (`src/components/kanban/BoardColumn.tsx`): Complex workflow states and status transitions are regression-sensitive.
- KanbanHeader (`src/components/kanban/KanbanHeader.tsx`): Complex workflow states and status transitions are regression-sensitive.
- TaskCard (`src/components/kanban/TaskCard.tsx`): Complex workflow states and status transitions are regression-sensitive.

## Components that EXTEND_EXISTING
- None (current @repo/ui surface in this branch only exports `Box`).


## Components that are NEW_SHARED_COMPONENT (Visual Specs)
- Badge (Story group: Feedback): Props: variant/status, children; Variants: semantic status colors; States: default/soft/solid.
- Button (Story group: Buttons): Props: variant, color, icon, isLoading, disabled, children; Variants: filled/outlined + semantic colors; States: default, hover, loading, disabled.
- Calendar (Story group: Inputs): Props: selected date/range, month control; Variants: single/range support; States: selected, disabled date, focused date.
- Dropdown (Story group: Overlays): Props: options, value, onChange, disabled, placeholder; Variants: single/multi where applicable; States: default, open, selected, disabled, empty.
- Checkbox (Story group: Inputs): Props: checked, onChange, disabled, label; Variants: default; States: checked, unchecked, disabled, focus-visible.
- DatePickerIndex (Story group: Inputs): Props: selected date, onChange, year/month navigation, disabled dates; Variants: single date picker; States: open, selected, disabled, empty.
- Input (Story group: Inputs): Props: label, error, icon, iconPosition, inputMode; Variants: default/error/disabled; States: default, focus, disabled, error.
- InputPassword (Story group: Inputs): Props: label, error, disabled, toggle visibility; Variants: default/error/disabled; States: default, focus, hidden, visible, error.
- Label (Story group: Inputs): Props, variants, and states to be finalized in Phase 02 normalization.
- MultiSelect (Story group: Inputs): Props: options, value, onChange, disabled, placeholder; Variants: single/multi where applicable; States: default, open, selected, disabled, empty.
- Select (Story group: Inputs): Props: options, value, onChange, disabled, placeholder; Variants: single/multi where applicable; States: default, open, selected, disabled, empty.
- Switch (Story group: Inputs): Props: checked, onChange, disabled, label; Variants: default; States: checked, unchecked, disabled, focus-visible.
- Modal (Story group: Overlays): Props: open, onClose, title, footer/actions, size; Variants: centered dialog; States: open, closing, confirm/cancel, disabled actions.
- Notification (Story group: Feedback): Props: type, message, title, close action; Variants: success/error/info/warning; States: visible, dismissing.
- Skeleton (Story group: Feedback): Props: width/height/className; Variants: text, avatar, block; States: loading.
- DataTable (Story group: Data Display): Props: columns, rows/data, pagination metadata, loading/error handlers, row expansion hooks; Variants: striped/compact through className; States: loading, empty, error, expanded row.
- Pagination (Story group: Data Display): Props: structural slots + paging controls; Variants: header/body/footer; States: default, disabled buttons, active page.
- Table (Story group: Data Display): Props: structural slots + paging controls; Variants: header/body/footer; States: default, disabled buttons, active page.

## KEEP_APP_LOCAL Refactor Candidates
- Total KEEP_APP_LOCAL components: 87
- KEEP_APP_LOCAL with SoC potential HIGH or MEDIUM: 0
- Top 3: none (HIGH/MEDIUM candidates were reclassified as `MIGRATE_AFTER_SPLIT` per Batch 1 rule).

## SoC Evaluation Summary
- Total Batch 1.5 candidates: 45
- HIGH: 18
- MEDIUM: 27
- LOW: 0
- NONE: 105
- Monolith count: 45
- Projected NEW_SHARED_COMPONENT from Batch 1.5 splits: 27

## P0 Critical Needs
- Shared Button/Input/Select/Switch primitives to unblock systematic local UI replacement.
- Shared Modal + DataTable + Pagination primitives for ticket list/detail workflows.
- Shared DatePicker and Notification/Skeleton primitives for consistent interaction/feedback states.

## Normalization Deltas (Critical)
- Local props use non-standard names (e.g., `isLoading`, `filled/outlined`) and need normalization to shared conventions.
- Hardcoded color classes appear in local UI wrappers; migration must move these to tokenized variants.
- Mixed Headless UI/local patterns need convergence to one shared API contract in packages/ui.

## Backlog CSV Row Count
- 198 rows

## Batch 1.5 Amendment
- Components split: 24
- NEW_SHARED_COMPONENT candidates from splits: 0 (none)
- KEEP_APP_LOCAL-only Shells: 24 (AssigneTicketShell, DivisionRequesterShell, OpenTicketsShell, LiveTicketsShell, SlaSummaryShell, TicketOnDemandShell, SlaAchievedShell, StatusSummaryShell, TypeTrendShell, TasksViewShell, ProjectViewShell, ForgotPasswordShell, DivisionViewShell, ChangePasswordViewShell, ProfileViewShell, PublicPageShell, LoginViewShell, DashboardViewShell, CreateTasksViewShell, DetailTaskInTestingShell, DetailTaskTodoTestingShell, ReqesterFeedbackShell, TicketAttentionShell, DetailTaskViewShell)
- Explicitly skipped candidates: 21 (documented in _migration-log.md with reasons)
















## Legacy Update Amendment - 2026-03-04 13:40 (+07)
- Legacy intake summary:
  - RichTextEditor -> NEW_SHARED_COMPONENT (queued via L5)
  - 7 new components/pages -> KEEP_APP_LOCAL
- Updated totals:
  - Total components audited: 158
  - NEW_SHARED_COMPONENT: 19
  - KEEP_APP_LOCAL: 94
  - Backlog CSV rows: 206
## Legacy Update Amendment - 2026-03-05 10:02 (+07)
- Legacy intake summary:
  - 10 new routes/components documented from project epic feature drop
  - 3 queued as Batch 1.5 (`MIGRATE_AFTER_SPLIT`): `ProjectEpicView`, `EpicSidebar`, `ProjectTaskSidebar`
  - 7 classified as KEEP_APP_LOCAL (N/A batch)
  - No new shared candidate in this update (L4 path)
- Updated totals:
  - Total components audited: 168
  - NEW_SHARED_COMPONENT: 19
  - KEEP_APP_LOCAL: 101
  - MIGRATE_AFTER_SPLIT: 48
  - Backlog CSV rows: 216


## Batch 1.5 Amendment (2026-03-05)

- Legacy intake follow-up handled for epic workflow set.
- Marked as `SKIPPED` with explicit reasons:
  - `src/views/masterdata/project/epic/index.tsx`
  - `src/views/masterdata/project/epic/components/EpicSidebar.tsx`
  - `src/views/masterdata/project/epic/components/TaskSidebar.tsx`
- Rationale: defer split to dedicated follow-up tranche to reduce regression risk while feature is still in active legacy churn.
