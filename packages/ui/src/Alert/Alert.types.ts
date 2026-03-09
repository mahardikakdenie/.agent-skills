import type * as React from 'react';

export const alertVariantValues = [
  'default',
  'success',
  'info',
  'warning',
  'destructive',
] as const;

export type AlertVariant = (typeof alertVariantValues)[number];

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  dismissible?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
  className?: string;
}
