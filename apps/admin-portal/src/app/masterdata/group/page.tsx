'use client';

import noData from '@public/images/no-data.webp';
import Image from 'next/image';
import { Plus } from 'react-feather';

import { Box, Button, DataTable } from '@repo/ui';

import { createGroupTableColumns } from '@/components/table-config/group-table-config';
import { CompactTablePagination } from '@/components/core/compact-table-pagination';
import { useGroupList } from '@/hooks/useGroupList.hooks';

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
          Group
        </Box>
        <Box className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 xl:w-auto 2xl:flex-nowrap">
          <Button
            onClick={addNewGroup}
            disabled={!canCreate}
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] sm:ml-auto"
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Add New
          </Button>
        </Box>
      </Box>

      <DataTable
        className="!gap-3 pb-4 md:pb-6 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        loading={isLoading}
        data={groups}
        columns={groupTableColumns}
        defaultState={{
          columnPinning: {
            left: ['id', 'name'],
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
              <Image alt="No group data" src={noData} width={128} />
              <Box as="span">No group data available</Box>
            </Box>
          </Box>
        }
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
          getRowId: (row, index) => row?.id || `group-row-${index}`,
        }}
      />
    </Box>
  );
}
