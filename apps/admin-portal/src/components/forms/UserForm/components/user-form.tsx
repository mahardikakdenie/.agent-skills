import Image from 'next/image';
import { forwardRef } from 'react';
import { EyeOff, Eye } from 'react-feather';
import { Controller, Control, FieldErrors } from 'react-hook-form';

import {
  Combobox,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';
import { Button } from '@repo/ui';

import SelectPhoneCode from '@/components/ui/select-phone-code';
import { passwordValidationRules } from '@/lib/password';

interface UserFormProps {
  control: Control<any>;
  handleSubmit: (callback: (data: any) => void) => (e: React.FormEvent) => void;
  onSubmit: (data: any) => void;
  errors: FieldErrors;
  watch: (name: string) => any;
  roles: Array<{ id: string; name: string }>;
  channels: Array<{ id: string; name: string }>;
  phoneCode: string;
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
    ref,
  ) => {
    UserFormComponent.displayName = 'UserForm';

    const statusOptions = [
      { label: 'Active', value: 'Active' },
      { label: 'Inactive', value: 'Inactive' },
    ];
    const roleOptions = roles.map((role: any) => ({
      label:
        role.name.replace(/-/g, ' ').replace(/\b\w/g, (char: any) => char.toUpperCase()) || '-',
      value: role.name,
    }));
    const channelOptions = channels.map((channel: any) => ({
      label:
        channel.name.replace(/-/g, ' ').replace(/\b\w/g, (char: any) => char.toUpperCase()) || '-',
      value: channel.id.toString(),
    }));

    return (
      <form id="user-form" ref={ref} onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4 sm:p-6 bg-white rounded-lg grid sm:grid-cols-2 gap-x-6 gap-y-4 shadow-sm border border-slate-100">
          <div>
            <label
              htmlFor="name"
              className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <Input
                  type="text"
                  id="name"
                  size="lg"
                  placeholder="Insert Name"
                  {...field}
                  className={`bg-transparent ${
                    errors.name ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
              )}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message?.toString()}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Please enter a valid email address',
                },
              }}
              render={({ field }) => (
                <Input
                  type="email"
                  id="email"
                  size="lg"
                  placeholder="Insert Email"
                  {...field}
                  className={`bg-transparent ${
                    errors.email ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message?.toString()}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="phone_number"
              className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div>
              <Controller
                name="phone_number"
                control={control}
                defaultValue=""
                rules={{
                  required: 'Phone Number is required',
                  pattern: {
                    value: /^[0-9]{9,15}$/,
                    message: 'Phone Number must contain 9-15 digits',
                  },
                  minLength: {
                    value: 9,
                    message: 'Phone Number must be at least 9 digits',
                  },
                  maxLength: {
                    value: 15,
                    message: 'Phone Number cannot exceed 15 digits',
                  },
                }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="phone_number"
                    size="lg"
                    placeholder="Insert Phone Number"
                    {...field}
                    onInput={(e) => {
                      const sanitizedValue = e.currentTarget.value.replace(/[^0-9]/g, '');
                      e.currentTarget.value = sanitizedValue;
                      field.onChange(sanitizedValue);
                    }}
                    className={`bg-transparent ${
                      errors.phone_number ? 'border-red-500' : 'border-slate-300'
                    }`}
                    leftIcon={
                      <SelectPhoneCode
                        value={phoneCode}
                        onChange={(value) => setPhoneCode(value)}
                        className="w-[72px]"
                        triggerClassName="w-[72px] border-y-0 border-l-0 rounded-r-none bg-transparent shadow-none focus:ring-0"
                        contentClassName="min-w-[72px]"
                      />
                    }
                  />
                )}
              />
              {errors.phone_number && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone_number.message?.toString()}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="status"
              className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
            >
              Status <span className="text-red-500">*</span>
            </label>
            <Controller
              name="status"
              control={control}
              defaultValue=""
              rules={{ required: 'Status is required' }}
              render={({ field }) => (
                <Select
                  size="lg"
                  value={field.value || ''}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleChangeStatus(value || '');
                  }}
                >
                  <SelectTrigger
                    id="status"
                    className={`border-slate-300 bg-transparent ${
                      field.value ? getStatusColor(field.value) : ''
                    }`}
                  >
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-red-500 text-xs mt-1">{errors.status.message?.toString()}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="role"
              className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
            >
              Role <span className="text-red-500">*</span>
            </label>
            <Controller
              name="role"
              control={control}
              rules={{ required: 'Role ID is required' }}
              render={({ field }) => (
                <Select
                  size="lg"
                  value={field.value || ''}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setRole(value || '');
                  }}
                >
                  <SelectTrigger id="role" className="border-slate-300 bg-transparent">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {roleOptions.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role.message?.toString()}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="channel"
              className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
            >
              Channel <span className="text-red-500">*</span>
            </label>
            <Controller
              name="channel"
              control={control}
              rules={{ required: 'Channel ID is required' }}
              render={({ field }) => (
                <Combobox
                  id="channel"
                  size="lg"
                  value={field.value?.toString() || ''}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setChannel(value || '');
                  }}
                  options={channelOptions}
                  placeholder="Select Channel"
                  className="bg-transparent"
                  triggerClassName="border-slate-300"
                />
              )}
            />
            {errors.channel && (
              <p className="text-red-500 text-xs mt-1">{errors.channel.message?.toString()}</p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
            >
              Password
              {watch('role') === 'admin' && <span className="text-red-500"> *</span>}
            </label>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                validate: (value) => {
                  const selectedRole = watch('role');

                  if (selectedRole === 'admin' && !value) {
                    return passwordValidationRules.required(selectedRole);
                  }

                  if (value) {
                    if (value.length < passwordValidationRules.minLength.value) {
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
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      disabled
                      placeholder="Insert Password"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setPassword(e.target.value);
                      }}
                      size="lg"
                      className={`bg-transparent ${
                        errors.password ? 'border-red-500' : 'border-slate-300'
                      }`}
                      inputClassName="text-base"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-11 flex cursor-pointer items-center"
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
                      aria-label="Copy password"
                      className="absolute inset-y-0 right-3 flex cursor-pointer items-center"
                      onClick={() => copyPassword()}
                    >
                      <Image alt="copy" src={iconCopy} width={18} />
                    </button>
                  </div>
                  <div className="flex-[1]">
                    <Button
                      className="h-10 rounded-full bg-[#F5BA41] px-4 text-sm font-medium text-black hover:bg-[#e6a92d]"
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
              <p className="text-red-500 text-xs mt-1">{errors.password.message?.toString()}</p>
            )}
          </div>
        </div>
      </form>
    );
  },
);

export { UserFormComponent as UserForm };
