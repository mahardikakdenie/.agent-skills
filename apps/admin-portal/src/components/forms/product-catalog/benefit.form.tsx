'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Check, Plus, Save, Trash } from 'react-feather';
import { Controller, FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form';
import validator from 'validator';
import { z } from 'zod';

import { Box, Button, Card, CardContent, CardHeader, Input } from '@repo/ui';

import { useProducts } from '@/app/product-category/hooks';
import { PageHeader } from '@/components/page-header';
import AppURL from '@/constants/app-url.const';

import { ContentLoadingWrapper } from '../../ui/loading';

type SchemaType = {
  benefit: string;
  value?: string;
  currency?: string;
  subBenefits: SchemaType[];
};

type FieldErrorNode = {
  message?: unknown;
};

type BenefitFormErrorNode = {
  benefit?: FieldErrorNode;
  value?: FieldErrorNode;
  currency?: FieldErrorNode;
  [key: string]: unknown;
};

const schema: z.ZodType<unknown> = z.lazy(() =>
  z
    .object({
      benefit: z
        .string()
        .min(1)
        .transform((val) => validator.trim(val)),
      value: z
        .string()
        .optional()
        .transform((val) => validator.trim(val ?? '')),
      currency: z
        .string()
        .optional()
        .transform((val) => validator.trim(val ?? '')),
      subBenefits: z.array(schema).optional().default([]),
    })
    .refine(
      (data) =>
        data.subBenefits.length > 0 ||
        (data.value && data.currency && data.value !== '' && data.currency !== ''),
      {
        message: 'Value and Currency are required if this benefit does not have any sub-benefits',
        path: ['value'], // Highlight the value field in error
      },
    ),
);

const defaultValues: SchemaType = {
  benefit: '',
  value: '',
  currency: '',
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
  const getNestedError = (errors: unknown, path: string) => {
    if (!path) return errors;

    return path.split('.').reduce<unknown>((acc, key) => {
      if (acc && typeof acc === 'object' && key in acc) {
        return (acc as Record<string, unknown>)[key];
      }

      return undefined;
    }, errors);
  };
  const currentErrors = getNestedError(errors, name) as BenefitFormErrorNode | undefined;
  const tierLevel = name ? name.split('.').filter((v) => v === 'subBenefits').length : 0;

  return (
    <Box className={`flex flex-col w-full ${name ? '' : 'p-4 md:p-6'} gap-4`}>
      <Box
        className={`${
          name ? '' : 'p-4 sm:p-6 shadow-sm border border-slate-100'
        } bg-white rounded-lg flex flex-col gap-4`}
      >
        <Controller
          name={getPath('benefit')}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              size="lg"
              label="Benefit"
              required
              placeholder="Insert Benefit"
              error={currentErrors?.benefit?.message as string | undefined}
              className="bg-transparent"
            />
          )}
        />
        <Controller
          name={getPath('value')}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              size="lg"
              label="Value"
              placeholder="Insert Value"
              error={currentErrors?.value?.message as string | undefined}
              className="bg-transparent"
            />
          )}
        />
        <Controller
          name={getPath('currency')}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              size="lg"
              label="Currency"
              placeholder="Insert Currency"
              error={currentErrors?.currency?.message as string | undefined}
              className="bg-transparent"
            />
          )}
        />
      </Box>
      {fields.map((field, i) => (
        <Card key={field.id}>
          <CardHeader className="p-4 pb-0">
            <Box className="flex justify-between">
              <Box as="p">Sub-{tierLevel}</Box>
              <Button type="button" variant="destructive" onClick={() => remove(i)}>
                <Trash />
              </Button>
            </Box>
          </CardHeader>
          <CardContent>
            <RecursiveBenefitForm name={`${getPath('subBenefits')}.${i}`} />
          </CardContent>
        </Card>
      ))}
      <Box className="flex justify-end">
        <Button
          type="button"
          variant="default"
          onClick={() => append({ benefit: '', value: '', currency: '', subBenefits: [] })}
        >
          <Plus /> Add Sub
        </Button>
      </Box>
    </Box>
  );
};

const ProductCategoryBenefitForm = ({
  method,
  productCategoryID,
  category,
  benefitID,
}: {
  method: 'create' | 'update';
  productCategoryID: string;
  category: string;
  benefitID?: string;
}) => {
  const router = useRouter();

  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);

  const { saveBenefit, isLoadingSaveBenefit } = useProducts();
  const isEdit = method === 'update';
  const title = `${isEdit ? 'Edit' : 'Add'} Benefit`;
  const categoryLabel = category
    .split('-')
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(' ');
  const breadcrumbs = [
    { label: 'Product Catalog' },
    {
      label: categoryLabel,
      href: AppURL.productCatalogCategoryV2(category),
    },
    {
      label: 'Detail Product Catalog',
      href: AppURL.productCatalogDetail(category, productCategoryID),
    },
    { label: title, isCurrentPage: true },
  ];

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
      if (method === 'update' && benefitID) {
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
      <Box className="flex flex-col w-full">
        <FormProvider {...form}>
          <Box as="form" noValidate onSubmit={form.handleSubmit(onSubmit)}>
            <PageHeader
              title={title}
              breadcrumbs={breadcrumbs}
              showBackButton={true}
              onBackClick={() => router.back()}
            >
              <Button
                type="submit"
                disabled={isLoadingSaveBenefit}
                className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
                leftIcon={
                  isLoadingSaveBenefit ? undefined : isEdit ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )
                }
              >
                {isLoadingSaveBenefit ? 'Saving...' : 'Save'}
              </Button>
            </PageHeader>
            <RecursiveBenefitForm name="" />
          </Box>
        </FormProvider>
      </Box>
    </ContentLoadingWrapper>
  );
};

export default ProductCategoryBenefitForm;
