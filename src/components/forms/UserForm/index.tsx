import React, { useState } from "react";
import { Check, ChevronLeft } from "react-feather";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContentLoadingWrapper } from "@/components/ui/Loading/index";

import { UserForm } from "./components/user-form";
import { UserGroups } from "./components/user-groups";
import { UserRoles } from "./components/user-roles";
import { UserChannels } from "./components/user-channels";
import { UserInsurers } from "./components/user-insurers";
import { ChannelModal } from "./components/add-channel-modal";
import { InsurerModal } from "./components/add-insurer-modal";

interface UserFormWrapperProps {
  mode: "create" | "edit";

  handleSubmit: any;
  control: any;
  errors: any;
  watch: any;
  setValue: any;

  userId?: string;
  accountId?: string;

  channels: any[];
  roleOptions: any[];

  userGroups?: any[];
  groupRoles?: any[];
  availableGroups?: any[];
  availableRoles?: any[];

  accountChannels?: any[];
  accountInsurers?: any[];
  insurers?: any[];

  phoneCode: string;
  status: string;
  showPassword: boolean;

  isLoading: boolean;
  isLoadingGroups?: boolean;
  isLoadingRoles?: boolean;
  isLoadingAccountChannels?: boolean;
  isLoadingAccountInsurers?: boolean;
  isLoadingInsurances?: boolean;

  setPhoneCode: (code: string) => void;
  setStatus: (status: string) => void;
  setShowPassword: (show: boolean) => void;
  onSave: (formData: any) => void;
  onGeneratePassword: () => void;
  onCopyPassword: () => void;
  onBack: () => void;
  getStatusColor: (status: string) => string;

  iconCopy: any;

  onAddGroup?: (groupIds: string[]) => Promise<void>;
  onDeleteGroup?: (groupId: string) => Promise<void>;
  onAddRole?: (roleIds: string[]) => Promise<void>;
  onDeleteRole?: (roleId: string) => Promise<void>;

  onAddChannel?: (accountId: string, channelId: string) => Promise<void>;
  onDeleteChannel?: (accountId: string, channelId: string) => Promise<void>;
  onAddInsurer?: (accountId: string, insurerId: string) => Promise<void>;
  onDeleteInsurer?: (accountId: string, insurerId: string) => Promise<void>;

  setRole?: (role: string) => void;
  setChannel?: (channel: string) => void;
  noData?: any;
}

