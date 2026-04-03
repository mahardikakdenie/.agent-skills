import { cva } from 'class-variance-authority';

import {
  getCompactControlFocusRecipe,
  getFieldShellFocusRecipe,
} from '../utils/focus-normalization';
import { fieldVariantOptions } from '../utils/field-variants';

const compositeFieldShellFocus = getFieldShellFocusRecipe('composite');
const directFieldShellFocus = getFieldShellFocusRecipe('direct');
const embeddedActionFocus = getCompactControlFocusRecipe('embedded');
const standardCompactControlFocus = getCompactControlFocusRecipe('standard');

export const dateRangePickerFieldVariants = cva('grid w-full gap-1.5');

export const dateRangePickerControlVariants = cva(
  [
    'flex w-full items-center gap-2 rounded-md border',
    'transition-colors motion-reduce:transition-none',
    compositeFieldShellFocus.base,
  ].join(' '),
  {
    variants: {
      variant: fieldVariantOptions,
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
      open: {
        true: 'border-ring',
        false: '',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-60',
        false: '',
      },
    },
    compoundVariants: [
      {
        invalid: true,
        open: true,
        className: 'border-destructive',
      },
    ],
    defaultVariants: {
      variant: 'outline',
      size: 'md',
      invalid: false,
      open: false,
      disabled: false,
    },
  },
);

export const dateRangePickerTriggerVariants = cva(
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

export const dateRangePickerTriggerTextVariants = cva('min-w-0 truncate');

export const dateRangePickerIconVariants = cva('shrink-0 text-muted-foreground', {
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

export const dateRangePickerActionButtonVariants = cva(
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

export const dateRangePickerContentVariants = cva('w-auto p-0', {
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

export const dateRangePickerPanelVariants = cva('flex w-full flex-col');

export const dateRangePickerPresetsVariants = cva(
  'flex flex-wrap items-center gap-2 border-b border-border p-3',
);

export const dateRangePickerPresetButtonVariants = cva(
  [
    'inline-flex cursor-pointer items-center justify-center rounded-md border border-input px-2.5 py-1.5 text-xs font-medium',
    'transition-colors motion-reduce:transition-none',
    standardCompactControlFocus.base,
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

export const dateRangePickerCalendarFrameVariants = cva('p-2');

export const dateRangePickerTimeSectionVariants = cva(
  'grid gap-2 border-t border-border p-3',
);

export const dateRangePickerTimeGridVariants = cva(
  'grid gap-2 sm:grid-cols-2',
);

export const dateRangePickerTimeFieldVariants = cva('grid gap-1');

export const dateRangePickerTimeLabelVariants = cva(
  'inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground',
);

export const dateRangePickerTimeInputVariants = cva(
  [
    'h-8 w-full min-w-0 rounded-md border border-border bg-background px-2.5 text-sm tabular-nums text-foreground',
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

export const dateRangePickerHintVariants = cva('text-[11px] leading-4 text-muted-foreground');

export const dateRangePickerMessageVariants = cva('text-sm text-destructive');
