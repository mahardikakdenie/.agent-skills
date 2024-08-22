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
import { TransactionService } from "@/services/transaction.service";
import { useEffect, useState } from "react";
import { moneyFormatter } from "@/lib/formatter";
import { useRouter } from "next/navigation";

const TransactionsPage = () => {
  useRequireAuth();
  const transactionService = new TransactionService();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  useEffect(() => {
    transactionService.getTransactions(1).then((res) => {
      setTransactions(res.data);
      setPage(res.page);
      setTotalPages(res.pageTotal);
    });
  }, []);

  const handleViewDetail = (id: string) => {
    router.push("/transactions/" + id);
  };
  return (
    <div className="w-full p-6 m-2 bg-white rounded shadow-md">
      <h1 className="text-2xl font-semibold">Transactions</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Insurance Name</TableHead>
            <TableHead>Plan Name</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const currencies = transaction.insurance.insurance.currencies;
            const currency = currencies.find(
              (currency: any) =>
                currency.currency_from === transaction.insurance.currency &&
                currency.currency_to === "IDR"
            );

            const convertedPremium =
              (currency?.value ?? 1) * transaction.insurance.premium;

            const premiumWithEmbeddedDiscount =
              transaction.insurance.plan.premium_discount_type === "percentage"
                ? convertedPremium -
                  (transaction.insurance.plan.premium_discount_value / 100) *
                    convertedPremium
                : convertedPremium -
                  transaction.insurance.plan.premium_discount_value;

            let premiumWithVoucherDiscount = premiumWithEmbeddedDiscount;
            if (transaction.voucher_info) {
              premiumWithVoucherDiscount =
                transaction.voucher_info?.data.value_type === "percentage"
                  ? premiumWithEmbeddedDiscount -
                    (transaction.voucher_info?.data.value / 100) *
                      premiumWithEmbeddedDiscount
                  : premiumWithEmbeddedDiscount -
                    transaction.voucher_info?.data.value;
            }

            let totalPremium = premiumWithVoucherDiscount;

            if (transaction.fees) {
              totalPremium =
                premiumWithVoucherDiscount +
                transaction.fees
                  .map((v: any) => v.value)
                  .reduce((a: any, b: any) => {
                    return a + b;
                  }, 0);
            }

            return (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.insurance.insurance.id.name}</TableCell>
                <TableCell>
                  {transaction.insurance.plan.name
                    .split("|")
                    .splice(0, 2)
                    .join(" - ")}
                </TableCell>
                <TableCell>{transaction.customer.name}</TableCell>
                <TableCell>IDR</TableCell>
                <TableCell>{moneyFormatter.format(totalPremium)}</TableCell>
                <TableCell>{transaction.status}</TableCell>
                <TableCell>
                  <button
                    onClick={() => handleViewDetail(transaction.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    View
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    transactionService.getTransactions(page - 1).then((res) => {
                      setTransactions(res.data);
                      setPage(res.page);
                      setTotalPages(res.pageTotal);
                    });
                  }}
                  disabled={page === 1}
                  className="bg-slate-950 text-white px-4 py-2 rounded mr-2"
                >
                  Prev
                </button>
                <button
                  onClick={() => {
                    transactionService.getTransactions(page + 1).then((res) => {
                      setTransactions(res.data);
                      setPage(res.page);
                      setTotalPages(res.pageTotal);
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
