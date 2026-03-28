"use client";

import React, { useEffect } from "react";
import { Check, ChevronLeft } from "react-feather";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui";
import { Input } from "@repo/ui";
import { Button } from "@repo/ui";
import { Controller } from "react-hook-form";
import { ContentLoadingWrapper } from "@/components/ui/Loading/index";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import AppURL from "@/constants/app-url.const";

interface HolidayFormProps {
  mode: "create" | "edit";
  holidayId?: string;

  // Form props
  handleSubmit: any;
  control: any;
  errors: any;
  setValue: any;
  watch: any;

  // Data
  types: Array<{ name: string; code: string }>;
  countries: Array<{ name: string; code: string }>;

  // Loading states
  isLoadingDetail: boolean;
  isSaving: boolean;

  // Handlers
  onSave: (formData: any) => void;
  onBack: () => void;
}

export default function HolidayForm({
  mode,
  holidayId,
  handleSubmit,
  control,
  errors,
  watch,
  types,
  countries,
  isLoadingDetail,
  isSaving,
  onSave,
  onBack,
}: HolidayFormProps) {
  const isEdit = mode === "edit";
  const watchStartdate = watch("startdate");

  return (
    <ContentLoadingWrapper isLoading={isSaving || isLoadingDetail}>
      <div className="flex flex-col w-full">
        <form onSubmit={handleSubmit(onSave)}>
          <div className="bg-white md:px-6 p-4 flex items-center">
            <div>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink className="cursor-pointer" onClick={onBack}>
                      Holiday
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {isEdit ? "Update Holiday" : "Create Holiday Date"}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
                {isEdit ? "Update Holiday" : "Create Holiday Date"}
              </h2>
            </div>

            <div className="flex ml-auto space-x-4">
              <div
                onClick={onBack}
                className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </div>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-5 rounded-full px-5"
              >
                <Check className="mr-2 w-4 h-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>

          <div className="flex flex-col w-full p-4 md:p-6 gap-4">
            <div className="p-4 sm:p-6 bg-white rounded-lg flex-col gap-4 grid sm:grid-cols-2">
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Country<span className="text-red-500">*</span>
                </label>
                <Controller
                  name="country"
                  control={control}
                  rules={{ required: "Country is required" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {countries.map((item: any) => (
                            <SelectItem key={item.code} value={item.code}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.country.message?.toString()}
                  </p>
                )}
              </div>

              <div></div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Holiday Type<span className="text-red-500">*</span>
                </label>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: "Holiday Type is required" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                        <SelectValue placeholder="Select Holiday Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {types.map((item: any) => (
                            <SelectItem key={item.code} value={item.code}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
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

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Holiday Name<span className="text-red-500">*</span>
                </label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Holiday Name is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="Insert holiday name"
                      className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2"
                    />
                  )}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message?.toString()}
                  </p>
                )}
              </div>

              {isEdit ? (
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Date<span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="date"
                    control={control}
                    rules={{ required: "Date is required" }}
                    render={({ field }) => (
                      <Input {...field} type="date" placeholder="Insert date" />
                    )}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.date.message?.toString()}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <label
                      htmlFor="startdate"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Start Date<span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="startdate"
                      control={control}
                      rules={{ required: "Start date is required" }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="date"
                          placeholder="Insert start date"
                        />
                      )}
                    />
                    {errors.startdate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.startdate.message?.toString()}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="enddate"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      End Date<span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="enddate"
                      control={control}
                      rules={{ required: "End date is required" }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="date"
                          min={watchStartdate || undefined}
                          placeholder="Insert end date"
                        />
                      )}
                    />
                    {errors.enddate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.enddate.message?.toString()}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </ContentLoadingWrapper>
  );
}
