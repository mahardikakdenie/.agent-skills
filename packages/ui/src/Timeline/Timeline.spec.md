# Timeline Spec

## Metadata

| Field           | Value                    |
| --------------- | ------------------------ |
| Storybook Group | `Data Display`           |
| Component Tier  | `Tier 2 (Composite)`     |
| Structure Tier  | `Standard`               |
| Based on        | `Box`-backed composition |

---

## Overview

`Timeline` is a presentation-only milestone and status-history component for ordered events that should remain readable without bringing workflow logic into `@repo/ui`. It renders a sequence of items with a marker, connector, title, and optional supporting description.

The shared contract stays intentionally flat and data-driven. Consumers pass `items[]`, optional shared `statusTone`, an `orientation`, and an optional shared surface `variant` for the marker treatment, while app-local code keeps ownership of domain mapping, date formatting, route changes, ticket-style gantt layouts, and any interactive workflow behavior.

**When to use:**

- Show a simple chronological history of statuses, milestones, or handoff events.
- Render a compact progress summary inside cards, detail panels, or admin sidebars.
- Apply semantic marker tones when the event meaning should be visible at a glance.

**When NOT to use:**

- Do not use `Timeline` for interactive steppers, gantt charts, schedulers, or drag-and-drop workflow boards.
- Do not use it when the component needs routing, data fetching, sorting, filtering, or domain-specific actions per row.

---

## Design Decisions

| Decision                   | Choice                                             | Rationale                                                                                                                    |
| -------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Primitive                  | `Box` composition                                  | Keeps authored DOM inside the Box-only rule while matching the locked `HTMLAttributes<HTMLDivElement>` public contract.      |
| CVA strategy               | Slot-based root, item, rail, connector, and marker | Orientation and semantic marker tone affect distinct parts of the layout, so slot-level variants stay clearer than booleans. |
| Controlled vs uncontrolled | none                                               | `Timeline` is pure display with no internal interactive state.                                                               |
| Sub-components             | no public compound exports                         | The authoritative `02` contract is `items[]`; exporting additional shared item parts would widen the API without need.       |
| Status styling             | marker-only semantic tone                          | Title and description stay readable with neutral text tokens while markers convey scan-friendly status emphasis.             |
| Box-only DOM rule          | explicit in implementation and stories             | All authored list, marker, connector, and body nodes must render through `Box`; no direct native tags are authored.          |

---

## Props Interface

| Prop          | Type                                                             | Default      | Required | Description                                                                                    |
| ------------- | ---------------------------------------------------------------- | ------------ | -------- | ---------------------------------------------------------------------------------------------- |
| `items`       | `TimelineItem[]`                                                 | -            | Yes      | Ordered item records for the rendered history.                                                 |
| `orientation` | `'vertical' \| 'horizontal'`                                     | `'vertical'` | No       | Layout direction for the sequence.                                                             |
| `variant`     | `'outline' \| 'shadow'`                                          | `'outline'`  | No       | Shared fallback marker surface treatment used when an item does not provide its own `variant`. |
| `statusTone`  | `'default' \| 'success' \| 'warning' \| 'destructive' \| 'info'` | `'default'`  | No       | Shared fallback marker tone used when an item does not provide its own `statusTone`.           |
| `className`   | `string`                                                         | `undefined`  | No       | Consumer override merged last through `cn()` for density or layout-specific adjustments.       |
| `...props`    | `React.HTMLAttributes<HTMLDivElement>`                           | -            | No       | Native root attributes such as `id`, `aria-label`, `aria-describedby`, or `data-*`.            |

### Complex Prop Shapes

```ts
export interface TimelineItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: 'outline' | 'shadow';
  statusTone?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
}
```

`description` intentionally absorbs date, time, and support text so the shared API does not grow a second line-specific prop family such as `date`, `meta`, or `caption`.

---

## Variants

### Orientation

| Variant      | Description                                 | When to use                                              |
| ------------ | ------------------------------------------- | -------------------------------------------------------- |
| `vertical`   | Marker and connector stack downward         | Ordered history in cards, side panels, and detail pages. |
| `horizontal` | Marker and connector flow across milestones | Compact progress summaries and shorter stage sequences.  |

### Surface Variant

| Variant   | Description                                          | When to use                                                                  |
| --------- | ---------------------------------------------------- | ---------------------------------------------------------------------------- |
| `outline` | Marker surface renders without a resting shadow      | Default timeline treatment and the fallback when `variant` is omitted        |
| `shadow`  | Marker surface adds `shadow-sm` to the actual marker | Use when the marker needs stronger separation from dense surrounding content |

### Status Tone

