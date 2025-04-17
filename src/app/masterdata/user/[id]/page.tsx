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
import useRequireAuth from "@/hooks/useRequireAuth";
import { Input } from "@/components/ui/input";
import WithSidebar from "@/hoc/with-sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Plus,
  Search,
  Trash2,
  X,
} from "react-feather";
import { Controller, useForm } from "react-hook-form";
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
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import noData from "/public/images/no-data.webp";
import {
  AccountGroup,
  GroupResponse,
  GroupService,
} from "@/services/masterdata/group.service";
import iconCopy from "/public/images/icon-copy.svg"
import { toastNotification } from "@/lib/toast";

const passwordValidationRules = {
  required: (role: string) =>
    role === "admin" ? "Password is required for Admin role" : false,
  minLength: {
    value: 8,
    message: "Password must be at least 8 characters",
  },
  pattern: {
    value:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/,
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
  },
};

const validatePassword = (password: string) => {
  return {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };
};

const EditUser = ({ params }: { params: { id: string } }) => {
  useRequireAuth();
  const router = useRouter();
  const { id } = params;
  const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null);
  const path = usePathname();
  const groupService = new GroupService();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenUser, setIsModalOpenUser] = useState(false);

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
  const [loading, setLoading] = useState(true);
  const [dataRole, setDataRole] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<string[]>([]);
  const [groupRole, setGroupRole] = useState<any[]>([]);
  const [userFilter, setUserFilter] = useState("");
  const [accoutndId, setAccountId] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
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

  const roles = [
    { id: "Admin", name: "Admin" },
    { id: "User", name: "User" },
    { id: "Partner", name: "Partner" },
    { id: "Insurer", name: "Insurer" },
  ];
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
      name,
      email,
      phone_number,
      password: "",
      status,
      role,
      channel,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await updateUser(data, id);
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
          setValue("phone_number", res.phone_number);
          setValue("password", res.password);
          setValue("status", res.status);
          setValue("role", res.role);
          setValue("channel", res.channel);
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
      router.push(`/masterdata/user`);
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

  const selectRole = () => {
    groupService.getRoles(page, rowsPerPage).then((res) => {
      setDataRole(res.data);
      setTotalItemsUser(res.meta.total);
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
          account: accoutndId,
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
  };

  const handleAddSelectedRole = async () => {
    const addedIds = groupRole.map((item) => item.id);
    const updatedGroupRole = [...groupRole];
    for (let i = 0; i < selectedRole.length; i++) {
      if (!addedIds.includes(selectedRole[i])) {
        const response = await addAccountRoles({
          account: accoutndId,
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
    setValue("password", generateSecurePassword())
  };

  const copyPassword = () => {
    const password = watch("password");
    if (!password) {
      toastNotification("No password to copy", "error");
      return;
    }
    navigator.clipboard.writeText(password).then(() => {
      toastNotification("Password copied!", "success")
    }).catch(err => {
      console.error("Failed to copy password:", err)
      toastNotification("Failed to copy password", "error")
    });
  }

  return (
    <div className="flex flex-col w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
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
              type="submit"
              className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-5 rounded-full px-5"
            >
              <Check className="mr-2 w-4 h-4" />
              Save
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-full p-4 md:p-6 gap-4">
          <div className="p-4 sm:p-6 bg-white rounded-lg grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name<span className="text-red-500">*</span>
              </label>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="name"
                    placeholder="Insert Name"
                    {...field}
                    className={`mt-1 block w-full h-12 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm`}
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email<span className="text-red-500">*</span>
              </label>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email address",
                  },
                }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="email"
                    placeholder="Insert Email"
                    {...field}
                    className={`mt-1 block w-full h-12 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm`}
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone_number"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number<span className="text-red-500">*</span>
              </label>
              <Controller
                name="phone_number"
                control={control}
                defaultValue=""
                rules={{
                  required: "Phone Number is required",
                  pattern: {
                    value: /^\+?[0-9]{10,15}$/,
                    message:
                      "Phone Number must contain 10-15 digits and may start with '+'",
                  },
                  minLength: {
                    value: 10,
                    message: "Phone Number must be at least 10 digits",
                  },
                  maxLength: {
                    value: 15,
                    message: "Phone Number cannot exceed 15 digits",
                  },
                }}
                render={({ field }) => (
                  <div>
                    <Input
                      type="text"
                      id="phone_number"
                      placeholder="Insert Phone Number"
                      {...field}
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value
                          .replace(/[^0-9+]/g, "")
                          .replace(/(?!^)\+/g, "");
                        field.onChange(e);
                      }}
                      className={`mt-1 block w-full h-12 ${
                        errors.phone_number
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm`}
                    />
                    {errors.phone_number && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone_number.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Status<span className="text-red-500">*</span>
              </label>
              <Controller
                name="status"
                control={control}
                defaultValue=""
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={status}
                    onValueChange={handleChangeStatus}
                  >
                    <SelectTrigger
                      className={`w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2 ${getStatusColor(
                        status
                      )}`}
                    >
                      <SelectValue placeholder="Select Status">
                        {status}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Role
              </label>
              <Controller
                name="role"
                control={control}
                rules={{ required: "Role ID is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {roles.map((role: any) => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.name
                              .replace(/-/g, " ")
                              .replace(/\b\w/g, (char: any) =>
                                char.toUpperCase()
                              ) || "-"}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="channel"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Channel
              </label>
              <Controller
                name="channel"
                control={control}
                rules={{ required: "Channel ID is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                      <SelectValue placeholder="Select Channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {channels.map((channel: any) => (
                          <SelectItem key={channel.id} value={channel.id}>
                            {channel.name
                              .replace(/-/g, " ")
                              .replace(/\b\w/g, (char: any) =>
                                char.toUpperCase()
                              ) || "-"}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.channel && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.channel.message?.toString()}
                </p>
              )}
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
                {watch("role") === "admin" && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  validate: (value) => {
                    const selectedRole = watch("role");

                    // Check if password is required for admin
                    if (selectedRole === "admin" && !value) {
                      return passwordValidationRules.required(selectedRole);
                    }

                    // If password is provided (optional for non-admin), validate it
                    if (value) {
                      // Check minimum length
                      if (
                        value.length < passwordValidationRules.minLength.value
                      ) {
                        return passwordValidationRules.minLength.message;
                      }

                      // Check pattern
                      if (!passwordValidationRules.pattern.value.test(value)) {
                        return passwordValidationRules.pattern.message;
                      }
                    }

                    return true;
                  },
                }}
                render={({ field }) => (
                  <div className="flex w-full gap-1.5 items-center">
                    <div className="relative flex-[3]">
                      <Input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        disabled
                        placeholder="Insert Password"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setPassword(e.target.value);
                        }}
                        className={`mt-1 block w-full h-12 ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-11 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} className="text-[#015B86]"/>
                        ) : (
                          <Eye size={18} className="text-[#015B86]"/>
                        )}
                      </button>
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center"
                        onClick={() => copyPassword()}
                      >
                        <Image alt="copy" src={iconCopy} width={18}/>
                      </button>
                    </div>
                    <div className="flex-[1]">
                      <Button
                        className="w-full bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
                        onClick={(e) => {
                          e.preventDefault();
                          handleGeneratePassword();
                        }}
                      >
                        Generate Password
                      </Button>
                    </div>
                  </div>
                )}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-lg gap-4">
            <div className="flex gap-4 items-center">
              <div>
                <div className="text-primary font-bold mb-2">
                  User&apos;s Group ({userGroup.length})
                </div>
                <p className="text-sm text-black/60">
                  <i>
                    All the users in the group will have permissions that are
                    defined in the selected group roles
                  </i>
                </p>
              </div>
              <Dialog
                open={isModalOpen}
                onOpenChange={(open) => {
                  setIsModalOpen(open);
                  if (open) handleSelectGroup(id);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    color="warning"
                    className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full ml-auto w-36"
                    onClick={() => handleSelectGroup(id)}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Assign Group
                  </Button>
                </DialogTrigger>
                <DialogContent
                  style={{ zIndex: 100 }}
                  className="p-0 w-[1000px] max-w-full overflow-hidden"
                >
                  <DialogHeader className="bg-[#F8F8F8] py-3 px-4 sm:px-6">
                    <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
                      Select Group
                      <DialogClose className="ml-auto">
                        <Button
                          type="button"
                          className="bg-transparent hover:bg-transparent text-black p-0"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </DialogClose>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="p-4">
                    <div className="grid gap-4 mb-4">
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Search"
                          value={groupFilter}
                          onChange={(e) => setGroupFilter(e.target.value)}
                          className="px-4 text-sm border rounded-lg h-11"
                        />
                        <Search className="w-5 h-5 absolute right-3 top-3 text-gray-600" />
                      </div>
                    </div>

                    <Table className="table-claims">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap py-2 w-14">
                            <Input
                              type="checkbox"
                              checked={isAllSelected}
                              onChange={handleSelectAllChange}
                              className="w-4 h-4 mx-auto"
                            />
                          </TableHead>
                          <TableHead className="py-2">Group Name</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.length > 0 ? (
                          group.map((group) => (
                            <TableRow
                              key={group.id}
                              className="cursor-pointer"
                              onClick={() => handleCheckboxChange(group.id)}
                            >
                              <TableCell align="center">
                                <Input
                                  type="checkbox"
                                  checked={isGroupSelected(group.id)}
                                  className="w-4 h-4"
                                />
                              </TableCell>
                              <TableCell>{group?.name || "-"}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow className="hover:!bg-white">
                            <TableCell colSpan={10}>
                              <div className="flex flex-col gap-4 items-center justify-center py-14">
                                <Image alt="no data" src={noData} width={200} />
                                No transaction data available
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>

                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={8}>
                            <div className="flex justify-center items-center gap-2 font-normal">
                              <label htmlFor="rowsPerPageGroup">Showing:</label>
                              <select
                                id="rowsPerPageGroup"
                                value={rowsPerPageGroup}
                                onChange={handleRowsPerPageChangeGroup}
                                className="p-2 border rounded"
                              >
                                {[10, 20, 30, 50].map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                              <span className="mr-2">
                                of {totalItemsRoles} items
                              </span>
                              <button
                                onClick={() =>
                                  setPageRoles((prevState) =>
                                    Math.max(prevState - 1, 1)
                                  )
                                }
                                disabled={page === 1}
                                title="Prev"
                              >
                                <ChevronLeft />
                              </button>
                              <button
                                onClick={() =>
                                  setPageRoles((prevState) =>
                                    Math.min(prevState + 1, totalPages)
                                  )
                                }
                                disabled={page === totalPages}
                                title="Next"
                              >
                                <ChevronRight />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>

                  <DialogFooter className="sm:justify-center justify-center pb-4 sm:pb-6">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
                        onClick={handleAddSelectedGroups}
                      >
                        <Check className="w-4 h-4 mr-2" /> Save
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {userGroup.length > 0 && (
              <div className="w-full bg-white rounded-lg overflow-auto mt-5">
                <Table className="table-search-params">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap py-2 w-52">
                        Group
                      </TableHead>
                      <TableHead className="py-2">Role</TableHead>
                      <TableHead className="py-2"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userGroup.map((group) => (
                      <TableRow key={group.id}>
                        <TableCell className="py-1">
                          {group?.groups?.name || "-"}
                        </TableCell>
                        <TableCell className="py-1">
                          <div className="flex flex-wrap gap-2">
                            {group?.groups?.group_roles?.length > 0
                              ? group.groups.group_roles.map(
                                  (groupRole: any) => (
                                    <span
                                      key={groupRole.roles?.id}
                                      className="border border-gray-300 bg-gray-100 rounded py-1 px-2"
                                    >
                                      {groupRole.roles?.name || "-"}
                                    </span>
                                  )
                                )
                              : "-"}
                          </div>
                        </TableCell>
                        <TableCell className="py-1 text-center">
                          <Button
                            className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteSelectedGroup(group.id);
                            }}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-lg gap-4">
            <div className="flex gap-4 items-center">
              <div>
                <div className="text-primary font-bold mb-2">
                  Additional Role ({groupRole.length})
                </div>
                <p className="text-sm text-black/60">
                  <i>
                    Assigned users to specific roles. If you are unable to find
                    the one you require, please request the superadmin to create
                    a new role
                  </i>
                </p>
              </div>
              <Dialog
                open={isModalOpenUser}
                onOpenChange={(open) => {
                  setIsModalOpenUser(open);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    color="warning"
                    className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full ml-auto w-36"
                    onClick={() => handleSelectRole(id)}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Role
                  </Button>
                </DialogTrigger>
                <DialogContent
                  style={{ zIndex: 100 }}
                  className="p-0 w-[1000px] max-w-full overflow-hidden"
                >
                  <DialogHeader className="bg-[#F8F8F8] py-3 px-4 sm:px-6">
                    <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
                      Select Role
                      <DialogClose className="ml-auto">
                        <Button
                          type="button"
                          className="bg-transparent hover:bg-transparent text-black p-0"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </DialogClose>
                    </DialogTitle>
                  </DialogHeader>

                  <div
                    className="p-4 overflow-auto"
                    style={{ maxHeight: "calc(100vh - 180px)" }}
                  >
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Search"
                          value={userFilter}
                          onChange={(e) => setUserFilter(e.target.value)}
                          className="px-4 text-sm border rounded-lg h-11"
                        />
                        <Search className="w-5 h-5 absolute right-3 top-3 text-gray-600" />
                      </div>
                      <div className="flex gap-4 italic text-xs items-center font-light bg-white shadow rounded py-2 px-4">
                        <AlertCircle
                          className="text-blue-600"
                          width="35"
                          height="35"
                        />
                        Assigned users to specific roles. If you are unable to
                        find the one you require, please request the superadmin
                        to create a new role
                      </div>
                    </div>

                    <Table className="table-claims">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap py-2 w-14">
                            <Input
                              type="checkbox"
                              checked={isAllSelectedRole}
                              onChange={handleSelectAllChangeRole}
                              className="w-4 h-4 mx-auto"
                            />
                          </TableHead>
                          <TableHead className="py-2">Role Name</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dataRole.length > 0 ? (
                          dataRole.map((role) => (
                            <TableRow
                              key={role.id}
                              className="cursor-pointer"
                              onClick={() => handleCheckboxChangeRole(role.id)}
                            >
                              <TableCell align="center">
                                <Input
                                  type="checkbox"
                                  checked={isUserSelected(role.id)}
                                  className="w-4 h-4"
                                />
                              </TableCell>
                              <TableCell>
                                {role.name
                                  .replace(/-/g, " ")
                                  .replace(/\b\w/g, (char: any) =>
                                    char.toUpperCase()
                                  ) || "-"}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow className="hover:!bg-white">
                            <TableCell colSpan={4}>
                              <div className="flex flex-col gap-4 items-center justify-center py-14">
                                <Image alt="no data" src={noData} width={200} />
                                No transaction data available
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>

                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={8}>
                            <div className="flex justify-center items-center gap-2 font-normal">
                              <label htmlFor="rowsPerPage">Showing:</label>
                              <select
                                id="rowsPerPage"
                                value={rowsPerPage}
                                onChange={handleRowsPerPageChange}
                                className="p-2 border rounded"
                              >
                                {[10, 20, 30, 50].map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                              <span className="mr-2">
                                of {totalItemsUser} items
                              </span>
                              <button
                                onClick={() =>
                                  setPage((prevState) =>
                                    Math.max(prevState - 1, 1)
                                  )
                                }
                                disabled={page === 1}
                                title="Prev"
                              >
                                <ChevronLeft />
                              </button>
                              <button
                                onClick={() =>
                                  setPage((prevState) =>
                                    Math.min(prevState + 1, totalPages)
                                  )
                                }
                                disabled={page === totalPages}
                                title="Next"
                              >
                                <ChevronRight />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>

                  <DialogFooter className="sm:justify-center justify-center pb-4 sm:pb-6">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
                        onClick={handleAddSelectedRole}
                      >
                        <Check className="w-4 h-4 mr-2" /> Save
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {groupRole.length > 0 && (
              <div className="w-full bg-white rounded-lg overflow-auto mt-5">
                <Table className="table-search-params">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="py-2">Name</TableHead>
                      <TableHead className="py-2 w-10">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupRole.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="py-1">
                          {role?.roles?.name
                            .replace(/-/g, " ")
                            .replace(/\b\w/g, (char: any) =>
                              char.toUpperCase()
                            ) || "-"}
                        </TableCell>
                        <TableCell className="py-1 text-center">
                          <Button
                            className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteSelectedRole(role.id);
                            }}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

const EditUserWithSidebar = (params: any) => WithSidebar(EditUser)(params);
export default EditUserWithSidebar;
