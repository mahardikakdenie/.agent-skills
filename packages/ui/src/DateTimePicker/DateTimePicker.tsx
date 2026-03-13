import { startOfMonth } from 'date-fns';
import { CalendarDays, X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import { Calendar } from '../Calendar';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '../Popover';
import type { DateTimePickerProps } from './DateTimePicker.types';
import {
  applyTimeValueToDate,
  clampDateTimeValue,
  defaultDateTimePickerTimeValue,
  formatDateTimePickerTimeValue,
  formatDateTimePickerValue,
  getDateTimePickerDisabledMatchers,
  getDateTimePickerInitialMonth,
  getDateTimePickerTimeBounds,
  normalizeDateTimeValue,
} from './DateTimePicker.utils';
import {
  dateTimePickerActionButtonVariants,
  dateTimePickerContentVariants,
  dateTimePickerControlVariants,
  dateTimePickerFieldVariants,
  dateTimePickerHintVariants,
  dateTimePickerIconVariants,
  dateTimePickerMessageVariants,
  dateTimePickerPanelVariants,
  dateTimePickerTimeInputVariants,
  dateTimePickerTimeLabelVariants,
  dateTimePickerTimeRowVariants,
  dateTimePickerTimeSectionVariants,
  dateTimePickerTriggerTextVariants,
  dateTimePickerTriggerVariants,
} from './DateTimePicker.variants';

const dateTimePickerCalendarClassName = [
  '[&]:p-2',
  '[&_.rdp-month]:space-y-2',
  '[&_.rdp-caption]:min-h-7 [&_.rdp-caption]:pb-1 [&_.rdp-caption]:pt-0',
  '[&_.rdp-nav_button]:h-6 [&_.rdp-nav_button]:w-6',
  '[&_.rdp-head_row]:gap-0 [&_.rdp-head_cell]:w-7 [&_.rdp-head_cell]:text-[11px]',
  '[&_.rdp-row]:mt-0.5 [&_.rdp-row]:gap-0',
  '[&_.rdp-cell]:h-7 [&_.rdp-cell]:w-7 [&_.rdp-cell]:text-xs',
  '[&_.rdp-day]:h-7 [&_.rdp-day]:w-7 [&_.rdp-day]:text-xs',
  '[&_[data-slot=calendar-picker-panel]]:inset-x-1 [&_[data-slot=calendar-picker-panel]]:top-[calc(100%+0.5rem)]',
  '[&_[data-slot=calendar-picker-panel][data-picker-view=years]]:h-[11rem]',
  '[&_[data-slot=calendar-picker-panel][data-picker-view=months]]:h-[9.5rem]',
  '[&_[data-slot=calendar-picker-grid]]:gap-x-1 [&_[data-slot=calendar-picker-grid]]:gap-y-1',
  '[&_[data-slot=calendar-picker-years]]:gap-x-1 [&_[data-slot=calendar-picker-years]]:gap-y-1 [&_[data-slot=calendar-picker-years]]:pr-0.5',
  '[&_[data-slot=calendar-picker-option]]:h-7 [&_[data-slot=calendar-picker-option]]:text-xs',
].join(' ');

/**
 * Shared date and time field shell built from Calendar and Popover, with
 * minute-precision time entry and app-local workflow orchestration left out.
 */
export const DateTimePicker = React.forwardRef<HTMLButtonElement, DateTimePickerProps>(
  (
    {
      value,
      onChange,
      minDateTime,
      maxDateTime,
      timezone,
      disabled = false,
      clearable = false,
      error = false,
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
    const triggerId = id ?? `date-time-picker-${generatedId}`;
    const timeInputId = `${triggerId}-time`;
    const timeInputLabelId = `${timeInputId}-label`;
    const errorId = typeof error === 'string' ? `${triggerId}-error` : undefined;
    const hintId = `${triggerId}-hint`;
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState<Date | null>(null);
    const [open, setOpen] = React.useState(false);
    const [draftTime, setDraftTime] = React.useState(defaultDateTimePickerTimeValue);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const selectedDateTime = React.useMemo(
      () => normalizeDateTimeValue(isControlled ? (value ?? null) : uncontrolledValue),
      [isControlled, uncontrolledValue, value],
    );
    const [visibleMonth, setVisibleMonth] = React.useState(() =>
      getDateTimePickerInitialMonth(selectedDateTime, minDateTime, maxDateTime),
    );
    const hasError = Boolean(error);
    const hasValue = Boolean(selectedDateTime);
    const disabledMatchers = getDateTimePickerDisabledMatchers(minDateTime, maxDateTime);
    const hintText = timezone ? `Timezone: ${timezone} (display only).` : null;
    const describedBy =
      [
        ariaDescribedBy,
        hintText ? hintId : undefined,
        typeof error === 'string' ? errorId : undefined,
      ]
        .filter(Boolean)
        .join(' ') || undefined;
    const timeBounds = getDateTimePickerTimeBounds(selectedDateTime, minDateTime, maxDateTime);

    React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);

    React.useEffect(() => {
      const nextVisibleMonth = getDateTimePickerInitialMonth(
        selectedDateTime,
        minDateTime,
        maxDateTime,
      );

      setVisibleMonth((currentVisibleMonth) =>
        currentVisibleMonth.getFullYear() === nextVisibleMonth.getFullYear() &&
        currentVisibleMonth.getMonth() === nextVisibleMonth.getMonth()
          ? currentVisibleMonth
          : nextVisibleMonth,
      );
    }, [maxDateTime, minDateTime, selectedDateTime]);

    React.useEffect(() => {
      if (selectedDateTime) {
        setDraftTime(formatDateTimePickerTimeValue(selectedDateTime));
      }
    }, [selectedDateTime]);

    const commitValue = (nextValue: Date | null) => {
      const normalizedValue = normalizeDateTimeValue(nextValue);

      if (!isControlled) {
        setUncontrolledValue(normalizedValue);
      }

      onChange?.(normalizedValue);
    };

    const handleSelect = (nextDate: Date | undefined) => {
      if (!nextDate) {
        return;
      }

      const nextDateTime = clampDateTimeValue(
        applyTimeValueToDate(nextDate, draftTime),
        minDateTime,
        maxDateTime,
      );

      commitValue(nextDateTime);
      setDraftTime(formatDateTimePickerTimeValue(nextDateTime));
      setVisibleMonth(startOfMonth(nextDateTime));
    };

    const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      const nextTimeValue = event.target.value;
      setDraftTime(nextTimeValue);

      if (!selectedDateTime) {
        return;
      }

      const nextDateTime = clampDateTimeValue(
        applyTimeValueToDate(selectedDateTime, nextTimeValue),
        minDateTime,
        maxDateTime,
      );

      commitValue(nextDateTime);
      setDraftTime(formatDateTimePickerTimeValue(nextDateTime));
    };

    const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      commitValue(null);
      triggerRef.current?.focus();
    };

    return (
      <Box
        data-slot="date-time-picker-field"
        className={cn(dateTimePickerFieldVariants(), className)}
      >
        <Popover
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
        >
          <PopoverAnchor asChild>
            <Box
              data-slot="date-time-picker-control"
              className={dateTimePickerControlVariants({ invalid: hasError, disabled })}
            >
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
                  aria-labelledby={ariaLabelledBy}
                  aria-describedby={describedBy}
                  aria-invalid={hasError || undefined}
                  aria-expanded={open}
                  aria-haspopup="dialog"
                  data-slot="date-time-picker-trigger"
                  className={dateTimePickerTriggerVariants({ hasValue, disabled })}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  {...props}
                >
                  <CalendarDays aria-hidden="true" className={dateTimePickerIconVariants()} />
                  <Box as="span" className={dateTimePickerTriggerTextVariants()}>
                    {formatDateTimePickerValue(selectedDateTime) ?? 'Select date and time...'}
                  </Box>
                </Box>
              </PopoverTrigger>

              {clearable && hasValue && !disabled ? (
                <Box
                  as="button"
                  type="button"
                  aria-label="Clear date and time"
                  data-slot="date-time-picker-clear"
                  className={dateTimePickerActionButtonVariants()}
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  onClick={handleClear}
                >
                  <X aria-hidden="true" className={dateTimePickerIconVariants()} />
                </Box>
              ) : null}
            </Box>
          </PopoverAnchor>

          <PopoverContent
            align="start"
            side="bottom"
            sideOffset={6}
            className={dateTimePickerContentVariants()}
          >
            <Box data-slot="date-time-picker-panel" className={dateTimePickerPanelVariants()}>
              <Calendar
                mode="single"
                className={dateTimePickerCalendarClassName}
                month={visibleMonth}
                onMonthChange={setVisibleMonth}
                selected={selectedDateTime ?? undefined}
                onSelect={handleSelect}
                disabled={disabledMatchers}
                initialFocus
              />

              <Box
                data-slot="date-time-picker-time-section"
                className={dateTimePickerTimeSectionVariants()}
              >
                <Box
                  data-slot="date-time-picker-time-row"
                  className={dateTimePickerTimeRowVariants()}
                >
                  <Box
                    as="label"
                    id={timeInputLabelId}
                    htmlFor={timeInputId}
                    className={dateTimePickerTimeLabelVariants()}
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
                    disabled={disabled}
                    aria-labelledby={timeInputLabelId}
                    className={dateTimePickerTimeInputVariants({ invalid: hasError })}
                    onChange={handleTimeChange}
                  />
                </Box>

                {hintText ? (
                  <Box id={hintId} as="p" className={dateTimePickerHintVariants()}>
                    {hintText}
                  </Box>
                ) : null}
              </Box>
            </Box>
          </PopoverContent>
        </Popover>

        {typeof error === 'string' ? (
          <Box as="p" id={errorId} role="alert" className={dateTimePickerMessageVariants()}>
            {error}
          </Box>
        ) : null}
      </Box>
    );
  },
);

DateTimePicker.displayName = 'DateTimePicker';
