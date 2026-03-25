import { cva } from 'class-variance-authority';

export const dialogOverlayVariants = cva(
  [
    'fixed inset-0 z-50 bg-foreground/45 backdrop-blur-[1px]',
    'transition-opacity duration-200 motion-reduce:transition-none',
    'data-[state=closed]:opacity-0 data-[state=open]:opacity-100',
  ].join(' '),
);

export const dialogContentVariants = cva(
  [
    'fixed left-1/2 top-1/2 z-50 flex min-w-0 w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden overscroll-contain rounded-3xl border border-border bg-background shadow-2xl outline-none',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'transition-[opacity,transform,box-shadow] duration-200 motion-reduce:transition-none',
    'data-[state=closed]:scale-[0.98] data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'h-[calc(100vh-2rem)] max-w-none',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const dialogHeaderVariants = cva('grid gap-1.5 px-6 pt-6 text-left');

export const dialogActionsVariants = cva('flex flex-wrap gap-2 px-6 pb-4');

export const dialogBodyVariants = cva('min-h-0 min-w-0 overflow-y-auto overscroll-contain px-6 pb-6');

export const dialogFooterVariants = cva(
  'mt-auto flex flex-col-reverse gap-2 border-t border-border px-6 pb-6 pt-4 sm:flex-row sm:justify-end',
);

export const dialogTitleVariants = cva('text-lg font-semibold leading-tight tracking-tight text-foreground');

export const dialogDescriptionVariants = cva('text-sm leading-6 text-muted-foreground');

