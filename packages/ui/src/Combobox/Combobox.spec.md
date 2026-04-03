# Combobox Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Inputs` |
| Component Tier | `Tier 2 (Composite)` |
| Structure Tier | `Complex` |
| Based on | `cmdk` + `Popover` |

---

## Overview

`Combobox` is the shared searchable single-select field for option sets that are too large or noisy for the static `Select` primitive, but still need an app-agnostic shell inside `@repo/ui`. It combines the shipped `Popover` surface with a `cmdk` command list so consumers get searchable option discovery, keyboard navigation, inline empty state handling, optional controlled search text, and normalized validation treatment without embedding routing, fetch logic, or domain-specific shaping in the shared package.

This shared contract intentionally stays narrower than some local baseline variants. It covers label and error wiring, trigger placeholder, client-side search, optional parent-owned search text, parent-owned search notifications, disabled and loading treatment, clearable reset behavior, an optional create-on-enter affordance, and custom option-row rendering. It still does not absorb multi-select, remote transport, phone-code specialization, domain-specific creation semantics, or app-specific result formatting. Those remain app-local.

`Combobox` now participates in the shared field-shell family used by `Input`, `DatePicker`, `DateRangePicker`, and `MonthPicker`. The public trigger variants are `outline | shadow | ghost`, with `outline` as the default, and the size ladder remains `xs | sm | md | lg`, with `md` as the default. Legacy `default` remains a compatibility alias for `shadow`.

**When to use:**

- Use `Combobox` for searchable single selection where the full option list can be supplied as plain props.
- Use it when `Select` is too rigid because users need inline filtering before choosing one option.
- Use `clearable` when the chosen value must return to the placeholder state from the trigger shell.
- Use `onSearchValueChange` for parent search notifications, and add `searchValue` when the parent also needs to control the visible query text.
- Use `searchValue`, `onSearchValueChange`, parent-owned `options` refresh, and `loading` together when async search should stay outside `@repo/ui`.
- Use `onCreateOption` for a bounded create-on-enter affordance where the parent still owns what gets created and how the new option is stored.

**When NOT to use:**

- Use `Select` for static non-searchable single-select fields.
- Keep multi-step creation flows, tagging, or domain-specific "add new item" semantics local instead of widening this API beyond `onCreateOption`.
- Keep async fetching, debouncing, and remote orchestration in the parent surface instead of embedding them into `@repo/ui`.
- Do not use this component for multi-select, command palettes, route menus, or phone-code pickers.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Primitive stack | `Popover` + `cmdk` | `Popover` already ships as the shared anchored overlay shell, and `cmdk` provides the searchable list semantics needed for the roadmap Combobox row. |
| Public API shape | Flat prop-driven component | A single field contract is the clearest shared surface here. |
| Controlled vs uncontrolled selection | both | Cross-app baselines mix local-state and controlled usage; the shared component should support both cleanly. |
| Open-state API | `open` + internal fallback + `onClose` | Matches the canonical shared naming in `02-api-conventions.md` without widening to raw `onOpenChange`. |
| Search model | Internal fallback + optional controlled `searchValue` + `onSearchValueChange` | Searchable selection remains the shared need while visible query control, debounce, fetch timing, and option refresh stay parent-owned. |
| Create behavior | `onCreateOption` + `createOptionLabel` | Covers the smallest reusable create-on-enter affordance without hard-coding business semantics into the shared package. |
| Clear behavior | `clearable` + `onValueChange(undefined)` | Resets selected state without inventing a second callback contract. |
| Rich option layout | `renderOption` | Supports denser result rows while keeping the trigger and accessible label contract text-first. |
| Async support | `loading` + parent-owned option updates | Supports parent-owned async option refresh without leaking transport APIs into `@repo/ui`. |
| Box-only DOM rule | explicit boundary | Authored wrappers, trigger shell, clear action, messages, and create-row content use `Box`; `cmdk` primitives remain a documented third-party DOM boundary. |

---

