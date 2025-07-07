"use client";

import WithSidebar from "@/hoc/with-sidebar";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { hasPermission } from "@/context/auth.context";
import { FORBIDDEN } from "@/constants/routes";
import ProductCategoryForm from "@/components/forms/product-category.form";

const EditProductCategory = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const router = useRouter();

  const { id } = React.use(params);

  useEffect(() => {
    const checkAccess = async () => {
      const access = await hasPermission("Masterdata.Update");

      if (!access) {
        router.push(FORBIDDEN);
      }
    };

    checkAccess();
  }, [router]);

  return <ProductCategoryForm method="update" id={id} />;
};

const EdiProductCategoryWithSidebar = (params: any) =>
  WithSidebar(EditProductCategory)(params);
export default EdiProductCategoryWithSidebar;
