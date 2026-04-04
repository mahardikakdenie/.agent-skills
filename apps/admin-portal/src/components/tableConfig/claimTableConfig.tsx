import { Eye, X } from 'react-feather';

import { Box, Button, Input, type ColumnDef } from '@repo/ui';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui';

import { type Column } from '@/components/ui/DataTable';
import {
  ClaimItem,
  ClaimsTableConfigProps,
  DocumentItem,
  DocumentTableConfigProps,
} from '@/interface';
import { formatDate, formatMoneyClaim } from '@/lib/formatter';

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);
const claimActionLoadingSkeletonClassName = 'mx-auto h-7 w-[3.25rem] rounded-full';

const getRequestedClaimAmount = (claim: ClaimItem) => {
  const claimValue = claim.claim?.find(
    (item) => item.type === 'Number' && item.name === 'claim',
  )?.value;

  const numericValue = Number(claimValue);
  return Number.isNaN(numericValue) ? null : numericValue;
};

export const createClaimsTableColumns = ({
  page,
  rowsPerPage,
  claimIdColumnSize,
  customerNameColumnSize,
  planNameColumnSize,
  currencyColumnSize,
  amountColumnSize,
  lastModifiedColumnSize,
  statusColumnSize,
  actionColumnSize,
  renderStatusCell,
  onViewDetail,
}: ClaimsTableConfigProps): ColumnDef<ClaimItem>[] => [
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
    id: 'claimId',
    accessorKey: 'number',
    header: 'Claim ID',
    enableSorting: false,
    size: claimIdColumnSize,
    minSize: 160,
    meta: {
      headerCellClassName: 'whitespace-nowrap',
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeletonClassName: 'h-4 w-[8.5rem] rounded-full',
    },
    cell: ({ row }) => {
      const claim = row.original;

      return (
        <Box className="min-w-0 text-sm leading-5 text-slate-700">
          {claim.number || '-'}
        </Box>
      );
    },
  },
  {
    id: 'customerName',
    accessorFn: (claim) => claim?.policy_data?.policy_holder?.name || '-',
    header: 'Customer Name',
    enableSorting: false,
    size: customerNameColumnSize,
    minSize: 144,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const claim = row.original;

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {claim?.policy_data?.policy_holder?.name || '-'}
        </Box>
      );
    },
  },
  {
    id: 'planName',
    accessorFn: (claim) => claim?.package?.plan?.name || '-',
    header: 'Plan Name',
    enableSorting: false,
    size: planNameColumnSize,
    minSize: 184,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const claim = row.original;

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-600">
          {claim?.package?.plan?.name?.split('|').splice(0, 2).join(' - ') || '-'}
        </Box>
      );
    },
  },
  {
    id: 'benefit',
    accessorFn: (claim) => claim?.benefit?.description_en || '-',
    header: 'Benefit',
    enableSorting: false,
    size: planNameColumnSize,
    minSize: 184,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const claim = row.original;

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-600">
          {claim?.benefit?.description_en || '-'}
        </Box>
      );
    },
  },
  {
    id: 'currency',
    accessorFn: (claim) => claim?.currency || '-',
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
      const claim = row.original;

      return <Box>{claim?.currency || '-'}</Box>;
    },
  },
  {
    id: 'requestedAmount',
    accessorFn: (claim) => getRequestedClaimAmount(claim) ?? 0,
    header: 'Requested Amount',
    enableSorting: false,
    enableResizing: false,
    size: amountColumnSize,
    minSize: 120,
    meta: {
      headerCellClassName: 'whitespace-nowrap !px-1.5 text-right',
      cellClassName: 'align-middle whitespace-nowrap !px-1.5 text-right',
      cellContentClassName: 'w-full whitespace-nowrap text-right',
      loadingSkeletonClassName: 'ml-auto h-4 w-[5.25rem] rounded-full',
    },
    cell: ({ row }) => {
      const requestedAmount = getRequestedClaimAmount(row.original);

      return (
        <Box className="w-full whitespace-nowrap text-right text-[13px] tabular-nums text-slate-900">
          {requestedAmount !== null ? formatMoneyClaim(requestedAmount) : '-'}
        </Box>
      );
    },
  },
  {
    id: 'approvedAmount',
    accessorFn: (claim) => claim?.amount_approved ?? 0,
    header: 'Approved Amount',
    enableSorting: false,
    enableResizing: false,
    size: amountColumnSize,
    minSize: 120,
    meta: {
      headerCellClassName: 'whitespace-nowrap !px-1.5 text-right',
      cellClassName: 'align-middle whitespace-nowrap !px-1.5 text-right',
      cellContentClassName: 'w-full whitespace-nowrap text-right',
      loadingSkeletonClassName: 'ml-auto h-4 w-[5.25rem] rounded-full',
    },
    cell: ({ row }) => {
      const claim = row.original;

      return (
        <Box className="w-full whitespace-nowrap text-right text-[13px] tabular-nums text-slate-900">
          {formatMoneyClaim(claim.amount_approved ?? 0)}
        </Box>
      );
    },
  },
  {
    id: 'editedBy',
    accessorFn: (claim) => claim?.edited_by || '-',
    header: 'Edited By',
    enableSorting: false,
    size: customerNameColumnSize,
    minSize: 144,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const claim = row.original;

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {claim?.edited_by || '-'}
        </Box>
      );
    },
  },
  {
    id: 'lastModified',
    accessorKey: 'updated_at',
    header: 'Last Modified',
    enableSorting: false,
    enableResizing: false,
    size: lastModifiedColumnSize,
    minSize: 116,
    meta: {
      headerCellClassName: 'whitespace-nowrap !px-1',
      cellClassName: 'align-middle whitespace-nowrap !px-1',
      cellContentClassName: 'whitespace-nowrap text-xs tabular-nums text-slate-700',
      loadingSkeletonClassName: 'h-4 w-[6.9rem] rounded-full',
    },
    cell: ({ row }) => {
      const claim = row.original;

      return (
        <Box>{claim.updated_at ? formatDate(claim.updated_at, 'DD/MM/YYYY, HH:mm') : '-'}</Box>
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
      headerCellClassName: 'whitespace-nowrap !px-1 text-center',
      cellClassName: 'align-middle whitespace-nowrap !px-1 text-center',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeletonClassName: 'mx-auto h-7 w-[8.75rem] rounded-full',
    },
    cell: ({ row }) => renderStatusCell(row.original),
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
      loadingSkeletonClassName: claimActionLoadingSkeletonClassName,
    },
    cell: ({ row }) => {
      const claim = row.original;

      return (
        <Button
          size="xs"
          onClick={() => onViewDetail(claim.id)}
          className="h-7 rounded-full px-2.5 text-[11px] font-semibold shadow-none"
        >
          View
        </Button>
      );
    },
  },
];

