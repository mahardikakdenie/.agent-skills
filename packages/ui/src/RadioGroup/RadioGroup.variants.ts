import { cva } from 'class-variance-authority';

import { getCompactControlFocusRecipe } from '../utils/focus-normalization';

const standardCompactControlFocus = getCompactControlFocusRecipe('standard');

export const radioGroupFieldVariants = cva('grid gap-2');

export const radioGroupRootVariants = cva('', {
  variants: {
    orientation: {
      vertical: 'grid gap-3',
      horizontal: 'flex flex-wrap items-start gap-6',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

export const radioGroupItemRowVariants = cva('flex items-start gap-3');

export const radioGroupItemControlVariants = cva(
  [
    'peer/radio inline-flex shrink-0 items-center justify-center rounded-full border bg-background p-0 align-middle leading-none shadow-sm outline-none',
    'transition-[border-color,box-shadow,background-color] motion-reduce:transition-none',
    standardCompactControlFocus.base,
    'disabled:cursor-not-allowed disabled:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
      invalid: {
        false: 'border-input data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 hover:border-primary/70 hover:bg-accent/30',
        true: [
          'border-destructive data-[state=checked]:border-destructive data-[state=checked]:bg-destructive/10 hover:border-destructive/80 hover:bg-destructive/5',
          standardCompactControlFocus.invalid,
        ].join(' '),
      },
      disabled: {
        false: '',
        true: 'border-input bg-muted/40',
      },
    },
    compoundVariants: [
      {
        invalid: true,
        disabled: true,
        className: 'border-destructive/40 bg-destructive/5',
      },
    ],
    defaultVariants: {
      size: 'md',
      invalid: false,
      disabled: false,
    },
  },
);

export const radioGroupIndicatorVariants = cva(
  [
    'pointer-events-none flex items-center justify-center rounded-full opacity-0 leading-none',
    'transition-opacity motion-reduce:transition-none',
    'data-[state=checked]:opacity-100',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const radioGroupIndicatorDotVariants = cva('block rounded-full', {
  variants: {
    size: {
      sm: 'h-2 w-2',
      md: 'h-2.5 w-2.5',
      lg: 'h-3 w-3',
    },
    invalid: {
      false: 'bg-primary',
      true: 'bg-destructive',
    },
  },
  defaultVariants: {
    size: 'md',
    invalid: false,
  },
});

export const radioGroupContentVariants = cva('grid gap-1');

export const radioGroupLabelVariants = cva('select-none font-medium leading-5', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base',
    },
    disabled: {
      false: 'text-foreground',
      true: 'text-muted-foreground',
    },
    invalid: {
      false: '',
      true: 'text-destructive',
    },
  },
  compoundVariants: [
    {
      disabled: true,
      invalid: true,
      className: 'text-destructive/70',
    },
  ],
  defaultVariants: {
    size: 'md',
    disabled: false,
    invalid: false,
  },
});

export const radioGroupDescriptionVariants = cva('leading-5', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-sm',
    },
    disabled: {
      false: 'text-muted-foreground',
      true: 'text-muted-foreground/80',
    },
    invalid: {
      false: '',
      true: '',
    },
  },
  defaultVariants: {
    size: 'md',
    disabled: false,
    invalid: false,
  },
});

export const radioGroupMessageVariants = cva('text-sm font-medium leading-5 text-destructive');
