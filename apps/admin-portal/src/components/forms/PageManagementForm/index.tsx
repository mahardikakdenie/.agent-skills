"use client";

import React, { useEffect } from "react";
import { Check, ChevronLeft, Plus, Trash2 } from "react-feather";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";

interface PermissionField {
  id: string;
  name: string;
}

interface PageManagementFormProps {
  mode: "create" | "edit";
  pageId?: string;

  handleSubmit: any;
  control: any;
  errors: any;

  pageName: string;
  permissionFields: PermissionField[];

  isLoadingDetail: boolean;
  isSaving: boolean;

  onSave: (formData: any) => void;
  onBack: () => void;
  loadPageDetail: (id: string) => void;
  onAddPermission: () => void;
  onDeletePermission: (id: string) => Promise<void>;
  onChangePermission: (index: number, value: string) => void;
}

export default function PageManagementForm({
  mode,
  pageId,
  handleSubmit,
  control,
  errors,
  pageName,
  permissionFields,
  isLoadingDetail,
  isSaving,
  onSave,
  onBack,
  loadPageDetail,
  onAddPermission,
  onDeletePermission,
  onChangePermission,
}: PageManagementFormProps) {
  const isEdit = mode === "edit";

  useEffect(() => {
    if (isEdit && pageId) {
      loadPageDetail(pageId);
    }
  }, [isEdit, pageId, loadPageDetail]);

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
                      Page Management
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{isEdit ? "Edit" : "Add"}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
                {isEdit ? "Edit Page Management" : "Add Page"}
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
            <div className="p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-4">
              <div className="text-primary font-bold">Menu Details</div>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Menu Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Menu Name is required" }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="name"
                      placeholder="Insert Menu Name"
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
            </div>

            {isEdit && (
              <div className="p-4 sm:p-6 bg-white rounded-lg gap-4">
                <div className="flex gap-4 items-center">
                  <div>
                    <div className="text-primary font-bold mb-2">
                      Permissions
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={onAddPermission}
                    className="bg-[#F5BA41] hover:bg-[#e6a92d] text-black rounded-full px-5 ml-auto"
                  >
                    <Plus className="mr-1" width={18} height={18} />
                    Add Permission
                  </Button>
                </div>

                <div className="w-full bg-white rounded-lg overflow-auto mt-5">
                  <Table className="table-search-params">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap py-2">
                          Name
                        </TableHead>
                        <TableHead className="py-2 w-10 text-center">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {permissionFields.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="py-1">
                            <Input
                              type="text"
                              placeholder="Insert permission name"
                              value={item.name}
                              onChange={(e) =>
                                onChangePermission(index, e.target.value)
                              }
                              className="mt-1 block w-full h-12 border-gray-300 rounded-md shadow-sm"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              className="text-red-500 hover:bg-transparent"
                              variant="ghost"
                              onClick={() => onDeletePermission(item.id)}
                            >
                              <Trash2 />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </ContentLoadingWrapper>
  );
}
