import { Column } from "@/components/ui/DataTable";
import { Button } from "@repo/ui";
import { Trash } from "react-feather";
import { format } from "date-fns";

interface RoleTableConfigProps {
  page: number;
  rowsPerPage: number;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
}

export const createRoleTableColumns = ({
  page,
  rowsPerPage,
  handleEdit,
  handleDelete,
  canEdit,
  canDelete,
}: RoleTableConfigProps): Column<any>[] => [
  {
    key: "index",
    header: "No.",
    render: (_, index) => (page - 1) * rowsPerPage + index + 1,
  },
  {
    key: "name",
    header: "Roles",
    render: (item) => item.name || "-",
  },
  {
    key: "description",
    header: "Platform",
    render: (item) => item.description || "-",
  },
  {
    key: "updated_at",
    header: "Last Activity",
    render: (item) =>
      item.updated_at ? format(new Date(item.updated_at), "dd-MM-yyyy") : "N/A",
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