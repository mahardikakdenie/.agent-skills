import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import { tabsContentVariants, tabsListVariants, tabsRootVariants, tabsTriggerVariants } from './Tabs.variants';
import type { TabsContentProps, TabsListProps, TabsOrientation, TabsProps, TabsTriggerProps } from './Tabs.types';

interface TabsVariantContextValue {
  variant: NonNullable<TabsProps['variant']>;
}

const TabsVariantContext = React.createContext<TabsVariantContextValue>({
  variant: 'outline',
});

/**
 * Shared tabs root built on Radix Tabs with a narrow, app-agnostic contract.
 * Radix owns the tab semantics and keyboard behavior while Box owns the
 * authored DOM wrapper required by the shared Box-only policy.
 */
export const Tabs = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Root>, TabsProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      orientation = 'horizontal',
      variant = 'outline',
      className,
      children,
      ...props
    },
    ref,
  ) => (
    <TabsVariantContext.Provider value={{ variant }}>
      <TabsPrimitive.Root
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        orientation={orientation}
        asChild
      >
        <Box data-slot="tabs" className={cn(tabsRootVariants({ orientation }), className)} {...props}>
          {children}
        </Box>
      </TabsPrimitive.Root>
    </TabsVariantContext.Provider>
  ),
);

Tabs.displayName = 'Tabs';

/**
 * Shared tab list wrapper. Consumers should provide an accessible name with
 * `aria-label` or `aria-labelledby` when nearby context is not sufficient.
 */
export const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, children, ...props }, ref) => (
    <TabsPrimitive.List ref={ref} asChild {...props}>
      <Box data-slot="tabs-list" className={cn(tabsListVariants(), className)}>
        {children}
      </Box>
    </TabsPrimitive.List>
  ),
);

TabsList.displayName = 'TabsList';

/**
 * Shared trigger surface for a single tab. The trigger stays intentionally
 * visual-only so route sync and business logic remain consumer-owned.
 */
export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, children, variant, ...props }, ref) => {
  const { variant: inheritedVariant } = React.use(TabsVariantContext);
  const resolvedVariant = variant ?? inheritedVariant;

  return (
    <TabsPrimitive.Trigger ref={ref} asChild {...props}>
      <Box
        as="button"
        type="button"
        data-slot="tabs-trigger"
        className={cn(tabsTriggerVariants({ variant: resolvedVariant }), className)}
      >
        {children}
      </Box>
    </TabsPrimitive.Trigger>
  );
});

TabsTrigger.displayName = 'TabsTrigger';

/**
 * Shared tab panel wrapper. Consumers own the content inside each panel while
 * the shared component handles the panel shell and focus-visible treatment.
 */
export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref} asChild {...props}>
    <Box data-slot="tabs-content" className={cn(tabsContentVariants(), className)}>
      {children}
    </Box>
  </TabsPrimitive.Content>
));

TabsContent.displayName = 'TabsContent';

export type { TabsOrientation };
