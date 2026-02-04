import { Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";

interface CurrencyTableConfigProps {
  handleEdit: (id: string) => void;
  canEdit: boolean;
}

export const createCurrencyTableColumns = ({
  handleEdit,
  canEdit,
}: CurrencyTableConfigProps): Column<any>[] => [
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
    key: "updated_at",
    header: "Updated Date",
    render: (item) =>
      item?.updated_at
        ? new Date(item.updated_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "No Date",
  },
  {
    key: "edit_by",
    header: "Edited by",
    render: () => "-",
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
