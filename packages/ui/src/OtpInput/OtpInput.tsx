import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import {
  otpInputFieldVariants,
  otpInputGroupVariants,
  otpInputMessageVariants,
  otpInputSlotVariants,
  otpInputStatusVariants,
} from './OtpInput.variants';
import type { OtpInputProps } from './OtpInput.types';

const DEFAULT_LENGTH = 6;

function sanitizeOtpDigits(value: string | undefined, maxLength: number) {
  return String(value ?? '')
    .replace(/\D/g, '')
    .slice(0, maxLength);
}

function getOtpCharacters(value: string, length: number) {
  return Array.from({ length }, (_, index) => value[index] ?? '');
}

function mergeOtpCharacters(
  baseValue: string,
  startIndex: number,
  nextDigits: string,
  length: number,
) {
  const characters = getOtpCharacters(baseValue, length);

  nextDigits.split('').forEach((digit, offset) => {
    const targetIndex = startIndex + offset;

    if (targetIndex < length) {
      characters[targetIndex] = digit;
    }
  });

  return characters.join('');
}

function replaceOtpCharacter(baseValue: string, index: number, nextDigit: string, length: number) {
  const characters = getOtpCharacters(baseValue, length);
  characters[index] = nextDigit;
  return characters.join('');
}

/**
 * Shared segmented one-time-password field with numeric sanitization,
 * keyboard navigation, whole-code paste support, and accessible inline
 * validation wiring.
 */
