import { ChevronLeft, ChevronRight, CalendarDays, X } from 'lucide-react';
import * as React from 'react';
import { isSameMonth } from 'date-fns';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import {
  calendarNavButtonNextVariants,
  calendarNavButtonPreviousVariants,
  calendarNavButtonVariants,
  calendarPickerGridVariants,
  calendarPickerOptionVariants,
} from '../Calendar/Calendar.variants';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '../Popover';
import type { MonthPickerProps } from './MonthPicker.types';
import {
  canNavigateToNextYear,
  canNavigateToPreviousYear,
  clampVisibleMonth,
  formatMonthPickerValue,
  getMonthPickerInitialMonth,
  getNextYear,
  getPreviousYear,
  getVisibleMonthForYear,
  getVisibleMonthOptions,
  getYearOptions,
  normalizeMonth,
} from './MonthPicker.utils';
import {
  monthPickerActionButtonVariants,
  monthPickerContentVariants,
  monthPickerControlVariants,
  monthPickerFieldVariants,
  monthPickerHeaderVariants,
  monthPickerIconVariants,
  monthPickerMessageVariants,
  monthPickerOptionFrameVariants,
  monthPickerPickerPanelVariants,
  monthPickerPanelVariants,
  monthPickerTriggerTextVariants,
  monthPickerTriggerVariants,
  monthPickerYearOptionVariants,
  monthPickerYearTriggerVariants,
  monthPickerYearsVariants,
} from './MonthPicker.variants';

type MonthPickerView = 'months' | 'years';

/**
 * Shared month-only picker built from shared popover behavior and calendar-aligned month selection affordances.
 */
