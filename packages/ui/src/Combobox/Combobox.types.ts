import type * as React from 'react';

import { inputVariantValues, type InputVariant } from '../Input/Input.types';

export const comboboxVariantValues = inputVariantValues;
export const comboboxSizeValues = ['xs', 'sm', 'md', 'lg'] as const;
export type ComboboxVariant = InputVariant;
export type ComboboxSize = (typeof comboboxSizeValues)[number];

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
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  variant?: ComboboxVariant;
  size?: ComboboxSize;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  error?: string | boolean;
  label?: string;
  clearable?: boolean;
  createOptionLabel?: string | ((searchValue: string) => string);
  onCreateOption?: (searchValue: string) => void;
  renderOption?: (
    option: ComboboxOption,
    state: ComboboxOptionRenderState,
  ) => React.ReactNode;
  className?: string;
  triggerClassName?: string;
  open?: boolean;
  onClose?: () => void;
}
