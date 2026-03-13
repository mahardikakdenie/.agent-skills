import type * as React from 'react';

export interface DateRangeValue {
  from?: Date;
  to?: Date;
}

export interface DateRangePickerPreset {
  label: string;
  value: DateRangeValue;
}

export interface DateRangePickerProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'defaultValue' | 'disabled' | 'onChange' | 'size' | 'value'
  > {
  value?: DateRangeValue | null;
  onChange?: (value: DateRangeValue | null) => void;
  presets?: DateRangePickerPreset[];
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  clearable?: boolean;
  error?: string | boolean;
  className?: string;
}
