import type * as React from 'react';

import { type InputVariant } from '../Input/Input.types';

export type FileUploadValue = File | File[] | null;
export type FileUploadDisplayValue = string | string[] | null;

export interface FileUploadProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'accept' | 'children' | 'defaultValue' | 'disabled' | 'multiple' | 'onChange' | 'size' | 'type' | 'value'
  > {
  value?: FileUploadValue;
  onChange?: (file: FileUploadValue) => void;
  displayValue?: FileUploadDisplayValue;
  accept?: string;
  multiple?: boolean;
  variant?: InputVariant;
  disabled?: boolean;
  maxSize?: number;
  error?: string | boolean;
  clearable?: boolean;
  onClear?: () => void;
  label?: string;
  className?: string;
}
