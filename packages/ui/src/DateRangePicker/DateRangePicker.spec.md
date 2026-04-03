# DateRangePicker Spec

## Metadata

| Field           | Value                  |
| --------------- | ---------------------- |
| Storybook Group | `Inputs`               |
| Component Tier  | `Tier 2 (Composite)`   |
| Structure Tier  | `Complex`              |
| Based on        | `Calendar` + `Popover` |

---

## Overview

`DateRangePicker` is the shared date-range field shell for flows that need a bounded start and end date without embedding app-specific save, apply, or routing behavior into `@repo/ui`. It keeps the authored trigger, preset row, and error markup on `Box`, composes the already-shipped shared `Calendar` in `range` mode, and uses the shared `Popover` surface so the entire date family stays visually and behaviorally aligned.

The public value stays a simple `DateRangeValue | null`, with optional preset shortcuts for common generic ranges such as "This week" or "Last 30 days." In plain date-only mode without presets, the popover chrome stays bare so the shared two-month `Calendar` remains the primary surface instead of being double-framed. When `withTime` is enabled, or when preset chrome is present, the same contract uses a framed composite shell and carries minute-precision start and end times plus UI-enforced `minDateTime` / `maxDateTime` bounds without becoming a separate component. `changeBehavior` keeps the same controlled `value` / `onChange` contract while letting parents either receive every partial selection (`partial`, default) or only completed ranges (`complete`) without forcing an app-local state adapter. Workflow-specific apply buttons, server-driven presets, query-string sync, and business validation remain local composition.

**When to use:**

- Use `DateRangePicker` for generic reporting, filtering, booking-window, and coverage-period range selection.
- Use it when the parent owns the range value and only needs a reusable trigger + popover + calendar range interaction.
- Use `presets` for small, generic shortcut ranges that do not encode domain rules.
- Use `withTime` when the selected range must capture both start/end dates and minute-precision start/end times.

**When NOT to use:**

- Use `DatePicker` when the user must choose only one day.
- Keep save/apply buttons, server-driven preset lists, and query-string or routing sync in app-local wrappers.
- Keep month-only, quarter, and domain-specific eligibility or pricing flows on separate components.

---

## Design Decisions

| Decision                              | Choice                                                 | Rationale                                                                                                                                                         |
| ------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Root composition                      | Shared `Popover` + shared `Calendar` in `range` mode   | Reuses shipped overlay and date-grid behavior instead of creating a parallel range implementation.                                                                |
| Value contract                        | `DateRangeValue \| null`                               | Keeps the shared API decoupled from `react-day-picker` while staying simple for apps.                                                                             |
| Controlled vs uncontrolled value      | both                                                   | Matches the surrounding date-family patterns and allows lightweight local usage.                                                                                  |
| Change emission behavior               | `'partial'` by default, optional `'complete'`          | Preserves current shared behavior while allowing apps to defer `onChange` until a full range is selected without hiding in-progress selection inside the picker. |
| Controlled vs uncontrolled open state | internal only                                          | `02-api-conventions.md` does not require public open-state control here, so the surface stays narrow.                                                             |
| Presets model                         | optional flat `presets[]` array                        | Covers the recurring shortcut need without turning the component into a workflow shell.                                                                           |
| Calendar viewport                     | two months                                             | Improves range selection usability while still stacking safely on small screens through shared calendar styling.                                                  |
| In-progress range preview             | hover and focus preview after selecting the start date | Gives clearer enterprise-style range targeting before the user commits the end date.                                                                              |
| Disabled-date handling                | shared `minDate` / `maxDate` matchers                  | Keeps the public contract aligned to the installed `react-day-picker` API in this workspace while still constraining the selectable window.                       |
| Composition review                    | flat API, no public subcomponents                      | `$vercel-composition-patterns` review found no need for compound exports or more booleans.                                                                        |
| Box-only DOM rule                     | explicit                                               | Trigger, preset buttons, panel wrappers, and error message all render through `Box`; only DayPicker and Radix portal internals remain third-party DOM boundaries. |

---

## Props Interface

