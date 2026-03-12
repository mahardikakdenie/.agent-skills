import type * as React from 'react';
import {
  inputSizeValues,
  type InputSize,
  inputVariantValues,
  type InputVariant,
} from '../Input/Input.types';

export const datePickerModeValues = ['single'] as const;
export const datePickerVariantValues = inputVariantValues;
export const datePickerSizeValues = inputSizeValues;

export type DatePickerMode = (typeof datePickerModeValues)[number];

export interface DatePickerProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'defaultValue' | 'disabled' | 'onChange' | 'size' | 'value'
  > {
  variant?: InputVariant;
  size?: InputSize;
  formatDate?: (date: Date) => string;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  mode?: DatePickerMode;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  clearable?: boolean;
  required?: boolean;
  label?: string;
  placeholder?: string;
  error?: string | boolean;
  open?: boolean;
  onClose?: () => void;
  className?: string;
}