export const createDocumentTableColumns = ({
  selectedDocuments,
  onCheckboxChange,
  onSelectDocument,
  isDocumentSelected,
}: DocumentTableConfigProps): Column<DocumentItem>[] => [
  {
    key: 'select',
    header: 'Select',
    className: 'w-10',
    render: (document) => (
      <Box className="text-center">
        <Input
          type="checkbox"
          checked={
            document.type.toLowerCase() === 'fields'
              ? isDocumentSelected(
                  document?.fields?.filter((a: any) => a.type.toLowerCase() === 'file')?.[0]
                    ?.name || '',
                )
              : isDocumentSelected(document.name)
          }
          onClick={() => {
            let docName = document.name;
            if (document.type.toLowerCase() === 'fields') {
              docName =
                document?.fields?.filter((a: any) => a.type.toLowerCase() === 'file')?.[0]?.name ||
                '';
            }
            onCheckboxChange(docName);
          }}
          className="w-4 h-4 mx-auto"
        />
      </Box>
    ),
  },
  {
    key: 'document_type',
    header: 'Document Type',
    render: (document) => (
      <>
        {document.type.toLowerCase() === 'fields'
          ? document?.fields?.filter((a: any) => a.type.toLowerCase() === 'file')?.[0]?.label?.en ||
            document?.fields?.filter((a: any) => a.type.toLowerCase() === 'file')?.[0]
              ?.label_multilanguage?.en ||
            document?.fields?.filter((a: any) => a.type.toLowerCase() === 'file')?.[0]?.label ||
            '-'
          : document?.label?.en || document?.label_multilanguage?.en || document?.label || '-'}
      </>
    ),
  },
  {
    key: 'criteria',
    header: 'Criteria',
    render: (document) =>
      document.type.toLowerCase() === 'fields'
        ? document?.fields?.filter((a: any) => a.type.toLowerCase() === 'file')?.[0]?.criteria ||
          '-'
        : document?.criteria || '-',
  },
  {
    key: 'definition',
    header: 'Definition',
    render: (document) =>
      document.type.toLowerCase() === 'fields'
        ? document?.fields?.filter((a: any) => a.type.toLowerCase() === 'file')?.[0]?.definition ||
          '-'
        : document?.definition || '-',
  },
  {
    key: 'message',
    header: 'Message',
    className: 'w-24 text-center',
    render: (document) => (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="bg-transparent hover:bg-transparent rounded-full text-blue-500 w-auto p-0 h-6"
            onClick={onSelectDocument}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 w-[500px] max-w-full overflow-hidden">
          <DialogHeader className="bg-transparent py-3 px-4 sm:px-6">
            <DialogTitle className="text-sm sm:text-base flex items-center">
              Message Preview
              <DialogClose className="ml-auto">
                <Button
                  type="button"
                  className="bg-transparent hover:bg-transparent text-black p-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </DialogClose>
            </DialogTitle>
          </DialogHeader>

          <Box className="flex flex-col px-4 pb-4">
            <Box as="p" className="text-sm">
              Document type:{' '}
              {document.type.toLowerCase() === 'fields'
                ? document?.fields?.filter((a: any) => a.type.toLowerCase() === 'file')?.[0]
                    ?.name || '-'
                : document?.name || '-'}
            </Box>
            <Box as="p" className="text-sm">
              Criteria:{' '}
              {document.type.toLowerCase() === 'fields'
                ? document?.fields?.filter((a: any) => a.type.toLowerCase() === 'file')?.[0]
                    ?.criteria || '-'
                : document?.criteria || '-'}
            </Box>
            <Box as="p" className="text-sm">
              Definition:{' '}
              {document.type.toLowerCase() === 'fields'
                ? document?.fields?.filter((a: any) => a.type.toLowerCase() === 'file')?.[0]
                    ?.definition || '-'
                : document?.definition || '-'}
            </Box>
            <Box as="hr" className="my-4" />
            <Box as="p" className="text-sm">
              "
              {document.type.toLowerCase() === 'fields'
                ? document?.fields?.filter((a: any) => a.type.toLowerCase() === 'file')?.[0]
                    ?.pending_reason_message?.en || '-'
                : document?.pending_reason_message?.en || '-'}
              "
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    ),
  },
];
