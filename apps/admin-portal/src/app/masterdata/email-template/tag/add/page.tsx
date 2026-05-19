'use client';

import React from 'react';
import { Save } from 'react-feather';
import { Controller } from 'react-hook-form';

import { Box, Button, Combobox, Input } from '@repo/ui';

import { PageHeader } from '@/components/core/page-header';
import { ContentLoadingWrapper } from '@/components/core/loading';
import AppURL from '@/constants/app-url.const';
import { useEmailTagForm } from '@/hooks/useEmailTagForm.hooks';

export default function AddEmailTagPage() {
  const {
    handleSubmit,
    control,
    errors,
    journeys,
    isLoadingJourneys,
    isSaving,
    handleSave,
    goBack,
  } = useEmailTagForm('create');

  const breadcrumbs = [
    { label: 'Email Tags', href: AppURL.masterdataEmailTemplateTag },
    { label: 'Add', isCurrentPage: true },
  ];

  const journeyOptions = journeys.map((jour: any) => ({
    label: jour.name,
    value: jour.code,
  }));

  return (
    <ContentLoadingWrapper isLoading={isSaving}>
      <Box className="flex flex-col w-full">
        <Box as="form" onSubmit={handleSubmit(handleSave)}>
          <PageHeader
            title="Add Email Tag"
            breadcrumbs={breadcrumbs}
            showBackButton={true}
            onBackClick={goBack}
          >
            <Button
              type="submit"
              disabled={isSaving}
              className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
              leftIcon={isSaving ? undefined : <Save className="w-5 h-5" />}
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
                    <Combobox
                      id="journey"
                      value={field.value}
                      onValueChange={field.onChange}
                      options={journeyOptions}
                      size="lg"
                      placeholder={isLoadingJourneys ? 'Loading...' : 'Select Journey'}
                      disabled={isLoadingJourneys}
                      className={`bg-transparent ${
                        errors.journey ? 'border-destructive' : 'border-slate-300'
                      }`}
                    />
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
                      size="lg"
                      placeholder="Insert Email Tag Name"
                      className={`bg-transparent ${
                        errors.tag ? 'border-red-500' : 'border-slate-300'
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
