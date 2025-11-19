"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { usePartnerCommForm } from "@/hooks/usePartnerCommForm.hooks";
import { PartnerCommForm } from "@/components/forms/PartnerCommForm";

export default function EditPartnerCommPage() {
  const { id } = useParams();

  const {
    handleSubmit,
    control,
    errors,
    watch,
    setValue,

    channels,
    insurances,

    showAlert,
    errorMessage,

    isLoadingChannels,
    isLoadingInsurances,
    isLoadingDetail,
    isSaving,

    handleSave,
    setShowAlert,
    goBack,
    loadPartnerCommDetail,
  } = usePartnerCommForm("edit");

  useEffect(() => {
    if (id) {
      loadPartnerCommDetail(id as string);
    }
  }, [id, loadPartnerCommDetail]);

  return (
    <PartnerCommForm
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      watch={watch}
      setValue={setValue}
      channels={channels}
      insurances={insurances}
      showAlert={showAlert}
      errorMessage={errorMessage}
      isEdit={true}
      isLoadingChannels={isLoadingChannels}
      isLoadingInsurances={isLoadingInsurances}
      isLoadingDetail={isLoadingDetail}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      onCloseAlert={() => setShowAlert(false)}
    />
  );
}
