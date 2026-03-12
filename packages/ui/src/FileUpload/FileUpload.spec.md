# FileUpload Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Inputs` |
| Component Tier | `Tier 2 (Composite)` |
| Structure Tier | `Standard` |
| Based on | `Tier 1 composition` |

---

## Overview

`FileUpload` is the shared file-selection field shell for forms and lightweight upload entry points across apps. It standardizes the repeated baseline needs surfaced in the normalization summaries: visible labelling, disabled and invalid treatment, single or multiple file selection, selection summary, item-level remove affordances, and a tokenized file list while keeping the actual upload transport outside `@repo/ui`.

This component intentionally stops at the selection boundary. It does not upload files, crop images, preview media, generate presigned URLs, show transfer progress, or encode document-specific business rules. High-parity upload flows such as identity capture, image cropping, and multi-step declaration uploads stay local and compose this shared shell only when the selection UI itself is reusable.

**When to use:**

- Use `FileUpload` for shared file-picking UI where the parent surface owns validation, transport, and submission logic.
- Use `multiple`, `accept`, and `maxSize` to express browser-level selection rules without introducing app-specific workflow props.

**When NOT to use:**

- Do not use `FileUpload` for cropping, camera workflows, image previews, OCR, or identity-document capture.
- Do not move upload transport, progress polling, retry logic, or auth-aware file handling into this component.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Primitive | native file input composed through `Box as="input"` | Keeps browser file-selection semantics and satisfies the Box-only DOM rule. |
| CVA strategy | slot-based | The dropzone shell, selection list, inline status copy, and item-level remove action need separate tokenized styling. |
| Controlled vs uncontrolled | both | Apps need both form-library controlled usage and low-friction local selection handling. |
| Composition model | flat API | `vercel-composition-patterns` evaluation does not justify a compound API here; the component is a single field shell, not a multi-part system. |
| Sequential multi-select behavior | append + dedupe | Additional picks in `multiple` mode append to the existing list and ignore exact duplicates so the field behaves like an attachment list instead of replacing prior selections. |
| Selected-state feedback | summary only in dropzone | The dropzone communicates state without repeating uploaded filenames that already appear in the list below. |
| Transport handling | local only | Shared UI should stop at selection and generic validation; upload orchestration belongs to apps. |
| Box-only DOM rule | explicit | All authored shared JSX and stories render through `Box`, including the semantic input, list, labels, messages, buttons, and list items. |

---

## Props Interface

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `File \| File[] \| null` | `undefined` | No | Controlled selected file value. |
| `onChange` | `(file: File \| File[] \| null) => void` | `undefined` | No | Called after a valid file selection or item removal. |
| `accept` | `string` | `undefined` | No | Native accept filter passed to the hidden file input. |
| `multiple` | `boolean` | `false` | No | Allows multiple file selection and list rendering. Sequential picks append to the existing selection. |
| `disabled` | `boolean` | `false` | No | Disables selection and item remove actions. |
| `maxSize` | `number` | `undefined` | No | Optional generic client-side size limit in bytes. |
| `error` | `string \| boolean` | `false` | No | Marks the field invalid; string values render inline error copy. |
| `clearable` | `boolean` | `false` | No | Shows item-level remove actions when files are selected. |
| `onClear` | `() => void` | `undefined` | No | Called when the last selected file is removed and the selection becomes empty. |
| `label` | `string` | `undefined` | No | Visible label associated to the file input. |
| `className` | `string` | `undefined` | No | Consumer override merged onto the outer field wrapper through `cn()`. |
| `...props` | `React.InputHTMLAttributes<HTMLInputElement>` | - | No | Native file input props such as `name`, `required`, `form`, and `capture`. |

---

## Variants

`FileUpload` does not expose a public `variant` prop. The reusable surface is intentionally stable so apps converge on one file-field shell instead of reintroducing styling booleans.

### Selection modes

| Mode | Behavior | When to use |
| --- | --- | --- |
| single | Renders one selected file row and replaces it when the user chooses another file | Standard attachments, avatars, receipts, or one-document fields. |
| multiple | Renders a selected file list, appends files across sequential picks, dedupes exact repeats, and removes items individually until the selection clears | Supporting documents, grouped attachments, or import batches owned by the parent workflow. |

---

## States

