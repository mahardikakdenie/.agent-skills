"use client";

import { useCurrencyForm } from "@/hooks/useCurrencyForm.hooks";
import { CurrencyForm } from "@/components/forms/currency-form";

export default function AddCurrency() {
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
    setValue,
  } = useCurrencyForm("create");

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
      mode="create"
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
      onInsuranceChange={(value) => setValue("insurance", value)}
    />
  );
}
