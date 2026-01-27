"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { forwardRef, type HTMLAttributes } from "react";
import { Box } from "../Box";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 text-sm transition-colors [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-current [&>svg~*]:pl-8 [&>svg+*]:translate-y-[-2px]",
  {
    variants: {
      variant: {
        default: "border-gray-200 bg-white text-gray-900",
        info: "border-[var(--color-primary-20)] bg-[var(--color-primary-10)] text-[var(--color-primary-80)]",
        success: "border-green-200 bg-green-50 text-green-900",
        warning:
          "border-[var(--color-warning-40)] bg-[var(--color-warning-10)] text-[var(--color-warning-100)]",
        danger:
          "border-[var(--color-danger-20)] bg-[var(--color-danger-10)] text-[var(--color-danger-80)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        role="alert"
        className={clsx(alertVariants({ variant }), className)}
        {...props}
      />
    );
  },
);

Alert.displayName = "Alert";

export const AlertTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <Box as="h5"
      ref={ref}
      className={clsx("mb-1 font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
});

AlertTitle.displayName = "AlertTitle";

export const AlertDescription = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <Box
      ref={ref}
      className={clsx("text-sm leading-relaxed text-current/90", className)}
      {...props}
    />
  );
});

AlertDescription.displayName = "AlertDescription";

export { alertVariants };

