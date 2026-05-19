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

import { PageHeader } from '@/components/core/page-header';
import { ContentLoadingWrapper } from '@/components/core/loading';
import AppURL from '@/constants/app-url.const';

interface InsuranceFormProps {
  mode: 'create' | 'edit';
  handleSubmit: any;
  control: any;
  errors: any;
  watch: any;

  showAlert: boolean;
  alertMessage: string;
  alertType: 'success' | 'error';

  isLoadingDetail: boolean;
  isSaving: boolean;

  onSave: (formData: any) => void;
  onBack: () => void;
  onCloseAlert: () => void;
}

export function InsuranceForm({
  mode,
  handleSubmit,
  control,
  errors,
  watch,
  showAlert,
  alertMessage,
  alertType,
  isLoadingDetail,
  isSaving,
  onSave,
  onBack,
  onCloseAlert,
}: InsuranceFormProps) {
  const isEdit = mode === 'edit';

  const breadcrumbs = [
    { label: 'Insurance', href: AppURL.masterdataInsurance },
    { label: isEdit ? 'Detail Insurance' : 'Add Insurance', isCurrentPage: true },
  ];

  return (
    <ContentLoadingWrapper isLoading={isSaving || isLoadingDetail}>
      <Box className="flex flex-col w-full">
        <Box as="form" onSubmit={handleSubmit(onSave)}>
          <PageHeader
            title={isEdit ? 'Detail Insurance' : 'Add Insurance'}
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
                  {alertType === 'success' ? (
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
                  {alertMessage}
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
            <Box className="p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-4 shadow-sm border border-slate-100 grid sm:grid-cols-2">
              <Box className="text-primary font-bold sm:col-span-2">Insurance Details</Box>

              <Box>
                <Box
                  as="label"
                  htmlFor="name"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  Insurance Name{' '}
                  <Box as="span" className="text-red-500">
                    *
                  </Box>
                </Box>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Insurance Name is required' }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="name"
                      size="lg"
                      placeholder="Insert Insurance Name"
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
                  htmlFor="logo_url"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  Logo
                </Box>
                <Controller
                  name="logo_url"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="logo_url"
                      size="lg"
                      placeholder="Insert Logo URL"
                      className={`bg-transparent ${
                        errors.logo_url ? 'border-red-500' : 'border-slate-300'
                      }`}
                      {...field}
                    />
                  )}
                />
                {errors.logo_url && (
                  <Box as="p" className="text-red-500 text-xs mt-1">
                    {errors.logo_url.message?.toString()}
                  </Box>
                )}
              </Box>

              <Box>
                <Box
                  as="label"
                  htmlFor="brand"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  Brand
                </Box>
                <Controller
                  name="brand"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="brand"
                      size="lg"
                      placeholder="Insert Brand"
                      className={`bg-transparent ${
                        errors.brand ? 'border-red-500' : 'border-slate-300'
                      }`}
                      {...field}
                    />
                  )}
                />
                {errors.brand && (
                  <Box as="p" className="text-red-500 text-xs mt-1">
                    {errors.brand.message?.toString()}
                  </Box>
                )}
              </Box>

              <Box>
                <Box
                  as="label"
                  htmlFor="country"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  Country
                </Box>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="country"
                      size="lg"
                      placeholder="Insert Country"
                      className={`bg-transparent ${
                        errors.country ? 'border-red-500' : 'border-slate-300'
                      }`}
                      {...field}
                    />
                  )}
                />
                {errors.country && (
                  <Box as="p" className="text-red-500 text-xs mt-1">
                    {errors.country.message?.toString()}
                  </Box>
                )}
              </Box>

              {watch('logo_url') && (
                <Box className="sm:col-span-2 mt-2">
                  <Box as="label" className="block text-sm font-medium text-slate-700 mb-2">
                    Logo Preview
                  </Box>
                  <Box className="border border-slate-200 bg-slate-50/50 rounded-xl p-6 inline-flex items-center justify-center min-w-[120px] min-h-[120px]">
                    <Box
                      as="img"
                      src={watch('logo_url')}
                      alt="Logo preview"
                      className="w-32 h-32 object-contain drop-shadow-sm"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        (e.target as HTMLImageElement).src = '/images/no-image.png';
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
