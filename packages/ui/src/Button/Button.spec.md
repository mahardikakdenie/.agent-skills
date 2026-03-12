# Button Spec

## Metadata

| Field           | Value                          |
| --------------- | ------------------------------ |
| Storybook Group | `Buttons`                      |
| Component Tier  | `Tier 1 (Primitive)`           |
| Structure Tier  | `Standard`                     |
| Based on        | `Box` + `@radix-ui/react-slot` |

---

## Overview

`Button` is the shared action primitive for calls to action, inline actions, form submission, and low-level link-like affordances that need a consistent token-driven visual contract across apps. It stays app-agnostic by exposing only presentational variants, size, loading/disabled states, icon slots, and optional `asChild` composition.

Cross-app baselines converge on a flat API: variant, size, loading, disabled, and icon support. The shared contract deliberately avoids app-specific routing, submit orchestration, or domain booleans, while still preserving common legacy needs such as destructive/warning emphasis and polymorphic rendering.

**When to use:**

- Use `Button` for primary and secondary actions, inline toolbar actions, and submit triggers.
- Use `Button asChild` when a consumer-owned element such as a link needs shared button styling.

**When NOT to use:**

- Do not use `Button` as a navigation abstraction with app-specific routing imports.
- Do not use `Button` to absorb async workflow logic, permission checks, or domain-specific side effects.

---

## Design Decisions

| Decision                   | Choice                                            | Rationale                                                                                                                     |
| -------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Root primitive             | `Box` with `as="button"` or `asChild` composition | Satisfies the Box-only authored DOM rule while preserving button semantics and Slot-based polymorphism.                       |
| CVA strategy               | Flat root variants                                | The component has one visual root, so a single CVA contract is enough.                                                        |
| Controlled vs uncontrolled | n/a                                               | `Button` is event-driven and stateless; loading/disabled are caller-provided.                                                 |
| `asChild` support          | yes                                               | Required for anchor/link parity without introducing routing dependencies into `@repo/ui`.                                     |
| API shape                  | flat                                              | Per `vercel-composition-patterns`, icon slots are enough; no compound family or boolean mode sprawl is needed.                |
| Box-only DOM rule          | explicit                                          | All authored DOM in implementation and stories must flow through `Box`, including semantic `button`, `span`, and `a` targets. |

---

## Props Interface

| Prop        | Type                                                                                                    | Default     | Required | Description                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------- | ----------- | -------- | ----------------------------------------------------------------------------------- |
| `variant`   | `'default' \| 'primary' \| 'secondary' \| 'destructive' \| 'outline' \| 'ghost' \| 'link' \| 'warning'` | `'default'` | No       | Visual style variant. `default` resolves to the shared primary CTA emphasis.        |
| `size`      | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                                                  | `'md'`      | No       | Shared size scale for density and emphasis.                                         |
| `loading`   | `boolean`                                                                                               | `false`     | No       | Replaces icon slots with a spinner, marks the control busy, and blocks interaction. |
| `disabled`  | `boolean`                                                                                               | `false`     | No       | Disables interaction and applies disabled styling.                                  |
| `asChild`   | `boolean`                                                                                               | `false`     | No       | Renders shared button styles onto the consumer child element via Radix Slot.        |
| `leftIcon`  | `React.ReactNode`                                                                                       | `undefined` | No       | Optional leading icon/content slot.                                                 |
| `rightIcon` | `React.ReactNode`                                                                                       | `undefined` | No       | Optional trailing icon/content slot.                                                |
| `children`  | `React.ReactNode`                                                                                       | `undefined` | No       | Button label or composed content.                                                   |
| `className` | `string`                                                                                                | `undefined` | No       | Consumer override merged last through `cn()`.                                       |
| `...props`  | `React.ButtonHTMLAttributes<HTMLButtonElement>`                                                         | -           | No       | Native button attributes such as `type`, `name`, `value`, `aria-*`, and `data-*`.   |

---

## Variants

| Variant       | Description                                | When to use                                                       |
| ------------- | ------------------------------------------ | ----------------------------------------------------------------- |
| `default`     | Shared filled CTA                          | Default action emphasis across apps.                              |
| `primary`     | Explicit alias of the filled CTA treatment | Use when an app baseline already names the main action `primary`. |
| `secondary`   | Filled lower-emphasis action               | Secondary actions that still need chrome.                         |
| `destructive` | High-severity destructive action           | Deletes, removals, and irreversible actions.                      |
| `warning`     | Elevated caution action                    | Risky actions that are not destructive.                           |
| `outline`     | Border-only action                         | Secondary actions on busy surfaces.                               |
| `ghost`       | Minimal chrome action                      | Icon-adjacent or subtle inline actions.                           |
| `link`        | Text-link action                           | Low-chrome textual action affordances.                            |

