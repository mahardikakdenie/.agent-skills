'use client';

import { PartnerCommForm } from '@/components/forms/partner-comm-form';
import { usePartnerCommForm } from '@/hooks/usePartnerCommForm.hooks';

export default function CreatePartnerCommPage() {
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
    isSaving,

    handleSave,
    setShowAlert,
    goBack,
  } = usePartnerCommForm('create');

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
      isEdit={false}
      isLoadingChannels={isLoadingChannels}
      isLoadingInsurances={isLoadingInsurances}
      isLoadingDetail={false}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      onCloseAlert={() => setShowAlert(false)}
    />
  );
}
