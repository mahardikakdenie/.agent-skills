import React, { forwardRef, useEffect, useRef, useState } from "react";
import moment from "moment";
import Button from "@/components/button";
import Select from "@/components/select";
import CalenderIcon from "@/images/calender.icon";
import {monthList, primary, primaryDisabled} from "@/constants/app-common.const";

interface FormErrors {
    date?: string;
    month?: string;
    year?: string;
}

interface DatePickerProps {
    label: string;
    title?: string;
    initialValue?: string;
    minimumDate?: string;
    maximumDate?: string;
    isDisabled?: boolean;
    isWithShadow?: boolean;
    isForceClear?: boolean;
    bgDatePicker?: string;
    heightDatePicker?: string;
    borderDatePicker?: string;
    errorMessage?: string;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
    onClear?: () => void;
}

const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
    (
        {
            label,
            title,
            initialValue,
            minimumDate = "1970-01-01",
            maximumDate,
            isDisabled,
            isWithShadow = true,
            isForceClear = false,
            bgDatePicker = "bg-white",
            heightDatePicker = "h-[46px]",
            borderDatePicker,
            onChange,
            onSubmit,
            onClear,
            errorMessage
        },
        ref,
    ) => {
        const [isOpen, setIsOpen] = useState(false);
        const [date, setDate] = useState<number | null>(null);
        const [month, setMonth] = useState<number | null>(null);
        const [year, setYear] = useState<number | null>(null);
        const [dateValue, setDateValue] = useState("");
        const [errors, setErrors] = useState<FormErrors>({});
        const [isFormValid, setIsFormValid] = useState(false);
        const fromUseRef = useRef<HTMLDivElement | null>(null);

        useEffect(() => {
            if (initialValue != null && initialValue !== "" && date === null) {
                setDate(parseInt(moment(initialValue).format("DD")));
                setMonth(parseInt(moment(initialValue).format("MM")));
                setYear(parseInt(moment(initialValue).format("YYYY")));
                setDateValue(initialValue);
                if (onChange) {
                    onChange(initialValue);
                }
                setIsFormValid(true);
            } else {
                setIsFormValid(false)
            }
            validateForm();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [initialValue]);

        useEffect(() => {
            if (date !== null && month !== null && year !== null) {
                setDateValue(`${year}-${month.toString().padStart(2, "0")}-${date.toString().padStart(2, "0")}`);
                if (onChange) {
                    onChange(dateValue);
                }
                setIsFormValid(true);
            } else {
                setIsFormValid(false);
            }
            validateForm();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [date, month, year]);

        useEffect(() => {
            if (month !== null && year !== null) {
                if (date && dates.find(d => d.value === date)) setDate(date);
                else setDate(null);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [month, year]);

        useEffect(() => {
            if (isForceClear) handleClear();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [isForceClear]);

        const calculatePosition = () => {
            const buttonRect = fromUseRef.current?.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            if (buttonRect) {
                const spaceBelow = viewportHeight - buttonRect.bottom;
                return spaceBelow >= 200 ? "below" : "above";
            }
            return "below";
        };

        const position = calculatePosition();

        const validateForm = () => {
            const errors: FormErrors = {};

            if (!date) {
                errors.date = "Date is required.";
            } else if (date < 1 || date > daysInMonth(month || 0, year || 0)) {
                errors.date = "Invalid date.";
            }

            if (!month) errors.month = "Month is required.";
            if (!year) errors.year = "Year is required.";
            if (!!date && !!month && !!year && minimumDate > "1970-01-01" && minimumDate > `${year}-${month < 10 ? `0${month}` : month}-${date < 10 ? `0${date}` : date}`) errors.date = `Minimum date is ${minimumDate.split("-").reverse().join(" / ")}`;

            setErrors(errors);

            const isValid = Object.keys(errors).length === 0;
            setIsFormValid(isValid);
            return isValid;
        };

        const currentYear = minimumDate
            ? new Date(minimumDate).getFullYear()
            : new Date().getFullYear();

        let maxYear = maximumDate
            ? new Date(maximumDate).getFullYear()
            : new Date().getFullYear();

        const years = Array.from(
            { length: maxYear - currentYear + 1 },
            (_, index) => {
                const year = currentYear + index;
                return { label: year.toString(), value: year };
            },
        );

        const months = monthList.map((label, index) => ({ label, value: index + 1 }));

        const daysInMonth = (month: number, year: number) => {
            if (!month || !year) return 31;
            return new Date(year, month, 0).getDate();
        };

        const generateDates = (month: number, year: number) => {
            let startDay = 1;
            if (minimumDate) {
                const minDate = new Date(minimumDate);
                const minMonth = minDate.getMonth() + 1;
                const minYear = minDate.getFullYear();
                const minDay = minDate.getDate();

                if (
                    (month === minMonth || month === 0) &&
                    (year === minYear || year === 0)
                ) {
                    startDay = minDay;
                }
            }

            return Array.from(
                { length: daysInMonth(month, year) - startDay + 1 },
                (_, index) => ({
                    label: (startDay + index).toString(),
                    value: startDay + index,
                }),
            );
        };

        const dates = generateDates(month || 0, year || 0);

        let dateDLabel = date ? date.toString().padStart(2, "0") : "-";
        let dateMLabel = month ? months.find((m) => m.value === month)?.label : "-";
        let dateYLabel = year || "-";

        const handleDateChange = (value: string | number) => {
            setDate(parseInt(value.toString()) || null);
        };

        const handleMonthChange = (value: string | number) => {
            setMonth(parseInt(value.toString()) || null);
        };

        const handleYearChange = (value: string | number) => {
            setYear(parseInt(value.toString()) || null);
        };

        const handleSubmit = () => {
            if (year && month && date) {
                let dateFormatted = date.toString().padStart(2, "0");
                let monthFormatted = month.toString().padStart(2, "0");
                let yearFormatted = year.toString().padStart(4, "0");

                let dateValue = `${yearFormatted}-${monthFormatted}-${dateFormatted}`;
                setDateValue(dateValue);
                if (onChange) {
                    onChange(dateValue);
                }
                if (onSubmit) {
                    onSubmit(dateValue);
                }

                setIsOpen(false);
            }
        };

        const handleClear = () => {
            setDateValue("");
            setDate(null);
            setMonth(null);
            setYear(null);
            if (onClear) onClear();
            setIsOpen(false);
        };

        if (dateValue) label = moment(dateValue).format("DD / MM / YYYY");

        return (
            <div ref={fromUseRef} className="group w-full relative rounded-md shadow-none">
                <div className="h-full flex flex-col">
                    <button ref={ref} onClick={() => setIsOpen(true)} disabled={isDisabled}
                        className={`px-4 ${bgDatePicker} ${heightDatePicker} ${isWithShadow && "shadow"} rounded-md transition-all text-xs flex items-center ${errorMessage ? "border border-red-500" : borderDatePicker ? `border ${borderDatePicker}` : ""} ${!dateValue && "text-gray-400"} ${isDisabled ? "cursor-not-allowed" : "clickable"}`}
                    >
                        {label} <span className="ml-auto h-5 w-5">{CalenderIcon(isDisabled ? primaryDisabled : primary, "30", "30", "0 0 25 24")}</span>
                    </button>
                    {errorMessage && (<p className="text-red-500 text-xs p-1">{errorMessage}</p>)}
                </div>

                {isOpen && (
                    <div className={`absolute ${position === "above" ? "bottom-full mb-2" : "top-full mt-2"} left-0 w-full max-w-full bg-white rounded-md shadow-lg p-4 z-10`}>
                        <div className="bg-default-100 text-center p-2">
                            {title && (<span className="text-[10px]">{title}</span>)}
                            <div className="text-bluedark font-bold text-sm">
                                {dateDLabel} {dateMLabel} {dateYLabel}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 mt-4">
                            <Select additionalClassNameSelect="truncate" value={year || ""} placeholderSelect="Select year" onChange={handleYearChange} options={years.reverse()} errorMessage={errors.year}/>

                            {year !== null && (
                                <Select additionalClassNameSelect="truncate" value={month || ""} placeholderSelect="Select month" onChange={handleMonthChange} options={months} errorMessage={errors.month}/>
                            )}

                            {month !== null && year !== null && (
                                <Select additionalClassNameSelect="truncate" value={date || ""} placeholderSelect="Select date" onChange={handleDateChange} options={dates} errorMessage={errors.date}/>
                            )}
                        </div>

                        <div className="flex items-center justify-center text-center mt-4">
                            <Button variant="danger" additionalClassName="mr-2" onClick={handleClear}>Clear</Button>
                            <Button onClick={handleSubmit} disabled={!isFormValid}>Save</Button>
                        </div>
                    </div>
                )}
            </div>
        );
    },
);

DatePicker.displayName = "DatePicker";
export default DatePicker;
