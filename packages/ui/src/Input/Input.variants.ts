import { cva } from 'class-variance-authority';

import {
  getCompactControlFocusRecipe,
  getFieldShellFocusRecipe,
} from '../utils/focus-normalization';
import { fieldVariantOptions } from '../utils/field-variants';

const compositeFieldShellFocus = getFieldShellFocusRecipe('composite');
const embeddedActionFocus = getCompactControlFocusRecipe('embedded');

export const inputFieldVariants = cva('grid w-full gap-1.5');

export const inputLabelVariants = cva('text-sm font-medium leading-none', {
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

export const inputControlVariants = cva(
  [
    'flex w-full items-center gap-0 rounded-md border',
    'transition-colors motion-reduce:transition-none',
    compositeFieldShellFocus.base,
  ].join(' '),
  {
    variants: {
      variant: fieldVariantOptions,
      size: {
        xs: 'min-h-8 px-2',
        sm: 'min-h-9 px-2.5',
        md: 'min-h-10 px-3',
        lg: 'min-h-12 px-0',
      },
      invalid: {
        true: compositeFieldShellFocus.invalid,
        false: '',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-60',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'md',
      invalid: false,
      disabled: false,
    },
  },
);

export const inputElementVariants = cva(
  [
    'peer flex-1 border-0 bg-transparent p-0 text-foreground outline-none',
    'placeholder:text-muted-foreground disabled:cursor-not-allowed',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
  ].join(' '),
  {
    variants: {
      size: {
        xs: 'px-2 text-xs',
        sm: 'px-2.5 text-sm',
        md: 'px-3 text-sm',
        lg: 'px-4 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const inputAffixVariants = cva('shrink-0 text-muted-foreground flex items-center justify-center h-full', {
  variants: {
    size: {
      xs: 'text-xs [&_svg]:h-3.5 [&_svg]:w-3.5 px-2',
      sm: 'text-sm [&_svg]:h-4 [&_svg]:w-4 px-2.5',
      md: 'text-sm [&_svg]:h-4 [&_svg]:w-4 px-3',
      lg: 'text-base [&_svg]:h-[18px] [&_svg]:w-[18px] px-0',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const inputActionButtonVariants = cva(
  [
    'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground',
    'transition-colors motion-reduce:transition-none',
    'hover:text-foreground disabled:pointer-events-none disabled:opacity-50',
    embeddedActionFocus.base,
  ].join(' '),
  {
    variants: {
      size: {
        xs: 'h-5 w-5',
        sm: 'h-6 w-6',
        md: 'h-6 w-6',
        lg: 'h-7 w-7',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const inputHelperTextVariants = cva('text-sm leading-5 text-muted-foreground');

export const inputMessageVariants = cva('text-sm leading-5 text-destructive');
