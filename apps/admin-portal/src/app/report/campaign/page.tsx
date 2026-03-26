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
import { useCampaignReport } from "@/hooks/useCampaignReport.hooks";
import { createCampaignReportTableColumns } from "@/components/tableConfig/campaignReportTableConfig";

export default function ReportCampaignPage() {
  const {
    promotions,
    insuranceOptions,
    totalItems,
    totalPages,
    page,
    rowsPerPage,
    date,
    sortBy,
    filterBy,
    selectedInsurance,
    isLoadingReports,
    setPage,
    handleSortChange,
    handleFilterChange,
    handleInsuranceChange,
    handleDateChange,
    handleClear,
    handleRowsPerPageChange,
    handleDownloadReport,
  } = useCampaignReport();

  const campaignReportTableColumns = createCampaignReportTableColumns();

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
                <BreadcrumbPage>Campaign Report</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
            Promotions Campaign Report
          </h2>
        </div>

        <div className="flex items-center gap-4">
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
            disabled={isLoadingReports}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full flex items-center"
          >
            <Download className="w-5 h-5 mr-1" /> Download Report
          </Button>
        </div>
      </div>

      <div className="flex gap-5 p-5 bg-white mb-5 rounded-md">
        <div className="w-full">
          <label
            htmlFor="sort"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sort By
          </label>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger
              id="sort"
              className="w-full h-10 border-gray-300 bg-transparent py-2"
            >
              <SelectValue placeholder="Select a Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full">
          <label
            htmlFor="filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter By
          </label>
          <Select value={filterBy} onValueChange={handleFilterChange}>
            <SelectTrigger
              id="filter"
              className="w-full h-10 border-gray-300 bg-transparent py-2"
            >
              <SelectValue placeholder="Select a Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="embedded">Embedded</SelectItem>
                <SelectItem value="voucher">Voucher</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {filterBy === "insurance" && (
          <div className="w-full">
            <label
              htmlFor="insurance"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Insurance
            </label>
            <Select
              value={selectedInsurance}
              onValueChange={handleInsuranceChange}
            >
              <SelectTrigger
                id="insurance"
                className="w-full h-10 border-gray-300 bg-transparent py-2"
              >
                <SelectValue placeholder="Select an Insurance" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {insuranceOptions.map((insurance) => (
                    <SelectItem key={insurance.id} value={insurance.id}>
                      {insurance.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <DataTable
        loading={isLoadingReports}
        data={promotions}
        columns={campaignReportTableColumns}
        pagination={{
          page,
          totalPages,
          totalItems,
          rowsPerPage,
          onPageChange: setPage,
          onRowsPerPageChange: handleRowsPerPageChange,
        }}
        className="campaign-report-table"
        noDataText="No campaign report data available"
      />
    </div>
  );
}
