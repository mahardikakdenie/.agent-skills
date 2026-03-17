import { cva } from 'class-variance-authority';

import {
  getCompactControlFocusRecipe,
  getDenseSurfaceFocusRecipe,
  getFieldShellFocusRecipe,
} from '../utils/focus-normalization';

const compositeFieldShellFocus = getFieldShellFocusRecipe('composite');
const directDenseSurfaceFocus = getDenseSurfaceFocusRecipe('direct');
const embeddedActionFocus = getCompactControlFocusRecipe('embedded');

export const monthPickerFieldVariants = cva('grid w-full gap-1.5');

export const monthPickerControlVariants = cva(
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

export const monthPickerTriggerVariants = cva(
  [
    'flex min-w-0 flex-1 touch-manipulation items-center gap-2 bg-transparent p-0 text-left',
    'outline-none focus-visible:ring-0',
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
        false: 'text-muted-foreground hover:text-foreground',
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

export const monthPickerTriggerTextVariants = cva('min-w-0 truncate');

export const monthPickerIconVariants = cva('shrink-0 text-muted-foreground', {
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

export const monthPickerActionButtonVariants = cva(
  [
    'inline-flex shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-sm text-muted-foreground',
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

export const monthPickerContentVariants = cva('w-fit p-0');

export const monthPickerPanelVariants = cva('grid gap-1.5 p-2');

export const monthPickerHeaderVariants = cva(
  'relative flex h-9 items-center justify-center after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:border-b after:border-border',
);

export const monthPickerYearTriggerVariants = cva(
  [
    'inline-flex h-6 max-w-[calc(100%-4.5rem)] items-center justify-center rounded-md px-2.5',
    'cursor-pointer text-sm font-semibold text-foreground tabular-nums transition-colors motion-reduce:transition-none',
    'hover:bg-accent hover:text-accent-foreground',
    directDenseSurfaceFocus.base,
  ].join(' '),
);

export const monthPickerYearOptionVariants = cva('tabular-nums');

export const monthPickerOptionFrameVariants = cva('w-full');

export const monthPickerPickerPanelVariants = cva(
  [
    'overflow-hidden rounded-md border border-border bg-background px-1 py-2 shadow-sm',
    'supports-[backdrop-filter]:bg-background/95',
  ].join(' '),
);

export const monthPickerYearsVariants = cva(
  'grid h-[11.5rem] content-start grid-cols-3 gap-x-1 gap-y-1 overflow-y-auto px-0.5 pb-2.5 pr-0.5',
);

export const monthPickerMessageVariants = cva('text-sm text-destructive');
