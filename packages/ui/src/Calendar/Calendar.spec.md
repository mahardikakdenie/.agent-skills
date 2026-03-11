# Calendar Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Data Display` |
| Component Tier | `Tier 2 (Composite)` |
| Structure Tier | `Standard` |
| Based on | `react-day-picker` |

---

## Overview

`Calendar` is the shared date-grid primitive for day-based selection and browsing in `@repo/ui`. It wraps `react-day-picker` with the normalized shared contract from `02-api-conventions.md`, token-driven styling, and the current Box-only authored JSX rule at the edges that we own. The component stays intentionally focused on calendar rendering, selection state, disabled-date handling, and month navigation. Field shells, popovers, inputs, validation wrappers, and submit behavior stay on `DatePicker`, `DateRangePicker`, `Form`, or app-local composition.

Cross-app baseline evidence converges on three recurring needs: single-date selection, disabled-date constraints, and month or year navigation. Range support is also required by the canonical API even though `DateRangePicker` remains the higher-level field wrapper. This shared component therefore exposes DayPicker's built-in `single`, `multiple`, and `range` modes, keeps `disabled` matchers first-class, and passes through the relevant navigation props without widening into form or popover concerns.

**When to use:**

- Render an inline calendar grid for date selection inside a card, drawer, dialog, or filter surface.
- Use it as the shared visual base for later `DatePicker`, `DateRangePicker`, and month- or year-navigation wrappers.
- Compose static single-date, multiple-date, or date-range selection with built-in disabled-date and month-navigation support.

**When NOT to use:**

- Do not use `Calendar` as a full input field with trigger, label, or validation copy; that belongs to `DatePicker` or app-local field shells.
- Do not put domain formatting, router state, query params, or service orchestration into the shared calendar primitive.
- Do not move complex preset logic, date-time selection, or business-specific date rules into this component.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Primitive | `react-day-picker` v8 | The roadmap explicitly requires `react-day-picker` for Calendar work and its built-in selection plus keyboard semantics match the shared need. |
| Date utility | `date-fns` | The roadmap explicitly requires `date-fns`; it is used for caption and weekday formatting so the shared wrapper does not rely on DayPicker defaults alone. |
| Public API shape | Discriminated union on `mode` with shared DayPicker-base pass-through | Keeps the canonical `mode`, `selected`, `onSelect`, and `disabled` contract strongly typed while still allowing shared navigation and localization props without inventing parallel APIs. |
| Controlled vs uncontrolled month navigation | both | Cross-app baselines include static default-month rendering and explicit month/year control. |
| Controlled vs uncontrolled selection | both | DayPicker already supports this and the baselines mix controlled and uncontrolled usage. |
| Portal | no | Calendar is inline display only; popover or dialog placement belongs to parent composition. |
| Composition review | flat component; no compound exports | `vercel-composition-patterns` review found no shared-context or compound-subcomponent need for the inline calendar grid itself. |
| Box-only DOM policy | explicit boundary | Our authored wrapper and stories use `Box`, but `react-day-picker` owns its internal DOM. That library-owned markup is the hard constraint for this component. |

---

## Props Interface

### Shared props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `mode` | `'single' \| 'multiple' \| 'range'` | `'single'` | No | Built-in DayPicker selection mode. |
| `disabled` | `Matcher \| Matcher[]` | `undefined` | No | Disabled-day matcher or matcher array passed to DayPicker. |
| `className` | `string` | `undefined` | No | Consumer override merged onto the shared outer wrapper through `cn()`. |
| `captionLayout` | `'buttons' \| 'dropdown' \| 'dropdown-buttons'` | `'buttons'` | No | Shared caption layout preference. Header-driven year/month selection remains built in across navigable layouts. |
| `showOutsideDays` | `boolean` | `true` | No | Keeps adjacent-month days visible for stable grid layout and outside-day styling. |
| `month` | `Date` | `undefined` | No | Controlled displayed month. |
| `defaultMonth` | `Date` | current month | No | Initial displayed month when uncontrolled. |
| `onMonthChange` | `(month: Date) => void` | `undefined` | No | Called when the displayed month changes. |
| `numberOfMonths` | `number` | `1` | No | Number of months to display side by side. |
| `fromMonth` / `toMonth` | `Date` | `undefined` | No | Navigation bounds by month. |
| `fromYear` / `toYear` | `number` | `undefined` | No | Navigation bounds by year, mainly for dropdown layouts. |
| `locale` | `Locale` | `undefined` | No | `date-fns` locale used by DayPicker and shared formatters. |
| `fixedWeeks` | `boolean` | `false` | No | Forces a six-row grid when outside days are shown. |
| `showWeekNumber` | `boolean` | `false` | No | Shows the week-number column when needed. |

