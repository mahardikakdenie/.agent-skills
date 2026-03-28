import { Button } from "@repo/ui";
import { Column } from "@/components/ui/DataTable";
import type { PackageDto } from "@/services/product/api/product.types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui";
import { Trash } from "react-feather";
import { formatCurrency } from "@/components/forms/product-catalog/package.form";

export interface PackageTableConfigProps {
  page: number;
  rowsPerPage: number;
  canEdit: boolean;
  canDelete: boolean;
  productConfig: any;
  category: string;
  planId: string;
  onEdit: (packageId: string) => void;
  onDelete: (packageId: string) => Promise<void>;
}

export const createPackageTableColumns = ({
  page,
  rowsPerPage,
  canEdit,
  canDelete,
  productConfig,
  category,
  planId,
  onEdit,
  onDelete,
}: PackageTableConfigProps): Column<PackageDto>[] => {
  const columns: Column<PackageDto>[] = [
    {
      key: "index",
      header: "No.",
      render: (_, index) => (page - 1) * rowsPerPage + index + 1,
    },
  ];

  if (productConfig?.search_configs) {
    Object.keys(productConfig.search_configs).forEach((configKey) => {
      const config = productConfig.search_configs[configKey];
      const header = configKey
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      columns.push({
        key: configKey,
        header,
        render: (pkg) => {
          if (config.type === "range") {
            const from = pkg.search_params[`${configKey}_from`];
            const to = pkg.search_params[`${configKey}_to`];
            return `${from ?? "-"} - ${to ?? "-"}`;
          }

          const value = pkg.search_params[configKey];

          if (Array.isArray(value)) {
            return value.join(", ");
          } else if (value !== undefined && value !== null) {
            return String(value);
          } else {
            return "-";
          }
        },
      });
    });
  }

  columns.push(
    {
      key: "currency",
      header: "Currency",
    },
    {
      key: "premium",
      header: "Premium",
      render: (pkg) => formatCurrency(pkg.premium.toString()),
    },
    {
      key: "action",
      header: "Action",
      render: (pkg) => (
        <div className="flex gap-x-2">
          <TooltipProvider>
            <Tooltip>
              <Button
                type="button"
                variant="default"
                className="rounded-full"
                disabled={!canEdit}
                onClick={() => onEdit(pkg.id)}
              >
                Edit
              </Button>
              <TooltipContent sideOffset={4}>
                <p className="text-sm">Edit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={!canDelete}
                  onClick={async () => {
                    if (confirm("Are you sure to delete this row?")) {
                      await onDelete(pkg.id);
                      alert("Row deleted successfully.");
                    }
                  }}
                >
                  <Trash className="w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={4}>
                <p className="text-sm">Remove</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    }
  );

  return columns;
};