'use client';

import { ChannelForm } from '@/components/forms/channel-form';
import { useChannelForm } from '@/hooks/useChannelForm.hooks';

export default function AddChannels() {
  const { handleSubmit, control, errors, isLoadingDetail, isSaving, handleSave, goBack } =
    useChannelForm('create');

  return (
    <ChannelForm
      mode="create"
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
