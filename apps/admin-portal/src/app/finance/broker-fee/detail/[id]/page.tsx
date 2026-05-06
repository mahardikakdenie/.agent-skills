'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import { BrokerFeeForm } from '@/components/forms/broker-fee-form';
import { useBrokerFeeForm } from '@/hooks/useBrokerFeeForm.hooks';

export default function EditBrokerFeePage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : params.id?.[0] || '';

  const {
    handleSubmit,
    control,
    errors,
    watch,

    insurances,
    products,
    plans,

    hasAccess,
    showAlert,
    errorMessage,

    isLoadingInsurances,
    isLoadingProducts,
    isLoadingPlans,
    isLoadingDetail,
    isSaving,

    handleSave,
    setShowAlert,
    goBack,
    loadBrokerFeeDetail,
  } = useBrokerFeeForm('edit');

  useEffect(() => {
    if (id) {
      loadBrokerFeeDetail(id);
    }
  }, [id, loadBrokerFeeDetail]);

  if (hasAccess === false) {
    return null;
  }

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
      isEdit={true}
      isLoadingInsurances={isLoadingInsurances}
      isLoadingProducts={isLoadingProducts}
      isLoadingPlans={isLoadingPlans}
      isLoadingDetail={isLoadingDetail}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      onCloseAlert={() => setShowAlert(false)}
    />
  );
}
