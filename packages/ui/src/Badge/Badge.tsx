import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import type { BadgeProps } from './Badge.types';
import { badgeVariants } from './Badge.variants';

/**
 * Compact semantic status label for inline categorization and state display.
 *
 * `Badge` intentionally keeps a flat API. Additional visuals such as a dot or
 * icon are composed through `children` rather than expanding the prop surface
 * with badge-specific booleans or slots.
 */
export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        data-slot="badge"
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </Box>
    );
  },
);

Badge.displayName = 'Badge';
