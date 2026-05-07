import React, { useState } from "react";
import XCircleIcon from "@/images/x-circle.icon";
import {primaryDisabled} from "@/constants/app-common.const";

interface TextAreaProps {
    value: string;
    onChange?: (value: string) => void;
    onClear?: () => void;
    disabled?: boolean;
    withBorder?: boolean;
    placeholder?: string;
    errorMessage?: string | null;
    max?: number;
    min?: number;
    height?: string;
}

const TextArea: React.FC<TextAreaProps> = ({value, onChange, disabled = false, withBorder = true, max, min, placeholder, errorMessage, onClear, height}) => {
    const [textAreaValue, setTextAreaValue] = useState(value);

    const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (disabled) return;
        const newValue = event.target.value;
        setTextAreaValue(newValue);
        if (onChange) onChange(newValue);
    };

    const clear = () => {
        if (disabled) return;
        setTextAreaValue("");
        if (onChange) onChange("");
        if (onClear) onClear();
    };

    return (
        <div className="relative w-full text-base text-black">
            <div className="flex items-center">
                <textarea
                    maxLength={max}
                    minLength={min}
                    value={textAreaValue}
                    disabled={disabled}
                    onChange={handleOnChange}
                    placeholder={placeholder}
                    className={`overflow-y-auto sm:scrollable resize-none outline-none ${height ? height : "h-full"} w-full flex-grow ${withBorder ? "border border-gray-300" : "shadow"} rounded-md py-[11px] pl-[15px] pr-[35px] ${disabled ? `bg-[${primaryDisabled}] cursor-not-allowed` : "bg-white cursor-text"}`}
                />
                {disabled ? null : textAreaValue ? (
                    <div onClick={clear} className="absolute right-2 top-2 cursor-pointer">
                        {XCircleIcon()}
                    </div>
                ) : null}
            </div>
            {errorMessage && (
                <p className="text-sm text-red-500 mt-0.5 ml-0.5">*{errorMessage}</p>
            )}
        </div>
    );
};

export default TextArea;
