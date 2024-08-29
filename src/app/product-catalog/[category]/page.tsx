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

const ProductCatalogPage = ({ params }: { params: { category: string } }) => {
  useRequireAuth();
  const { category } = params;
  const productCatalogService = new ProductCatalogService();
  const [products, setProducts] = useState<ProductCatalogDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchPlanName, setSearchPlanName] = useState("");
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
      });
  };

  const router = useRouter();
  useEffect(() => {
    productCatalogService.getPlans(1, { category }).then((res) => {
      setProducts(res.data);
      setPage(res.meta.page);
      setTotalPages(res.meta.total);
    });
    fetchInsurances({});
  }, []);

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
    <div className="w-full p-6 m-2 bg-white rounded shadow-md">
      <h1 className="text-2xl font-semibold">
        Product Catalog -{" "}
        {category
          .split("-")
          .map((item) => item.charAt(0).toUpperCase() + item.slice(1) + " ")}
      </h1>

      <div className="flex justify-end mb-4">
        <Button
          onClick={() => router.push(`/product-catalog/${category}/add`)}
          className="bg-blue-500 text-white hover:bg-blue-700"
        >
          Add New Plan
        </Button>
      </div>
      <form className="mb-4 flex space-x-4" onSubmit={handleSearch}>
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plan Name</TableHead>
            <TableHead>Insurer</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.name.split("|").map((item, i) => {
                  return <div key={i}>{item}</div>;
                })}
              </TableCell>
              <TableCell>{product.products.insurances.name}</TableCell>
              <TableCell>{product.products.categories.name}</TableCell>
              <TableCell>
                <button
                  onClick={() => handleViewDetail(product.id)}
                  className="bg-green-700 text-white px-4 py-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePlan(product.id)}
                  className="bg-red-700 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    productCatalogService
                      .getPlans(page - 1, { category })
                      .then((res) => {
                        setProducts(res.data);
                        setPage(res.meta.page);
                        setTotalPages(res.meta.total);
                      });
                  }}
                  disabled={page === 1}
                  className="bg-slate-950 text-white px-4 py-2 rounded mr-2"
                >
                  Prev
                </button>
                <button
                  onClick={() => {
                    productCatalogService
                      .getPlans(page + 1, { category })
                      .then((res) => {
                        setProducts(res.data);
                        setPage(res.meta.page);
                        setTotalPages(res.meta.total);
                      });
                  }}
                  disabled={page === totalPages}
                  className="bg-slate-950 text-white px-4 py-2 rounded"
                >
                  Next
                </button>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

const ProductCatalogWithSidebar = (params: any) =>
  WithSidebar(ProductCatalogPage)(params);
export default ProductCatalogWithSidebar;
