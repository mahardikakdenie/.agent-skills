"use client";

import { Button } from "@repo/ui";
import { Plus } from "react-feather";
import { DataTable } from "@/components/ui/DataTable";
import { usePageManagement } from "@/hooks/usePageManagement.hooks";
import { createPageTableColumns } from "@/components/tableConfig/pageManagementTableConfig";

export default function PageManagement() {
  const {
    pages,
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
    setRowsPerPage,
    handleEdit,
    handleDelete,
    addNewPage,
  } = usePageManagement();

  const pageTableColumns = createPageTableColumns({
    page,
    rowsPerPage,
    handleEdit,
    handleDelete,
    canEdit,
    canDelete,
  });

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex gap-2 pb-4 items-center">
        <h1 className="text-black font-bold sm:text-2xl text-xl sm:mt-2">
          Page Management
        </h1>
        <Button
          onClick={addNewPage}
          disabled={!canCreate}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
        >
          <Plus className="w-5 h-5 mr-1" /> Add New
        </Button>
      </div>

      <DataTable
        loading={isLoading}
        data={pages}
        columns={pageTableColumns}
        pagination={{
          page,
          totalPages,
          totalItems,
          rowsPerPage,
          onPageChange: setPage,
          onRowsPerPageChange: (e) => setRowsPerPage(+e.target.value || 0),
        }}
        className="page-management-table"
        noDataText="No page data available"
      />
    </div>
  );
}