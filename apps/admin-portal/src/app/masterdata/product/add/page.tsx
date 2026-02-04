"use client";

import { useProductForm } from "@/hooks/useProductForm.hooks";
import { ProductForm } from "@/components/forms/ProductForm";

export default function AddProduct() {
  const {
    handleSubmit,
    control,
    errors,
    watch,
    categories,
    insurances,
    productFields,
    selectedCategoryId,
    selectedInsuranceId,
    showAlert,
    alertMessage,
    alertType,
    isLoadingCategories,
    isLoadingInsurances,
    isLoadingProducts,
    isSaving,
    handleSave,
    handleAddProduct,
    handleChangeProduct,
    handleDeleteProduct,
    setShowAlert,
    goBack,
  } = useProductForm("create");

  return (
    <ProductForm
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      watch={watch}
      categories={categories}
      insurances={insurances}
      productFields={productFields}
      selectedCategoryId={selectedCategoryId}
      selectedInsuranceId={selectedInsuranceId}
      showAlert={showAlert}
      alertMessage={alertMessage}
      alertType={alertType}
      isEdit={false}
      isLoadingCategories={isLoadingCategories}
      isLoadingInsurances={isLoadingInsurances}
      isLoadingProducts={isLoadingProducts}
      isSaving={isSaving}
      onSave={handleSave}
      onAddProduct={handleAddProduct}
      onChangeProduct={handleChangeProduct}
      onDeleteProduct={handleDeleteProduct}
      onBack={goBack}
      onCloseAlert={() => setShowAlert(false)}
    />
  );
}
