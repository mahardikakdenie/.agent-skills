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

`Combobox` is the shared searchable single-select field for option sets that are too large or noisy for the static `Select` primitive, but still need an app-agnostic shell inside `@repo/ui`. It combines the shipped `Popover` surface with a `cmdk` command list so consumers get searchable option discovery, keyboard navigation, inline empty state handling, and normalized validation treatment without embedding routing, fetch logic, or domain-specific shaping in the shared package.

This shared contract intentionally stays narrower than some local baseline variants. It covers label and error wiring, trigger placeholder, client-side search, disabled and loading treatment, clearable reset behavior, and custom option-row rendering. It does not absorb multi-select, option creation, phone-code specialization, remote transport, or domain-specific result formatting. Those remain app-local.

`Combobox` now participates in the shared field-shell sizing family used by `Input`, `DatePicker`, `DateRangePicker`, and `MonthPicker`. The public size ladder is `xs | sm | md | lg`, with `md` as the default.

**When to use:**

- Use `Combobox` for searchable single selection where the full option list can be supplied as plain props.
- Use it when `Select` is too rigid because users need inline filtering before choosing one option.
- Use `clearable` when the chosen value must return to the placeholder state from the trigger shell.
- Use `renderOption` when each option row needs richer metadata while selection and trigger copy should still resolve from the plain option label.

**When NOT to use:**

- Use `Select` for static non-searchable single-select fields.
- Keep option creation, tagging, or "add new item" flows local instead of widening this API with `allowCreate`.
- Keep async fetching, debounced search orchestration, and domain-specific display rendering in the parent surface.
- Do not use this component for multi-select, command palettes, route menus, or phone-code pickers.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Primitive stack | `Popover` + `cmdk` | `Popover` already ships as the shared anchored overlay shell, and `cmdk` provides the searchable list semantics needed for the roadmap Combobox row. |
| Public API shape | Flat prop-driven component | A single field contract is the clearest shared surface here. |
| Controlled vs uncontrolled selection | both | Cross-app baselines mix local-state and controlled usage; the shared component should support both cleanly. |
| Open-state API | `open` + internal fallback + `onClose` | Matches the canonical shared naming in `02-api-conventions.md` without widening to raw `onOpenChange`. |
| Search model | Internal client-side filtering | Searchable selection is the shared need; fetching, debouncing, and remote orchestration remain app-local. |
| Clear behavior | `clearable` + `onValueChange(undefined)` | Resets selected state without inventing a second callback contract. |
| Rich option layout | `renderOption` | Supports denser result rows while keeping the trigger and accessible label contract text-first. |
| Async support | `loading` prop only | Supports parent-owned async option refresh without leaking transport APIs into `@repo/ui`. |
| Box-only DOM rule | explicit boundary | Authored wrappers, trigger shell, clear action, and messages use `Box`; `cmdk` primitives remain a documented third-party DOM boundary. |

---

## Props Interface

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | internal state | No | Controlled selected option value. |
| `onValueChange` | `(value: string \| undefined) => void` | `undefined` | No | Called when the user selects an option or clears the current value. |
| `options` | `ComboboxOption[]` | - | Yes | Flat searchable option list. |
| `placeholder` | `string` | `'Select an option'` | No | Trigger copy shown when no option is selected. |
| `searchPlaceholder` | `string` | `'Search options'` | No | Placeholder inside the searchable command input. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | No | Shared field-shell density applied to the trigger and searchable input row. |
| `disabled` | `boolean` | `false` | No | Disables the trigger and option interaction. |
| `loading` | `boolean` | `false` | No | Shows loading treatment and blocks selection while options are refreshing. |
| `required` | `boolean` | `false` | No | Marks the field required for label and form semantics. |
| `error` | `string \| boolean` | `false` | No | Invalid state or inline validation copy. |
| `label` | `string` | `undefined` | No | Visible field label associated with the trigger. |
| `clearable` | `boolean` | `false` | No | Shows a clear action when a selected value should return to the placeholder state. |
| `renderOption` | `(option: ComboboxOption, state: ComboboxOptionRenderState) => ReactNode` | `undefined` | No | Renders custom option row content while selection and trigger text still resolve from `option.label`. |
| `className` | `string` | `undefined` | No | Consumer override merged onto the outer field wrapper through `cn()`. |
| `open` | `boolean` | internal state | No | Controlled popover visibility. |
| `onClose` | `() => void` | `undefined` | No | Called when the popover closes after selection or dismissal. |
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
| Empty | Searchable list shows `No options found` when no match remains | Empty state remains visible text, not icon-only |
| Loading | Trigger disables interaction and list shows a loading row | Trigger exposes `aria-busy="true"`; loading row uses polite status semantics |
| Disabled Option | Disabled rows remain visible but cannot be chosen | `cmdk` item disabling is preserved |
| Clearable | Selected value can be reset through an explicit trigger action | Clear button is keyboard reachable and labelled `Clear selection` |
| Error | Trigger border and message switch to destructive styling | Trigger exposes `aria-invalid`; error message uses `role="alert"` |

---

## Accessibility

- The visible `label` becomes the trigger's accessible name when present.
- Search input uses an explicit `aria-label` so it is announced independently from the trigger, and its surrounding row keeps visible focus treatment when the popup is keyboard active.
- `renderOption` does not replace the option's accessible text; selection and trigger copy still resolve from `option.label`.
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

---

## Storybook Stories Required

**Story file title:** `'Inputs/Combobox'`

- [x] `Default`
- [x] `Search`
- [x] `Sizes`
- [x] `Empty`
- [x] `DisabledState`
- [x] `DisabledOption`
- [x] `ErrorState`
- [x] `ControlledMode`
- [x] `Clearable`
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
| 2026-03-12 | Initial Combobox spec |
| 2026-03-12 | Added `clearable`, `renderOption`, and non-forced open Storybook coverage |
| 2026-03-17 | Added the approved shared `xs \| sm \| md \| lg` sizing contract with Input-aligned trigger and search-row density |
| 2026-03-17 | Documented the calmer direct field-shell focus treatment, non-stacking open-state emphasis, and visible search-row focus inside the opened popup |

