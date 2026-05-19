import noData from '@public/images/no-data.webp';
import React, { useEffect, useMemo, useState } from 'react';
import { Check, X } from 'react-feather';

import {
  Box,
  Button,
  Checkbox,
  Combobox,
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

import { CompactTablePagination } from '@/components/core/compact-table-pagination';
import { productService } from '@/services/product/api/product.service';

interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  insurance: string;
  category: string;
  name: string;
  instant_policy: boolean;
}

export interface ProductResponseDTO {
  data: Product[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (products: Product[]) => void;
  products?: ProductResponseDTO;
  initialSelectedProductIds: Set<string>;
  selectedProductIds: Set<string>;
  showProdPerPage: number;
  onProdPerPageChange: (page: number) => void;
  globalSelectedProdIds: Set<string>;
  setGlobalSelectedProdIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  onPageChangeProd: (page: number) => void;
  currentPageProd: number;
  onRemoveProd: (prodId: string) => void;
}

interface Category {
  id: string;
  name: string;
}

const ALL_PRODUCTS_CATEGORY = '__all_products__';
const pageSizeOptions = [10, 20, 30, 50];

const formatCategoryName = (name: string): string =>
  name
    .replace(/[-_]/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  products,
  initialSelectedProductIds,
  selectedProductIds,
  showProdPerPage,
  onProdPerPageChange,
  globalSelectedProdIds,
  setGlobalSelectedProdIds,
  onPageChangeProd,
  currentPageProd,
  onRemoveProd,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(ALL_PRODUCTS_CATEGORY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [selectedProductMap, setSelectedProductMap] = useState<Map<string, Product>>(new Map());

  const data = useMemo(() => products?.data || [], [products?.data]);
  const totalItems = products?.meta?.total || 0;
  const totalPages = Math.max(Math.ceil(totalItems / showProdPerPage), 1);
  const selectedIds =
    globalSelectedProdIds.size > 0
      ? globalSelectedProdIds
      : selectedProductIds.size > 0
        ? selectedProductIds
        : initialSelectedProductIds;

  const filteredProducts = useMemo(
    () =>
      data.filter(
        (product) =>
          selectedCategoryId === ALL_PRODUCTS_CATEGORY || product.category === selectedCategoryId,
      ),
    [data, selectedCategoryId],
  );

  const categoryOptions = useMemo(
    () => [
      { label: 'All Products', value: ALL_PRODUCTS_CATEGORY },
      ...categories.map((category) => ({
        label: category.name,
        value: category.id,
        keywords: [category.name],
      })),
    ],
    [categories],
  );

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      setCategoryError(null);

      try {
        const response: any = await productService.getCategories();

        if (response?.data && Array.isArray(response.data)) {
          setCategories(
            response.data.map((category: { id: string; name: string }) => ({
              id: category.id,
              name: formatCategoryName(category.name),
            })),
          );
          return;
        }

        throw new Error('Unexpected response structure');
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoryError('Failed to fetch categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    onPageChangeProd(currentPageProd);
  }, [currentPageProd, isOpen, onPageChangeProd]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSelectedProductMap((prevSelectedProducts) => {
      const nextSelectedProducts = new Map(
        Array.from(prevSelectedProducts).filter(([productId]) => selectedIds.has(productId)),
      );

      data.forEach((product) => {
        if (selectedIds.has(product.id)) {
          nextSelectedProducts.set(product.id, product);
        }
      });

      return nextSelectedProducts;
    });
  }, [data, isOpen, selectedIds]);

  const isAllSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((product) => globalSelectedProdIds.has(product.id));

  const handleCheckboxChange = React.useCallback(
    (product: Product) => {
      if (globalSelectedProdIds.has(product.id)) {
        setSelectedProductMap((prevSelectedProducts) => {
          const nextSelectedProducts = new Map(prevSelectedProducts);
          nextSelectedProducts.delete(product.id);
          return nextSelectedProducts;
        });
        setGlobalSelectedProdIds((prevSelectedProducts) => {
          const nextSelectedProducts = new Set(prevSelectedProducts);
          nextSelectedProducts.delete(product.id);
          return nextSelectedProducts;
        });
        onRemoveProd(product.id);
        return;
      }

      setSelectedProductMap((prevSelectedProducts) => {
        const nextSelectedProducts = new Map(prevSelectedProducts);
        nextSelectedProducts.set(product.id, product);
        return nextSelectedProducts;
      });
      setGlobalSelectedProdIds((prevSelectedProducts) => {
        const nextSelectedProducts = new Set(prevSelectedProducts);
        nextSelectedProducts.add(product.id);
        return nextSelectedProducts;
      });
    },
    [globalSelectedProdIds, onRemoveProd, setGlobalSelectedProdIds],
  );

  const handleSelectAllChange = React.useCallback(() => {
    if (isAllSelected) {
      filteredProducts.forEach((product) => {
        onRemoveProd(product.id);
      });

      setSelectedProductMap((prevSelectedProducts) => {
        const nextSelectedProducts = new Map(prevSelectedProducts);
        filteredProducts.forEach((product) => {
          nextSelectedProducts.delete(product.id);
        });
        return nextSelectedProducts;
      });
      setGlobalSelectedProdIds((prevSelectedProducts) => {
        const nextSelectedProducts = new Set(prevSelectedProducts);
        filteredProducts.forEach((product) => {
          nextSelectedProducts.delete(product.id);
        });
        return nextSelectedProducts;
      });
      return;
    }

    setSelectedProductMap((prevSelectedProducts) => {
      const nextSelectedProducts = new Map(prevSelectedProducts);
      filteredProducts.forEach((product) => {
        nextSelectedProducts.set(product.id, product);
      });
      return nextSelectedProducts;
    });
    setGlobalSelectedProdIds((prevSelectedProducts) => {
      const nextSelectedProducts = new Set(prevSelectedProducts);
      filteredProducts.forEach((product) => {
        nextSelectedProducts.add(product.id);
      });
      return nextSelectedProducts;
    });
  }, [filteredProducts, isAllSelected, onRemoveProd, setGlobalSelectedProdIds]);

  const handleApply = React.useCallback(() => {
    onSelect(Array.from(selectedProductMap.values()));
    onClose();
  }, [onClose, onSelect, selectedProductMap]);

  const productModalColumns = useMemo<ColumnDef<Product>[]>(
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
          const product = row.original;

          return (
            <Box onClick={(event) => event.stopPropagation()}>
              <Checkbox
                checked={globalSelectedProdIds.has(product.id)}
                onCheckedChange={() => handleCheckboxChange(product)}
                className="justify-center"
              />
            </Box>
          );
        },
      },
      {
        id: 'id',
        accessorFn: (product) => product?.id || '-',
        header: 'Product ID',
        enableSorting: false,
        size: 320,
        minSize: 220,
        meta: {
          cellClassName: 'align-middle',
          cellContentClassName: 'whitespace-normal break-words',
        },
        cell: ({ row }) => {
          const product = row.original;

          return (
            <Box
              className="min-w-0 cursor-pointer break-words text-sm font-medium leading-5 text-slate-900"
              onClick={() => handleCheckboxChange(product)}
            >
              {product?.id || '-'}
            </Box>
          );
        },
      },
      {
        id: 'name',
        accessorFn: (product) => product?.name || '-',
        header: 'Product Name',
        enableSorting: false,
        size: 520,
        minSize: 240,
        meta: {
          cellClassName: 'align-middle',
          cellContentClassName: 'whitespace-normal break-words',
        },
        cell: ({ row }) => {
          const product = row.original;

          return (
            <Box
              className="min-w-0 cursor-pointer break-words text-sm leading-5 text-slate-600"
              onClick={() => handleCheckboxChange(product)}
            >
              {product?.name || '-'}
            </Box>
          );
        },
      },
    ],
    [globalSelectedProdIds, handleCheckboxChange, handleSelectAllChange, isAllSelected],
  );

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent className="flex max-h-[calc(100vh-48px)] w-[1000px] max-w-full flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 bg-[#F8F8F8] py-3 px-4 sm:px-6">
          <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
            Select Products
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
          <Box className="mb-4">
            <Combobox
              aria-label="Filter by Category"
              size="lg"
              value={selectedCategoryId}
              options={categoryOptions}
              placeholder="Filter by Category"
              searchPlaceholder="Search Category"
              onValueChange={(value) => {
                setSelectedCategoryId(value || ALL_PRODUCTS_CATEGORY);
              }}
              disabled={loadingCategories || !!categoryError}
              loading={loadingCategories}
              triggerClassName="bg-white"
            />
            {categoryError ? (
              <Box as="p" className="mt-1 text-xs text-red-500">
                {categoryError}
              </Box>
            ) : null}
          </Box>

          <DataTable
            className="!gap-3 [&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-2.5"
            data={filteredProducts}
            columns={productModalColumns}
            pagination={{
              pageIndex: currentPageProd - 1,
              pageSize: showProdPerPage,
              pageCount: totalPages,
              rowCount: totalItems,
              onPageChange: (pageIndex) => {
                onPageChangeProd(pageIndex + 1);
              },
              onPageSizeChange: (pageSize) => {
                onProdPerPageChange(pageSize);
              },
            }}
            pageSizeOptions={pageSizeOptions}
            getRowClassName={({ row }) =>
              globalSelectedProdIds.has(row.original.id)
                ? 'bg-slate-50 hover:!bg-slate-50'
                : undefined
            }
            emptyState={
              <Box className="sticky left-0 flex min-h-[14rem] w-[100cqw] items-center justify-center py-6">
                <Box className="flex flex-col items-center justify-center gap-3">
                  <Image alt="no data" src={noData.src} width={180} fit="contain" />
                  <Box as="span">No products available</Box>
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
              getRowId: (product, index) => product?.id || `product-row-${index}`,
            }}
          />
        </Box>

        <DialogFooter className="shrink-0 sm:justify-center justify-center pb-4 sm:pb-6">
          <Button
            type="button"
            className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
            onClick={handleApply}
            disabled={globalSelectedProdIds.size === 0}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductSelectionModal;
