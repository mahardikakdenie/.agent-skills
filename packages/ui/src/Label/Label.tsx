import * as LabelPrimitive from '@radix-ui/react-label';
import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import type { LabelProps } from './Label.types';
import {
  labelRequiredIndicatorVariants,
  labelTextVariants,
  labelVariants,
} from './Label.variants';

/**
 * Shared form-label primitive for associating readable field copy with a
 * control while staying inside the Box-only authored DOM rule.
 */
export const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  (
    {
      tone = 'default',
      required = false,
      disabled = false,
      className,
      children,
      htmlFor,
      ...props
    },
    ref,
  ) => {
    return (
      <LabelPrimitive.Root ref={ref} asChild htmlFor={htmlFor} {...props}>
        <Box
          as="label"
          data-slot="label"
          data-disabled={disabled ? 'true' : undefined}
          className={cn(
            labelVariants({ tone, disabled }),
            htmlFor && !disabled ? 'cursor-pointer' : undefined,
            className,
          )}
        >
          <Box as="span" data-slot="label-text" className={labelTextVariants()}>
            {children}
          </Box>
          {required ? (
            <Box
              as="span"
              data-slot="label-required-indicator"
              aria-hidden="true"
              className={labelRequiredIndicatorVariants({ disabled })}
            >
              *
            </Box>
          ) : null}
        </Box>
      </LabelPrimitive.Root>
    );
  },
);

Label.displayName = 'Label';
