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

const TransactionsPage = ({ params }: { params: { category: string } }) => {
  useRequireAuth();
  const { category } = params;
  const productCatalogService = new ProductCatalogService();
  const [products, setProducts] = useState<ProductCatalogDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  useEffect(() => {
    productCatalogService.getPlans(1).then((res) => {
      setProducts(res.data);
      setPage(res.meta.page);
      setTotalPages(res.meta.total);
    });
  }, []);

  const handleViewDetail = (id: string) => {
    router.push("/product-catalog/" + "/" + category + "/" + id);
  };
  const handleDeletePlan = (id: string) => {
    alert("delete");
  };
  return (
    <div className="w-full p-6 m-2 bg-white rounded shadow-md">
      <h1 className="text-2xl font-semibold">Product Catalog</h1>

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
                    productCatalogService.getPlans(page - 1).then((res) => {
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
                    productCatalogService.getPlans(page + 1).then((res) => {
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

const TransactionWithSidebar = (params: any) =>
  WithSidebar(TransactionsPage)(params);
export default TransactionWithSidebar;
