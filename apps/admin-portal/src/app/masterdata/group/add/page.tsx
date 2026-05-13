'use client';

import GroupForm from '@/components/forms/group-form';
import { useGroupForm } from '@/hooks/useGroupForm.hooks';

export default function AddGroupPage() {
  const {
    handleSubmit,
    control,
    errors,
    watch,
    setValue,
    groupName,
    isSaving,
    handleSave,
    goBack,
  } = useGroupForm('create');

  return (
    <GroupForm
      mode="create"
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      watch={watch}
      setValue={setValue}
      groupName={groupName}
      groupRoles={[]}
      groupUsers={[]}
      availableRoles={[]}
      availableUsers={[]}
      isLoadingDetail={false}
      isLoadingRoles={false}
      isLoadingUsers={false}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      loadGroupDetail={() => {}}
      onAddRole={async () => {}}
      onDeleteRole={async () => {}}
      onAddUser={async () => {}}
      onDeleteUser={async () => {}}
    />
  );
}
