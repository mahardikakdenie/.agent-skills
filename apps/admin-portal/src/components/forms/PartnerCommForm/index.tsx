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

interface PartnerCommFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  watch: any;
  setValue: any;

  channels: any[];
  insurances: any[];

  showAlert: boolean;
  errorMessage: string;
  isEdit: boolean;

  isLoadingChannels: boolean;
  isLoadingInsurances: boolean;
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

export function PartnerCommForm({
  handleSubmit,
  control,
  errors,
  watch,
  setValue,
  channels,
  insurances,
  showAlert,
  errorMessage,
  isEdit,
  isLoadingChannels,
  isLoadingInsurances,
  isLoadingDetail,
  isSaving,
  onSave,
  onBack,
  onCloseAlert,
}: PartnerCommFormProps) {
  const watchChannel = watch("channel");

  return (
    <ContentLoadingWrapper
      isLoading={
        isSaving || isLoadingChannels || isLoadingInsurances || isLoadingDetail
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
                      <Link href={AppURL.financePartnerComm}>Partner Comm</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {isEdit ? "Update Partner Comm" : "Create Partner Comm"}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
                {isEdit ? "Update Partner Comm" : "Create Partner Comm"}
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
                  htmlFor="channel"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Channel Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="channel"
                  control={control}
                  rules={{ required: "Channel Name is required" }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        setValue("insurance", "All");
                        field.onChange(val);
                      }}
                    >
                      <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                        <SelectValue placeholder="Select Channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {channels.map((channel: any) => (
                            <SelectItem key={channel.id} value={channel.id}>
                              {channel.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.channel && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.channel.message?.toString()}
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
                      disabled={!watchChannel}
                    >
                      <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                        <SelectValue placeholder="Select Insurance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem key={-1} value="All">
                            All
                          </SelectItem>
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
