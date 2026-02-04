"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { useProductCategory } from "@/hooks/useProductCategory.hooks";
import { createProductCategoryTableColumns } from "@/components/tableConfig/productCategoryTableConfig";

export default function ProductCategoryPage() {
  const {
    categories,
    hasAccess,
    canEdit,
    canCreate,
    canDelete,
    isLoading,
    handleEdit,
    handleDelete,
    addNewCategory,
  } = useProductCategory();

  if (hasAccess === false) {
    return null;
  }

  const productCategoryTableColumns = createProductCategoryTableColumns({
    handleEdit,
    handleDelete,
    canEdit,
    canDelete,
  });

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex gap-2 sm:flex-row flex-col pb-4">
        <h1 className="text-black font-bold sm:text-2xl text-xl sm:mt-2">
          Product Category
        </h1>
        <Button
          onClick={addNewCategory}
          disabled={!canCreate}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
        >
          <PlusIcon className="w-5 h-5 mr-1" /> Add New
        </Button>
      </div>

      <DataTable
        loading={isLoading}
        data={categories}
        columns={productCategoryTableColumns}
        className="product-category-table"
        noDataText="No product category data available"
      />
    </div>
  );
}
