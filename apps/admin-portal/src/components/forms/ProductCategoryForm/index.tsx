import React from "react";
import Link from "next/link";
import { FaSave, FaCheck } from "react-icons/fa";
import { ChevronLeft } from "react-feather";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@repo/ui";
import { Input } from "@repo/ui";
import { Controller } from "react-hook-form";
import { ContentLoadingWrapper } from "@/components/ui/Loading/index";
import AppURL from "@/constants/app-url.const";

interface ProductCategoryFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  watch: any;

  showAlert: boolean;
  errorMessage: string;
  isEdit: boolean;

  isLoadingDetail: boolean;
  isSaving: boolean;

  onSave: (formData: any) => void;
  onBack: () => void;
  onCloseAlert: () => void;
}

const ErrorModal = ({
  isOpen,
  message,
  onClose,
}: {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-1/3">
        <h2 className="text-lg font-semibold mb-4">Alert</h2>
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

export function ProductCategoryForm({
  handleSubmit,
  control,
  errors,
  watch,
  showAlert,
  errorMessage,
  isEdit,
  isLoadingDetail,
  isSaving,
  onSave,
  onBack,
  onCloseAlert,
}: ProductCategoryFormProps) {
  return (
    <ContentLoadingWrapper isLoading={isSaving || isLoadingDetail}>
      <div className="flex flex-col w-full">
        <form onSubmit={handleSubmit(onSave)}>
          <div className="bg-white md:px-6 p-4 flex items-center">
            <div>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={AppURL.masterdataProductCategory}>Product Category</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {isEdit
                        ? "Update Product Category"
                        : "Create Product Category"}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
                {isEdit ? "Update Product Category" : "Create Product Category"}
              </h2>
            </div>
            <div className="flex space-x-4 ml-auto">
              <div
                onClick={onBack}
                className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-6 py-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    {isEdit ? (
                      <FaCheck className="mr-2" />
                    ) : (
                      <FaSave className="mr-2" />
                    )}
                    Save
                  </>
                )}
              </button>
            </div>
          </div>

          {showAlert && (
            <ErrorModal
              isOpen={showAlert}
              message={errorMessage}
              onClose={onCloseAlert}
            />
          )}

          <div className="flex flex-col w-full p-4 md:p-6 gap-4">
            <div className="p-4 sm:p-6 bg-white rounded-lg flex-col gap-4 grid sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Category Name is required" }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter category name"
                      className="w-full h-12 border-gray-300 bg-transparent"
                      {...field}
                    />
                  )}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message?.toString()}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="icon"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category Icon URL <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="icon"
                  control={control}
                  rules={{ required: "Category Icon is required" }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter icon URL"
                      className="w-full h-12 border-gray-300 bg-transparent"
                      {...field}
                    />
                  )}
                />
                {errors.icon && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.icon.message?.toString()}
                  </p>
                )}
              </div>

              {/* Icon Preview */}
              {watch("icon") && (
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon Preview
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 inline-block">
                    <img
                      src={watch("icon")}
                      alt="Icon preview"
                      className="w-24 h-24 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/no-data.webp";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </ContentLoadingWrapper>
  );
}
