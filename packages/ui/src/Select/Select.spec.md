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

This Batch 4 implementation is intentionally narrow. It covers the repeated cross-app baseline for non-searchable single selection with placeholder, disabled, loading, label, and error treatment. Search-driven selection belongs to `Combobox`, while multi-select and phone-code-specific flows stay out of this contract until their own roadmap items are addressed.

**When to use:**

- Use `Select` for static single-value choices in forms, filters, and settings flows.
- Use `Select` when the option set is already available locally and does not need inline search.
- Use the shared `error` prop when the control participates in form validation and needs accessible invalid feedback.

**When NOT to use:**

- Do not use `Select` for searchable, async, or typeahead selection; those belong to `Combobox`.
- Do not use `Select` for multi-select, checkbox-list, or staged-confirmation pickers; keep those local or address them in later roadmap work.
- Do not put option fetching, domain mapping, or router behavior inside the shared primitive.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Primitive | `@radix-ui/react-select` | Radix provides the required combobox/listbox semantics, keyboard navigation, and portal-backed overlay behavior. |
| Public API shape | Flat prop-driven component with `options` | The current shared contract is a static single-select wrapper, not a public compound primitive family. |
| Controlled vs uncontrolled | both | Cross-app baselines mix controlled and uncontrolled usage, and Radix supports both cleanly. |
| Open-state API | `open`, `defaultOpen`, `onOpen`, `onClose` | Keeps the shared surface aligned with normalized open/close naming without leaking raw `onOpenChange`. |
| Loading treatment | disable trigger + show spinner | Covers the baseline waiting state without inventing async search or inline empty-copy APIs. |
| Search / multi scope | excluded | `$vercel-composition-patterns` review favors a narrow contract here; overloading static, searchable, and multi-select into one API would recreate the drift documented in the risk register. |
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
```

---

## Variants

`Select` intentionally ships without public visual variant or size props in this pass. The shared contract is the single static-select treatment documented in the roadmap; app-specific visual drift should collapse into the canonical surface plus `className`, not into new `variant`, `mode`, or `withBorder` props.

| Shared treatment | Description | When to use |
| --- | --- | --- |
| Default trigger | Bordered field shell with shared token surface and chevron affordance | General form and filter selection. |
| Placeholder state | Muted trigger text before selection | Prompting first-time choice. |
| Long-list content | Scroll affordances and capped viewport height | Larger local option sets that still remain static and non-searchable. |

---

## States

| State | Visual Behavior | Accessibility |
| --- | --- | --- |
| Default | Trigger shows current value or placeholder with shared token surface | Trigger exposes Radix combobox semantics |
| Open | Trigger and menu content use open-state styling and portal rendering | Arrow keys, Enter, and Escape follow Radix Select behavior |
| Selected | Checked item renders selection indicator | Current option is reflected in the trigger and listbox state |
| Disabled | Muted trigger, no pointer interaction, menu cannot open | Disabled semantics are forwarded through Radix |
| Loading | Trigger disables interaction and swaps chevron for spinner | Trigger exposes `aria-busy="true"` |
| Error | Destructive border and inline validation copy | Trigger exposes `aria-invalid="true"` and links the error via `aria-describedby` |
| Clearable | Selected value can be reset to the placeholder state through an explicit clear action | Clear button is keyboard reachable and labelled `Clear selection` |

---

## Accessibility

### ARIA Roles & Attributes

| Element | Role / Attribute | Value |
| --- | --- | --- |
| Trigger | implicit role | Radix `combobox` trigger semantics |
| Trigger | `aria-invalid` | Applied when `error` is truthy |
| Trigger | `aria-describedby` | References the inline error message and any caller-provided ids |
| Trigger | `aria-labelledby` | References the visible label when `label` is present |
| Trigger | `aria-busy` | Applied while `loading` is true |
| Content | implicit role | Radix `listbox` semantics |
| Item | implicit role | Radix `option` semantics |
| Error copy | `role` | `alert` |

### Keyboard Map

| Key | Behavior |
| --- | --- |
| `Tab` | Moves focus to and away from the trigger |
| `Enter` / `Space` | Opens the menu from the trigger and selects the highlighted item |
| `ArrowDown` / `ArrowUp` | Opens the menu and moves highlight through options |
| `Home` / `End` | Moves to the first or last item when the menu is open |
| `Escape` | Closes the menu and returns focus to the trigger |

### Focus Management

- Focus remains on the trigger until the menu opens.
- When the menu opens, Radix moves highlight and focus handling into the option list.
- Closing the menu returns focus to the trigger.

### Screen Reader Notes

- The visible `label` becomes the trigger's accessible name when present.
- Selected option text is announced through Radix `Value` / `ItemText` behavior.
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

### 2. Controlled usage

```tsx
<Select
  value={country}
  onValueChange={setCountry}
  label="Country"
  placeholder="Select a country"
  options={countryOptions}
/>
```

### 3. Error state

```tsx
<Select
  label="Plan"
  required
  error="Please choose a plan before continuing."
  placeholder="Select a plan"
  options={planOptions}
/>
```

### 4. Loading state

```tsx
<Select
  label="Bank"
  loading
  placeholder="Loading options"
  options={bankOptions}
/>
```

### 5. Clearable state

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

---

## Do / Don't

| Do | Don't |
| --- | --- |
| Use `Select` for static single-choice option sets. | Use `Select` for searchable or async option discovery. |
| Keep searchable selection on `Combobox`. | Reintroduce `searchable` or inline filtering props on this component. |
| Keep multi-select and phone-code-specific flows outside this shared contract. | Collapse multi-select, phone-code, and static single-select into one overloaded API. |
| Use `error`, `label`, and `clearable` for shared field semantics. | Add app-local prop names such as `errorMessage`, `placeholderSelect`, or `withBorder`. |
| Keep authored shared JSX on `Box`, including trigger, items, and messages. | Hand-author native JSX tags in shared source or stories. |
| Keep option fetching and domain mapping in the consumer. | Put services, routing, or business logic inside `Select`. |

---

## Storybook Stories Required

**Story file title:** `'Inputs/Select'`

- [x] `Default`
- [x] `Placeholder`
- [x] `LongList`
- [x] `DisabledState`
- [x] `ErrorState`
- [x] `LoadingState`
- [x] `Clearable`
- [x] `Interactive`
- [x] `ResponsiveLayout`

---

## Box-only DOM policy

- Authored shared JSX for this component and its stories must use `Box` for every DOM node.
- Semantic elements such as the label, trigger button, content shell, list items, and error text render through `Box as="label"`, `Box as="button"`, `Box as="div"`, and `Box as="p"`.
- Icons use shared Lucide components instead of inline SVG markup.

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-10 | Initial Select spec |
| 2026-03-11 | Added clearable reset support |
