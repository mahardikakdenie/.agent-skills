# Switch Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Inputs` |
| Component Tier | `Tier 1 (Primitive)` |
| Structure Tier | `Standard` |
| Based on | `@radix-ui/react-switch` |

---

## Overview

`Switch` is the shared binary toggle primitive for settings rows, simple enable-or-disable controls, and compact preference toggles. It wraps Radix Switch for the correct `role="switch"` semantics, keyboard behavior, and form compatibility while keeping all authored shared DOM on `Box`.

This contract stays intentionally narrow, but it now aligns with the rest of the shared input family by covering controlled and uncontrolled checked state, disabled and required handling, inline error treatment, a compact size scale, and an optional inline label. Richer field-shell behavior such as long-form descriptions, validation orchestration, or domain side effects still stays in consumer composition rather than widening the primitive into a full form wrapper.

**When to use:**

- Use `Switch` for simple on or off preference toggles and feature flags in forms or settings UIs.
- Use the shared `error` prop when a switch participates in validation and needs accessible invalid feedback.
- Use `size="sm"` for denser settings lists and `size="lg"` when a larger touch target is needed.

**When NOT to use:**

- Do not use `Switch` for mutually exclusive choices or segmented navigation; those remain `RadioGroup`, `Tabs`, or app-local patterns.
- Do not put workflow side effects, async persistence, or domain validation rules inside the shared primitive.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Primitive | `@radix-ui/react-switch` + `Box` | Radix provides the correct switch semantics and keyboard behavior while `Box` satisfies the authored DOM rule. |
| CVA strategy | Slot-based | The control track, label, and inline message need independent token treatment without introducing visual-variant sprawl. |
| Controlled vs uncontrolled | both | Cross-app baselines mix controlled and uncontrolled usage, and Radix supports both cleanly. |
| Validation API | `error?: string \| boolean` | Keeps `Switch` aligned with `Checkbox`, `Input`, and `RadioGroup` for field-level invalid treatment and accessible messaging. |
| Public API scope | narrow primitive | `$vercel-composition-patterns` review still favors keeping supporting descriptions and field-shell layout in consumer composition instead of widening the prop surface. |
| Portal | no | `Switch` is inline and does not escape document flow. |
| Box-only DOM rule | explicit | Authored button, thumb, label, message, and story wrappers all render through `Box` or composed shared primitives. |

---

## Props Interface

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `checked` | `boolean` | `undefined` | No | Controlled checked state. |
| `defaultChecked` | `boolean` | `false` | No | Uncontrolled initial checked state. |
| `onCheckedChange` | `(checked: boolean) => void` | `undefined` | No | Called whenever the checked state changes. |
| `disabled` | `boolean` | `false` | No | Disables interaction and applies muted styling. |
| `required` | `boolean` | `false` | No | Marks the underlying field as required and adds a visible required indicator when `label` is present. |
| `label` | `string` | `undefined` | No | Inline label associated with the switch control. |
| `error` | `string \| boolean` | `false` | No | Marks the control invalid; string values also render inline error text. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Density scale for the switch track, thumb, and label treatment. |
| `className` | `string` | `undefined` | No | Consumer override merged onto the outer field wrapper through `cn()`. |
| `...props` | `SwitchPrimitive.Root` props | - | No | Pass-through props such as `id`, `name`, `value`, `form`, and `aria-*`. |

---

## Variants

`Switch` deliberately ships without visual `variant` modes. The shared contract is the single tokenized toggle treatment plus size density.

| Shared treatment | Description | When to use |
| --- | --- | --- |
| Default track | Neutral token surface when unchecked and primary surface when checked | General settings and form toggles |
| Error track | Destructive border and invalid-state token treatment | Validation states that require inline feedback |
| Small density | Compact track and label sizing | Dense settings lists and side panels |
| Medium density | Default shared treatment | Most switch usage |
| Large density | Larger touch target and label size | Mobile-heavy or emphasis-heavy settings rows |

---

## States

