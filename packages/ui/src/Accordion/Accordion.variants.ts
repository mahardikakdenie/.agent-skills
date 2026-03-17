import { cva } from 'class-variance-authority';

import { getDenseSurfaceFocusRecipe } from '../utils/focus-normalization';

const directDenseSurfaceFocus = getDenseSurfaceFocusRecipe('direct');

export const accordionRootVariants = cva('grid gap-3');

export const accordionItemVariants = cva(
  [
    'overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm',
    'transition-colors motion-reduce:transition-none',
    'data-[state=open]:border-ring/30',
    'data-[disabled]:opacity-60',
  ].join(' '),
);

export const accordionHeaderVariants = cva('flex');

export const accordionTriggerVariants = cva(
  [
    'flex min-h-11 w-full cursor-pointer items-start justify-between gap-3 px-4 py-4 text-left text-sm font-medium text-foreground outline-none',
    'touch-manipulation transition-colors motion-reduce:transition-none',
    directDenseSurfaceFocus.base,
    'enabled:hover:bg-accent/50 enabled:hover:text-accent-foreground',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
    '[&[data-state=open]_[data-slot=accordion-chevron]]:rotate-180',
  ].join(' '),
);

export const accordionChevronVariants = cva(
  [
    'mt-0.5 shrink-0 text-muted-foreground',
    'transition-transform duration-200 motion-reduce:transition-none',
  ].join(' '),
);

export const accordionContentVariants = cva(
  [
    'grid overflow-hidden',
    'transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none',
    'data-[state=closed]:grid-rows-[0fr] data-[state=closed]:opacity-0',
    'data-[state=open]:grid-rows-[1fr] data-[state=open]:opacity-100',
  ].join(' '),
);

export const accordionContentInnerVariants = cva(
  [
    'min-h-0 overflow-hidden border-t border-border/70 px-4 py-4 text-sm leading-6 text-muted-foreground',
    'grid gap-3',
  ].join(' '),
);
