import type * as React from 'react';

export interface ComboboxOption {
  label: string;
  value: string;
  disabled?: boolean;
  keywords?: string[];
}

export interface ComboboxOptionRenderState {
  selected: boolean;
  disabled: boolean;
}

export interface ComboboxProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'defaultValue' | 'disabled' | 'onChange' | 'value'
  > {
  value?: string;
  onValueChange?: (value: string | undefined) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  error?: string | boolean;
  label?: string;
  clearable?: boolean;
  renderOption?: (
    option: ComboboxOption,
    state: ComboboxOptionRenderState,
  ) => React.ReactNode;
  className?: string;
  open?: boolean;
  onClose?: () => void;
}
