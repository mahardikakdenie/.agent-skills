"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { useBilling } from "@/app/finance/billing/hook";
import { Download, Upload } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  DataTable,
} from "@repo/ui";
import AppURL from "@/constants/app-url.const";
import { PageHeader } from "@/components/page-header";
import { BillingDetailInfo } from "./components/BillingDetailInfo";
import { BillingDetailActions } from "./components/BillingDetailActions";
import {
  BillingDetailItem,
  createBillingDetailTableColumns,
} from "@/components/tableConfig/billingDetailTableConfig";
import { CompactTablePagination } from "@/components/ui/compact-table-pagination";
import { formatDate, formatMoney } from "@/lib/formatter";

let tableMeasureContext: CanvasRenderingContext2D | null = null;

function measureTextWidth(
  label: string,
  font: string,
  fallbackCharWidth: number
) {
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

export default function DetailBillingPage() {
  const { id } = useParams();
  const router = useRouter();

  const {
    billing,
    page,
    rowsPerPage,
    setPage,
    handleRowsPerPageChange,
    isLoadingBilling,
    updateBilling,
    confirmReconciliation,
    refetchBilling,
  } = useBilling({ billingId: id as string });

  const [isUpdating, setIsUpdating] = useState(false);

  const billingDetails = billing?.data?.[0]?.billings;
  const isInsurer = billingDetails?.type === "insurer";
  const billingType = isInsurer ? "Billing" : "Listing";

  const transactionItems = (billing?.data as BillingDetailItem[]) || [];

  const totalItems = billing?.meta?.total || 0;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const hasMatchedReconciliation = transactionItems.some(
    (item) => item.status_reconcilliation === "matched"
  );

  const handleUpdateToPaid = async () => {
    setIsUpdating(true);
    try {
      await updateBilling(id as string, { status: "paid" });
      router.push(AppURL.financeBilling);
    } catch (error) {
      console.error("Failed to update to paid:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = async () => {
    setIsUpdating(true);
    try {
      await updateBilling(id as string, {
        status: "cancelled",
        deleted_at: new Date(),
      });
      router.push(AppURL.financeBilling);
    } catch (error) {
      console.error("Failed to cancel billing:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmReconciliation = async () => {
    setIsUpdating(true);
    try {
      await confirmReconciliation(billingDetails.id);
      await refetchBilling();
    } catch (error) {
      console.error("Failed to confirm reconciliation:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const transactionNumberSize = useMemo(
    () =>
      Math.max(
        160,
        Math.ceil(
          Math.max(
            measureTextWidth("Transaction Number", "500 14px Arial", 8),
            transactionItems.reduce((widest: number, item) => {
              const label = item?.invoice_no || "-";
              return Math.max(
                widest,
                measureTextWidth(label, "400 12px Arial", 7.5)
              );
            }, 0)
          ) + 60
        )
      ),
    [transactionItems]
  );

  const planNameSize = useMemo(
    () =>
      Math.max(
        180,
        Math.ceil(
          Math.max(
            measureTextWidth("Plan Name", "500 14px Arial", 8),
            transactionItems.reduce((widest: number, item) => {
              const label = item?.details?.plan_name || "-";
              const lines = label.split("|");
              const maxLine = lines.reduce(
                (w, line) =>
                  Math.max(w, measureTextWidth(line, "400 13px Arial", 8)),
                0
              );
              return Math.max(widest, maxLine);
            }, 0)
          ) + 60
        )
      ),
    [transactionItems]
  );

  const insuranceNameSize = useMemo(
    () =>
      Math.max(
        200,
        Math.ceil(
          Math.max(
            measureTextWidth("Insurance Company Name", "500 14px Arial", 8),
            transactionItems.reduce((widest: number, item) => {
              const label = item?.details?.insurance_name || "-";
              return Math.max(
                widest,
                measureTextWidth(label, "400 13px Arial", 8)
              );
            }, 0)
          ) + 60
        )
      ),
    [transactionItems]
  );

  const transactionDateSize = useMemo(
    () =>
      Math.max(
        140,
        Math.ceil(
          Math.max(
            measureTextWidth("Transaction Date", "500 14px Arial", 8),
            transactionItems.reduce((widest: number, item) => {
              const label = item?.details?.transaction_date
                ? formatDate(item?.details?.transaction_date, "YYYY-MM-DD")
                : "-";
              return Math.max(
                widest,
                measureTextWidth(label, "400 12px Arial", 7.5)
              );
            }, 0)
          ) + 60
        )
      ),
    [transactionItems]
  );

  const currencySize = useMemo(
    () =>
      Math.max(
        80,
        Math.ceil(
          Math.max(
            measureTextWidth("Currency", "500 14px Arial", 8),
            measureTextWidth(
              billingDetails?.currency || "IDR",
              "400 12px Arial",
              7.5
            )
          ) + 60
        )
      ),
    [billingDetails]
  );

  const premiumSize = useMemo(
    () =>
      Math.max(
        120,
        Math.ceil(
          Math.max(
            measureTextWidth("Premium", "500 14px Arial", 8),
            transactionItems.reduce((widest: number, item) => {
              const label = formatMoney(item?.amount || 0);
              return Math.max(
                widest,
                measureTextWidth(label, "400 12px Arial", 7.5)
              );
            }, 0)
          ) + 60
        )
      ),
    [transactionItems]
  );

  const percentageSize = useMemo(
    () =>
      Math.max(
        60,
        Math.ceil(
          Math.max(
            measureTextWidth("%", "500 14px Arial", 8),
            transactionItems.reduce((widest: number, item) => {
              const label = `${item?.commission_percentage ?? 0}%`;
              return Math.max(
                widest,
                measureTextWidth(label, "400 12px Arial", 7.5)
              );
            }, 0)
          ) + 60
        )
      ),
    [transactionItems]
  );

  const commissionAmountSize = useMemo(
    () =>
      Math.max(
        150,
        Math.ceil(
          Math.max(
            measureTextWidth(
              isInsurer ? "Commission Amount" : "Net Premium",
              "500 14px Arial",
              8
            ),
            transactionItems.reduce((widest: number, item) => {
              const amount = isInsurer
                ? item?.commission_amount || 0
                : (item?.amount || 0) - (item?.commission_amount || 0);
              const label = formatMoney(amount);
              return Math.max(
                widest,
                measureTextWidth(label, "400 12px Arial", 7.5)
              );
            }, 0)
          ) + 60
        )
      ),
    [transactionItems, isInsurer]
  );

  const statusReconciliationSize = useMemo(
    () =>
      Math.max(
        160,
        Math.ceil(
          Math.max(
            measureTextWidth("Status Reconciliation", "500 14px Arial", 8),
            transactionItems.reduce((widest: number, item) => {
              const status = item?.status_reconcilliation || "-";
              const label = status
                .split("-")
                .map(
                  (word: string) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ");
              return Math.max(
                widest,
                measureTextWidth(label, "700 12px Arial", 7.5)
              );
            }, 0)
          ) + 60
        )
      ),
    [transactionItems]
  );

  const columns = useMemo(
    () =>
      createBillingDetailTableColumns({
        type: billingDetails?.type || "insurer",
        currency: billingDetails?.currency || "IDR",
        page,
        rowsPerPage,
        transactionNumberSize,
        planNameSize,
        insuranceNameSize,
        transactionDateSize,
        currencySize,
        premiumSize,
        percentageSize,
        commissionAmountSize,
        statusReconciliationSize,
      }),
    [
      billingDetails,
      page,
      rowsPerPage,
      transactionNumberSize,
      planNameSize,
      insuranceNameSize,
      transactionDateSize,
      currencySize,
      premiumSize,
      percentageSize,
      commissionAmountSize,
      statusReconciliationSize,
    ]
  );

  if (isLoadingBilling) {
    return (
      <Box className="flex items-center justify-center h-screen">
        <Box className="text-lg">Loading billing details...</Box>
      </Box>
    );
  }

  if (!billing?.data?.length || !billingDetails) {
    return (
      <Box className="flex items-center justify-center h-screen">
        <Box className="text-lg">Billing not found</Box>
      </Box>
    );
  }

  return (
    <Box className="flex min-h-0 flex-1 w-full flex-col">
      <PageHeader
        title={`${billingType} Detail`}
        breadcrumbs={[
          { label: "Billing", href: AppURL.financeBilling },
          { label: `${billingType} Detail`, isCurrentPage: true },
        ]}
        showBackButton={true}
        onBackClick={() => router.push(AppURL.financeBilling)}
      >
        {billingDetails?.status === 'pending-reconcilliation' && (
          <Button
            onClick={() =>
              router.push(
                `${AppURL.financeBillingDetail}/${id}/import?type=${billingDetails.type}`,
              )
            }
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
            leftIcon={<Upload className="w-5 h-5" />}
          >
            Import Reconciliation
          </Button>
        )}

        <Button
          onClick={() =>
            router.push(`${AppURL.financeBillingDetail}/${id}/export?type=${billingDetails.type}`)
          }
          className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
          leftIcon={<Download className="w-5 h-5" />}
        >
          Export
        </Button>
      </PageHeader>

      <Box className="flex flex-col flex-1 p-4 md:px-6 md:pt-6 md:pb-3 gap-3">
        <BillingDetailInfo billing={billingDetails} isInsurer={isInsurer} />

        {billingDetails?.status &&
          ['waiting-for-payment', 'pending-reconcilliation'].includes(billingDetails.status) && (
            <BillingDetailActions
              billing={billingDetails}
              isInsurer={isInsurer}
              billingType={billingType}
              hasMatchedReconciliation={hasMatchedReconciliation}
              isUpdating={isUpdating}
              onUpdateToPaid={handleUpdateToPaid}
              onCancel={handleCancel}
              onConfirmReconciliation={handleConfirmReconciliation}
              onViewInvoice={() =>
                router.push(
                  `${AppURL.financeBillingDetail}/${id}/invoice?type=${billingDetails.type}`,
                )
              }
            />
          )}

        <DataTable
          className="!gap-3 pb-2 md:pb-3 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
          loading={isLoadingBilling}
          data={transactionItems}
          columns={columns}
          defaultState={{
            columnPinning: {
              left: ['index', 'invoice_no'],
            },
          }}
          enablePagination={true}
          pagination={{
            pageIndex: page - 1,
            pageSize: rowsPerPage,
            pageCount: totalPages,
            rowCount: totalItems,
            onPageChange: (pageIndex) => {
              if (isLoadingBilling) {
                return;
              }
              setPage(pageIndex + 1);
            },
            onPageSizeChange: (pageSize) => {
              if (isLoadingBilling) {
                return;
              }
              handleRowsPerPageChange({
                target: { value: String(pageSize) },
              } as ChangeEvent<HTMLSelectElement>);
            },
          }}
          pageSizeOptions={[10, 20, 30, 50, 100]}
          renderPagination={(table) => (
            <Box className="-mt-1">
              <CompactTablePagination
                table={table}
                pageSizeOptions={[10, 20, 30, 50, 100]}
                disabled={isLoadingBilling}
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
            getRowId: (row, index) => (row as any)?.id || `billing-row-${index}`,
          }}
        />
      </Box>
    </Box>
  );
  }
