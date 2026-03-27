"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "react-feather";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { DataTable } from "@/components/ui/DataTable";
import { useMembership } from "@/hooks/useMembership.hooks";
import { createMembershipTableColumns } from "@/components/tableConfig/membershipTableConfig";

export default function MembershipPage() {
  const {
    filteredMembership,
    totalData,
    totalItems,
    totalPages,
    channels,

    page,
    rowsPerPage,
    tab,
    channel,

    isLoading,

    handleSearch,
    handleRowsPerPageChange,
    selectTab,
    handleChannelChange,
    handleExport,
    handleUpload,
    goToDetail,
    getStatusColor,
    setPage,
  } = useMembership();

  const membershipTableColumns = createMembershipTableColumns({
    goToDetail,
    getStatusColor,
    page,
    rowsPerPage,
  });

  const tabs = [
    { key: "All", label: "All Membership" },
    { key: "Pending", label: "Pending" },
    { key: "Active", label: "Active" },
    { key: "Inactive", label: "Inactive" },
  ];

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex gap-3 pb-4 items-center">
        <h1 className="text-black font-bold text-2xl mt-2">Membership List</h1>

        <Select value={channel} onValueChange={handleChannelChange}>
          <SelectTrigger className="w-[180px] ml-auto">
            <SelectValue placeholder="Select Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {channels.map((channelItem, index) => (
                <SelectItem key={index} value={channelItem.id}>
                  {channelItem.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          onClick={handleUpload}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
        >
          <Upload className="w-5 h-5 mr-1" /> Upload
        </Button>

        <Button
          onClick={handleExport}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
        >
          <Download className="w-5 h-5 mr-1" /> Download
        </Button>
      </div>

      <div className="block bg-white rounded-md mb-3">
        <div className="w-full flex items-center overflow-auto">
          {tabs.map((tabItem) => (
            <div
              key={tabItem.key}
              onClick={() => selectTab(tabItem.key)}
              className={`cursor-pointer h-full flex items-center justify-center sm:px-7 px-5 ${
                tab === tabItem.key &&
                "border-b-[3px] border-primary sm:px-7 px-5"
              }`}
            >
              <button
                className={`text-sm py-5 mr-3 ${
                  tab === tabItem.key && "text-primary"
                }`}
              >
                {tabItem.label}
              </button>
              <span
                className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
                  totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
                } ${tab !== tabItem.key && "hidden"}`}
              >
                {totalData}{" "}
                <span
                  className={`${totalData < 100 && "hidden"}`}
                  style={{ fontSize: "10px" }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      <DataTable
        loading={isLoading}
        data={filteredMembership}
        columns={membershipTableColumns}
        search={{
          placeholder:
            "Search by Policy Number/Member Name/Email/TPA Member ID",
          onSearch: (value: string) => handleSearch(value),
        }}
        pagination={{
          page,
          totalPages,
          totalItems,
          rowsPerPage,
          onPageChange: setPage,
          onRowsPerPageChange: (newRowsPerPage) =>
            handleRowsPerPageChange({
              target: { value: newRowsPerPage.toString() },
            } as React.ChangeEvent<HTMLSelectElement>),
          rowsPerPageOptions: [10, 20, 30, 50],
        }}
        className="membership-table"
        noDataText="No membership data available"
      />
    </div>
  );
}

