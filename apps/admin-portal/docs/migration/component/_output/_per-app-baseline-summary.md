# Admin Portal Per-App Baseline Summary (Phase 01 -> Phase 02)

## App Overview
- App: admin-portal
- Framework: Next.js App Router (next@15.4.8) + React 19
- UI baseline: app-local shadcn/Radix-style components under `src/components/ui/**` + legacy local wrappers under `src/components/**`
- Shared UI availability observed: `@repo/ui` currently exports only `Box`

## Component Count Summary
- Total components audited: 335
- KEEP_APP_LOCAL: 302
- NEW_SHARED_COMPONENT: 33

## P0/P1 Critical Needs for Shared UI
- `components/ui/DataTable/index` (table interactions, loading/empty states, pagination ergonomics)
- `components/ui/form` + field primitives (`input`, `select`, `textarea`)
- Overlay/navigation primitives (`dialog`, `dropdown-menu`, `navigation-menu`, `menubar`)
- Date and selection flows (`calendar`, `date-range-picker`, `combobox`, `command`, `Fields/SelectAutocomplete`)

## Top 5 Highest-Parity-Risk Items
- `components/ui/calendar` (HIGH): High interaction surface (states/events/keyboard) can regress without strict parity checks.
- `components/ui/combobox` (HIGH): High interaction surface (states/events/keyboard) can regress without strict parity checks.
- `components/ui/command` (HIGH): High interaction surface (states/events/keyboard) can regress without strict parity checks.
- `components/ui/DataTable/index` (HIGH): High interaction surface (states/events/keyboard) can regress without strict parity checks.
- `components/ui/date-range-picker` (HIGH): High interaction surface (states/events/keyboard) can regress without strict parity checks.

## EXTEND_EXISTING Components
- None in this batch. `@repo/ui` does not currently expose matching components beyond `Box`, so no extension targets were identified.

## NEW_SHARED_COMPONENT Specs (Props/Variants/States)
### components/ui/alert
- Props: semantic content + className + controlled value where applicable
- Variants: intent variants and size contract
- States: default, hover/focus-visible, active/selected/checked, disabled

### components/ui/badge
- Props: semantic content + className + controlled value where applicable
- Variants: intent variants and size contract
- States: default, hover/focus-visible, active/selected/checked, disabled

### components/ui/breadcrumb
- Props: semantic content + className + controlled value where applicable
- Variants: intent variants and size contract
- States: default, hover/focus-visible, active/selected/checked, disabled

### components/ui/button
- Props: children, variant, size, disabled, loading, leftIcon, rightIcon, asChild, className
- Variants: default, secondary, destructive, outline, ghost, link; sizes sm/md/lg
- States: default, hover, focus-visible, disabled, loading

### components/ui/calendar
- Props: value/defaultValue, onChange, locale, disabled dates, min/max constraints
- Variants: single vs range display; trigger/content size
- States: closed/open, selected, disabled day, keyboard navigation

### components/ui/card
- Props: semantic content + className + controlled value where applicable
- Variants: intent variants and size contract
- States: default, hover/focus-visible, active/selected/checked, disabled

### components/ui/checkbox
- Props: semantic content + className + controlled value where applicable
- Variants: intent variants and size contract
- States: default, hover/focus-visible, active/selected/checked, disabled

### components/ui/combobox
- Props: value, onValueChange, options/items, placeholder, disabled, searchable, emptyText
- Variants: size + trigger/content style variants
- States: closed/open, highlighted, selected, disabled, loading, empty

### components/ui/command
- Props: value, onValueChange, options/items, placeholder, disabled, searchable, emptyText
- Variants: size + trigger/content style variants
- States: closed/open, highlighted, selected, disabled, loading, empty

### components/ui/DataTable/index
- Props: data, columns, pagination model, loading, empty state, row actions
- Variants: density/size and bordered/unstyled modes
- States: loading, empty, paginated, disabled controls, sort/filter interactions

### components/ui/date-range-picker
- Props: value/defaultValue, onChange, locale, disabled dates, min/max constraints
- Variants: single vs range display; trigger/content size
- States: closed/open, selected, disabled day, keyboard navigation

### components/ui/dialog
- Props: open/defaultOpen, onOpenChange, trigger/content slots, className
- Variants: placement/size where applicable
- States: closed/open, focus trap, keyboard escape/navigation, disabled items

### components/ui/drewer
- Props: className, children, semantic value props as needed
- Variants: standardized variant + size naming (06-component-standards)
- States: default, hover, focus-visible, disabled, loading/error as applicable

