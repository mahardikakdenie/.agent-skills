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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { ContentLoadingWrapper } from "@/components/ui/Loading/index";
import AppURL from "@/constants/app-url.const";

interface BrokerFeeFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  watch: any;

  insurances: any[];
  products: any[];
  plans: any[];

  showAlert: boolean;
  errorMessage: string;
  isEdit: boolean;

  isLoadingInsurances: boolean;
  isLoadingProducts: boolean;
  isLoadingPlans: boolean;
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

export function BrokerFeeForm({
  handleSubmit,
  control,
  errors,
  watch,
  insurances,
  products,
  plans,
  showAlert,
  errorMessage,
  isEdit,
  isLoadingInsurances,
  isLoadingProducts,
  isLoadingPlans,
  isLoadingDetail,
  isSaving,
  onSave,
  onBack,
  onCloseAlert,
}: BrokerFeeFormProps) {
  const watchProduct = watch("product");

  return (
    <ContentLoadingWrapper
      isLoading={
        isSaving || isLoadingInsurances || isLoadingProducts || isLoadingDetail
      }
    >
      <div className="flex flex-col w-full">
        <form onSubmit={handleSubmit(onSave)}>
          <div className="bg-white md:px-6 p-4 flex items-center">
            <div>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={AppURL.financeBrokerFee}>Broker Fee</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {isEdit ? "Update Broker Fee" : "Create Broker Fee"}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
                {isEdit ? "Update Broker Fee" : "Create Broker Fee"}
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
                    <Select value={field.value} onValueChange={field.onChange}>
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

              <div>
                <label
                  htmlFor="product"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Product Name
                </label>
                <Controller
                  name="product"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                        <SelectValue placeholder="Select Product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {products.map((product: any) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.product && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.product.message?.toString()}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="plan"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Plan Name
                </label>
                <Controller
                  name="plan"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!watchProduct}
                    >
                      <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                        <SelectValue placeholder="Select Plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {plans?.map((plan: any) => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.name.split("|").splice(0, 2).join(" - ")}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.plan && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.plan.message?.toString()}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="fee"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Fee <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="fee"
                  control={control}
                  rules={{ required: "Fee is required" }}
                  render={({ field }) => (
                    <Input
                      type="number"
                      className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2"
                      {...field}
                    />
                  )}
                />
                {errors.fee && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fee.message?.toString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </ContentLoadingWrapper>
  );
}
