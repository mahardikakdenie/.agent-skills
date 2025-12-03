"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "react-feather";
import { DataTable } from "@/components/ui/DataTable";
import { useGroupList } from "@/hooks/useGroupList.hooks";
import { createGroupTableColumns } from "@/components/tableConfig/groupTableConfig";

export default function GroupPage() {
  const {
    groups,
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
    addNewGroup,
  } = useGroupList();

  if (hasAccess === false) {
    return null;
  }

  const groupTableColumns = createGroupTableColumns({
    handleEdit,
    handleDelete,
    canEdit,
    canDelete,
  });

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex gap-2 pb-4 items-center">
        <h1 className="text-black font-bold sm:text-2xl text-xl sm:mt-2">
          Group
        </h1>
        <Button
          onClick={addNewGroup}
          disabled={!canCreate}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
        >
          <Plus className="w-5 h-5 mr-1" /> Add New
        </Button>
      </div>

      <DataTable
        loading={isLoading}
        data={groups}
        columns={groupTableColumns}
        pagination={{
          page,
          totalPages,
          totalItems,
          rowsPerPage,
          onPageChange: setPage,
          onRowsPerPageChange: (e) => setRowsPerPage(+e.target.value || 0),
        }}
        className="group-table"
        noDataText="No group data available"
      />
    </div>
  );
}
