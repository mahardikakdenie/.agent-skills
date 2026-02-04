import { Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";

interface ProductTableConfigProps {
  handleEdit: (id: string) => void;
  canEdit: boolean;
}

export const createProductTableColumns = ({
  handleEdit,
  canEdit,
}: ProductTableConfigProps): Column<any>[] => [
  {
    key: "index",
    header: "No.",
    render: (_, index) => index + 1,
  },
  {
    key: "name",
    header: "Insurance Name",
  },
  {
    key: "total",
    header: "Total Product",
    render: (item) => item?._count?.products || 0,
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
      </div>
    ),
  },
];
