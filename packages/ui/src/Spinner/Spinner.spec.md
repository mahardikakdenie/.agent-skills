# Spinner Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Feedback` |
| Component Tier | `Tier 1 (Primitive)` |
| Structure Tier | `Simple` |
| Based on | `Box` composition + CSS border-ring motion treatment |

---

## Overview

`Spinner` is the shared indeterminate loading indicator for inline busy states, centered loading shells, and simple blocking overlays. It covers the common cross-app loader baseline without pulling branded artwork, timers, fetch orchestration, or full loading-layout policy into `@repo/ui`.

The normalized contract stays intentionally small: `size`, `label`, `inline`, and `overlay`. Per the roadmap and the audited app baselines, this is enough to cover admin-portal spinner usage plus the repeated loader patterns in SSO, teman-affiliate, and gelm microsite apps. More opinionated loading wrappers remain a separate concern for `ContentLoadingWrapper`.

**When to use:**

- Use `Spinner` for indeterminate loading when content is unavailable but no progress percentage exists.
- Use `inline` for compact busy states inside copy, buttons, or dense content rows.
- Use `overlay` for simple blocking loading treatment when the parent surface should be visually dimmed.

**When NOT to use:**

- Do not use `Spinner` for shaped placeholder skeletons; use `Skeleton`.
- Do not use `Spinner` for branded logo loaders, marketing animations, or domain-specific retry/error shells.
- Do not use `Spinner` as a full page workflow wrapper with title/description/actions; keep that local or move it later to `ContentLoadingWrapper`.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Root primitive | `Box` with semantic `div`/`span` targets | Keeps authored shared DOM inside the Box-only policy while preserving a simple HTML contract. |
| Motion treatment | Asymmetrical CSS border ring | Keeps authored DOM inside `Box`, avoids hand-authored SVG, and makes motion visually obvious in small sizes. |
| Variant strategy | CVA-backed `size` + derived `layout` | Keeps styling normalized while avoiding public API sprawl. |
| Public API shape | Keep canonical `inline` and `overlay` booleans | `02-api-conventions.md` already locks these props; internal layout is derived from them to keep implementation readable. |
| Overlay behavior | fixed blocking surface by default | Matches the audited loader baseline where simple loaders often center over a dimmed page/surface. |
| Accessibility default | `role="status"` with polite live region | Loading indicators should announce meaning without requiring every consumer to wire ARIA manually. |
| Box-only DOM rule | explicit | Authored JSX in implementation and stories must use `Box`; no direct native JSX tags are authored. |

### Composition evaluation

- `vercel-composition-patterns` review: no compound structure is needed.
- The component keeps two canonical booleans because the contract is already locked in `02`, but internal layout is normalized to one derived mode (`default` | `inline` | `overlay`) instead of branching public variants further.

---

## Props Interface

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Controls the indicator scale and matching label rhythm. |
| `label` | `string` | `undefined` | No | Optional visible loading copy; when omitted the spinner still gets an accessible loading name. |
| `inline` | `boolean` | `false` | No | Uses inline-flex layout for dense in-flow loading states. |
| `overlay` | `boolean` | `false` | No | Renders a blocking overlay shell with centered content. |
| `className` | `string` | `undefined` | No | Merged last with `cn()` for consumer override. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | No | Native attributes such as `id`, `role`, `aria-*`, `data-*`, and `style`. |

### Conflict rule

- If both `inline` and `overlay` are passed, `overlay` wins because it is the more specific layout mode.

### Cross-app normalization notes

- SSO and admin-portal loader shells normalize to `size` + optional `label`.
- gelm-xproject's `isFullScreen` and `useOverlay` patterns normalize to `overlay`.
- Local branded/logo loaders remain app-local even when they visually resemble a spinner wrapper.

---

## Variants

### Size scale

| Size | Icon size | Label size | Common use |
| --- | --- | --- | --- |
| `sm` | 16px | 12px | Dense table cells, compact buttons, inline busy states |
| `md` | 20px | 14px | Default form and panel loading |
| `lg` | 24px | 16px | Full-page or large panel loading emphasis |

### Derived layout modes

| Mode | Trigger | Behavior |
| --- | --- | --- |
| `default` | neither `inline` nor `overlay` | Centers the spinner in normal flow, with optional stacked label. |
| `inline` | `inline={true}` | Keeps spinner and optional label in a compact inline-flex row. |
| `overlay` | `overlay={true}` | Uses a blocking centered overlay with muted backdrop and optional stacked label. |

---

## States

| State | Visual Behavior | Accessibility |
| --- | --- | --- |
| Default | Primary animated indicator centered in normal flow | `role="status"` with polite live region and default loading name when unlabeled |
| Inline | Compact row layout sized for dense contexts | Remains non-focusable and readable in flow |
| Overlay | Blocking centered surface with dimmed background | Preserves loading announcement while preventing layout thrash |
| Labeled | Visible loading text below or beside the spinner depending on layout | Text becomes the accessible status copy |
| Reduced motion | Spin animation stops under `prefers-reduced-motion` | Avoids unnecessary motion for users who request reduced animation |

`Spinner` has no hover, active, disabled, error, or keyboard-interaction state of its own.

---

## Accessibility

### Roles and attributes

| Element | Role / Attribute | Value |
| --- | --- | --- |
| Root | `role` | `status` by default, unless consumer overrides |
| Root | `aria-live` | `polite` by default |
| Root | accessible name | Visible `label`, provided `aria-label`, or fallback `"Loading"` |
| Icon | `aria-hidden` | `true` |

### Keyboard map

`Spinner` has no keyboard bindings because it is not interactive.

### Focus behavior

- `Spinner` never enters the tab order.
- Focus stays with the previously active control or the blocked container depending on the consuming surface.

### Screen reader notes

- Unlabeled spinners still announce a generic loading name.
- Passing `label` gives the status region explicit visible copy.
- If consumers need a different announcement, they can override `aria-label` or `role`.

---

## Usage Examples

### 1. Default

```tsx
<Spinner />
```

### 2. Inline

```tsx
<Spinner inline label="Saving changes" />
```

### 3. Blocking overlay

```tsx
<Spinner overlay label="Loading account summary" />
```

### 4. Inside a realistic loading shell

```tsx
<Box className="min-h-64 rounded-xl border border-border bg-card">
  <Spinner label="Loading policy details" />
</Box>
```

---

## Do / Don't

| Do | Don't |
| --- | --- |
| Use `size` to normalize loader density across apps. | Add separate `tone`, `fullScreen`, or branded-logo props to the shared primitive. |
| Use `inline` for dense in-flow busy states. | Wrap every spinner in app-local centering divs when the shared layout already fits. |
| Use `overlay` for simple blocking loading surfaces. | Reuse `Spinner` for retry/error/empty-state messaging shells. |
| Pass `label` when the loading state needs visible copy. | Depend on unlabeled decorative icons to communicate critical async state. |
| Keep authored shared JSX on `Box` in implementation and stories. | Hand-write native `div`, `span`, or inline `svg` tags in the shared source. |

---

## Storybook Stories Required

**Story file title:** `'Feedback/Spinner'`

- [x] `Default`
- [x] `Sizes`
- [x] `Inline`
- [x] `Overlay`
- [x] `Labeled`
- [x] `ResponsiveLayout`

---

## Box-only DOM policy

- Authored shared JSX for this component and its stories must use `Box` for every DOM node.
- The spinner root, label wrapper, and every story composition container are authored through `Box`.
- The loading indicator is authored with `Box` only, using a CSS border ring instead of native SVG tags.

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-10 | Initial Spinner spec |

