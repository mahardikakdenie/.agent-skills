'use client';

import iconCopy from '@public/images/icon-copy.svg';
import noData from '@public/images/no-data.webp';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

// ✅ Import useInsurance
import { UserFormWrapper } from '@/components/forms/user-form';
import { useAccountChannel } from '@/hooks/useAccountChannel.hooks';
import { useAccountInsurer } from '@/hooks/useAccountInsurer.hooks';
import { useInsurance } from '@/hooks/useIsurance.hooks';
import { useUserForm } from '@/hooks/useUserForm.hooks';

export default function EditUser() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : params.id?.[0] || '';

  const {
    handleSubmit,
    control,
    errors,
    watch,
    setValue,
    accountId,
    channels,
    roleOptions,
    userGroups,
    groupRoles,
    availableGroups,
    availableRoles,
    phoneCode,
    showPassword,
    isLoadingDetail,
    isLoadingChannels,
    isLoadingGroups,
    isLoadingRoles,
    isSaving,
    setPhoneCode,
    setStatus,
    setShowPassword,
    handleSave,
    handleGeneratePassword,
    copyPassword,
    goBack,
    loadUserDetail,
    handleAddGroup,
    handleDeleteGroup,
    handleAddRole,
    handleDeleteRole,
    getStatusColor,
  } = useUserForm('edit');

  const {
    accountChannels,
    isLoading: isLoadingAccountChannels,
    handleAddChannel,
    handleDeleteChannel,
    loadAccountChannels,
  } = useAccountChannel();

  const {
    accountInsurers,
    isLoading: isLoadingAccountInsurers,
    handleAddInsurer,
    handleDeleteInsurer,
    loadAccountInsurers,
  } = useAccountInsurer();

  const { insurances, isLoading: isLoadingInsurances, setRowsPerPage } = useInsurance();

  useEffect(() => {
    if (id) {
      loadUserDetail(id);
    }
  }, [id, loadUserDetail]);

  useEffect(() => {
    setRowsPerPage(1000);
  }, []);

  useEffect(() => {
    if (accountId) {
      loadAccountChannels(accountId);
      loadAccountInsurers(accountId);
    }
  }, [accountId, loadAccountChannels, loadAccountInsurers]);

  return (
    <UserFormWrapper
      mode="edit"
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      watch={watch}
      setValue={setValue}
      userId={id}
      accountId={accountId}
      channels={channels}
      roleOptions={roleOptions}
      userGroups={userGroups}
      groupRoles={groupRoles}
      availableGroups={availableGroups}
      availableRoles={availableRoles}
      accountChannels={accountChannels}
      accountInsurers={accountInsurers}
      insurers={insurances} // ✅ Pass insurances from hook
      phoneCode={phoneCode}
      showPassword={showPassword}
      isLoading={isLoadingDetail || isLoadingChannels || isSaving}
      isLoadingGroups={isLoadingGroups}
      isLoadingRoles={isLoadingRoles}
      isLoadingAccountChannels={isLoadingAccountChannels}
      isLoadingAccountInsurers={isLoadingAccountInsurers}
      isLoadingInsurances={isLoadingInsurances} // ✅ Add loading state
      setPhoneCode={setPhoneCode}
      setStatus={setStatus}
      setShowPassword={setShowPassword}
      onSave={handleSave}
      onGeneratePassword={handleGeneratePassword}
      onCopyPassword={copyPassword}
      onBack={goBack}
      getStatusColor={getStatusColor}
      iconCopy={iconCopy}
      onAddGroup={handleAddGroup}
      onDeleteGroup={handleDeleteGroup}
      onAddRole={handleAddRole}
      onDeleteRole={handleDeleteRole}
      onAddChannel={handleAddChannel}
      onDeleteChannel={handleDeleteChannel}
      onAddInsurer={handleAddInsurer}
      onDeleteInsurer={handleDeleteInsurer}
      noData={noData}
    />
  );
}
