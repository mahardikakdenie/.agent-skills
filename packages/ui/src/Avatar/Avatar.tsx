'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import type { AvatarProps } from './Avatar.types';
import { avatarFallbackVariants, avatarImageVariants, avatarRootVariants } from './Avatar.variants';

const FALLBACK_DELAY_MS = 300;

type AvatarLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

function getInitials(value?: string) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return undefined;
  }

  const parts = trimmedValue.split(/\s+/).filter(Boolean);
  const firstPart = parts[0];

  if (!firstPart) {
    return undefined;
  }

  if (parts.length === 1) {
    return firstPart.slice(0, 2).toUpperCase();
  }

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

/**
 * Shared user-avatar primitive for circular identity imagery with text fallback.
 *
 * `Avatar` keeps a narrow public contract: image source, accessible alt text,
 * optional fallback content, and a shared size scale. More advanced identity
 * states such as presence badges or grouped stacks stay consumer-composed.
 */
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ src, alt, fallback, variant = 'outline', size = 'md', className, ...props }, ref) => {
    const [loadingStatus, setLoadingStatus] = React.useState<AvatarLoadingStatus>('idle');

    const resolvedFallback = fallback ?? getInitials(alt) ?? '?';

    React.useEffect(() => {
      setLoadingStatus(src ? 'loading' : 'error');
    }, [src]);

    return (
      <AvatarPrimitive.Root ref={ref} asChild>
        <Box
          as="span"
          data-slot="avatar"
          data-size={size}
          data-loading-status={loadingStatus}
          className={cn(avatarRootVariants({ variant, size }), className)}
          {...props}
        >
          {src ? (
            <AvatarPrimitive.Image
              src={src}
              alt={alt ?? ''}
              asChild
              onLoadingStatusChange={(status) => {
                setLoadingStatus(status as AvatarLoadingStatus);
              }}
            >
              <Box
                as="img"
                data-slot="avatar-image"
                data-loading-status={loadingStatus}
                className={avatarImageVariants()}
              />
            </AvatarPrimitive.Image>
          ) : null}
          <AvatarPrimitive.Fallback asChild delayMs={src ? FALLBACK_DELAY_MS : undefined}>
            <Box
              as="span"
              data-slot="avatar-fallback"
              data-loading-status={loadingStatus}
              aria-hidden={alt ? undefined : true}
              className={avatarFallbackVariants({ size })}
            >
              {resolvedFallback}
            </Box>
          </AvatarPrimitive.Fallback>
        </Box>
      </AvatarPrimitive.Root>
    );
  },
);

Avatar.displayName = 'Avatar';
