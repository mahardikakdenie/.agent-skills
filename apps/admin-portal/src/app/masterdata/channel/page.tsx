"use client";

import { Button } from "@repo/ui";
import { Plus } from "react-feather";
import { DataTable } from "@/components/ui/DataTable";
import { useChannel } from "@/hooks/useChannel.hooks";
import { createChannelTableColumns } from "@/components/tableConfig/channelTableConfig";

export default function ChannelsPage() {
  const {
    channels,
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
    addNewChannel,
  } = useChannel();

  if (hasAccess === false) {
    return null;
  }

  const channelTableColumns = createChannelTableColumns({
    handleEdit,
    handleDelete,
    canEdit,
    canDelete,
  });

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex gap-2 pb-4 items-center">
        <h1 className="text-black font-bold sm:text-2xl text-xl sm:mt-2">
          Channels
        </h1>
        <Button
          onClick={addNewChannel}
          disabled={!canCreate}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
        >
          <Plus className="w-5 h-5 mr-1" /> Add New
        </Button>
      </div>

      <DataTable
        loading={isLoading}
        data={channels}
        columns={channelTableColumns}
        pagination={{
          page,
          totalPages,
          totalItems,
          rowsPerPage,
          onPageChange: setPage,
          onRowsPerPageChange: (e) => setRowsPerPage(+e.target.value || 0),
        }}
        className="channel-table"
        noDataText="No channel data available"
      />
    </div>
  );
}