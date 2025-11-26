"use client";

import { useChannelForm } from "@/hooks/useChannelForm.hooks";
import { ChannelForm } from "@/components/forms/ChannelForm";

export default function AddChannels() {
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
  } = useChannelForm("create");

  return (
    <ChannelForm
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      watch={watch}
      showAlert={showAlert}
      alertMessage={alertMessage}
      alertType={alertType}
      isEdit={false}
      isLoadingDetail={isLoadingDetail}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      onCloseAlert={() => setShowAlert(false)}
    />
  );
}
