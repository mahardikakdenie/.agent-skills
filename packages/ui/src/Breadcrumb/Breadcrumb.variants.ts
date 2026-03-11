import { cva } from 'class-variance-authority';

export const breadcrumbRootVariants = cva('w-full');

export const breadcrumbListVariants = cva(
  'flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground',
);

export const breadcrumbItemVariants = cva('min-w-0 inline-flex items-center');

export const breadcrumbTextVariants = cva(
  [
    'min-w-0 break-words rounded-sm px-1 py-0.5 transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'focus-visible:ring-offset-background touch-manipulation',
  ].join(' '),
  {
    variants: {
      tone: {
        link: 'hover:text-foreground hover:underline underline-offset-4',
        muted: 'text-muted-foreground',
        current: 'font-medium text-foreground',
      },
    },
    defaultVariants: {
      tone: 'link',
    },
  },
);

export const breadcrumbSeparatorVariants = cva(
  'inline-flex select-none items-center text-muted-foreground/80',
);
