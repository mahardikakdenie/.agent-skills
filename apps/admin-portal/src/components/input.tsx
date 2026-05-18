import React, { useState } from 'react';

import { Box } from '@repo/ui';

import { primary, primaryDisabled } from '@/constants/app-common.const';
import { moneyFormatter, parseMoneyString } from '@/helpers/app.helper';
import SeeIcon from '@/images/see.icon';
import UnseeIcon from '@/images/unsee.icon';
import XCircleIcon from '@/images/x-circle.icon';

interface InputProps {
  value: string | number;
  type?: string;
  accept?: string;
  onChange?: (value: string | number) => void;
  onChangeFile?: (file: any) => void;
  onEnter?: (value: string | number) => void;
  onClear?: () => void;
  disabled?: boolean;
  withBorder?: boolean;
  isCurrency?: boolean;
  currency?: string;
  placeholder?: string;
  errorMessage?: string | null;
  icon?: React.ReactNode;
  max?: number;
  min?: number;
}

const Input: React.FC<InputProps> = ({
  value,
  type = 'text',
  onChange,
  onChangeFile,
  accept = '.csv',
  onEnter,
  disabled = false,
  withBorder = true,
  isCurrency = false,
  currency,
  max,
  min,
  placeholder,
  errorMessage,
  icon,
  onClear,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [typeCurrency, setTypeCurrency] = useState('number');
  const [forceType, setForceType] = useState('');
  const [isShow, setIsShow] = useState(false);
  const [count, setCount] = useState(0);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const newValue = event.target.value;

    if (isCurrency) {
      const parsedValue = parseMoneyString(newValue);
      if ((max !== undefined && parsedValue > max) || (min !== undefined && parsedValue < min)) {
        return;
      }

      if (newValue.length > 1 && newValue[0] === '0') setInputValue(newValue.slice(1));
      else setInputValue(newValue);

      if (onChange) onChange(newValue);
    } else {
      setInputValue(newValue);
      if (onChange) onChange(newValue);
    }
  };

  const handleOnChangeFile = (event: any) => {
    if (disabled) return;
    const file = event.target.files[0];
    setInputValue(event.target.value);
    if (onChangeFile) onChangeFile(file);
  };

  const handleOnKeyEnterDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (event.key === 'Enter' && onEnter) onEnter(inputValue);
  };

  const handleOnFocus = () => {
    if (isCurrency) {
      setTypeCurrency('number');
      setInputValue(parseMoneyString(inputValue.toString()));
    }
  };

  const handleOnBlur = () => {
    if (isCurrency) {
      setTypeCurrency('text');
      setInputValue(moneyFormatter(currency).format(Number(inputValue)));
    }
  };

  const clear = () => {
    if (disabled) return;
    setInputValue('');
    if (onChange) onChange('');
    if (onClear) onClear();
  };

  const togglePassword = (value: string) => {
    setIsShow(!isShow);
    setForceType(value);
    setCount((prev) => prev + 1);
  };

  return (
    <Box className="relative w-full text-base text-black">
      <Box className="flex items-center">
        <Box
          as="input"
          key={count}
          name="custom-input"
          type={isCurrency ? typeCurrency : forceType ? forceType : type}
          accept={accept}
          max={max}
          min={min}
          value={inputValue}
          disabled={disabled}
          onChange={type === 'file' ? handleOnChangeFile : handleOnChange}
          onKeyDown={handleOnKeyEnterDown}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          placeholder={placeholder}
          className={`hide-scrollbar outline-none w-full flex-grow ${withBorder ? 'border border-gray-300' : 'shadow'} rounded-md py-[11px] pl-[15px] ${type === 'password' ? 'pr-[70px]' : 'pr-[40px]'} ${disabled ? `bg-[${primaryDisabled}] cursor-not-allowed` : 'bg-white cursor-text'}`}
        />
        {disabled ? null : inputValue ? (
          <Box className="flex items-center justify-center absolute right-2">
            <Box onClick={clear} className="cursor-pointer">
              {XCircleIcon()}
            </Box>
            {type === 'password' && !isShow && (
              <Box onClick={() => togglePassword('text')} className="ml-1.5 cursor-pointer">
                {SeeIcon(primary)}
              </Box>
            )}
            {isShow && (
              <Box onClick={() => togglePassword('password')} className="ml-1.5 cursor-pointer">
                {UnseeIcon(primary, '21', '20', '0 3 27 20')}
              </Box>
            )}
          </Box>
        ) : icon ? (
          <Box as="span" className="absolute right-2">
            {icon}
          </Box>
        ) : null}
      </Box>
      {errorMessage && (
        <Box as="p" className="text-sm text-red-500 mt-0.5 ml-0.5">
          *{errorMessage}
        </Box>
      )}
    </Box>
  );
};

export default Input;