### Mode-specific props

| Mode | `selected` | `onSelect` | Additional props |
| --- | --- | --- | --- |
| `single` | `Date \| undefined` | `SelectSingleEventHandler` | `required?: boolean` |
| `multiple` | `Date[] \| undefined` | `SelectMultipleEventHandler` | `min?: number`, `max?: number` |
| `range` | `DateRange \| undefined` | `SelectRangeEventHandler` | `min?: number`, `max?: number` |

### Complex Prop Shapes

```ts
import type {
  CaptionLayout,
  DateRange,
  DayPickerBase,
  DayPickerMultipleProps,
  DayPickerRangeProps,
  DayPickerSingleProps,
  Matcher,
} from 'react-day-picker';

type CalendarMode = 'single' | 'multiple' | 'range';

interface CalendarBaseProps
  extends Omit<DayPickerBase, 'className' | 'selected' | 'disabled'> {
  className?: string;
  disabled?: Matcher | Matcher[];
}

interface CalendarSingleProps extends CalendarBaseProps {
  mode?: 'single';
  selected?: Date;
  onSelect?: DayPickerSingleProps['onSelect'];
  required?: boolean;
}

interface CalendarMultipleProps extends CalendarBaseProps {
  mode: 'multiple';
  selected?: Date[];
  onSelect?: DayPickerMultipleProps['onSelect'];
  min?: number;
  max?: number;
}

interface CalendarRangeProps extends CalendarBaseProps {
  mode: 'range';
  selected?: DateRange;
  onSelect?: DayPickerRangeProps['onSelect'];
  min?: number;
  max?: number;
}
```

---

## Visual Contract

`Calendar` does not expose public visual `variant` or `size` props in this pass. The normalized shared contract is one inline calendar treatment with tokenized slot styling and three behavior modes.

| Shared mode | Description | When to use |
| --- | --- | --- |
| `single` | One selected day with today and disabled-day treatment | General date picking and inline single-date filters |
| `multiple` | Multiple independently selected days | Batch or multi-day selection surfaces |
| `range` | Start, middle, and end-of-range styling | Range preview and later `DateRangePicker` composition |

---

## States

| State | Visual Behavior | Accessibility |
| --- | --- | --- |
| Default | Inline month grid with tokenized caption, weekdays, and day buttons | DayPicker manages its grid, button, and selection semantics |
| Selected day | Primary-filled day treatment | Selected day remains keyboard reachable and announced by DayPicker |
| Disabled date | Muted and non-interactive date treatment | Disabled dates are not selectable |
| Outside day | Muted adjacent-month day treatment | Outside days remain visible when `showOutsideDays` is true |
| Today | Subtle ring/border emphasis on the current day | Keeps current-day orientation without overriding selection semantics |
| Range middle | Accent-toned span between start and end | Preserves continuous range readability |
| Month navigation | Shared button or header-driven month/year navigation chrome | Prev/next buttons stay available, and `dropdown` / `dropdown-buttons` use a caption trigger that opens year selection first and month selection second |

`Calendar` does not introduce shared loading, error, or form-validation UI in this pass.

---

## Accessibility

### Semantic requirements

| Surface | Requirement | Notes |
| --- | --- | --- |
| Root calendar | DayPicker-managed calendar/grid semantics | The shared wrapper must not strip or replace library-owned accessibility behavior. |
| Navigation buttons | DayPicker-managed labels with shared Lucide icons | Consumer label overrides remain possible through DayPicker `labels`. |
| Day buttons | DayPicker-managed button semantics | Selection, focus, and disabled announcements stay library-owned. |
| Range selection | DayPicker-managed selected range semantics | Shared styling must not break the active range modifier classes. |

### Keyboard map

DayPicker keyboard behavior is part of the shared contract and must remain intact:

