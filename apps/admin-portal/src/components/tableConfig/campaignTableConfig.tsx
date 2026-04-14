import { format } from 'date-fns';
import { Trash } from 'react-feather';

import { Box, Button, Skeleton, type ColumnDef } from '@repo/ui';

import { cn } from '@/lib/utils';

interface CampaignItem {
  campaign_id: string;
  name: string;
  type: string;
  value_currency: string;
  value_type: string;
  value: number;
  start_date: string;
  end_date: string;
  active: boolean;
  minimum_amount: number;
  maximum_amount: number;
}

interface CampaignTableConfigProps {
  page: number;
  rowsPerPage: number;
  handleViewDetail: (id: string) => void;
  handleDelete: (id: string) => void;
  canDelete: boolean;
  renderStatus: (isActive: boolean) => string;
  nameColumnSize?: number;
  typeColumnSize?: number;
  currencyColumnSize?: number;
  valueColumnSize?: number;
  dateColumnSize?: number;
  statusColumnSize?: number;
  actionColumnSize?: number;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

export const createCampaignTableColumns = ({
  page,
  rowsPerPage,
  handleViewDetail,
  handleDelete,
  canDelete,
  renderStatus,
  nameColumnSize = 164,
  typeColumnSize = 130,
  currencyColumnSize = 120,
  valueColumnSize = 60,
  dateColumnSize = 116,
  statusColumnSize = 88,
  actionColumnSize = 120,
}: CampaignTableConfigProps): ColumnDef<CampaignItem>[] => [
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
    header: 'Campaign Name',
    enableSorting: false,
    size: nameColumnSize,
    minSize: 144,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const item = row.original;
      const name = item.name || '-';
      return <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">{name}</Box>;
    },
  },
  {
    id: 'type',
    accessorFn: (item) => item.type || '-',
    header: 'Type',
    enableSorting: false,
    enableResizing: false,
    size: typeColumnSize,
    minSize: 92,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle whitespace-nowrap text-xs font-semibold text-slate-500',
      cellContentClassName: 'whitespace-nowrap',
    },
    cell: ({ row }) => {
      const item = row.original;
      return <Box>{item.type || '-'}</Box>;
    },
  },
  {
    id: 'value_currency',
    accessorFn: (item) => item.value_currency || '-',
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
      const item = row.original;
      return <Box>{item.value_currency || '-'}</Box>;
    },
  },
  {
    id: 'value',
    accessorFn: (item) => item.value,
    header: 'Value',
    enableSorting: false,
    enableResizing: false,
    size: valueColumnSize,
    minSize: 64,
    meta: {
      headerCellClassName: 'whitespace-nowrap !px-1.5 text-right',
      cellClassName: 'align-middle whitespace-nowrap !px-1.5 text-right',
      cellContentClassName: 'w-full whitespace-nowrap text-right',
      loadingSkeletonClassName: 'ml-auto h-4 w-[5.25rem] rounded-full',
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Box className="w-full whitespace-nowrap text-right text-[13px] tabular-nums text-slate-900">
          {item.value_type === 'percentage'
            ? `${item.value}%`
            : `${Number(item.value).toLocaleString()}`}
        </Box>
      );
    },
  },
  {
    accessorKey: 'start_date',
    header: 'Start Date',
    enableSorting: false,
    enableResizing: false,
    size: dateColumnSize,
    minSize: 116,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle whitespace-nowrap',
      cellContentClassName: 'whitespace-nowrap text-xs tabular-nums text-slate-700',
      loadingSkeletonClassName: 'h-4 w-[6.9rem] rounded-full',
    },
    cell: ({ row }) => {
      const item = row.original;
      return <Box>{item.start_date ? format(new Date(item.start_date), 'dd-MM-yyyy') : '-'}</Box>;
    },
  },
  {
    accessorKey: 'end_date',
    header: 'End Date',
    enableSorting: false,
    enableResizing: false,
    size: dateColumnSize,
    minSize: 116,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle whitespace-nowrap',
      cellContentClassName: 'whitespace-nowrap text-xs tabular-nums text-slate-700',
      loadingSkeletonClassName: 'h-4 w-[6.9rem] rounded-full',
    },
    cell: ({ row }) => {
      const item = row.original;
      return <Box>{item.end_date ? format(new Date(item.end_date), 'dd-MM-yyyy') : '-'}</Box>;
    },
  },
  {
    accessorKey: 'active',
    header: 'Active',
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
      const item = row.original;
      return (
        <Box className="whitespace-nowrap">
          <Box
            as="span"
            className={cn(
              'inline-flex h-[1.375rem] min-w-20 cursor-default select-none items-center justify-center whitespace-nowrap rounded-full px-1 text-[10px] font-semibold leading-none ring-1 ring-inset',
              item.active
                ? 'text-[#00AB4F] bg-emerald-50 ring-emerald-200/80'
                : 'text-slate-500 bg-slate-50 ring-slate-200/80',
            )}
          >
            {renderStatus(item.active)}
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
            onClick={() => handleViewDetail(item.campaign_id)}
            className="h-7 rounded-full bg-[#016DA1] px-4 text-[13px] font-medium text-white shadow-none hover:bg-[#015a85]"
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="xs"
            disabled={!canDelete}
            onClick={() => handleDelete(item.campaign_id)}
            className="h-7 w-7 p-0 rounded-md text-red-600 hover:bg-red-50 hover:!text-red-700"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </Box>
      );
    },
  },
];
