'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import PageManagementForm from '@/components/forms/page-management-form';
import { usePageManagementForm } from '@/hooks/usePageManagementForm.hooks';

export default function EditPage() {
  const params = useParams();
  const pageId = typeof params.id === 'string' ? params.id : params.id?.[0] || '';

  const {
    handleSubmit,
    control,
    errors,
    pageName,
    permissionFields,
    isLoadingDetail,
    isSaving,
    handleSave,
    loadPageDetail,
    handleAddPermission,
    handleDeletePermission,
    handleChangePermission,
    goBack,
  } = usePageManagementForm('edit');

  useEffect(() => {
    if (pageId) {
      loadPageDetail(pageId);
    }
  }, [pageId, loadPageDetail]);

  return (
    <PageManagementForm
      mode="edit"
      pageId={pageId}
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      pageName={pageName}
      permissionFields={permissionFields}
      isLoadingDetail={isLoadingDetail}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      loadPageDetail={loadPageDetail}
      onAddPermission={handleAddPermission}
      onDeletePermission={handleDeletePermission}
      onChangePermission={handleChangePermission}
    />
  );
}
