import { X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import type { AlertProps, AlertTone, AlertVariant } from './Alert.types';
import { alertVariants } from './Alert.variants';

const legacyAlertVariantToneMap = {
  default: 'default',
  success: 'success',
  info: 'info',
  warning: 'warning',
  destructive: 'destructive',
} as const satisfies Record<Exclude<AlertVariant, 'outline' | 'shadow'>, AlertTone>;

function resolveAlertPresentation(
  variant: AlertVariant | undefined,
  tone: AlertTone | undefined,
): {
  variant: 'outline' | 'shadow';
  tone: AlertTone;
} {
  if (!variant || variant === 'outline' || variant === 'shadow') {
    return {
      variant: variant ?? 'outline',
      tone: tone ?? 'default',
    };
  }

  return {
    variant: 'shadow',
    tone: tone ?? legacyAlertVariantToneMap[variant],
  };
}

const alertAccentClasses: Record<AlertTone, string> = {
  default: 'text-muted-foreground',
  success: 'text-success',
  info: 'text-info',
  warning: 'text-warning',
  destructive: 'text-destructive',
};

const alertTitleClasses: Record<AlertTone, string> = {
  default: 'text-foreground',
  success: 'text-success',
  info: 'text-info',
  warning: 'text-warning',
  destructive: 'text-destructive',
};

/**
 * Inline feedback surface for neutral, success, info, warning, and error states.
 *
 * The component remains app-agnostic by keeping dismissal controlled by the
 * caller and by accepting optional icon/content slots instead of importing
 * app-specific assets or orchestration logic.
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant,
      tone,
      title,
      description,
      children,
      dismissible = false,
      onClose,
      icon,
      role,
      'aria-live': ariaLive,
      'aria-atomic': ariaAtomic,
      ...props
    },
    ref,
  ) => {
    const resolvedPresentation = resolveAlertPresentation(variant, tone);
    const resolvedTone = resolvedPresentation.tone;
    const showDismissControl = dismissible && typeof onClose === 'function';
    const resolvedRole =
      role ?? (resolvedTone === 'warning' || resolvedTone === 'destructive' ? 'alert' : 'status');
    const resolvedAriaLive = ariaLive ?? (resolvedRole === 'alert' ? 'assertive' : 'polite');

    return (
      <Box
        ref={ref}
        role={resolvedRole}
        aria-live={resolvedAriaLive}
        aria-atomic={ariaAtomic ?? true}
        className={cn(
          alertVariants({
            variant: resolvedPresentation.variant,
            tone: resolvedTone,
            dismissible: showDismissControl,
          }),
          className,
        )}
        {...props}
      >
        <Box className="flex items-start gap-3">
          {icon ? (
            <Box
              aria-hidden="true"
              data-slot="alert-icon"
              className={cn('mt-0.5 shrink-0', alertAccentClasses[resolvedTone])}
            >
              {icon}
            </Box>
          ) : null}

          <Box data-slot="alert-content" className="min-w-0 flex-1 space-y-1">
            {title ? (
              <Box
                as="h5"
                data-slot="alert-title"
                className={cn(
                  'font-semibold leading-5 tracking-tight',
                  alertTitleClasses[resolvedTone],
                )}
              >
                {title}
              </Box>
            ) : null}

            {description ? (
              <Box as="p" className="leading-6 text-muted-foreground">
                {description}
              </Box>
            ) : null}

            {children ? <Box className="leading-6 text-muted-foreground">{children}</Box> : null}
          </Box>
        </Box>

        {showDismissControl ? (
          <Box
            as="button"
            type="button"
            aria-label="Dismiss alert"
            className={cn(
              'absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md',
              'transition-colors hover:bg-background/70',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'focus-visible:ring-offset-background motion-reduce:transition-none',
              alertAccentClasses[resolvedTone],
            )}
            onClick={onClose}
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </Box>
        ) : null}
      </Box>
    );
  },
);

Alert.displayName = 'Alert';
