"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import AppURL from "@/constants/app-url.const";
import ProductCategoryForm from "@/components/forms/product-category.form";
import {useAuth} from "@/context/auth.context";

export default function EditProductCategory({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const { id } = React.use(params);
  const { permissionList } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Masterdata.Update");

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router]);

  return <ProductCategoryForm method="update" id={id} />;
};
