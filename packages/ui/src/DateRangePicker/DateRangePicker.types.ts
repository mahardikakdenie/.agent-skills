import type * as React from 'react';
import {
  inputSizeValues,
  type InputSize,
  inputVariantValues,
  type InputVariant,
} from '../Input/Input.types';

export const dateRangePickerVariantValues = inputVariantValues;
export const dateRangePickerSizeValues = inputSizeValues;
export const dateRangePickerChangeBehaviorValues = ['partial', 'complete'] as const;

export type DateRangePickerChangeBehavior = (typeof dateRangePickerChangeBehaviorValues)[number];

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
  variant?: InputVariant;
  size?: InputSize;
  value?: DateRangeValue | null;
  onChange?: (value: DateRangeValue | null) => void;
  changeBehavior?: DateRangePickerChangeBehavior;
  presets?: DateRangePickerPreset[];
  minDate?: Date;
  maxDate?: Date;
  withTime?: boolean;
  minDateTime?: Date;
  maxDateTime?: Date;
  timezone?: string;
  disabled?: boolean;
  clearable?: boolean;
  error?: string | boolean;
  className?: string;
}
