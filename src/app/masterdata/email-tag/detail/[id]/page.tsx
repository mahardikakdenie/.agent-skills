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
import { useEmailTag } from "../../hooks";
import { useAuth } from "@/context/auth.context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FORBIDDEN } from "@/constants/routes";

export default function EditEmailTag({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null);
  const path = usePathname();

  const [tag, setTag] = useState("");
  const [journey, setJourney] = useState("");

  const { updateEmailTag, fetchEmailTagById, journeys, fetchJourney } =
    useEmailTag();

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const { permissionList } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Masterdata.Update");
      setHasAccess(access);
      if (!access) {
        router.push(FORBIDDEN);
      }
    };

    checkAccess();
  }, [router]);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
    defaultValues: {
      id,
      tag,
      journey,
    },
  });

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await fetchEmailTagById(id);
          setTag(res.tag);
          setValue("tag", res.data.tag);
          setValue("journey", res.data.journey);
        } catch (error) {
          console.error("Error fetching category by ID:", error);
        }
      })();
    }
    fetchJourney({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setValue]);

  const onSubmit = async (data: any) => {
    try {
      const id = params.id;
      await updateEmailTag(data, id);
      setUpdateSuccess(true);
    } catch (error) {
      setUpdateSuccess(false);
    }
  };

  useEffect(() => {
    if (updateSuccess === true) {
      alert("Data has been successfully saved!");
      router.back();
    } else if (updateSuccess === false) {
      alert("Email Tag has already been used for this Journey!");
    }
    setUpdateSuccess(null);
  }, [updateSuccess, router]);

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
                    Email Tag
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
              Add Email Tag
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
          <div className="p-4 sm:p-6 bg-white rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="journey"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Journey<span className="text-red-500">*</span>
              </label>
              <Controller
                name="journey"
                control={control}
                rules={{ required: "Journey is required" }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                      <SelectValue placeholder="Select Journey" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {journeys.map((jour: any) => (
                          <SelectItem key={jour.id} value={jour.code}>
                            {jour.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.journey && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.journey.message?.toString()}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="tag"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Tag Name<span className="text-red-500">*</span>
              </label>
              <Controller
                name="tag"
                control={control}
                defaultValue=""
                rules={{ required: "Email Tag Name is required" }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="tag"
                    placeholder="Insert Email Tag"
                    {...field}
                    className={`mt-1 block w-full h-12 ${
                      errors.tag ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm`}
                  />
                )}
              />
              {errors.tag && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.tag.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};