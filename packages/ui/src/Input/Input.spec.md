# Input Spec

## Metadata

| Field           | Value                   |
| --------------- | ----------------------- |
| Storybook Group | `Inputs`                |
| Component Tier  | `Tier 1 (Primitive)`    |
| Structure Tier  | `Standard`              |
| Based on        | `Box` with `as="input"` |

---

## Overview

`Input` is the shared text-entry primitive for simple text, email, password, phone, numeric, and currency-adjacent entry across apps. The contract absorbs the repeated baseline needs surfaced in the normalization summaries: label and helper copy, invalid feedback, disabled and loading states, optional left and right adornments, normalized input modes, and an app-agnostic clear affordance.

This component intentionally stops at the field-shell boundary. It does not implement masking, domain-specific formatting, async validation, password-visibility toggles, or transport logic. Those behaviors remain local and compose the shared primitive instead of widening the shared API.

**When to use:**

- Use `Input` for single-line text entry, inline filters, search fields, and low-level form primitives.
- Use `inputMode` plus native input props to express semantic entry intent such as email, phone, number, or password.

**When NOT to use:**

- Do not use `Input` for searchable option lists, phone-code pickers, or async autocomplete; those stay on `Select`, `Combobox`, or app-local wrappers.
- Do not use `Input` to absorb currency masking, password-visibility toggles, or workflow-specific validation logic.

---

## Design Decisions

| Decision                   | Choice                  | Rationale                                                                                                         |
| -------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Root primitive             | `Box` + semantic input  | Satisfies the Box-only authored DOM policy while preserving native input semantics and ref forwarding.            |
| CVA strategy               | Slot-based              | Control shell, label, helper text, error copy, and affix actions each need independent token treatment.          |
| Controlled vs uncontrolled | both                    | React baselines across apps mix both modes; the shared primitive must support native `value` and `defaultValue`. |
| `asChild` support          | no                      | The semantic root must stay an actual input element; composition through wrappers or field shells stays local.    |
| API shape                  | flat                    | `vercel-composition-patterns` evaluation does not justify compound context here; slot props cover current needs.  |
| Box-only DOM rule          | explicit                | Wrapper, label, input node, helper text, error text, and clear button all render through `Box`.                  |

---

## Props Interface

| Prop            | Type                                                                    | Default     | Required | Description                                                                 |
| --------------- | ----------------------------------------------------------------------- | ----------- | -------- | --------------------------------------------------------------------------- |
| `variant`       | `'default' \| 'outline' \| 'ghost'`                                     | `'default'` | No       | Shared field shell appearance.                                              |
| `size`          | `'xs' \| 'sm' \| 'md' \| 'lg'`                                          | `'md'`      | No       | Shared density scale for the control and surrounding copy.                  |
| `inputMode`     | `'text' \| 'email' \| 'phone' \| 'currency' \| 'number' \| 'password'` | `'text'`    | No       | Normalized semantic entry intent that also maps sensible native attributes. |
| `error`         | `string \| boolean`                                                     | `false`     | No       | Marks the field invalid; string values also render inline error text.       |
| `loading`       | `boolean`                                                               | `false`     | No       | Shows a trailing spinner and marks the field busy.                          |
| `disabled`      | `boolean`                                                               | `false`     | No       | Disables interaction and updates styling.                                   |
| `required`      | `boolean`                                                               | `false`     | No       | Adds required semantics and an inline required indicator beside the label.  |
| `label`         | `string`                                                                | `undefined` | No       | Inline field label associated with the input through `htmlFor`.             |
| `helperText`    | `string`                                                                | `undefined` | No       | Supporting helper copy rendered below the field shell.                      |
| `leftIcon`      | `React.ReactNode`                                                       | `undefined` | No       | Optional leading adornment slot.                                            |
| `rightIcon`     | `React.ReactNode`                                                       | `undefined` | No       | Optional trailing adornment slot when `loading` is not active.              |
| `clearable`     | `boolean`                                                               | `false`     | No       | Shows a clear button when the field has a value and is interactive.         |
| `onChange`      | `(event: React.ChangeEvent<HTMLInputElement>) => void`                  | `undefined` | No       | Standard React input change handler.                                        |
| `onValueChange` | `(value: string) => void`                                               | `undefined` | No       | Convenience callback with the current string value.                         |
| `fieldClassName` | `string`                                                               | `undefined` | No       | Consumer override merged onto the outer field wrapper through `cn()`.        |
| `inputClassName` | `string`                                                               | `undefined` | No       | Consumer override merged onto the semantic `input` element for text or placeholder styling. |
| `className`     | `string`                                                                | `undefined` | No       | Consumer override merged onto the visible input control shell through `cn()`. |
| `...props`      | `React.InputHTMLAttributes<HTMLInputElement>`                           | -           | No       | Native input props such as `name`, `placeholder`, `maxLength`, and `autoComplete`. |

---

## Variants

| Variant   | Description                                 | When to use                                                     |
| --------- | ------------------------------------------- | --------------------------------------------------------------- |
| `default` | Bordered surface with background and shadow | Standard form and filter inputs.                                |
| `outline` | Lower-elevation bordered shell              | Dense or layered layouts that already provide strong surfaces.  |
| `ghost`   | Minimal chrome with muted background        | Toolbar search and inline utility fields with lighter emphasis. |

## Sizes

| Size | Behavior                  | Intended use                                |
| ---- | ------------------------- | ------------------------------------------- |
| `xs` | Tightest field density    | Dense table filters and compact inline use. |
| `sm` | Small shared field shell  | Secondary toolbars and compact forms.       |
| `md` | Default shared field size | Standard forms and general-purpose usage.   |
| `lg` | Larger touch target shell | Prominent search and mobile-first forms.    |

