import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import {
  cardContentVariants,
  cardDescriptionVariants,
  cardFooterVariants,
  cardHeaderVariants,
  cardRootVariants,
  cardTitleVariants,
} from './Card.variants';
import type {
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
} from './Card.types';

/**
 * Structural shared surface for grouped content, summary panels, and app-local
 * shells that need consistent spacing and token-driven card styling.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <Box ref={ref} data-slot="card" className={cn(cardRootVariants(), className)} {...props} />
));

Card.displayName = 'Card';

/**
 * Top section for card headings, descriptions, and light metadata.
 */
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <Box ref={ref} data-slot="card-header" className={cn(cardHeaderVariants(), className)} {...props} />
  ),
);

CardHeader.displayName = 'CardHeader';

/**
 * Semantic card heading rendered through `Box` to preserve the authored DOM policy.
 */
export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <Box
      as="h3"
      ref={ref}
      data-slot="card-title"
      className={cn(cardTitleVariants(), className)}
      {...props}
    />
  ),
);

CardTitle.displayName = 'CardTitle';

/**
 * Supporting copy for the card heading or panel context.
 */
export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <Box
      as="p"
      ref={ref}
      data-slot="card-description"
      className={cn(cardDescriptionVariants(), className)}
      {...props}
    />
  ),
);

CardDescription.displayName = 'CardDescription';

/**
 * Main body region for panel content.
 */
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <Box ref={ref} data-slot="card-content" className={cn(cardContentVariants(), className)} {...props} />
  ),
);

CardContent.displayName = 'CardContent';

/**
 * Trailing region for actions or supporting metadata after the content block.
 */
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <Box ref={ref} data-slot="card-footer" className={cn(cardFooterVariants(), className)} {...props} />
  ),
);

CardFooter.displayName = 'CardFooter';