export const OtpInput = React.forwardRef<HTMLDivElement, OtpInputProps>(
  (
    {
      value,
      onValueChange,
      length = DEFAULT_LENGTH,
      variant = 'default',
      size = 'md',
      disabled = false,
      error = false,
      autoFocus = false,
      className,
      id,
      role,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const resolvedLength = Number.isFinite(length)
      ? Math.max(1, Math.floor(length))
      : DEFAULT_LENGTH;
    const generatedId = React.useId();
    const rootId = id ?? `otp-input-${generatedId}`;
    const statusId = `${rootId}-status`;
    const errorId = typeof error === 'string' ? `${rootId}-error` : undefined;
    const hasError = Boolean(error);
    const isControlled = value !== undefined;
    const normalizedControlledValue = sanitizeOtpDigits(value, resolvedLength);
    const [internalValue, setInternalValue] = React.useState(() =>
      sanitizeOtpDigits(value, resolvedLength),
    );
    const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);
    const slotRefs = React.useRef<Array<HTMLInputElement | null>>([]);
    const currentValue = isControlled ? normalizedControlledValue : internalValue;
    const characters = getOtpCharacters(currentValue, resolvedLength);
    const activeIndex = React.useMemo(() => {
      if (focusedIndex !== null) {
        return null;
      }

      const firstEmptyIndex = characters.findIndex((character) => character === '');
      return firstEmptyIndex === -1 ? resolvedLength - 1 : firstEmptyIndex;
    }, [characters, focusedIndex, resolvedLength]);
    const enteredCount = characters.filter(Boolean).length;
    const statusMessage =
      enteredCount === resolvedLength
        ? `Code complete. ${resolvedLength} of ${resolvedLength} digits entered.`
        : `${enteredCount} of ${resolvedLength} digits entered.`;
    const describedBy = [ariaDescribedBy, statusId, errorId].filter(Boolean).join(' ') || undefined;

    React.useEffect(() => {
      if (!isControlled) {
        setInternalValue((previousValue) => sanitizeOtpDigits(previousValue, resolvedLength));
      }
    }, [isControlled, resolvedLength]);

    React.useEffect(() => {
      if (!autoFocus || disabled) {
        return;
      }

      const firstEmptyIndex = characters.findIndex((character) => character === '');
      const targetIndex = firstEmptyIndex === -1 ? resolvedLength - 1 : firstEmptyIndex;

      const frame = window.requestAnimationFrame(() => {
        const target = slotRefs.current[targetIndex];
        target?.focus();
        target?.select();
      });

      return () => {
        window.cancelAnimationFrame(frame);
      };
    }, [autoFocus, characters, disabled, resolvedLength]);

    const focusSlot = (targetIndex: number) => {
      const clampedIndex = Math.max(0, Math.min(targetIndex, resolvedLength - 1));
      const target = slotRefs.current[clampedIndex];

      if (!target) {
        return;
      }

      target.focus();
      target.select();
    };

    const commitValue = (nextValue: string) => {
      const normalizedValue = sanitizeOtpDigits(nextValue, resolvedLength);

      if (!isControlled) {
        setInternalValue(normalizedValue);
      }

      onValueChange?.(normalizedValue);
      return normalizedValue;
    };

    const handleSlotChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const nextDigits = sanitizeOtpDigits(event.currentTarget.value, resolvedLength - index);

      if (!nextDigits) {
        commitValue(replaceOtpCharacter(currentValue, index, '', resolvedLength));
        return;
      }

      const nextValue =
        nextDigits.length === 1
          ? replaceOtpCharacter(currentValue, index, nextDigits, resolvedLength)
          : mergeOtpCharacters(currentValue, index, nextDigits, resolvedLength);

      commitValue(nextValue);

      const lastChangedIndex = Math.min(index + nextDigits.length - 1, resolvedLength - 1);
      focusSlot(lastChangedIndex === resolvedLength - 1 ? lastChangedIndex : lastChangedIndex + 1);
    };

    const handleSlotKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (event.key === 'Backspace') {
        event.preventDefault();

        if (characters[index]) {
          commitValue(replaceOtpCharacter(currentValue, index, '', resolvedLength));
          focusSlot(index);
          return;
        }

        if (index > 0) {
          commitValue(replaceOtpCharacter(currentValue, index - 1, '', resolvedLength));
          focusSlot(index - 1);
        }

        return;
      }

      if (event.key === 'Delete') {
        event.preventDefault();
        commitValue(replaceOtpCharacter(currentValue, index, '', resolvedLength));
        focusSlot(index);
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        focusSlot(index - 1);
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        focusSlot(index + 1);
        return;
      }

      if (event.key === 'Home') {
        event.preventDefault();
        focusSlot(0);
        return;
      }

      if (event.key === 'End') {
        event.preventDefault();
        focusSlot(resolvedLength - 1);
      }
    };

    const handleSlotPaste = (event: React.ClipboardEvent<HTMLInputElement>, index: number) => {
      const pastedDigits = sanitizeOtpDigits(event.clipboardData.getData('text'), resolvedLength);

      if (!pastedDigits) {
        return;
      }

      event.preventDefault();

      const startIndex = pastedDigits.length >= resolvedLength ? 0 : index;
      const nextValue = mergeOtpCharacters(currentValue, startIndex, pastedDigits, resolvedLength);

      commitValue(nextValue);

      const lastChangedIndex = Math.min(
        startIndex + pastedDigits.length - 1,
        resolvedLength - 1,
      );

      focusSlot(lastChangedIndex);
    };

    return (
      <Box
        {...props}
        ref={ref}
        id={rootId}
        role={role ?? 'group'}
        aria-label={ariaLabel ?? 'One-time password input'}
        aria-invalid={ariaInvalid ?? (hasError || undefined)}
        data-slot="otp-input"
        data-complete={enteredCount === resolvedLength ? 'true' : undefined}
        data-disabled={disabled ? 'true' : undefined}
        className={cn(otpInputFieldVariants(), className)}
      >
        <Box data-slot="otp-input-group" className={otpInputGroupVariants()}>
          {characters.map((character, index) => (
            <Box
              as="input"
              key={`${rootId}-slot-${index}`}
              ref={(element: HTMLInputElement | null) => {
                slotRefs.current[index] = element;
              }}
              value={character}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              enterKeyHint={index === resolvedLength - 1 ? 'done' : 'next'}
              disabled={disabled}
              maxLength={1}
              aria-label={`Digit ${index + 1} of ${resolvedLength}`}
              aria-invalid={hasError || undefined}
              aria-describedby={describedBy}
              data-slot="otp-input-slot"
              data-filled={character ? 'true' : undefined}
              className={otpInputSlotVariants({
                variant,
                size,
                invalid: hasError,
                filled: Boolean(character),
                active: activeIndex === index,
                disabled,
              })}
              onChange={(event) => {
                handleSlotChange(event, index);
              }}
              onKeyDown={(event) => {
                handleSlotKeyDown(event, index);
              }}
              onPaste={(event) => {
                handleSlotPaste(event, index);
              }}
              onFocus={(event) => {
                setFocusedIndex(index);
                event.currentTarget.select();
              }}
              onBlur={() => {
                setFocusedIndex((currentIndex) => (currentIndex === index ? null : currentIndex));
              }}
            />
          ))}
        </Box>

        <Box
          as="p"
          id={statusId}
          aria-live="polite"
          data-slot="otp-input-status"
          className={otpInputStatusVariants()}
        >
          {statusMessage}
        </Box>

        {typeof error === 'string' ? (
          <Box
            as="p"
            id={errorId}
            role="alert"
            data-slot="otp-input-message"
            className={otpInputMessageVariants()}
          >
            {error}
          </Box>
        ) : null}
      </Box>
    );
  },
);

OtpInput.displayName = 'OtpInput';

