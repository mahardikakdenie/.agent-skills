"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui";
import { Input } from "@repo/ui";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Check, ChevronLeft, Plus, Trash } from "react-feather";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { Button } from "@repo/ui";
import { z } from "zod";
import validator from "validator";
import { zodResolver } from "@hookform/resolvers/zod";
import AppURL from "@/constants/app-url.const";
import { useProducts } from "@/app/product-category/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { ContentLoadingWrapper } from "../../ui/loading";
import { toastNotification } from "@/lib/toast";

const schema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      benefit: z
        .string()
        .min(1)
        .transform((val) => validator.trim(val)),
      value: z
        .string()
        .optional()
        .transform((val) => validator.trim(val ?? "")),
      currency: z
        .string()
        .optional()
        .transform((val) => validator.trim(val ?? "")),
      subBenefits: z.array(schema).optional().default([]),
    })
    .refine(
      (data) =>
        data.subBenefits.length > 0 ||
        (data.value &&
          data.currency &&
          data.value !== "" &&
          data.currency !== ""),
      {
        message:
          "Value and Currency are required if this benefit does not have any sub-benefits",
        path: ["value"], // Highlight the value field in error
      }
    )
);

type SchemaType = z.infer<typeof schema>;

const defaultValues: SchemaType = {
  benefit: "",
  value: "",
  currency: "",
  subBenefits: [],
};

const RecursiveBenefitForm = ({ name }: { name: string }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `${name}.subBenefits` as const,
  });

  const getPath = (key: string) => (name ? `${name}.${key}` : key);
  const getNestedError = (errors: any, path: string) => {
    if (!path) return errors;

    return path.split(".").reduce((acc, key) => acc?.[key], errors);
  };
  const currentErrors = getNestedError(errors, name);
  const tierLevel = name
    ? name.split(".").filter((v) => v === "subBenefits").length
    : 0;

  return (
    <div className={`flex flex-col w-full ${name ? "" : "p-4 md:p-6"} gap-4`}>
      <div
        className={`${
          name ? "" : "p-4 md:p-6"
        } bg-white rounded-lg flex flex-col gap-4`}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Benefit
          </label>
          <Controller
            name={getPath("benefit")}
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Insert Benefit"
                {...field}
                className={`mt-1 block w-full h-12 ${
                  currentErrors?.benefit ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm`}
              />
            )}
          />
          <p className="text-red-500 text-xs mt-1">
            {currentErrors?.benefit?.message as string}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value
          </label>
          <Controller
            name={getPath("value")}
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Insert Value"
                {...field}
                className={`mt-1 block w-full h-12 ${
                  currentErrors?.value ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm`}
              />
            )}
          />
          <p className="text-red-500 text-xs mt-1">
            {currentErrors?.value?.message as string}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <Controller
            name={getPath("currency")}
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Insert Currency"
                {...field}
                className={`mt-1 block w-full h-12 ${
                  currentErrors?.currency ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm`}
              />
            )}
          />
          <p className="text-red-500 text-xs mt-1">
            {currentErrors?.currency?.message as string}
          </p>
        </div>
      </div>
      {fields.map((field, i) => (
        <Card key={field.id}>
          <CardHeader className="p-4 pb-0">
            <div className="flex justify-between">
              <p>Sub-{tierLevel}</p>
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(i)}
              >
                <Trash />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <RecursiveBenefitForm name={`${getPath("subBenefits")}.${i}`} />
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="default"
          onClick={() =>
            append({ benefit: "", value: "", currency: "", subBenefits: [] })
          }
        >
          <Plus /> Add Sub
        </Button>
      </div>
    </div>
  );
};

const ProductCategoryBenefitForm = ({
  method,
  productCategoryID,
  category,
  benefitID,
}: {
  method: "create" | "update";
  productCategoryID: string;
  category: string;
  benefitID?: string;
}) => {
  const router = useRouter();

  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);

  const { saveBenefit, isLoadingSaveBenefit } = useProducts();

  const form = useForm<SchemaType>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: SchemaType) => {
    const mappedData = {
      category,
      productCatalogueId: productCategoryID,
      benefitDetail: {
        ...data,
      },
    };

    try {
      if (method === "update" && benefitID) {
        //
      } else {
        await saveBenefit(mappedData);
      }

      setSaveSuccess(true);
    } catch (error) {
      console.error(error);

      setSaveSuccess(false);
    }
  };

  useEffect(() => {
    if (saveSuccess === true) {
      router.back();
    }

    setSaveSuccess(null);
  }, [saveSuccess, router]);

  return (
    <ContentLoadingWrapper isLoading={isLoadingSaveBenefit}>
      <div className="flex flex-col w-full">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                              item.charAt(0).toUpperCase() + item.slice(1) + " "
                          )}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href={AppURL.productCatalogDetail(
                          category,
                          productCategoryID
                        )}
                      >
                        Detail Product Catalog
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {method === "create" ? "Add" : "Edit"} Benefit
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
                  {method === "create" ? "Add" : "Edit"} Benefit
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
            <RecursiveBenefitForm name="" />
          </form>
        </FormProvider>
      </div>
    </ContentLoadingWrapper>
  );
};

export default ProductCategoryBenefitForm;