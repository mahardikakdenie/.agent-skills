import type * as React from 'react';
import {
  inputSizeValues,
  type InputSize,
  inputVariantValues,
  type InputVariant,
} from '../Input/Input.types';

export const monthPickerVariantValues = inputVariantValues;
export const monthPickerSizeValues = inputSizeValues;

export interface MonthPickerProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'defaultValue' | 'disabled' | 'onChange' | 'size' | 'value'
  > {
  variant?: InputVariant;
  size?: InputSize;
  value?: Date | null;
  onChange?: (value: Date | null) => void;
  minMonth?: Date;
  maxMonth?: Date;
  disabled?: boolean;
  clearable?: boolean;
  placeholder?: string;
  error?: string | boolean;
  className?: string;
}
