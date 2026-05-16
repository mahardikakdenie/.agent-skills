'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Check, Save } from 'react-feather';
import { Controller, useForm } from 'react-hook-form';
import validator from 'validator';
import { z, ZodSchema, ZodTypeAny } from 'zod';

import { Box, Button, Input, Select } from '@repo/ui';

import { useProducts } from '@/app/product-category/hooks';
import { PageHeader } from '@/components/page-header';
import { ContentLoadingWrapper } from '@/components/ui/loading';
import AppURL from '@/constants/app-url.const';

import { FieldArrayInput } from './field-array-input';

type FormFieldType = {
  label: string;
  type: 'string' | 'number' | 'array' | 'table' | 'range';
  name: string;
}[];

function generateZodSchema(obj: Record<string, any>): ZodSchema<any> {
  const shape: Record<string, ZodTypeAny> = {
    premium: z
      .string()
      .min(1)
      .refine((val) => {
        const numeric = val.replace(/\./g, '');
        return validator.isNumeric(numeric);
      }),
    currency: z.string().min(1),
    active_period: z.string().optional(),
    active_period_unit: z.string().optional(),
  };

  for (const key in obj) {
    const field = obj[key];
    let schema: ZodTypeAny;

    switch (field.type) {
      case 'string':
        schema = z.string().min(1);
        break;
      case 'number':
        schema = z
          .string()
          .min(1)
          .refine((val) => {
            const numeric = val.replace(/\./g, '');
            return validator.isNumeric(numeric);
          });
        break;
      case 'array':
        schema = z.array(z.string().min(1)).min(1);
        break;
      case 'table':
        schema = z.array(z.string().min(1)).min(1);
        break;
      case 'range':
        schema = z.object({
          from: z
            .string()
            .min(1)
            .refine((val) => {
              const numeric = val.replace(/\./g, '');
              return validator.isNumeric(numeric);
            }),
          to: z
            .string()
            .min(1)
            .refine((val) => {
              const numeric = val.replace(/\./g, '');
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
      label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      type: field.type,
      name: key,
    });
  }

  return fields;
}

function generateDefaultValues(obj: Record<string, any>): Record<string, any> {
  const defaultValues: Record<string, any> = {
    premium: '0',
    currency: '',
    active_period: '',
    active_period_unit: '',
  };

  for (const key in obj) {
    const field = obj[key];

    switch (field.type) {
      case 'string':
      case 'number':
        defaultValues[key] = '';
        break;
      case 'array':
      case 'table':
        defaultValues[key] = [''];
        break;
      case 'range':
        defaultValues[key] = { from: '', to: '' };
        break;
      default:
        defaultValues[key] = null;
    }
  }

  return defaultValues;
}

export function formatCurrency(value: string) {
  const numericValue = value.replace(/\D/g, '');

  return new Intl.NumberFormat('id-ID').format(Number(numericValue));
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

      const nested = getAttributeWithRangeType(value);
      result.push(...nested.map((n) => `${key}.${n}`));
    }
  }

  return result;
}

function getFieldErrorMessage(error: unknown): string | undefined {
  if (!error || typeof error !== 'object' || !('message' in error)) {
    return undefined;
  }

  const message = (error as { message?: unknown }).message;

  return typeof message === 'string' ? message : undefined;
}

const ProductCategoryPackageForm = ({
  method,
  productCategoryID,
  category,
  packageID,
}: {
  method: 'create' | 'update';
  productCategoryID: string;
  category: string;
  packageID?: string;
}) => {
  const router = useRouter();

  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const [schema, setSchema] = useState<ZodSchema<any>>();
  const [defaultValues, setDefaultValues] = useState<Record<string, any>>({});
  const [formFields, setFormFields] = useState<FormFieldType>([]);
  const [fetchedPackageDetail, setFetchedPackageDetail] = useState<any>(null);

  const {
    savePackage,
    updatePackage,
    productConfig,
    isLoadingSavePackage,
    isLoadingUpdatePackage,
  } = useProducts({
    category,
    packageId: packageID,
  });
  const isEdit = method === 'update';
  const isSaving = isLoadingSavePackage || isLoadingUpdatePackage;
  const title = `${isEdit ? 'Edit' : 'Add'} Package`;
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
    if (productConfig) {
      const newSchema = generateZodSchema(productConfig.search_configs);
      const newFormFields = generateFormFields(productConfig.search_configs);
      const newDefaultValues = generateDefaultValues(productConfig.search_configs);

      setSchema(newSchema);
      setFormFields(newFormFields);

      if (method === 'create') {
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
    if (fetchedPackageDetail) {
      const packageData = Array.isArray(fetchedPackageDetail)
        ? fetchedPackageDetail[0]
        : fetchedPackageDetail;

      if (!packageData) return;

      setValue('currency', packageData.currency || '');
      setValue('premium', formatCurrency(packageData.premium?.toString() || '0'));

      for (const key in packageData.search_params) {
        if (key.includes('_from') || key.includes('_to')) {
          const keyArray = key.split('_');
          const baseKey = keyArray[0];

          if (key.includes('_from')) {
            setValue(`${baseKey}.from`, packageData.search_params[key]?.toString() || '');
          }
          if (key.includes('_to')) {
            setValue(`${baseKey}.to`, packageData.search_params[key]?.toString() || '');
          }
        } else {
          let value = packageData.search_params[key];

          if (typeof value === 'number') {
            value = value.toString();
          }

          setValue(key, value);
        }
      }
    }
  }, [fetchedPackageDetail, setValue]);

  const onSubmit = async (data: any) => {
    const attributesWithRange = getAttributeWithRangeType(data);
    const newSearchParams = {
      ...data,
    };
    delete newSearchParams.premium;
    delete newSearchParams.currency;
    delete newSearchParams[attributesWithRange[0]];

    if (attributesWithRange.length > 0) {
      newSearchParams[`${attributesWithRange[0]}_from`] = data[attributesWithRange[0]].from;
      newSearchParams[`${attributesWithRange[0]}_to`] = data[attributesWithRange[0]].to;
    }

    const mappedData = {
      plan: productCategoryID,
      premium: data.premium.replace(/\./g, ''),
      currency: data.currency,
      search_params: newSearchParams,
    };

    try {
      if (method === 'update' && packageID) {
        await updatePackage({ id: packageID, data: mappedData });
      } else {
        await savePackage(mappedData);
      }

      setSaveSuccess(true);
    } catch (error) {
      console.error('Failed to save package:', error);
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
    <ContentLoadingWrapper isLoading={isSaving}>
      <Box className="flex flex-col w-full">
        <Box as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <PageHeader
            title={title}
            breadcrumbs={breadcrumbs}
            showBackButton={true}
            onBackClick={() => router.back()}
          >
            <Button
              type="submit"
              disabled={isSaving}
              className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
              leftIcon={
                isSaving ? undefined : isEdit ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Save className="w-5 h-5" />
                )
              }
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </PageHeader>
          <Box className="flex flex-col w-full p-4 md:p-6 gap-4">
            <Box className="p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-4">
              <Controller
                name="premium"
                control={control}
                defaultValue="0"
                render={({ field }) => (
                  <Input
                    type="text"
                    size="lg"
                    id="premium"
                    label="Premium"
                    placeholder="Insert Premium"
                    value={field.value}
                    error={getFieldErrorMessage(errors.premium)}
                    className="bg-transparent"
                    onChange={(e) => {
                      const formatted = formatCurrency(e.target.value);

                      field.onChange(formatted);
                    }}
                  />
                )}
              />
              <Controller
                name="currency"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    type="text"
                    size="lg"
                    id="currency"
                    label="Currency"
                    placeholder="Insert Currency"
                    error={getFieldErrorMessage(errors.currency)}
                    className="bg-transparent"
                    {...field}
                  />
                )}
              />
              {formFields.map((ff) => {
                if (ff.type === 'array' || ff.type === 'table') {
                  return (
                    <FieldArrayInput
                      key={ff.name}
                      control={control}
                      errors={errors}
                      label={ff.label}
                      name={ff.name}
                    />
                  );
                } else if (ff.type === 'string' || ff.type === 'number' || ff.type === 'range') {
                  return (
                    <Box key={ff.name} className="flex flex-col gap-2">
                      {(ff.type === 'string' || ff.type === 'number') && (
                        <Controller
                          name={ff.name}
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Input
                              type="text"
                              size="lg"
                              id={ff.name}
                              label={ff.label}
                              placeholder={`Insert ${ff.label}`}
                              error={getFieldErrorMessage(errors[ff.name])}
                              className="bg-transparent"
                              {...field}
                            />
                          )}
                        />
                      )}
                      {ff.type === 'range' && (
                        <Box className="grid gap-4 sm:grid-cols-2">
                          <Controller
                            name={`${ff.name}.from`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <Input
                                type="text"
                                size="lg"
                                id={`${ff.name}.from`}
                                label={`${ff.label} From`}
                                placeholder="From"
                                error={getFieldErrorMessage((errors[ff.name] as any)?.from)}
                                className="bg-transparent"
                                {...field}
                              />
                            )}
                          />
                          <Controller
                            name={`${ff.name}.to`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <Input
                                type="text"
                                size="lg"
                                id={`${ff.name}.to`}
                                label={`${ff.label} To`}
                                placeholder="To"
                                error={getFieldErrorMessage((errors[ff.name] as any)?.to)}
                                className="bg-transparent"
                                {...field}
                              />
                            )}
                          />
                        </Box>
                      )}
                    </Box>
                  );
                }
              })}
              <Controller
                name="active_period"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    type="number"
                    size="lg"
                    id="active_period"
                    label="Active Period"
                    placeholder="Active Period"
                    error={getFieldErrorMessage(errors.active_period)}
                    className="bg-transparent"
                    {...field}
                  />
                )}
              />
              <Controller
                name="active_period_unit"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    size="lg"
                    label="Active Period Unit"
                    placeholder="Select Unit"
                    value={field.value || undefined}
                    error={getFieldErrorMessage(errors.active_period_unit)}
                    options={[
                      { value: 'day', label: 'Days' },
                      { value: 'week', label: 'Weeks' },
                      { value: 'month', label: 'Months' },
                      { value: 'year', label: 'Years' },
                    ]}
                    onValueChange={(value) => field.onChange(value ?? '')}
                  />
                )}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </ContentLoadingWrapper>
  );
};

export default ProductCategoryPackageForm;
