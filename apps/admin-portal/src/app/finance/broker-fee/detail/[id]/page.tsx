"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useBrokerFeeForm } from "@/hooks/useBrokerFeeForm.hooks";
import { BrokerFeeForm } from "@/components/forms/broker-fee-form";

export default function EditBrokerFeePage() {
  const { id } = useParams();

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
    isLoadingDetail,
    isSaving,

    handleSave,
    setShowAlert,
    goBack,
    loadBrokerFeeDetail,
  } = useBrokerFeeForm("edit");

  useEffect(() => {
    if (id) {
      loadBrokerFeeDetail(id as string);
    }
  }, [id, loadBrokerFeeDetail]);

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
