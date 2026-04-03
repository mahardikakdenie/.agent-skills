import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import type {
  NavigationMenuContentProps,
  NavigationMenuIndicatorProps,
  NavigationMenuItemProps,
  NavigationMenuLinkProps,
  NavigationMenuListProps,
  NavigationMenuProps,
  NavigationMenuTriggerProps,
  NavigationMenuViewportProps,
} from './NavigationMenu.types';
import {
  navigationMenuContentVariants,
  navigationMenuIndicatorCaretVariants,
  navigationMenuIndicatorVariants,
  navigationMenuLinkVariants,
  navigationMenuListVariants,
  navigationMenuRootVariants,
  navigationMenuTriggerVariants,
  navigationMenuViewportVariants,
  navigationMenuViewportWrapperVariants,
} from './NavigationMenu.variants';

type Orientation = NonNullable<NavigationMenuProps['orientation']>;

interface NavigationMenuContextValue {
  orientation: Orientation;
  variant: NonNullable<NavigationMenuProps['variant']>;
}

const NavigationMenuContext = React.createContext<NavigationMenuContextValue>({
  orientation: 'horizontal',
  variant: 'outline',
});

function useNavigationMenuContext() {
  return React.useContext(NavigationMenuContext);
}

export const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  NavigationMenuProps
>(({ className, orientation = 'horizontal', variant = 'outline', children, ...props }, ref) => (
  <NavigationMenuContext.Provider value={{ orientation, variant }}>
    <NavigationMenuPrimitive.Root ref={ref} orientation={orientation} asChild {...props}>
      <Box
        as="nav"
        data-slot="navigation-menu"
        className={cn(navigationMenuRootVariants({ orientation }), className)}
      >
        {children}
      </Box>
    </NavigationMenuPrimitive.Root>
  </NavigationMenuContext.Provider>
));

NavigationMenu.displayName = 'NavigationMenu';

export const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  NavigationMenuListProps
>(({ className, children, ...props }, ref) => {
  const { orientation } = useNavigationMenuContext();

  return (
    <NavigationMenuPrimitive.List ref={ref} asChild {...props}>
      <Box
        as="ul"
        data-slot="navigation-menu-list"
        className={cn(navigationMenuListVariants({ orientation }), className)}
      >
        {children}
      </Box>
    </NavigationMenuPrimitive.List>
  );
});

NavigationMenuList.displayName = 'NavigationMenuList';

export const NavigationMenuItem = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Item>,
  NavigationMenuItemProps
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Item ref={ref} asChild {...props}>
    <Box as="li" data-slot="navigation-menu-item" className={className}>
      {children}
    </Box>
  </NavigationMenuPrimitive.Item>
));

NavigationMenuItem.displayName = 'NavigationMenuItem';

export const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  NavigationMenuTriggerProps
>(({ className, children, ...props }, ref) => {
  const { orientation, variant: inheritedVariant } = useNavigationMenuContext();
  const { variant = inheritedVariant, ...triggerProps } = props;

  return (
    <NavigationMenuPrimitive.Trigger ref={ref} asChild {...triggerProps}>
      <Box
        as="button"
        type="button"
        data-slot="navigation-menu-trigger"
        className={cn(navigationMenuTriggerVariants({ orientation, variant }), className)}
      >
        <Box as="span" className="truncate">
          {children}
        </Box>
        <Box as="span" aria-hidden="true" className="inline-flex h-4 w-4 items-center justify-center">
          <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 motion-reduce:transition-none group-data-[state=open]:rotate-180" />
        </Box>
      </Box>
    </NavigationMenuPrimitive.Trigger>
  );
});

NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

export const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  NavigationMenuContentProps
>(({ className, children, ...props }, ref) => {
  const { orientation } = useNavigationMenuContext();

  return (
    <NavigationMenuPrimitive.Content ref={ref} asChild {...props}>
      <Box
        data-slot="navigation-menu-content"
        className={cn(navigationMenuContentVariants({ orientation }), className)}
      >
        {children}
      </Box>
    </NavigationMenuPrimitive.Content>
  );
});

NavigationMenuContent.displayName = 'NavigationMenuContent';

export const NavigationMenuLink = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Link>,
  NavigationMenuLinkProps
>(({ asChild = false, className, children, ...props }, ref) => {
  const { orientation, variant: inheritedVariant } = useNavigationMenuContext();
  const { variant = inheritedVariant, ...linkProps } = props;

  return (
    <NavigationMenuPrimitive.Link ref={ref} asChild {...linkProps}>
      {asChild ? (
        <Box
          asChild
          data-slot="navigation-menu-link"
          className={cn(navigationMenuLinkVariants({ orientation, variant }), className)}
        >
          {children}
        </Box>
      ) : (
        <Box
          as="a"
          data-slot="navigation-menu-link"
          className={cn(navigationMenuLinkVariants({ orientation, variant }), className)}
        >
          {children}
        </Box>
      )}
    </NavigationMenuPrimitive.Link>
  );
});

NavigationMenuLink.displayName = 'NavigationMenuLink';

export const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  NavigationMenuIndicatorProps
>(({ className, ...props }, ref) => {
  const { orientation } = useNavigationMenuContext();

  return (
    <NavigationMenuPrimitive.Indicator ref={ref} asChild {...props}>
      <Box
        as="div"
        data-slot="navigation-menu-indicator"
        className={cn(navigationMenuIndicatorVariants({ orientation }), className)}
      >
        <Box as="div" className={navigationMenuIndicatorCaretVariants({ orientation })} />
      </Box>
    </NavigationMenuPrimitive.Indicator>
  );
});

NavigationMenuIndicator.displayName = 'NavigationMenuIndicator';

export const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  NavigationMenuViewportProps
>(({ className, ...props }, ref) => {
  const { orientation } = useNavigationMenuContext();

  return (
    <Box
      data-slot="navigation-menu-viewport-wrapper"
      className={navigationMenuViewportWrapperVariants({ orientation })}
    >
      <NavigationMenuPrimitive.Viewport ref={ref} asChild {...props}>
        <Box
          as="div"
          data-slot="navigation-menu-viewport"
          className={cn(navigationMenuViewportVariants({ orientation }), className)}
        />
      </NavigationMenuPrimitive.Viewport>
    </Box>
  );
});

NavigationMenuViewport.displayName = 'NavigationMenuViewport';
