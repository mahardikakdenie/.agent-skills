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
export const datePickerPresentationValues = ['popover', 'drawer'] as const;
export const datePickerIconPositionValues = ['start', 'end'] as const;

export type DatePickerMode = (typeof datePickerModeValues)[number];
export type DatePickerPresentation = (typeof datePickerPresentationValues)[number];
export type DatePickerIconPosition = (typeof datePickerIconPositionValues)[number];

export type DatePickerClassNames = {
  control?: string;
  trigger?: string;
  triggerIcon?: string;
  triggerText?: string;
  popoverContent?: string;
  drawerContent?: string;
  drawerBody?: string;
  drawerHeader?: string;
  drawerTitle?: string;
  panel?: string;
  calendar?: string;
  timeSection?: string;
  timeInput?: string;
  message?: string;
};

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
  withTime?: boolean;
  minDateTime?: Date;
  maxDateTime?: Date;
  timezone?: string;
  disabled?: boolean;
  clearable?: boolean;
  required?: boolean;
  presentation?: DatePickerPresentation;
  icon?: React.ReactNode;
  iconPosition?: DatePickerIconPosition;
  drawerTitle?: string;
  label?: string;
  placeholder?: string;
  error?: string | boolean;
  open?: boolean;
  onClose?: () => void;
  className?: string;
  classNames?: DatePickerClassNames;
}
