# Label Spec

## Metadata

| Field           | Value                           |
| --------------- | ------------------------------- |
| Storybook Group | `Inputs`                        |
| Based on        | `Box` + `@radix-ui/react-label` |

---

## Overview

`Label` is the shared field-caption primitive for associating readable text with inputs, checkboxes, radios, and other labelable form controls. The shared contract stays intentionally small: semantic association through `htmlFor`, optional required indication, explicit disabled styling, and a normalized `tone` scale for default, muted, and destructive contexts.

This component stops at the label layer. It does not render descriptions, helper text, or error messages, and it does not own validation logic. Those behaviors stay with field-shell primitives such as `Input`, `Checkbox`, `RadioGroup`, or future `Form` composition.

**When to use:**

- Use `Label` for standalone form fields or custom field compositions that need readable caption text linked to a control.
- Use `tone="destructive"` when the field caption itself needs to reflect an invalid or critical state.

**When NOT to use:**

- Do not use `Label` for helper text, descriptions, or error copy; keep those in separate supporting text nodes.
- Do not use `Label` as a generic typography primitive outside form-control association.

---

## Design Decisions

| Decision                   | Choice                           | Rationale                                                                                                    |
| -------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Root primitive             | `@radix-ui/react-label` + `Box`  | Radix preserves label semantics and control association; `Box` keeps the authored DOM compliant with policy. |
| CVA strategy               | Flat root variants               | The contract only needs a tone scale plus disabled treatment; no slot family or compound structure is needed. |
| Controlled vs uncontrolled | none                             | `Label` is presentational and semantic only.                                                                  |
| Composition pattern        | flat API                         | `vercel-composition-patterns` evaluation does not justify compound structure or extra boolean variants here. |
| `asChild` support          | no                               | The shared contract should stay a real label element, not a polymorphic wrapper.                             |
| Box-only DOM rule          | explicit                         | The authored label root, text wrapper, and required indicator all render through `Box`.                      |

---

## Props Interface

| Prop        | Type                                          | Default     | Required | Description                                                                 |
| ----------- | --------------------------------------------- | ----------- | -------- | --------------------------------------------------------------------------- |
| `htmlFor`   | `string`                                      | `undefined` | No       | Id of the associated form control.                                          |
| `required`  | `boolean`                                     | `false`     | No       | Renders the inline required indicator after the label text.                 |
| `disabled`  | `boolean`                                     | `false`     | No       | Applies muted disabled styling to the label.                                |
| `tone`      | `'default' \| 'muted' \| 'destructive'`     | `'default'` | No       | Semantic text treatment for normal, low-emphasis, and destructive contexts. |
| `className` | `string`                                      | `undefined` | No       | Consumer override merged last through `cn()`.                               |
| `children`  | `React.ReactNode`                             | -           | Yes      | Visible label content announced as the control name when associated.        |
| `...props`  | `React.LabelHTMLAttributes<HTMLLabelElement>` | -           | No       | Native label props such as `id`, `onClick`, `aria-*`, and `data-*`.         |

---

## Variants

| Variant            | Description                  | When to use                                                  |
| ------------------ | ---------------------------- | ------------------------------------------------------------ |
| `tone=default`     | Standard high-contrast label | General form fields and most shared field compositions.      |
| `tone=muted`       | Lower-emphasis label         | Secondary or compact field captions.                         |
| `tone=destructive` | Destructive-emphasis label   | Fields whose caption should reflect an invalid or error state. |

---

## States

| State        | Visual Behavior                                                   | Accessibility                                                                        |
| ------------ | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Default      | Medium-weight field caption in foreground text                    | Uses native label semantics through Radix Label.                                     |
| Required     | Appends an inline asterisk after the label text                   | The label still names the control; the asterisk remains decorative with `aria-hidden`. |
| Disabled     | Muted text with reduced emphasis and not-allowed cursor treatment | The disabled visual state is explicit even though `<label>` itself has no disabled attribute. |
| Destructive  | Label text changes to destructive token color                     | Helps align the caption with invalid or error field state without changing semantics. |
| Long content | Label text wraps without clipping and keeps the required indicator aligned | Readable multi-line captions remain associated with the control.            |

`Label` has no hover, focus, loading, or interactive state of its own. Focus belongs to the associated control.

---

## Accessibility

### ARIA Roles & Attributes

| Element            | Role / Attribute | Value                                             |
| ------------------ | ---------------- | ------------------------------------------------- |
| Root               | implicit role    | Native `<label>` semantics via Radix Label        |
| Root               | `htmlFor`        | Associates the label with the matching control id |
| Required indicator | `aria-hidden`    | `true`                                            |

### Keyboard Map

| Key     | Behavior                                                                       |
| ------- | ------------------------------------------------------------------------------ |
| `Tab`   | Moves focus to the associated control, not the label itself                    |
| `Space` | Browser default when the associated control supports it after label activation |
| `Enter` | Browser default when the associated control supports it after label activation |

### Focus Management

- `Label` itself does not enter the tab order.
- Clicking or tapping the label forwards activation to the associated control when `htmlFor` points to a labelable element.

### Screen Reader Notes

- The label text becomes the accessible name for the associated control when `htmlFor` is provided.
- The required asterisk stays decorative and should not replace real required semantics on the control itself.

---

## Usage Examples

### 1. Basic usage

```tsx
<Label htmlFor="email">Email address</Label>
```

### 2. Required field

```tsx
<Label htmlFor="amount" required>
  Amount
</Label>
```

### 3. Destructive tone

```tsx
<Label htmlFor="password" tone="destructive">
  Password
</Label>
```

### 4. Composed usage

```tsx
<Box className="grid gap-2">
  <Label htmlFor="marketing-opt-in">Receive release updates</Label>
  <Box as="input" id="marketing-opt-in" type="checkbox" className="peer h-4 w-4" />
</Box>
```

---

## Do / Don't

| Do                                                                         | Don't                                                                                  |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Use `htmlFor` to link the label to a control id.                           | Rely on placeholder text alone as the only field identifier.                           |
| Keep `required` as a visual companion to real control-level `required`.    | Treat the asterisk as a substitute for actual required semantics on the control.       |
| Use `tone="destructive"` when the caption should align with an invalid field. | Add parallel props like `isError`, `danger`, or ad-hoc status booleans.          |
| Keep authored shared JSX on `Box`, including the label and required mark.  | Hand-write native `label` or `span` tags in shared source or stories.                  |
| Keep helper text and error copy in separate supporting nodes.              | Overload `Label` to render descriptions, validation messages, or field layout wrappers. |

---

## Storybook Stories Required

**Story file title:** `'Inputs/Label'`

- [x] `Default`
- [x] `Tones`
- [x] `RequiredState`
- [x] `DisabledState`
- [x] `InteractiveAssociation`
- [x] `ResponsiveLayout`

---

## Box-only DOM policy

- Authored shared JSX for this component and its stories must use `Box` for every DOM node.
- The semantic label root renders through `@radix-ui/react-label` with `asChild`, which delegates to `Box as="label"`.
- Supporting nodes such as label text wrappers, required indicators, and story controls also render through `Box`.

---

## Changelog

| Date       | Change             |
| ---------- | ------------------ |
| 2026-03-10 | Initial Label spec |
