import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import {
  drawerActionsVariants,
  drawerBodyVariants,
  drawerContentVariants,
  drawerDescriptionVariants,
  drawerFooterVariants,
  drawerHandleVariants,
  drawerHeaderVariants,
  drawerOverlayVariants,
  drawerPanelVariants,
  drawerTitleVariants,
} from './Drawer.variants';
import type {
  DrawerContentProps,
  DrawerDescriptionProps,
  DrawerDirection,
  DrawerFooterProps,
  DrawerHeaderProps,
  DrawerProps,
  DrawerTitleProps,
} from './Drawer.types';

const DrawerDirectionContext = React.createContext<DrawerDirection>('bottom');

function useDrawerDirection() {
  return React.useContext(DrawerDirectionContext);
}

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
 * Shared drawer root for bottom-sheet and side-panel overlay flows.
 */
export function Drawer({ open, onClose, direction = 'bottom', children }: DrawerProps) {
  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        onClose?.();
      }
    },
    [onClose],
  );

  return (
    <DrawerDirectionContext.Provider value={direction}>
      <DrawerPrimitive.Root direction={direction} open={open} onOpenChange={handleOpenChange}>
        {children}
      </DrawerPrimitive.Root>
    </DrawerDirectionContext.Provider>
  );
}

Drawer.displayName = 'Drawer';

export const DrawerTrigger = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Trigger>
>(({ ...props }, ref) => <DrawerPrimitive.Trigger ref={ref} {...props} />);

DrawerTrigger.displayName = 'DrawerTrigger';

export const DrawerClose = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Close>
>(({ ...props }, ref) => <DrawerPrimitive.Close ref={ref} {...props} />);

DrawerClose.displayName = 'DrawerClose';

export const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay ref={ref} asChild {...props}>
    <Box data-slot="drawer-overlay" className={cn(drawerOverlayVariants(), className)} />
  </DrawerPrimitive.Overlay>
));

DrawerOverlay.displayName = 'DrawerOverlay';

export const DrawerHandle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Handle>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Handle>
>(({ className, ...props }, ref) => {
  const direction = useDrawerDirection();

  return (
    <DrawerPrimitive.Handle
      ref={ref}
      data-slot="drawer-handle"
      className={cn(drawerHandleVariants({ direction }), className)}
      {...props}
    />
  );
});

DrawerHandle.displayName = 'DrawerHandle';

export const DrawerHeader = React.forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, ...props }, ref) => {
    const direction = useDrawerDirection();

    return (
      <Box
        ref={ref}
        data-slot="drawer-header"
        className={cn(drawerHeaderVariants({ direction }), className)}
        {...props}
      />
    );
  },
);

DrawerHeader.displayName = 'DrawerHeader';

export const DrawerFooter = React.forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ className, ...props }, ref) => (
    <Box
      ref={ref}
      data-slot="drawer-footer"
      className={cn(drawerFooterVariants(), className)}
      {...props}
    />
  ),
);

DrawerFooter.displayName = 'DrawerFooter';

export const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  DrawerTitleProps
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    data-slot="drawer-title"
    className={cn(drawerTitleVariants(), className)}
    {...props}
  />
));

DrawerTitle.displayName = 'DrawerTitle';

export const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  DrawerDescriptionProps
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    data-slot="drawer-description"
    className={cn(drawerDescriptionVariants(), className)}
    {...props}
  />
));

DrawerDescription.displayName = 'DrawerDescription';

/**
 * Shared drawer panel shell with convenience header/footer props and Box-authored layout wrappers.
 */
export const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(({ title, description, actions, footer, className, children, ...props }, ref) => {
  const direction = useDrawerDirection();
  const showHandle = direction === 'bottom' || direction === 'top';
  const hasConvenienceHeader = Boolean(title || description);
  const hasConvenienceChrome = Boolean(title || description || actions || footer);
  const hasProvidedTitle = Boolean(title) || hasDisplayName(children, 'DrawerTitle');
  const hasProvidedDescription = Boolean(description) || hasDisplayName(children, 'DrawerDescription');

  return (
    <DrawerPrimitive.Portal>
      <DrawerOverlay />
      <DrawerPrimitive.Content ref={ref} asChild {...props}>
        <Box
          data-slot="drawer-content"
          className={cn(drawerContentVariants({ direction }), className)}
        >
          <Box data-slot="drawer-panel" className={drawerPanelVariants()}>
            {showHandle ? <DrawerHandle /> : null}

            {hasConvenienceHeader ? (
              <DrawerHeader>
                {title ? <DrawerTitle>{title}</DrawerTitle> : null}
                {description ? <DrawerDescription>{description}</DrawerDescription> : null}
              </DrawerHeader>
            ) : null}

            {!hasProvidedTitle ? <DrawerTitle className="sr-only">Drawer</DrawerTitle> : null}
            {!hasProvidedDescription ? (
              <DrawerDescription className="sr-only">Shared drawer panel.</DrawerDescription>
            ) : null}

            {actions ? (
              <Box data-slot="drawer-actions" className={drawerActionsVariants()}>
                {actions}
              </Box>
            ) : null}

            {hasConvenienceChrome ? (
              <Box data-slot="drawer-body" className={drawerBodyVariants({ direction })}>
                {children}
              </Box>
            ) : (
              children
            )}

            {footer ? <DrawerFooter>{footer}</DrawerFooter> : null}
          </Box>
        </Box>
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  );
});

DrawerContent.displayName = 'DrawerContent';
