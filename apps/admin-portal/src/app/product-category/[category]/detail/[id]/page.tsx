"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "../../../hooks";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@repo/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronLeft } from "react-feather";
import ProductDetatilTab from "./product-detail-tab";
import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import { ContentLoadingWrapper } from "@/components/ui/Loading/index";

export default function DetaildPage({
  params,
}: {
  params: Promise<{ id: string; category: string }>;
}) {
  const router = useRouter();
  const { category, id } = React.use(params);
  const [selectedInsurance, setSelectedInsurance] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [canCreate, setCanCreate] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);
  const { permissionList } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Product Category.Read");
      const editBtn = permissionList.includes("Product Category.Update");
      const deleteBtn = permissionList.includes("Product Category.Delete");
      const createBtn = permissionList.includes("Product Category.Create");

      setCanEdit(editBtn);
      setCanDelete(deleteBtn);
      setHasAccess(access);
      setCanCreate(createBtn);
      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router]);

  const {
    isLoadingPlan,
    isLoadingUpdatePlan,
    insurances,
    updatePlan,
    plan,
    fetchProducts,
    getProductByCategoryId,
  } = useProducts({
    planId: id,
    category,
  });

  const products = getProductByCategoryId();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    shouldUnregister: false,
    defaultValues: {
      insuranceId: selectedInsurance,
      productId: selectedProduct,
      name,
      slug,
      active_period: "",
      active_period_unit: "",
    },
  });

  useEffect(() => {
    if (plan === null || insurances.length === 0) {
      return;
    }

    if (plan) {
      fetchProducts({ insuranceId: plan.products.insurances.id });
      setValue("name", plan.name);
      setValue("slug", plan.slug);
      setValue("insuranceId", plan.products.insurances.id);
      setValue("active_period", plan.active_period || "");
      setValue("active_period_unit", plan.active_period_unit || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, insurances]);

  useEffect(() => {
    if (plan === null && products.length === 0) {
      return;
    }

    if (plan) {
      setValue("productId", plan.product);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, products]);

  const onSubmit = async (data: any) => {
    try {
      await updatePlan({ data, id });
    } catch (error) {
      console.log(error, "DY: error update plan");
    }
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="bg-white md:px-6 p-4 flex items-center">
          <div>
            <Breadcrumb className="sm:block hidden">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink>Product Catalog</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={AppURL.productCatalogCategoryV2(category)}
                  >
                    {category
                      .split("-")
                      .map(
                        (item) =>
                          item.charAt(0).toUpperCase() + item.slice(1) + " ",
                      )}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Detail Product Catalog</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
              Detail Product Catalog
            </h2>
          </div>
          <div
            onClick={() => router.back()}
            className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </div>
        </div>
        <div className="flex flex-col w-full p-4 md:p-6 gap-4">
          <ContentLoadingWrapper
            isLoading={isLoadingUpdatePlan || isLoadingPlan}
          >
            <div className="sm:p-6 p-4 bg-white rounded-lg flex flex-col gap-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Plan Name
                    </label>
                    <Controller
                      name="name"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Plan Name is required" }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          id="name"
                          disabled={!canEdit}
                          placeholder="Plan Name"
                          {...field}
                          className={`mt-1 block w-full h-16 ${
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
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Slug
                    </label>
                    <Controller
                      name="slug"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Slug is required" }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          id="slug"
                          disabled={!canEdit}
                          placeholder="Slug"
                          {...field}
                          className={`mt-1 block w-full h-16 ${
                            errors.name ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm`}
                        />
                      )}
                    />
                    {errors.slug && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.slug.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="insuranceId"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Insurance
                    </label>
                    <Controller
                      name="insuranceId"
                      disabled={!canEdit}
                      control={control}
                      rules={{ required: "Insurance ID is required" }}
                      render={({ field }) => (
                        <Select {...field}>
                          <SelectTrigger className="h-16">
                            <SelectValue placeholder="Select Insurance" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Insurances</SelectLabel>
                              {insurances.map((insurance: any) => (
                                <SelectItem
                                  key={insurance.id}
                                  value={insurance.id}
                                >
                                  {insurance.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.insuranceId && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.insuranceId.message?.toString()}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="productId"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Product
                    </label>
                    <Controller
                      name="productId"
                      disabled={!canEdit}
                      control={control}
                      defaultValue=""
                      rules={{ required: "Product ID is required" }}
                      render={({ field }) => (
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger className="h-16">
                            <SelectValue placeholder="Select Product" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Products</SelectLabel>
                              {products.map((product: any) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.productId && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.productId.message?.toString()}
                      </p>
                    )}
                  </div>
                  {/* <div>
                  <label
                    htmlFor="active_period"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Active Period
                  </label>
                  <Controller
                    name="active_period"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Active Period is required" }}
                    render={({ field }) => (
                      <Input
                        type="number"
                        id="active_period"
                        disabled={!canEdit}
                        placeholder="Active Period"
                        {...field}
                        className={`mt-1 block w-full h-16 ${
                          errors.active_period
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm`}
                      />
                    )}
                  />
                  {errors.active_period && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.active_period.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="active_period_unit"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Active Period Unit
                  </label>
                  <Controller
                    name="active_period_unit"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Active Period Unit is required" }}
                    render={({ field }) => (
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger className="h-16">
                          <SelectValue placeholder="Select Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Units</SelectLabel>
                            <SelectItem value="day">Days</SelectItem>
                            <SelectItem value="week">Weeks</SelectItem>
                            <SelectItem value="month">Months</SelectItem>
                            <SelectItem value="year">Years</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.active_period_unit && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.active_period_unit.message?.toString()}
                    </p>
                  )}
                </div> */}
                </div>

                <button
                  type="submit"
                  disabled={!canEdit}
                  className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-6 py-3"
                >
                  Submit
                </button>
              </form>
            </div>
          </ContentLoadingWrapper>
          <div className="w-full overflow-auto">
            <ProductDetatilTab id={id} category={category} />
          </div>
        </div>
      </div>
    </>
  );
}
