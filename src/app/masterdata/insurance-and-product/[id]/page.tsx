"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useRequireAuth from "@/hooks/useRequireAuth";
import { Input } from "@/components/ui/input";
import WithSidebar from "@/hoc/with-sidebar";
import { ProductCategories } from "@/services/masterdata/product-category.service";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft } from "react-feather";
import { Controller, useForm } from "react-hook-form";
// import { useMasterData } from "../../product-category/hooks";

const DetailProductCategory = ({ params }: { params: { id: string } }) => {
  useRequireAuth();
  const router = useRouter();
  const { id } = params;
  const [category, setCategory] = useState<ProductCategories[]>([]);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const path = usePathname();

  // const {
  //   fetchCategories,
  //   categories,
  //   updateCategories,
  //   deleteCategories,
  //   saveCategories,
  // } = useMasterData();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
    defaultValues: {
      name,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const id = params.id;
      // await updateCategories(data, id);
      setSaveSuccess(true);
    } catch (error) {
      setSaveSuccess(false);
    }
  };

  useEffect(() => {
    if (id) {
      (async () => {
        // await fetchCategories({});
      })();
    }
  }, [id]);

  useEffect(() => {
    if (saveSuccess === true) {
      alert("Data berhasil disimpan!");
      router.push(`${path}`);
    } else if (saveSuccess === false) {
      alert("Terjadi kesalahan saat menyimpan data.");
    }
    setSaveSuccess(null);
  }, [saveSuccess, router]);

  return (
    <div className="flex flex-col w-full">
      <div className="bg-white md:px-6 p-4 flex items-center">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Masterdata</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="cursor-pointer"
                  onClick={() => router.back()}
                >
                  Product Category
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Detail</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-black font-bold text-2xl mt-2">
            Detail Product Category
          </h2>
        </div>
        <div
          onClick={() => router.back()}
          className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali
        </div>
      </div>
      <div className="flex flex-col w-full p-4 md:p-6 gap-4">
        <div className="p-6 bg-white rounded-lg flex flex-col gap-4">
          <div className="font-bold text-base">Category Name</div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Plan Name
              </label>
              {/* <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: "Plan Name is required" }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="name"
                    placeholder="Category Name"
                    {...field}
                    className={`mt-1 block w-full ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm`}
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )} */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const DetailProductCategoryWithSidebar = (params: any) =>
  WithSidebar(DetailProductCategory)(params);
export default DetailProductCategoryWithSidebar;
