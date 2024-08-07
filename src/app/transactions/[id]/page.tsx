"use client";
import WithSidebar from "@/hoc/with-sidebar";
import { moneyFormatter } from "@/lib/formatter";
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
          {moneyFormatter.format(
            (transaction.insurance.insurance.currencies[0]?.value ?? 1) *
              transaction.insurance.premium
          )}
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
