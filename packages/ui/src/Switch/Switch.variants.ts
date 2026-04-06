import { cva } from 'class-variance-authority';

import { getCompactControlFocusRecipe } from '../utils/focus-normalization';

const standardCompactControlFocus = getCompactControlFocusRecipe('standard');

export const switchFieldVariants = cva('grid gap-2');

export const switchControlRowVariants = cva('inline-flex items-start gap-3');

export const switchRootVariants = cva(
  [
    'peer/switch inline-flex shrink-0 cursor-pointer items-center rounded-full border p-0.5 shadow-sm outline-none',
    'transition-[background-color,border-color,box-shadow] motion-reduce:transition-none',
    standardCompactControlFocus.base,
    'disabled:cursor-not-allowed data-[disabled]:cursor-not-allowed',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
        lg: 'h-7 w-12',
      },
      invalid: {
        false: '',
        true: standardCompactControlFocus.invalid,
      },
      disabled: {
        false: '',
        true: 'shadow-none',
      },
    },
    compoundVariants: [
      {
        invalid: false,
        disabled: false,
        className: [
          'border-input',
          'data-[state=checked]:border-primary/70 data-[state=checked]:bg-primary data-[state=checked]:hover:bg-primary/90',
          'data-[state=unchecked]:bg-muted/85 data-[state=unchecked]:hover:border-primary/35 data-[state=unchecked]:hover:bg-accent/70',
        ].join(' '),
      },
      {
        invalid: false,
        disabled: true,
        className: [
          'border-input/90',
          'data-[state=checked]:border-primary/40 data-[state=checked]:bg-primary/55',
          'data-[state=unchecked]:bg-muted/85',
        ].join(' '),
      },
      {
        invalid: true,
        disabled: false,
        className: [
          'border-destructive/60',
          'data-[state=checked]:bg-destructive data-[state=checked]:hover:bg-destructive/90',
          'data-[state=unchecked]:bg-destructive/10 data-[state=unchecked]:hover:bg-destructive/15',
        ].join(' '),
      },
      {
        invalid: true,
        disabled: true,
        className: [
          'border-destructive/35',
          'data-[state=checked]:bg-destructive/55',
          'data-[state=unchecked]:bg-destructive/10',
        ].join(' '),
      },
    ],
    defaultVariants: {
      size: 'md',
      invalid: false,
      disabled: false,
    },
  },
);

export const switchThumbVariants = cva(
  [
    'pointer-events-none block rounded-full bg-background shadow-sm ring-1 ring-border/70',
    'transition-transform motion-reduce:transition-none',
    'data-[state=unchecked]:translate-x-0',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-4 w-4 data-[state=checked]:translate-x-4',
        md: 'h-5 w-5 data-[state=checked]:translate-x-5',
        lg: 'h-6 w-6 data-[state=checked]:translate-x-5',
      },
      disabled: {
        false: '',
        true: 'shadow-none ring-border/90',
      },
    },
    defaultVariants: {
      size: 'md',
      disabled: false,
    },
  },
);

export const switchLabelVariants = cva('select-none font-medium leading-5', {
  variants: {
    size: {
      sm: 'pt-0.5 text-sm',
      md: 'pt-0.5 text-sm',
      lg: 'pt-0.5 text-base',
    },
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
    },
  },
  defaultVariants: {
    size: 'md',
    tone: 'default',
  },
});

export const switchRequiredIndicatorVariants = cva('ml-1 text-destructive');

export const switchMessageVariants = cva('text-sm font-medium leading-5 text-destructive');
