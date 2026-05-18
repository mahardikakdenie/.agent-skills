'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import {
  dialogActionsVariants,
  dialogBodyVariants,
  dialogContentVariants,
  dialogDescriptionVariants,
  dialogFooterVariants,
  dialogHeaderVariants,
  dialogOverlayVariants,
  dialogTitleVariants,
} from './Dialog.variants';
import type {
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogProps,
  DialogTitleProps,
} from './Dialog.types';

function hasDisplayName(node: React.ReactNode, displayName: string): boolean {
  return React.Children.toArray(node).some((child) => {
    if (!React.isValidElement(child)) {
      return false;
    }

    const childType = child.type as { displayName?: string; name?: string };

    if (childType.displayName === displayName || childType.name === displayName) {
      return true;
    }

    return hasDisplayName((child.props as { children?: React.ReactNode }).children, displayName);
  });
}

/**
 * Shared centered modal root for confirmation, focused form, and detail overlay flows.
 */
export function Dialog({ open, defaultOpen, onClose, children }: DialogProps) {
  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        onClose?.();
      }
    },
    [onClose],
  );

  return (
    <DialogPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={handleOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
}

Dialog.displayName = 'Dialog';

export const DialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ ...props }, ref) => <DialogPrimitive.Trigger ref={ref} {...props} />);

DialogTrigger.displayName = 'DialogTrigger';

export const DialogClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ ...props }, ref) => <DialogPrimitive.Close ref={ref} {...props} />);

DialogClose.displayName = 'DialogClose';

export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} asChild {...props}>
    <Box data-slot="dialog-overlay" className={cn(dialogOverlayVariants(), className)} />
  </DialogPrimitive.Overlay>
));

DialogOverlay.displayName = 'DialogOverlay';

export const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...props }, ref) => (
    <Box ref={ref} data-slot="dialog-header" className={cn(dialogHeaderVariants(), className)} {...props} />
  ),
);

DialogHeader.displayName = 'DialogHeader';

export const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => (
    <Box ref={ref} data-slot="dialog-footer" className={cn(dialogFooterVariants(), className)} {...props} />
  ),
);

DialogFooter.displayName = 'DialogFooter';

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} asChild>
    <Box as="h2" data-slot="dialog-title" className={cn(dialogTitleVariants(), className)} {...props} />
  </DialogPrimitive.Title>
));

DialogTitle.displayName = 'DialogTitle';

export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} asChild>
    <Box
      as="p"
      data-slot="dialog-description"
      className={cn(dialogDescriptionVariants(), className)}
      {...props}
    />
  </DialogPrimitive.Description>
));

DialogDescription.displayName = 'DialogDescription';

/**
 * Shared dialog panel shell with convenience header/footer props and Box-authored wrappers.
 */
export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ title, description, actions, footer, size = 'md', className, children, ...props }, ref) => {
  const hasConvenienceHeader = Boolean(title || description);
  const hasConvenienceChrome = Boolean(title || description || actions || footer);
  const hasProvidedTitle = Boolean(title) || hasDisplayName(children, 'DialogTitle');
  const hasProvidedDescription = Boolean(description) || hasDisplayName(children, 'DialogDescription');

  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content ref={ref} asChild {...props}>
        <Box data-slot="dialog-content" className={cn(dialogContentVariants({ size }), className)}>
          {hasConvenienceHeader ? (
            <DialogHeader>
              {title ? <DialogTitle>{title}</DialogTitle> : null}
              {description ? <DialogDescription>{description}</DialogDescription> : null}
            </DialogHeader>
          ) : null}

          {!hasProvidedTitle ? <DialogTitle className="sr-only">Dialog</DialogTitle> : null}
          {!hasProvidedDescription ? (
            <DialogDescription className="sr-only">Shared modal dialog.</DialogDescription>
          ) : null}

          {actions ? (
            <Box data-slot="dialog-actions" className={dialogActionsVariants()}>
              {actions}
            </Box>
          ) : null}

          {hasConvenienceChrome ? (
            <Box data-slot="dialog-body" className={dialogBodyVariants()}>
              {children}
            </Box>
          ) : (
            children
          )}

          {footer ? <DialogFooter>{footer}</DialogFooter> : null}
        </Box>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

DialogContent.displayName = 'DialogContent';
