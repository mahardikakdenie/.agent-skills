import { cva } from 'class-variance-authority';

export const textareaFieldVariants = cva('grid w-full gap-1.5');

export const textareaControlVariants = cva('relative w-full');

export const textareaElementVariants = cva(
  [
    'min-h-24 w-full resize-y rounded-md border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm ring-offset-background',
    'transition-colors motion-reduce:transition-none',
    'placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  ].join(' '),
  {
    variants: {
      invalid: {
        true: 'border-destructive focus-visible:ring-destructive/30',
        false: 'border-input',
      },
      clearable: {
        true: 'pr-10',
        false: '',
      },
    },
    defaultVariants: {
      invalid: false,
      clearable: false,
    },
  },
);

export const textareaActionButtonVariants = cva(
  [
    'absolute right-3 top-3 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm text-muted-foreground',
    'transition-colors motion-reduce:transition-none',
    'hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
);

export const textareaHelperTextVariants = cva('text-sm leading-5 text-muted-foreground');

export const textareaMessageVariants = cva('text-sm leading-5 text-destructive');
