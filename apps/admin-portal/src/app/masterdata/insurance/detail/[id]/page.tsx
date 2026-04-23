'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import { InsuranceForm } from '@/components/forms/insurance-form';
import { useInsuranceForm } from '@/hooks/useInsuranceForm.hooks';

export default function EditInsuranceProduct() {
  const { id } = useParams();

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
    loadInsuranceDetail,
  } = useInsuranceForm('edit');

  useEffect(() => {
    if (id) {
      loadInsuranceDetail(id as string);
    }
  }, [id, loadInsuranceDetail]);

  return (
    <InsuranceForm
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      watch={watch}
      showAlert={showAlert}
      alertMessage={alertMessage}
      alertType={alertType}
      mode="edit"
      isLoadingDetail={isLoadingDetail}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      onCloseAlert={() => setShowAlert(false)}
    />
  );
}
