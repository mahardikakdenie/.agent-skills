"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { forwardRef, type HTMLAttributes } from "react";
import { Box } from "../Box";

const badgeVariants = cva(
  // Base styles
  "inline-flex items-center gap-1 rounded-full border font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-60)] focus-visible:ring-[var(--color-primary)]",
        secondary:
          "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500",
        danger:
          "border-transparent bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger-60)] focus-visible:ring-[var(--color-danger)]",
        warning:
          "border-transparent bg-[var(--color-warning)] text-[var(--color-warning-100)] hover:bg-[var(--color-warning-50)] focus-visible:ring-[var(--color-warning-60)]",
        outline:
          "border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-400",
      },
      size: {
        sm: "h-5 px-2 text-[11px]",
        md: "h-6 px-2.5 text-xs",
        lg: "h-7 px-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        className={clsx(badgeVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";

export { badgeVariants };
