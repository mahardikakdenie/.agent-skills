# Admin Portal Per-App Baseline Summary (Batch 1)

## App Overview

- Framework: Next.js App Router (React 19)
- Styling: Tailwind CSS v4 + local tokenized globals
- Shared UI baseline on this branch: `@repo/ui` currently exports `Box` only

## Component Count Summary

- Total components audited: **269**
- ADOPT_NOW: **0**
- ADOPT_WITH_ADAPTER: **0**
- EXTEND_EXISTING: **0**
- NEW_SHARED_COMPONENT: **34**
- KEEP_APP_LOCAL: **235**

## Top 5 Highest-Parity-Risk Items

- **BrokerFeeForm** (`src/components/forms/BrokerFeeForm/index.tsx`): Form validation/submission behavior is domain-coupled and high-risk to centralize now.
- **DateRangePicker** (`src/components/ui/date-range-picker.tsx`): Complex interaction/state parity risk (keyboard, focus, loading, empty/error states).
- **AddPage** (`src/app/product-category/[category]/add/page.tsx`): Route/view component ties UI to permissions, API state, and app routing.
- **DetailView** (`src/views/claim/detail/detail.view.tsx`): Route/view component ties UI to permissions, API state, and app routing.
- **HistoryPage** (`src/app/claim/history/page.tsx`): Route/view component ties UI to permissions, API state, and app routing.

## Components that EXTEND_EXISTING

- None identified in Batch 1 on this branch; `@repo/ui` export surface is minimal (Box only). 

## Components that are NEW_SHARED_COMPONENT (Visual Spec Inputs)

### Alert

- **Source:** `src/components/ui/alert.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default, outline, destructive (where applicable), size: sm/md/lg.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Badge

- **Source:** `src/components/ui/badge.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default, outline, destructive (where applicable), size: sm/md/lg.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Breadcrumb

- **Source:** `src/components/ui/breadcrumb.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Button

- **Source:** `src/components/ui/button.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default, outline, destructive (where applicable), size: sm/md/lg.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Calendar

- **Source:** `src/components/ui/calendar.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Card

- **Source:** `src/components/ui/card.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default, outline, destructive (where applicable), size: sm/md/lg.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Checkbox

- **Source:** `src/components/ui/checkbox.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default, outline, destructive (where applicable), size: sm/md/lg.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Combobox

- **Source:** `src/components/ui/combobox.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled, loading, empty, error.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Command

- **Source:** `src/components/ui/command.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled, loading, empty, error.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### DateRangePicker

- **Source:** `src/components/ui/date-range-picker.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled, loading, empty, error.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Dialog

- **Source:** `src/components/ui/dialog.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled, loading, empty, error.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Drewer

- **Source:** `src/components/ui/drewer.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### DropdownMenu

- **Source:** `src/components/ui/dropdown-menu.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### SelectAutocomplete

- **Source:** `src/components/ui/Fields/SelectAutocomplete/index.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled, loading, empty, error.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### UploadFile

- **Source:** `src/components/ui/Fields/UploadFile/index.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled, loading, empty, error.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Form

- **Source:** `src/components/ui/form.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### ImageOrDefault

- **Source:** `src/components/ui/image-or-default.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Input

- **Source:** `src/components/ui/input.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### JourneyVerticalImage

- **Source:** `src/components/ui/journey-vertical.image.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Label

- **Source:** `src/components/ui/label.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Loading

- **Source:** `src/components/ui/loading.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Loading

- **Source:** `src/components/ui/Loading/index.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Menubar

- **Source:** `src/components/ui/menubar.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### NavigationMenu

- **Source:** `src/components/ui/navigation-menu.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Pagination

- **Source:** `src/components/ui/pagination.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Popover

- **Source:** `src/components/ui/popover.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### RadioGroup

- **Source:** `src/components/ui/radio-group.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default, outline, destructive (where applicable), size: sm/md/lg.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Select

- **Source:** `src/components/ui/select.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled, loading, empty, error.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Spinner

- **Source:** `src/components/ui/spinner.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Switch

- **Source:** `src/components/ui/switch.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default, outline, destructive (where applicable), size: sm/md/lg.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Table

- **Source:** `src/components/ui/table.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled, loading, empty, error.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Tabs

- **Source:** `src/components/ui/tabs.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default, outline, destructive (where applicable), size: sm/md/lg.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Textarea

- **Source:** `src/components/ui/textarea.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

### Tooltip

- **Source:** `src/components/ui/tooltip.tsx`
- **Props:** preserve current local props; normalize to shared naming conventions (variant/size/disabled/loading/onChange).
- **Variants:** default + context-specific visual variants.
- **States:** default, hover, focus-visible, disabled.
- **Accessibility:** keyboard navigation, focus ring parity, ARIA attributes for interactive parts.

## Backlog CSV Row Count

- Rows (excluding header): **269**
