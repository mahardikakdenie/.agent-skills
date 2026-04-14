import { format } from 'date-fns';
import { Trash } from 'react-feather';

import { Box, Button, Skeleton, type ColumnDef } from '@repo/ui';

interface SanctionTableConfigProps {
  page: number;
  rowsPerPage: number;
  handleViewDetail: (id: string) => void;
  handleDelete: (id: string) => void;
  canDelete: boolean;
  nameColumnSize?: number;
  phoneNumberColumnSize?: number;
  emailColumnSize?: number;
  blacklistReasonColumnSize?: number;
  blacklistedDateColumnSize?: number;
  createdAtColumnSize?: number;
  actionColumnSize?: number;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

export const createSanctionTableColumns = ({
  page,
  rowsPerPage,
  handleViewDetail,
  handleDelete,
  canDelete,
  nameColumnSize = 164,
  phoneNumberColumnSize = 160,
  emailColumnSize = 220,
  blacklistReasonColumnSize = 130,
  blacklistedDateColumnSize = 116,
  createdAtColumnSize = 116,
  actionColumnSize = 100,
}: SanctionTableConfigProps): ColumnDef<any>[] => [
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
      loadingSkeleton: (
        <Box className="flex min-w-0 items-center">
          <Skeleton className="h-4 w-5 rounded-full" />
        </Box>
      ),
    },
    cell: ({ row }) => formatTableOrdinalNumber((page - 1) * rowsPerPage + row.index + 1),
  },
  {
    id: 'name',
    accessorFn: (item) =>
      `${item.first_name || ''} ${item.middle_name || ''} ${item.last_name || ''}`.trim() || '-',
    header: 'Name',
    enableSorting: false,
    size: nameColumnSize,
    minSize: 144,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const item = row.original;
      const name =
        `${item.first_name || ''} ${item.middle_name || ''} ${item.last_name || ''}`.trim() || '-';
      return <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">{name}</Box>;
    },
  },
  {
    id: 'phone_number',
    accessorFn: (item) => item.phone_number || '-',
    header: 'Phone Number',
    enableSorting: false,
    size: phoneNumberColumnSize,
    minSize: 116,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-all',
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Box className="min-w-0 break-all text-sm leading-5 text-slate-700">
          {item.phone_number || '-'}
        </Box>
      );
    },
  },
  {
    id: 'email',
    accessorFn: (item) => item.email || '-',
    header: 'Email',
    enableSorting: false,
    size: emailColumnSize,
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
          {item.email || '-'}
        </Box>
      );
    },
  },
  {
    id: 'blacklist_reason',
    accessorFn: (item) => item.blacklist_reason || '-',
    header: 'Blacklist Reason',
    enableSorting: false,
    enableResizing: false,
    size: blacklistReasonColumnSize,
    minSize: 92,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle whitespace-nowrap text-xs font-semibold text-slate-500',
      cellContentClassName: 'whitespace-nowrap',
    },
    cell: ({ row }) => {
      const item = row.original;
      return <Box>{item.blacklist_reason || '-'}</Box>;
    },
  },
  {
    accessorKey: 'date_blacklisted',
    header: 'Blacklisted Date',
    enableSorting: false,
    enableResizing: false,
    size: blacklistedDateColumnSize,
    minSize: 116,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle whitespace-nowrap',
      cellContentClassName: 'whitespace-nowrap text-xs tabular-nums text-slate-700',
      loadingSkeletonClassName: 'h-4 w-[6.9rem] rounded-full',
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Box>
          {item.date_blacklisted ? format(new Date(item.date_blacklisted), 'dd-MM-yyyy') : '-'}
        </Box>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    enableSorting: false,
    enableResizing: false,
    size: createdAtColumnSize,
    minSize: 116,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle whitespace-nowrap',
      cellContentClassName: 'whitespace-nowrap text-xs tabular-nums text-slate-700',
      loadingSkeletonClassName: 'h-4 w-[6.9rem] rounded-full',
    },
    cell: ({ row }) => {
      const item = row.original;
      return <Box>{item.created_at ? format(new Date(item.created_at), 'dd-MM-yyyy') : '-'}</Box>;
    },
  },
  {
    id: 'action',
    header: 'Action',
    enableSorting: false,
    enableResizing: false,
    size: actionColumnSize,
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
            onClick={() => handleViewDetail(item.id)}
            className="h-7 rounded-full bg-[#016DA1] px-4 text-[13px] font-medium text-white shadow-none hover:bg-[#015a85]"
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="xs"
            disabled={!canDelete}
            onClick={() => handleDelete(item.id)}
            className="h-7 w-7 p-0 rounded-md text-red-600 hover:bg-red-50 hover:!text-red-700"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </Box>
      );
    },
  },
];
