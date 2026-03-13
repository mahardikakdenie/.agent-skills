import { cva } from 'class-variance-authority';
import type { ClassNames } from 'react-day-picker';

import type { CalendarMode } from './Calendar.types';

export const calendarRootVariants = cva(
  'relative inline-block overflow-hidden rounded-lg border border-border bg-background p-2.5 shadow-sm [&_.rdp-button[disabled]]:cursor-not-allowed [&:has([data-slot=calendar-interactive-caption][data-view=years])_.rdp-table]:pointer-events-none [&:has([data-slot=calendar-interactive-caption][data-view=years])_.rdp-table]:opacity-0 [&:has([data-slot=calendar-interactive-caption][data-view=months])_.rdp-table]:pointer-events-none [&:has([data-slot=calendar-interactive-caption][data-view=months])_.rdp-table]:opacity-0',
);

export const calendarMonthsVariants = cva('flex flex-col gap-3 sm:flex-row');

export const calendarMonthVariants = cva('space-y-3');

export const calendarCaptionVariants = cva(
  'relative flex min-h-8 items-center justify-center border-b border-border pb-2 pt-0.5',
);

export const calendarCaptionLabelVariants = cva('text-sm font-medium text-foreground');

export const calendarDropdownsVariants = cva('flex items-center justify-center gap-2 px-10');

export const calendarDropdownVariants = cva(
  [
    'absolute inset-0 z-10 cursor-pointer opacity-0',
    'focus-visible:outline-none disabled:cursor-not-allowed',
  ].join(' '),
);

export const calendarDropdownMonthVariants = cva('group relative inline-flex min-w-[8rem] items-center');

export const calendarDropdownYearVariants = cva('group relative inline-flex min-w-[6.5rem] items-center');

export const calendarDropdownIconVariants = cva('h-4 w-4 shrink-0 text-muted-foreground');

export const calendarNavVariants = cva('flex items-center gap-1');

export const calendarNavButtonVariants = cva(
  [
    'inline-flex h-7 w-7 cursor-pointer touch-manipulation items-center justify-center rounded-md',
    'bg-transparent text-muted-foreground shadow-none transition-colors motion-reduce:transition-none',
    'hover:bg-accent hover:text-accent-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground',
  ].join(' '),
);

export const calendarNavButtonPreviousVariants = cva('absolute left-0');

export const calendarNavButtonNextVariants = cva('absolute right-0');

export const calendarInteractiveCaptionTriggerVariants = cva(
  [
    'inline-flex h-7 max-w-[calc(100%-4.5rem)] items-center justify-center rounded-md px-2.5',
    'cursor-pointer text-sm font-semibold text-foreground transition-colors motion-reduce:transition-none',
    'hover:bg-accent hover:text-accent-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'focus-visible:ring-offset-background',
  ].join(' '),
);

export const calendarPickerPanelVariants = cva(
  [
    'absolute inset-x-0 top-[calc(100%+0.25rem)] z-20 overflow-hidden rounded-md border border-border bg-background px-1 py-3 shadow-md',
    'supports-[backdrop-filter]:bg-background/95',
  ].join(' '),
);

export const calendarPickerGridVariants = cva('grid h-full content-start grid-cols-3 gap-x-2 gap-y-2 px-0.5 pb-0.5');

export const calendarPickerYearsVariants = cva(
  'grid h-full content-start grid-cols-3 gap-x-2 gap-y-2 overflow-y-auto px-0.5 pb-0.5 pr-1.5',
);

export const calendarPickerOptionVariants = cva(
  [
    'inline-flex h-9 items-center justify-center rounded-md px-2 text-sm font-medium',
    'transition-colors motion-reduce:transition-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'focus-visible:ring-offset-background',
  ].join(' '),
  {
    variants: {
      selected: {
        true: 'bg-accent text-accent-foreground',
        false: 'text-foreground',
      },
      disabled: {
        true: 'cursor-not-allowed text-muted-foreground opacity-40 hover:bg-transparent hover:text-muted-foreground',
        false: 'cursor-pointer hover:bg-accent hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      selected: false,
      disabled: false,
    },
  },
);

export const calendarTableVariants = cva('w-full border-collapse transition-opacity motion-reduce:transition-none');

export const calendarHeadRowVariants = cva('flex gap-0.5');

export const calendarHeadCellVariants = cva(
  'w-8 rounded-md text-[0.75rem] font-medium text-muted-foreground',
);

export const calendarRowVariants = cva('mt-0.5 flex w-full gap-0.5');

export const calendarCellVariants = cva('relative h-8 w-8 p-0 text-center text-sm');

export const calendarDayVariants = cva(
  [
    'h-8 w-8 cursor-pointer touch-manipulation rounded-md p-0 text-sm font-normal text-foreground',
    'transition-colors motion-reduce:transition-none',
    'hover:bg-accent hover:text-accent-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'focus-visible:ring-offset-background',
  ].join(' '),
);

export const calendarDaySelectedVariants = cva(
  'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
);

export const calendarDayTodayVariants = cva('border border-border');

export const calendarDayOutsideVariants = cva('text-muted-foreground opacity-50');

export const calendarDayDisabledVariants = cva(
  'cursor-not-allowed text-muted-foreground opacity-40 hover:bg-transparent hover:text-muted-foreground',
);

export const calendarDayRangeStartVariants = cva(
  'rounded-l-md rounded-r-none bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
);

export const calendarDayRangeEndVariants = cva(
  'rounded-r-md rounded-l-none bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
);

export const calendarDayRangeMiddleVariants = cva(
  'rounded-none bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground',
);

export const calendarWeekNumberVariants = cva(
  'text-xs font-medium text-muted-foreground tabular-nums',
);

export const calendarIconVariants = cva('h-4 w-4');

export function createCalendarClassNames(mode: CalendarMode): ClassNames {
  return {
    months: calendarMonthsVariants(),
    month: calendarMonthVariants(),
    caption: calendarCaptionVariants(),
    caption_label: calendarCaptionLabelVariants(),
    caption_dropdowns: calendarDropdownsVariants(),
    dropdown: calendarDropdownVariants(),
    dropdown_month: calendarDropdownMonthVariants(),
    dropdown_year: calendarDropdownYearVariants(),
    dropdown_icon: calendarDropdownIconVariants(),
    nav: calendarNavVariants(),
    nav_button: calendarNavButtonVariants(),
    nav_button_previous: calendarNavButtonPreviousVariants(),
    nav_button_next: calendarNavButtonNextVariants(),
    table: calendarTableVariants(),
    head_row: calendarHeadRowVariants(),
    head_cell: calendarHeadCellVariants(),
    row: calendarRowVariants(),
    cell: calendarCellVariants(),
    day: calendarDayVariants(),
    day_selected: calendarDaySelectedVariants(),
    day_today: calendarDayTodayVariants(),
    day_outside: calendarDayOutsideVariants(),
    day_disabled: calendarDayDisabledVariants(),
    day_range_start:
      mode === 'range' ? calendarDayRangeStartVariants() : calendarDaySelectedVariants(),
    day_range_end:
      mode === 'range' ? calendarDayRangeEndVariants() : calendarDaySelectedVariants(),
    day_range_middle: mode === 'range' ? calendarDayRangeMiddleVariants() : undefined,
    weeknumber: calendarWeekNumberVariants(),
  };
}



