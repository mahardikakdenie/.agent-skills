# Skeleton Spec

## Metadata

| Field           | Value                           |
| --------------- | ------------------------------- |
| Storybook Group | `Feedback`                      |
| Component Tier  | `Tier 1 (Primitive)`            |
| Structure Tier  | `Simple`                        |
| Based on        | `Box`-backed custom composition |

---

## Overview

`Skeleton` is the shared shape-only loading placeholder primitive for inline text, blocks, avatars, cards, and other visual surfaces that need a temporary loading shell. It is intentionally minimal and decorative by default: no data orchestration, no progress semantics, no internal timers, and no app-specific placeholder presets baked into the public API.

Cross-app baseline demand converges on one shared primitive with consumer-owned sizing and composition. The roadmap requires text, block, and card coverage, but those patterns fit Storybook and usage composition better than new `variant`, `rows`, or `animated` props. Per `vercel-composition-patterns`, the shared contract stays flat and lets consuming layouts assemble richer placeholder states.

**When to use:**

- Use `Skeleton` for transient placeholder shapes while content is loading and the final layout is already known.
- Compose repeated text lines, avatar circles, table rows, or card shells by varying `className`.
- Use it as the base loading primitive for future wrappers such as `ContentLoadingWrapper`.

**When NOT to use:**

- Do not use `Skeleton` for determinate progress, blocking overlays, or labeled loading indicators; use `Spinner` or a higher-order loading shell instead.
- Do not use `Skeleton` to encode domain logic, retry state, empty state copy, or branded loading artwork.

---

## Design Decisions

| Decision                   | Choice                          | Rationale                                                                                             |
| -------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Root primitive             | `Box` with default `div` target | Keeps authored shared DOM inside the Box-only policy while matching the canonical HTML div contract. |
| CVA strategy               | Base-only root classes          | The primitive only needs shared pulse, radius, and muted-surface styles; shape stays consumer-owned. |
| Controlled vs uncontrolled | none                            | `Skeleton` is visual-only and has no behavioral state.                                                |
| API sprawl                 | no `variant`, `rows`, or `size` | The same outcomes are clearer through composition and `className` than new mode props or booleans.   |
| Accessibility default      | decorative                      | Most skeletons should stay hidden from assistive tech unless consumers opt into an announced status. |
| Box-only DOM rule          | explicit                        | Authored JSX in implementation and stories must use `Box`; no direct native tags are authored.       |

---

## Props Interface

| Prop        | Type                                   | Default     | Required | Description                                                               |
| ----------- | -------------------------------------- | ----------- | -------- | ------------------------------------------------------------------------- |
| `className` | `string`                               | `undefined` | No       | Shapes the placeholder size, width, radius, and layout through `cn()`.   |
| `...props`  | `React.HTMLAttributes<HTMLDivElement>` | -           | No       | Native attributes such as `id`, `role`, `aria-*`, `data-*`, and `style`. |

### Accessibility note

- When no `role` or accessible labelling props are provided, `Skeleton` defaults to `aria-hidden="true"` so decorative placeholders stay out of the accessibility tree.
- If a placeholder must be announced, consumers should pass `role="status"` plus an `aria-label` or equivalent labelling attributes.

---

## Variants and Composition

`Skeleton` has no public `variant` or `size` prop. Required roadmap patterns are delivered through composition:

| Pattern | Composition guidance | Common use case |
| ------- | -------------------- | --------------- |
| Text    | `className="h-4 w-full"` plus stacked copies | Paragraphs, metadata rows, table copy |
| Block   | `className="h-24 w-full"` or circle/rect shapes | Cards, charts, media, avatars |
| Card    | Compose multiple `Skeleton` instances with `Card`, `Box`, or table wrappers | Detail panels, summary cards, list items |

---

## States

| State               | Visual Behavior                                              | Accessibility                                                                  |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Loading             | Muted surface with pulse animation and rounded corners       | Decorative by default; hidden from assistive tech unless consumers opt in.     |
| Reduced motion      | Pulse animation stops under `prefers-reduced-motion`         | Avoids unnecessary motion for users who request reduced animation.              |
| Circle / avatar     | Consumer supplies `rounded-full` and fixed size classes      | Decorative shapes remain `aria-hidden` unless explicitly labelled.              |
| Long-form / stacked | Multiple instances compose readable loading rhythm           | Keep semantic loading context on the parent when the placeholder set matters.   |
| Announced status    | Consumer passes `role="status"` and accessible labelling     | Makes a standalone loading placeholder discoverable to assistive technology.    |

`Skeleton` has no hover, focus, disabled, error, or interactive state of its own.

---

## Accessibility

### Semantics

- `Skeleton` renders as a `div` through `Box`.
- Decorative placeholders should remain hidden from assistive technology.
- When the placeholder itself needs to convey loading, consumers must add `role="status"` and an accessible label.

### Keyboard Map

`Skeleton` has no keyboard bindings because it is not interactive.

### Focus Behavior

- `Skeleton` never enters the tab order.
- Focus belongs to the eventual interactive content, not the placeholder.

### Screen Reader Notes

- Default decorative placeholders are hidden with `aria-hidden="true"`.
- Announced loading states should live on the parent region or on a specifically labelled `Skeleton`, depending on the layout need.

---

## Usage Examples

### 1. Basic usage

```tsx
<Skeleton className="h-4 w-[220px]" />
```

### 2. Text stack

```tsx
<Box className="flex flex-col gap-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-[88%]" />
  <Skeleton className="h-4 w-[72%]" />
</Box>
```

### 3. Card placeholder

```tsx
<Card>
  <CardHeader className="gap-3">
    <Skeleton className="h-6 w-2/5" />
    <Skeleton className="h-4 w-4/5" />
  </CardHeader>
  <CardContent className="space-y-3">
    <Skeleton className="h-40 w-full rounded-xl" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-[78%]" />
  </CardContent>
</Card>
```

### 4. Announced loading state

```tsx
<Skeleton
  role="status"
  aria-label="Loading account summary"
  className="h-24 w-full rounded-xl"
/>
```

---

## Do / Don't

| Do                                                                       | Don't                                                                                   |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Shape placeholders with `className` and composition.                     | Add public booleans such as `isText`, `isCard`, `animated`, or `showAvatar`.           |
| Keep the primitive decorative by default.                                | Expose every placeholder pattern as a hardcoded shared variant.                         |
| Use `role="status"` with labelling only when the placeholder must speak. | Rely on unlabeled skeletons to communicate meaningful loading context.                  |
| Compose richer layouts with `Box`, `Card`, and future wrappers.          | Put loading orchestration, retry logic, or branded illustration logic inside `Skeleton`. |
| Keep authored shared JSX on `Box` in implementation and stories.         | Hand-write native `div`, `span`, `svg`, or other DOM tags in shared authored JSX.      |

---

## Storybook Stories Required

**Story file title:** `'Feedback/Skeleton'`

- [x] `Default`
- [x] `Text`
- [x] `Block`
- [x] `Card`

---

## Box-only DOM policy

- Authored shared JSX for this component and its stories must use `Box` for every DOM node.
- The `Skeleton` root renders through `Box` with the default `div` target.
- Story compositions such as text stacks, cards, and responsive lists must also render through `Box` or existing shared primitives that already comply with the authored DOM policy.

---

## Changelog

| Date       | Change                |
| ---------- | --------------------- |
| 2026-03-10 | Initial Skeleton spec |

