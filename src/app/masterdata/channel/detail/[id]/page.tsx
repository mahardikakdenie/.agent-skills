"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useChannelForm } from "@/hooks/useChannelForm.hooks";
import { ChannelForm } from "@/components/forms/ChannelForm";

export default function EditChannels() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0] || "";

  const {
    handleSubmit,
    control,
    errors,
    watch,
    showAlert,
    alertMessage,
    alertType,
    isLoadingDetail,
    isSaving,
    handleSave,
    setShowAlert,
    goBack,
    loadChannelDetail,
  } = useChannelForm("edit");

  useEffect(() => {
    if (id) {
      loadChannelDetail(id);
    }
  }, [id, loadChannelDetail]);

  return (
    <ChannelForm
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      watch={watch}
      showAlert={showAlert}
      alertMessage={alertMessage}
      alertType={alertType}
      isEdit={true}
      isLoadingDetail={isLoadingDetail}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      onCloseAlert={() => setShowAlert(false)}
    />
  );
}
