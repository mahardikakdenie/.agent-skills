import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import { Label } from '../Label';
import type { TextareaProps } from './Textarea.types';
import {
  textareaActionButtonVariants,
  textareaControlVariants,
  textareaElementVariants,
  textareaFieldVariants,
  textareaHelperTextVariants,
  textareaMessageVariants,
} from './Textarea.variants';

/**
 * Shared multiline text-entry primitive with optional label, helper text,
 * validation feedback, and a clearable content affordance.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = 'outline',
      error = false,
      disabled = false,
      required = false,
      label,
      helperText,
      clearable = false,
      className,
      id,
      value,
      defaultValue,
      rows = 4,
      autoComplete,
      readOnly = false,
      onChange,
      onValueChange,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const textareaId = id ?? `textarea-${generatedId}`;
    const helperTextId = helperText ? `${textareaId}-helper-text` : undefined;
    const errorId = typeof error === 'string' ? `${textareaId}-error` : undefined;
    const describedBy =
      [ariaDescribedBy, helperTextId, errorId].filter(Boolean).join(' ') || undefined;
    const hasError = Boolean(error);
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState(() => {
      if (defaultValue == null) {
        return '';
      }

      return String(defaultValue);
    });
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const currentValue = isControlled ? String(value ?? '') : uncontrolledValue;
    const showClearButton = clearable && !disabled && !readOnly && currentValue.length > 0;
    const labelTone = hasError && !disabled ? 'destructive' : disabled ? 'muted' : 'default';

    React.useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
      if (!isControlled) {
        setUncontrolledValue(event.target.value);
      }

      onChange?.(event);
      onValueChange?.(event.target.value);
    };

    const handleClear = () => {
      const element = textareaRef.current;

      if (!element) {
        return;
      }

      const valueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value',
      )?.set;

      valueSetter?.call(element, '');
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.focus();
    };

    return (
      <Box data-slot="textarea-field" className={cn(textareaFieldVariants(), className)}>
        {label ? (
          <Label htmlFor={textareaId} required={required} disabled={disabled} tone={labelTone}>
            {label}
          </Label>
        ) : null}

        <Box
          data-slot="textarea-control"
          className={textareaControlVariants()}
        >
          <Box
            as="textarea"
            ref={textareaRef}
            id={textareaId}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            rows={rows}
            autoComplete={autoComplete ?? 'off'}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className={textareaElementVariants({
              variant,
              invalid: hasError,
              clearable: showClearButton,
            })}
            onChange={handleChange}
            {...props}
          />

          {showClearButton ? (
            <Box
              as="button"
              type="button"
              aria-label="Clear text"
              className={cn(textareaActionButtonVariants(), 'touch-manipulation')}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={handleClear}
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </Box>
          ) : null}
        </Box>

        {helperText ? (
          <Box as="p" id={helperTextId} className={textareaHelperTextVariants()}>
            {helperText}
          </Box>
        ) : null}

        {typeof error === 'string' ? (
          <Box as="p" id={errorId} role="alert" className={textareaMessageVariants()}>
            {error}
          </Box>
        ) : null}
      </Box>
    );
  },
);

Textarea.displayName = 'Textarea';
