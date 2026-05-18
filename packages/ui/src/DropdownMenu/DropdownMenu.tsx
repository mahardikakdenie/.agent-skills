'use client';

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';
import { Check, ChevronRight } from 'lucide-react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import {
  dropdownMenuChevronVariants,
  dropdownMenuContentVariants,
  dropdownMenuIconVariants,
  dropdownMenuIndicatorVariants,
  dropdownMenuItemVariants,
  dropdownMenuLabelVariants,
  dropdownMenuSelectionItemVariants,
  dropdownMenuSeparatorVariants,
  dropdownMenuShortcutVariants,
} from './DropdownMenu.variants';
import type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuSubContentProps,
  DropdownMenuSubTriggerProps,
} from './DropdownMenu.types';

interface DropdownMenuContextValue {
  disabled: boolean;
  onAction?: (value: string) => void;
  variant: NonNullable<DropdownMenuProps['variant']>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue>({
  disabled: false,
  variant: 'outline',
});

function useDropdownMenuContext() {
  return React.useContext(DropdownMenuContext);
}

function DropdownMenuItemLayout({
  icon,
  shortcut,
  children,
  chevron,
}: {
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  children?: React.ReactNode;
  chevron?: boolean;
}) {
  return (
    <>
      {icon ? (
        <Box as='span' aria-hidden='true' data-slot='dropdown-menu-icon' className={dropdownMenuIconVariants()}>
          {icon}
        </Box>
      ) : null}
      <Box as='span' data-slot='dropdown-menu-item-label' className='truncate'>
        {children}
      </Box>
      {shortcut ? (
        <Box as='span' data-slot='dropdown-menu-shortcut' className={dropdownMenuShortcutVariants()}>
          {shortcut}
        </Box>
      ) : null}
      {chevron ? (
        <Box as='span' aria-hidden='true' data-slot='dropdown-menu-chevron' className={dropdownMenuChevronVariants()}>
          <ChevronRight className='h-4 w-4' />
        </Box>
      ) : null}
    </>
  );
}

function createActionHandler(
  value: string | undefined,
  onAction: ((value: string) => void) | undefined,
  onSelect: ((event: Event) => void) | undefined,
) {
  return (event: Event) => {
    onSelect?.(event);

    if (!event.defaultPrevented && value) {
      onAction?.(value);
    }
  };
}

export function DropdownMenu({
  open,
  defaultOpen,
  onOpen,
  onClose,
  onAction,
  disabled = false,
  modal = true,
  variant = 'outline',
  children,
}: DropdownMenuProps) {
  const contextValue = {
    disabled,
    onAction,
    variant,
  };

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      <DropdownMenuPrimitive.Root
        open={open}
        defaultOpen={defaultOpen}
        modal={modal}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            onOpen?.();
          } else {
            onClose?.();
          }
        }}
      >
        {children}
      </DropdownMenuPrimitive.Root>
    </DropdownMenuContext.Provider>
  );
}

DropdownMenu.displayName = 'DropdownMenu';

export const DropdownMenuTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>
>(({ disabled, ...props }, ref) => {
  const menuContext = useDropdownMenuContext();

  return <DropdownMenuPrimitive.Trigger ref={ref} disabled={disabled ?? menuContext.disabled} {...props} />;
});

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ className, sideOffset = 8, align = 'end', side = 'bottom', children, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      align={align}
      side={side}
      sideOffset={sideOffset}
      collisionPadding={8}
      asChild
      {...props}
    >
      <Box data-slot='dropdown-menu-content' className={cn(dropdownMenuContentVariants(), className)}>
        {children}
      </Box>
    </DropdownMenuPrimitive.Content>
  </DropdownMenuPrimitive.Portal>
));

DropdownMenuContent.displayName = 'DropdownMenuContent';

