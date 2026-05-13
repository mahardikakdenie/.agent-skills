import noData from '@public/images/no-data.webp';
import NextImage from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import { Check, X } from 'react-feather';

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
  type ColumnDef,
} from '@repo/ui';

import { CompactTablePagination } from '@/components/ui/compact-table-pagination';

export interface InsuranceResponseDTO {
  data: Insurance[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface Insurance {
  id: string;
  name: string;
  brand: string;
  logo_url: string | null;
}

interface InsuranceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (insurances: Insurance[]) => void;
  insurances?: InsuranceResponseDTO;
  initialSelectedInsurances: Insurance[];
  onPageChangeIns: (page: number) => void;
  showInsPerPage: number;
  onInsurancePerPageChange: (insPerPage: number) => void;
  globalSelectedInsuranceIds: Set<string>;
  setGlobalSelectedInsuranceIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  currentPageIns: number;
  onRemoveInsurance: (insuranceId: string) => void;
}

const pageSizeOptions = [10, 20, 30, 50];

const InsuranceSelectionModal: React.FC<InsuranceSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  insurances,
  initialSelectedInsurances,
  onPageChangeIns,
  showInsPerPage,
  onInsurancePerPageChange,
  globalSelectedInsuranceIds,
  setGlobalSelectedInsuranceIds,
  currentPageIns,
  onRemoveInsurance,
}) => {
  const [selectedInsuranceMap, setSelectedInsuranceMap] = useState<Map<string, Insurance>>(
    new Map(),
  );

  const data = useMemo(() => insurances?.data || [], [insurances?.data]);
  const totalItems = insurances?.meta?.total || 0;
  const totalPages = Math.max(Math.ceil(totalItems / showInsPerPage), 1);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    onPageChangeIns(currentPageIns);
  }, [currentPageIns, isOpen, onPageChangeIns]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSelectedInsuranceMap((prevSelectedInsurances) => {
      const nextSelectedInsurances = new Map(
        Array.from(prevSelectedInsurances).filter(([insuranceId]) =>
          globalSelectedInsuranceIds.has(insuranceId),
        ),
      );

      initialSelectedInsurances.forEach((insurance) => {
        if (globalSelectedInsuranceIds.has(insurance.id)) {
          nextSelectedInsurances.set(insurance.id, insurance);
        }
      });

      data.forEach((insurance) => {
        if (globalSelectedInsuranceIds.has(insurance.id)) {
          nextSelectedInsurances.set(insurance.id, insurance);
        }
      });

      return nextSelectedInsurances;
    });
  }, [data, globalSelectedInsuranceIds, initialSelectedInsurances, isOpen]);

  const isAllSelected =
    data.length > 0 && data.every((insurance) => globalSelectedInsuranceIds.has(insurance.id));

  const handleCheckboxChange = React.useCallback(
    (insurance: Insurance) => {
      if (globalSelectedInsuranceIds.has(insurance.id)) {
        setSelectedInsuranceMap((prevSelectedInsurances) => {
          const nextSelectedInsurances = new Map(prevSelectedInsurances);
          nextSelectedInsurances.delete(insurance.id);
          return nextSelectedInsurances;
        });
        onRemoveInsurance(insurance.id);
        return;
      }

      setSelectedInsuranceMap((prevSelectedInsurances) => {
        const nextSelectedInsurances = new Map(prevSelectedInsurances);
        nextSelectedInsurances.set(insurance.id, insurance);
        return nextSelectedInsurances;
      });
      setGlobalSelectedInsuranceIds((prevSelectedInsurances) => {
        const nextSelectedInsurances = new Set(prevSelectedInsurances);
        nextSelectedInsurances.add(insurance.id);
        return nextSelectedInsurances;
      });
    },
    [globalSelectedInsuranceIds, onRemoveInsurance, setGlobalSelectedInsuranceIds],
  );

  const handleSelectAllChange = React.useCallback(() => {
    if (isAllSelected) {
      data.forEach((insurance) => {
        onRemoveInsurance(insurance.id);
      });

      setSelectedInsuranceMap((prevSelectedInsurances) => {
        const nextSelectedInsurances = new Map(prevSelectedInsurances);
        data.forEach((insurance) => {
          nextSelectedInsurances.delete(insurance.id);
        });
        return nextSelectedInsurances;
      });
      return;
    }

    setSelectedInsuranceMap((prevSelectedInsurances) => {
      const nextSelectedInsurances = new Map(prevSelectedInsurances);
      data.forEach((insurance) => {
        nextSelectedInsurances.set(insurance.id, insurance);
      });
      return nextSelectedInsurances;
    });
    setGlobalSelectedInsuranceIds((prevSelectedInsurances) => {
      const nextSelectedInsurances = new Set(prevSelectedInsurances);
      data.forEach((insurance) => {
        nextSelectedInsurances.add(insurance.id);
      });
      return nextSelectedInsurances;
    });
  }, [data, isAllSelected, onRemoveInsurance, setGlobalSelectedInsuranceIds]);

  const handleApply = React.useCallback(() => {
    onSelect(Array.from(selectedInsuranceMap.values()));
    onClose();
  }, [onClose, onSelect, selectedInsuranceMap]);

  const insuranceModalColumns = useMemo<ColumnDef<Insurance>[]>(
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
          const insurance = row.original;

          return (
            <Box onClick={(event) => event.stopPropagation()}>
              <Checkbox
                checked={globalSelectedInsuranceIds.has(insurance.id)}
                onCheckedChange={() => handleCheckboxChange(insurance)}
                className="justify-center"
              />
            </Box>
          );
        },
      },
      {
        id: 'name',
        accessorFn: (insurance) => insurance?.name || '-',
        header: 'Name',
        enableSorting: false,
        size: 360,
        minSize: 220,
        meta: {
          cellClassName: 'align-middle',
          cellContentClassName: 'whitespace-normal break-words',
        },
        cell: ({ row }) => {
          const insurance = row.original;

          return (
            <Box
              className="min-w-0 cursor-pointer break-words text-sm font-medium leading-5 text-slate-900"
              onClick={() => handleCheckboxChange(insurance)}
            >
              {insurance?.name || '-'}
            </Box>
          );
        },
      },
      {
        id: 'brand',
        accessorFn: (insurance) => insurance?.brand || '-',
        header: 'Brand',
        enableSorting: false,
        size: 240,
        minSize: 160,
        meta: {
          cellClassName: 'align-middle',
          cellContentClassName: 'whitespace-normal break-words',
        },
        cell: ({ row }) => {
          const insurance = row.original;

          return (
            <Box
              className="min-w-0 cursor-pointer break-words text-sm leading-5 text-slate-600"
              onClick={() => handleCheckboxChange(insurance)}
            >
              {insurance?.brand || '-'}
            </Box>
          );
        },
      },
      {
        id: 'logo',
        accessorFn: (insurance) => insurance?.logo_url || '',
        header: 'Logo',
        enableSorting: false,
        size: 160,
        minSize: 120,
        meta: {
          cellClassName: 'align-middle',
          cellContentClassName: 'whitespace-normal break-words',
        },
        cell: ({ row }) => {
          const insurance = row.original;

          return insurance.logo_url ? (
            <NextImage
              src={insurance.logo_url}
              alt={insurance.name || 'Insurance logo'}
              className="h-12 w-12 rounded-md object-contain"
              width={48}
              height={48}
            />
          ) : (
            <Box as="span" className="text-sm text-slate-500">
              No Logo
            </Box>
          );
        },
      },
    ],
    [globalSelectedInsuranceIds, handleCheckboxChange, handleSelectAllChange, isAllSelected],
  );

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent className="flex max-h-[calc(100vh-48px)] w-[1000px] max-w-full flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 bg-[#F8F8F8] py-3 px-4 sm:px-6">
          <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
            Select Insurances
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
          <DataTable
            className="!gap-3 [&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-2.5"
            data={data}
            columns={insuranceModalColumns}
            pagination={{
              pageIndex: currentPageIns - 1,
              pageSize: showInsPerPage,
              pageCount: totalPages,
              rowCount: totalItems,
              onPageChange: (pageIndex) => {
                onPageChangeIns(pageIndex + 1);
              },
              onPageSizeChange: (pageSize) => {
                onInsurancePerPageChange(pageSize);
              },
            }}
            pageSizeOptions={pageSizeOptions}
            getRowClassName={({ row }) =>
              globalSelectedInsuranceIds.has(row.original.id)
                ? 'bg-slate-50 hover:!bg-slate-50'
                : undefined
            }
            emptyState={
              <Box className="sticky left-0 flex min-h-[14rem] w-[100cqw] items-center justify-center py-6">
                <Box className="flex flex-col items-center justify-center gap-3">
                  <Image alt="no data" src={noData.src} width={180} fit="contain" />
                  <Box as="span">No insurances available</Box>
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
              getRowId: (insurance, index) => insurance?.id || `insurance-row-${index}`,
            }}
          />
        </Box>

        <DialogFooter className="shrink-0 sm:justify-center justify-center pb-4 sm:pb-6">
          <Button
            type="button"
            className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
            onClick={handleApply}
            disabled={globalSelectedInsuranceIds.size === 0}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InsuranceSelectionModal;
