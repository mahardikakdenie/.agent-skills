import * as MenubarPrimitive from '@radix-ui/react-menubar';
import type * as React from 'react';

import type { NavigationSurfaceVariantProp } from '../utils/navigation-surface-variants';

export interface MenubarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>, 'children' | 'className'> {
  /**
   * Disables all top-level triggers through shared root context.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * Shared action callback invoked by items that provide a `value`.
   */
  onAction?: (value: string) => void;
  variant?: NavigationSurfaceVariantProp;
  className?: string;
  children: React.ReactNode;
}

export type MenubarMenuProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Menu>;

export interface MenubarTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>, 'asChild'> {
  variant?: NavigationSurfaceVariantProp;
  className?: string;
  children?: React.ReactNode;
}

export interface MenubarContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>, 'asChild' | 'children' | 'className'> {
  className?: string;
  children: React.ReactNode;
}

export interface MenubarSubContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>, 'asChild' | 'children' | 'className'> {
  className?: string;
  children: React.ReactNode;
}

export interface MenubarGroupProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Group>, 'asChild'> {
  className?: string;
  children?: React.ReactNode;
}

export interface MenubarLabelProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label>, 'asChild'> {
  inset?: boolean;
  className?: string;
}

export interface MenubarSeparatorProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>, 'asChild'> {
  className?: string;
}

export interface MenubarItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item>, 'asChild' | 'children'> {
  value?: string;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  inset?: boolean;
  destructive?: boolean;
  variant?: NavigationSurfaceVariantProp;
  className?: string;
  children?: React.ReactNode;
}

export interface MenubarCheckboxItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>, 'asChild' | 'children'> {
  value?: string;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  destructive?: boolean;
  variant?: NavigationSurfaceVariantProp;
  className?: string;
  children?: React.ReactNode;
}

export interface MenubarRadioGroupProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioGroup>, 'asChild'> {
  className?: string;
  children?: React.ReactNode;
}

export interface MenubarRadioItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>, 'asChild' | 'children'> {
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  destructive?: boolean;
  variant?: NavigationSurfaceVariantProp;
  className?: string;
  children?: React.ReactNode;
}

export interface MenubarSubProps extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Sub> {
  children?: React.ReactNode;
}

export interface MenubarSubTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger>, 'asChild' | 'children'> {
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  inset?: boolean;
  variant?: NavigationSurfaceVariantProp;
  className?: string;
  children?: React.ReactNode;
}

export type MenubarPortalProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Portal>;

export type MenubarShortcutProps = React.HTMLAttributes<HTMLSpanElement>;
