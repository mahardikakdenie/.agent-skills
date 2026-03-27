import {
  eachDayOfInterval,
  isAfter,
  isBefore,
  isSameDay,
  setHours,
  setMinutes,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import type { Matcher } from 'react-day-picker';

import type {
  DateRangePickerChangeBehavior,
  DateRangePickerPreset,
  DateRangeValue,
} from './DateRangePicker.types';

interface NormalizeDateRangeOptions {
  preserveTime?: boolean;
}

const defaultDisplayDateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
});
const defaultDisplayDateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export const defaultDateRangePickerStartTimeValue = '09:00';
export const defaultDateRangePickerEndTimeValue = '17:00';

function toTimeParts(value: string) {
  const [hoursText, minutesText] = value.split(':');
  const hours = Number.parseInt(hoursText ?? '', 10);
  const minutes = Number.parseInt(minutesText ?? '', 10);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return { hours, minutes };
}

function normalizeBoundary(
  value: Date | undefined,
  preserveTime: boolean,
) {
  if (!value) {
    return undefined;
  }

  const normalized = new Date(value);
  normalized.setSeconds(0, 0);

  return preserveTime ? normalized : startOfDay(normalized);
}

export function normalizeDateRangeValue(
  value?: DateRangeValue | null,
  options?: NormalizeDateRangeOptions,
) {
  if (!value?.from && !value?.to) {
    return null;
  }

  const preserveTime = options?.preserveTime ?? false;
  const from = normalizeBoundary(value?.from, preserveTime);
  const to = normalizeBoundary(value?.to, preserveTime);

  if (from && to && from > to) {
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

export function formatDateRangeValue(
  value?: DateRangeValue | null,
  options?: {
    withTime?: boolean;
  },
) {
  if (!value?.from) {
    return null;
  }

  const formatter = options?.withTime ? defaultDisplayDateTimeFormatter : defaultDisplayDateFormatter;
  const fromLabel = formatter.format(value.from);

  if (!value.to) {
    return `${fromLabel} - ...`;
  }

  return `${fromLabel} - ${formatter.format(value.to)}`;
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

export function shouldEmitDateRangeChange(
  value: DateRangeValue | null,
  changeBehavior: DateRangePickerChangeBehavior,
) {
  if (!value) {
    return true;
  }

  return changeBehavior === 'partial' || isDateRangeComplete(value);
}

export function areDateRangesEqual(
  left?: DateRangeValue | null,
  right?: DateRangeValue | null,
  options?: NormalizeDateRangeOptions,
) {
  const normalizedLeft = normalizeDateRangeValue(left, options);
  const normalizedRight = normalizeDateRangeValue(right, options);

  if (!normalizedLeft && !normalizedRight) {
    return true;
  }

  if (!normalizedLeft || !normalizedRight) {
    return false;
  }

  const sameBoundary = (leftBoundary?: Date, rightBoundary?: Date) => {
    if (!leftBoundary && !rightBoundary) {
      return true;
    }

    if (!leftBoundary || !rightBoundary) {
      return false;
    }

    if (options?.preserveTime) {
      return leftBoundary.getTime() === rightBoundary.getTime();
    }

    return isSameDay(leftBoundary, rightBoundary);
  };

  return (
    sameBoundary(normalizedLeft.from, normalizedRight.from) &&
    sameBoundary(normalizedLeft.to, normalizedRight.to)
  );
}

export function hasDateRangeValue(value?: DateRangeValue | null) {
  return Boolean(value?.from || value?.to);
}

export function isDateRangeOutsideBounds(
  value: DateRangeValue,
  minDate?: Date,
  maxDate?: Date,
  options?: NormalizeDateRangeOptions,
) {
  const normalizedValue = normalizeDateRangeValue(value, options);

  if (!normalizedValue) {
    return false;
  }

  const preserveTime = options?.preserveTime ?? false;
  const min = normalizeBoundary(minDate, preserveTime);
  const max = normalizeBoundary(maxDate, preserveTime);

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
  options?: NormalizeDateRangeOptions,
) {
  return (presets ?? []).map((preset) => {
    const normalizedValue = normalizeDateRangeValue(preset.value, options) ?? {};

    return {
      ...preset,
      value: normalizedValue,
      disabled: isDateRangeOutsideBounds(normalizedValue, minDate, maxDate, options),
    };
  });
}

export function getDateRangePreviewModifiers(
  value: DateRangeValue | null | undefined,
  hoveredDate: Date | undefined,
) {
  if (!value?.from || value.to || !hoveredDate) {
    return null;
  }

  const anchorDate = startOfDay(value.from);

  if (isSameDay(anchorDate, hoveredDate)) {
    return null;
  }

  const previewStart = isBefore(hoveredDate, anchorDate) ? hoveredDate : anchorDate;
  const previewEnd = isAfter(hoveredDate, anchorDate) ? hoveredDate : anchorDate;
  const previewDays = eachDayOfInterval({
    start: previewStart,
    end: previewEnd,
  });
  const middleDays = previewDays.slice(1, -1);
  const isBackward = isBefore(hoveredDate, anchorDate);

  return {
    isBackward,
    modifiers: {
      preview: middleDays,
      previewEnd: [hoveredDate],
    },
  };
}

export function formatDateRangePickerTimeValue(
  value: Date | null | undefined,
  fallback = defaultDateRangePickerStartTimeValue,
) {
  if (!value) {
    return fallback;
  }

  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

export function applyTimeValueToDate(date: Date, timeValue: string) {
  const parts = toTimeParts(timeValue);

  if (!parts) {
    return normalizeBoundary(date, true) as Date;
  }

  return normalizeBoundary(
    setHours(setMinutes(date, parts.minutes), parts.hours),
    true,
  ) as Date;
}

export function clampDateRangeBoundary(
  value: Date,
  minDateTime?: Date,
  maxDateTime?: Date,
) {
  const normalizedValue = normalizeBoundary(value, true) as Date;
  const normalizedMin = normalizeBoundary(minDateTime, true);
  const normalizedMax = normalizeBoundary(maxDateTime, true);

  if (normalizedMin && normalizedValue < normalizedMin) {
    return normalizedMin;
  }

  if (normalizedMax && normalizedValue > normalizedMax) {
    return normalizedMax;
  }

  return normalizedValue;
}

export function getDateRangePickerTimeBounds(
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
        ? formatDateRangePickerTimeValue(minDateTime)
        : undefined,
    max:
      maxDateTime && isSameDay(selectedDate, maxDateTime)
        ? formatDateRangePickerTimeValue(maxDateTime)
        : undefined,
  };
}
