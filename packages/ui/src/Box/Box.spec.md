# Box Spec

## Overview

`Box` is the foundational layout primitive in `@repo/ui`. It is a **polymorphic component** — it renders any native HTML element (or a custom React component via `asChild`) while remaining fully type-safe. Its primary migration purpose is to replace all bare `<div>`, `<span>`, `<section>`, `<article>`, `<main>`, `<aside>`, `<header>`, `<footer>`, `<ul>`, `<ol>`, `<li>`, `<p>`, etc. usage in app code so that every rendered element flows through the design system.

This component is intentionally a **zero-abstraction layer** — it does not introduce any visual opinion, variant system, or default styles. It is the atom on top of which all other primitives are built.

## Design Decisions

- **Polymorphic via `as` prop** — defaults to `"div"`. Consumers pass any valid HTML tag or a custom component.
- **`asChild` via Radix Slot** — when `asChild={true}`, `Box` acts as a transparent slot: it merges all props onto the single child element, enabling render-less composition (useful for compound components that need a specific tag at the call site).
- **No CVA** — `Box` has no visual variants. Styling is always driven by `className` passed by the consumer (Tailwind or inline styles).
- **`forwardRef` compatible** — `ref` is forwarded to the underlying element for imperative access.
- **Strong type-safety** — The prop interface is generic over the element type: `as` prop narrows valid `ref` + all HTML attributes to the exact element chosen.

## Props Interface

| Prop        | Type                                        | Default | Required | Description                                                             |
| ----------- | ------------------------------------------- | ------- | -------- | ----------------------------------------------------------------------- |
| `as`        | `React.ElementType`                         | `"div"` | No       | The HTML tag or component to render as                                  |
| `asChild`   | `boolean`                                   | `false` | No       | When true, uses Radix Slot to merge props onto the single child element |
| `className` | `string`                                    | —       | No       | Additional CSS classes applied to the rendered element                  |
| `ref`       | `React.Ref<...>` (inferred from `as`)       | —       | No       | Forwarded to the underlying element                                     |
| `...rest`   | `React.ComponentPropsWithoutRef<typeof as>` | —       | No       | All valid HTML attributes for the chosen element (strongly typed)       |

## Variants

None. Box is purposely unopinionated. Apply layout, spacing, and display classes via `className`.

## States

Not applicable — Box has no interactive states.

## Accessibility

- `Box` renders the element specified by `as` directly. **No implicit ARIA role is added**.
- Consumers are responsible for correct semantic element choice (e.g., `<Box as="main">`, `<Box as="nav">`, `<Box as="ul">`).
- When `asChild` is used, the accessibility role is determined by the child element.

## Usage Examples

```tsx
// Replace a div
<Box className="flex items-center gap-4">...</Box>

// Replace a span
<Box as="span" className="text-sm text-muted-foreground">...</Box>

// Replace a section with full type safety (section-specific attrs are valid)
<Box as="section" aria-labelledby="section-title">...</Box>

// Compose without an extra DOM node (renders child's element, merged props)
<Box asChild className="flex justify-center">
  <button onClick={handleClick}>Submit</button>
</Box>

// With ref
const ref = useRef<HTMLDivElement>(null);
<Box ref={ref} className="relative">...</Box>
```

## Do / Don't

| ✅ Do                                                                       | ❌ Don't                                             |
| --------------------------------------------------------------------------- | ---------------------------------------------------- |
| Use `Box` to replace all bare `div`, `span`, `section`, etc.                | Add business logic, data fetching, or domain state   |
| Choose `as` semantically — `as="main"`, `as="nav"`, `as="ul"` for structure | Pass `next/link` or `next/image` as `as` value       |
| Use `asChild` for render-less composition                                   | Add default Tailwind classes or visual opinions      |
| Use `className` for all styling                                             | Use this component as a substitute for semantic HTML |

## Storybook Stories Required

- [x] Default (renders `div`, shows children)
- [x] AsSpan (renders inline `span` with text)
- [x] AsSection (renders `section` with aria-label)
- [x] AsUnorderedList (renders `ul` + `li` children)
- [x] AsChild (renders child button, merges className)
- [x] WithRef (demonstrates ref forwarding)
- [x] TypeSafetyDemo (documents that invalid props for the chosen tag produce TS errors — narrative story)
