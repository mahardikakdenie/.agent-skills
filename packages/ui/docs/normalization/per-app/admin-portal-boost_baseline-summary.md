# Per-App Baseline Summary - admin-portal-boost (Batch 1)

## App overview
- Framework: Next.js ^16.1.6 (App Router)
- Runtime stack: React ^19.2.4, TypeScript 5.9.2, Tailwind ^4.1.18
- UI baseline: extensive app-local shadcn-style primitives under `src/components/ui` plus route-scoped business components/forms.

## Component count summary
- Total components audited: 68
- ADOPT_NOW: 0
- ADOPT_WITH_ADAPTER: 0
- EXTEND_EXISTING: 0
- NEW_SHARED_COMPONENT: 28
- KEEP_APP_LOCAL: 24
- MIGRATE_AFTER_SPLIT (Batch 1.5): 16

## P0 critical needs
- Complete Batch 1.5 splits for product-catalog and partner-management monoliths before any shared extraction to avoid coupling domain hooks into shared APIs.
- Preserve parity for high-risk form flows (`package.form`, `benefit.form`, `detail.form`, `product-category.form`) during SoC refactor.
- Keep route-level authorization and permission checks behaviorally identical while refactoring containers.

## Top 5 highest-parity-risk items
- `src/app/protected/masterdata/partner-management/[id]/edit/assign-plan.tsx` (HIGH) - Initial class KEEP_APP_LOCAL; SoC split required before final migration classification.
- `src/app/protected/product-catalog/[category]/[id]/benefit-list.tsx` (HIGH) - Initial class KEEP_APP_LOCAL; SoC split required before final migration classification.
- `src/app/protected/product-catalog/[category]/[id]/channel-list.tsx` (HIGH) - Initial class KEEP_APP_LOCAL; SoC split required before final migration classification.
- `src/app/protected/product-catalog/[category]/[id]/detail-list.tsx` (HIGH) - Initial class KEEP_APP_LOCAL; SoC split required before final migration classification.
- `src/app/protected/product-catalog/[category]/[id]/package-list.tsx` (HIGH) - Initial class KEEP_APP_LOCAL; SoC split required before final migration classification.

## Components that EXTEND_EXISTING
- None in current branch state (current `@repo/ui` export surface is only `Box`).

## Components that are NEW_SHARED_COMPONENT (visual spec: props, variants, states)
### Alert
- Props: variant, title, description, className, children
- Variants: default | destructive
- States: default, emphasis, error
### Badge
- Props: variant, className, children
- Variants: default | secondary | destructive | outline
- States: default, muted, emphasis
### Breadcrumb
- Props: items, separator, className
- Variants: standard trail
- States: default, hover, focus-visible, current-page
### Button
- Props: variant, size, asChild, disabled, className, children
- Variants: default | destructive | outline | secondary | ghost | link
- States: default, hover, focus-visible, disabled
### Calendar
- Props: selected, mode, onSelect, disabled, className
- Variants: single | multiple | range
- States: default, selected, outside, disabled
### Card
- Props: className, children, slot subcomponents
- Variants: base card with header/content/footer slots
- States: default, elevated, bordered
### Checkbox
- Props: checked, onCheckedChange, disabled, className
- Variants: default
- States: unchecked, checked, indeterminate, disabled
### Combobox
- Props: options, value, onChange, placeholder, allowCreate
- Variants: single select with command palette
- States: default, open, selected, empty
### Command
- Props: open, onOpenChange, value, onValueChange, children
- Variants: inline | dialog
- States: default, searching, empty
### Date Range Picker
- Props: value, onDateChange, minDate, maxDate
- Variants: dropdown range selector
- States: closed, open, range-selected
### Dialog
- Props: open, onOpenChange, title, description, children
- Variants: modal shell with header/footer slots
- States: closed, open, focus-trap
### Drewer
- Props: open, onOpenChange, direction, children
- Variants: bottom sheet / drawer
- States: closed, open, drag
### Dropdown Menu
- Props: items, align, sideOffset, children
- Variants: context and action menu
- States: closed, open, highlighted, disabled item
### Form
- Props: control, name, label, description, children
- Variants: field wrappers and validation slots
- States: default, error, disabled
### Input
- Props: type, value, onChange, placeholder, className
- Variants: text input baseline
- States: default, focus, disabled, invalid
### Label
- Props: variant, htmlFor, className, children
- Variants: default label styles
- States: default, muted, required
### Menubar
- Props: menus, value, onValueChange, children
- Variants: horizontal command menu
- States: default, open, highlighted
### Navigation Menu
- Props: items, viewport, orientation, className
- Variants: top-nav with dropdown content
- States: default, open, active, focus-visible
### Pagination
- Props: page, totalPages, onPageChange, siblingCount
- Variants: numeric pagination controls
- States: default, active-page, disabled-nav
### Popover
- Props: open, onOpenChange, trigger, content, align
- Variants: floating content shell
- States: closed, open, focus-managed
### Radio Group
- Props: value, onValueChange, options, disabled
- Variants: default radio group
- States: unchecked, checked, disabled
### Select
- Props: value, onValueChange, options, placeholder, disabled
- Variants: single select trigger/content
- States: closed, open, selected, disabled
### Spinner
- Props: size, className, label
- Variants: sm | md | lg
- States: loading
### Switch
- Props: checked, onCheckedChange, disabled, className
- Variants: default switch
- States: off, on, disabled
### Table
- Props: columns, rows, className, children slots
- Variants: table primitives (header/body/footer)
- States: default, empty, hover-row
### Tabs
- Props: value, defaultValue, onValueChange, items
- Variants: line tab list and tab panels
- States: inactive, active, focus-visible
### Textarea
- Props: value, onChange, rows, placeholder, className
- Variants: default textarea
- States: default, focus, disabled, invalid
### Tooltip
- Props: content, side, align, delayDuration, children
- Variants: hover/focus tooltip
- States: closed, open

