"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useProductCategoryForm } from "@/hooks/useProductCategoryForm.hooks";
import { ProductCategoryForm } from "@/components/forms/ProductCategoryForm";

export default function EditProductCategoryPage() {
  const { id } = useParams();

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
    loadCategoryDetail,
  } = useProductCategoryForm("edit");

  useEffect(() => {
    if (id) {
      loadCategoryDetail(id as string);
    }
  }, [id, loadCategoryDetail]);

  return (
    <ProductCategoryForm
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      watch={watch}
      showAlert={showAlert}
      errorMessage={errorMessage}
      isEdit={true}
      isLoadingDetail={isLoadingDetail}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      onCloseAlert={() => setShowAlert(false)}
    />
  );
}
