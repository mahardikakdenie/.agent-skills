'use client';

import PageManagementForm from '@/components/forms/page-management-form';
import { usePageManagementForm } from '@/hooks/usePageManagementForm.hooks';

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
  } = usePageManagementForm('create');

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
