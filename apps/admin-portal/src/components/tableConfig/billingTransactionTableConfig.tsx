import { Box, Skeleton, type ColumnDef } from '@repo/ui';

import { formatDate, formatMoney } from '@/lib/formatter';

export interface BillingTransactionItem {
  id: string;
  invoice: string;
  created_at: string;
  currency: string;
  insurance: {
    plan: {
      name: string;
      id: string;
    };
    product: {
      id: string;
      name: string;
    };
    insurance: {
      id: {
        id: string;
        name: string;
      };
    };
    premium: string;
  };
  newPremium: number;
}

export interface BillingTransactionTableConfigProps {
  type: string;
  fees: any;
  company?: string;
  page: number;
  rowsPerPage: number;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

export const createBillingTransactionTableColumns = ({
  type,
  fees,
  page,
  rowsPerPage,
}: BillingTransactionTableConfigProps): ColumnDef<BillingTransactionItem>[] => {
  const columns: ColumnDef<BillingTransactionItem>[] = [
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
      accessorKey: 'invoice',
      id: 'invoice',
      header: 'Transaction Number',
      enableSorting: false,
      size: 160,
      minSize: 160,
      meta: {
        headerCellClassName: 'whitespace-nowrap',
        cellClassName: 'align-middle',
        cellContentClassName: 'whitespace-nowrap',
        loadingSkeletonClassName: 'h-4 w-[8.5rem] rounded-full',
      },
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Box className="min-w-0 text-sm leading-5 text-slate-700">{item.invoice || '-'}</Box>
        );
      },
    },
    {
      id: 'planName',
      accessorFn: (transaction) => transaction.insurance?.plan?.name || '-',
      header: 'Plan Name',
      enableSorting: false,
      size: 220,
      minSize: 184,
      meta: {
        cellClassName: 'align-middle',
        cellContentClassName: 'whitespace-normal break-words',
      },
      cell: ({ row }) => {
        const transaction = row.original;

        return (
          <Box className="min-w-0 break-words text-sm leading-5 text-slate-600">
            {transaction.insurance?.plan?.name?.split('|').splice(0, 2).join(' - ') || '-'}
          </Box>
        );
      },
    },
  ];

  // Add Insurance Company column for partner type
  if (type === 'partner') {
    columns.push({
      id: 'insurance_company',
      header: 'Insurance Company Name',
      size: 192,
      minSize: 168,
      meta: {
        cellClassName: 'align-middle',
        cellContentClassName: 'whitespace-normal break-words',
      },
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <Box className="min-w-0 break-words text-sm leading-5 text-slate-900">
            {transaction.insurance?.insurance?.id?.name || '-'}
          </Box>
        );
      },
    });
  }

  columns.push(
    {
      id: 'created_at',
      accessorKey: 'created_at',
      header: 'Transaction Date',
      enableSorting: false,
      enableResizing: false,
      size: 144,
      minSize: 116,
      meta: {
        headerCellClassName: 'whitespace-nowrap',
        cellClassName: 'align-middle whitespace-nowrap',
        cellContentClassName: 'whitespace-nowrap text-xs tabular-nums text-slate-700',
      },
      cell: ({ row }) => {
        const item = row.original;
        return <Box>{item?.created_at ? formatDate(item.created_at, 'YYYY-MM-DD') : '-'}</Box>;
      },
    },
    {
      id: 'currency',
      accessorKey: 'currency',
      header: 'Currency',
      enableSorting: false,
      enableResizing: false,
      size: 92,
      minSize: 92,
      meta: {
        headerCellClassName: 'whitespace-nowrap !px-1.5',
        cellClassName:
          'align-middle whitespace-nowrap !px-1.5 text-xs font-semibold uppercase tracking-[0.04em] text-slate-500',
        cellContentClassName: 'whitespace-nowrap',
        loadingSkeletonClassName: 'h-4 w-7 rounded-full',
      },
      cell: ({ row }) => {
        const transaction = row.original;
        return <Box>{transaction.currency || '-'}</Box>;
      },
    },
    {
      id: 'amount',
      header: 'Amount',
      enableSorting: false,
      enableResizing: false,
      size: 120,
      minSize: 120,
      meta: {
        headerCellClassName: 'whitespace-nowrap !px-1.5 text-right',
        cellClassName: 'align-middle whitespace-nowrap !px-1.5 text-right',
        cellContentClassName: 'w-full whitespace-nowrap text-right',
      },
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <Box className="w-full whitespace-nowrap text-right text-[13px] tabular-nums text-slate-900">
            {formatMoney(transaction.newPremium)}
          </Box>
        );
      },
    },
  );

  // Add Commission columns for insurer type
  if (type === 'insurer') {
    columns.push(
      {
        id: 'commission_percentage',
        header: 'Commission Percentage',
        size: 160,
        minSize: 140,
        meta: {
          headerCellClassName: 'whitespace-nowrap text-right',
          cellClassName: 'align-middle whitespace-nowrap text-right',
          cellContentClassName: 'w-full whitespace-nowrap text-right',
        },
        cell: ({ row }) => {
          const transaction = row.original;
          const feeKey = `${transaction.insurance?.insurance?.id?.id}-${transaction.insurance?.product?.id}-${transaction.insurance?.plan?.id}`;
          const percentage = fees[feeKey]?.fee ?? 0;
          return (
            <Box className="w-full whitespace-nowrap text-right text-[13px] tabular-nums text-slate-600">
              {percentage}%
            </Box>
          );
        },
      },
      {
        id: 'commission_amount',
        header: 'Commission Amount',
        size: 160,
        minSize: 140,
        meta: {
          headerCellClassName: 'whitespace-nowrap text-right',
          cellClassName: 'align-middle whitespace-nowrap text-right',
          cellContentClassName: 'w-full whitespace-nowrap text-right',
        },
        cell: ({ row }) => {
          const transaction = row.original;
          const feeKey = `${transaction.insurance?.insurance?.id?.id}-${transaction.insurance?.product?.id}-${transaction.insurance?.plan?.id}`;
          const feePercentage = fees[feeKey]?.fee ?? 0;
          const commission = (feePercentage / 100) * transaction.newPremium;
          return (
            <Box className="w-full whitespace-nowrap text-right text-[13px] tabular-nums text-slate-900">
              {formatMoney(commission)}
            </Box>
          );
        },
      },
    );
  }

  return columns;
};
