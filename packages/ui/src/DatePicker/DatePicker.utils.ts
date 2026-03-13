import { isSameDay, setHours, setMinutes, startOfDay, startOfMonth } from 'date-fns';
import type { Matcher } from 'react-day-picker';

const defaultDisplayDateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
});
const defaultDisplayDateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export const defaultDatePickerTimeValue = '09:00';

function toTimeParts(value: string) {
  const [hoursText, minutesText] = value.split(':');
  const hours = Number.parseInt(hoursText ?? '', 10);
  const minutes = Number.parseInt(minutesText ?? '', 10);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return { hours, minutes };
}

export function normalizeDatePickerValue(
  value: Date | null | undefined,
  withTime = false,
) {
  if (!value) {
    return null;
  }

  const normalized = new Date(value);
  normalized.setSeconds(0, 0);

  return withTime ? normalized : startOfDay(normalized);
}

export function formatDatePickerValue(
  value: Date | null | undefined,
  formatDate?: (date: Date) => string,
  options?: {
    withTime?: boolean;
  },
) {
  if (!value) {
    return null;
  }

  if (formatDate) {
    return formatDate(value);
  }

  return (options?.withTime ? defaultDisplayDateTimeFormatter : defaultDisplayDateFormatter).format(
    value,
  );
}

export function getDatePickerDisabledMatchers(
  minDate?: Date,
  maxDate?: Date,
): Matcher[] | undefined {
  const matchers: Matcher[] = [];

  if (minDate) {
    matchers.push({ before: startOfDay(minDate) });
  }

  if (maxDate) {
    matchers.push({ after: startOfDay(maxDate) });
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

export function formatDatePickerTimeValue(value: Date | null | undefined) {
  if (!value) {
    return defaultDatePickerTimeValue;
  }

  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

export function applyTimeValueToDate(date: Date, timeValue: string) {
  const parts = toTimeParts(timeValue);

  if (!parts) {
    return normalizeDatePickerValue(date, true) as Date;
  }

  return normalizeDatePickerValue(
    setHours(setMinutes(date, parts.minutes), parts.hours),
    true,
  ) as Date;
}

export function clampDatePickerValue(
  value: Date,
  minDateTime?: Date,
  maxDateTime?: Date,
) {
  const normalizedValue = normalizeDatePickerValue(value, true) as Date;
  const normalizedMin = normalizeDatePickerValue(minDateTime, true);
  const normalizedMax = normalizeDatePickerValue(maxDateTime, true);

  if (normalizedMin && normalizedValue < normalizedMin) {
    return normalizedMin;
  }

  if (normalizedMax && normalizedValue > normalizedMax) {
    return normalizedMax;
  }

  return normalizedValue;
}

export function getDatePickerTimeBounds(
  selectedDate: Date | null | undefined,
  minDateTime?: Date,
  maxDateTime?: Date,
) {
  if (!selectedDate) {
    return { min: undefined, max: undefined };
  }

  return {
    min:
      minDateTime && isSameDay(selectedDate, minDateTime)
        ? formatDatePickerTimeValue(minDateTime)
        : undefined,
    max:
      maxDateTime && isSameDay(selectedDate, maxDateTime)
        ? formatDatePickerTimeValue(maxDateTime)
        : undefined,
  };
}
