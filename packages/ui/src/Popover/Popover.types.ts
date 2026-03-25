import * as PopoverPrimitive from '@radix-ui/react-popover';
import type * as React from 'react';

export const popoverAlignValues = ['start', 'center', 'end'] as const;
export const popoverSideValues = ['top', 'right', 'bottom', 'left'] as const;

export type PopoverAlign = (typeof popoverAlignValues)[number];
export type PopoverSide = (typeof popoverSideValues)[number];

export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  children: React.ReactNode;
}

export interface PopoverContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>, 'asChild' | 'children' | 'className'> {
  align?: PopoverAlign;
  side?: PopoverSide;
  sideOffset?: number;
  className?: string;
  children: React.ReactNode;
}
