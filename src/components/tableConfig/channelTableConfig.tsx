import { Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Trash } from "react-feather";

interface ChannelTableConfigProps {
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
}

const capitalizeWords = (str: string) => {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const createChannelTableColumns = ({
  handleEdit,
  handleDelete,
  canEdit,
  canDelete,
}: ChannelTableConfigProps): Column<any>[] => [
  {
    key: "index",
    header: "No.",
    render: (_, index) => index + 1,
  },
  {
    key: "name",
    header: "Channel Name",
    render: (item) => capitalizeWords(item.name),
  },
  {
    key: "type",
    header: "Type",
    render: (item) => capitalizeWords(item.type),
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
