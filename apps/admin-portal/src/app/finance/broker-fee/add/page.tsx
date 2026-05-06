'use client';

import { BrokerFeeForm } from '@/components/forms/broker-fee-form';
import { useBrokerFeeForm } from '@/hooks/useBrokerFeeForm.hooks';

export default function CreateBrokerFeePage() {
  const {
    handleSubmit,
    control,
    errors,
    watch,

    insurances,
    products,
    plans,

    showAlert,
    errorMessage,

    isLoadingInsurances,
    isLoadingProducts,
    isLoadingPlans,
    isSaving,

    handleSave,
    setShowAlert,
    goBack,
  } = useBrokerFeeForm('create');

  return (
    <BrokerFeeForm
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      watch={watch}
      insurances={insurances}
      products={products}
      plans={plans}
      showAlert={showAlert}
      errorMessage={errorMessage}
      isEdit={false}
      isLoadingInsurances={isLoadingInsurances}
      isLoadingProducts={isLoadingProducts}
      isLoadingPlans={isLoadingPlans}
      isLoadingDetail={false}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      onCloseAlert={() => setShowAlert(false)}
    />
  );
}
