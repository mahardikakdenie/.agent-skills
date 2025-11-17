"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useBilling } from "./hook";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate, formatMoney } from "@/lib/formatter";
import AppURL from "@/constants/app-url.const";
import { DataTable } from "@/components/ui/DataTable";
import { createBillingTableColumns } from "@/components/tableConfig/billingTableConfig";

export default function BillingPage() {
  const router = useRouter();
  const [dateTmp, setDateTmp] = useState<Date>(new Date());

  const {
    billings,
    categories,
    channels,
    insurances,
    totalItems,
    totalAmount,
    totalPages,
    page,
    rowsPerPage,
    searchType,
    searchChannel,
    searchCategory,
    date,
    isLoadingBillings,
    setPage,
    handleRowsPerPageChange,
    handleTypeChange,
    handleChannelChange,
    handleCategoryChange,
    handleDateChange,
  } = useBilling();

  const companies = searchType === "insurer" ? insurances : channels;

  const types = [
    { name: "Partner", code: "partner" },
    { name: "Insurer", code: "insurer" },
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"];

  const handleClear = () => {
    handleDateChange(null);
    setDateTmp(new Date());
  };

  const handleViewDetail = (id: string, channel: string, type: string) => {
    router.push(
      `${AppURL.financeBillingDetail}/${id}?channel=${channel}&type=${type}`
    );
  };

  const handleViewInvoice = (id: string, type: string, channel: string) => {
    router.push(
      `${AppURL.financeBillingDetail}/${id}/invoice?type=${type}&channel=${channel}`
    );
  };

  const columns = createBillingTableColumns({
    page,
    rowsPerPage,
    searchType,
    searchCategory,
    categories,
    onViewDetail: handleViewDetail,
    onViewInvoice: handleViewInvoice,
    searchChannel,
  });

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex flex-wrap justify-start gap-4 pb-4 items-center">
        <h1 className="text-black font-bold sm:text-2xl text-xl mt-2 mb-4">
          Billing List
        </h1>

        <div className="flex gap-2 sm:w-auto w-full relative">
          <Button
            onClick={() => {
              if (date) {
                const year = date.getFullYear();
                const month = date.getMonth();
                handleDateChange(new Date(year, month - 1, 1));
                setDateTmp(new Date(year, month - 1, 1));
              }
            }}
            disabled={!date}
            className={cn(
              "font-semibold bg-transparent hover:bg-transparent p-0 text-black text-sm cursor-pointer absolute left-2 z-10",
              !date && "text-gray-500 cursor-not-allowed"
            )}
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                style={{ paddingLeft: "30px" }}
                className={cn(
                  "sm:w-[280px] w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                {date
                  ? formatDate(date.toString(), "MMM, YYYY")
                  : "Select Period"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex gap-2 sm:w-auto w-full relative p-4">
                <Select
                  value={dateTmp.getMonth().toString()}
                  onValueChange={(e) => {
                    setDateTmp(new Date(dateTmp.getFullYear(), parseInt(e), 1));
                  }}
                >
                  <SelectTrigger className="h-10 min-w-36">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="min-w-36">
                      {months.map((item, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  value={dateTmp.getFullYear().toString()}
                  onValueChange={(e) => {
                    setDateTmp(new Date(parseInt(e), dateTmp.getMonth(), 1));
                  }}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {years.map((item, index) => (
                        <SelectItem key={index} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button onClick={() => handleDateChange(dateTmp)}>OK</Button>
                <Button
                  className="bg-red-600 hover:bg-red-500"
                  onClick={handleClear}
                >
                  Reset
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            onClick={() => {
              if (date) {
                const year = date.getFullYear();
                const month = date.getMonth();
                handleDateChange(new Date(year, month + 1, 1));
                setDateTmp(new Date(year, month + 1, 1));
              }
            }}
            disabled={!date}
            className={cn(
              "font-semibold bg-transparent hover:bg-transparent p-0 text-black text-sm cursor-pointer absolute right-2 z-10",
              !date && "text-gray-500 cursor-not-allowed"
            )}
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="min-w-36 w-[100px] ml-auto">
          <Select value={searchType} onValueChange={handleTypeChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Type" />
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

        <div className="min-w-48 w-[180px]">
          <Select value={searchChannel} onValueChange={handleChannelChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {companies.map((item, index) => (
                  <SelectItem key={index} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-48">
          <Select
            disabled={!searchChannel}
            value={searchCategory}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"All"} key={-1}>
                  All Category
                </SelectItem>
                {categories.map((item, index) => (
                  <SelectItem key={index} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => router.push(AppURL.financeBillingAdd)}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
        >
          <PlusIcon className="w-5 h-5 mr-1" /> Create Billing
        </Button>
      </div>

      <div className="text-right mb-2">
        {"Total: IDR " + formatMoney(totalAmount)}
      </div>

      <DataTable
        data={billings}
        columns={columns}
        loading={isLoadingBillings}
        pagination={{
          page,
          totalPages,
          rowsPerPage,
          totalItems,
          onPageChange: setPage,
          onRowsPerPageChange: handleRowsPerPageChange,
          rowsPerPageOptions: [10, 20, 30, 50, 100],
        }}
        noDataText="No billing data available"
        className="table-transactions"
      />
    </div>
  );
}
