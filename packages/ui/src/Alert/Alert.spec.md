# Alert Spec

## Metadata

| Field           | Value              |
| --------------- | ------------------ |
| Storybook Group | `Feedback`         |
| Tier            | `2 - Composite`    |
| Based on        | custom composition |

---

## Overview

`Alert` is the shared inline feedback surface for persistent status messaging inside page or form content. It covers neutral information, success, warning, and destructive/error messaging without introducing app-local toast, snackbar, or modal behavior into `@repo/ui`.

This component is intentionally prop-driven rather than compound. Cross-app baselines converge on a small inline contract: semantic tone, optional heading/body copy, optional icon, and an optional dismiss affordance delegated back to the caller.

**When to use:**

- Show inline feedback that should stay visible in the document flow.
- Surface validation, submission, or system state with semantic tone and optional contextual copy.

**When NOT to use:**

- Do not use it for transient toast/snackbar orchestration; keep timer and portal behavior app-local.
- Do not use it for modal confirmation/error flows; use `Dialog` or `Drawer` when blocking interaction is required.

---

## Design Decisions

| Decision                   | Choice                                                                   | Rationale                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Primitive                  | custom composition                                                       | No Radix primitive is needed for a static inline feedback container.                                        |
| CVA strategy               | flat                                                                     | A single root container with semantic variants is enough; no slot family or context is needed.              |
| Controlled vs uncontrolled | controlled-only dismissal                                                | `dismissible` only renders a close button; the caller owns visibility state via `onClose`.                  |
| Portal                     | no                                                                       | Inline alerts must remain in document flow.                                                                 |
| Sub-components             | no                                                                       | The canonical API in `02-api-conventions.md` is prop-based, and the component has only one behavioral flag. |
| Icon authoring             | pass `ReactNode`; use root named imports when examples need lucide icons | Shared source stays free of deep/default `lucide-react` imports and hand-authored inline SVG markup.        |

---

## Props Interface

| Prop          | Type                                                             | Default     | Required | Description                                                              |
| ------------- | ---------------------------------------------------------------- | ----------- | -------- | ------------------------------------------------------------------------ |
| `variant`     | `'default' \| 'success' \| 'info' \| 'warning' \| 'destructive'` | `'default'` | No       | Semantic feedback tone.                                                  |
| `title`       | `string`                                                         | `undefined` | No       | Short heading rendered above the message body.                           |
| `description` | `string`                                                         | `undefined` | No       | Secondary explanatory copy.                                              |
| `children`    | `React.ReactNode`                                                | `undefined` | No       | Additional inline content rendered after the description.                |
| `icon`        | `React.ReactNode`                                                | `undefined` | No       | Optional leading visual indicator.                                       |
| `dismissible` | `boolean`                                                        | `false`     | No       | Renders a close control when `onClose` is provided.                      |
| `onClose`     | `() => void`                                                     | `undefined` | No       | Called when the dismiss control is activated.                            |
| `className`   | `string`                                                         | `undefined` | No       | Consumer override merged last through `cn()`.                            |
| `...props`    | `React.HTMLAttributes<HTMLDivElement>`                           | -           | No       | Native alert container attributes such as `role`, `aria-live`, and `id`. |

---

## Variants

| Variant       | Description                                             | When to use                                      |
| ------------- | ------------------------------------------------------- | ------------------------------------------------ |
| `default`     | Neutral surface using base border and background tokens | Informational content without urgency.           |
| `success`     | Positive tone with success accent styling               | Completed actions or healthy state confirmation. |
| `info`        | Informational tone with info accent styling             | Non-blocking guidance or supporting context.     |
| `warning`     | Elevated tone with warning accent styling               | Cautionary states that need user attention.      |
| `destructive` | Elevated destructive tone                               | Errors or high-severity failure states.          |

---

## States

