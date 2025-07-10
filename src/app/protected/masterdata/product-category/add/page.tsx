"use client";

import WithSidebar from "@/hoc/with-sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { hasPermission } from "@/context/auth.context";
import { FORBIDDEN } from "@/constants/routes";
import ProductCategoryForm from "@/components/forms/product-category.form";

const AddProductCategory = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      const access = await hasPermission("Masterdata.Create");

      if (!access) {
        router.push(FORBIDDEN);
      }
    };

    checkAccess();
  }, [router]);

  return <ProductCategoryForm method="create" />;
};

const AddProductCategoryWithSidebar = (params: any) =>
  WithSidebar(AddProductCategory)(params);
export default AddProductCategoryWithSidebar;
