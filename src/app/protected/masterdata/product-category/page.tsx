"use client";
import WithSidebar from "@/hoc/with-sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "react-feather";

import noData from "/public/images/no-data.webp";
import Image from "next/image";
import {
  ProductCategories,
  ProductCategoriesService,
} from "@/services/masterdata/product-category.service";
import { hasPermission } from "@/context/auth.context";
import { FORBIDDEN, PRODUCT_CATEGORY_ADD, PRODUCT_CATEGORY_DETAIL } from "@/constants/routes";

const ProductCategory = () => {
  const path = usePathname();
  const productCategoryService = new ProductCategoriesService();
  const [category, setCategory] = useState<ProductCategories[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();


  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [canCreate, setCanCreate] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);

  useEffect(() => {
    const checkAccess = async () => {
      const access = await hasPermission("Masterdata.Read");
      const editBtn = await hasPermission("Masterdata.Update");
      const deleteBtn = await hasPermission("Masterdata.Delete");
      const createBtn = await hasPermission("Masterdata.Create");

      setCanEdit(editBtn)
      setCanDelete(deleteBtn);
      setHasAccess(access);
      setCanCreate(createBtn);
      if (!access) {
        router.push(FORBIDDEN);
      }
    };

    checkAccess();
  }, [router]);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await productCategoryService.getCategories();
        setCategory(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!category) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        Loading...
      </div>
    );
  }

  const handleEdit = (id: string) => {
    router.push(PRODUCT_CATEGORY_DETAIL(id));
  };

  const handleDeletePlan = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      try {
        await productCategoryService.deleteCategories(id);
        setCategory((prevCategories) =>
          prevCategories.filter((category) => category.id !== id)
        );
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex gap-2 sm:flex-row flex-col pb-4">
        <h1 className="text-black font-bold sm:text-2xl text-xl sm:mt-2">
          Product Category
        </h1>
        <Button
          onClick={() => router.push(PRODUCT_CATEGORY_ADD)}
          disabled={!canCreate}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
        >
          <Plus className="w-5 h-5 mr-1 " /> Add New
        </Button>
      </div>

      <div className="w-full p-4 bg-white rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap w-12">No.</TableHead>
              <TableHead className="min-w-36">Category Name</TableHead>
              <TableHead className="min-w-36">Category Icon</TableHead>
              <TableHead className="whitespace-nowrap w-36">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {category.length > 0 ? (
              category.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {category.name
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </TableCell>
                  <TableCell>
                    {category.icon && <a href={category.icon} target="_blank" className="text-primary hover:underline">
                        <Image src={category.icon} alt={category.name} width={50} height={50} />
                    </a>}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-4 items-center">
                      <Button
                        variant="secondary"
                        disabled={!canEdit}
                        onClick={() => handleEdit(category.id)}
                        className="bg-[#016DA1] hover:bg-[#016DA1] text-white px-4 rounded-full"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        disabled={!canDelete}
                        onClick={() => handleDeletePlan(category.id)}
                        className="text-red-600 px-0"
                      >
                        <Trash />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:!bg-white">
                <TableCell colSpan={5}>
                  <div className="flex flex-col gap-4 items-center justify-center py-14">
                    <Image alt="no data" src={noData} width={200} /> No
                    transaction data available
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const ProductCategoryWithSidebar = (params: any) =>
  WithSidebar(ProductCategory)(params);
export default ProductCategoryWithSidebar;
