"use client";

import { useGroupForm } from "@/hooks/useGroupForm.hooks";
import GroupForm from "@/components/forms/GroupForm";

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
  } = useGroupForm("create");

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
