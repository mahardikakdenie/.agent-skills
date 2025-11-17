import { Column } from "@/components/ui/DataTable";
import { formatDate, formatMoney } from "@/lib/formatter";

export interface BillingDetailItem {
  id: string;
  invoice_no: string;
  amount: number;
  commission_percentage: number;
  commission_amount: number;
  status_reconcilliation?: string;
  details: {
    plan_name: string;
    product_name: string;
    insurance_name: string;
    transaction_date: string;
  };
}

export interface BillingDetailTableConfigProps {
  type: string;
  currency: string;
}

const getReconciliationColor = (status?: string) => {
  const colors: Record<string, string> = {
    "not-matched": "#d27979",
    matched: "#64a864",
  };
  return colors[status || ""] || "#6B7280";
};

export const createBillingDetailTableColumns = ({
  type,
  currency,
}: BillingDetailTableConfigProps): Column<BillingDetailItem>[] => {
  const columns: Column<BillingDetailItem>[] = [
    {
      key: "invoice_no",
      header: "Transaction Number",
    },
    {
      key: "plan_name",
      header: "Plan Name",
      render: (item) => item.details?.plan_name?.split("|").join("\n") || "-",
    },
  ];

  if (type === "partner") {
    columns.push({
      key: "insurance_name",
      header: "Insurance Company Name",
      render: (item) => item.details?.insurance_name || "-",
    });
  }

  columns.push(
    {
      key: "transaction_date",
      header: "Transaction Date",

      render: (item) =>
        formatDate(item.details?.transaction_date, "YYYY-MM-DD"),
    },
    {
      key: "currency",
      header: "Currency",

      render: () => currency,
    },
    {
      key: "premium",
      header: "Premium",
      className: "text-right",
      classNameHeading: "text-right",

      render: (item) => formatMoney(item.amount),
    },
    {
      key: "commission_percentage",
      header: "%",
      className: "text-right",
      classNameHeading: "text-right",

      render: (item) => `${item.commission_percentage ?? 0}%`,
    }
  );

  if (type === "insurer") {
    columns.push({
      key: "commission_amount",
      header: "Commission Amount",
      className: "text-right",
      classNameHeading: "text-right",

      render: (item) => formatMoney(item.commission_amount ?? 0),
    });
  } else {
    columns.push({
      key: "net_premium",
      header: "Net Premium",
      className: "text-right",
      classNameHeading: "text-right",

      render: (item) =>
        formatMoney(item.amount - (item.commission_amount ?? 0)),
    });
  }

  columns.push({
    key: "status_reconcilliation",
    header: "Status Reconciliation",

    render: (item) => {
      const status = item.status_reconcilliation;
      if (!status) return "-";

      return (
        <span
          className="font-bold capitalize"
          style={{ color: getReconciliationColor(status) }}
        >
          {status
            .split("-")
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ")}
        </span>
      );
    },
  });

  return columns;
};
