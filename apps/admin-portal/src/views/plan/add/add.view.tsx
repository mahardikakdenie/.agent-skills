import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'react-feather';

import { Box } from '@repo/ui';

import Button from '@/components/button';
import Input from '@/components/input';
import Select from '@/components/select';
import { primary } from '@/constants/app-common.const';
import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import { getBreadcrumbs, getHeaderPage, toastNotification } from '@/helpers/app.helper';
import { productService } from '@/services/product/api/product.service';

export const AddPlanView = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [planName, setPlanName] = useState('');
  const [planSlug, setPlanSlug] = useState('');
  const [productList, setProductList] = useState<any[]>([]);
  const path = usePathname();
  const router = useRouter();
  const { setLoading } = useScreen();
  const { handleResponseError, user } = useAuth();
  const { pageName, breadcrumbsArray } = getHeaderPage(3, path, false);
  const insurerId = user?.account_insurers[0]?.insurance;

  useEffect(() => {
    const fetchProductsAdd = async () => {
      try {
        setLoading(true);
        const responseAdd: any = await productService.getProducts({ insuranceId: insurerId });
        if (responseAdd) {
          const list = responseAdd?.data || [];
          setProductList(
            list.map((item: any) => ({
              label: item.name || '-',
              value: item.id,
            })),
          );
        }
      } catch (error: any) {
        handleResponseError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAdd().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createPlan = async () => {
    try {
      setLoading(true);
      const requestBody = {
        insuranceId: insurerId,
        productId: selectedProduct,
        name: planName,
        slug: planSlug,
      };
      const response: any = await productService.createPlan(requestBody);
      if (response) {
        toastNotification('Plan created successfully!');
        goToPlanListPage();
      }
    } catch (error: any) {
      toastNotification('Failed to create plan!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const goToPlanListPage = () => {
    router.push(path.split('/').slice(0, -2).join('/'));
  };

  return (
    <Box className="mx-auto">
      <Box className="bg-white flex items-center justify-between mb-5 py-5 px-7">
        <Box>
          {getBreadcrumbs(breadcrumbsArray)}
          <Box as="p" className="font-bold text-lg">
            {pageName}
          </Box>
        </Box>
        <Box
          onClick={goToPlanListPage}
          className="flex items-center justify-between cursor-pointer"
        >
          <ChevronLeft color="red" width="30" height="15" />
          <Box as="p" className="text-sm text-red-500">
            Back
          </Box>
        </Box>
      </Box>
      <Box className="pb-5 px-7">
        <Box className="p-5 bg-white rounded-md shadow">
          <Box className="mb-3">
            <Box as="p" className="mb-2 text-sm font-medium">
              Product
            </Box>
            <Select
              chevronColor={primary}
              placeholderSelectClassName="truncate"
              additionalClassNameSelect="pl-4 h-[46px]"
              value={selectedProduct}
              onChange={(value) => setSelectedProduct(value.toString())}
              options={productList}
            />
          </Box>
          <Box className="mb-3">
            <Box as="p" className="mb-2 text-sm font-medium">
              Plan Name
            </Box>
            <Input
              value={planName}
              onChange={(value) => setPlanName(value.toString())}
              onClear={() => setPlanName('')}
              placeholder="Type plan name"
            />
          </Box>
          <Box className="mb-3">
            <Box as="p" className="mb-2 text-sm font-medium">
              Slug
            </Box>
            <Input
              value={planSlug}
              onChange={(value) => setPlanSlug(value.toString())}
              onClear={() => setPlanSlug('')}
              placeholder="Type slug"
            />
          </Box>
          <Box>
            <Button disabled={!selectedProduct || !planName || !planSlug} onClick={createPlan}>
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
