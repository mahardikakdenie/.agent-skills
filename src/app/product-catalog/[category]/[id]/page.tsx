"use client";
import WithSidebar from "@/hoc/with-sidebar";
import useRequireAuth from "@/hooks/useRequireAuth";
import {
  ProductCatalogDto,
  ProductCatalogService,
} from "@/services/product-catalog.service";
import { useEffect, useState } from "react";
import PackageList from "./package-list";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useProducts } from "../../hooks";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
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

const DetaildPage = ({
  params,
}: {
  params: { id: string; category: string };
}) => {
  useRequireAuth();
  const router = useRouter();
  const { category, id } = params;
  const [selectedInsurance, setSelectedInsurance] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const [name, setName] = useState("");

  const [currency, setCurrency] = useState("");

  const [slug, setSlug] = useState("");

  const {
    fetchInsurances,
    insurances,
    products,
    fetchProducts,
    updatePlan,
    fetchPlanById,
    plan,
  } = useProducts();

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
    },
  });

  useEffect(() => {
    if (id) {
      (async () => {
        await fetchInsurances({});
        await fetchPlanById(id);
      })();
    }
  }, [id]);

  useEffect(() => {
    if (plan === null || insurances.length === 0) {
      return;
    }

    fetchProducts({ insuranceId: plan.products.insurances.id });
    setValue("name", plan.name);
    setValue("slug", plan.slug);
    setValue("insuranceId", plan.products.insurances.id);
  }, [plan, insurances]);

  useEffect(() => {
    if (plan === null && products.length === 0) {
      return;
    }
    setValue("productId", plan.product);
  }, [plan, products]);

  const onSubmit = async (data: any) => {
    try {
      const id = params.id;
      await updatePlan(data, id);
      setSaveSuccess(true);
    } catch (error) {
      setSaveSuccess(false);
    }
  };

  useEffect(() => {
    if (saveSuccess === true) {
      alert("Data berhasil disimpan!");
      router.push(`/product-catalog/${category}`);
    } else if (saveSuccess === false) {
      alert("Terjadi kesalahan saat menyimpan data.");
    }
    setSaveSuccess(null);
  }, [saveSuccess, router, category]);

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="bg-white md:px-6 p-4 flex items-center">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink>Product Catalog</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/product-catalog/${category}`}>
                    {category
                      .split("-")
                      .map(
                        (item) =>
                          item.charAt(0).toUpperCase() + item.slice(1) + " "
                      )}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Detail Product Catalog</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold text-2xl mt-2">
              Detail Product Catalog
            </h2>
          </div>
          <div
            onClick={() => router.back()}
            className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali
          </div>
        </div>
        <div className="flex flex-col w-full p-4 md:p-6 gap-4">
          <div className="p-6 bg-white rounded-lg flex flex-col gap-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4 mb-4">
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
                        placeholder="Plan Name"
                        {...field}
                        className={`mt-1 block w-full ${
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
                        placeholder="Slug"
                        {...field}
                        className={`mt-1 block w-full ${
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
                    control={control}
                    rules={{ required: "Insurance ID is required" }}
                    render={({ field }) => (
                      <Select {...field}>
                        <SelectTrigger>
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
                    control={control}
                    defaultValue=""
                    rules={{ required: "Product ID is required" }}
                    render={({ field }) => (
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger>
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
              </div>

              <button
                type="submit"
                className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-6 py-3"
              >
                Submit
              </button>
            </form>
          </div>
          <div className="w-full overflow-auto">
            <PackageList id={id} />
          </div>
        </div>
      </div>
    </>
  );
};

const DetailProductCatalogWithSidebar = (params: any) =>
  WithSidebar(DetaildPage)(params);
export default DetailProductCatalogWithSidebar;
