import { Column } from "@/components/ui/DataTable";
import { Button } from "@repo/ui";
import { Trash } from "lucide-react";
import Image from "next/image";

export interface ProductCatalogTableData {
  id: string;
  name: string;
  products: {
    name: string;
    insurances: {
      name: string;
      logo_url: string | null;
    };
  };
}

export interface ProductCatalogTableConfigProps {
  page: number;
  rowsPerPage: number;
  onViewDetail: (id: string) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

export const createProductCatalogTableColumns = ({
  page,
  rowsPerPage,
  onViewDetail,
  onDelete,
  canDelete,
}: ProductCatalogTableConfigProps): Column<ProductCatalogTableData>[] => [
  {
    key: "index",
    header: "No.",
    render: (_, index) => (
      <div className="!max-w-16 w-16">
        {(page - 1) * rowsPerPage + index + 1}
      </div>
    ),
  },
  {
    key: "insurer",
    header: "Insurer",
    render: (product) => {
      const logoUrl = product.products.insurances.logo_url || null;
      return (
        <div className="flex gap-2 items-center">
          <div className="inline-flex justify-center items-center w-8 min-w-8 h-8">
            {logoUrl && (
              <Image
                src={logoUrl}
                alt=""
                width={100}
                height={50}
                className="w-full h-auto"
              />
            )}
          </div>
          {product.products.insurances.name}
        </div>
      );
    },
  },
  {
    key: "name",
    header: "Plan Name",
    render: (product) => (
      <div className="min-w-44">
        {product.name.split("|").map((item: string, i: number) => (
          <div key={i}>{item}</div>
        ))}
      </div>
    ),
  },
  {
    key: "product",
    header: "Product",
    render: (product) => <div>{product.products.name}</div>,
  },
  {
    key: "actions",
    header: "Action",
    render: (product) => (
      <div className="flex items-center justify-center gap-2">
        <Button
          size="xs"
          onClick={() => onViewDetail(product.id)}
          className="h-7 rounded-full bg-[#016DA1] px-4 text-[13px] font-medium text-white shadow-none hover:bg-[#015a85]"
        >
          View
        </Button>
        <Button
          variant="ghost"
          size="xs"
          disabled={!canDelete}
          onClick={() => onDelete(product.id)}
          className="h-7 w-7 rounded-md p-0 text-red-600 hover:bg-red-50 hover:!text-red-700"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
