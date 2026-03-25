import type * as React from 'react';

export const inputVariantValues = ['default', 'outline', 'ghost'] as const;
export const inputSizeValues = ['xs', 'sm', 'md', 'lg'] as const;
export const inputModeValues = ['text', 'email', 'phone', 'currency', 'number', 'password'] as const;

export type InputVariant = (typeof inputVariantValues)[number];
export type InputSize = (typeof inputSizeValues)[number];
export type InputMode = (typeof inputModeValues)[number];

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'inputMode' | 'onChange' | 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  inputMode?: InputMode;
  error?: string | boolean;
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onValueChange?: (value: string) => void;
  className?: string;
}
