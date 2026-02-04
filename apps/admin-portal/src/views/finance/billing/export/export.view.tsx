import React, {useEffect, useRef, useState} from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import moment from "moment";
import {useParams, usePathname, useRouter} from "next/navigation";
import {ChevronLeft} from "react-feather";
import {useScreen} from "@/context/screen.context";
import {useAuth} from "@/context/auth.context";
import {financeService} from "@/services/api.service";
import ApiURL from "@/constants/api-url.const";
import {capitalizeString, capitalizeStringWithChar, moneyFormatter, toastNotification} from "@/helpers/app.helper";
import NotFound from "@/components/not-found";
import DownloadIcon from "@/images/download.icon";
import Button from "@/components/button";
import AppURL from "@/constants/app-url.const";

export const FinanceBillingDetailExportView = () => {
    const [data, setData] = useState<any[]>([]);
    const { handleResponseError, user } = useAuth();
    const { isMobileView, setLoading } = useScreen();
    const router = useRouter();
    const path = usePathname();
    const { id } = useParams();
    const reportTemplateRef = useRef(null);

    useEffect(() => {
        const fetchAllDataBilling = async (page = 1, accumulatedData: any[] = []) => {
            try {
                setLoading(true);
                const params = {
                    company: user.channel,
                    pageSize: 100,
                    page
                };
                if (!id) return;
                const response = await financeService.get(ApiURL.billingDetails(id.toString()), { params });

                if (response && response.data) {
                    const newData = response.data.data || [];
                    const updatedData= [...accumulatedData, ...newData];
                    setData(updatedData);

                    if (page < response.data.meta.pageTotal) {
                        await fetchAllDataBilling(page + 1, updatedData);
                    }
                }
            } catch (error) {
                handleResponseError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllDataBilling().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGeneratePdf = (billing_no: string) => {
        if (!reportTemplateRef.current) {
            toastNotification("Billing template element is not found.", "error");
            return;
        }

        const doc = new jsPDF({
            format: "a1",
            unit: "px",
        });
        doc.setFontSize(10);
        doc.setFont("Inter-Regular", "normal");
        doc.html(reportTemplateRef.current, {
            async callback(doc: any) {
                await doc.save(`${billing_no} - ${moment(new Date()).format("lll")}.pdf`);
            },
            x: 30,
            y: 30,
        });
    };

    const handleGenerateXlsx = (billing_no: string) => {
        if (data.length === 0) {
            toastNotification("No billing data to export.", "error");
            return;
        }

        const headerBilling = [
            ["Number", data?.[0]?.billings?.billing_no || "-"],
            ["Total Transaction Amount", !!data?.[0]?.billings?.total ? moneyFormatter().format(data[0].billings.total) : "-"],
            ["Total Commission Amount", !!data?.[0]?.billings?.amount ? moneyFormatter().format(data[0].billings.amount) : "-"],
            ["Billing Date", !!data?.[0]?.billings?.created_at ? moment(data[0].billings.created_at).format("LL") : "-"],
            ["Status", !!data?.[0]?.billings?.status ? capitalizeStringWithChar(data[0].billings.status, "-") : "-"],
            ["Type", !!data?.[0]?.billings?.type ? capitalizeString(data[0].billings.type) : "-"],
            ["Company Name", !!data?.[0]?.billings?.company_name ? data[0].billings.company_name : "-"],
            ["Period", !!data?.[0]?.billings?.transaction_period ? data[0].billings.transaction_period : "-"],
            [],
            []
        ];

        const tableHeader = [
            [
                "No.",
                "Transaction Number",
                "Plan Name",
                "Insurance Company Name",
                "Amount",
                "Transaction Date",
                "Commission Percentage",
                "Commission Amount",
            ],
        ];
        const tableData = data.map((d: any, dIndex: number) => [
            dIndex + 1,
            d.invoice_no || "-",
            d.details?.plan_name || "-",
            d.details?.insurance_name || "-",
            !!d.amount ? moneyFormatter().format(d.amount) : "-",
            !!d.details?.transaction_date ? moment(d.details.transaction_date).format("LL") : "-",
            d.commission_percentage || "0",
            !!d.commission_amount ? moneyFormatter().format(d.commission_amount) : "-"
        ]);

        const sheetData = [...headerBilling, ...tableHeader, ...tableData];

        const ws = XLSX.utils.aoa_to_sheet(sheetData);

        const headerRange = XLSX.utils.decode_range(`A1:B${headerBilling.length}`);
        for (let R = headerRange.s.r; R <= headerRange.e.r; ++R) {
            const cellAddress1 = XLSX.utils.encode_cell({ c: 0, r: R });
            const cellAddress2 = XLSX.utils.encode_cell({ c: 1, r: R });

            if (ws[cellAddress1]) {
                ws[cellAddress1].s = {
                    fill: {
                        fgColor: { rgb: "FF0000" },
                    },
                    font: {
                        bold: true,
                    },
                };
            }

            if (ws[cellAddress2]) {
                ws[cellAddress2].s = {
                    fill: {
                        fgColor: { rgb: "CCCCCC" }
                    },
                    font: {
                        bold: false,
                    },
                };
            }
        }

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Billing Detail");
        XLSX.writeFile(wb, `${billing_no} - ${moment(new Date()).format("lll")}.xlsx`);
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
        <div className="mx-auto py-5 px-7">
            <div className="lg:flex lg:items-center lg:justify-between lg:mb-3">
                <div className="flex items-center justify-between mb-5">
                    <p className="font-bold text-lg lg:mt-2">Billing Detail</p>
                    {isMobileView && (
                        <div onClick={() => router.push(AppURL.policyList)} className="ml-auto items-center flex gap-1 text-red-500 text-sm cursor-pointer">
                            <ChevronLeft className="w-4 h-4"/>
                            Back
                        </div>
                    )}
                </div>
                {!isMobileView && (
                    <div onClick={() => router.push(path.split("/").slice(0, -1).join("/"))} className="ml-auto items-center flex gap-1 text-red-500 text-sm cursor-pointer">
                        <ChevronLeft className="w-4 h-4"/>
                        Back
                    </div>
                )}
                <div className="lg:ml-5">
                    <Button additionalClassName="w-full lg:w-fit justify-center lg:justify-between mr-0 mb-3 lg:mb-0" onClick={() => handleGeneratePdf(data[0].billings.billing_no)} variant="warning" withIcon={true} disabled={data.length < 1}>
                        {DownloadIcon(data.length < 1 ? "#FFF" : "#000")}
                        <span className={`ml-1 ${data.length < 1 && "text-white"}`}>Generate PDF</span>
                    </Button>
                </div>
                <div className="mb-5 lg:mb-0 lg:ml-3">
                    <Button additionalClassName="w-full lg:w-fit justify-center lg:justify-between mr-0 mb-3 lg:mb-0" onClick={() => handleGenerateXlsx(data[0].billings.billing_no)} withIcon={true} disabled={data.length < 1}>
                        {DownloadIcon("#FFF")}
                        <span className="ml-1">Generate XLXS</span>
                    </Button>
                </div>
            </div>
            <div className="w-full bg-white rounded-lg">
                {data.length < 1 ? (
                    <div className="flex items-center justify-center bg-white rounded-md py-20 shadow">
                        <NotFound width={isMobileView && "143"} height={isMobileView && "144"} size1={isMobileView && "143"} size3={isMobileView && "95"} viewBox={isMobileView && "0 0 70 70"} text="No billing data available" textClassName={isMobileView && "text-xs"}/>
                    </div>
                ) : (
                    <div className="p-5 overflow-x-auto sm:scrollable">
                        <table className="w-full" ref={reportTemplateRef}>
                            <thead>
                                <tr>
                                    <td className="pb-5 text-sm">
                                        <table width={500} cellPadding={3} className="table-header">
                                            <tbody>
                                                <tr>
                                                    <td className="pr-5" width={155}>Number</td>
                                                    <td>:</td>
                                                    <td>{data?.[0]?.billings?.billing_no || "-"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="pr-5">Total Transaction Amount</td>
                                                    <td>:</td>
                                                    <td>{!!data?.[0]?.billings?.total ? moneyFormatter().format(data[0].billings.total) : "-"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="pr-5">Total Commission Amount</td>
                                                    <td>:</td>
                                                    <td>{!!data?.[0]?.billings?.amount ? moneyFormatter().format(data[0].billings.amount) : "-"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="pr-5">Billing Date</td>
                                                    <td>:</td>
                                                    <td>{!!data?.[0]?.billings?.created_at ? moment(data[0].billings.created_at).format("LL") : "-"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="pr-5">Status</td>
                                                    <td>:</td>
                                                    <td>{!!data?.[0]?.billings?.status ? capitalizeStringWithChar(data[0].billings.status, "-") : "-"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="pr-5">Type</td>
                                                    <td>:</td>
                                                    <td>{!!data?.[0]?.billings?.type ? capitalizeString(data[0].billings.type) : "-"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="pr-5">Company Name</td>
                                                    <td>:</td>
                                                    <td>{!!data?.[0]?.billings?.company_name ? data[0].billings.company_name : "-"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="pr-5">Period</td>
                                                    <td>:</td>
                                                    <td>{!!data?.[0]?.billings?.transaction_period ? data[0].billings.transaction_period : "-"}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <table style={styles.table}>
                                            <thead>
                                            <tr>
                                                <td style={styles.th}>No.</td>
                                                <td style={styles.th}>Transaction Number</td>
                                                <td style={styles.th}>Plan Name</td>
                                                <td style={styles.th}>Insurance Company Name</td>
                                                <td style={styles.th}>Amount</td>
                                                <td style={styles.th}>Transaction Date</td>
                                                <td style={styles.th}>Commission Percentage</td>
                                                <td style={styles.th}>Commission Amount</td>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {!!data && data.length > 0 && data?.map((d: any, dIndex: number) => {
                                                return (
                                                    <tr key={d.id}>
                                                        <td style={styles.td}>{dIndex + 1}</td>
                                                        <td style={styles.td}>{d.invoice_no || "-"}</td>
                                                        <td style={styles.td}>{d.details?.plan_name || "-"}</td>
                                                        <td style={styles.td}>{d.details?.insurance_name || "-"}</td>
                                                        <td style={styles.td}>{!!d.amount ? moneyFormatter().format(d.amount) : "-"}</td>
                                                        <td style={styles.td}>{!!d.details?.transaction_date ? moment(d.details.transaction_date).format("LL") : "-"}</td>
                                                        <td style={styles.td}>{d.commission_percentage || "0"}</td>
                                                        <td style={styles.td}>{!!d.commission_amount ? moneyFormatter().format(d.commission_amount) : "-"}</td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
