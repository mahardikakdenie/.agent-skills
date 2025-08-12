"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import WithSidebar from "@/hoc/with-sidebar";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import {
  Check,
  ChevronLeft,
  Eye,
  EyeOff,
} from "react-feather";
import { Controller, ErrorOption, FieldArray, FieldArrayPath, FieldError, FieldErrors, FieldName, FieldValues, FormState, InternalFieldName, ReadFormState, RegisterOptions, SubmitErrorHandler, SubmitHandler, useForm, UseFormRegisterReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useUser } from "../hooks";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import noData from "/public/images/no-data.webp";
import {
  AccountGroup,
  GroupResponse,
  GroupService,
} from "@/services/masterdata/group.service";
import iconCopy from "/public/images/icon-copy.svg";
import { toastNotification } from "@/lib/toast";
import { useAccountChannel } from "../../account-channel/hooks";
import { useAccountInsurer } from "../../account-insurer/hooks";
import toast from "react-hot-toast";
import { useLoading } from "@/context/loading.context";
import { ChannelModal } from "./components/add-channel-modal";
import { InsurerModal } from "./components/add-insurer-modal";
import { passwordValidationRules, validatePassword } from "./utils/password";
import { UserGroups } from "./components/user-groups";
import { UserRoles } from "./components/user-roles";
import { UserChannels } from "./components/user-channels";
import { UserInsurers } from "./components/user-insurers";
import { UserForm } from "./components/user-form";
import { useInsurance } from "../../insurance/hooks";
import { USER } from "@/constants/routes";
import { primaryRoles } from "@/app/protected/masterdata/user/user.const";


