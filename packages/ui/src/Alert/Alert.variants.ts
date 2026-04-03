import { cva } from 'class-variance-authority';

export const alertVariants = cva(
  [
    'relative w-full rounded-xl border px-4 py-3 text-sm',
    'transition-colors motion-reduce:transition-none',
  ].join(' '),
  {
    variants: {
      variant: {
        outline: 'shadow-none',
        shadow: 'shadow-sm',
      },
      tone: {
        default: 'border-border bg-background text-foreground',
        success: 'border-success/35 bg-background text-foreground',
        info: 'border-info/35 bg-background text-foreground',
        warning: 'border-warning/35 bg-background text-foreground',
        destructive: 'border-destructive/35 bg-background text-foreground',
      },
      dismissible: {
        true: 'pr-12',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'shadow',
        tone: 'success',
        className: 'bg-success/10',
      },
      {
        variant: 'shadow',
        tone: 'info',
        className: 'bg-info/10',
      },
      {
        variant: 'shadow',
        tone: 'warning',
        className: 'bg-warning/10',
      },
      {
        variant: 'shadow',
        tone: 'destructive',
        className: 'bg-destructive/10',
      },
    ],
    defaultVariants: {
      variant: 'outline',
      tone: 'default',
      dismissible: false,
    },
  },
);
