"use client";
import { useProducts } from "@/app/(protected)/product-catalog/hooks";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WithSidebar from "@/hoc/with-sidebar";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft } from "react-feather";
import { Controller, useForm, useWatch } from "react-hook-form";
import useBrokerFee from "../../hook";
import { useLoading } from "@/context/loading.context";
import { ChannelService } from "@/services/channel.services";

const CreatePartnerCom = () => {
  const router = useRouter();
  const handleCancel = () => {
    router.push("/broker/partner-com");
  };

  const { createChannelFee } = useBrokerFee();
  const { setLoading } = useLoading();
  const [channels, setChannels] = useState<any[]>([]);

  const handleCreateBrokerFee = async (data: any) => {
    try {
      setLoading(true);
      var res = await createChannelFee(watchChannel!, {
        channel: watchChannel!,
        channel_name: channels.find((i) => i.id === watchChannel!)?.name,
        product: data.product ? data.product : null,
        plan: data.plan ? data.plan : null,
        insurance: data.insurance == "All" ? null : data.insurance,
        insurance_name: insurances.find((i) => i.id === data.insurance)?.name,
        fee_type: "percentage",
        currency: "IDR",
        fee: data.fee
      });
      router.push("/broker/partner-com");
    } catch (error) {
      console.error(error);
      alert("Failed to create partner com");
    } finally {
      setLoading(false);
    }
  };

  const {
    handleSubmit,
    reset,
    resetField,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "",
      channel: undefined,
      insurance: "All",
      product: undefined,
      plan: undefined,
      fee: 0,
    },
  });

  const {
    insurances,
    fetchInsurances,
    products,
    fetchProducts,
    plans,
    fetchPlans,
  } = useProducts();

  useEffect(() => {
    const fetchData = async () => {
      await getChannels();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
    fetchData();
  }, []);

  const getChannels = async () => {
    try {
      const channelService = new ChannelService();
      const channelResponse = await channelService.getChannels();
      setChannels(channelResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch channels:', error);
    }
  };

  const watchChannel = useWatch({
    control,
    name: "channel",
  });

  const watchInsurance = useWatch({
    control,
    name: "insurance",
  });

  const watchProduct = useWatch({
    control,
    name: "product",
  });

  useEffect(() => {
    if (watchChannel) fetchInsurances({ channelId: watchChannel });
    resetField("insurance", { defaultValue: undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchChannel]);

  useEffect(() => {
    if (!watchInsurance) {
      return;
    }
    // if (watchInsurance) fetchProducts({ insuranceId: watchInsurance });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchInsurance]);

  useEffect(() => {
    // if (watchProduct) fetchPlans({ productId: watchProduct });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchProduct]);
  return (
    <div className="flex flex-col w-full">
      <div className="bg-white md:px-6 p-4 flex items-center">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/broker/partner-com">Partner Comm</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create Partner Comm</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
            Create Partner Comm
          </h2>
        </div>
        <div className="flex space-x-4 ml-auto">
          <div
            onClick={handleCancel}
            className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </div>
          <Button
            type="submit"
            onClick={handleSubmit(handleCreateBrokerFee)}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-5 rounded-full px-5"
          >
            <Check className="mr-2 w-4 h-4" />
            Save
          </Button>
        </div>
      </div>

      <div className="flex flex-col w-full p-4 md:p-6 gap-4">
        <div className="p-4 sm:p-6 bg-white rounded-lg flex-col gap-4 grid sm:grid-cols-2">

          <div>
            <label
              htmlFor="channel"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Channel Name
            </label>

            <Controller
              name="channel"
              control={control}
              rules={{ required: "Channel Name is required" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={(val) => {
                  setValue("insurance", "All");
                  field.onChange(val);

                }}>
                  <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                    <SelectValue placeholder="Select Channel " />
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
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="insurance"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Insurance Name
            </label>

            <Controller
              name="insurance"
              control={control}
              rules={{ required: "Insurance Name is required" }}
              render={({ field }) => (
                <Select value={field.value}
                  disabled={!watchChannel}
                  onValueChange={field.onChange}>
                  <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                    <SelectValue placeholder="Select Insurance " />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem key={-1} value={"All"}>
                        All
                      </SelectItem>
                      {insurances.map((insurance: any) => (
                        <SelectItem key={insurance.id} value={insurance.id}>
                          {insurance.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.insurance && (
              <p className="text-red-500 text-xs mt-1">
                {errors.insurance.message?.toString()}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="fee"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Fee
            </label>
            <Controller
              name="fee"
              control={control}
              rules={{ required: "Fee is required" }}
              render={({ field }) => (
                <Input
                  type="number"
                  className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2"
                  {...field}
                />
              )}
            />
            {errors.fee && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fee.message?.toString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateBrokerFeePageWithSidebar = (params: any) =>
  WithSidebar(CreatePartnerCom)(params);
export default CreateBrokerFeePageWithSidebar;