| State | Visual Behavior | Accessibility |
| --- | --- | --- |
| Default | Dashed tokenized field shell with file-selection prompt | Native file-input semantics via `Box as="input"` |
| Selected | Dropzone switches to neutral selection status while the file list below shows the uploaded filename(s) | Summary updates use `aria-live="polite"` |
| Multiple | After files exist, dropzone copy changes to an additive `Add more files` prompt while the list continues to grow below | The input keeps native multiple selection semantics |
| Disabled | Muted surface and no pointer or keyboard selection | Uses native `disabled` on the file input |
| Error | Destructive border and inline error message | Uses `aria-invalid="true"` and links message through `aria-describedby` |
| Size rejected | Existing selection is preserved and a generic max-size message is shown | Inline message uses `role="alert"` |
| Clearable | Each selected file row shows its own remove action | Remove buttons are keyboard focusable and file-specific |

---

## Accessibility

### ARIA Roles & Attributes

| Element | Role / Attribute | Value |
| --- | --- | --- |
| Input | implicit role | Native file input semantics |
| Input | `aria-labelledby` | Points to the generated label id when `label` is present |
| Input | `aria-describedby` | Includes summary and error ids when present |
| Input | `aria-invalid` | `true` when `error` or local size validation is active |
| Summary | `aria-live` | `polite` |
| Error message | `role` | `alert` |
| Remove button | `aria-label` | `"Remove {file name}"` |

### Keyboard Map

| Key | Behavior |
| --- | --- |
| `Tab` | Moves focus to the file input and any visible remove actions |
| `Enter` / `Space` | Opens the native file picker when the input is focused; activates remove actions when their buttons are focused |
| `Escape` | No custom behavior; browser and parent-surface behavior remain intact |

### Focus Management

- The visible dropzone shell uses `focus-within` so keyboard focus remains obvious even though the native input is visually hidden.
- Removing a file restores focus to the hidden input element so keyboard users can reselect immediately.

### Screen Reader Notes

- The component prefers a visible `label`; when no visible label is rendered, consumers must provide an accessible name through native `aria-*` props.
- The selection summary is linked to the input through `aria-describedby` so accepted formats, size guidance, and selected-state feedback stay discoverable.
- Inline validation messages are announced through `role="alert"` and `aria-describedby`.

---

## Usage Examples

### 1. Basic usage

```tsx
<FileUpload label="Supporting document" accept=".pdf,.png" />
```

### 2. Multiple files

```tsx
<FileUpload
  label="Claim attachments"
  accept=".pdf,.png,.jpg"
  multiple
  clearable
/>
```

### 3. With validation

```tsx
<FileUpload
  label="Import file"
  accept=".csv"
  maxSize={2 * 1024 * 1024}
  error="Please choose a CSV smaller than 2 MB."
/>
```

### 4. Form-library controlled usage

```tsx
<FormField
  name="attachments"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Attachments</FormLabel>
      <FormControl>
        <FileUpload
          multiple
          value={field.value}
          onChange={field.onChange}
          accept=".pdf,.png"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## Do / Don't

| Do | Don't |
| --- | --- |
| Use `onChange` to hand selected files to app-owned upload logic. | Trigger network uploads, presigned URL fetches, or progress polling inside `FileUpload`. |
| Use `multiple`, `accept`, and `maxSize` for shared browser-level rules. | Reintroduce app-local booleans such as `withPreview`, `isCamera`, or `cropImage`. |
| Use `multiple` mode as an additive file list. | Replace the whole `multiple` selection every time the user picks more files. |
| Use `Controller` or shared `Form` composition when the field is managed by a form library. | Depend on hidden business validation or workflow state inside the shared component. |
| Keep image previews, cropping, and identity-specific file rules local. | Treat all app-local upload flows as automatically shareable. |
| Keep authored shared JSX and stories on `Box`, including the semantic input and file list. | Hand-write native `input`, `button`, `ul`, `li`, or `p` tags in shared authored JSX. |
| Keep selected filenames in the file list, not duplicated inside the dropzone copy. | Repeat uploaded filenames in both the dropzone and the list below. |

---

## Storybook Stories Required

**Story file title:** `'Inputs/FileUpload'`

- [x] `Default`
- [x] `MultipleFiles`
- [x] `ErrorState`
- [x] `DisabledState`
- [x] `ClearableSelection`
- [x] `MaxSizeValidation`

---

## Box-only DOM policy

- Authored shared JSX for this component and its stories must use `Box` for every DOM node.
- Semantic nodes such as the file input, button, label, list, list item, and helper copy must render through `Box as="input"`, `Box as="button"`, `Box as="label"`, `Box as="ul"`, `Box as="li"`, and `Box as="p"`.
- Inline SVG is not authored directly; the component uses shared Lucide icon components instead.

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-12 | Initial FileUpload spec |
| 2026-03-12 | Refined selected-state copy and moved clear actions to item-level remove controls |
| 2026-03-12 | Updated `multiple` mode to append sequential selections and keep the dropzone additive |
