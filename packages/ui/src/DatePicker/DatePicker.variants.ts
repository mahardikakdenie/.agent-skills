import { cva } from 'class-variance-authority';

import {
  getCompactControlFocusRecipe,
  getFieldShellFocusRecipe,
} from '../utils/focus-normalization';

const compositeFieldShellFocus = getFieldShellFocusRecipe('composite');
const directFieldShellFocus = getFieldShellFocusRecipe('direct');
const embeddedActionFocus = getCompactControlFocusRecipe('embedded');

export const datePickerFieldVariants = cva('grid w-full gap-1.5');

export const datePickerControlVariants = cva(
  [
    'flex w-full items-center gap-2 rounded-md border',
    'transition-colors motion-reduce:transition-none',
    compositeFieldShellFocus.base,
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border-input bg-background shadow-sm',
        outline: 'border-border bg-background',
        ghost: 'border-transparent bg-muted/40 shadow-none',
      },
      size: {
        xs: 'min-h-8 px-2.5',
        sm: 'min-h-9 px-3',
        md: 'min-h-10 px-3',
        lg: 'min-h-11 px-4',
      },
      invalid: {
        true: compositeFieldShellFocus.invalid,
        false: '',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-60',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      invalid: false,
      disabled: false,
    },
  },
);

export const datePickerTriggerVariants = cva(
  [
    'flex min-w-0 flex-1 items-center gap-2 bg-transparent p-0 text-left',
    'outline-none',
    'focus-visible:ring-0',
  ].join(' '),
  {
    variants: {
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-sm',
        lg: 'text-base',
      },
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
      size: 'md',
      hasValue: false,
      disabled: false,
    },
  },
);

export const datePickerTriggerTextVariants = cva('min-w-0 truncate');

export const datePickerIconVariants = cva('shrink-0 text-muted-foreground', {
  variants: {
    size: {
      xs: 'h-3.5 w-3.5',
      sm: 'h-4 w-4',
      md: 'h-4 w-4',
      lg: 'h-[18px] w-[18px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const datePickerActionButtonVariants = cva(
  [
    'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground',
    'transition-colors motion-reduce:transition-none',
    'hover:text-foreground',
    embeddedActionFocus.base,
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      size: {
        xs: 'h-5 w-5',
        sm: 'h-6 w-6',
        md: 'h-6 w-6',
        lg: 'h-7 w-7',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const datePickerContentVariants = cva('min-w-0 w-fit p-0', {
  variants: {
    chrome: {
      bare: 'border-0 bg-transparent shadow-none',
      framed: '',
    },
  },
  defaultVariants: {
    chrome: 'framed',
  },
});

export const datePickerPanelVariants = cva('grid items-start gap-1.5 p-2');

export const datePickerTimeSectionVariants = cva(
  'grid content-start justify-items-start self-stretch gap-1 rounded-md border border-border/70 bg-muted/15 px-2 py-1.5',
);

export const datePickerTimeLabelVariants = cva(
  'inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground',
);

export const datePickerTimeInputVariants = cva(
  [
    'h-8 w-[5.75rem] min-w-0 rounded-md border border-input bg-background px-2.5 text-sm tabular-nums text-foreground shadow-sm',
    'transition-colors motion-reduce:transition-none',
    directFieldShellFocus.base,
    'disabled:cursor-not-allowed disabled:opacity-60',
  ].join(' '),
  {
    variants: {
      invalid: {
        true: directFieldShellFocus.invalid,
        false: '',
      },
    },
    defaultVariants: {
      invalid: false,
    },
  },
);

export const datePickerHintVariants = cva('text-[11px] leading-4 text-muted-foreground');

export const datePickerMessageVariants = cva('text-sm text-destructive');
