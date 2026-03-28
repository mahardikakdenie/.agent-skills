"use client";

import { Button } from "@repo/ui";
import { Plus } from "react-feather";
import { DataTable } from "@/components/ui/DataTable";
import { useCurrency } from "@/hooks/useCurrency.hooks";
import { createCurrencyTableColumns } from "@/components/tableConfig/currencyTableConfig";

export default function Currency() {
  const {
    insurances,
    totalPages,
    totalItems,
    page,
    rowsPerPage,
    hasAccess,
    canEdit,
    canCreate,
    isLoading,
    setPage,
    setRowsPerPage,
    handleEdit,
    addNewCurrency,
  } = useCurrency();

  if (hasAccess === false) {
    return null;
  }

  const currencyTableColumns = createCurrencyTableColumns({
    handleEdit,
    canEdit,
  });

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex gap-2 pb-4 items-center">
        <h1 className="text-black font-bold sm:text-2xl text-xl sm:mt-2">
          Currency
        </h1>
        <Button
          onClick={addNewCurrency}
          disabled={!canCreate}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
        >
          <Plus className="w-5 h-5 mr-1" /> Add New
        </Button>
      </div>

      <DataTable
        loading={isLoading}
        data={insurances}
        columns={currencyTableColumns}
        pagination={{
          page,
          totalPages,
          totalItems,
          rowsPerPage,
          onPageChange: setPage,
          onRowsPerPageChange: (e) => setRowsPerPage(+e.target.value || 0),
        }}
        className="currency-table"
        noDataText="No currency data available"
      />
    </div>
  );
}