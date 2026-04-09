import Image from "next/image";
import { TrashIcon } from "lucide-react";

import {
  Box,
  Button,
  Skeleton,
  type ColumnDef,
} from "@repo/ui";

interface InsuranceTableConfigProps {
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
}

const formatTableOrdinalNumber = (value: number) => new Intl.NumberFormat("id-ID").format(value);

export const createInsuranceTableColumns = ({
  handleEdit,
  handleDelete,
  canEdit,
  canDelete,
}: InsuranceTableConfigProps): ColumnDef<any>[] => [
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
    cell: ({ row }) => formatTableOrdinalNumber(row.index + 1),
  },
  {
    id: "name",
    accessorFn: (item) => item?.name || "-",
    header: "Category Name",
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
    id: "logo_url",
    header: "Logo File",
    enableSorting: false,
    size: 164,
    minSize: 144,
    meta: {
      cellClassName: "align-middle",
      cellContentClassName: "whitespace-normal break-words",
      loadingSkeleton: (
        <Box className="flex items-center">
          <Skeleton className="h-12 w-[100px] rounded-md" />
        </Box>
      ),
    },
    cell: ({ row }) => {
      const item = row.original;

      if (!item?.logo_url) {
        return (
          <Box className="flex items-center min-w-0 break-words text-sm leading-5 text-slate-700">
            -
          </Box>
        );
      }

      return (
        <Box className="flex items-center min-w-0 break-words text-sm leading-5 text-slate-700">
          <a
            href={item.logo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex h-12 w-[100px] items-center"
          >
            <Image
              src={item.logo_url}
              alt={item.name || "Insurance logo"}
              fill
              sizes="100px"
              className="object-contain object-left"
            />
          </a>
        </Box>
      );
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
              className="bg-[#016DA1] hover:bg-[#016DA1]/90 text-white px-3.5 rounded-full h-7 text-[11px] font-semibold"
            >
              Edit
            </Button>
          )}
          {canDelete && (
            <Button
              variant="ghost"
              onClick={() => handleDelete(item.id)}
              className="text-red-600 px-0 h-7 w-7 hover:bg-transparent"
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          )}
        </Box>
      );
    },
  },
];
