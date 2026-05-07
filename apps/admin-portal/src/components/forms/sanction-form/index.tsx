'use client';

import { format } from 'date-fns';
import React from 'react';
import { Check, Save, AlertCircle } from 'react-feather';
import { Controller } from 'react-hook-form';

import {
  Input,
  Button,
  Combobox,
  DatePicker,
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

interface Source {
  id: string;
  source_name: string;
  source_type: string;
  source_url: string;
  insurance_id: string;
}

interface CountryAPI {
  id: string;
  name: string;
}

interface SanctionFormProps {
  mode: 'create' | 'edit';
  handleSubmit: any;
  control: any;
  errors: any;

  sources: Source[];
  countries: CountryAPI[];

  showAlert: boolean;
  errorMessage: string;

  isLoadingSources: boolean;
  isLoadingCountries: boolean;
  isLoadingDetail: boolean;
  isSaving: boolean;

  onSave: (formData: any) => void;
  onBack: () => void;
  onCloseAlert: () => void;
}

export function SanctionForm({
  mode,
  handleSubmit,
  control,
  errors,
  sources,
  countries,
  showAlert,
  errorMessage,
  isLoadingSources,
  isLoadingCountries,
  isLoadingDetail,
  isSaving,
  onSave,
  onBack,
  onCloseAlert,
}: SanctionFormProps) {
  const isEdit = mode === 'edit';

  const breadcrumbs = [
    { label: 'Sanction List', href: AppURL.sanctionList },
    { label: isEdit ? 'Edit Sanction' : 'Add New Sanction', isCurrentPage: true },
  ];

  const isSuccess = errorMessage.includes('Successfully');

  return (
    <ContentLoadingWrapper
      isLoading={isSaving || isLoadingSources || isLoadingCountries || isLoadingDetail}
      loadingText={isEdit && isLoadingDetail ? 'Loading sanction details...' : 'Saving sanction...'}
    >
      <Box className="flex flex-col w-full">
        <Box as="form" onSubmit={handleSubmit(onSave)}>
          <PageHeader
            title={isEdit ? 'Edit Sanction' : 'Add New Sanction'}
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
              <Box className="text-[#016DA1] font-bold text-lg mb-2">Identity Details</Box>

              <Box className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                <Box>
                  <Box
                    as="label"
                    htmlFor="first_name"
                    className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  >
                    First Name{' '}
                    <Box as="span" className="text-red-500">
                      *
                    </Box>
                  </Box>
                  <Controller
                    name="first_name"
                    control={control}
                    rules={{ required: 'First name is required' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="first_name"
                        type="text"
                        size="lg"
                        placeholder="Insert First Name"
                        className={`bg-transparent ${
                          errors.first_name ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                    )}
                  />
                  {errors.first_name && (
                    <Box as="p" className="text-red-500 text-xs mt-1">
                      {errors.first_name.message?.toString()}
                    </Box>
                  )}
                </Box>

                <Box>
                  <Box
                    as="label"
                    htmlFor="middle_name"
                    className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  >
                    Middle Name
                    {isEdit && (
                      <Box as="span" className="text-red-500">
                        {' '}
                        *
                      </Box>
                    )}
                  </Box>
                  <Controller
                    name="middle_name"
                    control={control}
                    rules={isEdit ? { required: 'Middle name is required' } : {}}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="middle_name"
                        type="text"
                        size="lg"
                        placeholder="Insert Middle Name"
                        className={`bg-transparent ${
                          errors.middle_name ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                    )}
                  />
                  {errors.middle_name && (
                    <Box as="p" className="text-red-500 text-xs mt-1">
                      {errors.middle_name.message?.toString()}
                    </Box>
                  )}
                </Box>

                <Box>
                  <Box
                    as="label"
                    htmlFor="last_name"
                    className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  >
                    Last Name
                    {isEdit && (
                      <Box as="span" className="text-red-500">
                        {' '}
                        *
                      </Box>
                    )}
                  </Box>
                  <Controller
                    name="last_name"
                    control={control}
                    rules={isEdit ? { required: 'Last name is required' } : {}}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="last_name"
                        type="text"
                        size="lg"
                        placeholder="Insert Last Name"
                        className={`bg-transparent ${
                          errors.last_name ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                    )}
                  />
                  {errors.last_name && (
                    <Box as="p" className="text-red-500 text-xs mt-1">
                      {errors.last_name.message?.toString()}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            <Box className="p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-4 shadow-sm border border-slate-100">
              <Box className="text-[#016DA1] font-bold text-lg mb-2">Personal Data</Box>

              <Box className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                {isEdit && (
                  <Box>
                    <Box
                      as="label"
                      htmlFor="country"
                      className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                    >
                      Country{' '}
                      <Box as="span" className="text-red-500">
                        *
                      </Box>
                    </Box>
                    <Controller
                      name="country"
                      control={control}
                      rules={{ required: 'Country is required' }}
                      render={({ field }) => (
                        <Combobox
                          id="country"
                          size="lg"
                          options={countries.map((item) => ({
                            label: item.name,
                            value: item.id,
                          }))}
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isLoadingCountries}
                          placeholder={isLoadingCountries ? 'Loading...' : 'Select a Country'}
                          searchPlaceholder="Search country..."
                          triggerClassName={`bg-transparent ${
                            errors.country ? 'border-red-500' : 'border-slate-300'
                          }`}
                        />
                      )}
                    />
                    {errors.country && (
                      <Box as="p" className="text-red-500 text-xs mt-1">
                        {errors.country.message?.toString()}
                      </Box>
                    )}
                  </Box>
                )}

                <Box>
                  <Box
                    as="label"
                    htmlFor="id_number"
                    className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  >
                    ID Number{' '}
                    <Box as="span" className="text-red-500">
                      *
                    </Box>
                  </Box>
                  <Controller
                    name="id_number"
                    control={control}
                    rules={{ required: 'ID number is required' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="id_number"
                        type="text"
                        size="lg"
                        placeholder="Insert ID Number"
                        className={`bg-transparent ${
                          errors.id_number ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                    )}
                  />
                  {errors.id_number && (
                    <Box as="p" className="text-red-500 text-xs mt-1">
                      {errors.id_number.message?.toString()}
                    </Box>
                  )}
                </Box>

                <Box>
                  <Box
                    as="label"
                    htmlFor="phone_number"
                    className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  >
                    Phone Number{' '}
                    <Box as="span" className="text-red-500">
                      *
                    </Box>
                  </Box>
                  <Controller
                    name="phone_number"
                    control={control}
                    rules={{ required: 'Phone number is required' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="phone_number"
                        type="tel"
                        size="lg"
                        placeholder="Insert Phone Number"
                        className={`bg-transparent ${
                          errors.phone_number ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                    )}
                  />
                  {errors.phone_number && (
                    <Box as="p" className="text-red-500 text-xs mt-1">
                      {errors.phone_number.message?.toString()}
                    </Box>
                  )}
                </Box>

                <Box>
                  <Box
                    as="label"
                    htmlFor="email"
                    className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  >
                    Email{' '}
                    <Box as="span" className="text-red-500">
                      *
                    </Box>
                  </Box>
                  <Controller
                    name="email"
                    control={control}
                    rules={{ required: 'Email is required' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        size="lg"
                        placeholder="Insert Email"
                        className={`bg-transparent ${
                          errors.email ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                    )}
                  />
                  {errors.email && (
                    <Box as="p" className="text-red-500 text-xs mt-1">
                      {errors.email.message?.toString()}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            <Box className="p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-4 shadow-sm border border-slate-100">
              <Box className="text-[#016DA1] font-bold text-lg mb-2">Source</Box>

              <Box className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                <Box>
                  <Box
                    as="label"
                    htmlFor="source_id"
                    className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  >
                    Source Name{' '}
                    <Box as="span" className="text-red-500">
                      *
                    </Box>
                  </Box>
                  <Controller
                    name="source_id"
                    control={control}
                    rules={{ required: 'Source is required' }}
                    render={({ field }) => (
                      <Combobox
                        id="source_id"
                        size="lg"
                        options={sources.map((item) => ({
                          label: item.source_name,
                          value: item.id,
                        }))}
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoadingSources}
                        placeholder={isLoadingSources ? 'Loading...' : 'Select Source'}
                        searchPlaceholder="Search source..."
                        triggerClassName={`bg-transparent ${
                          errors.source_id ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                    )}
                  />
                  {errors.source_id && (
                    <Box as="p" className="text-red-500 text-xs mt-1">
                      {errors.source_id.message?.toString()}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            <Box className="p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-4 shadow-sm border border-slate-100">
              <Box className="text-[#016DA1] font-bold text-lg mb-2">Details</Box>

              <Box className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                <Box>
                  <Box
                    as="label"
                    htmlFor="date_blacklisted"
                    className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  >
                    Blacklist Date{' '}
                    <Box as="span" className="text-red-500">
                      *
                    </Box>
                  </Box>
                  <Controller
                    name="date_blacklisted"
                    control={control}
                    rules={{ required: 'Blacklisted Date is required' }}
                    render={({ field }) => (
                      <DatePicker
                        id="date_blacklisted"
                        size="lg"
                        placeholder="Select Blacklist Date"
                        iconPosition="end"
                        value={field.value ? new Date(field.value) : null}
                        onChange={(date) => {
                          field.onChange(date ? format(date, 'yyyy-MM-dd') : '');
                        }}
                        error={errors.date_blacklisted?.message?.toString()}
                        className="w-full"
                        classNames={{
                          control: 'bg-transparent border-slate-300',
                        }}
                      />
                    )}
                  />
                </Box>

                <Box>
                  <Box
                    as="label"
                    htmlFor="blacklist_reason"
                    className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  >
                    Blacklist Reason{' '}
                    <Box as="span" className="text-red-500">
                      *
                    </Box>
                  </Box>
                  <Controller
                    name="blacklist_reason"
                    control={control}
                    rules={{ required: 'Blacklist Reason is required' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="blacklist_reason"
                        type="text"
                        size="lg"
                        placeholder="Insert blacklist reason"
                        className={`bg-transparent ${
                          errors.blacklist_reason ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                    )}
                  />
                  {errors.blacklist_reason && (
                    <Box as="p" className="text-red-500 text-xs mt-1">
                      {errors.blacklist_reason.message?.toString()}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ContentLoadingWrapper>
  );
}
