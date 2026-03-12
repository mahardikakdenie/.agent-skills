import { startOfMonth } from 'date-fns';
import type { Matcher } from 'react-day-picker';

const defaultDisplayDateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
});

export function formatDatePickerValue(
  value: Date | null | undefined,
  formatDate?: (date: Date) => string,
) {
  if (!value) {
    return null;
  }

  if (formatDate) {
    return formatDate(value);
  }

  return defaultDisplayDateFormatter.format(value);
}

export function getDatePickerDisabledMatchers(
  minDate?: Date,
  maxDate?: Date,
): Matcher[] | undefined {
  const matchers: Matcher[] = [];

  if (minDate) {
    matchers.push({ before: minDate });
  }

  if (maxDate) {
    matchers.push({ after: maxDate });
  }

  return matchers.length > 0 ? matchers : undefined;
}

export function getDatePickerInitialMonth(
  value: Date | null | undefined,
  minDate?: Date,
  maxDate?: Date,
) {
  if (value) {
    return startOfMonth(value);
  }

  if (minDate) {
    return startOfMonth(minDate);
  }

  if (maxDate) {
    return startOfMonth(maxDate);
  }

  return startOfMonth(new Date());
}
