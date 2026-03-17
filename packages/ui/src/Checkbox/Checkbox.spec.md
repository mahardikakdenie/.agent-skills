# Checkbox Spec

## Metadata

| Field           | Value                              |
| --------------- | ---------------------------------- |
| Storybook Group | `Inputs`                           |
| Component Tier  | `Tier 1 (Primitive)`               |
| Structure Tier  | `Standard`                         |
| Based on        | `Box` + `@radix-ui/react-checkbox` |

---

## Overview

`Checkbox` is the shared selection primitive for binary choices, consent toggles, and partial-selection states in list or form scaffolding. It keeps the public API flat and app-agnostic while covering the common cross-app needs surfaced in the B4 baselines: checked and unchecked states, an explicit indeterminate state, disabled handling, optional label and supporting copy, and inline error feedback.

The component is intentionally not compound. The checkbox control, label, description, and error message ship as one shared field shell because the current roadmap contract is small and repeatedly duplicated across apps. More complex grouping, validation orchestration, or domain-aware selection logic stays local and composes this primitive rather than widening its API.

**When to use:**

- Use `Checkbox` for single boolean choices, consent acknowledgements, and row-selection controls.
- Use the indeterminate state for partial selection patterns such as "select all" with some children already checked.

**When NOT to use:**

- Do not use `Checkbox` for mutually exclusive choices; use `RadioGroup` instead.
- Do not use `Checkbox` to absorb domain validation, API submission state, or grouped business logic beyond the local field shell.

---

## Design Decisions

| Decision                   | Choice                             | Rationale                                                                                                       |
| -------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Root primitive             | `@radix-ui/react-checkbox` + `Box` | Radix owns checked semantics and keyboard behavior; `Box` keeps authored DOM compliant with the workspace rule. |
| CVA strategy               | Slot-based                         | Root, label, description, and inline message each need independent token treatment.                             |
| Controlled vs uncontrolled | both                               | Matches Radix usage and supports both simple forms and externally managed selection state.                      |
| Portal                     | no                                 | Checkbox remains inline in document flow.                                                                       |
| Sub-components             | no                                 | `vercel-composition-patterns` evaluation favors a flat API here; no shared context or slot family is required. |
| Box-only DOM rule          | explicit                           | Authored wrapper, button target, label, description, and error message all render through `Box`.               |

---

## Props Interface

| Prop              | Type                                            | Default     | Required | Description                                                                 |
| ----------------- | ----------------------------------------------- | ----------- | -------- | --------------------------------------------------------------------------- |
| `checked`         | `boolean \| 'indeterminate'`                    | `undefined` | No       | Controlled checked state. `'indeterminate'` expresses partial selection.    |
| `defaultChecked`  | `boolean \| 'indeterminate'`                    | `false`     | No       | Uncontrolled initial state.                                                 |
| `onCheckedChange` | `(checked: boolean \| 'indeterminate') => void` | `undefined` | No       | Fired whenever the selection state changes.                                 |
| `label`           | `string`                                        | `undefined` | No       | Inline label associated with the checkbox control.                          |
| `description`     | `string`                                        | `undefined` | No       | Supporting helper copy rendered below the label.                            |
| `error`           | `string \| boolean`                             | `false`     | No       | Marks the field invalid; a string also renders an inline error message.     |
| `size`            | `'sm' \| 'md' \| 'lg'`                          | `'md'`      | No       | Density scale for the control and text treatment.                           |
| `disabled`        | `boolean`                                       | `false`     | No       | Disables interaction.                                                       |
| `required`        | `boolean`                                       | `false`     | No       | Marks the field required and adds a required indicator beside the label.    |
| `className`       | `string`                                        | `undefined` | No       | Consumer override merged onto the outer field wrapper through `cn()`.       |
| `...props`        | `CheckboxPrimitive.Root` props                  | -           | No       | Supports Radix/root props such as `id`, `name`, `value`, `form`, and `aria-*`. |

---

## Sizes

| Size | Control density | Label treatment | Intended use                                   |
| ---- | --------------- | --------------- | ---------------------------------------------- |
| `sm` | Tight           | Small label     | Dense tables, compact filter lists             |
| `md` | Default         | Standard label  | General form and settings usage                |
| `lg` | Spacious        | Larger label    | Touch-heavy settings rows or emphasized consent |

