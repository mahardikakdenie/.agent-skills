import { Input } from "@repo/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { EyeOff, Eye } from "react-feather";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { passwordValidationRules } from "@/lib/password";
import Image from "next/image";
import { Button } from "@repo/ui";
import { forwardRef } from "react";
import SelectPhoneCode from "@/components/ui/select-phone-code";

interface UserFormProps {
  control: Control<any>;
  handleSubmit: (callback: (data: any) => void) => (e: React.FormEvent) => void;
  onSubmit: (data: any) => void;
  errors: FieldErrors;
  watch: (name: string) => any;
  roles: Array<{ id: string; name: string }>;
  channels: Array<{ id: string; name: string }>;
  phoneCode: string;
  status: string;
  getStatusColor: (status: string) => string;
  handleChangeStatus: (value: string) => void;
  setPhoneCode: (value: string) => void;
  setRole: (value: string) => void;
  setChannel: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  setPassword: (password: string) => void;
  iconCopy: string;
  copyPassword: () => void;
  handleGeneratePassword: () => void;
}

const UserFormComponent = forwardRef<HTMLFormElement, UserFormProps>(
  (
    {
      control,
      handleSubmit,
      onSubmit,
      errors,
      watch,
      roles,
      channels,
      phoneCode,
      status,
      getStatusColor,
      handleChangeStatus,
      setPhoneCode,
      setRole,
      setChannel,
      showPassword,
      setShowPassword,
      setPassword,
      iconCopy,
      copyPassword,
      handleGeneratePassword,
    }: UserFormProps,
    ref
  ) => {
    UserFormComponent.displayName = "UserForm";

    return (
      <form id="user-form" ref={ref} onSubmit={handleSubmit(onSubmit)}>
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
                {errors.name.message?.toString()}
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
                {errors.email.message?.toString()}
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
            <div className="flex gap-2 items-start">
              <div className="w-24 h-12">
                <SelectPhoneCode
                  value={phoneCode}
                  onChange={(value) => setPhoneCode(value)}
                />
              </div>
              <Controller
                name="phone_number"
                control={control}
                defaultValue=""
                rules={{
                  required: "Phone Number is required",
                  pattern: {
                    value: /^[0-9]{9,15}$/,
                    message: "Phone Number must contain 9-15 digits",
                  },
                  minLength: {
                    value: 9,
                    message: "Phone Number must be at least 9 digits",
                  },
                  maxLength: {
                    value: 15,
                    message: "Phone Number cannot exceed 15 digits",
                  },
                }}
                render={({ field }) => (
                  <div className="w-full">
                    <Input
                      type="text"
                      id="phone_number"
                      placeholder="Insert Phone Number"
                      {...field}
                      onInput={(e) => {
                        const sanitizedValue = e.currentTarget.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        e.currentTarget.value = sanitizedValue;
                        field.onChange(sanitizedValue);
                      }}
                      className={`block w-full h-12 ${
                        errors.phone_number
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm`}
                    />
                    {errors.phone_number && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone_number.message?.toString()}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
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
                  value={field.value || ""}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleChangeStatus(value);
                  }}
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
                {errors.status.message?.toString()}
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
                <Select
                  value={field.value || ""}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setRole(value);
                  }}
                >
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
                {errors.role.message?.toString()}
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
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setChannel(value);
                  }}
                >
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

                  if (selectedRole === "admin" && !value) {
                    return passwordValidationRules.required(selectedRole);
                  }

                  if (value) {
                    if (
                      value.length < passwordValidationRules.minLength.value
                    ) {
                      return passwordValidationRules.minLength.message;
                    }

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
                        <EyeOff size={18} className="text-[#015B86]" />
                      ) : (
                        <Eye size={18} className="text-[#015B86]" />
                      )}
                    </button>
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center"
                      onClick={() => copyPassword()}
                    >
                      <Image alt="copy" src={iconCopy} width={18} />
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
                {errors.password.message?.toString()}
              </p>
            )}
          </div>
        </div>
      </form>
    );
  }
);

export { UserFormComponent as UserForm };
