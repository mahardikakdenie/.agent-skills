import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import type {
  AccordionContentProps,
  AccordionHeaderProps,
  AccordionItemProps,
  AccordionMultipleProps,
  AccordionProps,
  AccordionSingleProps,
  AccordionTriggerProps,
} from './Accordion.types';
import {
  accordionChevronVariants,
  accordionContentInnerVariants,
  accordionContentVariants,
  accordionHeaderVariants,
  accordionItemVariants,
  accordionRootVariants,
  accordionTriggerVariants,
} from './Accordion.variants';

interface AccordionVariantContextValue {
  variant: NonNullable<AccordionProps['variant']>;
}

const AccordionVariantContext = React.createContext<AccordionVariantContextValue>({
  variant: 'outline',
});

/**
 * Shared inline disclosure group built on Radix Accordion.
 *
 * The public API stays compound to keep panel content consumer-owned and to
 * avoid locking the shared contract to one `items[]` record shape.
 */
export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>((props, ref) => {
  if (props.type === 'multiple') {
    const {
      type,
      value,
      defaultValue,
      onValueChange,
      variant = 'outline',
      className,
      children,
      ...rest
    } = props as AccordionMultipleProps;

    return (
      <AccordionVariantContext.Provider value={{ variant }}>
        <AccordionPrimitive.Root
          type={type}
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          asChild
        >
          <Box
            ref={ref}
            data-slot="accordion"
            className={cn(accordionRootVariants(), className)}
            {...rest}
          >
            {children}
          </Box>
        </AccordionPrimitive.Root>
      </AccordionVariantContext.Provider>
    );
  }

  const {
    type = 'single',
    collapsible = false,
    value,
    defaultValue,
    onValueChange,
    variant = 'outline',
    className,
    children,
    ...rest
  } = props as AccordionSingleProps;

  return (
    <AccordionVariantContext.Provider value={{ variant }}>
      <AccordionPrimitive.Root
        type={type}
        collapsible={collapsible}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        asChild
      >
        <Box
          ref={ref}
          data-slot="accordion"
          className={cn(accordionRootVariants(), className)}
          {...rest}
        >
          {children}
        </Box>
      </AccordionPrimitive.Root>
    </AccordionVariantContext.Provider>
  );
});

Accordion.displayName = 'Accordion';

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, children, variant, ...props }, ref) => {
  const { variant: inheritedVariant } = React.use(AccordionVariantContext);
  const resolvedVariant = variant ?? inheritedVariant;

  return (
    <AccordionPrimitive.Item ref={ref} asChild {...props}>
      <Box
        data-slot="accordion-item"
        className={cn(accordionItemVariants({ variant: resolvedVariant }), className)}
      >
        {children}
      </Box>
    </AccordionPrimitive.Item>
  );
});

AccordionItem.displayName = 'AccordionItem';

export const AccordionHeader = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Header>,
  AccordionHeaderProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header ref={ref} asChild {...props}>
    <Box as="h3" data-slot="accordion-header" className={cn(accordionHeaderVariants(), className)}>
      {children}
    </Box>
  </AccordionPrimitive.Header>
));

AccordionHeader.displayName = 'AccordionHeader';

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Trigger ref={ref} asChild {...props}>
    <Box
      data-slot="accordion-trigger"
      as="button"
      type="button"
      className={cn(accordionTriggerVariants(), className)}
    >
      <Box as="span" className="flex-1 text-left">
        {children}
      </Box>
      <Box
        as="span"
        aria-hidden="true"
        data-slot="accordion-chevron"
        className={accordionChevronVariants()}
      >
        <ChevronDown className="h-4 w-4" />
      </Box>
    </Box>
  </AccordionPrimitive.Trigger>
));

AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content ref={ref} asChild {...props}>
    <Box data-slot="accordion-content" className={accordionContentVariants()}>
      <Box
        data-slot="accordion-content-inner"
        className={cn(accordionContentInnerVariants(), className)}
      >
        {children}
      </Box>
    </Box>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = 'AccordionContent';
