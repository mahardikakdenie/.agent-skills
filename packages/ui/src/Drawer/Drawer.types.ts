import type * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

export const drawerDirectionValues = ['bottom', 'right', 'left', 'top'] as const;

export type DrawerDirection = (typeof drawerDirectionValues)[number];

export interface DrawerProps {
  open?: boolean;
  onClose?: () => void;
  direction?: DrawerDirection;
  handleOnly?: boolean;
  children: React.ReactNode;
}

export interface DrawerContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>, 'children' | 'className'> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface DrawerTitleProps extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title> {
  className?: string;
}

export interface DrawerDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description> {
  className?: string;
}
