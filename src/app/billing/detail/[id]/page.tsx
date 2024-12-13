"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WithSidebar from "@/hoc/with-sidebar";
import useRequireAuth from "@/hooks/useRequireAuth";
import { useEffect, useState } from "react";
import { useBilling, useChannel, useTransaction } from "../../hook";
import { useProduct } from "../../../masterdata/product/hooks";
import { useLoading } from "@/context/loading.context";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { channel } from "diagnostics_channel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMoney } from "@/lib/formatter";
import { useParams } from "next/navigation";

const DetailBillingPage = () => {
  useRequireAuth();

  const { getBillingById, billing } = useBilling();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const handleRowsPerPageChange = (e: any) => {
    setRowsPerPage(e.target.value);
  };

  const { id } = useParams();
  const months = [
    {
      value: "1",
      name: "January",
    },
    {
      value: "2",
      name: "February",
    },
    {
      value: "3",
      name: "March",
    },
    {
      value: "4",
      name: "April",
    },
    {
      value: "5",
      name: "May",
    },
    {
      value: "6",
      name: "June",
    },
    {
      value: "7",
      name: "July",
    },
    {
      value: "8",
      name: "August",
    },
    {
      value: "9",
      name: "September",
    },
    {
      value: "10",
      name: "October",
    },
    {
      value: "11",
      name: "November",
    },
    {
      value: "12",
      name: "December",
    },
  ];

  const handlePaging = (page: number) => {
    setPage(page);
    (async () => {
      const search = {
        status: "Declaration",
        limit: rowsPerPage,
      };

      await getBillingById(id as string, page, rowsPerPage);
    })();
  };

  useEffect(() => {
    getBillingById(id as string, 1, rowsPerPage);
  }, [id]);
  return (
    billing.data && (
      <div className="flex flex-col w-full p-4 md:p-6 ">
        <div className="flex justify-between items-center">
          <h1 className="text-black font-bold sm:text-2xl text-xl mt-2 mb-4">
            Billing Detail
          </h1>
        </div>

        <div className="pt-5">
          <div className="p-4 md:p-6 bg-white rounded-lg overflow-x-auto">
            <div>Billing No. {billing.data[0].billings.billing_no}</div>
            <div>
              Total Amount: {formatMoney(billing.data[0].billings.amount)}
            </div>
            <div>
              Billing Created Date:{" "}
              {new Date(billing.data[0].billings.created_at).toDateString()}
            </div>
            <div>
              Status:{" "}
              {billing.data[0].billings.status
                .split("-")
                .map(
                  (word: any) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")}
            </div>

            <div className="pt-5 grid grid-cols-2"></div>
          </div>
        </div>

        <div className="pt-5">
          <div className="p-4 md:p-6 bg-white rounded-lg overflow-x-auto">
            <Table className="table-claims w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction Number</TableHead>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Insurance Company Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Transaction Date</TableHead>
                  <TableHead>Commision Percentage</TableHead>
                  <TableHead>Commision Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billing &&
                  billing.data?.map((data: any) => {
                    return (
                      <TableRow key={data.id}>
                        <TableCell>{data.invoice}</TableCell>
                        <TableCell>
                          {data.details?.plan_name.split("|").join("\n")}
                        </TableCell>
                        <TableCell>{data.details.insurance_name}</TableCell>
                        <TableCell>{formatMoney(data.amount)}</TableCell>
                        <TableCell>{data.details.transaction_date}</TableCell>
                        <TableCell>{data.commission_percentage ?? 0}</TableCell>
                        <TableCell>
                          {formatMoney(data.commission_amount ?? 0)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
                      <span className="mr-2">
                        of {billing.data.total} items
                      </span>
                      <button
                        onClick={() => handlePaging(page - 1)}
                        disabled={page === 1}
                        title="Prev"
                      >
                        <ChevronLeft />
                      </button>
                      <button
                        onClick={() => handlePaging(page + 1)}
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
    )
  );
};

const DetailBillingWithSidebar = (params: any) =>
  WithSidebar(DetailBillingPage)(params);
export default DetailBillingWithSidebar;
