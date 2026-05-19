'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

import { Box } from '@repo/ui';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  backgroundColor?: string;
  textColor?: string;
  arrowColor?: string;
  isShow?: boolean;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 0,
  className,
  backgroundColor = 'bg-zinc-800',
  textColor = 'text-white',
  arrowColor,
  isShow,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  let timeout: NodeJS.Timeout;

  const calculatePosition = () => {
    if (!tooltipRef.current || !targetRef.current) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    const positions = {
      top: {
        top: targetRect.top - tooltipRect.height - 8,
        left: targetRect.left + (targetRect.width - tooltipRect.width) / 2,
      },
      bottom: {
        top: targetRect.bottom + 8,
        left: targetRect.left + (targetRect.width - tooltipRect.width) / 2,
      },
      left: {
        top: targetRect.top + (targetRect.height - tooltipRect.height) / 2,
        left: targetRect.left - tooltipRect.width - 8,
      },
      right: {
        top: targetRect.top + (targetRect.height - tooltipRect.height) / 2,
        left: targetRect.right + 8,
      },
    };

    setTooltipPosition(positions[position]);
  };

  const showTooltip = () => {
    timeout = setTimeout(() => {
      setIsVisible(true);
      calculatePosition();
    }, delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeout);
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener('scroll', calculatePosition);
      window.addEventListener('resize', calculatePosition);
    }

    return () => {
      window.removeEventListener('scroll', calculatePosition);
      window.removeEventListener('resize', calculatePosition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  if (!isShow) {
    return <>{children}</>;
  }

  return (
    <Box className="relative inline-block">
      <Box
        ref={targetRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </Box>
      {isVisible && (
        <Box
          ref={tooltipRef}
          role="tooltip"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
          className={[
            'fixed z-50 px-2 py-1 text-sm font-medium rounded shadow-sm',
            backgroundColor,
            textColor,
            'animate-in fade-in-0 zoom-in-95',
            className,
          ].join(' ')}
        >
          {content}
          <Box
            className={[
              'absolute w-2 h-2 rotate-45',
              arrowColor || backgroundColor,
              position === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2',
              position === 'bottom' && 'top-[-4px] left-1/2 -translate-x-1/2',
              position === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2',
              position === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2',
            ].join(' ')}
          />
        </Box>
      )}
    </Box>
  );
}
