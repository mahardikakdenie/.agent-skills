"use client";

import React from "react";
import { format } from "date-fns";
import { Download, X } from "react-feather";
import { CalendarIcon } from "lucide-react";
import { Calendar, Popover, PopoverContent, PopoverTrigger } from "@repo/ui";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/DataTable";
import { useClaimReport } from "@/hooks/useClaimReport.hooks";
import { createClaimReportTableColumns } from "@/components/tableConfig/claimReportTableConfig";

const ReportClaimPage = () => {
  const {
    claims,
    headers,
    channels,
    totalItems,
    totalPages,
    page,
    rowsPerPage,
    date,
    searchChannel,
    isLoadingClaims,
    isLoadingChannels,
    setPage,
    handleChannelChange,
    handleDateChange,
    handleClear,
    handleRowsPerPageChange,
    handleDownloadReport,
  } = useClaimReport();

  const claimReportTableColumns = createClaimReportTableColumns(headers);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Report</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Claim Report</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
            Claims Report
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="min-w-48">
            <Select value={searchChannel} onValueChange={handleChannelChange}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {channels.map((item: any, index: number) => (
                    <SelectItem key={index} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 sm:w-auto w-full relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "sm:w-[280px] w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent sideOffset={4} className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={new Date()}
                  selected={date}
                  onSelect={(range) => handleDateChange(range)}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button
              onClick={handleClear}
              disabled={!date}
              className={cn(
                "font-semibold bg-transparent hover:bg-transparent p-0 text-red-700 text-sm cursor-pointer absolute right-2",
                !date && "text-gray-500 cursor-not-allowed"
              )}
              title="Clear"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={handleDownloadReport}
            disabled={!date || isLoadingClaims}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full flex items-center"
          >
            <Download className="w-5 h-5 mr-1" /> Download Report
          </Button>
        </div>
      </div>

      {!date ? (
        <div className="bg-white rounded-md p-4 sm:p-6">
          <div className="text-center py-10 text-gray-500">
            Please select a date range to view the report
          </div>
        </div>
      ) : (
        <DataTable
          loading={isLoadingClaims}
          data={claims}
          columns={claimReportTableColumns}
          pagination={{
            page,
            totalPages,
            totalItems,
            rowsPerPage,
            onPageChange: setPage,
            onRowsPerPageChange: handleRowsPerPageChange,
          }}
          className="claim-report-table"
          noDataText="No claim report data available for the selected date range"
        />
      )}
    </div>
  );
};

export default ReportClaimPage;
