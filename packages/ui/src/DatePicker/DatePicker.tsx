'use client';

import { CalendarDays, X } from 'lucide-react';
import * as React from 'react';
import { isSameDay, startOfMonth } from 'date-fns';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import { Calendar } from '../Calendar';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../Drawer';
import { Label } from '../Label';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '../Popover';
import {
  datePickerActionButtonVariants,
  datePickerContentVariants,
  datePickerControlVariants,
  datePickerFieldVariants,
  datePickerHintVariants,
  datePickerIconVariants,
  datePickerMessageVariants,
  datePickerPanelVariants,
  datePickerTimeInputVariants,
  datePickerTimeLabelVariants,
  datePickerTimeSectionVariants,
  datePickerTriggerTextVariants,
  datePickerTriggerVariants,
} from './DatePicker.variants';
import type { DatePickerProps } from './DatePicker.types';
import {
  applyTimeValueToDate,
  clampDatePickerValue,
  defaultDatePickerTimeValue,
  formatDatePickerValue,
  formatDatePickerTimeValue,
  getDatePickerDisabledMatchers,
  getDatePickerInitialMonth,
  getDatePickerTimeBounds,
  normalizeDatePickerValue,
} from './DatePicker.utils';

/**
 * Shared single-date picker built from the Calendar and Popover primitives.
 */
