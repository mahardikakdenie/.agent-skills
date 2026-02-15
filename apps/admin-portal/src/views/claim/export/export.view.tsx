import React, {useEffect, useRef, useState} from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import moment from "moment";
import {useRouter} from "next/navigation";
import {ChevronLeft} from "react-feather";
import {useScreen} from "@/context/screen.context";
import {useAuth} from "@/context/auth.context";
import {claimsService} from "@/services/claims/api/claims.service";
import {getLocalStorage, moneyFormatter, toastNotification} from "@/helpers/app.helper";
import NotFound from "@/components/not-found";
import DownloadIcon from "@/images/download.icon";
import Button from "@/components/button";
import AppURL from "@/constants/app-url.const";

export const ClaimExportView = () => {
    const [data, setData] = useState<any[]>([]);
    const { handleResponseError, user } = useAuth();
    const { isMobileView, setLoading } = useScreen();
    const router = useRouter();
    const reportTemplateRef = useRef(null);
    const channel = user?.channel || undefined;

    useEffect(() => {
        const fetchAllDataClaim = async (page = 1, accumulatedData: any[] = []) => {
            try {
                setLoading(true);
                const filterClaimData = getLocalStorage("filterClaimData");
                const params = {
                    status: filterClaimData.filterStatus,
                    sla_status: filterClaimData.filterSlaStatus,
                    keyword: filterClaimData.filterKeyword,
                    date_from: filterClaimData.filterDateFrom,
                    date_to: filterClaimData.filterDateTo,
                    limit: 100,
                    page,
                    channel
                };
                const response: any = await claimsService.getClaims(params);

                if (response) {
                    const newData = response.data || [];
                    const updatedData= [...accumulatedData, ...newData];
                    setData(updatedData);

                    if (page < response.pageTotal) {
                        await fetchAllDataClaim(page + 1, updatedData);
                    }
                }
            } catch (error) {
                handleResponseError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllDataClaim().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGeneratePdf = () => {
        if (!reportTemplateRef.current) {
            toastNotification("Claim template element is not found!", "error");
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
                await doc.save(`Claim List - ${moment(new Date()).format("lll")}.pdf`);
            },
            x: 30,
            y: 30,
        });
    };

    const forRequestedAmount = (item: any) => {
        const claimValue = item.claim?.find((d: any) => d.type === "Number" && d.name === "claim")?.value;
        const numericValue = Number(claimValue);
        return !isNaN(numericValue) ? moneyFormatter(item.policy_data?.declarations?.transaction_data?.insurance?.currency || undefined).format(numericValue) : "-";
    };

    const handleGenerateXlsx = () => {
        if (data.length === 0) {
            toastNotification("No claim data to export!", "error");
            return;
        }

        const sheetData = data.map((item, index) => ({
            "No": index + 1,
            "Claim ID": item.number || "-",
            "Customer Name": item.policy_data?.policy_holder?.name || "-",
            "Plan Name": item.package?.plan?.name?.split("|").join(" - ") || "-",
            "Benefit": item.benefit?.description_en || "-",
            "Currency": item.policy_data?.declarations?.transaction_data?.insurance?.currency || "IDR",
            "Requested Amount": forRequestedAmount(item),
            "Approved Amount": moneyFormatter(item.policy_data?.declarations?.transaction_data?.insurance?.currency || undefined).format(!!item.amount_approved ? item.amount_approved : 0),
            "Status": item.status || "-",
            "Submission Date": !!item.created_at ? moment(item.created_at).format("LL") : "-",
            "Updated Date": !!item.updated_at ? moment(item.updated_at).format("LL") : "-"
        }));

        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Claim List");
        XLSX.writeFile(workbook, `Claim List - ${moment(new Date()).format("lll")}.xlsx`);
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
                    <p className="font-bold text-lg lg:mt-2">Claim List</p>
                    {isMobileView && (
                        <div onClick={() => router.push(AppURL.claimList)} className="ml-auto items-center flex gap-1 text-red-500 text-sm cursor-pointer">
                            <ChevronLeft className="w-4 h-4"/>
                            Back
                        </div>
                    )}
                </div>
                {!isMobileView && (
                    <div onClick={() => router.push(AppURL.claimList)} className="ml-auto items-center flex gap-1 text-red-500 text-sm cursor-pointer">
                        <ChevronLeft className="w-4 h-4"/>
                        Back
                    </div>
                )}
                <div className="lg:ml-5">
                    <Button additionalClassName="w-full lg:w-fit justify-center lg:justify-between mr-0 mb-3 lg:mb-0" onClick={handleGeneratePdf} variant="warning" withIcon={true} disabled={data.length < 1}>
                        {DownloadIcon(data.length < 1 ? "#FFF" : "#000")}
                        <span className={`ml-1 ${data.length < 1 && "text-white"}`}>Generate PDF</span>
                    </Button>
                </div>
                <div className="mb-5 lg:mb-0 lg:ml-3">
                    <Button additionalClassName="w-full lg:w-fit justify-center lg:justify-between mr-0 mb-3 lg:mb-0" onClick={handleGenerateXlsx} withIcon={true} disabled={data.length < 1}>
                        {DownloadIcon("#FFF")}
                        <span className="ml-1">Generate XLXS</span>
                    </Button>
                </div>
            </div>
            <div className="w-full bg-white rounded-lg">
                {data.length < 1 ? (
                    <div className="flex items-center justify-center bg-white rounded-md py-20 shadow">
                        <NotFound width={isMobileView && "143"} height={isMobileView && "144"} size1={isMobileView && "143"} size3={isMobileView && "95"} viewBox={isMobileView && "0 0 70 70"} text="No claim data available" textClassName={isMobileView && "text-xs"}/>
                    </div>
                ) : (
                    <div className="overflow-x-auto sm:scrollable">
                        <table style={styles.table} ref={reportTemplateRef} border={1}>
                            <thead>
                                <tr>
                                    <td style={styles.th} valign="middle">No.</td>
                                    <td style={styles.th} valign="middle">Claim Number</td>
                                    <td style={styles.th} valign="middle">Customer Name</td>
                                    <td style={styles.th} valign="middle">Plan Name</td>
                                    <td style={styles.th} valign="middle">Benefit</td>
                                    <td style={styles.th} valign="middle">Currency</td>
                                    <td style={styles.th} valign="middle">Requested Amount</td>
                                    <td style={styles.th} valign="middle">Approved Amount</td>
                                    <td style={styles.th} valign="middle">Status</td>
                                    <td style={styles.th} valign="middle">Submission Date</td>
                                    <td style={styles.th} valign="middle">Updated Date</td>
                                </tr>
                            </thead>
                            <tbody>
                            {data.map((item, index) => (
                                <tr key={item.id}>
                                    <td style={styles.td} valign="middle">{index + 1}</td>
                                    <td style={styles.td} valign="middle">
                                        <div className="flex gap-2 items-center">
                                            {item.number || "-"}
                                        </div>
                                    </td>
                                    <td style={styles.td} valign="middle">{item.policy_data?.policy_holder?.name || "-"}</td>
                                    <td style={styles.td} valign="middle">
                                        {item.package?.plan?.name?.split("|").join(" - ") || "-"}
                                    </td>
                                    <td style={styles.td} valign="middle">
                                        {item.benefit?.description_en || "-"}
                                    </td>
                                    <td style={styles.td} valign="middle">
                                        {item.policy_data?.declarations?.transaction_data?.insurance?.currency || "IDR"}
                                    </td>
                                    <td style={styles.td} valign="middle">{forRequestedAmount(item)}</td>
                                    <td style={styles.td} valign="middle">
                                        <div className="flex gap-2 items-center">
                                            {moneyFormatter(item.policy_data?.declarations?.transaction_data?.insurance?.currency || undefined).format(!!item.amount_approved ? item.amount_approved : 0)}
                                        </div>
                                    </td>
                                    <td style={styles.td} valign="middle">{item.status || "-"}</td>
                                    <td style={styles.td} valign="middle">{!!item.created_at ? moment(item.created_at).format("LL") : "-"}</td>
                                    <td style={styles.td} valign="middle">{!!item.updated_at ? moment(item.updated_at).format("LL") : "-"}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
