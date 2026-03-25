# Card Spec

## Metadata

| Field           | Value                      |
| --------------- | -------------------------- |
| Storybook Group | `Data Display`             |
| Component Tier  | `Tier 2 (Composite)`       |
| Structure Tier  | `Standard`                 |
| Based on        | `Box` + custom composition |

## Overview

`Card` is the shared structural surface for grouped content, summary panels, and reusable layout shells. It stays intentionally light: the shared contract is the surface plus named layout subcomponents, while domain copy, statistics, actions, and interactive semantics remain consumer-owned.

**When to use:**

- Group neutral content with consistent border, background, spacing, and heading treatment.
- Compose header, title, description, content, and footer without app-specific business logic.

**When NOT to use:**

- Domain-specific statistic, product, transaction, or plan cards.
- API-heavy or behavior-heavy widgets that should stay app-local and compose `Card` internally.

## Design Decisions

| Decision                   | Choice                                                                    | Rationale                                                             |
| -------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Primitive                  | `Box` + custom composition                                                | No Radix primitive is needed.                                         |
| CVA strategy               | slot-based base classes                                                   | Stable slots, no canonical public variant prop.                       |
| Controlled vs uncontrolled | n/a                                                                       | Structural and stateless.                                             |
| Portal                     | no                                                                        | Normal document-flow surface.                                         |
| Sub-components             | `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | Named composition avoids boolean prop sprawl.                         |
| Box-only DOM rule          | explicit                                                                  | All authored DOM in implementation and stories renders through `Box`. |

## Props Interface

| Prop        | Type                                   | Default     | Required | Description                                                                      |
| ----------- | -------------------------------------- | ----------- | -------- | -------------------------------------------------------------------------------- |
| `className` | `string`                               | `undefined` | No       | Consumer override merged last through `cn()`.                                    |
| `children`  | `React.ReactNode`                      | `undefined` | No       | Composed card content and subcomponents.                                         |
| `...props`  | `React.HTMLAttributes<HTMLDivElement>` | -           | No       | Native container props such as `id`, `role`, `tabIndex`, `aria-*`, and `data-*`. |

Sub-components:

- `CardHeader`: `React.HTMLAttributes<HTMLDivElement>`
- `CardTitle`: `React.HTMLAttributes<HTMLHeadingElement>`
- `CardDescription`: `React.HTMLAttributes<HTMLParagraphElement>`
- `CardContent`: `React.HTMLAttributes<HTMLDivElement>`
- `CardFooter`: `React.HTMLAttributes<HTMLDivElement>`

## Variants

`Card` has no canonical public `variant` or `size` prop. Elevated, dense, bordered, or interactive treatment remains composition via `className` and native props so the shared API stays structural.

## States

| State                   | Visual Behavior                                                   | Accessibility                                  |
| ----------------------- | ----------------------------------------------------------------- | ---------------------------------------------- |
| Default                 | Rounded bordered surface with background and subtle shadow        | Neutral container with no forced role          |
| Header/footer           | Slot spacing groups heading, body, and actions                    | Semantic heading and description remain opt-in |
| Elevated composition    | Stronger shadow via `className`                                   | No semantic change                             |
| Interactive composition | Consumer supplies `role`, `tabIndex`, handlers, and hover classes | Keyboard support remains consumer-owned        |

## Accessibility

| Element                 | Role / Attribute                      | Value                                                                   |
| ----------------------- | ------------------------------------- | ----------------------------------------------------------------------- |
| Root                    | implicit role                         | None by default; consumers may supply landmark or interactive semantics |
| `CardTitle`             | semantic heading                      | Renders as `h3`                                                         |
| Interactive composition | `role`, `tabIndex`, keyboard handlers | Required when the card itself becomes clickable                         |

Keyboard map:

- `Tab`: reaches focusable descendants, or the root when the consumer makes it focusable.
- `Enter` / `Space`: consumer-owned for interactive card patterns.

Focus management:

- `Card` does not move or trap focus.
- The shared root includes `focus-visible` ring styles so consumer-added interactivity remains visibly focusable.

Screen reader notes:

- Use `CardTitle` when the panel needs a semantic heading.
- Interactive roots must provide an accessible name and keyboard behavior.

## Box-only DOM Policy

- All authored DOM in `Card` implementation and stories must render through `Box`.
- Semantic output must use `Box as=...` instead of direct native tags such as `div`, `h3`, or `p`.

## Usage Examples

- Basic: use `Card` with `CardContent` for a simple contained panel.
- Structured: use `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter` for grouped content.
- Interactive: consumer-owned card semantics should be added with `role`, `tabIndex`, handlers, and `className`, not a shared boolean prop.

## Do / Don't

| Do                                                                                 | Don't                                                               |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Use named subcomponents for heading, description, content, and footer structure.   | Add boolean props such as `hasFooter`, `withBorder`, or `elevated`. |
| Keep domain-specific statistics, formatting, and service state outside `@repo/ui`. | Turn `Card` into a business-specific widget.                        |
| Use `className` for elevation, density, or hover refinements.                      | Expand the API for every visual permutation seen in one app.        |
| Provide keyboard semantics when the card becomes interactive.                      | Add `role=button` without `tabIndex` and keyboard handling.         |
| Keep authored JSX Box-only.                                                        | Hand-write native DOM tags in shared authored JSX.                  |

## Storybook Stories Required

**Story file title:** `'Data Display/Card'`

- [x] `Basic`
- [x] `HeaderFooter`
- [x] `ElevatedComposition`

## Changelog

| Date       | Author | Change            |
| ---------- | ------ | ----------------- |
| 2026-03-10 | Codex  | Initial Card spec |

