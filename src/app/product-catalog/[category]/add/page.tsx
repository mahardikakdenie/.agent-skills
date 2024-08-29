"use client";
import { FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import WithSidebar from "@/hoc/with-sidebar";
import { SelectValue } from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import { Controller, Form, useForm } from "react-hook-form";
import { useProducts } from "../../hooks";

const AddPlanPage = (params: { category: string }) => {
  const { category } = params;
  const [selectedInsurance, setSelectedInsurance] = useState<any>(null);
  const handleChangeInsurance = (e: any) => {
    setSelectedInsurance(e);
  };
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleChangeProduct = (e: any) => {
    setSelectedProduct(e);
  };

  const [name, setName] = useState("");
  const handleChangeName = (e: any) => {
    setName(e.target.value);
  };

  const [currency, setCurrency] = useState("");
  const handleChangeCurrency = (e: any) => {
    setCurrency(e.target.value);
  };

  const [slug, setSlug] = useState("");
  const handleChangeSlug = (e: any) => {
    setSlug(e.target.value);
  };

  const { fetchInsurances, insurances, products, fetchProducts, savePlan } =
    useProducts();
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    register,
    getValues,
  } = useForm({
    defaultValues: {
      insuranceId: selectedInsurance,
      productId: selectedProduct,
      name,
      currency,
      slug,
    },
    values: {
      insuranceId: selectedInsurance,
      productId: selectedProduct,
      name,
      currency,
      slug,
    },
  });

  useEffect(() => {
    // Fetch products
    fetchInsurances({});
  }, []);

  useEffect(() => {
    // Fetch products
    console.log(watch("insuranceId"));
    if (watch("insuranceId"))
      fetchProducts({ insuranceId: watch("insuranceId") });
  }, [watch("insuranceId")]);
  const onSubmit = async (data: any) => {
    await savePlan(data);
  };

  return (
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
                    <SelectLabel>Products</SelectLabel>
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

        <div className="mb-4">
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-gray-700"
          >
            Currency
          </label>
          <Controller
            name="currency"
            control={control}
            defaultValue=""
            rules={{ required: "Currency is required" }}
            render={({ field }) => (
              <Input
                type="text"
                id="currency"
                placeholder="Currency"
                {...field}
                className={`mt-1 block w-full ${
                  errors.currency ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm`}
              />
            )}
          />
          {errors.currency && (
            <p className="text-red-500 text-xs mt-1">
              {errors.currency.message}
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
  );
};

const AddPlanPageWithSidebar = (params: any) =>
  WithSidebar(AddPlanPage)(params);
export default AddPlanPageWithSidebar;
