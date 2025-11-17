"use client";

import { useBilling } from "../billing/hook";
import { formatMoney } from "@/lib/formatter";
import { DataTable, Column } from "@/components/ui/DataTable";

export default function UnmatchedBillingPage() {
  const {
    unmatchedReconcillBillings,
    unmatchedReconcillBillingsMeta,
    isLoadingUnmatchedReconcillBillings,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
  } = useBilling();

  const totalItems = unmatchedReconcillBillingsMeta?.total || 0;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const getStatusColor = (status: string) => {
    if (status === "not-found-in-system") return "red";
    if (status === "not-found-in-excel") return "orange";

    return "inherit";
  };

  const formatStatus = (status: string) => {
    return (status?.split("-") || [])
      .map(
        (word: string) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
  };

  const columns: Column<any>[] = [
    {
      key: "index",
      header: "No.",
      render: (_, index) => (page - 1) * rowsPerPage + index + 1,
    },
    {
      key: "billings.billing_no",
      header: "Billing No.",
    },
    {
      key: "transaction_no",
      header: "Transaction Number",
    },
    {
      key: "plan_name",
      header: "Plan Name",
      render: (item) => item.details?.plan_name || item.plan_name || "-",
    },
    {
      key: "transaction_date",
      header: "Transaction Date",
      render: (item) =>
        item.details?.transaction_date || item.created_at || "-",
    },
    {
      key: "billings.currency",
      header: "Currency",
      className: "w-[50px]",
    },
    {
      key: "amount",
      header: "Amount",
      classNameHeading: "text-right",
      className: "text-right w-[50px]",
      render: (item) => {
        const status = item.status_reconcilliation;
        const billingType = item.billings?.type;
        const amount = parseFloat(item.amount || "0");
        const commissionAmount = parseFloat(item.commission_amount || "0");

        let displayAmount = "-";

        if (status === "not-found-in-system") {
          displayAmount = formatMoney(amount);
        } else if (status === "not-found-in-excel") {
          if (billingType === "insurer") {
            displayAmount = formatMoney(commissionAmount);
          } else if (billingType === "partner") {
            displayAmount = formatMoney(amount - commissionAmount);
          }
        }

        return displayAmount;
      },
    },
    {
      key: "status_reconcilliation",
      header: "Status",
      className: "w-[100px]",
      render: (item) => {
        const status = item.status_reconcilliation;
        const formattedStatus = formatStatus(status);

        return (
          <span style={{ color: getStatusColor(status) }}>
            {formattedStatus}
          </span>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex flex-wrap justify-start gap-4 pb-4 items-center">
        <h1 className="text-black font-bold sm:text-2xl text-xl mt-2 mb-4">
          Unmatched Reconciliation Billing List
        </h1>
      </div>

      <DataTable
        data={unmatchedReconcillBillings || []}
        columns={columns}
        loading={isLoadingUnmatchedReconcillBillings}
        pagination={{
          page,
          totalPages,
          rowsPerPage,
          totalItems,
          onPageChange: setPage,
          onRowsPerPageChange: (e) => setRowsPerPage(parseInt(e.target.value)),
        }}
        noDataText="No unmatched transactions found"
      />
    </div>
  );
}
