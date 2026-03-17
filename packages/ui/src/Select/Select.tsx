import * as SelectPrimitive from '@radix-ui/react-select';
import * as React from 'react';
import { Check, ChevronDown, ChevronUp, LoaderCircle, X } from 'lucide-react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import {
  selectActionButtonVariants,
  selectControlVariants,
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

function normalizeSelectValue(value: string | undefined): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function resolveSelectRootValue(value: string | undefined): string {
  // Radix reserves the empty string to return the trigger to its placeholder state.
  return value ?? '';
}

/**
 * Shared static single-select primitive for non-searchable option sets.
 * Radix owns the select semantics and keyboard behavior; Box owns the
 * authored DOM wrappers required by the shared Box-only policy.
 */
export const Select = React.forwardRef<HTMLButtonElement, SelectProps>((selectProps, ref) => {
  const {
    value,
    defaultValue,
    onValueChange,
    options,
    placeholder,
    size = 'md',
    disabled = false,
    loading = false,
    required = false,
    error = false,
    label,
    clearable = false,
    renderOption,
    className,
    open,
    onOpen,
    onClose,
    id,
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
    defaultOpen,
    ...props
  } = selectProps;

  const isControlled = Object.prototype.hasOwnProperty.call(selectProps, 'value');
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(() =>
    normalizeSelectValue(defaultValue),
  );

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const generatedId = React.useId();
  const triggerId = id ?? `select-${generatedId}`;
  const labelId = label ? `${triggerId}-label` : undefined;
  const errorId = typeof error === 'string' ? `${triggerId}-error` : undefined;
  const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined;
  const labelledBy = [ariaLabelledBy, labelId].filter(Boolean).join(' ') || undefined;
  const interactiveDisabled = disabled || loading;
  const invalid = Boolean(error);
  const labelTone = invalid && !interactiveDisabled ? 'destructive' : interactiveDisabled ? 'muted' : 'default';
  const currentValue = isControlled ? normalizeSelectValue(value) : selectedValue;
  const selectedOption = options.find((option) => option.value === currentValue);
  const showClearButton = clearable && !interactiveDisabled && currentValue !== undefined;

  React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };

  const handleValueChange = (nextValue: string) => {
    const normalizedValue = normalizeSelectValue(nextValue);

    if (!isControlled) {
      setSelectedValue(normalizedValue);
    }

    onValueChange?.(normalizedValue);
  };

  const handleClear = () => {
    if (!isControlled) {
      setSelectedValue(undefined);
    }

    onValueChange?.(undefined);
    triggerRef.current?.focus();
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
        value={resolveSelectRootValue(currentValue)}
        onValueChange={handleValueChange}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={handleOpenChange}
        disabled={interactiveDisabled}
        required={required}
        {...props}
      >
        <Box data-slot="select-control" className={selectControlVariants()}>
          <SelectPrimitive.Trigger
            ref={triggerRef}
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
              className={selectTriggerVariants({
                size,
                invalid,
                disabled: interactiveDisabled,
                clearable: showClearButton,
              })}
            >
              <Box
                as="span"
                data-slot="select-value"
                className={cn(
                  selectValueVariants(),
                  renderOption && !selectedOption ? 'text-muted-foreground' : undefined,
                )}
              >
                {renderOption ? selectedOption?.label ?? placeholder : <SelectPrimitive.Value placeholder={placeholder} />}
              </Box>

              {loading ? (
                <Box
                  as="span"
                  data-slot="select-spinner"
                  aria-hidden="true"
                  className={selectIconVariants({ size })}
                >
                  <LoaderCircle className="animate-spin" />
                </Box>
              ) : !showClearButton ? (
                <SelectPrimitive.Icon asChild>
                  <Box
                    as="span"
                    data-slot="select-icon"
                    aria-hidden="true"
                    className={selectIconVariants({ size })}
                  >
                    <ChevronDown />
                  </Box>
                </SelectPrimitive.Icon>
              ) : null}
            </Box>
          </SelectPrimitive.Trigger>

          {showClearButton ? (
            <Box
              as="button"
              type="button"
              aria-label="Clear selection"
              className={cn(selectActionButtonVariants({ size }), 'touch-manipulation')}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={handleClear}
            >
              <X aria-hidden="true" />
            </Box>
          ) : null}
        </Box>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            align="start"
            sideOffset={6}
            collisionPadding={12}
            sticky="partial"
            asChild
          >
            <Box data-slot="select-content" className={selectContentVariants()}>
              <SelectPrimitive.ScrollUpButton asChild>
                <Box data-slot="select-scroll-up" className={selectScrollButtonVariants()}>
                  <ChevronUp aria-hidden="true" className="h-4 w-4" />
                </Box>
              </SelectPrimitive.ScrollUpButton>

              <SelectPrimitive.Viewport asChild>
                <Box data-slot="select-viewport" className={selectViewportVariants()}>
                  {options.map((option) => {
                    const selected = option.value === currentValue;

                    return (
                      <SelectPrimitive.Item
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        asChild
                      >
                        <Box data-slot="select-item" className={selectItemVariants({ size })}>
                          <SelectPrimitive.ItemText asChild>
                            <Box
                              as="span"
                              data-slot="select-item-text"
                              className={cn(
                                selectItemTextVariants(),
                                renderOption ? 'sr-only' : undefined,
                              )}
                            >
                              {option.label}
                            </Box>
                          </SelectPrimitive.ItemText>

                          {renderOption ? (
                            <Box as="span" className={cn(selectItemTextVariants(), 'min-w-0 flex-1')}>
                              {renderOption(option, {
                                selected,
                                disabled: Boolean(option.disabled),
                              })}
                            </Box>
                          ) : null}

                          <SelectPrimitive.ItemIndicator asChild>
                            <Box
                              as="span"
                              data-slot="select-item-indicator"
                              className={selectItemIndicatorVariants({ size })}
                            >
                              <Check aria-hidden="true" />
                            </Box>
                          </SelectPrimitive.ItemIndicator>
                        </Box>
                      </SelectPrimitive.Item>
                    );
                  })}
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
});

Select.displayName = 'Select';
