import { Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { EditIcon, TrashIcon } from "lucide-react";
import { formatDate } from "@/lib/formatter";

interface HolidayTableConfigProps {
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
  page: number;
  rowsPerPage: number;
}

export const createHolidayTableColumns = ({
  handleEdit,
  handleDelete,
  canEdit,
  canDelete,
  page,
  rowsPerPage,
}: HolidayTableConfigProps): Column<any>[] => [
  {
    key: "index",
    header: "No.",
    className: "whitespace-nowrap w-12",
    render: (_, index) => (page - 1) * rowsPerPage + index + 1,
  },
  {
    key: "date",
    header: "Date",
    className: "min-w-32",
    render: (item) => (item.date ? formatDate(item.date, "DD-MM-YYYY") : "-"),
  },
  {
    key: "name",
    header: "Holiday Name",
    className: "min-w-48",
    render: (item) => item.name || "-",
  },
  {
    key: "type",
    header: "Holiday Type",
    className: "min-w-36",
    render: (item) => item.type || "-",
  },
  {
    key: "action",
    header: "Action",
    className: "whitespace-nowrap w-24",
    render: (item) => (
      <div className="flex">
        <div className="relative group">
          <Button
            variant="ghost"
            size="icon"
            disabled={!canEdit}
            onClick={() => handleEdit(item.id)}
          >
            <EditIcon className="h-4 w-4" />
          </Button>
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Edit
          </span>
        </div>
        <div className="relative group">
          <Button
            variant="ghost"
            size="icon"
            disabled={!canDelete}
            onClick={() => handleDelete(item.id)}
          >
            <TrashIcon className="h-4 w-4 text-red-600" />
          </Button>
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Delete
          </span>
        </div>
      </div>
    ),
  },
];
