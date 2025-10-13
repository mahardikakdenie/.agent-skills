"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import { Controller, Form, useForm } from "react-hook-form";
import { useProducts } from "../../hooks";
import { ChevronLeft } from "react-feather";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  ProductCatalogDto,
  ProductCatalogService,
} from "@/services/product-catalog.service";
import { useAuth } from "@/context/auth.context";
import { FORBIDDEN, PRODUCT_CATALOG_CATEGORY } from "@/constants/routes";

export default function AddPlanPage({ params }: { params: { category: string; }; }) {
  const router = useRouter();
  const productCatalogService = new ProductCatalogService();
  const { category } = params;
  const [selectedInsurance, setSelectedInsurance] = useState<any>(null);
  const [isInsuranceSelected, setIsInsuranceSelected] = useState(false);
  const [product, setProducts] = useState<ProductCatalogDto[]>([]);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const { permissionList } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Masterdata.Create");
      setHasAccess(access);
      if (!access) {
        router.push(FORBIDDEN);
      }
    };

    checkAccess();
  }, [router]);

  const handleChangeInsurance = (e: any) => {
    setSelectedInsurance(e);
  };
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleChangeProduct = (e: any) => {
    setSelectedProduct(e);
  };

  const [name, setName] = useState("");

  const handleChangeName = (e: any) => {
    setName(e.target.value);
  };

  const [currency, setCurrency] = useState("");

  const handleChangeCurrency = (e: any) => {
    setCurrency(e.target.value);
  };

  const [slug, setSlug] = useState("");
  const handleChangeSlug = (e: any) => {
    setSlug(e.target.value);
  };

  const { fetchInsurances, insurances, products, fetchProducts, savePlan } =
    useProducts();

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    register,
    getValues,
  } = useForm({
    defaultValues: {
      insuranceId: selectedInsurance,
      productId: selectedProduct,
      name,
      currency,
      slug,
      active_period: "",
      active_period_unit: "",
    },
    values: {
      insuranceId: selectedInsurance,
      productId: selectedProduct,
      name,
      currency,
      slug,
      active_period: "",
      active_period_unit: "",
    },
  });

  useEffect(() => {
    fetchInsurances({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (watch("insuranceId"))
      fetchProducts({ insuranceId: watch("insuranceId") });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("insuranceId")]);

  const onSubmit = async (data: any) => {
    try {
      await savePlan(data);
      setSaveSuccess(true);
    } catch (error) {
      setSaveSuccess(false);
    }
  };

  useEffect(() => {
    if (saveSuccess === true) {
      alert("Data berhasil disimpan!");
      router.push(PRODUCT_CATALOG_CATEGORY(category as string));
    } else if (saveSuccess === false) {
      alert("Terjadi kesalahan saat menyimpan data.");
    }
    setSaveSuccess(null);
  }, [saveSuccess, router, category]);

  return (
    <div className="flex flex-col w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white md:px-6 p-4 flex items-center">
          <div>
            <Breadcrumb className="sm:block hidden">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink>Product Catalog</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={PRODUCT_CATALOG_CATEGORY(category)}>
                    {category
                      .split("-")
                      .map(
                        (item) =>
                          item.charAt(0).toUpperCase() + item.slice(1) + " "
                      )}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
              Add Plan
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
              Save
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-full p-4 md:p-6 ">
          <div className="p-6 bg-white rounded-lg gap-4 grid sm:grid-cols-2">
            <div>
              <label
                htmlFor="insuranceId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Insurer
              </label>
              <Controller
                name="insuranceId"
                control={control}
                rules={{ required: "Insurance ID is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setIsInsuranceSelected(!!value);
                    }}
                  >
                    <SelectTrigger className="h-16">
                      <SelectValue>
                        {field.value
                          ? insurances.find(
                            (insurance) => insurance.id === field.value
                          )?.name
                          : "Choose Insurer"}
                      </SelectValue>
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
              {errors.insuranceId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.insuranceId.message?.toString()}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="productId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product
              </label>
              <Controller
                name="productId"
                control={control}
                rules={{ required: "Product ID is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    disabled={!isInsuranceSelected}
                  >
                    <SelectTrigger className="h-16">
                      <SelectValue>
                        {field.value
                          ? products.find((p) => p.id === field.value)?.name
                          : "Choose Product"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {products.map((product: any) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.productId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.productId.message?.toString()}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Plan Name
              </label>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: "Plan Name is required" }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="name"
                    placeholder="Insert Plan Name"
                    {...field}
                    className={`mt-1 block w-full h-16 ${errors.name ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm`}
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Slug
              </label>
              <Controller
                name="slug"
                control={control}
                defaultValue=""
                rules={{ required: "Slug is required" }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="slug"
                    placeholder="Slug"
                    {...field}
                    className={`mt-1 block w-full h-16 ${errors.name ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm`}
                  />
                )}
              />
              {errors.slug && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.slug.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="active_period"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Active Period
              </label>
              <Controller
                name="active_period"
                control={control}
                defaultValue=""
                rules={{ required: "Active Period is required" }}
                render={({ field }) => (
                  <Input
                    type="number"
                    id="active_period"
                    placeholder="Active Period"
                    {...field}
                    className={`mt-1 block w-full h-16 ${errors.active_period ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm`}
                  />
                )}
              />
              {errors.active_period && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.active_period.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="active_period_unit"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Active Period Unit
              </label>
              <Controller
                name="active_period_unit"
                control={control}
                defaultValue=""
                rules={{ required: "Active Period Unit is required" }}
                render={({ field }) => (
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger className="h-16">
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Units</SelectLabel>
                        <SelectItem value="day">Days</SelectItem>
                        <SelectItem value="week">Weeks</SelectItem>
                        <SelectItem value="month">Months</SelectItem>
                        <SelectItem value="year">Years</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.active_period_unit && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.active_period_unit.message?.toString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};