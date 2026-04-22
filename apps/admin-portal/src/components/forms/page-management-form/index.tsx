'use client';

import React, { useEffect } from 'react';
import { Check, Plus, Save, Trash } from 'react-feather';
import { Controller } from 'react-hook-form';

import {
  Box,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui';

import { PageHeader } from '@/components/page-header';
import { ContentLoadingWrapper } from '@/components/ui/loading';
import AppURL from '@/constants/app-url.const';

interface PermissionField {
  id: string;
  name: string;
}

interface PageManagementFormProps {
  mode: 'create' | 'edit';
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
  const isEdit = mode === 'edit';

  useEffect(() => {
    if (isEdit && pageId) {
      loadPageDetail(pageId);
    }
  }, [isEdit, pageId, loadPageDetail]);

  const breadcrumbs = [
    { label: 'Page Management', href: AppURL.masterdataPageManagement },
    { label: isEdit ? 'Edit' : 'Add', isCurrentPage: true },
  ];

  return (
    <ContentLoadingWrapper isLoading={isSaving || isLoadingDetail}>
      <Box className="flex flex-col w-full">
        <Box as="form" onSubmit={handleSubmit(onSave)}>
          <PageHeader
            title={isEdit ? 'Edit Page Management' : 'Add Page'}
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
              <Box className="text-primary font-bold">Menu Details</Box>
              <Box>
                <Box
                  as="label"
                  htmlFor="name"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  Menu Name{' '}
                  <Box as="span" className="text-red-500">
                    *
                  </Box>
                </Box>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Menu Name is required' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      size="lg"
                      placeholder="Insert Menu Name"
                      className={`bg-transparent ${
                        errors.name ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                  )}
                />
                {errors.name && (
                  <Box as="p" className="text-red-500 text-xs mt-1">
                    {errors.name.message?.toString()}
                  </Box>
                )}
              </Box>
            </Box>

            {isEdit && (
              <Box className="p-4 sm:p-6 bg-white rounded-lg gap-4 shadow-sm border border-slate-100">
                <Box className="flex gap-4 items-center">
                  <Box>
                    <Box className="text-primary font-bold mb-2">Permissions</Box>
                  </Box>
                  <Button
                    type="button"
                    onClick={onAddPermission}
                    className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] ml-auto"
                    leftIcon={<Plus className="w-5 h-5" />}
                  >
                    Add Permission
                  </Button>
                </Box>

                <Box className="w-full bg-white rounded-lg overflow-auto mt-5">
                  <Table className="table-search-params border-collapse">
                    <TableHeader className="bg-[#0073A8] hover:bg-[#0073A8] border-none">
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="whitespace-nowrap py-3 pl-4 pr-1 text-white font-bold h-11 border-none">
                          Name
                        </TableHead>
                        <TableHead className="py-3 pl-1 pr-4 w-20 text-center text-white font-bold h-11 border-none">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {permissionFields.map((item, index) => (
                        <TableRow
                          key={index}
                          className="group hover:bg-[#F2F4F7] transition-all duration-200 border-b border-slate-100 last:border-0"
                        >
                          <TableCell className="py-3 pl-4 pr-1 border-none">
                            <Input
                              type="text"
                              size="lg"
                              placeholder="Insert permission name"
                              value={item.name}
                              onChange={(e) => onChangePermission(index, e.target.value)}
                              className="bg-white border-slate-200 transition-all duration-200 group-hover:border-slate-300 group-hover:shadow-sm focus:border-[#0073A8] focus:ring-1 focus:ring-[#0073A8]/10"
                            />
                          </TableCell>
                          <TableCell className="py-3 pl-1 pr-4 text-center border-none">
                            <Button
                              type="button"
                              variant="ghost"
                              size="xs"
                              onClick={() => onDeletePermission(item.id)}
                              className="h-9 w-9 p-0 rounded-md text-red-600 hover:bg-red-50 hover:!text-red-700 transition-colors"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </ContentLoadingWrapper>
  );
}
