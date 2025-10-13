"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FORBIDDEN } from "@/constants/routes";
import ProductCategoryForm from "@/components/forms/product-category.form";
import { useAuth } from "@/context/auth.context";

const AddProductCategory = () => {
  const router = useRouter();
  const { permissionList } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Masterdata.Create");

      if (!access) {
        router.push(FORBIDDEN);
      }
    };

    checkAccess();
  }, [router]);

  return <ProductCategoryForm method="create" />;
};