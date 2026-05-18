'use client';

import iconCopy from '@public/images/icon-copy.svg';

import { UserFormWrapper } from '@/components/forms/user-form';
import { useUserForm } from '@/hooks/useUserForm.hooks';

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
  } = useUserForm('create');

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
