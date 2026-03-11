import * as React from 'react';
import { format, isAfter, isBefore, setYear, startOfMonth } from 'date-fns';
import { type CaptionProps, useDayPicker, useNavigation } from 'react-day-picker';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import {
  calendarIconVariants,
  calendarInteractiveCaptionTriggerVariants,
  calendarPickerGridVariants,
  calendarPickerOptionVariants,
  calendarPickerPanelVariants,
  calendarPickerYearsVariants,
} from './Calendar.variants';

type CalendarPickerView = 'days' | 'years' | 'months';

function clampMonth(month: Date, fromDate?: Date, toDate?: Date) {
  const normalizedMonth = startOfMonth(month);

  if (fromDate && isBefore(normalizedMonth, startOfMonth(fromDate))) {
    return startOfMonth(fromDate);
  }

  if (toDate && isAfter(normalizedMonth, startOfMonth(toDate))) {
    return startOfMonth(toDate);
  }

  return normalizedMonth;
}

function isMonthSelectable(month: Date, fromDate?: Date, toDate?: Date) {
  const normalizedMonth = startOfMonth(month);

  if (fromDate && isBefore(normalizedMonth, startOfMonth(fromDate))) {
    return false;
  }

  if (toDate && isAfter(normalizedMonth, startOfMonth(toDate))) {
    return false;
  }

  return true;
}

export function CalendarInteractiveCaption(props: CaptionProps) {
  const {
    classNames,
    components,
    locale,
    labels: { labelNext, labelPrevious },
    formatters: { formatCaption },
    captionLayout,
    disableNavigation,
    fromDate,
    toDate,
  } = useDayPicker();
  const { previousMonth, nextMonth, goToMonth } = useNavigation();
  const [view, setView] = React.useState<CalendarPickerView>('days');
  const panelId = React.useId();
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const IconLeftComponent = components?.IconLeft;
  const IconRightComponent = components?.IconRight;
  const canOpenPicker = !disableNavigation;
  const showNavigation = !disableNavigation && captionLayout !== 'dropdown';
  const pickerFromDate = fromDate ? startOfMonth(fromDate) : startOfMonth(new Date(1900, 0, 1));
  const pickerToDate = toDate ? startOfMonth(toDate) : startOfMonth(new Date(2100, 11, 1));
  const activeYear = props.displayMonth.getFullYear();
  const activeMonth = props.displayMonth.getMonth();
  const years = Array.from(
    { length: pickerToDate.getFullYear() - pickerFromDate.getFullYear() + 1 },
    (_, index) => pickerFromDate.getFullYear() + index,
  );
  const monthOptions = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthDate = startOfMonth(new Date(activeYear, monthIndex, 1));

    return {
      label: format(monthDate, 'MMM', { locale }),
      value: monthIndex,
      disabled: !isMonthSelectable(monthDate, fromDate, toDate),
    };
  });

  React.useEffect(() => {
    if (view === 'days') {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setView('days');
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setView('days');
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [view]);

  React.useEffect(() => {
    if (view === 'days') {
      return;
    }

    const activeOption = containerRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    activeOption?.scrollIntoView({ block: 'nearest' });
  }, [activeMonth, activeYear, view]);

  const closePicker = () => setView('days');

  const handleHeaderClick = () => {
    if (!canOpenPicker) {
      return;
    }

    setView((currentView) => {
      if (currentView === 'years') {
        return 'days';
      }

      if (currentView === 'months') {
        return 'years';
      }

      return 'years';
    });
  };

  const handleYearSelect = (year: number) => {
    const nextDisplayMonth = clampMonth(setYear(props.displayMonth, year), fromDate, toDate);

    goToMonth(nextDisplayMonth);
    setView('months');
  };

  const handleMonthSelect = (monthIndex: number) => {
    const nextDisplayMonth = startOfMonth(new Date(activeYear, monthIndex, 1));

    if (!isMonthSelectable(nextDisplayMonth, fromDate, toDate)) {
      return;
    }

    goToMonth(nextDisplayMonth);
    closePicker();
  };

  return (
    <Box
      ref={containerRef}
      data-slot="calendar-interactive-caption"
      data-view={view}
      className={cn(classNames.caption, view !== 'days' && 'z-20')}
    >
      {showNavigation ? (
        <>
          <Box
            as="button"
            type="button"
            aria-label={previousMonth ? labelPrevious(previousMonth, { locale }) : 'Previous month'}
            className={cn(classNames.nav_button, classNames.nav_button_previous)}
            disabled={!previousMonth}
            onClick={() => previousMonth && goToMonth(previousMonth)}
          >
            {IconLeftComponent ? <IconLeftComponent className={calendarIconVariants()} /> : null}
          </Box>
          <Box
            as="button"
            type="button"
            aria-label={nextMonth ? labelNext(nextMonth, { locale }) : 'Next month'}
            className={cn(classNames.nav_button, classNames.nav_button_next)}
            disabled={!nextMonth}
            onClick={() => nextMonth && goToMonth(nextMonth)}
          >
            {IconRightComponent ? <IconRightComponent className={calendarIconVariants()} /> : null}
          </Box>
        </>
      ) : null}

      {canOpenPicker ? (
        <Box
          as="button"
          type="button"
          id={props.id}
          aria-controls={panelId}
          aria-expanded={view !== 'days'}
          className={calendarInteractiveCaptionTriggerVariants()}
          onClick={handleHeaderClick}
        >
          {formatCaption(props.displayMonth, { locale })}
        </Box>
      ) : (
        <Box id={props.id} className={classNames.caption_label}>
          {formatCaption(props.displayMonth, { locale })}
        </Box>
      )}

      {view !== 'days' ? (
        <Box
          id={panelId}
          role="group"
          aria-label={view === 'years' ? 'Choose year' : 'Choose month'}
          className={cn(calendarPickerPanelVariants(), view === 'years' ? 'h-[13.5rem]' : 'h-[12.25rem]')}
        >
          {view === 'years' ? (
            <Box className={calendarPickerYearsVariants()}>
              {years.map((year) => (
                <Box
                  key={year}
                  as="button"
                  type="button"
                  data-active={year === activeYear}
                  aria-pressed={year === activeYear}
                  className={calendarPickerOptionVariants({
                    selected: year === activeYear,
                    disabled: false,
                  })}
                  onClick={() => handleYearSelect(year)}
                >
                  {year}
                </Box>
              ))}
            </Box>
          ) : (
            <Box className={calendarPickerGridVariants()}>
              {monthOptions.map((monthOption) => (
                <Box
                  key={monthOption.value}
                  as="button"
                  type="button"
                  disabled={monthOption.disabled}
                  data-active={monthOption.value === activeMonth}
                  aria-pressed={monthOption.value === activeMonth}
                  className={calendarPickerOptionVariants({
                    selected: monthOption.value === activeMonth,
                    disabled: monthOption.disabled,
                  })}
                  onClick={() => handleMonthSelect(monthOption.value)}
                >
                  {monthOption.label}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ) : null}
    </Box>
  );
}



