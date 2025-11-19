"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { useBrokerFee } from "@/hooks/useBrokerFee.hooks";
import { createBrokerFeeTableColumns } from "@/components/tableConfig/brokerFeeTableConfig";

export default function BrokerFeePage() {
  const {
    filteredBrokerFees,
    totalItems,
    totalPages,

    page,
    rowsPerPage,
    hasAccess,
    canEdit,
    canCreate,
    canDelete,

    setPage,
    setRowsPerPage,
    setSearchTerm,

    isLoading,

    handleEdit,
    handleDelete,
    addNewBrokerFee,
  } = useBrokerFee();

  if (hasAccess === false) {
    return null;
  }

  const brokerFeeTableColumns = createBrokerFeeTableColumns({
    handleEdit,
    handleDelete,
    canEdit,
    canDelete,
  });

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex flex-wrap justify-start gap-4 pb-4 items-center">
        <h1 className="text-black font-bold sm:text-2xl text-xl mt-2 mb-4">
          Broker Fee
        </h1>

        <Button
          onClick={addNewBrokerFee}
          disabled={!canCreate}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
        >
          <PlusIcon className="w-5 h-5 mr-1" /> Create Broker Fee
        </Button>
      </div>

      <DataTable
        loading={isLoading}
        data={filteredBrokerFees}
        columns={brokerFeeTableColumns}
        search={{
          onSearch: (e) => setSearchTerm(e),
          placeholder:
            "Search by Insurance Company Name/Product Name/Plan Name",
        }}
        pagination={{
          page,
          totalPages,
          totalItems,
          rowsPerPage,
          onPageChange: setPage,
          onRowsPerPageChange: (e) => setRowsPerPage(+e.target.value || 0),
        }}
        className="broker-fee-table"
        noDataText="No broker fee data available"
      />
    </div>
  );
}