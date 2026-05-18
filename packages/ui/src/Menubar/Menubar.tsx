'use client';

import * as MenubarPrimitive from '@radix-ui/react-menubar';
import * as React from 'react';
import { Check, ChevronRight, Circle } from 'lucide-react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import type {
  MenubarCheckboxItemProps,
  MenubarContentProps,
  MenubarGroupProps,
  MenubarItemProps,
  MenubarLabelProps,
  MenubarMenuProps,
  MenubarPortalProps,
  MenubarProps,
  MenubarRadioGroupProps,
  MenubarRadioItemProps,
  MenubarSeparatorProps,
  MenubarShortcutProps,
  MenubarSubProps,
  MenubarSubContentProps,
  MenubarSubTriggerProps,
  MenubarTriggerProps,
} from './Menubar.types';
import {
  menubarChevronVariants,
  menubarContentVariants,
  menubarIconVariants,
  menubarIndicatorVariants,
  menubarItemVariants,
  menubarLabelVariants,
  menubarRootVariants,
  menubarSelectionItemVariants,
  menubarSeparatorVariants,
  menubarShortcutVariants,
  menubarTriggerVariants,
} from './Menubar.variants';

interface MenubarContextValue {
  disabled: boolean;
  onAction?: (value: string) => void;
  registerDisabledMenu: (value: string | undefined, disabled: boolean) => void;
  variant: NonNullable<MenubarProps['variant']>;
}

const MenubarContext = React.createContext<MenubarContextValue>({
  disabled: false,
  registerDisabledMenu: () => undefined,
  variant: 'outline',
});

const MenubarMenuValueContext = React.createContext<string | undefined>(undefined);

function useMenubarContext() {
  return React.useContext(MenubarContext);
}

function useMenubarMenuValue() {
  return React.useContext(MenubarMenuValueContext);
}

function createDisabledGuard<E extends React.SyntheticEvent>(
  disabled: boolean,
  handler?: (event: E) => void,
) {
  return (event: E) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    handler?.(event);
  };
}

function MenubarItemLayout({
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
        <Box as="span" aria-hidden="true" data-slot="menubar-icon" className={menubarIconVariants()}>
          {icon}
        </Box>
      ) : null}
      <Box as="span" data-slot="menubar-item-label" className="min-w-0 flex-1 truncate">
        {children}
      </Box>
      {shortcut ? (
        <Box as="span" data-slot="menubar-shortcut-text" className={menubarShortcutVariants()}>
          {shortcut}
        </Box>
      ) : null}
      {chevron ? (
        <Box as="span" aria-hidden="true" data-slot="menubar-chevron" className={menubarChevronVariants()}>
          <ChevronRight className="h-4 w-4" />
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

export const Menubar = React.forwardRef<React.ElementRef<typeof MenubarPrimitive.Root>, MenubarProps>(
  (
    {
      className,
      disabled = false,
      onAction,
      variant = 'outline',
      value,
      defaultValue = '',
      onValueChange,
      children,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
    const currentValue = isControlled ? value : uncontrolledValue;
    const disabledMenusRef = React.useRef(new Map<string, boolean>());

    const registerDisabledMenu = React.useCallback((menuValue: string | undefined, menuDisabled: boolean) => {
      if (!menuValue) {
        return;
      }

      if (menuDisabled) {
        disabledMenusRef.current.set(menuValue, true);
        return;
      }

      disabledMenusRef.current.delete(menuValue);
    }, []);

    const handleValueChange = React.useCallback(
      (nextValue: string) => {
        if (disabledMenusRef.current.get(nextValue)) {
          return;
        }

        if (!isControlled) {
          setUncontrolledValue(nextValue);
        }

        onValueChange?.(nextValue);
      },
      [isControlled, onValueChange],
    );

    return (
      <MenubarContext.Provider value={{ disabled, onAction, registerDisabledMenu, variant }}>
        <MenubarPrimitive.Root ref={ref} asChild value={currentValue} onValueChange={handleValueChange} {...props}>
          <Box data-slot="menubar" className={cn(menubarRootVariants(), className)}>
            {children}
          </Box>
        </MenubarPrimitive.Root>
      </MenubarContext.Provider>
    );
  },
);

Menubar.displayName = 'Menubar';

export const MenubarMenu: React.FC<MenubarMenuProps> = ({ value, children, ...props }) => (
  <MenubarMenuValueContext.Provider value={value}>
    <MenubarPrimitive.Menu value={value} {...props}>
      {children}
    </MenubarPrimitive.Menu>
  </MenubarMenuValueContext.Provider>
);

export const MenubarPortal: React.FC<MenubarPortalProps> = MenubarPrimitive.Portal;
export const MenubarSub: React.FC<MenubarSubProps> = MenubarPrimitive.Sub;

export const MenubarGroup = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Group>,
  MenubarGroupProps
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.Group ref={ref} asChild {...props}>
    <Box data-slot="menubar-group" className={className}>
      {children}
    </Box>
  </MenubarPrimitive.Group>
));

MenubarGroup.displayName = 'MenubarGroup';

export const MenubarRadioGroup = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioGroup>,
  MenubarRadioGroupProps
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioGroup ref={ref} asChild {...props}>
    <Box data-slot="menubar-radio-group" className={className}>
      {children}
    </Box>
  </MenubarPrimitive.RadioGroup>
));

