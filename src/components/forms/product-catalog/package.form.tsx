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
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Check, ChevronLeft } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z, ZodSchema, ZodTypeAny } from "zod";
import validator from "validator";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PRODUCT_CATALOG_CATEGORY,
  PRODUCT_CATALOG_DETAIL,
} from "@/constants/routes";
import { useProducts } from "@/app/protected/product-catalog/hooks";
import { FieldArrayInput } from "./field-array-input";

type FormFieldType = {
  label: string;
  type: "string" | "number" | "array" | "table" | "range";
  name: string;
}[];

function generateZodSchema(obj: Record<string, any>): ZodSchema<any> {
  const shape: Record<string, ZodTypeAny> = {
    premium: z
      .string()
      .min(1)
      .refine((val) => {
        const numeric = val.replace(/\./g, "");
        return validator.isNumeric(numeric);
      }),
    currency: z.string().min(1),
  };

  for (const key in obj) {
    const field = obj[key];
    let schema: ZodTypeAny;

    switch (field.type) {
      case "string":
        schema = z.string().min(1);
        break;
      case "number":
        schema = z
          .string()
          .min(1)
          .refine((val) => {
            const numeric = val.replace(/\./g, "");
            return validator.isNumeric(numeric);
          });
        break;
      case "array":
        schema = z.array(z.string().min(1)).min(1);
        break;
      case "table":
        schema = z.array(z.string().min(1)).min(1);
        break;
      case "range":
        schema = z.object({
          from: z
            .string()
            .min(1)
            .refine((val) => {
              const numeric = val.replace(/\./g, "");
              return validator.isNumeric(numeric);
            }),
          to: z
            .string()
            .min(1)
            .refine((val) => {
              const numeric = val.replace(/\./g, "");
              return validator.isNumeric(numeric);
            }),
        });
        break;
      default:
        schema = z.any();
    }

    shape[key] = schema;
  }

  return z.object(shape);
}

function generateFormFields(config: Record<string, any>): FormFieldType {
  const fields: FormFieldType = [];

  for (const key in config) {
    const field = config[key];

    fields.push({
      label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      type: field.type,
      name: key,
    });
  }

  return fields;
}

function generateDefaultValues(obj: Record<string, any>): Record<string, any> {
  const defaultValues: Record<string, any> = {
    premium: "0",
    currency: "",
  };

  for (const key in obj) {
    const field = obj[key];

    switch (field.type) {
      case "string":
      case "number":
        defaultValues[key] = "";
        break;
      case "array":
      case "table":
        defaultValues[key] = [""];
        break;
      case "range":
        defaultValues[key] = { from: "", to: "" };
        break;
      default:
        defaultValues[key] = null;
    }
  }

  return defaultValues;
}

export function formatCurrency(value: string) {
  const numericValue = value.replace(/\D/g, "");

  return new Intl.NumberFormat("id-ID").format(Number(numericValue));
}

function getAttributeWithRangeType(obj: Record<string, any>): string[] {
  const result: string[] = [];
  
  for (const key in obj) {
    const value = obj[key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const hasFrom = 'from' in value;
      const hasTo = 'to' in value;

      if (hasFrom && hasTo) {
        result.push(key);
      }

      // Recursively check nested objects if needed
      const nested = getAttributeWithRangeType(value);
      result.push(...nested.map(n => `${key}.${n}`));
    }
  }

  return result;
}

