import { Box, Skeleton, type ColumnDef } from '@repo/ui';

export interface ExportUser {
  name: string;
  email: string;
  phone: string;
}

export interface ExportUsersTableConfigProps {
  page: number;
  rowsPerPage: number;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

export const createExportUsersTableColumns = ({
  page,
  rowsPerPage,
}: ExportUsersTableConfigProps): ColumnDef<any>[] => [
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
    accessorFn: (item) => item.name || '-',
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
          {item.name || '-'}
        </Box>
      );
    },
  },
  {
    id: 'email',
    accessorFn: (item) => item.email || '-',
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
          {item.email || '-'}
        </Box>
      );
    },
  },
  {
    id: 'phone',
    accessorFn: (item) => item.phone || '-',
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
          {item.phone || '-'}
        </Box>
      );
    },
  },
];
