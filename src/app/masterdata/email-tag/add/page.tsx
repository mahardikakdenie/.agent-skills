"use client";

import { useEmailTagForm } from "@/hooks/useEmailTagForm.hooks";
import EmailTagForm from "@/components/forms/EmailTagForm";

export default function AddEmailTag() {
  const {
    handleSubmit,
    control,
    errors,
    setValue,
    journeys,
    isLoadingJourneys,
    isSaving,
    handleSave,
    goBack,
  } = useEmailTagForm("create");

  return (
    <EmailTagForm
      mode="create"
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      setValue={setValue}
      journeys={journeys}
      isLoadingDetail={false}
      isLoadingJourneys={isLoadingJourneys}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
    />
  );
}
