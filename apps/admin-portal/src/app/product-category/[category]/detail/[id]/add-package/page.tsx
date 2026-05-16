'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import ProductCategoryPackageForm from '@/components/forms/product-catalog/package.form';
import AppURL from '@/constants/app-url.const';
import { useAuth } from '@/context/auth.context';

export default function AddProductCatalogPackage({
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

  return <ProductCategoryPackageForm method="create" category={category} productCategoryID={id} />;
}
