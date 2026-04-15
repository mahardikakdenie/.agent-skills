'use client';

import noData from '@public/images/no-data.webp';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo, type ChangeEvent } from 'react';

import {
  Box,
  DataTable,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';

import { createPendingRenewalsTableColumns } from '@/components/tableConfig/policyTableConfig';
import { DebouncedSearchInput } from '@/components/ui/debounced-search-input';
import { CompactTablePagination } from '@/components/ui/compact-table-pagination';
import AppURL from '@/constants/app-url.const';
import usePolicies from '@/hooks/usePolicies.hooks';

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

export default function PendingRenewals() {
  const router = useRouter();

  const {
    policies,
    channels,
    totalPages,
    totalItems,

    page,
    rowsPerPage,
    searchChannel,
    searchData,

    isLoading,
    isLoadingChannels,
    isFetching,

    setPage,
    handleSearch,
    handleRowsPerPageChange,
    handleChannelChange,
  } = usePolicies(true);

  const goToDetail = (policyId: string) => {
    router.push(`${AppURL.policyDetail}/${policyId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Declaration':
        return 'text-[#016DA1]';
      case 'Grace Period':
        return 'text-orange-500';
      case 'Expired':
        return 'text-gray-400';
      default:
        return 'text-[#016DA1]';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'D-30':
        return 'text-green-600';
      case 'D-14':
        return 'text-yellow-600';
      case 'D-7':
        return 'text-orange-600';
      case 'D-1':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const policyNumberColumnSize = useMemo(
    () =>
      Math.min(
        240,
        Math.ceil(
          Math.max(
            measureTextWidth('PLC-20260402-0003', '400 12px Arial', 6.1),
            measureTextWidth('Policy Number', '500 14px Arial', 6.8),
            policies.reduce((widest, policy) => {
              const label = policy?.number || '-';

              return Math.max(widest, measureTextWidth(label, '400 12px Arial', 6.1));
            }, 0),
          ) + 52,
        ),
      ),
    [policies],
  );

  const expiryDateColumnSize = useMemo(
    () =>
      Math.min(
        180,
        Math.ceil(
          Math.max(
            measureTextWidth('Expiry Date', '500 14px Arial', 6.8),
            policies.reduce((widest, policy) => {
              const label = policy?.end_date || '0000-00-00';

              return Math.max(widest, measureTextWidth(label, '400 12px Arial', 6.1));
            }, 0),
          ) + 40,
        ),
      ),
    [policies],
  );

  const statusColumnSize = useMemo(
    () =>
      Math.min(
        160,
        Math.ceil(
          Math.max(
            measureTextWidth('Status', '500 14px Arial', 6.8),
            policies.reduce((widest, policy) => {
              const label = policy?.status || '-';

              return Math.max(widest, measureTextWidth(label, '600 11px Arial', 5.9));
            }, 0),
          ) + 60,
        ),
      ),
    [policies],
  );

  const actionColumnSize = useMemo(
    () =>
      Math.max(
        80,
        Math.ceil(
          Math.max(
            measureTextWidth('Action', '500 14px Arial', 6.8),
            measureTextWidth('View', '600 11px Arial', 5.9) + 18,
          ) + 24,
        ),
      ),
    [],
  );

  const policyTableColumns = createPendingRenewalsTableColumns({
    page,
    rowsPerPage,
    policyNumberColumnSize,
    expiryDateColumnSize,
    statusColumnSize,
    actionColumnSize,
    onGoToDetail: goToDetail,
    getStatusColor,
    getStageColor,
  });

  const isPaginationBusy = isLoading || isFetching;

  return (
    <Box className="flex min-h-0 flex-1 w-full flex-col gap-3 p-4 md:p-6">
      <Box className="flex flex-col gap-3">
        <Box as="h1" className="text-black font-bold text-2xl mt-2 sm:w-auto w-full mr-auto">
          Pending Renewals
        </Box>
        <Box as="p" className="text-sm font-medium">
          Pantau polis yang akan segera berakhir. Daftar hanya menampilkan polis aktif dalam masa
          follow-up.
        </Box>
      </Box>

      <DataTable
        className="!gap-3 pb-4 md:pb-6 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        loading={isPaginationBusy}
        data={policies}
        columns={policyTableColumns}
        defaultState={{
          columnPinning: {
            left: ['id', 'planName'],
            right: ['status', 'action'],
          },
        }}
        pagination={{
          pageIndex: page - 1,
          pageSize: rowsPerPage,
          pageCount: totalPages,
          rowCount: totalItems,
          onPageChange: (pageIndex) => {
            if (isPaginationBusy) {
              return;
            }

            setPage(pageIndex + 1);
          },
          onPageSizeChange: (pageSize) => {
            if (isPaginationBusy) {
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
              <Image alt="No policy data" src={noData} width={128} />
              <Box as="span">No policy data available</Box>
            </Box>
          </Box>
        }
        renderToolbar={() => (
          <Box className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <Box className="w-full sm:w-52 sm:shrink-0">
              <Select value={searchChannel} onValueChange={handleChannelChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {channels.map((item, index) => (
                      <SelectItem key={index} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Box>
            <Box className="w-full flex-1">
              <DebouncedSearchInput
                value={searchData}
                placeholder="Search by Plan Name"
                ariaLabel="Search by Plan Name"
                onDebouncedChange={handleSearch}
                className="h-10 rounded-xl border-slate-300 bg-white text-slate-900 shadow-none transition-colors placeholder:text-slate-400 focus-within:ring-0 focus-within:shadow-none"
              />
            </Box>
          </Box>
        )}
        renderPagination={(table) => (
          <Box className="-mt-1">
            <CompactTablePagination
              table={table}
              pageSizeOptions={[10, 20, 30, 50, 100]}
              disabled={isPaginationBusy}
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
          getRowId: (row, index) => row?.id || `policy-row-${index}`,
        }}
      />
    </Box>
  );
}
