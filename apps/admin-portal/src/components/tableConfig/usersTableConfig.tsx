import { Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Switch } from "@repo/ui";
import { Trash } from "react-feather";

interface UsersTableConfigProps {
  page: number;
  rowsPerPage: number;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  handleStatusChange: (user: any) => void;
  canEdit: boolean;
  canDelete: boolean;
  canToggleStatus: boolean;
}

export const createUsersTableColumns = ({
  page,
  rowsPerPage,
  handleEdit,
  handleDelete,
  handleStatusChange,
  canEdit,
  canDelete,
  canToggleStatus,
}: UsersTableConfigProps): Column<any>[] => [
  {
    key: "index",
    header: "No.",
    render: (_, index) => (page - 1) * rowsPerPage + index + 1,
  },
  {
    key: "name",
    header: "Name",
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
    render: (item) => (
      <Switch
        disabled={!canToggleStatus}
        checked={item.status === "Active"}
        onCheckedChange={() => handleStatusChange(item)}
        aria-readonly
      />
    ),
  },
  {
    key: "action",
    header: "Action",
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
