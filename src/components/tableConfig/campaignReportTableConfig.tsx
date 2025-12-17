import { Column } from "../ui/DataTable";

export const createCampaignReportTableColumns = (): Column<any>[] => [
  {
    key: "campaign_name",
    header: "Campaign Name",
    render: (promotion) => {
      return (
        <div className="text-center">{promotion.campaign_name || "-"}</div>
      );
    },
  },
  {
    key: "type",
    header: "Type",
    render: (promotion) => {
      return <div className="text-center">{promotion.type || "-"}</div>;
    },
  },
  {
    key: "insurance_name",
    header: "Insurance Company Name",
    render: (promotion) => {
      return (
        <div className="text-center">{promotion.insurance_name || "-"}</div>
      );
    },
  },
  {
    key: "plan_name",
    header: "Plan Name",
    render: (promotion) => {
      return <div className="text-center">{promotion.plan_name || "-"}</div>;
    },
  },
  {
    key: "total_transaction_amount",
    header: "Transaction Amount",
    render: (promotion) => {
      return (
        <div className="text-center">
          {promotion.currency}{" "}
          {Number(promotion.total_transaction_amount).toLocaleString()}
        </div>
      );
    },
  },
  {
    key: "discount_amount",
    header: "Discount Amount",
    render: (promotion) => {
      const discountAmount =
        promotion.total_transaction_amount - promotion.total_discount_amount;
      return (
        <div className="text-center">
          {promotion.currency} {Number(discountAmount).toLocaleString()}
        </div>
      );
    },
  },
  {
    key: "total_discount_amount",
    header: "Transaction Amount after Discount",
    render: (promotion) => {
      return (
        <div className="text-center">
          {Number(promotion.total_discount_amount).toLocaleString()}
        </div>
      );
    },
  },
];
