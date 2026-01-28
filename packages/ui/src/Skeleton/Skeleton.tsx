'use client';

import { clsx } from 'clsx';
import * as React from 'react';

import { Box } from '../Box';

export const Skeleton = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <Box ref={ref} className={clsx('bg-gray-200 animate-pulse rounded-md', className)} {...props} />
  ),
);
Skeleton.displayName = 'Skeleton';
