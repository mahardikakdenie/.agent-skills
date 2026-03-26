import { Button } from "@/components/ui/button";
import { Trash } from "react-feather";
import { format } from "date-fns";
import { Column } from "../ui/DataTable";

export const createSourceTableColumns = ({
  handleViewDetail,
  handleDelete,
  canDelete,
}: {
  handleViewDetail: (id: string) => void;
  handleDelete: (id: string) => void;
  canDelete: boolean;
}): Column<any>[] => [
  {
    key: "source_name",
    header: "Source Name",
    render: (source) => {
      return <div>{source.source_name}</div>;
    },
  },
  {
    key: "source_type",
    header: "Source Type",
    render: (source) => {
      return <div>{source.source_type}</div>;
    },
  },
  {
    key: "source_url",
    header: "Source URL",
    render: (source) => {
      return <div>{source.source_url}</div>;
    },
  },
  {
    key: "insurance_name",
    header: "Insurance Name",
    render: (source) => {
      return <div className="whitespace-nowrap">{source.insurance_name}</div>;
    },
  },
  {
    key: "created_at",
    header: "Created At",
    render: (source) => {
      return (
        <div className="whitespace-nowrap">
          {source.created_at
            ? format(new Date(source.created_at), "dd-MM-yyyy")
            : "-"}
        </div>
      );
    },
  },
  {
    key: "action",
    header: "Action",
    render: (source) => {
      return (
        <div className="flex space-x-2">
          <button
            type="button"
            className="bg-[#016DA1] text-white px-4 py-2 rounded-full"
            onClick={() => handleViewDetail(source.id)}
          >
            View
          </button>
          <Button
            variant="ghost"
            disabled={!canDelete}
            onClick={() => handleDelete(source.id)}
            className="text-red-600 px-0"
          >
            <Trash />
          </Button>
        </div>
      );
    },
  },
];
