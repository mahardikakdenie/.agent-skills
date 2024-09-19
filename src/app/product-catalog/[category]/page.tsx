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
import useRequireAuth from "@/hooks/useRequireAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ProductCatalogDto,
  ProductCatalogService,
} from "@/services/product-catalog.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts } from "../hooks";
import { ChevronLeft, ChevronRight, Plus, Trash } from "react-feather";

import noData from "/public/images/no-data.webp";
import Image from "next/image";

const ProductCatalogPage = ({ params }: { params: { category: string } }) => {
  useRequireAuth();
  const { category } = params;
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
  const [plans, setPlans] = useState<any[]>([]);

  const router = useRouter();

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
          setPage(response.meta.page);
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
  }, []);

  useEffect(() => {
    if (searchInsurer) {
      fetchProducts({
        insuranceId: searchInsurer,
      });
    }
  }, [searchInsurer]);

  const handleViewDetail = (id: string) => {
    router.push("/product-catalog/" + "/" + category + "/" + id);
  };

  const handleSearchInsurerOnChange = (v: string) => {
    setSearchInsurer(v);
  };

  const handleSearchProductOnChange = (v: string) => {
    setSearchProduct(v);
  };

  const handleClearFilters = () => {
    setSearchPlanName("");
    setSearchInsurer("");
    setSearchProduct("");
    setPage(1);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const isClearButtonVisible =
    searchPlanName !== "" || searchInsurer !== "" || searchProduct !== "";

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
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex gap-2">
        <h1 className="text-black font-bold text-2xl mt-2 mb-4">
          Product Catalog -{" "}
          {category
            .split("-")
            .map((item) => item.charAt(0).toUpperCase() + item.slice(1) + " ")}
        </h1>
        <Button
          onClick={() => router.push(`/product-catalog/${category}/add`)}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
        >
          <Plus className="w-5 h-5 mr-1 " /> Add Plan
        </Button>
      </div>

      <div className="w-full px-4 px-md-6 py-3 bg-white rounded-lg mb-4">
        <div className="flex space-x-4 items-center">
          <Select
            value={searchInsurer}
            onValueChange={handleSearchInsurerOnChange}
          >
            <SelectTrigger>
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
          {/* <Select
            value={searchProduct}
            onValueChange={handleSearchProductOnChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Product" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Products</SelectLabel>
                {products?.map((item: any, index) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select> */}
          <Input
            type="text"
            placeholder="Search by Plan Name"
            className="p-2 border rounded"
            value={searchPlanName}
            onChange={(e) => setSearchPlanName(e.target.value)}
          />
          {isClearButtonVisible && (
            <Button
              onClick={handleClearFilters}
              className="text-red-500 bg-transparent border border-red-500 hover:bg-gray-300 rounded h-[56px]"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="w-full p-4 bg-white rounded-lg">
        <Table className="table-product-catalog">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">No.</TableHead>
              <TableHead className="whitespace-nowrap">Insurer</TableHead>
              <TableHead>Plan Name</TableHead>
              <TableHead className="whitespace-nowrap">Product</TableHead>
              <TableHead className="whitespace-nowrap">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {product.length > 0 ? (
              product.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <div className="inline-flex justify-center items-center w-8 min-w-8 h-8">
                        <img
                          src={product.products.insurances.logo_url}
                          alt=""
                        />
                      </div>
                      {product.products.insurances.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.name.split("|").map((item: any, i: any) => (
                      <div key={i}>{item}</div>
                    ))}
                  </TableCell>
                  <TableCell>{product.products.name}</TableCell>
                  <TableCell>
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
                </TableCell>{" "}
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
  );
};

const ProductCatalogWithSidebar = (params: any) =>
  WithSidebar(ProductCatalogPage)(params);
export default ProductCatalogWithSidebar;
