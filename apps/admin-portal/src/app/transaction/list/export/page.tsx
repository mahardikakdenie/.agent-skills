// "use client";
//
// import React from "react";
// import {TransactionExportView} from "@/views/transaction/export/export.view";
//
// export default function TransactionExportPage() {
//     return <TransactionExportView />;
// }

"use client";
import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";
import { ChevronLeft, Download } from "react-feather";
import { Button } from "@/components/ui/button";
import { formatMoney, formatDateTimeWithTZ } from "@/lib/formatter";
import Spinner from "@/components/ui/spinner";
import {useAuth} from "@/context/auth.context";
import { useTransactions } from "@/services/transaction/hooks/queries";

export default function ExportPage() {
    const page = 1;
    const [queryParams, setQueryParams] = useState<Record<string, unknown> | undefined>(undefined);
    const rowsPerPage = 100;
    const [isShowOrderId, setIsShowOrderId] = useState<boolean>(false);
    const [isShowRequestId, setIsShowRequestId] = useState<boolean>(false);
    const [isShowCreatedAt, setIsShowCreatedAt] = useState<boolean>(false);
    const router = useRouter();
    const { permissionList } = useAuth();
    const { data: transactionsResponse, isFetching: isLoading } = useTransactions(
      queryParams,
      { enabled: !!queryParams }
    );
    const data = (((transactionsResponse as any)?.data ?? []) as any[]).filter(
      (item: any) => item.status !== "Draft"
    );

    useEffect(() => {
        const withOrderId = permissionList.includes("Transactions.Export.withOrderId");
        const withRequestId = permissionList.includes("Transactions.Export.withRequestId");
        const withCreatedAt = permissionList.includes("Transactions.Export.withCreatedAt");

        setIsShowOrderId(withOrderId);
        setIsShowRequestId(withRequestId);
        setIsShowCreatedAt(withCreatedAt);
    }, [permissionList]);

    useEffect(() => {
        try {
            const savedData = localStorage.getItem("exportTransactionData");
            if (!savedData) return;

            const parsedData = JSON.parse(savedData);

            setQueryParams({
                page: 1,
                limit: 150,
                type: parsedData.type,
                ...(parsedData.search && { keyword: parsedData.search }),
                ...(parsedData.status &&
                    parsedData.status !== "All" && { status: parsedData.status }),
            });
        } catch (error) {
            console.error("Error preparing export params: ", error);
        }
    }, []);

    const reportTemplateRef = useRef(null);

    const handleGeneratePdf = () => {
        if (!reportTemplateRef.current) {
            console.error("Template element is not found.");
            return;
        }

        const doc = new jsPDF({
            format: "a1",
            unit: "px",
        });
        doc.setFontSize(10);
        doc.setFont("Inter-Regular", "normal");
        doc.html(reportTemplateRef.current, {
            async callback(doc) {
                await doc.save("Transactions.pdf");
            },
            x: 30,
            y: 30,
        });
    };

    const handleGenerateXlsx = () => {
        if (data.length === 0) {
            console.error("No data to export.");
            return;
        }

        const sheetData = data.map((item, index) => {
            const currencies = item?.insurance?.insurance?.currencies;
            const currency = currencies?.find(
                (currency: any) =>
                    currency.currency_from === item.insurance.currency &&
                    currency.currency_to === "IDR"
            );

            const convertedPremium = (currency?.value ?? 1) * item.insurance.premium;

            const premiumWithEmbeddedDiscount =
                item.insurance?.plan?.premium_discount_type === "percentage"
                    ? convertedPremium -
                    (item.insurance?.plan?.premium_discount_value || 0 / 100) *
                    convertedPremium
                    : convertedPremium -
                    (item.insurance?.plan?.premium_discount_value || 0);

            let premiumWithVoucherDiscount = premiumWithEmbeddedDiscount;
            if (item.voucher_info) {
                premiumWithVoucherDiscount =
                    item.voucher_info?.data.value_type === "percentage"
                        ? premiumWithEmbeddedDiscount -
                        (item.voucher_info?.data.value || 0 / 100) *
                        premiumWithEmbeddedDiscount
                        : premiumWithEmbeddedDiscount -
                        (item.voucher_info?.data.value || 0);
            }

            let totalPremium = premiumWithVoucherDiscount;

            if (item.fees) {
                totalPremium =
                    premiumWithVoucherDiscount +
                    item.fees
                        .map((v: any) => v.value)
                        .reduce((a: any, b: any) => a + b, 0);
            }

            let additionColumn = {};
            if (isShowOrderId) {
                let orderId = "";
                if (item.third_party) {
                    if (item.third_party?.provider === "DANA") {
                        orderId = item.third_party?.identifiers?.order_id;
                    }
                }
                additionColumn = {
                    ...additionColumn,
                    "Order Id": orderId,
                }
            }
            if (isShowRequestId) {
                let requestId = "";
                if (item.third_party) {
                    if (item.third_party?.provider === "DANA") {
                        requestId = item.third_party?.identifiers?.request_id;
                    }
                }
                additionColumn = {
                    ...additionColumn,
                    "Request Id": requestId,
                }
            }
            if (isShowCreatedAt) {
                additionColumn = {
                    ...additionColumn,
                    "Created At": formatDateTimeWithTZ(item.created_at),
                }
            }

            return {
                No: (page - 1) * rowsPerPage + index + 1,
                "Insurance Name": item.insurance?.insurance?.id?.name || "-",
                "Plan Name": item.insurance?.plan?.name
                    .split("|")
                    .splice(0, 2)
                    .join(" - "),
                "Customer Name": item.customer.name || "-",
                Currency: item?.insurance.currency || "-",
                Amount: formatMoney(totalPremium, "IDR"),
                Status: item.status || "-",
                ...additionColumn
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

        XLSX.writeFile(workbook, "Transactions.xlsx");
    };

    const styles = {
        table: {
            width: "100%",
            border: "0.5px solid #cccccc",
        },
        th: {
            padding: "10px",
            border: "0.5px solid #cccccc",
            fontWeight: "bold",
            fontSize: "12px",
            height: "auto",
            background: "#e7e7e7",
            verticalAlign: "middle",
        },
        td: {
            padding: "10px",
            height: "auto",
            border: "0.5px solid #cccccc",
            fontSize: "12px",
            verticalAlign: "middle",
        },
    };

    return (
        <div className="flex flex-col w-full p-4 md:p-6 h-screen overflow-auto">
            <div className="flex gap-4 mb-5">
                <h1 className="text-black font-bold text-2xl mt-2">Transactions</h1>
                <div
                    onClick={() => router.back()}
                    className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer mr-4"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </div>

                <Button
                    onClick={handleGeneratePdf}
                    className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full text-xs"
                >
                    <Download className="w-5 h-5 mr-1 " /> Generate PDF
                </Button>

                <Button
                    onClick={handleGenerateXlsx}
                    className="bg-[#41BAF5] text-black hover:bg-[#2d9ae6] rounded-full text-xs"
                >
                    <Download className="w-5 h-5 mr-1 " /> Generate XLSX
                </Button>
            </div>
            <div className="w-full bg-white rounded-lg">
                {isLoading ? (
                    <div className="flex gap-2 flex-col justify-center items-center py-20 text-sm">
                        <Spinner />
                        Loading...
                    </div>
                ) : (
                    <table style={styles.table} ref={reportTemplateRef}>
                        <thead>
                        <tr>
                            <td style={styles.th} valign="middle">No.</td>
                            <td style={styles.th} valign="middle">Insurance Name</td>
                            <td style={styles.th} valign="middle">Plan Name</td>
                            <td style={styles.th} valign="middle">Customer Name</td>
                            <td style={styles.th} valign="middle">Currency</td>
                            <td style={styles.th} valign="middle">Amount</td>
                            <td style={styles.th} valign="middle">Status</td>
                            {isShowOrderId && <td style={styles.th} valign="middle">Order Id</td>}
                            {isShowRequestId && <td style={styles.th} valign="middle">Request Id</td>}
                            {isShowCreatedAt && <td style={styles.th} valign="middle">Created At</td>}
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item, index) => {
                            const rowNumber = (page - 1) * rowsPerPage + index + 1;

                            const currencies = item?.insurance?.insurance?.currencies || [];
                            const currency =
                                currencies.find(
                                    (currency: any) =>
                                        currency.currency_from === item.insurance.currency &&
                                        currency.currency_to === "IDR"
                                ) || 0;

                            const convertedPremium =
                                (currency?.value ?? 1) * item.insurance.premium;

                            const premiumWithEmbeddedDiscount =
                                item?.insurance?.plan?.premium_discount_type === "percentage"
                                    ? convertedPremium -
                                    ((item?.insurance?.plan?.premium_discount_value || 0) /
                                        100) *
                                    convertedPremium
                                    : convertedPremium -
                                    (item?.insurance?.plan?.premium_discount_value || 0);

                            let premiumWithVoucherDiscount = premiumWithEmbeddedDiscount;
                            if (item.voucher_info) {
                                premiumWithVoucherDiscount =
                                    item.voucher_info?.data.value_type === "percentage"
                                        ? premiumWithEmbeddedDiscount -
                                        (item.voucher_info?.data.value || 0 / 100) *
                                        premiumWithEmbeddedDiscount
                                        : premiumWithEmbeddedDiscount -
                                        (item.voucher_info?.data.value || 0);
                            }

                            let totalPremium = premiumWithVoucherDiscount;

                            if (item.fees) {
                                totalPremium =
                                    premiumWithVoucherDiscount +
                                    item.fees
                                        .map((v: any) => v.value)
                                        .reduce((a: any, b: any) => {
                                            return a + b;
                                        }, 0);
                            }

                            let orderId = "";
                            if (item.third_party) {
                                if (item.third_party?.provider === "DANA") {
                                    orderId = item.third_party?.identifiers?.order_id;
                                }
                            }

                            let requestId = "";
                            if (item.third_party) {
                                if (item.third_party?.provider === "DANA") {
                                    requestId = item.third_party?.identifiers?.request_id;
                                }
                            }

                            return (
                                <tr key={item.id}>
                                    <td style={styles.td} valign="middle">{rowNumber}</td>
                                    <td style={styles.td} valign="middle">{item?.insurance?.insurance?.id?.name || "-"}</td>
                                    <td style={styles.td} valign="middle">{item?.insurance?.plan?.name.split("|").splice(0, 2).join(" - ") || "-"}</td>
                                    <td style={styles.td} valign="middle">{item?.customer?.name || "-"}</td>
                                    <td style={styles.td} valign="middle">{item?.insurance?.currency || "-"}</td>
                                    <td style={styles.td} valign="middle">{formatMoney(totalPremium, "IDR")}</td>
                                    <td style={styles.td} valign="middle">{item?.status || "-"}</td>
                                    {isShowOrderId && <td style={styles.td} valign="middle">{orderId || "-"}</td>}
                                    {isShowRequestId && <td style={styles.td} valign="middle">{requestId || "-"}</td>}
                                    {isShowCreatedAt && <td style={styles.td} valign="middle">{formatDateTimeWithTZ(item?.created_at) || "-"}</td>}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
