# DatePicker Spec

## Metadata

| Field | Value |
| --------------- | ----------------------- |
| Storybook Group | `Inputs` |
| Component Tier | `Tier 2 (Composite)` |
| Structure Tier | `Standard` |
| Based on | `Calendar` + `Popover` |

---

## Overview

`DatePicker` is the shared single-date field shell for app flows that need a compact trigger, a floating calendar, and normalized min/max date constraints without pulling routing, formatting workflows, or domain validation into `@repo/ui`.

It composes the shipped `Calendar` and `Popover` primitives, keeps the authored trigger and message markup on `Box`, and normalizes recurring local props such as `initialValue`, `minimumDate`, `maximumDate`, `isDisabled`, `isForceClear`, `isLongDate`, and `errorMessage` into the canonical shared contract. The visual shell follows the same `variant` and `size` vocabulary as `Input`, while `formatDate` gives consumers a narrow override for display-only string formatting without changing the selected value contract.

**When to use:**

- Use `DatePicker` for a single date field inside forms, filters, or lightweight booking-style inputs.
- Use it when the parent owns the selected date and only needs a shared trigger shell plus calendar interaction.
- Use `variant` and `size` to keep the trigger visually aligned with nearby `Input` fields.
- Use `formatDate` when a screen needs a different display label, such as a long-date summary, while still storing a `Date` value.

**When NOT to use:**

- Use `Calendar` directly for inline calendar grids that do not need an anchored trigger.
- Keep complex preset flows, date-range selection, date-time entry, workflow save/apply buttons, and business-specific validation local or on later shared targets such as `DateRangePicker` or `DateTimePicker`.
- Do not widen this component with parser-specific format tokens, app-specific styling booleans, or business validation rules.

---

## Design Decisions

| Decision | Choice | Rationale |
| -------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Root composition | Shared `Calendar` + shared `Popover` | Reuses the already-shipped calendar and floating-surface contracts instead of duplicating date or overlay behavior. |
| Visual contract | `Input`-aligned `variant` + `size` props | Keeps shared field density and chrome consistent across text and date-entry primitives. |
| Display formatting | `formatDate?: (date: Date) => string` | Supports app-specific display strings without leaking `date-fns` token APIs or changing the stored value shape. |
| CVA strategy | Slot-based | The control shell, trigger, icons, and clear action each need tokenized state styling without widening the public API further. |
| Controlled vs uncontrolled | both | `value` and `open` may be controlled by the parent, but the component still works when those props are omitted. |
| `asChild` support | no | The semantic root must stay an actual button trigger for the popover contract. |
| API shape | flat | `$vercel-composition-patterns` evaluation does not justify compound trigger/content exports here. |
| Box-only DOM rule | explicit | Wrapper, trigger, clear button, and error message all render through `Box`. |

---

## Props Interface

| Prop | Type | Default | Required | Description |
| --------------- | ----------------------------------------------------------------------- | ----------- | -------- | --------------------------------------------------------------------------- |
| `variant` | `'default' \| 'outline' \| 'ghost'` | `'default'` | No | Shared field shell appearance aligned with `Input`. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | No | Shared density scale for the trigger shell and affordances. |
| `formatDate` | `(date: Date) => string` | localized medium date | No | Optional display-only formatter for the selected value shown inside the trigger. |
| `value` | `Date \| null` | internal state | No | Controlled selected date. |
| `onChange` | `(date: Date \| null) => void` | `undefined` | No | Called after a date is selected or cleared. |
| `mode` | `'single'` | `'single'` | No | Locked single-date contract; range and date-time stay on separate components. |
| `minDate` | `Date` | `undefined` | No | Disables dates before this boundary and limits month navigation. |
| `maxDate` | `Date` | `undefined` | No | Disables dates after this boundary and limits month navigation. |
| `disabled` | `boolean` | `false` | No | Disables trigger interaction and clear affordance. |
| `clearable` | `boolean` | `false` | No | Renders a clear action when a value is present. |
| `required` | `boolean` | `false` | No | Marks the label as required and prevents deselection by selecting the active day again. |
| `label` | `string` | `undefined` | No | Visible field label for standalone usage. |
| `placeholder` | `string` | `'Pick a date'` | No | Trigger copy shown when no date is selected. |
| `error` | `string \| boolean` | `false` | No | Invalid state or inline message. |
| `open` | `boolean` | internal state | No | Controlled popover visibility. |
| `onClose` | `() => void` | `undefined` | No | Called whenever the popover closes after selection or external dismissal. |
| `className` | `string` | `undefined` | No | Applied to the outer field wrapper via `cn()`. |
| `id` | `string` | generated | No | Applied to the trigger button and linked label. |
| `...buttonProps` | `ButtonHTMLAttributes<HTMLButtonElement>` | - | No | Forwards button semantics such as `name`, `tabIndex`, `onBlur`, and `aria-*` attributes to the trigger. |

---

## Variants

| Variant | Description | When to use |
| --------- | ------------------------------------------- | --------------------------------------------------------------- |
| `default` | Bordered surface with background and shadow | Standard form and filter date fields. |
| `outline` | Lower-elevation bordered shell | Dense or layered layouts that already provide strong surfaces. |
| `ghost` | Minimal chrome with muted background | Toolbar filters and inline utility date fields. |

## Sizes

| Size | Behavior | Intended use |
| ---- | ------------------------- | ------------------------------------------- |
| `xs` | Tightest field density | Dense table filters and compact inline use. |
| `sm` | Small shared field shell | Secondary toolbars and compact forms. |
| `md` | Default shared field size | Standard forms and general-purpose usage. |
| `lg` | Larger touch target shell | Prominent filters and mobile-first forms. |

---

## States

