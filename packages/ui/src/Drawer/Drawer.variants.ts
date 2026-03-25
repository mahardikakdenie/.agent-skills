import { cva } from 'class-variance-authority';

export const drawerOverlayVariants = cva(
  [
    'fixed inset-0 z-50 bg-foreground/45 backdrop-blur-[1px]',
    'transition-opacity duration-200 motion-reduce:transition-none',
    'data-[state=closed]:opacity-0 data-[state=open]:opacity-100',
  ].join(' '),
);

export const drawerContentVariants = cva(
  [
    'fixed z-50 flex min-w-0 flex-col overflow-hidden overscroll-contain border border-border bg-background shadow-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'transition-[box-shadow] duration-200 motion-reduce:transition-none',
  ].join(' '),
  {
    variants: {
      direction: {
        bottom: 'inset-x-0 bottom-0 max-h-[90vh] rounded-t-3xl border-b-0 touch-pan-y',
        top: 'inset-x-0 top-0 max-h-[90vh] rounded-b-3xl border-t-0 touch-pan-y',
        left: 'inset-y-0 left-0 h-full w-full max-w-lg rounded-r-3xl border-l-0 touch-pan-x',
        right: 'inset-y-0 right-0 h-full w-full max-w-lg rounded-l-3xl border-r-0 touch-pan-x',
      },
    },
    defaultVariants: {
      direction: 'bottom',
    },
  },
);

export const drawerPanelVariants = cva('flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-background');

export const drawerHandleVariants = cva('mx-auto select-none rounded-full bg-muted-foreground/30', {
  variants: {
    direction: {
      bottom: 'mt-3 h-1.5 w-12 shrink-0',
      top: 'mb-3 h-1.5 w-12 shrink-0',
      left: 'hidden',
      right: 'hidden',
    },
  },
  defaultVariants: {
    direction: 'bottom',
  },
});

export const drawerHeaderVariants = cva('grid gap-1.5 px-6 pb-4 text-left', {
  variants: {
    direction: {
      bottom: 'pt-2',
      top: 'pt-6',
      left: 'pt-6',
      right: 'pt-6',
    },
  },
  defaultVariants: {
    direction: 'bottom',
  },
});

export const drawerActionsVariants = cva('flex flex-wrap gap-2 px-6 pb-4');

export const drawerBodyVariants = cva('min-h-0 overscroll-contain px-6 pb-6', {
  variants: {
    direction: {
      bottom: 'overflow-y-auto',
      top: 'overflow-y-auto',
      left: 'flex-1 overflow-y-auto pt-2',
      right: 'flex-1 overflow-y-auto pt-2',
    },
  },
  defaultVariants: {
    direction: 'bottom',
  },
});

export const drawerFooterVariants = cva(
  'mt-auto flex flex-col-reverse gap-2 border-t border-border px-6 pb-6 pt-4 sm:flex-row sm:justify-end',
);

export const drawerTitleVariants = cva('text-lg font-semibold leading-tight tracking-tight text-foreground');

export const drawerDescriptionVariants = cva('text-sm leading-6 text-muted-foreground');


