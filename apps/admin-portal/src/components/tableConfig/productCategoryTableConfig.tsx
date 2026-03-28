import { Column } from "@/components/ui/DataTable";
import { Button } from "@repo/ui";
import { EditIcon, TrashIcon } from "lucide-react";
import Image from "next/image";

interface ProductCategoryTableConfigProps {
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
}

export const createProductCategoryTableColumns = ({
  handleEdit,
  handleDelete,
  canEdit,
  canDelete,
}: ProductCategoryTableConfigProps): Column<any>[] => [
  {
    key: "index",
    header: "No",
    render: (_, index) => index + 1,
  },
  {
    key: "name",
    header: "Category Name",
    render: (item) => {
      return item.name
        .split("-")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
  },
  {
    key: "icon",
    header: "Category Icon",
    render: (item) => {
      if (!item.icon) return null;
      return (
        <a
          href={item.icon}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          <Image
            src={item.icon}
            alt={item.name}
            width={50}
            height={50}
            className="object-contain"
          />
        </a>
      );
    },
  },
  {
    key: "action",
    header: "Action",
    render: (item) => (
      <div className="flex gap-4 items-center">
        {canEdit && (
          <Button
            variant="secondary"
            onClick={() => handleEdit(item.id)}
            className="bg-[#016DA1] hover:bg-[#016DA1] text-white px-4 rounded-full"
          >
            Edit
          </Button>
        )}
        {canDelete && (
          <Button
            variant="ghost"
            onClick={() => handleDelete(item.id)}
            className="text-red-600 px-0"
          >
            <TrashIcon className="w-5 h-5" />
          </Button>
        )}
      </div>
    ),
  },
];