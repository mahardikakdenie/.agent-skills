import { Button } from "@repo/ui";
import { Input } from "@repo/ui";
import { formatMoneyClaim, formatDate } from "@/lib/formatter";
import { Column } from "@/components/ui/DataTable";
import {
  ClaimItem,
  ClaimsTableConfigProps,
  DocumentItem,
  DocumentTableConfigProps,
} from "@/interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui";
import { Eye, X } from "react-feather";

export const createClaimsTableColumns = ({
  page,
  rowsPerPage,
  canEdit,
  openAllStatus,
  onStatusChange,
  onViewDetail,
  getStatusColor,
}: ClaimsTableConfigProps): Column<ClaimItem>[] => [
  {
    key: "index",
    header: "No.",
    render: (_, index) => (page - 1) * rowsPerPage + index + 1,
  },
  {
    key: "number",
    header: "Claim ID",
    className: "whitespace-nowrap",
  },
  {
    key: "policy_data.policy_holder.name",
    header: "Customer Name",
    className: "whitespace-nowrap",
  },
  {
    key: "package.plan.name",
    header: "Plan Name",
    className: "min-w-72",
    render: (claim) => claim.package?.plan?.name?.split("|").join(" - ") || "-",
  },
  {
    key: "benefit.description_en",
    header: "Benefit",
    className: "min-w-60",
  },
  {
    key: "currency",
    header: "Currency",
  },
  {
    key: "requested_amount",
    header: "Requested Amount",
    render: (claim) => {
      const claimValue = claim.claim?.find(
        (d: any) => d.type === "Number" && d.name === "claim"
      )?.value;

      const numericValue = Number(claimValue);
      return !isNaN(numericValue) ? formatMoneyClaim(numericValue) : "-";
    },
  },
  {
    key: "amount_approved",
    header: "Approved Amount",
    render: (claim) => (
      <div className="flex gap-2 items-center">
        {formatMoneyClaim(
          claim.amount_approved != null ? claim.amount_approved : 0
        )}
      </div>
    ),
  },
  {
    key: "edited_by",
    header: "Edited By",
  },
  {
    key: "updated_at",
    header: "Last Modified",
    render: (claim) =>
      claim.updated_at
        ? formatDate(claim.updated_at, "DD/MM/YYYY, HH:mm")
        : "-",
  },
  {
    key: "status",
    header: "Status",
    className: "font-semibold whitespace-nowrap",
    render: (claim) => (
      <Select
        value={claim.status}
        disabled={!canEdit}
        onValueChange={(value) => {
          onStatusChange(claim, value);
        }}
      >
        <SelectTrigger
          className={`w-[240px] h-10 select-status border-0 bg-transparent hover:cursor-pointer py-2 ${getStatusColor(
            claim.status
          )}`}
        >
          <SelectValue>{claim.status || "Select Status"}</SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-48 overflow-auto">
          <SelectItem
            value="Submitted"
            disabled={
              (claim.status !== "Draft" && !openAllStatus) ||
              claim.status == "Closed"
            }
          >
            Submitted
          </SelectItem>
          <SelectItem
            value="Acknowledged"
            disabled={
              (claim.status !== "Submitted" && !openAllStatus) ||
              claim.status == "Closed"
            }
          >
            Acknowledged
          </SelectItem>
          <SelectItem
            value="Document Review Operator"
            disabled={
              (claim.status !== "Acknowledged" &&
                claim.status !== "Lack of Documents Operator" &&
                !openAllStatus) ||
              claim.status == "Closed"
            }
          >
            Document Review Operator
          </SelectItem>
          <SelectItem
            value="Reupload Document Review Operator"
            disabled={
              (claim.status !== "Lack of Documents Operator" &&
                !openAllStatus) ||
              claim.status == "Closed"
            }
          >
            Reupload Document Review Operator
          </SelectItem>
          <SelectItem
            value="Lack of Documents Operator"
            disabled={
              (claim.status !== "Document Review Operator" &&
                claim.status !== "Reupload Document Review Operator" &&
                !openAllStatus) ||
              claim.status == "Closed"
            }
          >
            Lack of Documents Operator
          </SelectItem>
          <SelectItem
            value="Document Review Insurance"
            disabled={
              (claim.status !== "Document Review Operator" &&
                claim.status !== "Lack of Documents Insurance" &&
                !openAllStatus) ||
              claim.status == "Closed"
            }
          >
            Document Review Insurance
          </SelectItem>
          <SelectItem
            value="Reupload Document Review Insurance"
            disabled={
              (claim.status !== "Lack of Documents Insurance" &&
                !openAllStatus) ||
              claim.status == "Closed"
            }
          >
            Reupload Document Review Insurance
          </SelectItem>
          <SelectItem
            value="Lack of Documents Insurance"
            disabled={
              (claim.status !== "Document Review Insurance" &&
                claim.status !== "Reupload Document Review Insurance" &&
                !openAllStatus) ||
              claim.status == "Closed"
            }
          >
            Lack of Documents Insurance
          </SelectItem>
          <SelectItem
            value="Claim Assessment"
            disabled={
              (claim.status !== "Document Review" &&
                claim.status !== "Document Review Insurance" &&
                !openAllStatus) ||
              claim.status == "Closed"
            }
          >
            Claim Assessment
          </SelectItem>
          <SelectItem
            value="Approved"
            disabled={
              (claim.status !== "Claim Assessment" && !openAllStatus) ||
              claim.status == "Closed"
            }
          >
            Approved
          </SelectItem>
          <SelectItem
            value="Rejected"
            disabled={
              (claim.status !== "Claim Assessment" && !openAllStatus) ||
              claim.status == "Closed"
            }
          >
            Rejected
          </SelectItem>
          <SelectItem
            value="Paid"
            disabled={
              (claim.status !== "Approved" && !openAllStatus) ||
              claim.status == "Closed"
            }
          >
            Paid
          </SelectItem>
          <SelectItem
            value="Closed"
            disabled={
              (claim.status !== "Paid" &&
                claim.status !== "Rejected" &&
                !openAllStatus) ||
              claim.status == "Closed"
            }
          >
            Closed
          </SelectItem>
        </SelectContent>
      </Select>
    ),
  },
  {
    key: "action",
    header: "Action",
    render: (claim) => (
      <Button onClick={() => onViewDetail(claim.id)} className="rounded-full">
        View
      </Button>
    ),
  },
];

