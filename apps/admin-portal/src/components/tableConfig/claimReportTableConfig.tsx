import { Box, Skeleton, type ColumnDef } from '@repo/ui';

type ClaimReportRow = Record<string, unknown> & {
  id?: string;
};

interface CreateClaimReportTableColumnsProps {
  headers: string[];
  page: number;
  rowsPerPage: number;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

const getHeaderColumnSize = (header: string, index: number) => {
  const baseSize = index === 0 ? 180 : 200;
  const estimatedHeaderWidth = Math.ceil(header.length * 7.5) + 40;

  return Math.max(baseSize, estimatedHeaderWidth);
};

export const createClaimReportTableColumns = ({
  headers,
  page,
  rowsPerPage,
}: CreateClaimReportTableColumnsProps): ColumnDef<ClaimReportRow>[] => {
  const rowNumberColumn: ColumnDef<ClaimReportRow> = {
    id: 'rowNumber',
    header: 'No.',
    enableSorting: false,
    enableResizing: false,
    size: 56,
    minSize: 56,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      headerContentClassName: 'overflow-visible whitespace-nowrap text-left text-clip',
      cellClassName: 'align-middle text-slate-500',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeleton: (
        <Box className="flex min-w-0 items-center">
          <Skeleton className="h-4 w-5 rounded-full" />
        </Box>
      ),
    },
    cell: ({ row }) => formatTableOrdinalNumber((page - 1) * rowsPerPage + row.index + 1),
  };

  const dynamicColumns: ColumnDef<ClaimReportRow>[] = headers.map((header, index) => ({
    id: header,
    accessorFn: (claim) => claim?.[header] ?? '-',
    header,
    enableSorting: false,
    size: getHeaderColumnSize(header, index),
    minSize: getHeaderColumnSize(header, index),
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      headerContentClassName: 'overflow-visible whitespace-nowrap text-left text-clip',
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

  return [rowNumberColumn, ...dynamicColumns];
};
