'use client';

import noData from '@public/images/no-data.webp';
import { Plus } from 'react-feather';
import Image from 'next/image';

import { Box, Button, DataTable } from '@repo/ui';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';

import { createPartnerCommTableColumns } from '@/components/table-config/partner-comm-table-config';
import { CompactTablePagination } from '@/components/core/compact-table-pagination';
import { DebouncedSearchInput } from '@/components/core/debounced-search-input';
import { usePartnerComm, type PartnerCommItem } from '@/hooks/usePartnerComm.hooks';

export default function PartnerCommPage() {
  const {
    partnerComms,
    channels,
    totalItems,
    totalPages,

    page,
    rowsPerPage,
    searchTerm,
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
    page,
    rowsPerPage,
    handleEdit,
    handleDelete,
    canEdit,
    canDelete,
  });

  return (
    <Box className="flex min-h-0 flex-1 w-full flex-col gap-3 p-4 md:p-6">
      <Box className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between 2xl:items-center">
        <Box as="h1" className="text-2xl font-bold text-black">
          Partner Comm
        </Box>
        <Box className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 xl:w-auto 2xl:flex-nowrap">
          <Box className="min-w-48 w-full sm:w-[180px]">
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
          </Box>
          <Button
            onClick={addNewPartnerComm}
            disabled={!canCreate}
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Create Partner Comm
          </Button>
        </Box>
      </Box>

      <DataTable<PartnerCommItem>
        className="!gap-3 pb-4 md:pb-6 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        loading={isLoading}
        data={partnerComms}
        columns={partnerCommTableColumns}
        defaultState={{
          columnPinning: {
            left: ['id', 'channel_name'],
            right: ['action'],
          },
        }}
        enablePagination={true}
        pagination={{
          pageIndex: page - 1,
          pageSize: rowsPerPage,
          pageCount: totalPages,
          rowCount: totalItems,
          onPageChange: (pageIndex) => {
            if (isLoading) {
              return;
            }

            setPage(pageIndex + 1);
          },
          onPageSizeChange: (pageSize) => {
            if (isLoading) {
              return;
            }

            setRowsPerPage(pageSize);
          },
        }}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        emptyState={
          <Box className="sticky left-0 flex min-h-[10rem] w-[100cqw] items-center justify-center gap-2 py-4 md:min-h-[11rem] md:py-5">
            <Box className="flex flex-col items-center justify-center gap-2">
              <Image alt="No partner comm data" src={noData} width={128} />
              <Box as="span">No partner comm data available</Box>
            </Box>
          </Box>
        }
        renderToolbar={() => (
          <Box className="w-full">
            <DebouncedSearchInput
              value={searchTerm}
              placeholder="Search by Insurance Company Name"
              ariaLabel="Search by Insurance Company Name"
              onDebouncedChange={setSearchTerm}
              className="h-10 rounded-xl border-slate-300 bg-white text-slate-900 shadow-none transition-colors placeholder:text-slate-400 focus-within:ring-0 focus-within:shadow-none"
            />
          </Box>
        )}
        renderPagination={(table) => (
          <Box className="-mt-1">
            <CompactTablePagination
              table={table}
              pageSizeOptions={[10, 20, 30, 50, 100]}
              disabled={isLoading}
            />
          </Box>
        )}
        tableOptions={{
          manualPagination: true,
          enableColumnPinning: true,
          enableColumnResizing: true,
          defaultColumn: {
            minSize: 48,
            size: 96,
          },
          getRowId: (row, index) => row?.id || `partner-comm-row-${index}`,
        }}
      />
    </Box>
  );
}
