# DateTimePicker Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Inputs` |
| Component Tier | `Tier 2 (Composite)` |
| Structure Tier | `Complex` |
| Based on | `Calendar` + `Popover` + minute-precision time input |

---

## Overview

`DateTimePicker` is the shared date-and-time field shell for flows that need one selected day plus one selected time without pulling workflow save/apply behavior, timezone conversion, or business validation into `@repo/ui`. It keeps the authored trigger, compact time utility row, optional support copy, and error message on `Box`, composes the shipped `Calendar` and `Popover` primitives, and follows the settled shared policy that the value contract remains a plain `Date | null`.

The shared component commits selection directly through `onChange`. Picking a day applies the current minute-precision time draft, and editing the time immediately recomposes the emitted `Date`. Bounds remain shared and generic through `minDateTime` and `maxDateTime`; recurrence, server-time synchronization, domain-specific timezone conversion, and explicit save/apply workflows stay app-local.

**When to use:**

- Use `DateTimePicker` for generic appointment, scheduling, booking, and effective-at style inputs that require both a date and a time.
- Use it when the parent owns the selected `Date` value and only needs a shared trigger + popover + calendar + time-entry surface.
- Use `timezone` when a screen needs to communicate a display or selection context without changing the emitted value type.

**When NOT to use:**

- Use `DatePicker` when only a day is required.
- Keep save/apply buttons, timezone conversion workflows, recurrence, and server-owned scheduling semantics in app-local wrappers.
- Do not widen this component with app-specific labels, placeholders, duration props, or business validation rules.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Root composition | Shared `Calendar` + shared `Popover` + inline `Box as="input"` time control | Reuses the already-shipped date and overlay foundations instead of creating a parallel scheduling primitive. |
| Value contract | `Date \| null` | Matches the settled policy and keeps shared consumers off custom zoned value types. |
| Time precision | minute only | Shared policy explicitly excludes seconds and other finer-grained scheduling concerns. |
| Controlled vs uncontrolled value | both | Parent surfaces may own the selected value, but the component still works when `value` is omitted. |
| Open-state control | internal only | The current canonical API does not require `open` or `onClose`, so the public surface stays narrow. |
| Timezone semantics | display and selection context only | `timezone` may influence rendered labels, but it must not silently transform the emitted `Date` instant. |
| Bounds handling | `minDateTime` / `maxDateTime` enforced in calendar and time input | Keeps both parts of the selection flow aligned to one shared constraint model. |
| Composition review | flat API, no public subcomponents | `$vercel-composition-patterns` review does not justify a compound public contract here. |
| Box-only DOM rule | explicit | Trigger, time label, time input, support copy, clear action, and error message all render through `Box`. |

---

## Props Interface

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `Date \| null` | internal state | No | Controlled selected date and time. |
| `onChange` | `(value: Date \| null) => void` | `undefined` | No | Called after day selection, time changes, or clear. |
| `minDateTime` | `Date` | `undefined` | No | Generic lower bound enforced in the calendar and time input. |
| `maxDateTime` | `Date` | `undefined` | No | Generic upper bound enforced in the calendar and time input. |
| `timezone` | `string` | `undefined` | No | Display-context timezone note only; does not change the emitted `Date` contract. |
| `disabled` | `boolean` | `false` | No | Disables trigger interaction, time input changes, and clear affordance. |
| `clearable` | `boolean` | `false` | No | Renders an inline clear action when a value exists. |
| `error` | `string \| boolean` | `false` | No | Invalid state or inline validation message. |
| `className` | `string` | `undefined` | No | Applied to the outer field wrapper through `cn()`. |
| `id` | `string` | generated | No | Applied to the trigger button and linked accessibility ids. |
| `...buttonProps` | `ButtonHTMLAttributes<HTMLButtonElement>` | - | No | Forwards button semantics such as `name`, `tabIndex`, `onBlur`, `onFocus`, and `aria-*` attributes to the trigger. |

---

## Visual Contract

`DateTimePicker` does not expose public `variant` or `size` props in this pass. The shared contract is one input-aligned trigger shell plus one in-panel time row.

| Surface | Description | Notes |
| --- | --- | --- |
| Trigger shell | Input-aligned bordered field button | Shows the selected date/time or the default placeholder `Select date and time...` |
| Calendar panel | Shared single-date calendar | Leaves the popover open after day selection so time can be adjusted |
| Time row | Inline minute-precision time field with clock affordance | Uses native `type="time"` semantics through `Box as="input"` |
| Support copy | Muted inline guidance below the time row | Communicates minute precision and optional timezone context |
| Clear action | Inline trailing control | Only shows when `clearable` is true and a value exists |

---

## States

| State | Visual Behavior | Accessibility |
| --- | --- | --- |
| Default | Trigger shows `Select date and time...` in muted text | Placeholder text becomes the visible prompt when no value exists |
| Selected | Trigger shows the chosen local date and time | Trigger text reflects the committed `Date` value |
| Open | Popover stays open after day selection so time can be adjusted | Trigger exposes `aria-expanded="true"` and `aria-haspopup="dialog"` |
| Time draft | Time input can be adjusted with minute precision | Native time input remains keyboard accessible |
| Bounded | Calendar and time input enforce `minDateTime` / `maxDateTime` | Out-of-range days and times remain non-interactive |
| Hover | Trigger and clear action keep pointer affordance when interactive | No hover-only information |
| Focus | Trigger, time input, and clear action use visible focus rings | Keyboard users keep a visible focus path through the whole control |
| Disabled | Trigger, time input, and clear action dim and stop responding | Trigger uses native `disabled` state |
| Error | Border and inline message switch to destructive styling | Trigger receives `aria-invalid`; message uses `role="alert"` |
| Timezone note | Muted support copy appears only when `timezone` is provided | Timezone remains descriptive, not a hidden data transform |

