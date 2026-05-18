import { type ColumnDef, Box, Skeleton, Button } from '@repo/ui';
import { formatMoneyClaim } from '@/lib/formatter';
import { cn } from '@/lib/utils';
import moment from 'moment';

interface CreateClaimHistoryTableColumnsProps {
  page: number;
  rowsPerPage: number;
  getStatusColor: (status: string) => string;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

export const createClaimHistoryTableColumns = ({
  page,
  rowsPerPage,
  getStatusColor,
}: CreateClaimHistoryTableColumnsProps): ColumnDef<any>[] => [
  {
    id: 'id',
    header: 'No.',
    enableSorting: false,
    enableResizing: false,
    size: 44,
    minSize: 44,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle text-slate-500',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeleton: (
        <Box className="flex min-w-0 items-center">
          <Skeleton className="h-4 w-5 rounded-full" />
        </Box>
      ),
    },
    cell: ({ row }) => formatTableOrdinalNumber((page - 1) * rowsPerPage + row.index + 1),
  },
  {
    accessorKey: 'claimId',
    id: 'claimId',
    header: 'Claim ID',
    enableSorting: false,
    size: 160,
    minSize: 140,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-nowrap',
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Box className="min-w-0 text-sm leading-5 text-slate-700">
          {item.claimId || '-'}
        </Box>
      );
    },
  },
  {
    id: 'insuredName',
    accessorKey: 'insuredName',
    header: 'Insured Name',
    enableSorting: false,
    size: 160,
    minSize: 136,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {item.insuredName || '-'}
        </Box>
      );
    },
  },
  {
    id: 'submittedDate',
    accessorKey: 'submittedDate',
    header: 'Submitted Date',
    enableSorting: false,
    enableResizing: false,
    size: 140,
    minSize: 116,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle whitespace-nowrap',
      cellContentClassName: 'whitespace-nowrap text-xs tabular-nums text-slate-700',
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Box>
          {item.submittedDate ? moment(item.submittedDate).format('DD/MM/YYYY') : '-'}
        </Box>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: false,
    enableResizing: false,
    size: 140,
    minSize: 88,
    meta: {
      headerCellClassName: 'whitespace-nowrap text-center',
      cellClassName: 'align-middle whitespace-nowrap text-center',
      cellContentClassName: 'whitespace-nowrap',
    },
    cell: ({ row }) => {
      const item = row.original;
      const status = item.status;

      return (
        <Box className="whitespace-nowrap">
          <Box
            as="span"
            className={cn(
              'inline-flex h-[1.375rem] min-w-[4.75rem] cursor-default select-none items-center justify-center whitespace-nowrap rounded-full px-1 text-[10px] font-semibold leading-none ring-1 ring-inset',
              getStatusColor(status),
              (status === 'Approved' || status === 'Paid') && 'bg-emerald-50 ring-emerald-200/80',
              status === 'Pending' && 'bg-amber-50 ring-amber-200/80',
              (status === 'Rejected' || status === 'Declined') && 'bg-rose-50 ring-rose-200/80',
              !['Approved', 'Paid', 'Pending', 'Rejected', 'Declined'].includes(status) &&
                'bg-slate-50 ring-slate-200/80',
            )}
          >
            {status}
          </Box>
        </Box>
      );
    },
  },
  {
    id: 'currency',
    accessorKey: 'currency',
    header: 'Currency',
    enableSorting: false,
    enableResizing: false,
    size: 92,
    minSize: 80,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName:
        'align-middle whitespace-nowrap text-xs font-semibold uppercase tracking-[0.04em] text-slate-500',
      cellContentClassName: 'whitespace-nowrap',
    },
    cell: ({ row }) => {
      const item = row.original;
      return <Box>{item.currency || 'IDR'}</Box>;
    },
  },
  {
    id: 'claimAmount',
    accessorKey: 'claimAmount',
    header: 'Claim Amount',
    enableSorting: false,
    enableResizing: false,
    size: 140,
    minSize: 120,
    meta: {
      headerCellClassName: 'whitespace-nowrap text-right',
      cellClassName: 'align-middle whitespace-nowrap text-right',
      cellContentClassName: 'w-full whitespace-nowrap text-right',
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Box className="w-full whitespace-nowrap text-right text-[13px] tabular-nums text-slate-900">
          {formatMoneyClaim(Number(item.claimAmount))}
        </Box>
      );
    },
  },
  {
    id: 'paid',
    accessorKey: 'paid',
    header: 'Paid',
    enableSorting: false,
    enableResizing: false,
    size: 140,
    minSize: 120,
    meta: {
      headerCellClassName: 'whitespace-nowrap text-right',
      cellClassName: 'align-middle whitespace-nowrap text-right',
      cellContentClassName: 'w-full whitespace-nowrap text-right',
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Box className="w-full whitespace-nowrap text-right text-[13px] tabular-nums text-slate-900">
          {item.paid ? formatMoneyClaim(Number(item.paid)) : '-'}
        </Box>
      );
    },
  },
  {
    id: 'remainingLimit',
    accessorKey: 'remainingLimit',
    header: 'Remaining Limit',
    enableSorting: false,
    enableResizing: false,
    size: 140,
    minSize: 120,
    meta: {
      headerCellClassName: 'whitespace-nowrap text-right',
      cellClassName: 'align-middle whitespace-nowrap text-right',
      cellContentClassName: 'w-full whitespace-nowrap text-right',
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Box className="w-full whitespace-nowrap text-right text-[13px] tabular-nums text-slate-900">
          {formatMoneyClaim(Number(item.remainingLimit))}
        </Box>
      );
    },
  },
  {
    id: 'paymentType',
    accessorKey: 'paymentType',
    header: 'Payment Type',
    enableSorting: false,
    enableResizing: false,
    size: 130,
    minSize: 92,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName:
        'align-middle whitespace-nowrap text-xs font-semibold text-slate-500',
      cellContentClassName: 'whitespace-nowrap',
    },
    cell: ({ row }) => {
      const item = row.original;
      return <Box>{item.paymentType || '-'}</Box>;
    },
  },
  {
    id: 'action',
    header: 'Action',
    enableSorting: false,
    enableResizing: false,
    size: 68,
    minSize: 68,
    meta: {
      headerCellClassName: 'whitespace-nowrap text-center',
      cellClassName: 'align-middle whitespace-nowrap text-center',
      cellContentClassName: 'whitespace-nowrap',
    },
    cell: () => {
      return (
        <Button
          size="xs"
          disabled
          className="h-7 rounded-full px-2.5 text-[11px] font-semibold shadow-none"
        >
          View
        </Button>
      );
    },
  },
];
