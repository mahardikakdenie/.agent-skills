import React from "react";
import { Check, ChevronLeft } from "react-feather";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Input } from "@repo/ui";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { ContentLoadingWrapper } from "@/components/ui/Loading/index";

interface ChannelFormProps {
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

export function ChannelForm({
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
}: ChannelFormProps) {
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
                    <BreadcrumbLink className="cursor-pointer" onClick={onBack}>
                      Channels
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{isEdit ? "Edit" : "Add"}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
                {isEdit ? "Edit Channel" : "Add Channel"}
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
            <div className="p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Channel Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Channel Name is required" }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="name"
                      placeholder="Insert Channel Name"
                      {...field}
                      className={`mt-1 block w-full h-12 ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm`}
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
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Type <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: "Type is required" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Internal">Internal</SelectItem>
                        <SelectItem value="External">External</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.type.message?.toString()}
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
