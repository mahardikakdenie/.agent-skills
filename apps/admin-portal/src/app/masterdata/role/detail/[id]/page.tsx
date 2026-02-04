"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useRoleForm } from "@/hooks/useRoleForm.hooks";
import RoleForm from "@/components/forms/RoleForm";

export default function EditRolePage() {
  const params = useParams();
  const roleId =
    typeof params.id === "string" ? params.id : params.id?.[0] || "";

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
    isLoadingDetail,
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
  } = useRoleForm("edit");

  useEffect(() => {
    if (roleId) {
      loadRoleDetail(roleId);
    }
  }, [roleId, loadRoleDetail]);

  return (
    <RoleForm
      mode="edit"
      roleId={roleId}
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
      isLoadingDetail={isLoadingDetail}
      isLoadingMenus={isLoadingMenus}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      loadRoleDetail={loadRoleDetail}
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