MenubarRadioGroup.displayName = 'MenubarRadioGroup';

export const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  MenubarTriggerProps
>(
  (
    {
      className,
      disabled,
      variant,
      children,
      onPointerMove,
      onPointerDown,
      onFocus,
      onClick,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const menuContext = useMenubarContext();
    const menuValue = useMenubarMenuValue();
    const isDisabled = disabled ?? menuContext.disabled;
    const resolvedVariant = variant ?? menuContext.variant;

    React.useEffect(() => {
      menuContext.registerDisabledMenu(menuValue, isDisabled);

      return () => {
        menuContext.registerDisabledMenu(menuValue, false);
      };
    }, [isDisabled, menuContext, menuValue]);

    return (
      <MenubarPrimitive.Trigger
        ref={ref}
        asChild
        disabled={isDisabled}
        onPointerMove={createDisabledGuard(isDisabled, onPointerMove)}
        onPointerDown={createDisabledGuard(isDisabled, onPointerDown)}
        onFocus={createDisabledGuard(isDisabled, onFocus)}
        onClick={createDisabledGuard(isDisabled, onClick)}
        onKeyDown={createDisabledGuard(isDisabled, onKeyDown)}
        {...props}
      >
        <Box
          as="button"
          type="button"
          data-slot="menubar-trigger"
          className={cn(menubarTriggerVariants({ variant: resolvedVariant }), className)}
        >
          {children}
        </Box>
      </MenubarPrimitive.Trigger>
    );
  },
);

MenubarTrigger.displayName = 'MenubarTrigger';

export const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  MenubarContentProps
>(({ className, align = 'start', alignOffset = -4, sideOffset = 8, children, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      ref={ref}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      collisionPadding={8}
      asChild
      {...props}
    >
      <Box data-slot="menubar-content" className={cn(menubarContentVariants(), className)}>
        {children}
      </Box>
    </MenubarPrimitive.Content>
  </MenubarPrimitive.Portal>
));

MenubarContent.displayName = 'MenubarContent';

export const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  MenubarSubContentProps
>(({ className, sideOffset = 8, children, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.SubContent ref={ref} sideOffset={sideOffset} collisionPadding={8} asChild {...props}>
      <Box data-slot="menubar-sub-content" className={cn(menubarContentVariants(), className)}>
        {children}
      </Box>
    </MenubarPrimitive.SubContent>
  </MenubarPrimitive.Portal>
));

MenubarSubContent.displayName = 'MenubarSubContent';

export const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  MenubarLabelProps
>(({ inset = false, className, ...props }, ref) => (
  <MenubarPrimitive.Label ref={ref} asChild>
    <Box data-slot="menubar-label" className={cn(menubarLabelVariants({ inset }), className)} {...props} />
  </MenubarPrimitive.Label>
));

MenubarLabel.displayName = 'MenubarLabel';

export const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  MenubarSeparatorProps
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator ref={ref} asChild>
    <Box data-slot="menubar-separator" className={cn(menubarSeparatorVariants(), className)} {...props} />
  </MenubarPrimitive.Separator>
));

MenubarSeparator.displayName = 'MenubarSeparator';

export const MenubarItem = React.forwardRef<React.ElementRef<typeof MenubarPrimitive.Item>, MenubarItemProps>(
  (
    {
      value,
      icon,
      shortcut,
      inset = false,
      destructive = false,
      variant,
      className,
      children,
      onSelect,
      ...props
    },
    ref,
  ) => {
    const menuContext = useMenubarContext();
    const resolvedVariant = variant ?? menuContext.variant;

    return (
      <MenubarPrimitive.Item
        ref={ref}
        asChild
        onSelect={createActionHandler(value, menuContext.onAction, onSelect)}
        {...props}
      >
        <Box
          data-slot="menubar-item"
          className={cn(menubarItemVariants({ variant: resolvedVariant, inset, destructive }), className)}
        >
          <MenubarItemLayout icon={icon} shortcut={shortcut}>
            {children}
          </MenubarItemLayout>
        </Box>
      </MenubarPrimitive.Item>
    );
  },
);

MenubarItem.displayName = 'MenubarItem';

export const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  MenubarCheckboxItemProps
>(({ value, icon, shortcut, destructive = false, variant, className, children, onSelect, ...props }, ref) => {
  const menuContext = useMenubarContext();
  const resolvedVariant = variant ?? menuContext.variant;

  return (
    <MenubarPrimitive.CheckboxItem
      ref={ref}
      asChild
      onSelect={createActionHandler(value, menuContext.onAction, onSelect)}
      {...props}
      >
        <Box
          data-slot="menubar-checkbox-item"
          className={cn(menubarSelectionItemVariants({ variant: resolvedVariant, destructive }), className)}
        >
        <MenubarPrimitive.ItemIndicator asChild>
          <Box as="span" data-slot="menubar-checkbox-indicator" className={menubarIndicatorVariants()}>
            <Check aria-hidden="true" className="h-4 w-4" />
          </Box>
        </MenubarPrimitive.ItemIndicator>
        <MenubarItemLayout icon={icon} shortcut={shortcut}>
          {children}
        </MenubarItemLayout>
      </Box>
    </MenubarPrimitive.CheckboxItem>
  );
});

MenubarCheckboxItem.displayName = 'MenubarCheckboxItem';

export const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  MenubarRadioItemProps
>(({ value, icon, shortcut, destructive = false, variant, className, children, onSelect, ...props }, ref) => {
  const menuContext = useMenubarContext();
  const resolvedVariant = variant ?? menuContext.variant;

  return (
    <MenubarPrimitive.RadioItem
      ref={ref}
      value={value}
      asChild
      onSelect={createActionHandler(value, menuContext.onAction, onSelect)}
      {...props}
    >
      <Box
        data-slot="menubar-radio-item"
        className={cn(menubarSelectionItemVariants({ variant: resolvedVariant, destructive }), className)}
      >
        <MenubarPrimitive.ItemIndicator asChild>
          <Box as="span" data-slot="menubar-radio-indicator" className={menubarIndicatorVariants()}>
            <Circle aria-hidden="true" className="h-2.5 w-2.5 fill-current" />
          </Box>
        </MenubarPrimitive.ItemIndicator>
        <MenubarItemLayout icon={icon} shortcut={shortcut}>
          {children}
        </MenubarItemLayout>
      </Box>
    </MenubarPrimitive.RadioItem>
  );
});

MenubarRadioItem.displayName = 'MenubarRadioItem';

export const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  MenubarSubTriggerProps
>(
  (
    {
      icon,
      shortcut,
      inset = false,
      variant,
      className,
      children,
      disabled,
      onPointerMove,
      onPointerDown,
      onFocus,
      onClick,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const isDisabled = Boolean(disabled);
    const { variant: inheritedVariant } = useMenubarContext();
    const resolvedVariant = variant ?? inheritedVariant;

    return (
      <MenubarPrimitive.SubTrigger
        ref={ref}
        asChild
        disabled={disabled}
        onPointerMove={createDisabledGuard(isDisabled, onPointerMove)}
        onPointerDown={createDisabledGuard(isDisabled, onPointerDown)}
        onFocus={createDisabledGuard(isDisabled, onFocus)}
        onClick={createDisabledGuard(isDisabled, onClick)}
        onKeyDown={createDisabledGuard(isDisabled, onKeyDown)}
        {...props}
      >
        <Box
          data-slot="menubar-sub-trigger"
          className={cn(menubarItemVariants({ variant: resolvedVariant, inset }), className)}
        >
          <MenubarItemLayout icon={icon} shortcut={shortcut} chevron>
            {children}
          </MenubarItemLayout>
        </Box>
      </MenubarPrimitive.SubTrigger>
    );
  },
);

MenubarSubTrigger.displayName = 'MenubarSubTrigger';

export const MenubarShortcut = React.forwardRef<HTMLSpanElement, MenubarShortcutProps>(
  ({ className, ...props }, ref) => (
    <Box
      ref={ref}
      as="span"
      data-slot="menubar-shortcut"
      className={cn(menubarShortcutVariants(), className)}
      {...props}
    />
  ),
);

MenubarShortcut.displayName = 'MenubarShortcut';