## Sizes

| Size | Behavior              | Intended use                                |
| ---- | --------------------- | ------------------------------------------- |
| `xs` | Tightest density      | Dense tables and compact inline actions.    |
| `sm` | Small action control  | Secondary toolbars and grouped actions.     |
| `md` | Default size          | Standard form and page actions.             |
| `lg` | Larger action control | Prominent card and modal actions.           |
| `xl` | Largest shared size   | High-emphasis hero or confirmation actions. |

---

## States

| State            | Visual Behavior                                                               | Accessibility                                                               |
| ---------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Default          | Variant-driven surface with inline label and optional icons                   | Root uses native button semantics unless `asChild` is applied.              |
| Hover            | Token-driven hover feedback for filled, outline, ghost, and link variants     | No hover-only information.                                                  |
| Focus            | Visible `focus-visible` ring on the interactive root                          | Keyboard focus must remain obvious on every variant.                        |
| Disabled         | Reduced opacity and blocked interaction                                       | Uses native `disabled` on button roots; `aria-disabled` on `asChild` roots. |
| Loading          | Spinner replaces decorative icons and interaction is blocked                  | Sets `aria-busy="true"` while label remains available.                      |
| AsChild disabled | Styled like disabled and removed from normal activation                       | Uses `aria-disabled`, blocked click handling, and `tabIndex={-1}`.          |
| Long content     | Label stays centered and wraps only when the consumer opts in via `className` | Consumers should keep action labels concise.                                |

---

## Accessibility

### ARIA Roles & Attributes

| Element                         | Role / Attribute | Value                                                       |
| ------------------------------- | ---------------- | ----------------------------------------------------------- |
| Root button                     | implicit role    | Native button semantics via `Box as="button"`               |
| Root during loading             | `aria-busy`      | `true` while `loading` is active                            |
| Root when `asChild` is disabled | `aria-disabled`  | `true`                                                      |
| Icon-only usage                 | `aria-label`     | Required from the consumer when no visible text is provided |

### Keyboard Map

| Key     | Behavior                                   |
| ------- | ------------------------------------------ |
| `Tab`   | Moves focus to the button or composed root |
| `Enter` | Activates the control                      |
| `Space` | Activates native button roots              |

### Focus Management

- `Button` does not move focus programmatically.
- Focus remains on the root element before and after activation unless consumer logic changes it.

### Screen Reader Notes

- Loading keeps the button label in the accessibility tree while exposing `aria-busy`.
- Consumers must provide an `aria-label` when rendering icon-only content.

---

## Usage Examples

### 1. Basic usage

```tsx
<Button>Save changes</Button>
```

### 2. With icon slots

```tsx
<Button leftIcon={<ArrowLeft aria-hidden="true" />} rightIcon={<ArrowRight aria-hidden="true" />}>
  Continue
</Button>
```

### 3. Loading state

```tsx
<Button loading>Submitting</Button>
```

### 4. `asChild` composition

```tsx
<Button asChild variant="outline">
  <Box as="a" href="/reports">
    View report
  </Box>
</Button>
```

---

## Do / Don't

| Do                                                                           | Don't                                                                        |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Use `loading` for in-flight actions that should block repeat interaction.    | Keep legacy `isLoading` or `pending` prop names in shared code.              |
| Use `leftIcon` and `rightIcon` for decorative icon slots.                    | Add one-off booleans such as `withIcon`, `iconOnly`, or `filled`.            |
| Use `asChild` when styling a consumer-owned link-like element.               | Import `next/link` or other router primitives into `@repo/ui`.               |
| Use `variant="destructive"` or `variant="warning"` for semantic risk states. | Keep legacy `danger` or color-specific variant names.                        |
| Keep authored shared JSX on `Box`, including story examples.                 | Hand-write native `button`, `span`, `a`, or SVG tags in shared authored JSX. |
| Provide `aria-label` for icon-only usage.                                    | Rely on decorative icons alone to communicate the action.                    |

---

## Storybook Stories Required

**Story file title:** `'Buttons/Button'`

- [x] `Default`
- [x] `Variants`
- [x] `Sizes`
- [x] `Loading`
- [x] `AsChild`
- [x] `DisabledState`
- [x] `IconSlots`

---

## Changelog

| Date       | Change              |
| ---------- | ------------------- |
| 2026-03-10 | Initial Button spec |
