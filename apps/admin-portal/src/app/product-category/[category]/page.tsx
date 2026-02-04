"use client";
import Image from "next/image";
import noData from "/public/images/no-data.webp";
import { useProducts } from "../hooks";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth.context";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, Trash } from "react-feather";
import {
  ProductCatalogDto,
  ProductCatalogService,
} from "@/services/product-catalog.service";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AppURL from "@/constants/app-url.const";
import ApiURL from "@/constants/api-url.const";
import { productService } from "@/services/api.service";
import ExtendedSidemenu, { SubmenuItem } from "@/components/extended-sidemenu";

const formatCategoryLabel = (value: string | undefined) => {
  if (!value) return "";

  return value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function ProductCatalogPage() {
  const { category } = useParams<{ category: string }>();
  const productCatalogService = new ProductCatalogService();
  const [product, setProducts] = useState<ProductCatalogDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchPlanName, setSearchPlanName] = useState("");
  const [searchInsurer, setSearchInsurer] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const { fetchInsurances, insurances } = useProducts();
  const { fetchProducts, products } = useProducts();

  const router = useRouter();

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [canCreate, setCanCreate] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);
  const { permissionList } = useAuth();
  const [subMenuItems, setSubMenuItems] = useState<SubmenuItem[]>([]);

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Product Category.Read");
      const editBtn = permissionList.includes("Product Category.Update");
      const deleteBtn = permissionList.includes("Product Category.Delete");
      const createBtn = permissionList.includes("Product Category.Create");

      setCanEdit(editBtn);
      setCanDelete(deleteBtn);
      setHasAccess(access);
      setCanCreate(createBtn);
      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router]);

  useEffect(() => {
    if (searchPlanName || searchInsurer || searchProduct) {
      setPage(1);
    }
  }, [searchPlanName, searchInsurer, searchProduct]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const params = {
          page,
          pageSize: rowsPerPage,
          category,
          ...(searchPlanName && { planName: searchPlanName }),
          ...(searchInsurer && { insuranceId: searchInsurer }),
          ...(searchProduct && { productId: searchProduct }),
        };

        const response = await productCatalogService.getPlans(params);

        if (response?.data && response?.meta) {
          setProducts(response.data);
          setTotalPages(Math.ceil(response.meta.total / rowsPerPage));
          setTotalItems(response.meta.total);
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      }
    };

    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    category,
    searchPlanName,
    searchInsurer,
    searchProduct,
    page,
    rowsPerPage,
  ]);

  useEffect(() => {
    fetchInsurances({});
    fetchProducts({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response: any = await productService.get(ApiURL.v1Categories, {
          params: { limit: 1000 },
        });
        const rawCategories =
          response?.data?.data ?? response?.data ?? response ?? [];
        const normalizedCategories = Array.isArray(rawCategories)
          ? rawCategories
          : [];
        const formattedCategories = normalizedCategories.map((item: any) => ({
          url: item.name,
          label: item.display_name || formatCategoryLabel(item.name),
        }));
        setSubMenuItems(formattedCategories);
      } catch (error) {
        console.error("Failed to fetch product categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchInsurer) {
      fetchProducts({
        insuranceId: searchInsurer,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInsurer]);

  const handleViewDetail = (id: string) => {
    router.push(AppURL.productCatalogDetail(category, id));
  };

  const handleSearchInsurerOnChange = (v: string) => {
    setSearchInsurer(v);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const handleDeletePlan = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      try {
        await productCatalogService.deletePlan(id);
        setProducts((prevProducts) =>
          prevProducts.filter((plan) => plan.id !== id)
        );
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete plan:", error);
      }
    }
  };

  return (
    <div className="flex w-full flex-col md:flex-row md:items-start">
      <div className="flex flex-col w-full p-4 md:p-6">
        <div className="flex gap-2 sm:flex-row flex-col sm:pb-0 pb-4">
          <h1 className="text-black font-bold sm:text-2xl text-xl mt-2 mb-4">
            Product Catalog -{" "}
            {category
              .split("-")
              .map(
                (item) => item.charAt(0).toUpperCase() + item.slice(1) + " "
              )}
          </h1>
          <Button
            onClick={() => router.push(AppURL.productCatalogAdd(category))}
            disabled={!canCreate}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
          >
            <Plus className="w-5 h-5 mr-1 " /> Add Plan
          </Button>
        </div>

        <div className="flex gap-4">
          <ExtendedSidemenu
            title="Product Categories"
            items={subMenuItems}
            activeUrl={category}
          />
          <div className="flex-1 min-w-0">
            <div className="w-full px-4 px-md-6 py-3 bg-white rounded-lg mb-4">
              <div className="flex gap-4 items-center sm:flex-row flex-col">
                <Select
                  value={searchInsurer}
                  onValueChange={handleSearchInsurerOnChange}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select Insurer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Insurer</SelectLabel>
                      {insurances.map((insurance: any) => (
                        <SelectItem key={insurance.id} value={insurance.id}>
                          {insurance.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  placeholder="Search by Plan Name"
                  className="p-2 border rounded h-12"
                  value={searchPlanName}
                  onChange={(e) => setSearchPlanName(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full p-4 bg-white rounded-lg">
              <Table className="table-product-catalog">
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap !max-w-16 w-16">
                      No.
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Insurer</TableHead>
                    <TableHead className="min-w-44">Plan Name</TableHead>
                    <TableHead className="whitespace-nowrap">Product</TableHead>
                    <TableHead className="whitespace-nowrap">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.length > 0 ? (
                    product.map((product, index) => {
                      const logoUrl =
                        product.products.insurances.logo_url || null;
                      return (
                        <TableRow key={product.id}>
                          <TableCell className="!max-w-16 w-16">
                            {(page - 1) * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2 items-center">
                              <div className="inline-flex justify-center items-center w-8 min-w-8 h-8">
                                {logoUrl && (
                                  <Image
                                    src={logoUrl}
                                    alt=""
                                    width={100}
                                    height={50}
                                    className="w-full h-auto"
                                  />
                                )}
                              </div>
                              {product.products.insurances.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            {product.name
                              .split("|")
                              .map((item: any, i: any) => (
                                <div key={i}>{item}</div>
                              ))}
                          </TableCell>
                          <TableCell>{product.products.name}</TableCell>
                          <TableCell className="w-20">
                            <div className="flex gap-4 items-center">
                              <Button
                                variant="secondary"
                                onClick={() => handleViewDetail(product.id)}
                                className="bg-[#016DA1] hover:bg-[#016DA1] text-white px-4 rounded-full"
                              >
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => handleDeletePlan(product.id)}
                                disabled={!canDelete}
                                className="text-red-600 px-0"
                              >
                                <Trash />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow className="hover:!bg-white">
                      <TableCell colSpan={5}>
                        <div className="flex flex-col gap-4 items-center justify-center py-14">
                          <Image alt="no data" src={noData} width={200} />
                          <div>No transaction data available</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="flex justify-center items-center gap-2 font-normal">
                        <label htmlFor="rowsPerPage">Showing:</label>
                        <select
                          id="rowsPerPage"
                          className="p-2 border rounded"
                          value={rowsPerPage}
                          onChange={handleRowsPerPageChange}
                        >
                          {[10, 20, 30, 50].map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <span className="mr-2">of {totalItems} items</span>
                        <button
                          onClick={() => setPage((prevState) => prevState - 1)}
                          disabled={page === 1}
                          title="Previous"
                        >
                          <ChevronLeft />
                        </button>
                        <button
                          onClick={() => setPage((prevState) => prevState + 1)}
                          disabled={page === totalPages}
                          title="Next"
                        >
                          <ChevronRight />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
