import { X } from 'react-feather';

import {
  Box,
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Skeleton,
  type ColumnDef,
} from '@repo/ui';

import { cn } from '@/lib/utils';

interface CreateMembershipTableColumnsProps {
  page: number;
  rowsPerPage: number;
  goToDetail: (id: string) => void;
  getStatusColor: (status: string) => string;
  // Sizes
  genderColumnSize: number;
  memberStatusColumnSize: number;
  maritalStatusColumnSize: number;
  remarksColumnSize: number;
  planColumnSize: number;
  statusColumnSize: number;
  actionColumnSize: number;
  policyNumberColumnSize: number;
  subsidiaryColumnSize: number;
  employeeIdColumnSize: number;
  employeeNameColumnSize: number;
  memberNameColumnSize: number;
  dobColumnSize: number;
  effectiveDateColumnSize: number;
  bankNameColumnSize: number;
  branchColumnSize: number;
  bankNumberColumnSize: number;
  bankAccountNameColumnSize: number;
  emailColumnSize: number;
  membershipIdColumnSize: number;
  submissionDateColumnSize: number;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

export const createMembershipTableColumns = ({
  page,
  rowsPerPage,
  goToDetail,
  getStatusColor,
  genderColumnSize,
  memberStatusColumnSize,
  maritalStatusColumnSize,
  remarksColumnSize,
  planColumnSize,
  statusColumnSize,
  actionColumnSize,
  policyNumberColumnSize,
  subsidiaryColumnSize,
  employeeIdColumnSize,
  employeeNameColumnSize,
  memberNameColumnSize,
  dobColumnSize,
  effectiveDateColumnSize,
  bankNameColumnSize,
  branchColumnSize,
  bankNumberColumnSize,
  bankAccountNameColumnSize,
  emailColumnSize,
  membershipIdColumnSize,
  submissionDateColumnSize,
}: CreateMembershipTableColumnsProps): ColumnDef<any>[] => [
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
      const item = row.original;
      return (
        <Box className="min-w-0 text-sm leading-5 text-slate-700">
          {item.number || '-'}
        </Box>
      );
    },
  },
  {
    id: 'subsidiary',
    accessorFn: (item) => item?.profile?.subsidiary || '-',
    header: 'Subsidiary / Entity',
    enableSorting: false,
    size: subsidiaryColumnSize,
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
          {item?.profile?.subsidiary || '-'}
        </Box>
      );
    },
  },
  {
    id: 'employeeId',
    accessorKey: 'profile.employee_id',
    header: 'Employee ID',
    enableSorting: false,
    size: employeeIdColumnSize,
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
          {item?.profile?.employee_id || '-'}
        </Box>
      );
    },
  },
  {
    id: 'employeeName',
    accessorFn: (item) => item?.profile?.employee_name || '-',
    header: 'Employee Name',
    enableSorting: false,
    size: employeeNameColumnSize,
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
          {item?.profile?.employee_name || '-'}
        </Box>
      );
    },
  },
  {
    id: 'memberName',
    accessorFn: (item) => item?.profile?.member_name || '-',
    header: 'Member Name',
    enableSorting: false,
    size: memberNameColumnSize,
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
          {item?.profile?.member_name || '-'}
        </Box>
      );
    },
  },
  {
    id: 'gender',
    accessorFn: (item) => item?.profile?.gender || '-',
    header: 'Gender',
    enableSorting: false,
    enableResizing: false,
    size: genderColumnSize,
    minSize: 92,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName:
        'align-middle whitespace-nowrap text-xs font-semibold uppercase tracking-[0.04em] text-slate-500',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeletonClassName: 'h-4 w-4 rounded-full',
    },
    cell: ({ row }) => {
      const item = row.original;
      return <Box>{item?.profile?.gender || '-'}</Box>;
    },
  },
  {
    id: 'dob',
    accessorKey: 'profile.date_of_birth',
    header: 'Date of Birth',
    enableSorting: false,
    enableResizing: false,
    size: dobColumnSize,
    minSize: 116,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle whitespace-nowrap',
      cellContentClassName: 'whitespace-nowrap text-xs tabular-nums text-slate-700',
    },
    cell: ({ row }) => {
      const item = row.original;
      return <Box>{item?.profile?.date_of_birth || '-'}</Box>;
    },
  },
  {
    id: 'memberStatus',
    accessorFn: (item) => item?.profile?.member_status || '-',
    header: 'Member Status',
    enableSorting: false,
    enableResizing: false,
    size: memberStatusColumnSize,
    minSize: 92,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName:
        'align-middle whitespace-nowrap text-xs font-semibold uppercase tracking-[0.04em] text-slate-500',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeletonClassName: 'h-4 w-4 rounded-full',
    },
    cell: ({ row }) => {
      const item = row.original;
      return <Box>{item?.profile?.member_status || '-'}</Box>;
    },
  },
  {
    id: 'maritalStatus',
    accessorFn: (item) => item?.profile?.marital_status || '-',
    header: 'Marital Status',
    enableSorting: false,
    enableResizing: false,
    size: maritalStatusColumnSize,
    minSize: 92,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName:
        'align-middle whitespace-nowrap text-xs font-semibold uppercase tracking-[0.04em] text-slate-500',
      cellContentClassName: 'whitespace-nowrap',
    },
    cell: ({ row }) => {
      const item = row.original;
      return <Box>{item?.profile?.marital_status || '-'}</Box>;
    },
  },
  {
    id: 'plan',
    accessorFn: (item) => item?.profile?.plan || '-',
    header: 'Plan',
    enableSorting: false,
    enableResizing: false,
    size: planColumnSize,
    minSize: 120,
    meta: {
      headerCellClassName: 'whitespace-nowrap text-right',
      cellClassName: 'align-middle whitespace-nowrap text-right',
      cellContentClassName: 'w-full whitespace-nowrap text-right',
      loadingSkeletonClassName: 'ml-auto h-4 w-[5.25rem] rounded-full',
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Box className="w-full whitespace-nowrap text-right text-[13px] tabular-nums text-slate-900">
          {item?.profile?.plan || '-'}
        </Box>
      );
    },
  },
  {
    id: 'effectiveDate',
    accessorKey: 'profile.effective_date',
    header: 'Effective Date',
    enableSorting: false,
    enableResizing: false,
    size: effectiveDateColumnSize,
    minSize: 116,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle whitespace-nowrap',
      cellContentClassName: 'whitespace-nowrap text-xs tabular-nums text-slate-700',
    },
    cell: ({ row }) => {
      const item = row.original;
      return <Box>{item?.profile?.effective_date || '-'}</Box>;
    },
  },
  {
    id: 'remarks',
    accessorFn: (item) => item?.profile?.remarks || '-',
    header: 'Remarks',
    enableSorting: false,
    enableResizing: false,
    size: remarksColumnSize,
    minSize: 92,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName:
        'align-middle whitespace-nowrap text-xs font-semibold uppercase tracking-[0.04em] text-slate-500',
      cellContentClassName: 'whitespace-nowrap',
    },
    cell: ({ row }) => {
      const item = row.original;
      return <Box>{item?.profile?.remarks || '-'}</Box>;
    },
  },
  {
    id: 'bankName',
    accessorFn: (item) => item?.profile?.bank_name || '-',
    header: 'Bank Name',
    enableSorting: false,
    size: bankNameColumnSize,
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
          {item?.profile?.bank_name || '-'}
        </Box>
      );
    },
  },
  {
    id: 'branch',
    accessorFn: (item) => item?.profile?.branch || '-',
    header: 'Branch',
    enableSorting: false,
    size: branchColumnSize,
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
          {item?.profile?.branch || '-'}
        </Box>
      );
    },
  },
  {
    id: 'bankNumber',
    accessorKey: 'profile.bank_account_number',
    header: 'Bank Number',
    enableSorting: false,
    size: bankNumberColumnSize,
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
          {item?.profile?.bank_account_number || '-'}
        </Box>
      );
    },
  },
  {
    id: 'bankAccountName',
    accessorFn: (item) => item?.profile?.bank_account_name || '-',
    header: 'Bank Account Name',
    enableSorting: false,
    size: bankAccountNameColumnSize,
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
          {item?.profile?.bank_account_name || '-'}
        </Box>
      );
    },
  },
  {
    id: 'email',
    accessorFn: (item) => item?.profile?.email || '-',
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
          {item?.profile?.email || '-'}
        </Box>
      );
    },
  },
  {
    id: 'membershipId',
    accessorKey: 'other_info.tpa_member_id',
    header: 'Membership ID',
    enableSorting: false,
    size: membershipIdColumnSize,
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
          {item?.other_info?.tpa_member_id || '-'}
        </Box>
      );
    },
  },
  {
    id: 'submissionDate',
    accessorKey: 'created_at',
    header: 'Submission Date',
    enableSorting: false,
    enableResizing: false,
    size: submissionDateColumnSize,
    minSize: 116,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle whitespace-nowrap',
      cellContentClassName: 'whitespace-nowrap text-xs tabular-nums text-slate-700',
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Box>
          {item?.created_at ? new Date(item.created_at).toISOString().split('T')[0] : '-'}
        </Box>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: false,
    enableResizing: false,
    size: statusColumnSize,
    minSize: 88,
    meta: {
      headerCellClassName: 'whitespace-nowrap text-center',
      cellClassName: 'align-middle whitespace-nowrap text-center',
      cellContentClassName: 'whitespace-nowrap',
    },
    cell: ({ row }) => {
      const item = row.original;
      const status = item?.status;

      return (
        <Box className="whitespace-nowrap">
          <Box
            as="span"
            className={cn(
              'inline-flex h-[1.375rem] min-w-[4.75rem] cursor-default select-none items-center justify-center whitespace-nowrap rounded-full px-1 text-[10px] font-semibold leading-none ring-1 ring-inset',
              getStatusColor(status),
              status === 'Active' && 'bg-emerald-50 ring-emerald-200/80',
              status === 'Pending' && 'bg-amber-50 ring-amber-200/80',
              status === 'Inactive' && 'bg-slate-50 ring-slate-200/80',
              !['Active', 'Pending', 'Inactive'].includes(status) && 'bg-slate-50 ring-slate-200/80',
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
      const item = row.original;
      const detailRows = [
        {
          label: 'Policy Number',
          value: item.number || '-',
        },
        {
          label: 'Member Name',
          value: item?.profile?.member_name || '-',
        },
        {
          label: 'Employee ID',
          value: item?.profile?.employee_id || '-',
        },
        {
          label: 'Subsidiary / Entity',
          value: item?.profile?.subsidiary || '-',
        },
        {
          label: 'Plan',
          value: item?.profile?.plan || '-',
        },
        {
          label: 'Status',
          value: item?.status || '-',
          valueClassName: cn('font-semibold', getStatusColor(item?.status)),
        },
      ];

      return (
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <Button
              size="xs"
              className="h-7 rounded-full px-2.5 text-[11px] font-semibold shadow-none"
            >
              View
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-w-[30rem]">
            <DrawerHeader className="gap-0 pb-0">
              <DrawerClose className="absolute right-3 top-3">
                <Button variant="ghost" className="h-8 w-8 rounded-full p-0 shadow-none">
                  <X className="h-4.5 w-4.5" />
                </Button>
              </DrawerClose>
              <DrawerTitle className="pr-10 text-2xl font-bold tracking-tight text-black">
                Membership Details
              </DrawerTitle>
              <DrawerDescription className="mt-4 block text-inherit">
                <Box className="w-full rounded-2xl bg-slate-50/80 p-4 ring-1 ring-slate-200/70 md:p-5">
                  <Box className="flex flex-col gap-3.5 text-black">
                    <Box className="grid gap-3">
                      {detailRows.map((detail) => (
                        <Box
                          key={detail.label}
                          className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5"
                        >
                          <Box className="font-medium text-slate-700">{detail.label}</Box>
                          <Box className="text-slate-400">:</Box>
                          <Box
                            className={cn(
                              'min-w-0 break-words text-slate-900',
                              detail.valueClassName,
                            )}
                          >
                            {detail.value}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                    <Box className="pt-1">
                      <Button
                        onClick={() => goToDetail(item.id)}
                        className="h-9 rounded-full bg-primary px-4 text-white shadow-none"
                      >
                        Go to Detail
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      );
    },
  },
];
