import React from 'react';
import { Check, Save } from 'react-feather';
import { Controller } from 'react-hook-form';

import { Input, Button, Box, Combobox } from '@repo/ui';

import { PageHeader } from '@/components/core/page-header';
import { ContentLoadingWrapper } from '@/components/core/loading';
import AppURL from '@/constants/app-url.const';

interface BrokerFeeFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  watch: any;

  insurances: any[];
  products: any[];
  plans: any[];

  showAlert: boolean;
  errorMessage: string;
  isEdit: boolean;

  isLoadingInsurances: boolean;
  isLoadingProducts: boolean;
  isLoadingPlans: boolean;
  isLoadingDetail: boolean;
  isSaving: boolean;

  onSave: (formData: any) => void;
  onBack: () => void;
  onCloseAlert: () => void;
}

const ErrorModal = ({
  isOpen,
  message,
  onClose,
}: {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <Box className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Box className="bg-white p-6 rounded shadow-md w-1/3">
        <Box as="h2" className="text-lg font-semibold mb-4">Alert</Box>
        <Box as="p">{message}</Box>
        <Box className="flex justify-end mt-4">
          <Box as="button" onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded">
            Close
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export function BrokerFeeForm({
  handleSubmit,
  control,
  errors,
  watch,
  insurances,
  products,
  plans,
  showAlert,
  errorMessage,
  isEdit,
  isLoadingInsurances,
  isLoadingProducts,
  isLoadingPlans,
  isLoadingDetail,
  isSaving,
  onSave,
  onBack,
  onCloseAlert,
}: BrokerFeeFormProps) {
  const watchProduct = watch('product');

  const breadcrumbs = [
    { label: 'Broker Fee', href: AppURL.financeBrokerFee },
    {
      label: isEdit ? 'Update Broker Fee' : 'Create Broker Fee',
      isCurrentPage: true,
    },
  ];

  const insuranceOptions = React.useMemo(
    () =>
      insurances.map((insurance) => ({
        label: insurance.name,
        value: insurance.id,
      })),
    [insurances],
  );

  const productOptions = React.useMemo(
    () =>
      products.map((product) => ({
        label: product.name,
        value: product.id,
      })),
    [products],
  );

  const planOptions = React.useMemo(
    () =>
      plans?.map((plan) => ({
        label: plan.name.split('|').splice(0, 2).join(' - '),
        value: plan.id,
      })),
    [plans],
  );

  return (
    <ContentLoadingWrapper
      isLoading={isSaving || isLoadingInsurances || isLoadingProducts || isLoadingDetail}
    >
      <Box className="flex flex-col w-full">
        <Box as="form" onSubmit={handleSubmit(onSave)}>
          <PageHeader
            title={isEdit ? 'Update Broker Fee' : 'Create Broker Fee'}
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
            <ErrorModal isOpen={showAlert} message={errorMessage} onClose={onCloseAlert} />
          )}

          <Box className="flex flex-col w-full p-4 md:p-6 gap-6">
            <Box className="p-4 sm:p-6 bg-white rounded-lg grid sm:grid-cols-2 gap-x-6 gap-y-4 shadow-sm border border-slate-100">
              <Box>
                <Box
                  as="label"
                  htmlFor="insurance"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  Insurance Name{' '}
                  <Box as="span" className="text-red-500">
                    *
                  </Box>
                </Box>
                <Controller
                  name="insurance"
                  control={control}
                  rules={{ required: 'Insurance Name is required' }}
                  render={({ field }) => (
                    <Combobox
                      id="insurance"
                      options={insuranceOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select Insurance"
                      error={!!errors.insurance}
                      className="w-full"
                      size="lg"
                    />
                  )}
                />
                {errors.insurance && (
                  <Box as="p" className="text-red-500 text-xs mt-1">
                    {errors.insurance.message?.toString()}
                  </Box>
                )}
              </Box>

              <Box>
                <Box
                  as="label"
                  htmlFor="product"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  Product Name
                </Box>
                <Controller
                  name="product"
                  control={control}
                  render={({ field }) => (
                    <Combobox
                      id="product"
                      options={productOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select Product"
                      error={!!errors.product}
                      className="w-full"
                      size="lg"
                    />
                  )}
                />
                {errors.product && (
                  <Box as="p" className="text-red-500 text-xs mt-1">
                    {errors.product.message?.toString()}
                  </Box>
                )}
              </Box>

              <Box>
                <Box
                  as="label"
                  htmlFor="plan"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  Plan Name
                </Box>
                <Controller
                  name="plan"
                  control={control}
                  render={({ field }) => (
                    <Combobox
                      id="plan"
                      options={planOptions || []}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!watchProduct}
                      placeholder="Select Plan"
                      error={!!errors.plan}
                      className="w-full"
                      size="lg"
                    />
                  )}
                />
                {errors.plan && (
                  <Box as="p" className="text-red-500 text-xs mt-1">
                    {errors.plan.message?.toString()}
                  </Box>
                )}
              </Box>

              <Box>
                <Box
                  as="label"
                  htmlFor="fee"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  Fee{' '}
                  <Box as="span" className="text-red-500">
                    *
                  </Box>
                </Box>
                <Controller
                  name="fee"
                  control={control}
                  rules={{ required: 'Fee is required' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="fee"
                      type="number"
                      size="lg"
                      placeholder="Insert Fee"
                      className={`w-full h-12 bg-transparent ${
                        errors.fee ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                  )}
                />
                {errors.fee && (
                  <Box as="p" className="text-red-500 text-xs mt-1">
                    {errors.fee.message?.toString()}
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
