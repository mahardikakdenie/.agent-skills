import { memo, useEffect, useEffectEvent, useState } from 'react';
import { Search } from 'react-feather';

import { Input } from '@repo/ui';

interface DebouncedSearchInputProps {
  value: string;
  placeholder: string;
  ariaLabel: string;
  onDebouncedChange: (value: string) => void;
  delay?: number;
  className?: string;
}

export const DebouncedSearchInput = memo(function DebouncedSearchInput({
  value,
  placeholder,
  ariaLabel,
  onDebouncedChange,
  delay = 300,
  className,
}: DebouncedSearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const emitDebouncedChange = useEffectEvent((nextValue: string) => {
    onDebouncedChange(nextValue);
  });

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (localValue === value) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      emitDebouncedChange(localValue);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delay, emitDebouncedChange, localValue, value]);

  return (
    <Input
      type="text"
      value={localValue}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onValueChange={setLocalValue}
      className={className}
      rightIcon={<Search aria-hidden="true" className="h-4 w-4 text-[#016da1]" />}
    />
  );
});
