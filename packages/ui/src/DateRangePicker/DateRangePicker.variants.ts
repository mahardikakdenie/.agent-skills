import { cva } from 'class-variance-authority';

export const dateRangePickerFieldVariants = cva('grid w-full gap-1.5');

export const dateRangePickerControlVariants = cva(
  [
    'flex w-full items-center gap-2 rounded-md border pr-2 ring-offset-background',
    'transition-colors motion-reduce:transition-none',
    'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
  ].join(' '),
  {
    variants: {
      invalid: {
        true: 'border-destructive focus-within:ring-destructive/30',
        false: 'border-input bg-background shadow-sm',
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

export const dateRangePickerTriggerVariants = cva(
  [
    'flex min-h-10 min-w-0 flex-1 items-center gap-2 bg-transparent px-3 py-2 text-left text-sm',
    'outline-none',
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

export const dateRangePickerTriggerTextVariants = cva('min-w-0 truncate');

export const dateRangePickerIconVariants = cva('h-4 w-4 shrink-0 text-muted-foreground');

export const dateRangePickerActionButtonVariants = cva(
  [
    'inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground',
    'transition-colors motion-reduce:transition-none',
    'hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
);

export const dateRangePickerContentVariants = cva('w-auto p-0');

export const dateRangePickerPanelVariants = cva('flex w-full flex-col');

export const dateRangePickerPresetsVariants = cva(
  'flex flex-wrap items-center gap-2 border-b border-border p-3',
);

export const dateRangePickerPresetButtonVariants = cva(
  [
    'inline-flex cursor-pointer items-center justify-center rounded-md border border-input px-2.5 py-1.5 text-xs font-medium',
    'transition-colors motion-reduce:transition-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      active: {
        true: 'border-primary bg-primary text-primary-foreground',
        false: 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const dateRangePickerCalendarFrameVariants = cva('p-3');

export const dateRangePickerMessageVariants = cva('text-sm text-destructive');
