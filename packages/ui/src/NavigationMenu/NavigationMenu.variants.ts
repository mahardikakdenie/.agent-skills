import { cva } from 'class-variance-authority';

import { getDenseSurfaceFocusRecipe } from '../utils/focus-normalization';

const directDenseSurfaceFocus = getDenseSurfaceFocusRecipe('direct');

export const navigationMenuRootVariants = cva('relative text-foreground', {
  variants: {
    orientation: {
      horizontal: 'grid max-w-max justify-items-start gap-2',
      vertical: 'flex w-full flex-col items-stretch justify-start',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export const navigationMenuListVariants = cva(
  [
    'group/list relative z-20 m-0 flex list-none items-center gap-2 text-foreground',
  ].join(' '),
  {
    variants: {
      orientation: {
        horizontal: 'w-max flex-row',
        vertical: 'w-full flex-col items-stretch',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  },
);

export const navigationMenuTriggerVariants = cva(
  [
    'group inline-flex h-10 min-w-[4.5rem] select-none items-center justify-center gap-1 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium outline-none',
    'transition-all motion-reduce:transition-none',
    directDenseSurfaceFocus.base,
    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45',
    '[&[data-disabled]:hover]:bg-transparent [&[data-disabled]:hover]:text-muted-foreground [&[data-disabled]:hover]:shadow-none',
    '[&[data-disabled][data-state=open]]:bg-transparent [&[data-disabled][data-state=open]]:text-muted-foreground',
  ].join(' '),
  {
    variants: {
      variant: {
        outline:
          'border border-border bg-background text-foreground shadow-none hover:bg-muted/80 hover:text-foreground data-[active]:bg-accent/60 data-[active]:text-accent-foreground data-[state=open]:bg-accent/60 data-[state=open]:text-accent-foreground',
        shadow:
          'border border-border bg-background text-foreground shadow-sm hover:bg-muted/80 hover:text-foreground data-[active]:bg-accent/60 data-[active]:text-accent-foreground data-[state=open]:bg-accent/60 data-[state=open]:text-accent-foreground',
        ghost:
          'border border-transparent bg-transparent text-muted-foreground shadow-none hover:bg-muted/80 hover:text-foreground data-[active]:bg-accent/60 data-[active]:text-accent-foreground data-[state=open]:bg-accent/60 data-[state=open]:text-accent-foreground',
        default:
          'border border-border bg-background text-foreground shadow-sm hover:bg-muted/80 hover:text-foreground data-[active]:bg-accent/60 data-[active]:text-accent-foreground data-[state=open]:bg-accent/60 data-[state=open]:text-accent-foreground',
      },
      orientation: {
        horizontal: '',
        vertical: 'w-full justify-between',
      },
    },
    defaultVariants: {
      variant: 'outline',
      orientation: 'horizontal',
    },
  },
);

export const navigationMenuLinkVariants = cva(
  [
    'inline-flex h-10 min-w-[4.5rem] select-none items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium outline-none',
    'transition-all motion-reduce:transition-none',
    directDenseSurfaceFocus.base,
  ].join(' '),
  {
    variants: {
      variant: {
        outline:
          'border border-border bg-background text-foreground shadow-none hover:bg-muted/80 hover:text-foreground data-[active]:bg-accent/60 data-[active]:text-accent-foreground',
        shadow:
          'border border-border bg-background text-foreground shadow-sm hover:bg-muted/80 hover:text-foreground data-[active]:bg-accent/60 data-[active]:text-accent-foreground',
        ghost:
          'border border-transparent bg-transparent text-muted-foreground shadow-none hover:bg-muted/80 hover:text-foreground data-[active]:bg-accent/60 data-[active]:text-accent-foreground',
        default:
          'border border-border bg-background text-foreground shadow-sm hover:bg-muted/80 hover:text-foreground data-[active]:bg-accent/60 data-[active]:text-accent-foreground',
      },
      orientation: {
        horizontal: '',
        vertical: 'w-full justify-start',
      },
    },
    defaultVariants: {
      variant: 'outline',
      orientation: 'horizontal',
    },
  },
);

export const navigationMenuContentVariants = cva(
  [
    'left-0 top-0 w-full rounded-2xl border border-border/70 bg-popover/95 p-2 text-popover-foreground shadow-xl ring-1 ring-border/35 outline-none',
    'supports-[backdrop-filter]:backdrop-blur-xl',
    'motion-reduce:transition-none',
    'data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in-0 data-[motion^=to-]:fade-out-0',
    'data-[motion=from-end]:slide-in-from-right-8 data-[motion=from-start]:slide-in-from-left-8 data-[motion=to-end]:slide-out-to-right-8 data-[motion=to-start]:slide-out-to-left-8',
  ].join(' '),
  {
    variants: {
      orientation: {
        horizontal: 'md:absolute md:left-0 md:top-[calc(100%+0.75rem)] md:z-10 md:w-[var(--radix-navigation-menu-viewport-width)]',
        vertical: 'relative w-full',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  },
);

export const navigationMenuViewportWrapperVariants = cva('flex w-full', {
  variants: {
    orientation: {
      horizontal: 'absolute left-0 top-[calc(100%+0.75rem)] z-10 justify-start',
      vertical: 'relative mt-2 justify-start',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export const navigationMenuViewportVariants = cva(
  [
    'origin-top-left relative h-[var(--radix-navigation-menu-viewport-height)] overflow-hidden rounded-2xl border border-border/70 bg-popover/95 text-popover-foreground shadow-xl ring-1 ring-border/35',
    'supports-[backdrop-filter]:backdrop-blur-xl',
    'motion-reduce:transition-none',
    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
  ].join(' '),
  {
    variants: {
      orientation: {
        horizontal: 'w-full md:w-[var(--radix-navigation-menu-viewport-width)]',
        vertical: 'w-full',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  },
);

export const navigationMenuIndicatorVariants = cva(
  'pointer-events-none z-[1] flex overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
  {
    variants: {
      orientation: {
        horizontal: 'absolute left-0 top-[calc(100%-0.125rem)] z-30 h-3 items-start justify-center',
        vertical: 'left-full h-10 w-2 items-end justify-center self-start',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  },
);

export const navigationMenuIndicatorCaretVariants = cva('', {
  variants: {
    orientation: {
      horizontal: 'h-1 w-8 rounded-full bg-primary/45 shadow-sm ring-1 ring-primary/10',
      vertical: 'relative left-[-45%] h-2.5 w-2.5 rotate-45 rounded-tr-sm bg-border/90 shadow-sm',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});