| State        | Visual Behavior                                                                             | Accessibility                                                                       |
| ------------ | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Default      | Inline bordered surface, optional title/body, optional icon                                 | Neutral and success/info states default to `role="status"` with polite announcement |
| With icon    | Leading icon aligns with alert body and inherits semantic tone                              | Icon is decorative unless caller provides additional semantics                      |
| Dismissible  | Close button appears at the top-right and keeps spacing clear of body copy                  | Close button uses `type="button"` and `aria-label="Dismiss alert"`                  |
| Long content | Description and children wrap within the content column without overlapping dismiss control | Reading order remains title -> description -> children                              |

---

## Accessibility

### ARIA Roles & Attributes

| Element         | Role / Attribute | Value                                                                       |
| --------------- | ---------------- | --------------------------------------------------------------------------- | ------- | --------------------------- | ------------ |
| Root            | `role`           | Defaults to `"status"` for `default                                         | success | info`; `"alert"`for`warning | destructive` |
| Root            | `aria-live`      | Defaults to `"polite"` for status states and `"assertive"` for alert states |
| Dismiss control | `aria-label`     | `"Dismiss alert"`                                                           |

### Keyboard Map

| Key               | Behavior                                       |
| ----------------- | ---------------------------------------------- |
| `Tab`             | Moves focus to the dismiss button when present |
| `Enter` / `Space` | Activates the dismiss button                   |

### Focus Management

- `Alert` does not trap or move focus.
- If a dismiss button is rendered, it participates in normal tab order and uses a visible focus ring.

### Screen Reader Notes

- Neutral, success, and info alerts announce politely; warning and destructive alerts announce assertively.
- For non-urgent informational content, consumers may override `role` or `aria-live` through native props.

---

## Usage Examples

### 1. Basic usage

```tsx
<Alert title="Saved successfully" description="Your profile changes are now live." />
```

### 2. With icon

```tsx
import { TriangleAlert } from 'lucide-react';

<Alert
  variant="warning"
  icon={<TriangleAlert aria-hidden="true" className="h-5 w-5" />}
  title="Review before continuing"
  description="A few required fields still need attention."
/>;
```

### 3. Dismissible

```tsx
<Alert
  variant="destructive"
  title="Unable to submit"
  description="Please try again in a few minutes."
  dismissible
  onClose={() => setVisible(false)}
/>
```

### 4. Composed usage

```tsx
<form className="space-y-4">
  <Alert
    variant="info"
    title="Verification pending"
    description="We sent a code to the mobile number on your account."
  />
  <Button type="submit">Continue</Button>
</form>
```

---

## Do / Don't

| Do                                                                             | Don't                                                                                                            |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Use `variant="destructive"` for error states                                   | Keep legacy `danger` or `error` variant names in shared code                                                     |
| Use `dismissible` with `onClose` when the caller controls visibility           | Add internal auto-hide or toast timers to `Alert`                                                                |
| Pass an icon through the `icon` slot when the context benefits from it         | Hand-author inline `<svg>` / `<path>` markup in `packages/ui` source when a shared icon component already exists |
| Keep the message inline in page flow                                           | Use `Alert` as a modal replacement                                                                               |
| Import lucide icons as named imports from `'lucide-react'` in stories/examples | Deep-import lucide icons from `dist/*` or use default icon imports                                               |
| Override `role` only when the message is intentionally non-urgent              | Remove accessible announcement semantics without a replacement                                                   |

---

## Storybook Stories Required

**Story file title:** `'Feedback/Alert'`

- [x] `Default`
- [x] `Variants`
- [x] `WithIcon`
- [x] `Dismissible`
- [x] `LongContent`
- [x] `ResponsiveLayout`

---

## Open Questions

- [x] Status-bearing variants align to `default | success | info | warning | destructive`.
- [x] Dismiss behavior stays controlled by the consumer; no internal visibility state is introduced.

---

## Changelog

| Date       | Change                                                 |
| ---------- | ------------------------------------------------------ |
| 2026-03-10 | Initial Alert spec                                     |
| 2026-03-10 | Clarified lucide import and inline SVG authoring rules |
