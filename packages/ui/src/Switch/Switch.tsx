'use client';

import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import type { SwitchProps } from './Switch.types';
import {
  switchControlRowVariants,
  switchFieldVariants,
  switchLabelVariants,
  switchMessageVariants,
  switchRequiredIndicatorVariants,
  switchRootVariants,
  switchThumbVariants,
} from './Switch.variants';

/**
 * Shared binary toggle primitive built on Radix Switch.
 * Radix owns the switch semantics; Box owns the authored DOM around it.
 */
export const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  (
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      disabled = false,
      required = false,
      label,
      error = false,
      size = 'md',
      className,
      id,
      'aria-describedby': ariaDescribedBy,
      'aria-labelledby': ariaLabelledBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const switchId = id ?? `switch-${generatedId}`;
    const labelId = label ? `${switchId}-label` : undefined;
    const errorId = typeof error === 'string' ? `${switchId}-error` : undefined;
    const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined;
    const labelledBy = [ariaLabelledBy, labelId].filter(Boolean).join(' ') || undefined;
    const isControlled = checked !== undefined;
    const invalid = Boolean(error);
    const labelTone = invalid && !disabled ? 'destructive' : disabled ? 'muted' : 'default';

    return (
      <Box data-slot="switch-field" className={cn(switchFieldVariants(), className)}>
        <Box data-slot="switch-control-row" className={switchControlRowVariants()}>
          <SwitchPrimitive.Root
            ref={ref}
            checked={isControlled ? checked : undefined}
            defaultChecked={isControlled ? undefined : defaultChecked}
            disabled={disabled}
            required={required}
            id={switchId}
            onCheckedChange={onCheckedChange}
            asChild
            {...props}
          >
            <Box
              as="button"
              type="button"
              data-slot="switch-control"
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              aria-labelledby={labelledBy}
              className={switchRootVariants({ size, invalid, disabled })}
            >
              <SwitchPrimitive.Thumb asChild>
                <Box
                  as="span"
                  data-slot="switch-thumb"
                  className={switchThumbVariants({ size, disabled })}
                />
              </SwitchPrimitive.Thumb>
            </Box>
          </SwitchPrimitive.Root>

          {label ? (
            <Box
              as="label"
              id={labelId}
              htmlFor={switchId}
              data-slot="switch-label"
              className={cn(
                switchLabelVariants({ size, tone: labelTone }),
                disabled ? 'cursor-not-allowed' : 'cursor-pointer',
              )}
            >
              {label}
              {required ? (
                <Box
                  as="span"
                  data-slot="switch-required-indicator"
                  aria-hidden="true"
                  className={switchRequiredIndicatorVariants()}
                >
                  *
                </Box>
              ) : null}
            </Box>
          ) : null}
        </Box>

        {typeof error === 'string' ? (
          <Box as="p" id={errorId} role="alert" className={switchMessageVariants()}>
            {error}
          </Box>
        ) : null}
      </Box>
    );
  },
);

Switch.displayName = 'Switch';
