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
import { ContentLoadingWrapper } from "../../ui/loading";

interface Source {
  id: string;
  source_name: string;
  source_type: string;
  source_url: string;
  insurance_id: string;
}

interface CountryAPI {
  id: string;
  name: string;
}

interface SanctionFormProps {
  handleSubmit: any;
  control: any;
  errors: any;

  sources: Source[];
  countries: CountryAPI[];

  showAlert: boolean;
  errorMessage: string;
  isEdit: boolean;

  isLoadingSources: boolean;
  isLoadingCountries: boolean;
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

export function SanctionForm({
  handleSubmit,
  control,
  errors,
  sources,
  countries,
  showAlert,
  errorMessage,
  isEdit,
  isLoadingSources,
  isLoadingCountries,
  isLoadingDetail,
  isSaving,
  onSave,
  onBack,
  onCloseAlert,
}: SanctionFormProps) {
  return (
    <ContentLoadingWrapper
      isLoading={
        isSaving || isLoadingSources || isLoadingCountries || isLoadingDetail
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
                      <Link href="/sanction/list">Sanction List</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {isEdit ? "Edit Sanction" : "Add New"}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
                {isEdit ? "Edit Sanction" : "Add New Sanction"}
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
                  Identity Details
                </h3>
                <div className="flex space-x-4 mb-4">
                  <div className="flex flex-col w-1/2">
                    <label htmlFor="first_name" className="font-normal">
                      First Name
                    </label>
                    <Controller
                      name="first_name"
                      control={control}
                      rules={{ required: "First name is required" }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          id="first_name"
                          placeholder="Insert First Name"
                          {...field}
                          className={`mt-1 block w-full h-16 ${
                            errors.first_name
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm`}
                        />
                      )}
                    />
                    {errors.first_name && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.first_name.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label htmlFor="middle_name" className="font-normal">
                      Middle Name
                    </label>
                    <Controller
                      name="middle_name"
                      control={control}
                      rules={
                        isEdit ? { required: "Middle name is required" } : {}
                      }
                      render={({ field }) => (
                        <Input
                          type="text"
                          id="middle_name"
                          placeholder="Insert Middle Name"
                          {...field}
                          className={`mt-1 block w-full h-16 ${
                            errors.middle_name
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm`}
                        />
                      )}
                    />
                    {errors.middle_name && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.middle_name.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4 mb-4">
                  <div className="flex flex-col w-1/2">
                    <label htmlFor="last_name" className="font-normal">
                      Last Name
                    </label>
                    <Controller
                      name="last_name"
                      control={control}
                      rules={
                        isEdit ? { required: "Last name is required" } : {}
                      }
                      render={({ field }) => (
                        <Input
                          type="text"
                          id="last_name"
                          placeholder="Insert Last Name"
                          {...field}
                          className={`mt-1 block w-full h-16 ${
                            errors.last_name
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm`}
                        />
                      )}
                    />
                    {errors.last_name && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.last_name.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-[#016DA1]">
                  Personal Data
                </h3>

                {isEdit && (
                  <div className="flex space-x-4 mb-4">
                    <div className="flex flex-col w-1/2">
                      <label htmlFor="country" className="font-normal">
                        Country
                      </label>
                      <Controller
                        name="country"
                        control={control}
                        rules={{ required: "Country is required" }}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isLoadingCountries}
                          >
                            <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                              <SelectValue
                                placeholder={
                                  isLoadingCountries
                                    ? "Loading..."
                                    : "Select a Country"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {countries.map((countryItem) => (
                                  <SelectItem
                                    key={countryItem.id}
                                    value={countryItem.id}
                                  >
                                    {countryItem.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.country && (
                        <span className="text-red-500 text-sm mt-1">
                          {errors.country.message}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-4 mb-4">
                  <div className="flex flex-col w-1/2">
                    <label htmlFor="id_number" className="font-normal">
                      ID Number
                    </label>
                    <Controller
                      name="id_number"
                      control={control}
                      rules={{ required: "ID number is required" }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          id="id_number"
                          placeholder="Insert ID Number"
                          {...field}
                          className={`mt-1 block w-full h-16 ${
                            errors.id_number
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm`}
                        />
                      )}
                    />
                    {errors.id_number && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.id_number.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4 mb-4">
                  <div className="flex flex-col w-1/2">
                    <label htmlFor="phone_number" className="font-normal">
                      Phone Number
                    </label>
                    <Controller
                      name="phone_number"
                      control={control}
                      rules={{ required: "Phone number is required" }}
                      render={({ field }) => (
                        <Input
                          type="tel"
                          id="phone_number"
                          placeholder="Insert Phone Number"
                          {...field}
                          className={`mt-1 block w-full h-16 ${
                            errors.phone_number
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm`}
                        />
                      )}
                    />
                    {errors.phone_number && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.phone_number.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label htmlFor="email" className="font-normal">
                      Email
                    </label>
                    <Controller
                      name="email"
                      control={control}
                      rules={{ required: "Email is required" }}
                      render={({ field }) => (
                        <Input
                          type="email"
                          id="email"
                          placeholder="Insert Email"
                          {...field}
                          className={`mt-1 block w-full h-16 ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm`}
                        />
                      )}
                    />
                    {errors.email && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-[#016DA1]">
                  Source
                </h3>
                <div className="flex flex-col w-full mb-4">
                  <label htmlFor="source_id" className="font-normal">
                    Source Name
                  </label>
                  <Controller
                    name="source_id"
                    control={control}
                    rules={{ required: "Source is required" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoadingSources}
                      >
                        <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                          <SelectValue
                            placeholder={
                              isLoadingSources
                                ? "Loading..."
                                : "Select Source Type"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {sources.map((sourceItem) => (
                              <SelectItem
                                key={sourceItem.id}
                                value={sourceItem.id}
                              >
                                {sourceItem.source_name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.source_id && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.source_id.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-[#016DA1]">
                  Details
                </h3>
                <div className="flex space-x-4 mb-4">
                  <div className="flex flex-col w-1/2">
                    <label htmlFor="date_blacklisted" className="font-normal">
                      Blacklist Date
                    </label>
                    <Controller
                      name="date_blacklisted"
                      control={control}
                      rules={{ required: "Blacklisted Date is required" }}
                      render={({ field }) => (
                        <Input
                          type="date"
                          id="date_blacklisted"
                          {...field}
                          className={`mt-1 block w-full h-16 ${
                            errors.date_blacklisted
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm`}
                        />
                      )}
                    />
                    {errors.date_blacklisted && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.date_blacklisted.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col w-1/2">
                    <label htmlFor="blacklist_reason" className="font-normal">
                      Blacklist Reason
                    </label>
                    <Controller
                      name="blacklist_reason"
                      control={control}
                      rules={{ required: "Blacklist Reason is required" }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          id="blacklist_reason"
                          placeholder="Insert blacklist reason"
                          {...field}
                          className={`mt-1 block w-full h-16 ${
                            errors.blacklist_reason
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm`}
                        />
                      )}
                    />
                    {errors.blacklist_reason && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.blacklist_reason.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </ContentLoadingWrapper>
  );
}

