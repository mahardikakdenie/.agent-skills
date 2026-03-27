"use client";

import { DataTable } from "@/components/ui/DataTable";
import noData from "@public/images/no-data.webp";
import React from "react";
import usePolicies from "@/hooks/usePolicies.hooks";
import { createPendingRenewalsTableColumns } from "@/components/tableConfig/policyTableConfig";
import { usePathname, useRouter } from "next/navigation";
import AppURL from "@/constants/app-url.const";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";

export default function PendingRenewals() {
  const router = useRouter();

  const {
    policies,
    channels,
    totalPages,
    totalItems,

    page,
    rowsPerPage,
    searchChannel,

    isLoading,
    isLoadingChannels,
    isFetching,

    setPage,
    handleSearch,
    handleRowsPerPageChange,
    handleChannelChange,
  } = usePolicies(true);

  const goToDetail = (policyId: string) => {
    router.push(`${AppURL.policyDetail}/${policyId}`);
  };

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

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "D-30":
        return "text-green-600";
      case "D-14":
        return "text-yellow-600";
      case "D-7":
        return "text-orange-600";
      case "D-1":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const policyTableColumns = createPendingRenewalsTableColumns({
    page,
    rowsPerPage,
    onGoToDetail: goToDetail,
    getStatusColor,
    getStageColor,
  });

  return (
    <div className="flex flex-col w-full p-4 md:p-6 gap-4">
      <div className="flex flex-col gap-3">
        <h1 className="text-black font-bold text-2xl mt-2 sm:w-auto w-full mr-auto">
          Pending Renewals
        </h1>
        <p className="text-sm font-medium">
          Pantau polis yang akan segera berakhir. Daftar hanya menampilkan polis
          aktif dalam masa follow-up.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="min-w-48">
          <Select value={searchChannel} onValueChange={handleChannelChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {channels.map((item, index) => (
                  <SelectItem key={index} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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


