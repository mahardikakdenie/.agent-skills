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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Check, ChevronLeft, Trash2, Upload } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useProduct } from "../hooks";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

const AddProduct = ({ params }: { params: { id: string } }) => {
  useRequireAuth();
  const router = useRouter();
  const { id } = params;
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const path = usePathname();
  const [name, setName] = useState("");
  const [insurance, setInsurance] = useState("");
  const [category, setCategory] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<any>(null);
  const [selectedInsurances, setSelectedInsurances] = useState<any>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedInsuranceId, setSelectedInsuranceId] = useState("");

  const searchParam = useSearchParams();

  const {
    saveProduct,
    categories = [],
    product = [],
    fetchCategories,
    insurances = [],
    fetchInsurances,
    fetchProduct,
  } = useProduct();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
    defaultValues: {
      name,
      categories: selectedCategories,
      insurances: selectedInsurances,
    },
    values: {
      name,
      category,
      insurance,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await saveProduct(data);
      setSaveSuccess(true);
    } catch (error) {
      setSaveSuccess(false);
    }
  };

  useEffect(() => {
    const insuranceId = searchParam.get("insurance-id") ?? "";
    const categoryId = searchParam.get("category-id") ?? "";
    setSelectedCategoryId(categoryId);
    setSelectedInsuranceId(insuranceId);

    const nameCategory = categories;

    fetchCategories({});
    fetchInsurances({});
    fetchProduct("", categoryId, insuranceId);
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

  useEffect(() => {
    if (product.length > 0) {
      reset({
        name: product[0].name,
      });
    }
  }, [product]);

  return (
    <div className="flex flex-col w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white md:px-6 p-4 flex items-center">
          <div>
            <Breadcrumb>
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
                    Product
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold text-2xl mt-2">Add Product</h2>
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
          <div className="p-6 bg-white rounded-lg flex-col gap-4 grid grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product Category
              </label>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Product Category is required" }}
                render={({ field }) => (
                  <Select
                    value={selectedCategoryId}
                    onValueChange={field.onChange}
                    disabled
                  >
                    <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                      <SelectValue placeholder="Select Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((categorie: any) => (
                          <SelectItem key={categorie.id} value={categorie.id}>
                            {categorie.name
                              .split("-")
                              .map(
                                (word: string) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category.message?.toString()}
                  error message
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
                  <Select
                    value={selectedInsuranceId}
                    onValueChange={field.onChange}
                    disabled
                  >
                    <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                      <SelectValue placeholder="Select Insurance " />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
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
                  error message
                </p>
              )}
            </div>
            <div className="col-span-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product Name <span className="text-red-500">*</span>
              </label>
              {product.length == 0 ? (
                <React.Fragment>
                  <div className="flex items-center">
                    <Controller
                      name="name"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Product Name is required" }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          id="name"
                          placeholder="Insert Product Name"
                          {...field}
                          className={`mt-1 block w-full h-12 ${
                            errors.name ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm`}
                        />
                      )}
                    />
                    <Button
                      className="text-red-500 hover:bg-transparent"
                      variant="ghost"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </React.Fragment>
              ) : (
                product.map((item, index) => (
                  <React.Fragment key={index}>
                    <div className="flex items-center">
                      <Controller
                        name="name"
                        control={control}
                        defaultValue={item.name}
                        rules={{ required: "Product Name is required" }}
                        render={({ field }) => (
                          <Input
                            type="text"
                            id="name"
                            placeholder="Insert Product Name"
                            {...field}
                            className={`mt-1 block w-full h-12 ${
                              errors.name ? "border-red-500" : "border-gray-300"
                            } rounded-md shadow-sm`}
                          />
                        )}
                      />
                      <Button
                        className="text-red-500 hover:bg-transparent"
                        variant="ghost"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </React.Fragment>
                ))
              )}
            </div>
            {categories && categories.length > 0 && (
              <div className="col-span-2">
                <Button onClick={(e) => e.preventDefault()}>Add Product</Button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

const AddProductWithSidebar = (params: any) => WithSidebar(AddProduct)(params);
export default AddProductWithSidebar;
