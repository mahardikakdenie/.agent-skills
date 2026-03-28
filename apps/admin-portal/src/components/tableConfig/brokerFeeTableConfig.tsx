import { Column } from "@/components/ui/DataTable";
import { Button } from "@repo/ui";
import { EditIcon, TrashIcon } from "lucide-react";

interface BrokerFeeTableConfigProps {
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
}

export const createBrokerFeeTableColumns = ({
  handleEdit,
  handleDelete,
  canEdit,
  canDelete,
}: BrokerFeeTableConfigProps): Column<any>[] => [
  {
    key: "index",
    header: "No",
    render: (_, index) => index + 1,
  },
  {
    key: "insurance_name",
    header: "Insurance Company Name",
  },
  {
    key: "product_name",
    header: "Product Name",
  },
  {
    key: "plan_name",
    header: "Plan Name",
  },
  {
    key: "fee_type",
    header: "Fee Type",
  },
  {
    key: "fee",
    header: "Fee",
  },
  {
    key: "action",
    header: "Action",
    render: (item) => (
      <div className="flex">
        {canEdit && (
          <div className="relative group">
            <Button
              variant="ghost"
              size="md"
              className="w-9 px-0"
              onClick={() => handleEdit(item.id)}
            >
              <EditIcon className="h-4 w-4" />
            </Button>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              Edit
            </span>
          </div>
        )}
        {canDelete && (
          <div className="relative group">
            <Button
              variant="ghost"
              size="md"
              className="w-9 px-0"
              onClick={() => handleDelete(item.id)}
            >
              <TrashIcon className="h-4 w-4 text-red-600" />
            </Button>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              Delete
            </span>
          </div>
        )}
      </div>
    ),
  },
];
