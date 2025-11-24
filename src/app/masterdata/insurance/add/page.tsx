"use client";

import { useInsuranceForm } from "@/hooks/useInsuranceForm.hooks";
import { InsuranceForm } from "@/components/forms/InsuranceForm";

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
  } = useInsuranceForm("create");

  return (
    <InsuranceForm
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
