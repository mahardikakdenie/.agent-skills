import { Column } from "@/components/ui/DataTable";
import { Button } from "@repo/ui";
import { Trash } from "react-feather";

interface PartnerTableConfigProps {
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
  page: number;
  rowsPerPage: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Inactive":
      return "text-gray-400 font-normal";
    case "Active":
      return "text-[#00AB4F]";
    default:
      return "text-[#7B5D21]";
  }
};

export const createPartnerTableColumns = ({
  handleEdit,
  handleDelete,
  canEdit,
  canDelete,
  page,
  rowsPerPage,
}: PartnerTableConfigProps): Column<any>[] => [
  {
    key: "index",
    header: "No.",
    className: "whitespace-nowrap w-12",
    render: (_, index) => (page - 1) * rowsPerPage + index + 1,
  },
  {
    key: "name",
    header: "Name",
    className: "whitespace-nowrap",
    render: (item) => item.name || "-",
  },
  {
    key: "email",
    header: "Email",
    render: (item) => item.email || "-",
  },
  {
    key: "phone_number",
    header: "Phone Number",
    render: (item) => item.phone_number || "-",
  },
  {
    key: "role",
    header: "Role",
    render: (item) => item.role || "-",
  },
  {
    key: "status",
    header: "Status",
    className: "font-semibold whitespace-nowrap",
    render: (item) => (
      <span className={getStatusColor(item.status)}>{item.status || "-"}</span>
    ),
  },
  {
    key: "action",
    header: "Action",
    className: "whitespace-nowrap w-36",
    render: (item) => (
      <div className="flex gap-4 items-center">
        <Button
          variant="secondary"
          disabled={!canEdit}
          onClick={() => handleEdit(item.id)}
          className="bg-[#016DA1] hover:bg-[#016DA1] text-white px-4 rounded-full"
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          disabled={!canDelete}
          onClick={() => handleDelete(item.id)}
          className="text-red-600 px-0"
        >
          <Trash />
        </Button>
      </div>
    ),
  },
];