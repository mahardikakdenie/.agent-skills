import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import type { DisplaySurfaceVariant } from '../utils/display-surface-variants';
import { dataTableViewportVariants } from './DataTable.variants';

const DATA_TABLE_SCROLLBAR_SIZE = 5;
const DATA_TABLE_MIN_THUMB_SIZE = 28;
const DATA_TABLE_BOUNDARY_CUE_SIZE = 14;

interface AxisThumbState {
  hasOverflow: boolean;
  size: number;
  offset: number;
  canScrollStart: boolean;
  canScrollEnd: boolean;
}

interface DataTableViewportProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: DisplaySurfaceVariant;
  leftCueInset?: number;
  rightCueInset?: number;
}

function createEmptyAxisThumbState(): AxisThumbState {
  return {
    hasOverflow: false,
    size: 0,
    offset: 0,
    canScrollStart: false,
    canScrollEnd: false,
  };
}

function getBoundaryCueStyle(side: 'left' | 'right', inset: number): React.CSSProperties {
  if (side === 'left') {
    return {
      left: `${Math.max(inset - 1, 0)}px`,
      bottom: 0,
      width: `${DATA_TABLE_BOUNDARY_CUE_SIZE}px`,
      boxShadow:
        'inset 1px 0 0 hsl(var(--border) / 0.9), 12px 0 16px -14px hsl(var(--foreground) / 0.28)',
    };
  }

  return {
    right: `${Math.max(inset - 1, 0)}px`,
    bottom: 0,
    width: `${DATA_TABLE_BOUNDARY_CUE_SIZE}px`,
    boxShadow:
      'inset -1px 0 0 hsl(var(--border) / 0.9), -12px 0 16px -14px hsl(var(--foreground) / 0.28)',
  };
}

function getHorizontalThumbState(node: HTMLDivElement): AxisThumbState {
  const maxScrollLeft = Math.max(node.scrollWidth - node.clientWidth, 0);
  const hasOverflow = maxScrollLeft > 1;

  if (!hasOverflow) {
    return createEmptyAxisThumbState();
  }

  const size = Math.max(
    (node.clientWidth / node.scrollWidth) * node.clientWidth,
    DATA_TABLE_MIN_THUMB_SIZE,
  );
  const travel = Math.max(node.clientWidth - size, 0);

  return {
    hasOverflow: true,
    size,
    offset: maxScrollLeft > 0 ? (node.scrollLeft / maxScrollLeft) * travel : 0,
    canScrollStart: node.scrollLeft > 1,
    canScrollEnd: node.scrollLeft < maxScrollLeft - 1,
  };
}

function getVerticalThumbState(node: HTMLDivElement): AxisThumbState {
  const maxScrollTop = Math.max(node.scrollHeight - node.clientHeight, 0);
  const hasOverflow = maxScrollTop > 1;

  if (!hasOverflow) {
    return createEmptyAxisThumbState();
  }

  const size = Math.max(
    (node.clientHeight / node.scrollHeight) * node.clientHeight,
    DATA_TABLE_MIN_THUMB_SIZE,
  );
  const travel = Math.max(node.clientHeight - size, 0);

  return {
    hasOverflow: true,
    size,
    offset: maxScrollTop > 0 ? (node.scrollTop / maxScrollTop) * travel : 0,
    canScrollStart: node.scrollTop > 1,
    canScrollEnd: node.scrollTop < maxScrollTop - 1,
  };
}

