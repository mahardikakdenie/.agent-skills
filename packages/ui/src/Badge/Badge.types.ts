import type * as React from 'react';

export const badgeSurfaceVariantValues = ['outline', 'solid'] as const;
export const badgeVariantValues = [
  ...badgeSurfaceVariantValues,
  'default',
  'secondary',
  'destructive',
  'success',
  'warning',
  'info',
] as const;
export const badgeToneValues = [
  'default',
  'secondary',
  'destructive',
  'success',
  'warning',
  'info',
] as const;

export const badgeSizeValues = ['sm', 'md', 'lg'] as const;

export type BadgeSurfaceVariant = (typeof badgeSurfaceVariantValues)[number];
export type BadgeTone = (typeof badgeToneValues)[number];
export type BadgeVariant = (typeof badgeVariantValues)[number];
export type BadgeSize = (typeof badgeSizeValues)[number];

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  tone?: BadgeTone;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
}
