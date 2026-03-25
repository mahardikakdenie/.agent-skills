import { cva } from 'class-variance-authority';

export const labelVariants = cva(
  [
    'inline-flex max-w-full items-start gap-1.5 select-none text-sm font-medium leading-5',
    'transition-colors motion-reduce:transition-none',
    'peer-disabled:cursor-not-allowed peer-disabled:text-muted-foreground peer-disabled:opacity-70',
  ].join(' '),
  {
    variants: {
      tone: {
        default: 'text-foreground',
        muted: 'text-muted-foreground',
        destructive: 'text-destructive',
      },
      disabled: {
        true: 'cursor-not-allowed text-muted-foreground opacity-70',
        false: '',
      },
    },
    defaultVariants: {
      tone: 'default',
      disabled: false,
    },
  },
);

export const labelTextVariants = cva('min-w-0');

export const labelRequiredIndicatorVariants = cva('shrink-0 text-destructive', {
  variants: {
    disabled: {
      true: 'opacity-70',
      false: '',
    },
  },
  defaultVariants: {
    disabled: false,
  },
});
