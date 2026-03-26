"use client";
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Plus, X } from "react-feather";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@repo/ui";
import { DataTable } from "@/components/ui/DataTable";
import { useSource } from "@/hooks/useSource.hooks";
import { createSourceTableColumns } from "@/components/tableConfig/sourceTableConfig";

export default function SourcePage() {
  const {
    filteredSources,
    totalItems,
    totalPages,
    selectedSource,

    page,
    rowsPerPage,

    drawerOpen,
    hasAccess,
    canEdit,
    canCreate,
    canDelete,

    setPage,
    setRowsPerPage,
    handleSearch,
    setDrawerOpen,

    isLoading,

    handleViewDetail,
    handleEditSource,
    handleDelete,
    addNewSource,
  } = useSource();

  if (hasAccess === false) {
    return null;
  }

  const sourceTableColumns = createSourceTableColumns({
    handleViewDetail,
    handleDelete,
    canDelete,
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Source List</h1>
        <Button
          onClick={addNewSource}
          disabled={!canCreate}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-1" /> Add Source
        </Button>
      </div>

      <DataTable
        loading={isLoading}
        data={filteredSources}
        columns={sourceTableColumns}
        pagination={{
          page,
          totalPages,
          totalItems,
          rowsPerPage,
          onPageChange: setPage,
          onRowsPerPageChange: (e) => setRowsPerPage(+e.target.value || 0),
        }}
        search={{
          placeholder: "Search...",
          onSearch: (value: string) => handleSearch(value),
        }}
        className="source-table"
        noDataText="No source data available"
      />

      <Drawer direction="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerClose className="absolute right-2 top-2">
              <Button variant="ghost" onClick={() => setDrawerOpen(false)}>
                <X />
              </Button>
            </DrawerClose>
            <DrawerTitle className="text-black font-bold text-2xl">
              Details
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col w-full h-full p-4 md:p-6 bg-[#F8F8F8] mt-5 rounded-xl overflow-y-auto">
            <div className="rounded-lg flex flex-col gap-4 text-black">
              <div className="flex gap-2 text-sm font-medium">
                <div className="min-w-40 w-40">Source ID</div>
                <div className="max-w-1 w-1">:</div>
                <div>{selectedSource?.id}</div>
              </div>
              <div className="flex gap-2 text-sm font-bold text-[#016DA1]">
                <div className="min-w-40 w-40">Source Details</div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="min-w-40 w-40">Source Name</div>
                <div className="max-w-1 w-1">:</div>
                <div>{selectedSource?.source_name}</div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="min-w-40 w-40">Type</div>
                <div className="max-w-1 w-1">:</div>
                <div>{selectedSource?.source_type}</div>
              </div>
              {selectedSource?.source_url && (
                <div className="flex gap-2 text-sm font-medium">
                  <div className="min-w-40 w-40">Source URL</div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{selectedSource?.source_url}</div>
                </div>
              )}
              {selectedSource?.insurance_name && (
                <div className="flex gap-2 text-sm font-medium">
                  <div className="min-w-40 w-40">Insurance Name</div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{selectedSource?.insurance_name}</div>
                </div>
              )}
              <div className="flex gap-2 text-sm font-medium">
                <div className="min-w-40 w-40">Created Date</div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {selectedSource?.created_at
                    ? format(new Date(selectedSource.created_at), "dd-MM-yyyy")
                    : "N/A"}
                </div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="min-w-40 w-40">Updated Date</div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {selectedSource?.updated_at
                    ? format(new Date(selectedSource.updated_at), "dd-MM-yyyy")
                    : "N/A"}
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={() =>
                  selectedSource && handleEditSource(selectedSource.id)
                }
                disabled={!canEdit}
                className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 flex items-center justify-center"
              >
                Edit
              </button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
