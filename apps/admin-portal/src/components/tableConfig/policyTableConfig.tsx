import { Button } from "@/components/ui/button";
import { Column } from "../ui/DataTable";

interface CreatePolicyTableColumnsProps {
  page: number;
  rowsPerPage: number;
  onGoToDetail: (policyId: string) => void;
  getStatusColor: (status: string) => string;
}

export const createPolicyTableColumns = ({
  page,
  rowsPerPage,
  onGoToDetail,
  getStatusColor,
}: CreatePolicyTableColumnsProps): Column<any>[] => [
  {
    key: "id",
    header: "No.",
    render: (_, index) => (page - 1) * rowsPerPage + index + 1,
  },
  {
    key: "policy_holder.name",
    header: "Customer Name",
    render: (policy) => {
      return (
        <div className="flex gap-2 items-center">
          {policy?.policy_holder?.name || "-"}
        </div>
      );
    },
  },
  {
    key: "number",
    header: "Policy Number",
    render: (policy) => {
      return <div>{policy.number}</div>;
    },
  },
  {
    key: "policy_products.plan_data.name",
    header: "Plan Name",
    render: (policy) => {
      return (
        <div className="min-w-44">
          {policy?.policy_products?.plan_data?.name?.split("|").join(" - ") ||
            "-"}
        </div>
      );
    },
  },
  {
    key: "start_date",
    header: "Effective Date",
    render: (policy) => {
      return (
        <div className="whitespace-nowrap">{policy?.start_date || "-"}</div>
      );
    },
  },
  {
    key: "end_date",
    header: "Expiry Date",
    render: (policy) => {
      return <div className="whitespace-nowrap">{policy?.end_date || "-"}</div>;
    },
  },
  {
    key: "status",
    header: "Status",
    render: (policy) => {
      return (
        <div className="font-semibold whitespace-nowrap">
          <span className={getStatusColor(policy.status)}>{policy.status}</span>
        </div>
      );
    },
  },
  {
    key: "action",
    header: "Action",
    render: (policy) => {
      return (
        <Button
          onClick={() => onGoToDetail(policy.id)}
          className="rounded-full"
        >
          View
        </Button>
      );
    },
  },
];

export const createPendingRenewalsTableColumns = ({
  page,
  rowsPerPage,
  onGoToDetail,
  getStatusColor,
  getStageColor,
}: CreatePolicyTableColumnsProps & {
  getStageColor?: (stage: string) => string;
}): Column<any>[] => [
  {
    key: "id",
    header: "No.",
    render: (_, index) => (page - 1) * rowsPerPage + index + 1,
  },
  {
    key: "policy_holder.name",
    header: "Customer Name",
    render: (policy) => {
      return (
        <div className="flex gap-2 items-center">
          {policy?.policy_holder?.name || "-"}
        </div>
      );
    },
  },
  {
    key: "number",
    header: "Policy Number",
    render: (policy) => {
      return <div>{policy.number}</div>;
    },
  },
  {
    key: "policy_products.plan_data.name",
    header: "Plan Name",
    render: (policy) => {
      return (
        <div className="min-w-44">
          {policy?.policy_products?.plan_data?.name?.split("|").join(" - ") ||
            "-"}
        </div>
      );
    },
  },
  {
    key: "end_date",
    header: "Expiry Date",
    render: (policy) => {
      return <div className="whitespace-nowrap">{policy?.end_date || "-"}</div>;
    },
  },
  {
    key: "stage",
    header: "Stage",
    render: (policy) => {
      const stageColor =
        getStageColor?.(policy?.notification_log[0]?.stage || "") ||
        "text-gray-600";
      return (
        <div className="font-semibold whitespace-nowrap">
          <span className={stageColor}>
            {policy?.notification_log[0]?.stage || "-"}
          </span>
        </div>
      );
    },
  },
  {
    key: "email_status",
    header: "Email Status",
    render: (policy) => {
      return (
        <div className="font-semibold whitespace-nowrap">
          <span
            className={getStatusColor(
              policy?.notification_log[0]?.status || "",
            )}
          >
            {policy?.notification_log[0]?.status || "-"}
          </span>
        </div>
      );
    },
  },
  {
    key: "email_sent",
    header: "Email Sent",
    render: (policy) => {
      return <div>{policy?.notification_log?.length || "-"}</div>;
    },
  },
  {
    key: "action",
    header: "Action",
    render: (policy) => {
      return (
        <Button
          onClick={() => onGoToDetail(policy.id)}
          className="rounded-full"
        >
          View
        </Button>
      );
    },
  },
];
