# Textarea Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Inputs` |
| Component Tier | `Tier 1 (Primitive)` |
| Structure Tier | `Standard` |
| Based on | `Box` with `as="textarea"` |

---

## Overview

`Textarea` is the shared multiline text-entry primitive for plain-text notes, comments, descriptions, and other longer freeform input across apps. The contract covers the repeated cross-app baseline needs: label and helper copy, inline invalid feedback, disabled treatment, clearable content, and controlled or uncontrolled usage without introducing app-specific formatting or workflow logic.

This component intentionally stays at the plain-text field-shell boundary. It does not implement auto-grow state machines, rich-text behavior, markdown tooling, upload handling, mention systems, or domain-specific validation rules. Those behaviors stay local and compose the shared primitive instead of widening the API.

**When to use:**

- Use `Textarea` for longer plain-text entry such as remarks, descriptions, support notes, and optional freeform comments.
- Use native textarea props such as `rows`, `maxLength`, `minLength`, and `name` to tune browser behavior without changing the shared contract.

**When NOT to use:**

- Do not use `Textarea` for rich-text, markdown, or editor-style experiences.
- Do not use `Textarea` to absorb auto-grow logic, mention search, upload affordances, or workflow-specific formatting.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Root primitive | `Box` + semantic textarea | Satisfies the Box-only authored DOM rule while keeping native multiline semantics and ref forwarding. |
| CVA strategy | Slot-based | Field shell, control shell, textarea node, helper text, error text, and clear action need independent state styling. |
| Controlled vs uncontrolled | both | App baselines mix `value` and `defaultValue`; the shared primitive must support native controlled and uncontrolled patterns. |
| Shared visual API | no `variant` / no `size` | The normalized `02` contract keeps Textarea intentionally narrow; rows, width, and layout remain native or consumer-owned. |
| `asChild` support | no | The semantic root must stay an actual textarea element. |
| Composition review | flat API retained | `vercel-composition-patterns` evaluation found no need for compound parts or extra mode booleans on this primitive. |
| Box-only DOM rule | explicit | Wrapper, control shell, textarea node, helper text, error text, and clear button all render through `Box`. |

---

## Props Interface

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `error` | `string \| boolean` | `false` | No | Marks the field invalid; string values also render inline error text. |
| `disabled` | `boolean` | `false` | No | Disables editing and updates visual treatment. |
| `required` | `boolean` | `false` | No | Applies native required semantics and updates the visible label indicator. |
| `label` | `string` | `undefined` | No | Field label associated with the textarea through `htmlFor`. |
| `placeholder` | `string` | `undefined` | No | Native placeholder text for empty multiline entry. |
| `helperText` | `string` | `undefined` | No | Supporting helper copy rendered below the field shell. |
| `clearable` | `boolean` | `false` | No | Shows a clear action when the field has content and remains interactive. |
| `onChange` | `(event: React.ChangeEvent<HTMLTextAreaElement>) => void` | `undefined` | No | Standard React textarea change handler. |
| `onValueChange` | `(value: string) => void` | `undefined` | No | Convenience callback with the current string value. |
| `className` | `string` | `undefined` | No | Consumer override merged onto the outer field wrapper through `cn()`. |
| `...props` | `React.TextareaHTMLAttributes<HTMLTextAreaElement>` | - | No | Native textarea props such as `rows`, `maxLength`, `minLength`, `name`, and `autoComplete`. |

---

## States

| State | Visual Behavior | Accessibility |
| --- | --- | --- |
| Default | Tokenized border, background, placeholder, and multiline padding treatment | Native textarea semantics via `Box as="textarea"` |
| Focus | Visible `focus-within` ring on the field shell | Keyboard focus remains obvious without extra scripting |
| Disabled | Muted opacity and blocked interaction | Uses native `disabled` on the textarea element |
| Error | Destructive border and inline error message | Uses `aria-invalid="true"` and links helper and error copy with `aria-describedby` |
| Clearable | Clear action appears when the field has content and interaction is allowed | Clear button stays keyboard reachable and is labelled `Clear text` |
| Resize | Native vertical resize handle remains available | Resizing stays browser-native and requires no custom keyboard model |
| Read-only | Shared shell remains visible but suppresses clear affordances | Preserves native `readOnly` semantics |

---

## Accessibility

### Semantics and ARIA

| Element | Role / Attribute | Value |
| --- | --- | --- |
| Textarea | implicit role | Native `textbox` with multiline semantics |
| Textarea | `aria-invalid` | `true` when `error` is truthy |
| Textarea | `aria-describedby` | Includes helper and error ids when present |
| Error copy | `role` | `alert` |
| Clear button | `aria-label` | `"Clear text"` |

### Keyboard behavior

| Key | Behavior |
| --- | --- |
| `Tab` | Moves focus to the textarea and any clear action button |
| `Enter` | Inserts a newline while editing content |
| `Escape` | Consumer-owned behavior only; the shared primitive does not hijack it |

### Focus management

- `Textarea` does not move focus automatically while typing.
- Activating the clear button restores focus to the textarea after clearing.

### Screen reader notes

- The visible `label` becomes the accessible name when provided.
- Helper and error copy are linked through `aria-describedby`.
- Consumers without a visible label must provide an accessible name via native `aria-label` or `aria-labelledby`.

---

## Usage Examples

### 1. Basic usage

```tsx
<Textarea label="Notes" placeholder="Add internal notes…" rows={4} />
```

### 2. Error state

```tsx
<Textarea
  label="Description"
  placeholder="Add a plain-text description…"
  error="Description is required."
  helperText="Use plain text only."
  rows={5}
/>
```

### 3. Controlled usage

```tsx
<Textarea
  value={notes}
  onValueChange={setNotes}
  clearable
  placeholder="Add remarks…"
/>
```

---

## Do / Don't

| Do | Don't |
| --- | --- |
| Use native textarea props such as `rows` and `maxLength` for browser-level behavior. | Add app-specific props like `height`, `autoGrow`, or `withBorder` back into the shared API. |
| Use `error` and `helperText` for shared feedback semantics. | Reintroduce parallel props such as `errorMessage` or `hasError`. |
| Keep clear, resize, and multiline behavior browser-native where possible. | Put rich-text, markdown, mention search, or upload logic inside `Textarea`. |
| Keep authored shared JSX and stories on `Box`, including the textarea node and clear button. | Hand-write native `textarea`, `button`, `p`, or wrapper tags in shared authored JSX. |

---

## Storybook Stories Required

**Story file title:** `'Inputs/Textarea'`

- [x] `Default`
- [x] `Resize`
- [x] `ErrorState`
- [x] `DisabledState`
- [x] `Clearable`

---

## Box-only DOM policy

- Authored shared JSX for this component and its stories must use `Box` for every DOM node.
- Semantic elements such as the textarea, clear button, helper text, and error text must render through `Box as="textarea"`, `Box as="button"`, and `Box as="p"`.
- The component must not hand-write native JSX tags even for structural wrappers.

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-10 | Initial Textarea spec |
