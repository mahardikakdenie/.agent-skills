import { Column } from "@/components/ui/DataTable";
import { Button } from "@repo/ui";
import { Trash } from "react-feather";
import Image from "next/image";

interface InsuranceTableConfigProps {
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
}

export const createInsuranceTableColumns = ({
  handleEdit,
  handleDelete,
  canEdit,
  canDelete,
}: InsuranceTableConfigProps): Column<any>[] => [
  {
    key: "index",
    header: "No.",
    render: (_, index) => index + 1,
  },
  {
    key: "name",
    header: "Category Name",
  },
  {
    key: "logo_url",
    header: "Logo File",
    render: (item) => (
      <Image
        src={item?.logo_url || "/images/no-image.png"}
        alt={item.name || "Insurance logo"}
        className="max-w-20 w-auto h-auto max-h-12"
        height={50}
        width={100}
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