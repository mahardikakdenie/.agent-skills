import { cva } from 'class-variance-authority';

import { getDenseSurfaceFocusRecipe } from '../utils/focus-normalization';

const directDenseSurfaceFocus = getDenseSurfaceFocusRecipe('direct');

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
    'inline-flex min-w-9 cursor-pointer touch-manipulation items-center justify-center gap-1 rounded-md',
    'px-3 py-0 text-sm font-medium transition-colors motion-reduce:transition-none',
    directDenseSurfaceFocus.base,
    'disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        outline:
          'border border-border bg-background text-foreground shadow-none enabled:hover:bg-accent enabled:hover:text-accent-foreground',
        shadow:
          'border border-border bg-background text-foreground shadow-sm enabled:hover:bg-accent enabled:hover:text-accent-foreground',
        ghost:
          'border border-transparent bg-transparent text-foreground shadow-none enabled:hover:bg-accent enabled:hover:text-accent-foreground',
        default:
          'border border-border bg-background text-foreground shadow-sm enabled:hover:bg-accent enabled:hover:text-accent-foreground',
      },
      size: {
        default: 'h-9',
        compact: 'h-8 text-xs',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'default',
    },
  },
);

export const paginationCurrentPageVariants = cva(
  [
    'inline-flex min-w-9 items-center justify-center rounded-md px-3 py-0 text-sm font-medium tabular-nums',
  ].join(' '),
  {
    variants: {
      variant: {
        outline: 'border border-border bg-accent/60 text-accent-foreground shadow-none',
        shadow: 'border border-border bg-accent/60 text-accent-foreground shadow-sm',
        ghost: 'border border-transparent bg-accent/60 text-accent-foreground shadow-none',
        default: 'border border-border bg-accent/60 text-accent-foreground shadow-sm',
      },
      size: {
        default: 'h-9',
        compact: 'h-8 text-xs',
      },
    },
    defaultVariants: {
      variant: 'outline',
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
