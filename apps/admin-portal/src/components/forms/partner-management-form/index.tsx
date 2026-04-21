'use client';

import React from 'react';
import { Check, Eye, EyeOff, Save } from 'react-feather';
import { Controller } from 'react-hook-form';

import {
  Box,
  Button,
  Combobox,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';

import { PageHeader } from '@/components/page-header';
import { ContentLoadingWrapper } from '@/components/ui/loading';
import AppURL from '@/constants/app-url.const';

interface PartnerManagementFormProps {
  mode: 'create' | 'edit';
  partnerId?: string;

  handleSubmit: any;
  control: any;
  errors: any;
  setValue: any;

  partnerName: string;
  partnerEmail: string;
  channels: any[];

  isLoadingDetail: boolean;
  isLoadingChannels: boolean;
  isSaving: boolean;

  onSave: (formData: any) => void;
  onBack: () => void;
  generateApiKey: () => void;
  children?: React.ReactNode;
}

const PHONE_CODES = [
  { code: '+62', country: 'Indonesia' },
  { code: '+65', country: 'Singapore' },
  { code: '+60', country: 'Malaysia' },
  { code: '+63', country: 'Philippines' },
  { code: '+66', country: 'Thailand' },
  { code: '+84', country: 'Vietnam' },
];

export default function PartnerManagementForm({
  mode,
  handleSubmit,
  control,
  errors,
  channels,
  isLoadingDetail,
  isLoadingChannels,
  isSaving,
  onSave,
  onBack,
  generateApiKey,
  children,
}: PartnerManagementFormProps) {
  const isEdit = mode === 'edit';
  const [showApiKey, setShowApiKey] = React.useState(false);

  const breadcrumbs = [
    { label: 'Masterdata', href: AppURL.masterdata },
    { label: 'Partner Management', href: AppURL.masterdataPartnerManagement },
    { label: isEdit ? 'Edit' : 'Add', isCurrentPage: true },
  ];

  const channelOptions = channels.map((channel: any) => ({
    label: channel.name.replace(/-/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase()),
    value: channel.id.toString(),
  }));

  return (
    <ContentLoadingWrapper isLoading={isSaving || isLoadingDetail}>
      <Box className="flex flex-col w-full">
        <Box as="form" onSubmit={handleSubmit(onSave)}>
          <PageHeader
            title={isEdit ? 'Edit Partner' : 'Add Partner'}
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
                  htmlFor="name"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  Name{' '}
                  <Box as="span" className="text-red-500">
                    *
                  </Box>
                </Box>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Name is required' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      size="lg"
                      placeholder="Insert Name"
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
                  defaultValue=""
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address',
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      id="email"
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
                  defaultValue=""
                  rules={{
                    required: 'Phone Number is required',
                    pattern: {
                      value: /^[0-9]{6,12}$/,
                      message: 'Please enter a valid phone number (6-12 digits)',
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="phone_number"
                      size="lg"
                      placeholder="Insert Phone Number"
                      className={`bg-transparent ${
                        errors.phone_number ? 'border-red-500' : 'border-slate-300'
                      }`}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        field.onChange(value);
                      }}
                      leftIcon={
                        <Controller
                          name="phone_code"
                          control={control}
                          defaultValue="+62"
                          rules={{ required: 'Phone code is required' }}
                          render={({ field: codeField }) => (
                            <Select
                              value={codeField.value}
                              onValueChange={codeField.onChange}
                              size="lg"
                            >
                              <SelectTrigger className="w-[140px] border-y-0 border-l-0 border-r rounded-r-none bg-transparent hover:cursor-pointer shadow-none focus:ring-0">
                                <SelectValue placeholder="Code" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {PHONE_CODES.map((item) => (
                                    <SelectItem key={item.code} value={item.code}>
                                      {item.code} {item.country}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      }
                    />
                  )}
                />
                {(errors.phone_number || errors.phone_code) && (
                  <Box as="p" className="text-red-500 text-xs mt-1">
                    {errors.phone_code?.message?.toString() ||
                      errors.phone_number?.message?.toString()}
                  </Box>
                )}
              </Box>

              <Box>
                <Box
                  as="label"
                  htmlFor="api_key"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  API Key{' '}
                  <Box as="span" className="text-red-500">
                    *
                  </Box>
                </Box>
                <Box className="relative">
                  <Controller
                    name="api_key"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'API Key is required' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="api_key"
                        size="lg"
                        readOnly
                        type={showApiKey ? 'text' : 'password'}
                        placeholder="Generated API Key"
                        className={`bg-transparent pr-24 ${
                          errors.api_key ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                    )}
                  />
                  <Box className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      variant="ghost"
                      className="h-9 w-9 p-0"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      type="button"
                      onClick={generateApiKey}
                      className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] h-9 px-3 text-xs font-semibold rounded-md"
                    >
                      Generate
                    </Button>
                  </Box>
                </Box>
                {errors.api_key && (
                  <Box as="p" className="text-red-500 text-xs mt-1">
                    {errors.api_key.message?.toString()}
                  </Box>
                )}
              </Box>

              <Box>
                <Box
                  as="label"
                  htmlFor="channel"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  Channel{' '}
                  <Box as="span" className="text-red-500">
                    *
                  </Box>
                </Box>
                <Controller
                  name="channel"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Channel is required' }}
                  render={({ field }) => (
                    <Combobox
                      id="channel"
                      size="lg"
                      value={field.value?.toString() || ''}
                      onValueChange={field.onChange}
                      options={channelOptions}
                      placeholder={isLoadingChannels ? 'Loading channels...' : 'Select Channel'}
                      disabled={isEdit || isLoadingChannels}
                      className={`bg-transparent ${
                        errors.channel ? 'border-destructive' : 'border-slate-300'
                      }`}
                    />
                  )}
                />
                {errors.channel && (
                  <Box as="p" className="text-red-500 text-xs mt-1">
                    {errors.channel.message?.toString()}
                  </Box>
                )}
              </Box>
            </Box>
            {children}
          </Box>
        </Box>
      </Box>
    </ContentLoadingWrapper>
  );
}
