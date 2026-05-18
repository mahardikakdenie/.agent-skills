import { Trash } from 'react-feather';

import { Box, Button, Skeleton, type ColumnDef } from '@repo/ui';

import { cn } from '@/lib/utils';

interface PartnerTableConfigProps {
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
  page: number;
  rowsPerPage: number;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Inactive':
      return 'text-slate-500';
    case 'Active':
      return 'text-[#00AB4F]';
    default:
      return 'text-[#7B5D21]';
  }
};

export const createPartnerTableColumns = ({
  handleEdit,
  handleDelete,
  canEdit,
  canDelete,
  page,
  rowsPerPage,
}: PartnerTableConfigProps): ColumnDef<any>[] => [
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
    accessorFn: (item) => item?.name || '-',
    header: 'Name',
    enableSorting: false,
    size: 164,
    minSize: 144,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {item?.name || '-'}
        </Box>
      );
    },
  },
  {
    id: 'email',
    accessorFn: (item) => item?.email || '-',
    header: 'Email',
    enableSorting: false,
    size: 220,
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
          {item?.email || '-'}
        </Box>
      );
    },
  },
  {
    id: 'phone_number',
    accessorFn: (item) => item?.phone_number || '-',
    header: 'Phone Number',
    enableSorting: false,
    size: 160,
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
          {item?.phone_number || '-'}
        </Box>
      );
    },
  },
  {
    id: 'role',
    accessorFn: (item) => item?.role || '-',
    header: 'Role',
    enableSorting: false,
    enableResizing: false,
    size: 130,
    minSize: 92,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle whitespace-nowrap text-xs font-semibold text-slate-500',
      cellContentClassName: 'whitespace-nowrap',
    },
    cell: ({ row }) => {
      const item = row.original;
      return <Box>{item?.role || '-'}</Box>;
    },
  },
  {
    id: 'status',
    accessorFn: (item) => item?.status || '-',
    header: 'Status',
    enableSorting: false,
    enableResizing: false,
    size: 120,
    minSize: 72,
    meta: {
      headerCellClassName: 'whitespace-nowrap text-center',
      cellClassName: 'align-middle whitespace-nowrap text-center',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeletonClassName: 'mx-auto h-[1.375rem] w-[4.75rem] rounded-full',
    },
    cell: ({ row }) => {
      const item = row.original;
      const status = item?.status;

      if (!status || status === '-' || status.trim() === '') {
        return <Box className="flex justify-center w-full text-slate-500">-</Box>;
      }

      return (
        <Box className="flex justify-center w-full whitespace-nowrap">
          <Box
            as="span"
            className={cn(
              'inline-flex h-[1.375rem] min-w-20 cursor-default select-none items-center justify-center whitespace-nowrap rounded-full px-1 text-[10px] font-semibold leading-none ring-1 ring-inset',
              getStatusColor(status),
              status === 'Active' && 'bg-emerald-50 ring-emerald-200/80',
              status === 'Inactive' && 'bg-slate-50 ring-slate-200/80',
              !['Active', 'Inactive'].includes(status) && 'bg-slate-50 ring-slate-200/80',
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
            className="h-7 w-7 p-0 rounded-md text-red-600 hover:bg-red-50 hover:!text-red-700"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </Box>
      );
    },
  },
];
