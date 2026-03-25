import { cva } from 'class-variance-authority';

import { getCompactControlFocusRecipe } from '../utils/focus-normalization';

const standardCompactControlFocus = getCompactControlFocusRecipe('standard');

export const buttonVariants = cva(
  [
    'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium',
    'transition-colors motion-reduce:transition-none',
    standardCompactControlFocus.base,
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm enabled:hover:bg-primary/90',
        primary: 'bg-primary text-primary-foreground shadow-sm enabled:hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm enabled:hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm enabled:hover:bg-destructive/90',
        outline:
          'border border-input bg-background text-foreground shadow-sm enabled:hover:bg-accent enabled:hover:text-accent-foreground',
        ghost: 'bg-transparent text-foreground enabled:hover:bg-accent enabled:hover:text-accent-foreground',
        link: 'bg-transparent text-primary shadow-none underline-offset-4 enabled:hover:underline',
        warning: 'bg-warning text-warning-foreground shadow-sm enabled:hover:bg-warning/90',
      },
      size: {
        xs: 'h-7 px-2.5 text-xs',
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4 text-sm',
        lg: 'h-10 px-5 text-sm',
        xl: 'h-11 px-6 text-base',
      },
    },
    compoundVariants: [
      {
        variant: 'link',
        size: 'xs',
        className: 'h-auto px-0 py-0 text-xs',
      },
      {
        variant: 'link',
        size: 'sm',
        className: 'h-auto px-0 py-0 text-xs',
      },
      {
        variant: 'link',
        size: 'md',
        className: 'h-auto px-0 py-0 text-sm',
      },
      {
        variant: 'link',
        size: 'lg',
        className: 'h-auto px-0 py-0 text-sm',
      },
      {
        variant: 'link',
        size: 'xl',
        className: 'h-auto px-0 py-0 text-base',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);
