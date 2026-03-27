"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { PlusIcon } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { usePartnerComm } from "@/hooks/usePartnerComm.hooks";
import { createPartnerCommTableColumns } from "@/components/tableConfig/partnerCommTableConfig";

export default function PartnerCommPage() {
  const {
    partnerComms,
    channels,
    totalItems,
    totalPages,

    page,
    rowsPerPage,
    selectedChannel,
    hasAccess,
    canEdit,
    canCreate,
    canDelete,

    setPage,
    setRowsPerPage,
    setSearchTerm,
    setSelectedChannel,

    isLoading,
    isLoadingChannels,

    handleEdit,
    handleDelete,
    addNewPartnerComm,
  } = usePartnerComm();

  if (hasAccess === false) {
    return null;
  }

  const partnerCommTableColumns = createPartnerCommTableColumns({
    handleEdit,
    handleDelete,
    canEdit,
    canDelete,
  });

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex flex-wrap justify-start gap-4 pb-4 items-center">
        <h1 className="text-black font-bold sm:text-2xl text-xl mt-2 mb-4">
          Partner Comm
        </h1>

        <div className="min-w-48 w-[180px] ml-auto">
          <Select
            value={selectedChannel}
            onValueChange={setSelectedChannel}
            disabled={isLoadingChannels}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="All">All</SelectItem>
                {channels.map((channel: any) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    {channel.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={addNewPartnerComm}
          disabled={!canCreate}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
        >
          <PlusIcon className="w-5 h-5 mr-1" /> Create Partner Comm
        </Button>
      </div>

      <DataTable
        loading={isLoading}
        data={partnerComms}
        columns={partnerCommTableColumns}
        search={{
          onSearch: (e) => setSearchTerm(e),
          placeholder: "Search by Insurance Company Name",
        }}
        pagination={{
          page,
          totalPages,
          totalItems,
          rowsPerPage,
          onPageChange: setPage,
          onRowsPerPageChange: (e) => setRowsPerPage(+e.target.value || 0),
        }}
        className="partner-comm-table"
        noDataText="No partner comm data available"
      />
    </div>
  );
}

