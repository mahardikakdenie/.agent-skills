# RichTextEditor Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Inputs` |
| Component Tier | `Tier 2 (Composite)` |
| Structure Tier | `Complex` |
| Based on | `@tiptap/react` + `@tiptap/starter-kit` + `@tiptap/extension-link` |

---

## Overview

`RichTextEditor` is the shared rich text field shell for long-form comments, notes, and description inputs that need basic formatting without pulling uploads, mentions, domain entities, or workflow logic into `@repo/ui`. It uses headless Tiptap as the editing engine, keeps the shared contract deliberately narrow, and treats sanitization as part of the component boundary instead of an afterthought in consuming app code.

This shared contract is intentionally scoped to core rich-text behavior only: paragraph and heading structure through level 3, inline marks, lists, quotes, code blocks, and links. Media uploads, mentions, slash commands, AI helpers, and app-specific viewer wrappers remain local because they depend on transport, permissions, or business rules that do not belong in a shared UI package.

**When to use:**

- Use `RichTextEditor` for reusable comment, notes, and description fields that emit sanitized HTML.
- Use `toolbar="minimal"` when the surface only needs compact text formatting and list controls.
- Use `readonly` when a flow needs the same shared rich-text presentation without edit controls.

**When NOT to use:**

- Do not use `RichTextEditor` for attachments, mentions, slash menus, media embeds, or upload-heavy editorial workflows.
- Do not move HTML rendering, business validation, service calls, or autosave orchestration into this component.
- Keep app-local viewer shells when a route needs custom sanitization policy or domain-specific output formatting.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Editing engine | headless Tiptap | Satisfies the opened decision gate with a mature ProseMirror-based editor that stays UI-agnostic. |
| Shared feature scope | core formatting + links only | Keeps the first shared contract app-agnostic and avoids importing upload, mention, or media behavior from `ticket-portal`. |
| Toolbar model | preset modes: `default`, `minimal`, `none` | Keeps the public API compact while still allowing a richer enterprise toolbar internally. |
| Value contract | HTML string | Matches the legacy intake and keeps persistence concerns in app code. |
| Sanitization | enabled by default with optional override | Makes the security boundary explicit at the shared component edge while still allowing app-owned custom sanitizers when needed. |
| Readonly model | same shell, toolbar removed | Preserves display parity while preventing non-functional controls. |
| Client-boundary note | client-only interactive surface | Tiptap depends on browser editing APIs; consuming apps should render it from client components. |
| Box-only DOM rule | explicit authored boundary | All authored shared wrappers use `Box`; Tiptap's ProseMirror DOM remains the documented third-party boundary. |

---

## Props Interface

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | internal state | No | Controlled HTML value. |
| `defaultValue` | `string` | `''` | No | Uncontrolled initial HTML value. |
| `onChange` | `(value: string) => void` | `undefined` | No | Called whenever the editor emits a sanitized HTML update. |
| `onBlur` | `() => void` | `undefined` | No | Called when the editor loses focus. |
| `onFocus` | `() => void` | `undefined` | No | Called when the editor gains focus. |
| `toolbar` | `'default' | 'minimal' | 'none'` | `'default'` | No | Shared toolbar preset. |
| `readonly` | `boolean` | `false` | No | Sets the editor to non-editable mode and hides the toolbar. |
| `sanitize` | `boolean | ((html: string) => string)` | `true` | No | Enables the shared DOMPurify-based sanitizer or allows an app-owned sanitizer function. |
| `label` | `string` | `undefined` | No | Visible field label announced to assistive technology through `aria-labelledby`. |
| `helperText` | `string` | `undefined` | No | Supporting guidance shown below the editor shell. |
| `error` | `string | boolean` | `false` | No | Invalid state flag or inline validation message. |
| `required` | `boolean` | `false` | No | Adds a visible required indicator next to the label. |
| `className` | `string` | `undefined` | No | Consumer override merged onto the outer field wrapper. |
| `id` | `string` | generated | No | Applied to the editable content region. |
| `aria-label` | `string` | `'Rich text editor'` fallback | No | Accessible name when no visible label exists. |
| `aria-labelledby` | `string` | `undefined` | No | External accessible label reference. |
| `aria-describedby` | `string` | `undefined` | No | External supporting copy or validation reference. |

---

## Toolbar Modes

| Mode | Included actions | When to use |
| --- | --- | --- |
| `default` | paragraph, heading 1, heading 2, heading 3, bold, italic, strike, inline code, bullet list, ordered list, block quote, code block, link, clear formatting, undo, redo | Rich long-form notes and descriptions that still need a bounded shared authoring surface. |
| `minimal` | bold, italic, strike, inline code, bullet list, ordered list, link, undo, redo | Comment streams and compact update forms where core formatting still matters. |
| `none` | none | Readonly or app-owned custom chrome. |

Toolbar guidance:

- Every toolbar action exposes a descriptive tooltip so icon-only controls remain understandable on hover and keyboard focus.
- Tooltips prioritize action intent first, then the full set of supported keyboard shortcuts where that guidance is stable and useful.
- Undo, redo, and clear-formatting actions stay in the shared toolbar because they improve authoring quality without widening the public API surface.
- Toolbar chrome stays compact by trimming outer padding and group spacing before reducing individual action hit areas.
- Shared shortcut coverage follows common editor conventions for structure, formatting, history, lists, and links; any shortcut surfaced in a tooltip is expected to work in the editor.
- The inline link editor uses a compact shared URL field with matched action heights so secondary controls stay visually aligned with the surrounding toolbar chrome.

---

## States

