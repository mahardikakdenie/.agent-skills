import { cva } from 'class-variance-authority';

import {
  getCompactControlFocusRecipe,
  getFieldShellFocusRecipe,
} from '../utils/focus-normalization';
import { fieldVariantOptions } from '../utils/field-variants';

const directFieldShellFocus = getFieldShellFocusRecipe('direct');
const embeddedActionFocus = getCompactControlFocusRecipe('embedded');

export const selectFieldVariants = cva('grid w-full gap-1.5');

export const selectControlVariants = cva('relative w-full');

export const selectLabelVariants = cva('text-sm font-medium leading-none', {
  variants: {
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
    },
  },
  defaultVariants: {
    tone: 'default',
  },
});

export const selectContentLabelVariants = cva('px-3 py-1.5 text-xs font-semibold text-muted-foreground');

export const selectTriggerVariants = cva(
  [
    'flex w-full min-w-0 cursor-pointer items-center justify-between gap-2 overflow-hidden rounded-md border bg-background py-1.5 text-left leading-none',
    'transition-colors motion-reduce:transition-none',
    directFieldShellFocus.base,
    'data-[placeholder]:text-muted-foreground data-[state=open]:border-ring',
  ].join(' '),
  {
    variants: {
      variant: fieldVariantOptions,
      size: {
        xs: 'min-h-8 px-2.5 text-xs',
        sm: 'min-h-9 px-3 text-sm',
        md: 'min-h-10 px-3 text-sm',
        lg: 'min-h-12 px-4 text-base',
      },
      invalid: {
        true: [directFieldShellFocus.invalid, 'data-[state=open]:border-destructive'].join(' '),
        false: '',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-60',
        false: '',
      },
      clearable: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        size: 'xs',
        clearable: true,
        className: 'pr-8',
      },
      {
        size: 'sm',
        clearable: true,
        className: 'pr-10',
      },
      {
        size: 'md',
        clearable: true,
        className: 'pr-10',
      },
      {
        size: 'lg',
        clearable: true,
        className: 'pr-12',
      },
    ],
    defaultVariants: {
      variant: 'outline',
      size: 'md',
      invalid: false,
      disabled: false,
      clearable: false,
    },
  },
);

export const selectValueVariants = cva('line-clamp-1 min-w-0 flex-1 text-foreground');

export const selectIconVariants = cva('ml-auto shrink-0 text-muted-foreground', {
  variants: {
    size: {
      xs: '[&_svg]:h-3.5 [&_svg]:w-3.5',
      sm: '[&_svg]:h-4 [&_svg]:w-4',
      md: '[&_svg]:h-4 [&_svg]:w-4',
      lg: '[&_svg]:h-[18px] [&_svg]:w-[18px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const selectContentVariants = cva(
  [
    'z-50 min-w-[var(--radix-select-trigger-width)] max-w-[calc(100vw-1rem)] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md',
    'max-h-[min(var(--radix-select-content-available-height),20rem)]',
    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
    'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
    'motion-reduce:animate-none',
  ].join(' '),
);

export const selectViewportVariants = cva('max-h-[inherit] p-1');

export const selectItemVariants = cva(
  [
    'relative flex w-full cursor-pointer select-none items-center rounded-sm outline-none',
    'transition-colors motion-reduce:transition-none',
    'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  ].join(' '),
  {
    variants: {
      size: {
        xs: 'min-h-8 py-1.5 pl-2.5 pr-7 text-xs',
        sm: 'min-h-9 py-2 pl-3 pr-8 text-sm',
        md: 'min-h-10 py-2 pl-3 pr-8 text-sm',
        lg: 'min-h-12 py-2.5 pl-4 pr-10 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const selectItemTextVariants = cva('truncate');

export const selectItemIndicatorVariants = cva(
  'absolute inline-flex items-center justify-center text-foreground',
  {
    variants: {
      size: {
        xs: 'right-2 h-3.5 w-3.5 [&_svg]:h-3.5 [&_svg]:w-3.5',
        sm: 'right-2.5 h-4 w-4 [&_svg]:h-4 [&_svg]:w-4',
        md: 'right-2.5 h-4 w-4 [&_svg]:h-4 [&_svg]:w-4',
        lg: 'right-3 h-[18px] w-[18px] [&_svg]:h-[18px] [&_svg]:w-[18px]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const selectScrollButtonVariants = cva(
  'flex cursor-default items-center justify-center py-1 text-muted-foreground',
);

export const selectMessageVariants = cva('text-sm leading-5 text-destructive');

export const selectActionButtonVariants = cva(
  [
    'absolute top-1/2 inline-flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-sm text-muted-foreground',
    'transition-colors motion-reduce:transition-none',
    'hover:text-foreground disabled:pointer-events-none disabled:opacity-50',
    embeddedActionFocus.base,
  ].join(' '),
  {
    variants: {
      size: {
        xs: 'right-2 h-5 w-5 [&_svg]:h-3.5 [&_svg]:w-3.5',
        sm: 'right-2.5 h-6 w-6 [&_svg]:h-4 [&_svg]:w-4',
        md: 'right-2.5 h-6 w-6 [&_svg]:h-4 [&_svg]:w-4',
        lg: 'right-3 h-7 w-7 [&_svg]:h-[18px] [&_svg]:w-[18px]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);
