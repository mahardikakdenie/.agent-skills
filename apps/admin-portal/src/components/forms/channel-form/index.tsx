'use client';

import React from 'react';
import { Check, Save } from 'react-feather';
import { Controller } from 'react-hook-form';

import {
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Box,
} from '@repo/ui';

import { PageHeader } from '@/components/page-header';
import { ContentLoadingWrapper } from '@/components/ui/loading';
import AppURL from '@/constants/app-url.const';

interface ChannelFormProps {
  mode: 'create' | 'edit';
  handleSubmit: any;
  control: any;
  errors: any;

  isLoadingDetail: boolean;
  isSaving: boolean;

  onSave: (formData: any) => void;
  onBack: () => void;
}

export function ChannelForm({
  mode,
  handleSubmit,
  control,
  errors,
  isLoadingDetail,
  isSaving,
  onSave,
  onBack,
}: ChannelFormProps) {
  const isEdit = mode === 'edit';

  const breadcrumbs = [
    { label: 'Channels', href: AppURL.masterdataChannel },
    { label: isEdit ? 'Update Channel' : 'Create Channel', isCurrentPage: true },
  ];

  return (
    <ContentLoadingWrapper isLoading={isSaving || isLoadingDetail}>
      <Box className="flex flex-col w-full">
        <Box as="form" onSubmit={handleSubmit(onSave)}>
          <PageHeader
            title={isEdit ? 'Update Channel' : 'Create Channel'}
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
                  Channel Name{' '}
                  <Box as="span" className="text-red-500">
                    *
                  </Box>
                </Box>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Channel Name is required' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      type="text"
                      size="lg"
                      placeholder="Insert Channel Name"
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
                  htmlFor="type"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  Type{' '}
                  <Box as="span" className="text-red-500">
                    *
                  </Box>
                </Box>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: 'Type is required' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="type"
                        className={`w-full h-12 bg-transparent hover:cursor-pointer py-2 ${
                          errors.type ? 'border-red-500' : 'border-slate-300'
                        }`}
                      >
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Internal">Internal</SelectItem>
                        <SelectItem value="External">External</SelectItem>
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
            </Box>
          </Box>
        </Box>
      </Box>
    </ContentLoadingWrapper>
  );
}