### components/ui/dropdown-menu
- Props: open/defaultOpen, onOpenChange, trigger/content slots, className
- Variants: placement/size where applicable
- States: closed/open, focus trap, keyboard escape/navigation, disabled items

### components/ui/Fields/SelectAutocomplete/index
- Props: value, onValueChange, options/items, placeholder, disabled, searchable, emptyText
- Variants: size + trigger/content style variants
- States: closed/open, highlighted, selected, disabled, loading, empty

### components/ui/Fields/UploadFile/index
- Props: className, children, semantic value props as needed
- Variants: standardized variant + size naming (06-component-standards)
- States: default, hover, focus-visible, disabled, loading/error as applicable

### components/ui/form
- Props: field wrapper primitives, label/help/error slots, control wiring props
- Variants: spacing/size and validation intent
- States: pristine, dirty, validating, error, disabled, submitting

### components/ui/input
- Props: value, defaultValue, onChange, placeholder, disabled, error, className
- Variants: default/invalid/disabled styling contract, size tokens
- States: default, focus-visible, error, disabled, read-only

### components/ui/label
- Props: semantic content + className + controlled value where applicable
- Variants: intent variants and size contract
- States: default, hover/focus-visible, active/selected/checked, disabled

### components/ui/loading
- Props: className, children, semantic value props as needed
- Variants: standardized variant + size naming (06-component-standards)
- States: default, hover, focus-visible, disabled, loading/error as applicable

### components/ui/Loading/index
- Props: className, children, semantic value props as needed
- Variants: standardized variant + size naming (06-component-standards)
- States: default, hover, focus-visible, disabled, loading/error as applicable

### components/ui/menubar
- Props: open/defaultOpen, onOpenChange, trigger/content slots, className
- Variants: placement/size where applicable
- States: closed/open, focus trap, keyboard escape/navigation, disabled items

### components/ui/navigation-menu
- Props: open/defaultOpen, onOpenChange, trigger/content slots, className
- Variants: placement/size where applicable
- States: closed/open, focus trap, keyboard escape/navigation, disabled items

### components/ui/pagination
- Props: data, columns, pagination model, loading, empty state, row actions
- Variants: density/size and bordered/unstyled modes
- States: loading, empty, paginated, disabled controls, sort/filter interactions

### components/ui/popover
- Props: open/defaultOpen, onOpenChange, trigger/content slots, className
- Variants: placement/size where applicable
- States: closed/open, focus trap, keyboard escape/navigation, disabled items

### components/ui/radio-group
- Props: semantic content + className + controlled value where applicable
- Variants: intent variants and size contract
- States: default, hover/focus-visible, active/selected/checked, disabled

### components/ui/select
- Props: value, onValueChange, options/items, placeholder, disabled, searchable, emptyText
- Variants: size + trigger/content style variants
- States: closed/open, highlighted, selected, disabled, loading, empty

### components/ui/spinner
- Props: semantic content + className + controlled value where applicable
- Variants: intent variants and size contract
- States: default, hover/focus-visible, active/selected/checked, disabled

### components/ui/switch
- Props: semantic content + className + controlled value where applicable
- Variants: intent variants and size contract
- States: default, hover/focus-visible, active/selected/checked, disabled

### components/ui/table
- Props: data, columns, pagination model, loading, empty state, row actions
- Variants: density/size and bordered/unstyled modes
- States: loading, empty, paginated, disabled controls, sort/filter interactions

### components/ui/tabs
- Props: semantic content + className + controlled value where applicable
- Variants: intent variants and size contract
- States: default, hover/focus-visible, active/selected/checked, disabled

### components/ui/textarea
- Props: value, defaultValue, onChange, placeholder, disabled, error, className
- Variants: default/invalid/disabled styling contract, size tokens
- States: default, focus-visible, error, disabled, read-only

### components/ui/tooltip
- Props: open/defaultOpen, onOpenChange, trigger/content slots, className
- Variants: placement/size where applicable
- States: closed/open, focus trap, keyboard escape/navigation, disabled items

## Normalization Deltas (Most Critical)
- Standardize `variant` and `size` naming to 06-component-standards (e.g., `sm|md|lg`, `destructive`, `outline`, `ghost`).
- Remove app/framework coupling (`next/*` imports) from shared-candidate components via callbacks/slot props.
- Replace hardcoded colors/utility classes with token-driven styles and CVA-driven variants in shared candidates.

## Backlog CSV Row Count
- Rows (excluding header): 335
