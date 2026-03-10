# Badge Spec

## Metadata

| Field           | Value                           |
| --------------- | ------------------------------- |
| Storybook Group | `Feedback`                      |
| Component Tier  | `Tier 1 (Primitive)`            |
| Structure Tier  | `Simple`                        |
| Based on        | `Box`-backed custom composition |

---

## Overview

`Badge` is a compact semantic label used for inline status, category, and lightweight count-like markers. It is a presentational primitive only: no routing, no fetch logic, no dismissal behavior, and no internal state.

This component stays intentionally flat. Cross-app baselines converge on a small shared contract of `variant`, `size`, and content, while dot/icon-like leading visuals can be composed through `children` instead of expanding the API with extra booleans or slots.

**When to use:**

- Show a short status, category, or state label inside page content, tables, cards, or filters.
- Communicate semantic tone with token-driven variants such as `success`, `warning`, or `destructive`.
- Compose a leading dot inside the badge when local parity requires it.

**When NOT to use:**

- Do not use `Badge` as an interactive control; use `Button`, `Tabs`, or another interactive primitive instead.
- Do not use `Badge` for long-form copy or large notification bodies; use `Alert` or normal text content.

---

## Design Decisions

| Decision                   | Choice                              | Rationale                                                                                                                                                     |
| -------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Root primitive             | `Box` with default `div` target     | Keeps authored shared DOM inside the Box-only policy while matching the canonical `React.HTMLAttributes<HTMLDivElement>` contract in `02-api-conventions.md`. |
| CVA strategy               | Flat root variants                  | A single root surface is enough; no compound family or internal context is needed.                                                                            |
| Controlled vs uncontrolled | none                                | `Badge` is pure display and has no behavioral state.                                                                                                          |
| API sprawl                 | no `dot`, `icon`, or `asChild` prop | Per `vercel-composition-patterns`, child composition is enough for leading visuals, and the primitive does not need element polymorphism.                     |
| Box-only DOM rule          | explicit                            | Authored JSX in the implementation and stories must use `Box`; no direct native tags are authored for the badge or its examples.                              |

---

## Props Interface

| Prop        | Type                                                                                         | Default     | Required | Description                                                                   |
| ----------- | -------------------------------------------------------------------------------------------- | ----------- | -------- | ----------------------------------------------------------------------------- |
| `variant`   | `'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'success' \| 'warning' \| 'info'` | `'default'` | No       | Semantic surface style for neutral, secondary, and status-bearing labels.     |
| `size`      | `'sm' \| 'md' \| 'lg'`                                                                       | `'md'`      | No       | Compact density control for badge height and padding.                         |
| `className` | `string`                                                                                     | `undefined` | No       | Consumer override merged last through `cn()`.                                 |
| `children`  | `React.ReactNode`                                                                            | -           | Yes      | Badge label content; may include a composed leading dot or decorative icon.   |
| `...props`  | `React.HTMLAttributes<HTMLDivElement>`                                                       | -           | No       | Native container attributes such as `id`, `role`, `aria-label`, and `data-*`. |

---

## Variants

| Variant       | Description                     | When to use                                        |
| ------------- | ------------------------------- | -------------------------------------------------- |
| `default`     | Primary emphasis filled badge   | General-purpose highlighted status or count.       |
| `secondary`   | Muted filled badge              | Low-emphasis categorization or secondary metadata. |
| `destructive` | High-severity filled badge      | Error or failure state labels.                     |
| `outline`     | Border-only badge on background | Neutral labels that should stay visually quiet.    |
| `success`     | Positive semantic badge         | Approved, active, or completed status.             |
| `warning`     | Caution semantic badge          | Pending review or attention-needed status.         |
| `info`        | Informational semantic badge    | Supporting status or informational metadata.       |

## Sizes

| Size | Behavior                    | Intended use                                        |
| ---- | --------------------------- | --------------------------------------------------- |
| `sm` | Tightest padding and height | Dense tables or supporting metadata rows.           |
| `md` | Default compact size        | Standard cards, lists, and status labels.           |
| `lg` | Larger height and padding   | Prominent inline status in cards or hero summaries. |

---

## States

| State           | Visual Behavior                                                          | Accessibility                                                              |
| --------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Default         | Compact pill surface with semantic background and text color             | No implicit role; announced as normal text unless consumers add semantics. |
| Variants        | Tone changes via semantic token colors only                              | Status meaning should not rely on color alone in isolation.                |
| Dot composition | Leading dot inherits current text color and stays aligned with the label | Decorative dots should use `aria-hidden="true"`.                           |
| Long content    | Consumers may opt into wrapping with `className` for narrow layouts      | Keep badge copy short where possible for scannability.                     |

`Badge` has no interactive hover, focus, disabled, loading, or error behavior of its own.

---

## Accessibility

### Semantics

- `Badge` does not add an implicit role or live-region behavior.
- Consumers may pass `aria-label`, `role`, or `aria-describedby` when the badge needs additional context.
- Because `Badge` is non-interactive, it must not be used as the only affordance for an action.

### Keyboard Map

`Badge` has no keyboard bindings because it is not interactive.

### Focus Behavior

- `Badge` does not participate in the tab order by default.
- If a consumer makes it interactive, that is outside the shared contract and should use another primitive instead.

### Screen Reader Notes

- Badge text is read as ordinary inline content.
- If color communicates status, pair the badge with readable text or a clear textual label.

---

## Usage Examples

### 1. Basic usage

```tsx
<Badge>Active</Badge>
```

### 2. Semantic status

```tsx
<Badge variant="success">Approved</Badge>
```

### 3. Dot composition

```tsx
<Badge variant="outline">
  <Box as="span" data-slot="badge-dot" aria-hidden="true" />
  Syncing
</Badge>
```

### 4. Dense table usage

```tsx
<Badge size="sm" variant="secondary">
  Draft
</Badge>
```

---

## Do / Don't

| Do                                                                            | Don't                                                                       |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Use the semantic variants from `02-api-conventions.md` exactly as documented. | Reintroduce legacy variant names such as `danger` or ad-hoc status strings. |
| Compose a dot through `children` when parity requires a leading visual.       | Add extra boolean props such as `dot`, `pill`, or `soft`.                   |
| Keep badge text short and scannable.                                          | Use `Badge` as a container for full sentences or action controls.           |
| Keep authored JSX on `Box` in stories and implementation.                     | Hand-write native `div`, `span`, or SVG tags in shared authored JSX.        |
| Use `className` for local density or wrapping overrides.                      | Add app-specific business logic or route behavior to the primitive.         |

---

## Storybook Stories Required

**Story file title:** `'Feedback/Badge'`

- [x] `Default`
- [x] `Variants`
- [x] `Sizes`
- [x] `Dot`
- [x] `LongContent`

---

## Changelog

| Date       | Change             |
| ---------- | ------------------ |
| 2026-03-10 | Initial Badge spec |
