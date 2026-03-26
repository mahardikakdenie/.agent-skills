import { Button } from "@/components/ui/button";
import { Trash } from "react-feather";
import { format } from "date-fns";
import { Column } from "../ui/DataTable";

export const createSanctionTableColumns = ({
  handleViewDetail,
  handleDelete,
  canDelete,
}: {
  handleViewDetail: (id: string) => void;
  handleDelete: (id: string) => void;
  canDelete: boolean;
}): Column<any>[] => [
  {
    key: "name",
    header: "Name",
    render: (sanction) => {
      return (
        <div>
          {sanction.first_name} {sanction.middle_name} {sanction.last_name}
        </div>
      );
    },
  },
  {
    key: "phone_number",
    header: "Phone Number",
    render: (sanction) => {
      return <div>{sanction.phone_number}</div>;
    },
  },
  {
    key: "email",
    header: "Email",
    render: (sanction) => {
      return <div>{sanction.email}</div>;
    },
  },
  {
    key: "blacklist_reason",
    header: "Blacklist Reason",
    render: (sanction) => {
      return <div>{sanction.blacklist_reason}</div>;
    },
  },
  {
    key: "date_blacklisted",
    header: "Blacklisted Date",
    render: (sanction) => {
      return (
        <div>{format(new Date(sanction.date_blacklisted), "dd-MM-yyyy")}</div>
      );
    },
  },
  {
    key: "created_at",
    header: "Created At",
    render: (sanction) => {
      return (
        <div>
          {sanction.created_at
            ? format(new Date(sanction.created_at), "dd-MM-yyyy")
            : "-"}
        </div>
      );
    },
  },
  {
    key: "action",
    header: "Action",
    render: (sanction) => {
      return (
        <div className="flex space-x-2">
          <button
            type="button"
            className="bg-[#016DA1] text-white px-4 py-2 rounded-full"
            onClick={() => handleViewDetail(sanction.id)}
          >
            View
          </button>
          <Button
            variant="ghost"
            disabled={!canDelete}
            onClick={() => handleDelete(sanction.id)}
            className="text-red-600 px-0"
          >
            <Trash />
          </Button>
        </div>
      );
    },
  },
];
