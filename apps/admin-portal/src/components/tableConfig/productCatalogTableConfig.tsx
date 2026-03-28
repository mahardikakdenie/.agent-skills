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
      <div className="flex gap-4 items-center w-20">
        <Button
          variant="secondary"
          onClick={() => onViewDetail(product.id)}
          className="bg-[#016DA1] hover:bg-[#016DA1] text-white px-4 rounded-full"
        >
          View
        </Button>
        <Button
          variant="ghost"
          onClick={() => onDelete(product.id)}
          disabled={!canDelete}
          className="text-red-600 px-0"
        >
          <Trash />
        </Button>
      </div>
    ),
  },
];