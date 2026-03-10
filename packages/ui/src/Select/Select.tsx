import * as SelectPrimitive from '@radix-ui/react-select';
import * as React from 'react';
import { Check, ChevronDown, ChevronUp, LoaderCircle } from 'lucide-react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import {
  selectContentVariants,
  selectFieldVariants,
  selectIconVariants,
  selectItemIndicatorVariants,
  selectItemTextVariants,
  selectItemVariants,
  selectLabelVariants,
  selectMessageVariants,
  selectScrollButtonVariants,
  selectTriggerVariants,
  selectValueVariants,
  selectViewportVariants,
} from './Select.variants';
import type { SelectProps } from './Select.types';

/**
 * Shared static single-select primitive for non-searchable option sets.
 * Radix owns the select semantics and keyboard behavior; Box owns the
 * authored DOM wrappers required by the shared Box-only policy.
 */
export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      options,
      placeholder,
      disabled = false,
      loading = false,
      required = false,
      error = false,
      label,
      className,
      open,
      onOpen,
      onClose,
      id,
      'aria-describedby': ariaDescribedBy,
      'aria-labelledby': ariaLabelledBy,
      defaultOpen,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const triggerId = id ?? `select-${generatedId}`;
    const labelId = label ? `${triggerId}-label` : undefined;
    const errorId = typeof error === 'string' ? `${triggerId}-error` : undefined;
    const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined;
    const labelledBy = [ariaLabelledBy, labelId].filter(Boolean).join(' ') || undefined;
    const interactiveDisabled = disabled || loading;
    const invalid = Boolean(error);
    const labelTone = invalid && !interactiveDisabled ? 'destructive' : interactiveDisabled ? 'muted' : 'default';

    const handleOpenChange = (nextOpen: boolean) => {
      if (nextOpen) {
        onOpen?.();
      } else {
        onClose?.();
      }
    };

    return (
      <Box data-slot="select-field" className={cn(selectFieldVariants(), className)}>
        {label ? (
          <Box
            as="label"
            id={labelId}
            htmlFor={triggerId}
            className={selectLabelVariants({ tone: labelTone })}
          >
            {label}
            {required ? (
              <Box as="span" aria-hidden="true" className="ml-1 text-destructive">
                *
              </Box>
            ) : null}
          </Box>
        ) : null}

        <SelectPrimitive.Root
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={handleOpenChange}
          disabled={interactiveDisabled}
          required={required}
          {...props}
        >
          <SelectPrimitive.Trigger
            ref={ref}
            id={triggerId}
            aria-describedby={describedBy}
            aria-labelledby={labelledBy}
            aria-invalid={invalid || undefined}
            aria-busy={loading || undefined}
            asChild
          >
            <Box
              as="button"
              type="button"
              data-slot="select-trigger"
              className={selectTriggerVariants({ invalid, disabled: interactiveDisabled })}
            >
              <Box as="span" data-slot="select-value" className={selectValueVariants()}>
                <SelectPrimitive.Value placeholder={placeholder} />
              </Box>

              {loading ? (
                <Box as="span" data-slot="select-spinner" aria-hidden="true" className={selectIconVariants()}>
                  <LoaderCircle className="animate-spin" />
                </Box>
              ) : (
                <SelectPrimitive.Icon asChild>
                  <Box as="span" data-slot="select-icon" aria-hidden="true" className={selectIconVariants()}>
                    <ChevronDown />
                  </Box>
                </SelectPrimitive.Icon>
              )}
            </Box>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content position="popper" align="start" sideOffset={6} collisionPadding={12} sticky="partial" asChild>
              <Box data-slot="select-content" className={selectContentVariants()}>
                <SelectPrimitive.ScrollUpButton asChild>
                  <Box data-slot="select-scroll-up" className={selectScrollButtonVariants()}>
                    <ChevronUp aria-hidden="true" className="h-4 w-4" />
                  </Box>
                </SelectPrimitive.ScrollUpButton>

                <SelectPrimitive.Viewport asChild>
                  <Box data-slot="select-viewport" className={selectViewportVariants()}>
                    {options.map((option) => (
                      <SelectPrimitive.Item
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        asChild
                      >
                        <Box data-slot="select-item" className={selectItemVariants()}>
                          <Box
                            as="span"
                            data-slot="select-item-text"
                            className={selectItemTextVariants()}
                          >
                            <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                          </Box>

                          <SelectPrimitive.ItemIndicator asChild>
                            <Box
                              as="span"
                              data-slot="select-item-indicator"
                              className={selectItemIndicatorVariants()}
                            >
                              <Check aria-hidden="true" className="h-4 w-4" />
                            </Box>
                          </SelectPrimitive.ItemIndicator>
                        </Box>
                      </SelectPrimitive.Item>
                    ))}
                  </Box>
                </SelectPrimitive.Viewport>

                <SelectPrimitive.ScrollDownButton asChild>
                  <Box data-slot="select-scroll-down" className={selectScrollButtonVariants()}>
                    <ChevronDown aria-hidden="true" className="h-4 w-4" />
                  </Box>
                </SelectPrimitive.ScrollDownButton>
              </Box>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>

        {typeof error === 'string' ? (
          <Box as="p" id={errorId} role="alert" className={selectMessageVariants()}>
            {error}
          </Box>
        ) : null}
      </Box>
    );
  },
);

Select.displayName = 'Select';

