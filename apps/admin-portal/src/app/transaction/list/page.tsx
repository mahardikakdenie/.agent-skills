"use client";
import _ from "lodash";
import React from "react";
import noData from "@public/images/no-data.webp";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Download, Upload } from "react-feather";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import useTransactions from "@/hooks/useTransactions.hooks";
import { DataTable } from "@/components/ui/DataTable";
import { createTransactionTableColumns } from "@/components/tableConfig/transactionTableConfig";
import { calculateTotalPremium } from "@/lib/utils";

export default function TransactionsPage() {
  const router = useRouter();
  const { permissionList } = useAuth();

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);

  const {
    transactions,
    totalPages,
    totalItems,
    totalData,

    page,
    rowsPerPage,
    tab,
    type,
    searchData,

    isLoading,
    isFetching,
    isLoadingUpdateStatus,

    setPage,
    handleSearch,
    handleRowsPerPageChange,
    selectTab,
    handleChannelChange,
    handleUpdateToPaid,
  } = useTransactions();

  const types = [
    {
      id: "conventional",
      name: "Conventional",
    },
    {
      id: "online",
      name: "Online",
    },
  ];

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Transactions.Read");
      const editBtn = permissionList.includes("Transactions.Update");

      setCanEdit(editBtn);
      setHasAccess(access);
      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Declaration":
        return "text-[#016DA1]";
      case "Paid":
        return "text-[#00AB4F]";
      case "Pending":
        return "text-[#CC9B36]";
      default:
        return "text-[#016DA1]";
    }
  };

  const handleUpdateToPaidWithAlert = (id: string) => {
    handleUpdateToPaid(id);
  };

  const handleExport = () => {
    const exportData = {
      page,
      limit: rowsPerPage,
      status: tab === "All" ? "" : tab,
      search: searchData,
      type: type,
    };

    localStorage.setItem("exportTransactionData", JSON.stringify(exportData));
    router.push(AppURL.transactionExport);
  };

  const transactionTableColumns = createTransactionTableColumns({
    page,
    rowsPerPage,
    canEdit,
    onUpdateToPaid: handleUpdateToPaidWithAlert,
    isLoadingUpdateStatus,
    getStatusColor,
    calculateTotalPremium,
  });

  if (hasAccess === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex pb-4 items-center justify-between">
        <h1 className="text-black font-bold text-2xl mt-2">Transactions</h1>
        <div className="flex gap-4">
          <div className="min-w-48">
            <Select value={type} onValueChange={handleChannelChange}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {types.map((item, index) => (
                    <SelectItem key={index} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => router.push(AppURL.transactionAdd)}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
          >
            <Upload className="w-5 h-5 mr-2" /> Add Transaction
          </Button>
          <Button
            onClick={handleExport}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
          >
            <Download className="w-5 h-5 mr-2" /> Export
          </Button>
        </div>
      </div>

      <div className="block bg-white rounded-md mb-3">
        <div className="w-full flex items-center overflow-auto">
          {["All", "Declaration", "Paid", "Pending"].map((tabName) => (
            <div
              key={tabName}
              onClick={() => selectTab(tabName)}
              className={`cursor-pointer h-full flex items-center justify-center md:px-7 px-5 ${
                tab === tabName && "border-b-[3px] border-primary md:px-7 px-5"
              }`}
            >
              <button
                className={`text-sm py-5 mr-3 ${
                  tab === tabName && "text-primary"
                }`}
              >
                {tabName === "All" ? "All Transaction" : tabName}
              </button>
              <span
                className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
                  totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
                } ${tab !== tabName && "hidden"}`}
              >
                {totalData}
                <span
                  className={`${totalData < 100 && "hidden"}`}
                  style={{ fontSize: "10px" }}
                ></span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <DataTable
        loading={isLoading || isFetching}
        data={transactions}
        columns={transactionTableColumns}
        search={{
          placeholder: "Search by Insurance Name",
          onSearch: (value: string) => {
            handleSearch(value);
          },
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
        noDataText="No transaction data available"
        className="table-transactions"
      />
    </div>
  );
}

