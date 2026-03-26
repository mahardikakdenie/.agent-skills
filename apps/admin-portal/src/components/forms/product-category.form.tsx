"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Check, ChevronLeft } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import validator from "validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategories } from "@/app/masterdata/product-category/hooks";

const schema = z.object({
  name: z
    .string()
    .min(1, "Category Name harus diisi.")
    .transform((val) => validator.escape(val.trim())),

  icon: z
    .string()
    .min(1, "Category Icon harus diisi.")
    .refine((val) => validator.isURL(val), {
      message: "Category Icon harus merupakan sebuah URL valid.",
    })
    .transform((val) => val.trim()),
});

type SchemaType = z.infer<typeof schema>;

const ProductCategoryForm = ({
  method,
  id,
}: {
  method: "create" | "update";
  id?: string;
}) => {
  const router = useRouter();

  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);

  const { updateCategories, fetchCategoriesById, saveCategories } =
    useCategories();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SchemaType>({
    shouldUnregister: false,
    defaultValues: {
      name: "",
      icon: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      if (method === "update" && id) {
        await updateCategories(data, id);
      } else {
        await saveCategories(data);
      }

      setSaveSuccess(true);
    } catch (error) {
      setSaveSuccess(false);
    }
  };

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await fetchCategoriesById(id);

          setValue("name", res.name);
          setValue("icon", res.icon ?? "");
        } catch (error) {
          console.error("Error fetching category by ID:", error);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setValue]);

  useEffect(() => {
    if (saveSuccess === true) {
      alert("Data berhasil disimpan!");

      router.back();

      setTimeout(() => {
        window.location.reload();
      }, 100);
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
                    Product Category
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {method === "create" ? "Add" : "Edit"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
              {method === "create" ? "Add" : "Edit"} Product Category
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
                Category Name
              </label>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{
                  required: "Category Name is required",
                }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="name"
                    placeholder="Insert Category Name"
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
                htmlFor="icon"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category Icon
              </label>
              <Controller
                name="icon"
                control={control}
                defaultValue=""
                rules={{
                  required: "Category Icon is required",
                }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="icon"
                    placeholder="Insert Category Icon"
                    {...field}
                    className={`mt-1 block w-full h-12 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm`}
                  />
                )}
              />
              {errors.icon && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.icon.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductCategoryForm;
