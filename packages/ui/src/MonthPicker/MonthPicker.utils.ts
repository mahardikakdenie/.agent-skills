import { addYears, isAfter, isBefore, setYear, startOfMonth } from 'date-fns';

const monthPickerValueFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'long',
  year: 'numeric',
});

const monthPickerOptionFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
});

export interface MonthPickerOption {
  date: Date;
  disabled: boolean;
  label: string;
}

export interface MonthPickerYearOption {
  active: boolean;
  year: number;
}

export function normalizeMonth(value: Date | null | undefined) {
  if (!value) {
    return null;
  }

  return startOfMonth(value);
}

export function formatMonthPickerValue(value: Date | null | undefined) {
  if (!value) {
    return null;
  }

  return monthPickerValueFormatter.format(value);
}

export function getMonthPickerInitialMonth(
  value: Date | null | undefined,
  minMonth?: Date,
  maxMonth?: Date,
) {
  const selectedMonth = normalizeMonth(value);

  if (selectedMonth) {
    return selectedMonth;
  }

  const normalizedMinMonth = normalizeMonth(minMonth);
  if (normalizedMinMonth) {
    return normalizedMinMonth;
  }

  const normalizedMaxMonth = normalizeMonth(maxMonth);
  if (normalizedMaxMonth) {
    return normalizedMaxMonth;
  }

  return startOfMonth(new Date());
}

export function isMonthWithinBounds(month: Date, minMonth?: Date, maxMonth?: Date) {
  const normalizedMonth = startOfMonth(month);
  const normalizedMinMonth = normalizeMonth(minMonth);
  const normalizedMaxMonth = normalizeMonth(maxMonth);

  if (normalizedMinMonth && isBefore(normalizedMonth, normalizedMinMonth)) {
    return false;
  }

  if (normalizedMaxMonth && isAfter(normalizedMonth, normalizedMaxMonth)) {
    return false;
  }

  return true;
}

export function clampVisibleMonth(month: Date, minMonth?: Date, maxMonth?: Date) {
  const normalizedMonth = startOfMonth(month);
  const normalizedMinMonth = normalizeMonth(minMonth);
  const normalizedMaxMonth = normalizeMonth(maxMonth);

  if (normalizedMinMonth && isBefore(normalizedMonth, normalizedMinMonth)) {
    return normalizedMinMonth;
  }

  if (normalizedMaxMonth && isAfter(normalizedMonth, normalizedMaxMonth)) {
    return normalizedMaxMonth;
  }

  return normalizedMonth;
}

export function getVisibleMonthOptions(visibleMonth: Date, minMonth?: Date, maxMonth?: Date) {
  const visibleYear = visibleMonth.getFullYear();

  return Array.from({ length: 12 }, (_, monthIndex): MonthPickerOption => {
    const optionDate = startOfMonth(new Date(visibleYear, monthIndex, 1));

    return {
      date: optionDate,
      disabled: !isMonthWithinBounds(optionDate, minMonth, maxMonth),
      label: monthPickerOptionFormatter.format(optionDate),
    };
  });
}

export function getYearOptions(visibleMonth: Date, minMonth?: Date, maxMonth?: Date) {
  const normalizedMinMonth = normalizeMonth(minMonth) ?? startOfMonth(new Date(1900, 0, 1));
  const normalizedMaxMonth = normalizeMonth(maxMonth) ?? startOfMonth(new Date(2100, 11, 1));
  const startYear = normalizedMinMonth.getFullYear();
  const endYear = normalizedMaxMonth.getFullYear();
  const activeYear = visibleMonth.getFullYear();

  return Array.from({ length: endYear - startYear + 1 }, (_, index): MonthPickerYearOption => {
    const year = startYear + index;

    return {
      active: year === activeYear,
      year,
    };
  });
}

export function getPreviousYear(visibleMonth: Date) {
  return startOfMonth(addYears(visibleMonth, -1));
}

export function getNextYear(visibleMonth: Date) {
  return startOfMonth(addYears(visibleMonth, 1));
}

export function getVisibleMonthForYear(
  year: number,
  visibleMonth: Date,
  minMonth?: Date,
  maxMonth?: Date,
) {
  return clampVisibleMonth(setYear(visibleMonth, year), minMonth, maxMonth);
}

export function canNavigateToPreviousYear(visibleMonth: Date, minMonth?: Date) {
  return isMonthWithinBounds(getPreviousYear(visibleMonth), minMonth, undefined);
}

export function canNavigateToNextYear(visibleMonth: Date, maxMonth?: Date) {
  return isMonthWithinBounds(getNextYear(visibleMonth), undefined, maxMonth);
}