import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import { tooltipArrowVariants, tooltipContentVariants } from './Tooltip.variants';
import type {
  TooltipArrowProps,
  TooltipContentProps,
  TooltipProps,
  TooltipProviderProps,
} from './Tooltip.types';

const DEFAULT_DELAY_DURATION = 200;
const DEFAULT_SKIP_DELAY_DURATION = 300;
const DEFAULT_DISABLE_HOVERABLE_CONTENT = true;

interface TooltipContextValue {
  disabled: boolean;
}

interface TooltipProviderBoundaryValue {
  hasProvider: boolean;
}

const TooltipContext = React.createContext<TooltipContextValue>({
  disabled: false,
});

const TooltipProviderBoundaryContext = React.createContext<TooltipProviderBoundaryValue>({
  hasProvider: false,
});

function useTooltipContext() {
  return React.useContext(TooltipContext);
}

function useTooltipProviderBoundary() {
  return React.useContext(TooltipProviderBoundaryContext);
}

/**
 * Shared provider for grouped tooltip timing and hover behavior.
 */
export function TooltipProvider({
  delayDuration = DEFAULT_DELAY_DURATION,
  skipDelayDuration = DEFAULT_SKIP_DELAY_DURATION,
  disableHoverableContent = DEFAULT_DISABLE_HOVERABLE_CONTENT,
  children,
}: TooltipProviderProps) {
  return (
    <TooltipProviderBoundaryContext.Provider value={{ hasProvider: true }}>
      <TooltipPrimitive.Provider
        delayDuration={delayDuration}
        skipDelayDuration={skipDelayDuration}
        disableHoverableContent={disableHoverableContent}
      >
        {children}
      </TooltipPrimitive.Provider>
    </TooltipProviderBoundaryContext.Provider>
  );
}

TooltipProvider.displayName = 'TooltipProvider';

/**
 * Shared assistive tooltip root with controlled and uncontrolled open support.
 * When no surrounding TooltipProvider is present, Tooltip installs a local provider
 * so standalone usage stays valid while grouped timing remains opt-in.
 */
export function Tooltip({
  open,
  defaultOpen,
  onOpen,
  onClose,
  delayDuration,
  disableHoverableContent,
  disabled = false,
  children,
}: TooltipProps) {
  const tooltipProviderBoundary = useTooltipProviderBoundary();

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (disabled) {
        if (!nextOpen) {
          onClose?.();
        }

        return;
      }

      if (nextOpen) {
        onOpen?.();
      } else {
        onClose?.();
      }
    },
    [disabled, onClose, onOpen],
  );

  const tooltipRoot = (
    <TooltipContext.Provider value={{ disabled }}>
      <TooltipPrimitive.Root
        open={disabled ? false : open}
        defaultOpen={disabled ? false : defaultOpen}
        delayDuration={delayDuration}
        disableHoverableContent={disableHoverableContent}
        onOpenChange={handleOpenChange}
      >
        {children}
      </TooltipPrimitive.Root>
    </TooltipContext.Provider>
  );

  if (tooltipProviderBoundary.hasProvider) {
    return tooltipRoot;
  }

  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration ?? DEFAULT_DELAY_DURATION}
      skipDelayDuration={DEFAULT_SKIP_DELAY_DURATION}
      disableHoverableContent={
        disableHoverableContent ?? DEFAULT_DISABLE_HOVERABLE_CONTENT
      }
    >
      {tooltipRoot}
    </TooltipPrimitive.Provider>
  );
}

Tooltip.displayName = 'Tooltip';

export const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>(({ disabled, ...props }, ref) => {
  const tooltipContext = useTooltipContext();

  return (
    <TooltipPrimitive.Trigger
      ref={ref}
      disabled={disabled ?? tooltipContext.disabled}
      {...props}
    />
  );
});

TooltipTrigger.displayName = 'TooltipTrigger';

export const TooltipPortal = TooltipPrimitive.Portal;

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ align = 'center', side = 'top', sideOffset = 8, className, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      align={align}
      side={side}
      sideOffset={sideOffset}
      collisionPadding={8}
      asChild
      {...props}
    >
      <Box data-slot='tooltip-content' className={cn(tooltipContentVariants(), className)}>
        {children}
      </Box>
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));

TooltipContent.displayName = 'TooltipContent';

export const TooltipArrow = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Arrow>,
  TooltipArrowProps
>(({ className, width = 10, height = 5, ...props }, ref) => (
  <TooltipPrimitive.Arrow
    ref={ref}
    width={width}
    height={height}
    className={cn(tooltipArrowVariants(), className)}
    {...props}
  />
));

TooltipArrow.displayName = 'TooltipArrow';