---

## Accessibility

### ARIA Roles & Attributes

| Element | Role / Attribute | Value |
| --- | --- | --- |
| Trigger | native button | `type="button"` unless overridden |
| Trigger | `aria-expanded` | `true` when the popover is open |
| Trigger | `aria-haspopup` | `"dialog"` |
| Trigger | `aria-invalid` | `true` when `error` is truthy |
| Trigger | `aria-describedby` | Includes shared timezone-note id when present, shared error id, and any caller-provided ids |
| Time input | native time input | Uses native browser keyboard and screen-reader semantics |
| Time input | `aria-labelledby` | Linked to the visible inline `Time` label |
| Clear action | `aria-label` | `"Clear date and time"` |
| Error copy | `role` | `alert` |

### Keyboard Map

| Key | Behavior |
| --- | --- |
| `Enter` / `Space` | Opens the trigger and activates the clear action |
| `Tab` / `Shift+Tab` | Moves through trigger, calendar controls, time input, and clear action |
| `Escape` | Closes the popover through shared popover dismissal behavior |
| Arrow keys | Handled by `react-day-picker` inside the calendar grid |

### Focus Management

- Focus starts on the trigger button.
- When the popover opens, `Calendar` uses `initialFocus` so keyboard users land in the day grid first.
- Selecting a day keeps the popover open so focus can move to the time input without reopening the control.
- Closing the popover returns focus to the trigger.
- Clearing restores focus to the trigger.

### Screen Reader Notes

- Standalone usage should provide `aria-label` or `aria-labelledby` through forwarded button props.
- Shared form composition should provide a visible label through `FormLabel` and `FormControl`.
- The optional support copy communicates timezone display context through the same `aria-describedby` chain as validation text when `timezone` is present.
- `timezone` is descriptive only; the shared component still emits a plain `Date`.

---

## Usage Examples

### 1. Basic usage

```tsx
<DateTimePicker
  value={appointment}
  onChange={setAppointment}
  clearable
  aria-label="Appointment date and time"
/>
```

### 2. With bounds

```tsx
<DateTimePicker
  value={effectiveAt}
  onChange={setEffectiveAt}
  minDateTime={new Date(2026, 0, 15, 9, 15)}
  maxDateTime={new Date(2026, 0, 16, 17, 45)}
  aria-label="Effective date and time"
/>
```

### 3. With timezone context

```tsx
<DateTimePicker
  value={meetingAt}
  onChange={setMeetingAt}
  timezone="UTC"
  aria-label="Meeting date and time"
/>
```

### 4. Shared form composition

```tsx
<FormField
  name="appointment"
  render={({ field }) => (
    <FormItem>
      <FormLabel required>Appointment</FormLabel>
      <FormControl>
        <DateTimePicker
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          clearable
          aria-label="Appointment date and time"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## Do / Don't

| Do | Don't |
| --- | --- |
| Use `minDateTime` and `maxDateTime` for generic scheduling windows. | Push business-specific availability logic or service validation into `@repo/ui`. |
| Treat the emitted value as a plain `Date \| null`. | Introduce a second shared zoned value type or hidden timezone conversion. |
| Use `timezone` only to communicate display or selection context. | Assume `timezone` mutates the emitted value into a different instant. |
| Use the shared clear action when a workflow allows resetting the field. | Depend on reselecting the same day as a hidden toggle-off interaction. |
| Compose visible labels through shared `Form` primitives or `aria-*` button props. | Add app-specific `label`, `placeholder`, `onApply`, or `onSave` props to the shared API. |
| Keep authored shared JSX and stories on `Box`, including the time input and support copy. | Hand-write native DOM tags in shared authored JSX. |

---

## Storybook Stories Required

**Story file title:** `'Inputs/DateTimePicker'`

- [x] `Basic`
- [x] `With Bounds`
- [x] `Timezone`
- [x] `Clearable`
- [x] `Disabled State`
- [x] `Error State`
- [x] `Form Field`

Roadmap alignment:
- `DateTimePicker.Basic` -> `Basic`
- `DateTimePicker.Timezone` -> `Timezone`
- `DateTimePicker.Invalid` -> `Error State`

---

## Box-only DOM policy

- Authored shared JSX for this component and its stories must use `Box` for every DOM node.
- Semantic elements such as the trigger button, trigger text, time label, time input, clear action, support copy, and error message must render through `Box as="button"`, `Box as="span"`, `Box as="label"`, `Box as="input"`, and `Box as="p"`.
- `react-day-picker` still owns the internal calendar grid DOM and Radix Popover still owns portal internals; those remain the documented third-party DOM boundaries for this component.

---

## Per-App Baseline Inputs Consulted

- `packages/ui/docs/normalization/per-app/claim-portal_baseline-summary.md`
- `packages/ui/docs/normalization/per-app/customer-portal_baseline-summary.md`
- `packages/ui/docs/normalization/per-app/teman-affiliate-admin_baseline-summary.md`

Key recurring needs captured:

- Shared `value`, `onChange`, `minDateTime`, `maxDateTime`, and disabled-state demand from `claim-portal`
- Shared invalid-state demand from `customer-portal`
- Shared DateTimePicker extraction demand from `teman-affiliate-admin`

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-13 | Initial DateTimePicker spec under the settled shared date/time policy |
