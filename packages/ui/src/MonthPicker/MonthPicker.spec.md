# MonthPicker Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Inputs` |
| Component Tier | `Tier 2 (Composite)` |
| Structure Tier | `Complex` |
| Based on | `Calendar` month-selection patterns + `Popover` |

---

## Overview

`MonthPicker` is the shared month-only field shell for flows that select a reporting month, billing cycle, or coverage month without exposing day-level selection. It keeps the authored trigger and popover layout on `Box`, uses shared `Popover` dismissal behavior, and reuses the existing calendar month-grid visual language so the month-only contract stays aligned with `Calendar` and `DatePicker` instead of becoming a second unrelated date control.

The public value stays `Date | null`, but the component normalizes every emitted month to the first day of that month. That keeps the API simple while preventing hidden day-level state drift across apps.

The header year is clickable and opens a scrollable year list inside the same popover. That removes the need to repeatedly hit previous or next for distant years while keeping the public API unchanged. The popover also follows the same compact header and year-list spacing baseline as the rest of the shared date family.

**When to use:**

- Use `MonthPicker` when the product only needs a month and year, not an exact day.
- Use it for generic reporting periods, billing months, and month-based filters where the parent owns the selected value.
- Use `minMonth` and `maxMonth` to constrain available months and year navigation.

**When NOT to use:**

- Use `DatePicker` when the user must pick a specific day.
- Keep quarter pickers, date-range flows, date-time flows, and domain-specific preset workflows on separate components or app-local composition.
- Do not widen this component with app-specific format props, async save/apply behavior, or business validation rules.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Root composition | Shared `Popover` + calendar-aligned month grid + inline year list | Reuses shipped floating-surface behavior and removes repeated year stepping for distant dates. |
| Value normalization | Always emit `startOfMonth(value)` | Prevents ambiguous day-level values inside a month-only contract. |
| Controlled vs uncontrolled value | both | Parent surfaces may own the month, but the component still works when `value` is omitted. |
| Controlled vs uncontrolled open state | internal only | The roadmap contract does not require public open-state control, so the API stays narrow. |
| Year jump behavior | clickable header year button | Keeps the API flat and faster without introducing a second visible field or extra props. |
| Variant strategy | flat public API | `$vercel-composition-patterns` review does not justify public compound exports or additional boolean modes here. |
| Clear behavior | explicit `clearable` action | Avoids overloading month re-selection as an implicit toggle-off rule. |
| Accessibility model | button trigger + year button + year-list panel + month-button grid + inline error | Matches the surrounding shared field family while staying semantically month-focused. |
| Box-only DOM rule | explicit | Trigger, content layout, year navigation, year list, month buttons, and error message all render through `Box`. |

---

## Props Interface

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `Date \| null` | internal state | No | Controlled selected month. Any provided date is normalized to the first day of its month for display and selection behavior. |
| `onChange` | `(value: Date \| null) => void` | `undefined` | No | Called after month selection or clear. Selected values are normalized to the first day of the month. |
| `variant` | `'outline' \| 'shadow' \| 'ghost' \| 'default'` | `'outline'` | No | Applies the shared Input-aligned trigger shell variant. Legacy `default` remains a compatibility alias for `shadow`. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | No | Applies the shared Input-aligned trigger height and spacing scale. |
| `minMonth` | `Date` | `undefined` | No | Disables months before this bound and limits previous-year navigation. |
| `maxMonth` | `Date` | `undefined` | No | Disables months after this bound and limits next-year navigation. |
| `disabled` | `boolean` | `false` | No | Disables trigger interaction and clear affordance. |
| `clearable` | `boolean` | `false` | No | Renders a clear action when a month is selected. |
| `error` | `string \| boolean` | `false` | No | Invalid state or inline validation message. |
| `className` | `string` | `undefined` | No | Applied to the outer wrapper through `cn()`. |
| `id` | `string` | generated | No | Applied to the trigger button. |
| `...buttonProps` | `ButtonHTMLAttributes<HTMLButtonElement>` | - | No | Forwards button semantics such as `name`, `tabIndex`, `onBlur`, `onFocus`, and `aria-*` attributes to the trigger. |

