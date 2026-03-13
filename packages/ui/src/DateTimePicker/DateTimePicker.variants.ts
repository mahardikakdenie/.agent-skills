import { cva } from 'class-variance-authority';

export const dateTimePickerFieldVariants = cva('grid w-full gap-1.5');

export const dateTimePickerControlVariants = cva(
  [
    'flex w-full items-center gap-2 rounded-md border border-input bg-background px-3 shadow-sm ring-offset-background',
    'transition-colors motion-reduce:transition-none',
    'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
  ].join(' '),
  {
    variants: {
      invalid: {
        true: 'border-destructive focus-within:ring-destructive/30',
        false: '',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-60',
        false: '',
      },
    },
    defaultVariants: {
      invalid: false,
      disabled: false,
    },
  },
);

export const dateTimePickerTriggerVariants = cva(
  [
    'flex min-h-10 min-w-0 flex-1 items-center gap-2 bg-transparent py-2 text-left text-sm outline-none',
    'focus-visible:ring-0',
  ].join(' '),
  {
    variants: {
      hasValue: {
        true: 'text-foreground',
        false: 'text-muted-foreground',
      },
      disabled: {
        true: 'cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      hasValue: false,
      disabled: false,
    },
  },
);

export const dateTimePickerTriggerTextVariants = cva('min-w-0 truncate');

export const dateTimePickerIconVariants = cva('h-4 w-4 shrink-0 text-muted-foreground');

export const dateTimePickerActionButtonVariants = cva(
  [
    'inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground',
    'transition-colors motion-reduce:transition-none',
    'hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
);

export const dateTimePickerContentVariants = cva('min-w-0 w-fit max-w-[calc(100vw-1rem)] p-0');

export const dateTimePickerPanelVariants = cva(
  'grid gap-1.5 p-2 sm:grid-cols-[auto_auto] sm:items-stretch sm:gap-2',
);

export const dateTimePickerTimeSectionVariants = cva(
  'grid content-start justify-items-start gap-1 rounded-md border border-border/70 bg-muted/15 px-2 py-1.5 sm:col-start-2 sm:row-start-1 sm:h-full sm:self-stretch sm:justify-self-start',
);

export const dateTimePickerTimeRowVariants = cva('grid gap-1');

export const dateTimePickerTimeLabelVariants = cva(
  'inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground',
);

export const dateTimePickerTimeInputVariants = cva(
  [
    'h-8 w-[5.75rem] min-w-0 rounded-md border border-input bg-background px-2.5 text-sm tabular-nums text-foreground shadow-sm',
    'outline-none transition-colors motion-reduce:transition-none',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:cursor-not-allowed disabled:opacity-60',
  ].join(' '),
  {
    variants: {
      invalid: {
        true: 'border-destructive focus-visible:ring-destructive/30',
        false: '',
      },
    },
    defaultVariants: {
      invalid: false,
    },
  },
);

export const dateTimePickerHintVariants = cva('text-[11px] leading-4 text-muted-foreground');

export const dateTimePickerMessageVariants = cva('text-sm text-destructive');
