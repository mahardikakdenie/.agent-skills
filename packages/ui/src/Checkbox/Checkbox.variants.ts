import { cva } from 'class-variance-authority';

export const checkboxFieldVariants = cva('grid gap-2');

export const checkboxControlRowVariants = cva('flex items-start gap-3');

export const checkboxRootVariants = cva(
  [
    'peer/checkbox shrink-0 self-start border bg-background text-primary-foreground shadow-sm outline-none',
    'transition-[background-color,border-color,box-shadow,color] motion-reduce:transition-none',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:cursor-not-allowed disabled:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'mt-0.5 h-4 w-4 rounded-sm',
        md: 'mt-0.5 h-5 w-5 rounded-md',
        lg: 'mt-0.5 h-6 w-6 rounded-md',
      },
      invalid: {
        false: [
          'border-input hover:border-primary/70 hover:bg-accent/30',
          'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:hover:bg-primary/90',
          'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:hover:bg-primary/90',
        ].join(' '),
        true: [
          'border-destructive hover:border-destructive/80 hover:bg-destructive/5 focus-visible:ring-destructive/30',
          'data-[state=checked]:border-destructive data-[state=checked]:bg-destructive data-[state=checked]:hover:bg-destructive/90',
          'data-[state=indeterminate]:border-destructive data-[state=indeterminate]:bg-destructive data-[state=indeterminate]:hover:bg-destructive/90',
        ].join(' '),
      },
    },
    defaultVariants: {
      size: 'md',
      invalid: false,
    },
  },
);

export const checkboxIndicatorVariants = cva(
  'flex items-center justify-center text-current transition-opacity motion-reduce:transition-none',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
      visible: {
        true: 'opacity-100',
        false: 'opacity-0',
      },
    },
    defaultVariants: {
      size: 'md',
      visible: false,
    },
  },
);

export const checkboxContentVariants = cva('grid gap-1');

export const checkboxLabelVariants = cva('select-none font-medium leading-5', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base',
    },
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
    },
  },
  defaultVariants: {
    size: 'md',
    tone: 'default',
  },
});

export const checkboxDescriptionVariants = cva('text-sm leading-5', {
  variants: {
    tone: {
      default: 'text-muted-foreground',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
    },
  },
  defaultVariants: {
    tone: 'default',
  },
});

export const checkboxMessageVariants = cva('text-sm font-medium leading-5 text-destructive');

