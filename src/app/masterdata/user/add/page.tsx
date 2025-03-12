"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useRequireAuth from "@/hooks/useRequireAuth";
import { Input } from "@/components/ui/input";
import WithSidebar from "@/hoc/with-sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Check, ChevronLeft, Eye, EyeOff, Plus } from "react-feather";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Check as CheckIcon, X as XIcon } from "react-feather";

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

const AddUser = ({ params }: { params: { id: string } }) => {
  useRequireAuth();
  const { id } = params;
  const router = useRouter();
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const path = usePathname();
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [channel, setChannel] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { saveUser, channels, fetchChannels, fetchRole } = useUser();

  const roles = [
    {
      id: "Admin",
      name: "Admin",
    },
    {
      id: "Partner",
      name: "Partner",
    },
    {
      id: "User",
      name: "User",
    },
    {
      id: "Insurer",
      name: "Insurer",
    },
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
      password,
      status,
      permission: "",
      role,
      roleId: selectedRole,
      channel,
      channelId: selectedChannel,
    },
    values: {
      id,
      name,
      email,
      phone_number,
      password,
      status,
      permission: "",
      role,
      channel,
    },
  });

  const selectRole = watch("role");

  const [validations, setValidations] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    fetchChannels({});
    fetchRole({});
  }, []);

  useEffect(() => {
    const currentValidations = validatePassword(password);
    setValidations(currentValidations);
  }, [password]);

  const onSubmit = async (data: any) => {
    try {
      const response = await saveUser(data, id);
      if (response.id != null) {
        const id = response.id;
        router.push(`/masterdata/user/${id}`);
      }
    } catch (error) {
      setSaveSuccess(false);
    }
  };

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
                  <BreadcrumbPage>Add</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
              Add User
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
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                      <SelectValue placeholder="Select Status" />
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
                              )}{" "}
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
                              )}{" "}
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
                    if (selectedRole === "admin" && !value) {
                      return passwordValidationRules.required(selectedRole);
                    }
                    if (value) {
                      const validations = validatePassword(value);
                      if (!Object.values(validations).every(Boolean)) {
                        return "Password does not meet requirements";
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
                        className="absolute inset-y-0 right-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
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
                <div className="text-primary font-bold mb-2">User's Group</div>
                <p className="text-sm text-black/60">
                  <i>
                    All the users in the group will have permissions that are
                    defined in the selected group roles
                  </i>
                </p>
              </div>
              <Button
                color="warning"
                disabled
                className="bg-gray-300 text-black hover:bg-[#e6a92d] rounded-full ml-auto w-36"
              >
                <Plus className="w-4 h-4 mr-2" /> Assign Group
              </Button>
            </div>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-lg gap-4">
            <div className="flex gap-4 items-center">
              <div>
                <div className="text-primary font-bold mb-2">
                  Additional Role
                </div>
                <p className="text-sm text-black/60">
                  <i>
                    Assigned users to specific roles. If you are unable to find
                    the one you require, please request the superadmin to create
                    a new role
                  </i>
                </p>
              </div>
              <Button
                color="warning"
                disabled
                className="bg-gray-300 text-black hover:bg-[#e6a92d] rounded-full ml-auto w-36"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Role
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const AddUserWithSidebar = (params: any) => WithSidebar(AddUser)(params);
export default AddUserWithSidebar;
