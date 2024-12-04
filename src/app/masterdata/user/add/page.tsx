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
import { Check, ChevronLeft } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useUser } from "../hooks";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddUser = ({ params }: { params: { id: string } }) => {
  useRequireAuth();
  const router = useRouter();
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const path = usePathname();
  const [selectedChannel, setSelectedSelectedChannel] = useState<any>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [channel, setChannel] = useState("");

  const { saveUser, channels, fetchChannels } = useUser();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
    defaultValues: {
      name,
      email,
      phone_number,
      role,
      password,
      status,
      channel,
      channelId: selectedChannel,
      permission: "",
    },
    values: {
      name,
      email,
      phone_number,
      role,
      password,
      status,
      channel,
      permission: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await saveUser(data);
      setSaveSuccess(true);
    } catch (error) {
      setSaveSuccess(false);
    }
  };
  useEffect(() => {
    fetchChannels({});
  }, []);

  useEffect(() => {
    if (saveSuccess === true) {
      alert("Data berhasil disimpan!");
      router.back();
    } else if (saveSuccess === false) {
      alert("Terjadi kesalahan saat menyimpan data.");
    }
    setSaveSuccess(null);
  }, [saveSuccess, router]);

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
                Name
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
                Email
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
                Phone Number
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
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Role
              </label>
              <Controller
                name="role"
                control={control}
                defaultValue=""
                // rules={{ required: "Role is required" }}
                render={({ field }) => (
                  <Select>
                    <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Partner">Partner</SelectItem>
                      <SelectItem value="Insurer">Insurer</SelectItem>
                      <SelectItem value="User">User</SelectItem>
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
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                // rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="password"
                    placeholder="Insert Password"
                    {...field}
                    className={`mt-1 block w-full h-12 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm`}
                  />
                )}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Status
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
                            {channel.name}
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
                  error message
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const AddUserWithSidebar = (params: any) => WithSidebar(AddUser)(params);
export default AddUserWithSidebar;
