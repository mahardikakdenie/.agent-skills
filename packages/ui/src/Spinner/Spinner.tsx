import * as React from 'react'

import { cn } from '@repo/helper'

import { Box } from '../Box'
import type { SpinnerProps } from './Spinner.types'
import { spinnerIconRingVariants, spinnerIconVariants, spinnerLabelVariants, spinnerVariants } from './Spinner.variants'

/**
 * Shared indeterminate loading indicator for inline, centered, and simple
 * blocking overlay states.
 */
export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      className,
      size = 'md',
      label,
      inline = false,
      overlay = false,
      role,
      'aria-live': ariaLive,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      ...props
    },
    ref,
  ) => {
    const layout = overlay ? 'overlay' : inline ? 'inline' : 'default'
    const hasAccessibleName = Boolean(label || ariaLabel || ariaLabelledby)

    return (
      <Box
        ref={ref}
        data-slot="spinner"
        role={role ?? 'status'}
        aria-live={ariaLive ?? 'polite'}
        aria-label={ariaLabel ?? (!hasAccessibleName ? 'Loading' : undefined)}
        aria-labelledby={ariaLabelledby}
        className={cn(spinnerVariants({ size, layout }), className)}
        {...props}
      >
        <Box
          as="span"
          data-slot="spinner-icon"
          aria-hidden="true"
          className={spinnerIconVariants({ size })}
        >
          <Box as="span" className={spinnerIconRingVariants({ size })} />
        </Box>
        {label ? (
          <Box
            as="span"
            data-slot="spinner-label"
            className={spinnerLabelVariants({ size, layout })}
          >
            {label}
          </Box>
        ) : null}
      </Box>
    )
  },
)

Spinner.displayName = 'Spinner'