| Prop             | Type                                      | Default        | Required | Description                                                                                                               |
| ---------------- | ----------------------------------------- | -------------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `value`          | `DateRangeValue \| null`                  | internal state | No       | Controlled selected range.                                                                                                |
| `onChange`       | `(value: DateRangeValue \| null) => void` | `undefined`    | No       | Called after calendar selection, preset selection, or clear according to `changeBehavior`.                               |
| `changeBehavior` | `'partial' \| 'complete'`                 | `'partial'`    | No       | Controls whether parent `onChange` fires for in-progress start-date selections or only after the range is complete.      |
| `variant`        | `'outline' \| 'shadow' \| 'ghost' \| 'default'` | `'outline'` | No | Applies the shared Input-aligned trigger shell variant. Legacy `default` remains a compatibility alias for `shadow`. |
| `size`           | `'xs' \| 'sm' \| 'md' \| 'lg'`            | `'md'`         | No       | Applies the shared Input-aligned trigger height and spacing scale.                                                        |
| `presets`        | `DateRangePickerPreset[]`                 | `[]`           | No       | Optional generic shortcut ranges rendered above the calendar.                                                             |
| `minDate`        | `Date`                                    | `undefined`    | No       | Disables dates before this bound and limits month navigation.                                                             |
| `maxDate`        | `Date`                                    | `undefined`    | No       | Disables dates after this bound and limits month navigation.                                                              |
| `withTime`       | `boolean`                                 | `false`        | No       | Enables inline start and end time fields while keeping the public range contract as plain `Date` values.                  |
| `minDateTime`    | `Date`                                    | `undefined`    | No       | Optional lower datetime boundary enforced across both date and time when `withTime` is enabled.                           |
| `maxDateTime`    | `Date`                                    | `undefined`    | No       | Optional upper datetime boundary enforced across both date and time when `withTime` is enabled.                           |
| `timezone`       | `string`                                  | `undefined`    | No       | Optional display-context timezone hint shown below the time inputs; it does not transform the emitted values.             |
| `disabled`       | `boolean`                                 | `false`        | No       | Disables the trigger and clear affordance.                                                                                |
| `clearable`      | `boolean`                                 | `false`        | No       | Renders a clear action when any range value exists.                                                                       |
| `error`          | `string \| boolean`                       | `false`        | No       | Invalid state or inline validation message.                                                                               |
| `className`      | `string`                                  | `undefined`    | No       | Applied to the outer wrapper through `cn()`.                                                                              |
| `id`             | `string`                                  | generated      | No       | Applied to the trigger button.                                                                                            |
| `...buttonProps` | `ButtonHTMLAttributes<HTMLButtonElement>` | -              | No       | Forwards shared button semantics such as `name`, `tabIndex`, `onBlur`, `onFocus`, and `aria-*` attributes to the trigger. |

### Complex Prop Shapes

```ts
export interface DateRangeValue {
  from?: Date;
  to?: Date;
}

export interface DateRangePickerPreset {
  label: string;
  value: DateRangeValue;
}
```

---

## Visual Contract

`DateRangePicker` exposes the same public `variant` and `size` trigger contract as the shared Input family while keeping optional preset shortcuts and inline destructive validation treatment on the same range-selection shell.

| Surface        | Description                         | Notes                                                                                                                                                                |
| -------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trigger shell  | Input-aligned bordered field button | Shows the formatted range or the placeholder `Select date range...`                                                                                                  |
| Preset row     | Compact shortcut buttons            | Optional, wraps across rows, and highlights the active preset                                                                                                        |
| Calendar panel | Shared two-month range calendar     | Uses the existing `Calendar` visual language and stacks responsively; date-only mode keeps this as the primary bare surface when no presets or time rail are present |
| Clear action   | Inline trailing control             | Only shows when `clearable` is true and a value exists                                                                                                               |
| Time row       | Inline start/end time inputs        | Only renders when `withTime` is enabled and stays bound to the selected dates                                                                                        |

---

## States

