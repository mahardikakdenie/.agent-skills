import React, {useState, useEffect, useRef, CSSProperties} from "react";
import { ChevronDown } from "react-feather";
import {primaryDisabled} from "@/constants/app-common.const";
import {Option} from "@/types/common";

interface SelectProps {
    value: string | number;
    onChange: (value: string | number) => void;
    options: Option[];
    allOptions?: Option[];
    disabled?: boolean;
    isPriorityPlaceholder?: boolean;
    withBorder?: boolean;
    placeholderSelect?: string;
    bgSelect?: string;
    placeholderSelectClassName?: string;
    placeholderStyle?: CSSProperties;
    errorMessage?: string | null;
    icon?: React.ReactNode;
    additionalClassNameSelect?: string;
    chevronColor?: string;
}

const Select: React.FC<SelectProps> = ({ value, onChange, options, allOptions, disabled = false, isPriorityPlaceholder = false, withBorder = true, placeholderSelect, placeholderSelectClassName, placeholderStyle, errorMessage, icon, bgSelect, additionalClassNameSelect, chevronColor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | number>();
    const [dropUp, setDropUp] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (value) {
            setSelectedValue(value);
        }
    }, [value])

    useEffect(() => {
        const handlePosition = () => {
            if (selectRef.current) {
                const rect = selectRef.current.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;

                if (rect.bottom + 200 > windowHeight) {
                    setDropUp(true);
                } else {
                    setDropUp(false);
                }
            }
        };

        if (isOpen) {
            handlePosition();
            window.addEventListener("resize", handlePosition);
        }

        return () => window.removeEventListener("resize", handlePosition);
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleSelectOption = (val: string | number) => {
        onChange(val);
        setSelectedValue(val);
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div ref={selectRef} className="relative w-full text-base">
            <button
                type="button"
                disabled={disabled}
                onClick={toggleDropdown}
                className={`w-full flex items-center justify-between ${bgSelect && !disabled ? bgSelect : disabled ? `bg-[${primaryDisabled}]` : "bg-white"} ${withBorder ? "px-4 py-3 border border-gray-300" : "py-2 pr-2"} rounded-md ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${additionalClassNameSelect}`}
            >
                {icon && (<span className="mr-2">{icon}</span>)}
                {isPriorityPlaceholder ? (
                    <p style={placeholderStyle} className={`${placeholderSelectClassName}`}>{placeholderSelect}</p>
                ) : (
                    <p style={placeholderStyle} className={`${placeholderSelectClassName}`}>{value ? options.find(opt => opt.value === value)?.label : placeholderSelect || "Select option"}</p>
                )}
                <span className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}>
                    <ChevronDown color={chevronColor ? chevronColor : undefined} width="30" height="15" />
                </span>
            </button>
            {errorMessage && (<p className="text-sm text-red-500 mt-0.5 ml-0.5">*{errorMessage}</p>)}
            {isOpen && (
                <ul className={`max-h-36 overflow-y-auto sm:scrollable absolute w-full bg-white border border-gray-300 rounded-md mt-1 z-10 ${dropUp ? "bottom-full mb-1" : "top-full mt-1"}`}>
                    {(allOptions && allOptions.length > 0 ? allOptions : options).map((item, index) => {
                        const matchingOption = options.find(option => option.label === item.label);

                        if (item.disable) {
                            return (<li
                                key={item.value}
                                onClick={undefined}
                                className="p-2 cursor-not-allowed"
                                style={{ color: primaryDisabled }}
                            >
                                {matchingOption ? matchingOption.label : item.label}
                            </li>)
                        }

                        return (
                            <li
                                key={`opt-${index}-${item.value}`}
                                onClick={matchingOption ? () => handleSelectOption(matchingOption.value) : undefined}
                                className={`p-2 truncate ${matchingOption ? "hover:bg-primary-light-foreground hover:text-primary hover:font-bold cursor-pointer" : "cursor-not-allowed"} ${matchingOption && selectedValue === matchingOption.value && "text-primary font-bold"}`}
                                style={{ color: !matchingOption ? primaryDisabled : undefined }}
                            >
                                {matchingOption ? matchingOption.label : item.label}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default Select;
