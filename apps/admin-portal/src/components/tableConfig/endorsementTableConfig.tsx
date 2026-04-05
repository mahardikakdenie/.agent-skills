import { Box, Button, Skeleton, type ColumnDef } from '@repo/ui';

import { cn } from '@/lib/utils';

interface CreateEndorsementTableColumnsProps {
  page: number;
  rowsPerPage: number;
  onGoToDetail: (endorsementId: string) => void;
  getStatusColor: (status: string) => string;
  // Sizes
  requestIdColumnSize: number;
  insuredNameColumnSize: number;
  policyNumberColumnSize: number;
  requestDateColumnSize: number;
  approveRejectedDateColumnSize: number;
  typeColumnSize: number;
  statusColumnSize: number;
  verifiedByColumnSize: number;
  actionColumnSize: number;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

export const createEndorsementTableColumns = ({
  page,
  rowsPerPage,
  onGoToDetail,
  getStatusColor,
  requestIdColumnSize,
  insuredNameColumnSize,
  policyNumberColumnSize,
  requestDateColumnSize,
  approveRejectedDateColumnSize,
  typeColumnSize,
  statusColumnSize,
  verifiedByColumnSize,
  actionColumnSize,
}: CreateEndorsementTableColumnsProps): ColumnDef<any>[] => [
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
    id: 'requestId',
    accessorKey: 'number',
    header: 'Request ID',
    enableSorting: false,
    size: requestIdColumnSize,
    minSize: 160,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeletonClassName: 'h-4 w-[8.5rem] rounded-full',
    },
    cell: ({ row }) => {
      const endorsement = row.original;

      return (
        <Box className="min-w-0 text-sm leading-5 text-slate-700">{endorsement.number || '-'}</Box>
      );
    },
  },
  {
    id: 'insuredName',
    accessorFn: (endorsement) =>
      endorsement?.insured_parties?.profile?.name ||
      endorsement?.policies?.policy_holders?.name ||
      endorsement?.participants?.profile?.name ||
      '-',
    header: 'Insured Name',
    enableSorting: false,
    size: insuredNameColumnSize,
    minSize: 144,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
      loadingSkeleton: (
        <Box className="flex min-w-0 items-center">
          <Skeleton className="h-4 w-32 rounded-full [tr:nth-child(2n)_&]:w-40 [tr:nth-child(3n)_&]:w-44" />
        </Box>
      ),
    },
    cell: ({ row }) => {
      const endorsement = row.original;
      const insuredName =
        endorsement?.insured_parties?.profile?.name ||
        endorsement?.policies?.policy_holders?.name ||
        endorsement?.participants?.profile?.name ||
        '-';

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">{insuredName}</Box>
      );
    },
  },
  {
    id: 'policyNumber',
    accessorFn: (endorsement) => endorsement?.policies?.number || '-',
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
      const endorsement = row.original;

      return (
        <Box className="min-w-0 text-sm leading-5 text-slate-700">
          {endorsement?.policies?.number || '-'}
        </Box>
      );
    },
  },
  {
    id: 'requestDate',
    accessorKey: 'created_at',
    header: 'Request Date',
    enableSorting: false,
    enableResizing: false,
    size: requestDateColumnSize,
    minSize: 100,
    meta: {
      headerCellClassName: 'whitespace-nowrap !px-1',
      cellClassName: 'align-middle whitespace-nowrap !px-1',
      cellContentClassName: 'whitespace-nowrap text-xs tabular-nums text-slate-700',
      loadingSkeletonClassName: 'h-4 w-[6.9rem] rounded-full',
    },
    cell: ({ row }) => {
      const endorsement = row.original;

      return (
        <Box>
          {endorsement?.created_at
            ? new Date(endorsement.created_at).toLocaleDateString('en-GB')
            : '-'}
        </Box>
      );
    },
  },
  {
    id: 'approveRejectedDate',
    accessorKey: 'updated_at',
    header: 'Approve/Rejected Date',
    enableSorting: false,
    enableResizing: false,
    size: approveRejectedDateColumnSize,
    minSize: 160,
    meta: {
      headerCellClassName: 'whitespace-nowrap !px-1',
      cellClassName: 'align-middle whitespace-nowrap !px-1',
      cellContentClassName: 'whitespace-nowrap text-xs tabular-nums text-slate-700',
      loadingSkeletonClassName: 'h-4 w-[6.9rem] rounded-full',
    },
    cell: ({ row }) => {
      const endorsement = row.original;

      return (
        <Box>
          {endorsement?.status !== 'Pending' && endorsement?.updated_at
            ? new Date(endorsement.updated_at).toLocaleDateString('en-GB')
            : '-'}
        </Box>
      );
    },
  },
  {
    id: 'type',
    accessorFn: (endorsement) => endorsement?.type || '-',
    header: 'Type',
    enableSorting: false,
    enableResizing: false,
    size: typeColumnSize,
    minSize: 92,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName:
        'align-middle whitespace-nowrap text-xs font-semibold uppercase tracking-[0.04em] text-slate-500',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeleton: (
        <Box className="flex min-w-0 items-center">
          <Skeleton className="h-4 w-16 rounded-full [tr:nth-child(2n)_&]:w-24 [tr:nth-child(3n)_&]:w-20" />
        </Box>
      ),
    },
    cell: ({ row }) => {
      const endorsement = row.original;

      return <Box>{endorsement?.type || '-'}</Box>;
    },
  },
  {
    id: 'verifiedBy',
    accessorFn: (endorsement) =>
      (endorsement?.status_description?.split(' by ')[1] || '-').replace(/\b\w/g, (c: string) =>
        c.toUpperCase(),
      ),
    header: 'Verified By',
    enableSorting: false,
    size: verifiedByColumnSize,
    minSize: 144,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
      loadingSkeleton: (
        <Box className="flex min-w-0 items-center">
          <Skeleton className="h-4 w-32 rounded-full [tr:nth-child(2n)_&]:w-44 [tr:nth-child(3n)_&]:w-40" />
        </Box>
      ),
    },
    cell: ({ row }) => {
      const endorsement = row.original;
      const verifiedBy = (endorsement?.status_description?.split(' by ')[1] || '-').replace(
        /\b\w/g,
        (c: string) => c.toUpperCase(),
      );

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">{verifiedBy}</Box>
      );
    },
  },
  {
    id: 'status',
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
      loadingSkeleton: (
        <Box className="flex min-w-0 items-center justify-center">
          <Skeleton className="h-5 w-16 rounded-full" />
        </Box>
      ),
    },
    cell: ({ row }) => {
      const endorsement = row.original;
      const status = endorsement?.status;

      return (
        <Box className="whitespace-nowrap">
          <Box
            as="span"
            className={cn(
              'inline-flex h-[1.375rem] min-w-20 cursor-default select-none items-center justify-center whitespace-nowrap rounded-full px-1 text-[10px] font-semibold leading-none ring-1 ring-inset',
              getStatusColor(status),
              status === 'Approved' && 'bg-emerald-50 ring-emerald-200/80',
              status === 'Pending' && 'bg-amber-50 ring-amber-200/80',
              status === 'Rejected' && 'bg-red-50 ring-red-200/80',
              !['Approved', 'Pending', 'Rejected'].includes(status) &&
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
      loadingSkeleton: (
        <Box className="flex min-w-0 items-center justify-center">
          <Skeleton className="h-7 w-[3.25rem] rounded-full" />
        </Box>
      ),
    },
    cell: ({ row }) => {
      const endorsement = row.original;

      return (
        <Button
          size="xs"
          onClick={() => onGoToDetail(endorsement.id)}
          className="h-7 rounded-full px-2.5 text-[11px] font-semibold shadow-none"
        >
          View
        </Button>
      );
    },
  },
];

export const createCompareDataTableColumns = (): any[] => [
  {
    id: 'dataType',
    key: 'dataType',
    header: 'Data Type',
    accessorKey: 'dataType',
    meta: {
      headerCellClassName: 'bg-[#016DA1] text-white',
    },
    cell: ({ row }: any) => {
      return <Box className="font-medium">{row.original.dataType}</Box>;
    },
    render: (item: any) => <Box className="font-medium">{item.dataType}</Box>,
  },
  {
    id: 'previousData',
    key: 'previousData',
    header: 'Previous Data',
    accessorKey: 'previousData',
    meta: {
      headerCellClassName: 'bg-[#016DA1] text-white',
    },
    cell: ({ row }: any) => {
      return <Box>{row.original.previousData || '-'}</Box>;
    },
    render: (item: any) => <Box>{item.previousData || '-'}</Box>,
  },
  {
    id: 'updateData',
    key: 'updateData',
    header: 'Update Data',
    accessorKey: 'updateData',
    meta: {
      headerCellClassName: 'bg-[#016DA1] text-white',
    },
    cell: ({ row }: any) => {
      return <Box>{row.original.updateData || '-'}</Box>;
    },
    render: (item: any) => <Box>{item.updateData || '-'}</Box>,
  },
];

// Endorsement Details Table Config
export const createEndorsementDetailsTableColumns = (
  getStatusColor: (status: string) => string,
): any[] => [
  {
    id: 'id',
    key: 'id',
    header: 'No.',
    cell: ({ row }: any) => row.index + 1,
    render: (_item: any, index: number) => index + 1,
  },
  {
    id: 'recordMode',
    key: 'data.profile.record_mode',
    accessorKey: 'data.profile.record_mode',
    header: 'Record Mode',
    cell: ({ row }: any) => {
      return <Box>{row.original?.data?.profile?.record_mode || '-'}</Box>;
    },
    render: (item: any) => <Box>{item?.data?.profile?.record_mode || '-'}</Box>,
  },
  {
    id: 'tpaMemberId',
    key: 'data.profile.tpa_member_id',
    accessorKey: 'data.profile.tpa_member_id',
    header: 'TPA Member ID',
    cell: ({ row }: any) => {
      return (
        <Box className="min-w-[180px]">{row.original?.data?.profile?.tpa_member_id || '-'}</Box>
      );
    },
    render: (item: any) => (
      <Box className="min-w-[180px]">{item?.data?.profile?.tpa_member_id || '-'}</Box>
    ),
  },
  {
    id: 'policyNumber',
    key: 'insured_parties.policy.number',
    accessorKey: 'insured_parties.policy.number',
    header: 'Policy Number',
    cell: ({ row }: any) => {
      return (
        <Box className="min-w-[180px]">{row.original?.insured_parties?.policy?.number || '-'}</Box>
      );
    },
    render: (item: any) => (
      <Box className="min-w-[180px]">{item?.insured_parties?.policy?.number || '-'}</Box>
    ),
  },
  {
    id: 'subsidiary',
    key: 'data.profile.subsidiary',
    accessorKey: 'data.profile.subsidiary',
    header: 'Subsidiary / Entity',
    cell: ({ row }: any) => {
      const item = row.original;
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.subsidiary}` !== `${insuredProfile.subsidiary}`;

      return (
        <Box className={`min-w-[230px] ${isDifferent ? 'bg-yellow-50' : ''}`}>
          {profile.subsidiary || '-'}
        </Box>
      );
    },
    render: (item: any) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.subsidiary}` !== `${insuredProfile.subsidiary}`;

      return (
        <Box className={`min-w-[230px] ${isDifferent ? 'bg-yellow-50' : ''}`}>
          {profile.subsidiary || '-'}
        </Box>
      );
    },
  },
  {
    id: 'employeeId',
    key: 'data.profile.employee_id',
    accessorKey: 'data.profile.employee_id',
    header: 'Employee ID',
    cell: ({ row }: any) => {
      const item = row.original;
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.employee_id}` !== `${insuredProfile.employee_id}`;

      return (
        <Box className={isDifferent ? 'bg-yellow-50' : ''}>{profile.employee_id || '-'}</Box>
      );
    },
    render: (item: any) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.employee_id}` !== `${insuredProfile.employee_id}`;

      return (
        <Box className={isDifferent ? 'bg-yellow-50' : ''}>{profile.employee_id || '-'}</Box>
      );
    },
  },
  {
    id: 'employeeName',
    key: 'data.profile.employee_name',
    accessorKey: 'data.profile.employee_name',
    header: 'Employee Name',
    cell: ({ row }: any) => {
      const item = row.original;
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.employee_name}` !== `${insuredProfile.employee_name}`;

      return (
        <Box className={`min-w-[240px] ${isDifferent ? 'bg-yellow-50' : ''}`}>
          {profile.employee_name || '-'}
        </Box>
      );
    },
    render: (item: any) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.employee_name}` !== `${insuredProfile.employee_name}`;

      return (
        <Box className={`min-w-[240px] ${isDifferent ? 'bg-yellow-50' : ''}`}>
          {profile.employee_name || '-'}
        </Box>
      );
    },
  },
  {
    id: 'memberName',
    key: 'data.profile.member_name',
    accessorKey: 'data.profile.member_name',
    header: 'Member Name',
    cell: ({ row }: any) => {
      const item = row.original;
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.member_name}` !== `${insuredProfile.member_name}`;

      return (
        <Box className={`min-w-[240px] ${isDifferent ? 'bg-yellow-50' : ''}`}>
          {profile.member_name || '-'}
        </Box>
      );
    },
    render: (item: any) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.member_name}` !== `${insuredProfile.member_name}`;

      return (
        <Box className={`min-w-[240px] ${isDifferent ? 'bg-yellow-50' : ''}`}>
          {profile.member_name || '-'}
        </Box>
      );
    },
  },
  {
    id: 'gender',
    key: 'data.profile.gender',
    accessorKey: 'data.profile.gender',
    header: 'Gender',
    cell: ({ row }: any) => {
      const item = row.original;
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.gender}` !== `${insuredProfile.gender}`;

      return (
        <Box className={`text-center ${isDifferent ? 'bg-yellow-50' : ''}`}>
          {profile.gender || '-'}
        </Box>
      );
    },
    render: (item: any) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.gender}` !== `${insuredProfile.gender}`;

      return (
        <Box className={`text-center ${isDifferent ? 'bg-yellow-50' : ''}`}>
          {profile.gender || '-'}
        </Box>
      );
    },
  },
  {
    id: 'dob',
    key: 'data.profile.date_of_birth',
    accessorKey: 'data.profile.date_of_birth',
    header: 'Date of Birth',
    cell: ({ row }: any) => {
      const item = row.original;
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.date_of_birth}` !== `${insuredProfile.date_of_birth}`;

      return (
        <Box className={isDifferent ? 'bg-yellow-50' : ''}>{profile.date_of_birth || '-'}</Box>
      );
    },
    render: (item: any) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.date_of_birth}` !== `${insuredProfile.date_of_birth}`;

      return (
        <Box className={isDifferent ? 'bg-yellow-50' : ''}>{profile.date_of_birth || '-'}</Box>
      );
    },
  },
  {
    id: 'memberStatus',
    key: 'data.profile.member_status',
    accessorKey: 'data.profile.member_status',
    header: 'Member Status',
    cell: ({ row }: any) => {
      const item = row.original;
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.member_status}` !== `${insuredProfile.member_status}`;

      return (
        <Box className={`text-center ${isDifferent ? 'bg-yellow-50' : ''}`}>
          {profile.member_status || '-'}
        </Box>
      );
    },
    render: (item: any) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.member_status}` !== `${insuredProfile.member_status}`;

      return (
        <Box className={`text-center ${isDifferent ? 'bg-yellow-50' : ''}`}>
          {profile.member_status || '-'}
        </Box>
      );
    },
  },
  {
    id: 'maritalStatus',
    key: 'data.profile.marital_status',
    accessorKey: 'data.profile.marital_status',
    header: 'Marital Status',
    cell: ({ row }: any) => {
      const item = row.original;
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.marital_status}` !== `${insuredProfile.marital_status}`;

      return (
        <Box className={isDifferent ? 'bg-yellow-50' : ''}>{profile.marital_status || '-'}</Box>
      );
    },
    render: (item: any) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.marital_status}` !== `${insuredProfile.marital_status}`;

      return (
        <Box className={isDifferent ? 'bg-yellow-50' : ''}>{profile.marital_status || '-'}</Box>
      );
    },
  },
  {
    id: 'plan',
    key: 'data.profile.plan',
    accessorKey: 'data.profile.plan',
    header: 'Plan',
    cell: ({ row }: any) => {
      const item = row.original;
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.plan}` !== `${insuredProfile.plan}`;

      return <Box className={isDifferent ? 'bg-yellow-50' : ''}>{profile.plan || '-'}</Box>;
    },
    render: (item: any) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.plan}` !== `${insuredProfile.plan}`;

      return <Box className={isDifferent ? 'bg-yellow-50' : ''}>{profile.plan || '-'}</Box>;
    },
  },
  {
    id: 'effectiveDate',
    key: 'data.profile.effective_date',
    accessorKey: 'data.profile.effective_date',
    header: 'Effective Date',
    cell: ({ row }: any) => {
      const item = row.original;
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.effective_date}` !== `${insuredProfile.effective_date}`;

      return (
        <Box className={isDifferent ? 'bg-yellow-50' : ''}>{profile.effective_date || '-'}</Box>
      );
    },
    render: (item: any) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.effective_date}` !== `${insuredProfile.effective_date}`;

      return (
        <Box className={isDifferent ? 'bg-yellow-50' : ''}>{profile.effective_date || '-'}</Box>
      );
    },
  },
  {
    id: 'remarks',
    key: 'data.profile.remarks',
    accessorKey: 'data.profile.remarks',
    header: 'Remarks',
    cell: ({ row }: any) => {
      const item = row.original;
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.remarks}` !== `${insuredProfile.remarks}`;

      return <Box className={isDifferent ? 'bg-yellow-50' : ''}>{profile.remarks || '-'}</Box>;
    },
    render: (item: any) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.remarks}` !== `${insuredProfile.remarks}`;

      return <Box className={isDifferent ? 'bg-yellow-50' : ''}>{profile.remarks || '-'}</Box>;
    },
  },
  {
    id: 'bankName',
    key: 'data.profile.bank_name',
    accessorKey: 'data.profile.bank_name',
    header: 'Bank Name',
    cell: ({ row }: any) => {
      const item = row.original;
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.bank_name}` !== `${insuredProfile.bank_name}`;

      return <Box className={isDifferent ? 'bg-yellow-50' : ''}>{profile.bank_name || '-'}</Box>;
    },
    render: (item: any) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.bank_name}` !== `${insuredProfile.bank_name}`;

      return <Box className={isDifferent ? 'bg-yellow-50' : ''}>{profile.bank_name || '-'}</Box>;
    },
  },
  {
    id: 'branch',
    key: 'data.profile.branch',
    accessorKey: 'data.profile.branch',
    header: 'Branch',
    cell: ({ row }: any) => {
      const item = row.original;
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.branch}` !== `${insuredProfile.branch}`;

      return <Box className={isDifferent ? 'bg-yellow-50' : ''}>{profile.branch || '-'}</Box>;
    },
    render: (item: any) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.branch}` !== `${insuredProfile.branch}`;

      return <Box className={isDifferent ? 'bg-yellow-50' : ''}>{profile.branch || '-'}</Box>;
    },
  },
  {
    id: 'bankNumber',
    key: 'data.profile.bank_account_number',
    accessorKey: 'data.profile.bank_account_number',
    header: 'Bank Number',
    cell: ({ row }: any) => {
      const item = row.original;
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent =
        `${profile.bank_account_number}` !== `${insuredProfile.bank_account_number}`;

      return (
        <Box className={isDifferent ? 'bg-yellow-50' : ''}>
          {profile.bank_account_number || '-'}
        </Box>
      );
    },
    render: (item: any) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent =
        `${profile.bank_account_number}` !== `${insuredProfile.bank_account_number}`;

      return (
        <Box className={isDifferent ? 'bg-yellow-50' : ''}>
          {profile.bank_account_number || '-'}
        </Box>
      );
    },
  },
  {
    id: 'bankAccountName',
    key: 'data.profile.bank_account_name',
    accessorKey: 'data.profile.bank_account_name',
    header: 'Bank Account Name',
    cell: ({ row }: any) => {
      const item = row.original;
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.bank_account_name}` !== `${insuredProfile.bank_account_name}`;

      return (
        <Box className={`min-w-[200px] ${isDifferent ? 'bg-yellow-50' : ''}`}>
          {profile.bank_account_name || '-'}
        </Box>
      );
    },
    render: (item: any) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.bank_account_name}` !== `${insuredProfile.bank_account_name}`;

      return (
        <Box className={`min-w-[200px] ${isDifferent ? 'bg-yellow-50' : ''}`}>
          {profile.bank_account_name || '-'}
        </Box>
      );
    },
  },
  {
    id: 'email',
    key: 'data.profile.email',
    accessorKey: 'data.profile.email',
    header: 'Email',
    cell: ({ row }: any) => {
      const item = row.original;
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.email}` !== `${insuredProfile.email}`;

      return <Box className={isDifferent ? 'bg-yellow-50' : ''}>{profile.email || '-'}</Box>;
    },
    render: (item: any) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.email}` !== `${insuredProfile.email}`;

      return <Box className={isDifferent ? 'bg-yellow-50' : ''}>{profile.email || '-'}</Box>;
    },
  },
  {
    id: 'insuranceCard',
    key: 'data.profile.insurance_card',
    accessorKey: 'data.profile.insurance_card',
    header: 'Insurance Card',
    cell: ({ row }: any) => {
      const item = row.original;
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.insurance_card}` !== `${insuredProfile.insurance_card}`;

      return (
        <Box className={isDifferent ? 'bg-yellow-50' : ''}>{profile.insurance_card || '-'}</Box>
      );
    },
    render: (item: any) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.insurance_card}` !== `${insuredProfile.insurance_card}`;

      return (
        <Box className={isDifferent ? 'bg-yellow-50' : ''}>{profile.insurance_card || '-'}</Box>
      );
    },
  },
  {
    id: 'submissionDate',
    key: 'data.profile.submission_date',
    accessorKey: 'data.profile.submission_date',
    header: 'Submission Date',
    cell: ({ row }: any) => {
      const item = row.original;
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.submission_date}` !== `${insuredProfile.submission_date}`;

      return (
        <Box className={isDifferent ? 'bg-yellow-50' : ''}>{profile.submission_date || '-'}</Box>
      );
    },
    render: (item: any) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.submission_date}` !== `${insuredProfile.submission_date}`;

      return (
        <Box className={isDifferent ? 'bg-yellow-50' : ''}>{profile.submission_date || '-'}</Box>
      );
    },
  },
  {
    id: 'status',
    key: 'endorsements.status',
    accessorKey: 'endorsements.status',
    header: 'Status',
    cell: ({ row }: any) => {
      const status = row.original?.endorsements?.status || '-';

      return (
        <Box className="font-semibold">
          <Box as="span" className={getStatusColor(status)}>
            {status}
          </Box>
        </Box>
      );
    },
    render: (item: any) => {
      const status = item?.endorsements?.status || '-';

      return (
        <Box className="font-semibold">
          <Box as="span" className={getStatusColor(status)}>
            {status}
          </Box>
        </Box>
      );
    },
  },
];