## KEEP_APP_LOCAL refactor candidates
- Total KEEP_APP_LOCAL count (initial before Batch 1.5 reclassification): 40
- KEEP_APP_LOCAL with SoC HIGH or MEDIUM: 16
- Top 3 candidates:
- `src/app/protected/masterdata/partner-management/[id]/edit/assign-plan.tsx` - SoC HIGH; strategy hook-extraction; Shell packages/ui candidate: NO
- `src/app/protected/product-catalog/[category]/[id]/benefit-list.tsx` - SoC HIGH; strategy hook-extraction; Shell packages/ui candidate: NO
- `src/app/protected/product-catalog/[category]/[id]/channel-list.tsx` - SoC HIGH; strategy hook-extraction; Shell packages/ui candidate: NO

## SoC Evaluation Summary
- Batch 1.5 candidates: 16
- SoC breakdown: HIGH 8 | MEDIUM 8 | LOW 3 | NONE 49
- Monolith count: 19
- Projected NEW_SHARED_COMPONENT from Batch 1.5 splits: 0

## Normalization deltas (critical)
- App has mixed primitive quality: modern CVA/Radix primitives coexist with route-level components that still use hardcoded colors and direct browser APIs (`alert`, `confirm`, `window.location.reload`).
- `react-router-dom` hooks are still used in some Next.js routes (`user-groups`, `user-roles`), indicating boundary cleanup needed during Batch 1.5.
- Next.js primitives (`next/link`, `next/image`) are embedded in app shell components; sharing requires abstraction via props/slots, not direct framework imports in shared package code.

## Backlog CSV row count
- Rows written: 84

## Notes for Phase 02 reconciliation
- Current audit intentionally records many NEW_SHARED primitive candidates because app-local UI primitives are not yet represented in `@repo/ui` exports on this branch.
- Final shared roadmap should de-duplicate primitives by consolidation gate before implementation batches.
## Batch 1.5 Amendment
- Components split: 16
- NEW_SHARED_COMPONENT candidates from splits: 0
- KEEP_APP_LOCAL-only Shells: 16
- `Assign Plan Shell`
- `User Groups Shell`
- `User Roles Shell`
- `Benefit List Shell`
- `Channel List Shell`
- `Detail List Shell`
- `Package List Shell`
- `Product Selection Modal Shell`
- `Benefit Form Shell`
- `Detail Form Shell`
- `Package Form Shell`
- `Product Category Form Shell`
- `Product Category Sidebar Shell`
- `ClientLayout Shell`
- `Header Shell`
- `Sidebar Shell`

