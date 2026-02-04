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
    loadRoleDetail,
    handleAddPermission,
    handleDeletePermission,
    handleSaveRolePermission,
    handleBulkEditPermission,
    handleBulkDeleteRolePermission,
    handleTickPermission,
    selectMenu,
    setPermissionFields,
    goBack,
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
      onAddPermission={handleAddPermission}
      onDeletePermission={handleDeletePermission}
      onSaveRolePermission={handleSaveRolePermission}
      onBulkEditPermission={handleBulkEditPermission}
      onBulkDeleteRolePermission={handleBulkDeleteRolePermission}
      onTickPermission={handleTickPermission}
      selectMenu={selectMenu}
      setPermissionFields={setPermissionFields}
    />
  );
}
