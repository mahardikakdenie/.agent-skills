'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import ProductCategoryBenefitForm from '@/components/forms/product-catalog/benefit.form';
import AppURL from '@/constants/app-url.const';
import { useAuth } from '@/context/auth.context';

export default function AddProductCatalogBenefit({
  params,
}: {
  params: Promise<{
    id: string;
    category: string;
  }>;
}) {
  const router = useRouter();
  const { id, category } = React.use(params);
  const { permissionList } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes('Product Category.Create');

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router]);

  return <ProductCategoryBenefitForm method="create" category={category} productCategoryID={id} />;
}
