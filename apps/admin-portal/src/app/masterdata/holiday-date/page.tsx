"use client";

import { Button } from "@repo/ui";
import { PlusIcon } from "lucide-react";
import { useHolidayDate } from "@/hooks/useHolidayDate.hooks";
import { createHolidayTableColumns } from "@/components/tableConfig/holidayDateTableConfig";
import { ContentLoadingWrapper } from "@/components/ui/loading";
import { DataTable } from "@/components/ui/DataTable";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";

export default function HolidayPage() {
  const {
    holidays,
    totalPages,
    totalItems,
    page,
    rowsPerPage,
    searchCountry,
    searchYear,
    searchType,
    hasAccess,
    canEdit,
    canCreate,
    canDelete,
    isLoading,
    types,
    countries,
    years,
    setPage,
    handleRowsPerPageChange,
    handleTypeChange,
    handleYearChange,
    handleCountryChange,
    handleEdit,
    handleDelete,
    addNewHoliday,
  } = useHolidayDate();

  const columns = createHolidayTableColumns({
    handleEdit,
    handleDelete,
    canEdit,
    canDelete,
    page,
    rowsPerPage,
  });

  if (hasAccess === null) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <ContentLoadingWrapper isLoading={isLoading}>
      <div className="flex flex-col w-full p-4 md:p-6">
        <div className="flex flex-wrap justify-start gap-4 pb-4 items-center">
          <h1 className="text-black font-bold sm:text-2xl text-xl mt-2 mb-4">
            Holiday Date
          </h1>

          <div className="min-w-36 w-[100px] ml-auto">
            <Select value={searchCountry} onValueChange={handleCountryChange}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {countries.map((item, index) => (
                    <SelectItem key={index} value={item.code}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-36 w-[100px]">
            <Select value={searchYear} onValueChange={handleYearChange}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {years.map((item, index) => (
                    <SelectItem key={index} value={item.code}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-52 w-[100px]">
            <Select
              value={searchType || "undefined"}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Holiday Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {types.map((item, index) => (
                    <SelectItem key={index} value={item.code}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={addNewHoliday}
            disabled={!canCreate}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
          >
            <PlusIcon className="w-5 h-5 mr-1" /> Create Holiday
          </Button>
        </div>

        <div className="w-full p-4 md:p-6 bg-white rounded-lg">
          <DataTable
            columns={columns}
            data={holidays}
            pagination={{
              page,
              totalPages,
              totalItems,
              rowsPerPage,
              onPageChange: setPage,
              onRowsPerPageChange: (e) => handleRowsPerPageChange(e),
            }}
          />
        </div>
      </div>
    </ContentLoadingWrapper>
  );
}
