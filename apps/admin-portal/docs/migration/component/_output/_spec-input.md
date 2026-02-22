# Admin Portal Spec Input (Batch 1)

- Generated from `docs/migration/component/_output/_component-backlog.csv` for Phase 01 handoff.
- Scope: `NEW_SHARED_COMPONENT` and `EXTEND_EXISTING` only.

## Summary

- Total entries: **34**
- NEW_SHARED_COMPONENT: **34**
- EXTEND_EXISTING: **0**

### Alert

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/alert.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Alert />
```

### Badge

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/badge.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default, outline, destructive (where applicable), size: sm/md/lg
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Badge />
```

### Breadcrumb

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/breadcrumb.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Breadcrumb />
```

### Button

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/button.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default, outline, destructive (where applicable), size: sm/md/lg
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Button />
```

### Calendar

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/calendar.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Calendar />
```

### Card

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/card.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default, outline, destructive (where applicable), size: sm/md/lg
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Card />
```

### Checkbox

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/checkbox.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default, outline, destructive (where applicable), size: sm/md/lg
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Checkbox />
```

### Combobox

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/combobox.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled, loading, empty, error
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Combobox />
```

### Command

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/command.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled, loading, empty, error
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Command />
```

### DateRangePicker

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/date-range-picker.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled, loading, empty, error
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<DateRangePicker />
```

### Dialog

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/dialog.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled, loading, empty, error
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Dialog />
```

### Drewer

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/drewer.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Drewer />
```

### DropdownMenu

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/dropdown-menu.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<DropdownMenu />
```

### SelectAutocomplete

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/Fields/SelectAutocomplete/index.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled, loading, empty, error
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<SelectAutocomplete />
```

### UploadFile

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/Fields/UploadFile/index.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled, loading, empty, error
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<UploadFile />
```

### Form

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/form.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled, loading, empty, error
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Form />
```

### ImageOrDefault

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/image-or-default.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<ImageOrDefault />
```

### Input

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/input.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Input />
```

### JourneyVerticalImage

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/journey-vertical.image.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<JourneyVerticalImage />
```

### Label

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/label.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Label />
```

### Loading

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/loading.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Loading />
```

### Loading

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/Loading/index.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Loading />
```

### Menubar

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/menubar.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Menubar />
```

### NavigationMenu

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/navigation-menu.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<NavigationMenu />
```

### Pagination

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/pagination.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Pagination />
```

### Popover

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/popover.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Popover />
```

### RadioGroup

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/radio-group.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default, outline, destructive (where applicable), size: sm/md/lg
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<RadioGroup />
```

### Select

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/select.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled, loading, empty, error
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Select />
```

### Spinner

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/spinner.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Spinner />
```

### Switch

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/switch.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default, outline, destructive (where applicable), size: sm/md/lg
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Switch />
```

### Table

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/table.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled, loading, empty, error
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Table />
```

### Tabs

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/tabs.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default, outline, destructive (where applicable), size: sm/md/lg
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Tabs />
```

### Textarea

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/textarea.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Textarea />
```

### Tooltip

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `src/components/ui/tooltip.tsx`
- **API Intent:** Keep current app behavior/API expectations; normalize naming to shared conventions (`variant`, `size`, `disabled`, `loading`, event handlers) with no runtime behavior change.
- **Visual spec:** Match current visual output used in admin-portal; token-level standardization is allowed, but no layout/interaction regressions.
- **Accessibility:** Preserve keyboard support, focus-visible ring, semantic roles, and ARIA labeling behavior from current implementation.
- **Variants needed:** default + context-specific visual variants
- **States needed:** default, hover, focus-visible, disabled
- **Framework constraints:** Must stay app-agnostic; no `next/*` imports, no API calls, no business/domain logic in shared component.
- **Consumer usage example:**
```tsx
<Tooltip />
```

