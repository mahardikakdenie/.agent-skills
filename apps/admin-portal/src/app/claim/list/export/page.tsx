'use client';

import { useMemo } from 'react';

import noData from '@public/images/no-data.webp';
import Image from 'next/image';
import { Download } from 'react-feather';

import { Box, Button, DataTable, type ColumnDef } from '@repo/ui';

import { PageHeader } from '@/components/page-header';
import AppURL from '@/constants/app-url.const';
import useExportClaim from '@/hooks/useExportClaim.hooks';
import { cn } from '@/lib/utils';

const getClaimStatusTone = (status: string) => {
  switch (status) {
    case 'Submitted':
      return 'border border-amber-200/80 bg-amber-50 text-amber-700';
    case 'Acknowledged':
    case 'Document Review Operator':
    case 'Reupload Document Review Operator':
    case 'Document Review Insurance':
    case 'Reupload Document Review Insurance':
    case 'Claim Assessment':
      return 'border border-sky-200/80 bg-sky-50 text-sky-700';
    case 'Approved':
    case 'Paid':
      return 'border border-emerald-200/80 bg-emerald-50 text-emerald-700';
    case 'Lack of Documents Operator':
    case 'Lack of Documents Insurance':
    case 'Rejected':
      return 'border border-rose-200/80 bg-rose-50 text-rose-700';
    case 'Closed':
      return 'border border-slate-200/80 bg-slate-50 text-slate-500';
    default:
      return 'border border-slate-200/80 bg-slate-50 text-slate-600';
  }
};

let claimMeasureContext: CanvasRenderingContext2D | null = null;

const measureTextWidth = (label: string, font: string, fallbackCharWidth: number) => {
  if (typeof document === 'undefined') {
    return label.length * fallbackCharWidth;
  }

  if (!claimMeasureContext) {
    claimMeasureContext = document.createElement('canvas').getContext('2d');
  }

  if (!claimMeasureContext) {
    return label.length * fallbackCharWidth;
  }

  claimMeasureContext.font = font;

  return claimMeasureContext.measureText(label).width;
};

