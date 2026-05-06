'use client';

import noData from '@public/images/no-data.webp';
import { format } from 'date-fns';
import Image from 'next/image';
import React from 'react';
import { Plus, X } from 'react-feather';

import {
  Box,
  Button,
  DataTable,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@repo/ui';

import {
  createSourceTableColumns,
  type SourceItem,
} from '@/components/tableConfig/sourceTableConfig';
import { CompactTablePagination } from '@/components/ui/compact-table-pagination';
import { DebouncedSearchInput } from '@/components/ui/debounced-search-input';
import { useSource } from '@/hooks/useSource.hooks';
import { cn } from '@/lib/utils';

export default function SourcePage() {
  const {
    filteredSources,
    totalItems,
    totalPages,
    selectedSource,

    page,
    rowsPerPage,
    searchTerm,

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
    page,
    rowsPerPage,
    handleViewDetail,
    handleDelete,
    canEdit,
    canDelete,
  });

  const detailRows = [
    {
      label: 'Source ID',
      value: selectedSource?.id || '-',
    },
    {
      label: 'Source Name',
      value: selectedSource?.source_name || '-',
    },
    {
      label: 'Type',
      value: selectedSource?.source_type || '-',
    },
    {
      label: 'Source URL',
      value: selectedSource?.source_url || '-',
    },
    {
      label: 'Insurance Name',
      value: selectedSource?.insurance_name || '-',
    },
    {
      label: 'Created Date',
      value: selectedSource?.created_at
        ? format(new Date(selectedSource.created_at), 'dd-MM-yyyy')
        : 'N/A',
    },
    {
      label: 'Updated Date',
      value: selectedSource?.updated_at
        ? format(new Date(selectedSource.updated_at), 'dd-MM-yyyy')
        : 'N/A',
    },
  ];

  return (
    <Box className="flex min-h-0 flex-1 w-full flex-col gap-3 p-4 md:p-6">
      <Box className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between 2xl:items-center">
        <Box as="h1" className="text-2xl font-bold text-black">
          Source List
        </Box>
        <Box className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 xl:w-auto 2xl:flex-nowrap">
          <Button
            onClick={addNewSource}
            disabled={!canCreate}
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Add Source
          </Button>
        </Box>
      </Box>

      <DataTable<SourceItem>
        className="!gap-3 pb-4 md:pb-6 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        loading={isLoading}
        data={filteredSources}
        columns={sourceTableColumns}
        defaultState={{
          columnPinning: {
            left: ['id', 'source_name'],
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
              <Image alt="No source data" src={noData} width={128} />
              <Box as="span">No source data available</Box>
            </Box>
          </Box>
        }
        renderToolbar={() => (
          <Box className="w-full">
            <DebouncedSearchInput
              value={searchTerm}
              placeholder="Search by Source Name"
              ariaLabel="Search by Source Name"
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
          getRowId: (row, index) => row?.id || `source-row-${index}`,
        }}
      />

      <Drawer direction="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <DrawerContent className="max-w-[30rem]">
          <DrawerHeader className="gap-0 pb-0">
            <DrawerClose className="absolute right-3 top-3">
              <Button
                variant="ghost"
                className="h-8 w-8 rounded-full p-0 shadow-none"
                onClick={() => setDrawerOpen(false)}
              >
                <X className="h-4.5 w-4.5" />
              </Button>
            </DrawerClose>
            <DrawerTitle className="pr-10 text-2xl font-bold tracking-tight text-black">
              Source Details
            </DrawerTitle>
            <DrawerDescription className="mt-4 block text-inherit">
              <Box className="w-full rounded-2xl bg-slate-50/80 p-4 ring-1 ring-slate-200/70 md:p-5">
                <Box className="flex flex-col gap-3.5 text-black">
                  <Box className="grid gap-3">
                    {detailRows.map((item) => (
                      <Box
                        key={item.label}
                        className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5"
                      >
                        <Box className="font-medium text-slate-700">{item.label}</Box>
                        <Box className="text-slate-400">:</Box>
                        <Box className="min-w-0 break-words text-slate-900">{item.value}</Box>
                      </Box>
                    ))}
                  </Box>

                  <Box className="flex justify-center mt-4">
                    <Button
                      onClick={() => selectedSource && handleEditSource(selectedSource.id)}
                      disabled={!canEdit}
                      className="h-10 rounded-full bg-[#F5BA41] px-8 text-black hover:bg-[#e6a92d] shadow-none"
                    >
                      Edit
                    </Button>
                  </Box>
                </Box>
              </Box>
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
