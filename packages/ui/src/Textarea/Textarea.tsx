'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { forwardRef, type TextareaHTMLAttributes } from 'react';

import { Box } from '../Box';

const textareaVariants = cva(
  'w-full rounded-lg border font-medium leading-relaxed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]',
        error:
          'border-[var(--color-danger)] bg-white text-gray-900 placeholder:text-gray-400 focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]',
        success:
          'border-green-500 bg-white text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500',
      },
      size: {
        sm: 'min-h-24 px-3 py-2 text-sm',
        md: 'min-h-28 px-4 py-3 text-base',
        lg: 'min-h-36 px-5 py-4 text-lg',
      },
      resize: {
        none: 'resize-none',
        vertical: 'resize-y',
        both: 'resize',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      resize: 'vertical',
    },
  },
);

export interface TextareaProps
  extends
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, resize, rows = 4, ...props }, ref) => (
    <Box
      as="textarea"
      ref={ref}
      rows={rows}
      className={clsx(textareaVariants({ variant, size, resize }), className)}
      {...props}
    />
  ),
);

Textarea.displayName = 'Textarea';