| State | Visual Behavior | Accessibility |
| --- | --- | --- |
| Unchecked | Neutral token surface with the thumb aligned to the start | Exposes `role="switch"` and `aria-checked="false"` through Radix |
| Checked | Primary track with the thumb aligned to the end | Exposes `aria-checked="true"` |
| Focus | Visible focus ring around the track | Keyboard focus remains visible on every size |
| Disabled | Muted opacity and blocked pointer interaction for control and label | Exposes disabled semantics through Radix |
| Required | Label shows a destructive asterisk | Required semantics stay on the underlying switch control |
| Error | Destructive border and label treatment plus inline validation copy when provided | Sets `aria-invalid="true"` and links the message through `aria-describedby` |
| Description (composed) | Supporting copy can sit below or beside the shared primitive through consumer composition | Consumers link extra copy with `aria-describedby` when needed |

---

## Accessibility

### ARIA Roles & Attributes

| Element | Role / Attribute | Value |
| --- | --- | --- |
| Control | `role` | Native Radix switch semantics |
| Control | `aria-labelledby` | Points to the generated label id when `label` is present |
| Control | `aria-describedby` | Accepts consumer-provided supporting-copy ids and the inline error id when present |
| Control | `aria-invalid` | `true` when `error` is truthy |
| Error message | `role` | `alert` |
| Label | `htmlFor` | Associates the visible label with the switch control |

### Keyboard Map

| Key | Behavior |
| --- | --- |
| `Tab` | Moves focus to the switch control |
| `Space` | Toggles the checked state |
| `Enter` | Toggles the checked state |

### Focus Management

- `Switch` does not move focus programmatically.
- Clicking the label activates the associated switch through `htmlFor`.
- Focus remains on the control after the checked state changes.

### Screen Reader Notes

- When `label` is present, it becomes the accessible name for the control.
- Error strings are announced through the linked `role="alert"` message.
- Supporting copy remains consumer-owned composition and should be linked with `aria-describedby` when used.
- Consumers without a visible label must supply an accessible name via `aria-label` or `aria-labelledby`.

---

## Usage Examples

### 1. Basic usage

```tsx
<Switch label="Enable email notifications" />
```

### 2. Controlled usage

```tsx
<Switch
  checked={enabled}
  onCheckedChange={setEnabled}
  label="Enable weekly summary"
/>
```

### 3. Error state

```tsx
<Switch
  label="Accept recurring billing"
  error="Please confirm recurring billing before continuing."
  required
/>
```

### 4. Composed description

```tsx
<Box className="grid gap-1.5">
  <Switch
    id="security-alerts"
    label="Enable security alerts"
    aria-describedby="security-alerts-description"
  />
  <Box as="p" id="security-alerts-description" className="pl-14 text-sm text-muted-foreground">
    We only send this when sign-in or billing activity needs attention.
  </Box>
</Box>
```

---

## Do / Don't

| Do | Don't |
| --- | --- |
| Use `Switch` for binary on or off preferences. | Use `Switch` as a replacement for segmented navigation or multi-option selection. |
| Use the shared `error` prop for invalid treatment and inline feedback. | Invent app-local `hasError`, `errorMessage`, or validation booleans on top of the shared contract. |
| Keep supporting descriptions in composition when the primitive needs more context. | Add extra shared props such as `description`, `hint`, or layout booleans without a documented shared need. |
| Use `size` to normalize dense and spacious toggle rows. | Reintroduce app-local size prop names or inline pixel styles. |
| Keep authored shared DOM on `Box`, including stories. | Hand-write native JSX tags in shared source or stories. |
| Keep persistence, analytics, and workflow side effects in the consumer. | Put async requests, service hooks, or auth logic inside `Switch`. |

---

## Storybook Stories Required

**Story file title:** `'Inputs/Switch'`

- [x] `Default`
- [x] `Sizes`
- [x] `DisabledState`
- [x] `ErrorState`
- [x] `WithDescription`
- [x] `Interactive`
- [x] `ResponsiveLayout`

---

## Box-only DOM policy

- Authored shared JSX for `Switch` and its stories must use `Box` for every DOM node.
- Semantic elements such as the button-backed control, thumb, label, supporting copy, and inline error message render through `Box as="button"`, `Box as="span"`, `Box as="label"`, and `Box as="p"`.
- No native JSX tags are authored directly in the component or story source.

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-10 | Initial Switch spec |
| 2026-03-10 | Added shared error-state contract and accessible inline error treatment |