## Props Interface

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | internal state | No | Controlled selected option value. |
| `onValueChange` | `(value: string | undefined) => void` | `undefined` | No | Called when the user selects an option or clears the current value. |
| `options` | `ComboboxOption[]` | - | Yes | Flat searchable option list. |
| `placeholder` | `string` | `'Select an option'` | No | Trigger copy shown when no option is selected. |
| `searchPlaceholder` | `string` | `'Search options…'` | No | Placeholder inside the searchable command input. |
| `searchValue` | `string` | internal state | No | Controlled search input text. When omitted, the component manages the query internally. |
| `onSearchValueChange` | `(value: string) => void` | `undefined` | No | Notifies the parent whenever the search input changes so debounce, fetching, and option refresh can stay external. |
| `variant` | `'outline' | 'shadow' | 'ghost' | 'default'` | `'outline'` | No | Shared field-shell appearance applied to the trigger. Legacy `default` remains a compatibility alias for `shadow`. |
| `size` | `'xs' | 'sm' | 'md' | 'lg'` | `'md'` | No | Shared field-shell density applied to the trigger and searchable input row. |
| `disabled` | `boolean` | `false` | No | Disables the trigger and option interaction. |
| `loading` | `boolean` | `false` | No | Shows loading treatment and blocks selection while options are refreshing. |
| `required` | `boolean` | `false` | No | Marks the field required for label and form semantics. |
| `error` | `string | boolean` | `false` | No | Invalid state or inline validation copy. |
| `label` | `string` | `undefined` | No | Visible field label associated with the trigger. |
| `clearable` | `boolean` | `false` | No | Shows a clear action when a selected value should return to the placeholder state. |
| `createOptionLabel` | `string | ((searchValue: string) => string)` | `Create "{searchValue}"` | No | Copy for the optional create row shown when no exact option label or value matches the typed search. |
| `onCreateOption` | `(searchValue: string) => void` | `undefined` | No | Enables the create row and fires when the user clicks it or presses Enter with a non-empty unmatched search value. The parent remains responsible for updating `options` and `value` afterward. |
| `renderOption` | `(option: ComboboxOption, state: ComboboxOptionRenderState) => ReactNode` | `undefined` | No | Renders custom option row content while selection and trigger text still resolve from `option.label`. |
| `className` | `string` | `undefined` | No | Consumer override merged onto the outer field wrapper through `cn()`. |
| `open` | `boolean` | internal state | No | Controlled popover visibility. |
| `onClose` | `() => void` | `undefined` | No | Called when the popover closes after selection, create, clear, or dismissal. |
| `...buttonProps` | `ButtonHTMLAttributes<HTMLButtonElement>` | - | No | Forwards button-level props such as `name`, `tabIndex`, `aria-*`, `onBlur`, and `onFocus` to the trigger. |

### Complex Prop Shapes

```ts
export interface ComboboxOption {
  label: string;
  value: string;
  disabled?: boolean;
  keywords?: string[];
}

export interface ComboboxOptionRenderState {
  selected: boolean;
  disabled: boolean;
}
```

---

## States

| State | Visual Behavior | Accessibility |
| --- | --- | --- |
| Default | Trigger shows placeholder or selected option label | Trigger exposes combobox-style expand/collapse state |
| Open | Trigger keeps border-led shell emphasis while the popover opens instead of layering a second heavy focus treatment | Trigger exposes `aria-expanded="true"` and popup relationship |
| Search | Typing filters the option list inside the command surface, and the search row keeps a visible keyboard-focus treatment when the popup input owns focus | `cmdk` manages active item movement and announcement |
| Parent-owned search refresh | Parent can control `searchValue` or respond to `onSearchValueChange`, debounce externally, toggle `loading`, and replace `options` without changing the shared field shell | Async orchestration stays outside the shared package; the trigger still exposes `aria-busy` while loading |
| Empty | Searchable list shows `No options found` when no match remains | Empty state remains visible text, not icon-only |
| Loading | Trigger disables interaction and list shows a loading row | Trigger exposes `aria-busy="true"`; loading row uses polite status semantics |
| Disabled Option | Disabled rows remain visible but cannot be chosen | `cmdk` item disabling is preserved |
| Create Option | Optional create row appears for a non-empty unmatched search value and supports click or Enter activation | Create row stays keyboard reachable inside the list and exposes visible helper copy |
| Clearable | Selected value can be reset through an explicit trigger action | Clear button is keyboard reachable and labelled `Clear selection` |
| Error | Trigger border and message switch to destructive styling | Trigger exposes `aria-invalid`; error message uses `role="alert"` |