| State          | Visual Behavior                                                                                                                                                   | Accessibility                                                                    |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Default        | Trigger shows `Select date range...` in muted text                                                                                                                | Placeholder text becomes the accessible name if no external label is provided    |
| Partial range  | Trigger shows the selected start date followed by `- ...`; in `changeBehavior="complete"` this preview stays local until an end date is chosen                 | Keeps the popover open so the end date can be completed                          |
| Range preview  | Calendar shows a soft contiguous preview from the chosen start date to the hovered or focused candidate end date                                                  | Supports mouse and keyboard exploration before the end date is committed         |
| Complete range | Trigger shows `from - to`                                                                                                                                         | Selected calendar range is announced through the visible trigger text            |
| Reselection    | Clicking a new day after a complete range starts a fresh partial range and keeps the calendar open                                                                | Prevents accidental close while the user resets the range                        |
| Open           | Popover shows optional presets and the two-month range calendar; the shell stays bare for plain date-only usage and framed when presets or time entry are present | Trigger exposes `aria-expanded="true"` and `aria-haspopup="dialog"`              |
| Hover          | Trigger, presets, and clear action increase contrast; the calendar previews an in-progress range after a start date exists                                        | Preview is visual only until the user commits an end date                        |
| Focus          | Trigger shell and inline time inputs use the calmer field-shell recipe, while preset buttons now use the shared compact-control focus recipe | Keyboard users keep a visible focus path through the whole control without adding a detached offset halo to the field shell |
| Disabled       | Trigger and clear action dim and stop responding to input                                                                                                         | Trigger uses native `disabled` state                                             |
| Error          | Border, calmer invalid halo, and inline message switch to destructive styling                                                                                     | Trigger receives `aria-invalid`; message uses `role="alert"`                     |
| Bounded        | Out-of-range dates and preset buttons are disabled                                                                                                                | Disabled options stay non-interactive                                            |
| Time-enabled   | Popover keeps the framed composite shell, then adds start/end time inputs and optional timezone hint beneath the shared two-month range calendar                  | Time inputs stay keyboard reachable and inherit the same invalid state treatment |

---

## Accessibility

### ARIA Roles & Attributes

| Element       | Role / Attribute   | Value                                                |
| ------------- | ------------------ | ---------------------------------------------------- |
| Trigger       | native button      | `type="button"` unless overridden                    |
| Trigger       | `aria-expanded`    | `true` when the popover is open                      |
| Trigger       | `aria-haspopup`    | `"dialog"`                                           |
| Trigger       | `aria-invalid`     | `true` when `error` is truthy                        |
| Trigger       | `aria-describedby` | Includes shared error id and any caller-provided ids |
| Preset group  | `role`             | `group`                                              |
| Preset group  | `aria-label`       | `"Date range presets"`                               |
| Preset button | `aria-pressed`     | `true` when the preset matches the current range     |
| Clear action  | `aria-label`       | `"Clear date range"`                                 |
| Error copy    | `role`             | `alert`                                              |

### Keyboard Map

| Key                 | Behavior                                                            |
| ------------------- | ------------------------------------------------------------------- |
| `Enter` / `Space`   | Opens the trigger and activates preset buttons                      |
| `Tab` / `Shift+Tab` | Moves through trigger, presets, clear action, and calendar controls |
| `Escape`            | Closes the popover through shared popover dismissal behavior        |

### Focus Management

- Focus starts on the trigger button.
- When the popover opens, keyboard users tab into the optional preset row and the shared calendar controls.
- Completing a range closes the popover and returns focus to the trigger.
- Starting a replacement range from an existing selection keeps the popover open so the end date can be chosen next.
- Clearing the range keeps focus on the trigger.
- After choosing a start date, moving focus through candidate end dates previews the pending range before selection.

### Screen Reader Notes

- Standalone usage can rely on the visible trigger text or pass `aria-label` / `aria-labelledby` through button props.
- Form-composed usage should provide a visible label through shared `FormLabel` and `FormControl`.
- Inline errors are announced through the shared `role="alert"` message.
- The selected range is announced through the trigger text and the calendar's built-in accessible day-grid behavior.
- The in-progress range preview is complementary visual guidance; the committed value remains the only announced selected range.

---

## Usage Examples

### 1. Basic usage

```tsx
<DateRangePicker value={travelWindow} onChange={setTravelWindow} clearable />
```

### 2. Complete-only parent updates

```tsx
<DateRangePicker
  value={reportWindow}
  onChange={setReportWindow}
  changeBehavior="complete"
/>
```

### 3. With presets

```tsx
<DateRangePicker
  value={reportWindow}
  onChange={setReportWindow}
  presets={[
    {
      label: 'Last 7 days',
      value: { from: new Date(2026, 0, 8), to: new Date(2026, 0, 15) },
    },
    {
      label: 'This month',
      value: { from: new Date(2026, 0, 1), to: new Date(2026, 0, 31) },
    },
  ]}
/>
```