---

## Visual Contract

`MonthPicker` exposes the same public `variant` and `size` trigger contract as the shared Input family while keeping one compact month-grid popover pattern with shared invalid, disabled, clear, and fast-year-jump behavior.

| Surface | Description | Notes |
| --- | --- | --- |
| Trigger shell | Input-aligned bordered field button | Shows selected month or the default placeholder copy `Select month...` |
| Popover panel | Shared elevated month-selection panel with the compact date-family header baseline | Uses year navigation, clickable year jump, and a 12-month grid without adding a second decorative wrapper around the in-panel year list |
| Year list | Scrollable in-panel year chooser | Opens when the header year is activated and returns to month view after selection |
| Month option | One button per month | Selected month uses accent emphasis; unavailable months are disabled |

---

## States

| State | Visual Behavior | Accessibility |
| --- | --- | --- |
| Default | Trigger shows `Select month...` with the shared field shell | Visible placeholder text becomes the trigger's accessible name when no external label is provided |
| Selected | Trigger shows the selected month and year | Selected month button uses `aria-pressed="true"` |
| Open | Popover displays year controls and the 12-month grid | Trigger exposes `aria-expanded="true"` and `aria-haspopup="dialog"` |
| Year list open | Header switches to a scrollable year-picker view inside the same popover | Year trigger exposes `aria-controls` and `aria-expanded` for the list panel |
| Hover | Trigger, year controls, year trigger, clear action, and month buttons show stronger contrast | No hover-only information |
| Focus | Trigger shell and clear action use the calmer field-entry recipe, while the year trigger, year options, nav controls, and month buttons use the shared dense-surface recipe | Keyboard users keep a visible focus path through the control while entry and dense in-panel surfaces stay visually separated |
| Disabled | Trigger and clear action dim and stop responding to input | Trigger uses native `disabled` state |
| Error | Border, calmer invalid halo, and message switch to destructive styling | Trigger receives `aria-invalid`; message uses `role="alert"` |
| Bounded | Out-of-range months are disabled and blocked year navigation buttons dim | Disabled month buttons stay non-interactive |

---

## Accessibility

### ARIA Roles & Attributes

| Element | Role / Attribute | Value |
| --- | --- | --- |
| Trigger | native button | `type="button"` unless overridden |
| Trigger | `aria-expanded` | `true` when the popover is open |
| Trigger | `aria-haspopup` | `"dialog"` |
| Trigger | `aria-invalid` | `true` when `error` is truthy |
| Trigger | `aria-describedby` | Includes shared error id and any caller-provided ids |
| Year trigger | native button | Toggles the in-panel year list |
| Year trigger | `aria-controls` | Points to the year-list panel id |
| Year trigger | `aria-expanded` | `true` while the year list is open |
| Year option | native button | Uses `aria-pressed` for the active display year |
| Month option | native button | Uses `aria-pressed` for selected-month state |
| Clear action | `aria-label` | `"Clear month"` |
| Error copy | `role` | `alert` |

### Keyboard Map

| Key | Behavior |
| --- | --- |
| `Enter` / `Space` | Opens the trigger and activates month or year controls, including the year jump button |
| `Tab` / `Shift+Tab` | Moves through trigger, year controls, year list, month buttons, and clear action |
| `Escape` | Closes the popover through shared popover dismissal behavior |

### Focus Management

- Focus starts on the trigger button.
- When the popover opens, keyboard users tab into the year controls and month grid.
- Activating the year label opens a scrollable year list inside the same popover for faster jumps.
- After clearing, focus returns to the trigger.
- After selecting a month, the popover closes and focus returns to the trigger.

### Screen Reader Notes