---

## States

| State         | Visual Behavior                                                          | Accessibility                                                               |
| ------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Unchecked     | Neutral border and background, no icon                                   | Exposes `role="checkbox"` and `aria-checked="false"` through Radix          |
| Checked       | Primary-filled control with check icon                                   | Exposes `aria-checked="true"`                                               |
| Indeterminate | Primary-filled control with minus icon                                   | Exposes the mixed state through Radix and keeps the same keyboard contract  |
| Focus         | Visible compact-control focus ring around the control without a detached offset halo | Keyboard focus remains visible across all sizes                             |
| Disabled      | Reduced opacity and blocked interaction for control and label            | Radix marks the control disabled; label styling becomes muted               |
| Error         | Destructive border and fill treatment plus an inline message when needed | Sets `aria-invalid="true"` and links the message through `aria-describedby` |
| Required      | Label shows a destructive asterisk                                       | Required semantic remains on the root control                               |

---

## Accessibility

### ARIA Roles & Attributes

| Element       | Role / Attribute   | Value                                                    |
| ------------- | ------------------ | -------------------------------------------------------- |
| Control       | `role`             | Radix checkbox semantics                                 |
| Control       | `aria-labelledby`  | Points to the generated label id when `label` is present |
| Control       | `aria-describedby` | Includes description and inline error ids when present   |
| Control       | `aria-invalid`     | `true` when `error` is truthy                            |
| Error message | `role`             | `alert`                                                  |

### Keyboard Map

| Key     | Behavior                                                     |
| ------- | ------------------------------------------------------------ |
| `Tab`   | Moves focus to the checkbox control                          |
| `Space` | Toggles the checked state per Radix checkbox behavior        |
| `Enter` | Browser-dependent activation on button-backed checkbox roots |

### Focus Management

- `Checkbox` does not move focus programmatically.
- Clicking the label moves activation to the associated control through `htmlFor`.

### Screen Reader Notes

- When `label` is present, it becomes the accessible name for the control.
- `error` strings are announced through the linked `role="alert"` message.
- Consumers without a visible label must supply an accessible name via `aria-label` or `aria-labelledby`.

---

## Usage Examples

### 1. Basic usage

```tsx
<Checkbox label="Accept terms and conditions" />
```

### 2. Indeterminate state

```tsx
<Checkbox
  checked="indeterminate"
  label="Select all items"
  description="Some items in this collection are already selected."
/>
```

### 3. Error state

```tsx
<Checkbox
  error="You must accept the terms before continuing."
  label="Accept terms and conditions"
  required
/>
```

### 4. Composed usage

```tsx
<Box as="form" className="grid gap-4">
  <Checkbox
    name="marketingConsent"
    label="Receive release updates"
    description="You can change this preference later in account settings."
  />
</Box>
```

---

## Do / Don't

| Do                                                                 | Don't                                                                                 |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Use `'indeterminate'` when the UI needs a partial-selection state. | Invent extra booleans such as `mixed`, `partiallyChecked`, or `hasPartialSelection`. |
| Use `error` for invalid styling and inline error text.             | Add app-local `errorMessage` or `isError` prop names to the shared contract.          |
| Keep group orchestration local and compose the shared primitive.   | Put domain filtering, bulk actions, or submit logic inside `Checkbox`.                |
| Keep authored DOM in shared source on `Box`.                       | Hand-write native `div`, `button`, `label`, or `p` tags in stories or implementation. |
| Provide an accessible name when no visible label is rendered.      | Rely on the icon alone to communicate meaning.                                        |

---

## Storybook Stories Required

**Story file title:** `'Inputs/Checkbox'`

- [x] `Default`
- [x] `Sizes`
- [x] `Indeterminate`
- [x] `DisabledState`
- [x] `ErrorState`
- [x] `WithDescription`

---

## Changelog

| Date       | Change                |
| ---------- | --------------------- |
| 2026-03-10 | Initial Checkbox spec |
| 2026-03-17 | Normalized Checkbox focus to the shared compact-control recipe and removed the detached offset halo |
