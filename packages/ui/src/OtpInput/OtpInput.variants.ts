import { cva } from 'class-variance-authority';

export const otpInputFieldVariants = cva('grid gap-2');

export const otpInputGroupVariants = cva('flex flex-wrap items-center gap-2');

export const otpInputSlotVariants = cva(
  [
    'rounded-lg border text-center font-semibold text-foreground',
    'transition-colors motion-reduce:transition-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
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
        true: 'border-destructive text-destructive focus-visible:ring-destructive/70',
      },
      filled: {
        false: '',
        true: 'border-primary/40 bg-primary/5',
      },
      active: {
        false: '',
        true: 'border-ring shadow-[0_0_0_1px_hsl(var(--ring))]',
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
        className: 'shadow-[0_0_0_1px_hsl(var(--destructive))]',
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