| Key | Behavior |
| --- | --- |
| `Arrow Up` / `Arrow Down` | Move focus to the previous or next week |
| `Arrow Left` / `Arrow Right` | Move focus by one day |
| `Shift + Arrow Left` / `Shift + Arrow Right` | Move focus by one month |
| `Shift + Arrow Up` / `Shift + Arrow Down` | Move focus by one year |
| `Page Up` / `Page Down` | Move focus by one month |
| `Home` / `End` | Move focus to the start or end of the week |
| `Enter` / `Space` | Select the focused day |

### Focus management

- Focus remains DayPicker-managed inside the date grid.
- The shared wrapper must preserve visible focus rings on day buttons and navigation controls.
- Parent overlays or forms may manage overall focus entry and exit, but not day-grid keyboard behavior.

### Screen reader notes

- The DayPicker grid and day buttons retain their built-in ARIA behavior.
- Consumer `labels`, `locale`, and formatting overrides remain available through pass-through DayPicker props.
- Shared styling must not hide or replace the interactive button path for enabled days.

---

## Box-only DOM Policy

- All authored shared JSX in `Calendar.tsx` and `Calendar.stories.tsx` must use `Box` for any DOM node we author directly.
- `react-day-picker` owns its internal DOM structure (`table`, rows, cells, buttons, dropdowns). That library-owned markup is the hard third-party constraint for this component and is the only reason direct native DOM is not fully eliminated inside the rendered result.
- Shared wrapper and story layout markup must still remain Box-authored.
- Custom icons use Lucide components instead of hand-authored SVG.

---

## Usage Examples

### 1. Basic single-date calendar

```tsx
<Calendar
  mode="single"
  selected={selectedDate}
  onSelect={setSelectedDate}
/>
```

### 2. Disabled date constraints

```tsx
<Calendar
  mode="single"
  disabled={[
    { before: new Date(2026, 0, 1) },
    { dayOfWeek: [0, 6] },
  ]}
/>
```

### 3. Range calendar with two months

```tsx
<Calendar
  mode="range"
  numberOfMonths={2}
  selected={selectedRange}
  onSelect={setSelectedRange}
/>
```

### 4. Header-driven year and month navigation (default behavior)

```tsx
<Calendar
  mode="single"
  defaultMonth={new Date(2026, 0, 1)}
/>
```

---

## Do / Don't

| Do | Don't |
| --- | --- |
| Use `Calendar` for inline date-grid rendering and shared selection behavior. | Use it as a full input field with trigger, label, validation, and submit logic. |
| Keep date input, popover, and form-shell concerns on `DatePicker`, `DateRangePicker`, or app-local composition. | Add app-specific placeholder, title, or submit props to `Calendar`. |
| Use `disabled` matchers for weekends, bounds, and blocked dates. | Hardcode business-specific date logic into the shared component. |
| Use month bounds and `onMonthChange` for navigation control; `captionLayout` only adjusts the caption chrome. | Add parallel custom navigation props that duplicate DayPicker base behavior. |
| Keep authored shared JSX Box-only and accept the DayPicker internal DOM as the third-party boundary. | Hand-author new native DOM tags around or alongside the shared wrapper in implementation or stories. |
| Keep route/query synchronization and domain presets local. | Put routing, data fetching, or mutation logic inside the shared calendar primitive. |

---

## Storybook Stories Required

**Story file title:** `'Data Display/Calendar'`

- [x] `Default`
- [x] `MultipleSelection`
- [x] `DisabledDates`
- [x] `RangePreview`
- [x] `Interactive`
- [x] `ResponsiveLayout`

---

## Per-App Baseline Inputs Consulted

- `packages/ui/docs/normalization/per-app/admin-portal-boost_baseline-summary.md`
- `packages/ui/docs/normalization/per-app/agent-web-portal_baseline-summary.md`
- `packages/ui/docs/normalization/per-app/claim-portal_baseline-summary.md`
- `packages/ui/docs/normalization/per-app/partner-portal_baseline-summary.md`
- `packages/ui/docs/normalization/per-app/ticket-portal_baseline-summary.md`

Key recurring needs captured:

- Shared `selected`, `mode`, and `onSelect` behavior for inline date grids
- Disabled-date constraints and focused/selected-day visual parity
- Month and year navigation control without folding in date-input or popover concerns

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-11 | Initial Calendar spec |





