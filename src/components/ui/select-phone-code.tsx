'use client';

import React from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import { countries } from "@/app/protected/masterdata/user/user.const";
import Image from "next/image";

interface SelectPhoneCodeProps {
    value?: string;
    onChange: (code: string) => void;
}

const SelectPhoneCode: React.FC<SelectPhoneCodeProps> = ({ value, onChange }) => {
    return (
        <div className="h-full w-full">
            <Select
                name="countryCodes"
                value={value}
                onValueChange={(value: any) => {
                    onChange(value);
                }}
            >
                <SelectTrigger className="h-full">
                    <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent>
                    {countries.map((country: any) => (
                        <SelectItem key={country.code} value={country.code}>
                            <div className="flex gap-2 items-center justify-center">
                                <Image alt={country.name} width={32} height={24} className="flex-shrink-0 rounded-md h-6" src={country.logo} />
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default SelectPhoneCode;
