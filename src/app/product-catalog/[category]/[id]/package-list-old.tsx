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
    productCatalogService.getPackagesByPlanId(id, page).then((response) => {
      setPackages(response.data);
      setPage(response.meta.page);
      setTotalPages(response.meta.total);
    });
  }, [id]);

  return (
    <div className="w-full p-6 bg-white rounded-lg overflow-auto">
      <Table className="table-search-params">
        <TableHeader>
          <TableRow>
            {packages.some((pkg) => pkg.search_params.trip) && (
              <TableHead>Type</TableHead>
            )}
            {packages.some((pkg) => pkg.search_params.trip) && (
              <TableHead>Duration</TableHead>
            )}
            {packages.some((pkg) => pkg.search_params.trip) && (
              <TableHead>Adult Participant</TableHead>
            )}
            {packages.some((pkg) => pkg.search_params.trip) && (
              <TableHead>Children Participant</TableHead>
            )}
            {/* <TableHead>Search Params</TableHead> */}
            <TableHead className="whitespace-nowrap">Currency</TableHead>
            <TableHead>Premium</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages?.map((packageData) => (
            <TableRow key={packageData.id}>
              {packageData.search_params.trip && (
                <TableCell>{packageData.search_params.trip}</TableCell>
              )}
              {packageData.search_params.trip && (
                <TableCell>
                  {packageData.search_params.duration_to} days
                </TableCell>
              )}
              {packageData.search_params.trip && (
                <TableCell>{packageData.search_params.adult}</TableCell>
              )}
              {packageData.search_params.trip && (
                <TableCell>{packageData.search_params.children}</TableCell>
              )}
              {/* <TableCell className="td-search-params">
                {Object.keys(packageData.search_params).map((value, i) => (
                  <div key={i}>
                    {value}:{" "}
                    {Array.isArray(packageData.search_params[value])
                      ? packageData.search_params[value].join(",")
                      : packageData.search_params[value]}
                  </div>
                ))}
              </TableCell> */}
              <TableCell>{packageData.currency}</TableCell>
              <TableCell className="whitespace-nowrap">
                {formatMoney(packageData.premium, packageData.currency)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="hidden">
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
