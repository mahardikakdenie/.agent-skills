import { format } from 'date-fns';
import { Trash } from 'react-feather';

import { Box, Button, Skeleton, type ColumnDef } from '@repo/ui';

export interface SourceItem {
  id: string;
  source_name: string;
  source_type: string;
  source_url?: string;
  insurance_name?: string;
  created_at?: string;
  updated_at?: string;
}

interface CreateSourceTableColumnsProps {
  page: number;
  rowsPerPage: number;
  handleViewDetail: (id: string) => void;
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

export const createSourceTableColumns = ({
  page,
  rowsPerPage,
  handleViewDetail,
  handleDelete,
  canEdit,
  canDelete,
}: CreateSourceTableColumnsProps): ColumnDef<SourceItem>[] => [
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
    id: 'source_name',
    accessorFn: (source) => source?.source_name || '-',
    header: 'Source Name',
    enableSorting: false,
    size: 180,
    minSize: 160,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const source = row.original;

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-600">
          {source?.source_name || '-'}
        </Box>
      );
    },
  },
  {
    id: 'source_type',
    accessorFn: (source) => source?.source_type || '-',
    header: 'Source Type',
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
      const source = row.original;
      return <Box>{source?.source_type ? capitalizeWords(source.source_type) : '-'}</Box>;
    },
  },
  {
    id: 'source_url',
    accessorFn: (source) => source?.source_url || '-',
    header: 'Source URL',
    enableSorting: false,
    size: 160,
    minSize: 136,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const source = row.original;

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {source?.source_url || '-'}
        </Box>
      );
    },
  },
  {
    id: 'insurance_name',
    accessorFn: (source) => source?.insurance_name || '-',
    header: 'Insurance Name',
    enableSorting: false,
    size: 160,
    minSize: 136,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const source = row.original;

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {source?.insurance_name || '-'}
        </Box>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    enableSorting: false,
    enableResizing: false,
    size: 116,
    minSize: 116,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle whitespace-nowrap',
      cellContentClassName: 'whitespace-nowrap text-xs tabular-nums text-slate-700',
      loadingSkeletonClassName: 'h-4 w-[6.9rem] rounded-full',
    },
    cell: ({ row }) => {
      const source = row.original;

      return (
        <Box>
          {source?.created_at ? format(new Date(source.created_at), 'yyyy-MM-dd') : '-'}
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
      const source = row.original;

      return (
        <Box className="flex items-center justify-center gap-2">
          <Button
            size="xs"
            onClick={() => handleViewDetail(source.id)}
            className="h-7 rounded-full bg-[#016DA1] px-4 text-[13px] font-medium text-white shadow-none hover:bg-[#015a85]"
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="xs"
            disabled={!canDelete}
            onClick={() => handleDelete(source.id)}
            className="h-7 w-7 rounded-md p-0 text-red-600 hover:bg-red-50 hover:!text-red-700"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </Box>
      );
    },
  },
];
