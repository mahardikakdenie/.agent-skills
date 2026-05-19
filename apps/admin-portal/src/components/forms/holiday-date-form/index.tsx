'use client';

import React from 'react';
import { Check, Save } from 'react-feather';
import { Controller } from 'react-hook-form';

import {
  Input,
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Box,
  DatePicker,
} from '@repo/ui';

import { PageHeader } from '@/components/core/page-header';
import { ContentLoadingWrapper } from '@/components/core/loading';
import AppURL from '@/constants/app-url.const';

interface HolidayDateFormProps {
  mode: 'create' | 'edit';
  holidayId?: string;

  // Form props
  handleSubmit: any;
  control: any;
  errors: any;
  setValue: any;
  watch: any;

  // Data
  types: Array<{ name: string; code: string }>;
  countries: Array<{ name: string; code: string }>;

  // Loading states
  isLoadingDetail: boolean;
  isSaving: boolean;

  // Handlers
  onSave: (formData: any) => void;
  onBack: () => void;
}

export default function HolidayDateForm({
  mode,
  holidayId,
  handleSubmit,
  control,
  errors,
  setValue,
  watch,
  types,
  countries,
  isLoadingDetail,
  isSaving,
  onSave,
  onBack,
}: HolidayDateFormProps) {
  const isEdit = mode === 'edit';
  const watchStartdate = watch('startdate');

  const [isCountryOpen, setIsCountryOpen] = React.useState(false);
  const [isTypeOpen, setIsTypeOpen] = React.useState(false);

  const breadcrumbs = [
    { label: 'Holiday Date', href: AppURL.masterdataHolidayDate },
    { label: isEdit ? 'Update Holiday' : 'Create Holiday Date', isCurrentPage: true },
  ];

  return (
    <ContentLoadingWrapper isLoading={isSaving || isLoadingDetail}>
      <Box className="flex flex-col w-full">
        <Box as="form" onSubmit={handleSubmit(onSave)}>
          <PageHeader
            title={isEdit ? 'Update Holiday' : 'Create Holiday Date'}
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
            <Box className="p-4 sm:p-6 bg-white rounded-lg grid sm:grid-cols-2 gap-x-6 gap-y-4 shadow-sm border border-slate-100">
              <Box>
                <Box
                  as="label"
                  htmlFor="country"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  onClick={() => setIsCountryOpen(true)}
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
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      open={isCountryOpen}
                      onOpen={() => setIsCountryOpen(true)}
                      onClose={() => setIsCountryOpen(false)}
                    >
                      <SelectTrigger
                        id="country"
                        className="w-full h-12 border-slate-300 select-status bg-transparent hover:cursor-pointer py-2"
                      >
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {countries.map((item: any) => (
                            <SelectItem key={item.code} value={item.code}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.country && (
                  <Box as="p" className="text-red-500 text-xs mt-1">
                    {errors.country.message?.toString()}
                  </Box>
                )}
              </Box>

              <Box />

              <Box>
                <Box
                  as="label"
                  htmlFor="type"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  onClick={() => setIsTypeOpen(true)}
                >
                  Holiday Type{' '}
                  <Box as="span" className="text-red-500">
                    *
                  </Box>
                </Box>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: 'Holiday Type is required' }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      open={isTypeOpen}
                      onOpen={() => setIsTypeOpen(true)}
                      onClose={() => setIsTypeOpen(false)}
                    >
                      <SelectTrigger
                        id="type"
                        className="w-full h-12 border-slate-300 select-status bg-transparent hover:cursor-pointer py-2"
                      >
                        <SelectValue placeholder="Select Holiday Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {types.map((item: any) => (
                            <SelectItem key={item.code} value={item.code}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && (
                  <Box as="p" className="text-red-500 text-xs mt-1">
                    {errors.type.message?.toString()}
                  </Box>
                )}
              </Box>

              <Box>
                <Box
                  as="label"
                  htmlFor="name"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  Holiday Name{' '}
                  <Box as="span" className="text-red-500">
                    *
                  </Box>
                </Box>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Holiday Name is required' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      type="text"
                      placeholder="Insert holiday name"
                      className={`h-12 border-slate-300 bg-transparent ${
                        errors.name ? 'border-red-500' : ''
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

              {isEdit ? (
                <Box>
                  <Box
                    as="label"
                    htmlFor="date"
                    className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  >
                    Date{' '}
                    <Box as="span" className="text-red-500">
                      *
                    </Box>
                  </Box>
                  <Controller
                    name="date"
                    control={control}
                    rules={{ required: 'Date is required' }}
                    render={({ field }) => (
                      <DatePicker
                        id="date"
                        value={field.value ? new Date(field.value) : null}
                        onChange={(date) =>
                          field.onChange(date ? date.toISOString().split('T')[0] : '')
                        }
                        placeholder="Insert date"
                        classNames={{
                          control: `h-12 border-slate-300 ${errors.date ? 'border-red-500' : ''}`,
                        }}
                      />
                    )}
                  />
                  {errors.date && (
                    <Box as="p" className="text-red-500 text-xs mt-1">
                      {errors.date.message?.toString()}
                    </Box>
                  )}
                </Box>
              ) : (
                <>
                  <Box>
                    <Box
                      as="label"
                      htmlFor="startdate"
                      className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                    >
                      Start Date{' '}
                      <Box as="span" className="text-red-500">
                        *
                      </Box>
                    </Box>
                    <Controller
                      name="startdate"
                      control={control}
                      rules={{ required: 'Start date is required' }}
                      render={({ field }) => (
                        <DatePicker
                          id="startdate"
                          value={field.value ? new Date(field.value) : null}
                          onChange={(date) =>
                            field.onChange(date ? date.toISOString().split('T')[0] : '')
                          }
                          placeholder="Insert start date"
                          classNames={{
                            control: `h-12 border-slate-300 ${errors.startdate ? 'border-red-500' : ''}`,
                          }}
                        />
                      )}
                    />
                    {errors.startdate && (
                      <Box as="p" className="text-red-500 text-xs mt-1">
                        {errors.startdate.message?.toString()}
                      </Box>
                    )}
                  </Box>

                  <Box>
                    <Box
                      as="label"
                      htmlFor="enddate"
                      className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                    >
                      End Date{' '}
                      <Box as="span" className="text-red-500">
                        *
                      </Box>
                    </Box>
                    <Controller
                      name="enddate"
                      control={control}
                      rules={{ required: 'End date is required' }}
                      render={({ field }) => (
                        <DatePicker
                          id="enddate"
                          value={field.value ? new Date(field.value) : null}
                          onChange={(date) =>
                            field.onChange(date ? date.toISOString().split('T')[0] : '')
                          }
                          minDate={watchStartdate ? new Date(watchStartdate) : undefined}
                          placeholder="Insert end date"
                          classNames={{
                            control: `h-12 border-slate-300 ${errors.enddate ? 'border-red-500' : ''}`,
                          }}
                        />
                      )}
                    />
                    {errors.enddate && (
                      <Box as="p" className="text-red-500 text-xs mt-1">
                        {errors.enddate.message?.toString()}
                      </Box>
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </ContentLoadingWrapper>
  );
}
