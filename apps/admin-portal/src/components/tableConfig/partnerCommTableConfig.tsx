import { Trash } from 'react-feather';

import { Box, Button, Skeleton, type ColumnDef } from '@repo/ui';

import { formatMoney } from '@/lib/formatter';
import { type PartnerCommItem } from '@/hooks/usePartnerComm.hooks';

interface PartnerCommTableConfigProps {
  page: number;
  rowsPerPage: number;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

const capitalizeWords = (str: string) => {
  if (!str) return '-';
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const createPartnerCommTableColumns = ({
  page,
  rowsPerPage,
  handleEdit,
  handleDelete,
  canEdit,
  canDelete,
}: PartnerCommTableConfigProps): ColumnDef<PartnerCommItem>[] => [
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
    id: 'channel_name',
    accessorFn: (item) => item?.channel_name || '-',
    header: 'Channel Name',
    enableSorting: false,
    size: 192,
    minSize: 168,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const item = row.original;

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-600">
          {item?.channel_name || '-'}
        </Box>
      );
    },
  },
  {
    id: 'insurance_name',
    accessorFn: (item) => item?.insurance_name || '-',
    header: 'Insurance Company Name',
    enableSorting: false,
    size: 192,
    minSize: 168,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const item = row.original;

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-600">
          {item?.insurance_name || '-'}
        </Box>
      );
    },
  },
  {
    id: 'fee_type',
    accessorFn: (item) => item?.fee_type || '-',
    header: 'Fee Type',
    enableSorting: false,
    enableResizing: false,
    size: 120,
    minSize: 92,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName:
        'align-middle whitespace-nowrap text-xs font-semibold tracking-[0.04em] text-slate-500',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeleton: (
        <Box className="flex min-w-0 items-center">
          <Skeleton className="h-4 w-16 rounded-full [tr:nth-child(2n)_&]:w-24 [tr:nth-child(3n)_&]:w-20" />
        </Box>
      ),
    },
    cell: ({ row }) => {
      const item = row.original;
      return <Box>{item?.fee_type ? capitalizeWords(item.fee_type) : '-'}</Box>;
    },
  },
  {
    id: 'fee',
    accessorFn: (item) => item?.fee || 0,
    header: 'Fee',
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
      const item = row.original;

      return (
        <Box className="w-full whitespace-nowrap text-right text-[13px] tabular-nums text-slate-900">
          {item?.fee_type !== 'percentage'
            ? formatMoney(Number(item?.fee) || 0, 'IDR') || '-'
            : item?.fee || '-'}
        </Box>
      );
    },
  },
  {
    id: 'action',
    header: 'Action',
    enableSorting: false,
    enableResizing: false,
    size: 120,
    minSize: 120,
    meta: {
      headerCellClassName: 'whitespace-nowrap !px-1 text-center',
      cellClassName: 'align-middle whitespace-nowrap !px-1 text-center',
      cellContentClassName: 'whitespace-nowrap flex justify-center',
      loadingSkeleton: (
        <Box className="flex items-center justify-center gap-2">
          <Skeleton className="h-7 w-[60px] rounded-full" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </Box>
      ),
    },
    cell: ({ row }) => {
      const item = row.original;

      return (
        <Box className="flex items-center justify-center gap-2">
          <Button
            size="xs"
            disabled={!canEdit}
            onClick={() => handleEdit(item.id)}
            className="h-7 rounded-full bg-[#016DA1] px-4 text-[13px] font-medium text-white shadow-none hover:bg-[#015a85]"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="xs"
            disabled={!canDelete}
            onClick={() => handleDelete(item.id)}
            className="h-7 w-7 rounded-md p-0 text-red-600 hover:bg-red-50 hover:!text-red-700"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </Box>
      );
    },
  },
];
