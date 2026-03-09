import * as LabelPrimitive from '@radix-ui/react-label';
import * as React from 'react';

export const labelToneValues = ['default', 'muted', 'destructive'] as const;

export type LabelTone = (typeof labelToneValues)[number];

export interface LabelProps
  extends Omit<React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>, 'asChild'> {
  tone?: LabelTone;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}
