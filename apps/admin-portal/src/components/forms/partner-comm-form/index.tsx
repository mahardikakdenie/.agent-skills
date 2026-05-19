import React from 'react';
import { Check, Save } from 'react-feather';
import { Controller } from 'react-hook-form';

import { Input, Button, Box, Combobox } from '@repo/ui';

import { PageHeader } from '@/components/core/page-header';
import { ContentLoadingWrapper } from '@/components/core/loading';
import AppURL from '@/constants/app-url.const';

interface PartnerCommFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  watch: any;
  setValue: any;

  channels: any[];
  insurances: any[];

  showAlert: boolean;
  errorMessage: string;
  isEdit: boolean;

  isLoadingChannels: boolean;
  isLoadingInsurances: boolean;
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
        <Box as="h2" className="text-lg font-semibold mb-4">
          Alert
        </Box>
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

export function PartnerCommForm({
  handleSubmit,
  control,
  errors,
  watch,
  setValue,
  channels,
  insurances,
  showAlert,
  errorMessage,
  isEdit,
  isLoadingChannels,
  isLoadingInsurances,
  isLoadingDetail,
  isSaving,
  onSave,
  onBack,
  onCloseAlert,
}: PartnerCommFormProps) {
  const watchChannel = watch('channel');

  const breadcrumbs = [
    { label: 'Partner Comm', href: AppURL.financePartnerComm },
    {
      label: isEdit ? 'Update Partner Comm' : 'Create Partner Comm',
      isCurrentPage: true,
    },
  ];

  const channelOptions = React.useMemo(
    () =>
      channels.map((channel: any) => ({
        label: channel.name,
        value: channel.id,
      })),
    [channels],
  );

  const insuranceOptions = React.useMemo(() => {
    const options = insurances.map((insurance: any) => ({
      label: insurance.name,
      value: insurance.id,
    }));
    return [{ label: 'All', value: 'All' }, ...options];
  }, [insurances]);

  return (
    <ContentLoadingWrapper
      isLoading={isSaving || isLoadingChannels || isLoadingInsurances || isLoadingDetail}
    >
      <Box className="flex flex-col w-full">
        <Box as="form" onSubmit={handleSubmit(onSave)}>
          <PageHeader
            title={isEdit ? 'Update Partner Comm' : 'Create Partner Comm'}
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
                  htmlFor="channel"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  Channel Name{' '}
                  <Box as="span" className="text-red-500">
                    *
                  </Box>
                </Box>
                <Controller
                  name="channel"
                  control={control}
                  rules={{ required: 'Channel Name is required' }}
                  render={({ field }) => (
                    <Combobox
                      id="channel"
                      options={channelOptions}
                      value={field.value}
                      onValueChange={(val) => {
                        setValue('insurance', 'All');
                        field.onChange(val);
                      }}
                      placeholder="Select Channel"
                      error={!!errors.channel}
                      className="w-full"
                      size="lg"
                    />
                  )}
                />
                {errors.channel && (
                  <Box as="p" className="text-red-500 text-xs mt-1">
                    {errors.channel.message?.toString()}
                  </Box>
                )}
              </Box>

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
                      disabled={!watchChannel}
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
