import { CalendarDays, X } from 'lucide-react';
import * as React from 'react';
import { isSameDay, startOfMonth } from 'date-fns';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import { Calendar } from '../Calendar';
import { Label } from '../Label';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import {
  datePickerActionButtonVariants,
  datePickerContentVariants,
  datePickerControlVariants,
  datePickerFieldVariants,
  datePickerIconVariants,
  datePickerMessageVariants,
  datePickerTriggerTextVariants,
  datePickerTriggerVariants,
} from './DatePicker.variants';
import type { DatePickerProps } from './DatePicker.types';
import {
  formatDatePickerValue,
  getDatePickerDisabledMatchers,
  getDatePickerInitialMonth,
} from './DatePicker.utils';

/**
 * Shared single-date picker built from the Calendar and Popover primitives.
 */
export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      variant = 'default',
      size = 'md',
      formatDate,
      value,
      onChange,
      mode = 'single',
      minDate,
      maxDate,
      disabled = false,
      clearable = false,
      required = false,
      label,
      placeholder = 'Pick a date',
      error = false,
      open,
      onClose,
      className,
      id,
      type,
      name,
      onBlur,
      onFocus,
      tabIndex,
      'aria-describedby': ariaDescribedBy,
      'aria-labelledby': ariaLabelledBy,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const triggerId = id ?? `date-picker-${generatedId}`;
    const labelId = label ? `${triggerId}-label` : undefined;
    const errorId = typeof error === 'string' ? `${triggerId}-error` : undefined;
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState<Date | null>(null);
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
    const [visibleMonth, setVisibleMonth] = React.useState(() =>
      getDatePickerInitialMonth(value ?? uncontrolledValue, minDate, maxDate),
    );
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const selectedDate = isControlled ? value ?? null : uncontrolledValue;
    const resolvedOpen = open ?? uncontrolledOpen;
    const hasError = Boolean(error);
    const hasValue = Boolean(selectedDate);
    const disabledMatchers = getDatePickerDisabledMatchers(minDate, maxDate);
    const fromMonth = minDate ? startOfMonth(minDate) : undefined;
    const toMonth = maxDate ? startOfMonth(maxDate) : undefined;
    const describedBy =
      [ariaDescribedBy, typeof error === 'string' ? errorId : undefined].filter(Boolean).join(' ') ||
      undefined;
    const labelledBy = [ariaLabelledBy, labelId].filter(Boolean).join(' ') || undefined;

    React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);

    React.useEffect(() => {
      setVisibleMonth(getDatePickerInitialMonth(selectedDate, minDate, maxDate));
    }, [maxDate, minDate, selectedDate]);

    const commitValue = (nextValue: Date | null) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }

      onChange?.(nextValue);
    };

    const handleOpen = () => {
      if (open === undefined) {
        setUncontrolledOpen(true);
      }
    };

    const handleClose = () => {
      if (open === undefined) {
        setUncontrolledOpen(false);
      }

      onClose?.();
    };

    const handleSelect = (nextValue: Date | undefined) => {
      if (!nextValue) {
        if (!required) {
          commitValue(null);
          handleClose();
        }

        return;
      }

      if (selectedDate && isSameDay(selectedDate, nextValue)) {
        if (!required) {
          commitValue(null);
        }

        handleClose();
        return;
      }

      commitValue(nextValue);
      setVisibleMonth(startOfMonth(nextValue));
      handleClose();
    };

    const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      commitValue(null);
      triggerRef.current?.focus();
    };

    return (
      <Box data-slot="date-picker-field" className={cn(datePickerFieldVariants(), className)}>
        {label ? (
          <Label id={labelId} htmlFor={triggerId} required={required} disabled={disabled}>
            {label}
          </Label>
        ) : null}

        <Box
          data-slot="date-picker-control"
          className={datePickerControlVariants({ variant, size, invalid: hasError, disabled })}
        >
          <Popover open={resolvedOpen} onOpen={handleOpen} onClose={handleClose}>
            <PopoverTrigger asChild>
              <Box
                as="button"
                ref={triggerRef}
                id={triggerId}
                type={type ?? 'button'}
                name={name}
                disabled={disabled}
                tabIndex={tabIndex}
                aria-label={ariaLabel}
                aria-labelledby={labelledBy}
                aria-describedby={describedBy}
                aria-invalid={hasError || undefined}
                aria-expanded={resolvedOpen}
                aria-haspopup="dialog"
                data-slot="date-picker-trigger"
                className={datePickerTriggerVariants({ size, hasValue, disabled })}
                onBlur={onBlur}
                onFocus={onFocus}
                {...props}
              >
                <CalendarDays aria-hidden="true" className={datePickerIconVariants({ size })} />
                <Box as="span" className={datePickerTriggerTextVariants()}>
                  {formatDatePickerValue(selectedDate, formatDate) ?? placeholder}
                </Box>
              </Box>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              side="bottom"
              sideOffset={6}
              className={datePickerContentVariants()}
            >
              <Calendar
                mode={mode}
                month={visibleMonth}
                onMonthChange={setVisibleMonth}
                selected={selectedDate ?? undefined}
                onSelect={handleSelect}
                disabled={disabledMatchers}
                fromMonth={fromMonth}
                toMonth={toMonth}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {clearable && hasValue && !disabled ? (
            <Box
              as="button"
              type="button"
              aria-label="Clear date"
              data-slot="date-picker-clear"
              className={datePickerActionButtonVariants({ size })}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={handleClear}
            >
              <X aria-hidden="true" className={datePickerIconVariants({ size })} />
            </Box>
          ) : null}
        </Box>

        {typeof error === 'string' ? (
          <Box as="p" id={errorId} role="alert" className={datePickerMessageVariants()}>
            {error}
          </Box>
        ) : null}
      </Box>
    );
  },
);

DatePicker.displayName = 'DatePicker';

