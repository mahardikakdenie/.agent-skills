import Image from 'next/image';
import { forwardRef } from 'react';
import { EyeOff, Eye } from 'react-feather';
import { Controller, Control, FieldErrors } from 'react-hook-form';

import {
  Box,
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
      <Box as="form" id="user-form" ref={ref} onSubmit={handleSubmit(onSubmit)}>
        <Box className="p-4 sm:p-6 bg-white rounded-lg grid sm:grid-cols-2 gap-x-6 gap-y-4 shadow-sm border border-slate-100">
          <Box>
            <Box
              as="label"
              htmlFor="name"
              className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
            >
              Name{' '}
              <Box as="span" className="text-red-500">
                *
              </Box>
            </Box>
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
              <Box as="p" className="text-red-500 text-xs mt-1">
                {errors.name.message?.toString()}
              </Box>
            )}
          </Box>
          <Box>
            <Box
              as="label"
              htmlFor="email"
              className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
            >
              Email{' '}
              <Box as="span" className="text-red-500">
                *
              </Box>
            </Box>
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
              <Box as="p" className="text-red-500 text-xs mt-1">
                {errors.email.message?.toString()}
              </Box>
            )}
          </Box>
          <Box>
            <Box
              as="label"
              htmlFor="phone_number"
              className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
            >
              Phone Number{' '}
              <Box as="span" className="text-red-500">
                *
              </Box>
            </Box>
            <Box>
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
                <Box as="p" className="text-red-500 text-xs mt-1">
                  {errors.phone_number.message?.toString()}
                </Box>
              )}
            </Box>
          </Box>
          <Box>
            <Box
              as="label"
              htmlFor="status"
              className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
            >
              Status{' '}
              <Box as="span" className="text-red-500">
                *
              </Box>
            </Box>
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
              <Box as="p" className="text-red-500 text-xs mt-1">
                {errors.status.message?.toString()}
              </Box>
            )}
          </Box>
          <Box>
            <Box
              as="label"
              htmlFor="role"
              className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
            >
              Role{' '}
              <Box as="span" className="text-red-500">
                *
              </Box>
            </Box>
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
              <Box as="p" className="text-red-500 text-xs mt-1">
                {errors.role.message?.toString()}
              </Box>
            )}
          </Box>
          <Box>
            <Box
              as="label"
              htmlFor="channel"
              className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
            >
              Channel{' '}
              <Box as="span" className="text-red-500">
                *
              </Box>
            </Box>
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
              <Box as="p" className="text-red-500 text-xs mt-1">
                {errors.channel.message?.toString()}
              </Box>
            )}
          </Box>
          <Box className="relative">
            <Box
              as="label"
              htmlFor="password"
              className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
            >
              Password
              {watch('role') === 'admin' && (
                <Box as="span" className="text-red-500">
                  {' '}
                  *
                </Box>
              )}
            </Box>
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
                <Box className="flex w-full gap-1.5 items-center">
                  <Box className="relative flex-[3]">
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
                    <Box
                      as="button"
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
                    </Box>
                    <Box
                      as="button"
                      type="button"
                      aria-label="Copy password"
                      className="absolute inset-y-0 right-3 flex cursor-pointer items-center"
                      onClick={() => copyPassword()}
                    >
                      <Image alt="copy" src={iconCopy} width={18} />
                    </Box>
                  </Box>
                  <Box className="flex-[1]">
                    <Button
                      className="h-10 rounded-full bg-[#F5BA41] px-4 text-sm font-medium text-black hover:bg-[#e6a92d]"
                      onClick={(e) => {
                        e.preventDefault();
                        handleGeneratePassword();
                      }}
                    >
                      Generate Password
                    </Button>
                  </Box>
                </Box>
              )}
            />
            {errors.password && (
              <Box as="p" className="text-red-500 text-xs mt-1">
                {errors.password.message?.toString()}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  },
);

export { UserFormComponent as UserForm };
