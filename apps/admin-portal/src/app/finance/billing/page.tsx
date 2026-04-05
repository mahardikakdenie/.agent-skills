"use client";

import { useMemo } from "react";
import { Plus } from "react-feather";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  MonthPicker,
  Box,
  Button,
  DataTable,
} from "@repo/ui";

import { useBilling } from "./hook";
import { formatMoney, formatDate } from "@/lib/formatter";
import AppURL from "@/constants/app-url.const";
import { createBillingTableColumns } from "@/components/tableConfig/billingTableConfig";
import { CompactTablePagination } from "@/components/ui/compact-table-pagination";

let tableMeasureContext: CanvasRenderingContext2D | null = null;

function measureTextWidth(label: string, font: string, fallbackCharWidth: number) {
  if (typeof document === "undefined") {
    return label.length * fallbackCharWidth;
  }

  if (!tableMeasureContext) {
    tableMeasureContext = document.createElement("canvas").getContext("2d");
  }

  if (!tableMeasureContext) {
    return label.length * fallbackCharWidth;
  }

  tableMeasureContext.font = font;

  return tableMeasureContext.measureText(label).width;
}

export default function BillingPage() {
  const router = useRouter();

  const {
    billings,
    categories,
    channels,
    insurances,
    totalItems,
    totalAmount,
    totalPages,
    page,
    rowsPerPage,
    searchType,
    searchChannel,
    searchCategory,
    date,
    isLoadingBillings,
    isFetchingBillings,
    setPage,
    handleRowsPerPageChange,
    handleTypeChange,
    handleChannelChange,
    handleCategoryChange,
    handleDateChange,
  } = useBilling();

  const companies = searchType === "insurer" ? insurances : channels;

  const types = [
    { name: "Partner", code: "partner" },
    { name: "Insurer", code: "insurer" },
  ];

  const handleViewDetail = (id: string, channel: string, type: string) => {
    router.push(
      `${AppURL.financeBillingDetail}/${id}?channel=${channel}&type=${type}`
    );
  };

  const handleViewInvoice = (id: string, type: string, channel: string) => {
    router.push(
      `${AppURL.financeBillingDetail}/${id}/invoice?type=${type}&channel=${channel}`
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-[#00AB4F]";
      case "pending":
        return "text-[#CC9B36]";
      default:
        return "text-[#CC9B36]";
    }
  };

  const billingNoColumnSize = useMemo(
    () =>
      Math.min(
        240,
        Math.max(
          160,
          Math.ceil(
            Math.max(
              measureTextWidth("Billing No.", "500 14px Arial", 7.2),
              billings.reduce((widest, billing) => {
                const label = billing?.billing_no || "-";
                return Math.max(widest, measureTextWidth(label, "500 14px Arial", 7.2));
              }, 0),
            ) + 35,
          ),
        ),
      ),
    [billings]
  );

  const billingDateColumnSize = useMemo(
    () =>
      Math.max(
        110,
        Math.ceil(
          Math.max(
            measureTextWidth("Billing Date", "500 14px Arial", 6.8),
            billings.reduce((widest, billing) => {
              const bDate = billing?.created_at
                ? formatDate(billing.created_at, "YYYY-MM-DD")
                : "-";
              return Math.max(widest, measureTextWidth(bDate, "400 12px Arial", 6.1));
            }, 0),
          ) + 24,
        ),
      ),
    [billings]
  );

  const categoryColumnSize = useMemo(
    () =>
      Math.max(
        120,
        Math.ceil(
          Math.max(
            measureTextWidth("Category", "500 14px Arial", 7.2),
            billings.reduce((widest, billing) => {
              const label = categories.find((c) => c.id === billing.category)?.name || "-";
              return Math.max(widest, measureTextWidth(label, "600 12px Arial", 6.2));
            }, 0),
          ) + 28,
        ),
      ),
    [billings, categories]
  );

  const currencyColumnSize = useMemo(
    () =>
      Math.min(
        120,
        Math.ceil(
          Math.max(
            measureTextWidth("Currency", "500 14px Arial", 7.2),
            billings.reduce((widest, billing) => {
              const label = billing?.currency || "IDR";
              return Math.max(widest, measureTextWidth(label, "600 12px Arial", 6.2));
            }, 0),
          ) + 28,
        ),
      ),
    [billings]
  );

  const amountColumnSize = useMemo(
    () =>
      Math.min(
        240,
        Math.ceil(
          Math.max(
            measureTextWidth("Amount", "500 14px Arial", 6.8),
            billings.reduce((widest, billing) => {
              const amountValue = searchType === "insurer" ? billing.amount : billing.total - billing.amount;
              const label = formatMoney(amountValue);
              return Math.max(widest, measureTextWidth(label, "400 13px Arial", 6.6));
            }, 0),
          ) + 28,
        ),
      ),
    [billings, searchType]
  );

  const statusColumnSize = useMemo(
    () =>
      Math.min(
        200,
        Math.ceil(
          Math.max(
            measureTextWidth("Status", "500 14px Arial", 6.8),
            billings.reduce((widest, billing) => {
              const status = billing?.status || "-";
              const label = status
                .split("-")
                .map(
                  (word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
                )
                .join(" ");
              return Math.max(widest, measureTextWidth(label, "600 10px Arial", 5.9));
            }, 0),
          ) + 48,
        ),
      ),
    [billings]
  );

  const actionColumnSize = useMemo(
    () =>
      Math.max(
        96,
        Math.ceil(
          Math.max(
            measureTextWidth("Action", "500 14px Arial", 6.8),
            measureTextWidth("View Detail", "600 11px Arial", 5.9) + 32,
          ) + 12,
        ),
      ),
    []
  );

  const columns = createBillingTableColumns({
    page,
    rowsPerPage,
    searchType,
    searchCategory,
    categories,
    onViewDetail: handleViewDetail,
    onViewInvoice: handleViewInvoice,
    searchChannel,
    getStatusColor,
    billingNoColumnSize,
    billingDateColumnSize,
    categoryColumnSize,
    currencyColumnSize,
    amountColumnSize,
    statusColumnSize,
    actionColumnSize,
  });

  const isPaginationBusy = isLoadingBillings || isFetchingBillings;

  return (
    <Box className="flex min-h-0 flex-1 w-full flex-col p-4 md:p-6 gap-3">
      <Box className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-start lg:justify-between">
        <Box as="h1" className="text-black font-bold text-2xl shrink-0">
          Billing List
        </Box>

        <Box className="flex w-full flex-col gap-2.5 lg:w-auto lg:items-end">
          <Box className="flex w-full flex-col gap-2.5 sm:grid sm:grid-cols-2 sm:gap-3 lg:w-auto lg:flex lg:flex-row lg:flex-wrap lg:justify-end">
            <Box className="w-full xl:w-[200px] relative">
              <MonthPicker
                value={date}
                onChange={handleDateChange}
                placeholder="Select Period"
                clearable
                className="w-full"
              />
            </Box>

            <Box className="w-full xl:w-36">
              <Select value={searchType} onValueChange={handleTypeChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {types.map((item, index) => (
                      <SelectItem key={index} value={item.code}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Box>

            <Box className="w-full xl:w-48">
              <Select value={searchChannel} onValueChange={handleChannelChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies.map((item, index) => (
                      <SelectItem key={index} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Box>

            <Box className="w-full xl:w-48">
              <Select
                disabled={!searchChannel}
                value={searchCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={"All"} key={-1}>
                      All Category
                    </SelectItem>
                    {categories.map((item, index) => (
                      <SelectItem key={index} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Box>
          </Box>

          <Box className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 lg:w-auto">
            <Button
              onClick={() => router.push(AppURL.financeBillingAdd)}
              className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full h-10 px-5 gap-1.5"
              leftIcon={<Plus className="w-5 h-5" />}
            >
              Create Billing
            </Button>
          </Box>
        </Box>
      </Box>

      <Box className="text-right text-black mt-1 -mb-1.5 font-medium">
        {"Total: IDR " + formatMoney(totalAmount)}
      </Box>

      <DataTable
        className="!gap-3 pb-4 md:pb-6 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        loading={isPaginationBusy}
        data={billings}
        columns={columns}
        defaultState={{
          columnPinning: {
            left: ["id", "billingNo"],
            right: ["status", "action"],
          },
        }}
        pagination={{
          pageIndex: page - 1,
          pageSize: rowsPerPage,
          pageCount: totalPages,
          rowCount: totalItems,
          onPageChange: (pageIndex) => {
            if (isPaginationBusy) {
              return;
            }
            setPage(pageIndex + 1);
          },
          onPageSizeChange: (pageSize) => {
            if (isPaginationBusy) {
              return;
            }
            handleRowsPerPageChange({
              target: { value: String(pageSize) },
            } as React.ChangeEvent<HTMLSelectElement>);
          },
        }}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        renderPagination={(table) => (
          <Box className="-mt-1">
            <CompactTablePagination
              table={table}
              pageSizeOptions={[10, 20, 30, 50, 100]}
              disabled={isPaginationBusy}
            />
          </Box>
        )}
        tableOptions={{
          manualPagination: true,
          enableColumnPinning: true,
          enableColumnResizing: true,
          defaultColumn: {
            minSize: 48,
            size: 96,
          },
          getRowId: (row, index) => row?.id || `billing-row-${index}`,
        }}
      />
    </Box>
  );
}
