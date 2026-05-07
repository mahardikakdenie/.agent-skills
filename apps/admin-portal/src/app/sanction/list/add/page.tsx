"use client";
import React from "react";
import { useSanctionForm } from "@/hooks/useSanctionForm.hooks";
import { SanctionForm } from "@/components/forms/sanction-form";

export default function CreateSanctionPage() {
  const {
    handleSubmit,
    control,
    errors,
    sources,
    countries,
    hasAccess,
    showAlert,
    errorMessage,
    isLoadingSources,
    isLoadingCountries,
    isSaving,
    handleSave,
    setShowAlert,
    goBack,
  } = useSanctionForm("create");

  if (hasAccess === false) {
    return null;
  }

  return (
    <SanctionForm
      mode="create"
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      sources={sources}
      countries={countries}
      showAlert={showAlert}
      errorMessage={errorMessage}
      isLoadingSources={isLoadingSources}
      isLoadingCountries={isLoadingCountries}
      isLoadingDetail={false}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      onCloseAlert={() => setShowAlert(false)}
    />
  );
}
