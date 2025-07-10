"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { TRANSACTIONS } from "@/constants/routes";
import WithSidebar from "@/hoc/with-sidebar";
import { formatMoney } from "@/lib/formatter";
import { TransactionService } from "@/services/transaction.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft } from "react-feather";
import { useParams } from "react-router-dom";

const DetailTransaction = ({ params }: { params: { id: string } }) => {
  const [transaction, setTransaction] = useState<any>(null);
  useEffect(() => {
    const transactionService = new TransactionService();
    if (params.id) {
      transactionService
        .getTransaction(params.id as string)
        .then((res: any) => {
          setTransaction(res);
        });
    }
  }, [params.id]);
  if (!transaction) {
    return <div>Loading...</div>;
  }

  const handleUpdateToPaid = async (id: string) => {
    const transactionService = new TransactionService();
    try {
      await transactionService.updatePaymentTransaction(id, {
        payment_info: "Paid",
      });
      setTransaction((prev: any) => ({ ...prev, status: "Paid" }));
    } catch (error) {
      alert(error);
    }
  };

  const currencies = transaction.insurance.insurance.currencies;
  const currency = currencies.find(
    (currency: any) =>
      currency.currency_from === transaction.insurance.package_data.currency &&
      currency.currency_to === "IDR"
  );

  const convertedPremium =
    (currency?.value ?? 1) * transaction.insurance.premium;

  const premiumWithEmbeddedDiscount =
    transaction.insurance?.plan?.premium_discount_type === "percentage"
      ? convertedPremium -
        (transaction.insurance.plan.premium_discount_value / 100) *
          convertedPremium
      : convertedPremium - transaction.insurance.plan.premium_discount_value;

  let premiumWithVoucherDiscount = premiumWithEmbeddedDiscount;
  if (transaction.voucher_info) {
    premiumWithVoucherDiscount =
      transaction.voucher_info?.data.value_type === "percentage"
        ? premiumWithEmbeddedDiscount -
          (transaction.voucher_info?.data.value / 100) *
            premiumWithEmbeddedDiscount
        : premiumWithEmbeddedDiscount - transaction.voucher_info?.data.value;
  }

  const totalPremium =
    premiumWithVoucherDiscount +
    transaction.fees
      .map((v: any) => v.value)
      .reduce((a: any, b: any) => {
        return a + b;
      }, 0);

  return (
    <div className="flex flex-col w-full">
      <div className="bg-white md:px-6 p-4 flex items-center">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={TRANSACTIONS}>
                  Transactions
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Detail</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-black font-bold text-2xl mt-2">
            Transaction Details
          </h2>
        </div>
        <Link
          href={TRANSACTIONS}
          className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>
      </div>
      <div className="flex flex-col w-full p-4 md:p-6 ">
        <div className="p-6 bg-white rounded-lg flex flex-col gap-4">
          <div className="flex gap-2 text-sm font-medium">
            <div className="min-w-40 w-40">Insurance Name</div>
            <div className="max-w-1 w-1">:</div>
            <div>{transaction.insurance.insurance.name}</div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="min-w-40 w-40">Plan Name</div>
            <div className="max-w-1 w-1">:</div>
            <div>{transaction.insurance.plan.name}</div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="min-w-40 w-40">Customer Name</div>
            <div className="max-w-1 w-1">:</div>
            <div>{transaction.customer.name}</div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="min-w-40 w-40">Amount</div>
            <div className="max-w-1 w-1">:</div>
            <div>{formatMoney(totalPremium, "IDR")}</div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="min-w-40 w-40">Status</div>
            <div className="max-w-1 w-1">:</div>
            <div className="text-warning">{transaction.status}</div>
          </div>
          {transaction.status.toLowerCase() === "pending" && (
            <div className="mt-4">
              <Button
                onClick={() => handleUpdateToPaid(transaction.id)}
                className="bg-primary text-white px-4 py-2 rounded-md"
              >
                Update to Paid
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailTransactionWithSidebar = (params: any) =>
  WithSidebar(DetailTransaction)(params);
export default DetailTransactionWithSidebar;
