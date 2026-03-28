import { Button } from "@repo/ui";
import { formatMoneyClaim } from "@/lib/formatter";
import moment from "moment";
import { Column } from "../ui/DataTable";

export const createClaimHistoryTableColumns = (): Column<any>[] => [
  {
    key: "claimId",
    header: "Claim ID",
    render: (claim) => {
      return <div>{claim.claimId}</div>;
    },
  },
  {
    key: "insuredName",
    header: "Insured Name",
    render: (claim) => {
      return <div>{claim.insuredName}</div>;
    },
  },
  {
    key: "submittedDate",
    header: "Submitted Date",
    render: (claim) => {
      return (
        <div>
          {claim.submittedDate
            ? moment(claim.submittedDate).format("DD/MM/YYYY")
            : "-"}
        </div>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    render: (claim) => {
      return <div>{claim.status}</div>;
    },
  },
  {
    key: "currency",
    header: "Currency",
    render: (claim) => {
      return <div>{claim.currency}</div>;
    },
  },
  {
    key: "claimAmount",
    header: "Claim Amount",
    render: (claim) => {
      return <div>{formatMoneyClaim(Number(claim.claimAmount))}</div>;
    },
  },
  {
    key: "paid",
    header: "Paid",
    render: (claim) => {
      return (
        <div>{claim.paid ? formatMoneyClaim(Number(claim.paid)) : "-"}</div>
      );
    },
  },
  {
    key: "remainingLimit",
    header: "Remaining Limit",
    render: (claim) => {
      return <div>{formatMoneyClaim(Number(claim.remainingLimit))}</div>;
    },
  },
  {
    key: "paymentType",
    header: "Payment Type",
    render: (claim) => {
      return <div>{claim.paymentType}</div>;
    },
  },
  {
    key: "action",
    header: "Action",
    render: (claim) => {
      return (
        <Button disabled className="rounded-full">
          View
        </Button>
      );
    },
  },
];