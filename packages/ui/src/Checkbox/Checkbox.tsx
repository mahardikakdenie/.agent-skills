'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { Check, Minus } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';

const checkboxVariants = cva(
  'peer inline-flex shrink-0 items-center justify-center rounded-md border bg-white text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-gray-300 focus-visible:ring-[var(--color-primary)] data-[state=checked]:border-[var(--color-primary)] data-[state=checked]:bg-[var(--color-primary)] data-[state=indeterminate]:border-[var(--color-primary)] data-[state=indeterminate]:bg-[var(--color-primary)]',
        danger:
          'border-[var(--color-danger)] focus-visible:ring-[var(--color-danger)] data-[state=checked]:border-[var(--color-danger)] data-[state=checked]:bg-[var(--color-danger)] data-[state=indeterminate]:border-[var(--color-danger)] data-[state=indeterminate]:bg-[var(--color-danger)]',
      },
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

type CheckboxRootProps = ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;

export interface CheckboxProps extends CheckboxRootProps, VariantProps<typeof checkboxVariants> {
  indicatorClassName?: string;
}

export const Checkbox = forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, variant, size, indicatorClassName, ...props }, ref) => {
    const iconSizeClass = clsx({
      'h-3 w-3': size === 'sm',
      'h-4 w-4': size === 'md' || size === undefined,
      'h-5 w-5': size === 'lg',
    });

    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={clsx(checkboxVariants({ variant, size }), className)}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={clsx(
            'flex items-center justify-center text-current',
            '[&_svg.checkbox-minus]:hidden',
            'data-[state=indeterminate]:[&_svg.checkbox-check]:hidden',
            'data-[state=indeterminate]:[&_svg.checkbox-minus]:block',
            indicatorClassName,
          )}
        >
          <Check className={clsx('checkbox-check', iconSizeClass)} />
          <Minus className={clsx('checkbox-minus', iconSizeClass)} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export { checkboxVariants };
