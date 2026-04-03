import Image from 'next/image';
import { X } from 'react-feather';

import {
  Box,
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Skeleton,
  type ColumnDef,
} from '@repo/ui';

import { formatMoney } from '@/lib/formatter';
import { cn } from '@/lib/utils';

interface CreateTransactionTableColumnsProps {
  page: number;
  rowsPerPage: number;
  canEdit: boolean;
  currencyColumnSize: number;
  amountColumnSize: number;
  statusColumnSize: number;
  actionColumnSize: number;
  onUpdateToPaid: (id: string) => void;
  isLoadingUpdateStatus: boolean;
  getStatusColor: (status: string) => string;
  calculateTotalPremium: (transaction: any) => number;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

export const createTransactionTableColumns = ({
  page,
  rowsPerPage,
  canEdit,
  currencyColumnSize,
  amountColumnSize,
  statusColumnSize,
  actionColumnSize,
  onUpdateToPaid,
  isLoadingUpdateStatus,
  getStatusColor,
  calculateTotalPremium,
}: CreateTransactionTableColumnsProps): ColumnDef<any>[] => [
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
    id: 'insuranceName',
    accessorFn: (transaction) => transaction?.insurance?.insurance?.id?.name || '-',
    header: 'Insurance Name',
    enableSorting: false,
    size: 192,
    minSize: 168,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
      loadingSkeleton: (
        <Box className="flex min-w-0 items-start gap-2.5">
          <Skeleton className="h-8 w-8 min-w-8 rounded-xl" />
          <Box className="min-w-0 flex-1 pt-0.5">
            <Skeleton className="h-4 w-[7.5rem] rounded-full" />
          </Box>
        </Box>
      ),
    },
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <Box className="flex min-w-0 items-start gap-2.5">
          <Box className="inline-flex h-8 w-8 min-w-8 items-center justify-center overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200/80">
            <Image
              src={transaction?.insurance?.insurance?.id?.logo_url || '/images/no-image.png'}
              alt=""
              width={100}
              height={50}
            />
          </Box>
          <Box className="min-w-0 flex-1">
            <Box as="p" className="break-words text-sm leading-5 text-slate-900">
              {transaction?.insurance?.insurance?.id?.name || '-'}
            </Box>
          </Box>
        </Box>
      );
    },
  },
  {
    id: 'planName',
    accessorFn: (transaction) => transaction?.insurance?.plan?.name || '-',
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
          {transaction?.insurance?.plan?.name?.split('|').splice(0, 2).join(' - ') || '-'}
        </Box>
      );
    },
  },
  {
    id: 'customerName',
    accessorFn: (transaction) => transaction?.customer?.name || '-',
    header: 'Customer Name',
    enableSorting: false,
    size: 164,
    minSize: 144,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {transaction?.customer?.name || '-'}
        </Box>
      );
    },
  },
  {
    id: 'currency',
    accessorFn: (transaction) => transaction?.insurance?.currency || '-',
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
    cell: ({ row }) => {
      const transaction = row.original;

      return <Box>{transaction?.insurance?.currency || '-'}</Box>;
    },
  },
  {
    id: 'amount',
    accessorFn: (transaction) => calculateTotalPremium(transaction),
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
      const transaction = row.original;
      const totalPremium = calculateTotalPremium(transaction);

      return (
        <Box className="w-full whitespace-nowrap text-right text-[13px] tabular-nums text-slate-900">
          {formatMoney(Number(totalPremium) || 0, 'IDR') || '-'}
        </Box>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: false,
    enableResizing: false,
    size: statusColumnSize,
    minSize: 88,
    meta: {
      headerCellClassName: 'whitespace-nowrap !px-1 text-center',
      cellClassName: 'align-middle whitespace-nowrap !px-1 text-center',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeletonClassName: 'mx-auto h-[1.375rem] w-[4.75rem] rounded-full',
    },
    cell: ({ row }) => {
      const transaction = row.original;
      const status = transaction?.status;

      return (
        <Box className="whitespace-nowrap">
          <Box
            as="span"
            className={cn(
              'inline-flex h-[1.375rem] min-w-20 cursor-default select-none items-center justify-center whitespace-nowrap rounded-full px-1 text-[10px] font-semibold leading-none ring-1 ring-inset',
              getStatusColor(status),
              status === 'Paid' && 'bg-emerald-50 ring-emerald-200/80',
              status === 'Pending' && 'bg-amber-50 ring-amber-200/80',
              status === 'Declaration' && 'bg-sky-50 ring-sky-200/80',
              !['Paid', 'Pending', 'Declaration'].includes(status) &&
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
    id: 'action',
    header: 'Action',
    enableSorting: false,
    enableResizing: false,
    size: actionColumnSize,
    minSize: 68,
    meta: {
      headerCellClassName: 'whitespace-nowrap !px-1 text-center',
      cellClassName: 'align-middle whitespace-nowrap !px-1 text-center',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeletonClassName: 'mx-auto h-7 w-[3.25rem] rounded-full',
    },
    cell: ({ row }) => {
      const transaction = row.original;
      const totalPremium = calculateTotalPremium(transaction);
      const detailRows = [
        {
          label: 'Insurance Name',
          value: transaction?.insurance?.insurance?.id?.name || '-',
        },
        {
          label: 'Plan Name',
          value: transaction?.insurance?.plan?.name || '-',
        },
        {
          label: 'Customer Name',
          value: transaction?.customer?.name || '-',
        },
        {
          label: 'Amount',
          value: formatMoney(Number(totalPremium) || 0, 'IDR') || '-',
          valueClassName: 'tabular-nums',
        },
        {
          label: 'Status',
          value: transaction?.status || '-',
          valueClassName: cn('font-semibold', getStatusColor(transaction?.status)),
        },
      ];

      return (
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <Button
              size="xs"
              className="h-7 rounded-full px-2.5 text-[11px] font-semibold shadow-none"
            >
              View
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-w-[30rem]">
            <DrawerHeader className="gap-0 pb-0">
              <DrawerClose className="absolute right-3 top-3">
                <Button variant="ghost" className="h-8 w-8 rounded-full p-0 shadow-none">
                  <X className="h-4.5 w-4.5" />
                </Button>
              </DrawerClose>
              <DrawerTitle className="pr-10 text-2xl font-bold tracking-tight text-black">
                Transaction Details
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
                          <Box
                            className={cn(
                              'min-w-0 break-words text-slate-900',
                              item.valueClassName,
                            )}
                          >
                            {item.value}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                    {transaction?.status.toLowerCase() === 'pending' && (
                      <Box className="pt-1">
                        <Button
                          onClick={() => onUpdateToPaid(transaction?.id)}
                          disabled={!canEdit || isLoadingUpdateStatus}
                          className="h-9 rounded-full bg-primary px-4 text-white shadow-none"
                        >
                          {isLoadingUpdateStatus ? 'Updating...' : 'Update to Paid'}
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      );
    },
  },
];
