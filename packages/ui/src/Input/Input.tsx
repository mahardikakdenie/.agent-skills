"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

const inputVariants = cva(
  // Base styles
  "w-full rounded-lg border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]",
        error:
          "border-[var(--color-danger)] bg-white text-gray-900 placeholder:text-gray-400 focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]",
        success:
          "border-green-500 bg-white text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500",
      },
      size: {
        sm: "h-9 text-sm",
        md: "h-11 text-base",
        lg: "h-13 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface InputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size = "md", leftIcon, rightIcon, ...props }, ref) => {
    const hasLeftIcon = !!leftIcon;
    const hasRightIcon = !!rightIcon;

    // Determine padding based on icon presence
    const paddingClass = clsx({
      // Left padding
      "pl-10": hasLeftIcon && size === "sm",
      "pl-11": hasLeftIcon && size === "md",
      "pl-12": hasLeftIcon && size === "lg",
      "pl-3": !hasLeftIcon && size === "sm",
      "pl-4": !hasLeftIcon && size === "md",
      "pl-5": !hasLeftIcon && size === "lg",
      // Right padding
      "pr-10": hasRightIcon && size === "sm",
      "pr-11": hasRightIcon && size === "md",
      "pr-12": hasRightIcon && size === "lg",
      "pr-3": !hasRightIcon && size === "sm",
      "pr-4": !hasRightIcon && size === "md",
      "pr-5": !hasRightIcon && size === "lg",
    });

    // Icon wrapper size based on input size
    const iconWrapperSize = clsx("flex items-center justify-center shrink-0", {
      "icon-sm": size === "sm",
      "icon-md": size === "md",
      "icon-lg": size === "lg",
    });

    return (
      <div className="relative w-full">
        {leftIcon && (
          <div
            className={clsx(
              "absolute left-3 top-0 flex h-full items-center text-gray-400",
              {
                "text-[var(--color-danger)]": variant === "error",
                "text-green-500": variant === "success",
              },
            )}
          >
            <div className={iconWrapperSize}>{leftIcon}</div>
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            inputVariants({ variant, size }),
            paddingClass,
            className,
          )}
          {...props}
        />
        {rightIcon && (
          <div
            className={clsx(
              "absolute right-3 top-0 flex h-full items-center text-gray-400",
              {
                "text-[var(--color-danger)]": variant === "error",
                "text-green-500": variant === "success",
              },
            )}
          >
            <div className={iconWrapperSize}>{rightIcon}</div>
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
