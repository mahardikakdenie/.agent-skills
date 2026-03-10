import type * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

export const dialogSizeValues = ['sm', 'md', 'lg', 'xl', 'full'] as const;

export type DialogSize = (typeof dialogSizeValues)[number];

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

export interface DialogContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    'asChild' | 'children' | 'className'
  > {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  size?: DialogSize;
  className?: string;
  children: React.ReactNode;
}

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface DialogTitleProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>, 'asChild'> {
  className?: string;
}

export interface DialogDescriptionProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>, 'asChild'> {
  className?: string;
}
