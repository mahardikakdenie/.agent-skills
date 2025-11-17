import { Column } from "@/components/ui/DataTable";
import { formatDate, formatMoney } from "@/lib/formatter";

export interface BillingTransactionItem {
  id: string;
  invoice: string;
  created_at: string;
  currency: string;
  insurance: {
    plan: {
      name: string;
      id: string;
    };
    product: {
      id: string;
      name: string;
    };
    insurance: {
      id: {
        id: string;
        name: string;
      };
    };
    premium: string;
  };
  newPremium: number;
}

export interface BillingTransactionTableConfigProps {
  type: string;
  fees: any;
  company?: string;
}

export const createBillingTransactionTableColumns = ({
  type,
  fees,
  company,
}: BillingTransactionTableConfigProps): Column<BillingTransactionItem>[] => {
  const columns: Column<BillingTransactionItem>[] = [
    {
      key: "invoice",
      header: "Transaction Number",
    },
    {
      key: "plan",
      header: "Plan Name",
      render: (transaction) =>
        transaction.insurance?.plan?.name.split("|").join("\n") || "-",
    },
  ];

  // Add Insurance Company column for partner type
  if (type === "partner") {
    columns.push({
      key: "insurance_company",
      header: "Insurance Company Name",
      render: (transaction) =>
        transaction.insurance?.insurance?.id?.name || "-",
    });
  }

  columns.push(
    {
      key: "created_at",
      header: "Transaction Date",
      render: (transaction) => formatDate(transaction.created_at, "YYYY-MM-DD"),
    },
    {
      key: "currency",
      header: "Currency",
    },
    {
      key: "amount",
      header: "Amount",
      className: "text-right",
      classNameHeading: "text-right",
      render: (transaction) => formatMoney(transaction.newPremium),
    }
  );

  // Add Commission columns for insurer type
  if (type === "insurer") {
    columns.push(
      {
        key: "commission_percentage",
        header: "Commission Percentage",
        render: (transaction) => {
          const feeKey = `${transaction.insurance?.insurance?.id?.id}-${transaction.insurance?.product?.id}-${transaction.insurance?.plan?.id}`;
          return fees[feeKey]?.fee ?? 0;
        },
      },
      {
        key: "commission_amount",
        header: "Commission Amount",
        className: "text-right",
        classNameHeading: "text-right",
        render: (transaction) => {
          const feeKey = `${transaction.insurance?.insurance?.id?.id}-${transaction.insurance?.product?.id}-${transaction.insurance?.plan?.id}`;
          const feePercentage = fees[feeKey]?.fee ?? 0;
          const commission = (feePercentage / 100) * transaction.newPremium;
          return formatMoney(commission);
        },
      }
    );
  }

  return columns;
};
