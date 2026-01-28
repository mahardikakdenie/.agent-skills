'use client';

import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { DayPicker, type DropdownProps } from 'react-day-picker';

import { Box } from '../Box';
import { buttonVariants } from '../Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Select';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

type CalendarOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

const parseDropdownOptions = (children: React.ReactNode): CalendarOption[] =>
  React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement(child)) return [];
    if (child.type !== 'option') return [];

    const { value, disabled, children: label } = child.props as {
      value?: string | number;
      disabled?: boolean;
      children?: React.ReactNode;
    };

    return [
      {
        value: String(value ?? ''),
        label,
        disabled,
      },
    ];
  });

const CalendarDropdown = ({
  className,
  value,
  onChange,
  children,
  name,
  'aria-label': ariaLabel,
}: DropdownProps) => {
  const options = React.useMemo(() => parseDropdownOptions(children), [children]);
  const selectedValue = value != null ? String(value) : undefined;
  const triggerSizeClassName =
    name === 'years' ? 'w-[5rem]' : name === 'months' ? 'w-[7rem]' : 'w-[6rem]';

  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      if (!onChange) return;
      onChange({ target: { value: nextValue } } as React.ChangeEvent<HTMLSelectElement>);
    },
    [onChange],
  );

  return (
    <Box className={clsx('flex items-center', className)}>
      <Select name={name} value={selectedValue} onValueChange={handleValueChange}>
        <SelectTrigger
          aria-label={ariaLabel}
          className={clsx(
            'h-8 px-2 text-sm font-medium',
            'min-w-0 overflow-hidden',
            triggerSizeClassName,
          )}
        >
          <SelectValue className="truncate" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Box>
  );
};

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
      className={clsx('p-1', className)}
      style={viewportStyle}
      classNames={{
        months: 'flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6',
        month: 'w-full max-w-[18rem] space-y-3',
        caption: clsx('grid w-full grid-cols-[auto_1fr_auto] items-center gap-2 pt-1'),
        caption_label: clsx(
          'col-start-2 text-sm font-semibold text-gray-900',
          isDropdownLayout && 'sr-only',
        ),
        caption_dropdowns:
          'col-start-2 row-start-1 flex flex-nowrap items-center justify-center gap-2',
        dropdown: 'sr-only',
        dropdown_month: 'flex items-center',
        dropdown_year: 'flex items-center',
        dropdown_icon: 'ml-1 h-4 w-4 text-gray-500',
        nav: 'contents',
        nav_button: clsx(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'h-8 w-8 p-0 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-[var(--color-primary)]',
        ),
        nav_button_previous: 'col-start-1 row-start-1 self-center justify-self-start',
        nav_button_next: 'col-start-3 row-start-1 self-center justify-self-end',
        table: 'mx-auto w-full border-collapse space-y-1',
        head_row: 'flex justify-center',
        head_cell:
          'w-9 rounded-md text-[0.7rem] font-semibold uppercase tracking-wide text-gray-500',
        row: 'mt-2 flex w-full justify-center',
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
        Dropdown: CalendarDropdown,
      }}
      {...props}
    />
  );
}

Calendar.displayName = 'Calendar';
