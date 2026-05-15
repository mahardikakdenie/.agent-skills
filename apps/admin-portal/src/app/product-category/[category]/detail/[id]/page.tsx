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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui';

import { ContentLoadingWrapper } from '@/components/ui/loading';
import AppURL from '@/constants/app-url.const';
import { useAuth } from '@/context/auth.context';

import { useProducts } from '../../../hooks';
import BenefitList from './benefit-list';
import ChannelList from './channel-list';
import DetailList from './detail-list';
import PackageList from './package-list';

type ProductCategoryDetailForm = {
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

export default function DetaildPage({
  params,
}: {
  params: Promise<{ id: string; category: string }>;
}) {
  const router = useRouter();
  const { category, id } = React.use(params);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const { permissionList } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes('Product Category.Read');
      const editBtn = permissionList.includes('Product Category.Update');

      setCanEdit(editBtn);
      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [permissionList, router]);

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
  } = useForm<ProductCategoryDetailForm>({
    shouldUnregister: false,
    defaultValues: {
      insuranceId: '',
      productId: '',
      name: '',
      slug: '',
      active_period: '',
      active_period_unit: '',
    },
  });

  useEffect(() => {
    if (plan === null || insurances.length === 0) {
      return;
    }

    if (plan) {
      const insuranceId = plan.products?.insurances?.id;

      if (!insuranceId) {
        return;
      }

      fetchProducts({ insuranceId });
      setValue('name', plan.name);
      setValue('slug', plan.slug);
      setValue('insuranceId', String(insuranceId));
      setValue('active_period', plan.active_period || '');
      setValue('active_period_unit', plan.active_period_unit || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, insurances]);

  useEffect(() => {
    if (plan === null && products.length === 0) {
      return;
    }

    if (plan) {
      const productId =
        typeof plan.product === 'object'
          ? plan.product?.id
          : plan.product || plan.products?.id;

      setValue('productId', productId ? String(productId) : '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, products]);

  const onSubmit = async (data: ProductCategoryDetailForm) => {
    try {
      await updatePlan({ data, id });
    } catch (error) {
      console.log(error, 'DY: error update plan');
    }
  };

  const tabContentClassName = 'rounded-t-none border-t-0 border-slate-200 p-3 sm:px-6 shadow-sm';

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
                <BreadcrumbPage>Detail Product Catalog</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Box as="h2" className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
            Detail Product Catalog
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
        <ContentLoadingWrapper isLoading={isLoadingUpdatePlan || isLoadingPlan}>
          <Box className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-slate-100">
            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <Box className="grid sm:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                <Box>
                  <Box
                    as="label"
                    htmlFor="name"
                    className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  >
                    Plan Name <Box as="span" className="text-red-500">*</Box>
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
                        disabled={!canEdit}
                        placeholder="Insert Plan Name"
                        {...field}
                        className={`bg-transparent ${
                          errors.name ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                    )}
                  />
                  {errors.name && (
                    <Box as="p" className="text-red-500 text-xs mt-1">{errors.name.message}</Box>
                  )}
                </Box>
                <Box>
                  <Box
                    as="label"
                    htmlFor="slug"
                    className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  >
                    Slug <Box as="span" className="text-red-500">*</Box>
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
                        disabled={!canEdit}
                        placeholder="Slug"
                        {...field}
                        className={`bg-transparent ${
                          errors.slug ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                    )}
                  />
                  {errors.slug && (
                    <Box as="p" className="text-red-500 text-xs mt-1">{errors.slug.message}</Box>
                  )}
                </Box>
                <Box>
                  <Box
                    as="label"
                    htmlFor="insuranceId"
                    className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                  >
                    Insurance <Box as="span" className="text-red-500">*</Box>
                  </Box>
                  <Controller
                    name="insuranceId"
                    disabled={!canEdit}
                    control={control}
                    rules={{ required: 'Insurance ID is required' }}
                    render={({ field }) => (
                      <Combobox
                        id="insuranceId"
                        size="lg"
                        value={field.value || ''}
                        disabled={!canEdit}
                        onValueChange={(value) => {
                          field.onChange(value || '');
                          setValue('productId', '');
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
                    Product <Box as="span" className="text-red-500">*</Box>
                  </Box>
                  <Controller
                    name="productId"
                    disabled={!canEdit}
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Product ID is required' }}
                    render={({ field }) => (
                      <Combobox
                        id="productId"
                        size="lg"
                        value={field.value?.toString() || ''}
                        disabled={!canEdit}
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
                disabled={!canEdit}
                className="bg-[#F5BA41] hover:bg-[#e6a92d] text-black cursor-pointer"
              >
                Submit
              </Button>
            </Box>
          </Box>
        </ContentLoadingWrapper>
        <Box className="w-full">
          <Tabs defaultValue="packages" variant="underline" className="gap-0">
            <TabsList
              aria-label="Product detail tabs"
              className="h-12 w-full justify-start rounded-t-lg border border-b-0 border-slate-200 bg-white px-2"
            >
              <TabsTrigger value="packages" className="px-6">
                Packages
              </TabsTrigger>
              <TabsTrigger value="benefits" className="px-6">
                Benefits
              </TabsTrigger>
              <TabsTrigger value="details" className="px-6">
                Details
              </TabsTrigger>
              <TabsTrigger value="channels" className="px-6">
                Channels
              </TabsTrigger>
            </TabsList>
            <TabsContent value="packages" className={tabContentClassName}>
              <PackageList id={id} category={category} />
            </TabsContent>
            <TabsContent value="benefits" className={tabContentClassName}>
              <BenefitList id={id} />
            </TabsContent>
            <TabsContent value="details" className={tabContentClassName}>
              <DetailList id={id} />
            </TabsContent>
            <TabsContent value="channels" className={tabContentClassName}>
              <ChannelList id={id} />
            </TabsContent>
          </Tabs>
        </Box>
      </Box>
    </Box>
  );
}
