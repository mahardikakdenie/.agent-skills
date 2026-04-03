import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  [
    'inline-flex w-fit max-w-full items-center gap-1.5 rounded-full border font-medium',
    'leading-none transition-colors motion-reduce:transition-none',
    '[&_[data-slot=badge-dot]]:h-1.5 [&_[data-slot=badge-dot]]:w-1.5',
    '[&_[data-slot=badge-dot]]:shrink-0 [&_[data-slot=badge-dot]]:rounded-full',
    '[&_[data-slot=badge-dot]]:bg-current',
  ].join(' '),
  {
    variants: {
      variant: {
        outline: '',
        solid: '',
      },
      tone: {
        default: '',
        secondary: '',
        destructive: '',
        success: '',
        warning: '',
        info: '',
      },
      size: {
        sm: 'min-h-5 px-2 py-0.5 text-xs',
        md: 'min-h-6 px-2.5 py-1 text-xs',
        lg: 'min-h-7 px-3 py-1.5 text-sm',
      },
    },
    compoundVariants: [
      {
        variant: 'outline',
        tone: 'default',
        className: 'border-border bg-background text-foreground',
      },
      {
        variant: 'outline',
        tone: 'secondary',
        className: 'border-border bg-background text-muted-foreground',
      },
      {
        variant: 'outline',
        tone: 'destructive',
        className: 'border-destructive/30 bg-background text-destructive',
      },
      {
        variant: 'outline',
        tone: 'success',
        className: 'border-success/30 bg-background text-success',
      },
      {
        variant: 'outline',
        tone: 'warning',
        className: 'border-warning/30 bg-background text-warning',
      },
      {
        variant: 'outline',
        tone: 'info',
        className: 'border-info/30 bg-background text-info',
      },
      {
        variant: 'solid',
        tone: 'default',
        className: 'border-transparent bg-primary text-primary-foreground',
      },
      {
        variant: 'solid',
        tone: 'secondary',
        className: 'border-transparent bg-secondary text-secondary-foreground',
      },
      {
        variant: 'solid',
        tone: 'destructive',
        className: 'border-transparent bg-destructive text-destructive-foreground',
      },
      {
        variant: 'solid',
        tone: 'success',
        className: 'border-transparent bg-success text-success-foreground',
      },
      {
        variant: 'solid',
        tone: 'warning',
        className: 'border-transparent bg-warning text-warning-foreground',
      },
      {
        variant: 'solid',
        tone: 'info',
        className: 'border-transparent bg-info text-info-foreground',
      },
    ],
    defaultVariants: {
      variant: 'outline',
      tone: 'default',
      size: 'md',
    },
  },
);
