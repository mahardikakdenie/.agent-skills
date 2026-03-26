"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import AppURL from "@/constants/app-url.const";
import { Button } from "@/components/ui/button";
import { Input } from "@repo/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/DataTable";
import ExtendedSidemenu from "@/components/extended-sidemenu";
import {
  createProductCatalogTableColumns,
  ProductCatalogTableData,
} from "@/components/tableConfig/productCatalogTableConfig";
import { useCategories } from "@/services/product/hooks/queries";
import { useProducts } from "./hooks";

export default function ProductCategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const { data: categoriesResponse } = useCategories(
    { limit: 1000 },
    {
      enabled: !category,
      staleTime: 10 * 60 * 1000,
    }
  );

  const categoriesData = useMemo(() => {
    const responseData = categoriesResponse as any;
    const rawCategories =
      responseData?.data?.data ?? responseData?.data ?? responseData ?? [];
    return Array.isArray(rawCategories) ? rawCategories : [];
  }, [categoriesResponse]);

  useEffect(() => {
    if (!category && categoriesData && categoriesData.length > 0) {
      const firstCategory = categoriesData[0];
      router.push(`${AppURL.productCategory}?category=${firstCategory.name}`);
    }
  }, [category, categoriesData, router]);

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return <ProductCatalogContent category={category} />;
}

interface ProductCatalogContentProps {
  category: string;
}

function ProductCatalogContent({ category }: ProductCatalogContentProps) {
  const router = useRouter();

  const {
    catalogPlans,
    totalPages,
    totalItems,
    subMenuItems,
    insurances,
    isLoadingCatalogPlans,
    page,
    rowsPerPage,
    setPage,
    searchPlanName,
    setSearchPlanName,
    searchInsurer,
    canCreate,
    canDelete,
    handleDeletePlan,
    handleViewDetail,
    handleSearchInsurerOnChange,
    handleRowsPerPageChange,
  } = useProducts({ category });

  const productCatalogTableColumns = useMemo(
    () =>
      createProductCatalogTableColumns({
        page,
        rowsPerPage,
        onViewDetail: handleViewDetail,
        onDelete: handleDeletePlan,
        canDelete,
      }),
    [page, rowsPerPage, handleViewDetail, handleDeletePlan, canDelete]
  );

  return (
    <div className="flex w-full flex-col md:flex-row md:items-start">
      <div className="flex flex-col w-full p-4 md:p-6">
        <div className="flex gap-2 sm:flex-row flex-col sm:pb-0 pb-4">
          <h1 className="text-black font-bold sm:text-2xl text-xl mt-2 mb-4">
            Product Catalog -{" "}
            {category
              .split("-")
              .map(
                (item) => item.charAt(0).toUpperCase() + item.slice(1) + " "
              )}
          </h1>
          <Button
            onClick={() => router.push(AppURL.productCatalogAdd(category))}
            disabled={!canCreate}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
          >
            <Plus className="w-5 h-5 mr-1 " /> Add Plan
          </Button>
        </div>

        <div className="flex gap-4">
          <ExtendedSidemenu
            title="Product Categories"
            items={subMenuItems}
            activeUrl={`${AppURL.productCategory}?category=${category}`}
          />
          <div className="flex-1 min-w-0">
            <div className="w-full px-4 px-md-6 py-3 bg-white rounded-lg mb-4">
              <div className="flex gap-4 items-center sm:flex-row flex-col">
                <Select
                  value={searchInsurer}
                  onValueChange={handleSearchInsurerOnChange}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select Insurer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Insurer</SelectLabel>
                      {insurances.map((insurance: any) => (
                        <SelectItem key={insurance.id} value={insurance.id}>
                          {insurance.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  placeholder="Search by Plan Name"
                  className="p-2 border rounded h-12"
                  value={searchPlanName}
                  onChange={(e) => setSearchPlanName(e.target.value)}
                />
              </div>
            </div>

            <DataTable
              loading={isLoadingCatalogPlans}
              data={catalogPlans as ProductCatalogTableData[]}
              columns={productCatalogTableColumns}
              pagination={{
                page,
                totalPages,
                totalItems,
                rowsPerPage,
                onPageChange: setPage,
                onRowsPerPageChange: handleRowsPerPageChange,
                rowsPerPageOptions: [10, 20, 30, 50],
              }}
              noDataText="No product catalog data available"
              className="table-product-catalog"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
