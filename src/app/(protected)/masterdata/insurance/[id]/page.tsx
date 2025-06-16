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
import WithSidebar from "@/hoc/with-sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Check, ChevronLeft } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useInsurance } from "../hooks";
import { hasPermission } from "@/context/auth.context";

const EditInsuranceProduct = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;
  const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null);
  const path = usePathname();

  const [name] = useState("");
  const [brand, setBrand] = useState("");
  const [country, setCountry] = useState("");
  const [logo_url, setLogoUrl] = useState("");
  const [insuranceData, setInsuranceData] = useState();

  const { updateInsurance, fetchInsuranceById } = useInsurance();

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const access = await hasPermission("Masterdata.Update");
      setHasAccess(access);
      if (!access) {
        router.push("/forbidden");
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
      name,
      brand,
      country,
      logo_url,
    },
    values: {
      name,
      brand,
      country,
      logo_url,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const id = params.id;
      await updateInsurance(data, id);
      setUpdateSuccess(true);
    } catch (error) {
      setUpdateSuccess(false);
    }
  };

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await fetchInsuranceById(id);
          setInsuranceData(res);
          setValue("name", res.data.name);
          setValue("brand", res.data.brand);
          setValue("logo_url", res.data.logo_url);
          setValue("country", res.data.country);
        } catch (error) {
          console.error("Error fetching category by ID:", error);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setValue]);

  useEffect(() => {
    if (updateSuccess === true) {
      alert("Data berhasil disimpan!");
      router.back();
    } else if (updateSuccess === false) {
      alert("Terjadi kesalahan saat menyimpan data.");
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
                    Insurance
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Detail</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold sn:text-2xl text-lg sm:mt-2">
              Detail Insurance
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
          <div className="p-4 sm:p-6 bg-white rounded-lg gap-4 grid sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Insurance Name
              </label>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: "Insurance Name is required" }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="name"
                    placeholder="Insert Insurance Name"
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
                htmlFor="logo_url"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Logo
              </label>
              <Controller
                name="logo_url"
                control={control}
                defaultValue=""
                // rules={{ required: "Logo is required" }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="logo_url"
                    placeholder="Insert Logo"
                    {...field}
                    className={`mt-1 block w-full h-12 ${
                      errors.logo_url ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm`}
                  />
                )}
              />
              {errors.logo_url && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.logo_url.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="brand"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Brand
              </label>
              <Controller
                name="brand"
                control={control}
                defaultValue=""
                // rules={{ required: "Brand is required" }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="brand"
                    placeholder="Insert Brand"
                    {...field}
                    className={`mt-1 block w-full h-12 ${
                      errors.brand ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm`}
                  />
                )}
              />
              {errors.brand && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.brand.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Country
              </label>
              <Controller
                name="country"
                control={control}
                defaultValue=""
                // rules={{ required: "Country is required" }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="country"
                    placeholder="Insert Country"
                    {...field}
                    className={`mt-1 block w-full h-12 ${
                      errors.country ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm`}
                  />
                )}
              />
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const EdiInsuranceProductWithSidebar = (params: any) =>
  WithSidebar(EditInsuranceProduct)(params);
export default EdiInsuranceProductWithSidebar;