export default function ExportPage() {
  const {
    data,
    isLoading,
    isGrabExpress,
    reportTemplateRef,
    handleGeneratePdf,
    handleGenerateXlsx,
    getReqAmountUi,
    getApprovedAmountUi,
    getClaimConfigValue,
  } = useExportClaim();

  const noColumnSize = 52;
  const claimIdColumnSize = useMemo(
    () =>
      Math.min(
        240,
        Math.ceil(
          Math.max(
            measureTextWidth('CLM-20260211-00009', '400 12px Arial', 6.1),
            measureTextWidth('Claim ID', '500 14px Arial', 6.8),
            data.reduce((widest, claim) => {
              const label = claim?.number || '-';

              return Math.max(widest, measureTextWidth(label, '400 12px Arial', 6.1));
            }, 0),
          ) + 57,
        ),
      ),
    [data],
  );
  const customerNameColumnSize = 164;
  const planNameColumnSize = 300;
  const benefitColumnSize = 300;

  const currencyColumnSize = useMemo(
    () =>
      Math.min(
        120,
        Math.ceil(
          Math.max(
            measureTextWidth('Currency', '500 14px Arial', 7.2),
            data.reduce((widest, claim) => {
              const label = claim?.currency || 'IDR';

              return Math.max(widest, measureTextWidth(label, '600 12px Arial', 6.2));
            }, 0),
          ) + 36,
        ),
      ),
    [data],
  );

  const amountColumnSize = useMemo(
    () =>
      Math.max(
        160,
        Math.ceil(
          Math.max(
            measureTextWidth('Requested Amount', '500 14px Arial', 7.2),
            measureTextWidth('Approved Amount', '500 14px Arial', 7.2),
            data.reduce((widest, claim) => {
              const requestedLabel = getReqAmountUi(claim);
              const approvedLabel = getApprovedAmountUi(claim);

              return Math.max(
                widest,
                measureTextWidth(requestedLabel, '400 13px Arial', 6.6),
                measureTextWidth(approvedLabel, '400 13px Arial', 6.6),
              );
            }, 0),
          ) + 40,
        ),
      ),
    [data, getReqAmountUi, getApprovedAmountUi],
  );

  const statusColumnSize = useMemo(
    () =>
      Math.ceil(
        Math.max(
          measureTextWidth('Status', '500 14px Arial', 7.2),
          data.reduce((widest, claim) => {
            return Math.max(widest, measureTextWidth(claim?.status || '-', '600 10px Arial', 7.4));
          }, 0),
        ) + 72,
      ),
    [data],
  );

  const bookingIdColumnSize = 160;
  const tanggalClaimColumnSize = 160;

  const columns = useMemo<ColumnDef<any>[]>(() => {
    const cols: ColumnDef<any>[] = [
      {
        id: 'no',
        header: 'No.',
        size: noColumnSize,
        minSize: noColumnSize,
        cell: ({ row }) => row.index + 1,
        meta: {
          headerCellClassName: 'text-center px-2',
          headerContentClassName: 'overflow-visible whitespace-nowrap',
          cellClassName: 'text-center px-2 align-middle text-slate-500',
          cellContentClassName: 'overflow-visible whitespace-nowrap',
        },
      },
      {
        id: 'claimId',
        accessorKey: 'number',
        header: 'Claim ID',
        size: claimIdColumnSize,
        minSize: 165,
        meta: {
          cellClassName: 'align-middle',
          loadingSkeletonClassName: 'w-36',
        },
        cell: ({ row }) => (
          <Box className="min-w-0 text-sm leading-5 text-slate-700">
            {row.original.number || '-'}
          </Box>
        ),
      },
      {
        id: 'customerName',
        accessorFn: (item) => item?.policy_data?.policy_holder?.name || '-',
        header: 'Customer Name',
        size: customerNameColumnSize,
        minSize: 144,
        meta: {
          cellClassName: 'align-middle',
          cellContentClassName: 'whitespace-normal break-words',
        },
        cell: ({ row }) => (
          <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
            {row.original?.policy_data?.policy_holder?.name || '-'}
          </Box>
        ),
      },
      {
        id: 'planName',
        accessorFn: (item) => item?.package?.plan?.name || '-',
        header: 'Plan Name',
        size: planNameColumnSize,
        minSize: 184,
        meta: {
          cellClassName: 'align-middle',
          cellContentClassName: 'whitespace-normal break-words',
        },
        cell: ({ row }) => (
          <Box className="min-w-0 break-words text-sm leading-5 text-slate-600">
            {row.original?.package?.plan?.name.split('|').join(' - ') || '-'}
          </Box>
        ),
      },
      {
        id: 'benefit',
        accessorFn: (item) => item?.benefit?.description_en || '-',
        header: 'Benefit',
        size: benefitColumnSize,
        minSize: 184,
        meta: {
          cellClassName: 'align-middle',
          cellContentClassName: 'whitespace-normal break-words',
        },
        cell: ({ row }) => (
          <Box className="min-w-0 break-words text-sm leading-5 text-slate-600">
            {row.original?.benefit?.description_en || '-'}
          </Box>
        ),
      },
      {
        id: 'currency',
        accessorKey: 'currency',
        header: 'Currency',
        size: currencyColumnSize,
        minSize: 90,
        meta: {
          headerCellClassName: 'text-left px-2',
          headerContentClassName: 'overflow-visible whitespace-nowrap',
          cellClassName: 'text-left align-middle px-2',
        },
        cell: ({ row }) => (
          <Box className="text-xs font-semibold uppercase tracking-[0.04em] text-slate-500">
            {row.original?.currency || '-'}
          </Box>
        ),
      },
      {
        id: 'requestedAmount',
        header: 'Requested Amount',
        size: amountColumnSize,
        minSize: amountColumnSize,
        meta: {
          headerCellClassName: 'text-right px-2',
          headerContentClassName: 'overflow-visible whitespace-nowrap text-right text-clip',
          cellClassName: 'text-right px-2 align-middle',
          cellContentClassName: 'w-full whitespace-nowrap text-right text-[13px] tabular-nums text-slate-900',
        },
        cell: ({ row }) => getReqAmountUi(row.original),
      },
      {
        id: 'approvedAmount',
        header: 'Approved Amount',
        size: amountColumnSize,
        minSize: amountColumnSize,
        meta: {
          headerCellClassName: 'text-right px-2',
          headerContentClassName: 'overflow-visible whitespace-nowrap text-right text-clip',
          cellClassName: 'text-right px-2 align-middle',
          cellContentClassName: 'w-full whitespace-nowrap text-right text-[13px] tabular-nums text-slate-900',
        },
        cell: ({ row }) => getApprovedAmountUi(row.original),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        size: statusColumnSize,
        minSize: 140,
        meta: {
          headerCellClassName: 'text-center px-2',
          cellClassName: 'text-center px-2 align-middle',
        },
        cell: ({ row }) => (
          <Box
            className={cn(
              'mx-auto w-fit rounded-full px-2.5 py-0.5 text-[10px] font-semibold leading-relaxed shadow-sm',
              getClaimStatusTone(row.original.status),
            )}
          >
            {row.original.status}
          </Box>
        ),
      },
    ];

    if (isGrabExpress) {
      cols.push(
        {
          id: 'bookingId',
          header: 'Booking ID',
          size: bookingIdColumnSize,
          minSize: 140,
          meta: {
            cellClassName: 'align-middle',
          },
          cell: ({ row }) => (
            <Box className="min-w-0 text-sm leading-5 text-slate-700">
              {getClaimConfigValue(row.original, 'order_id')}
            </Box>
          ),
        },
        {
          id: 'tanggalClaim',
          header: 'Tanggal Claim',
          size: tanggalClaimColumnSize,
          minSize: 140,
          meta: {
            cellClassName: 'align-middle',
          },
          cell: ({ row }) => (
            <Box className="min-w-0 text-sm leading-5 text-slate-700">
              {getClaimConfigValue(row.original, 'datetime_loss_damage')}
            </Box>
          ),
        },
      );
    }

    return cols;
  }, [
    isGrabExpress,
    getReqAmountUi,
    getApprovedAmountUi,
    getClaimConfigValue,
    noColumnSize,
    claimIdColumnSize,
    customerNameColumnSize,
    planNameColumnSize,
    benefitColumnSize,
    currencyColumnSize,
    amountColumnSize,
    statusColumnSize,
  ]);

  const breadcrumbs = [
    { label: 'Claim List', href: AppURL.claimList },
    { label: 'Export', isCurrentPage: true },
  ];

  return (
    <Box className="flex flex-col w-full h-screen overflow-hidden">
      <PageHeader title="Export Claims" breadcrumbs={breadcrumbs} showBackButton={true}>
        <Button
          onClick={handleGeneratePdf}
          className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
          leftIcon={<Download className="w-5 h-5" />}
        >
          Generate PDF
        </Button>

        <Button
          onClick={handleGenerateXlsx}
          className="h-10 rounded-full px-5"
          leftIcon={<Download className="w-5 h-5" />}
        >
          Generate XLSX
        </Button>
      </PageHeader>
      <Box className="flex-1 min-h-0 bg-white rounded-lg overflow-hidden flex flex-col m-4 md:m-6 mt-0">
        <DataTable
          ref={reportTemplateRef as any}
          loading={isLoading}
          data={data}
          columns={columns}
          layout={{
            stickyHeader: true,
            maxBodyHeight: '100%',
          }}
          renderPagination={() => <></>}
          emptyState={
            <Box className="flex flex-col gap-4 items-center justify-center py-14">
              <Image alt="no data" src={noData} width={200} /> No transaction data available
            </Box>
          }
          className="h-full [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
          tableOptions={{
            enableSorting: false,
            enableColumnPinning: true,
            enableColumnResizing: true,
            manualPagination: true,
            getRowId: (row, index) => row?.id || `claim-row-${index}`,
          }}
        />
      </Box>
    </Box>
  );
}
