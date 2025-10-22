"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Check, ChevronLeft, Plus, Trash2, Upload } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useProduct } from "../hooks";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import {
  MdProductService,
  ProductResponse,
} from "@/services/masterdata/product.service";
import AppURL from "@/constants/app-url.const";
import {useAuth} from "@/context/auth.context";

export default function AddProduct() {
  const router = useRouter();
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const productService = new MdProductService();
  const [productData, setProductData] = useState<ProductResponse[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<any>(null);
  const [selectedInsurances, setSelectedInsurances] = useState<any>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedInsuranceId, setSelectedInsuranceId] = useState("");
  const [productFields, setProductFields] = useState<any[]>([
    { id: "", name: "" },
  ]);

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const { permissionList } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Masterdata.Create");
      setHasAccess(access);
      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router]);

  const {
    saveProduct,
    updateProduct,
    categories = [],
    product = [],
    fetchCategories,
    insurances = [],
    fetchInsurances,
    fetchProduct,
  } = useProduct();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
    defaultValues: {
      name,
      categories: selectedCategories,
      insurances: selectedInsurances,
      category,
      insurance: "",
    },
    values: {
      name,
      category,
      insurance: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setSelectedCategoryId(data.category);
      setSelectedInsuranceId(data.insurance);
      for (let i = 0; i < productFields.length; i++) {
        if (productFields[i].id == "") {
          await saveProduct({
            category: data.category || selectedCategoryId,
            insurance: data.insurance,
            name: productFields[i].name,
          });
        } else {
          await updateProduct(
            {
              category: data.category || selectedCategoryId,
              insurance: data.insurance,
              name: productFields[i].name,
            },
            productFields[i].id
          );
        }
      }
      setSaveSuccess(true);
    } catch (error) {
      console.error(error);
      setSaveSuccess(false);
    }
  };

  useEffect(() => {
    fetchCategories({});
    fetchInsurances({
      page: 1,
      categoryId: selectedCategoryId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId]);

  useEffect(() => {
    if (saveSuccess === true) {
      alert("Data berhasil disimpan!");
      router.back();
    } else if (saveSuccess === false) {
      alert("Terjadi kesalahan saat menyimpan data.");
    }
    setSaveSuccess(null);
  }, [saveSuccess, router]);

  useEffect(() => {
    if (product.length > 0) {
      const updateFormValue = product.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      setProductFields(updateFormValue);
    }
  }, [product]);

  const handleAddProduct = () => {
    const updateFormValue = [...productFields];
    updateFormValue.push({ id: "", name: "" });
    setProductFields(updateFormValue);
  };

  const handleChangeProduct = (index: number, value: string) => {
    const updateFormValue = [...productFields];
    updateFormValue[index] = { ...updateFormValue[index], name: value };
    setProductFields(updateFormValue);
  };

  const handleDeletePlan = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(id);
        setProductFields((prevFields) =>
          prevFields.filter((productField) => productField.id !== id)
        );
        setProductData((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  return (
    <div className="flex flex-col w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white md:px-6 p-4 flex items-center">
          <div>
            <Breadcrumb className="sm:block hidden">
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
                    Product
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
              Add Product
            </h2>
          </div>

          <div className="flex ml-auto">
            <div
              onClick={() => router.back()}
              className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </div>
            <Button
              type="submit"
              className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-5 rounded-full px-5"
            >
              <Check className="mr-2 w-4 h-4" />
              Save
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-full p-4 md:p-6 gap-4">
          <div className="p-4 sm:p-6 bg-white rounded-lg flex-col gap-4 grid sm:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product Category
              </label>
              <Controller
                name="category"
                control={control}
                defaultValue=""
                rules={{ required: "Product Category is required" }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedCategoryId(value);
                    }}
                  >
                    <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                      <SelectValue placeholder="Select Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((categorie: any) => (
                          <SelectItem key={categorie.id} value={categorie.id}>
                            {categorie.name
                              .split("-")
                              .map(
                                (word: string) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category.message?.toString()}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="insurance"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Insurance Name
              </label>

              <Controller
                name="insurance"
                control={control}
                rules={{ required: "Insurance Name is required" }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={selectedCategoryId == ""}
                  >
                    <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                      <SelectValue placeholder="Select Insurance " />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {insurances.map((insurance: any) => (
                          <SelectItem key={insurance.id} value={insurance.id}>
                            {insurance.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.insurance && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.insurance.message?.toString()}
                </p>
              )}
            </div>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-lg gap-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Product Name <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col gap-3">
              {productFields.map((item, index) => (
                <React.Fragment key={index}>
                  <div className="flex items-center">
                    <Input
                      type="text"
                      id="name"
                      placeholder="Insert Product Name"
                      value={item.name}
                      onChange={(e) => {
                        handleChangeProduct(index, e.target.value);
                      }}
                      className={`mt-1 block w-full h-12 ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm`}
                    />
                    <Button
                      className="text-red-500 hover:bg-transparent"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeletePlan(item.id);
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="mt-4">
              <Button
                className="bg-[#F5BA41] hover:bg-[#e6a92d] text-black rounded-full px-5"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddProduct();
                }}
              >
                <Plus className="mr-1" width={18} height={18} />
                Add Product
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
