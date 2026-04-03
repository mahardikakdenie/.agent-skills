import type * as React from 'react';

import { inputVariantValues, type InputVariant } from '../Input/Input.types';

export const textareaVariantValues = inputVariantValues;

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  variant?: InputVariant;
  error?: string | boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  helperText?: string;
  clearable?: boolean;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onValueChange?: (value: string) => void;
  className?: string;
}
