'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import { popoverContentVariants } from './Popover.variants';
import type { PopoverContentProps, PopoverProps } from './Popover.types';

/**
 * Shared non-modal floating surface for contextual details, compact form
 * layouts, and anchored inline overlays.
 */
export function Popover({ open, defaultOpen, onOpen, onClose, children }: PopoverProps) {
  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        onOpen?.();
      } else {
        onClose?.();
      }
    },
    [onClose, onOpen],
  );

  return (
    <PopoverPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={handleOpenChange}>
      {children}
    </PopoverPrimitive.Root>
  );
}

Popover.displayName = 'Popover';

export const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(({ ...props }, ref) => <PopoverPrimitive.Trigger ref={ref} {...props} />);

PopoverTrigger.displayName = 'PopoverTrigger';

export const PopoverAnchor = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Anchor>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor>
>(({ ...props }, ref) => <PopoverPrimitive.Anchor ref={ref} {...props} />);

PopoverAnchor.displayName = 'PopoverAnchor';

export const PopoverClose = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Close>
>(({ ...props }, ref) => <PopoverPrimitive.Close ref={ref} {...props} />);

PopoverClose.displayName = 'PopoverClose';

export const PopoverPortal = PopoverPrimitive.Portal;

export const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      align = 'center',
      side = 'bottom',
      sideOffset = 8,
      collisionPadding = 8,
      className,
      children,
      ...props
    },
    ref,
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        side={side}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        asChild
        {...props}
      >
        <Box data-slot="popover-content" className={cn(popoverContentVariants(), className)}>
          {children}
        </Box>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  ),
);

PopoverContent.displayName = 'PopoverContent';
