"use client";

import { useState } from "react";
import { useBilling } from "@/app/finance/billing/hook";
import { ChevronLeft, Download, Upload } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import AppURL from "@/constants/app-url.const";
import { BillingDetailInfo } from "./components/BillingDetailInfo";
import { BillingDetailActions } from "./components/BillingDetailActions";
import { DataTable } from "@/components/ui/DataTable";
import { createBillingDetailTableColumns } from "@/components/tableConfig/billingDetailTableConfig";

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

  const transactionItems = billing?.data || [];

  const totalItems = billing?.meta?.total || 0;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const hasMatchedReconciliation = transactionItems.some(
    (item: any) => item.status_reconcilliation === "matched"
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

  const columns = createBillingDetailTableColumns({
    type: billingDetails?.type || "insurer",
    currency: billingDetails?.currency || "IDR",
  });

  if (isLoadingBilling) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading billing details...</div>
      </div>
    );
  }

  if (!billing?.data?.length || !billingDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Billing not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="bg-white md:px-6 p-4 flex items-center">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={AppURL.financeBilling}>
                  Billing
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{billingType} Detail</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
            {billingType} Detail
          </h2>
        </div>

        <div className="flex space-x-4 ml-auto">
          <div
            onClick={() => router.push(AppURL.financeBilling)}
            className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </div>

          {billingDetails?.status === "pending-reconcilliation" && (
            <Button
              onClick={() =>
                router.push(
                  `${AppURL.financeBillingDetail}/${id}/import?type=${billingDetails.type}`
                )
              }
              className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
            >
              <Upload className="w-5 h-5 mr-1" /> Import Reconciliation
            </Button>
          )}

          <Button
            onClick={() =>
              router.push(
                `${AppURL.financeBillingDetail}/${id}/export?type=${billingDetails.type}`
              )
            }
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
          >
            <Download className="w-5 h-5 mr-1" /> Export
          </Button>
        </div>
      </div>

      <BillingDetailInfo billing={billingDetails} isInsurer={isInsurer} />

      {billingDetails?.status &&
        ["waiting-for-payment", "pending-reconcilliation"].includes(
          billingDetails.status
        ) && (
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
                `${AppURL.financeBillingDetail}/${id}/invoice?type=${billingDetails.type}`
              )
            }
          />
        )}

      <div className="p-4 md:p-6 m-5 bg-white rounded-lg">
        <DataTable
          data={transactionItems}
          columns={columns}
          loading={isLoadingBilling}
          pagination={{
            page,
            totalPages,
            rowsPerPage,
            totalItems,
            onPageChange: setPage,
            onRowsPerPageChange: handleRowsPerPageChange,
          }}
          className="table-claims"
        />
      </div>
    </div>
  );
}
