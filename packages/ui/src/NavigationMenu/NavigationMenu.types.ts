import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import type * as React from 'react';

export interface NavigationMenuProps
  extends Omit<React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>, 'children' | 'className'> {
  className?: string;
  children: React.ReactNode;
}

export interface NavigationMenuListProps
  extends Omit<React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>, 'asChild'> {
  className?: string;
  children?: React.ReactNode;
}

export interface NavigationMenuItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>, 'asChild'> {
  className?: string;
  children?: React.ReactNode;
}

export interface NavigationMenuTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>, 'asChild'> {
  className?: string;
  children?: React.ReactNode;
}

export interface NavigationMenuContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>, 'asChild' | 'children'> {
  className?: string;
  children: React.ReactNode;
}

export interface NavigationMenuLinkProps
  extends Omit<React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>, 'asChild' | 'className'> {
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface NavigationMenuIndicatorProps
  extends Omit<React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>, 'asChild' | 'children'> {
  className?: string;
}

export interface NavigationMenuViewportProps
  extends Omit<React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>, 'asChild' | 'children'> {
  className?: string;
}
