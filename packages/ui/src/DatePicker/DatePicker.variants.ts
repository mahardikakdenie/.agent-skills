import { cva } from 'class-variance-authority';

export const datePickerFieldVariants = cva('grid w-full gap-1.5');

export const datePickerControlVariants = cva(
  [
    'flex w-full items-center gap-2 rounded-md border ring-offset-background',
    'transition-colors motion-reduce:transition-none',
    'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
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
        true: 'border-destructive focus-within:ring-destructive/30',
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
    'hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
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

export const datePickerContentVariants = cva('w-auto p-0');

export const datePickerMessageVariants = cva('text-sm text-destructive');
