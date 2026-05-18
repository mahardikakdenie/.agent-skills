'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as React from 'react';
import { Check, Minus } from 'lucide-react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import {
  checkboxContentVariants,
  checkboxControlRowVariants,
  checkboxDescriptionVariants,
  checkboxFieldVariants,
  checkboxIndicatorVariants,
  checkboxLabelVariants,
  checkboxMessageVariants,
  checkboxRootVariants,
} from './Checkbox.variants';
import type { CheckboxCheckedState, CheckboxProps, CheckboxSize } from './Checkbox.types';

const checkboxIconClassNameMap: Record<CheckboxSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
};

/**
 * Shared checkbox control with optional label, description, and error message.
 * Radix owns the checkbox semantics; Box owns the authored DOM around it.
 */
export const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  (
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      disabled = false,
      required = false,
      label,
      description,
      error = false,
      size = 'md',
      className,
      labelClassName,
      id,
      'aria-describedby': ariaDescribedBy,
      'aria-labelledby': ariaLabelledBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const checkboxId = id ?? `checkbox-${generatedId}`;
    const labelId = label ? `${checkboxId}-label` : undefined;
    const descriptionId = description ? `${checkboxId}-description` : undefined;
    const errorId = typeof error === 'string' ? `${checkboxId}-error` : undefined;
    const describedBy =
      [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(' ') || undefined;
    const labelledBy = [ariaLabelledBy, labelId].filter(Boolean).join(' ') || undefined;
    const hasError = Boolean(error);
    const isControlled = checked !== undefined;
    const [uncontrolledState, setUncontrolledState] =
      React.useState<CheckboxCheckedState>(defaultChecked);
    const currentState = isControlled ? checked : uncontrolledState;
    const labelTone = hasError && !disabled ? 'destructive' : disabled ? 'muted' : 'default';
    const descriptionTone = disabled ? 'muted' : 'default';

    const handleCheckedChange = (nextChecked: CheckboxCheckedState) => {
      if (!isControlled) {
        setUncontrolledState(nextChecked);
      }

      onCheckedChange?.(nextChecked);
    };

    const indicatorIcon =
      currentState === 'indeterminate' ? (
        <Minus aria-hidden="true" className={checkboxIconClassNameMap[size]} />
      ) : currentState === true ? (
        <Check aria-hidden="true" className={checkboxIconClassNameMap[size]} />
      ) : null;

    return (
      <Box data-slot="checkbox-field" className={cn(checkboxFieldVariants(), className)}>
        <Box data-slot="checkbox-control-row" className={checkboxControlRowVariants()}>
          <CheckboxPrimitive.Root
            ref={ref}
            checked={isControlled ? checked : undefined}
            defaultChecked={isControlled ? undefined : defaultChecked}
            disabled={disabled}
            required={required}
            id={checkboxId}
            onCheckedChange={handleCheckedChange}
            asChild
            {...props}
          >
            <Box
              as="button"
              type="button"
              data-slot="checkbox-control"
              aria-describedby={describedBy}
              aria-invalid={hasError || undefined}
              aria-labelledby={labelledBy}
              className={checkboxRootVariants({ size, invalid: hasError })}
            >
              <CheckboxPrimitive.Indicator asChild forceMount>
                <Box
                  as="span"
                  data-slot="checkbox-indicator"
                  className={checkboxIndicatorVariants({ size, visible: currentState !== false })}
                >
                  {indicatorIcon}
                </Box>
              </CheckboxPrimitive.Indicator>
            </Box>
          </CheckboxPrimitive.Root>

          {(label || description || errorId) && (
            <Box data-slot="checkbox-content" className={checkboxContentVariants()}>
              {label && (
                <Box
                  as="label"
                  id={labelId}
                  htmlFor={checkboxId}
                  className={cn(
                    checkboxLabelVariants({ size, tone: labelTone }),
                    disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                    labelClassName,
                  )}
                >
                  {label}
                  {required && (
                    <Box
                      as="span"
                      data-slot="checkbox-required-indicator"
                      aria-hidden="true"
                      className="ml-1 text-destructive"
                    >
                      *
                    </Box>
                  )}
                </Box>
              )}

              {description && (
                <Box
                  as="p"
                  id={descriptionId}
                  className={checkboxDescriptionVariants({ tone: descriptionTone })}
                >
                  {description}
                </Box>
              )}

              {typeof error === 'string' && (
                <Box as="p" id={errorId} role="alert" className={checkboxMessageVariants()}>
                  {error}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    );
  },
);

Checkbox.displayName = 'Checkbox';
