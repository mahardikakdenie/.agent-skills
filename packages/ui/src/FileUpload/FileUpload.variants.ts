import { cva } from 'class-variance-authority';

import { fieldVariantOptions } from '../utils/field-variants';

export const fileUploadFieldVariants = cva('grid w-full gap-1.5');

export const fileUploadControlVariants = cva('grid gap-2');

export const fileUploadDropzoneVariants = cva(
  [
    'relative isolate flex min-h-32 items-center justify-center gap-3 overflow-hidden rounded-xl border border-dashed px-4 py-5',
    'bg-background ring-offset-background transition-[border-color,background-color,box-shadow,transform] motion-reduce:transition-none',
    'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
  ].join(' '),
  {
    variants: {
      variant: fieldVariantOptions,
      invalid: {
        true: 'border-destructive/80 focus-within:ring-destructive/30',
        false: '',
      },
      disabled: {
        true: 'cursor-not-allowed bg-muted/20 opacity-70',
        false: 'hover:border-primary/45 hover:bg-accent/[0.28]',
      },
      dragActive: {
        true: '-translate-y-0.5 border-primary bg-primary/[0.06] shadow-[0_0_0_1px_hsl(var(--primary)/0.14),0_20px_45px_-28px_hsl(var(--primary)/0.55)]',
        false: '',
      },
      hasFiles: {
        true: 'bg-muted/[0.24]',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'outline',
      invalid: false,
      disabled: false,
      dragActive: false,
      hasFiles: false,
    },
  },
);

export const fileUploadInputVariants = cva(
  'absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed',
);

export const fileUploadPresentationVariants = cva(
  'pointer-events-none relative z-[1] mx-auto flex w-full max-w-xl min-w-0 flex-col items-center justify-center gap-3 text-center sm:flex-row sm:text-left',
  {
    variants: {
      invalid: {
        true: '',
        false: '',
      },
      dragActive: {
        true: 'gap-4',
        false: '',
      },
      hasFiles: {
        true: '',
        false: '',
      },
      disabled: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      invalid: false,
      dragActive: false,
      hasFiles: false,
      disabled: false,
    },
  },
);

export const fileUploadIconVariants = cva(
  'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border shadow-sm text-muted-foreground',
  {
    variants: {
      invalid: {
        true: 'border-destructive/30 bg-destructive/5 text-destructive',
        false: 'border-border/70 bg-background/90',
      },
      disabled: {
        true: 'border-border bg-muted/20 text-muted-foreground',
        false: '',
      },
      dragActive: {
        true: 'border-primary/30 bg-primary/[0.1] text-primary',
        false: '',
      },
      hasFiles: {
        true: 'border-primary/10 bg-background text-foreground',
        false: '',
      },
    },
    defaultVariants: {
      invalid: false,
      disabled: false,
      dragActive: false,
      hasFiles: false,
    },
  },
);

export const fileUploadBodyVariants = cva(
  'grid min-w-0 gap-1 justify-items-center sm:max-w-md sm:justify-items-start',
);

export const fileUploadTitleVariants = cva('text-sm font-semibold leading-none tracking-[0.01em]', {
  variants: {
    disabled: {
      true: 'text-muted-foreground',
      false: 'text-foreground',
    },
    dragActive: {
      true: 'text-primary',
      false: '',
    },
  },
  defaultVariants: {
    disabled: false,
    dragActive: false,
  },
});

export const fileUploadSummaryVariants = cva('text-sm leading-5', {
  variants: {
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      accent: 'text-primary',
      destructive: 'text-destructive',
    },
  },
  defaultVariants: {
    tone: 'muted',
  },
});

export const fileUploadListVariants = cva('grid gap-2');

export const fileUploadListItemVariants = cva(
  'flex items-center gap-3 rounded-lg border border-border/70 bg-gradient-to-r from-background to-muted/30 px-3.5 py-3 shadow-sm',
);

export const fileUploadFileIconVariants = cva(
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/70 bg-background text-muted-foreground shadow-sm [&_svg]:h-4 [&_svg]:w-4',
);

export const fileUploadFileBodyVariants = cva('grid min-w-0 flex-1 gap-0.5');

export const fileUploadFileNameVariants = cva('truncate text-sm font-medium text-foreground');

export const fileUploadFileMetaVariants = cva('text-xs leading-4 text-muted-foreground');

export const fileUploadActionButtonVariants = cva(
  [
    'relative z-20 inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border/60 text-muted-foreground',
    'bg-background/90 transition-colors motion-reduce:transition-none',
    'hover:border-border hover:bg-accent hover:text-accent-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
);

export const fileUploadMessageVariants = cva('text-sm leading-5 text-destructive');
