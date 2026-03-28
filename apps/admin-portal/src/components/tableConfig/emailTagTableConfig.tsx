import { Column } from "@/components/ui/DataTable";
import { Button } from "@repo/ui";
import { Trash } from "react-feather";

interface EmailTagTableConfigProps {
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
  page: number;
  rowsPerPage: number;
}

export const createEmailTagTableColumns = ({
  handleEdit,
  handleDelete,
  canEdit,
  canDelete,
  page,
  rowsPerPage,
}: EmailTagTableConfigProps): Column<any>[] => [
  {
    key: "index",
    header: "No.",
    className: "whitespace-nowrap w-12",
    render: (_, index) => (page - 1) * rowsPerPage + index + 1,
  },
  {
    key: "tag",
    header: "Tag Name",
    className: "min-w-36",
    render: (item) => item.tag || "-",
  },
  {
    key: "journey",
    header: "Journey",
    className: "min-w-36",
    render: (item) => item.journey || "-",
  },
  {
    key: "type",
    header: "Type",
    className: "min-w-24",
    render: (item) =>
      item.type ? <span className="capitalize">{item.type}</span> : "-",
  },
  {
    key: "description",
    header: "Description",
    className: "min-w-48",
    render: (item) => item.description || "-",
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