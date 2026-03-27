import { CalendarDays, X } from 'lucide-react';
import * as React from 'react';
import { isSameDay, startOfDay, startOfMonth } from 'date-fns';
import type { DateRange as DayPickerDateRange } from 'react-day-picker';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import { Calendar } from '../Calendar';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '../Popover';
import {
  dateRangePickerActionButtonVariants,
  dateRangePickerCalendarFrameVariants,
  dateRangePickerContentVariants,
  dateRangePickerControlVariants,
  dateRangePickerFieldVariants,
  dateRangePickerHintVariants,
  dateRangePickerIconVariants,
  dateRangePickerMessageVariants,
  dateRangePickerPanelVariants,
  dateRangePickerPresetButtonVariants,
  dateRangePickerPresetsVariants,
  dateRangePickerTimeFieldVariants,
  dateRangePickerTimeGridVariants,
  dateRangePickerTimeInputVariants,
  dateRangePickerTimeLabelVariants,
  dateRangePickerTimeSectionVariants,
  dateRangePickerTriggerTextVariants,
  dateRangePickerTriggerVariants,
} from './DateRangePicker.variants';
import type { DateRangePickerProps, DateRangeValue } from './DateRangePicker.types';
import {
  applyTimeValueToDate,
  areDateRangesEqual,
  clampDateRangeBoundary,
  defaultDateRangePickerEndTimeValue,
  defaultDateRangePickerStartTimeValue,
  formatDateRangePickerTimeValue,
  formatDateRangeValue,
  getDateRangePickerDisabledMatchers,
  getDateRangePickerInitialMonth,
  getDateRangePickerTimeBounds,
  getDateRangePreviewModifiers,
  getEnabledDateRangePresets,
  hasDateRangeValue,
  isDateRangeComplete,
  normalizeDateRangeValue,
  shouldEmitDateRangeChange,
} from './DateRangePicker.utils';

function getEarlierTimeValue(...values: Array<string | undefined>) {
  const definedValues = values.filter((value): value is string => Boolean(value));

  if (definedValues.length === 0) {
    return undefined;
  }

  return definedValues.sort()[0];
}

function getLaterTimeValue(...values: Array<string | undefined>) {
  const definedValues = values.filter((value): value is string => Boolean(value));

  if (definedValues.length === 0) {
    return undefined;
  }

  return definedValues.sort().at(-1);
}

/**
 * Shared date-range picker composed from Calendar range mode and Popover.
 */