export const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  DropdownMenuSubContentProps
>(({ className, sideOffset = 8, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      sideOffset={sideOffset}
      collisionPadding={8}
      asChild
      {...props}
    >
      <Box data-slot='dropdown-menu-sub-content' className={cn(dropdownMenuContentVariants(), className)}>
        {children}
      </Box>
    </DropdownMenuPrimitive.SubContent>
  </DropdownMenuPrimitive.Portal>
));

DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';

export const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  DropdownMenuLabelProps
>(({ inset = false, className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label ref={ref} asChild>
    <Box data-slot='dropdown-menu-label' className={cn(dropdownMenuLabelVariants({ inset }), className)} {...props} />
  </DropdownMenuPrimitive.Label>
));

DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} asChild>
    <Box data-slot='dropdown-menu-separator' className={cn(dropdownMenuSeparatorVariants(), className)} {...props} />
  </DropdownMenuPrimitive.Separator>
));

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(
  ({ value, icon, shortcut, inset = false, destructive = false, variant, className, children, onSelect, ...props }, ref) => {
  const menuContext = useDropdownMenuContext();
  const resolvedVariant = variant ?? menuContext.variant;

  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      asChild
      onSelect={createActionHandler(value, menuContext.onAction, onSelect)}
      {...props}
    >
      <Box
        data-slot='dropdown-menu-item'
        className={cn(dropdownMenuItemVariants({ variant: resolvedVariant, inset, destructive }), className)}
      >
        <DropdownMenuItemLayout icon={icon} shortcut={shortcut}>
          {children}
        </DropdownMenuItemLayout>
      </Box>
    </DropdownMenuPrimitive.Item>
  );
});

DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  DropdownMenuCheckboxItemProps
>(
  ({ value, icon, shortcut, destructive = false, variant, className, children, onSelect, ...props }, ref) => {
  const menuContext = useDropdownMenuContext();
  const resolvedVariant = variant ?? menuContext.variant;

  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      asChild
      onSelect={createActionHandler(value, menuContext.onAction, onSelect)}
      {...props}
    >
      <Box
        data-slot='dropdown-menu-checkbox-item'
        className={cn(dropdownMenuSelectionItemVariants({ variant: resolvedVariant, destructive }), className)}
      >
        <DropdownMenuPrimitive.ItemIndicator asChild>
          <Box as='span' data-slot='dropdown-menu-checkbox-indicator' className={dropdownMenuIndicatorVariants()}>
            <Check aria-hidden='true' className='h-4 w-4' />
          </Box>
        </DropdownMenuPrimitive.ItemIndicator>
        <DropdownMenuItemLayout icon={icon} shortcut={shortcut}>
          {children}
        </DropdownMenuItemLayout>
      </Box>
    </DropdownMenuPrimitive.CheckboxItem>
  );
});

DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

export const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  DropdownMenuRadioItemProps
>(
  ({ value, icon, shortcut, destructive = false, variant, className, children, onSelect, ...props }, ref) => {
  const menuContext = useDropdownMenuContext();
  const resolvedVariant = variant ?? menuContext.variant;

  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      value={value}
      asChild
      onSelect={createActionHandler(value, menuContext.onAction, onSelect)}
      {...props}
    >
      <Box
        data-slot='dropdown-menu-radio-item'
        className={cn(dropdownMenuSelectionItemVariants({ variant: resolvedVariant, destructive }), className)}
      >
        <DropdownMenuPrimitive.ItemIndicator asChild>
          <Box as='span' data-slot='dropdown-menu-radio-indicator' className={dropdownMenuIndicatorVariants()}>
            <Check aria-hidden='true' className='h-4 w-4' />
          </Box>
        </DropdownMenuPrimitive.ItemIndicator>
        <DropdownMenuItemLayout icon={icon} shortcut={shortcut}>
          {children}
        </DropdownMenuItemLayout>
      </Box>
    </DropdownMenuPrimitive.RadioItem>
  );
});

DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

export const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  DropdownMenuSubTriggerProps
>(({ icon, shortcut, inset = false, variant, className, children, ...props }, ref) => {
  const { variant: inheritedVariant } = useDropdownMenuContext();
  const resolvedVariant = variant ?? inheritedVariant;

  return (
    <DropdownMenuPrimitive.SubTrigger ref={ref} asChild {...props}>
      <Box
        data-slot='dropdown-menu-sub-trigger'
        className={cn(dropdownMenuItemVariants({ variant: resolvedVariant, inset }), className)}
      >
        <DropdownMenuItemLayout icon={icon} shortcut={shortcut} chevron>
          {children}
        </DropdownMenuItemLayout>
      </Box>
    </DropdownMenuPrimitive.SubTrigger>
  );
});

DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';
