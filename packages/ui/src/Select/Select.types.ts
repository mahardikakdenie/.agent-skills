import type * as SelectPrimitive from '@radix-ui/react-select';
import type * as React from 'react';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>,
    'children' | 'value' | 'defaultValue' | 'onValueChange' | 'onOpenChange' | 'disabled' | 'required'
  > {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  error?: string | boolean;
  label?: string;
  className?: string;
  onOpen?: () => void;
  onClose?: () => void;
  id?: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
}
