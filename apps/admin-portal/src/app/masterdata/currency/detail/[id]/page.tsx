"use client";

import { useEffect } from "react";
import { useCurrencyForm } from "@/hooks/useCurrencyForm.hooks";
import { CurrencyForm } from "@/components/forms/CurrencyForm";
import { useParams } from "next/navigation";

export default function EditCurrency() {
  const params = useParams();

  const {
    handleSubmit,
    control,
    errors,
    watch,
    insurances,
    typeCurrencies,
    currencyFields,
    selectedInsuranceId,
    showAlert,
    alertMessage,
    alertType,
    isLoadingInsurances,
    isLoadingTypeCurrencies,
    isLoadingCurrencies,
    isSaving,
    handleSave,
    handleAddCurrency,
    handleChangeRate,
    handleChangeCurrencyFrom,
    handleChangeCurrencyTo,
    handleDeleteCurrency,
    setShowAlert,
    goBack,
    loadCurrencyDetail,
  } = useCurrencyForm("edit");
  const idParam = params.id;

  const id =
    typeof idParam === "string"
      ? idParam
      : Array.isArray(idParam)
      ? idParam[0]
      : "";

  useEffect(() => {
    if (id && id !== selectedInsuranceId) {
      loadCurrencyDetail(id);
    }
  }, [loadCurrencyDetail, id, selectedInsuranceId]);

  return (
    <CurrencyForm
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      watch={watch}
      insurances={insurances}
      typeCurrencies={typeCurrencies}
      currencyFields={currencyFields}
      selectedInsuranceId={selectedInsuranceId}
      showAlert={showAlert}
      alertMessage={alertMessage}
      alertType={alertType}
      isEdit={true}
      isLoadingInsurances={isLoadingInsurances}
      isLoadingTypeCurrencies={isLoadingTypeCurrencies}
      isLoadingCurrencies={isLoadingCurrencies}
      isSaving={isSaving}
      onSave={handleSave}
      onAddCurrency={handleAddCurrency}
      onChangeRate={handleChangeRate}
      onChangeCurrencyFrom={handleChangeCurrencyFrom}
      onChangeCurrencyTo={handleChangeCurrencyTo}
      onDeleteCurrency={handleDeleteCurrency}
      onBack={goBack}
      onCloseAlert={() => setShowAlert(false)}
    />
  );
}
