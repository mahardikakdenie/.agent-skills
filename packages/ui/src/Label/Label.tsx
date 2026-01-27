'use client';

import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import * as React from 'react';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

type LabelRootProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;

export interface LabelProps extends LabelRootProps, VariantProps<typeof labelVariants> {}

export const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, ...props }, ref) => (
    <LabelPrimitive.Root ref={ref} className={clsx(labelVariants(), className)} {...props} />
  ),
);

Label.displayName = LabelPrimitive.Root.displayName;

export { labelVariants };
