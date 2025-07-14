"use client";

import WithSidebar from "@/hoc/with-sidebar";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { hasPermission } from "@/context/auth.context";
import { FORBIDDEN } from "@/constants/routes";
import ProductCategoryBenefitForm from "@/components/forms/product-catalog/benefit.form";

const AddProductCatalogBenefit = ({
  params,
}: {
  params: Promise<{
    id: string;
    category: string;
  }>;
}) => {
  const router = useRouter();
  const { id, category } = React.use(params);

  useEffect(() => {
    const checkAccess = async () => {
      const access = await hasPermission("Product Category.Create");

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

const AddProductCatalogBenefitWithSidebar = (params: any) =>
  WithSidebar(AddProductCatalogBenefit)(params);
export default AddProductCatalogBenefitWithSidebar;