---

## Accessibility

- The visible `label` becomes the trigger's accessible name when present.
- Search input uses an explicit `aria-label` so it is announced independently from the trigger, and its surrounding row keeps visible focus treatment when the popup is keyboard active.
- `renderOption` does not replace the option's accessible text; selection and trigger copy still resolve from `option.label`.
- The create row stays inside the same keyboard-navigable command list instead of introducing a separate clickable helper element with weaker semantics.
- Empty and loading rows remain visible text so status changes are understandable without color cues alone.

---

## Usage Examples

### 1. Basic usage

```tsx
<Combobox
  label="Country"
  size="sm"
  options={[
    { label: 'Malaysia', value: 'my' },
    { label: 'Singapore', value: 'sg' },
  ]}
  value={country}
  onValueChange={setCountry}
/>
```

### 2. Clearable usage

```tsx
<Combobox
  label="Country"
  clearable
  value={country}
  onValueChange={setCountry}
  options={countryOptions}
/>
```

### 3. Custom option content

```tsx
<Combobox
  label="Country"
  options={countryOptions}
  renderOption={(option) => (
    <Box className="flex items-center gap-2">
      <Box as="span">{option.value.toUpperCase()}</Box>
      <Box as="span">{option.label}</Box>
    </Box>
  )}
/>
```

### 4. Parent-owned search refresh with create-on-enter

```tsx
<Combobox
  label="Customer"
  placeholder="Input name"
  searchPlaceholder="Find Customer Name…"
  value={customerId}
  searchValue={customerSearch}
  options={customerOptions}
  loading={customersLoading}
  onValueChange={setCustomerId}
  onSearchValueChange={handleCustomerSearch}
  createOptionLabel="Type something and press Enter to add a new customer"
  onCreateOption={(searchValue) => {
    const nextOption = { label: searchValue, value: searchValue };
    setCustomerOptions((previousOptions) => [...previousOptions, nextOption]);
    setCustomerId(nextOption.value);
  }}
/>
```

---

## Storybook Stories Required

**Story file title:** `'Inputs/Combobox'`

- [x] `Default`
- [x] `Search`
- [x] `Variants`
- [x] `Sizes`
- [x] `Empty`
- [x] `DisabledState`
- [x] `DisabledOption`
- [x] `ErrorState`
- [x] `ControlledMode`
- [x] `Clearable`
- [x] `ExternalSearchAndCreate`
- [x] `CustomOptionContent`

Roadmap alignment:

- `Combobox.Basic` -> `Default`
- `Combobox.Search` -> `Search`
- `Combobox.Empty` -> `Empty`
- `Combobox.Clearable` -> `Clearable`
- `Combobox.CustomOptionContent` -> `CustomOptionContent`

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-29 | Added optional controlled `searchValue` support so parents can keep the visible query in sync during shared async-search migration without moving search orchestration into `@repo/ui`. |
| 2026-03-26 | Added parent-owned `onSearchValueChange` and bounded `onCreateOption` / `createOptionLabel` support so remote-search and create-on-enter flows can adopt the shared field shell without embedding fetch logic in `@repo/ui`. |
| 2026-03-12 | Initial Combobox spec |
| 2026-03-12 | Added `clearable`, `renderOption`, and non-forced open Storybook coverage |
| 2026-03-17 | Added the approved shared `xs | sm | md | lg` sizing contract with Input-aligned trigger and search-row density |
| 2026-03-17 | Documented the calmer direct field-shell focus treatment, non-stacking open-state emphasis, and visible search-row focus inside the opened popup |
