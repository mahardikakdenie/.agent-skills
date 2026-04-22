import type * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import type * as React from 'react';

export const checkboxSizeValues = ['sm', 'md', 'lg'] as const;

export type CheckboxSize = (typeof checkboxSizeValues)[number];
export type CheckboxCheckedState = CheckboxPrimitive.CheckedState;

export interface CheckboxProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    'asChild' | 'checked' | 'children' | 'className' | 'defaultChecked' | 'onCheckedChange'
  > {
  checked?: CheckboxCheckedState;
  defaultChecked?: CheckboxCheckedState;
  onCheckedChange?: (checked: CheckboxCheckedState) => void;
  label?: string;
  description?: string;
  error?: string | boolean;
  size?: CheckboxSize;
  className?: string;
  labelClassName?: string;
}