| State | Visual Behavior | Accessibility |
| ---------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Default | Trigger shows selected value or placeholder in the shared field shell | Trigger is a real button with `aria-expanded` |
| Hover | Clear action and trigger keep pointer affordance when interactive | No hover-only information |
| Open | Popover surface opens below the trigger with the shared calendar grid | Trigger exposes `aria-haspopup="dialog"` and `aria-expanded="true"` |
| Focus | Shared field chrome uses visible focus-within ring treatment | Keyboard users keep a visible focus indicator on trigger and calendar controls |
| Disabled | Trigger and clear action dim and stop responding to input | Trigger uses native `disabled` state |
| Cleared | Value resets to `null` and placeholder returns | Clear button has its own accessible name |
| Error | Border and message switch to destructive styling | Trigger receives `aria-invalid`; error text uses `role="alert"` |
| Min/max bounded | Out-of-range dates are disabled and month navigation is clamped | Disabled dates remain non-interactive in the calendar grid |

---

## Accessibility

### ARIA Roles & Attributes

| Element | Role / Attribute | Value |
| ------------ | ------------------ | -------------------------------------------------------- |
| Trigger | native button | `type="button"` unless overridden |
| Trigger | `aria-expanded` | `true` when the popover is open |
| Trigger | `aria-haspopup` | `"dialog"` |
| Trigger | `aria-invalid` | `true` when `error` is truthy |
| Trigger | `aria-describedby` | Includes shared error id and any caller-provided ids |
| Error copy | `role` | `alert` |
| Clear button | `aria-label` | `"Clear date"` |

### Keyboard Map

| Key | Behavior |
| -------- | ---------------------------------------------------- |
| `Enter` / `Space` | Opens the calendar trigger and activates controls |
| `Tab` / `Shift+Tab` | Moves through trigger, popover controls, and clear button |
| `Escape` | Closes the popover through Radix dismissal behavior |
| Arrow keys | Handled by `react-day-picker` inside the calendar grid |

### Focus Management

- Focus starts on the trigger.
- When the popover opens, `Calendar` uses `initialFocus` so keyboard users land in the day grid.
- After selecting a date or closing externally, focus returns to the trigger.
- Activating the clear button restores focus to the trigger after clearing.

### Screen Reader Notes

- Standalone usage can provide `label`; form-composed usage can provide the label through shared `FormLabel` and `FormControl`.
- Placeholder text stays visible inside the trigger until a date is selected.
- Inline errors are announced through the shared `role="alert"` message.
- `formatDate` only changes the visible display string; it does not alter the selected `Date` value or calendar semantics.

---

## Usage Examples

### 1. Basic usage

```tsx
<DatePicker label="Travel date" value={date} onChange={setDate} clearable />
```

### 2. With min/max bounds

```tsx
<DatePicker
  label="Coverage start"
  value={startDate}
  onChange={setStartDate}
  minDate={new Date(2026, 0, 10)}
  maxDate={new Date(2026, 0, 24)}
/>
```

### 3. Error state

```tsx
<DatePicker
  label="Effective date"
  value={effectiveDate}
  onChange={setEffectiveDate}
  error="Select an effective date before continuing."
/>
```

### 4. Input-aligned chrome

```tsx
<DatePicker
  variant="outline"
  size="sm"
  label="Travel date"
  value={travelDate}
  onChange={setTravelDate}
/>
```

### 5. Display format override

```tsx
<DatePicker
  label="Long date"
  value={travelDate}
  onChange={setTravelDate}
  formatDate={(date) => format(date, 'EEEE, d MMMM yyyy')}
/>
```

---

## Do / Don't

| Do | Don't |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Use `minDate` and `maxDate` for generic booking or eligibility windows. | Add app-specific `minimumDate`, `maximumDate`, or `disabledReason` props. |
| Use `variant` and `size` to align the control with adjacent shared `Input` fields. | Reintroduce app-local visual booleans such as `isWithShadow` or `borderDatePicker`. |
| Use `formatDate` for display-only overrides such as long-date labels. | Add parser-specific `format` token strings that hardcode one formatting library into the public API. |
| Use `clearable` when the parent allows removing a selection. | Add workflow-specific `onSave` or `onSubmit` callbacks to the picker. |
| Compose with shared `Form` primitives for validation messaging. | Rebuild a second date field wrapper just to connect RHF. |
| Keep range and date-time workflows on dedicated future components. | Add `range`, `time`, or preset booleans to this single-date contract. |
| Keep authored shared JSX and stories on `Box`, including `button`, `span`, and `p`. | Hand-write native DOM tags in shared authored JSX. |

---

## Storybook Stories Required

**Story file title:** `'Inputs/DatePicker'`

- [x] `Default`
- [x] `Variants`
- [x] `Sizes`
- [x] `With Min/Max`
- [x] `Custom Format`
- [x] `Error State`
- [x] `Disabled State`
- [x] `Form Field`

Roadmap alignment:
- `DatePicker.Basic` -> `Default`
- `DatePicker.WithMinMax` -> `With Min/Max`
- `DatePicker.ErrorState` -> `Error State`
- `DatePicker.FormField` -> `Form Field`
- `DatePicker.CustomFormat` -> `Custom Format`

---

## Box-only DOM policy

- Authored shared JSX for this component and its stories must use `Box` for every DOM node.
- Semantic elements such as the trigger button, helper wrapper, status text, and clear action must render through `Box as="button"`, `Box as="span"`, and `Box as="p"`.
- `Popover` portal internals and `react-day-picker` internal calendar markup remain third-party DOM boundaries and are the only non-Box rendered nodes involved in the final output.

---

## Changelog

| Date | Change |
| ---------- | ------------------ |
| 2026-03-12 | Added `formatDate` display override and synced the canonical docs and stories |
