import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import type { BadgeProps, BadgeTone, BadgeVariant } from './Badge.types';
import { badgeVariants } from './Badge.variants';

const legacyBadgeVariantToneMap = {
  default: 'default',
  secondary: 'secondary',
  destructive: 'destructive',
  success: 'success',
  warning: 'warning',
  info: 'info',
} as const satisfies Record<Exclude<BadgeVariant, 'outline' | 'solid'>, BadgeTone>;

function resolveBadgePresentation(
  variant: BadgeVariant | undefined,
  tone: BadgeTone | undefined,
): {
  variant: 'outline' | 'solid';
  tone: BadgeTone;
} {
  if (!variant || variant === 'outline' || variant === 'solid') {
    return {
      variant: variant === 'solid' ? 'solid' : 'outline',
      tone: tone ?? 'default',
    };
  }

  return {
    variant: 'solid',
    tone: tone ?? legacyBadgeVariantToneMap[variant],
  };
}

/**
 * Compact semantic status label for inline categorization and state display.
 *
 * `Badge` intentionally keeps a flat API. Additional visuals such as a dot or
 * icon are composed through `children` rather than expanding the prop surface
 * with badge-specific booleans or slots.
 */
export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, tone, size, children, ...props }, ref) => {
    const resolvedPresentation = resolveBadgePresentation(variant, tone);

    return (
      <Box
        ref={ref}
        data-slot="badge"
        className={cn(
          badgeVariants({
            variant: resolvedPresentation.variant,
            tone: resolvedPresentation.tone,
            size,
          }),
          className,
        )}
        {...props}
      >
        {children}
      </Box>
    );
  },
);

Badge.displayName = 'Badge';
