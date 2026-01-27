"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

const switchTrackVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-gray-200",
  {
    variants: {
      variant: {
        default:
          "data-[state=checked]:bg-[var(--color-primary)] focus-visible:ring-[var(--color-primary)]",
        danger:
          "data-[state=checked]:bg-[var(--color-danger)] focus-visible:ring-[var(--color-danger)]",
      },
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

const switchThumbVariants = cva(
  "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200",
  {
    variants: {
      size: {
        sm: "h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        md: "h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        lg: "h-6 w-6 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type SwitchRootProps = ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>;

export interface SwitchProps
  extends SwitchRootProps,
    VariantProps<typeof switchTrackVariants> {
  thumbClassName?: string;
}

export const Switch = forwardRef<ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, thumbClassName, variant, size, ...props }, ref) => {
    return (
      <SwitchPrimitive.Root
        ref={ref}
        className={clsx(switchTrackVariants({ variant, size }), className)}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={clsx(switchThumbVariants({ size }), thumbClassName)}
        />
      </SwitchPrimitive.Root>
    );
  },
);

Switch.displayName = "Switch";

export { switchThumbVariants, switchTrackVariants };
