import { cva } from 'class-variance-authority';

export const badgeVariantValues = [
  'default',
  'secondary',
  'destructive',
  'outline',
  'success',
  'warning',
  'info',
] as const;

export const badgeSizeValues = ['sm', 'md', 'lg'] as const;

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
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'border-border bg-background text-foreground',
        success: 'border-transparent bg-success text-success-foreground',
        warning: 'border-transparent bg-warning text-warning-foreground',
        info: 'border-transparent bg-info text-info-foreground',
      },
      size: {
        sm: 'min-h-5 px-2 py-0.5 text-xs',
        md: 'min-h-6 px-2.5 py-1 text-xs',
        lg: 'min-h-7 px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);
