import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type * as React from 'react';

export const tooltipAlignValues = ['start', 'center', 'end'] as const;
export const tooltipSideValues = ['top', 'right', 'bottom', 'left'] as const;

export type TooltipAlign = (typeof tooltipAlignValues)[number];
export type TooltipSide = (typeof tooltipSideValues)[number];

export interface TooltipProviderProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>, 'children'> {
  children: React.ReactNode;
}

export interface TooltipProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  delayDuration?: number;
  disableHoverableContent?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export interface TooltipContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>, 'asChild' | 'children' | 'className'> {
  align?: TooltipAlign;
  side?: TooltipSide;
  sideOffset?: number;
  className?: string;
  children: React.ReactNode;
}

export interface TooltipArrowProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>, 'asChild'> {
  className?: string;
}
