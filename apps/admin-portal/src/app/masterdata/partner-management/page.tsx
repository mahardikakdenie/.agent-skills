"use client";

import { Button } from "@/components/ui/button";
import { Plus, Search } from "react-feather";
import { Input } from "@repo/ui";
import { DataTable } from "@/components/ui/DataTable";
import { usePartnerManagement } from "@/hooks/usePartnerManagement.hooks";
import { createPartnerTableColumns } from "@/components/tableConfig/partnerManagmentTableConfig";

export default function PartnerIntegration() {
  const {
    partners,
    totalPages,
    totalItems,
    page,
    rowsPerPage,
    hasAccess,
    canEdit,
    canCreate,
    canDelete,
    isLoading,
    setPage,
    handleSearch,
    handleEdit,
    handleDelete,
    addNewPartner,
    handleRowsPerPageChange,
  } = usePartnerManagement();

  if (hasAccess === false) {
    return null;
  }

  const partnerTableColumns = createPartnerTableColumns({
    handleEdit,
    handleDelete,
    canEdit,
    canDelete,
    page,
    rowsPerPage,
  });

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex gap-4 pb-4 items-center">
        <h1 className="text-black font-bold sm:text-2xl text-xl sm:mt-2">
          Partner Management
        </h1>
        <div className="relative max-w-sm w-full ml-auto shadow-sm">
          <Input
            type="text"
            placeholder="Search by Name or Email"
            onChange={(e) => handleSearch(e.target.value)}
            className="border p-3 rounded-md pr-10 w-full"
          />
          <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#016da1]" />
        </div>
        <Button
          onClick={addNewPartner}
          disabled={!canCreate}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
        >
          <Plus className="w-5 h-5 mr-1" /> Add New
        </Button>
      </div>

      <DataTable
        loading={isLoading}
        data={partners}
        columns={partnerTableColumns}
        pagination={{
          page,
          totalPages,
          totalItems,
          rowsPerPage,
          onPageChange: setPage,
          onRowsPerPageChange: handleRowsPerPageChange,
        }}
        className="partner-management-table"
        noDataText="No partner data available"
      />
    </div>
  );
}