export const createDocumentTableColumns = ({
  selectedDocuments,
  onCheckboxChange,
  onSelectDocument,
  isDocumentSelected,
}: DocumentTableConfigProps): Column<DocumentItem>[] => [
  {
    key: "select",
    header: "Select",
    className: "w-10",
    render: (document) => (
      <div className="text-center">
        <Input
          type="checkbox"
          checked={
            document.type.toLowerCase() === "fields"
              ? isDocumentSelected(
                  document?.fields?.filter(
                    (a: any) => a.type.toLowerCase() === "file"
                  )?.[0]?.name || ""
                )
              : isDocumentSelected(document.name)
          }
          onClick={() => {
            let docName = document.name;
            if (document.type.toLowerCase() === "fields") {
              docName =
                document?.fields?.filter(
                  (a: any) => a.type.toLowerCase() === "file"
                )?.[0]?.name || "";
            }
            onCheckboxChange(docName);
          }}
          className="w-4 h-4 mx-auto"
        />
      </div>
    ),
  },
  {
    key: "document_type",
    header: "Document Type",
    render: (document) => (
      <>
        {document.type.toLowerCase() === "fields"
          ? document?.fields?.filter(
              (a: any) => a.type.toLowerCase() === "file"
            )?.[0]?.label?.en ||
            document?.fields?.filter(
              (a: any) => a.type.toLowerCase() === "file"
            )?.[0]?.label_multilanguage?.en ||
            document?.fields?.filter(
              (a: any) => a.type.toLowerCase() === "file"
            )?.[0]?.label ||
            "-"
          : document?.label?.en ||
            document?.label_multilanguage?.en ||
            document?.label ||
            "-"}
      </>
    ),
  },
  {
    key: "criteria",
    header: "Criteria",
    render: (document) =>
      document.type.toLowerCase() === "fields"
        ? document?.fields?.filter(
            (a: any) => a.type.toLowerCase() === "file"
          )?.[0]?.criteria || "-"
        : document?.criteria || "-",
  },
  {
    key: "definition",
    header: "Definition",
    render: (document) =>
      document.type.toLowerCase() === "fields"
        ? document?.fields?.filter(
            (a: any) => a.type.toLowerCase() === "file"
          )?.[0]?.definition || "-"
        : document?.definition || "-",
  },
  {
    key: "message",
    header: "Message",
    className: "w-24 text-center",
    render: (document) => (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="bg-transparent hover:bg-transparent rounded-full text-blue-500 w-auto p-0 h-6"
            onClick={onSelectDocument}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 w-[500px] max-w-full overflow-hidden">
          <DialogHeader className="bg-transparent py-3 px-4 sm:px-6">
            <DialogTitle className="text-sm sm:text-base flex items-center">
              Message Preview
              <DialogClose className="ml-auto">
                <Button
                  type="button"
                  className="bg-transparent hover:bg-transparent text-black p-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </DialogClose>
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col px-4 pb-4">
            <p className="text-sm">
              Document type:{" "}
              {document.type.toLowerCase() === "fields"
                ? document?.fields?.filter(
                    (a: any) => a.type.toLowerCase() === "file"
                  )?.[0]?.name || "-"
                : document?.name || "-"}
            </p>
            <p className="text-sm">
              Criteria:{" "}
              {document.type.toLowerCase() === "fields"
                ? document?.fields?.filter(
                    (a: any) => a.type.toLowerCase() === "file"
                  )?.[0]?.criteria || "-"
                : document?.criteria || "-"}
            </p>
            <p className="text-sm">
              Definition:{" "}
              {document.type.toLowerCase() === "fields"
                ? document?.fields?.filter(
                    (a: any) => a.type.toLowerCase() === "file"
                  )?.[0]?.definition || "-"
                : document?.definition || "-"}
            </p>
            <hr className="my-4" />
            <p className="text-sm">
              "
              {document.type.toLowerCase() === "fields"
                ? document?.fields?.filter(
                    (a: any) => a.type.toLowerCase() === "file"
                  )?.[0]?.pending_reason_message?.en || "-"
                : document?.pending_reason_message?.en || "-"}
              "
            </p>
          </div>
        </DialogContent>
      </Dialog>
    ),
  },
];
