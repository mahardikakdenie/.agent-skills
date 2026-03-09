import { Slot, Slottable } from '@radix-ui/react-slot';
import * as React from 'react';
import { LoaderCircle } from 'lucide-react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import type { ButtonProps } from './Button.types';
import { buttonVariants } from './Button.variants';

/**
 * Shared action primitive for calls to action, toolbar actions, and submit
 * triggers. Supports loading, icon slots, and polymorphic rendering via
 * `asChild` without coupling the package to routing libraries.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      loading = false,
      disabled = false,
      asChild = false,
      leftIcon,
      rightIcon,
      children,
      onClick,
      tabIndex,
      type,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const iconMarkup = loading ? (
      <Box data-slot="button-spinner" aria-hidden="true" className="shrink-0">
        <LoaderCircle className="h-4 w-4 animate-spin" />
      </Box>
    ) : null;

    const leadingMarkup = !loading && leftIcon ? (
      <Box data-slot="button-left-icon" aria-hidden="true" className="shrink-0">
        {leftIcon}
      </Box>
    ) : null;

    const trailingMarkup = !loading && rightIcon ? (
      <Box data-slot="button-right-icon" aria-hidden="true" className="shrink-0">
        {rightIcon}
      </Box>
    ) : null;

    const handleClick: React.MouseEventHandler<HTMLElement> = (event) => {
      if (asChild && isDisabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      onClick?.(event as React.MouseEvent<HTMLButtonElement>);
    };

    if (asChild) {
      return (
        <Slot
          ref={ref as React.Ref<HTMLElement>}
          data-slot="button"
          aria-busy={loading}
          aria-disabled={isDisabled || undefined}
          data-disabled={isDisabled ? 'true' : undefined}
          data-loading={loading ? 'true' : undefined}
          tabIndex={isDisabled ? -1 : tabIndex}
          className={cn(buttonVariants({ variant, size }), className)}
          onClick={handleClick}
          {...props}
        >
          {iconMarkup}
          {leadingMarkup}
          <Slottable>{children}</Slottable>
          {trailingMarkup}
        </Slot>
      );
    }

    return (
      <Box
        as="button"
        ref={ref}
        type={type}
        disabled={isDisabled}
        data-slot="button"
        aria-busy={loading}
        data-loading={loading ? 'true' : undefined}
        className={cn(buttonVariants({ variant, size }), className)}
        onClick={handleClick as React.MouseEventHandler<HTMLButtonElement>}
        tabIndex={tabIndex}
        {...props}
      >
        {iconMarkup}
        {leadingMarkup}
        {children}
        {trailingMarkup}
      </Box>
    );
  },
);

Button.displayName = 'Button';