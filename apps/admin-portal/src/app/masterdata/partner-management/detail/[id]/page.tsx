'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Box } from '@repo/ui';

import PartnerManagementForm from '@/components/forms/partner-management-form';
import { usePartnerManagementForm } from '@/hooks/usePartnerManagementForm.hooks';

import AssignPlan from './assign-plan';

export default function EditPartner() {
  const params = useParams();
  const partnerId = typeof params.id === 'string' ? params.id : params.id?.[0] || '';

  const {
    handleSubmit,
    control,
    errors,
    setValue,
    watch,
    partnerName,
    partnerEmail,
    channels,
    isLoadingDetail,
    isLoadingChannels,
    isSaving,
    handleSave,
    loadPartnerDetail,
    generateApiKey,
    goBack,
  } = usePartnerManagementForm('edit');

  const [channelName, setChannelName] = useState('');
  const channelId = watch('channel');

  useEffect(() => {
    if (partnerId) {
      loadPartnerDetail(partnerId);
    }
  }, [partnerId, loadPartnerDetail]);

  useEffect(() => {
    if (channelId && channels.length > 0) {
      const channel = channels.find((c: any) => c.id.toString() === channelId.toString());
      setChannelName(channel?.name || '');
    }
  }, [channelId, channels]);

  return (
    <PartnerManagementForm
      mode="edit"
      partnerId={partnerId}
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      setValue={setValue}
      partnerName={partnerName}
      partnerEmail={partnerEmail}
      channels={channels}
      isLoadingDetail={isLoadingDetail}
      isLoadingChannels={isLoadingChannels}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      generateApiKey={generateApiKey}
    >
      {partnerId && channelId && (
        <Box className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-slate-100">
          <Box as="h2" className="text-xl font-bold mb-4">
            Assign Plans
          </Box>
          <AssignPlan id={channelId} channelName={channelName} />
        </Box>
      )}
    </PartnerManagementForm>
  );
}
