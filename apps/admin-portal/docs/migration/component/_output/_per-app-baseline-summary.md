# Admin Portal Per-App Baseline Summary (Batch 1)

## App Overview
- App: admin-portal (Next.js App Router + React + TypeScript + Tailwind + shadcn-style local primitives)
- Current shared UI surface from @repo/ui: Box export only on this branch snapshot

## Component Count Summary
- Total components audited: 267
- KEEP_APP_LOCAL: 233
- NEW_SHARED_COMPONENT: 34

## Top 5 Highest-Parity-Risk Items
- src/app/claim/history/page.tsx (KEEP_APP_LOCAL): Contains domain workflows, permissions, or API-driven state that should remain app-scoped. Includes Next.js-specific primitives that require framework-boundary handling.
- src/app/claim/list/detail/[id]/page.tsx (KEEP_APP_LOCAL): Contains domain workflows, permissions, or API-driven state that should remain app-scoped. Includes Next.js-specific primitives that require framework-boundary handling.
- src/app/claim/list/detail/[id]/upload-data/page.tsx (KEEP_APP_LOCAL): Contains domain workflows, permissions, or API-driven state that should remain app-scoped. Includes Next.js-specific primitives that require framework-boundary handling.
- src/app/claim/list/export/page.tsx (KEEP_APP_LOCAL): Contains domain workflows, permissions, or API-driven state that should remain app-scoped. Includes Next.js-specific primitives that require framework-boundary handling.
- src/app/claim/list/import/page.tsx (KEEP_APP_LOCAL): Contains domain workflows, permissions, or API-driven state that should remain app-scoped. Includes Next.js-specific primitives that require framework-boundary handling.

## Components Classified as EXTEND_EXISTING
- None in this batch snapshot (shared export surface currently only includes Box).

## NEW_SHARED_COMPONENT Visual Specs (props, variants, states)
- Alert (src/components/ui/alert.tsx): props = standard React + className props inferred from implementation; variants = variant; states = default, loading, success, warning, error.
- Badge (src/components/ui/badge.tsx): props = standard React + className props inferred from implementation; variants = variant; states = default, loading, success, warning, error.
- Breadcrumb (src/components/ui/breadcrumb.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = default, active, hover, focus, disabled.
- Button (src/components/ui/button.tsx): props = standard React + className props inferred from implementation; variants = variant, size; states = default, hover, focus-visible, disabled, loading.
- Calendar (src/components/ui/calendar.tsx): props = standard React + className props inferred from implementation; variants = variant; states = default, focus, invalid, disabled, read-only.
- Card (src/components/ui/card.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = default, responsive, nested content.
- Checkbox (src/components/ui/checkbox.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = default, focus, invalid, disabled, read-only.
- Combobox (src/components/ui/combobox.tsx): props = options, value, onChange, onSearch, placeholder, placeholderInput, className, newOptionText; variants = default variants; align with 06 standards (variant, size where applicable); states = default, focus, invalid, disabled, read-only.
- Command (src/components/ui/command.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = default, focus, invalid, disabled, read-only.
- DataTable (src/components/ui/DataTable/index.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = default, loading, empty, populated, overflow.
- DateRangePicker (src/components/ui/date-range-picker.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = default, focus, invalid, disabled, read-only.
- Dialog (src/components/ui/dialog.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = closed, open, focus-trap, dismiss, disabled trigger.
- Drewer (src/components/ui/drewer.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = closed, open, focus-trap, dismiss, disabled trigger.
- DropdownMenu (src/components/ui/dropdown-menu.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = closed, open, focus-trap, dismiss, disabled trigger.
- SelectAutocomplete (src/components/ui/Fields/SelectAutocomplete/index.tsx): props = value, onValueChange, options, placeholder, searchPlaceholder, onSearchChange, searchValue, disabled, loading, isSearching, className, triggerClassName, emptyText; variants = default variants; align with 06 standards (variant, size where applicable); states = default, focus, invalid, disabled, read-only.
- UploadFile (src/components/ui/Fields/UploadFile/index.tsx): props = accept, placeholder, className, onChange, onFileChange, file, base64, fileName; variants = default variants; align with 06 standards (variant, size where applicable); states = default, focus, invalid, disabled, read-only.
- Form (src/components/ui/form.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = default, focus, invalid, disabled, read-only.
- Input (src/components/ui/input.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = default, focus, invalid, disabled, read-only.
- Label (src/components/ui/label.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = default, focus, invalid, disabled, read-only.
- Loading (src/components/ui/loading.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = default, loading, success, warning, error.
- Loading (src/components/ui/Loading/index.tsx): props = children, isLoading, loadingText, loadingSize, loadingColor, overlay, fullScreen, className, loadingClassName; variants = default variants; align with 06 standards (variant, size where applicable); states = default, loading, success, warning, error.
- Menubar (src/components/ui/menubar.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = default, active, hover, focus, disabled.
- NavigationMenu (src/components/ui/navigation-menu.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = default, active, hover, focus, disabled.
- Pagination (src/components/ui/pagination.tsx): props = standard React + className props inferred from implementation; variants = variant; states = default, active, hover, focus, disabled.
- Popover (src/components/ui/popover.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = closed, open, focus-trap, dismiss, disabled trigger.
- RadioGroup (src/components/ui/radio-group.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = default, focus, invalid, disabled, read-only.
- Select (src/components/ui/select.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = default, focus, invalid, disabled, read-only.
- SelectPhoneCode (src/components/ui/select-phone-code.tsx): props = value, onChange; variants = default variants; align with 06 standards (variant, size where applicable); states = default, focus, invalid, disabled, read-only.
- Spinner (src/components/ui/spinner.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = default, loading, success, warning, error.
- Switch (src/components/ui/switch.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = default, focus, invalid, disabled, read-only.
- Table (src/components/ui/table.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = default, loading, empty, populated, overflow.
- Tabs (src/components/ui/tabs.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = default, active, hover, focus, disabled.
- Textarea (src/components/ui/textarea.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = default, focus, invalid, disabled, read-only.
- Tooltip (src/components/ui/tooltip.tsx): props = standard React + className props inferred from implementation; variants = default variants; align with 06 standards (variant, size where applicable); states = closed, open, focus-trap, dismiss, disabled trigger.

## KEEP_APP_LOCAL Salvage Candidates
- Total KEEP_APP_LOCAL: 233
- KEEP_APP_LOCAL rated HIGH or MEDIUM salvage potential: 38
- Top 3 salvage candidates:
- src/app/finance/billing/detail/[id]/components/BillingDetailActions.tsx - MEDIUM via slot - isolate reusable shell and pass domain-specific actions/content via slots
- src/app/finance/billing/detail/[id]/components/BillingDetailInfo.tsx - MEDIUM via slot - isolate reusable shell and pass domain-specific actions/content via slots
- src/app/layout.tsx - MEDIUM via slot - isolate reusable shell and pass domain-specific actions/content via slots

## Backlog CSV Row Count
- _component-backlog.csv rows (excluding header): 267
