import * as SelectPrimitive from '@radix-ui/react-select';
import * as React from 'react';
import { Check, ChevronDown, ChevronUp, LoaderCircle, X } from 'lucide-react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import {
  selectActionButtonVariants,
  selectContentLabelVariants,
  selectContentVariants,
  selectControlVariants,
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
import type {
  SelectContentProps,
  SelectGroupProps,
  SelectItemProps,
  SelectLabelProps,
  SelectProps,
  SelectScrollDownButtonProps,
  SelectScrollUpButtonProps,
  SelectSeparatorProps,
  SelectTriggerProps,
  SelectValueProps,
} from './Select.types';

function normalizeSelectValue(value: string | undefined): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function resolveSelectRootValue(value: string | undefined): string {
  // Radix reserves the empty string to return the trigger to its placeholder state.
  return value ?? '';
}

function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(node);
        continue;
      }

      if (ref) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    }
  };
}

interface SelectContextValue {
  size: NonNullable<SelectProps['size']>;
  disabled: boolean;
  invalid: boolean;
  loading: boolean;
  triggerId: string;
  describedBy?: string;
  labelledBy?: string;
  showClearButton: boolean;
  setTriggerNode: (node: HTMLButtonElement | null) => void;
  onClear: () => void;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext(componentName: string) {
  const context = React.useContext(SelectContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Select.`);
  }

  return context;
}

function renderSelectOptionLabel(option: { label: string }) {
  return option.label;
}

/**
 * Shared static single-select primitive for non-searchable option sets.
 *
 * It supports both the normalized flat `options` API and the Radix-style
 * compound surface (`SelectTrigger`, `SelectContent`, `SelectItem`, etc.)
 * required for migration-safe compatibility with legacy consumers.
 */
export const Select = React.forwardRef<HTMLButtonElement, SelectProps>((selectProps, ref) => {
  const {
    value,
    defaultValue,
    onValueChange,
    options,
    children,
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

  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
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

  const handleClear = React.useCallback(() => {
    if (!isControlled) {
      setSelectedValue(undefined);
    }

    onValueChange?.(undefined);
    triggerRef.current?.focus();
  }, [isControlled, onValueChange]);

  const contextValue = React.useMemo<SelectContextValue>(
    () => ({
      size,
      disabled: interactiveDisabled,
      invalid,
      loading,
      triggerId,
      describedBy,
      labelledBy,
      showClearButton,
      setTriggerNode: (node) => {
        triggerRef.current = node;
      },
      onClear: handleClear,
    }),
    [
      describedBy,
      interactiveDisabled,
      invalid,
      labelledBy,
      loading,
      showClearButton,
      size,
      triggerId,
      handleClear,
    ],
  );

  const renderedChildren =
    children ??
    (options ? (
      <>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
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
                      {renderSelectOptionLabel(option)}
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
        </SelectContent>
      </>
    ) : null);

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
        <SelectContext.Provider value={contextValue}>{renderedChildren}</SelectContext.Provider>
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

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, id, 'aria-describedby': ariaDescribedBy, 'aria-labelledby': ariaLabelledBy, ...props }, ref) => {
    const context = useSelectContext('SelectTrigger');
    const composedRef = composeRefs(ref, context.setTriggerNode);
    const describedBy = [ariaDescribedBy, context.describedBy].filter(Boolean).join(' ') || undefined;
    const labelledBy = [ariaLabelledBy, context.labelledBy].filter(Boolean).join(' ') || undefined;

    return (
      <Box data-slot="select-control" className={selectControlVariants()}>
        <SelectPrimitive.Trigger
          ref={composedRef}
          id={id ?? context.triggerId}
          aria-describedby={describedBy}
          aria-labelledby={labelledBy}
          aria-invalid={context.invalid || undefined}
          aria-busy={context.loading || undefined}
          asChild
          {...props}
        >
          <Box
            as="button"
            type="button"
            data-slot="select-trigger"
            className={cn(
              selectTriggerVariants({
                size: context.size,
                invalid: context.invalid,
                disabled: context.disabled,
                clearable: context.showClearButton,
              }),
              className,
            )}
          >
            {children}
            {context.loading ? (
              <Box
                as="span"
                data-slot="select-spinner"
                aria-hidden="true"
                className={selectIconVariants({ size: context.size })}
              >
                <LoaderCircle className="animate-spin" />
              </Box>
            ) : !context.showClearButton ? (
              <SelectPrimitive.Icon asChild>
                <Box
                  as="span"
                  data-slot="select-icon"
                  aria-hidden="true"
                  className={selectIconVariants({ size: context.size })}
                >
                  <ChevronDown />
                </Box>
              </SelectPrimitive.Icon>
            ) : null}
          </Box>
        </SelectPrimitive.Trigger>

        {context.showClearButton ? (
          <Box
            as="button"
            type="button"
            aria-label="Clear selection"
            className={cn(selectActionButtonVariants({ size: context.size }), 'touch-manipulation')}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            onClick={context.onClear}
          >
            <X aria-hidden="true" />
          </Box>
        ) : null}
      </Box>
    );
  },
);

SelectTrigger.displayName = 'SelectTrigger';

export const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.Value
      ref={ref}
      data-slot="select-value"
      className={cn(selectValueVariants(), className)}
      {...props}
    />
  ),
);

SelectValue.displayName = 'SelectValue';

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, position = 'popper', align = 'start', sideOffset = 6, collisionPadding = 12, ...props }, ref) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        sticky="partial"
        asChild
        {...props}
      >
        <Box data-slot="select-content" className={cn(selectContentVariants(), className)}>
          <SelectScrollUpButton />

          <SelectPrimitive.Viewport asChild>
            <Box data-slot="select-viewport" className={selectViewportVariants()}>
              {children}
            </Box>
          </SelectPrimitive.Viewport>

          <SelectScrollDownButton />
        </Box>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  ),
);

SelectContent.displayName = 'SelectContent';

export const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(({ children, ...props }, ref) => (
  <SelectPrimitive.Group ref={ref} {...props}>
    {children}
  </SelectPrimitive.Group>
));

SelectGroup.displayName = 'SelectGroup';

export const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Label ref={ref} asChild {...props}>
      <Box data-slot="select-content-label" className={cn(selectContentLabelVariants(), className)}>
        {children}
      </Box>
    </SelectPrimitive.Label>
  ),
);

SelectLabel.displayName = 'SelectLabel';

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, ...props }, ref) => {
    const context = useSelectContext('SelectItem');

    return (
      <SelectPrimitive.Item ref={ref} asChild {...props}>
        <Box
          data-slot="select-item"
          className={cn(selectItemVariants({ size: context.size }), className)}
        >
          <SelectPrimitive.ItemText asChild>
            <Box as="span" data-slot="select-item-text" className={selectItemTextVariants()}>
              {children}
            </Box>
          </SelectPrimitive.ItemText>

          <SelectPrimitive.ItemIndicator asChild>
            <Box
              as="span"
              data-slot="select-item-indicator"
              className={selectItemIndicatorVariants({ size: context.size })}
            >
              <Check aria-hidden="true" />
            </Box>
          </SelectPrimitive.ItemIndicator>
        </Box>
      </SelectPrimitive.Item>
    );
  },
);

SelectItem.displayName = 'SelectItem';

export const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.Separator ref={ref} asChild {...props}>
      <Box
        data-slot="select-separator"
        className={cn('mx-1 my-1 h-px bg-border', className)}
      />
    </SelectPrimitive.Separator>
  ),
);

SelectSeparator.displayName = 'SelectSeparator';

export const SelectScrollUpButton = React.forwardRef<HTMLDivElement, SelectScrollUpButtonProps>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollUpButton ref={ref} asChild {...props}>
      <Box data-slot="select-scroll-up" className={cn(selectScrollButtonVariants(), className)}>
        <ChevronUp aria-hidden="true" className="h-4 w-4" />
      </Box>
    </SelectPrimitive.ScrollUpButton>
  ),
);

SelectScrollUpButton.displayName = 'SelectScrollUpButton';

export const SelectScrollDownButton = React.forwardRef<HTMLDivElement, SelectScrollDownButtonProps>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollDownButton ref={ref} asChild {...props}>
      <Box data-slot="select-scroll-down" className={cn(selectScrollButtonVariants(), className)}>
        <ChevronDown aria-hidden="true" className="h-4 w-4" />
      </Box>
    </SelectPrimitive.ScrollDownButton>
  ),
);

SelectScrollDownButton.displayName = 'SelectScrollDownButton';
