import { Box, Button, type ColumnDef } from '@repo/ui';

import { cn } from '@/lib/utils';

import type { Column as LegacyColumn } from '../core/data-table';

interface SharedPolicyTableColumnProps {
  page: number;
  rowsPerPage: number;
  onGoToDetail: (policyId: string) => void;
  getStatusColor: (status: string) => string;
}

interface CreatePolicyTableColumnsProps extends SharedPolicyTableColumnProps {
  policyNumberColumnSize: number;
  effectiveDateColumnSize: number;
  expiryDateColumnSize: number;
  statusColumnSize: number;
  actionColumnSize: number;
}

interface PolicyTableRow {
  id?: string;
  number?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  policy_holder?: {
    name?: string;
  };
  policy_products?: {
    plan_data?: {
      name?: string;
    };
  };
  notification_log?: Array<{
    stage?: string;
    status?: string;
  }>;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

export const createPolicyTableColumns = ({
  page,
  rowsPerPage,
  policyNumberColumnSize,
  effectiveDateColumnSize,
  expiryDateColumnSize,
  statusColumnSize,
  actionColumnSize,
  onGoToDetail,
  getStatusColor,
}: CreatePolicyTableColumnsProps): ColumnDef<PolicyTableRow>[] => [
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
    },
    cell: ({ row }) => formatTableOrdinalNumber((page - 1) * rowsPerPage + row.index + 1),
  },
  {
    id: 'planName',
    accessorFn: (policy) => policy?.policy_products?.plan_data?.name || '-',
    header: 'Plan Name',
    enableSorting: false,
    size: 180,
    minSize: 160,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const policy = row.original;

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-600">
          {policy?.policy_products?.plan_data?.name?.split('|').splice(0, 2).join(' - ') || '-'}
        </Box>
      );
    },
  },
  {
    accessorKey: 'number',
    id: 'policyNumber',
    header: 'Policy Number',
    enableSorting: false,
    size: policyNumberColumnSize,
    minSize: 160,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeletonClassName: 'h-4 w-[8.5rem] rounded-full',
    },
    cell: ({ row }) => {
      const policy = row.original;

      return <Box className="min-w-0 text-sm leading-5 text-slate-700">{policy.number || '-'}</Box>;
    },
  },
  {
    id: 'customerName',
    accessorFn: (policy) => policy?.policy_holder?.name || '-',
    header: 'Customer Name',
    enableSorting: false,
    size: 160,
    minSize: 136,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const policy = row.original;

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {policy?.policy_holder?.name || '-'}
        </Box>
      );
    },
  },
  {
    accessorKey: 'start_date',
    header: 'Effective Date',
    enableSorting: false,
    enableResizing: false,
    size: effectiveDateColumnSize,
    minSize: 116,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle whitespace-nowrap',
      cellContentClassName: 'whitespace-nowrap text-xs tabular-nums text-slate-700',
      loadingSkeletonClassName: 'h-4 w-[6.9rem] rounded-full',
    },
    cell: ({ row }) => {
      const policy = row.original;

      return <Box>{policy?.start_date || '-'}</Box>;
    },
  },
  {
    accessorKey: 'end_date',
    header: 'Expiry Date',
    enableSorting: false,
    enableResizing: false,
    size: expiryDateColumnSize,
    minSize: 116,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle whitespace-nowrap',
      cellContentClassName: 'whitespace-nowrap text-xs tabular-nums text-slate-700',
      loadingSkeletonClassName: 'h-4 w-[6.9rem] rounded-full',
    },
    cell: ({ row }) => {
      const policy = row.original;

      return <Box>{policy?.end_date || '-'}</Box>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: false,
    enableResizing: false,
    size: statusColumnSize,
    minSize: 100,
    meta: {
      headerCellClassName: 'whitespace-nowrap text-center',
      cellClassName: 'align-middle whitespace-nowrap text-center',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeletonClassName: 'mx-auto h-[1.375rem] w-[4.75rem] rounded-full',
    },
    cell: ({ row }) => {
      const policy = row.original;
      const status = policy?.status || '-';

      return (
        <Box className="whitespace-nowrap">
          <Box
            as="span"
            className={cn(
              'inline-flex h-[1.375rem] min-w-[4.75rem] cursor-default select-none items-center justify-center whitespace-nowrap rounded-full px-1 text-[10px] font-semibold leading-none ring-1 ring-inset',
              getStatusColor(status),
              ['Pending', 'In Force'].includes(status) && 'bg-sky-50 ring-sky-200/80',
              status === 'Grace Period' && 'bg-amber-50 ring-amber-200/80',
              status === 'Expired' && 'bg-slate-50 ring-slate-200/80',
              !['Pending', 'In Force', 'Grace Period', 'Expired'].includes(status) &&
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
      headerCellClassName: 'whitespace-nowrap text-center',
      cellClassName: 'align-middle whitespace-nowrap text-center',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeletonClassName: 'mx-auto h-7 w-[3.25rem] rounded-full',
    },
    cell: ({ row }) => {
      const policy = row.original;

      return (
        <Button
          size="xs"
          onClick={() => onGoToDetail(policy.id)}
          className="h-7 rounded-full px-2.5 text-[11px] font-semibold shadow-none"
        >
          View
        </Button>
      );
    },
  },
];

export const createPendingRenewalsTableColumns = ({
  page,
  rowsPerPage,
  onGoToDetail,
  getStatusColor,
  getStageColor,
  policyNumberColumnSize = 240,
  expiryDateColumnSize = 180,
  statusColumnSize = 160,
  actionColumnSize = 80,
}: SharedPolicyTableColumnProps & {
  getStageColor?: (stage: string) => string;
  policyNumberColumnSize?: number;
  expiryDateColumnSize?: number;
  statusColumnSize?: number;
  actionColumnSize?: number;
}): ColumnDef<PolicyTableRow>[] => [
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
    },
    cell: ({ row }) => formatTableOrdinalNumber((page - 1) * rowsPerPage + row.index + 1),
  },
  {
    id: 'customerName',
    accessorFn: (policy) => policy?.policy_holder?.name || '-',
    header: 'Customer Name',
    enableSorting: false,
    size: 160,
    minSize: 136,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const policy = row.original;

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {policy?.policy_holder?.name || '-'}
        </Box>
      );
    },
  },
  {
    accessorKey: 'number',
    id: 'policyNumber',
    header: 'Policy Number',
    enableSorting: false,
    size: policyNumberColumnSize,
    minSize: 160,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeletonClassName: 'h-4 w-[8.5rem] rounded-full',
    },
    cell: ({ row }) => {
      const policy = row.original;

      return <Box className="min-w-0 text-sm leading-5 text-slate-700">{policy.number || '-'}</Box>;
    },
  },
  {
    id: 'planName',
    accessorFn: (policy) => policy?.policy_products?.plan_data?.name || '-',
    header: 'Plan Name',
    enableSorting: false,
    size: 180,
    minSize: 160,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const policy = row.original;

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-600">
          {policy?.policy_products?.plan_data?.name?.split('|').splice(0, 2).join(' - ') || '-'}
        </Box>
      );
    },
  },
  {
    accessorKey: 'end_date',
    header: 'Expiry Date',
    enableSorting: false,
    enableResizing: false,
    size: expiryDateColumnSize,
    minSize: 116,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle whitespace-nowrap',
      cellContentClassName: 'whitespace-nowrap text-xs tabular-nums text-slate-700',
      loadingSkeletonClassName: 'h-4 w-[6.9rem] rounded-full',
    },
    cell: ({ row }) => {
      const policy = row.original;

      return <Box>{policy?.end_date || '-'}</Box>;
    },
  },
  {
    id: 'stage',
    accessorFn: (policy) => policy?.notification_log?.[0]?.stage || '-',
    header: 'Stage',
    enableSorting: false,
    enableResizing: false,
    size: 120,
    minSize: 92,
    meta: {
      headerCellClassName: 'whitespace-nowrap !px-1.5',
      cellClassName:
        'align-middle whitespace-nowrap !px-1.5 text-xs font-semibold uppercase tracking-[0.04em] text-slate-500',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeletonClassName: 'h-4 w-7 rounded-full',
    },
    cell: ({ row }) => {
      const policy = row.original;
      const stageColor =
        getStageColor?.(policy?.notification_log?.[0]?.stage || '') || 'text-gray-600';

      return (
        <Box className={cn('whitespace-nowrap font-semibold', stageColor)}>
          {policy?.notification_log?.[0]?.stage || '-'}
        </Box>
      );
    },
  },
  {
    id: 'email_status',
    accessorFn: (policy) => policy?.notification_log?.[0]?.status || '-',
    header: 'Email Status',
    enableSorting: false,
    enableResizing: false,
    size: 120,
    minSize: 92,
    meta: {
      headerCellClassName: 'whitespace-nowrap !px-1.5',
      cellClassName:
        'align-middle whitespace-nowrap !px-1.5 text-xs font-semibold uppercase tracking-[0.04em] text-slate-500',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeletonClassName: 'h-4 w-12 rounded-full',
    },
    cell: ({ row }) => {
      const policy = row.original;
      return (
        <Box
          className={cn(
            'whitespace-nowrap font-semibold',
            getStatusColor(policy?.notification_log?.[0]?.status || ''),
          )}
        >
          {policy?.notification_log?.[0]?.status || '-'}
        </Box>
      );
    },
  },
  {
    id: 'email_sent',
    accessorFn: (policy) => policy?.notification_log?.length || '-',
    header: 'Email Sent',
    enableSorting: false,
    enableResizing: false,
    size: 120,
    minSize: 92,
    meta: {
      headerCellClassName: 'whitespace-nowrap !px-1.5',
      cellClassName:
        'align-middle whitespace-nowrap !px-1.5 text-xs font-semibold uppercase tracking-[0.04em] text-slate-500',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeletonClassName: 'h-4 w-7 rounded-full',
    },
    cell: ({ row }) => {
      const policy = row.original;

      return <Box>{policy?.notification_log?.length || '-'}</Box>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: false,
    enableResizing: false,
    size: statusColumnSize,
    minSize: 100,
    meta: {
      headerCellClassName: 'whitespace-nowrap text-center',
      cellClassName: 'align-middle whitespace-nowrap text-center',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeletonClassName: 'mx-auto h-[1.375rem] w-[4.75rem] rounded-full',
    },
    cell: ({ row }) => {
      const policy = row.original;
      const status = policy?.status || '-';

      return (
        <Box className="whitespace-nowrap">
          <Box
            as="span"
            className={cn(
              'inline-flex h-[1.375rem] min-w-[4.75rem] cursor-default select-none items-center justify-center whitespace-nowrap rounded-full px-1 text-[10px] font-semibold leading-none ring-1 ring-inset',
              getStatusColor(status),
              ['Pending', 'In Force'].includes(status) && 'bg-sky-50 ring-sky-200/80',
              status === 'Grace Period' && 'bg-amber-50 ring-amber-200/80',
              status === 'Expired' && 'bg-slate-50 ring-slate-200/80',
              !['Pending', 'In Force', 'Grace Period', 'Expired'].includes(status) &&
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
      headerCellClassName: 'whitespace-nowrap text-center',
      cellClassName: 'align-middle whitespace-nowrap text-center',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeletonClassName: 'mx-auto h-7 w-[3.25rem] rounded-full',
    },
    cell: ({ row }) => {
      const policy = row.original;

      return (
        <Button
          size="xs"
          onClick={() => onGoToDetail(policy.id || '')}
          className="h-7 rounded-full px-2.5 text-[11px] font-semibold shadow-none"
        >
          View
        </Button>
      );
    },
  },
];
