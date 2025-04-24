"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import WithSidebar from "@/hoc/with-sidebar";
import { Search } from "react-feather";
import { useBilling } from "./hook";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, List, Printer } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatMoney } from "@/lib/formatter";

const BillingPage = () => {
  const { billingList, getBilling } = useBilling();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const handleRowsPerPageChange = (e: any) => {
    setRowsPerPage(e.target.value);
  };

  useEffect(() => {
    getBilling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (billingList && billingList.data) {
      setTotalItems(billingList.meta.total);
    }
  }, [billingList]);

  useEffect(() => {
    getBilling(page, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const router = useRouter();
  return (
    <div className="flex flex-col w-full p-4 md:p-6 ">
      <h1 className="text-black font-bold sm:text-2xl text-xl mt-2 mb-4">
        Billing List
      </h1>
      <div className="pb-5">
        <Button
          className="btn btn-primary"
          onClick={() => router.push("/billing/add")}
        >
          Create Billing
        </Button>
      </div>
      <div className="w-full p-4 md:p-6 bg-white rounded-lg">
        <Table className="table-transactions">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">No.</TableHead>
              <TableHead>Billing No.</TableHead>
              <TableHead>Billing Date</TableHead>
              <TableHead>Transaction Period</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {billingList.data?.map((billing: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="whitespace-nowrap">{index + 1}</TableCell>
                <TableCell>{billing.billing_no}</TableCell>
                <TableCell>{billing.created_at}</TableCell>
                <TableCell>{billing.transaction_period}</TableCell>
                <TableCell>{billing.type}</TableCell>
                <TableCell>{billing.company_name}</TableCell>
                <TableCell>{formatMoney(billing.amount)}</TableCell>
                <TableCell>
                  {billing.status
                    .split("-")
                    .map(
                      (word: string) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(" ")}
                </TableCell>
                <TableCell className="flex">
                  <div className="relative group">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        router.push(`billing/detail/${billing.id}`)
                      }
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      View Detail
                    </span>
                  </div>
                  <div className="relative group">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        router.push(`billing/detail/${billing.id}/invoice`)
                      }
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      View Invoice
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={10}>
                <div className="flex justify-center items-center gap-2 font-normal">
                  <label htmlFor="rowsPerPage">Showing:</label>
                  <select
                    id="rowsPerPage"
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    className="p-2 border rounded"
                  >
                    {[10, 20, 30, 50, 100].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span className="mr-2">of {totalItems} items</span>
                  <button
                    onClick={() => setPage((prevState) => prevState - 1)}
                    disabled={page === 1}
                    title="Prev"
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

const BillingPageWithSidebar = (params: any) =>
  WithSidebar(BillingPage)(params);
export default BillingPageWithSidebar;
