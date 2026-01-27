'use client';

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { Circle } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';

const radioGroupRootClassName = 'flex flex-col gap-3';

const radioGroupItemVariants = cva(
  'peer inline-flex shrink-0 items-center justify-center rounded-full border bg-white text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-gray-300 focus-visible:ring-[var(--color-primary)] data-[state=checked]:border-[var(--color-primary)] data-[state=checked]:bg-[var(--color-primary)]',
        danger:
          'border-[var(--color-danger)] focus-visible:ring-[var(--color-danger)] data-[state=checked]:border-[var(--color-danger)] data-[state=checked]:bg-[var(--color-danger)]',
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

type RadioGroupRootProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>;

type RadioGroupItemPrimitiveProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>;

export interface RadioGroupProps extends Omit<RadioGroupRootProps, 'orientation'> {}

export interface RadioGroupItemProps
  extends RadioGroupItemPrimitiveProps, VariantProps<typeof radioGroupItemVariants> {
  indicatorClassName?: string;
}

export const RadioGroup = forwardRef<ElementRef<typeof RadioGroupPrimitive.Root>, RadioGroupProps>(
  ({ className, ...props }, ref) => {
    return (
      <RadioGroupPrimitive.Root
        ref={ref}
        className={clsx(radioGroupRootClassName, className)}
        {...props}
      />
    );
  },
);

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export const RadioGroupItem = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, indicatorClassName, size, variant, ...props }, ref) => {
  const indicatorSizeClass = clsx({
    'h-2 w-2': size === 'sm',
    'h-2.5 w-2.5': size === 'md' || size === undefined,
    'h-3 w-3': size === 'lg',
  });

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={clsx(radioGroupItemVariants({ size, variant }), className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        className={clsx('flex items-center justify-center text-current', indicatorClassName)}
      >
        <Circle className={clsx(indicatorSizeClass, 'fill-current text-current')} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { radioGroupItemVariants };