| Tone          | Description                  | When to use                                      |
| ------------- | ---------------------------- | ------------------------------------------------ |
| `default`     | Neutral marker styling       | Standard history without semantic emphasis.      |
| `success`     | Positive marker styling      | Completed, verified, or approved events.         |
| `warning`     | Caution marker styling       | Attention-needed or follow-up-required events.   |
| `destructive` | High-severity marker styling | Failed or blocked events.                        |
| `info`        | Informational marker styling | Supporting informational or review-state events. |

---

## States

| State              | Visual Behavior                                                                                      | Accessibility                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Default            | Ordered marker + connector sequence with readable title and body copy, with no resting marker shadow | Root exposes `role="list"` and each entry exposes `role="listitem"`.                      |
| Orientation change | Layout reflows between vertical and horizontal presentation                                          | Reading order remains DOM-order identical to the `items[]` array.                         |
| Shadow markers     | Marker surfaces adopt `shadow-sm` when `variant="shadow"` is selected                                | Text remains the primary status signal; shadow only affects separation                    |
| Mixed tones        | Item markers adopt their own semantic tone                                                           | Tone should not be the only source of status meaning; title and description stay textual. |
| Dense composition  | Consumers can tighten spacing through `className`                                                    | No extra density prop is introduced; semantics stay unchanged.                            |
| Empty items        | Renders an empty list container only                                                                 | Consumers own any empty-state copy or placeholder surface.                                |

`Timeline` has no hover, focus, disabled, loading, or error state of its own because it is non-interactive.

---

## Accessibility

### ARIA Roles & Attributes

| Element   | Role / Attribute | Value / Rule                                                      |
| --------- | ---------------- | ----------------------------------------------------------------- |
| Root      | `role`           | `"list"`                                                          |
| Root      | `aria-label`     | Optional consumer override when the surrounding heading is absent |
| Item      | `role`           | `"listitem"`                                                      |
| Marker    | `aria-hidden`    | `true`                                                            |
| Connector | `aria-hidden`    | `true`                                                            |

### Keyboard Map

`Timeline` has no keyboard interaction because it is non-interactive content.

### Focus Management

- `Timeline` does not participate in the tab order by default.
- If a consumer needs interactive disclosure or navigation per event, that behavior stays app-local and should not be added to the shared component.

### Screen Reader Notes

- Screen readers announce the entries in the same order provided through `items[]`.
- Marker color is decorative only; event meaning must remain understandable from text alone.

---

## Usage Examples

### 1. Basic usage

```tsx
<Timeline
  items={[
    { id: 'submitted', title: 'Submitted', description: 'Request received' },
    { id: 'approved', title: 'Approved', description: 'Ready for the next handoff' },
  ]}
/>
```

### 2. Shared tone fallback

```tsx
<Timeline
  statusTone="info"
  items={[
    { id: 'created', title: 'Created', description: 'Initial setup complete' },
    { id: 'review', title: 'In review', description: 'Waiting for the next reviewer' },
  ]}
/>
```

### 3. Per-item semantic tones

```tsx
<Timeline
  items={[
    { id: 'verified', title: 'Verified', statusTone: 'success' },
    { id: 'follow-up', title: 'Needs follow-up', statusTone: 'warning' },
    { id: 'blocked', title: 'Blocked', statusTone: 'destructive' },
  ]}
/>
```

### 4. Horizontal summary

```tsx
<Timeline
  orientation="horizontal"
  items={[
    { id: 'draft', title: 'Draft' },
    { id: 'review', title: 'Review' },
    { id: 'published', title: 'Published' },
  ]}
/>
```

---

## Do / Don't

| Do                                                                              | Don't                                                                               |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Map app-local history records into the shared `items[]` shape before rendering. | Add business-specific props such as `date`, `actor`, `cta`, `route`, or `isActive`. |
| Use `statusTone` only for semantic marker emphasis.                             | Depend on color alone to communicate event meaning.                                 |
| Keep authored shared markup and stories on `Box`.                               | Hand-write native `div`, `span`, `ol`, `li`, or SVG tags in the shared source.      |
| Use `className` for density tuning when a dense layout is needed.               | Introduce a dedicated `dense`, `compact`, or `small` boolean prop.                  |
| Keep gantt, scheduler, and workflow-board timelines app-local.                  | Stretch this component into a data grid, calendar, or interactive stepper.          |

---

## Storybook Stories Required

**Story file title:** `'Data Display/Timeline'`

- [x] `Basic`
- [x] `Horizontal`
- [x] `Dense`
- [x] `Status`
- [x] `ShadowMarkers`

---

## Changelog

| Date       | Change                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------- |
| 2026-03-13 | Initial Timeline spec                                                                       |
| 2026-04-03 | Added normalized `outline` / `shadow` marker-surface variants with `outline` as the default |
