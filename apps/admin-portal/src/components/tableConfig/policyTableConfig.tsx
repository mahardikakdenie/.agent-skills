import { Box, Button, type ColumnDef } from '@repo/ui';

import { cn } from '@/lib/utils';

import type { Column as LegacyColumn } from '../ui/DataTable';

interface SharedPolicyTableColumnProps {
  page: number;
  rowsPerPage: number;
  onGoToDetail: (policyId: string) => void;
  getStatusColor: (status: string) => string;
}

interface CreatePolicyTableColumnsProps extends SharedPolicyTableColumnProps {
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
    header: 'Policy Number',
    enableSorting: false,
    size: 136,
    minSize: 116,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-all',
    },
    cell: ({ row }) => {
      const policy = row.original;

      return (
        <Box className="min-w-0 break-all text-sm leading-5 text-slate-700">
          {policy.number || '-'}
        </Box>
      );
    },
  },
  {
    id: 'planName',
    accessorFn: (policy) => policy?.policy_products?.plan_data?.name || '-',
    header: 'Plan Name',
    enableSorting: false,
    size: 208,
    minSize: 176,
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
    accessorKey: 'start_date',
    header: 'Effective Date',
    enableSorting: false,
    enableResizing: false,
    size: effectiveDateColumnSize,
    minSize: 116,
    meta: {
      headerCellClassName: 'whitespace-nowrap !px-1',
      cellClassName: 'align-middle whitespace-nowrap !px-1',
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
      headerCellClassName: 'whitespace-nowrap !px-1',
      cellClassName: 'align-middle whitespace-nowrap !px-1',
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
    minSize: 84,
    meta: {
      headerCellClassName: 'whitespace-nowrap !px-1 text-center',
      cellClassName: 'align-middle whitespace-nowrap !px-1 text-center',
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
      headerCellClassName: 'whitespace-nowrap !px-1 text-center',
      cellClassName: 'align-middle whitespace-nowrap !px-1 text-center',
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
}: SharedPolicyTableColumnProps & {
  getStageColor?: (stage: string) => string;
}): LegacyColumn<PolicyTableRow>[] => [
  {
    key: 'id',
    header: 'No.',
    render: (_, index) => (page - 1) * rowsPerPage + index + 1,
  },
  {
    key: 'policy_holder.name',
    header: 'Customer Name',
    render: (policy) => {
      return <Box className="flex items-center gap-2">{policy?.policy_holder?.name || '-'}</Box>;
    },
  },
  {
    key: 'number',
    header: 'Policy Number',
    render: (policy) => {
      return <Box>{policy.number}</Box>;
    },
  },
  {
    key: 'policy_products.plan_data.name',
    header: 'Plan Name',
    render: (policy) => {
      return (
        <Box className="min-w-44">
          {policy?.policy_products?.plan_data?.name?.split('|').join(' - ') || '-'}
        </Box>
      );
    },
  },
  {
    key: 'end_date',
    header: 'Expiry Date',
    render: (policy) => {
      return <Box className="whitespace-nowrap">{policy?.end_date || '-'}</Box>;
    },
  },
  {
    key: 'stage',
    header: 'Stage',
    render: (policy) => {
      const stageColor =
        getStageColor?.(policy?.notification_log[0]?.stage || '') || 'text-gray-600';
      return (
        <Box className="whitespace-nowrap font-semibold">
          <Box as="span" className={stageColor}>
            {policy?.notification_log[0]?.stage || '-'}
          </Box>
        </Box>
      );
    },
  },
  {
    key: 'email_status',
    header: 'Email Status',
    render: (policy) => {
      return (
        <Box className="whitespace-nowrap font-semibold">
          <Box as="span" className={getStatusColor(policy?.notification_log[0]?.status || '')}>
            {policy?.notification_log[0]?.status || '-'}
          </Box>
        </Box>
      );
    },
  },
  {
    key: 'email_sent',
    header: 'Email Sent',
    render: (policy) => {
      return <Box>{policy?.notification_log?.length || '-'}</Box>;
    },
  },
  {
    key: 'action',
    header: 'Action',
    render: (policy) => {
      return (
        <Button onClick={() => onGoToDetail(policy.id)} className="rounded-full">
          View
        </Button>
      );
    },
  },
];
