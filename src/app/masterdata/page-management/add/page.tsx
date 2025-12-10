"use client";

import { usePageManagementForm } from "@/hooks/usePageManagementForm.hooks";
import PageManagementForm from "@/components/forms/PageManagementForm";

export default function AddPage() {
  const {
    handleSubmit,
    control,
    errors,
    pageName,
    permissionFields,
    isSaving,
    handleSave,
    goBack,
    handleAddPermission,
    handleDeletePermission,
    handleChangePermission,
  } = usePageManagementForm("create");

  return (
    <PageManagementForm
      mode="create"
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      pageName={pageName}
      permissionFields={permissionFields}
      isLoadingDetail={false}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      loadPageDetail={() => {}}
      onAddPermission={handleAddPermission}
      onDeletePermission={handleDeletePermission}
      onChangePermission={handleChangePermission}
    />
  );
}
