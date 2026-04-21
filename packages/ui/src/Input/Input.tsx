import * as React from 'react';
import { LoaderCircle, X } from 'lucide-react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import {
  inputActionButtonVariants,
  inputAffixVariants,
  inputControlVariants,
  inputElementVariants,
  inputFieldVariants,
  inputHelperTextVariants,
  inputLabelVariants,
  inputMessageVariants,
} from './Input.variants';
import type { InputMode, InputProps } from './Input.types';

const inputTypeMap: Record<InputMode, React.HTMLInputTypeAttribute> = {
  text: 'text',
  email: 'email',
  phone: 'tel',
  currency: 'text',
  number: 'number',
  password: 'password',
};

const nativeInputModeMap: Record<InputMode, React.HTMLAttributes<HTMLInputElement>['inputMode']> = {
  text: undefined,
  email: 'email',
  phone: 'tel',
  currency: 'decimal',
  number: 'numeric',
  password: undefined,
};

/**
 * Shared text-entry primitive with optional label, helper text, validation
 * feedback, affixes, loading treatment, and clear affordance.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'outline',
      size = 'md',
      inputMode = 'text',
      error = false,
      loading = false,
      disabled = false,
      required = false,
      label,
      helperText,
      leftIcon,
      rightIcon,
      clearable = false,
      fieldClassName,
      inputClassName,
      className,
      id,
      type,
      value,
      defaultValue,
      autoComplete,
      spellCheck,
      readOnly = false,
      onChange,
      onValueChange,
      'aria-describedby': ariaDescribedBy,
      'aria-labelledby': ariaLabelledBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? `input-${generatedId}`;
    const labelId = label ? `${inputId}-label` : undefined;
    const helperTextId = helperText ? `${inputId}-helper-text` : undefined;
    const errorId = typeof error === 'string' ? `${inputId}-error` : undefined;
    const describedBy =
      [ariaDescribedBy, helperTextId, errorId].filter(Boolean).join(' ') || undefined;
    const labelledBy = [ariaLabelledBy, labelId].filter(Boolean).join(' ') || undefined;
    const hasError = Boolean(error);
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState(() => {
      if (defaultValue == null) {
        return '';
      }

      return String(defaultValue);
    });
    const inputRef = React.useRef<HTMLInputElement>(null);
    const currentValue = isControlled ? String(value ?? '') : uncontrolledValue;
    const resolvedType = type ?? inputTypeMap[inputMode];
    const resolvedInputMode = nativeInputModeMap[inputMode];
    const resolvedAutoComplete =
      autoComplete ??
      (inputMode === 'email'
        ? 'email'
        : inputMode === 'phone'
          ? 'tel'
          : inputMode === 'password'
            ? 'current-password'
            : undefined);
    const resolvedSpellCheck = spellCheck ?? (inputMode === 'text' ? undefined : false);
    const showClearButton =
      clearable &&
      !loading &&
      !disabled &&
      !readOnly &&
      resolvedType !== 'file' &&
      currentValue.length > 0;
    const labelTone = hasError && !disabled ? 'destructive' : disabled ? 'muted' : 'default';
    const derivedInputClassName = React.useMemo(() => {
      if (!className) {
        return undefined;
      }

      const forwardedUtilityTokens = className
        .split(/\s+/)
        .filter((token) => token.includes('placeholder:') || token.includes('file:'))
        .join(' ');

      return forwardedUtilityTokens || undefined;
    }, [className]);
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      if (!isControlled) {
        setUncontrolledValue(event.target.value);
      }

      onChange?.(event);
      onValueChange?.(event.target.value);
    };

    const handleClear = () => {
      const element = inputRef.current;

      if (!element) {
        return;
      }

      const valueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set;

      valueSetter?.call(element, '');
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.focus();
    };

    return (
      <Box data-slot="input-field" className={cn(inputFieldVariants(), fieldClassName)}>
        {label ? (
          <Box
            as="label"
            id={labelId}
            htmlFor={inputId}
            className={inputLabelVariants({ tone: labelTone })}
          >
            {label}
            {required ? (
              <Box as="span" aria-hidden="true" className="ml-1 text-destructive">
                *
              </Box>
            ) : null}
          </Box>
        ) : null}

        <Box
          data-slot="input-control"
          aria-busy={loading || undefined}
          className={cn(
            inputControlVariants({ variant, size, invalid: hasError, disabled }),
            className,
          )}
        >
          {leftIcon ? (
            <Box
              data-slot="input-left-icon"
              className={inputAffixVariants({ size })}
            >
              {leftIcon}
            </Box>
          ) : null}

          <Box
            as="input"
            ref={inputRef}
            id={inputId}
            type={resolvedType}
            inputMode={resolvedInputMode}
            autoComplete={resolvedAutoComplete}
            spellCheck={resolvedSpellCheck}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            aria-labelledby={labelledBy}
            className={cn(inputElementVariants({ size }), derivedInputClassName, inputClassName)}
            onChange={handleChange}
            {...props}
          />

          {showClearButton ? (
            <Box
              as="button"
              type="button"
              aria-label="Clear input"
              className={inputActionButtonVariants({ size })}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={handleClear}
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </Box>
          ) : null}

          {loading ? (
            <Box
              as="span"
              data-slot="input-spinner"
              aria-hidden="true"
              className={inputAffixVariants({ size })}
            >
              <LoaderCircle className="h-4 w-4 animate-spin" />
            </Box>
          ) : rightIcon ? (
            <Box
              as="span"
              data-slot="input-right-icon"
              aria-hidden="true"
              className={inputAffixVariants({ size })}
            >
              {rightIcon}
            </Box>
          ) : null}
        </Box>

        {helperText ? (
          <Box as="p" id={helperTextId} className={inputHelperTextVariants()}>
            {helperText}
          </Box>
        ) : null}

        {typeof error === 'string' ? (
          <Box as="p" id={errorId} role="alert" className={inputMessageVariants()}>
            {error}
          </Box>
        ) : null}
      </Box>
    );
  },
);

Input.displayName = 'Input';
