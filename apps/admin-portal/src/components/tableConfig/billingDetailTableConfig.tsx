import { Box, Skeleton, type ColumnDef } from "@repo/ui";
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
  page: number;
  rowsPerPage: number;
  transactionNumberSize?: number;
  planNameSize?: number;
  insuranceNameSize?: number;
  transactionDateSize?: number;
  currencySize?: number;
  premiumSize?: number;
  percentageSize?: number;
  commissionAmountSize?: number;
  statusReconciliationSize?: number;
}

const getReconciliationColor = (status?: string) => {
  const colors: Record<string, string> = {
    "not-matched": "#d27979",
    matched: "#64a864",
  };
  return colors[status || ""] || "#6B7280";
};

const formatTableOrdinalNumber = (value: number) =>
  new Intl.NumberFormat("id-ID").format(value);

export const createBillingDetailTableColumns = ({
  type,
  currency,
  page,
  rowsPerPage,
  transactionNumberSize = 160,
  planNameSize = 180,
  insuranceNameSize = 200,
  transactionDateSize = 140,
  currencySize = 80,
  premiumSize = 120,
  percentageSize = 60,
  commissionAmountSize = 150,
  statusReconciliationSize = 160,
}: BillingDetailTableConfigProps): ColumnDef<BillingDetailItem>[] => {
  const columns: ColumnDef<BillingDetailItem>[] = [
    {
      id: "index",
      header: "No.",
      enableSorting: false,
      enableResizing: false,
      size: 44,
      minSize: 44,
      meta: {
        headerCellClassName: "whitespace-nowrap",
        cellClassName: "align-middle text-slate-500",
        cellContentClassName: "whitespace-nowrap",
        loadingSkeleton: (
          <Box className="flex min-w-0 items-center">
            <Skeleton className="h-4 w-5 rounded-full" />
          </Box>
        ),
      },
      cell: ({ row }) =>
        formatTableOrdinalNumber((page - 1) * rowsPerPage + row.index + 1),
    },
    {
      accessorKey: "invoice_no",
      header: "Transaction Number",
      enableSorting: false,
      size: transactionNumberSize,
      minSize: 120,
      meta: {
        headerCellClassName: "whitespace-nowrap",
        cellClassName: "align-middle whitespace-nowrap",
        cellContentClassName: "whitespace-nowrap text-xs text-slate-700",
      },
    },
    {
      id: "plan_name",
      accessorFn: (item) => item.details?.plan_name || "-",
      header: "Plan Name",
      enableSorting: false,
      size: planNameSize,
      minSize: 140,
      meta: {
        headerCellClassName: "whitespace-nowrap",
        cellClassName: "align-middle",
        cellContentClassName: "whitespace-normal break-words",
      },
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
            {item.details?.plan_name?.split("|").join("\n") || "-"}
          </Box>
        );
      },
    },
  ];

  if (type === "partner") {
    columns.push({
      id: "insurance_name",
      accessorFn: (item) => item.details?.insurance_name || "-",
      header: "Insurance Company Name",
      enableSorting: false,
      size: insuranceNameSize,
      minSize: 160,
      meta: {
        headerCellClassName: "whitespace-nowrap",
        cellClassName: "align-middle",
        cellContentClassName: "whitespace-normal break-words",
      },
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
            {item.details?.insurance_name || "-"}
          </Box>
        );
      },
    });
  }

  columns.push(
    {
      id: "transaction_date",
      accessorFn: (item) => item.details?.transaction_date || "-",
      header: "Transaction Date",
      enableSorting: false,
      size: transactionDateSize,
      minSize: 116,
      meta: {
        headerCellClassName: "whitespace-nowrap",
        cellClassName: "align-middle whitespace-nowrap",
        cellContentClassName:
          "whitespace-nowrap text-xs tabular-nums text-slate-700",
      },
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Box>
            {item.details?.transaction_date
              ? formatDate(item.details?.transaction_date, "YYYY-MM-DD")
              : "-"}
          </Box>
        );
      },
    },
    {
      id: "currency",
      header: "Currency",
      enableSorting: false,
      size: currencySize,
      minSize: 60,
      meta: {
        headerCellClassName: "whitespace-nowrap",
        cellClassName: "align-middle whitespace-nowrap",
        cellContentClassName: "whitespace-nowrap text-xs text-slate-700",
      },
      cell: () => currency,
    },
    {
      id: "premium",
      accessorFn: (item) => item.amount,
      header: "Premium",
      enableSorting: false,
      size: premiumSize,
      minSize: 100,
      meta: {
        headerCellClassName: "whitespace-nowrap text-right",
        cellClassName: "align-middle whitespace-nowrap text-right",
        cellContentClassName: "whitespace-nowrap text-xs text-slate-700",
      },
      cell: ({ row }) => formatMoney(row.original.amount),
    },
    {
      id: "commission_percentage",
      accessorFn: (item) => item.commission_percentage,
      header: "%",
      enableSorting: false,
      size: percentageSize,
      minSize: 40,
      meta: {
        headerCellClassName: "whitespace-nowrap text-right",
        cellClassName: "align-middle whitespace-nowrap text-right",
        cellContentClassName: "whitespace-nowrap text-xs text-slate-700",
      },
      cell: ({ row }) => `${row.original.commission_percentage ?? 0}%`,
    }
  );

  if (type === "insurer") {
    columns.push({
      id: "commission_amount",
      accessorFn: (item) => item.commission_amount,
      header: "Commission Amount",
      enableSorting: false,
      size: commissionAmountSize,
      minSize: 120,
      meta: {
        headerCellClassName: "whitespace-nowrap text-right",
        cellClassName: "align-middle whitespace-nowrap text-right",
        cellContentClassName: "whitespace-nowrap text-xs text-slate-700",
      },
      cell: ({ row }) => formatMoney(row.original.commission_amount ?? 0),
    });
  } else {
    columns.push({
      id: "net_premium",
      header: "Net Premium",
      enableSorting: false,
      size: commissionAmountSize,
      minSize: 120,
      meta: {
        headerCellClassName: "whitespace-nowrap text-right",
        cellClassName: "align-middle whitespace-nowrap text-right",
        cellContentClassName: "whitespace-nowrap text-xs text-slate-700",
      },
      cell: ({ row }) =>
        formatMoney(row.original.amount - (row.original.commission_amount ?? 0)),
    });
  }

  columns.push({
    id: "status_reconcilliation",
    accessorFn: (item) => item.status_reconcilliation || "-",
    header: "Status Reconciliation",
    enableSorting: false,
    size: statusReconciliationSize,
    minSize: 140,
    meta: {
      headerCellClassName: "whitespace-nowrap",
      cellClassName: "align-middle whitespace-nowrap",
    },
    cell: ({ row }) => {
      const status = row.original.status_reconcilliation;
      if (!status) return "-";

      return (
        <Box
          as="span"
          className="font-bold capitalize text-xs"
          style={{ color: getReconciliationColor(status) }}
        >
          {status
            .split("-")
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ")}
        </Box>
      );
    },
  });

  return columns;
};
