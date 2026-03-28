"use client";

import { Button } from "@repo/ui";
import { Plus } from "react-feather";
import { DataTable } from "@/components/ui/DataTable";
import { useProduct } from "@/hooks/useProduct.hooks";
import { createProductTableColumns } from "@/components/tableConfig/productTableConfig";

export default function Product() {
  const {
    insurances,
    categories,
    totalPages,
    totalItems,
    page,
    rowsPerPage,
    selectedTab,
    hasAccess,
    canEdit,
    canCreate,
    isLoading,
    isLoadingCategories,
    setPage,
    setRowsPerPage,
    selectTab,
    handleEdit,
    addNewProduct,
  } = useProduct();

  if (hasAccess === false) {
    return null;
  }

  const productTableColumns = createProductTableColumns({
    handleEdit,
    canEdit,
  });

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex gap-2">
        <h1 className="text-black font-bold text-2xl mt-2 mb-4">Product</h1>
        <Button
          onClick={addNewProduct}
          disabled={!canCreate}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
        >
          <Plus className="w-5 h-5 mr-1" /> Add New
        </Button>
      </div>

      <div className="block bg-white rounded-md mb-3">
        <div className="w-full flex items-center overflow-auto">
          {isLoadingCategories ? (
            <div className="p-5 text-center w-full">Loading categories...</div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                onClick={() => selectTab(category.id)}
                className={`cursor-pointer h-full flex items-center justify-center sm:px-7 px-5 ${
                  selectedTab === category.id &&
                  "border-b-[3px] border-primary sm:px-7 px-5"
                }`}
              >
                <button
                  className={`text-sm py-5 ${
                    selectedTab === category.id && "text-primary"
                  }`}
                >
                  {category.name
                    .split("-")
                    .map(
                      (word: string) =>
                        word.charAt(0).toUpperCase() + word.slice(1)
                    )
                    .join(" ")}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <DataTable
        loading={isLoading}
        data={insurances}
        columns={productTableColumns}
        pagination={{
          page,
          totalPages,
          totalItems,
          rowsPerPage,
          onPageChange: setPage,
          onRowsPerPageChange: (e) => setRowsPerPage(+e.target.value || 0),
        }}
        className="product-table"
        noDataText="No product data available"
      />
    </div>
  );
}