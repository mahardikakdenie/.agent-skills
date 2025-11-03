import { Button } from "@/components/ui/button";
import { Column } from "../ui/DataTable";

export const createMembershipTableColumns = ({
  goToDetail,
  getStatusColor,
  page,
  rowsPerPage,
}: {
  goToDetail: (id: string) => void;
  getStatusColor: (status: string) => string;
  page: number;
  rowsPerPage: number;
}): Column<any>[] => [
  {
    key: "number",
    header: "No.",
    render: (_, index) => (page - 1) * rowsPerPage + index + 1,
  },
  {
    key: "policy.number",
    header: "Policy Number",
    render: (item) => {
      return <div className="min-w-[180px]">{item?.number || "-"}</div>;
    },
  },
  {
    key: "profile.subsidiary",
    header: "Subsidiary / Entity",
    render: (item) => {
      return (
        <div className="min-w-[230px]">{item?.profile?.subsidiary || "-"}</div>
      );
    },
  },
  {
    key: "profile.employee_id",
    header: "Employee ID",
    render: (item) => {
      return <div>{item?.profile?.employee_id || "-"}</div>;
    },
  },
  {
    key: "profile.employee_name",
    header: "Employee Name",
    render: (item) => {
      return (
        <div className="min-w-[240px]">
          {item?.profile?.employee_name || "-"}
        </div>
      );
    },
  },
  {
    key: "profile.member_name",
    header: "Member Name",
    render: (item) => {
      return (
        <div className="min-w-[240px]">{item?.profile?.member_name || "-"}</div>
      );
    },
  },
  {
    key: "profile.gender",
    header: "Gender",
    render: (item) => {
      return <div className="text-center">{item?.profile?.gender || "-"}</div>;
    },
  },
  {
    key: "profile.date_of_birth",
    header: "Date of Birth",
    render: (item) => {
      return <div>{item?.profile?.date_of_birth || "-"}</div>;
    },
  },
  {
    key: "profile.member_status",
    header: "Member Status",
    render: (item) => {
      return (
        <div className="text-center">{item?.profile?.member_status || "-"}</div>
      );
    },
  },
  {
    key: "profile.marital_status",
    header: "Marital Status",
    render: (item) => {
      return <div>{item?.profile?.marital_status || "-"}</div>;
    },
  },
  {
    key: "profile.plan",
    header: "Plan",
    render: (item) => {
      return <div>{item?.profile?.plan || "-"}</div>;
    },
  },
  {
    key: "profile.effective_date",
    header: "Effective Date",
    render: (item) => {
      return <div>{item?.profile?.effective_date || "-"}</div>;
    },
  },
  {
    key: "profile.remarks",
    header: "Remarks",
    render: (item) => {
      return <div>{item?.profile?.remarks || "-"}</div>;
    },
  },
  {
    key: "profile.bank_name",
    header: "Bank Name",
    render: (item) => {
      return <div>{item?.profile?.bank_name || "-"}</div>;
    },
  },
  {
    key: "profile.branch",
    header: "Branch",
    render: (item) => {
      return <div>{item?.profile?.branch || "-"}</div>;
    },
  },
  {
    key: "profile.bank_account_number",
    header: "Bank Number",
    render: (item) => {
      return <div>{item?.profile?.bank_account_number || "-"}</div>;
    },
  },
  {
    key: "profile.bank_account_name",
    header: "Bank Account Name",
    render: (item) => {
      return (
        <div className="min-w-[200px]">
          {item?.profile?.bank_account_name || "-"}
        </div>
      );
    },
  },
  {
    key: "profile.email",
    header: "Email",
    render: (item) => {
      return <div>{item?.profile?.email || "-"}</div>;
    },
  },
  {
    key: "other_info.tpa_member_id",
    header: "Membership ID",
    render: (item) => {
      return <div>{item?.other_info?.tpa_member_id || "-"}</div>;
    },
  },
  {
    key: "created_at",
    header: "Submission Date",
    render: (item) => {
      return (
        <div>
          {item?.created_at
            ? new Date(item.created_at).toISOString().split("T")[0]
            : "-"}
        </div>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    render: (item) => {
      const status = item?.status || "-";
      return (
        <div className="font-semibold">
          <span className={getStatusColor(status)}>{status}</span>
        </div>
      );
    },
  },
  {
    key: "action",
    header: "Action",
    render: (item) => {
      return (
        <Button onClick={() => goToDetail(item.id)} className="rounded-full">
          View
        </Button>
      );
    },
  },
];
