import { cva } from 'class-variance-authority';

import { getSegmentedInputFocusRecipe } from '../utils/focus-normalization';

const segmentedInputFocus = getSegmentedInputFocusRecipe();

export const otpInputFieldVariants = cva('grid gap-2');

export const otpInputGroupVariants = cva('flex flex-wrap items-center gap-2');

export const otpInputSlotVariants = cva(
  [
    'rounded-lg border text-center font-semibold text-foreground',
    'transition-colors motion-reduce:transition-none',
    segmentedInputFocus.base,
    'placeholder:text-muted-foreground/60',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border-input bg-background shadow-sm',
        outline: 'border-border bg-background shadow-none',
        ghost: 'border-transparent bg-muted/40 shadow-none',
      },
      size: {
        sm: 'h-10 w-10 text-base',
        md: 'h-12 w-12 text-lg',
        lg: 'h-14 w-14 text-xl',
      },
      invalid: {
        false: '',
        true: segmentedInputFocus.invalid,
      },
      filled: {
        false: '',
        true: 'border-primary/40 bg-primary/5',
      },
      active: {
        false: '',
        true: segmentedInputFocus.active,
      },
      disabled: {
        false: '',
        true: 'cursor-not-allowed bg-muted text-muted-foreground opacity-60',
      },
    },
    compoundVariants: [
      {
        invalid: true,
        filled: true,
        className: 'bg-destructive/5',
      },
      {
        active: true,
        invalid: true,
        className: segmentedInputFocus.invalidActive,
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      invalid: false,
      filled: false,
      active: false,
      disabled: false,
    },
  },
);

export const otpInputMessageVariants = cva('text-sm text-destructive');

export const otpInputStatusVariants = cva('sr-only');
