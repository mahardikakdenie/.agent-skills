# Box Spec

## Overview

`Box` is the foundational layout primitive in `@repo/ui`. It is a **polymorphic component** — it renders any native HTML element (or a custom React component via `asChild`) while remaining fully type-safe. Its primary migration purpose is to replace all bare `<div>`, `<span>`, `<section>`, `<article>`, `<main>`, `<aside>`, `<header>`, `<footer>`, `<ul>`, `<ol>`, `<li>`, `<p>`, etc. usage in app code so that every rendered element flows through the design system.

This component is intentionally a **low-opinion layout primitive**. It still avoids visual styling, domain behavior, and page-shell abstractions, but it now exposes a narrow set of migration-safe layout presets for the cross-app body-wrapper patterns discovered in normalization: `padding`, `container`, and `centered`.

## Design Decisions

- **Polymorphic via `as` prop** — defaults to `"div"`. Consumers pass any valid HTML tag or a custom component.
- **`asChild` via Radix Slot** — when `asChild={true}`, `Box` acts as a transparent slot: it merges all props onto the single child element, enabling render-less composition.
- **Preset-only layout API** — `padding`, `container`, and `centered` are implemented as class presets only. They are intentionally small and composable; everything else still belongs in `className`.
- **No visual variants** — `Box` does not expose color, border, tone, surface, or typography variants.
- **`forwardRef` compatible** — `ref` is forwarded to the underlying element for imperative access.
- **Strong type-safety** — The prop interface is generic over the element type: `as` narrows valid `ref` + all HTML attributes to the exact element chosen.

## Props Interface

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `as` | `React.ElementType` | `"div"` | No | The HTML tag or component to render as |
| `asChild` | `boolean` | `false` | No | When true, uses Radix Slot to merge props onto the single child element |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `none` | No | Applies responsive horizontal padding presets for shared shell migration |
| `container` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | — | No | Applies a centered max-width container preset |
| `centered` | `boolean` | `false` | No | Applies `display: flex` plus item/content centering |
| `className` | `string` | — | No | Additional CSS classes applied after presets |
| `ref` | `React.Ref<...>` (inferred from `as`) | — | No | Forwarded to the underlying element |
| `...rest` | `React.ComponentPropsWithoutRef<typeof as>` | — | No | All valid HTML attributes for the chosen element (strongly typed) |

## Layout Presets

### Padding presets

| Value | Intended use |
| --- | --- |
| `none` | Leave spacing fully to `className` |
| `sm` | Compact body padding |
| `md` | Default page/content padding |
| `lg` | Wide page/content padding |

### Container presets

| Value | Intended use |
| --- | --- |
| `sm` | Compact forms and narrow content |
| `md` | Standard content column |
| `lg` | Wider dashboard/content shell |
| `xl` | Large management surfaces |
| `full` | Full-width shell while preserving `mx-auto w-full` |

### Centered preset

- `centered={true}` adds a minimal flex centering contract: `flex items-center justify-center`.
- It is intended for generic alignment wrappers, not for page-shell choreography.

## States

Not applicable — Box has no interactive states.

## Accessibility

- `Box` renders the element specified by `as` directly. **No implicit ARIA role is added**.
- Consumers are responsible for correct semantic element choice (e.g., `<Box as="main">`, `<Box as="nav">`, `<Box as="ul">`).
- When `asChild` is used, the accessibility role is determined by the child element.
- `centered` changes layout only; it does not make the content more accessible by itself.

## Usage Examples

```tsx
// Replace a div
<Box className="flex items-center gap-4">...</Box>

// Replace a span
<Box as="span" className="text-sm text-muted-foreground">...</Box>

// Shared page shell preset
<Box as="main" container="xl" padding="md">...</Box>

// Generic centered wrapper
<Box centered className="min-h-48">...</Box>

// Replace a section with full type safety
<Box as="section" aria-labelledby="section-title">...</Box>

// Compose without an extra DOM node
<Box asChild className="flex justify-center">
  <button onClick={handleClick}>Submit</button>
</Box>

// With ref
const ref = useRef<HTMLDivElement>(null);
<Box ref={ref} className="relative">...</Box>
```

## Do / Don't

| Do | Don't |
| --- | --- |
| Use `Box` to replace all bare `div`, `span`, `section`, etc. | Add business logic, data fetching, or domain state |
| Choose `as` semantically — `as="main"`, `as="nav"`, `as="ul"` for structure | Pass `next/link` or `next/image` as `as` value |
| Use `padding`, `container`, and `centered` only for generic layout presets | Turn `Box` into app-specific page chrome or route shell |
| Use `asChild` for render-less composition | Add visual variants, tone props, or brand logic |
| Layer extra layout styles with `className` on top of presets | Use this component as a substitute for semantic HTML |

## Storybook Stories Required

- [x] Default
- [x] Padding
- [x] Container
- [x] Centered
- [x] AsChild
- [x] WithRef
- [x] TypeSafetyDemo
