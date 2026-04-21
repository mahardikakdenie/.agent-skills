'use client';

import PartnerManagementForm from '@/components/forms/partner-management-form';
import { usePartnerManagementForm } from '@/hooks/usePartnerManagementForm.hooks';

export default function AddPartner() {
  const {
    handleSubmit,
    control,
    errors,
    setValue,
    partnerName,
    partnerEmail,
    channels,
    isLoadingChannels,
    isSaving,
    handleSave,
    generateApiKey,
    goBack,
  } = usePartnerManagementForm('create');

  return (
    <PartnerManagementForm
      mode="create"
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      setValue={setValue}
      partnerName={partnerName}
      partnerEmail={partnerEmail}
      channels={channels}
      isLoadingDetail={false}
      isLoadingChannels={isLoadingChannels}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      generateApiKey={generateApiKey}
    />
  );
}
