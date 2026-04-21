'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import HolidayDateForm from '@/components/forms/holiday-date-form';
import { useHolidayDateForm } from '@/hooks/useHolidayDateForm.hooks';

export default function EditHolidayPage() {
  const params = useParams();
  const holidayId = typeof params.id === 'string' ? params.id : params.id?.[0] || '';

  const {
    handleSubmit,
    control,
    errors,
    setValue,
    watch,
    types,
    countries,
    isLoadingDetail,
    isSaving,
    handleSave,
    loadHolidayDetail,
    goBack,
  } = useHolidayDateForm('edit');

  useEffect(() => {
    if (holidayId) {
      loadHolidayDetail(holidayId);
    }
  }, [holidayId, loadHolidayDetail]);

  return (
    <HolidayDateForm
      mode="edit"
      holidayId={holidayId}
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      setValue={setValue}
      watch={watch}
      types={types}
      countries={countries}
      isLoadingDetail={isLoadingDetail}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
    />
  );
}
