import React from "react";
import { Check, ChevronLeft, Plus, Trash2 } from "react-feather";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@repo/ui";
import { Input } from "@repo/ui";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { Controller } from "react-hook-form";
import { ContentLoadingWrapper } from "@/components/ui/Loading/index";
import AppURL from "@/constants/app-url.const";

interface ProductFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  watch: any;

  categories: any[];
  insurances: any[];
  productFields: any[];

  selectedCategoryId: string;
  selectedInsuranceId: string;

  showAlert: boolean;
  alertMessage: string;
  alertType: "success" | "error";
  isEdit: boolean;

  isLoadingCategories: boolean;
  isLoadingInsurances: boolean;
  isLoadingProducts: boolean;
  isSaving: boolean;

  onSave: (formData: any) => void;
  onAddProduct: () => void;
  onChangeProduct: (index: number, value: string) => void;
  onDeleteProduct: (id: string, index: number) => void;
  onBack: () => void;
  onCloseAlert: () => void;
}

const AlertModal = ({
  isOpen,
  message,
  type,
  onClose,
}: {
  isOpen: boolean;
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-1/3">
        <h2
          className={`text-lg font-semibold mb-4 ${
            type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {type === "success" ? "Success" : "Error"}
        </h2>
        <p>{message}</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export function ProductForm({
  handleSubmit,
  control,
  errors,
  watch,
  categories,
  insurances,
  productFields,
  selectedCategoryId,
  selectedInsuranceId,
  showAlert,
  alertMessage,
  alertType,
  isEdit,
  isLoadingCategories,
  isLoadingInsurances,
  isLoadingProducts,
  isSaving,
  onSave,
  onAddProduct,
  onChangeProduct,
  onDeleteProduct,
  onBack,
  onCloseAlert,
}: ProductFormProps) {
  return (
    <ContentLoadingWrapper
      isLoading={isSaving || isLoadingProducts || isLoadingCategories}
    >
      <div className="flex flex-col w-full">
        <form onSubmit={handleSubmit(onSave)}>
          <div className="bg-white md:px-6 p-4 flex items-center">
            <div>
              <Breadcrumb className="sm:block hidden">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink>Masterdata</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink className="cursor-pointer" onClick={onBack}>
                      Product
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{isEdit ? "Edit" : "Add"}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
                {isEdit ? "Edit Product" : "Add Product"}
              </h2>
            </div>

            <div className="flex ml-auto">
              <div
                onClick={onBack}
                className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </div>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-5 rounded-full px-5"
              >
                {isSaving ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Check className="mr-2 w-4 h-4" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>

          {showAlert && (
            <AlertModal
              isOpen={showAlert}
              message={alertMessage}
              type={alertType}
              onClose={onCloseAlert}
            />
          )}

          <div className="flex flex-col w-full p-4 md:p-6 gap-4">
            <div className="p-4 sm:p-6 bg-white rounded-lg flex-col gap-4 grid sm:grid-cols-2">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Product Category <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Product Category is required" }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isEdit}
                    >
                      <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                        <SelectValue placeholder="Select Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map((category: any) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name
                                .split("-")
                                .map(
                                  (word: string) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.category.message?.toString()}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="insurance"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Insurance Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="insurance"
                  control={control}
                  rules={{ required: "Insurance Name is required" }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={
                        !selectedCategoryId || isEdit || isLoadingInsurances
                      }
                    >
                      <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                        <SelectValue placeholder="Select Insurance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {insurances.map((insurance: any) => (
                            <SelectItem key={insurance.id} value={insurance.id}>
                              {insurance.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.insurance && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.insurance.message?.toString()}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-white rounded-lg gap-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product Name <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-3">
                {productFields.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Insert Product Name"
                      value={item.name}
                      onChange={(e) => onChangeProduct(index, e.target.value)}
                      className="mt-1 block w-full h-12 border-gray-300 rounded-md shadow-sm"
                    />
                    <Button
                      className="text-red-500 hover:bg-transparent"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        onDeleteProduct(item.id, index);
                      }}
                      disabled={productFields.length === 1}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Button
                  className="bg-[#F5BA41] hover:bg-[#e6a92d] text-black rounded-full px-5"
                  onClick={(e) => {
                    e.preventDefault();
                    onAddProduct();
                  }}
                >
                  <Plus className="mr-1" width={18} height={18} />
                  Add Product
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </ContentLoadingWrapper>
  );
}

