"use client";

import React, { useEffect } from "react";
import { Check, ChevronLeft, Eye, EyeOff } from "react-feather";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@repo/ui";
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

interface PartnerManagementFormProps {
  mode: "create" | "edit";
  partnerId?: string;

  handleSubmit: any;
  control: any;
  errors: any;
  setValue: any;

  partnerName: string;
  partnerEmail: string;
  channels: any[];

  isLoadingDetail: boolean;
  isLoadingChannels: boolean;
  isSaving: boolean;

  onSave: (formData: any) => void;
  onBack: () => void;
  generateApiKey: () => void;
}

const PHONE_CODES = [
  { code: "+62", country: "Indonesia" },
  { code: "+65", country: "Singapore" },
  { code: "+60", country: "Malaysia" },
  { code: "+63", country: "Philippines" },
  { code: "+66", country: "Thailand" },
  { code: "+84", country: "Vietnam" },
];

export default function PartnerManagementForm({
  mode,
  partnerId,
  handleSubmit,
  control,
  errors,
  setValue,
  partnerName,
  partnerEmail,
  channels,
  isLoadingDetail,
  isLoadingChannels,
  isSaving,
  onSave,
  onBack,
  generateApiKey,
}: PartnerManagementFormProps) {
  const isEdit = mode === "edit";
  const [showApiKey, setShowApiKey] = React.useState(false);

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
                      Partner Management
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{isEdit ? "Edit" : "Add"}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
                {isEdit ? "Edit Partner" : "Add Partner"}
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
            <div className="p-4 sm:p-6 bg-white rounded-lg grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      placeholder="Insert Name"
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
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      id="email"
                      placeholder="Insert Email"
                      className={`mt-1 block w-full h-12 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm`}
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message?.toString()}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Controller
                    name="phone_code"
                    control={control}
                    defaultValue="+62"
                    rules={{ required: "Phone code is required" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[120px] h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                          <SelectValue placeholder="Code" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {PHONE_CODES.map((item) => (
                              <SelectItem key={item.code} value={item.code}>
                                {item.code} {item.country}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Controller
                    name="phone_number"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Phone Number is required",
                      pattern: {
                        value: /^[0-9]{6,12}$/,
                        message:
                          "Please enter a valid phone number (6-12 digits)",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="phone_number"
                        placeholder="Insert Phone Number"
                        className={`mt-1 block w-full h-12 ${
                          errors.phone_number
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm`}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </div>
                {(errors.phone_number || errors.phone_code) && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone_code?.message?.toString() ||
                      errors.phone_number?.message?.toString()}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="api_key"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  API Key <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Controller
                    name="api_key"
                    control={control}
                    defaultValue=""
                    rules={{ required: "API Key is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="api_key"
                        readOnly
                        type={showApiKey ? "text" : "password"}
                        placeholder="Generated API Key"
                        className={`mt-1 block w-full h-12 pr-44 ${
                          errors.api_key ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm`}
                      />
                    )}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                    <Button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      {showApiKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={generateApiKey}
                      className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] h-8 px-3"
                    >
                      Generate
                    </Button>
                  </div>
                </div>
                {errors.api_key && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.api_key.message?.toString()}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="channel"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Channel <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="channel"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Channel is required" }}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString() || ""}
                      onValueChange={field.onChange}
                      disabled={isEdit}
                    >
                      <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                        <SelectValue placeholder="Select Channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {isLoadingChannels ? (
                            <div className="px-2 py-1.5 text-sm text-gray-500">
                              Loading channels...
                            </div>
                          ) : channels.length > 0 ? (
                            channels.map((channel: any) => (
                              <SelectItem
                                key={channel.id}
                                value={channel.id.toString()}
                              >
                                {channel.name
                                  .replace(/-/g, " ")
                                  .replace(/\b\w/g, (char: string) =>
                                    char.toUpperCase()
                                  )}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-2 py-1.5 text-sm text-gray-500">
                              No channels available
                            </div>
                          )}
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
            </div>
          </div>
        </form>
      </div>
    </ContentLoadingWrapper>
  );
}
