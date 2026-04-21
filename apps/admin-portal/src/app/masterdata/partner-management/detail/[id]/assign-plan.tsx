'use client';

import noData from '@public/images/no-data.webp';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import {
  Box,
  Button,
  DataTable,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Skeleton,
  Tabs,
  TabsList,
  TabsTrigger,
  type ColumnDef,
} from '@repo/ui';

import { useProduct } from '@/app/masterdata/product/hooks';
import { CompactTablePagination } from '@/components/ui/compact-table-pagination';
import { useScreen } from '@/context/screen.context';
import { cn } from '@/lib/utils';
import { productService } from '@/services/product/api/product.service';

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

const createAssignPlanTableColumns = ({
  page,
  rowsPerPage,
  isPlanAssigned,
  openConfirmDialog,
}: {
  page: number;
  rowsPerPage: number;
  isPlanAssigned: (planId: string) => boolean;
  openConfirmDialog: (planId: string, type: 'assign' | 'unassign') => void;
}): ColumnDef<any>[] => [
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
    id: 'insurer',
    header: 'Insurer',
    accessorFn: (product) => product.products.insurances.name,
    enableSorting: false,
    size: 192,
    minSize: 168,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
      loadingSkeleton: (
        <Box className="flex min-w-0 items-start gap-2.5">
          <Skeleton className="h-8 w-8 min-w-8 rounded-xl" />
          <Box className="min-w-0 flex-1 pt-0.5">
            <Skeleton className="h-4 w-[7.5rem] rounded-full" />
          </Box>
        </Box>
      ),
    },
    cell: ({ row }) => {
      const product = row.original;
      return (
        <Box className="flex min-w-0 items-start gap-2.5">
          <Box className="inline-flex h-8 w-8 min-w-8 items-center justify-center overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200/80">
            <Image
              src={product.products.insurances.logo_url || '/images/no-image.png'}
              alt=""
              width={100}
              height={50}
            />
          </Box>
          <Box className="min-w-0 flex-1">
            <Box as="p" className="break-words text-sm leading-5 text-slate-900">
              {product.products.insurances.name}
            </Box>
          </Box>
        </Box>
      );
    },
  },
  {
    id: 'planName',
    header: 'Plan Name',
    accessorFn: (product) => product.name,
    enableSorting: false,
    size: 220,
    minSize: 184,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const product = row.original;
      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-600">
          {product.name.split('|').map((item: string, i: number) => (
            <Box key={i}>{item}</Box>
          ))}
        </Box>
      );
    },
  },
  {
    id: 'product',
    header: 'Product',
    accessorFn: (product) => product.products.name,
    enableSorting: false,
    size: 164,
    minSize: 144,
    meta: {
      cellClassName: 'align-middle',
      cellContentClassName: 'whitespace-normal break-words',
    },
    cell: ({ row }) => {
      const product = row.original;
      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {product.products.name}
        </Box>
      );
    },
  },
  {
    id: 'action',
    header: 'Action',
    enableSorting: false,
    enableResizing: false,
    size: 120,
    minSize: 100,
    meta: {
      headerCellClassName: 'whitespace-nowrap !px-1 text-center',
      cellClassName: 'align-middle whitespace-nowrap !px-1 text-center',
      cellContentClassName: 'whitespace-nowrap',
      loadingSkeletonClassName: 'mx-auto h-7 w-[3.25rem] rounded-full',
    },
    cell: ({ row }) => {
      const product = row.original;
      return isPlanAssigned(product.id) ? (
        <Button
          type="button"
          size="xs"
          onClick={() => openConfirmDialog(product.id, 'unassign')}
          className="h-7 rounded-full !bg-red-600 px-4 text-[10px] font-bold text-white transition-all hover:!bg-red-700 active:scale-[0.96] shadow-none border-none"
        >
          Unassign
        </Button>
      ) : (
        <Button
          type="button"
          size="xs"
          onClick={() => openConfirmDialog(product.id, 'assign')}
          className="h-7 rounded-full !bg-[#016DA1] px-4 text-[10px] font-bold text-white transition-all hover:!bg-[#015a8a] active:scale-[0.96] shadow-none border-none"
        >
          Assign
        </Button>
      );
    },
  },
];

