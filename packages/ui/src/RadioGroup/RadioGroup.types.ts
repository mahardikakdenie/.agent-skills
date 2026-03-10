import type * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import type * as React from 'react';

export const radioGroupOrientationValues = ['horizontal', 'vertical'] as const;
export const radioGroupSizeValues = ['sm', 'md', 'lg'] as const;

export type RadioGroupOrientation = (typeof radioGroupOrientationValues)[number];
export type RadioGroupSize = (typeof radioGroupSizeValues)[number];

export interface RadioGroupProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
    'asChild' | 'children' | 'className' | 'orientation'
  > {
  orientation?: RadioGroupOrientation;
  size?: RadioGroupSize;
  error?: string | boolean;
  children: React.ReactNode;
  className?: string;
}

export interface RadioGroupItemProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    'asChild' | 'children' | 'className'
  > {
  label?: string;
  description?: string;
  className?: string;
}
