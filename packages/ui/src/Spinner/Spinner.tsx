import * as React from 'react'

import { cn } from '@repo/helper'

import { Box } from '../Box'
import type { SpinnerProps } from './Spinner.types'
import {
  spinnerIconArcVariants,
  spinnerIconSvgVariants,
  spinnerIconTrackVariants,
  spinnerIconVariants,
  spinnerLabelVariants,
  spinnerVariants,
} from './Spinner.variants'

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
          <Box
            as="svg"
            viewBox="0 0 24 24"
            fill="none"
            data-slot="spinner-svg"
            className={spinnerIconSvgVariants({ size })}
          >
            <Box
              as="circle"
              cx="12"
              cy="12"
              r="9"
              strokeWidth="2.5"
              className={spinnerIconTrackVariants()}
            />
            <Box
              as="circle"
              cx="12"
              cy="12"
              r="9"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="40 18"
              transform="rotate(-90 12 12)"
              className={spinnerIconArcVariants()}
            />
          </Box>
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