| State | Visual Behavior | Accessibility |
| --- | --- | --- |
| Default | Tokenized bordered editor shell with toolbar and minimum editing height | Editable region uses `role="textbox"` and `aria-multiline="true"` |
| Focus | Shell gains visible ring and border emphasis | Keyboard users retain a clear focus path |
| Readonly | Toolbar is hidden and the content area remains visible in the same shell | Editable region exposes `aria-readonly="true"` |
| Error | Border and inline message switch to destructive treatment | Editable region exposes `aria-invalid="true"` and links the alert message |
| Sanitized | Unsafe tags and attributes are removed from incoming and emitted HTML | Security boundary is explicit in the public API |
| Empty | Editor remains visible with an empty paragraph model | Live region announces empty or updated content changes politely |

---

## Accessibility

### ARIA Roles & Attributes

| Element | Role / Attribute | Value |
| --- | --- | --- |
| Editable region | `role` | `textbox` |
| Editable region | `aria-multiline` | `true` |
| Editable region | `aria-labelledby` | generated label id or consumer-provided reference |
| Editable region | `aria-describedby` | helper and error ids plus any consumer-provided ids |
| Editable region | `aria-invalid` | `true` when `error` is truthy |
| Editable region | `aria-readonly` | `true` when `readonly` is enabled |
| Error message | `role` | `alert` |
| Toolbar buttons | `aria-label`, `aria-pressed`, plus grouped `role="toolbar"` / `role="group"` semantics | formatting labels, active state, and clearer assistive structure |

### Keyboard Map

| Key | Behavior |
| --- | --- |
| `Tab` / `Shift+Tab` | Move between toolbar actions, link controls, and the editable region |
| `Enter` / `Space` | Activate toolbar actions and apply link actions |
| Standard typing keys | Update editor content in the editable region |
| Browser selection shortcuts | Stay delegated to the editor engine |

### Focus Management

- Toolbar buttons prevent mouse-down blur so text selection is preserved while formatting commands run.
- Opening the link editor moves focus to the shared URL input.
- `Mod+K` opens the inline link editor so the shared shortcut matches common editor conventions.
- `Body text` and `Clear Formatting` expose explicit shared shortcuts so users can return to plain paragraph content or remove styling without reaching for the mouse.
- The link editor URL field uses `type="url"` plus an explicit accessible name so assistive tech and browser affordances treat it as a URL input.
- Applying or removing a link returns control to the editor through Tiptap's `focus()` chain.
- Readonly mode removes toolbar focus targets entirely.

### Screen Reader Notes

- The editable region always has an accessible name through `label`, `aria-label`, or `aria-labelledby`.
- Validation copy is announced through `role="alert"` and `aria-describedby`.
- Toolbar buttons expose pressed state for active formatting.

---

## Box-only DOM policy

- Authored shared wrappers in `RichTextEditor.tsx` and its stories use `Box` for every authored DOM node.
- Semantic authored nodes such as labels, buttons, helper copy, error copy, and preview blocks render through `Box as="..."`.
- Tiptap's `EditorContent` remains the explicit third-party DOM boundary; the generated ProseMirror nodes are not re-authored through `Box`.

---

## Usage Examples

### 1. Basic usage

```tsx
<RichTextEditor
  value={description}
  onChange={setDescription}
  label="Description"
/>
```

### 2. Minimal toolbar

```tsx
<RichTextEditor
  value={comment}
  onChange={setComment}
  toolbar="minimal"
  label="Comment"
/>
```

### 3. Readonly

```tsx
<RichTextEditor
  value={summaryHtml}
  readonly
  toolbar="none"
  label="Readonly summary"
/>
```

### 4. Custom sanitizer

```tsx
<RichTextEditor
  value={notes}
  onChange={setNotes}
  sanitize={(html) => html.replace(/<h1/g, '<h2').replace(/<\/h1>/g, '</h2>')}
  label="Notes"
/>
```

---

## Do / Don't

| Do | Don't |
| --- | --- |
| Use the shared editor for app-agnostic formatted text entry. | Import upload, mention, or media behavior into the shared editor contract. |
| Keep sanitization enabled unless an app-owned sanitizer is explicitly required. | Trust raw HTML from user input without a documented sanitization boundary. |
| Use `toolbar="minimal"` for compact comment experiences. | Add one-off booleans such as `withMedia`, `withMentions`, or `withSlashMenu`. |
| Keep readonly rendering on the same component surface. | Fork a separate viewer component just to hide the toolbar. |
| Keep HTML rendering and business validation in app code. | Fold persistence, autosave, or domain-specific validation into `@repo/ui`. |
| Keep authored wrappers on `Box`. | Hand-write native `div`, `button`, `p`, or `pre` tags in shared authored JSX. |

---

## Storybook Stories Required

**Story file title:** `'Inputs/RichTextEditor'`

- [x] `Basic`
- [x] `Toolbar`
- [x] `Readonly`
- [x] `Sanitization`
- [x] `ErrorState`

Roadmap alignment:

- `RichTextEditor.Basic` -> `Basic`
- `RichTextEditor.Toolbar` -> `Toolbar`
- `RichTextEditor.Sanitization` -> `Sanitization`
- `RichTextEditor.Readonly` -> `Readonly`

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-16 | Initial RichTextEditor spec using headless Tiptap and a bounded shared feature scope |
| 2026-03-16 | Polished the inline link editor with aligned control sizing, URL-specific input semantics, and clearer toolbar action labels |
| 2026-03-16 | Extended the shared heading structure to include `Heading 3` while keeping media and upload tooling outside the bounded editor scope |
