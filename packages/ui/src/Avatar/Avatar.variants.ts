import { cva } from 'class-variance-authority';

export const avatarRootVariants = cva(
  [
    'relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full',
    'border border-border bg-muted text-muted-foreground shadow-sm',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'motion-reduce:transition-none',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const avatarImageVariants = cva(
  'h-full w-full object-cover data-[loading-status=error]:hidden',
);

export const avatarFallbackVariants = cva(
  [
    'flex h-full w-full items-center justify-center rounded-full bg-muted font-medium uppercase tracking-wide text-muted-foreground',
    'data-[loading-status=loaded]:hidden',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'text-[10px]',
        md: 'text-xs',
        lg: 'text-sm',
        xl: 'text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);
