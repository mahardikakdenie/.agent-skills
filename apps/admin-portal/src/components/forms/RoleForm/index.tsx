"use client";

import React, { useEffect } from "react";
import { Check, ChevronLeft, Plus, Trash2, Edit, X } from "react-feather";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui";
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
} from "@repo/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { Textarea } from "@repo/ui";

interface MenuPermissionForm {
  menuId: string;
  menu: string;
  permission: string[];
  isEditable: boolean;
}

interface MenuPermissionOption {
  id: string;
  permissions: {
    id: string;
    name: string;
  };
}

interface RoleFormProps {
  mode: "create" | "edit";
  roleId?: string;

  handleSubmit: any;
  control: any;
  errors: any;
  watch: any;
  setValue: any;

  roleName: string;
  roleDescription: string;
  permissionFields: MenuPermissionForm[];
  permissionOptions: any;
  menus: any[];

  isLoadingDetail: boolean;
  isLoadingMenus: boolean;
  isSaving: boolean;

  onSave: (formData: any) => void;
  onBack: () => void;
  loadRoleDetail: (id: string) => void;
  onAddPermission: () => void;
  onDeletePermission: (id: string) => Promise<void>;
  onSaveRolePermission: (index: number) => void;
  onBulkEditPermission: (index: number) => Promise<void>;
  onBulkDeleteRolePermission: (index: number) => Promise<void>;
  onTickPermission: (
    isChecked: boolean,
    permissionId: string,
    index: number
  ) => Promise<void>;
  selectMenu: (value: string, field: any, index: number) => Promise<void>;
  setPermissionFields: (fields: MenuPermissionForm[]) => void;
}

