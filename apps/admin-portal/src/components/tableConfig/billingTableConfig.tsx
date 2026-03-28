import { Button } from "@repo/ui";
import { formatDate, formatMoney } from "@/lib/formatter";
import { Column } from "@/components/ui/DataTable";
import { EyeIcon, File } from "lucide-react";

export interface BillingItem {
  id: string;
  billing_no: string;
  created_at: string;
  category: string;
  currency: string;
  amount: number;
  total: number;
  status: string;
}

export interface BillingTableConfigProps {
  page: number;
  rowsPerPage: number;
  searchType: string;
  searchCategory: string;
  categories: any[];
  onViewDetail: (id: string, channel: string, type: string) => void;
  onViewInvoice: (id: string, type: string, channel: string) => void;
  searchChannel: string;
}

export const createBillingTableColumns = ({
  page,
  rowsPerPage,
  searchType,
  searchCategory,
  categories,
  onViewDetail,
  onViewInvoice,
  searchChannel,
}: BillingTableConfigProps): Column<BillingItem>[] => {
  const baseColumns: Column<BillingItem>[] = [
    {
      key: "index",
      header: "No.",
      className: "whitespace-nowrap",
      render: (_, index) => (page - 1) * rowsPerPage + index + 1,
    },
    {
      key: "billing_no",
      header: "Billing No.",
    },
    {
      key: "created_at",
      header: "Billing Date",
      render: (billing) => formatDate(billing.created_at, "YYYY-MM-DD"),
    },
  ];

  // Conditionally add Category column if "All" is selected
  if (searchCategory === "All") {
    baseColumns.push({
      key: "category",
      header: "Category",
      render: (billing) =>
        categories.find((c) => c.id === billing.category)?.name || "-",
    });
  }

  // Add remaining columns
  baseColumns.push(
    {
      key: "currency",
      header: "Currency",
      className: "w-[50px]",
    },
    {
      key: "amount",
      header: "Amount",
      className: "w-[50px] text-right",
      classNameHeading: "text-right",
      render: (billing) =>
        searchType === "insurer"
          ? formatMoney(billing.amount)
          : formatMoney(billing.total - billing.amount),
    },
    {
      key: "status",
      header: "Status",
      render: (billing) =>
        billing.status
          .split("-")
          .map(
            (word: string) =>
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" "),
    },
    {
      key: "action",
      header: "Action",
      render: (billing) => (
        <div className="flex">
          <div className="relative group">
            <Button
              variant="ghost"
              size="md"
              className="w-9 px-0"
              onClick={() =>
                onViewDetail(billing.id, searchChannel, searchType)
              }
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              View Detail
            </span>
          </div>
          <div className="relative group">
            <Button
              variant="ghost"
              size="md"
              className="w-9 px-0"
              onClick={() =>
                onViewInvoice(billing.id, searchType, searchChannel)
              }
            >
              <File className="h-4 w-4" />
            </Button>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {searchType === "insurer"
                ? "View Invoice"
                : "View Listing Detail"}
            </span>
          </div>
        </div>
      ),
    }
  );

  return baseColumns;
};
