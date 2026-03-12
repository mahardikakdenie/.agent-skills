import type * as React from 'react';

export const avatarSizeValues = ['sm', 'md', 'lg', 'xl'] as const;

export type AvatarSize = (typeof avatarSizeValues)[number];

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  size?: AvatarSize;
  className?: string;
}
