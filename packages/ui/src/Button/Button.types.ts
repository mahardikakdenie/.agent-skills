import type * as React from 'react';

export const buttonVariantValues = [
  'default',
  'primary',
  'secondary',
  'destructive',
  'outline',
  'ghost',
  'link',
  'warning',
] as const;

export const buttonSizeValues = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export type ButtonVariant = (typeof buttonVariantValues)[number];
export type ButtonSize = (typeof buttonSizeValues)[number];

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}