- Standalone usage can rely on the visible trigger text or pass `aria-label` / `aria-labelledby` through button props.
- Form-composed usage should provide a visible label through shared `FormLabel` and `FormControl`.
- The selected month is announced through the trigger text and selected month button state.
- The selected display year is announced through the header year button and active year option state.
- Inline errors are announced through the shared `role="alert"` message.

---

## Usage Examples

### 1. Basic usage

```tsx
<MonthPicker value={billingMonth} onChange={setBillingMonth} clearable />
```

### 2. With min/max bounds

```tsx
<MonthPicker
  value={reportMonth}
  onChange={setReportMonth}
  minMonth={new Date(2018, 9, 12)}
  maxMonth={new Date(2028, 2, 28)}
/>
```

### 3. Error state

```tsx
<MonthPicker
  value={billingMonth}
  onChange={setBillingMonth}
  error="Select a billing month before continuing."
/>
```

### 4. Shared form composition

```tsx
<FormField
  name="billingMonth"
  render={({ field }) => (
    <FormItem>
      <FormLabel required>Billing Month</FormLabel>
      <FormControl>
        <MonthPicker value={field.value} onChange={field.onChange} clearable />
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
| Use `minMonth` and `maxMonth` for generic reporting or eligibility windows. | Add app-specific preset or workflow props such as `onApply`, `quarter`, or `monthMode`. |
| Treat the emitted value as the first day of the selected month. | Depend on a hidden day-of-month in the selected value. |
| Use the header year trigger for distant-year jumps instead of repeatedly clicking prev/next. | Replace the header with an app-local dropdown wrapper just to reach another year faster. |
| Compose external labels through shared `Form` primitives or button `aria-*` props. | Reintroduce app-local wrappers only to show validation copy. |
| Keep quarter, range, and date-time selection on dedicated components or app-local shells. | Turn `MonthPicker` into a second generic date picker with day-level APIs. |
| Keep authored shared JSX and stories on `Box`, including buttons, spans, and paragraphs. | Hand-write native DOM tags in shared authored JSX. |

---

## Storybook Stories Required

**Story file title:** `'Inputs/MonthPicker'`

- [x] `Basic`
- [x] `Variants`
- [x] `Sizes`
- [x] `Min/Max`
- [x] `Clearable`
- [x] `Disabled State`
- [x] `Error State`
- [x] `Form Field`

Roadmap alignment:
- `MonthPicker.Basic` -> `Basic`
- `MonthPicker.Variants` -> `Variants`
- `MonthPicker.Sizes` -> `Sizes`
- `MonthPicker.MinMax` -> `Min/Max`

---

## Box-only DOM policy

- Authored shared JSX for this component and its stories must use `Box` for every DOM node.
- Semantic elements such as the trigger button, year navigation buttons, clickable year label, year-option buttons, month-option buttons, trigger text, and error message must render through `Box as="button"`, `Box as="span"`, and `Box as="p"`.
- `Popover` portal internals remain the only third-party DOM boundary involved in the rendered result.

---

## Per-App Baseline Inputs Consulted

- `packages/ui/docs/normalization/per-app/partner-portal_baseline-summary.md`
- `packages/ui/docs/normalization/per-app/ticket-portal_baseline-summary.md`

Key recurring needs captured:

- Explicit month-only selection demand through the queued `MonthPicker` baseline in `partner-portal`
- Shared month control and year/month navigation evidence from ticket-portal date-picker baselines

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-13 | Initial MonthPicker spec |
| 2026-03-13 | Added clickable year jump list inside the popover header |
| 2026-03-13 | Aligned public `variant` / `size` props and required Storybook `Variants` / `Sizes` coverage with the shared Input contract |
| 2026-03-17 | Updated trigger-shell focus guidance to the calmer Wave 1 recipe while leaving in-panel controls deferred |
| 2026-03-17 | Moved in-panel year trigger and dense picker controls onto the shared dense-surface focus recipe as part of Wave 3 |
