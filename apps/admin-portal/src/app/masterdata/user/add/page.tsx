"use client";

import { useUserForm } from "@/hooks/useUserForm.hooks";
import { UserFormWrapper } from "@/components/forms/UserForm";
import iconCopy from "@public/images/icon-copy.svg";

export default function AddUser() {
  const {
    handleSubmit,
    control,
    errors,
    watch,
    setValue,
    channels,
    roleOptions,
    phoneCode,
    status,
    showPassword,
    isLoadingChannels,
    isSaving,
    setPhoneCode,
    setStatus,
    setShowPassword,
    handleSave,
    handleGeneratePassword,
    copyPassword,
    goBack,
    getStatusColor,
  } = useUserForm("create");

  return (
    <UserFormWrapper
      mode="create"
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      watch={watch}
      setValue={setValue}
      channels={channels}
      roleOptions={roleOptions}
      phoneCode={phoneCode}
      status={status}
      showPassword={showPassword}
      isLoading={isLoadingChannels || isSaving}
      setPhoneCode={setPhoneCode}
      setStatus={setStatus}
      setShowPassword={setShowPassword}
      onSave={handleSave}
      onGeneratePassword={handleGeneratePassword}
      onCopyPassword={copyPassword}
      onBack={goBack}
      getStatusColor={getStatusColor}
      iconCopy={iconCopy}
    />
  );
}

