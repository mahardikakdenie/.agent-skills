import type * as React from 'react';

export interface DateTimePickerProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'defaultValue' | 'disabled' | 'onChange' | 'value'
  > {
  value?: Date | null;
  onChange?: (value: Date | null) => void;
  minDateTime?: Date;
  maxDateTime?: Date;
  timezone?: string;
  disabled?: boolean;
  clearable?: boolean;
  error?: string | boolean;
  className?: string;
}