const EditUser = ({ params }: { params: { id: string; }; }) => {
  const [channelToDelete, setChannelToDelete] = useState<string | null>(null);
  const [insurerToDelete, setInsurerToDelete] = useState<string | null>(null);
  const router = useRouter();
  const { id } = params;
  const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null);
  const groupService = new GroupService();
  const {
    addAccountChannel,
    removeAccountChannel,
    getAccountChannels,
    accountChannels,
    loading: channelsLoading
  } = useAccountChannel();

  const {
    addAccountInsurer,
    removeAccountInsurer,
    getAccountInsurers,
    accountInsurers,
    loading: insurersLoading,
  } = useAccountInsurer();

  const { fetchInsurance, insurance } = useInsurance();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenUser, setIsModalOpenUser] = useState(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [isInsurerModalOpen, setIsInsurerModalOpen] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedInsurers, setSelectedInsurers] = useState<string[]>([]);

  const [dataGroup, setDataGroup] = useState<any[]>([]);
  const [group, setGroup] = useState<GroupResponse[]>([]);
  const [selectedGroup, setSelectedRoles] = useState<string[]>([]);
  const [userGroup, setUserGroup] = useState<any[]>([]);
  const [groupFilter, setGroupFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageRoles, setPageRoles] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItemsRoles, setTotalItemsRoles] = useState(0);
  const [totalItemsUser, setTotalItemsUser] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsPerPageGroup, setRowsPerPageRoles] = useState(10);
  const { setLoading } = useLoading();
  const [dataRole, setDataRole] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<string[]>([]);
  const [groupRole, setGroupRole] = useState<any[]>([]);
  const [userFilter, setUserFilter] = useState("");
  const [accountId, setAccountId] = useState("");

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [role, setRole] = useState("");
  const [channel, setChannel] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validations, setValidations] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const isAllSelected = selectedGroup.length === dataGroup.length;
  const isAllSelectedRole = selectedRole.length === dataRole.length;

  const {
    updateUser,
    fetchUserById,
    addAccountGroups,
    removeAccountGroups,
    addAccountRoles,
    removeAccountRoles,
    fetchChannels,
    fetchRole,
    channels,
  } = useUser();

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
    defaultValues: {
      id,
      name: "",
      email: "",
      phone_number: "",
      password: "",
      status,
      role,
      channel,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const updatedData = {
        ...data,
        phone_number: `${phoneCode}${data.phone_number}`
      };
      await updateUser(updatedData, id);
      setUpdateSuccess(true);
    } catch (error) {
      setUpdateSuccess(false);
    }
  };

  const handleChangeStatus = (value: string) => {
    setStatus(value);
    setValue("status", value);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const res = await fetchUserById(id);
          setValue("name", res.name);
          setValue("email", res.email);
          setValue("phone_number", res.phone_number?.slice(3));
          setValue("password", res.password);
          setValue("status", res.status);
          setValue("role", res.role);
          setValue("channel", res.channel);
          setPhoneCode(res.phone_number?.slice(0, 3));
          setStatus(res.status);
          setAccountId(res.id);
          setUserGroup(res.account_groups.map((item: any) => item));
          setGroupRole(res.account_roles.map((item: any) => item));
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setValue]);

  useEffect(() => {
    fetchChannels({});
    fetchRole({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (updateSuccess === true) {
      alert("Data berhasil disimpan!");
      router.push(USER);
    } else if (updateSuccess === false) {
      alert("Terjadi kesalahan saat menyimpan data.");
    }
    setUpdateSuccess(null);
  }, [updateSuccess, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Inactive":
        return "text-gray-400 font-normal";
      case "Active":
        return "text-[#00AB4F]";
      default:
        return "text-[#7B5D21]";
    }
  };

  const selectGroup = () => {
    groupService.getGroup(page, rowsPerPage).then((res) => {
      setDataGroup(res.data);
      setGroup(res.data);
      setTotalItemsRoles(res.meta.total);
    });
  };

  const handleSelectGroup = (id: string) => {
    selectGroup();
  };

  const selectRole = (forPage: number = 1, forRowsPerPage: number = 10) => {
    groupService.getRoles(forPage ? forPage : page, forRowsPerPage ? forRowsPerPage : rowsPerPage).then((res) => {
      setDataRole(res.data);
      setTotalItemsUser(res.meta.total);
      setTotalPages(res.meta.pageTotal);
    });
  };

  const handleSelectRole = (id: string) => {
    selectRole();
  };

  const handleSelectAllChange = () => {
    if (isAllSelected) {
      setSelectedRoles([]);
    } else {
      setSelectedRoles(dataGroup.map((role) => role.id));
    }
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedRoles((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((roleId) => roleId !== id)
        : [...prevSelected, id]
    );
  };

  const handleCheckboxChangeRole = (id: string) => {
    setSelectedRole((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((userId) => userId !== id)
        : [...prevSelected, id]
    );
  };

  const isGroupSelected = (id: string) => selectedGroup.includes(id);

  const handleRowsPerPageChangeGroup = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPageRoles(Number(e.target.value));
    setPageRoles(1);
  };

  const handleAddSelectedGroups = async () => {
    const addedIds = userGroup.map((item) => item.id);
    const updatedUserGroup = [...userGroup];
    for (let i = 0; i < selectedGroup.length; i++) {
      if (!addedIds.includes(selectedGroup[i])) {
        const response = await addAccountGroups({
          account: accountId,
          group: selectedGroup[i],
        });

        if (response) {
          const accountId = response.id;
          const userData = dataGroup.find(
            (item) => item.id == selectedGroup[i]
          );
          updatedUserGroup.push({
            id: accountId,
            roles: userData,
          });
        }
      }
    }
    window.location.reload();
    setUserGroup(updatedUserGroup);
  };

  const handleDeleteSelectedGroup = async (id: string) => {
    const response = await removeAccountGroups(id);
    if (response) {
      const selectedIds: string[] = [];
      const updatedUserGroup: AccountGroup[] = [];
      userGroup.map((group) => {
        if (group.id != id) {
          selectedIds.push(group.id);
          updatedUserGroup.push(group);
        }
      });

      setUserGroup(updatedUserGroup);
      setSelectedRoles(selectedIds);
    }
  };

  const handleSelectAllChangeRole = () => {
    if (isAllSelectedRole) {
      setSelectedRole([]);
    } else {
      setSelectedRole(dataRole.map((role) => role.id));
    }
  };

  const isUserSelected = (id: string) => selectedRole.includes(id);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
    selectRole(1, Number(e.target.value));
  };

  const handleSearch = (keyword: string) => {
    setUserFilter(keyword);
    getAccountChannels(accountId);
  };

  const handleAddSelectedRole = async () => {
    const addedIds = groupRole.map((item) => item.id);
    const updatedGroupRole = [...groupRole];
    for (let i = 0; i < selectedRole.length; i++) {
      if (!addedIds.includes(selectedRole[i])) {
        const response = await addAccountRoles({
          account: accountId,
          role: selectedRole[i],
        });

        if (response) {
          const groupId = response.id;
          const userData = dataRole.find((item) => item.id == selectedRole[i]);
          updatedGroupRole.push({
            id: groupId,
            accounts: userData,
          });
        }
      }
    }

    window.location.reload();
    setGroupRole(updatedGroupRole);
  };

  const handleDeleteSelectedRole = async (id: string) => {
    const response = await removeAccountRoles(id);
    if (response) {
      const selectedIds: string[] = [];
      const updatedGroupRole: AccountGroup[] = [];
      groupRole.map((role) => {
        if (role.id != id) {
          selectedIds.push(role.id);
          updatedGroupRole.push(role);
        }
      });

      setGroupRole(updatedGroupRole);
      setSelectedRole(selectedIds);
    }
  };

  useEffect(() => {
    getAccountChannels(params.id);
    getAccountInsurers(params.id);
    fetchInsurance({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddSelectedChannels = async () => {
    if (selectedChannels.length === 0) return;

    try {
      setLoading(true);
      await addAccountChannel({ account: params.id, channel: selectedChannels[0] });
      setSelectedChannels([]);
      setIsChannelModalOpen(false);
      toast.success("Channel added successfully");
    } catch (error) {
      console.error("Error adding channel:", error);
      toast.error("Failed to add channel");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChannel = (channelId: string) => {
    setChannelToDelete(channelId);
  };

  const confirmDeleteChannel = () => {
    if (channelToDelete) {
      handleDeleteSelectedChannel(channelToDelete);
      setChannelToDelete(null);
    }
  };

  const handleDeleteSelectedChannel = async (channelId: string) => {
    try {
      await removeAccountChannel(params.id, channelId);
      toast.success("Channel removed successfully");
    } catch (error) {
      console.error("Error removing channel:", error);
      toast.error("Failed to remove channel");
    }
  };

  const handleDeleteInsurer = (insurerId: string) => {
    setInsurerToDelete(insurerId);
  };

  const confirmDeleteInsurer = () => {
    if (insurerToDelete) {
      handleDeleteSelectedInsurer(insurerToDelete);
      setInsurerToDelete(null);
    }
  };

  const handleDeleteSelectedInsurer = async (insurerId: string) => {
    try {
      await removeAccountInsurer(params.id, insurerId);
      toast.success("Insurer removed successfully");
    } catch (error) {
      console.error("Error removing insurer:", error);
      toast.error("Failed to remove insurer");
    }
  };

  const handleAddSelectedInsurers = async () => {
    if (selectedInsurers.length === 0) return;

    try {
      setLoading(true);
      await addAccountInsurer({ account: params.id, insurance: selectedInsurers[0] });
      setSelectedInsurers([]);
      setIsInsurerModalOpen(false);
      toast.success("Insurer added successfully");
    } catch (error) {
      console.error("Error adding insurer:", error);
      toast.error("Failed to add insurer");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const currentValidations = validatePassword(password);
    setValidations(currentValidations);
  }, [password]);

  const generateSecurePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()_+{}[]:;<>,.?/~`-=";

    const allChars = uppercase + lowercase + numbers + specialChars;

    let password = "";

    // Ensure at least one of each required character type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Fill the rest with random characters
    for (let i = password.length; i < 8; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password to ensure randomness
    return password.split("").sort(() => 0.5 - Math.random()).join("");
  };

  const handleGeneratePassword = () => {
    setValue("password", generateSecurePassword());
  };

  const copyPassword = () => {
    const password = watch("password");
    if (!password) {
      toastNotification("No password to copy", "error");
      return;
    }
    navigator.clipboard.writeText(password).then(() => {
      toastNotification("Password copied!", "success");
    }).catch(err => {
      console.error("Failed to copy password:", err);
      toastNotification("Failed to copy password", "error");
    });
  };

  const channelsMapById = channels.reduce((prev, value) => {
    const result = {
      [value.id]: value
    };

    return {
      ...prev,
      ...result,
    };
  }, {});
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-col w-full">
      <ChannelModal
        isChannelModalOpen={isChannelModalOpen}
        setIsChannelModalOpen={setIsChannelModalOpen}
        accountChannels={channels}
        selectedChannels={selectedChannels}
        setSelectedChannels={setSelectedChannels}
        channelsLoading={channelsLoading}
        handleAddSelectedChannels={handleAddSelectedChannels}
      />
      <InsurerModal
        isInsurerModalOpen={isInsurerModalOpen}
        setIsInsurerModalOpen={setIsInsurerModalOpen}
        accountInsurers={accountInsurers}
        selectedInsurers={selectedInsurers}
        setSelectedInsurers={setSelectedInsurers}
        insurersLoading={insurersLoading}
        handleAddSelectedInsurers={handleAddSelectedInsurers}
        insurers={insurance}
      />
      <div className="bg-white md:px-6 p-4 flex items-center">
        <div>
          <Breadcrumb className="sm:block hidden">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Masterdata</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="cursor-pointer"
                  onClick={() => router.back()}
                >
                  User
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Detail</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
            Detail User
          </h2>
        </div>

        <div className="flex ml-auto">
          <div
            onClick={() => router.back()}
            className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </div>

          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-5 rounded-full px-5"
          >
            <Check className="mr-2 w-4 h-4" />
            Save
          </Button>
        </div>
      </div>
      <div className="flex flex-col w-full p-4 md:p-6 gap-4">
        <UserForm
          onSubmit={handleSubmit}
          errors={errors}
          watch={watch}
          roles={primaryRoles}
          channels={channels}
          phoneCode={phoneCode}
          status={status}
          getStatusColor={getStatusColor}
          handleChangeStatus={handleChangeStatus}
          setPhoneCode={setPhoneCode}
          setRole={setRole}
          setChannel={setChannel}
          control={control}
          handleSubmit={handleSubmit}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          setPassword={setPassword}
          iconCopy={iconCopy}
          copyPassword={copyPassword}
          handleGeneratePassword={handleGeneratePassword}
          ref={formRef}
        />
        <UserGroups
          userGroup={userGroup}
          selectedUserGroups={selectedGroup}
          handleSelectGroup={handleSelectGroup}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          group={group}
          groupFilter={groupFilter}
          setGroupFilter={setGroupFilter}
          handleFilterGroup={handleSearch}
          isAllSelected={isAllSelected}
          handleSelectAllChange={handleSelectAllChange}
          handleCheckboxChange={handleCheckboxChange}
          isGroupSelected={isGroupSelected}
          rowsPerPageGroup={rowsPerPageGroup}
          handleRowsPerPageChangeGroup={handleRowsPerPageChangeGroup}
          totalItemsRoles={totalItemsRoles}
          setPageRoles={setPageRoles}
          page={page}
          totalPages={totalPages}
          noData={noData}
          handleAddSelectedGroups={handleAddSelectedGroups}
          handleDeleteSelectedGroup={handleDeleteSelectedGroup}
          id={id}
        />

        <UserRoles
          groupRole={groupRole}
          isModalOpenUser={isModalOpenUser}
          setIsModalOpenUser={setIsModalOpenUser}
          handleSelectRole={handleSelectRole}
          userFilter={userFilter}
          handleSearch={handleSearch}
          isAllSelectedRole={isAllSelectedRole}
          handleSelectAllChangeRole={handleSelectAllChangeRole}
          dataRole={dataRole}
          handleCheckboxChangeRole={handleCheckboxChangeRole}
          isUserSelected={isUserSelected}
          noData={noData}
          rowsPerPage={rowsPerPage}
          handleRowsPerPageChange={handleRowsPerPageChange}
          totalItemsUser={totalItemsUser}
          setPage={setPage}
          page={page}
          totalPages={totalPages}
          handleAddSelectedRole={handleAddSelectedRole}
          handleDeleteSelectedRole={handleDeleteSelectedRole}
          selectRole={selectRole}
          id={id}
        />

        <UserChannels
          accountChannels={accountChannels}
          channels={channels}
          channelsMapById={channelsMapById}
          setIsChannelModalOpen={setIsChannelModalOpen}
          handleDeleteChannel={handleDeleteChannel}
        />
        <UserInsurers
          accountInsurers={accountInsurers}
          insurers={insurance}
          insurersMapById={insurance.reduce((prev, value) => ({ ...prev, [value.id]: value }), {})}
          setIsInsurerModalOpen={setIsInsurerModalOpen}
          handleDeleteInsurer={handleDeleteInsurer}
        />
        <Dialog open={!!channelToDelete} onOpenChange={(open) => !open && setChannelToDelete(null)}>
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
        <Dialog open={!!insurerToDelete} onOpenChange={(open) => !open && setInsurerToDelete(null)}>
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
      </div>
    </div >
  );
};

const EditUserWithSidebar = (params: any) => WithSidebar(EditUser)(params);
export default EditUserWithSidebar;
