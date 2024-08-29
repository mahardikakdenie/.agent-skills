"use client";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  Table,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import {
  PackageDto,
  ProductCatalogService,
} from "@/services/product-catalog.service";
import { formatMoney } from "@/lib/formatter";

export default function PackageList(props: Readonly<{ id: string }>) {
  const [packages, setPackages] = useState<PackageDto[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const { id } = props;
  const productCatalogService = new ProductCatalogService();
  useEffect(() => {
    const productCatalogService = new ProductCatalogService();
    productCatalogService.getPackagesByPlanId(id, page).then((response) => {
      setPackages(response.data);
      setPage(response.meta.page);
      setTotalPages(response.meta.total);
    });
  }, [id]);

  const handleViewDetail = (id: string) => {
    // page(`/transactions/${id}`);
  };
  return (
    <div className="w-full p-6 m-2 bg-white rounded shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Search Params</TableHead>
            <TableHead>Premium</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages?.map((packageData) => (
            <TableRow key={packageData.id}>
              <TableCell>
                {Object.keys(packageData.search_params).map((value, i) => {
                  return (
                    <div key={i}>
                      {value}:{" "}
                      {Array.isArray(packageData.search_params[value])
                        ? packageData.search_params[value].join(",")
                        : packageData.search_params[value]}
                    </div>
                  );
                })}
              </TableCell>
              <TableCell>
                {formatMoney(packageData.premium, packageData.currency)}
              </TableCell>
              <TableCell>{packageData.currency}</TableCell>
              <TableCell>
                <button
                  onClick={() => handleViewDetail(packageData.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  View
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    productCatalogService
                      .getPackagesByPlanId(id, page - 1)
                      .then((res) => {
                        setPackages(res.data);
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
                      .getPackagesByPlanId(id, page + 1)
                      .then((res) => {
                        setPackages(res.data);
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
}
