"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import ProductCategoryPackageForm from "@/components/forms/product-catalog/package.form";

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
      const access = permissionList.includes("Product Category.Create");

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router]);

  return (
    <ProductCategoryPackageForm
      method="create"
      category={category}
      productCategoryID={id}
    />
  );
}
