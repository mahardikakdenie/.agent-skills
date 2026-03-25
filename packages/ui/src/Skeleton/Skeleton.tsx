/* eslint-disable react/prop-types */
import * as React from 'react'

import { cn } from '@repo/helper'

import { Box } from '../Box'
import { skeletonVariants } from './Skeleton.variants'

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

/**
 * Shared loading placeholder primitive for shape-only skeleton states.
 *
 * The public API stays intentionally flat. Consumers shape the placeholder via
 * `className` and compose larger loading layouts with `Box`, `Card`, `Table`,
 * or future loading wrappers instead of adding component-specific mode props.
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    const isDecorative =
      !props.role &&
      !props['aria-label'] &&
      !props['aria-labelledby'] &&
      !props['aria-describedby']

    return (
      <Box
        ref={ref}
        data-slot="skeleton"
        className={cn(skeletonVariants(), className)}
        {...props}
        aria-hidden={props['aria-hidden'] ?? (isDecorative ? true : undefined)}
      />
    )
  },
)

Skeleton.displayName = 'Skeleton'

