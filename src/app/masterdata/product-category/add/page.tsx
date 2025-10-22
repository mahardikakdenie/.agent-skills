"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppURL from "@/constants/app-url.const";
import ProductCategoryForm from "@/components/forms/product-category.form";
import { useAuth } from "@/context/auth.context";

const AddProductCategory = () => {
  const router = useRouter();
  const { permissionList } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Masterdata.Create");

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router]);

  return <ProductCategoryForm method="create" />;
};

export default AddProductCategory;
