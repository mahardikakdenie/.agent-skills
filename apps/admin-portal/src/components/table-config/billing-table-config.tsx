import { Eye, FileText } from 'lucide-react';

import { Box, Button, Skeleton, type ColumnDef } from '@repo/ui';

import { formatDate, formatMoney } from '@/lib/formatter';
import { cn } from '@/lib/utils';

export interface BillingItem {
  id: string;
  billing_no: string;
  created_at: string;
  category: string;
  currency: string;
  amount: number;
  total: number;
  status: string;
}

export interface BillingTableConfigProps {
  page: number;
  rowsPerPage: number;
  searchType: string;
  searchCategory: string;
  categories: any[];
  onViewDetail: (id: string, channel: string, type: string) => void;
  onViewInvoice: (id: string, type: string, channel: string) => void;
  searchChannel: string;
  getStatusColor: (status: string) => string;
  // Sizes
  billingNoColumnSize: number;
  billingDateColumnSize: number;
  categoryColumnSize: number;
  currencyColumnSize: number;
  amountColumnSize: number;
  statusColumnSize: number;
  actionColumnSize: number;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

export const createBillingTableColumns = ({
  page,
  rowsPerPage,
  searchType,
  searchCategory,
  categories,
  onViewDetail,
  onViewInvoice,
  searchChannel,
  getStatusColor,
  billingNoColumnSize,
  billingDateColumnSize,
  categoryColumnSize,
  currencyColumnSize,
  amountColumnSize,
  statusColumnSize,
  actionColumnSize,
}: BillingTableConfigProps): ColumnDef<BillingItem>[] => {
  const columns: ColumnDef<BillingItem>[] = [
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
      id: 'billingNo',
      accessorKey: 'billing_no',
      header: 'Billing No.',
      enableSorting: false,
      size: billingNoColumnSize,
      minSize: 160,
      meta: {
        headerCellClassName: 'whitespace-nowrap',
        cellClassName: 'align-middle',
        cellContentClassName: 'whitespace-nowrap',
        loadingSkeletonClassName: 'h-4 w-[10.5rem] rounded-full',
      },
      cell: ({ row }) => (
        <Box className="min-w-0 text-sm font-medium leading-5 text-slate-700">
          {row.original.billing_no || '-'}
        </Box>
      ),
    },
    {
      id: 'billingDate',
      accessorKey: 'created_at',
      header: 'Billing Date',
      enableSorting: false,
      enableResizing: false,
      size: billingDateColumnSize,
      minSize: 110,
      meta: {
        headerCellClassName: 'whitespace-nowrap !px-1',
        cellClassName: 'align-middle whitespace-nowrap !px-1',
        cellContentClassName: 'whitespace-nowrap text-xs tabular-nums text-slate-700',
        loadingSkeletonClassName: 'h-4 w-[6.9rem] rounded-full',
      },
      cell: ({ row }) => (
        <Box>{row.original.created_at ? formatDate(row.original.created_at, 'YYYY-MM-DD') : '-'}</Box>
      ),
    },
  ];

  if (searchCategory === 'All') {
    columns.push({
      id: 'category',
      accessorFn: (billing) => categories.find((c) => c.id === billing.category)?.name || '-',
      header: 'Category',
      enableSorting: false,
      enableResizing: false,
      size: categoryColumnSize,
      minSize: 120,
      meta: {
        headerCellClassName: 'whitespace-nowrap',
        cellClassName: 'align-middle whitespace-nowrap text-xs font-semibold text-slate-500',
        cellContentClassName: 'whitespace-nowrap',
        loadingSkeleton: (
          <Box className="flex min-w-0 items-center">
            <Skeleton className="h-4 w-16 rounded-full [tr:nth-child(2n)_&]:w-24 [tr:nth-child(3n)_&]:w-20" />
          </Box>
        ),
      },
      cell: ({ row }) => (
        <Box>{categories.find((c) => c.id === row.original.category)?.name || '-'}</Box>
      ),
    });
  }

  columns.push(
    {
      id: 'currency',
      accessorKey: 'currency',
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
        loadingSkeletonClassName: 'h-4 w-7 rounded-full',
      },
      cell: ({ row }) => <Box>{row.original.currency || 'IDR'}</Box>,
    },
    {
      id: 'amount',
      accessorFn: (billing) =>
        searchType === 'insurer' ? billing.amount : billing.total - billing.amount,
      header: 'Amount',
      enableSorting: false,
      enableResizing: false,
      size: amountColumnSize,
      minSize: 120,
      meta: {
        headerCellClassName: 'whitespace-nowrap !px-1.5 text-right',
        cellClassName: 'align-middle whitespace-nowrap !px-1.5 text-right',
        cellContentClassName: 'w-full whitespace-nowrap text-right',
        loadingSkeletonClassName: 'ml-auto h-4 w-[5.25rem] rounded-full',
      },
      cell: ({ row }) => {
        const billing = row.original;
        const amountValue = searchType === 'insurer' ? billing.amount : billing.total - billing.amount;

        return (
          <Box className="w-full whitespace-nowrap text-right text-[13px] tabular-nums text-slate-900">
            {formatMoney(amountValue) || '-'}
          </Box>
        );
      },
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      enableSorting: false,
      enableResizing: false,
      size: statusColumnSize,
      minSize: 100,
      meta: {
        headerCellClassName: 'whitespace-nowrap !px-1 text-center',
        cellClassName: 'align-middle whitespace-nowrap !px-1 text-center',
        cellContentClassName: 'whitespace-nowrap',
        loadingSkeletonClassName: 'mx-auto h-[1.375rem] w-[4.75rem] rounded-full',
      },
      cell: ({ row }) => {
        const status = row.original.status;
        const label = status
          .split('-')
          .map(
            (word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
          )
          .join(' ');

        return (
          <Box className="whitespace-nowrap">
            <Box
              as="span"
              className={cn(
                'inline-flex h-[1.375rem] min-w-20 cursor-default select-none items-center justify-center whitespace-nowrap rounded-full px-3 text-[10px] font-semibold leading-none ring-1 ring-inset',
                getStatusColor(status),
                status === 'paid' && 'bg-emerald-50 ring-emerald-200/80',
                status === 'pending' && 'bg-amber-50 ring-amber-200/80',
                !['paid', 'pending'].includes(status) && 'bg-slate-50 ring-slate-200/80',
              )}
            >
              {label}
            </Box>
          </Box>
        );
      },
    },
    {
      id: 'action',
      header: 'Action',
      enableSorting: false,
      enableResizing: false,
      size: actionColumnSize,
      minSize: 96,
      meta: {
        headerCellClassName: 'whitespace-nowrap !px-1 text-center',
        cellClassName: 'align-middle whitespace-nowrap !px-1 text-center',
        cellContentClassName: 'whitespace-nowrap',
        loadingSkeleton: (
          <Box className="flex items-center justify-center gap-1.5">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </Box>
        ),
      },
      cell: ({ row }) => {
        const billing = row.original;

        return (
          <Box className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="md"
              className="h-8 w-8 p-0"
              onClick={() => onViewDetail(billing.id, searchChannel, searchType)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="md"
              className="h-8 w-8 p-0"
              onClick={() => onViewInvoice(billing.id, searchType, searchChannel)}
            >
              <FileText className="h-4 w-4" />
            </Button>
          </Box>
        );
      },
    },
  );

  return columns;
};
