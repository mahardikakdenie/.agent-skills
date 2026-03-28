"use client";

import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@repo/ui";
import { Plus } from "react-feather";
import { useEmailTag } from "@/hooks/useEmailTag.hooks";
import { createEmailTagTableColumns } from "@/components/tableConfig/emailTagTableConfig";
import { ContentLoadingWrapper } from "@/components/ui/Loading/index";

export default function EmailTagPage() {
  const {
    tags,
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
    handleRowsPerPageChange,
    handleEdit,
    handleDelete,
    addNewTag,
  } = useEmailTag();

  const columns = createEmailTagTableColumns({
    handleEdit,
    handleDelete,
    canEdit,
    canDelete,
    page,
    rowsPerPage,
  });

  if (hasAccess === null) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <ContentLoadingWrapper isLoading={isLoading}>
      <div className="flex flex-col w-full p-4 md:p-6">
        <div className="flex gap-2 sm:flex-row flex-col pb-4">
          <h1 className="text-black font-bold sm:text-2xl text-xl sm:mt-2">
            Email Tag
          </h1>
          <Button
            onClick={addNewTag}
            disabled={!canCreate}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
          >
            <Plus className="w-5 h-5 mr-1" /> Add New
          </Button>
        </div>

        <div className="w-full p-4 bg-white rounded-lg">
          <DataTable
            columns={columns}
            data={tags}
            pagination={{
              page,
              totalPages,
              totalItems,
              rowsPerPage,
              onPageChange: setPage,
              onRowsPerPageChange: handleRowsPerPageChange,
            }}
          />
        </div>
      </div>
    </ContentLoadingWrapper>
  );
}