'use client';

import noData from '@public/images/no-data.webp';
import Image from 'next/image';
import { useMemo, type ChangeEvent } from 'react';

import { Box, DataTable } from '@repo/ui';

import { createUnmatchBillingTableColumns } from '@/components/table-config/unmatch-billing-table-config';
import { CompactTablePagination } from '@/components/core/compact-table-pagination';
import { formatDate, formatDateTime } from '@/lib/formatter';

import { useBilling } from '../billing/hook';

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

export default function UnmatchedBillingPage() {
  const {
    unmatchedReconcillBillings,
    unmatchedReconcillBillingsMeta,
    isLoadingUnmatchedReconcillBillings,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
  } = useBilling();

  const totalItems = unmatchedReconcillBillingsMeta?.total || 0;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const getStatusColor = (status: string) => {
    if (status === 'not-found-in-system') return 'red';
    if (status === 'not-found-in-excel') return 'orange';

    return 'inherit';
  };

  const formatStatus = (status: string) => {
    return (status?.split('-') || [])
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const billingNoColumnSize = useMemo(
    () =>
      Math.min(
        240,
        Math.ceil(
          Math.max(
            measureTextWidth('Billing No.', '500 14px Arial', 6.8),
            (unmatchedReconcillBillings || []).reduce((widest, item) => {
              const label = item.billings?.billing_no || '-';
              return Math.max(widest, measureTextWidth(label, '400 12px Arial', 6.1));
            }, 0),
          ) + 52,
        ),
      ),
    [unmatchedReconcillBillings],
  );

  const transactionNoColumnSize = useMemo(
    () =>
      Math.min(
        240,
        Math.ceil(
          Math.max(
            measureTextWidth('Transaction Number', '500 14px Arial', 6.8),
            (unmatchedReconcillBillings || []).reduce((widest, item) => {
              const label = item.transaction_no || '-';
              return Math.max(widest, measureTextWidth(label, '400 12px Arial', 6.1));
            }, 0),
          ) + 52,
        ),
      ),
    [unmatchedReconcillBillings],
  );

  const transactionDateColumnSize = useMemo(
    () =>
      Math.min(
        220,
        Math.ceil(
          Math.max(
            measureTextWidth('Transaction Date', '500 14px Arial', 6.8),
            (unmatchedReconcillBillings || []).reduce((widest, item) => {
              const dateValue = item.details?.transaction_date || item.created_at;
              const label = dateValue ? formatDateTime(dateValue) : '-';
              return Math.max(widest, measureTextWidth(label, '400 12px Arial', 6.1));
            }, 0),
          ) + 40,
        ),
      ),
    [unmatchedReconcillBillings],
  );

  const currencyColumnSize = useMemo(
    () =>
      Math.min(
        120,
        Math.ceil(
          Math.max(
            measureTextWidth('Currency', '500 14px Arial', 7.2),
            (unmatchedReconcillBillings || []).reduce((widest, item) => {
              const label = item.billings?.currency || 'IDR';
              return Math.max(widest, measureTextWidth(label, '600 12px Arial', 6.2));
            }, 0),
          ) + 28,
        ),
      ),
    [unmatchedReconcillBillings],
  );

  const amountColumnSize = useMemo(
    () =>
      Math.min(
        240,
        Math.ceil(
          Math.max(
            measureTextWidth('Amount', '500 14px Arial', 6.8),
            (unmatchedReconcillBillings || []).reduce((widest, item) => {
              const label = item.amount || '0';
              return Math.max(widest, measureTextWidth(label, '400 13px Arial', 6.6));
            }, 0),
          ) + 28,
        ),
      ),
    [unmatchedReconcillBillings],
  );

  const statusColumnSize = useMemo(
    () =>
      Math.min(
        160,
        Math.ceil(
          Math.max(
            measureTextWidth('Status', '500 14px Arial', 6.8),
            (unmatchedReconcillBillings || []).reduce((widest, item) => {
              const label = formatStatus(item.status_reconcilliation) || '-';
              return Math.max(widest, measureTextWidth(label, '600 11px Arial', 5.9));
            }, 0),
          ) + 60,
        ),
      ),
    [unmatchedReconcillBillings],
  );

  const columns = createUnmatchBillingTableColumns({
    page,
    rowsPerPage,
    billingNoColumnSize,
    transactionNoColumnSize,
    transactionDateColumnSize,
    currencyColumnSize,
    amountColumnSize,
    statusColumnSize,
    formatStatus,
    getStatusColor,
  });

  return (
    <Box className="flex min-h-0 flex-1 w-full flex-col gap-3 p-4 md:p-6">
      <Box className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between 2xl:items-center">
        <Box as="h1" className="text-2xl font-bold text-black">
          Unmatched Reconciliation Billing List
        </Box>
      </Box>

      <DataTable
        className="!gap-3 pb-4 md:pb-6 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        loading={isLoadingUnmatchedReconcillBillings}
        data={unmatchedReconcillBillings || []}
        columns={columns}
        pagination={{
          pageIndex: page - 1,
          pageSize: rowsPerPage,
          pageCount: totalPages,
          rowCount: totalItems,
          onPageChange: (pageIndex) => {
            setPage(pageIndex + 1);
          },
          onPageSizeChange: (pageSize) => {
            setRowsPerPage(pageSize);
          },
        }}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        emptyState={
          <Box className="sticky left-0 flex min-h-[10rem] w-[100cqw] items-center justify-center gap-2 py-4 md:min-h-[11rem] md:py-5">
            <Box className="flex flex-col items-center justify-center gap-2">
              <Image alt="No unmatched transactions found" src={noData} width={128} />
              <Box as="span">No unmatched transactions found</Box>
            </Box>
          </Box>
        }
        renderPagination={(table) => (
          <Box className="-mt-1">
            <CompactTablePagination
              table={table}
              pageSizeOptions={[10, 20, 30, 50, 100]}
              disabled={isLoadingUnmatchedReconcillBillings}
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
          getRowId: (row, index) => row?.id || `unmatch-billing-row-${index}`,
        }}
      />
    </Box>
  );
}
