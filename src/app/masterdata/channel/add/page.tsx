"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Check, ChevronLeft } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth.context";
import { useChannels } from "../hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AppURL from "@/constants/app-url.const";

export default function AddChannels({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const path = usePathname();

  const [name, setName] = useState("");
  const [type, setType] = useState("");

  const { saveChannels } = useChannels();

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const { permissionList } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Masterdata.Create");
      setHasAccess(access);
      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
    defaultValues: {
      name,
      type,
    },
    values: {
      name,
      type,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await saveChannels(data);
      setSaveSuccess(true);
    } catch (error) {
      setSaveSuccess(false);
    }
  };

  useEffect(() => {
    if (saveSuccess === true) {
      alert("Data berhasil disimpan!");
      router.back();
    } else if (saveSuccess === false) {
      alert("Terjadi kesalahan saat menyimpan data.");
    }
    setSaveSuccess(null);
  }, [saveSuccess, router]);

  const handleChangeType = (value: string) => {
    setType(value);
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
                    Channels
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
              Add Channels
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
          <div className="p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Channels Name<span className="text-red-500">*</span>
              </label>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: "Channels Name is required" }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="name"
                    placeholder="Insert Channels Name"
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
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Status<span className="text-red-500">*</span>
              </label>
              <Controller
                name="type"
                control={control}
                defaultValue=""
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={type}
                    onValueChange={handleChangeType}
                  >
                    <SelectTrigger
                      className={`w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2`}
                    >
                      <SelectValue placeholder="Select Type">
                        {type}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Internal">Internal</SelectItem>
                      <SelectItem value="External">External</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};