### 4. With bounds and validation

```tsx
<DateRangePicker
  value={eligibilityWindow}
  onChange={setEligibilityWindow}
  minDate={new Date(2026, 0, 1)}
  maxDate={new Date(2026, 2, 31)}
  error="Select a valid coverage window."
/>
```

### 5. With time entry

```tsx
<DateRangePicker
  value={travelWindow}
  onChange={setTravelWindow}
  withTime
  minDateTime={new Date(2026, 0, 15, 9, 15)}
  maxDateTime={new Date(2026, 0, 16, 17, 45)}
  timezone="UTC"
/>
```

### 6. Shared form composition

```tsx
<FormField
  name="travelWindow"
  render={({ field }) => (
    <FormItem>
      <FormLabel required>Travel window</FormLabel>
      <FormControl>
        <DateRangePicker value={field.value} onChange={field.onChange} clearable />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## Do / Don't

| Do                                                                                       | Don't                                                                                                    |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Use `presets` only for generic shortcut ranges.                                          | Add business-specific save/apply or API-driven preset behavior to the shared component.                  |
| Use `changeBehavior="complete"` when the parent should only react to fully selected ranges. | Build an app-local adapter just to suppress partial `onChange` emissions from the shared picker.         |
| Use `minDate` and `maxDate` for generic range boundaries.                                | Push domain validation, eligibility logic, or routing sync into `@repo/ui`.                              |
| Compose visible labels through shared `Form` primitives or button `aria-*` props.        | Widen the shared API with app-local `label`, `onSave`, or `onApply` props just to match one app wrapper. |
| Use `clearable` when parent surfaces need an explicit reset action.                      | Rely on hidden workflow buttons or local wrapper state to clear the shared value.                        |
| Keep authored shared JSX and stories on `Box`, including buttons, spans, and paragraphs. | Hand-write native DOM tags in shared authored JSX.                                                       |
| Keep quarter and month-only behavior on dedicated components.                            | Collapse every date-selection mode back into one overloaded picker.                                      |

---

## Storybook Stories Required

**Story file title:** `'Inputs/DateRangePicker'`

- [x] `Basic`
- [x] `Variants`
- [x] `Sizes`
- [x] `Complete Only Change`
- [x] `With Presets`
- [x] `With Bounds`
- [x] `Clearable`
- [x] `Disabled State`
- [x] `Error State`
- [x] `With Time`
- [x] `With Time Bounds`
- [x] `Form Field`

Roadmap alignment:

- `DateRangePicker.Basic` -> `Basic`
- `DateRangePicker.Variants` -> `Variants`
- `DateRangePicker.Sizes` -> `Sizes`
- `DateRangePicker.CompleteOnlyChange` -> `Complete Only Change`
- `DateRangePicker.Presets` -> `With Presets`
- `DateRangePicker.Invalid` -> `Error State`
- `DateRangePicker.WithTime` -> `With Time`
- `DateRangePicker.WithTimeBounds` -> `With Time Bounds`

---

## Box-only DOM policy

- Authored shared JSX for this component and its stories must use `Box` for every DOM node.
- Semantic elements such as the trigger button, preset buttons, trigger text, and error message must render through `Box as="button"`, `Box as="span"`, and `Box as="p"`.
- `react-day-picker` still owns the internal calendar grid DOM and Radix Popover still owns portal internals; those are the documented third-party DOM boundaries for this component.

---

## Changelog

| Date       | Change                                                                                                                           |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 2026-03-13 | Initial DateRangePicker spec                                                                                                     |
| 2026-03-13 | Added hover/focus in-progress range preview guidance, refined clear affordance expectations, and documented reselection behavior |
| 2026-03-13 | Folded standalone date-time range usage into optional `withTime` support on `DateRangePicker`                                    |
| 2026-03-13 | Aligned public `variant` / `size` props and required Storybook `Variants` / `Sizes` coverage with the shared Input contract |
| 2026-03-17 | Updated trigger-shell and inline time-input focus guidance to the calmer Wave 1 recipe while keeping preset buttons deferred |
| 2026-03-17 | Moved preset buttons onto the shared compact-control focus recipe as part of Wave 2 |
| 2026-03-27 | Added `changeBehavior` so parents can opt into complete-only `onChange` emission while the picker still renders in-progress range selection internally |
