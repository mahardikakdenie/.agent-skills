import { Trash } from 'lucide-react';
import Image from 'next/image';

import { Box, Button, Skeleton, type ColumnDef } from '@repo/ui';

export interface ProductCatalogTableData {
  id: string;
  name: string;
  products: {
    name: string;
    insurances: {
      name: string;
      logo_url: string | null;
    };
  };
}

export interface ProductCatalogTableConfigProps {
  page: number;
  rowsPerPage: number;
  onViewDetail: (id: string) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

export const createProductCatalogTableColumns = ({
  page,
  rowsPerPage,
  onViewDetail,
  onDelete,
  canDelete,
}: ProductCatalogTableConfigProps): ColumnDef<ProductCatalogTableData>[] => [
  {
    id: 'index',
    header: 'No.',
    enableSorting: false,
    enableResizing: false,
    size: 52,
    minSize: 52,
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
    id: 'insurer',
    accessorFn: (product) => product.products?.insurances?.name || '-',
    header: 'Insurer',
    enableSorting: false,
    size: 208,
    minSize: 180,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
      loadingSkeleton: (
        <Box className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-4 w-28 rounded-full" />
        </Box>
      ),
    },
    cell: ({ row }) => {
      const product = row.original;
      const logoUrl = product.products?.insurances?.logo_url || null;

      return (
        <Box className="flex min-w-0 items-center gap-2 text-sm leading-5 text-slate-700">
          <Box className="inline-flex h-8 w-8 min-w-8 items-center justify-center">
            {logoUrl && (
              <Image src={logoUrl} alt="" width={100} height={50} className="w-full h-auto" />
            )}
          </Box>
          <Box as="span" className="min-w-0 break-words">
            {product.products?.insurances?.name || '-'}
          </Box>
        </Box>
      );
    },
  },
  {
    id: 'name',
    accessorFn: (product) => product.name || '-',
    header: 'Plan Name',
    enableSorting: false,
    size: 240,
    minSize: 176,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => (
      <Box className="min-w-44 break-words text-sm leading-5 text-slate-700">
        {(row.original.name || '-').split('|').map((item: string, i: number) => (
          <Box key={`${item}-${i}`}>{item}</Box>
        ))}
      </Box>
    ),
  },
  {
    id: 'product',
    accessorFn: (product) => product.products?.name || '-',
    header: 'Product',
    enableSorting: false,
    size: 176,
    minSize: 144,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => (
      <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
        {row.original.products?.name || '-'}
      </Box>
    ),
  },
  {
    id: 'actions',
    header: 'Action',
    enableSorting: false,
    enableResizing: false,
    size: 128,
    minSize: 112,
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
    cell: ({ row }) => (
      <Box className="flex items-center justify-center gap-2">
        <Button
          size="xs"
          onClick={() => onViewDetail(row.original.id)}
          className="h-7 rounded-full bg-[#016DA1] px-4 text-[13px] font-medium text-white shadow-none hover:bg-[#015a85]"
        >
          View
        </Button>
        <Button
          variant="ghost"
          size="xs"
          disabled={!canDelete}
          onClick={() => onDelete(row.original.id)}
          className="h-7 w-7 rounded-md p-0 text-red-600 hover:bg-red-50 hover:!text-red-700"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </Box>
    ),
  },
];
