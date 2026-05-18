import { Box, type ColumnDef } from '@repo/ui';

import { formatMoney, formatDate, formatDateTime } from '@/lib/formatter';
import { cn } from '@/lib/utils';

interface CreateUnmatchBillingTableColumnsProps {
  page: number;
  rowsPerPage: number;
  billingNoColumnSize: number;
  transactionNoColumnSize: number;
  transactionDateColumnSize: number;
  currencyColumnSize: number;
  amountColumnSize: number;
  statusColumnSize: number;
  formatStatus: (status: string) => string;
  getStatusColor: (status: string) => string;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

export const createUnmatchBillingTableColumns = ({
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
}: CreateUnmatchBillingTableColumnsProps): ColumnDef<any>[] => [
  {
    id: 'index',
    header: 'No.',
    enableSorting: false,
    enableResizing: false,
    size: 44,
    minSize: 44,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle text-slate-500',
      cellContentClassName: 'whitespace-nowrap',
    },
    cell: ({ row }) => formatTableOrdinalNumber((page - 1) * rowsPerPage + row.index + 1),
  },
  {
    id: 'billingNo',
    accessorKey: 'billings.billing_no',
    header: 'Billing No.',
    enableSorting: false,
    size: billingNoColumnSize,
    minSize: 160,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-nowrap',
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Box className="min-w-0 text-sm leading-5 text-slate-700">
          {item.billings?.billing_no || '-'}
        </Box>
      );
    },
  },
  {
    id: 'transactionNo',
    accessorKey: 'transaction_no',
    header: 'Transaction Number',
    enableSorting: false,
    size: transactionNoColumnSize,
    minSize: 160,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-nowrap',
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Box className="min-w-0 text-sm leading-5 text-slate-700">{item.transaction_no || '-'}</Box>
      );
    },
  },
  {
    id: 'planName',
    accessorFn: (item) => item.details?.plan_name || item.plan_name || '-',
    header: 'Plan Name',
    enableSorting: false,
    size: 220,
    minSize: 184,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const item = row.original;
      const planName = item.details?.plan_name || item.plan_name || '-';

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-600">
          {planName.split('|').splice(0, 2).join(' - ') || '-'}
        </Box>
      );
    },
  },
  {
    id: 'transactionDate',
    accessorFn: (item) => item.details?.transaction_date || item.created_at || '-',
    header: 'Transaction Date',
    enableSorting: false,
    enableResizing: false,
    size: transactionDateColumnSize,
    minSize: 116,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle whitespace-nowrap',
      cellContentClassName: 'whitespace-nowrap text-xs tabular-nums text-slate-700',
    },
    cell: ({ row }) => {
      const item = row.original;
      const dateValue = item.details?.transaction_date || item.created_at;

      return <Box>{dateValue ? formatDateTime(dateValue) : '-'}</Box>;
    },
  },
  {
    id: 'currency',
    accessorKey: 'billings.currency',
    header: 'Currency',
    enableSorting: false,
    enableResizing: false,
    size: currencyColumnSize,
    minSize: 92,
    meta: {
      headerCellClassName: 'whitespace-nowrap !px-1.5',
      cellClassName:
        'align-middle whitespace-nowrap !px-1.5 text-xs font-semibold uppercase tracking-[0.04em] text-slate-500',
      cellContentClassName: 'whitespace-nowrap',
    },
    cell: ({ row }) => {
      const item = row.original;
      return <Box>{item.billings?.currency || '-'}</Box>;
    },
  },
  {
    id: 'amount',
    header: 'Amount',
    enableSorting: false,
    enableResizing: false,
    size: amountColumnSize,
    minSize: 120,
    meta: {
      headerCellClassName: 'whitespace-nowrap !px-1.5 text-right',
      cellClassName: 'align-middle whitespace-nowrap !px-1.5 text-right',
      cellContentClassName: 'w-full whitespace-nowrap text-right',
    },
    cell: ({ row }) => {
      const item = row.original;
      const status = item.status_reconcilliation;
      const billingType = item.billings?.type;
      const amount = parseFloat(item.amount || '0');
      const commissionAmount = parseFloat(item.commission_amount || '0');

      let displayAmount = '-';

      if (status === 'not-found-in-system') {
        displayAmount = formatMoney(amount);
      } else if (status === 'not-found-in-excel') {
        if (billingType === 'insurer') {
          displayAmount = formatMoney(commissionAmount);
        } else if (billingType === 'partner') {
          displayAmount = formatMoney(amount - commissionAmount);
        }
      }

      return (
        <Box className="w-full whitespace-nowrap text-right text-[13px] tabular-nums text-slate-900">
          {displayAmount}
        </Box>
      );
    },
  },
  {
    id: 'status',
    accessorKey: 'status_reconcilliation',
    header: 'Status',
    enableSorting: false,
    enableResizing: false,
    size: statusColumnSize,
    minSize: 100,
    meta: {
      headerCellClassName: 'whitespace-nowrap text-center',
      cellClassName: 'align-middle whitespace-nowrap text-center',
      cellContentClassName: 'whitespace-nowrap',
    },
    cell: ({ row }) => {
      const item = row.original;
      const status = item.status_reconcilliation;
      const formattedStatus = formatStatus(status);

      return (
        <Box className="whitespace-nowrap">
          <Box
            as="span"
            className={cn(
              'inline-flex h-[1.375rem] min-w-[4.75rem] cursor-default select-none items-center justify-center whitespace-nowrap rounded-full px-1 text-[10px] font-semibold leading-none ring-1 ring-inset',
              status === 'not-found-in-system' && 'bg-red-50 text-red-600 ring-red-200/80',
              status === 'not-found-in-excel' && 'bg-orange-50 text-orange-600 ring-orange-200/80',
              !['not-found-in-system', 'not-found-in-excel'].includes(status) &&
                'bg-slate-50 text-slate-600 ring-slate-200/80',
            )}
          >
            {formattedStatus}
          </Box>
        </Box>
      );
    },
  },
];
