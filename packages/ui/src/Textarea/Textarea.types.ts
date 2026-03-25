import type * as React from 'react';

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
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
