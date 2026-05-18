'use client';

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import type { RadioGroupItemProps, RadioGroupProps, RadioGroupSize } from './RadioGroup.types';
import {
  radioGroupContentVariants,
  radioGroupDescriptionVariants,
  radioGroupFieldVariants,
  radioGroupIndicatorDotVariants,
  radioGroupIndicatorVariants,
  radioGroupItemControlVariants,
  radioGroupItemRowVariants,
  radioGroupLabelVariants,
  radioGroupMessageVariants,
  radioGroupRootVariants,
} from './RadioGroup.variants';

interface RadioGroupStyleContextValue {
  invalid: boolean;
  size: RadioGroupSize;
}

const RadioGroupStyleContext = React.createContext<RadioGroupStyleContextValue>({
  invalid: false,
  size: 'md',
});

/**
 * Shared single-select choice primitive built on Radix Radio Group.
 * Radix owns the radio semantics; Box owns the authored DOM wrappers.
 */
export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(
  (
    {
      orientation = 'vertical',
      size = 'md',
      error = false,
      className,
      children,
      id,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const groupId = id ?? `radio-group-${generatedId}`;
    const errorId = typeof error === 'string' ? `${groupId}-error` : undefined;
    const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined;
    const invalid = Boolean(error);

    return (
      <RadioGroupStyleContext.Provider value={{ invalid, size }}>
        <Box data-slot="radio-group-field" className={cn(radioGroupFieldVariants(), className)}>
          <RadioGroupPrimitive.Root
            ref={ref}
            id={groupId}
            orientation={orientation}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            asChild
            {...props}
          >
            <Box
              data-slot="radio-group"
              data-invalid={invalid ? 'true' : undefined}
              className={radioGroupRootVariants({ orientation })}
            >
              {children}
            </Box>
          </RadioGroupPrimitive.Root>

          {typeof error === 'string' ? (
            <Box as="p" id={errorId} role="alert" className={radioGroupMessageVariants()}>
              {error}
            </Box>
          ) : null}
        </Box>
      </RadioGroupStyleContext.Provider>
    );
  },
);

RadioGroup.displayName = 'RadioGroup';

/**
 * One selectable option inside the shared RadioGroup surface.
 * Optional label and description stay outside the Radix item while remaining
 * semantically linked through ids and aria attributes.
 */
export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(
  (
    {
      id,
      value,
      disabled = false,
      label,
      description,
      className,
      'aria-describedby': ariaDescribedBy,
      'aria-labelledby': ariaLabelledBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const itemId = id ?? `radio-group-item-${generatedId}`;
    const labelId = label ? `${itemId}-label` : undefined;
    const descriptionId = description ? `${itemId}-description` : undefined;
    const describedBy = [ariaDescribedBy, descriptionId].filter(Boolean).join(' ') || undefined;
    const labelledBy = [ariaLabelledBy, labelId].filter(Boolean).join(' ') || undefined;
    const { invalid, size } = React.useContext(RadioGroupStyleContext);

    return (
      <Box data-slot="radio-group-item-row" className={cn(radioGroupItemRowVariants(), className)}>
        <RadioGroupPrimitive.Item
          ref={ref}
          id={itemId}
          value={value}
          disabled={disabled}
          aria-describedby={describedBy}
          aria-labelledby={labelledBy}
          asChild
          {...props}
        >
          <Box
            as="button"
            type="button"
            data-slot="radio-group-item-control"
            className={radioGroupItemControlVariants({ size, invalid, disabled })}
          >
            <RadioGroupPrimitive.Indicator asChild forceMount>
              <Box
                as="span"
                data-slot="radio-group-item-indicator"
                className={radioGroupIndicatorVariants({ size })}
              >
                <Box
                  as="span"
                  data-slot="radio-group-item-dot"
                  className={radioGroupIndicatorDotVariants({ size, invalid })}
                />
              </Box>
            </RadioGroupPrimitive.Indicator>
          </Box>
        </RadioGroupPrimitive.Item>

        {(label || description) && (
          <Box data-slot="radio-group-item-content" className={radioGroupContentVariants()}>
            {label ? (
              <Box
                as="label"
                id={labelId}
                htmlFor={itemId}
                className={cn(
                  radioGroupLabelVariants({ size, disabled, invalid }),
                  disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                )}
              >
                {label}
              </Box>
            ) : null}

            {description ? (
              <Box
                as="p"
                id={descriptionId}
                className={radioGroupDescriptionVariants({ size, disabled, invalid })}
              >
                {description}
              </Box>
            ) : null}
          </Box>
        )}
      </Box>
    );
  },
);

RadioGroupItem.displayName = 'RadioGroupItem';
