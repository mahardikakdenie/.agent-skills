import { Trash } from 'react-feather';

import { Box, Button, Skeleton, type ColumnDef } from '@repo/ui';

import { capitalizeStringWithChar } from '@/lib/formatter';

export interface EmailTemplate {
  id: string;
  subject: string;
  journey: string;
  type: string;
}

interface EmailTemplateTableConfigProps {
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
  page: number;
  rowsPerPage: number;
  subjectColumnSize?: number;
  journeyColumnSize?: number;
  channelColumnSize?: number;
  actionColumnSize?: number;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

export const createEmailTemplateTableColumns = ({
  handleEdit,
  handleDelete,
  canEdit,
  canDelete,
  page,
  rowsPerPage,
  subjectColumnSize = 164,
  journeyColumnSize = 164,
  channelColumnSize = 130,
  actionColumnSize = 120,
}: EmailTemplateTableConfigProps): ColumnDef<EmailTemplate>[] => [
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
    id: 'subject',
    accessorFn: (item) => item.subject || '-',
    header: 'Subject',
    enableSorting: false,
    size: subjectColumnSize,
    minSize: 144,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {item.subject || '-'}
        </Box>
      );
    },
  },
  {
    id: 'journey',
    accessorFn: (item) => item.journey || '-',
    header: 'Journey',
    enableSorting: false,
    size: journeyColumnSize,
    minSize: 144,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {item.journey || '-'}
        </Box>
      );
    },
  },
  {
    id: 'type',
    accessorFn: (item) => item.type || '-',
    header: 'Channel',
    enableSorting: false,
    enableResizing: false,
    size: channelColumnSize,
    minSize: 92,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle whitespace-nowrap text-xs font-semibold text-slate-500',
      cellContentClassName: 'whitespace-nowrap',
    },
    cell: ({ row }) => {
      const item = row.original;
      return <Box>{capitalizeStringWithChar(item.type) || '-'}</Box>;
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
      headerCellClassName: 'whitespace-nowrap text-center',
      cellClassName: 'align-middle whitespace-nowrap text-center',
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