export const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      value,
      onChange,
      variant = 'default',
      size = 'md',
      changeBehavior = 'partial',
      presets,
      minDate,
      maxDate,
      withTime = false,
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
    const triggerId = id ?? `date-range-picker-${generatedId}`;
    const startTimeInputId = `${triggerId}-start-time`;
    const startTimeLabelId = `${startTimeInputId}-label`;
    const endTimeInputId = `${triggerId}-end-time`;
    const endTimeLabelId = `${endTimeInputId}-label`;
    const hintId = `${triggerId}-hint`;
    const errorId = typeof error === 'string' ? `${triggerId}-error` : undefined;
    const isControlled = value !== undefined;
    const shouldDeferChange = changeBehavior === 'complete';
    const [uncontrolledValue, setUncontrolledValue] = React.useState<DateRangeValue | null>(null);
    const [draftValue, setDraftValue] = React.useState<DateRangeValue | null | undefined>(undefined);
    const [open, setOpen] = React.useState(false);
    const [hoveredDate, setHoveredDate] = React.useState<Date | undefined>();
    const [draftStartTime, setDraftStartTime] = React.useState(defaultDateRangePickerStartTimeValue);
    const [draftEndTime, setDraftEndTime] = React.useState(defaultDateRangePickerEndTimeValue);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const pendingRestartRangeRef = React.useRef<DateRangeValue | null>(null);
    const resolvedMinDate = minDateTime ?? minDate;
    const resolvedMaxDate = maxDateTime ?? maxDate;
    const committedRange = React.useMemo(
      () =>
        normalizeDateRangeValue(isControlled ? value ?? null : uncontrolledValue, {
          preserveTime: withTime,
        }),
      [isControlled, uncontrolledValue, value, withTime],
    );
    const selectedRange = shouldDeferChange && draftValue !== undefined ? draftValue : committedRange;
    const calendarSelectedRange = React.useMemo<DayPickerDateRange | undefined>(() => {
      if (!selectedRange?.from) {
        return undefined;
      }

      return {
        from: selectedRange.from,
        to: selectedRange.to,
      };
    }, [selectedRange]);
    const [visibleMonth, setVisibleMonth] = React.useState(() =>
      getDateRangePickerInitialMonth(selectedRange, resolvedMinDate, resolvedMaxDate),
    );
    const hasError = Boolean(error);
    const hasValue = hasDateRangeValue(selectedRange);
    const hintText = withTime && timezone ? `Timezone: ${timezone} (display only).` : null;
    const describedBy =
      [ariaDescribedBy, hintText ? hintId : undefined, typeof error === 'string' ? errorId : undefined]
        .filter(Boolean)
        .join(' ') || undefined;
    const disabledMatchers = getDateRangePickerDisabledMatchers(resolvedMinDate, resolvedMaxDate);
    const fromMonth = resolvedMinDate ? startOfMonth(resolvedMinDate) : undefined;
    const toMonth = resolvedMaxDate ? startOfMonth(resolvedMaxDate) : undefined;
    const normalizedPresets = React.useMemo(
      () =>
        getEnabledDateRangePresets(presets, resolvedMinDate, resolvedMaxDate, {
          preserveTime: withTime,
        }),
      [presets, resolvedMinDate, resolvedMaxDate, withTime],
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
    const startTimeBounds = React.useMemo(() => {
      if (!withTime || !selectedRange?.from) {
        return { min: undefined, max: undefined };
      }

      const absoluteBounds = getDateRangePickerTimeBounds(
        selectedRange.from,
        minDateTime,
        maxDateTime,
      );
      const peerMax =
        selectedRange.to && isSameDay(selectedRange.from, selectedRange.to)
          ? formatDateRangePickerTimeValue(selectedRange.to, defaultDateRangePickerEndTimeValue)
          : undefined;

      return {
        min: absoluteBounds.min,
        max: getEarlierTimeValue(absoluteBounds.max, peerMax),
      };
    }, [maxDateTime, minDateTime, selectedRange, withTime]);
    const endTimeBounds = React.useMemo(() => {
      if (!withTime || !selectedRange?.to) {
        return { min: undefined, max: undefined };
      }

      const absoluteBounds = getDateRangePickerTimeBounds(
        selectedRange.to,
        minDateTime,
        maxDateTime,
      );
      const peerMin =
        selectedRange.from && isSameDay(selectedRange.from, selectedRange.to)
          ? formatDateRangePickerTimeValue(selectedRange.from, defaultDateRangePickerStartTimeValue)
          : undefined;

      return {
        min: getLaterTimeValue(absoluteBounds.min, peerMin),
        max: absoluteBounds.max,
      };
    }, [maxDateTime, minDateTime, selectedRange, withTime]);

    React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);

    React.useEffect(() => {
      setDraftValue(undefined);
    }, [committedRange, shouldDeferChange]);

    React.useEffect(() => {
      setVisibleMonth(getDateRangePickerInitialMonth(selectedRange, resolvedMinDate, resolvedMaxDate));
    }, [resolvedMaxDate, resolvedMinDate, selectedRange]);

    React.useEffect(() => {
      if (!previewEnabled) {
        setHoveredDate(undefined);
      }
    }, [previewEnabled]);

    React.useEffect(() => {
      if (!withTime) {
        return;
      }

      if (selectedRange?.from) {
        setDraftStartTime(
          formatDateRangePickerTimeValue(selectedRange.from, defaultDateRangePickerStartTimeValue),
        );
      }

      if (selectedRange?.to) {
        setDraftEndTime(
          formatDateRangePickerTimeValue(selectedRange.to, defaultDateRangePickerEndTimeValue),
        );
      }
    }, [selectedRange, withTime]);

    const commitValue = (nextValue: DateRangeValue | null) => {
      const normalizedValue = normalizeDateRangeValue(nextValue, {
        preserveTime: withTime,
      });

      if (!isControlled) {
        setUncontrolledValue(normalizedValue);
      }

      onChange?.(normalizedValue);

      return normalizedValue;
    };

    const updateSelectedValue = (nextValue: DateRangeValue | null) => {
      const normalizedValue = normalizeDateRangeValue(nextValue, {
        preserveTime: withTime,
      });

      if (shouldEmitDateRangeChange(normalizedValue, changeBehavior)) {
        if (shouldDeferChange) {
          setDraftValue(normalizedValue);
        }

        return commitValue(normalizedValue);
      }

      setDraftValue(normalizedValue);
      return normalizedValue;
    };

    const applyDraftTimes = (nextValue: DateRangeValue | undefined) => {
      const normalizedValue = normalizeDateRangeValue(nextValue, {
        preserveTime: false,
      });

      if (!normalizedValue) {
        return null;
      }

      if (!withTime) {
        return normalizedValue;
      }

      const nextFrom = normalizedValue.from
        ? clampDateRangeBoundary(
            applyTimeValueToDate(normalizedValue.from, draftStartTime),
            minDateTime,
            maxDateTime,
          )
        : undefined;
      let nextTo = normalizedValue.to
        ? clampDateRangeBoundary(
            applyTimeValueToDate(normalizedValue.to, draftEndTime),
            minDateTime,
            maxDateTime,
          )
        : undefined;

      if (nextFrom && nextTo && isSameDay(nextFrom, nextTo) && nextFrom > nextTo) {
        nextTo = new Date(nextFrom);
      }

      return normalizeDateRangeValue(
        {
          from: nextFrom,
          to: nextTo,
        },
        {
          preserveTime: true,
        },
      );
    };

    const handleOpen = () => {
      pendingRestartRangeRef.current = null;
      setHoveredDate(undefined);
      setOpen(true);
    };

    const handleClose = (resetIncompleteDraft = true) => {
      pendingRestartRangeRef.current = null;
      setHoveredDate(undefined);

      if (
        resetIncompleteDraft &&
        shouldDeferChange &&
        draftValue != null &&
        !isDateRangeComplete(draftValue)
      ) {
        setDraftValue(undefined);
      }

      setOpen(false);
    };

    const handleSelect = (nextValue: DateRangeValue | undefined) => {
      const restartRange = pendingRestartRangeRef.current;

      if (restartRange) {
        pendingRestartRangeRef.current = null;
        updateSelectedValue(restartRange);
        setHoveredDate(undefined);
        setVisibleMonth(startOfMonth(restartRange.from as Date));
        return;
      }

      const normalizedValue = applyDraftTimes(nextValue);

      updateSelectedValue(normalizedValue);

      if (normalizedValue?.from) {
        setVisibleMonth(startOfMonth(normalizedValue.from));
      }

      if (isDateRangeComplete(normalizedValue) && !withTime) {
        handleClose(false);
      }
    };

    const handlePresetSelect = (nextValue: DateRangeValue) => {
      const normalizedValue = normalizeDateRangeValue(nextValue, {
        preserveTime: withTime,
      });

      pendingRestartRangeRef.current = null;
      updateSelectedValue(normalizedValue);
      setHoveredDate(undefined);

      if (normalizedValue?.from) {
        setVisibleMonth(startOfMonth(normalizedValue.from));
      }

      if (!withTime) {
        handleClose(false);
      }
    };

    const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      pendingRestartRangeRef.current = null;
      updateSelectedValue(null);
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
        from: withTime ? applyTimeValueToDate(day, draftStartTime) : startOfDay(day),
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

    const clearPreview = () => {
      if (previewEnabled) {
        setHoveredDate(undefined);
      }
    };

    const handleStartTimeChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      const nextTimeValue = event.target.value;
      setDraftStartTime(nextTimeValue);

      if (!selectedRange?.from) {
        return;
      }

      let nextFrom = clampDateRangeBoundary(
        applyTimeValueToDate(selectedRange.from, nextTimeValue),
        minDateTime,
        maxDateTime,
      );

      if (selectedRange.to && isSameDay(nextFrom, selectedRange.to) && nextFrom > selectedRange.to) {
        nextFrom = new Date(selectedRange.to);
      }

      const nextRange = normalizeDateRangeValue(
        {
          from: nextFrom,
          to: selectedRange.to,
        },
        {
          preserveTime: true,
        },
      );

      updateSelectedValue(nextRange);
      setDraftStartTime(
        formatDateRangePickerTimeValue(nextRange?.from, defaultDateRangePickerStartTimeValue),
      );
    };

    const handleEndTimeChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      const nextTimeValue = event.target.value;
      setDraftEndTime(nextTimeValue);

      if (!selectedRange?.to) {
        return;
      }

      let nextTo = clampDateRangeBoundary(
        applyTimeValueToDate(selectedRange.to, nextTimeValue),
        minDateTime,
        maxDateTime,
      );

      if (selectedRange.from && isSameDay(selectedRange.from, nextTo) && nextTo < selectedRange.from) {
        nextTo = new Date(selectedRange.from);
      }

      const nextRange = normalizeDateRangeValue(
        {
          from: selectedRange.from,
          to: nextTo,
        },
        {
          preserveTime: true,
        },
      );

      updateSelectedValue(nextRange);
      setDraftEndTime(
        formatDateRangePickerTimeValue(nextRange?.to, defaultDateRangePickerEndTimeValue),
      );
    };

    return (
      <Box
        data-slot="date-range-picker-field"
        className={cn(dateRangePickerFieldVariants(), className)}
      >
        <Popover open={open} onOpen={handleOpen} onClose={handleClose}>
          <PopoverAnchor asChild>
            <Box
              data-slot="date-range-picker-control"
              className={dateRangePickerControlVariants({ variant, size, invalid: hasError, disabled })}
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
                  data-slot="date-range-picker-trigger"
                  className={dateRangePickerTriggerVariants({ size, hasValue, disabled })}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  {...props}
                >
                  <CalendarDays aria-hidden="true" className={dateRangePickerIconVariants({ size })} />
                  <Box as="span" className={dateRangePickerTriggerTextVariants()}>
                    {formatDateRangeValue(selectedRange, { withTime }) ??
                      (withTime ? 'Select date range and time...' : 'Select date range...')}
                  </Box>
                </Box>
              </PopoverTrigger>

              {clearable && hasValue && !disabled ? (
                <Box
                  as="button"
                  type="button"
                  aria-label={withTime ? 'Clear date range and time' : 'Clear date range'}
                  data-slot="date-range-picker-clear"
                  className={dateRangePickerActionButtonVariants({ size })}
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  onClick={handleClear}
                >
                  <X aria-hidden="true" className={dateRangePickerIconVariants({ size })} />
                </Box>
              ) : null}
            </Box>
          </PopoverAnchor>
          <PopoverContent
            align="start"
            side="bottom"
            sideOffset={6}
            className={dateRangePickerContentVariants({
              chrome: withTime || normalizedPresets.length > 0 ? 'framed' : 'bare',
            })}
          >
            {withTime || normalizedPresets.length > 0 ? (
              <Box data-slot="date-range-picker-panel" className={dateRangePickerPanelVariants()}>
                {normalizedPresets.length > 0 ? (
                  <Box
                    data-slot="date-range-picker-presets"
                    role="group"
                    aria-label="Date range presets"
                    className={dateRangePickerPresetsVariants()}
                  >
                    {normalizedPresets.map((preset) => {
                      const active = areDateRangesEqual(selectedRange, preset.value, {
                        preserveTime: withTime,
                      });

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
                  onMouseLeave={clearPreview}
                  onBlurCapture={(event: React.FocusEvent<HTMLDivElement>) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      clearPreview();
                    }
                  }}
                >
                  <Calendar
                    mode="range"
                    month={visibleMonth}
                    onMonthChange={setVisibleMonth}
                    selected={calendarSelectedRange}
                    classNames={calendarClassNames}
                    modifiers={previewState?.modifiers}
                    modifiersClassNames={previewModifierClassNames}
                    onDayClick={handleDayClick}
                    onSelect={handleSelect}
                    onDayFocus={handlePreviewDay}
                    onDayMouseEnter={handlePreviewDay}
                    onDayPointerEnter={handlePreviewDay}
                    disabled={disabledMatchers}
                    fromMonth={fromMonth}
                    toMonth={toMonth}
                    numberOfMonths={2}
                    initialFocus
                  />
                </Box>

                {withTime ? (
                  <Box
                    data-slot="date-range-picker-time-section"
                    className={dateRangePickerTimeSectionVariants()}
                  >
                    <Box
                      data-slot="date-range-picker-time-grid"
                      className={dateRangePickerTimeGridVariants()}
                    >
                      <Box
                        data-slot="date-range-picker-start-time-field"
                        className={dateRangePickerTimeFieldVariants()}
                      >
                        <Box
                          as="label"
                          id={startTimeLabelId}
                          htmlFor={startTimeInputId}
                          className={dateRangePickerTimeLabelVariants()}
                        >
                          <Box as="span">Start time</Box>
                        </Box>

                        <Box
                          as="input"
                          id={startTimeInputId}
                          type="time"
                          step={60}
                          value={draftStartTime}
                          min={startTimeBounds.min}
                          max={startTimeBounds.max}
                          disabled={disabled || !selectedRange?.from}
                          aria-labelledby={startTimeLabelId}
                          className={dateRangePickerTimeInputVariants({ invalid: hasError })}
                          onChange={handleStartTimeChange}
                        />
                      </Box>

                      <Box
                        data-slot="date-range-picker-end-time-field"
                        className={dateRangePickerTimeFieldVariants()}
                      >
                        <Box
                          as="label"
                          id={endTimeLabelId}
                          htmlFor={endTimeInputId}
                          className={dateRangePickerTimeLabelVariants()}
                        >
                          <Box as="span">End time</Box>
                        </Box>

                        <Box
                          as="input"
                          id={endTimeInputId}
                          type="time"
                          step={60}
                          value={draftEndTime}
                          min={endTimeBounds.min}
                          max={endTimeBounds.max}
                          disabled={disabled || !selectedRange?.to}
                          aria-labelledby={endTimeLabelId}
                          className={dateRangePickerTimeInputVariants({ invalid: hasError })}
                          onChange={handleEndTimeChange}
                        />
                      </Box>
                    </Box>

                    {hintText ? (
                      <Box id={hintId} as="p" className={dateRangePickerHintVariants()}>
                        {hintText}
                      </Box>
                    ) : null}
                  </Box>
                ) : null}
              </Box>
            ) : (
              <Box
                data-slot="date-range-picker-calendar-frame"
                onMouseLeave={clearPreview}
                onBlurCapture={(event: React.FocusEvent<HTMLDivElement>) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    clearPreview();
                  }
                }}
              >
                <Calendar
                  mode="range"
                  month={visibleMonth}
                  onMonthChange={setVisibleMonth}
                  selected={calendarSelectedRange}
                  classNames={calendarClassNames}
                  modifiers={previewState?.modifiers}
                  modifiersClassNames={previewModifierClassNames}
                  onDayClick={handleDayClick}
                  onSelect={handleSelect}
                  onDayFocus={handlePreviewDay}
                  onDayMouseEnter={handlePreviewDay}
                  onDayPointerEnter={handlePreviewDay}
                  disabled={disabledMatchers}
                  fromMonth={fromMonth}
                  toMonth={toMonth}
                  numberOfMonths={2}
                  initialFocus
                />
              </Box>
            )}
          </PopoverContent>
        </Popover>

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
