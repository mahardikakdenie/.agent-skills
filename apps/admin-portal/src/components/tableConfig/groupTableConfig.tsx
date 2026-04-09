import { Box, Button, Skeleton, type ColumnDef } from "@repo/ui";
import { format } from "date-fns";
import { Trash } from "react-feather";

interface GroupTableConfigProps {
  page: number;
  rowsPerPage: number;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat("id-ID").format(value);

export const createGroupTableColumns = ({
  page,
  rowsPerPage,
  handleEdit,
  handleDelete,
  canEdit,
  canDelete,
}: GroupTableConfigProps): ColumnDef<any>[] => [
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
    header: "Group Name",
    enableSorting: false,
    size: 164,
    minSize: 144,
    meta: {
      cellClassName: "align-middle",
      cellContentClassName: "whitespace-normal break-words",
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {item?.name || "-"}
        </Box>
      );
    },
  },
  {
    id: "users",
    accessorFn: (item) => item?._count?.account_groups || 0,
    header: "Users",
    enableSorting: false,
    size: 164,
    minSize: 144,
    meta: {
      cellClassName: "align-middle",
      cellContentClassName: "whitespace-normal break-words",
    },
    cell: ({ row }) => {
      const item = row.original;
      const total = item?._count?.account_groups || 0;

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {total}
        </Box>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: "Last Activity",
    enableSorting: false,
    enableResizing: false,
    size: 140,
    minSize: 116,
    meta: {
      headerCellClassName: "whitespace-nowrap",
      cellClassName: "align-middle whitespace-nowrap",
      cellContentClassName: "whitespace-nowrap text-xs tabular-nums text-slate-700",
      loadingSkeletonClassName: "h-4 w-[6.9rem] rounded-full",
    },
    cell: ({ row }) => {
      const item = row.original;
      const formatted = item?.updated_at ? format(new Date(item.updated_at), "dd-MM-yyyy") : "N/A";
      return <Box>{formatted}</Box>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    enableSorting: false,
    enableResizing: false,
    size: 140,
    minSize: 116,
    meta: {
      headerCellClassName: "whitespace-nowrap",
      cellClassName: "align-middle whitespace-nowrap",
      cellContentClassName: "whitespace-nowrap text-xs tabular-nums text-slate-700",
      loadingSkeletonClassName: "h-4 w-[6.9rem] rounded-full",
    },
    cell: ({ row }) => {
      const item = row.original;
      const formatted = item?.created_at ? format(new Date(item.created_at), "dd-MM-yyyy") : "N/A";
      return <Box>{formatted}</Box>;
    },
  },
  {
    id: "action",
    header: "Action",
    enableSorting: false,
    enableResizing: false,
    size: 120,
    minSize: 120,
    meta: {
      headerCellClassName: "whitespace-nowrap !px-1 text-center",
      cellClassName: "align-middle whitespace-nowrap !px-1 text-center",
      cellContentClassName: "whitespace-nowrap flex justify-center",
      loadingSkeleton: (
        <Box className="flex items-center justify-center gap-2">
          <Skeleton className="h-7 w-[60px] rounded-full" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </Box>
      ),
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Box className="flex items-center justify-center gap-2">
          <Button
            size="xs"
            disabled={!canEdit}
            onClick={() => handleEdit(item.id)}
            className="h-7 rounded-full bg-[#016DA1] px-4 text-[13px] font-medium text-white shadow-none hover:bg-[#015a85]"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="xs"
            disabled={!canDelete}
            onClick={() => handleDelete(item.id)}
            className="h-7 w-7 rounded-md p-0 text-red-600 hover:bg-red-50 hover:!text-red-700"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </Box>
      );
    },
  },
];
