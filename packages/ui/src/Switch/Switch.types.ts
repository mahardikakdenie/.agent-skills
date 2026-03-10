import type * as React from 'react';
import type * as SwitchPrimitive from '@radix-ui/react-switch';

export const switchSizeValues = ['sm', 'md', 'lg'] as const;

export type SwitchSize = (typeof switchSizeValues)[number];

export interface SwitchProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    'asChild' | 'checked' | 'children' | 'className' | 'defaultChecked' | 'onCheckedChange'
  > {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  error?: string | boolean;
  size?: SwitchSize;
  className?: string;
}
