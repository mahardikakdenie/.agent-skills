"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useSanctionForm } from "@/hooks/useSanctionForm.hooks";
import { SanctionForm } from "@/components/forms/SanctionForm";

export default function EditSanctionPage() {
  const params = useParams();
  const idParam = params.id;
  const id =
    typeof idParam === "string"
      ? idParam
      : Array.isArray(idParam)
      ? idParam[0]
      : "";

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
    isLoadingDetail,
    isSaving,
    handleSave,
    setShowAlert,
    goBack,
    loadSanctionDetail,
  } = useSanctionForm("edit");

  useEffect(() => {
    if (id) {
      loadSanctionDetail(id);
    }
  }, [id, loadSanctionDetail]);

  if (hasAccess === false) {
    return null;
  }

  return (
    <SanctionForm
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      sources={sources}
      countries={countries}
      showAlert={showAlert}
      errorMessage={errorMessage}
      isEdit={true}
      isLoadingSources={isLoadingSources}
      isLoadingCountries={isLoadingCountries}
      isLoadingDetail={isLoadingDetail}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      onCloseAlert={() => setShowAlert(false)}
    />
  );
}
