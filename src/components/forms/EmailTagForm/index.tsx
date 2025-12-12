"use client";

import React from "react";
import { Check, ChevronLeft } from "react-feather";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller } from "react-hook-form";
import { ContentLoadingWrapper } from "@/components/ui/Loading/index";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmailTagFormProps {
  mode: "create" | "edit";
  tagId?: string;

  handleSubmit: any;
  control: any;
  errors: any;
  setValue: any;

  journeys: any[];

  isLoadingDetail: boolean;
  isLoadingJourneys: boolean;
  isSaving: boolean;

  onSave: (formData: any) => void;
  onBack: () => void;
}

export default function EmailTagForm({
  mode,
  tagId,
  handleSubmit,
  control,
  errors,
  setValue,
  journeys,
  isLoadingDetail,
  isLoadingJourneys,
  isSaving,
  onSave,
  onBack,
}: EmailTagFormProps) {
  const isEdit = mode === "edit";

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
                      Email Tag
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{isEdit ? "Edit" : "Add"}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
                {isEdit ? "Edit Email Tag" : "Add Email Tag"}
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
                <Check className="mr-2 w-4 h-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>

          <div className="flex flex-col w-full p-4 md:p-6 gap-4">
            <div className="p-4 sm:p-6 bg-white rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="journey"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Journey<span className="text-red-500">*</span>
                </label>
                <Controller
                  name="journey"
                  control={control}
                  rules={{ required: "Journey is required" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                        <SelectValue placeholder="Select Journey" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {isLoadingJourneys ? (
                            <div className="px-2 py-1.5 text-sm text-gray-500">
                              Loading...
                            </div>
                          ) : (
                            journeys.map((jour: any) => (
                              <SelectItem key={jour.id} value={jour.code}>
                                {jour.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.journey && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.journey.message?.toString()}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="tag"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Tag Name<span className="text-red-500">*</span>
                </label>
                <Controller
                  name="tag"
                  control={control}
                  rules={{ required: "Email Tag Name is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="Insert Email Tag Name"
                      className={`h-12 ${
                        errors.tag ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  )}
                />
                {errors.tag && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.tag.message?.toString()}
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
