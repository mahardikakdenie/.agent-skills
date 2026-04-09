import { Box, Button, Skeleton, type ColumnDef } from "@repo/ui";
import { format } from "date-fns";
import { Trash } from "react-feather";

interface RoleTableConfigProps {
  page: number;
  rowsPerPage: number;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat("id-ID").format(value);

export const createRoleTableColumns = ({
  page,
  rowsPerPage,
  handleEdit,
  handleDelete,
  canEdit,
  canDelete,
}: RoleTableConfigProps): ColumnDef<any>[] => [
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
    header: "Roles",
    enableSorting: false,
    size: 164,
    minSize: 144,
    meta: {
      cellClassName: "align-middle",
      cellContentClassName: "whitespace-normal break-words",
    },
    cell: ({ row }) => {
      const item = row.original;
      const formattedName = item?.name || "-";

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {formattedName}
        </Box>
      );
    },
  },
  {
    id: "description",
    accessorFn: (item) => item?.description || "-",
    header: "Platform",
    enableSorting: false,
    size: 164,
    minSize: 144,
    meta: {
      cellClassName: "align-middle",
      cellContentClassName: "whitespace-normal break-words",
    },
    cell: ({ row }) => {
      const item = row.original;
      const formattedName = item?.description || "-";

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {formattedName}
        </Box>
      );
    },
  },
  {
    id: "updated_at",
    accessorKey: "updated_at",
    header: "Last Activity",
    enableSorting: false,
    enableResizing: false,
    size: 116,
    minSize: 116,
    meta: {
      headerCellClassName: "whitespace-nowrap",
      cellClassName: "align-middle whitespace-nowrap",
      cellContentClassName: "whitespace-nowrap text-xs tabular-nums text-slate-700",
      loadingSkeletonClassName: "h-4 w-[6.9rem] rounded-full",
    },
    cell: ({ row }) => {
      const item = row.original;

      return <Box>{item.updated_at ? format(new Date(item.updated_at), "dd-MM-yyyy") : "N/A"}</Box>;
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
