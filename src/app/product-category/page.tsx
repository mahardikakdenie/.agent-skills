"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { productService } from "@/services/api.service";
import ApiURL from "@/constants/api-url.const";
import AppURL from "@/constants/app-url.const";

export default function ProductCategoryPage() {
  const router = useRouter();

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const response: any = await productService.get(ApiURL.v1Categories, {
          params: { limit: 1000 },
        });

        const rawCategories =
          response?.data?.data ?? response?.data ?? response ?? [];
        const normalizedCategories = Array.isArray(rawCategories)
          ? rawCategories
          : [];

        if (normalizedCategories.length > 0) {
          const firstCategory = normalizedCategories[0];
          const categoryName = firstCategory.name;
          router.push(`${AppURL.productCategory}/${categoryName}`);
        } else {
          console.error("No categories found");
        }
      } catch (error) {
        console.error("Failed to fetch product categories:", error);
      }
    };

    fetchAndRedirect();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading categories...</p>
      </div>
    </div>
  );
}
