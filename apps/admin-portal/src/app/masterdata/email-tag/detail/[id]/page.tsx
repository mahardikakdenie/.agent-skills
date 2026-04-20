'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import { EmailTagForm } from '@/components/forms/email-tag-form';
import { useEmailTagForm } from '@/hooks/useEmailTagForm.hooks';

export default function EditEmailTag() {
  const params = useParams();
  const tagId = typeof params.id === 'string' ? params.id : params.id?.[0] || '';

  const {
    handleSubmit,
    control,
    errors,
    setValue,
    journeys,
    isLoadingDetail,
    isLoadingJourneys,
    isSaving,
    handleSave,
    loadTagDetail,
    goBack,
  } = useEmailTagForm('edit');

  useEffect(() => {
    if (tagId) {
      loadTagDetail(tagId);
    }
  }, [tagId, loadTagDetail]);

  return (
    <EmailTagForm
      mode="edit"
      tagId={tagId}
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      setValue={setValue}
      journeys={journeys}
      isLoadingDetail={isLoadingDetail}
      isLoadingJourneys={isLoadingJourneys}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
    />
  );
}
