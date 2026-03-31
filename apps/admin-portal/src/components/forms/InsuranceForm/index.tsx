import React from "react";
import Link from "next/link";
import { Check, ChevronLeft } from "react-feather";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@repo/ui";
import { Input } from "@repo/ui";
import { Button } from "@repo/ui";
import { Controller } from "react-hook-form";
import { ContentLoadingWrapper } from "@/components/ui/loading";
import AppURL from "@/constants/app-url.const";

interface InsuranceFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  watch: any;

  showAlert: boolean;
  alertMessage: string;
  alertType: "success" | "error";
  isEdit: boolean;

  isLoadingDetail: boolean;
  isSaving: boolean;

  onSave: (formData: any) => void;
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

export function InsuranceForm({
  handleSubmit,
  control,
  errors,
  watch,
  showAlert,
  alertMessage,
  alertType,
  isEdit,
  isLoadingDetail,
  isSaving,
  onSave,
  onBack,
  onCloseAlert,
}: InsuranceFormProps) {
  return (
    <ContentLoadingWrapper isLoading={isSaving || isLoadingDetail}>
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
                    <BreadcrumbLink asChild>
                      <Link href={AppURL.masterdataInsurance}>Insurance</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{isEdit ? "Detail" : "Add"}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
                {isEdit ? "Detail Insurance" : "Add Insurance"}
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
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Insurance Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Insurance Name is required" }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="name"
                      placeholder="Insert Insurance Name"
                      className={`mt-1 block w-full h-12 ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm`}
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
                  htmlFor="logo_url"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Logo
                </label>
                <Controller
                  name="logo_url"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="logo_url"
                      placeholder="Insert Logo URL"
                      className={`mt-1 block w-full h-12 ${
                        errors.logo_url ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm`}
                      {...field}
                    />
                  )}
                />
                {errors.logo_url && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.logo_url.message?.toString()}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Brand
                </label>
                <Controller
                  name="brand"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="brand"
                      placeholder="Insert Brand"
                      className={`mt-1 block w-full h-12 ${
                        errors.brand ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm`}
                      {...field}
                    />
                  )}
                />
                {errors.brand && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.brand.message?.toString()}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Country
                </label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="country"
                      placeholder="Insert Country"
                      className={`mt-1 block w-full h-12 ${
                        errors.country ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm`}
                      {...field}
                    />
                  )}
                />
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.country.message?.toString()}
                  </p>
                )}
              </div>

              {watch("logo_url") && (
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Preview
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 inline-block">
                    <img
                      src={watch("logo_url")}
                      alt="Logo preview"
                      className="w-32 h-32 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/no-image.png";
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