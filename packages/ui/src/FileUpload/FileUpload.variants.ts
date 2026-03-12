import { cva } from 'class-variance-authority';

export const fileUploadFieldVariants = cva('grid w-full gap-1.5');

export const fileUploadControlVariants = cva('grid gap-2');

export const fileUploadDropzoneVariants = cva(
  [
    'relative flex min-h-24 items-start gap-3 rounded-md border border-dashed p-4 shadow-sm',
    'bg-background ring-offset-background transition-colors motion-reduce:transition-none',
    'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
  ].join(' '),
  {
    variants: {
      invalid: {
        true: 'border-destructive focus-within:ring-destructive/30',
        false: 'border-input',
      },
      disabled: {
        true: 'cursor-not-allowed bg-muted/30 opacity-70',
        false: 'hover:border-primary/50',
      },
    },
    defaultVariants: {
      invalid: false,
      disabled: false,
    },
  },
);

export const fileUploadInputVariants = cva(
  'absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed',
);

export const fileUploadPresentationVariants = cva(
  'pointer-events-none flex min-w-0 flex-1 items-start gap-3',
);

export const fileUploadIconVariants = cva(
  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-muted-foreground',
  {
    variants: {
      invalid: {
        true: 'border-destructive/30 bg-destructive/5 text-destructive',
        false: 'border-border bg-muted/40',
      },
      disabled: {
        true: 'border-border bg-muted/20 text-muted-foreground',
        false: '',
      },
    },
    defaultVariants: {
      invalid: false,
      disabled: false,
    },
  },
);

export const fileUploadBodyVariants = cva('grid min-w-0 flex-1 gap-1');

export const fileUploadTitleVariants = cva('text-sm font-medium leading-none', {
  variants: {
    disabled: {
      true: 'text-muted-foreground',
      false: 'text-foreground',
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

export const fileUploadSummaryVariants = cva('text-sm leading-5', {
  variants: {
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
    },
  },
  defaultVariants: {
    tone: 'muted',
  },
});

export const fileUploadListVariants = cva('grid gap-2');

export const fileUploadListItemVariants = cva(
  'flex items-center gap-3 rounded-md border border-border bg-muted/20 px-3 py-2',
);

export const fileUploadFileIconVariants = cva(
  'shrink-0 text-muted-foreground [&_svg]:h-4 [&_svg]:w-4',
);

export const fileUploadFileBodyVariants = cva('grid min-w-0 flex-1 gap-0.5');

export const fileUploadFileNameVariants = cva('truncate text-sm font-medium text-foreground');

export const fileUploadFileMetaVariants = cva('text-xs leading-4 text-muted-foreground');

export const fileUploadActionButtonVariants = cva(
  [
    'relative z-20 inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent text-muted-foreground',
    'bg-background transition-colors motion-reduce:transition-none',
    'hover:border-border hover:bg-accent hover:text-accent-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
);

export const fileUploadMessageVariants = cva('text-sm leading-5 text-destructive');
