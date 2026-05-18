import { Trash } from 'react-feather';

import {
  Box,
  Button,
  Skeleton,
  type ColumnDef,
} from '@repo/ui';

import { formatCurrency } from '@/components/forms/product-catalog/package.form';
import type { PackageDto } from '@/services/product/api/product.types';

interface PackageSearchConfig {
  type?: string;
}

interface PackageProductConfig {
  search_configs?: Record<string, PackageSearchConfig>;
}

export interface PackageTableConfigProps {
  page: number;
  rowsPerPage: number;
  canEdit: boolean;
  canDelete: boolean;
  productConfig?: PackageProductConfig | null;
  category: string;
  planId: string;
  onEdit: (packageId: string) => void;
  onDelete: (packageId: string) => Promise<void>;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

const formatHeaderLabel = (value: string) =>
  value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const getHeaderColumnSize = (header: string, minSize = 112, maxSize = 260) =>
  Math.min(maxSize, Math.max(minSize, header.length * 8 + 32));

const noWrapHeaderMeta = {
  headerCellClassName: 'whitespace-nowrap',
  headerContentClassName: 'overflow-visible whitespace-nowrap text-left text-clip',
};

const resolvePackageSearchValue = (
  pkg: PackageDto,
  configKey: string,
  config: PackageSearchConfig,
) => {
  if (config.type === 'range') {
    const from = pkg.search_params[`${configKey}_from`];
    const to = pkg.search_params[`${configKey}_to`];

    return `${from ?? '-'} - ${to ?? '-'}`;
  }

  const value = pkg.search_params[configKey];

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (value !== undefined && value !== null) {
    return String(value);
  }

  return '-';
};

export const createPackageTableColumns = ({
  page,
  rowsPerPage,
  canEdit,
  canDelete,
  productConfig,
  onEdit,
  onDelete,
}: PackageTableConfigProps): ColumnDef<PackageDto>[] => {
  const columns: ColumnDef<PackageDto>[] = [
    {
      id: 'index',
      header: 'No.',
      enableSorting: false,
      enableResizing: false,
      size: 44,
      minSize: 44,
      meta: {
        ...noWrapHeaderMeta,
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
  ];

  if (productConfig?.search_configs) {
    Object.entries(productConfig.search_configs).forEach(([configKey, config]) => {
      const header = formatHeaderLabel(configKey);

      columns.push({
        id: configKey,
        accessorFn: (pkg) => resolvePackageSearchValue(pkg, configKey, config),
        header,
        enableSorting: false,
        size: getHeaderColumnSize(header),
        minSize: getHeaderColumnSize(header),
        meta: {
          ...noWrapHeaderMeta,
          cellClassName: 'align-middle',
          cellContentClassName: 'whitespace-nowrap',
        },
        cell: ({ row }) => (
          <Box className="min-w-0 whitespace-nowrap text-sm leading-5 text-slate-700">
            {resolvePackageSearchValue(row.original, configKey, config)}
          </Box>
        ),
      });
    });
  }

  columns.push(
    {
      id: 'currency',
      accessorKey: 'currency',
      header: 'Currency',
      enableSorting: false,
      size: 112,
      minSize: 112,
      meta: {
        ...noWrapHeaderMeta,
        cellClassName: 'align-middle',
        cellContentClassName: 'whitespace-nowrap',
      },
    },
    {
      id: 'premium',
      accessorFn: (pkg) => pkg.premium,
      header: 'Premium',
      enableSorting: false,
      size: 124,
      minSize: 124,
      meta: {
        ...noWrapHeaderMeta,
        cellClassName: 'align-middle text-right',
        cellContentClassName: 'w-full whitespace-nowrap text-right',
        loadingSkeletonClassName: 'ml-auto h-4 w-20 rounded-full',
      },
      cell: ({ row }) => (
        <Box className="w-full whitespace-nowrap text-right text-sm tabular-nums text-slate-900">
          {formatCurrency(row.original.premium.toString())}
        </Box>
      ),
    },
    {
      id: 'action',
      header: 'Action',
      enableSorting: false,
      enableResizing: false,
      size: 144,
      minSize: 144,
      meta: {
        ...noWrapHeaderMeta,
        headerCellClassName: 'whitespace-nowrap !px-1 text-center',
        headerContentClassName: 'overflow-visible whitespace-nowrap text-center text-clip',
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
            disabled={!canEdit}
            onClick={() => onEdit(row.original.id)}
            className="h-7 rounded-full bg-[#016DA1] px-4 text-[13px] font-medium text-white shadow-none hover:bg-[#015a85]"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="xs"
            disabled={!canDelete}
            onClick={async () => {
              if (confirm('Are you sure to delete this row?')) {
                await onDelete(row.original.id);
              }
            }}
            className="h-7 w-7 p-0 rounded-md text-red-600 hover:bg-red-50 hover:!text-red-700"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </Box>
      ),
    },
  );

  return columns;
};
