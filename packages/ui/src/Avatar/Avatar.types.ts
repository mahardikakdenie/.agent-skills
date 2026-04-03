import type * as React from 'react';

import type { DisplaySurfaceVariant } from '../utils/display-surface-variants';

export const avatarSizeValues = ['sm', 'md', 'lg', 'xl'] as const;

export type AvatarSize = (typeof avatarSizeValues)[number];

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  variant?: DisplaySurfaceVariant;
  size?: AvatarSize;
  className?: string;
}
