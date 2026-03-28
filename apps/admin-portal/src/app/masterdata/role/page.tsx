"use client";

import { Button } from "@repo/ui";
import { Plus } from "react-feather";
import { DataTable } from "@/components/ui/DataTable";
import { useRole } from "@/hooks/useRole.hooks";
import { createRoleTableColumns } from "@/components/tableConfig/roleTableConfig";

export default function RolesPage() {
  const {
    roles,
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
    addNewRole,
  } = useRole();

  if (hasAccess === false) {
    return null;
  }

  const roleTableColumns = createRoleTableColumns({
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
          Roles
        </h1>
        <Button
          onClick={addNewRole}
          disabled={!canCreate}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
        >
          <Plus className="w-5 h-5 mr-1" /> Add New
        </Button>
      </div>

      <DataTable
        loading={isLoading}
        data={roles}
        columns={roleTableColumns}
        pagination={{
          page,
          totalPages,
          totalItems,
          rowsPerPage,
          onPageChange: setPage,
          onRowsPerPageChange: (e) => setRowsPerPage(+e.target.value || 0),
        }}
        className="role-table"
        noDataText="No role data available"
      />
    </div>
  );
}