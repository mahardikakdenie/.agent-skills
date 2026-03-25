import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import type * as React from 'react';

export interface DropdownMenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onAction?: (value: string) => void;
  disabled?: boolean;
  modal?: boolean;
  children: React.ReactNode;
}

export interface DropdownMenuContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>, 'asChild' | 'children' | 'className'> {
  className?: string;
  children: React.ReactNode;
}

export interface DropdownMenuSubContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>, 'asChild' | 'children' | 'className'> {
  className?: string;
  children: React.ReactNode;
}

export interface DropdownMenuLabelProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>, 'asChild'> {
  inset?: boolean;
  className?: string;
}

export interface DropdownMenuSeparatorProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>, 'asChild'> {
  className?: string;
}

export interface DropdownMenuItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>, 'asChild' | 'children'> {
  value?: string;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  inset?: boolean;
  destructive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface DropdownMenuCheckboxItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>, 'asChild' | 'children'> {
  value?: string;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  destructive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface DropdownMenuRadioItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>, 'asChild' | 'children'> {
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  destructive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface DropdownMenuSubTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>, 'asChild' | 'children'> {
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  inset?: boolean;
  className?: string;
  children?: React.ReactNode;
}