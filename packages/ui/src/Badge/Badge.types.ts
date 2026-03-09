import type * as React from 'react';

export const badgeVariantValues = [
  'default',
  'secondary',
  'destructive',
  'outline',
  'success',
  'warning',
  'info',
] as const;

export const badgeSizeValues = ['sm', 'md', 'lg'] as const;

export type BadgeVariant = (typeof badgeVariantValues)[number];
export type BadgeSize = (typeof badgeSizeValues)[number];

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
}