const ProductCategoryPackageForm = ({
  method,
  productCategoryID,
  category,
  packageID,
}: {
  method: "create" | "update";
  productCategoryID: string;
  category: string;
  packageID?: string;
}) => {
  const router = useRouter();

  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const [schema, setSchema] = useState<ZodSchema<any>>();
  const [defaultValues, setDefaultValues] = useState<Record<string, any>>({});
  const [formFields, setFormFields] = useState<FormFieldType>([]);

  const {
    savePackage,
    updatePackage,
    fetchProductConfigByType,
    productConfig,
    fetchPackageById,
    packageDetail,
  } = useProducts();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues,
    resolver: schema ? zodResolver(schema) : undefined,
  });

  useEffect(() => {
    if (category) {
      (async () => {
        await fetchProductConfigByType(category);
      })();
    }
  }, [category]);

  useEffect(() => {
    if (productConfig) {
      const newSchema = generateZodSchema(productConfig.search_configs);
      const newFormFields = generateFormFields(productConfig.search_configs);
      const newDefaultValues = generateDefaultValues(
        productConfig.search_configs
      );

      setSchema(newSchema);
      setFormFields(newFormFields);

      if (method === "create") {
        setDefaultValues(newDefaultValues);
      }
    }
  }, [productConfig, method]);

  useEffect(() => {
    if (Object.keys(defaultValues).length > 0) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    if (packageID) {
      (async () => {
        await fetchPackageById(packageID);
      })();
    }
  }, [packageID]);

  useEffect(() => {
    if (packageDetail) {
      setValue("currency", packageDetail.currency);
      setValue("premium", formatCurrency(packageDetail.premium.toString()));

      for (const key in packageDetail.search_params) {
        if (key.includes("_from") || key.includes("_to")) {
          const keyArray = key.split("_");

          setValue(
            `${keyArray[0]}.from`,
            packageDetail.search_params[`${keyArray[0]}_from`].toString()
          );
          setValue(
            `${keyArray[0]}.to`,
            packageDetail.search_params[`${keyArray[0]}_to`].toString()
          );
        } else {
          let value = packageDetail.search_params[key];

          if (typeof value === 'number') {
            value = value.toString();
          }

          setValue(key, value);
        }
      }
    }
  }, [packageDetail]);

  const onSubmit = async (data: any) => {
    const attributesWithRange = getAttributeWithRangeType(data);
    const newSearchParams = { 
        ...data,
    };
    delete newSearchParams.premium;
    delete newSearchParams.currency;
    delete newSearchParams[attributesWithRange[0]];

    if(attributesWithRange.length > 0) {
        newSearchParams[`${attributesWithRange[0]}_from`] = data[attributesWithRange[0]].from;
        newSearchParams[`${attributesWithRange[0]}_to`] = data[attributesWithRange[0]].to;
    }

    const mappedData = {
      plan: productCategoryID,
      premium: data.premium.replace(/\./g, ""),
      currency: data.currency,
      search_params: newSearchParams,
    };

    try {
      if (method === "update" && packageID) {
        await updatePackage(packageID, mappedData);
      } else {
        await savePackage(mappedData);
      }

      setSaveSuccess(true);
    } catch (error) {
      setSaveSuccess(false);
    }
  };

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
                  <BreadcrumbLink>Product Catalog</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={PRODUCT_CATALOG_CATEGORY(category)}>
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
                  <BreadcrumbLink
                    href={PRODUCT_CATALOG_DETAIL(category, productCategoryID)}
                  >
                    Detail Product Catalog
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {method === "create" ? "Add" : "Edit"} Package
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
              {method === "create" ? "Add" : "Edit"} Package
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
                htmlFor="premium"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Premium
              </label>
              <Controller
                name="premium"
                control={control}
                defaultValue="0"
                render={({ field }) => (
                  <Input
                    type="text"
                    id="premium"
                    placeholder="Insert Premium"
                    value={field.value}
                    onChange={(e) => {
                      const formatted = formatCurrency(e.target.value);

                      field.onChange(formatted);
                    }}
                    className={`mt-1 block w-full h-12 ${
                      errors.premium ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm`}
                  />
                )}
              />
              {errors.premium && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.premium.message as string}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Currency
              </label>
              <Controller
                name="currency"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    type="text"
                    id="currency"
                    placeholder="Insert Currency"
                    {...field}
                    className={`mt-1 block w-full h-12 ${
                      errors.currency ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm`}
                  />
                )}
              />
              {errors.currency && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.currency.message as string}
                </p>
              )}
            </div>
            {formFields.map((ff) => {
              if (ff.type === "array" || ff.type === "table") {
                return (
                  <FieldArrayInput
                    key={ff.name}
                    control={control}
                    errors={errors}
                    label={ff.label}
                    name={ff.name}
                  />
                );
              } else if (
                ff.type === "string" ||
                ff.type === "number" ||
                ff.type === "range"
              ) {
                return (
                  <div key={ff.name}>
                    <label
                      htmlFor={ff.name}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {ff.label}
                    </label>
                    {(ff.type === "string" || ff.type === "number") && (
                      <div>
                        <Controller
                          name={ff.name}
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Input
                              type="text"
                              id={ff.name}
                              placeholder={`Insert ${ff.label}`}
                              {...field}
                              className={`mt-1 block w-full h-12 ${
                                errors[ff.name]
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-md shadow-sm`}
                            />
                          )}
                        />
                        <p className="text-red-500 text-xs mt-1">
                          {errors[ff.name]?.message as string}
                        </p>
                      </div>
                    )}
                    {ff.type === "range" && (
                      <div className="flex gap-x-4 items-center">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          From
                        </label>
                        <div className="w-full">
                          <Controller
                            name={`${ff.name}.from`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <Input
                                type="text"
                                id={`${ff.name}.from`}
                                placeholder="From"
                                {...field}
                                className={`mt-1 block w-full h-12 ${
                                  (errors[ff.name] as any)?.from
                                    ? "border-red-500"
                                    : "border-gray-300"
                                } rounded-md shadow-sm`}
                              />
                            )}
                          />
                          <p className="text-red-500 text-xs mt-1">
                            {(errors[ff.name] as any)?.from?.message}
                          </p>
                        </div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          To
                        </label>
                        <div className="w-full">
                          <Controller
                            name={`${ff.name}.to`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <Input
                                type="text"
                                id={`${ff.name}.to`}
                                placeholder="To"
                                {...field}
                                className={`mt-1 block w-full h-12 ${
                                  (errors[ff.name] as any)?.to
                                    ? "border-red-500"
                                    : "border-gray-300"
                                } rounded-md shadow-sm`}
                              />
                            )}
                          />
                          <p className="text-red-500 text-xs mt-1">
                            {(errors[ff.name] as any)?.to?.message}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductCategoryPackageForm;
