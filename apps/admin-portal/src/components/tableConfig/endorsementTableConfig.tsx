import { Button } from "@repo/ui";
import { Column } from "../ui/DataTable";

interface CreateEndorsementTableColumnsProps {
  page: number;
  rowsPerPage: number;
  onGoToDetail: (endorsementId: string) => void;
  getStatusColor: (status: string) => string;
}

export const createEndorsementTableColumns = ({
  page,
  rowsPerPage,
  onGoToDetail,
  getStatusColor,
}: CreateEndorsementTableColumnsProps): Column<any>[] => [
  {
    key: "index",
    header: "No.",
    render: (_, index) => (page - 1) * rowsPerPage + index + 1,
  },
  {
    key: "number",
    header: "Request ID",
    render: (endorsement) => {
      return <div className="min-w-[180px]">{endorsement.number || "-"}</div>;
    },
  },
  {
    key: "insured_name",
    header: "Insured Name",
    render: (endorsement) => {
      const insuredName =
        endorsement?.insured_parties?.profile?.name ||
        endorsement?.policies?.policy_holders?.name ||
        endorsement?.participants?.profile?.name ||
        "-";
      return <div>{insuredName}</div>;
    },
  },
  {
    key: "policies.number",
    header: "Policy Number",
    render: (endorsement) => {
      return (
        <div className="min-w-[170px]">
          {endorsement?.policies?.number || "-"}
        </div>
      );
    },
  },
  {
    key: "created_at",
    header: "Request Date",
    render: (endorsement) => {
      return (
        <div>
          {endorsement?.created_at
            ? new Date(endorsement.created_at).toLocaleDateString("en-GB")
            : "-"}
        </div>
      );
    },
  },
  {
    key: "updated_at",
    header: "Approve/Rejected Date",
    render: (endorsement) => {
      return (
        <div>
          {endorsement?.status !== "Pending" && endorsement?.updated_at
            ? new Date(endorsement.updated_at).toLocaleDateString("en-GB")
            : "-"}
        </div>
      );
    },
  },
  {
    key: "type",
    header: "Type",
    render: (endorsement) => {
      return (
        <div className="whitespace-nowrap">{endorsement?.type || "-"}</div>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    render: (endorsement) => {
      return (
        <div className="font-semibold whitespace-nowrap">
          <span className={getStatusColor(endorsement.status)}>
            {endorsement.status}
          </span>
        </div>
      );
    },
  },
  {
    key: "verified_by",
    header: "Verified by",
    render: (endorsement) => {
      const verifiedBy = (
        endorsement?.status_description?.split(" by ")[1] || "-"
      ).replace(/\b\w/g, (c: string) => c.toUpperCase());
      return <div className="whitespace-nowrap">{verifiedBy}</div>;
    },
  },
  {
    key: "action",
    header: "Action",
    render: (endorsement) => {
      return (
        <Button
          onClick={() => onGoToDetail(endorsement.id)}
          className="rounded-full"
        >
          View
        </Button>
      );
    },
  },
];

export const createCompareDataTableColumns = (): Column<any>[] => [
  {
    key: "dataType",
    header: "Data Type",
    classNameHeading: "bg-[#016DA1] text-white",
    render: (data) => {
      return <div className="font-medium">{data.dataType}</div>;
    },
  },
  {
    key: "previousData",
    header: "Previous Data",
    classNameHeading: "bg-[#016DA1] text-white",
    render: (data) => {
      return <div>{data.previousData || "-"}</div>;
    },
  },
  {
    key: "updateData",
    header: "Update Data",
    classNameHeading: "bg-[#016DA1] text-white",
    render: (data) => {
      return <div>{data.updateData || "-"}</div>;
    },
  },
];

// Endorsement Details Table Config
export const createEndorsementDetailsTableColumns = (
  getStatusColor: (status: string) => string
): Column<any>[] => [
  {
    key: "index",
    header: "No.",
    render: (_, index) => index + 1,
  },
  {
    key: "data.profile.record_mode",
    header: "Record Mode",
    render: (item) => {
      return <div>{item?.data?.profile?.record_mode || "-"}</div>;
    },
  },
  {
    key: "data.profile.tpa_member_id",
    header: "TPA Member ID",
    render: (item) => {
      return (
        <div className="min-w-[180px]">
          {item?.data?.profile?.tpa_member_id || "-"}
        </div>
      );
    },
  },
  {
    key: "insured_parties.policy.number",
    header: "Policy Number",
    render: (item) => {
      return (
        <div className="min-w-[180px]">
          {item?.insured_parties?.policy?.number || "-"}
        </div>
      );
    },
  },
  {
    key: "data.profile.subsidiary",
    header: "Subsidiary / Entity",
    render: (item) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent =
        `${profile.subsidiary}` !== `${insuredProfile.subsidiary}`;

      return (
        <div className={`min-w-[230px] ${isDifferent ? "bg-yellow-50" : ""}`}>
          {profile.subsidiary || "-"}
        </div>
      );
    },
  },
  {
    key: "data.profile.employee_id",
    header: "Employee ID",
    render: (item) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent =
        `${profile.employee_id}` !== `${insuredProfile.employee_id}`;

      return (
        <div className={isDifferent ? "bg-yellow-50" : ""}>
          {profile.employee_id || "-"}
        </div>
      );
    },
  },
  {
    key: "data.profile.employee_name",
    header: "Employee Name",
    render: (item) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent =
        `${profile.employee_name}` !== `${insuredProfile.employee_name}`;

      return (
        <div className={`min-w-[240px] ${isDifferent ? "bg-yellow-50" : ""}`}>
          {profile.employee_name || "-"}
        </div>
      );
    },
  },
  {
    key: "data.profile.member_name",
    header: "Member Name",
    render: (item) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent =
        `${profile.member_name}` !== `${insuredProfile.member_name}`;

      return (
        <div className={`min-w-[240px] ${isDifferent ? "bg-yellow-50" : ""}`}>
          {profile.member_name || "-"}
        </div>
      );
    },
  },
  {
    key: "data.profile.gender",
    header: "Gender",
    render: (item) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.gender}` !== `${insuredProfile.gender}`;

      return (
        <div className={`text-center ${isDifferent ? "bg-yellow-50" : ""}`}>
          {profile.gender || "-"}
        </div>
      );
    },
  },
  {
    key: "data.profile.date_of_birth",
    header: "Date of Birth",
    render: (item) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent =
        `${profile.date_of_birth}` !== `${insuredProfile.date_of_birth}`;

      return (
        <div className={isDifferent ? "bg-yellow-50" : ""}>
          {profile.date_of_birth || "-"}
        </div>
      );
    },
  },
  {
    key: "data.profile.member_status",
    header: "Member Status",
    render: (item) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent =
        `${profile.member_status}` !== `${insuredProfile.member_status}`;

      return (
        <div className={`text-center ${isDifferent ? "bg-yellow-50" : ""}`}>
          {profile.member_status || "-"}
        </div>
      );
    },
  },
  {
    key: "data.profile.marital_status",
    header: "Marital Status",
    render: (item) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent =
        `${profile.marital_status}` !== `${insuredProfile.marital_status}`;

      return (
        <div className={isDifferent ? "bg-yellow-50" : ""}>
          {profile.marital_status || "-"}
        </div>
      );
    },
  },
  {
    key: "data.profile.plan",
    header: "Plan",
    render: (item) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.plan}` !== `${insuredProfile.plan}`;

      return (
        <div className={isDifferent ? "bg-yellow-50" : ""}>
          {profile.plan || "-"}
        </div>
      );
    },
  },
  {
    key: "data.profile.effective_date",
    header: "Effective Date",
    render: (item) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent =
        `${profile.effective_date}` !== `${insuredProfile.effective_date}`;

      return (
        <div className={isDifferent ? "bg-yellow-50" : ""}>
          {profile.effective_date || "-"}
        </div>
      );
    },
  },
  {
    key: "data.profile.remarks",
    header: "Remarks",
    render: (item) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.remarks}` !== `${insuredProfile.remarks}`;

      return (
        <div className={isDifferent ? "bg-yellow-50" : ""}>
          {profile.remarks || "-"}
        </div>
      );
    },
  },
  {
    key: "data.profile.bank_name",
    header: "Bank Name",
    render: (item) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent =
        `${profile.bank_name}` !== `${insuredProfile.bank_name}`;

      return (
        <div className={isDifferent ? "bg-yellow-50" : ""}>
          {profile.bank_name || "-"}
        </div>
      );
    },
  },
  {
    key: "data.profile.branch",
    header: "Branch",
    render: (item) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.branch}` !== `${insuredProfile.branch}`;

      return (
        <div className={isDifferent ? "bg-yellow-50" : ""}>
          {profile.branch || "-"}
        </div>
      );
    },
  },
  {
    key: "data.profile.bank_account_number",
    header: "Bank Number",
    render: (item) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent =
        `${profile.bank_account_number}` !==
        `${insuredProfile.bank_account_number}`;

      return (
        <div className={isDifferent ? "bg-yellow-50" : ""}>
          {profile.bank_account_number || "-"}
        </div>
      );
    },
  },
  {
    key: "data.profile.bank_account_name",
    header: "Bank Account Name",
    render: (item) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent =
        `${profile.bank_account_name}` !==
        `${insuredProfile.bank_account_name}`;

      return (
        <div className={`min-w-[200px] ${isDifferent ? "bg-yellow-50" : ""}`}>
          {profile.bank_account_name || "-"}
        </div>
      );
    },
  },
  {
    key: "data.profile.email",
    header: "Email",
    render: (item) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent = `${profile.email}` !== `${insuredProfile.email}`;

      return (
        <div className={isDifferent ? "bg-yellow-50" : ""}>
          {profile.email || "-"}
        </div>
      );
    },
  },
  {
    key: "data.profile.insurance_card",
    header: "Insurance Card",
    render: (item) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent =
        `${profile.insurance_card}` !== `${insuredProfile.insurance_card}`;

      return (
        <div className={isDifferent ? "bg-yellow-50" : ""}>
          {profile.insurance_card || "-"}
        </div>
      );
    },
  },
  {
    key: "data.profile.submission_date",
    header: "Submission Date",
    render: (item) => {
      const profile = item?.data?.profile || {};
      const insuredProfile = item?.insured_parties?.profile || {};
      const isDifferent =
        `${profile.submission_date}` !== `${insuredProfile.submission_date}`;

      return (
        <div className={isDifferent ? "bg-yellow-50" : ""}>
          {profile.submission_date || "-"}
        </div>
      );
    },
  },
  {
    key: "endorsements.status",
    header: "Status",
    render: (item) => {
      const status = item?.endorsements?.status || "-";

      return (
        <div className="font-semibold">
          <span className={getStatusColor(status)}>{status}</span>
        </div>
      );
    },
  },
];