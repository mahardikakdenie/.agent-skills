'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'react-feather';
import { Controller, useForm } from 'react-hook-form';

import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Combobox,
  Input,
} from '@repo/ui';

import { ContentLoadingWrapper } from '@/components/core/loading';
import AppURL from '@/constants/app-url.const';
import { useAuth } from '@/context/auth.context';

import { useProducts } from '../../hooks';

type ProductCategoryAddForm = {
  insuranceId: string;
  productId: string;
  name: string;
  slug: string;
  active_period: string;
  active_period_unit: string;
};

type ProductCategoryOption = {
  id: string | number;
  name: string;
};

export default function AddPlanPage({ params }: { params: Promise<{ category: string }> }) {
  const router = useRouter();
  const { category } = React.use(params);

  const [isInsuranceSelected, setIsInsuranceSelected] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const { permissionList } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes('Masterdata.Create');
      setHasAccess(access);
      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [permissionList, router]);

  const { isLoadingSavePlan, insurances, savePlan, fetchProducts, getProductByCategoryId } =
    useProducts({
      category,
    });

  const products = getProductByCategoryId();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<ProductCategoryAddForm>({
    defaultValues: {
      insuranceId: '',
      productId: '',
      name: '',
      slug: '',
      active_period: '',
      active_period_unit: '',
    },
  });

  const onSubmit = async (data: ProductCategoryAddForm) => {
    try {
      await savePlan(data);
      setSaveSuccess(true);
    } catch (error) {
      setSaveSuccess(false);
    }
  };

  useEffect(() => {
    if (saveSuccess === true) {
      alert('Data berhasil disimpan!');
      router.push(AppURL.productCatalogCategoryV2(category as string));
    } else if (saveSuccess === false) {
      alert('Terjadi kesalahan saat menyimpan data.');
    }
    setSaveSuccess(null);
  }, [saveSuccess, router, category]);

  return (
    <Box className="flex flex-col w-full">
      <Box className="bg-white md:px-6 p-4 flex items-center">
        <Box>
          <Breadcrumb className="sm:block hidden">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Product Catalog</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={AppURL.productCatalogCategoryV2(category)}>
                  {category
                    .split('-')
                    .map((item) => item.charAt(0).toUpperCase() + item.slice(1) + ' ')}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Add Product Catalog</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Box as="h2" className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
            Add Product Catalog
          </Box>
        </Box>
        <Box
          onClick={() => router.back()}
          className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Box>
      </Box>
      <Box className="flex flex-col w-full p-4 md:p-6 gap-4">
        <ContentLoadingWrapper isLoading={isLoadingSavePlan}>
          <Box className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-slate-100">
            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <Box className="grid sm:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                <Box>
                  <Box
                    as="label"
                    htmlFor="name"
                    className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  >
                    Plan Name{' '}
                    <Box as="span" className="text-red-500">
                      *
                    </Box>
                  </Box>
                  <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Plan Name is required' }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        id="name"
                        size="lg"
                        placeholder="Insert Plan Name"
                        {...field}
                        className={`bg-transparent ${
                          errors.name ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                    )}
                  />
                  {errors.name && (
                    <Box as="p" className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </Box>
                  )}
                </Box>
                <Box>
                  <Box
                    as="label"
                    htmlFor="slug"
                    className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  >
                    Slug{' '}
                    <Box as="span" className="text-red-500">
                      *
                    </Box>
                  </Box>
                  <Controller
                    name="slug"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Slug is required' }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        id="slug"
                        size="lg"
                        placeholder="Slug"
                        {...field}
                        className={`bg-transparent ${
                          errors.slug ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                    )}
                  />
                  {errors.slug && (
                    <Box as="p" className="text-red-500 text-xs mt-1">
                      {errors.slug.message}
                    </Box>
                  )}
                </Box>
                <Box>
                  <Box
                    as="label"
                    htmlFor="insuranceId"
                    className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  >
                    Insurance{' '}
                    <Box as="span" className="text-red-500">
                      *
                    </Box>
                  </Box>
                  <Controller
                    name="insuranceId"
                    control={control}
                    rules={{ required: 'Insurance ID is required' }}
                    render={({ field }) => (
                      <Combobox
                        id="insuranceId"
                        size="lg"
                        value={field.value || ''}
                        onValueChange={(value) => {
                          field.onChange(value || '');
                          setValue('productId', '');
                          setIsInsuranceSelected(!!value);
                          fetchProducts({ insuranceId: value });
                        }}
                        options={insurances.map((insurance: ProductCategoryOption) => ({
                          label: insurance.name,
                          value: insurance.id.toString(),
                        }))}
                        placeholder="Select Insurance"
                        className="bg-transparent"
                        triggerClassName="border-slate-300"
                      />
                    )}
                  />
                  {errors.insuranceId && (
                    <Box as="p" className="text-red-500 text-xs mt-1">
                      {errors.insuranceId.message?.toString()}
                    </Box>
                  )}
                </Box>
                <Box>
                  <Box
                    as="label"
                    htmlFor="productId"
                    className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  >
                    Product{' '}
                    <Box as="span" className="text-red-500">
                      *
                    </Box>
                  </Box>
                  <Controller
                    name="productId"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Product ID is required' }}
                    render={({ field }) => (
                      <Combobox
                        id="productId"
                        size="lg"
                        value={field.value?.toString() || ''}
                        disabled={!isInsuranceSelected}
                        onValueChange={(value) => field.onChange(value || '')}
                        options={products.map((product: ProductCategoryOption) => ({
                          label: product.name,
                          value: product.id.toString(),
                        }))}
                        placeholder="Select Product"
                        className="bg-transparent"
                        triggerClassName="border-slate-300"
                      />
                    )}
                  />
                  {errors.productId && (
                    <Box as="p" className="text-red-500 text-xs mt-1">
                      {errors.productId.message?.toString()}
                    </Box>
                  )}
                </Box>
              </Box>

              <Button
                type="submit"
                className="bg-[#F5BA41] hover:bg-[#e6a92d] text-black cursor-pointer"
              >
                Submit
              </Button>
            </Box>
          </Box>
        </ContentLoadingWrapper>
      </Box>
    </Box>
  );
}
