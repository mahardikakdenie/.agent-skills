'use client';

import noData from '@public/images/no-data.webp';
import Image from 'next/image';
import type { ChangeEvent } from 'react';
import { Upload } from 'react-feather';

import { Box, Button, DataTable } from '@repo/ui';

import { createHospitalTableColumns } from '@/components/table-config/hospital-table-config';
import { CompactTablePagination } from '@/components/ui/compact-table-pagination';
import { DebouncedSearchInput } from '@/components/ui/debounced-search-input';
import { useHospital } from '@/hooks/useHospital.hooks';

export default function HospitalListPage() {
  const {
    hospitals,
    totalPages,
    totalItems,
    page,
    rowsPerPage,
    searchData,
    hasAccess,
    canCreate,
    isLoading,
    setPage,
    handleSearch,
    handleRowsPerPageChange,
    goToUpload,
  } = useHospital();

  if (hasAccess === false) {
    return null;
  }

  const columns = createHospitalTableColumns({
    page,
    rowsPerPage,
  });

  return (
    <Box className="flex min-h-0 flex-1 w-full flex-col gap-3 p-4 md:p-6">
      <Box className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between 2xl:items-center">
        <Box as="h1" className="text-2xl font-bold text-black mt-2 xl:mt-0">
          Hospital
        </Box>
        <Box className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 xl:w-auto 2xl:flex-nowrap">
          <Button
            onClick={goToUpload}
            disabled={!canCreate}
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] sm:ml-auto xl:ml-0"
            leftIcon={<Upload className="w-5 h-5" />}
          >
            Upload
          </Button>
        </Box>
      </Box>

      <DataTable
        className="!gap-3 pb-4 md:pb-6 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        loading={isLoading}
        data={hospitals}
        columns={columns}
        defaultState={{
          columnPinning: {
            left: ['index', 'id_provider', 'name'],
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
            handleRowsPerPageChange({
              target: { value: String(pageSize) },
            } as ChangeEvent<HTMLSelectElement>);
          },
        }}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        emptyState={
          <Box className="sticky left-0 flex min-h-[10rem] w-[100cqw] items-center justify-center gap-2 py-4 md:min-h-[11rem] md:py-5">
            <Box className="flex flex-col items-center justify-center gap-2">
              <Image alt="No hospital data" src={noData} width={128} />
              <Box as="span">No hospital list data available</Box>
            </Box>
          </Box>
        }
        renderToolbar={() => (
          <Box className="w-full">
            <DebouncedSearchInput
              value={searchData}
              placeholder="Search by provider name..."
              ariaLabel="Search by provider name..."
              onDebouncedChange={handleSearch}
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
          getRowId: (row, index) => row?.id || `hospital-row-${index}`,
        }}
      />
    </Box>
  );
}
