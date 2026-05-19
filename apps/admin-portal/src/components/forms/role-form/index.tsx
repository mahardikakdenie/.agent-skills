'use client';

import React, { useEffect } from 'react';
import { Check, Plus, Trash2, Edit, X, Save } from 'react-feather';
import { Controller } from 'react-hook-form';

import {
  Box,
  Button,
  Input,
  Combobox,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from '@repo/ui';

import { ContentLoadingWrapper } from '@/components/core/loading';
import { PageHeader } from '@/components/core/page-header';
import AppURL from '@/constants/app-url.const';

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
  mode: 'create' | 'edit';
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
  onTickPermission: (isChecked: boolean, permissionId: string, index: number) => Promise<void>;
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
  const isEdit = mode === 'edit';

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

  const breadcrumbs = [
    { label: 'Roles', href: AppURL.masterdataRole },
    { label: isEdit ? 'Detail' : 'Add', isCurrentPage: true },
  ];

  return (
    <ContentLoadingWrapper isLoading={isSaving || isLoadingDetail}>
      <Box className="flex flex-col w-full">
        <Box as="form" onSubmit={handleSubmit(onSave)}>
          <PageHeader
            title={isEdit ? 'Edit Role' : 'Add Role'}
            breadcrumbs={breadcrumbs}
            showBackButton={true}
            onBackClick={onBack}
          >
            <Button
              type="submit"
              disabled={isSaving}
              className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
              leftIcon={
                isSaving ? undefined : isEdit ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Save className="w-5 h-5" />
                )
              }
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </PageHeader>

          <Box className="flex flex-col w-full p-4 md:p-6 gap-6">
            <Box className="p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-4 shadow-sm border border-slate-100">
              <Box>
                <Box className="text-primary font-bold mb-1">Role Details</Box>
                <Box as="p" className="mb-5 text-sm text-slate-500">
                  Role defines what users can do and what responsibilities they have
                </Box>
              </Box>

              <Box>
                <Box
                  as="label"
                  htmlFor="name"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  Role Name{' '}
                  <Box as="span" className="text-red-500">
                    *
                  </Box>
                </Box>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'Role Name is required',
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      size="lg"
                      placeholder="Insert role name"
                      error={!!errors.name}
                      className="bg-transparent"
                    />
                  )}
                />
                {errors.name && (
                  <Box as="p" className="text-red-500 text-xs mt-1">
                    {errors.name.message?.toString()}
                  </Box>
                )}
              </Box>

              <Box>
                <Box
                  as="label"
                  htmlFor="description"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  Role Description
                </Box>
                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="description"
                      size="lg"
                      rows={4}
                      placeholder="Insert role description"
                      error={!!errors.description}
                      className="bg-transparent"
                    />
                  )}
                />
              </Box>
            </Box>

            <Box className="flex flex-col gap-4">
              <Box className="flex gap-4 items-center">
                <Box>
                  <Box className="text-primary font-bold mb-2">Permissions</Box>
                  <Box as="p" className="text-sm text-black/60">
                    Permission is a type of menu access assigned to a specific role
                  </Box>
                </Box>
                <Button
                  type="button"
                  disabled={!isEdit}
                  onClick={onAddPermission}
                  className={`h-10 rounded-full px-5 text-black ml-auto ${
                    isEdit ? 'bg-[#F5BA41] hover:bg-[#e6a92d]' : 'bg-gray-300 hover:bg-gray-300'
                  }`}
                  leftIcon={<Plus className="w-5 h-5" />}
                >
                  Add Menu
                </Button>
              </Box>

              <Box className="w-full bg-white rounded-lg overflow-auto shadow-sm border border-slate-100">
                <Table className="table-search-params min-w-[960px] border-collapse">
                  <TableHeader className="bg-[#0073A8] hover:bg-[#0073A8] border-none">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="whitespace-nowrap py-3 pl-4 pr-1 text-white font-bold h-11 border-none">
                        Menu
                      </TableHead>
                      <TableHead className="py-3 px-1 text-white font-bold h-11 border-none">
                        Permission
                      </TableHead>
                      <TableHead className="py-3 pl-1 pr-4 w-20 text-center text-white font-bold h-11 border-none">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissionFields.map((item, indexPage) => {
                      const availableMenus = getAvailableMenus(indexPage);

                      return (
                        <TableRow
                          key={indexPage}
                          className={`group transition-all duration-200 border-b border-slate-100 last:border-0 ${
                            item.isEditable
                              ? 'bg-blue-50/40 ring-1 ring-blue-100/50'
                              : 'hover:bg-slate-50/80'
                          }`}
                        >
                          {item.isEditable ? (
                            <>
                              <TableCell className="w-[300px] min-w-[260px] py-4 pl-4 pr-3 border-none align-top">
                                <Controller
                                  name={`menu.${indexPage}` as const}
                                  control={control}
                                  render={({ field }) => (
                                    <Combobox
                                      value={field.value}
                                      onValueChange={(value) => {
                                        selectMenu(value ?? '', field, indexPage);
                                      }}
                                      options={availableMenus.map((menu: any) => ({
                                        label: menu.name,
                                        value: menu.id,
                                      }))}
                                      placeholder="Select Menu"
                                      size="lg"
                                      className="w-full bg-white"
                                    />
                                  )}
                                />
                              </TableCell>

                              <TableCell className="min-w-[520px] py-4 px-3 border-none">
                                <Controller
                                  name={`permission.${indexPage}` as const}
                                  control={control}
                                  render={({ field }) => (
                                    <Box className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-5 gap-y-3 bg-white border border-slate-200 px-4 py-4 min-h-[48px] rounded-lg shadow-sm group-hover:border-blue-200 transition-all duration-200">
                                      {permissionOptions[item.menuId]?.map(
                                        (perm: MenuPermissionOption, index: number) => (
                                          <Checkbox
                                            key={index}
                                            label={perm.permissions.name}
                                            checked={perm.id ? true : false}
                                            onCheckedChange={(checked) => {
                                              onTickPermission(
                                                checked === true,
                                                perm.permissions.id,
                                                indexPage,
                                              );
                                            }}
                                            labelClassName="min-w-0 whitespace-normal break-words text-slate-600 font-medium leading-5"
                                            className="min-w-0 hover:text-primary transition-colors"
                                          />
                                        ),
                                      )}
                                    </Box>
                                  )}
                                />
                              </TableCell>

                              <TableCell className="py-4 pl-1 pr-4 text-center border-none align-top">
                                <Box className="flex gap-2 justify-center pt-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="xs"
                                    onClick={() => onSaveRolePermission(indexPage)}
                                    className="h-9 w-9 p-0 rounded-full text-green-600 hover:bg-green-50 hover:!text-green-700 active:!text-green-700 transition-all border border-transparent hover:border-green-100"
                                  >
                                    <Check className="w-5 h-5" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="xs"
                                    onClick={() => onBulkDeleteRolePermission(indexPage)}
                                    className="h-9 w-9 p-0 rounded-full text-red-600 hover:bg-red-50 hover:!text-red-700 active:!text-red-700 transition-all border border-transparent hover:border-red-100"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </Button>
                                </Box>
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell className="w-[300px] min-w-[260px] py-4 pl-4 pr-3 border-none font-semibold text-slate-800 align-top pt-5">
                                {item.menu}
                              </TableCell>
                              <TableCell className="min-w-[520px] py-4 px-3 border-none">
                                <Box className="flex flex-wrap gap-2">
                                  {permissionOptions[item.menuId]?.map(
                                    (perm: MenuPermissionOption) => {
                                      if (perm.id) {
                                        return (
                                          <Box
                                            as="span"
                                            key={perm.id}
                                            className="inline-flex max-w-full items-start gap-2 rounded-full bg-slate-50 border border-slate-200 py-1.5 px-4 text-sm font-medium text-slate-700 shadow-sm"
                                          >
                                            <Box
                                              as="span"
                                              className="min-w-0 break-words leading-5"
                                            >
                                              {perm.permissions.name}
                                            </Box>
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="xs"
                                              className="h-5 w-5 shrink-0 p-0 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                                              onClick={() => onDeletePermission(perm.id)}
                                            >
                                              <X className="w-3.5 h-3.5" />
                                            </Button>
                                          </Box>
                                        );
                                      } else {
                                        return null;
                                      }
                                    },
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell className="py-4 pl-1 pr-4 text-center border-none align-top">
                                <Box className="flex gap-2 justify-center pt-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="xs"
                                    onClick={() => onBulkEditPermission(indexPage)}
                                    className="h-9 w-9 p-0 rounded-full text-slate-600 hover:bg-blue-50 hover:text-blue-600 active:text-blue-700 transition-all border border-transparent hover:border-blue-100"
                                  >
                                    <Edit className="w-5 h-5" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="xs"
                                    onClick={() => onBulkDeleteRolePermission(indexPage)}
                                    className="h-9 w-9 p-0 rounded-full text-slate-600 hover:bg-red-50 hover:!text-red-600 active:!text-red-700 transition-all border border-transparent hover:border-red-100"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </Button>
                                </Box>
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ContentLoadingWrapper>
  );
}
