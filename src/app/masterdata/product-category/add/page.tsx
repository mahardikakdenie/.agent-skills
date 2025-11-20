"use client";

import { useProductCategoryForm } from "@/hooks/useProductCategoryForm.hooks";
import { ProductCategoryForm } from "@/components/forms/ProductCategoryForm";

export default function AddProductCategoryPage() {
  const {
    handleSubmit,
    control,
    errors,
    watch,
    showAlert,
    errorMessage,
    isLoadingDetail,
    isSaving,
    handleSave,
    setShowAlert,
    goBack,
  } = useProductCategoryForm("create");

  return (
    <ProductCategoryForm
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      watch={watch}
      showAlert={showAlert}
      errorMessage={errorMessage}
      isEdit={false}
      isLoadingDetail={isLoadingDetail}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      onCloseAlert={() => setShowAlert(false)}
    />
  );
}
