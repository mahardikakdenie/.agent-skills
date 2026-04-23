import React from 'react';
import { Check, Save, AlertCircle } from 'react-feather';
import { Controller } from 'react-hook-form';

import {
  Input,
  Button,
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

interface ProductCategoryFormProps {
  mode: 'create' | 'edit';
  handleSubmit: any;
  control: any;
  errors: any;
  watch: any;

  showAlert: boolean;
  errorMessage: string;

  isLoadingDetail: boolean;
  isSaving: boolean;

  onSave: (formData: any) => void;
  onBack: () => void;
  onCloseAlert: () => void;
}

export function ProductCategoryForm({
  mode,
  handleSubmit,
  control,
  errors,
  watch,
  showAlert,
  errorMessage,
  isLoadingDetail,
  isSaving,
  onSave,
  onBack,
  onCloseAlert,
}: ProductCategoryFormProps) {
  const isEdit = mode === 'edit';

  const breadcrumbs = [
    { label: 'Product Category', href: AppURL.masterdataProductCategory },
    { label: isEdit ? 'Update Product Category' : 'Create Product Category', isCurrentPage: true },
  ];

  return (
    <ContentLoadingWrapper isLoading={isSaving || isLoadingDetail}>
      <Box className="flex flex-col w-full">
        <Box as="form" onSubmit={handleSubmit(onSave)}>
          <PageHeader
            title={isEdit ? 'Update Product Category' : 'Create Product Category'}
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

          {showAlert && (
            <Dialog open={showAlert} onClose={onCloseAlert}>
              <DialogContent size="sm">
                <DialogHeader className="flex flex-row items-center gap-3 px-6 pt-6 pb-0">
                  {errorMessage?.toLowerCase().includes('success') ? (
                    <>
                      <Box className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <Check className="h-5 w-5" />
                      </Box>
                      <DialogTitle className="text-lg font-semibold text-slate-900">
                        Changes saved
                      </DialogTitle>
                    </>
                  ) : (
                    <>
                      <Box className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                        <AlertCircle className="h-5 w-5" />
                      </Box>
                      <DialogTitle className="text-lg font-semibold text-slate-900">
                        Unable to save changes
                      </DialogTitle>
                    </>
                  )}
                </DialogHeader>

                <DialogDescription className="px-6 pt-1.5 pb-0 text-[15px] leading-relaxed text-slate-600">
                  {errorMessage ||
                    (errorMessage?.toLowerCase().includes('success')
                      ? 'Your changes have been saved successfully.'
                      : 'An error occurred while processing your request. Please review the form data and try again.')}
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
            <Box className="p-4 sm:p-6 bg-white rounded-lg grid sm:grid-cols-2 gap-x-6 gap-y-4 shadow-sm border border-slate-100">
              <Box className="text-primary font-bold sm:col-span-2">Product Category Details</Box>
              <Box>
                <Box
                  as="label"
                  htmlFor="name"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  Category Name{' '}
                  <Box as="span" className="text-red-500">
                    *
                  </Box>
                </Box>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Category Name is required' }}
                  render={({ field }) => (
                    <Input
                      id="name"
                      type="text"
                      size="lg"
                      placeholder="Enter category name"
                      className={`bg-transparent ${
                        errors.name ? 'border-red-500' : 'border-slate-300'
                      }`}
                      {...field}
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
                  htmlFor="icon"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  Category Icon URL{' '}
                  <Box as="span" className="text-red-500">
                    *
                  </Box>
                </Box>
                <Controller
                  name="icon"
                  control={control}
                  rules={{ required: 'Category Icon is required' }}
                  render={({ field }) => (
                    <Input
                      id="icon"
                      type="text"
                      size="lg"
                      placeholder="Enter icon URL"
                      className={`bg-transparent ${
                        errors.icon ? 'border-red-500' : 'border-slate-300'
                      }`}
                      {...field}
                    />
                  )}
                />
                {errors.icon && (
                  <Box as="p" className="text-red-500 text-xs mt-1">
                    {errors.icon.message?.toString()}
                  </Box>
                )}
              </Box>

              {/* Icon Preview */}
              {watch('icon') && (
                <Box className="sm:col-span-2 mt-2">
                  <Box as="label" className="inline-block text-sm font-medium text-slate-700 mb-2">
                    Icon Preview
                  </Box>
                  <Box className="border border-slate-200 bg-slate-50/50 rounded-xl p-6 inline-flex items-center justify-center min-w-[120px] min-h-[120px]">
                    <Box
                      as="img"
                      src={watch('icon')}
                      alt="Icon preview"
                      className="w-20 h-20 object-contain drop-shadow-sm"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        (e.target as HTMLImageElement).src = '/images/no-data.webp';
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </ContentLoadingWrapper>
  );
}
