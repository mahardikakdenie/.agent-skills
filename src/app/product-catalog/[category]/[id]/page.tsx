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

const DetaildPage = ({
  params,
}: {
  params: { id: string; category: string };
}) => {
  useRequireAuth();
  const { id } = params;
  const [selectedInsurance, setSelectedInsurance] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [name, setName] = useState("");

  const [currency, setCurrency] = useState("");

  const [slug, setSlug] = useState("");

  const {
    fetchInsurances,
    insurances,
    products,
    fetchProducts,
    savePlan,
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
    values: {
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
    await savePlan(data);
  };

  return (
    <>
      <div className="p-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
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
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
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
              <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="insuranceId"
              className="block text-sm font-medium text-gray-700"
            >
              Insurance
            </label>
            <Controller
              name="insuranceId"
              control={control}
              rules={{ required: "Insurance ID is required" }}
              render={({ field }) => (
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Insurance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Insurances</SelectLabel>
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
            {errors.insuranceId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.insuranceId.message?.toString()}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="productId"
              className="block text-sm font-medium text-gray-700"
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

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
      <PackageList id={id} />
    </>
  );
};

const DetailProductCatalogWithSidebar = (params: any) =>
  WithSidebar(DetaildPage)(params);
export default DetailProductCatalogWithSidebar;
