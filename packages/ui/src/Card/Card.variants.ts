import { cva } from 'class-variance-authority';

export const cardRootVariants = cva(
  'rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-shadow motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
);

export const cardHeaderVariants = cva('flex flex-col gap-1.5 p-6');

export const cardTitleVariants = cva('text-lg font-semibold leading-none tracking-tight');

export const cardDescriptionVariants = cva('text-sm text-muted-foreground');

export const cardContentVariants = cva('p-6 pt-0');

export const cardFooterVariants = cva('flex flex-wrap items-center gap-3 p-6 pt-0');
