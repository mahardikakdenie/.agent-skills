import type * as React from 'react';

export const alertSurfaceVariantValues = ['outline', 'shadow'] as const;
export const alertVariantValues = [
  ...alertSurfaceVariantValues,
  'default',
  'success',
  'info',
  'warning',
  'destructive',
] as const;
export const alertToneValues = ['default', 'success', 'info', 'warning', 'destructive'] as const;

export type AlertSurfaceVariant = (typeof alertSurfaceVariantValues)[number];
export type AlertTone = (typeof alertToneValues)[number];
export type AlertVariant = (typeof alertVariantValues)[number];

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  tone?: AlertTone;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  dismissible?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
  className?: string;
}