export default function RoleForm({
  mode,
  roleId,
  handleSubmit,
  control,
  errors,
  watch,
  setValue,
  roleName,
  roleDescription,
  permissionFields,
  permissionOptions,
  menus,
  isLoadingDetail,
  isLoadingMenus,
  isSaving,
  onSave,
  onBack,
  loadRoleDetail,
  onAddPermission,
  onDeletePermission,
  onSaveRolePermission,
  onBulkEditPermission,
  onBulkDeleteRolePermission,
  onTickPermission,
  selectMenu,
  setPermissionFields,
}: RoleFormProps) {
  const isEdit = mode === "edit";

  useEffect(() => {
    if (isEdit && roleId) {
      loadRoleDetail(roleId);
    }
  }, [isEdit, roleId, loadRoleDetail]);

  const getAvailableMenus = (currentIndex: number) => {
    const selectedMenuIds = permissionFields
      .map((field, index) => {
        if (index === currentIndex) return null;
        return field.menuId;
      })
      .filter((id) => id);

    return menus.filter((menu) => !selectedMenuIds.includes(menu.id));
  };

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
                      Roles
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{isEdit ? "Detail" : "Add"}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
                {isEdit ? "Edit Role" : "Add Role"}
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
            <div className="p-4 sm:p-6 bg-white rounded-lg gap-4">
              <div className="text-primary font-bold mb-1">Role Details</div>
              <p className="mb-5 text-sm text-gray-500">
                <i>
                  Role defines what users can do and what responsibilities they
                  have
                </i>
              </p>

              <div className="mb-5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Role Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Role Name is required",
                  }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="name"
                      placeholder="Insert role name"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
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
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Role Description
                </label>
                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Textarea
                      id="description"
                      rows={7}
                      placeholder="Insert role description"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                      className={`mt-1 block w-full ${
                        errors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm`}
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div>
                <div className="text-primary font-bold mb-2">Permissions</div>
                <p className="text-sm text-black/60">
                  <i>
                    Permission is a type of menu access assigned to a specific
                    role
                  </i>
                </p>
              </div>
              {isEdit && (
                <Button
                  type="button"
                  onClick={onAddPermission}
                  className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full ml-auto w-32"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Menu
                </Button>
              )}
              {!isEdit && (
                <Button
                  type="button"
                  disabled
                  className="bg-gray-300 text-black hover:bg-gray-300 rounded-full ml-auto w-32"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Menu
                </Button>
              )}
            </div>

            <div className="w-full bg-white rounded-lg overflow-auto">
              <Table className="table-search-params">
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap py-2">
                      Menu
                    </TableHead>
                    <TableHead className="py-2">Permission</TableHead>
                    <TableHead className="py-2 w-10 text-center"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissionFields.map((item, indexPage) => {
                    const availableMenus = getAvailableMenus(indexPage);

                    return (
                      <TableRow key={indexPage}>
                        {item.isEditable ? (
                          <>
                            <TableCell className="min-w-48 w-80">
                              <Controller
                                name={`menu.${indexPage}` as const}
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    value={field.value}
                                    onValueChange={(value: string) => {
                                      selectMenu(value, field, indexPage);
                                    }}
                                  >
                                    <SelectTrigger className="w-full h-10 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2 rounded-xl min-w-28">
                                      <SelectValue placeholder="Select Menu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        {availableMenus.length > 0 ? (
                                          availableMenus.map((menu: any) => (
                                            <SelectItem
                                              key={menu.id}
                                              value={menu.id}
                                            >
                                              {menu?.name}
                                            </SelectItem>
                                          ))
                                        ) : (
                                          <div className="px-2 py-1.5 text-sm text-gray-500">
                                            No menus available
                                          </div>
                                        )}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </TableCell>

                            <TableCell className="py-3">
                              <Controller
                                name={`permission.${indexPage}` as const}
                                control={control}
                                render={({ field }) => (
                                  <div className="flex flex-wrap gap-5 bg-white border px-4 py-2 min-h-11 rounded-lg">
                                    {permissionOptions[item.menuId]?.map(
                                      (
                                        perm: MenuPermissionOption,
                                        index: number
                                      ) => (
                                        <label
                                          key={index}
                                          className="flex items-center"
                                        >
                                          <Input
                                            type="checkbox"
                                            value={perm.permissions.id}
                                            checked={perm.id ? true : false}
                                            onChange={(event) => {
                                              event.stopPropagation();
                                              onTickPermission(
                                                event.target.checked,
                                                perm.permissions.id,
                                                indexPage
                                              );
                                            }}
                                            className="w-4 h-4 max-h-4"
                                          />
                                          <span className="ml-2">
                                            {perm.permissions.name}
                                          </span>
                                        </label>
                                      )
                                    )}
                                  </div>
                                )}
                              />
                            </TableCell>

                            <TableCell className="py-1 text-center">
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  className="text-black/50 hover:text-black bg-transparent hover:bg-transparent p-0"
                                  onClick={() =>
                                    onSaveRolePermission(indexPage)
                                  }
                                >
                                  <Check className="w-5 h-5" />
                                </Button>
                                <Button
                                  type="button"
                                  className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                                  onClick={() =>
                                    onBulkDeleteRolePermission(indexPage)
                                  }
                                >
                                  <Trash2 className="w-5 h-5" />
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="py-1">{item.menu}</TableCell>
                            <TableCell className="py-3">
                              <div className="flex flex-wrap gap-2">
                                {permissionOptions[item.menuId]?.map(
                                  (perm: MenuPermissionOption) => {
                                    if (perm.id) {
                                      return (
                                        <span
                                          key={perm.id}
                                          className="inline-flex items-center gap-2 rounded-full bg-[#F0F1F5] border border-[#E2E7EB] py-2 px-4"
                                        >
                                          {perm.permissions.name}
                                          <Button
                                            type="button"
                                            className="text-default-300 bg-transparent hover:bg-transparent p-0 h-[20px]"
                                            onClick={() =>
                                              onDeletePermission(perm.id)
                                            }
                                          >
                                            <X className="w-5 h-5" />
                                          </Button>
                                        </span>
                                      );
                                    } else {
                                      return null;
                                    }
                                  }
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-1 text-center">
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  className="text-black/50 hover:text-black bg-transparent hover:bg-transparent p-0"
                                  onClick={() =>
                                    onBulkEditPermission(indexPage)
                                  }
                                >
                                  <Edit className="w-5 h-5" />
                                </Button>
                                <Button
                                  type="button"
                                  className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                                  onClick={() =>
                                    onBulkDeleteRolePermission(indexPage)
                                  }
                                >
                                  <Trash2 className="w-5 h-5" />
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </form>
      </div>
    </ContentLoadingWrapper>
  );
}

