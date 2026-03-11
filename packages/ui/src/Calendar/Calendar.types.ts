import type {
  CaptionLayout,
  DateRange,
  DayPickerBase,
  DayPickerMultipleProps,
  DayPickerRangeProps,
  DayPickerSingleProps,
  Matcher,
} from 'react-day-picker';

export const calendarModeValues = ['single', 'multiple', 'range'] as const;
export const calendarCaptionLayoutValues = ['buttons', 'dropdown', 'dropdown-buttons'] as const;

export type CalendarMode = (typeof calendarModeValues)[number];
export type CalendarCaptionLayout = (typeof calendarCaptionLayoutValues)[number];

export interface CalendarBaseProps
  extends Omit<DayPickerBase, 'className' | 'selected' | 'disabled' | 'mode'> {
  className?: string;
  disabled?: Matcher | Matcher[];
  captionLayout?: CaptionLayout;
}

export interface CalendarSingleProps extends CalendarBaseProps {
  mode?: 'single';
  selected?: Date;
  onSelect?: DayPickerSingleProps['onSelect'];
  required?: boolean;
}

export interface CalendarMultipleProps extends CalendarBaseProps {
  mode: 'multiple';
  selected?: Date[];
  onSelect?: DayPickerMultipleProps['onSelect'];
  min?: number;
  max?: number;
}

export interface CalendarRangeProps extends CalendarBaseProps {
  mode: 'range';
  selected?: DateRange;
  onSelect?: DayPickerRangeProps['onSelect'];
  min?: number;
  max?: number;
}

export type CalendarProps = CalendarSingleProps | CalendarMultipleProps | CalendarRangeProps;

export type { DateRange, Matcher };
