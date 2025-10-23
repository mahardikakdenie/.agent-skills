import { formatMoney } from "@/lib/formatter";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drewer";
import { X } from "react-feather";
import Image from "next/image";
import { Column } from "../ui/DataTable";

interface CreateTransactionTableColumnsProps {
  page: number;
  rowsPerPage: number;
  canEdit: boolean;
  onUpdateToPaid: (id: string) => void;
  isLoadingUpdateStatus: boolean;
  getStatusColor: (status: string) => string;
  calculateTotalPremium: (transaction: any) => number;
}

export const createTransactionTableColumns = ({
  page,
  rowsPerPage,
  canEdit,
  onUpdateToPaid,
  isLoadingUpdateStatus,
  getStatusColor,
  calculateTotalPremium,
}: CreateTransactionTableColumnsProps): Column<any>[] => [
  {
    key: "id",
    header: "No.",
    render: (_, index) => (page - 1) * rowsPerPage + index + 1,
  },
  {
    key: "insurance.insurance.id.name",
    header: "Insurance Name",
    render: (transaction) => {
      return (
        <div className="flex gap-2 items-center">
          <div className="inline-flex justify-center items-center w-8 min-w-8 h-8">
            <Image
              src={
                transaction?.insurance?.insurance?.id?.logo_url ||
                "/images/no-image.png"
              }
              alt=""
              width={100}
              height={50}
            />
          </div>
          {transaction?.insurance?.insurance?.id?.name || "-"}
        </div>
      );
    },
  },
  {
    key: "insurance.plan.name",
    header: "Plan Name",
    render: (transaction) => {
      return (
        <div>
          {transaction?.insurance?.plan?.name
            ?.split("|")
            .splice(0, 2)
            .join(" - ") || "-"}
        </div>
      );
    },
  },
  {
    key: "customer.name",
    header: "Customer Name",
    render: (transaction) => {
      return <div>{transaction?.customer?.name || "-"}</div>;
    },
  },
  {
    key: "insurance.currency",
    header: "Currency",
    render: (transaction) => {
      return <div>{transaction?.insurance?.currency || "-"}</div>;
    },
  },
  {
    key: "amount",
    header: "Amount",
    render: (transaction) => {
      const totalPremium = calculateTotalPremium(transaction);
      return (
        <div className="whitespace-nowrap">
          {formatMoney(Number(totalPremium) || 0, "IDR") || "-"}
        </div>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    render: (transaction) => {
      return (
        <div className="font-semibold whitespace-nowrap">
          <span className={getStatusColor(transaction?.status)}>
            {transaction?.status}
          </span>
        </div>
      );
    },
  },
  {
    key: "action",
    header: "Action",
    render: (transaction) => {
      const totalPremium = calculateTotalPremium(transaction);

      return (
        <Drawer direction="right">
          <DrawerTrigger className="bg-[#016DA1] text-white px-4 py-2 rounded-full">
            View
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerClose className="absolute right-2 top-2">
                <Button variant="ghost">
                  <X />
                </Button>
              </DrawerClose>
              <DrawerTitle className="text-black font-bold text-2xl">
                Transaction Details
              </DrawerTitle>
              <DrawerDescription>
                <div className="flex flex-col w-full p-4 md:p-6 bg-[#F8F8F8] mt-5 rounded-xl">
                  <div className="rounded-lg flex flex-col gap-4 text-black">
                    <div className="flex gap-2 text-sm font-medium justify-start text-start">
                      <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">
                        Insurance Name
                      </div>
                      <div className="max-w-1 w-1">:</div>
                      <div>
                        {transaction?.insurance?.insurance?.id?.name || "-"}
                      </div>
                    </div>
                    <div className="flex gap-2 text-sm font-medium justify-start text-start">
                      <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">
                        Plan Name
                      </div>
                      <div className="max-w-1 w-1">:</div>
                      <div>{transaction?.insurance?.plan?.name || "-"}</div>
                    </div>
                    <div className="flex gap-2 text-sm font-medium justify-start text-start">
                      <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">
                        Customer Name
                      </div>
                      <div className="max-w-1 w-1">:</div>
                      <div>{transaction?.customer?.name || "-"}</div>
                    </div>
                    <div className="flex gap-2 text-sm font-medium justify-start text-start">
                      <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">
                        Amount
                      </div>
                      <div className="max-w-1 w-1">:</div>
                      <div>
                        {formatMoney(Number(totalPremium) || 0, "IDR") || "-"}
                      </div>
                    </div>
                    <div className="flex gap-2 text-sm font-medium justify-start text-start">
                      <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">
                        Status
                      </div>
                      <div className="max-w-1 w-1">:</div>
                      <div className="text-warning font-semibold">
                        <span className={getStatusColor(transaction?.status)}>
                          {transaction?.status}
                        </span>
                      </div>
                    </div>
                    {transaction?.status.toLowerCase() === "pending" && (
                      <div className="mt-4">
                        <Button
                          onClick={() => onUpdateToPaid(transaction?.id)}
                          disabled={!canEdit || isLoadingUpdateStatus}
                          className="bg-primary text-white px-4 py-2 rounded-full"
                        >
                          {isLoadingUpdateStatus
                            ? "Updating..."
                            : "Update to Paid"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      );
    },
  },
];
