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
  ({ className, children, ...props }, ref) => {
    const { variant } = React.use(TabsVariantContext);
    const localRef = React.useRef<React.ElementRef<typeof TabsPrimitive.List> | null>(null);
    const shellRef = React.useRef<HTMLDivElement | null>(null);
    const trackRef = React.useRef<HTMLDivElement | null>(null);
    const dragStateRef = React.useRef<{
      pointerId: number;
      startX: number;
      startScrollLeft: number;
      maxScrollLeft: number;
      travel: number;
    } | null>(null);
    const [thumbState, setThumbState] = React.useState({
      isHorizontal: true,
      hasOverflow: false,
      width: 0,
      offset: 0,
      canScrollStart: false,
      canScrollEnd: false,
    });
    const [isPointerInside, setIsPointerInside] = React.useState(false);
    const [hasFocusWithin, setHasFocusWithin] = React.useState(false);
    const [isDraggingThumb, setIsDraggingThumb] = React.useState(false);

    const updateThumbState = React.useCallback(() => {
      const node = localRef.current;

      if (!node) {
        return;
      }

      const orientation = node.getAttribute('data-orientation') ?? 'horizontal';
      const isHorizontal = orientation === 'horizontal';

      if (!isHorizontal) {
        setThumbState({
          isHorizontal: false,
          hasOverflow: false,
          width: 0,
          offset: 0,
          canScrollStart: false,
          canScrollEnd: false,
        });
        return;
      }

      const maxScrollLeft = Math.max(node.scrollWidth - node.clientWidth, 0);
      const hasOverflow = maxScrollLeft > 1;

      if (!hasOverflow) {
        setThumbState({
          isHorizontal: true,
          hasOverflow: false,
          width: 0,
          offset: 0,
          canScrollStart: false,
          canScrollEnd: false,
        });
        return;
      }

      const thumbWidth = Math.max((node.clientWidth / node.scrollWidth) * node.clientWidth, 28);
      const travel = Math.max(node.clientWidth - thumbWidth, 0);
      const offset = maxScrollLeft > 0 ? (node.scrollLeft / maxScrollLeft) * travel : 0;
      const canScrollStart = node.scrollLeft > 1;
      const canScrollEnd = node.scrollLeft < maxScrollLeft - 1;

      setThumbState({
        isHorizontal: true,
        hasOverflow: true,
        width: thumbWidth,
        offset,
        canScrollStart,
        canScrollEnd,
      });
    }, []);

    const scrollToTrackPosition = React.useCallback((clientX: number) => {
      const node = localRef.current;
      const trackNode = trackRef.current;

      if (!node || !trackNode) {
        return;
      }

      const maxScrollLeft = Math.max(node.scrollWidth - node.clientWidth, 0);

      if (maxScrollLeft <= 0) {
        return;
      }

      const thumbWidth = Math.max((node.clientWidth / node.scrollWidth) * node.clientWidth, 28);
      const trackRect = trackNode.getBoundingClientRect();
      const travel = Math.max(trackRect.width - thumbWidth, 0);
      const pointerOffset = clientX - trackRect.left;
      const thumbLeft = Math.min(Math.max(pointerOffset - thumbWidth / 2, 0), travel);
      const nextScrollLeft = travel > 0 ? (thumbLeft / travel) * maxScrollLeft : 0;

      node.scrollLeft = nextScrollLeft;
    }, []);

    const focusScrollbarShell = React.useCallback(() => {
      shellRef.current?.focus({ preventScroll: true });
    }, []);

    const handleTrackPointerDown = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.button !== 0) {
          return;
        }

        event.preventDefault();
        focusScrollbarShell();
        scrollToTrackPosition(event.clientX);
      },
      [focusScrollbarShell, scrollToTrackPosition],
    );

    const handleThumbPointerDown = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
      const node = localRef.current;
      const trackNode = trackRef.current;

      if (!node || !trackNode || event.button !== 0) {
        return;
      }

      const maxScrollLeft = Math.max(node.scrollWidth - node.clientWidth, 0);
      const travel = Math.max(trackNode.clientWidth - thumbState.width, 0);

      if (maxScrollLeft <= 0 || travel <= 0) {
        return;
      }

      dragStateRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startScrollLeft: node.scrollLeft,
        maxScrollLeft,
        travel,
      };
      setIsDraggingThumb(true);

      event.preventDefault();
      event.stopPropagation();
      focusScrollbarShell();
      event.currentTarget.setPointerCapture(event.pointerId);
    }, [focusScrollbarShell, thumbState.width]);

    const handleThumbPointerMove = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
      const node = localRef.current;
      const dragState = dragStateRef.current;

      if (!node || !dragState || dragState.pointerId !== event.pointerId) {
        return;
      }

      const deltaX = event.clientX - dragState.startX;
      const scrollDelta = (deltaX / dragState.travel) * dragState.maxScrollLeft;

      node.scrollLeft = dragState.startScrollLeft + scrollDelta;
    }, []);

    const handleThumbPointerEnd = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
      const dragState = dragStateRef.current;

      if (!dragState || dragState.pointerId !== event.pointerId) {
        return;
      }

      dragStateRef.current = null;
      setIsDraggingThumb(false);
      event.currentTarget.releasePointerCapture(event.pointerId);
    }, []);

    const setRefs = React.useCallback(
      (node: React.ElementRef<typeof TabsPrimitive.List> | null) => {
        localRef.current = node;

        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }

        if (node) {
          requestAnimationFrame(updateThumbState);
        }
      },
      [ref, updateThumbState],
    );

    React.useEffect(() => {
      const node = localRef.current;

      if (!node) {
        return;
      }

      updateThumbState();

      const handleScroll = () => {
        updateThumbState();
      };

      node.addEventListener('scroll', handleScroll, { passive: true });

      const resizeObserver = new ResizeObserver(() => {
        updateThumbState();
      });

      resizeObserver.observe(node);
      Array.from(node.children).forEach((child) => {
        resizeObserver.observe(child);
      });

      return () => {
        node.removeEventListener('scroll', handleScroll);
        resizeObserver.disconnect();
      };
    }, [children, updateThumbState]);

    const isScrollbarVisible = thumbState.hasOverflow && (isPointerInside || hasFocusWithin || isDraggingThumb);
    const handleShellKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) {
        return;
      }

      const node = localRef.current;

      if (!node || !thumbState.isHorizontal || !thumbState.hasOverflow) {
        return;
      }

      const pageStep = Math.max(Math.round(node.clientWidth * 0.85), 48);

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          node.scrollBy({ left: -40, behavior: 'auto' });
          break;
        case 'ArrowRight':
          event.preventDefault();
          node.scrollBy({ left: 40, behavior: 'auto' });
          break;
        case 'Home':
          event.preventDefault();
          node.scrollTo({ left: 0, behavior: 'auto' });
          break;
        case 'End':
          event.preventDefault();
          node.scrollTo({ left: node.scrollWidth, behavior: 'auto' });
          break;
        case 'PageUp':
          event.preventDefault();
          node.scrollBy({ left: -pageStep, behavior: 'auto' });
          break;
        case 'PageDown':
          event.preventDefault();
          node.scrollBy({ left: pageStep, behavior: 'auto' });
          break;
        default:
          break;
      }
    }, [thumbState.hasOverflow, thumbState.isHorizontal]);

    return (
      <Box
        ref={shellRef}
        data-slot="tabs-list-shell"
        tabIndex={thumbState.isHorizontal && thumbState.hasOverflow ? -1 : undefined}
        className={cn(
          'relative min-w-0 overflow-hidden outline-none transition-[padding] duration-150 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none',
          isScrollbarVisible && 'pb-[5px]',
        )}
        onKeyDown={handleShellKeyDown}
        onPointerEnter={() => setIsPointerInside(true)}
        onPointerLeave={() => setIsPointerInside(false)}
        onFocusCapture={() => setHasFocusWithin(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setHasFocusWithin(false);
          }
        }}
      >
        <TabsPrimitive.List ref={setRefs} asChild {...props}>
          <Box data-slot="tabs-list" className={cn(tabsListVariants({ variant }), className)}>
            {children}
          </Box>
        </TabsPrimitive.List>

        {thumbState.isHorizontal && thumbState.hasOverflow ? (
          <>
            <Box
              aria-hidden="true"
              data-slot="tabs-list-scroll-cue-start"
              className={cn(
                'pointer-events-none absolute inset-y-0 left-0 z-[1] w-8 bg-gradient-to-r from-background via-background/95 to-transparent transition-opacity duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none',
                thumbState.canScrollStart ? 'opacity-100' : 'opacity-0',
              )}
            />
            <Box
              aria-hidden="true"
              data-slot="tabs-list-scroll-cue-end"
              className={cn(
                'pointer-events-none absolute inset-y-0 right-0 z-[1] w-8 bg-gradient-to-l from-background via-background/95 to-transparent transition-opacity duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none',
                thumbState.canScrollEnd ? 'opacity-100' : 'opacity-0',
              )}
            />
            <Box
              ref={trackRef}
              aria-hidden="true"
              data-slot="tabs-list-scrollbar-track"
              className={cn(
                'absolute right-0 bottom-0 left-0 z-[2] h-[5px] bg-transparent transition-opacity duration-150 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none',
                isScrollbarVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
              )}
              onPointerDown={handleTrackPointerDown}
            >
              <Box
                aria-hidden="true"
                data-slot="tabs-list-scrollbar-thumb"
                className="absolute top-0 left-0 h-[5px] cursor-default rounded-full bg-[var(--admin-scrollbar-thumb,#d9d9d9)] transition-colors duration-150 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-[var(--admin-scrollbar-thumb-active,#b5b5b5)] motion-reduce:transition-none"
                style={{
                  width: `${thumbState.width}px`,
                  transform: `translateX(${thumbState.offset}px)`,
                }}
                onPointerDown={handleThumbPointerDown}
                onPointerMove={handleThumbPointerMove}
                onPointerUp={handleThumbPointerEnd}
                onPointerCancel={handleThumbPointerEnd}
              />
            </Box>
          </>
        ) : null}
      </Box>
    );
  },
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
