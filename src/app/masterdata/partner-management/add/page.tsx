"use client";

import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft } from "react-feather";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChannelService } from "@/services/channel.services";
import { UserService } from "@/services/masterdata/user.service";
import { useScreen } from "@/context/screen.context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AppURL from "@/constants/app-url.const";

const PHONE_CODES = [
  { code: "+62", country: "Indonesia" },
  { code: "+65", country: "Singapore" },
  { code: "+60", country: "Malaysia" },
  { code: "+63", country: "Philippines" },
  { code: "+66", country: "Thailand" },
  { code: "+84", country: "Vietnam" },
];

interface PartnerFormData {
  name: string;
  email: string;
  phone_number: string;
  api_key: string;
  channel: string;
  phone_code: string;
}

export default function AddPartner() {
  const router = useRouter();
  const { setLoading } = useScreen();
  const [channels, setChannels] = useState<any[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [newPartnerId, setNewPartnerId] = useState<string>("");

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PartnerFormData>();

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const channelService = new ChannelService();
      const response = await channelService.getChannels();
      setChannels(response.data || []);
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };

  const generateApiKey = () => {
    const apiKey =
      "key_" +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    setValue("api_key", apiKey);
  };

  const onSubmit = async (data: PartnerFormData) => {
    setLoading(true);
    try {
      const userService = new UserService();
      const response = await userService.saveUser({
        name: data.name,
        email: data.email,
        phone_number: data.phone_code + data.phone_number, // Combine phone code and number
        api_key: data.api_key,
        channel: data.channel,
        role: "Partner",
      });

      if (response) {
        setNewPartnerId(response.id);
        setShowSuccessDialog(true);
      }
    } catch (error: any) {
      console.error("Error creating partner:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
    router.push(`${AppURL.masterdataPartnerManagementDetail}/${newPartnerId}`);
  };

  return (
    <>
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
                      Partner Management
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Add</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
                Add Partner
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
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      placeholder="Insert Name"
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
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      id="email"
                      placeholder="Insert Email"
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
                <div className="flex gap-2">
                  <Controller
                    name="phone_code"
                    control={control}
                    rules={{ required: "Phone code is required" }}
                    defaultValue="+62"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[120px] h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                          <SelectValue placeholder="Code" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {PHONE_CODES.map((item) => (
                              <SelectItem key={item.code} value={item.code}>
                                {item.code} {item.country}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Controller
                    name="phone_number"
                    control={control}
                    rules={{
                      required: "Phone Number is required",
                      pattern: {
                        value: /^[0-9]{6,12}$/,
                        message: "Please enter a valid phone number",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="phone_number"
                        placeholder="Insert Phone Number"
                        className={`mt-1 block w-full h-12 ${
                          errors.phone_number
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm`}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </div>
                {(errors.phone_number || errors.phone_code) && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone_code?.message || errors.phone_number?.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="api_key"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  API Key<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Controller
                    name="api_key"
                    control={control}
                    rules={{ required: "API Key is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="api_key"
                        readOnly
                        placeholder="Generated API Key"
                        className={`mt-1 block w-full h-12 pr-24 ${
                          errors.api_key ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm`}
                      />
                    )}
                  />
                  <Button
                    type="button"
                    onClick={generateApiKey}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#F5BA41] text-black hover:bg-[#e6a92d] h-8 px-3"
                  >
                    Generate
                  </Button>
                </div>
                {errors.api_key && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.api_key.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="channel"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Channel<span className="text-red-500">*</span>
                </label>
                <Controller
                  name="channel"
                  control={control}
                  rules={{ required: "Channel is required" }}
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
                                )}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.channel && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.channel.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Partner Created Successfully</DialogTitle>
            <DialogDescription>
              The partner has been created. Would you like to assign plans now?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(AppURL.masterdataPartnerManagement)}
            >
              Back to List
            </Button>
            <Button
              onClick={handleDialogClose}
              className="bg-[#016DA1] hover:bg-[#016DA1] text-white"
            >
              Assign Plans
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
