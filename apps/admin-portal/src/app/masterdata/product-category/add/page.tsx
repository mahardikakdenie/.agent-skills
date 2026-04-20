'use client';

import { ProductCategoryForm } from '@/components/forms/product-category-form';
import { useProductCategoryForm } from '@/hooks/useProductCategoryForm.hooks';

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
  } = useProductCategoryForm('create');

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
