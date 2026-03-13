import type * as React from 'react';

export interface MonthPickerProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'defaultValue' | 'disabled' | 'onChange' | 'size' | 'value'
  > {
  value?: Date | null;
  onChange?: (value: Date | null) => void;
  minMonth?: Date;
  maxMonth?: Date;
  disabled?: boolean;
  clearable?: boolean;
  error?: string | boolean;
  className?: string;
}
