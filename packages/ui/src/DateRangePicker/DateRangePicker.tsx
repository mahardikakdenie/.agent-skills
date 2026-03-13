import { CalendarDays, X } from 'lucide-react';
import * as React from 'react';
import { startOfDay, startOfMonth } from 'date-fns';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import { Calendar } from '../Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import {
  dateRangePickerActionButtonVariants,
  dateRangePickerCalendarFrameVariants,
  dateRangePickerContentVariants,
  dateRangePickerControlVariants,
  dateRangePickerFieldVariants,
  dateRangePickerIconVariants,
  dateRangePickerMessageVariants,
  dateRangePickerPanelVariants,
  dateRangePickerPresetButtonVariants,
  dateRangePickerPresetsVariants,
  dateRangePickerTriggerTextVariants,
  dateRangePickerTriggerVariants,
} from './DateRangePicker.variants';
import type { DateRangePickerProps, DateRangeValue } from './DateRangePicker.types';
import {
  areDateRangesEqual,
  formatDateRangeValue,
  getDateRangePickerDisabledMatchers,
  getDateRangePickerInitialMonth,
  getDateRangePreviewModifiers,
  getEnabledDateRangePresets,
  hasDateRangeValue,
  isDateRangeComplete,
  normalizeDateRangeValue,
} from './DateRangePicker.utils';

/**
 * Shared date-range picker composed from Calendar range mode and Popover.
 */
