'use client';

import React from 'react';

import { SourceForm } from '@/components/forms/source-form';
import { useSourceForm } from '@/hooks/useSourceForm.hooks';

export default function CreateSourcePage() {
  const {
    handleSubmit,
    control,
    errors,
    insurances,
    hasAccess,
    showAlert,
    errorMessage,
    sourceType,
    isLoadingInsurances,
    isSaving,
    handleSave,
    setShowAlert,
    goBack,
    handleSourceTypeChange,
  } = useSourceForm('create');

  if (hasAccess === false) {
    return null;
  }

  return (
    <SourceForm
      mode="create"
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      insurances={insurances}
      showAlert={showAlert}
      errorMessage={errorMessage}
      sourceType={sourceType}
      isLoadingInsurances={isLoadingInsurances}
      isLoadingDetail={false}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      onCloseAlert={() => setShowAlert(false)}
      onSourceTypeChange={handleSourceTypeChange}
    />
  );
}
