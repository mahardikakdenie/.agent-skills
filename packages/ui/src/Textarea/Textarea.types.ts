import type * as React from 'react';

import {
  fieldVariantValues,
  type FieldVariant,
  type FieldVariantAlias,
} from '../utils/field-variants';

export const textareaVariantValues = fieldVariantValues;
export const textareaSizeValues = ['xs', 'sm', 'md', 'lg'] as const;

export type TextareaVariant = FieldVariant | FieldVariantAlias;
export type TextareaSize = (typeof textareaSizeValues)[number];

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'size'> {
  variant?: TextareaVariant;
  size?: TextareaSize;
  error?: string | boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  helperText?: string;
  clearable?: boolean;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onValueChange?: (value: string) => void;
  fieldClassName?: string;
  textareaClassName?: string;
  className?: string;
}
