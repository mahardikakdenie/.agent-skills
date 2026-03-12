import { cva } from 'class-variance-authority';

export const menubarRootVariants = cva(
  [
    'inline-flex w-max items-center gap-1 rounded-2xl border border-border/70 bg-background/90 p-1.5 text-foreground shadow-sm ring-1 ring-border/30',
    'supports-[backdrop-filter]:bg-background/80 supports-[backdrop-filter]:backdrop-blur-xl',
  ].join(' '),
);

export const menubarTriggerVariants = cva(
  [
    'inline-flex h-9 min-w-[4.25rem] select-none items-center justify-center whitespace-nowrap rounded-xl px-3.5 text-[0.8125rem] font-medium text-foreground/80 outline-none',
    'transition-all motion-reduce:transition-none',
    'hover:bg-muted/80 hover:text-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'data-[state=open]:bg-background data-[state=open]:text-foreground data-[state=open]:shadow-sm data-[state=open]:ring-1 data-[state=open]:ring-border/60',
    'data-[highlighted]:bg-background data-[highlighted]:text-foreground data-[highlighted]:shadow-sm',
    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45',
    '[&[data-disabled]:hover]:bg-transparent [&[data-disabled]:hover]:text-foreground/80 [&[data-disabled]:hover]:shadow-none',
    '[&[data-disabled][data-highlighted]]:bg-transparent [&[data-disabled][data-highlighted]]:text-foreground/80 [&[data-disabled][data-highlighted]]:shadow-none',
    '[&[data-disabled][data-state=open]]:bg-transparent [&[data-disabled][data-state=open]]:text-foreground/80 [&[data-disabled][data-state=open]]:ring-0',
  ].join(' '),
);

export const menubarContentVariants = cva(
  [
    'z-50 min-w-64 overflow-hidden rounded-2xl border border-border/70 bg-popover/95 p-1.5 text-popover-foreground shadow-xl ring-1 ring-border/35 outline-none',
    'supports-[backdrop-filter]:backdrop-blur-xl',
    'motion-reduce:transition-none',
    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
    'data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
  ].join(' '),
);

export const menubarLabelVariants = cva('px-2.5 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground', {
  variants: {
    inset: {
      true: 'pl-8',
      false: '',
    },
  },
  defaultVariants: {
    inset: false,
  },
});

export const menubarSeparatorVariants = cva('-mx-0.5 my-1.5 h-px bg-border/80');

export const menubarItemVariants = cva(
  [
    'relative flex min-w-0 cursor-pointer select-none items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium outline-none',
    'transition-colors motion-reduce:transition-none',
    'data-[highlighted]:bg-accent/80 data-[highlighted]:text-accent-foreground',
    'data-[state=open]:bg-accent/80 data-[state=open]:text-accent-foreground',
    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
    '[&[data-disabled]:hover]:bg-transparent [&[data-disabled]:hover]:text-inherit',
    '[&[data-disabled][data-highlighted]]:bg-transparent [&[data-disabled][data-highlighted]]:text-inherit',
    '[&[data-disabled][data-state=open]]:bg-transparent [&[data-disabled][data-state=open]]:text-inherit',
  ].join(' '),
  {
    variants: {
      inset: {
        true: 'pl-8',
        false: '',
      },
      destructive: {
        true: 'text-destructive data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive data-[state=open]:bg-destructive/10 data-[state=open]:text-destructive [&[data-disabled]:hover]:bg-transparent [&[data-disabled]:hover]:text-destructive [&[data-disabled][data-highlighted]]:bg-transparent [&[data-disabled][data-highlighted]]:text-destructive [&[data-disabled][data-state=open]]:bg-transparent [&[data-disabled][data-state=open]]:text-destructive',
        false: '',
      },
    },
    defaultVariants: {
      inset: false,
      destructive: false,
    },
  },
);

export const menubarSelectionItemVariants = cva(
  [
    'relative flex min-w-0 cursor-pointer select-none items-center gap-2.5 rounded-xl py-2 pl-9 pr-2.5 text-sm font-medium outline-none',
    'transition-colors motion-reduce:transition-none',
    'data-[highlighted]:bg-accent/80 data-[highlighted]:text-accent-foreground',
    'data-[state=open]:bg-accent/80 data-[state=open]:text-accent-foreground',
    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
    '[&[data-disabled]:hover]:bg-transparent [&[data-disabled]:hover]:text-inherit',
    '[&[data-disabled][data-highlighted]]:bg-transparent [&[data-disabled][data-highlighted]]:text-inherit',
    '[&[data-disabled][data-state=open]]:bg-transparent [&[data-disabled][data-state=open]]:text-inherit',
  ].join(' '),
  {
    variants: {
      destructive: {
        true: 'text-destructive data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive data-[state=open]:bg-destructive/10 data-[state=open]:text-destructive [&[data-disabled]:hover]:bg-transparent [&[data-disabled]:hover]:text-destructive [&[data-disabled][data-highlighted]]:bg-transparent [&[data-disabled][data-highlighted]]:text-destructive [&[data-disabled][data-state=open]]:bg-transparent [&[data-disabled][data-state=open]]:text-destructive',
        false: '',
      },
    },
    defaultVariants: {
      destructive: false,
    },
  },
);

export const menubarIndicatorVariants = cva('absolute left-2.5 inline-flex h-4 w-4 items-center justify-center text-muted-foreground');

export const menubarShortcutVariants = cva(
  'ml-auto pl-4 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground',
);

export const menubarIconVariants = cva('inline-flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground');

export const menubarChevronVariants = cva(
  'ml-auto inline-flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground',
);