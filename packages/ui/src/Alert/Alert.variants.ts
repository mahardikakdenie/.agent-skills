import { cva } from 'class-variance-authority';

export const alertVariants = cva(
  [
    'relative w-full rounded-xl border px-4 py-3 text-sm shadow-sm',
    'transition-colors motion-reduce:transition-none',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border-border bg-background text-foreground',
        success: 'border-success/30 bg-success/10 text-foreground',
        info: 'border-info/30 bg-info/10 text-foreground',
        warning: 'border-warning/30 bg-warning/10 text-foreground',
        destructive: 'border-destructive/30 bg-destructive/10 text-foreground',
      },
      dismissible: {
        true: 'pr-12',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      dismissible: false,
    },
  },
);
