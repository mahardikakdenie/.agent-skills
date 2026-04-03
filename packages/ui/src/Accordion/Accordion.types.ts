import type * as AccordionPrimitive from '@radix-ui/react-accordion';
import type * as React from 'react';

import type { DisplaySurfaceVariant } from '../utils/display-surface-variants';

export const accordionTypeValues = ['single', 'multiple'] as const;

export type AccordionType = (typeof accordionTypeValues)[number];

interface AccordionBaseProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange'
> {
  children?: React.ReactNode;
  variant?: DisplaySurfaceVariant;
  className?: string;
}

export interface AccordionSingleProps extends AccordionBaseProps {
  type?: 'single';
  collapsible?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export interface AccordionMultipleProps extends AccordionBaseProps {
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

export type AccordionItemProps = Omit<
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>,
  'asChild' | 'className'
> & {
  variant?: DisplaySurfaceVariant;
  className?: string;
};

export type AccordionHeaderProps = Omit<
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Header>,
  'asChild' | 'className'
> & {
  className?: string;
};

export type AccordionTriggerProps = Omit<
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>,
  'asChild' | 'className'
> & {
  className?: string;
};

export type AccordionContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>,
  'asChild' | 'className'
> & {
  className?: string;
};