export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      variant = 'outline',
      size = 'md',
      formatDate,
      value,
      onChange,
      mode = 'single',
      minDate,
      maxDate,
      withTime = false,
      minDateTime,
      maxDateTime,
      timezone,
      disabled = false,
      clearable = false,
      required = false,
      presentation = 'popover',
      icon,
      iconPosition = 'start',
      drawerTitle,
      label,
      placeholder,
      error = false,
      open,
      onClose,
      className,
      classNames,
      id,
      type,
      name,
      onClick,
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
    const timeInputId = `${triggerId}-time`;
    const timeInputLabelId = `${timeInputId}-label`;
    const hintId = `${triggerId}-hint`;
    const errorId = typeof error === 'string' ? `${triggerId}-error` : undefined;
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState<Date | null>(null);
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
    const [draftTime, setDraftTime] = React.useState(defaultDatePickerTimeValue);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const resolvedMinDate = minDateTime ?? minDate;
    const resolvedMaxDate = maxDateTime ?? maxDate;
    const selectedDate = React.useMemo(
      () => normalizeDatePickerValue(isControlled ? value ?? null : uncontrolledValue, withTime),
      [isControlled, uncontrolledValue, value, withTime],
    );
    const [visibleMonth, setVisibleMonth] = React.useState(() =>
      getDatePickerInitialMonth(selectedDate, resolvedMinDate, resolvedMaxDate),
    );
    const resolvedOpen = open ?? uncontrolledOpen;
    const hasError = Boolean(error);
    const hasValue = Boolean(selectedDate);
    const disabledMatchers = getDatePickerDisabledMatchers(resolvedMinDate, resolvedMaxDate);
    const fromMonth = resolvedMinDate ? startOfMonth(resolvedMinDate) : undefined;
    const toMonth = resolvedMaxDate ? startOfMonth(resolvedMaxDate) : undefined;
    const hintText = withTime && timezone ? `Timezone: ${timezone} (display only).` : null;
    const resolvedPlaceholder = placeholder ?? (withTime ? 'Pick a date and time' : 'Pick a date');
    const describedBy =
      [ariaDescribedBy, hintText ? hintId : undefined, typeof error === 'string' ? errorId : undefined]
        .filter(Boolean)
        .join(' ') || undefined;
    const labelledBy = [ariaLabelledBy, labelId].filter(Boolean).join(' ') || undefined;
    const timeBounds = getDatePickerTimeBounds(selectedDate, minDateTime, maxDateTime);

    React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);

    React.useEffect(() => {
      setVisibleMonth(getDatePickerInitialMonth(selectedDate, resolvedMinDate, resolvedMaxDate));
    }, [resolvedMaxDate, resolvedMinDate, selectedDate]);

    React.useEffect(() => {
      if (withTime && selectedDate) {
        setDraftTime(formatDatePickerTimeValue(selectedDate));
      }
    }, [selectedDate, withTime]);

    const commitValue = (nextValue: Date | null) => {
      const normalizedValue = normalizeDatePickerValue(nextValue, withTime);

      if (!isControlled) {
        setUncontrolledValue(normalizedValue);
      }

      onChange?.(normalizedValue);
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

          if (!withTime) {
            handleClose();
          }
        }

        return;
      }

      if (!withTime && selectedDate && isSameDay(selectedDate, nextValue)) {
        if (!required) {
          commitValue(null);
        }

        handleClose();
        return;
      }

      const nextCommittedValue = withTime
        ? clampDatePickerValue(applyTimeValueToDate(nextValue, draftTime), minDateTime, maxDateTime)
        : normalizeDatePickerValue(nextValue, false);

      commitValue(nextCommittedValue);
      setVisibleMonth(startOfMonth(nextCommittedValue as Date));

      if (!withTime) {
        handleClose();
      }
    };

    const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      commitValue(null);
      triggerRef.current?.focus();
    };

    const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      const nextTimeValue = event.target.value;
      setDraftTime(nextTimeValue);

      if (!selectedDate) {
        return;
      }

      const nextDateTime = clampDatePickerValue(
        applyTimeValueToDate(selectedDate, nextTimeValue),
        minDateTime,
        maxDateTime,
      );

      commitValue(nextDateTime);
      setDraftTime(formatDatePickerTimeValue(nextDateTime));
    };

    const handleDrawerTriggerClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
      onClick?.(event);

      if (!event.defaultPrevented) {
        handleOpen();
      }
    };

    const triggerIcon = (
      <Box
        as="span"
        aria-hidden="true"
        data-slot="date-picker-trigger-icon"
        className={cn(datePickerIconVariants({ size }), classNames?.triggerIcon)}
      >
        {icon ?? <CalendarDays aria-hidden="true" className="h-full w-full" />}
      </Box>
    );

    const triggerText = (
      <Box
        as="span"
        data-slot="date-picker-trigger-text"
        className={cn(datePickerTriggerTextVariants(), classNames?.triggerText)}
      >
        {formatDatePickerValue(selectedDate, formatDate, { withTime }) ?? resolvedPlaceholder}
      </Box>
    );

    const renderTrigger = (handleClick?: React.MouseEventHandler<HTMLButtonElement>) => (
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
        className={cn(
          datePickerTriggerVariants({ size, hasValue, disabled }),
          iconPosition === 'end' && 'justify-between',
          classNames?.trigger,
        )}
        {...props}
        onBlur={onBlur}
        onClick={handleClick ?? onClick}
        onFocus={onFocus}
      >
        {iconPosition === 'start' ? triggerIcon : null}
        {triggerText}
        {iconPosition === 'end' ? triggerIcon : null}
      </Box>
    );

    const control = (
      <Box
        data-slot="date-picker-control"
        className={cn(
          datePickerControlVariants({
            variant,
            size,
            invalid: hasError,
            open: resolvedOpen,
            disabled,
          }),
          classNames?.control,
        )}
      >
        {presentation === 'popover' ? (
          <PopoverTrigger asChild>{renderTrigger()}</PopoverTrigger>
        ) : (
          renderTrigger(handleDrawerTriggerClick)
        )}

        {clearable && hasValue && !disabled ? (
          <Box
            as="button"
            type="button"
            aria-label={withTime ? 'Clear date and time' : 'Clear date'}
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
    );

    const calendar = (
      <Calendar
        mode={mode}
        month={visibleMonth}
        onMonthChange={setVisibleMonth}
        selected={selectedDate ?? undefined}
        onSelect={handleSelect}
        disabled={disabledMatchers}
        fromMonth={fromMonth}
        toMonth={toMonth}
        className={classNames?.calendar}
        initialFocus
      />
    );

    const calendarContent = withTime ? (
      <Box
        data-slot="date-picker-panel"
        className={cn(
          datePickerPanelVariants(),
          'grid-cols-[auto_auto]',
          classNames?.panel,
        )}
      >
        {calendar}

        <Box
          data-slot="date-picker-time-section"
          className={cn(datePickerTimeSectionVariants(), classNames?.timeSection)}
        >
          <Box
            as="label"
            id={timeInputLabelId}
            htmlFor={timeInputId}
            className={datePickerTimeLabelVariants()}
          >
            <Box as="span">Time</Box>
          </Box>

          <Box
            as="input"
            id={timeInputId}
            type="time"
            step={60}
            value={draftTime}
            min={timeBounds.min}
            max={timeBounds.max}
            disabled={disabled || !selectedDate}
            aria-labelledby={timeInputLabelId}
            className={cn(datePickerTimeInputVariants({ invalid: hasError }), classNames?.timeInput)}
            onChange={handleTimeChange}
          />

          {hintText ? (
            <Box id={hintId} as="p" className={datePickerHintVariants()}>
              {hintText}
            </Box>
          ) : null}
        </Box>
      </Box>
    ) : (
      calendar
    );

    return (
      <Box data-slot="date-picker-field" className={cn(datePickerFieldVariants(), className)}>
        {label ? (
          <Label id={labelId} htmlFor={triggerId} required={required} disabled={disabled}>
            {label}
          </Label>
        ) : null}

        {presentation === 'popover' ? (
          <Popover open={resolvedOpen} onOpen={handleOpen} onClose={handleClose}>
            <PopoverAnchor asChild>{control}</PopoverAnchor>
            <PopoverContent
              align="start"
              side="bottom"
              sideOffset={6}
              className={cn(
                datePickerContentVariants({ chrome: withTime ? 'framed' : 'bare' }),
                classNames?.popoverContent,
              )}
            >
              {calendarContent}
            </PopoverContent>
          </Popover>
        ) : (
          <>
            {control}
            <Drawer open={resolvedOpen} onClose={handleClose}>
              <DrawerContent className={classNames?.drawerContent}>
                <Box
                  data-slot="date-picker-drawer-body"
                  className={cn(
                    'grid justify-items-center gap-3 px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]',
                    classNames?.drawerBody,
                  )}
                >
                  {drawerTitle ? (
                    <DrawerHeader className={cn('w-full px-0 py-0', classNames?.drawerHeader)}>
                      <DrawerTitle
                        className={cn(
                          'text-base font-semibold leading-6 text-foreground',
                          classNames?.drawerTitle,
                        )}
                      >
                        {drawerTitle}
                      </DrawerTitle>
                    </DrawerHeader>
                  ) : null}

                  {calendarContent}
                </Box>
              </DrawerContent>
            </Drawer>
          </>
        )}

        {typeof error === 'string' ? (
          <Box
            as="p"
            id={errorId}
            role="alert"
            className={cn(datePickerMessageVariants(), classNames?.message)}
          >
            {error}
          </Box>
        ) : null}
      </Box>
    );
  },
);

DatePicker.displayName = 'DatePicker';
