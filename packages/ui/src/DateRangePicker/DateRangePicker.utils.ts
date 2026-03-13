import {
  eachDayOfInterval,
  isAfter,
  isBefore,
  isSameDay,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import type { Matcher } from 'react-day-picker';

import type { DateRangePickerPreset, DateRangeValue } from './DateRangePicker.types';

const defaultDisplayDateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
});

export function normalizeDateRangeValue(value?: DateRangeValue | null) {
  if (!value?.from && !value?.to) {
    return null;
  }

  const from = value?.from ? startOfDay(value.from) : undefined;
  const to = value?.to ? startOfDay(value.to) : undefined;

  if (from && to && isAfter(from, to)) {
    return {
      from: to,
      to: from,
    };
  }

  return {
    from,
    to,
  };
}

export function formatDateRangeValue(value?: DateRangeValue | null) {
  if (!value?.from) {
    return null;
  }

  const fromLabel = defaultDisplayDateFormatter.format(value.from);

  if (!value.to) {
    return `${fromLabel} - ...`;
  }

  return `${fromLabel} - ${defaultDisplayDateFormatter.format(value.to)}`;
}

export function getDateRangePickerDisabledMatchers(
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

export function getDateRangePickerInitialMonth(
  value?: DateRangeValue | null,
  minDate?: Date,
  maxDate?: Date,
) {
  if (value?.from) {
    return startOfMonth(value.from);
  }

  if (value?.to) {
    return startOfMonth(value.to);
  }

  if (minDate) {
    return startOfMonth(minDate);
  }

  if (maxDate) {
    return startOfMonth(maxDate);
  }

  return startOfMonth(new Date());
}

export function isDateRangeComplete(value?: DateRangeValue | null) {
  return Boolean(value?.from && value?.to);
}

export function areDateRangesEqual(
  left?: DateRangeValue | null,
  right?: DateRangeValue | null,
) {
  const normalizedLeft = normalizeDateRangeValue(left);
  const normalizedRight = normalizeDateRangeValue(right);

  if (!normalizedLeft && !normalizedRight) {
    return true;
  }

  if (!normalizedLeft || !normalizedRight) {
    return false;
  }

  const sameFrom =
    (!normalizedLeft.from && !normalizedRight.from) ||
    (normalizedLeft.from &&
      normalizedRight.from &&
      isSameDay(normalizedLeft.from, normalizedRight.from));
  const sameTo =
    (!normalizedLeft.to && !normalizedRight.to) ||
    (normalizedLeft.to && normalizedRight.to && isSameDay(normalizedLeft.to, normalizedRight.to));

  return sameFrom && sameTo;
}

export function hasDateRangeValue(value?: DateRangeValue | null) {
  return Boolean(value?.from || value?.to);
}

export function isDateRangeOutsideBounds(
  value: DateRangeValue,
  minDate?: Date,
  maxDate?: Date,
) {
  const normalizedValue = normalizeDateRangeValue(value);

  if (!normalizedValue) {
    return false;
  }

  const min = minDate ? startOfDay(minDate) : undefined;
  const max = maxDate ? startOfDay(maxDate) : undefined;

  if (normalizedValue.from && min && isBefore(normalizedValue.from, min)) {
    return true;
  }

  if (normalizedValue.to && min && isBefore(normalizedValue.to, min)) {
    return true;
  }

  if (normalizedValue.from && max && isAfter(normalizedValue.from, max)) {
    return true;
  }

  if (normalizedValue.to && max && isAfter(normalizedValue.to, max)) {
    return true;
  }

  return false;
}

export function getEnabledDateRangePresets(
  presets: DateRangePickerPreset[] | undefined,
  minDate?: Date,
  maxDate?: Date,
) {
  return (presets ?? []).map((preset) => ({
    ...preset,
    disabled: isDateRangeOutsideBounds(preset.value, minDate, maxDate),
  }));
}

export function getDateRangePreviewModifiers(
  value: DateRangeValue | null | undefined,
  hoveredDate: Date | undefined,
) {
  const normalizedValue = normalizeDateRangeValue(value);

  if (!normalizedValue?.from || normalizedValue.to || !hoveredDate) {
    return null;
  }

  if (isSameDay(normalizedValue.from, hoveredDate)) {
    return null;
  }

  const previewStart = isBefore(hoveredDate, normalizedValue.from) ? hoveredDate : normalizedValue.from;
  const previewEnd = isAfter(hoveredDate, normalizedValue.from) ? hoveredDate : normalizedValue.from;
  const previewDays = eachDayOfInterval({
    start: previewStart,
    end: previewEnd,
  });
  const middleDays = previewDays.slice(1, -1);
  const isBackward = isBefore(hoveredDate, normalizedValue.from);

  return {
    isBackward,
    modifiers: {
      preview: middleDays,
      previewEnd: [hoveredDate],
    },
  };
}
