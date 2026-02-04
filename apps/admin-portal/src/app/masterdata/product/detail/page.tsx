"use client";

import { useEffect } from "react";
import { useProductForm } from "@/hooks/useProductForm.hooks";
import { ProductForm } from "@/components/forms/ProductForm";

export default function EditProduct() {
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
    loadProductDetail,
  } = useProductForm("edit");

  useEffect(() => {
    const searchParam = new URLSearchParams(window.location.search);
    const insuranceId = searchParam.get("insurance-id") ?? "";
    const categoryId = searchParam.get("category-id") ?? "";

    if (categoryId && insuranceId) {
      loadProductDetail(categoryId, insuranceId);
    }
  }, [loadProductDetail]);

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
      isEdit={true}
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
