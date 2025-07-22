"use client";

import WithSidebar from "@/hoc/with-sidebar";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { hasPermission } from "@/context/auth.context";
import { FORBIDDEN } from "@/constants/routes";
import ProductCategoryPackageForm from "@/components/forms/product-catalog/package.form";

const EditProductCatalogPackage = ({
  params,
}: {
  params: Promise<{
    id: string;
    category: string;
    packageId: string;
  }>;
}) => {
  const router = useRouter();
  const { id, category, packageId } = React.use(params);

  useEffect(() => {
    const checkAccess = async () => {
      const access = await hasPermission("Product Category.Update");

      if (!access) {
        router.push(FORBIDDEN);
      }
    };

    checkAccess();
  }, [router]);

  return (
    <ProductCategoryPackageForm
      method="update"
      category={category}
      productCategoryID={id}
      packageID={packageId}
    />
  );
};

const EditProductCategoryWithSidebar = (params: any) =>
  WithSidebar(EditProductCatalogPackage)(params);
export default EditProductCategoryWithSidebar;
