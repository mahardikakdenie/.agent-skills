'use client';

import noData from '@public/images/no-data.webp';
import { format } from 'date-fns';
import Image from 'next/image';
import React, { useMemo } from 'react';
import { Plus, Upload, X, Search } from 'react-feather';

import {
  Box,
  Button,
  DataTable,
  Input,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@repo/ui';

import { createSanctionTableColumns } from '@/components/tableConfig/sanctionTableConfig';
import { CompactTablePagination } from '@/components/ui/compact-table-pagination';
import { useSanction } from '@/hooks/useSanction.hooks';

let tableMeasureContext: CanvasRenderingContext2D | null = null;
function measureTextWidth(label: string, font: string, fallbackCharWidth: number) {
  if (typeof document === 'undefined') {
    return label.length * fallbackCharWidth;
  }

  if (!tableMeasureContext) {
    tableMeasureContext = document.createElement('canvas').getContext('2d');
  }

  if (!tableMeasureContext) {
    return label.length * fallbackCharWidth;
  }

  tableMeasureContext.font = font;

  return tableMeasureContext.measureText(label).width;
}

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

  const nameColumnSize = useMemo(
    () =>
      Math.max(
        164,
        Math.ceil(
          Math.max(
            measureTextWidth('Name', '500 14px Arial', 6.8),
            (filteredSanctions || []).reduce((widest: number, item: any) => {
              const label =
                `${item?.first_name || ''} ${item?.middle_name || ''} ${item?.last_name || ''}`.trim() ||
                '-';
              return Math.max(widest, measureTextWidth(label, '400 13px Arial', 6.6));
            }, 0),
          ) + 28,
        ),
      ),
    [filteredSanctions],
  );

  const emailColumnSize = useMemo(
    () =>
      Math.max(
        220,
        Math.ceil(
          Math.max(
            measureTextWidth('Email', '500 14px Arial', 6.8),
            (filteredSanctions || []).reduce((widest: number, item: any) => {
              const label = item?.email || '-';
              return Math.max(widest, measureTextWidth(label, '400 13px Arial', 6.6));
            }, 0),
          ) + 28,
        ),
      ),
    [filteredSanctions],
  );

  const phoneNumberColumnSize = useMemo(
    () =>
      Math.max(
        160,
        Math.ceil(
          Math.max(
            measureTextWidth('Phone Number', '500 14px Arial', 6.8),
            (filteredSanctions || []).reduce((widest: number, item: any) => {
              const label = item?.phone_number || '-';
              return Math.max(widest, measureTextWidth(label, '400 13px Arial', 6.6));
            }, 0),
          ) + 28,
        ),
      ),
    [filteredSanctions],
  );

  const blacklistReasonColumnSize = useMemo(
    () =>
      Math.max(
        160,
        Math.ceil(
          Math.max(
            measureTextWidth('Blacklist Reason', '500 14px Arial', 6.8),
            (filteredSanctions || []).reduce((widest: number, item: any) => {
              const label = item?.blacklist_reason || '-';
              return Math.max(widest, measureTextWidth(label, '600 12px Arial', 6.2));
            }, 0),
          ) + 40,
        ),
      ),
    [filteredSanctions],
  );

  const blacklistedDateColumnSize = useMemo(
    () =>
      Math.min(
        180,
        Math.ceil(
          Math.max(
            measureTextWidth('Blacklisted Date', '500 14px Arial', 6.8),
            (filteredSanctions || []).reduce((widest: number, item: any) => {
              const label = item?.date_blacklisted
                ? format(new Date(item.date_blacklisted), 'dd-MM-yyyy')
                : '0000-00-00';
              return Math.max(widest, measureTextWidth(label, '400 12px Arial', 6.1));
            }, 0),
          ) + 40,
        ),
      ),
    [filteredSanctions],
  );

  const createdAtColumnSize = useMemo(
    () =>
      Math.min(
        180,
        Math.ceil(
          Math.max(
            measureTextWidth('Created At', '500 14px Arial', 6.8),
            (filteredSanctions || []).reduce((widest: number, item: any) => {
              const label = item?.created_at
                ? format(new Date(item.created_at), 'dd-MM-yyyy')
                : '0000-00-00';
              return Math.max(widest, measureTextWidth(label, '400 12px Arial', 6.1));
            }, 0),
          ) + 40,
        ),
      ),
    [filteredSanctions],
  );

  const actionColumnSize = useMemo(
    () =>
      Math.max(
        120,
        Math.ceil(
          Math.max(
            measureTextWidth('Action', '500 14px Arial', 6.8),
            measureTextWidth('View', '500 13px Arial', 6.6) + 72,
          ) + 24,
        ),
      ),
    [],
  );

  if (hasAccess === false) {
    return null;
  }

  const sanctionTableColumns = createSanctionTableColumns({
    page,
    rowsPerPage,
    handleViewDetail,
    handleDelete,
    canDelete,
    nameColumnSize,
    phoneNumberColumnSize,
    emailColumnSize,
    blacklistReasonColumnSize,
    blacklistedDateColumnSize,
    createdAtColumnSize,
    actionColumnSize,
  });

  return (
    <Box className="flex w-full flex-col gap-3 p-4 md:p-6">
      <Box className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between 2xl:items-center">
        <Box as="h1" className="text-black font-bold sm:text-2xl text-xl sm:mt-2">
          Sanction List
        </Box>

        <Box className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 xl:w-auto 2xl:flex-nowrap">
          <Button
            onClick={addNewSanction}
            disabled={!canCreate}
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] sm:ml-auto xl:ml-0"
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Add Sanction
          </Button>
          <Button
            onClick={uploadSanction}
            disabled={!canCreate}
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
            leftIcon={<Upload className="w-5 h-5" />}
          >
            Upload Sanction
          </Button>
        </Box>
      </Box>

      <DataTable
        className="!gap-3 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        loading={isLoading}
        data={filteredSanctions}
        columns={sanctionTableColumns}
        defaultState={{
          columnPinning: {
            left: ['index', 'name'],
            right: ['action'],
          },
        }}
        pagination={{
          pageIndex: page - 1,
          pageSize: rowsPerPage,
          pageCount: totalPages,
          rowCount: totalItems,
          onPageChange: (pageIndex) => {
            if (isLoading) return;
            setPage(pageIndex + 1);
          },
          onPageSizeChange: (pageSize) => {
            if (isLoading) return;
            setRowsPerPage(pageSize);
          },
        }}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        emptyState={
          <Box className="sticky left-0 flex min-h-[10rem] w-[100cqw] items-center justify-center gap-2 py-4 md:min-h-[11rem] md:py-5">
            <Box className="flex flex-col items-center justify-center gap-2">
              <Image alt="No sanction data" src={noData} width={128} />
              <Box as="span">No sanction data available</Box>
            </Box>
          </Box>
        }
        renderToolbar={() => (
          <Box className="w-full">
            <Input
              type="text"
              placeholder="Search by name, ID, or email"
              aria-label="Search sanctions"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 rounded-xl border-slate-300 bg-white text-slate-900 shadow-none transition-colors placeholder:text-slate-400 focus-within:ring-0 focus-within:shadow-none"
              rightIcon={<Search aria-hidden="true" className="h-4 w-4 text-[#016da1]" />}
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
          getRowId: (row, index) => row?.id || `sanction-row-${index}`,
        }}
      />

      <Drawer direction="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <DrawerContent className="max-w-[30rem]">
          <DrawerHeader className="gap-0 pb-2 md:pb-4">
            <DrawerClose className="absolute right-3 top-3">
              <Button
                variant="ghost"
                onClick={() => setDrawerOpen(false)}
                className="h-8 w-8 rounded-full p-0 shadow-none"
              >
                <X className="h-4.5 w-4.5" />
              </Button>
            </DrawerClose>
            <DrawerTitle className="pr-10 text-2xl font-bold tracking-tight text-black">
              Sanction Details
            </DrawerTitle>
          </DrawerHeader>
          <Box className="flex-1 overflow-y-auto px-6 pt-2 pb-6 md:pb-8">
            <DrawerDescription className="block text-inherit">
              <Box className="w-full rounded-2xl bg-slate-50/80 p-4 ring-1 ring-slate-200/70 md:p-5">
                <Box className="flex flex-col gap-3.5 text-black">
                  <Box className="grid gap-3">
                    <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                      <Box className="font-medium text-slate-700">Sanction ID</Box>
                      <Box className="text-slate-400">:</Box>
                      <Box className="min-w-0 break-all text-slate-900">
                        {selectedSanction?.id || '-'}
                      </Box>
                    </Box>

                    <Box className="col-span-full pt-1 pb-0.5">
                      <Box className="text-[13px] font-bold text-[#016DA1]">Identity Details</Box>
                    </Box>
                    <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                      <Box className="font-medium text-slate-700">Name</Box>
                      <Box className="text-slate-400">:</Box>
                      <Box className="min-w-0 break-words text-slate-900">
                        {`${selectedSanction?.first_name || ''}${
                          selectedSanction?.middle_name ? ` ${selectedSanction.middle_name}` : ''
                        }${selectedSanction?.last_name ? ` ${selectedSanction.last_name}` : ''}`.trim() ||
                          '-'}
                      </Box>
                    </Box>

                    <Box className="col-span-full pt-1 pb-0.5">
                      <Box className="text-[13px] font-bold text-[#016DA1]">Personal Details</Box>
                    </Box>
                    <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                      <Box className="font-medium text-slate-700">ID Number</Box>
                      <Box className="text-slate-400">:</Box>
                      <Box className="min-w-0 break-words text-slate-900">
                        {selectedSanction?.id_number || '-'}
                      </Box>
                    </Box>
                    <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                      <Box className="font-medium text-slate-700">Phone Number</Box>
                      <Box className="text-slate-400">:</Box>
                      <Box className="min-w-0 break-words text-slate-900">
                        {selectedSanction?.phone_number || '-'}
                      </Box>
                    </Box>
                    <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                      <Box className="font-medium text-slate-700">Email</Box>
                      <Box className="text-slate-400">:</Box>
                      <Box className="min-w-0 break-words text-slate-900">
                        {selectedSanction?.email || '-'}
                      </Box>
                    </Box>

                    <Box className="col-span-full pt-1 pb-0.5">
                      <Box className="text-[13px] font-bold text-[#016DA1]">Details</Box>
                    </Box>
                    <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                      <Box className="font-medium text-slate-700">Blacklisted Date</Box>
                      <Box className="text-slate-400">:</Box>
                      <Box className="min-w-0 break-words text-slate-900">
                        {selectedSanction?.date_blacklisted
                          ? format(new Date(selectedSanction.date_blacklisted), 'dd-MM-yyyy')
                          : 'N/A'}
                      </Box>
                    </Box>
                    <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                      <Box className="font-medium text-slate-700">Blacklisted Reason</Box>
                      <Box className="text-slate-400">:</Box>
                      <Box className="min-w-0 break-words text-slate-900">
                        {selectedSanction?.blacklist_reason || '-'}
                      </Box>
                    </Box>
                    <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                      <Box className="font-medium text-slate-700">Created At</Box>
                      <Box className="text-slate-400">:</Box>
                      <Box className="min-w-0 break-words text-slate-900">
                        {selectedSanction?.created_at
                          ? format(new Date(selectedSanction.created_at), 'dd-MM-yyyy')
                          : 'N/A'}
                      </Box>
                    </Box>
                    <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                      <Box className="font-medium text-slate-700">Updated At</Box>
                      <Box className="text-slate-400">:</Box>
                      <Box className="min-w-0 break-words text-slate-900">
                        {selectedSanction?.updated_at
                          ? format(new Date(selectedSanction.updated_at), 'dd-MM-yyyy')
                          : 'N/A'}
                      </Box>
                    </Box>
                  </Box>

                  <Box className="pt-0">
                    <Button
                      onClick={() => selectedSanction && handleEditSanction(selectedSanction.id)}
                      disabled={!canEdit}
                      className="h-9 w-full rounded-full bg-[#F5BA41] px-4 text-black shadow-none hover:bg-[#e6a92d]"
                    >
                      Edit
                    </Button>
                  </Box>
                </Box>
              </Box>
            </DrawerDescription>
          </Box>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