export const MonthPicker = React.forwardRef<HTMLButtonElement, MonthPickerProps>(
  (
    {
      value,
      onChange,
      variant = 'outline',
      size = 'md',
      minMonth,
      maxMonth,
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
    const triggerId = id ?? `month-picker-${generatedId}`;
    const errorId = typeof error === 'string' ? `${triggerId}-error` : undefined;
    const pickerPanelId = `${triggerId}-year-picker`;
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState<Date | null>(null);
    const [open, setOpen] = React.useState(false);
    const [view, setView] = React.useState<MonthPickerView>('months');
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const yearListRef = React.useRef<HTMLDivElement>(null);
    const selectedMonth = React.useMemo(
      () => normalizeMonth(isControlled ? value ?? null : uncontrolledValue),
      [isControlled, uncontrolledValue, value],
    );
    const [visibleMonth, setVisibleMonth] = React.useState(() =>
      getMonthPickerInitialMonth(selectedMonth, minMonth, maxMonth),
    );
    const hasError = Boolean(error);
    const hasValue = Boolean(selectedMonth);
    const describedBy =
      [ariaDescribedBy, typeof error === 'string' ? errorId : undefined].filter(Boolean).join(' ') ||
      undefined;
    const monthOptions = React.useMemo(
      () => getVisibleMonthOptions(visibleMonth, minMonth, maxMonth),
      [maxMonth, minMonth, visibleMonth],
    );
    const yearOptions = React.useMemo(
      () => getYearOptions(visibleMonth, minMonth, maxMonth),
      [maxMonth, minMonth, visibleMonth],
    );
    const canGoToPreviousYear = canNavigateToPreviousYear(visibleMonth, minMonth);
    const canGoToNextYear = canNavigateToNextYear(visibleMonth, maxMonth);

    React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);

    React.useEffect(() => {
      const nextVisibleMonth = getMonthPickerInitialMonth(selectedMonth, minMonth, maxMonth);

      setVisibleMonth((currentVisibleMonth) => {
        if (currentVisibleMonth.getTime() === nextVisibleMonth.getTime()) {
          return currentVisibleMonth;
        }

        return nextVisibleMonth;
      });
    }, [maxMonth, minMonth, selectedMonth]);

    React.useEffect(() => {
      if (view !== 'years') {
        return;
      }

      const activeYearOption = yearListRef.current?.querySelector<HTMLElement>('[data-active="true"]');
      activeYearOption?.scrollIntoView({ block: 'nearest' });
    }, [view, yearOptions]);

    const commitValue = (nextValue: Date | null) => {
      const normalizedValue = normalizeMonth(nextValue);

      if (!isControlled) {
        setUncontrolledValue(normalizedValue);
      }

      onChange?.(normalizedValue);
    };

    const handleOpen = () => {
      setView('months');
      setOpen(true);
    };

    const handleClose = () => {
      setView('months');
      setOpen(false);
    };

    const handleMonthSelect = (nextMonth: Date) => {
      if (selectedMonth && isSameMonth(selectedMonth, nextMonth)) {
        handleClose();
        return;
      }

      commitValue(nextMonth);
      setVisibleMonth(nextMonth);
      handleClose();
    };

    const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      commitValue(null);
      triggerRef.current?.focus();
    };

    const handleYearViewToggle = () => {
      setView((currentView) => (currentView === 'years' ? 'months' : 'years'));
    };

    const handlePreviousYear = () => {
      setVisibleMonth((currentVisibleMonth) =>
        clampVisibleMonth(getPreviousYear(currentVisibleMonth), minMonth, maxMonth),
      );
    };

    const handleNextYear = () => {
      setVisibleMonth((currentVisibleMonth) =>
        clampVisibleMonth(getNextYear(currentVisibleMonth), minMonth, maxMonth),
      );
    };

    const handleYearSelect = (year: number) => {
      setVisibleMonth((currentVisibleMonth) =>
        getVisibleMonthForYear(year, currentVisibleMonth, minMonth, maxMonth),
      );
      setView('months');
    };

    return (
      <Box data-slot="month-picker-field" className={cn(monthPickerFieldVariants(), className)}>
        <Popover open={open} onOpen={handleOpen} onClose={handleClose}>
          <PopoverAnchor asChild>
            <Box
              data-slot="month-picker-control"
              className={monthPickerControlVariants({
                variant,
                size,
                invalid: hasError,
                open,
                disabled,
              })}
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
                  data-slot="month-picker-trigger"
                  className={monthPickerTriggerVariants({ size, hasValue, disabled })}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  {...props}
                >
                  <CalendarDays aria-hidden="true" className={monthPickerIconVariants({ size })} />
                  <Box as="span" className={monthPickerTriggerTextVariants()}>
                    {formatMonthPickerValue(selectedMonth) ?? 'Select month...'}
                  </Box>
                </Box>
              </PopoverTrigger>

              {clearable && selectedMonth && !disabled ? (
                <Box
                  as="button"
                  type="button"
                  aria-label="Clear month"
                  data-slot="month-picker-clear"
                  className={monthPickerActionButtonVariants({ size })}
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  onClick={handleClear}
                >
                  <X aria-hidden="true" className={monthPickerIconVariants({ size })} />
                </Box>
              ) : null}
            </Box>
          </PopoverAnchor>

          <PopoverContent
            align="start"
            side="bottom"
            sideOffset={6}
            className={monthPickerContentVariants()}
          >
            <Box data-slot="month-picker-panel" className={monthPickerPanelVariants()}>
              <Box data-slot="month-picker-header" className={monthPickerHeaderVariants()}>
                <Box
                  as="button"
                  type="button"
                  aria-label="Previous year"
                  disabled={!canGoToPreviousYear}
                  className={cn(calendarNavButtonVariants(), calendarNavButtonPreviousVariants())}
                  onClick={handlePreviousYear}
                >
                  <ChevronLeft aria-hidden="true" className={monthPickerIconVariants({ size })} />
                </Box>

                <Box
                  as="button"
                  type="button"
                  aria-controls={pickerPanelId}
                  aria-expanded={view === 'years'}
                  aria-label={`Choose year, current year ${visibleMonth.getFullYear()}`}
                  className={monthPickerYearTriggerVariants()}
                  onClick={handleYearViewToggle}
                >
                  {visibleMonth.getFullYear()}
                </Box>

                <Box
                  as="button"
                  type="button"
                  aria-label="Next year"
                  disabled={!canGoToNextYear}
                  className={cn(calendarNavButtonVariants(), calendarNavButtonNextVariants())}
                  onClick={handleNextYear}
                >
                  <ChevronRight aria-hidden="true" className={monthPickerIconVariants({ size })} />
                </Box>
              </Box>

              {view === 'years' ? (
                <Box
                  id={pickerPanelId}
                  data-slot="month-picker-year-list"
                  role="group"
                  aria-label="Choose year"
                  className={monthPickerPickerPanelVariants()}
                >
                  <Box ref={yearListRef} className={monthPickerYearsVariants()}>
                    {yearOptions.map((yearOption) => (
                      <Box
                        key={yearOption.year}
                        as="button"
                        type="button"
                        aria-pressed={yearOption.active}
                        data-active={yearOption.active ? 'true' : undefined}
                        className={cn(
                          calendarPickerOptionVariants({
                            selected: yearOption.active,
                            disabled: false,
                          }),
                          monthPickerYearOptionVariants(),
                        )}
                        onClick={() => {
                          handleYearSelect(yearOption.year);
                        }}
                      >
                        {yearOption.year}
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Box data-slot="month-picker-grid" className={calendarPickerGridVariants()}>
                  {monthOptions.map((monthOption) => {
                    const selected = Boolean(
                      selectedMonth && isSameMonth(selectedMonth, monthOption.date),
                    );

                    return (
                      <Box
                        key={monthOption.date.toISOString()}
                        as="button"
                        type="button"
                        disabled={monthOption.disabled}
                        aria-pressed={selected}
                        data-selected={selected ? '' : undefined}
                        className={cn(
                          calendarPickerOptionVariants({
                            selected,
                            disabled: monthOption.disabled,
                          }),
                          monthPickerOptionFrameVariants(),
                        )}
                        onClick={() => {
                          handleMonthSelect(monthOption.date);
                        }}
                      >
                        {monthOption.label}
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          </PopoverContent>
        </Popover>

        {typeof error === 'string' ? (
          <Box as="p" id={errorId} role="alert" className={monthPickerMessageVariants()}>
            {error}
          </Box>
        ) : null}
      </Box>
    );
  },
);

MonthPicker.displayName = 'MonthPicker';
