import { Box, Skeleton, type ColumnDef } from '@repo/ui';

import { formatMoney } from '@/lib/formatter';

interface CampaignReportRow {
  id?: string;
  campaign_name?: string;
  type?: string;
  insurance_name?: string;
  plan_name?: string;
  currency?: string;
  total_transaction_amount?: number;
  total_discount_amount?: number;
}

interface CreateCampaignReportTableColumnsProps {
  page: number;
  rowsPerPage: number;
  transactionAmountColumnSize: number;
  discountAmountColumnSize: number;
  transactionAmountAfterDiscountColumnSize: number;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

const resolveDiscountAmount = (promotion: CampaignReportRow) =>
  Number(promotion?.total_transaction_amount || 0) - Number(promotion?.total_discount_amount || 0);

const formatPromotionAmount = (promotion: CampaignReportRow, amount: number) =>
  formatMoney(Number(amount) || 0, promotion?.currency || '') || '-';

export const createCampaignReportTableColumns = ({
  page,
  rowsPerPage,
  transactionAmountColumnSize,
  discountAmountColumnSize,
  transactionAmountAfterDiscountColumnSize,
}: CreateCampaignReportTableColumnsProps): ColumnDef<CampaignReportRow>[] => [
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
    id: 'campaignName',
    accessorFn: (promotion) => promotion?.campaign_name || '-',
    header: 'Campaign Name',
    enableSorting: false,
    size: 164,
    minSize: 144,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => (
      <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
        {row.original?.campaign_name || '-'}
      </Box>
    ),
  },
  {
    id: 'type',
    accessorFn: (promotion) => promotion?.type || '-',
    header: 'Type',
    enableSorting: false,
    enableResizing: false,
    size: 104,
    minSize: 92,
    meta: {
      headerCellClassName: 'whitespace-nowrap !px-1.5',
      cellClassName:
        'align-middle whitespace-nowrap !px-1.5 text-xs font-semibold uppercase tracking-[0.04em] text-slate-500',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeletonClassName: 'h-4 w-12 rounded-full',
    },
    cell: ({ row }) => <Box>{row.original?.type || '-'}</Box>,
  },
  {
    id: 'insuranceName',
    accessorFn: (promotion) => promotion?.insurance_name || '-',
    header: 'Insurance Company Name',
    enableSorting: false,
    size: 220,
    minSize: 220,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      headerContentClassName: 'overflow-visible whitespace-nowrap text-left text-clip',
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => (
      <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
        {row.original?.insurance_name || '-'}
      </Box>
    ),
  },
  {
    id: 'planName',
    accessorFn: (promotion) => promotion?.plan_name || '-',
    header: 'Plan Name',
    enableSorting: false,
    size: 172,
    minSize: 152,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => (
      <Box className="min-w-0 break-words text-sm leading-5 text-slate-600">
        {row.original?.plan_name?.split('|').splice(0, 2).join(' - ') || '-'}
      </Box>
    ),
  },
  {
    id: 'transactionAmount',
    accessorFn: (promotion) => Number(promotion?.total_transaction_amount || 0),
    header: 'Transaction Amount',
    enableSorting: false,
    enableResizing: false,
    size: transactionAmountColumnSize,
    minSize: 190,
    meta: {
      headerCellClassName: 'whitespace-nowrap !px-1.5 text-right',
      headerContentClassName: 'overflow-visible whitespace-nowrap text-right text-clip',
      cellClassName: 'align-middle whitespace-nowrap !px-1.5 text-right',
      cellContentClassName: 'w-full whitespace-nowrap text-right',
      loadingSkeletonClassName: 'ml-auto h-4 w-[6.5rem] rounded-full',
    },
    cell: ({ row }) => (
      <Box className="w-full whitespace-nowrap text-right text-[13px] tabular-nums text-slate-900">
        {formatPromotionAmount(row.original, Number(row.original?.total_transaction_amount || 0))}
      </Box>
    ),
  },
  {
    id: 'discountAmount',
    accessorFn: (promotion) => resolveDiscountAmount(promotion),
    header: 'Discount Amount',
    enableSorting: false,
    enableResizing: false,
    size: discountAmountColumnSize,
    minSize: 180,
    meta: {
      headerCellClassName: 'whitespace-nowrap !px-1.5 text-right',
      headerContentClassName: 'overflow-visible whitespace-nowrap text-right text-clip',
      cellClassName: 'align-middle whitespace-nowrap !px-1.5 text-right',
      cellContentClassName: 'w-full whitespace-nowrap text-right',
      loadingSkeletonClassName: 'ml-auto h-4 w-[6.5rem] rounded-full',
    },
    cell: ({ row }) => (
      <Box className="w-full whitespace-nowrap text-right text-[13px] tabular-nums text-slate-900">
        {formatPromotionAmount(row.original, resolveDiscountAmount(row.original))}
      </Box>
    ),
  },
  {
    id: 'transactionAmountAfterDiscount',
    accessorFn: (promotion) => Number(promotion?.total_discount_amount || 0),
    header: 'Transaction Amount after Discount',
    enableSorting: false,
    enableResizing: false,
    size: transactionAmountAfterDiscountColumnSize,
    minSize: 280,
    meta: {
      headerCellClassName: 'whitespace-nowrap !px-1.5 text-right',
      headerContentClassName: 'overflow-visible whitespace-nowrap text-right text-clip',
      cellClassName: 'align-middle whitespace-nowrap !px-1.5 text-right',
      cellContentClassName: 'w-full whitespace-nowrap text-right',
      loadingSkeletonClassName: 'ml-auto h-4 w-[6.5rem] rounded-full',
    },
    cell: ({ row }) => (
      <Box className="w-full whitespace-nowrap text-right text-[13px] tabular-nums text-slate-900">
        {formatPromotionAmount(row.original, Number(row.original?.total_discount_amount || 0))}
      </Box>
    ),
  },
];
