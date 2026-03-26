"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Popover, PopoverContent, PopoverTrigger } from "@repo/ui";
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
import { toastNotification } from "@/helpers/app.helper";
import { helperService } from "@/services/api.service";
import { useScreen } from "@/context/screen.context";
import { Spinner } from "@repo/ui";

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
    exporting,

    setPage,
    setDate,
    setExporting,
    handleSearch,
    handleRowsPerPageChange,
    selectTab,
    handleChannelChange,
    handleCategoryChange,
    handleClear,
  } = usePolicies();

  const {setLoading} = useScreen();

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

  const handleExport = async () => {
    try {
      setExporting(true);

      const response = await helperService.get("/v1/export-data", {
        params: {
          startDate: date?.from ? format(date.from, "yyyy-MM-dd") : undefined,
          endDate: date?.to ? format(date.to, "yyyy-MM-dd") : undefined,
          type: "Export.PolicyList.XSLX",
          channel: searchChannel,
          category: searchCategory !== "All" ? searchCategory : undefined,
        },
        responseType: "blob",
      });

      const contentDisposition = response.headers["content-disposition"] as string | undefined;
      const filenameMatch = contentDisposition?.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
      const filename = filenameMatch?.[1] ? decodeURIComponent(filenameMatch[1]) : `policy-list-${Date.now()}.xlsx`;
      const contentType =
        (response.headers["content-type"] as string | undefined) ||
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      const blob =
        response.data instanceof Blob ? response.data : new Blob([response.data], { type: contentType });
      const downloadUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toastNotification("Gagal mengunduh file export", "error");
    } finally {
      setExporting(false);
    }
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
            <PopoverContent sideOffset={4} className="w-auto p-0" align="start">
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
              "hidden font-semibold bg-transparent hover:bg-transparent p-0 text-red-700 text-sm cursor-pointer absolute right-2",
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
          disabled={exporting}
        >
          {exporting ? (
            <Spinner
              inline
              className="mr-2 [&_[data-slot=spinner-icon]]:size-6 [&_[data-slot=spinner-icon]]:text-blue-500"
            />
          ) : (
            <Download className="w-5 h-5 mr-1 " />
          )}
          
          {exporting ? "Exporting..." : "Export"}
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