export const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      value,
      onChange,
      presets,
      minDate,
      maxDate,
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
    const triggerId = id ?? `date-range-picker-${generatedId}`;
    const errorId = typeof error === 'string' ? `${triggerId}-error` : undefined;
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState<DateRangeValue | null>(null);
    const [open, setOpen] = React.useState(false);
    const [hoveredDate, setHoveredDate] = React.useState<Date | undefined>();
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const pendingRestartRangeRef = React.useRef<DateRangeValue | null>(null);
    const selectedRange = React.useMemo(
      () => normalizeDateRangeValue(isControlled ? value ?? null : uncontrolledValue),
      [isControlled, uncontrolledValue, value],
    );
    const [visibleMonth, setVisibleMonth] = React.useState(() =>
      getDateRangePickerInitialMonth(selectedRange, minDate, maxDate),
    );
    const hasError = Boolean(error);
    const hasValue = hasDateRangeValue(selectedRange);
    const describedBy =
      [ariaDescribedBy, typeof error === 'string' ? errorId : undefined].filter(Boolean).join(' ') ||
      undefined;
    const disabledMatchers = getDateRangePickerDisabledMatchers(minDate, maxDate);
    const fromMonth = minDate ? startOfMonth(minDate) : undefined;
    const toMonth = maxDate ? startOfMonth(maxDate) : undefined;
    const normalizedPresets = React.useMemo(
      () => getEnabledDateRangePresets(presets, minDate, maxDate),
      [maxDate, minDate, presets],
    );
    const previewState = React.useMemo(
      () => getDateRangePreviewModifiers(selectedRange, hoveredDate),
      [hoveredDate, selectedRange],
    );
    const previewModifierClassNames = React.useMemo(() => {
      if (!previewState) {
        return undefined;
      }

      return {
        preview:
          'rounded-none bg-primary/12 text-foreground hover:bg-primary/12 hover:text-foreground',
        previewEnd: previewState.isBackward
          ? 'rounded-l-md rounded-r-none bg-primary/12 text-foreground ring-1 ring-inset ring-primary/35 hover:bg-primary/12 hover:text-foreground'
          : 'rounded-r-md rounded-l-none bg-primary/12 text-foreground ring-1 ring-inset ring-primary/35 hover:bg-primary/12 hover:text-foreground',
      };
    }, [previewState]);
    const calendarClassNames = React.useMemo(() => {
      const hasPartialSelection = Boolean(selectedRange?.from && !selectedRange.to);

      if (!hasPartialSelection) {
        return undefined;
      }

      const baseSelectedDayClass =
        'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground';

      if (!previewState) {
        return {
          day_range_start: cn('rounded-md', baseSelectedDayClass),
          day_range_end: cn('rounded-md', baseSelectedDayClass),
        };
      }

      const anchorClass = previewState.isBackward
        ? cn('rounded-l-none rounded-r-md', baseSelectedDayClass)
        : cn('rounded-r-none rounded-l-md', baseSelectedDayClass);

      return {
        day_range_start: anchorClass,
        day_range_end: anchorClass,
      };
    }, [previewState, selectedRange]);
    const previewEnabled = open && Boolean(selectedRange?.from && !selectedRange.to);

    React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);

    React.useEffect(() => {
      setVisibleMonth(getDateRangePickerInitialMonth(selectedRange, minDate, maxDate));
    }, [maxDate, minDate, selectedRange]);

    React.useEffect(() => {
      if (!previewEnabled) {
        setHoveredDate(undefined);
      }
    }, [previewEnabled]);

    const commitValue = (nextValue: DateRangeValue | null) => {
      const normalizedValue = normalizeDateRangeValue(nextValue);

      if (!isControlled) {
        setUncontrolledValue(normalizedValue);
      }

      onChange?.(normalizedValue);
    };

    const handleOpen = () => {
      pendingRestartRangeRef.current = null;
      setHoveredDate(undefined);
      setOpen(true);
    };

    const handleClose = () => {
      pendingRestartRangeRef.current = null;
      setHoveredDate(undefined);
      setOpen(false);
    };

    const handleSelect = (nextValue: DateRangeValue | undefined) => {
      const restartRange = pendingRestartRangeRef.current;

      if (restartRange) {
        pendingRestartRangeRef.current = null;
        commitValue(restartRange);
        setHoveredDate(undefined);
        setVisibleMonth(startOfMonth(restartRange.from as Date));
        return;
      }

      const normalizedValue = normalizeDateRangeValue(nextValue);

      commitValue(normalizedValue);

      if (normalizedValue?.from) {
        setVisibleMonth(startOfMonth(normalizedValue.from));
      }

      if (isDateRangeComplete(normalizedValue)) {
        handleClose();
      }
    };

    const handlePresetSelect = (nextValue: DateRangeValue) => {
      const normalizedValue = normalizeDateRangeValue(nextValue);

      pendingRestartRangeRef.current = null;
      commitValue(normalizedValue);
      setHoveredDate(undefined);

      if (normalizedValue?.from) {
        setVisibleMonth(startOfMonth(normalizedValue.from));
      }

      handleClose();
    };

    const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      pendingRestartRangeRef.current = null;
      commitValue(null);
      setHoveredDate(undefined);
      triggerRef.current?.focus();
    };

    const handleDayClick = (
      day: Date,
      activeModifiers: { disabled?: boolean; hidden?: boolean },
    ) => {
      if (!isDateRangeComplete(selectedRange) || activeModifiers.disabled || activeModifiers.hidden) {
        pendingRestartRangeRef.current = null;
        return;
      }

      pendingRestartRangeRef.current = {
        from: startOfDay(day),
        to: undefined,
      };
      setHoveredDate(undefined);
    };

    const handlePreviewDay = (
      day: Date,
      activeModifiers: { disabled?: boolean },
    ) => {
      if (!previewEnabled || activeModifiers.disabled) {
        return;
      }

      setHoveredDate(day);
    };

    return (
      <Box
        data-slot="date-range-picker-field"
        className={cn(dateRangePickerFieldVariants(), className)}
      >
        <Box
          data-slot="date-range-picker-control"
          className={dateRangePickerControlVariants({ invalid: hasError, disabled })}
        >
          <Popover open={open} onOpen={handleOpen} onClose={handleClose}>
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
                data-slot="date-range-picker-trigger"
                className={dateRangePickerTriggerVariants({ hasValue, disabled })}
                onBlur={onBlur}
                onFocus={onFocus}
                {...props}
              >
                <CalendarDays aria-hidden="true" className={dateRangePickerIconVariants()} />
                <Box as="span" className={dateRangePickerTriggerTextVariants()}>
                  {formatDateRangeValue(selectedRange) ?? 'Select date range...'}
                </Box>
              </Box>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              side="bottom"
              sideOffset={6}
              className={dateRangePickerContentVariants()}
            >
              <Box data-slot="date-range-picker-panel" className={dateRangePickerPanelVariants()}>
                {normalizedPresets.length > 0 ? (
                  <Box
                    data-slot="date-range-picker-presets"
                    role="group"
                    aria-label="Date range presets"
                    className={dateRangePickerPresetsVariants()}
                  >
                    {normalizedPresets.map((preset) => {
                      const active = areDateRangesEqual(selectedRange, preset.value);

                      return (
                        <Box
                          key={preset.label}
                          as="button"
                          type="button"
                          disabled={preset.disabled}
                          aria-pressed={active}
                          className={dateRangePickerPresetButtonVariants({ active })}
                          onClick={() => {
                            handlePresetSelect(preset.value);
                          }}
                        >
                          {preset.label}
                        </Box>
                      );
                    })}
                  </Box>
                ) : null}

                <Box
                  data-slot="date-range-picker-calendar-frame"
                  className={dateRangePickerCalendarFrameVariants()}
                >
                  <Calendar
                    mode="range"
                    month={visibleMonth}
                    onMonthChange={setVisibleMonth}
                    selected={selectedRange ?? undefined}
                    classNames={calendarClassNames}
                    modifiers={previewState?.modifiers}
                    modifiersClassNames={previewModifierClassNames}
                    onDayClick={handleDayClick}
                    onSelect={handleSelect}
                    onDayFocus={handlePreviewDay}
                    onDayMouseEnter={handlePreviewDay}
                    onDayPointerEnter={handlePreviewDay}
                    onDayBlur={() => {
                      if (previewEnabled) {
                        setHoveredDate(undefined);
                      }
                    }}
                    onDayMouseLeave={() => {
                      if (previewEnabled) {
                        setHoveredDate(undefined);
                      }
                    }}
                    disabled={disabledMatchers}
                    fromMonth={fromMonth}
                    toMonth={toMonth}
                    numberOfMonths={2}
                    initialFocus
                  />
                </Box>
              </Box>
            </PopoverContent>
          </Popover>

          {clearable && hasValue && !disabled ? (
            <Box
              as="button"
              type="button"
              aria-label="Clear date range"
              data-slot="date-range-picker-clear"
              className={dateRangePickerActionButtonVariants()}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={handleClear}
            >
              <X aria-hidden="true" className={dateRangePickerIconVariants()} />
            </Box>
          ) : null}
        </Box>

        {typeof error === 'string' ? (
          <Box as="p" id={errorId} role="alert" className={dateRangePickerMessageVariants()}>
            {error}
          </Box>
        ) : null}
      </Box>
    );
  },
);

DateRangePicker.displayName = 'DateRangePicker';