export function UserFormWrapper({
  mode,
  handleSubmit,
  control,
  errors,
  watch,
  setValue,
  userId,
  accountId,
  channels,
  roleOptions,
  userGroups = [],
  groupRoles = [],
  availableGroups = [],
  availableRoles = [],
  accountChannels = [],
  accountInsurers = [],
  insurers = [],
  phoneCode,
  status,
  showPassword,
  isLoading,
  isLoadingGroups = false,
  isLoadingRoles = false,
  isLoadingAccountChannels = false,
  isLoadingAccountInsurers = false,
  setPhoneCode,
  setStatus,
  setShowPassword,
  onSave,
  onGeneratePassword,
  onCopyPassword,
  onBack,
  getStatusColor,
  iconCopy,
  onAddGroup,
  onDeleteGroup,
  onAddRole,
  onDeleteRole,
  onAddChannel,
  onDeleteChannel,
  onAddInsurer,
  onDeleteInsurer,
  setRole = () => {},
  setChannel = () => {},
  noData,
}: UserFormWrapperProps) {
  const isEdit = mode === "edit";

  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [isInsurerModalOpen, setIsInsurerModalOpen] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedInsurers, setSelectedInsurers] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenUser, setIsModalOpenUser] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string[]>([]);
  const [selectRole, setSelectRole] = useState<string[]>([]);

  const [channelToDelete, setChannelToDelete] = useState<string | null>(null);
  const [insurerToDelete, setInsurerToDelete] = useState<string | null>(null);

  const [groupFilter, setGroupFilter] = useState("");
  const [pageGroups, setPageGroups] = useState(1);
  const [rowsPerPageGroup, setRowsPerPageGroup] = useState(10);

  const [roleFilter, setRoleFilter] = useState("");
  const [pageRoles, setPageRoles] = useState(1);
  const [rowsPerPageRole, setRowsPerPageRole] = useState(10);

  const handleAddSelectedChannels = async () => {
    if (selectedChannels.length === 0 || !accountId || !onAddChannel) return;
    await onAddChannel(accountId, selectedChannels[0]);
    setSelectedChannels([]);
    setIsChannelModalOpen(false);
  };

  const confirmDeleteChannel = () => {
    if (channelToDelete && accountId && onDeleteChannel) {
      onDeleteChannel(accountId, channelToDelete);
      setChannelToDelete(null);
    }
  };

  const handleAddSelectedInsurers = async () => {
    if (selectedInsurers.length === 0 || !accountId || !onAddInsurer) return;
    await onAddInsurer(accountId, selectedInsurers[0]);
    setSelectedInsurers([]);
    setIsInsurerModalOpen(false);
  };

  const confirmDeleteInsurer = () => {
    if (insurerToDelete && accountId && onDeleteInsurer) {
      onDeleteInsurer(accountId, insurerToDelete);
      setInsurerToDelete(null);
    }
  };

  const handleAddSelectedGroups = async (groupIds: string[]) => {
    if (onAddGroup) {
      await onAddGroup(groupIds);
      setIsModalOpen(false);
      setSelectedGroup([]);
    }
  };

  const handleAddSelectedRole = async (roleIds: string[]) => {
    if (onAddRole) {
      await onAddRole(roleIds);
      setIsModalOpenUser(false);
      setSelectRole([]);
    }
  };

  const channelsMapById = channels.reduce(
    (prev, value) => ({ ...prev, [value.id]: value }),
    {}
  );

  const insurersMapById = insurers.reduce(
    (prev, value) => ({ ...prev, [value.id]: value }),
    {}
  );

  const handleSelectAllGroups = () => {
    if (selectedGroup.length === availableGroups.length) {
      setSelectedGroup([]);
    } else {
      setSelectedGroup(availableGroups.map((g: any) => g.id));
    }
  };

  const handleCheckboxChangeGroup = (groupId: string) => {
    setSelectedGroup((prev) => {
      if (prev.includes(groupId)) {
        return prev.filter((id) => id !== groupId);
      } else {
        return [...prev, groupId];
      }
    });
  };

  const isGroupSelected = (groupId: string) => {
    return selectedGroup.includes(groupId);
  };

  const handleFilterGroup = (filter: string) => {
    setGroupFilter(filter);
    setPageGroups(1);
  };

  const filteredGroups = availableGroups.filter((group: any) =>
    group.name.toLowerCase().includes(groupFilter.toLowerCase())
  );

  const paginatedGroups = filteredGroups.slice(
    (pageGroups - 1) * rowsPerPageGroup,
    pageGroups * rowsPerPageGroup
  );

  const totalPagesGroups = Math.ceil(filteredGroups.length / rowsPerPageGroup);

  const handleSelectAllRoles = () => {
    const filteredRoles = availableRoles.filter((role: any) =>
      role.name.toLowerCase().includes(roleFilter.toLowerCase())
    );

    if (
      selectRole.length === filteredRoles.length &&
      filteredRoles.length > 0
    ) {
      setSelectRole([]);
    } else {
      setSelectRole(filteredRoles.map((r: any) => r.id));
    }
  };

  const handleCheckboxChangeRole = (roleId: string) => {
    setSelectRole((prev) => {
      if (prev.includes(roleId)) {
        return prev.filter((id) => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  const isRoleSelected = (roleId: string) => {
    return selectRole.includes(roleId);
  };

  const handleSearchRole = (filter: string) => {
    setRoleFilter(filter);
    setPageRoles(1);
  };

  const filteredRoles = availableRoles.filter((role: any) =>
    role.name.toLowerCase().includes(roleFilter.toLowerCase())
  );

  const paginatedRoles = filteredRoles.slice(
    (pageRoles - 1) * rowsPerPageRole,
    pageRoles * rowsPerPageRole
  );

  const totalPagesRoles = Math.ceil(filteredRoles.length / rowsPerPageRole);

  const handleAddSelectedRoleWrapper = async () => {
    if (onAddRole && selectRole.length > 0) {
      await onAddRole(selectRole);
      setIsModalOpenUser(false);
      setSelectRole([]);
      setRoleFilter("");
      setPageRoles(1);
    }
  };

  return (
    <ContentLoadingWrapper isLoading={isLoading}>
      <div className="flex flex-col w-full">
        <div className="bg-white md:px-6 p-4 flex items-center">
          <div>
            <Breadcrumb className="sm:block hidden">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink>Masterdata</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="cursor-pointer" onClick={onBack}>
                    User
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{isEdit ? "Detail" : "Add"}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
              {isEdit ? "Detail User" : "Add User"}
            </h2>
          </div>

          <div className="flex ml-auto">
            <div
              onClick={onBack}
              className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </div>
            <Button
              type="submit"
              form="user-form"
              className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-5 rounded-full px-5"
            >
              <Check className="mr-2 w-4 h-4" />
              Save
            </Button>
          </div>
        </div>

        <div className="flex flex-col w-full p-4 md:p-6 gap-4">
          <UserForm
            control={control}
            handleSubmit={handleSubmit}
            onSubmit={onSave}
            errors={errors}
            watch={watch}
            roles={roleOptions}
            channels={channels}
            phoneCode={phoneCode}
            status={status}
            getStatusColor={getStatusColor}
            handleChangeStatus={setStatus}
            setPhoneCode={setPhoneCode}
            setRole={setRole}
            setChannel={setChannel}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            setPassword={(password) => setValue("password", password)}
            iconCopy={iconCopy}
            copyPassword={onCopyPassword}
            handleGeneratePassword={onGeneratePassword}
          />

          {isEdit && (
            <>
              {onAddGroup && onDeleteGroup && (
                <UserGroups
                  userGroup={userGroups}
                  selectedUserGroups={selectedGroup}
                  handleSelectGroup={setSelectedGroup}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  group={paginatedGroups}
                  groupFilter={groupFilter}
                  setGroupFilter={setGroupFilter}
                  handleFilterGroup={handleFilterGroup}
                  isAllSelected={
                    selectedGroup.length === filteredGroups.length &&
                    filteredGroups.length > 0
                  }
                  handleSelectAllChange={handleSelectAllGroups}
                  handleCheckboxChange={handleCheckboxChangeGroup}
                  isGroupSelected={isGroupSelected}
                  rowsPerPageGroup={rowsPerPageGroup}
                  handleRowsPerPageChangeGroup={(e) => {
                    setRowsPerPageGroup(Number(e.target.value));
                    setPageGroups(1);
                  }}
                  totalItemsRoles={filteredGroups.length}
                  setPageRoles={setPageGroups}
                  page={pageGroups}
                  totalPages={totalPagesGroups}
                  noData={noData}
                  handleAddSelectedGroups={() =>
                    handleAddSelectedGroups(selectedGroup)
                  }
                  handleDeleteSelectedGroup={onDeleteGroup}
                  id={userId || ""}
                />
              )}

              {onAddRole && onDeleteRole && (
                <UserRoles
                  groupRole={groupRoles}
                  isModalOpenUser={isModalOpenUser}
                  setIsModalOpenUser={setIsModalOpenUser}
                  handleSelectRole={setSelectRole}
                  userFilter={roleFilter}
                  handleSearch={handleSearchRole}
                  isAllSelectedRole={
                    selectRole.length === filteredRoles.length &&
                    filteredRoles.length > 0
                  }
                  handleSelectAllChangeRole={handleSelectAllRoles}
                  dataRole={paginatedRoles}
                  handleCheckboxChangeRole={handleCheckboxChangeRole}
                  isUserSelected={isRoleSelected}
                  noData={noData}
                  rowsPerPage={rowsPerPageRole}
                  handleRowsPerPageChange={(e) => {
                    setRowsPerPageRole(Number(e.target.value));
                    setPageRoles(1);
                  }}
                  totalItemsUser={filteredRoles.length}
                  setPage={setPageRoles}
                  page={pageRoles}
                  selectRole={setPageRoles}
                  totalPages={totalPagesRoles}
                  handleAddSelectedRole={handleAddSelectedRoleWrapper}
                  handleDeleteSelectedRole={onDeleteRole}
                  id={userId || ""}
                />
              )}

              {onDeleteChannel && (
                <UserChannels
                  accountChannels={accountChannels}
                  channels={channels}
                  channelsMapById={channelsMapById}
                  setIsChannelModalOpen={setIsChannelModalOpen}
                  handleDeleteChannel={(channelId) =>
                    setChannelToDelete(channelId)
                  }
                />
              )}

              {onDeleteInsurer && (
                <UserInsurers
                  accountInsurers={accountInsurers}
                  insurers={insurers}
                  insurersMapById={insurersMapById}
                  setIsInsurerModalOpen={setIsInsurerModalOpen}
                  handleDeleteInsurer={(insurerId) =>
                    setInsurerToDelete(insurerId)
                  }
                />
              )}
            </>
          )}
        </div>

        {isEdit && onAddChannel && (
          <ChannelModal
            isChannelModalOpen={isChannelModalOpen}
            setIsChannelModalOpen={setIsChannelModalOpen}
            accountChannels={channels}
            selectedChannels={selectedChannels}
            setSelectedChannels={setSelectedChannels}
            channelsLoading={isLoadingAccountChannels}
            handleAddSelectedChannels={handleAddSelectedChannels}
          />
        )}

        {isEdit && onAddInsurer && (
          <InsurerModal
            isInsurerModalOpen={isInsurerModalOpen}
            setIsInsurerModalOpen={setIsInsurerModalOpen}
            accountInsurers={accountInsurers}
            selectedInsurers={selectedInsurers}
            setSelectedInsurers={setSelectedInsurers}
            insurersLoading={isLoadingAccountInsurers}
            handleAddSelectedInsurers={handleAddSelectedInsurers}
            insurers={insurers}
          />
        )}

        {isEdit && (
          <Dialog
            open={!!channelToDelete}
            onOpenChange={(open) => !open && setChannelToDelete(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Channel</DialogTitle>
              </DialogHeader>
              <div className="py-3">
                Are you sure you want to delete this channel?
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setChannelToDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={confirmDeleteChannel}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {isEdit && (
          <Dialog
            open={!!insurerToDelete}
            onOpenChange={(open) => !open && setInsurerToDelete(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Insurer</DialogTitle>
              </DialogHeader>
              <div className="py-3">
                Are you sure you want to delete this insurer?
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setInsurerToDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={confirmDeleteInsurer}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </ContentLoadingWrapper>
  );
}
