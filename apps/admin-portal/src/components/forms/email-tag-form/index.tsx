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
} from '@repo/ui';

import { PageHeader } from '@/components/page-header';
import { ContentLoadingWrapper } from '@/components/ui/loading';
import AppURL from '@/constants/app-url.const';

interface EmailTagFormProps {
  mode: 'create' | 'edit';
  tagId?: string;

  handleSubmit: any;
  control: any;
  errors: any;
  setValue: any;

  journeys: any[];

  isLoadingDetail: boolean;
  isLoadingJourneys: boolean;
  isSaving: boolean;

  onSave: (formData: any) => void;
  onBack: () => void;
}

export function EmailTagForm({
  mode,
  tagId,
  handleSubmit,
  control,
  errors,
  setValue,
  journeys,
  isLoadingDetail,
  isLoadingJourneys,
  isSaving,
  onSave,
  onBack,
}: EmailTagFormProps) {
  const isEdit = mode === 'edit';
  const [isJourneyOpen, setIsJourneyOpen] = React.useState(false);

  const breadcrumbs = [
    { label: 'Email Tag', href: AppURL.masterdataEmailTag },
    { label: isEdit ? 'Update Email Tag' : 'Create Email Tag', isCurrentPage: true },
  ];

  return (
    <ContentLoadingWrapper isLoading={isSaving || isLoadingDetail}>
      <Box className="flex flex-col w-full">
        <Box as="form" onSubmit={handleSubmit(onSave)}>
          <PageHeader
            title={isEdit ? 'Update Email Tag' : 'Create Email Tag'}
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
                  htmlFor="journey"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  onClick={() => setIsJourneyOpen(true)}
                >
                  Journey{' '}
                  <Box as="span" className="text-red-500">
                    *
                  </Box>
                </Box>
                <Controller
                  name="journey"
                  control={control}
                  rules={{ required: 'Journey is required' }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      open={isJourneyOpen}
                      onOpen={() => setIsJourneyOpen(true)}
                      onClose={() => setIsJourneyOpen(false)}
                    >
                      <SelectTrigger
                        id="journey"
                        className="w-full h-12 border-slate-300 select-status bg-transparent hover:cursor-pointer py-2"
                      >
                        <SelectValue placeholder="Select Journey" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {isLoadingJourneys ? (
                            <Box className="px-2 py-1.5 text-sm text-gray-500">Loading...</Box>
                          ) : (
                            journeys.map((jour: any) => (
                              <SelectItem key={jour.id} value={jour.code}>
                                {jour.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.journey && (
                  <Box as="p" className="text-red-500 text-xs mt-1">
                    {errors.journey.message?.toString()}
                  </Box>
                )}
              </Box>

              <Box>
                <Box
                  as="label"
                  htmlFor="tag"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  Email Tag Name{' '}
                  <Box as="span" className="text-red-500">
                    *
                  </Box>
                </Box>
                <Controller
                  name="tag"
                  control={control}
                  rules={{ required: 'Email Tag Name is required' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="tag"
                      type="text"
                      placeholder="Insert Email Tag Name"
                      className={`h-12 border-slate-300 bg-transparent ${
                        errors.tag ? 'border-red-500' : ''
                      }`}
                    />
                  )}
                />
                {errors.tag && (
                  <Box as="p" className="text-red-500 text-xs mt-1">
                    {errors.tag.message?.toString()}
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
