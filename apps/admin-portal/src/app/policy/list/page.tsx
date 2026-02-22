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
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { Download, Upload, X } from "react-feather";
import noData from "@public/images/no-data.webp";
import { Button } from "@/components/ui/button";
import usePolicies from "@/hooks/usePolicies.hooks";
import { DataTable } from "@/components/ui/DataTable";
import { createPolicyTableColumns } from "@/components/tableConfig/policyTableConfig";

export default function PolicyPage() {
  const path = usePathname();

  const router = useRouter();

  const {
    policies,
    channels,
    categories,
    totalPages,
    totalItems,
    totalData,

    page,
    rowsPerPage,
    tab,
    searchData,
    searchChannel,
    searchCategory,
    date,

    isLoading,
    isLoadingChannels,
    isLoadingCategories,
    isFetching,

    setPage,
    setDate,
    handleSearch,
    handleRowsPerPageChange,
    selectTab,
    handleChannelChange,
    handleCategoryChange,
    handleClear,
  } = usePolicies();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Declaration":
        return "text-[#016DA1]";
      case "Grace Period":
        return "text-orange-500";
      case "Expired":
        return "text-gray-400";
      default:
        return "text-[#016DA1]";
    }
  };

  const goToDetail = (policyId: string) => {
    router.push(`${path}/detail/${policyId}`);
  };

  const handleDownloadTemplate = () => {
    try {
      var c = channels.filter((x) => x.id == searchChannel)[0];
      window.open(`/policy_templates/${c.name}.xlsx`, "_blank");
    } catch (error) {}
  };

  const handleImport = () => {
    router.push(`${path}/import`);
  };

  const handleExport = () => {
    const exportData = {
      page,
      limit: rowsPerPage,
      status: tab === "All" ? "" : tab,
      search: searchData,
      channel: searchChannel,
      date_from: date?.from ? format(date.from, "yyyy-MM-dd") : undefined,
      date_to: date?.to ? format(date.to, "yyyy-MM-dd") : undefined,
      category: searchCategory === "All" ? null : searchCategory,
    };

    localStorage.setItem("exportPolicyData", JSON.stringify(exportData));
    router.push(`${path}/export`);
  };

  const policyTableColumns = createPolicyTableColumns({
    page,
    rowsPerPage,
    onGoToDetail: goToDetail,
    getStatusColor,
  });

  return (
    <div className="flex flex-col w-full p-4 md:p-6 ">
      <div className="flex flex-wrap justify-end gap-4 pb-4 items-center">
        <h1 className="text-black font-bold text-2xl mt-2">Policy List</h1>

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
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={new Date()}
                selected={date}
                onSelect={(range) => setDate(range)}
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

        <div className="min-w-48">
          <Select value={searchChannel} onValueChange={handleChannelChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* <SelectItem value={'All'}>All Channel</SelectItem> */}
                {channels.map((item, index) => (
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
          onClick={handleDownloadTemplate}
          className="bg-[#F5BA41] text-black hover:bg-[#F5BA41] mr-auto rounded-full"
        >
          <Download className="w-5 h-5 mr-1 " /> Import Template
        </Button>
        <Button
          onClick={handleImport}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
        >
          <Upload className="w-5 h-5 mr-1 " /> Import
        </Button>
        <Button
          onClick={handleExport}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
        >
          <Download className="w-5 h-5 mr-1 " /> Export
        </Button>
      </div>
      <div className="block bg-white rounded-md mb-3">
        <div className="w-full flex items-center overflow-auto">
          <div
            onClick={() => selectTab("All")}
            className={`cursor-pointer h-full flex items-center justify-center sm:px-7 px-5 ${
              tab === "All" && "border-b-[3px] border-primary sm:px-7 px-5"
            }`}
          >
            <button
              className={`text-sm py-5 mr-3 ${tab === "All" && "text-primary"}`}
            >
              All Policy
            </button>
            <span
              className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
                totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
              } ${tab !== "All" && "hidden"}`}
            >
              {totalData}
              <span
                className={`${totalData < 100 && "hidden"}`}
                style={{ fontSize: "10px" }}
              ></span>
            </span>
          </div>
          <div
            onClick={() => selectTab("In Force")}
            className={`cursor-pointer h-full flex items-center justify-center sm:px-7 px-5 ${
              tab === "In Force" && "border-b-[3px] border-primary sm:px-7 px-5"
            }`}
          >
            <button
              className={`text-sm py-5 mr-3 ${
                tab === "In Force" && "text-primary"
              }`}
            >
              In Force
            </button>
            <span
              className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
                totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
              } ${tab !== "In Force" && "hidden"}`}
            >
              {totalData}
              <span
                className={`${totalData < 100 && "hidden"}`}
                style={{ fontSize: "10px" }}
              ></span>
            </span>
          </div>
          <div
            onClick={() => selectTab("Grace Period")}
            className={`cursor-pointer h-full flex items-center justify-center sm:px-7 px-5 ${
              tab === "Grace Period" &&
              "border-b-[3px] border-primary sm:px-7 px-5"
            }`}
          >
            <button
              className={`text-sm py-5 mr-3 ${
                tab === "Grace Period" && "text-primary"
              }`}
            >
              Grace Period
            </button>
            <span
              className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
                totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
              } ${tab !== "Grace Period" && "hidden"}`}
            >
              {totalData}
              <span
                className={`${totalData < 100 && "hidden"}`}
                style={{ fontSize: "10px" }}
              ></span>
            </span>
          </div>
          <div
            onClick={() => selectTab("Expired")}
            className={`cursor-pointer h-full flex items-center justify-center sm:px-7 px-5 ${
              tab === "Expired" && "border-b-[3px] border-primary sm:px-7 px-5"
            }`}
          >
            <button
              className={`text-sm py-5 mr-3 ${
                tab === "Expired" && "text-primary"
              }`}
            >
              Expired
            </button>
            <span
              className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
                totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
              } ${tab !== "Expired" && "hidden"}`}
            >
              {totalData}
              <span
                className={`${totalData < 100 && "hidden"}`}
                style={{ fontSize: "10px" }}
              ></span>
            </span>
          </div>
        </div>
      </div>

      <DataTable
        loading={isLoading || isFetching}
        data={policies}
        columns={policyTableColumns}
        search={{
          placeholder: "Search by Plan Name",
          onSearch: handleSearch,
        }}
        pagination={{
          page,
          totalPages,
          rowsPerPage,
          totalItems,
          onPageChange: setPage,
          onRowsPerPageChange: handleRowsPerPageChange,
        }}
        noDataImage={noData}
        noDataText="No policy data available"
        className="table-policies"
      />
    </div>
  );
}

