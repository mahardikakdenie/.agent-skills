'use client';

import React from 'react';
import { Check, Save, AlertCircle } from 'react-feather';
import { Controller } from 'react-hook-form';

import {
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Combobox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  Box,
} from '@repo/ui';

import { PageHeader } from '@/components/page-header';
import { ContentLoadingWrapper } from '@/components/ui/loading';
import AppURL from '@/constants/app-url.const';

interface Insurance {
  id: string;
  name: string;
}

interface SourceFormProps {
  mode: 'create' | 'edit';
  handleSubmit: any;
  control: any;
  errors: any;

  insurances: Insurance[];

  showAlert: boolean;
  errorMessage: string;
  sourceType?: string;

  isLoadingInsurances: boolean;
  isLoadingDetail: boolean;
  isSaving: boolean;

  onSave: (formData: any) => void;
  onBack: () => void;
  onCloseAlert: () => void;
  onSourceTypeChange?: (value: string) => void;
}

export function SourceForm({
  mode,
  handleSubmit,
  control,
  errors,
  insurances,
  showAlert,
  errorMessage,
  sourceType,
  isLoadingInsurances,
  isLoadingDetail,
  isSaving,
  onSave,
  onBack,
  onCloseAlert,
  onSourceTypeChange,
}: SourceFormProps) {
  const isEdit = mode === 'edit';

  const breadcrumbs = [
    { label: 'Source List', href: AppURL.sourceList },
    { label: isEdit ? 'Edit Source' : 'Add New Source', isCurrentPage: true },
  ];

  const isSuccess = errorMessage.includes('Successfully');

  return (
    <ContentLoadingWrapper
      isLoading={isSaving || isLoadingDetail}
      loadingText={isEdit && isLoadingDetail ? 'Loading source details...' : 'Saving source...'}
    >
      <Box className="flex flex-col w-full">
        <Box as="form" onSubmit={handleSubmit(onSave)}>
          <PageHeader
            title={isEdit ? 'Edit Source' : 'Add New Source'}
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
              {isSaving ? 'Saving...' : isEdit ? 'Save' : 'Submit'}
            </Button>
          </PageHeader>

          {showAlert && (
            <Dialog open={showAlert} onClose={onCloseAlert}>
              <DialogContent size="sm">
                <DialogHeader className="flex flex-row items-center gap-3 px-6 pt-6 pb-0">
                  {isSuccess ? (
                    <>
                      <Box className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <Check className="h-5 w-5" />
                      </Box>
                      <DialogTitle className="text-lg font-semibold text-slate-900">
                        Success
                      </DialogTitle>
                    </>
                  ) : (
                    <>
                      <Box className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                        <AlertCircle className="h-5 w-5" />
                      </Box>
                      <DialogTitle className="text-lg font-semibold text-slate-900">
                        Error
                      </DialogTitle>
                    </>
                  )}
                </DialogHeader>

                <DialogDescription className="px-6 pt-1.5 pb-0 text-[15px] leading-relaxed text-slate-600">
                  {errorMessage}
                </DialogDescription>

                <DialogFooter className="px-6 pt-10 pb-6 border-t-0 sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={onCloseAlert}
                    className="h-10 min-w-[100px] rounded-lg px-6 text-sm font-medium transition-all duration-200"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <Box className="flex flex-col w-full p-4 md:p-6 gap-6">
            <Box className="p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-4 shadow-sm border border-slate-100">
              <Box className="text-[#016DA1] font-bold text-lg mb-2">Source Details</Box>

              <Box className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                <Box>
                  <Box
                    as="label"
                    htmlFor="source_name"
                    className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  >
                    Source Name{' '}
                    <Box as="span" className="text-red-500">
                      *
                    </Box>
                  </Box>
                  <Controller
                    name="source_name"
                    control={control}
                    rules={{ required: 'Source name is required' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="source_name"
                        type="text"
                        size="lg"
                        placeholder="Insert Source Name"
                        className={`bg-transparent ${
                          errors.source_name ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                    )}
                  />
                  {errors.source_name && (
                    <Box as="p" className="text-red-500 text-xs mt-1">
                      {errors.source_name.message?.toString()}
                    </Box>
                  )}
                </Box>

                <Box>
                  <Box
                    as="label"
                    htmlFor="source_url"
                    className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  >
                    URL
                  </Box>
                  <Controller
                    name="source_url"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="source_url"
                        type="text"
                        size="lg"
                        placeholder="Insert Source URL"
                        className={`bg-transparent ${
                          errors.source_url ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                    )}
                  />
                  {errors.source_url && (
                    <Box as="p" className="text-red-500 text-xs mt-1">
                      {errors.source_url.message?.toString()}
                    </Box>
                  )}
                </Box>

                <Box>
                  <Box
                    as="label"
                    htmlFor="source_type"
                    className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  >
                    Type{' '}
                    <Box as="span" className="text-red-500">
                      *
                    </Box>
                  </Box>
                  <Controller
                    name="source_type"
                    control={control}
                    rules={{ required: 'Source type is required' }}
                    render={({ field }) => (
                      <Select
                        size="lg"
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          onSourceTypeChange?.(value);
                        }}
                      >
                        <SelectTrigger
                          id="source_type"
                          className={`w-full bg-transparent hover:cursor-pointer ${
                            errors.source_type ? 'border-red-500' : 'border-slate-300'
                          }`}
                        >
                          <SelectValue placeholder="Select Source Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="insurance">Insurance</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.source_type && (
                    <Box as="p" className="text-red-500 text-xs mt-1">
                      {errors.source_type.message?.toString()}
                    </Box>
                  )}
                </Box>

                {sourceType === 'insurance' && (
                  <Box>
                    <Box
                      as="label"
                      htmlFor="insurance_id"
                      className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                    >
                      Insurance{' '}
                      <Box as="span" className="text-red-500">
                        *
                      </Box>
                    </Box>
                    <Controller
                      name="insurance_id"
                      control={control}
                      rules={
                        sourceType === 'insurance' ? { required: 'Insurance is required' } : {}
                      }
                      render={({ field }) => (
                        <Combobox
                          id="insurance_id"
                          size="lg"
                          options={insurances.map((item) => ({
                            label: item.name,
                            value: item.id,
                          }))}
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isLoadingInsurances}
                          placeholder={isLoadingInsurances ? 'Loading...' : 'Select Insurance'}
                          searchPlaceholder="Search insurance..."
                          triggerClassName={
                            errors.insurance_id ? 'border-red-500' : 'border-slate-300'
                          }
                        />
                      )}
                    />
                    {errors.insurance_id && (
                      <Box as="p" className="text-red-500 text-xs mt-1">
                        {errors.insurance_id.message?.toString()}
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ContentLoadingWrapper>
  );
}