const AssignPlan = ({ id, channelName }: { id: string; channelName: string }) => {
  const { fetchCategories, categories } = useProduct();
  const [activeTab, setActiveTab] = useState<string>('');
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const { setLoading, isLoading } = useScreen();

  const [assignedPlans, setAssignedPlans] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{
    planId: string;
    type: 'assign' | 'unassign';
  } | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      await fetchCategories('');
    };
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !activeTab) {
      setActiveTab(categories[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  useEffect(() => {
    if (activeTab) {
      const category = categories.find((cat) => cat.id === activeTab);
      if (category) {
        fetchPlans(category.name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page, rowsPerPage]);

  useEffect(() => {
    if (!id) return;
    const loadAssignedPlans = async () => {
      const response: any = await productService.getChannelPackagesByChannel(id);
      if (response) {
        setAssignedPlans(response?.data || response || []);
      }
    };
    loadAssignedPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPlans = async (category: string) => {
    setLoading(true);
    try {
      const params = {
        page,
        pageSize: rowsPerPage,
        category,
      };
      const response: any = await productService.getPlans(params);
      if (response?.data && response?.meta) {
        setProducts(response.data);
        setPage(response.meta.page);
        setTotalPages(Math.ceil(response.meta.total / rowsPerPage));
        setTotalItems(response.meta.total);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = async (categoryId: string) => {
    setActiveTab(categoryId);
    setPage(1);
  };

  const formatCategoryName = (name: string) => {
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const isPlanAssigned = (planId: string) => {
    return assignedPlans.some((ap) => ap.plan === planId);
  };

  const handleActionConfirm = async () => {
    if (!selectedAction) return;

    try {
      if (selectedAction.type === 'assign') {
        await productService.assignChannelPlans({
          channel: id,
          plans: [selectedAction.planId],
          channelName,
        });
      } else {
        await productService.unassignChannelPlans({
          channel: id,
          plans: [selectedAction.planId],
        });
      }

      const response: any = await productService.getChannelPackagesByChannel(id);
      if (response) {
        setAssignedPlans(response?.data || response || []);
      }

      if (activeTab) {
        const category = categories.find((cat) => cat.id === activeTab);
        if (category) {
          fetchPlans(category.name);
        }
      }
    } catch (error) {
      console.error('Failed to process plan:', error);
    } finally {
      setDialogOpen(false);
      setSelectedAction(null);
    }
  };

  const openConfirmDialog = (planId: string, type: 'assign' | 'unassign') => {
    setSelectedAction({ planId, type });
    setDialogOpen(true);
  };

  const columns = useMemo(
    () =>
      createAssignPlanTableColumns({
        page,
        rowsPerPage,
        isPlanAssigned,
        openConfirmDialog,
      }),
    [page, rowsPerPage, assignedPlans],
  );

  return (
    <>
      <Box className="w-full flex flex-col gap-4">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          variant="underline"
          className="w-full"
        >
          <TabsList
            aria-label="Product categories tabs"
            className="w-full justify-start rounded-none border-b border-slate-100 bg-transparent p-0 text-inherit overflow-auto"
          >
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                variant="underline"
                className="h-11 px-4 py-2 text-sm font-semibold whitespace-nowrap"
              >
                <Box as="span" className="mr-2">
                  {formatCategoryName(category.name)}
                </Box>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <DataTable
          className="!gap-3 pb-0 [&_th]:px-2 [&_th]:py-2.5 [&_td]:px-2 [&_td]:py-3"
          loading={isLoading}
          data={products}
          columns={columns}
          defaultState={{
            columnPinning: {
              left: ['id', 'insurer'],
              right: ['action'],
            },
          }}
          pagination={{
            pageIndex: page - 1,
            pageSize: rowsPerPage,
            pageCount: totalPages,
            rowCount: totalItems,
            onPageChange: (pageIndex) => {
              if (isLoading) return;
              setPage(pageIndex + 1);
            },
            onPageSizeChange: (pageSize) => {
              if (isLoading) return;
              setRowsPerPage(pageSize);
              setPage(1);
            },
          }}
          pageSizeOptions={[10, 20, 30, 50, 100]}
          emptyState={
            <Box className="sticky left-0 flex min-h-[10rem] w-[100cqw] items-center justify-center gap-2 py-4 md:min-h-[11rem] md:py-5">
              <Box className="flex flex-col items-center justify-center gap-2">
                <Image alt="No plan available" src={noData} width={128} />
                <Box as="span">No plans available</Box>
              </Box>
            </Box>
          }
          renderPagination={(table) => (
            <Box className="-mt-1">
              <CompactTablePagination
                table={table}
                pageSizeOptions={[10, 20, 30, 50, 100]}
                disabled={isLoading}
              />
            </Box>
          )}
          tableOptions={{
            manualPagination: true,
            enableColumnPinning: true,
            enableColumnResizing: true,
            defaultColumn: {
              minSize: 48,
              size: 96,
            },
            getRowId: (row, index) => row?.id || `assign-plan-row-${index}`,
          }}
        />
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogContent className="max-w-[420px] gap-0 border-none p-0 sm:rounded-[28px]">
          <DialogHeader className="p-6 text-left">
            <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
              {selectedAction?.type === 'assign' ? 'Assign Plan' : 'Unassign Plan'}
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-sm font-medium text-slate-500/90">
              Are you sure you want to {selectedAction?.type} this plan?
            </DialogDescription>
          </DialogHeader>

          <Box className="h-px w-full bg-slate-100" />

          <DialogFooter className="flex flex-row items-center justify-end gap-2.5 p-6 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setSelectedAction(null);
              }}
              className="h-10 rounded-xl border-slate-200 px-5 text-sm font-semibold text-slate-600 shadow-none transition-colors hover:bg-slate-50 hover:text-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleActionConfirm}
              className={cn(
                'h-10 rounded-xl px-6 text-sm font-bold text-white shadow-none transition-all active:scale-[0.98] border-none',
                selectedAction?.type === 'assign'
                  ? '!bg-[#016DA1] hover:!bg-[#015a8a]'
                  : '!bg-red-600 hover:!bg-red-700',
              )}
            >
              {selectedAction?.type === 'assign' ? 'Assign' : 'Unassign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssignPlan;
