"use client";
import React, { useEffect } from "react";
import { useSourceForm } from "@/hooks/useSourceForm.hooks";
import { SourceForm } from "@/components/forms/SourceForm";
import { useParams } from "next/navigation";

export default function DetailSourcePage() {
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
    insurances,
    hasAccess,
    showAlert,
    errorMessage,
    sourceType,
    isLoadingInsurances,
    isSaving,
    isLoadingDetail,
    handleSave,
    setShowAlert,
    goBack,
    handleSourceTypeChange,
    loadSourceDetail,
  } = useSourceForm("edit");

  useEffect(() => {
    if (id) {
      loadSourceDetail(id);
    }
  }, [id, loadSourceDetail]);

  if (hasAccess === false) {
    return null;
  }

  return (
    <SourceForm
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      insurances={insurances}
      showAlert={showAlert}
      errorMessage={errorMessage}
      isEdit
      sourceType={sourceType}
      isLoadingInsurances={isLoadingInsurances}
      isLoadingDetail={isLoadingDetail}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      onCloseAlert={() => setShowAlert(false)}
      onSourceTypeChange={handleSourceTypeChange}
    />
  );
}
