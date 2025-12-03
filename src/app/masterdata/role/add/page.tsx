"use client";

import { useRoleForm } from "@/hooks/useRoleForm.hooks";
import RoleForm from "@/components/forms/RoleForm";

export default function AddRolePage() {
  const {
    handleSubmit,
    control,
    errors,
    watch,
    setValue,
    roleName,
    roleDescription,
    permissionFields,
    permissionOptions,
    menus,
    isLoadingMenus,
    isSaving,
    handleSave,
    goBack,
    onAddPermission,
    onDeletePermission,
    onSaveRolePermission,
    onBulkEditPermission,
    onBulkDeleteRolePermission,
    onTickPermission,
    selectMenu,
    setPermissionFields,
  } = useRoleForm("create");

  return (
    <RoleForm
      mode="create"
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      watch={watch}
      setValue={setValue}
      roleName={roleName}
      roleDescription={roleDescription}
      permissionFields={permissionFields}
      permissionOptions={permissionOptions}
      menus={menus}
      isLoadingDetail={false}
      isLoadingMenus={isLoadingMenus}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      loadRoleDetail={() => {}}
      onAddPermission={onAddPermission}
      onDeletePermission={onDeletePermission}
      onSaveRolePermission={onSaveRolePermission}
      onBulkEditPermission={onBulkEditPermission}
      onBulkDeleteRolePermission={onBulkDeleteRolePermission}
      onTickPermission={onTickPermission}
      selectMenu={selectMenu}
      setPermissionFields={setPermissionFields}
    />
  );
}