export const DataTableViewport = React.forwardRef<HTMLDivElement, DataTableViewportProps>(
  (
    {
      variant = 'outline',
      className,
      children,
      style,
      leftCueInset = 0,
      rightCueInset = 0,
      ...props
    },
    ref,
  ) => {
    const viewportRef = React.useRef<HTMLDivElement | null>(null);
    const shellRef = React.useRef<HTMLDivElement | null>(null);
    const horizontalTrackRef = React.useRef<HTMLDivElement | null>(null);
    const verticalTrackRef = React.useRef<HTMLDivElement | null>(null);
    const keyboardScrollTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const dragStateRef = React.useRef<{
      axis: 'horizontal' | 'vertical';
      pointerId: number;
      startPosition: number;
      startScrollOffset: number;
      maxScrollOffset: number;
      travel: number;
    } | null>(null);
    const [horizontalThumbState, setHorizontalThumbState] = React.useState<AxisThumbState>(
      createEmptyAxisThumbState,
    );
    const [verticalThumbState, setVerticalThumbState] = React.useState<AxisThumbState>(
      createEmptyAxisThumbState,
    );
    const [isPointerInside, setIsPointerInside] = React.useState(false);
    const [isDraggingThumb, setIsDraggingThumb] = React.useState(false);
    const [isKeyboardScrolling, setIsKeyboardScrolling] = React.useState(false);

    const updateOverflowState = React.useCallback(() => {
      const node = viewportRef.current;

      if (!node) {
        return;
      }

      setHorizontalThumbState(getHorizontalThumbState(node));
      setVerticalThumbState(getVerticalThumbState(node));
    }, []);

    const focusScrollbarShell = React.useCallback(() => {
      shellRef.current?.focus({ preventScroll: true });
    }, []);

    const revealScrollbarForKeyboardScroll = React.useCallback(() => {
      setIsKeyboardScrolling(true);

      if (keyboardScrollTimeoutRef.current) {
        clearTimeout(keyboardScrollTimeoutRef.current);
      }

      keyboardScrollTimeoutRef.current = setTimeout(() => {
        setIsKeyboardScrolling(false);
        keyboardScrollTimeoutRef.current = null;
      }, 900);
    }, []);

    const scrollToTrackPosition = React.useCallback((axis: 'horizontal' | 'vertical', client: number) => {
      const node = viewportRef.current;
      const trackNode = axis === 'horizontal' ? horizontalTrackRef.current : verticalTrackRef.current;

      if (!node || !trackNode) {
        return;
      }

      if (axis === 'horizontal') {
        const maxScrollLeft = Math.max(node.scrollWidth - node.clientWidth, 0);

        if (maxScrollLeft <= 0) {
          return;
        }

        const thumbSize = Math.max(
          (node.clientWidth / node.scrollWidth) * node.clientWidth,
          DATA_TABLE_MIN_THUMB_SIZE,
        );
        const trackRect = trackNode.getBoundingClientRect();
        const travel = Math.max(trackRect.width - thumbSize, 0);
        const pointerOffset = client - trackRect.left;
        const thumbOffset = Math.min(Math.max(pointerOffset - thumbSize / 2, 0), travel);

        node.scrollLeft = travel > 0 ? (thumbOffset / travel) * maxScrollLeft : 0;
        return;
      }

      const maxScrollTop = Math.max(node.scrollHeight - node.clientHeight, 0);

      if (maxScrollTop <= 0) {
        return;
      }

      const thumbSize = Math.max(
        (node.clientHeight / node.scrollHeight) * node.clientHeight,
        DATA_TABLE_MIN_THUMB_SIZE,
      );
      const trackRect = trackNode.getBoundingClientRect();
      const travel = Math.max(trackRect.height - thumbSize, 0);
      const pointerOffset = client - trackRect.top;
      const thumbOffset = Math.min(Math.max(pointerOffset - thumbSize / 2, 0), travel);

      node.scrollTop = travel > 0 ? (thumbOffset / travel) * maxScrollTop : 0;
    }, []);

    const handleTrackPointerDown = React.useCallback(
      (axis: 'horizontal' | 'vertical', event: React.PointerEvent<HTMLDivElement>) => {
        if (event.button !== 0) {
          return;
        }

        event.preventDefault();
        focusScrollbarShell();
        scrollToTrackPosition(axis, axis === 'horizontal' ? event.clientX : event.clientY);
      },
      [focusScrollbarShell, scrollToTrackPosition],
    );

    const handleThumbPointerDown = React.useCallback(
      (axis: 'horizontal' | 'vertical', event: React.PointerEvent<HTMLDivElement>) => {
        const node = viewportRef.current;
        const trackNode = axis === 'horizontal' ? horizontalTrackRef.current : verticalTrackRef.current;

        if (!node || !trackNode || event.button !== 0) {
          return;
        }

        const maxScrollOffset =
          axis === 'horizontal'
            ? Math.max(node.scrollWidth - node.clientWidth, 0)
            : Math.max(node.scrollHeight - node.clientHeight, 0);
        const thumbSize = axis === 'horizontal' ? horizontalThumbState.size : verticalThumbState.size;
        const travel =
          axis === 'horizontal'
            ? Math.max(trackNode.clientWidth - thumbSize, 0)
            : Math.max(trackNode.clientHeight - thumbSize, 0);

        if (maxScrollOffset <= 0 || travel <= 0) {
          return;
        }

        dragStateRef.current = {
          axis,
          pointerId: event.pointerId,
          startPosition: axis === 'horizontal' ? event.clientX : event.clientY,
          startScrollOffset: axis === 'horizontal' ? node.scrollLeft : node.scrollTop,
          maxScrollOffset,
          travel,
        };
        setIsDraggingThumb(true);

        event.preventDefault();
        event.stopPropagation();
        focusScrollbarShell();
        event.currentTarget.setPointerCapture(event.pointerId);
      },
      [focusScrollbarShell, horizontalThumbState.size, verticalThumbState.size],
    );

    const handleThumbPointerMove = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
      const node = viewportRef.current;
      const dragState = dragStateRef.current;

      if (!node || !dragState || dragState.pointerId !== event.pointerId) {
        return;
      }

      const nextPosition = dragState.axis === 'horizontal' ? event.clientX : event.clientY;
      const delta = nextPosition - dragState.startPosition;
      const scrollDelta = (delta / dragState.travel) * dragState.maxScrollOffset;

      if (dragState.axis === 'horizontal') {
        node.scrollLeft = dragState.startScrollOffset + scrollDelta;
        return;
      }

      node.scrollTop = dragState.startScrollOffset + scrollDelta;
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
      (node: HTMLDivElement | null) => {
        viewportRef.current = node;

        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }

        if (node) {
          requestAnimationFrame(updateOverflowState);
        }
      },
      [ref, updateOverflowState],
    );

    React.useEffect(() => {
      const node = viewportRef.current;

      if (!node) {
        return;
      }

      updateOverflowState();

      const handleScroll = () => {
        updateOverflowState();
      };

      node.addEventListener('scroll', handleScroll, { passive: true });

      if (typeof ResizeObserver === 'undefined') {
        window.addEventListener('resize', handleScroll);

        return () => {
          node.removeEventListener('scroll', handleScroll);
          window.removeEventListener('resize', handleScroll);
        };
      }

      const resizeObserver = new ResizeObserver(() => {
        updateOverflowState();
      });

      resizeObserver.observe(node);

      if (node.firstElementChild instanceof HTMLElement) {
        resizeObserver.observe(node.firstElementChild);
      }

      return () => {
        node.removeEventListener('scroll', handleScroll);
        resizeObserver.disconnect();
      };
    }, [children, updateOverflowState]);

    React.useEffect(
      () => () => {
        if (keyboardScrollTimeoutRef.current) {
          clearTimeout(keyboardScrollTimeoutRef.current);
        }
      },
      [],
    );

    const isHorizontalScrollbarVisible =
      horizontalThumbState.hasOverflow && (isPointerInside || isDraggingThumb || isKeyboardScrolling);
    const isVerticalScrollbarVisible =
      verticalThumbState.hasOverflow && (isPointerInside || isDraggingThumb || isKeyboardScrolling);

    const handleShellKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.target !== event.currentTarget) {
          return;
        }

        const node = viewportRef.current;

        if (!node) {
          return;
        }

        const horizontalPageStep = Math.max(Math.round(node.clientWidth * 0.85), 48);
        const verticalPageStep = Math.max(Math.round(node.clientHeight * 0.85), 48);

        switch (event.key) {
          case 'ArrowLeft':
            if (!horizontalThumbState.hasOverflow) {
              return;
            }
            event.preventDefault();
            revealScrollbarForKeyboardScroll();
            node.scrollBy({ left: -40, behavior: 'auto' });
            break;
          case 'ArrowRight':
            if (!horizontalThumbState.hasOverflow) {
              return;
            }
            event.preventDefault();
            revealScrollbarForKeyboardScroll();
            node.scrollBy({ left: 40, behavior: 'auto' });
            break;
          case 'ArrowUp':
            if (!verticalThumbState.hasOverflow) {
              return;
            }
            event.preventDefault();
            revealScrollbarForKeyboardScroll();
            node.scrollBy({ top: -40, behavior: 'auto' });
            break;
          case 'ArrowDown':
            if (!verticalThumbState.hasOverflow) {
              return;
            }
            event.preventDefault();
            revealScrollbarForKeyboardScroll();
            node.scrollBy({ top: 40, behavior: 'auto' });
            break;
          case 'Home':
            event.preventDefault();
            revealScrollbarForKeyboardScroll();
            node.scrollTo({
              left: horizontalThumbState.hasOverflow ? 0 : node.scrollLeft,
              top: verticalThumbState.hasOverflow ? 0 : node.scrollTop,
              behavior: 'auto',
            });
            break;
          case 'End':
            event.preventDefault();
            revealScrollbarForKeyboardScroll();
            node.scrollTo({
              left: horizontalThumbState.hasOverflow ? node.scrollWidth : node.scrollLeft,
              top: verticalThumbState.hasOverflow ? node.scrollHeight : node.scrollTop,
              behavior: 'auto',
            });
            break;
          case 'PageUp':
            if (verticalThumbState.hasOverflow) {
              event.preventDefault();
              revealScrollbarForKeyboardScroll();
              node.scrollBy({ top: -verticalPageStep, behavior: 'auto' });
              return;
            }

            if (horizontalThumbState.hasOverflow) {
              event.preventDefault();
              revealScrollbarForKeyboardScroll();
              node.scrollBy({ left: -horizontalPageStep, behavior: 'auto' });
            }
            break;
          case 'PageDown':
            if (verticalThumbState.hasOverflow) {
              event.preventDefault();
              revealScrollbarForKeyboardScroll();
              node.scrollBy({ top: verticalPageStep, behavior: 'auto' });
              return;
            }

            if (horizontalThumbState.hasOverflow) {
              event.preventDefault();
              revealScrollbarForKeyboardScroll();
              node.scrollBy({ left: horizontalPageStep, behavior: 'auto' });
            }
            break;
          default:
            break;
        }
      },
      [
        horizontalThumbState.hasOverflow,
        revealScrollbarForKeyboardScroll,
        verticalThumbState.hasOverflow,
      ],
    );

    return (
      <Box
        ref={shellRef}
        data-slot="data-table-overflow-shell"
        tabIndex={horizontalThumbState.hasOverflow || verticalThumbState.hasOverflow ? -1 : undefined}
        className="relative min-w-0 overflow-hidden rounded-lg outline-none"
        onKeyDown={handleShellKeyDown}
        onPointerEnter={() => setIsPointerInside(true)}
        onPointerLeave={() => setIsPointerInside(false)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsKeyboardScrolling(false);

            if (keyboardScrollTimeoutRef.current) {
              clearTimeout(keyboardScrollTimeoutRef.current);
              keyboardScrollTimeoutRef.current = null;
            }
          }
        }}
      >
        <Box
          ref={setRefs}
          data-slot="data-table-viewport"
          className={cn(
            dataTableViewportVariants({ variant }),
            '[-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none]',
            '[&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent',
            className,
          )}
          style={style}
          {...props}
        >
          {children}
        </Box>

        {horizontalThumbState.hasOverflow ? (
          <>
            <Box
              aria-hidden="true"
              data-slot="data-table-scroll-cue-start"
              className={cn(
                'pointer-events-none absolute top-0 z-[8] transition-opacity duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none',
                horizontalThumbState.canScrollStart ? 'opacity-100' : 'opacity-0',
              )}
              style={getBoundaryCueStyle('left', leftCueInset)}
            />
            <Box
              aria-hidden="true"
              data-slot="data-table-scroll-cue-end"
              className={cn(
                'pointer-events-none absolute top-0 z-[8] transition-opacity duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none',
                horizontalThumbState.canScrollEnd ? 'opacity-100' : 'opacity-0',
              )}
              style={getBoundaryCueStyle('right', rightCueInset)}
            />
            <Box
              ref={horizontalTrackRef}
              aria-hidden="true"
              data-slot="data-table-scrollbar-track-horizontal"
              className={cn(
                'absolute right-0 bottom-0 left-0 z-[9] bg-transparent transition-opacity duration-150 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none',
                isHorizontalScrollbarVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
              )}
              style={{
                height: `${DATA_TABLE_SCROLLBAR_SIZE}px`,
              }}
              onPointerDown={(event) => handleTrackPointerDown('horizontal', event)}
            >
              <Box
                aria-hidden="true"
                data-slot="data-table-scrollbar-thumb-horizontal"
                className="absolute top-0 left-0 cursor-default rounded-full bg-[var(--admin-scrollbar-thumb,#d9d9d9)] transition-colors duration-150 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-[var(--admin-scrollbar-thumb-active,#b5b5b5)] motion-reduce:transition-none"
                style={{
                  height: `${DATA_TABLE_SCROLLBAR_SIZE}px`,
                  width: `${horizontalThumbState.size}px`,
                  transform: `translateX(${horizontalThumbState.offset}px)`,
                }}
                onPointerDown={(event) => handleThumbPointerDown('horizontal', event)}
                onPointerMove={handleThumbPointerMove}
                onPointerUp={handleThumbPointerEnd}
                onPointerCancel={handleThumbPointerEnd}
              />
            </Box>
          </>
        ) : null}

        {verticalThumbState.hasOverflow ? (
          <Box
            ref={verticalTrackRef}
            aria-hidden="true"
            data-slot="data-table-scrollbar-track-vertical"
            className={cn(
              'absolute top-0 right-0 bottom-0 z-[9] bg-transparent transition-opacity duration-150 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none',
              isVerticalScrollbarVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
            )}
            style={{
              width: `${DATA_TABLE_SCROLLBAR_SIZE}px`,
            }}
            onPointerDown={(event) => handleTrackPointerDown('vertical', event)}
          >
            <Box
              aria-hidden="true"
              data-slot="data-table-scrollbar-thumb-vertical"
              className="absolute top-0 right-0 cursor-default rounded-full bg-[var(--admin-scrollbar-thumb,#d9d9d9)] transition-colors duration-150 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-[var(--admin-scrollbar-thumb-active,#b5b5b5)] motion-reduce:transition-none"
              style={{
                width: `${DATA_TABLE_SCROLLBAR_SIZE}px`,
                height: `${verticalThumbState.size}px`,
                transform: `translateY(${verticalThumbState.offset}px)`,
              }}
              onPointerDown={(event) => handleThumbPointerDown('vertical', event)}
              onPointerMove={handleThumbPointerMove}
              onPointerUp={handleThumbPointerEnd}
              onPointerCancel={handleThumbPointerEnd}
            />
          </Box>
        ) : null}
      </Box>
    );
  },
);

DataTableViewport.displayName = 'DataTableViewport';
