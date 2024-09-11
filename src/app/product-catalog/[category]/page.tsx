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

const ProductCatalogPage = ({ params }: { params: { category: string } }) => {
  useRequireAuth();
  const { category } = params;
  const productCatalogService = new ProductCatalogService();
  const [products, setProducts] = useState<ProductCatalogDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchPlanName, setSearchPlanName] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [searchInsurer, setSearchInsurer] = useState("");
  const { fetchInsurances, insurances } = useProducts();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    productCatalogService
      .getPlans(1, {
        category,
        planName: searchPlanName,
        insuranceId: searchInsurer,
      })
      .then((res) => {
        setProducts(res.data);
        setPage(res.meta.page);
        setTotalPages(res.meta.total);
        setTotalItems(res.meta.total);
      });
  };

  const router = useRouter();
  useEffect(() => {
    productCatalogService.getPlans(1, { category }).then((res) => {
      setProducts(res.data);
      setPage(res.meta.page);
      setTotalPages(res.meta.total);
      setTotalItems(res.meta.total);
    });
    fetchInsurances({});
  }, []);

  // const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setRowsPerPage(Number(e.target.value));
  //   setPage(1);
  // };

  const handleViewDetail = (id: string) => {
    router.push("/product-catalog/" + "/" + category + "/" + id);
  };
  const handleDeletePlan = (id: string) => {
    alert("delete");
  };

  const handleSearchInsurerOnChange = (v: any) => {
    setSearchInsurer(v);
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

      <div className="w-full px-4 px-md-6 py-2 bg-white rounded-lg mb-4">
        <form className="flex space-x-4" onSubmit={handleSearch}>
          <Input
            type="text"
            placeholder="Search by Plan Name"
            className="p-2 border rounded"
            value={searchPlanName}
            onChange={(e) => setSearchPlanName(e.target.value)}
          />
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

          <Button
            type="submit"
            className="bg-blue-500 text-white hover:bg-blue-700"
          >
            Search
          </Button>
        </form>
      </div>
      <div className="w-full p-4 md:p-6 bg-white rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Insurer</TableHead>
              <TableHead>Plan Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell>
                  {(page - 1) * products.length + index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <div className="inline-flex justify-center items-center w-8 min-w-8 h-8">
                      <img src={product.products.insurances.logo_url} alt="" />
                    </div>
                    {product.products.insurances.name}
                  </div>
                </TableCell>
                <TableCell>
                  {product.name.split("|").map((item, i) => (
                    <div key={i}>{item}</div>
                  ))}
                </TableCell>
                <TableCell>{product.products.categories.name}</TableCell>
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
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>
                <div className="flex justify-center items-center gap-2 font-normal">
                  <label htmlFor="rowsPerPage">Showing:</label>
                  <select
                    id="rowsPerPage"
                    // value={}
                    // onChange={}
                    className="p-2 border rounded"
                  >
                    {[10, 20, 30, 50].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span className="mr-2">of {totalItems} items</span>
                  <button
                    onClick={() => setPage((prevState) => prevState + 1)}
                    disabled={page === totalPages}
                    title="Next"
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
