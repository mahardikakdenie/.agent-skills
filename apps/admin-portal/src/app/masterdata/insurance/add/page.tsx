'use client';

import { InsuranceForm } from '@/components/forms/insurance-form';
import { useInsuranceForm } from '@/hooks/useInsuranceForm.hooks';

export default function AddInsurance() {
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
  } = useInsuranceForm('create');

  return (
    <InsuranceForm
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      watch={watch}
      showAlert={showAlert}
      alertMessage={alertMessage}
      alertType={alertType}
      mode="create"
      isLoadingDetail={isLoadingDetail}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      onCloseAlert={() => setShowAlert(false)}
    />
  );
}
