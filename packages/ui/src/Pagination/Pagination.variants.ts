import { cva } from 'class-variance-authority';

export const paginationRootVariants = cva(
  'flex flex-col gap-3 md:flex-row md:items-center md:justify-between',
);

export const paginationMetaVariants = cva(
  'flex min-w-0 flex-wrap items-center gap-3 text-sm text-muted-foreground',
);

export const paginationStatusVariants = cva('text-sm text-muted-foreground');

export const paginationControlsVariants = cva('flex flex-wrap items-center gap-2');

export const paginationListVariants = cva('flex flex-wrap items-center gap-1');

export const paginationButtonVariants = cva(
  [
    'inline-flex min-w-9 cursor-pointer touch-manipulation items-center justify-center gap-1 rounded-md border border-input',
    'bg-background px-3 py-0 text-sm font-medium shadow-sm transition-colors motion-reduce:transition-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      active: {
        false: 'text-foreground enabled:hover:bg-accent enabled:hover:text-accent-foreground',
        true: 'border-primary bg-primary text-primary-foreground shadow-sm',
      },
      size: {
        default: 'h-9',
        compact: 'h-8 text-xs',
      },
    },
    defaultVariants: {
      active: false,
      size: 'default',
    },
  },
);

export const paginationCurrentPageVariants = cva(
  [
    'inline-flex min-w-9 items-center justify-center rounded-md border border-primary bg-primary px-3',
    'py-0 text-sm font-medium text-primary-foreground shadow-sm tabular-nums',
  ].join(' '),
  {
    variants: {
      size: {
        default: 'h-9',
        compact: 'h-8 text-xs',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

export const paginationEllipsisVariants = cva(
  'inline-flex h-9 min-w-9 items-center justify-center text-muted-foreground',
);

export const paginationPageSizeLabelVariants = cva(
  'inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-sm text-muted-foreground',
);

export const paginationPageSizeSelectVariants = cva(
  [
    'w-[4.75rem] shrink-0 gap-0',
    '[&_[data-slot=select-trigger]]:h-9 [&_[data-slot=select-trigger]]:min-h-9 [&_[data-slot=select-trigger]]:w-[4.75rem] [&_[data-slot=select-trigger]]:py-0',
    '[&_[data-slot=select-value]]:text-center [&_[data-slot=select-value]]:tabular-nums',
  ].join(' '),
);


