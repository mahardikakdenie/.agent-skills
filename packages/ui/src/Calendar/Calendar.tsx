'use client';

import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';

import { buttonVariants } from '../Button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  style,
  ...props
}: CalendarProps) {
  const captionLayout = props.captionLayout ?? 'dropdown-buttons';
  const isDropdownLayout = captionLayout === 'dropdown' || captionLayout === 'dropdown-buttons';
  const currentYear = new Date().getFullYear();
  const shouldSetYearRange =
    props.fromYear == null &&
    props.toYear == null &&
    props.fromMonth == null &&
    props.toMonth == null &&
    props.fromDate == null &&
    props.toDate == null;

  const viewportStyle: React.CSSProperties = {
    maxHeight:
      'var(--radix-popover-content-available-height, var(--radix-popper-available-height))',
    maxWidth: 'var(--radix-popover-content-available-width, var(--radix-popper-available-width))',
    overflow: 'auto',
    ...style,
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      fromYear={shouldSetYearRange ? currentYear - 50 : undefined}
      toYear={shouldSetYearRange ? currentYear + 50 : undefined}
      className={clsx('p-3', className)}
      style={viewportStyle}
      classNames={{
        months: 'flex flex-col gap-4 sm:flex-row sm:gap-6',
        month: 'space-y-4',
        caption: isDropdownLayout
          ? 'flex flex-wrap items-center justify-between gap-2 pt-1'
          : 'relative flex items-center justify-center pt-1',
        caption_label: clsx('text-sm font-semibold text-gray-900', isDropdownLayout && 'sr-only'),
        caption_dropdowns: 'flex flex-wrap items-center gap-2',
        dropdown:
          'h-9 rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2',
        dropdown_month: 'flex items-center',
        dropdown_year: 'flex items-center',
        dropdown_icon: 'ml-1 h-4 w-4 text-gray-500',
        nav: isDropdownLayout ? 'flex items-center gap-1' : 'flex items-center space-x-1',
        nav_button: clsx(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-[var(--color-primary)]',
        ),
        nav_button_previous: isDropdownLayout ? 'relative' : 'absolute left-1',
        nav_button_next: isDropdownLayout ? 'relative' : 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'w-9 rounded-md text-[0.7rem] font-semibold uppercase tracking-wide text-gray-500',
        row: 'mt-2 flex w-full',
        cell: 'relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected].day-outside)]:bg-[var(--color-primary-10)] [&:has([aria-selected].day-range-middle)]:bg-[var(--color-primary-10)] [&:has([aria-selected].day-range-start)]:bg-[var(--color-primary-20)] [&:has([aria-selected].day-range-end)]:bg-[var(--color-primary-20)] [&:has([aria-selected].day-range-start)]:rounded-l-md [&:has([aria-selected].day-range-end)]:rounded-r-md',
        day: clsx(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'h-9 w-9 p-0 font-normal text-gray-900 hover:bg-gray-100 hover:text-gray-900 aria-selected:opacity-100',
        ),
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected:
          'rounded-md bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-60)] hover:text-white focus:bg-[var(--color-primary-60)] focus:text-white',
        day_today:
          'rounded-md bg-[var(--color-primary-10)] font-semibold text-[var(--color-primary-80)]',
        day_outside:
          'day-outside text-gray-400 opacity-50 aria-selected:bg-[var(--color-primary-10)] aria-selected:text-gray-500 aria-selected:opacity-30',
        day_disabled: 'text-gray-400 opacity-40 cursor-not-allowed',
        day_range_middle:
          'day-range-middle aria-selected:bg-[var(--color-primary-10)] aria-selected:text-[var(--color-primary-80)]',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}

Calendar.displayName = 'Calendar';
