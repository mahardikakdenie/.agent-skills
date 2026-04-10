import { Box, Skeleton, type ColumnDef } from '@repo/ui';

interface HospitalTableConfigProps {
  page: number;
  rowsPerPage: number;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

export const createHospitalTableColumns = ({
  page,
  rowsPerPage,
}: HospitalTableConfigProps): ColumnDef<any>[] => [
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
    id: 'id_provider',
    accessorFn: (item) => item?.reference?.id_provider || '-',
    header: 'Profile ID',
    enableSorting: false,
    size: 120,
    minSize: 100,
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
          {item?.reference?.id_provider || '-'}
        </Box>
      );
    },
  },
  {
    id: 'name',
    accessorFn: (item) => item?.name || '-',
    header: 'Provider Name',
    enableSorting: false,
    size: 240,
    minSize: 180,
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
    id: 'provider_type',
    accessorFn: (item) => item?.reference?.provider_type || '-',
    header: 'Provider Type',
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
      return <Box>{item?.reference?.provider_type || '-'}</Box>;
    },
  },
  {
    id: 'name_province',
    accessorFn: (item) => item?.reference?.name_province || '-',
    header: 'Province',
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
          {item?.reference?.name_province || '-'}
        </Box>
      );
    },
  },
  {
    id: 'name_city',
    accessorFn: (item) => item?.reference?.name_city || '-',
    header: 'City',
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
          {item?.reference?.name_city || '-'}
        </Box>
      );
    },
  },
  {
    id: 'address',
    accessorFn: (item) => item?.reference?.address || '-',
    header: 'Address',
    enableSorting: false,
    size: 264,
    minSize: 144,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {item?.reference?.address || '-'}
        </Box>
      );
    },
  },
  {
    id: 'long',
    accessorFn: (item) => item?.reference?.long || '-',
    header: 'Longitude',
    enableSorting: false,
    size: 130,
    minSize: 110,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {item?.reference?.long || '-'}
        </Box>
      );
    },
  },
  {
    id: 'lat',
    accessorFn: (item) => item?.reference?.lat || '-',
    header: 'Latitude',
    enableSorting: false,
    size: 130,
    minSize: 110,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {item?.reference?.lat || '-'}
        </Box>
      );
    },
  },
  {
    id: 'outpatient',
    accessorFn: (item) => item?.reference?.outpatient || '-',
    header: 'Facility OP',
    enableSorting: false,
    enableResizing: false,
    size: 130,
    minSize: 92,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName:
        'align-middle whitespace-nowrap text-xs font-semibold text-slate-500 uppercase',
      cellContentClassName: 'whitespace-nowrap uppercase',
    },
    cell: ({ row }) => {
      const item = row.original;
      return <Box className="uppercase">{item?.reference?.outpatient || '-'}</Box>;
    },
  },
  {
    id: 'inpatient',
    accessorFn: (item) => item?.reference?.inpatient || '-',
    header: 'Facility IP',
    enableSorting: false,
    enableResizing: false,
    size: 130,
    minSize: 92,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName:
        'align-middle whitespace-nowrap text-xs font-semibold text-slate-500 uppercase',
      cellContentClassName: 'whitespace-nowrap uppercase',
    },
    cell: ({ row }) => {
      const item = row.original;
      return <Box className="uppercase">{item?.reference?.inpatient || '-'}</Box>;
    },
  },
  {
    id: 'phone',
    accessorFn: (item) => item?.reference?.phone || '-',
    header: 'Phone',
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
          {item?.reference?.phone || '-'}
        </Box>
      );
    },
  },
];
