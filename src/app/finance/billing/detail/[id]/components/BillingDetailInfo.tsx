import { formatMoney } from "@/lib/formatter";

interface BillingDetailInfoProps {
  billing: any;
  isInsurer: boolean;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    "waiting-for-payment": "#CC9B36",
    paid: "#00AB4F",
    cancelled: "#EF4444",
    "pending-reconcilliation": "#3B82F6",
  };
  return colors[status] || "#6B7280";
};

const formatStatus = (status: string) => {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const BillingDetailInfo = ({
  billing,
  isInsurer,
}: BillingDetailInfoProps) => {
  if (!billing) return null;

  const netPremium = (billing.total || 0) - (billing.total_commission || 0);

  return (
    <div className="pt-5 md:px-6 p-4 m-5 bg-white rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex">
            <span className="w-48 text-gray-600">Billing No</span>
            <span className="font-medium">: {billing.billing_no || "-"}</span>
          </div>

          <div className="flex">
            <span className="w-48 text-gray-600">Created Date</span>
            <span className="font-medium">
              :{" "}
              {billing.created_at
                ? new Date(billing.created_at).toLocaleDateString()
                : "-"}
            </span>
          </div>

          <div className="flex">
            <span className="w-48 text-gray-600">
              {isInsurer ? "Total Transaction Amount" : "Total Net Premium"}
            </span>
            <span className="font-medium">
              : {billing.currency || "IDR"}{" "}
              {formatMoney(isInsurer ? billing.total || 0 : netPremium)}
            </span>
          </div>

          {isInsurer && (
            <div className="flex">
              <span className="w-48 text-gray-600">
                Total Commission Amount
              </span>
              <span className="font-medium">
                : {billing.currency || "IDR"}{" "}
                {formatMoney(billing.total_commission || billing.amount || 0)}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex">
            <span className="w-48 text-gray-600">Type</span>
            <span className="font-medium capitalize">
              : {billing.type || "-"}
            </span>
          </div>

          <div className="flex">
            <span className="w-48 text-gray-600">Company Name</span>
            <span className="font-medium">: {billing.company_name || "-"}</span>
          </div>

          <div className="flex">
            <span className="w-48 text-gray-600">Period</span>
            <span className="font-medium">
              : {billing.transaction_period || "-"}
            </span>
          </div>

          <div className="flex">
            <span className="w-48 text-gray-600">Status</span>
            <span
              className="font-bold capitalize"
              style={{ color: getStatusColor(billing.status) }}
            >
              : {billing.status ? formatStatus(billing.status) : "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
