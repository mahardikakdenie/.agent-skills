import { cva } from 'class-variance-authority';

import { getDenseSurfaceFocusRecipe } from '../utils/focus-normalization';

const directDenseSurfaceFocus = getDenseSurfaceFocusRecipe('direct');

export const tabsRootVariants = cva('flex w-full flex-col gap-4', {
  variants: {
    orientation: {
      horizontal: '',
      vertical: 'gap-6 md:grid md:grid-cols-[minmax(12rem,16rem)_minmax(0,1fr)] md:items-start',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export const tabsListVariants = cva(
  [
    'inline-flex max-w-full items-center text-muted-foreground',
    'data-[orientation=horizontal]:w-full data-[orientation=horizontal]:!overflow-x-auto data-[orientation=horizontal]:!overflow-y-hidden',
    'data-[orientation=horizontal]:[scrollbar-gutter:stable] data-[orientation=horizontal]:[-webkit-overflow-scrolling:touch] data-[orientation=horizontal]:[scrollbar-width:none] data-[orientation=horizontal]:[scrollbar-color:transparent_transparent] data-[orientation=horizontal]:!pb-5 data-[orientation=horizontal]:!-mb-5',
    'data-[orientation=horizontal]:[&::-webkit-scrollbar]:h-[5px] data-[orientation=horizontal]:[&::-webkit-scrollbar-track]:bg-transparent data-[orientation=horizontal]:[&::-webkit-scrollbar-thumb]:rounded-full data-[orientation=horizontal]:[&::-webkit-scrollbar-thumb]:bg-transparent',
    'data-[orientation=horizontal]:hover:[scrollbar-width:thin] data-[orientation=horizontal]:hover:[scrollbar-color:#d9d9d9_transparent] data-[orientation=horizontal]:hover:[&::-webkit-scrollbar-thumb]:bg-[#d9d9d9] data-[orientation=horizontal]:hover:[&::-webkit-scrollbar-thumb:hover]:bg-[#888]',
    'data-[orientation=vertical]:grid data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-stretch',
  ].join(' '),
  {
    variants: {
      variant: {
        outline: 'gap-2',
        ghost: 'gap-2',
        underline: 'gap-0',
      },
    },
    defaultVariants: {
      variant: 'outline',
    },
  },
);

export const tabsTriggerVariants = cva(
  [
    'inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-sm font-medium',
    'touch-manipulation whitespace-nowrap outline-none transition-[color,background-color,border-color,box-shadow,transform]',
    'duration-200 ease-[cubic-bezier(0.25,1,0.5,1)]',
    directDenseSurfaceFocus.base,
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-muted-foreground disabled:hover:shadow-none',
    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:hover:bg-transparent data-[disabled]:hover:text-muted-foreground data-[disabled]:hover:shadow-none',
    'data-[orientation=horizontal]:shrink-0',
    'data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start',
    'motion-reduce:transition-none',
  ].join(' '),
  {
    variants: {
      variant: {
        outline:
          'border border-border bg-background text-foreground shadow-none enabled:data-[state=inactive]:hover:bg-accent/70 enabled:data-[state=inactive]:hover:text-accent-foreground data-[state=active]:bg-accent/60 data-[state=active]:text-accent-foreground',
        ghost:
          'border border-transparent bg-transparent text-muted-foreground shadow-none enabled:data-[state=inactive]:hover:bg-accent/70 enabled:data-[state=inactive]:hover:text-accent-foreground data-[state=active]:bg-accent/60 data-[state=active]:text-accent-foreground',
        underline:
          [
            'rounded-none border-x-0 border-t-0 border-b-[2px] border-transparent bg-transparent text-slate-700 shadow-none',
            'enabled:data-[state=inactive]:hover:border-sky-100 enabled:data-[state=inactive]:hover:bg-transparent enabled:data-[state=inactive]:hover:text-[#016DA1]',
            'focus-visible:border-sky-200 focus-visible:bg-transparent focus-visible:text-[#016DA1]',
            'data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none',
          ].join(' '),
      },
    },
    defaultVariants: {
      variant: 'outline',
    },
  },
);

export const tabsContentVariants = cva(
  [
    'min-w-0 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm outline-none',
    directDenseSurfaceFocus.base,
    'data-[state=inactive]:hidden',
  ].join(' '),
);
