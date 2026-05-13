'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import GroupForm from '@/components/forms/group-form';
import { useGroupForm } from '@/hooks/useGroupForm.hooks';

export default function EditGroup() {
  const params = useParams();
  const groupId = typeof params.id === 'string' ? params.id : params.id?.[0] || '';

  const {
    handleSubmit,
    control,
    errors,
    watch,
    setValue,
    groupName,
    groupRoles,
    groupUsers,
    availableRoles,
    availableUsers,
    isLoadingDetail,
    isLoadingRoles,
    isLoadingUsers,
    isSaving,
    handleSave,
    loadGroupDetail,
    handleAddRole,
    handleDeleteRole,
    handleAddUser,
    handleDeleteUser,
    goBack,
  } = useGroupForm('edit');

  useEffect(() => {
    if (groupId) {
      loadGroupDetail(groupId);
    }
  }, [groupId, loadGroupDetail]);

  return (
    <GroupForm
      mode="edit"
      groupId={groupId}
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      watch={watch}
      setValue={setValue}
      groupName={groupName}
      groupRoles={groupRoles}
      groupUsers={groupUsers}
      availableRoles={availableRoles}
      availableUsers={availableUsers}
      isLoadingDetail={isLoadingDetail}
      isLoadingRoles={isLoadingRoles}
      isLoadingUsers={isLoadingUsers}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      loadGroupDetail={loadGroupDetail}
      onAddRole={handleAddRole}
      onDeleteRole={handleDeleteRole}
      onAddUser={handleAddUser}
      onDeleteUser={handleDeleteUser}
    />
  );
}
