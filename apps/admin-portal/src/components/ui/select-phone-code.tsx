'use client';

import Image from 'next/image';
import React from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui';

import { countries } from '@/app/masterdata/user/user.const';

interface SelectPhoneCodeProps {
  value?: string;
  onChange: (code: string) => void;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

const SelectPhoneCode: React.FC<SelectPhoneCodeProps> = ({
  value,
  onChange,
  className = '',
  triggerClassName = '',
  contentClassName = '',
}) => {
  return (
    <div className={`h-full w-full ${className}`}>
      <Select
        name="countryCodes"
        value={value}
        onValueChange={(value: any) => {
          onChange(value);
        }}
      >
        <SelectTrigger className={`h-full ${triggerClassName}`}>
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent className={contentClassName}>
          {countries.map((country: any) => (
            <SelectItem key={country.code} value={country.code}>
              <div className="flex gap-2 items-center justify-center">
                <Image
                  alt={country.name}
                  width={32}
                  height={24}
                  className="flex-shrink-0 rounded-md h-6"
                  src={country.logo}
                />
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectPhoneCode;
