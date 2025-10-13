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
import { useBilling } from "../billing/hook";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMoney } from "@/lib/formatter";
import {useScreen} from "@/context/screen.context";

export default function BillingPage() {
  const [searchType, setSearchType] = useState("partner");
  const { unmatchedReconcillbillingList, getUnmatchedReconcillBilling } = useBilling();
  console.log("🚀 ~ BillingPage ~ unmatchedReconcillbillingList:", unmatchedReconcillbillingList)
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const { setLoading } = useScreen();

  const handleRowsPerPageChange = (e: any) => {
    setRowsPerPage(e.target.value);
  };


  useEffect(() => {
    if (unmatchedReconcillbillingList && unmatchedReconcillbillingList.data) {
      setTotalItems(unmatchedReconcillbillingList.meta.total);
    } 
  }, [unmatchedReconcillbillingList]);

  useEffect(() => {
    getUnmatchedReconcillBilling(page, rowsPerPage,);
  }, [page, rowsPerPage]);



  return (
    <div className="flex flex-col w-full p-4 md:p-6 ">
      <div className="flex flex-wrap justify-start gap-4 pb-4 items-center">
        <h1 className="text-black font-bold sm:text-2xl text-xl mt-2 mb-4">
          Unmatched Reconciliation Billing List
        </h1>

      </div>
      <div className="w-full p-4 md:p-6 bg-white rounded-lg">
        <Table className="table-transactions">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">No.</TableHead>
              <TableHead>Billing No.</TableHead>
              <TableHead>Transaction Number</TableHead>
              <TableHead>Plan Name</TableHead>
              <TableHead>Transaction Date</TableHead>
              <TableHead style={{ width: "50px" }}>Currency</TableHead>
              <TableHead style={{ width: "50px", textAlign: "right" }}>Amount</TableHead>
              <TableHead style={{ width: "100px" }}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unmatchedReconcillbillingList.data?.map((billing: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="whitespace-nowrap">{index + 1}</TableCell>
                <TableCell>{billing.billings.billing_no}</TableCell>
                <TableCell>{billing.transaction_no}</TableCell>
                <TableCell>{billing.details?.plan_name || billing.plan_name}</TableCell>
                <TableCell>{billing.details?.transaction_date || billing.created_at}</TableCell>
                <TableCell>{billing.billings?.currency}</TableCell>
                {/* <TableCell>{billing.status_reconcilliation}</TableCell> */}

                <TableCell style={{ textAlign: "right" }}>
                  {billing.status_reconcilliation === "not-found-in-system"
                    ? formatMoney(billing.amount)
                    : billing.status_reconcilliation === "not-found-in-excel"
                    ? billing.billings?.type === "insurer"
                      ? formatMoney(billing.commission_amount ?? 0)
                      : billing.billings?.type === "partner"
                      ? formatMoney((+billing.amount || 0) - (+billing.commission_amount || 0))
                      : "-"
                    : "-"}
                </TableCell>
                <TableCell
                  style={{
                    color:
                      billing.status_reconcilliation === "not-found-in-system"
                        ? "red"
                        : billing.status_reconcilliation === "not-found-in-excel"
                        ? "orange"
                        : "inherit",
                  }}
                >
                  {(billing.status_reconcilliation?.split("-") || [])
                    .map(
                      (word: string) =>
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    )
                    .join(" ")}
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
