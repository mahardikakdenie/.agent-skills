'use client';

import { clsx } from 'clsx';
import * as React from 'react';

import { Box } from '../Box';

export const Card = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <Box
      ref={ref}
      className={clsx(
        'bg-card text-card-foreground rounded-lg border border-gray-300 shadow-sm transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-[var(--color-primary-20)] focus-within:ring-offset-2 focus-within:ring-offset-white',
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <Box ref={ref} className={clsx('flex flex-col space-y-1.5 p-6', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<'h3'>>(
  ({ className, ...props }, ref) => (
    <Box
      as="h3"
      ref={ref}
      className={clsx('text-2xl leading-none font-semibold tracking-tight', className)}
      {...props}
    />
  ),
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<'p'>
>(({ className, ...props }, ref) => (
  <Box as="p" ref={ref} className={clsx('text-muted-foreground text-sm', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <Box ref={ref} className={clsx('p-6 pt-0', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <Box ref={ref} className={clsx('flex items-center p-6 pt-0', className)} {...props} />
  ),
);
CardFooter.displayName = 'CardFooter';
