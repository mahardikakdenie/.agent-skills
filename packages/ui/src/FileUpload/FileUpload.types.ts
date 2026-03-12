import type * as React from 'react';

export type FileUploadValue = File | File[] | null;

export interface FileUploadProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'accept' | 'children' | 'defaultValue' | 'disabled' | 'multiple' | 'onChange' | 'size' | 'type' | 'value'
  > {
  value?: FileUploadValue;
  onChange?: (file: FileUploadValue) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  maxSize?: number;
  error?: string | boolean;
  clearable?: boolean;
  onClear?: () => void;
  label?: string;
  className?: string;
}
