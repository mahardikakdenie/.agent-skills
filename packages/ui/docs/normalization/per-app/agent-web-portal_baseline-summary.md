# Per-App Baseline Summary - agent-web-portal

Generated: 2026-02-24T08:20:00Z

## App Overview

- Framework: Next.js 16.1.0 (App Router), React 19.1.0, TypeScript 5.9.2
- Shared UI package status: `@repo/ui` dependency is present; current stable export coverage is still minimal for this app migration scope.
- Local UI footprint: route/view-heavy composition (`src/views`, `src/app`) plus app-local primitives (`src/components`) and icon assets (`src/images`).

## Component Count Summary

- Total components audited: 155
- ADOPT_NOW: 0
- ADOPT_WITH_ADAPTER: 0
- EXTEND_EXISTING: 0
- NEW_SHARED_COMPONENT: 21
- KEEP_APP_LOCAL: 117
- SPLIT (Batch 1.5 processed): 17

## P0 Critical Needs

- Button (NEW_SHARED_COMPONENT)
- DatePickerPopover (NEW_SHARED_COMPONENT)
- DatePicker (NEW_SHARED_COMPONENT)
- Modal (NEW_SHARED_COMPONENT)
- NotFound (NEW_SHARED_COMPONENT)

## New Shared Components Needed

- Breadcrumb, Button, ButtonCalendar
- Calendar, Checkbox, Combobox
- DatePicker, DatePickerDropdown, DatePickerPopover
- Input, Loader, Modal, MultipleSelect
- NoRecentData, NotFound, Pagination, Popover
- Select, Tabs, Textarea, Tooltip

## Extend Existing Needed

- None currently recorded in this app output.

## Normalization Deltas

- Prop naming and variant contracts are still inconsistent across local components and should be normalized to shared conventions.
- Date/filter/search patterns are duplicated across several views and should converge once shared primitives land.
- Export/report pages remain app-local and data-coupled by design.
- Batch 1.5 route-level monolith candidates were force-split into container/shell boundaries.

## High-Risk Parity Items (Top 5)

- AITopPicksListView (`apps/agent-web-portal/src/views/customer/ai-top-picks/list/list.view.tsx`)
- DashboardPerformance (`apps/agent-web-portal/src/views/dashboard/performance/performance.view.tsx`)
- DropOffListView (`apps/agent-web-portal/src/views/dashboard/drop-off/list.view.tsx`)
- LayoutView (`apps/agent-web-portal/src/views/layout/layout.view.tsx`)
- ProductListView (`apps/agent-web-portal/src/views/masterdata/product/list/list.view.tsx`)

## Backlog CSV Row Count

- 155 rows (excluding header: 155; including header: 156)

## SoC Evaluation Summary

- Batch 1.5 candidates remaining: 0
- SoC potential breakdown: HIGH=0, MEDIUM=0, LOW=1, NONE=154
- Monolith count: 18
- Projected NEW_SHARED_COMPONENT from completed splits: 0

## KEEP_APP_LOCAL Refactor Candidates

- KEEP_APP_LOCAL total: 117
- KEEP_APP_LOCAL with HIGH/MEDIUM SoC potential: 0
- Deferred high-risk KEEP_APP_LOCAL targets: None

## Batch 1.5 Amendment

- Components split: 17
- NEW_SHARED_COMPONENT candidates surfaced from splits: 0
- KEEP_APP_LOCAL-only Shells: 17
- Explicitly skipped Batch 1.5 candidates: 0
- Post-Batch-1.5 status: `batch_15_candidate = YES` remaining in backlog = 0
