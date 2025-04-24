import React, { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import { Calendar } from "react-feather";

const DatePickerDropdown = ({ onDateChange }: { onDateChange: (from: string, to: string) => void }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDateChange = (item: any) => {
    const newStartDate = item.selection.startDate ?? new Date();
    const newEndDate = item.selection.endDate ?? new Date();

    setDateRange([{ startDate: newStartDate, endDate: newEndDate, key: "selection" }]);

    onDateChange(format(newStartDate, "yyyy-MM-dd"), format(newEndDate, "yyyy-MM-dd"));
  };

  return (
    <div className="relative w-full text-xs">
      <div className="relative bg-white rounded-md shadow h-[46px] overflow-hidden">
        <input
          type="text"
          readOnly
          value={`${format(dateRange[0].startDate ?? new Date(), "dd/MM/yyyy")} - ${format(dateRange[0].endDate ?? new Date(), "dd/MM/yyyy")}`}
          onClick={() => setShowPicker(!showPicker)}
          className="w-full px-4 cursor-pointer rounded-md h-full shadow-none bg-transparent text-[13px] z-10 relative"
        />
        <Calendar className="w-4 h-4 absolute right-3 top-[15px] text-primary z-0" />
      </div>

      {showPicker && (
        <div ref={pickerRef} className="absolute right-0 z-10 mt-2 bg-white border rounded shadow-lg">
          <DateRange
            editableDateInputs={true}
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
          />
        </div>
      )}
    </div>
  );
};

export default DatePickerDropdown;
