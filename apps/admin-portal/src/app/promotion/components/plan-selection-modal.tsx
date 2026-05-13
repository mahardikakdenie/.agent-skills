import noData from '@public/images/no-data.webp';
import React, { useEffect, useMemo, useState } from 'react';
import { Check, Search, X } from 'react-feather';

import {
  Box,
  Button,
  Checkbox,
  DataTable,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Image,
  Input,
  type ColumnDef,
} from '@repo/ui';

import { CompactTablePagination } from '@/components/ui/compact-table-pagination';

interface PlanResponseDTO {
  data: Plan[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

interface Plan {
  id: string;
  created_at: string;
  updated_at: string;
  product: string;
  name: string;
  duration_max: number | null;
  duration_max_additional_days: number | null;
  duration_max_additional_premium: number | null;
  policy_per_participant: boolean;
  slug: string;
  premium_discount_type: string;
  premium_discount_value: string;
  premium_campaign_id: string;
  products: Product;
}

interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  insurance: string;
  category: string;
  name: string;
  instant_policy: boolean;
}

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (plans: Plan[]) => void;
  plans?: PlanResponseDTO;
  products: { id: string; name: string }[];
  preSelectedPlanIds: Set<string>;
  selectedProductIds: Set<string>;
  onPageChangePlan: (page: number) => void;
  totalPlanItems: number;
  pagePlan: number;
  showPlansPerPage: number;
  onPlansPerPageChange: (plansPerPage: number) => void;
  globalSelectedPlanIds: Set<string>;
  setGlobalSelectedPlanIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  globalSelectedProdIds: Set<string>;
  onRemovePlan: (planId: string) => void;
  onSearch: (query: string) => void;
}

const pageSizeOptions = [10, 20, 30, 50];

