'use client';

import * as React from 'react';
import { format, type Locale } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import { CalendarInteractiveCaption } from './CalendarInteractiveCaption';
import {
  calendarIconVariants,
  calendarRootVariants,
  createCalendarClassNames,
} from './Calendar.variants';
import type {
  CalendarMultipleProps,
  CalendarProps,
  CalendarRangeProps,
  CalendarSingleProps,
} from './Calendar.types';

/**
 * Shared inline calendar primitive backed by react-day-picker.
 *
 * The authored wrapper stays Box-only while DayPicker owns the internal grid,
 * dropdown, and day-button DOM that the library must render itself.
 */
export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>((calendarProps, ref) => {
  const {
    className,
    mode = 'single',
    showOutsideDays = true,
    captionLayout = 'buttons',
    classNames,
    components,
    formatters,
    ...props
  } = calendarProps;

  const sharedProps = {
    showOutsideDays,
    captionLayout,
    classNames: {
      ...createCalendarClassNames(mode),
      ...classNames,
    },
    components: {
      IconLeft: () => <ChevronLeft aria-hidden="true" className={calendarIconVariants()} />,
      IconRight: () => <ChevronRight aria-hidden="true" className={calendarIconVariants()} />,
      Caption: CalendarInteractiveCaption,
      ...components,
    },
    formatters: {
      formatCaption: (date: Date, options?: { locale?: Locale }) =>
        format(date, 'MMMM yyyy', { locale: options?.locale }),
      formatWeekdayName: (date: Date, options?: { locale?: Locale }) =>
        format(date, 'EEEEE', { locale: options?.locale }),
      ...formatters,
    },
  };

  return (
    <Box
      ref={ref}
      data-slot="calendar"
      data-mode={mode}
      className={cn(calendarRootVariants(), className)}
    >
      {mode === 'multiple' ? (
        <DayPicker
          mode="multiple"
          {...sharedProps}
          {...(props as Omit<CalendarMultipleProps, 'className' | 'captionLayout' | 'mode'>)}
        />
      ) : mode === 'range' ? (
        <DayPicker
          mode="range"
          {...sharedProps}
          {...(props as Omit<CalendarRangeProps, 'className' | 'captionLayout' | 'mode'>)}
        />
      ) : (
        <DayPicker
          mode="single"
          {...sharedProps}
          {...(props as Omit<CalendarSingleProps, 'className' | 'captionLayout' | 'mode'>)}
        />
      )}
    </Box>
  );
});

Calendar.displayName = 'Calendar';
