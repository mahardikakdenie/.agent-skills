import { Box, Skeleton, type ColumnDef } from '@repo/ui';

type ClaimReportRow = Record<string, unknown> & {
  id?: string;
};

export const createClaimReportTableColumns = (headers: string[]): ColumnDef<ClaimReportRow>[] => {
  return headers.map((header, index) => ({
    id: header,
    accessorFn: (claim) => claim?.[header] ?? '-',
    header,
    enableSorting: false,
    size: index === 0 ? 180 : 200,
    minSize: index === 0 ? 140 : 160,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
      loadingSkeleton: (
        <Box className="flex min-w-0 items-center">
          <Skeleton className="h-4 w-24 rounded-full" />
        </Box>
      ),
    },
    cell: ({ row }) => {
      const value = row.original?.[header];
      const displayValue = value?.toString() || '-';

      return (
        <Box
          className="line-clamp-3 min-w-0 max-w-[220px] overflow-hidden break-words text-sm leading-5 text-slate-700"
          title={displayValue}
        >
          {displayValue}
        </Box>
      );
    },
  }));
};
