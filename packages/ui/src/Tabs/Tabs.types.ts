import type * as TabsPrimitive from '@radix-ui/react-tabs';
import type * as React from 'react';

import type { NavigationSurfaceVariantProp } from '../utils/navigation-surface-variants';

export const tabsOrientationValues = ['horizontal', 'vertical'] as const;

export type TabsOrientation = (typeof tabsOrientationValues)[number];

export interface TabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange' | 'value'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: TabsOrientation;
  variant?: NavigationSurfaceVariantProp;
  children?: React.ReactNode;
  className?: string;
}

export type TabsListProps = Omit<
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
  'asChild' | 'className'
> & {
  className?: string;
};

export type TabsTriggerProps = Omit<
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
  'asChild' | 'className'
> & {
  variant?: NavigationSurfaceVariantProp;
  className?: string;
};

export type TabsContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>,
  'asChild' | 'className'
> & {
  className?: string;
};
