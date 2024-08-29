"use client";
import WithSidebar from "@/hoc/with-sidebar";
import { formatMoney } from "@/lib/formatter";
import { TransactionService } from "@/services/transaction.service";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
    transaction.insurance.plan.premium_discount_type === "percentage"
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
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
        <div className="mb-2">
          <span className="font-semibold">Insurance Name: </span>
          {transaction.insurance.insurance.name}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Plan Name: </span>
          {transaction.insurance.plan.name}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Customer Name: </span>
          {transaction.customer.name}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Amount: </span>
          {formatMoney(totalPremium, "IDR")}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Status: </span>
          {transaction.status}
        </div>

        {transaction.status.toLowerCase() === "pending" && (
          <button
            onClick={() => handleUpdateToPaid(transaction.id)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Update to Paid
          </button>
        )}
      </div>
    </div>
  );
};

const DetailTransactionWithSidebar = (params: any) =>
  WithSidebar(DetailTransaction)(params);
export default DetailTransactionWithSidebar;
