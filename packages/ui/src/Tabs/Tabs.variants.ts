import { cva } from 'class-variance-authority';

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
    'inline-flex max-w-full items-center gap-1 rounded-xl border border-border bg-muted/40 p-1 text-muted-foreground',
    'data-[orientation=horizontal]:w-full data-[orientation=horizontal]:overflow-x-auto data-[orientation=horizontal]:overflow-y-hidden',
    'data-[orientation=vertical]:grid data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-stretch',
  ].join(' '),
);

export const tabsTriggerVariants = cva(
  [
    'inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground',
    'touch-manipulation whitespace-nowrap transition-colors outline-none',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
    'enabled:data-[state=inactive]:hover:bg-accent/70 enabled:data-[state=inactive]:hover:text-accent-foreground',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-muted-foreground disabled:hover:shadow-none',
    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:hover:bg-transparent data-[disabled]:hover:text-muted-foreground data-[disabled]:hover:shadow-none',
    'data-[orientation=horizontal]:shrink-0',
    'data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start',
    'motion-reduce:transition-none',
  ].join(' '),
);

export const tabsContentVariants = cva(
  [
    'min-w-0 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm outline-none',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'data-[state=inactive]:hidden',
  ].join(' '),
);