## Input modes

| Mode       | Native mapping                          | Intended use                                                  |
| ---------- | --------------------------------------- | ------------------------------------------------------------- |
| `text`     | `type="text"`                           | General text entry.                                           |
| `email`    | `type="email"` + `inputMode="email"`    | Email-address entry.                                          |
| `phone`    | `type="tel"` + `inputMode="tel"`        | Phone-number entry without bundling phone-code UI.            |
| `currency` | `type="text"` + `inputMode="decimal"`   | Currency entry where masking and formatting stay local.       |
| `number`   | `type="number"` + `inputMode="numeric"` | Numeric entry using native number semantics when desired.     |
| `password` | `type="password"`                       | Hidden value entry without a built-in visibility toggle.      |

---

## States

| State      | Visual Behavior                                                            | Accessibility                                                                  |
| ---------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Default    | Tokenized border, background, and placeholder treatment                    | Native input semantics via `Box as="input"`                                    |
| Hover      | Subtle shell transition through token colors                               | No hover-only information                                                      |
| Focus      | Visible `focus-within` border emphasis with a subtle near-shell halo on the field shell | Keyboard focus remains obvious across variants without a detached offset halo |
| Disabled   | Muted opacity and blocked interaction                                      | Uses native `disabled` on the input element                                    |
| Loading    | Trailing spinner replaces the right adornment                              | Field shell exposes `aria-busy="true"`                                         |
| Error      | Destructive border, calmer invalid halo, and inline error message        | Uses `aria-invalid="true"` and links error and helper text through `aria-describedby` |
| Clearable  | Clear action appears when the field has content and interaction is allowed | Clear button is focusable and labelled `Clear input`                           |
| Read-only  | Inherits field chrome without interactive affordances such as clear        | Preserves native `readOnly` semantics                                          |

---

## Accessibility

### ARIA Roles & Attributes

| Element      | Role / Attribute   | Value                                                    |
| ------------ | ------------------ | -------------------------------------------------------- |
| Input        | implicit role      | Native text-entry semantics                              |
| Input        | `aria-invalid`     | `true` when `error` is truthy                            |
| Input        | `aria-describedby` | Includes helper and error ids when present               |
| Input        | `aria-labelledby`  | Points to the generated label id when `label` is present |
| Field shell  | `aria-busy`        | `true` while `loading` is active                         |
| Error copy   | `role`             | `alert`                                                  |
| Clear button | `aria-label`       | `"Clear input"`                                          |

### Keyboard Map

| Key      | Behavior                                             |
| -------- | ---------------------------------------------------- |
| `Tab`    | Moves focus to the input and any clear action button |
| `Enter`  | Submits the parent form when form semantics allow it |
| `Escape` | Consumer-owned behavior only; the shared input does not hijack it |

### Focus Management

- `Input` does not move focus automatically during normal typing.
- Activating the clear button restores focus to the input element after clearing.

### Screen Reader Notes

- The visible label becomes the accessible name when `label` is provided.
- Helper and error copy are linked to the input through `aria-describedby`.
- Consumers without a visible label must provide an accessible name via native `aria-*` props.

---

## Usage Examples

### 1. Basic usage

```tsx
<Input label="Email" placeholder="name@example.com" inputMode="email" />
```

### 2. With affixes

```tsx
<Input
  label="Search"
  placeholder="Search documents"
  leftIcon={<Search aria-hidden="true" className="h-4 w-4" />}
  clearable
/>
```

### 3. Error state

```tsx
<Input
  label="Amount"
  inputMode="currency"
  error="Enter a valid amount."
  helperText="Use whole numbers or decimals."
/>
```

### 4. Controlled usage

```tsx
<Input
  value={query}
  onValueChange={setQuery}
  placeholder="Filter results"
  variant="ghost"
/>
```

---

## Do / Don't

| Do                                                                                 | Don't                                                                                 |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Use `inputMode` to normalize semantic entry intent across apps.                    | Reintroduce app-local booleans such as `isCurrency`, `showClear`, or `iconPosition`. |
| Keep masking, formatting, and async validation local and compose the shared field. | Put domain-aware formatting or service calls inside `Input`.                          |
| Use `error` and `helperText` for the shared feedback contract.                     | Add `errorMessage`, `hasError`, or other parallel API names.                          |
| Pass adornments through `leftIcon` and `rightIcon`.                                | Add custom one-off icon props per app.                                                |
| Keep authored shared JSX and stories on `Box`, including `label`, `input`, and `p`. | Hand-write native DOM tags in shared authored JSX.                                    |
| Supply an accessible name through `label` or native `aria-*` props.               | Depend on placeholders alone to identify the field.                                   |

---

## Storybook Stories Required

**Story file title:** `'Inputs/Input'`

- [x] `Default`
- [x] `Variants`
- [x] `Sizes`
- [x] `Types`
- [x] `WithAffixes`
- [x] `ErrorState`
- [x] `DisabledState`
- [x] `LoadingState`
- [x] `Clearable`

---

## Box-only DOM policy

- Authored shared JSX for this component and its stories must use `Box` for every DOM node.
- Semantic elements such as the label, input, helper text, error text, and clear button must render through `Box as="label"`, `Box as="input"`, `Box as="p"`, and `Box as="button"`.
- Inline SVG is not authored directly here; icon slots accept `ReactNode`, and loading uses a shared Lucide icon component.

---

## Changelog

| Date       | Change             |
| ---------- | ------------------ |
| 2026-03-10 | Initial Input spec |
| 2026-03-17 | Aligned field-shell focus guidance to the Wave 1 calmer near-halo recipe |


