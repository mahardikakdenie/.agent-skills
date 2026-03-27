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
} from "@repo/ui";
import { Controller } from "react-hook-form";
import { ContentLoadingWrapper } from "../../ui/Loading/index";

interface Insurance {
  id: string;
  name: string;
}

interface SourceFormProps {
  handleSubmit: any;
  control: any;
  errors: any;

  insurances: Insurance[];

  showAlert: boolean;
  errorMessage: string;
  isEdit: boolean;
  sourceType?: string;

  isLoadingInsurances: boolean;
  isLoadingDetail: boolean;
  isSaving: boolean;

  onSave: (formData: any) => void;
  onBack: () => void;
  onCloseAlert: () => void;
  onSourceTypeChange?: (value: string) => void;
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

export function SourceForm({
  handleSubmit,
  control,
  errors,
  insurances,
  showAlert,
  errorMessage,
  isEdit,
  sourceType,
  isLoadingInsurances,
  isLoadingDetail,
  isSaving,
  onSave,
  onBack,
  onCloseAlert,
  onSourceTypeChange,
}: SourceFormProps) {
  return (
    <ContentLoadingWrapper
      isLoading={isSaving || isLoadingDetail}
      loadingText={
        isEdit && isLoadingDetail
          ? "Loading source details..."
          : "Saving source..."
      }
    >
      <div className="flex flex-col w-full gap-4">
        <form onSubmit={handleSubmit(onSave)}>
          <div className="bg-white md:px-6 p-4 flex items-center">
            <div>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/source/list">Source List</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {isEdit ? "Edit Source" : "Add New"}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
                {isEdit ? "Edit Source" : "Add New Source"}
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
                    {isEdit ? "Save" : "Submit"}
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

          <div className="w-full flex flex-col p-4 sm:p-6">
            <div className="bg-white md:px-6 p-4">
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-[#016DA1]">
                  Source Details
                </h3>

                <div className="flex space-x-4 mb-4">
                  <div className="flex flex-col w-1/2">
                    <label htmlFor="source_name" className="font-normal">
                      Source Name *
                    </label>
                    <Controller
                      name="source_name"
                      control={control}
                      rules={{ required: "Source name is required" }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          id="source_name"
                          placeholder="Insert Source Name"
                          {...field}
                          className={`mt-1 block w-full h-16 ${
                            errors.source_name
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm`}
                        />
                      )}
                    />
                    {errors.source_name && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.source_name.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label htmlFor="source_url" className="font-normal">
                      URL
                    </label>
                    <Controller
                      name="source_url"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="text"
                          id="source_url"
                          placeholder="Insert Source URL"
                          {...field}
                          className={`mt-1 block w-full h-16 ${
                            errors.source_url
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm`}
                        />
                      )}
                    />
                    {errors.source_url && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.source_url.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4 mb-4">
                  <div className="flex flex-col w-1/2">
                    <label htmlFor="source_type" className="font-normal">
                      Type *
                    </label>
                    <Controller
                      name="source_type"
                      control={control}
                      rules={{ required: "Source type is required" }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            onSourceTypeChange?.(value);
                          }}
                          disabled={false}
                        >
                          <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                            <SelectValue placeholder="Select Source Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="government">
                                Government
                              </SelectItem>
                              <SelectItem value="insurance">
                                Insurance
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.source_type && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.source_type.message}
                      </span>
                    )}
                  </div>
                </div>

                {sourceType === "insurance" && (
                  <div className="flex space-x-4 mb-4">
                    <div className="flex flex-col w-full mb-4">
                      <label htmlFor="insurance_id" className="font-normal">
                        Insurance *
                      </label>
                      <Controller
                        name="insurance_id"
                        control={control}
                        rules={
                          sourceType === "insurance"
                            ? { required: "Insurance is required" }
                            : {}
                        }
                        render={({ field }) => (
                          <Select
                            value={field.value || ""}
                            onValueChange={field.onChange}
                            disabled={isLoadingInsurances}
                          >
                            <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                              <SelectValue
                                placeholder={
                                  isLoadingInsurances
                                    ? "Loading..."
                                    : "Select Insurance"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {insurances.map((insuranceItem) => (
                                  <SelectItem
                                    key={insuranceItem.id}
                                    value={insuranceItem.id}
                                  >
                                    {insuranceItem.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.insurance_id && (
                        <span className="text-red-500 text-sm mt-1">
                          {errors.insurance_id.message}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </ContentLoadingWrapper>
  );
}

