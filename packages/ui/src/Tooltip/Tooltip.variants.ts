import { cva } from 'class-variance-authority';

export const tooltipContentVariants = cva(
  [
    'z-50 max-w-72 overflow-hidden rounded-xl border border-border bg-popover px-3 py-2 text-xs leading-5 text-popover-foreground shadow-lg outline-none break-words text-pretty',
    'origin-[var(--radix-tooltip-content-transform-origin)]',
    'motion-reduce:transition-none',
    'data-[state=instant-open]:animate-in data-[state=delayed-open]:animate-in',
    'data-[state=closed]:animate-out data-[state=instant-open]:fade-in-0 data-[state=delayed-open]:fade-in-0',
    'data-[state=closed]:fade-out-0 data-[state=instant-open]:zoom-in-95 data-[state=delayed-open]:zoom-in-95',
    'data-[state=closed]:zoom-out-95',
    'data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:slide-in-from-top-2',
    'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
  ].join(' '),
);

export const tooltipArrowVariants = cva('fill-popover');
