import type * as React from 'react';

import {
  inputVariantValues,
  type InputVariant,
} from '../Input/Input.types';

export const otpInputSizeValues = ['sm', 'md', 'lg'] as const;
export const otpInputVariantValues = inputVariantValues;

export type OtpInputSize = (typeof otpInputSizeValues)[number];

export interface OtpInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  value?: string;
  onValueChange?: (value: string) => void;
  length?: number;
  variant?: InputVariant;
  size?: OtpInputSize;
  disabled?: boolean;
  error?: string | boolean;
  autoFocus?: boolean;
  className?: string;
}
