'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import { ChannelForm } from '@/components/forms/channel-form';
import { useChannelForm } from '@/hooks/useChannelForm.hooks';

export default function EditChannels() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : params.id?.[0] || '';

  const {
    handleSubmit,
    control,
    errors,
    isLoadingDetail,
    isSaving,
    handleSave,
    goBack,
    loadChannelDetail,
  } = useChannelForm('edit');

  useEffect(() => {
    if (id) {
      loadChannelDetail(id);
    }
  }, [id, loadChannelDetail]);

  return (
    <ChannelForm
      mode="edit"
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      isLoadingDetail={isLoadingDetail}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
    />
  );
}
