import { cva } from 'class-variance-authority';

export const monthPickerFieldVariants = cva('grid w-full gap-1.5');

export const monthPickerControlVariants = cva(
  [
    'flex w-full items-center gap-2 rounded-md border border-input bg-background shadow-sm ring-offset-background',
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

export const monthPickerTriggerVariants = cva(
  [
    'flex min-h-10 min-w-0 flex-1 touch-manipulation items-center gap-2 bg-transparent px-3 py-2 text-left',
    'outline-none focus-visible:ring-0',
  ].join(' '),
  {
    variants: {
      hasValue: {
        true: 'text-foreground',
        false: 'text-muted-foreground hover:text-foreground',
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

export const monthPickerTriggerTextVariants = cva('min-w-0 truncate text-sm');

export const monthPickerIconVariants = cva('h-4 w-4 shrink-0 text-muted-foreground');

export const monthPickerActionButtonVariants = cva(
  [
    'mr-2 inline-flex h-6 w-6 shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-sm text-muted-foreground',
    'transition-colors motion-reduce:transition-none',
    'hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
);

export const monthPickerContentVariants = cva('w-[16.5rem] p-0');

export const monthPickerPanelVariants = cva('grid gap-3 p-2.5');

export const monthPickerHeaderVariants = cva(
  'relative flex min-h-8 items-center justify-center border-b border-border pb-2 pt-0.5',
);

export const monthPickerYearTriggerVariants = cva(
  [
    'inline-flex h-7 max-w-[calc(100%-4.5rem)] items-center justify-center rounded-md px-2.5',
    'cursor-pointer text-sm font-semibold text-foreground tabular-nums transition-colors motion-reduce:transition-none',
    'hover:bg-accent hover:text-accent-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'focus-visible:ring-offset-background',
  ].join(' '),
);

export const monthPickerYearOptionVariants = cva('tabular-nums');

export const monthPickerOptionFrameVariants = cva('w-full');

export const monthPickerPickerPanelVariants = cva(
  [
    'overflow-hidden rounded-md border border-border bg-background px-1 py-3 shadow-sm',
    'supports-[backdrop-filter]:bg-background/95',
  ].join(' '),
);

export const monthPickerYearsVariants = cva(
  'grid h-[13.5rem] content-start grid-cols-3 gap-x-2 gap-y-2 overflow-y-auto px-0.5 pb-0.5 pr-1.5',
);

export const monthPickerMessageVariants = cva('text-sm text-destructive');