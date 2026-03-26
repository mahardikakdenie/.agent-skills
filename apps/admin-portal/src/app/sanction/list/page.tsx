"use client";
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Plus, Upload, X } from "react-feather";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@repo/ui";
import { DataTable } from "@/components/ui/DataTable";
import { useSanction } from "@/hooks/useSanction.hooks";
import { createSanctionTableColumns } from "@/components/tableConfig/sanctionTableConfig";

export default function SanctionPage() {
  const {
    filteredSanctions,
    totalItems,
    totalPages,
    selectedSanction,

    page,
    rowsPerPage,
    drawerOpen,
    hasAccess,
    canEdit,
    canCreate,
    canDelete,

    setPage,
    setRowsPerPage,
    setSearchTerm,
    setDrawerOpen,

    isLoading,

    handleViewDetail,
    handleEditSanction,
    handleDelete,
    addNewSanction,
    uploadSanction,
  } = useSanction();

  if (hasAccess === false) {
    return null;
  }

  const sanctionTableColumns = createSanctionTableColumns({
    handleViewDetail,
    handleDelete,
    canDelete,
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Sanction List</h1>
        <div className="flex space-x-2">
          <Button
            onClick={addNewSanction}
            disabled={!canCreate}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-1" /> Add Sanction
          </Button>
          <Button
            className="rounded-full ml-auto bg-[#F5BA41] hover:bg-[#e4ab3a] text-black"
            onClick={uploadSanction}
            disabled={!canCreate}
          >
            <Upload width={20} height={20} />
            <span className="ml-1">Upload Sanction</span>
          </Button>
        </div>
      </div>

      <DataTable
        loading={isLoading}
        data={filteredSanctions}
        columns={sanctionTableColumns}
        search={{
          onSearch: (e) => setSearchTerm(e),
          placeholder: "Search by name, ID, or email",
        }}
        pagination={{
          page,
          totalPages,
          totalItems,
          rowsPerPage,
          onPageChange: setPage,
          onRowsPerPageChange: (e) => setRowsPerPage(+e.target.value || 0),
        }}
        className="sanction-table"
        noDataText="No sanction data available"
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
                <div className="min-w-40 w-40">Sanction ID</div>
                <div className="max-w-1 w-1">:</div>
                <div>{selectedSanction?.id}</div>
              </div>
              <div className="flex gap-2 text-sm font-bold text-[#016DA1]">
                <div className="min-w-40 w-40">Identity Details</div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="min-w-40 w-40">Name</div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {`${selectedSanction?.first_name}${
                    selectedSanction?.middle_name
                      ? ` ${selectedSanction.middle_name}`
                      : ""
                  }${
                    selectedSanction?.last_name
                      ? ` ${selectedSanction.last_name}`
                      : ""
                  }`}
                </div>
              </div>
              <div className="flex gap-2 text-sm font-bold text-[#016DA1]">
                <div className="min-w-40 w-40">Personal Details</div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="min-w-40 w-40">ID Number</div>
                <div className="max-w-1 w-1">:</div>
                <div>{selectedSanction?.id_number}</div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="min-w-40 w-40">Phone Number</div>
                <div className="max-w-1 w-1">:</div>
                <div>{selectedSanction?.phone_number}</div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="min-w-40 w-40">Email</div>
                <div className="max-w-1 w-1">:</div>
                <div>{selectedSanction?.email}</div>
              </div>
              <div className="flex gap-2 text-sm font-bold text-[#016DA1]">
                <div className="min-w-40 w-40">Details</div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="min-w-40 w-40">Blacklisted Date</div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {selectedSanction?.date_blacklisted
                    ? format(
                        new Date(selectedSanction.date_blacklisted),
                        "dd-MM-yyyy"
                      )
                    : "N/A"}
                </div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="min-w-40 w-40">Blacklisted Reason</div>
                <div className="max-w-1 w-1">:</div>
                <div>{selectedSanction?.blacklist_reason}</div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="min-w-40 w-40">Created At</div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {selectedSanction?.created_at
                    ? format(
                        new Date(selectedSanction.created_at),
                        "dd-MM-yyyy"
                      )
                    : "N/A"}
                </div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="min-w-40 w-40">Updated At</div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {selectedSanction?.updated_at
                    ? format(
                        new Date(selectedSanction.updated_at),
                        "dd-MM-yyyy"
                      )
                    : "N/A"}
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={() =>
                  selectedSanction && handleEditSanction(selectedSanction.id)
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
