"use client";

import React from "react";
import { Check, Plus, Trash2, X, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import emptyStateSearchPrompt from "@public/images/empty-state-search-prompt.svg";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectAutocomplete } from "@/components/ui/Fields/SelectAutocomplete";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui";
import { DataTable } from "@/components/ui/DataTable";
import { useExportUsers } from "@/hooks/useExportUsers.hooks";
import { createExportUsersTableColumns } from "@/components/tableConfig/exportUserTableConfig";

const ExportUsersPage = () => {
  const {
    customers,
    totalPages,
    totalItems,
    dataToDownload,

    channelList,
    productList,
    planList,
    monthList,
    filterOptions,

    page,
    limit,

    filteredUsers,
    isFiltered,

    selectedFilter,
    channel,
    product,
    plan,
    frequentBuyersSign,
    frequentBuyersValue,
    birthdayMonth,

    setPage,
    setSelectedFilter,
    setChannel,
    setProduct,
    setPlan,
    setFrequentBuyersSign,
    setFrequentBuyersValue,
    setBirthdayMonth,

    handleAddFilterData,
    handleDeleteSelectedFilter,
    handleGetFilteredData,
    resetAllFilters,
    handleGenerateXlsx,
    handleLimitChange,

    isLoading,
    isLoadingFilters,

    // Plan search
    planSearchQuery,
    handlePlanSearch,
    isSearchingPlans,
  } = useExportUsers();

  const exportUsersTableColumns = createExportUsersTableColumns({
    page,
    rowsPerPage: limit,
  });

  const renderEmptyState = () => (
    <div className="flex flex-col gap-4 items-center justify-center py-14">
      <Image alt="no data" src={emptyStateSearchPrompt} width={200} />
      <div className="text-[#939597] text-base">
        {!isFiltered
          ? "No filters yet. Add one to start building your audience."
          : "No data found"}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex flex-wrap justify-start pb-4 items-center">
        <h1 className="text-black font-bold text-2xl mt-2 sm:w-auto w-full">
          Export Users
        </h1>
        <div className="flex space-x-4 ml-auto">
          <Button
            disabled={dataToDownload.length < 1}
            onClick={handleGenerateXlsx}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full text-xs"
          >
            <Download className="w-5 h-5 mr-1" /> Generate XLSX
          </Button>
        </div>
      </div>

      <div className="flex bg-white rounded-xl gap-4 mb-3 p-6">
        <div className="w-full">
          <div className="flex items-center justify-between">
            <p className="text-sm">Selected Filters</p>
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-between">
                <div
                  onClick={resetAllFilters}
                  className="text-sm font-bold text-[#016DA1] hover:text-[#2d9ae6] cursor-pointer mr-3"
                >
                  Reset Filter
                </div>
                <Button
                  disabled={filteredUsers.length < 1}
                  onClick={handleGetFilteredData}
                  className="bg-[#016DA1] text-white hover:bg-[#2d9ae6] rounded-full text-xs"
                >
                  Get Users
                </Button>
              </div>
            </div>
          </div>

          {filteredUsers.length > 0 && (
            <ul className="mt-3 max-h-24 overflow-y-auto">
              {filteredUsers.map((f: any, index: number) => (
                <li
                  key={index}
                  className="flex justify-between items-center mb-2 gap-2"
                >
                  <div className="bg-[#F8F8F8] py-3 px-4 w-full text-sm text-[#525252] rounded-md border-transparent">
                    {f.label}: {f.valueView}
                  </div>
                  <Button
                    className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                    onClick={() => handleDeleteSelectedFilter(index)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button
                color="warning"
                className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black w-auto mt-4"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Filter
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 w-[1000px] max-w-full overflow-hidden">
              <DialogHeader className="bg-[#F8F8F8] py-3 px-4 sm:px-6">
                <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
                  Filters
                  <DialogClose className="ml-auto">
                    <Button
                      type="button"
                      className="bg-transparent hover:bg-transparent text-black p-0"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </DialogClose>
                </DialogTitle>
              </DialogHeader>

              <div className="p-4 h-full overflow-auto max-h-[70vh]">
                <div className="relative mb-4">
                  <div className="min-w-48">
                    <Select
                      value={selectedFilter}
                      onValueChange={setSelectedFilter}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {filterOptions.map(
                            (item: any, index: number) =>
                              item.active && (
                                <SelectItem key={index} value={item.id}>
                                  {item.name}
                                </SelectItem>
                              )
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedFilter === "channel_id" && (
                  <div className="relative mb-4">
                    <div className="min-w-48">
                      <Select value={channel} onValueChange={setChannel}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select Channel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {isLoadingFilters ? (
                              <SelectItem value="loading" disabled>
                                Loading...
                              </SelectItem>
                            ) : (
                              channelList.map((item: any, index: number) => (
                                <SelectItem key={index} value={item.id}>
                                  {item.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {selectedFilter === "product_id" && (
                  <div className="relative mb-4">
                    <div className="min-w-48">
                      <Select value={product} onValueChange={setProduct}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select Product" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {isLoadingFilters ? (
                              <SelectItem value="loading" disabled>
                                Loading...
                              </SelectItem>
                            ) : (
                              productList.map((item: any, index: number) => (
                                <SelectItem key={index} value={item.id}>
                                  {item.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Plan Filter with Autocomplete - SIMPLIFIED! */}
                {selectedFilter === "plan_id" && (
                  <div className="relative mb-4">
                    <div className="min-w-48">
                      <SelectAutocomplete
                        value={plan}
                        onValueChange={setPlan}
                        options={planList.map((item: any) => ({
                          value: item.id,
                          label: item.name,
                        }))}
                        placeholder="Select Plan"
                        searchPlaceholder="Search plans..."
                        onSearchChange={handlePlanSearch}
                        searchValue={planSearchQuery}
                        loading={isLoadingFilters && !planSearchQuery}
                        isSearching={isSearchingPlans}
                        triggerClassName="h-10"
                        emptyText="No plans found"
                      />
                    </div>
                  </div>
                )}

                {selectedFilter === "frequent_buyers" && (
                  <div>
                    <div className="relative mb-4">
                      <div className="min-w-48">
                        <Select
                          value={frequentBuyersSign}
                          onValueChange={setFrequentBuyersSign}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="<">{`<`}</SelectItem>
                              <SelectItem value=">">{`>`}</SelectItem>
                              <SelectItem value="<=">{`<=`}</SelectItem>
                              <SelectItem value=">=">{`>=`}</SelectItem>
                              <SelectItem value="=">{`=`}</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Input
                        disabled={!frequentBuyersSign}
                        name="frequentBuyersValue"
                        type="number"
                        min={1}
                        value={frequentBuyersValue}
                        onChange={(e) =>
                          setFrequentBuyersValue(Number(e.target.value))
                        }
                        className="bg-[#F8F8F8] py-3 px-4 w-full text-sm text-[#525252] rounded-md border-transparent"
                      />
                    </div>
                  </div>
                )}

                {selectedFilter === "birthday_month" && (
                  <div className="relative mb-4">
                    <div className="min-w-48">
                      <Select
                        value={birthdayMonth}
                        onValueChange={setBirthdayMonth}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {monthList.map((item: any, index: number) => (
                              <SelectItem key={index} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="sm:justify-center justify-center pb-4 sm:pb-6">
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
                    onClick={handleAddFilterData}
                  >
                    <Check className="w-4 h-4 mr-2" /> Add
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="w-full bg-white rounded-xl p-4">
        {isFiltered && (customers.length > 0 || isLoading) ? (
          <DataTable
            loading={isLoading}
            data={customers}
            columns={exportUsersTableColumns}
            pagination={{
              page,
              totalPages,
              totalItems,
              rowsPerPage: limit,
              onPageChange: setPage,
              onRowsPerPageChange: handleLimitChange,
              rowsPerPageOptions: [10, 20, 30, 50, 100],
            }}
            noDataText="No customer data available"
            className="export-users-table"
          />
        ) : (
          renderEmptyState()
        )}
      </div>
    </div>
  );
};

ExportUsersPage.displayName = "ExportUsersPage";
export default ExportUsersPage;

