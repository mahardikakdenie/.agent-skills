import { isSameDay, setHours, setMinutes, startOfDay, startOfMonth } from 'date-fns';
import type { Matcher } from 'react-day-picker';

const defaultDateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export const defaultDateTimePickerTimeValue = '09:00';

function toTimeParts(value: string) {
  const [hoursText, minutesText] = value.split(':');
  const hours = Number.parseInt(hoursText ?? '', 10);
  const minutes = Number.parseInt(minutesText ?? '', 10);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return { hours, minutes };
}

export function normalizeDateTimeValue(value: Date | null | undefined) {
  if (!value) {
    return null;
  }

  const normalized = new Date(value);
  normalized.setSeconds(0, 0);
  return normalized;
}

export function formatDateTimePickerValue(value: Date | null | undefined) {
  if (!value) {
    return null;
  }

  return defaultDateTimeFormatter.format(value);
}

export function formatDateTimePickerTimeValue(value: Date | null | undefined) {
  if (!value) {
    return defaultDateTimePickerTimeValue;
  }

  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

export function getDateTimePickerDisabledMatchers(
  minDateTime?: Date,
  maxDateTime?: Date,
): Matcher[] | undefined {
  const matchers: Matcher[] = [];

  if (minDateTime) {
    matchers.push({ before: startOfDay(minDateTime) });
  }

  if (maxDateTime) {
    matchers.push({ after: startOfDay(maxDateTime) });
  }

  return matchers.length > 0 ? matchers : undefined;
}

export function getDateTimePickerInitialMonth(
  value: Date | null | undefined,
  minDateTime?: Date,
  maxDateTime?: Date,
) {
  if (value) {
    return startOfMonth(value);
  }

  if (minDateTime) {
    return startOfMonth(minDateTime);
  }

  if (maxDateTime) {
    return startOfMonth(maxDateTime);
  }

  return startOfMonth(new Date());
}

export function applyTimeValueToDate(date: Date, timeValue: string) {
  const parts = toTimeParts(timeValue);

  if (!parts) {
    return normalizeDateTimeValue(date) as Date;
  }

  return normalizeDateTimeValue(setHours(setMinutes(date, parts.minutes), parts.hours)) as Date;
}

export function clampDateTimeValue(
  value: Date,
  minDateTime?: Date,
  maxDateTime?: Date,
) {
  const normalizedValue = normalizeDateTimeValue(value) as Date;
  const normalizedMin = normalizeDateTimeValue(minDateTime);
  const normalizedMax = normalizeDateTimeValue(maxDateTime);

  if (normalizedMin && normalizedValue < normalizedMin) {
    return normalizedMin;
  }

  if (normalizedMax && normalizedValue > normalizedMax) {
    return normalizedMax;
  }

  return normalizedValue;
}

export function getDateTimePickerTimeBounds(
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
        ? formatDateTimePickerTimeValue(minDateTime)
        : undefined,
    max:
      maxDateTime && isSameDay(selectedDate, maxDateTime)
        ? formatDateTimePickerTimeValue(maxDateTime)
        : undefined,
  };
}
