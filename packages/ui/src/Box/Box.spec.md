# Box Spec

## Metadata

| Field           | Value                  |
| --------------- | ---------------------- |
| Storybook Group | `Layout`               |
| Component Tier  | `Tier 1 (Primitive)`   |
| Structure Tier  | `Standard`             |
| Based on        | `@radix-ui/react-slot` |

## Overview

`Box` is the foundational layout primitive in `@repo/ui` and the authored DOM primitive for shared source. It renders semantic HTML or SVG targets via `as` or merges onto a child element via `asChild`, while keeping the prop and ref surface type-safe.

**When to use:**

- Author shared DOM structure through `Box`, including structural elements such as `div`, `section`, `article`, `main`, `aside`, `ul`, or `li`.
- Apply shared max-width, horizontal padding, or simple centering without introducing a higher-level layout component.

**When NOT to use:**

- Route shells, branded page frames, sidebar layouts, or any app-specific composition.
- Interactive widgets that need their own semantic primitive or Radix component.

## Design Decisions

| Decision         | Choice                 | Rationale                                                                                               |
| ---------------- | ---------------------- | ------------------------------------------------------------------------------------------------------- |
| Primitive        | `@radix-ui/react-slot` | Keeps `asChild` composition renderless and consistent with the approved Radix pattern.                  |
| Polymorphism     | `as` + `asChild`       | Supports semantic HTML replacement and child-slot composition without separate wrapper components.      |
| Variant strategy | CVA presets only       | `padding`, `container`, and `centered` stay token-safe and limited to migration-backed layout behavior. |
| Controlled state | None                   | `Box` is purely structural and non-interactive.                                                         |
| Public API limit | No visual variants     | Prevents `Box` from turning into a page-shell or surface abstraction.                                   |

## Props Interface

| Prop        | Type                                     | Default     | Required | Description                                                             |
| ----------- | ---------------------------------------- | ----------- | -------- | ----------------------------------------------------------------------- |
| `as`        | `React.ElementType`                      | `"div"`     | No       | Semantic DOM target or component to render when `asChild` is false.     |
| `asChild`   | `boolean`                                | `false`     | No       | Merges props onto the single child element via Radix `Slot`.            |
| `padding`   | `'none' \| 'sm' \| 'md' \| 'lg'`         | `'none'`    | No       | Shared horizontal padding presets for body-wrapper migration.           |
| `container` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `undefined` | No       | Max-width container preset with centered horizontal alignment.          |
| `centered`  | `boolean`                                | `false`     | No       | Adds `flex items-center justify-center` for generic centering wrappers. |
| `className` | `string`                                 | `undefined` | No       | Additional classes merged after presets.                                |
| `ref`       | `React.Ref<...>`                         | `undefined` | No       | Forwarded ref typed to the chosen element.                              |
| `...rest`   | `React.ComponentPropsWithoutRef<C>`      | `undefined` | No       | Passthrough props for the chosen element type.                          |

## Layout Presets

### Padding

| Value  | Behavior                              | Intended use                                  |
| ------ | ------------------------------------- | --------------------------------------------- |
| `none` | No preset spacing                     | Consumer owns all spacing through `className` |
| `sm`   | Compact horizontal padding            | Small inline shells and narrow content blocks |
| `md`   | Default responsive horizontal padding | Standard content areas                        |
| `lg`   | Wide responsive horizontal padding    | Broader dashboard and marketing shells        |

### Container

| Value  | Behavior          | Intended use                                         |
| ------ | ----------------- | ---------------------------------------------------- |
| `sm`   | `max-w-screen-sm` | Compact forms and narrow reading widths              |
| `md`   | `max-w-screen-md` | Standard content column                              |
| `lg`   | `max-w-screen-lg` | Wider dashboard or management content                |
| `xl`   | `max-w-screen-xl` | Large content surfaces                               |
| `full` | `max-w-full`      | Full-width content while preserving `mx-auto w-full` |

### Centered

| Value   | Behavior                           | Intended use                                     |
| ------- | ---------------------------------- | ------------------------------------------------ |
| `false` | No centering preset                | Default structural wrapper                       |
| `true`  | `flex items-center justify-center` | Generic empty/loading/placeholder alignment only |

## States

`Box` has no interactive states. The only supported state-like surface is the deterministic preset combination of `padding`, `container`, and `centered`.

## Accessibility

### Semantics

- `Box` does not add implicit roles or ARIA attributes.
- Consumers must choose the correct semantic element with `as` or provide an accessible child when using `asChild`.
- Shared authored JSX should route semantic HTML and SVG output through `Box as="..."` rather than direct native tags.
- `centered` changes layout only and must not be treated as an accessibility feature.

### Keyboard and Focus

- `Box` does not create focus behavior on its own.
- When `asChild` targets an interactive child, keyboard and focus behavior are inherited from that child element.

## Usage Examples

```tsx
<Box className="flex items-center gap-4">...</Box>

<Box as="section" aria-labelledby="section-title">
  <Box as="h2" id="section-title">
    Summary
  </Box>
</Box>

<Box as="main" container="xl" padding="md">
  ...
</Box>

<Box centered className="min-h-48">
  <Box as="span">Empty state</Box>
</Box>

<Box asChild className="inline-flex rounded-md border border-border px-4 py-2">
  <Box as="button" type="button">Composed action</Box>
</Box>
```

## Do / Don't

| Do                                                                          | Don't                                                                             |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Use `Box` as the authored DOM primitive in shared code.                     | Put business logic, routing, or data loading into `Box`.                          |
| Choose `as` semantically, such as `main`, `nav`, `section`, or `ul`.        | Treat `Box` as a replacement for semantic thinking.                               |
| Use `padding`, `container`, and `centered` only for generic layout presets. | Expand `Box` into branded shells, page frames, or layout policy.                  |
| Use `asChild` when you need renderless composition onto one child.          | Combine `asChild` with child components that do not spread props or forward refs. |
| Layer app-specific spacing and layout details with `className`.             | Add visual variants, tone props, or domain-specific aliases.                      |

## Storybook Stories Required

- [x] `Default`
- [x] `Padding`
- [x] `Container`
- [x] `Centered`
- [x] `SemanticElements`
- [x] `AsChild`
- [x] `ResponsiveLayout`
- [x] `RefForwarding`

## Changelog

| Date       | Change           |
| ---------- | ---------------- |
| 2026-03-10 | Initial Box spec |

