"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "@/context/auth.context";
import { FORBIDDEN } from "@/constants/routes";
import ProductCategoryBenefitForm from "@/components/forms/product-catalog/benefit.form";

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
      const access = permissionList.includes("Product Category.Create");

      if (!access) {
        router.push(FORBIDDEN);
      }
    };

    checkAccess();
  }, [router]);

  return (
    <ProductCategoryBenefitForm
      method="create"
      category={category}
      productCategoryID={id}
    />
  );
};