const PlanSelectionModal: React.FC<PlanSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  plans,
  products,
  preSelectedPlanIds,
  onPageChangePlan,
  totalPlanItems,
  pagePlan,
  showPlansPerPage,
  onPlansPerPageChange,
  globalSelectedPlanIds,
  setGlobalSelectedPlanIds,
  onRemovePlan,
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlanMap, setSelectedPlanMap] = useState<Map<string, Plan>>(new Map());

  const data = useMemo(() => plans?.data || [], [plans?.data]);
  const totalItems = totalPlanItems || plans?.meta?.total || 0;
  const totalPages = Math.max(Math.ceil(totalItems / showPlansPerPage), 1);
  const selectedIds = globalSelectedPlanIds.size > 0 ? globalSelectedPlanIds : preSelectedPlanIds;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    onPageChangePlan(pagePlan);
  }, [isOpen, onPageChangePlan, pagePlan]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSelectedPlanMap((prevSelectedPlans) => {
      const nextSelectedPlans = new Map(
        Array.from(prevSelectedPlans).filter(([planId]) => selectedIds.has(planId)),
      );

      data.forEach((plan) => {
        if (selectedIds.has(plan.id)) {
          nextSelectedPlans.set(plan.id, plan);
        }
      });

      return nextSelectedPlans;
    });
  }, [data, isOpen, selectedIds]);

  const isAllSelected = data.length > 0 && data.every((plan) => globalSelectedPlanIds.has(plan.id));

  const handleCheckboxChange = React.useCallback(
    (plan: Plan) => {
      if (globalSelectedPlanIds.has(plan.id)) {
        setSelectedPlanMap((prevSelectedPlans) => {
          const nextSelectedPlans = new Map(prevSelectedPlans);
          nextSelectedPlans.delete(plan.id);
          return nextSelectedPlans;
        });
        setGlobalSelectedPlanIds((prevSelectedPlans) => {
          const nextSelectedPlans = new Set(prevSelectedPlans);
          nextSelectedPlans.delete(plan.id);
          return nextSelectedPlans;
        });
        onRemovePlan(plan.id);
        return;
      }

      setSelectedPlanMap((prevSelectedPlans) => {
        const nextSelectedPlans = new Map(prevSelectedPlans);
        nextSelectedPlans.set(plan.id, plan);
        return nextSelectedPlans;
      });
      setGlobalSelectedPlanIds((prevSelectedPlans) => {
        const nextSelectedPlans = new Set(prevSelectedPlans);
        nextSelectedPlans.add(plan.id);
        return nextSelectedPlans;
      });
    },
    [globalSelectedPlanIds, onRemovePlan, setGlobalSelectedPlanIds],
  );

  const handleSelectAllChange = React.useCallback(() => {
    if (isAllSelected) {
      data.forEach((plan) => {
        onRemovePlan(plan.id);
      });

      setSelectedPlanMap((prevSelectedPlans) => {
        const nextSelectedPlans = new Map(prevSelectedPlans);
        data.forEach((plan) => {
          nextSelectedPlans.delete(plan.id);
        });
        return nextSelectedPlans;
      });
      setGlobalSelectedPlanIds((prevSelectedPlans) => {
        const nextSelectedPlans = new Set(prevSelectedPlans);
        data.forEach((plan) => {
          nextSelectedPlans.delete(plan.id);
        });
        return nextSelectedPlans;
      });
      return;
    }

    setSelectedPlanMap((prevSelectedPlans) => {
      const nextSelectedPlans = new Map(prevSelectedPlans);
      data.forEach((plan) => {
        nextSelectedPlans.set(plan.id, plan);
      });
      return nextSelectedPlans;
    });
    setGlobalSelectedPlanIds((prevSelectedPlans) => {
      const nextSelectedPlans = new Set(prevSelectedPlans);
      data.forEach((plan) => {
        nextSelectedPlans.add(plan.id);
      });
      return nextSelectedPlans;
    });
  }, [data, isAllSelected, onRemovePlan, setGlobalSelectedPlanIds]);

  const handleApply = React.useCallback(() => {
    onSelect(Array.from(selectedPlanMap.values()));
    onClose();
  }, [onClose, onSelect, selectedPlanMap]);

  const handleSearch = React.useCallback(() => {
    onSearch(searchQuery);
  }, [onSearch, searchQuery]);

  const productNameById = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((product) => {
      map.set(product.id, product.name);
    });
    return map;
  }, [products]);

  const planModalColumns = useMemo<ColumnDef<Plan>[]>(
    () => [
      {
        id: 'select',
        header: () => (
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={handleSelectAllChange}
            className="justify-center"
          />
        ),
        enableSorting: false,
        enableResizing: false,
        size: 56,
        minSize: 56,
        meta: {
          headerCellClassName: 'w-14 whitespace-nowrap text-center',
          cellClassName: 'w-14 text-center align-middle',
          cellContentClassName: 'flex items-center justify-center',
        },
        cell: ({ row }) => {
          const plan = row.original;

          return (
            <Box onClick={(event) => event.stopPropagation()}>
              <Checkbox
                checked={globalSelectedPlanIds.has(plan.id)}
                onCheckedChange={() => handleCheckboxChange(plan)}
                className="justify-center"
              />
            </Box>
          );
        },
      },
      {
        id: 'name',
        accessorFn: (plan) => plan?.name || '-',
        header: 'Name',
        enableSorting: false,
        size: 520,
        minSize: 240,
        meta: {
          cellClassName: 'align-middle',
          cellContentClassName: 'whitespace-normal break-words',
        },
        cell: ({ row }) => {
          const plan = row.original;

          return (
            <Box
              className="min-w-0 cursor-pointer break-words text-sm font-medium leading-5 text-slate-900"
              onClick={() => handleCheckboxChange(plan)}
            >
              {plan?.name || '-'}
            </Box>
          );
        },
      },
      {
        id: 'product',
        accessorFn: (plan) => plan?.products?.name || productNameById.get(plan.product) || '-',
        header: 'Product',
        enableSorting: false,
        size: 360,
        minSize: 220,
        meta: {
          cellClassName: 'align-middle',
          cellContentClassName: 'whitespace-normal break-words',
        },
        cell: ({ row }) => {
          const plan = row.original;
          const productName = plan?.products?.name || productNameById.get(plan.product) || '-';

          return (
            <Box
              className="min-w-0 cursor-pointer break-words text-sm leading-5 text-slate-600"
              onClick={() => handleCheckboxChange(plan)}
            >
              {productName}
            </Box>
          );
        },
      },
    ],
    [
      globalSelectedPlanIds,
      handleCheckboxChange,
      handleSelectAllChange,
      isAllSelected,
      productNameById,
    ],
  );

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent className="flex max-h-[calc(100vh-48px)] w-[1000px] max-w-full flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 bg-[#F8F8F8] py-3 px-4 sm:px-6">
          <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
            Select Plans
            <DialogClose className="ml-auto">
              <Button
                type="button"
                variant="ghost"
                className="bg-transparent hover:bg-transparent text-black p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        <Box className="min-h-0 flex-1 overflow-y-auto p-4">
          <Box className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <Input
              aria-label="Search by Plan Name"
              size="lg"
              type="text"
              placeholder="Search by Plan Name"
              value={searchQuery}
              onValueChange={setSearchQuery}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleSearch();
                }
              }}
              rightIcon={<Search className="w-5 h-5 text-gray-500" />}
              clearable
              className="bg-white pr-3"
            />
            <Button
              type="button"
              className="h-12 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
              onClick={handleSearch}
              leftIcon={<Search className="w-4 h-4" />}
            >
              Search
            </Button>
          </Box>

          <DataTable
            className="!gap-3 [&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-2.5"
            data={data}
            columns={planModalColumns}
            pagination={{
              pageIndex: pagePlan - 1,
              pageSize: showPlansPerPage,
              pageCount: totalPages,
              rowCount: totalItems,
              onPageChange: (pageIndex) => {
                onPageChangePlan(pageIndex + 1);
              },
              onPageSizeChange: (pageSize) => {
                onPlansPerPageChange(pageSize);
              },
            }}
            pageSizeOptions={pageSizeOptions}
            getRowClassName={({ row }) =>
              globalSelectedPlanIds.has(row.original.id)
                ? 'bg-slate-50 hover:!bg-slate-50'
                : undefined
            }
            emptyState={
              <Box className="sticky left-0 flex min-h-[14rem] w-[100cqw] items-center justify-center py-6">
                <Box className="flex flex-col items-center justify-center gap-3">
                  <Image alt="no data" src={noData.src} width={180} fit="contain" />
                  <Box as="span">No plans available</Box>
                </Box>
              </Box>
            }
            renderPagination={(table) => (
              <Box className="-mt-1">
                <CompactTablePagination table={table} pageSizeOptions={pageSizeOptions} />
              </Box>
            )}
            tableOptions={{
              manualPagination: true,
              enableColumnResizing: false,
              defaultColumn: {
                minSize: 56,
                size: 160,
              },
              getRowId: (plan, index) => plan?.id || `plan-row-${index}`,
            }}
          />
        </Box>

        <DialogFooter className="shrink-0 sm:justify-center justify-center pb-4 sm:pb-6">
          <Button
            type="button"
            className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
            onClick={handleApply}
            disabled={globalSelectedPlanIds.size === 0}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlanSelectionModal;
