import { Box, Button, Skeleton, type ColumnDef } from "@repo/ui";

interface ProductTableConfigProps {
  page: number;
  rowsPerPage: number;
  handleEdit: (id: string) => void;
  canEdit: boolean;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat("id-ID").format(value);

export const createProductTableColumns = ({
  page,
  rowsPerPage,
  handleEdit,
  canEdit,
}: ProductTableConfigProps): ColumnDef<any>[] => [
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
    header: "Insurance Name",
    enableSorting: false,
    size: 164,
    minSize: 144,
    meta: {
      cellClassName: "align-middle",
      cellContentClassName: "whitespace-normal break-words",
    },
    cell: ({ row }) => {
      const item = row.original;
      const formattedName = item?.name
        ? item.name
            .split("-")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : "-";

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {formattedName}
        </Box>
      );
    },
  },
  {
    id: "total",
    accessorFn: (item) => item?._count?.products || 0,
    header: "Total Product",
    enableSorting: false,
    size: 164,
    minSize: 144,
    meta: {
      cellClassName: "align-middle",
      cellContentClassName: "whitespace-normal break-words",
    },
    cell: ({ row }) => {
      const item = row.original;
      const total = item?._count?.products || 0;

      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {total}
        </Box>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    enableSorting: false,
    enableResizing: false,
    size: 68,
    minSize: 68,
    meta: {
      headerCellClassName: "whitespace-nowrap !px-1 text-center",
      cellClassName: "align-middle whitespace-nowrap !px-1 text-center",
      cellContentClassName: "whitespace-nowrap",
      loadingSkeletonClassName: "mx-auto h-7 w-[3.25rem] rounded-full",
    },
    cell: ({ row }) => {
      const item = row.original;

      return (
        <Button
          size="xs"
          variant="secondary"
          disabled={!canEdit}
          onClick={() => handleEdit(item.id)}
          className="h-7 rounded-full px-4 text-[11px] font-semibold shadow-none bg-[#016DA1] hover:bg-[#016DA1]/90 text-white"
        >
          Edit
        </Button>
      );
    },
  },
];
