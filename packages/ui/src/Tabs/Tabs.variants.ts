import { cva } from 'class-variance-authority';

import { getDenseSurfaceFocusRecipe } from '../utils/focus-normalization';

const directDenseSurfaceFocus = getDenseSurfaceFocusRecipe('direct');

export const tabsRootVariants = cva('flex w-full flex-col gap-4', {
  variants: {
    orientation: {
      horizontal: '',
      vertical: 'gap-6 md:grid md:grid-cols-[minmax(12rem,16rem)_minmax(0,1fr)] md:items-start',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export const tabsListVariants = cva(
  [
    'inline-flex max-w-full items-center gap-2 text-muted-foreground',
    'data-[orientation=horizontal]:w-full data-[orientation=horizontal]:overflow-x-auto data-[orientation=horizontal]:overflow-y-hidden',
    'data-[orientation=vertical]:grid data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-stretch',
  ].join(' '),
);

export const tabsTriggerVariants = cva(
  [
    'inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-sm font-medium',
    'touch-manipulation whitespace-nowrap transition-colors outline-none',
    directDenseSurfaceFocus.base,
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-muted-foreground disabled:hover:shadow-none',
    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:hover:bg-transparent data-[disabled]:hover:text-muted-foreground data-[disabled]:hover:shadow-none',
    'data-[orientation=horizontal]:shrink-0',
    'data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start',
    'motion-reduce:transition-none',
  ].join(' '),
  {
    variants: {
      variant: {
        outline:
          'border border-border bg-background text-foreground shadow-none enabled:data-[state=inactive]:hover:bg-accent/70 enabled:data-[state=inactive]:hover:text-accent-foreground data-[state=active]:bg-accent/60 data-[state=active]:text-accent-foreground',
        ghost:
          'border border-transparent bg-transparent text-muted-foreground shadow-none enabled:data-[state=inactive]:hover:bg-accent/70 enabled:data-[state=inactive]:hover:text-accent-foreground data-[state=active]:bg-accent/60 data-[state=active]:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'outline',
    },
  },
);

export const tabsContentVariants = cva(
  [
    'min-w-0 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm outline-none',
    directDenseSurfaceFocus.base,
    'data-[state=inactive]:hidden',
  ].join(' '),
);
