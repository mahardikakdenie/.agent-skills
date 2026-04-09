import { Box, Button, Skeleton, type ColumnDef } from "@repo/ui";
import { TrashIcon } from "lucide-react";

interface ChannelTableConfigProps {
  page: number;
  rowsPerPage: number;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
}

const capitalizeWords = (str: string) => {
  if (!str) return "-";
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat("id-ID").format(value);

export const createChannelTableColumns = ({
  page,
  rowsPerPage,
  handleEdit,
  handleDelete,
  canEdit,
  canDelete,
}: ChannelTableConfigProps): ColumnDef<any>[] => [
  {
    id: "id",
    header: "No.",
    enableSorting: false,
    enableResizing: false,
    size: 44,
    minSize: 44,
    meta: {
      headerCellClassName: "whitespace-nowrap",
      cellClassName: "align-middle text-slate-500",
      cellContentClassName: "whitespace-nowrap",
      loadingSkeleton: (
        <Box className="flex min-w-0 items-center">
          <Skeleton className="h-4 w-5 rounded-full" />
        </Box>
      ),
    },
    cell: ({ row }) => formatTableOrdinalNumber((page - 1) * rowsPerPage + row.index + 1),
  },
  {
    id: "name",
    accessorFn: (item) => item?.name || "-",
    header: "Channel Name",
    enableSorting: false,
    size: 164,
    minSize: 144,
    meta: {
      cellClassName: "align-middle",
      cellContentClassName: "whitespace-normal break-words",
    },
    cell: ({ row }) => {
      const item = row.original;
      const formattedName = item?.name ? capitalizeWords(item.name) : "-";

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {formattedName}
        </Box>
      );
    },
  },
  {
    id: "type",
    accessorFn: (item) => item?.type || "-",
    header: "Type",
    enableSorting: false,
    enableResizing: false,
    size: 120,
    minSize: 92,
    meta: {
      headerCellClassName: "whitespace-nowrap",
      cellClassName:
        "align-middle whitespace-nowrap text-xs font-semibold tracking-[0.04em] text-slate-500",
      cellContentClassName: "whitespace-nowrap",
      loadingSkeleton: (
        <Box className="flex min-w-0 items-center">
          <Skeleton className="h-4 w-16 rounded-full [tr:nth-child(2n)_&]:w-24 [tr:nth-child(3n)_&]:w-20" />
        </Box>
      ),
    },
    cell: ({ row }) => {
      const item = row.original;
      return <Box>{item?.type ? capitalizeWords(item.type) : "-"}</Box>;
    },
  },
  {
    id: "action",
    header: "Action",
    enableSorting: false,
    enableResizing: false,
    size: 110,
    minSize: 68,
    meta: {
      headerCellClassName: "whitespace-nowrap !px-1 text-center",
      cellClassName: "align-middle whitespace-nowrap !px-1 text-center",
      cellContentClassName: "whitespace-nowrap flex justify-center",
      loadingSkeleton: (
        <Box className="flex justify-center items-center gap-2">
          <Skeleton className="h-7 w-[3.25rem] rounded-full" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </Box>
      ),
    },
    cell: ({ row }) => {
      const item = row.original;

      return (
        <Box className="flex gap-2 items-center justify-center">
          {canEdit && (
            <Button
              variant="secondary"
              onClick={() => handleEdit(item.id)}
              className="bg-[#016DA1] hover:bg-[#016DA1]/90 text-white px-3.5 rounded-full h-7 text-[11px] font-semibold shadow-none"
            >
              Edit
            </Button>
          )}
          {canDelete && (
            <Button
              variant="ghost"
              onClick={() => handleDelete(item.id)}
              className="text-red-600 px-0 h-7 w-7 hover:bg-transparent shadow-none"
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          )}
        </Box>
      );
    },
  },
];