# Select Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Inputs` |
| Component Tier | `Tier 1 (Primitive)` |
| Structure Tier | `Standard` |
| Based on | `@radix-ui/react-select` |

---

## Overview

`Select` is the shared static single-select primitive for choosing one value from a known option list. It wraps Radix Select for accessible combobox, listbox, and keyboard behavior while keeping all authored shared DOM on `Box`, including the trigger, label, content shell, viewport, items, and validation messaging.

This shared contract stays intentionally focused on non-searchable single selection. Search-driven selection belongs to `Combobox`, while multi-select and phone-code-specific flows stay out of this contract. The current surface also supports trigger-level reset and custom option layout rendering without changing the selected trigger label contract.

**When to use:**

- Use `Select` for static single-value choices in forms, filters, and settings flows.
- Use `Select` when the option set is already available locally and does not need inline search.
- Use `renderOption` when the option row needs richer supporting metadata while the trigger should still show the plain selected label.
- Use the shared `error` prop when the control participates in form validation and needs accessible invalid feedback.

**When NOT to use:**

- Do not use `Select` for searchable, async, or typeahead selection; those belong to `Combobox`.
- Do not use `Select` for multi-select, checkbox-list, or staged-confirmation pickers.
- Do not put option fetching, domain mapping, or router behavior inside the shared primitive.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Primitive | `@radix-ui/react-select` | Radix provides the required combobox/listbox semantics, keyboard navigation, and portal-backed overlay behavior. |
| Public API shape | Flat prop-driven component with `options` | The shared contract is a static single-select wrapper, not a public compound primitive family. |
| Controlled vs uncontrolled | both | Cross-app baselines mix controlled and uncontrolled usage, and Radix supports both cleanly. |
| Open-state API | `open`, `defaultOpen`, `onOpen`, `onClose` | Keeps the shared surface aligned with normalized open/close naming without leaking raw `onOpenChange`. |
| Clear behavior | `clearable` + `onValueChange(undefined)` | Resets selected state without inventing a second callback contract. |
| Rich option layout | `renderOption` | Supports denser option rows while keeping trigger value text stable and app-agnostic. |
| Search / multi scope | excluded | Overloading static, searchable, and multi-select into one API would recreate drift. |
| Portal | yes | The menu content must escape stacking contexts and match Radix overlay guidance. |
| Box-only DOM rule | explicit | Trigger, label, content shell, viewport, items, indicator wrappers, and error copy all render through `Box`. |

---

## Props Interface

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | `undefined` | No | Controlled selected value. |
| `defaultValue` | `string` | `undefined` | No | Uncontrolled initial selected value. |
| `onValueChange` | `(value: string \| undefined) => void` | `undefined` | No | Called when a new option is selected or when a clearable select is reset to the placeholder state. |
| `options` | `SelectOption[]` | - | Yes | Flat list of available static options. |
| `placeholder` | `string` | `undefined` | No | Placeholder content shown when no option is selected. |
| `disabled` | `boolean` | `false` | No | Disables the trigger and closes interaction. |
| `loading` | `boolean` | `false` | No | Shows a loading spinner and disables the trigger. |
| `required` | `boolean` | `false` | No | Marks the field required for form semantics. |
| `error` | `string \| boolean` | `false` | No | Marks the field invalid; string values also render inline error text. |
| `label` | `string` | `undefined` | No | Visible field label associated with the trigger. |
| `clearable` | `boolean` | `false` | No | Shows a clear action when a selected value should return to the placeholder state. |
| `renderOption` | `(option: SelectOption, state: SelectOptionRenderState) => ReactNode` | `undefined` | No | Renders custom option row content while the trigger still resolves to the option label. |
| `open` | `boolean` | `undefined` | No | Controlled open state. |
| `defaultOpen` | `boolean` | `undefined` | No | Uncontrolled initial open state. |
| `onOpen` | `() => void` | `undefined` | No | Called when the menu opens. |
| `onClose` | `() => void` | `undefined` | No | Called when the menu closes. |
| `className` | `string` | `undefined` | No | Consumer override merged onto the outer field wrapper through `cn()`. |
| `...props` | Radix root props | - | No | Pass-through root props such as `name`, `form`, `autoComplete`, and `dir`. |

### Complex Prop Shapes

```ts
export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectOptionRenderState {
  selected: boolean;
  disabled: boolean;
}
```

---

## States

| State | Visual Behavior | Accessibility |
| --- | --- | --- |
| Default | Trigger shows current value or placeholder with shared token surface | Trigger exposes Radix combobox semantics |
| Open | Trigger and menu content use open-state styling and portal rendering | Arrow keys, Enter, and Escape follow Radix Select behavior |
| Selected | Checked item renders selection indicator | Current option is reflected in the trigger and listbox state |
| Disabled Option | Disabled rows remain visible but cannot be chosen | Disabled semantics are forwarded through Radix item state |
| Disabled | Muted trigger, no pointer interaction, menu cannot open | Disabled semantics are forwarded through Radix |
| Loading | Trigger disables interaction and swaps chevron for spinner | Trigger exposes `aria-busy="true"` |
| Error | Destructive border and inline validation copy | Trigger exposes `aria-invalid="true"` and links the error via `aria-describedby` |
| Clearable | Selected value can be reset through an explicit clear action | Clear button is keyboard reachable and labelled `Clear selection` |

---

## Accessibility

- The visible `label` becomes the trigger's accessible name when present.
- Selected option text is announced through Radix `Value` / `ItemText` behavior.
- `renderOption` does not replace the option's accessible text; selection and trigger text still resolve from `option.label`.
- Error messaging is announced through the `aria-describedby` chain when `error` is a string.

---

## Usage Examples

### 1. Basic usage

```tsx
<Select
  label="Country"
  placeholder="Select a country"
  options={[
    { label: 'Malaysia', value: 'my' },
    { label: 'Singapore', value: 'sg' },
  ]}
/>
```

### 2. Clearable usage

```tsx
<Select
  label="Country"
  clearable
  value={country}
  onValueChange={setCountry}
  placeholder="Select a country"
  options={countryOptions}
/>
```

### 3. Custom option content

```tsx
<Select
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

**Story file title:** `'Inputs/Select'`

- [x] `Default`
- [x] `Placeholder`
- [x] `LongList`
- [x] `DisabledState`
- [x] `DisabledOption`
- [x] `ErrorState`
- [x] `LoadingState`
- [x] `Clearable`
- [x] `CustomOptionContent`
- [x] `Interactive`
- [x] `ResponsiveLayout`

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-10 | Initial Select spec |
| 2026-03-11 | Added clearable reset support |
| 2026-03-12 | Added `renderOption` support while preserving trigger label text |
