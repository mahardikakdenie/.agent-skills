import type * as SelectPrimitive from '@radix-ui/react-select';
import type * as React from 'react';

import { inputVariantValues, type InputVariant } from '../Input/Input.types';

export const selectVariantValues = inputVariantValues;
export const selectSizeValues = ['xs', 'sm', 'md', 'lg'] as const;

export type SelectVariant = InputVariant;
export type SelectSize = (typeof selectSizeValues)[number];

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectOptionRenderState {
  selected: boolean;
  disabled: boolean;
}

interface SelectBaseProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>,
    'children' | 'value' | 'defaultValue' | 'onValueChange' | 'onOpenChange' | 'disabled' | 'required'
  > {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  placeholder?: string;
  variant?: SelectVariant;
  size?: SelectSize;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  error?: string | boolean;
  label?: string;
  clearable?: boolean;
  renderOption?: (
    option: SelectOption,
    state: SelectOptionRenderState,
  ) => React.ReactNode;
  className?: string;
  onOpen?: () => void;
  onClose?: () => void;
  id?: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
}

export interface SelectFlatProps extends SelectBaseProps {
  options: SelectOption[];
  children?: never;
}

export interface SelectCompoundProps extends SelectBaseProps {
  children: React.ReactNode;
  options?: never;
}

export type SelectProps = SelectFlatProps | SelectCompoundProps;

export type SelectTriggerProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>;
export type SelectValueProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>;
export type SelectContentProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>;
export type SelectGroupProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Group>;
export type SelectLabelProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>;
export type SelectItemProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>;
export type SelectSeparatorProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>;
export type SelectScrollUpButtonProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>;
export type SelectScrollDownButtonProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>;
