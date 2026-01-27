"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Box } from "../Box";

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-60)] focus-visible:ring-[var(--color-primary)]",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500",
        danger:
          "bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger-60)] focus-visible:ring-[var(--color-danger)]",
        outline:
          "border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-10)] focus-visible:ring-[var(--color-primary)]",
        ghost:
          "text-[var(--color-primary)] hover:bg-[var(--color-primary-10)] focus-visible:ring-[var(--color-primary)]",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-base",
        lg: "h-13 px-7 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading, disabled, children, ...props },
    ref,
  ) => {
    return (
      <Box
        as="button"
        ref={ref}
        className={clsx(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <Box
            as="svg"
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <Box
              as="circle"
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <Box
              as="path"
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </Box>
        )}
        {children}
      </Box>
    );
  },
);

Button.displayName = "Button";
